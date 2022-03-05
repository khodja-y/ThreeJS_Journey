import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
 const textureLoader = new THREE.TextureLoader();

 const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
 const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
 const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
 const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
 const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
 const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
 const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
 const matcapTexture = textureLoader.load('/textures/matcaps/9.jpg');
 const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

 const cubeTextureLoader = new THREE.CubeTextureLoader()

 const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
 ])

/**
 * Debug
 */
 const gui = new GUI({width : 400});
 gui.close();
 gui.add( document, 'title' );

 

/* Objects
 */

const material = new THREE.MeshBasicMaterial();
// Texture
// material.map = doorColorTexture;
// Colors
material.color = new THREE.Color("#ff0000");
material.transparent = true;
material.opacity = 1;
material.side = THREE.DoubleSide;
material.alphaMap = doorAlphaTexture;
// material.DoubleSide = true;

const materialNormal = new THREE.MeshNormalMaterial()
// materialNormal.flatShading = true;
// materialNormal.wireframe = true;


const materialMatcap = new THREE.MeshMatcapMaterial();
materialMatcap.matcap = matcapTexture;

const materialMeshDepth = new THREE.MeshDepthMaterial();

const materialLambert = new THREE.MeshLambertMaterial();

const materialPhong = new THREE.MeshPhongMaterial();
materialPhong.shininess = 100;
materialPhong.specular = new THREE.Color('red');

const materialToon = new THREE.MeshToonMaterial();
gradientTexture.generateMipmaps = false;
gradientTexture.magFilter = THREE.NearestFilter;
materialToon.gradientMap = gradientTexture;

const materialStandard = new THREE.MeshStandardMaterial();
materialStandard.roughness = 0.5;
materialStandard.metalness = 0.1;
materialStandard.map = doorColorTexture;
materialStandard.displacementMap = doorHeightTexture;
materialStandard.displacementScale = 0.2;
// materialStandard.roughnessMap = doorRoughnessTexture;
// materialStandard.metalnessMap = doorMetalnessTexture;
materialStandard.normalMap = doorNormalTexture;
materialStandard.normalScale.set(0.5,0.5);
materialStandard.alphaMap = doorAlphaTexture;
materialStandard.transparent = true;

const materialPhysical = new THREE.MeshPhysicalMaterial();

const materialPoint = new THREE.PointsMaterial();

materialStandard.envMap = environmentMapTexture;

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), 
    materialMatcap,
);

sphere.position.x = -1.5;

const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32), 
    materialLambert,
);
sphere2.position.x = -1.5;
sphere2.position.z = -1.5;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    materialMeshDepth
);



materialStandard.aoMap = doorAmbientOcclusionTexture;
materialStandard.aoMapIntensity = 1;

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    materialNormal
);
torus.position.x = 1.5;

const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    materialPhong
);
torus2.position.x = 1.5;
torus2.position.z = -1.5;

const torus3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
);
torus3.position.x = 1.5;
torus3.position.z = 1.5;

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 100, 100),
    materialStandard
);
cube.position.x = 3;

cube.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));


const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    materialToon
);
sphere3.position.x = 3;
sphere3.position.z = -1.5;



scene.add(
    sphere, 
    plane, 
    torus, 
    cube, 
    sphere2, 
    torus2, 
    sphere3, 
    torus3
);

/* 
UI
 */
gui.add(materialStandard, 'metalness').min(0).max(1).step(0.0001);
gui.add(materialStandard, 'roughness').min(0).max(1).step(0.0001);
gui.addColor(materialStandard, 'color');

// materialStandard.
/* 
 Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    sphere2.rotation.y = 0.1 * elapsedTime;
    sphere3.rotation.y = 0.1 * elapsedTime;
    // plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;
    torus2.rotation.y = 0.1 * elapsedTime;
    torus3.rotation.y = 0.2 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    sphere2.rotation.x = 0.15 * elapsedTime;
    sphere3.rotation.x = 0.15 * elapsedTime;
    // plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;
    torus2.rotation.x = 0.15 * elapsedTime;
    torus3.rotation.x = 0.2 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()