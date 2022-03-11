import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

//door textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/Normal.jpg');
const doorAmbientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');

//Roof textures
let mulRoof = 1.25;
let xRoof = 3 * mulRoof;
let yRoof = 2 * mulRoof;
const RoofColorTexture = textureLoader.load('/textures/roof/stylized_cracked_wood_planks_basecolor.jpg');
RoofColorTexture.wrapS = THREE.RepeatWrapping;
RoofColorTexture.wrapT = THREE.RepeatWrapping;
RoofColorTexture.repeat.set(xRoof, yRoof)

const RoofMetalnessTexture = textureLoader.load('/textures/roof/stylized_cracked_wood_planks_metallic.jpg');
RoofMetalnessTexture.wrapS = THREE.RepeatWrapping;
RoofMetalnessTexture.wrapT = THREE.RepeatWrapping;
RoofMetalnessTexture.repeat.set(xRoof, yRoof);


const RoofRoughnessTexture = textureLoader.load('/textures/roof/stylized_cracked_wood_planks_roughness.jpg');
RoofRoughnessTexture.wrapS = THREE.RepeatWrapping;
RoofRoughnessTexture.wrapT = THREE.RepeatWrapping;
RoofRoughnessTexture.repeat.set(xRoof, yRoof);


const RoofNormalTexture = textureLoader.load('/textures/roof/stylized_cracked_wood_planks_normal.jpg');
RoofNormalTexture.wrapS = THREE.RepeatWrapping;
RoofNormalTexture.wrapT = THREE.RepeatWrapping;
RoofNormalTexture.repeat.set(xRoof, yRoof);

const RoofAmbientTexture = textureLoader.load('/textures/roof/stylized_cracked_wood_planks_ambientOcclusion.jpg');
RoofAmbientTexture.wrapS = THREE.RepeatWrapping;
RoofAmbientTexture.wrapT = THREE.RepeatWrapping;
RoofAmbientTexture.repeat.set(xRoof, yRoof);



//wall textures

let mulWall = 1.25;
let xWall = 3 * mulWall;
let yWall = 2 * mulWall;
const wallColorTexture = textureLoader.load('/textures/Brique/BrickWall_basecolor.jpg');
wallColorTexture.wrapS = THREE.RepeatWrapping;
wallColorTexture.wrapT = THREE.RepeatWrapping;
wallColorTexture.repeat.set(xWall, yWall);

const wallMetalnessTexture = textureLoader.load('/textures/Brique/BrickWall_metallic.jpg');
wallMetalnessTexture.wrapS = THREE.RepeatWrapping;
wallMetalnessTexture.wrapT = THREE.RepeatWrapping;
wallMetalnessTexture.repeat.set(xWall, yWall);

const wallRoughnessTexture = textureLoader.load('/textures/Brique/BrickWall_roughness.jpg');
wallRoughnessTexture.wrapS = THREE.RepeatWrapping;
wallRoughnessTexture.wrapT = THREE.RepeatWrapping;
wallRoughnessTexture.repeat.set(xWall, yWall);

const wallNormalTexture = textureLoader.load('/textures/Brique/BrickWall_normal.jpg');
wallNormalTexture.wrapS = THREE.RepeatWrapping;
wallNormalTexture.wrapT = THREE.RepeatWrapping;
wallNormalTexture.repeat.set(xWall, yWall);

const wallAmbientTexture = textureLoader.load('/textures/Brique/BrickWall_ambientOcclusion.jpg');
wallAmbientTexture.wrapS = THREE.RepeatWrapping;
wallAmbientTexture.wrapT = THREE.RepeatWrapping;
wallAmbientTexture.repeat.set(xWall, yWall);

const wallHeightTexture = textureLoader.load('/textures/Brique/BrickWall_height.jpg');
wallHeightTexture.wrapS = THREE.RepeatWrapping;
wallHeightTexture.wrapT = THREE.RepeatWrapping;
wallHeightTexture.repeat.set(xWall, yWall);

//grass textures

let mulGrass = 8;
let xGrass = 1 * mulGrass;
let yGrass = 1 * mulGrass;

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassColorTexture.repeat.set(xGrass, yGrass);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.repeat.set(xGrass, yGrass);
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.repeat.set(xGrass, yGrass);
const grassAmbientTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
grassAmbientTexture.wrapS = THREE.RepeatWrapping;
grassAmbientTexture.wrapT = THREE.RepeatWrapping;
grassAmbientTexture.repeat.set(xGrass, yGrass);
/*
Materials
*/
const materialWalls = new THREE.MeshStandardMaterial({
    map : wallColorTexture,
    aoMap : wallAmbientTexture,
    // displacementMap : wallHeightTexture,
    // displacementScale : 0.05,
    normalMap : wallNormalTexture,
    normalScale : new THREE.Vector2(0.4, 0.4),
    roughnessMap :wallRoughnessTexture,
    metalnessMap : wallMetalnessTexture
});

const materialRoof = new THREE.MeshStandardMaterial({
    map : RoofColorTexture,
    aoMap : RoofAmbientTexture,
    normalMap : RoofNormalTexture,
    roughnessMap : RoofRoughnessTexture,
    metalnessMap : RoofMetalnessTexture,
});

const materialDoor = new THREE.MeshStandardMaterial({
    map : doorColorTexture,
    transparent : true,
    alphaMap : doorAlphaTexture,
    aoMap : doorAmbientTexture,
    displacementMap : doorHeightTexture,
    displacementScale : 0.1,
    normalMap : doorNormalTexture,
    roughnessMap : doorMetalnessTexture,
    metalnessMap : doorRoughnessTexture,
});

const materialGrass = new THREE.MeshStandardMaterial({
    map : grassColorTexture,
    aoMap : grassAmbientTexture,
    // displacementMap : wallHeightTexture,
    // displacementScale : 0.05,
    normalMap : grassNormalTexture,
    normalScale : new THREE.Vector2(0.4, 0.4),
    roughnessMap : grassRoughnessTexture
});


//House
const house = new THREE.Group();
scene.add(house);


//walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(5, 2.5, 5, 100, 100),
    materialWalls
);
walls.position.y = 2.5 / 2;
walls.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

house.add(walls);

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.75, 1.5, 4),
    materialRoof
);
roof.position.y = 3.25;
roof.rotation.y = Math.PI / 4;
roof.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
);

house.add(roof);

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 50, 50),
    materialDoor
)
door.position.set(0, 1, 2.501);
door.scale.set(1.2, 1.2, 1.2)
door.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

house.add(door);

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const materialBush = new THREE.MeshStandardMaterial({ color : '#89c854' });

const bush1 = new THREE.Mesh(
    bushGeometry,
    materialBush
);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.2, 0.2, 2.7);

const bush2 = new THREE.Mesh(
    bushGeometry,
    materialBush
);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.8, 0., 2.6);


const bush3 = new THREE.Mesh(
    bushGeometry,
    materialBush
);
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 1.2, 0.1, 2.6)

const bush4 = new THREE.Mesh(
    bushGeometry,
    materialBush
);
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1.4, 0.05, 3)

house.add(bush1, bush2, bush3, bush4);

//Graves
const graves = new THREE.Group();
scene.add(graves);


const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const materialGrave = new THREE.MeshStandardMaterial({ color : '#b2b6b1'});

for(let i = 0; i < 50; i++)
{
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 4 + Math.random() * 6     // Random radius

    const x = Math.cos(angle) * radius        // Get the x position using cosinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus

    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, materialGrave)

    let y = Math.random() * 0.4;
    // Position
    grave.position.set(x, y, z)                              

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true;
    // Add to the graves container
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(21, 21),
    materialGrass
);

floor.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, - 2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001);
scene.add(moonLight);

//Door light
const doorLight = new THREE.PointLight('#ff7d46', 1.5, 8);
doorLight.position.set(0, 2.5, 2.7);

house.add(doorLight);

//Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#ffffff', 2, 3);
const ghost3 = new THREE.PointLight('blue', 2, 3);

scene.add(ghost1,ghost2,ghost3);

/* 
    Fog
*/
const fog = new THREE.Fog('#262837', 2, 20);

scene.fog = fog;

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837');

/* 
    Shadows
*/
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true




floor.receiveShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// ...

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// ...

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

// ...

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

// ...

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

// ...
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    const angleGhost1 = elapsedTime * 0.5;
    
    ghost1.position.x = Math.cos(angleGhost1) * 4;
    ghost1.position.z = Math.sin(angleGhost1) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const angleGhost2 = - elapsedTime * 0.32;
    
    ghost2.position.x = Math.cos(angleGhost2) * 5;
    ghost2.position.z = Math.sin(angleGhost2) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const angleGhost3 =  elapsedTime * 0.4;
    
    ghost3.position.x = Math.cos(angleGhost3) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(angleGhost3) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()