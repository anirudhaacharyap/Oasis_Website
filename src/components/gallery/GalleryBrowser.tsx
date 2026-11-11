"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/data/types";
import SampleBadge from "@/components/ui/SampleBadge";

const TILES = ["#9FA8FF", "#F6B6C8", "#9EE6CF", "#FFF1A8", "#C9C3F5"];

export default function GalleryBrowser({ photos }: { photos: GalleryPhoto[] }) {
    const albums = useMemo(() => ["All", ...Array.from(new Set(photos.map((photo) => photo.album)))], [photos]);
    const [album, setAlbum] = useState("All");
    const shown = album === "All" ? photos : photos.filter((photo) => photo.album === album);

    return (
        <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Albums">
                {albums.map((name) => {
                    const selected = album === name;
                    return (
                        <button
                            key={name}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setAlbum(name)}
                            className={`rounded-lg border-2 border-ink px-3 py-2 font-pixel text-[10px] tracking-wider ${
                                selected ? "bg-accent-lavender text-ink" : "bg-white text-ink-soft"
                            }`}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>

            {shown.length === 0 ? (
                <p className="mt-10 text-ink-soft">No photos in this album yet.</p>
            ) : (
                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((photo, index) => (
                        <li key={`${photo.album}-${photo.caption}-${index}`}>
                            <figure className="pixel-card cv-auto overflow-hidden">
                                {photo.src ? (
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt || photo.caption}
                                        width={photo.width ?? 800}
                                        height={photo.height ?? 600}
                                        className="aspect-[4/3] w-full object-cover"
                                    />
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        className="flex aspect-[4/3] items-end p-4"
                                        style={{
                                            background: `repeating-linear-gradient(0deg, ${TILES[index % TILES.length]} 0 12px, #ffffff 12px 24px)`,
                                        }}
                                    >
                                        <span className="rounded-md border-2 border-ink bg-white px-2 py-1 font-pixel text-[10px] text-ink">
                                            Photo coming
                                        </span>
                                    </div>
                                )}
                                <figcaption className="flex items-start justify-between gap-3 px-4 py-4">
                                    <span>
                                        <span className="block text-ink">{photo.caption}</span>
                                        <span className="mt-1 block text-sm text-ink-soft">{photo.album}</span>
                                    </span>
                                    <SampleBadge show={photo.sample} />
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
