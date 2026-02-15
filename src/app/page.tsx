import ScrollEngine from "@/components/ScrollEngine";
import NavIsland from "@/components/NavIsland";
import StartScreen from "@/components/scenes/StartScreen";
import Origin from "@/components/scenes/Origin";
import WhatWeDo from "@/components/scenes/WhatWeDo";
import Events from "@/components/scenes/Events";
import Collabs from "@/components/scenes/Collabs";
import Victory from "@/components/scenes/Victory";

export default function Home() {
  return (
    <ScrollEngine>
      {/* <NavIsland /> */}
      <main>
        <div id="start"><StartScreen /></div>
        <div id="origin"><Origin /></div>
        <div id="whatwedo"><WhatWeDo /></div>
        <div id="events"><Events /></div>
        <div id="collabs"><Collabs /></div>
        <div id="victory"><Victory /></div>
      </main>
    </ScrollEngine>
  );
}
