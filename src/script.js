import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector4() },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
material.uniforms.uResolution.value.x = sizes.width;
material.uniforms.uResolution.value.y = sizes.height;
let imageAspectRatio = 5472 / 3648;
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    if (sizes.width / sizes.height > 1) {
        mesh.scale.x = camera.aspect;
    } else {
        mesh.scale.y = 1 / camera.aspect;
    }

    let a1; let a2;

    if (sizes.height / sizes.width > imageAspectRatio) {
        a1 = (sizes.width / sizes.height) * imageAspectRatio;
        a2 = 1;
    } else {
        a1 = 1;
        a2 = (sizes.height / sizes.width) / imageAspectRatio;
    }
    material.uniforms.uResolution.value.x = sizes.width;
    material.uniforms.uResolution.value.y = sizes.height;
    material.uniforms.uResolution.value.z = a1;
    material.uniforms.uResolution.value.w = a2;

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const dist = camera.position.z;
const height = 1;
camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

if (sizes.width / sizes.height > 1) {
    mesh.scale.x = camera.aspect;
} else {
    mesh.scale.y = 1 / camera.aspect;
}

camera.updateProjectionMatrix();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();

    // Update uniforms
    material.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();