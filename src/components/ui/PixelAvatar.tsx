import Image from "next/image";
import type { Accent } from "@/data/types";
import { accentColors } from "@/data/site";

/** Photo avatar, or a pixel tile with initials when no photo is set. */
export default function PixelAvatar({
    name,
    photo,
    accent = "purple",
    size = 112,
}: {
    name: string;
    photo?: string;
    accent?: Accent;
    size?: number;
}) {
    const colors = accentColors[accent];
    if (photo) {
        return (
            <Image
                src={photo}
                alt={name}
                width={size}
                height={size}
                className="rounded-lg border-2 border-ink object-cover"
                style={{ width: size, height: size }}
            />
        );
    }
    const initials = name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return (
        <div
            aria-hidden="true"
            className="rounded-lg border-2 border-ink flex items-center justify-center font-pixel text-ink"
            style={{
                width: size,
                height: size,
                fontSize: size / 4.5,
                background: `repeating-linear-gradient(0deg, ${colors.fill} 0 8px, ${colors.fill}cc 8px 16px)`,
                boxShadow: `inset -4px -4px 0 ${colors.ink}40`,
            }}
        >
            {initials}
        </div>
    );
}
