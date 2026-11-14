/**
 * helloOverlay.ts — temporary Milestone 0 overlay.
 *
 * It proves that HTML overlays render above the Babylon canvas.
 * It will be removed when the real screens arrive in Milestone 3.
 */

/** Creates the "Hello SAERG" panel and adds it to the UI layer. */
export function showHelloOverlay(uiRoot: HTMLElement): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel hello-overlay";

  const label = document.createElement("span");
  label.className = "hello-label";
  label.textContent = "Milestone 0 · scaffold";

  const heading = document.createElement("h1");
  heading.textContent = "Hello SAERG";

  const text = document.createElement("p");
  text.textContent = "Day One at Nexora: the 3D engine and the UI layer are running.";

  panel.append(label, heading, text);
  uiRoot.append(panel);
  return panel;
}

/** Shown instead of the game when the browser cannot start WebGL (Section 8.9). */
export function showWebGLError(uiRoot: HTMLElement): void {
  const panel = document.createElement("section");
  panel.className = "panel hello-overlay";
  panel.setAttribute("role", "alert");

  const heading = document.createElement("h1");
  heading.textContent = "This game needs WebGL";

  const text = document.createElement("p");
  text.textContent =
    "Please open this page in a recent version of Chrome, Edge or Firefox on a laptop or desktop.";

  panel.append(heading, text);
  uiRoot.append(panel);
}
