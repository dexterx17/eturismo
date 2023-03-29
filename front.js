import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let canvas = document.querySelector('.webgl');

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

alert(sizes.height)
window.addEventListener('resize', () => {
    console.log('resized');
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //update aspce caemra
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()

    //update renderer 
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})

// Camera
const fov = 75; //degrees
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.01, 100);
camera.position.z = 8;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
//controls.enabled = false;
controls.enableDamping = true;
// controls.target.y = 2;
// controls.update();

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

// Time
const clock = new THREE.Clock();
const tick = () => {

    // Time
    const elapsedTime = clock.getElapsedTime();

    controls.update();
    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick()