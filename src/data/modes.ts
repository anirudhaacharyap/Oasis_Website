// Mock content: replace with real club data. See src/data/types.ts.
import type { Mode } from "./types";

export const modes: Mode[] = [
    {
        id: "esports",
        word: "ESPORTS",
        line: "Campus rosters that scrim all semester and travel to inter-college cups.",
        items: ["Valorant and BGMI rosters", "Weekly scrims", "Inter-college cups"],
        button: "A",
        mock: true,
    },
    {
        id: "gamedev",
        word: "GAMEDEV",
        line: "Members build small games, mods and tools, then ship them to people who play.",
        items: ["Godot and Unity projects", "Monthly game jams", "Playtest sessions"],
        button: "B",
        mock: true,
    },
    {
        id: "workshops",
        word: "WORKSHOPS",
        line: "Hands-on sessions where you leave with something running on your own laptop.",
        items: ["Intro to Godot", "Pixel art with Aseprite", "Shader basics"],
        button: "X",
        mock: true,
    },
    {
        id: "lan",
        word: "LAN",
        line: "Bring a machine, plug in, and play with the rest of the campus in one room.",
        items: ["Monthly LAN nights", "Casual Rocket League and EA FC", "Open Minecraft server"],
        button: "Y",
        mock: true,
    },
];
