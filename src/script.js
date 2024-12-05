import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Group } from "three/examples/jsm/libs/tween.module.js";
import { Sky } from "three/examples/jsm/Addons.js";

/**
 * textures
 */
function loadTexture() {
    const textureLoader = new THREE.TextureLoader();
    return function (path) {
        const texture = textureLoader.load(
            path,
            _ => {},
            _ => {},
            err => {
                throw new Error("failed to load the texture: " + path);
            }
        );

        return texture;
    };
}
const textureLoader = loadTexture();

// Floor Textures
const floorAlphaTexture = textureLoader("/floor/alpha.webp");
const floorColorTexture = textureLoader("/floor/color.webp");
const floorARMTexture = textureLoader("/floor/ARM.webp");
const floorNormalTexture = textureLoader("/floor/normal.jpg");
const floorDisplacementTexture = textureLoader("/floor/displacement.webp");

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
// Walls Textures
const wallsColorTexture = textureLoader("/walls/color.webp");
const wallsARMTexture = textureLoader("/walls/ARM.webp");
const wallsNormalTexture = textureLoader("/walls/normal.jpg");

wallsColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof textures
const roofColorTexture = textureLoader("/roof/color.webp");
const roofARMTexture = textureLoader("/roof/ARM.webp");
const roofNormalTexture = textureLoader("/roof/normal.jpg");

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
// roofColorTexture.wrapT = THREE.RepeatWrapping

roofARMTexture.repeat.set(3, 1);
roofARMTexture.wrapS = THREE.RepeatWrapping;
// roofARMTexture.wrapT = THREE.RepeatWrapping

roofNormalTexture.repeat.set(3, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
// roofNormalTexture.wrapT = THREE.RepeatWrapping

// Bushes
const bushesColorTexture = textureLoader("/bushes/color.webp");
const bushesARMTexture = textureLoader("/bushes/ARM.webp");
const bushesNormalTexture = textureLoader("/bushes/normal.jpg");

bushesColorTexture.colorSpace = THREE.SRGBColorSpace;

bushesColorTexture.repeat.set(2, 1);
bushesColorTexture.wrapS = THREE.RepeatWrapping;
// bushesColorTexture.wrapT = THREE.RepeatWrapping

bushesARMTexture.repeat.set(2, 1);
bushesARMTexture.wrapS = THREE.RepeatWrapping;
// bushesARMTexture.wrapT = THREE.RepeatWrapping

bushesNormalTexture.repeat.set(2, 1);
bushesNormalTexture.wrapS = THREE.RepeatWrapping;
// // bushesNormalTexture.wrapT = THREE.RepeatWrapping

// Graves
const graveColorTexture = textureLoader("/grave/color.webp");
const graveARMTexture = textureLoader("/grave/ARM.webp");
const graveNormalTexture = textureLoader("/grave/normal.jpg");

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorAlphaTexture = textureLoader("/door/alpha.webp");
const doorColorTexture = textureLoader("/door/color.webp");
const doorAOTexture = textureLoader("/door/ambientOcclusion.webp");
const doorHeightTexture = textureLoader("/door/height.webp");
const doorMetalnessTexture = textureLoader("/door/metalness.webp");
const doorNormalTexture = textureLoader("/door/normal.jpg");
const doorRoughnessTexture = textureLoader("/door/roughness.webp");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial()
);
// walls textures

walls.material.map = wallsColorTexture;
walls.material.aoMap = wallsARMTexture;
walls.material.aoMapIntensity = 2;
walls.material.roughnessMap = wallsARMTexture;
walls.material.metalnessMap = wallsARMTexture;
walls.material.normalMap = wallsNormalTexture;

walls.position.y = 0.5 * 2.5;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4, 32),
    new THREE.MeshStandardMaterial()
);
roof.material.map = roofColorTexture;
roof.material.aoMap = roofARMTexture;
roof.material.roughnessMap = roofARMTexture;
roof.material.metalnessMap = roofARMTexture;
roof.material.normalMap = roofNormalTexture;

roof.rotation.y = Math.PI / 4;
roof.position.y = 2.5 + 1.5 / 2;
house.add(roof);

// door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial()
);
door.material.map = doorColorTexture;
door.material.transparent = true;
door.material.alphaMap = doorAlphaTexture;

door.material.aoMap = doorAOTexture;
door.material.aoMapIntensity = 1.3;
door.material.roughnessMap = doorRoughnessTexture;
door.material.metalnessMap = doorMetalnessTexture;
door.material.normalMap = doorNormalTexture;
door.material.displacementMap = doorHeightTexture;
door.material.displacementScale = 0.2;
door.material.displacementBias = -0.06;

gui.add(door.material, "displacementScale").min(0).max(5).step(0.01);
gui.add(door.material, "displacementBias").min(-1).max(1).step(0.01);

door.position.set(0, 0.5 * 2.2 - 0.2, 2.01);
house.add(door);
/**
 * floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial()
);
// set up textures
floor.material.transparent = true;
floor.material.alphaMap = floorAlphaTexture;
floor.material.map = floorColorTexture;
floor.material.aoMap = floorARMTexture;
floor.material.roughnessMap = floorARMTexture;
floor.material.metalnessMap = floorARMTexture;
floor.material.normalMap = floorNormalTexture;
floor.material.aoMapIntensity = 2;
floor.material.displacementMap = floorDisplacementTexture;
floor.material.displacementBias = -0.2;
floor.material.displacementScale = 0.3;
// gui.add(floor.material,"displacementScale").min(0).max(20).step(.5)
gui.add(floor.material, "displacementBias").min(-5).max(5).step(0.01);

floor.rotation.x = -Math.PI * 0.5;
floor.material.side = THREE.DoubleSide;
scene.add(floor);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#ccffcc" });
bushMaterial.map = bushesColorTexture;
bushMaterial.aoMap = bushesARMTexture;
bushMaterial.roughnessMap = bushesARMTexture;
bushMaterial.metalnessMap = bushesARMTexture;
bushMaterial.normalMap = bushesNormalTexture;

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.rotation.x = -0.75;
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.setScalar(0.25); // the replacement is .setScalar(.5) to the scale if they all have the same value
bush2.rotation.x = -0.75;
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.scale.setScalar(0.4);
bush3.rotation.x = -0.75;
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.setScalar(0.15);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#777" });

graveMaterial.map = graveColorTexture;
graveMaterial.aoMap = graveARMTexture;
graveMaterial.roughnessMap = graveARMTexture;
graveMaterial.metalnessMap = graveARMTexture;
graveMaterial.normalMap = graveNormalTexture;

for (let i = 0; i < 30; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    const angle = 2 * Math.PI * Math.random();
    const radius = Math.random() * 6 + 3;
    grave.position.x = Math.sin(angle) * radius;
    grave.position.z = Math.cos(angle) * radius;
    grave.position.y = Math.random() * 0.4;

    grave.rotation.x = (Math.random() - 0.5) * (Math.PI / 8);
    grave.rotation.y = (Math.random() - 0.5) * (Math.PI / 8);
    grave.rotation.z = (Math.random() - 0.5) * (Math.PI / 8);
    graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// PointLight
const pointLight = new THREE.PointLight("#ff7d45", 5, 5);
pointLight.position.set(0, 2.2, 2.5);

scene.add(pointLight);

/**
 * Ghosts
 */
const ghosts = new THREE.Group();
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
ghosts.add(ghost1, ghost2, ghost3);
scene.add(ghosts);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * FOG
 */
// scene.fog = new THREE.Fog("#02343f",1,40)
scene.fog = new THREE.FogExp2("#02343f",0.1)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 *  Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
roof.castShadow = true;

graves.children.forEach(grave => {
    grave.castShadow = true;
    grave.receiveShadow = true;
});

walls.receiveShadow = true;
floor.receiveShadow = true;

// mapping
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.mapSize.width = 512 / 2;
directionalLight.shadow.mapSize.height = 512 / 2;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;

for (const ghost of ghosts.children) {
    ghost.shadow.camera.far = 10;
    ghost.shadow.mapSize.width = 512 / 2;
    ghost.shadow.mapSize.height = 512 / 2;
}

/**
 * SKY
 */
const sky = new Sky();
sky.scale.setScalar(100)
const uniforms = sky.material.uniforms
uniforms["turbidity"].value = 10;
uniforms["rayleigh"].value = 3;
uniforms["mieCoefficient"].value = .1;
uniforms["mieDirectionalG"].value = .95;
uniforms["sunPosition"].value.set(.3,-.038,-.95)
scene.add(sky);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.sin(ghost1Angle) * 4;
    ghost1.position.z = Math.cos(ghost1Angle) * 4;
    ghost1.position.y =
        Math.sin(ghost1Angle) *
        Math.sin(ghost1Angle * 2.43) *
        Math.sin(ghost1Angle * 3.45);

    const ghost2Angle = -elapsedTime * 0.38;
    ghost2.position.x = Math.sin(ghost2Angle) * 5;
    ghost2.position.z = Math.cos(ghost2Angle) * 5;
    ghost2.position.y =
        Math.sin(ghost2Angle) *
        Math.sin(ghost2Angle * 2.43) *
        Math.sin(ghost2Angle * 3.45);

    const ghost3Angle = elapsedTime * 0.65;
    ghost3.position.x = Math.sin(ghost3Angle) * 7;
    ghost3.position.z = Math.cos(ghost3Angle) * 7;
    ghost3.position.y =
        Math.sin(ghost3Angle) *
        Math.sin(ghost3Angle * 2.43) *
        Math.sin(ghost3Angle * 3.45);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
