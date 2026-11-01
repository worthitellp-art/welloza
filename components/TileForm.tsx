"use client";

import { useActionState } from "react";
import { createTile, updateTile, type FormState } from "@/app/admin/actions";
import { categories, colours } from "@/lib/data";

type Values = { id: string; name: string; category: string; collection: string; colour: string; finish: string };

const start: FormState = { error: "", saved: false };

export function TileForm({ tile }: { tile?: Values }) {
  const [state, action, pending] = useActionState(tile ? updateTile : createTile, start);
  const uid = tile?.id ?? "new";

  return (
    <form className="admin-form" action={action} key={state.saved && !tile ? "saved" : "editing"}>
      {tile && <input type="hidden" name="id" value={tile.id} />}
      <div className="field">
        <label htmlFor={`${uid}-name`}>Tile name</label>
        <input id={`${uid}-name`} name="name" required maxLength={80} defaultValue={tile?.name} />
      </div>
      <div className="field">
        <label htmlFor={`${uid}-category`}>Category</label>
        <select id={`${uid}-category`} name="category" required defaultValue={tile?.category ?? ""}>
          <option value="" disabled>
            Choose a category
          </option>
          {Object.entries(categories).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${uid}-collection`}>Collection</label>
        <input id={`${uid}-collection`} name="collection" required maxLength={60} defaultValue={tile?.collection} />
      </div>
      <div className="field">
        <label htmlFor={`${uid}-colour`}>Colour</label>
        <select id={`${uid}-colour`} name="colour" required defaultValue={tile?.colour ?? ""}>
          <option value="" disabled>
            Choose a colour
          </option>
          {colours.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${uid}-finish`}>Finish</label>
        <input id={`${uid}-finish`} name="finish" required maxLength={40} defaultValue={tile?.finish ?? "Glossy"} />
      </div>
      <div className="field">
        <label htmlFor={`${uid}-image`}>{tile ? "Replace tile image (optional)" : "Tile image"}</label>
        <input id={`${uid}-image`} name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!tile} />
      </div>
      <div className="field">
        <label htmlFor={`${uid}-room`}>{tile ? "Replace room photo (optional)" : "Room photo (optional)"}</label>
        <input id={`${uid}-room`} name="room" type="file" accept="image/jpeg,image/png,image/webp" />
      </div>
      <p className="admin-note">JPG, PNG or WebP, up to 10 MB each.</p>
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Saving..." : tile ? "Save changes" : "Upload tile"}
      </button>
      <p className={state.error ? "admin-error" : "admin-saved"} role="status">
        {state.error || (state.saved ? "Saved." : "")}
      </p>
    </form>
  );
}
