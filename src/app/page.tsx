import StartScreen from "@/components/scenes/StartScreen";
import Origin from "@/components/scenes/Origin";
import WhatWeDo from "@/components/scenes/WhatWeDo";
import Events from "@/components/scenes/Events";
import Collabs from "@/components/scenes/Collabs";
import Victory from "@/components/scenes/Victory";

export const revalidate = 86400;

export default function Home() {
    return (
        <main id="main" tabIndex={-1}>
            <StartScreen />
            <Origin />
            <WhatWeDo />
            <Events />
            <Collabs />
            <Victory />
        </main>
    );
}
