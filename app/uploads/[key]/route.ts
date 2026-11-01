import { getBindings } from "@/lib/tiles";

const types: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(_req: Request, { params }: RouteContext<"/uploads/[key]">) {
  const { key } = await params;
  const match = /^[0-9a-f-]{36}\.(jpg|png|webp)$/.exec(key);
  if (!match) return new Response("Not found", { status: 404 });

  const { bucket } = await getBindings();
  const object = await bucket.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": types[match[1]],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
