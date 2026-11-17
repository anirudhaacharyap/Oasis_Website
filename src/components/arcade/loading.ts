/**
 * Real loading state for the boot loader, reported by the arcade as it gets there:
 *   fonts  the type is ready
 *   scene  the 3D code has arrived and the scene is mounted
 *   ready  every shader is compiled and the first frame is drawn (the 2D arcade is ready at once)
 * The arcade's own power-on waits for the loader to finish (afterLoader), so it plays on screen.
 */
export type Stage = "fonts" | "scene" | "ready";

export const loading = { fonts: false, scene: false, ready: false, done: false };

const waiters: (() => void)[] = [];

export function mark(stage: Stage) {
    loading[stage] = true;
}

/** Run once the loader has gone (at once if it already has, or never showed). */
export function afterLoader(fn: () => void) {
    if (loading.done) fn();
    else waiters.push(fn);
}

export function finishLoader() {
    if (loading.done) return;
    loading.done = true;
    waiters.splice(0).forEach((fn) => fn());
}
