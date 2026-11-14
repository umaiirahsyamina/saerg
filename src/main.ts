/**
 * main.ts — entry point. Runs once when the page loads.
 *
 * 1. Find the canvas and the UI layer in index.html.
 * 2. Start the Babylon.js engine and create the scene.
 * 3. Start the render loop (draws one frame, many times per second).
 * 4. Show the Milestone 0 "Hello SAERG" overlay.
 */
import { Engine } from "@babylonjs/core/Engines/engine";

import "./styles/main.css";
import { DEBUG_FLAGS } from "./config";
import { createScene } from "./world/createScene";
import { showHelloOverlay, showWebGLError } from "./ui/helloOverlay";

/** Looks up an element by id and stops with a clear error if index.html is missing it. */
function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`index.html is missing the #${id} element`);
  }
  return element as T;
}

function start(): void {
  const canvas = getRequiredElement<HTMLCanvasElement>("game-canvas");
  const uiRoot = getRequiredElement<HTMLDivElement>("ui-root");

  let engine: Engine;
  try {
    // "true" switches on antialiasing (smoother edges).
    engine = new Engine(canvas, true);
  } catch (error) {
    // The browser could not create a WebGL context (very old browser or disabled GPU).
    console.error("[SAERG] WebGL is unavailable:", error);
    showWebGLError(uiRoot);
    return;
  }

  const scene = createScene(engine);

  // Draw the scene every frame, and keep the canvas sharp when the window is resized.
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());

  showHelloOverlay(uiRoot);

  if (DEBUG_FLAGS.debug) {
    console.info("[SAERG] Debug mode is on (the debug panel arrives in Milestone 2).");
  }
}

start();
