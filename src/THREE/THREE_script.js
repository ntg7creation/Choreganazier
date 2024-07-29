import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GolobalGUI } from "./GUI";
import { torofluxmesh, axisHelper } from "./toroFlux";

/**
 * gui
 */
const gui = GolobalGUI;

/**
 * Base
 */
// Canvas
export const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
//

// axis
// const axisHelper = new THREE.AxesHelper(1);
scene.add(axisHelper);

//beziertoroflux

scene.add(torofluxmesh);

/**
 * Lights
 *
 */

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(0, 2, 2);
gui.add(sun, "intensity").min(0).max(10).step(0.01).name("Sun lightIntensity");
scene.add(sun);

const directionalLight = new THREE.DirectionalLight(0x2222ff, 1);
directionalLight.position.set(5, -1, -1);
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.01)
  .name("blue lightIntensity");
scene.add(directionalLight);

// const ambientLight = new THREE.AmbientLight();
// scene.add(ambientLight);

// const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0xffffff, 100);
// hemisphereLight.position.set(0, 1, 3);
// gui.add(hemisphereLight, "intensity").min(0).max(10).step(0.01).name("Hemisphere lightIntensity");
// scene.add(hemisphereLight);

// const width = 10;
// const height = 10;
// const intensity = 10;
// const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
// rectLight.position.set(5, 5, 0);
// rectLight.lookAt(torofluxmesh.position);
// scene.add(rectLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/**
 * Events
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
