"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { clearTileCache, getBindings, tileFields } from "@/lib/tiles";
import { revalidatePath } from "next/cache";

export type FormState = { error: string; saved: boolean };

const MAX_BYTES = 10 * 1024 * 1024;
const id = z.string().min(1).max(120);

// The browser-reported type and file name are ignored: only the file's own bytes decide.
function detectImage(bytes: Uint8Array) {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.subarray(from, to));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (ascii(1, 4) === "PNG" && bytes[0] === 0x89 && bytes[4] === 0x0d && bytes[5] === 0x0a) return { ext: "png", type: "image/png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", type: "image/webp" };
  return null;
}

async function readImage(value: FormDataEntryValue | null, label: string) {
  if (!(value instanceof File) || value.size === 0) return { file: null, error: "" };
  if (value.size > MAX_BYTES) return { file: null, error: `${label} must be 10 MB or smaller.` };
  const bytes = new Uint8Array(await value.arrayBuffer());
  const kind = detectImage(bytes);
  if (!kind) return { file: null, error: `${label} must be a JPG, PNG or WebP image.` };
  return { file: { bytes, ...kind, key: `${crypto.randomUUID()}.${kind.ext}` }, error: "" };
}

const fieldsFrom = (form: FormData) =>
  tileFields.safeParse({
    name: form.get("name"),
    category: form.get("category"),
    collection: form.get("collection"),
    colour: form.get("colour"),
    finish: form.get("finish"),
  });

function refresh() {
  clearTileCache();
  revalidatePath("/", "layout");
}

export async function createTile(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const fields = fieldsFrom(form);
  if (!fields.success) return { error: fields.error.issues[0].message, saved: false };

  const image = await readImage(form.get("image"), "Tile image");
  if (image.error) return { error: image.error, saved: false };
  if (!image.file) return { error: "Choose a tile image.", saved: false };
  const room = await readImage(form.get("room"), "Room photo");
  if (room.error) return { error: room.error, saved: false };

  const { db, bucket } = await getBindings();
  const stored = [image.file, ...(room.file ? [room.file] : [])];
  try {
    await Promise.all(
      stored.map((f) => bucket.put(f.key, f.bytes, { httpMetadata: { contentType: f.type } })),
    );
    const f = fields.data;
    await db
      .prepare(
        "INSERT INTO tiles (id, name, category, collection, colour, finish, image_key, room_key, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
      )
      .bind(crypto.randomUUID(), f.name, f.category, f.collection, f.colour, f.finish, image.file.key, room.file?.key ?? null, new Date().toISOString())
      .run();
  } catch (err) {
    console.error("Tile upload failed", err);
    await bucket.delete(stored.map((f) => f.key)).catch((cleanup) => console.error("Upload cleanup failed", cleanup));
    return { error: "The tile could not be saved. Please try again.", saved: false };
  }
  refresh();
  return { error: "", saved: true };
}

export async function updateTile(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const tileId = id.safeParse(form.get("id"));
  const fields = fieldsFrom(form);
  if (!tileId.success) return { error: "This tile no longer exists.", saved: false };
  if (!fields.success) return { error: fields.error.issues[0].message, saved: false };

  const image = await readImage(form.get("image"), "Tile image");
  if (image.error) return { error: image.error, saved: false };
  const room = await readImage(form.get("room"), "Room photo");
  if (room.error) return { error: room.error, saved: false };

  const { db, bucket } = await getBindings();
  const current = await db
    .prepare("SELECT image_key, room_key FROM tiles WHERE id = ?1")
    .bind(tileId.data)
    .first<{ image_key: string; room_key: string | null }>();
  if (!current) return { error: "This tile no longer exists.", saved: false };

  const added = [image.file, room.file].filter((f) => f !== null);
  try {
    await Promise.all(added.map((f) => bucket.put(f.key, f.bytes, { httpMetadata: { contentType: f.type } })));
    const f = fields.data;
    await db
      .prepare(
        "UPDATE tiles SET name = ?1, category = ?2, collection = ?3, colour = ?4, finish = ?5, image_key = ?6, room_key = ?7 WHERE id = ?8",
      )
      .bind(f.name, f.category, f.collection, f.colour, f.finish, image.file?.key ?? current.image_key, room.file?.key ?? current.room_key, tileId.data)
      .run();
  } catch (err) {
    console.error("Tile update failed", err);
    await bucket.delete(added.map((f) => f.key)).catch((cleanup) => console.error("Upload cleanup failed", cleanup));
    return { error: "The tile could not be saved. Please try again.", saved: false };
  }

  const replaced = [image.file && current.image_key, room.file && current.room_key].filter((k) => typeof k === "string");
  if (replaced.length) await bucket.delete(replaced).catch((err) => console.error("Old image cleanup failed", err));
  refresh();
  return { error: "", saved: true };
}

export async function deleteTile(form: FormData) {
  await requireAdmin();
  const tileId = id.parse(form.get("id"));
  const { db, bucket } = await getBindings();
  const row = await db
    .prepare("DELETE FROM tiles WHERE id = ?1 RETURNING image_key, room_key")
    .bind(tileId)
    .first<{ image_key: string; room_key: string | null }>();
  if (row) await bucket.delete(row.room_key ? [row.image_key, row.room_key] : [row.image_key]);
  refresh();
}

export async function setTileHidden(form: FormData) {
  await requireAdmin();
  const tileId = id.parse(form.get("id"));
  const hide = z.enum(["0", "1"]).parse(form.get("hide")) === "1";
  const { db } = await getBindings();
  const statement = hide
    ? "INSERT OR IGNORE INTO hidden_tiles (id) VALUES (?1)"
    : "DELETE FROM hidden_tiles WHERE id = ?1";
  await db.prepare(statement).bind(tileId).run();
  refresh();
}
