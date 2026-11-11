import type { TeamMember } from "./types";

/**
 * TODO(content): real names, roles and photos.
 * Put photos in /public/team/ and reference them as "/team/<file>.jpg".
 * Without a photo, a pixel avatar with the member's initials is shown.
 */
export const facultyCoordinators: TeamMember[] = [
    { name: "Faculty Name", role: "Faculty Coordinator", accent: "lavender", sample: true },
];

export const coreTeam: TeamMember[] = [
    { name: "Member Name", role: "President", accent: "purple", sample: true },
    { name: "Member Name", role: "Vice President", accent: "pink", sample: true },
    { name: "Member Name", role: "Esports Lead", accent: "mint", sample: true },
    { name: "Member Name", role: "Game Dev Lead", accent: "yellow", sample: true },
    { name: "Member Name", role: "Design Lead", accent: "lavender", sample: true },
    { name: "Member Name", role: "Events & Outreach", accent: "purple", sample: true },
];
