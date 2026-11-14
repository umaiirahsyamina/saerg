/**
 * createScene.ts — builds the Babylon.js scene.
 *
 * Milestone 0: an empty scene (background colour + a camera) so we can prove the
 * engine runs. The office, player controller and interactables arrive in Milestone 1.
 *
 * Imports use deep paths (e.g. "@babylonjs/core/scene") rather than "@babylonjs/core".
 * This lets Vite "tree-shake" the library: only the parts we use end up in the download.
 */
import type { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

/** Creates the (currently empty) game scene. */
export function createScene(engine: Engine): Scene {
  const scene = new Scene(engine);

  // Same colour as the UI background (#0F1419), so the page looks seamless.
  scene.clearColor = Color4.FromHexString("#0F1419FF");

  // A scene needs a camera before it can render. Eye height is about 1.6 m.
  const camera = new FreeCamera("playerCamera", new Vector3(0, 1.6, 0), scene);
  camera.setTarget(new Vector3(0, 1.6, 1));

  return scene;
}
