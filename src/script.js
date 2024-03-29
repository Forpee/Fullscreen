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
const geometry = new THREE.PlaneBufferGeometry(1, 1, 128, 128);

let a1; let a2;
// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        direction: { value: 0 },
        speed: { value: 0 },
        uResolution: { value: new THREE.Vector4() },
        uMouse: { value: new THREE.Vector2() },
        progress: { value: 0 },
        uTexture: { value: new THREE.TextureLoader().load('/beauty.jpg') }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    // wireframe: true
});
let mouse = new THREE.Vector2();
let prevMouse = new THREE.Vector2();
// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
document.addEventListener('mousedown', () => {
    material.uniforms.direction.value = 0;
    gsap.to(material.uniforms.progress, {
        duration: 0.5,
        value: 1,
    });
});
// event listener for mouse up event
document.addEventListener('mouseup', () => {
    material.uniforms.direction.value = 1;
    gsap.to(material.uniforms.progress, {
        duration: 0.5,
        value: 0,
    });
});

document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth);
    mouse.y = 1 - (e.clientY / window.innerHeight);
    material.uniforms.uMouse.value = mouse;

    // get speed of mousemove
    const speed = mouse.distanceTo(prevMouse);
    // console.log(speed);
    // if (speed > 0.01) {
    //     material.uniforms.direction.value = 1;
    // }
    prevMouse.copy(mouse);
    // update material uniforms
    material.uniforms.speed.value = speed;

});
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

let imageAspectRatio = 3648 / 5472;
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