import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import GalleryBrowser from "@/components/gallery/GalleryBrowser";
import { gallery } from "@/data/gallery";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Photos from OASIS LAN nights, game jams, tournaments and workshops at NMIT.",
};

export default function GalleryPage() {
    return (
        <main id="main" tabIndex={-1}>
            <PageHeader
                eyebrow="Gallery"
                title="From the room"
                intro="LAN nights, jams, brackets and workshops. These frames are placeholders until real photos are added."
            />
            <GalleryBrowser photos={gallery} />
        </main>
    );
}
