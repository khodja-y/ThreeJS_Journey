import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InstancedBufferAttribute } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {}

debugObject.envMapIntensity = 2;

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();

const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Textures
 */
const cubemap1 = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
]);
cubemap1.encoding = THREE.sRGBEncoding;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = cubemap1;
scene.environment = cubemap1;

/**
 * Update all the materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            child.material.envMap = cubemap1;
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
            // console.log(child);
        }
        
    })
}

/**
 * Models
 */
const Helmet = new THREE.Group();

gltfLoader.load(
    // 'models/FlightHelmet/glTF/FlightHelmet.gltf',
    // 'models/Burger/Burger.gltf',
    'models/hamburger.glb',
    (gltf) =>
    {
        console.log('success');
        // console.log(gltf);
        // gltf.scene.scale.set(10, 10, 10);
        // gltf.scene.scale.set(0.5, 0.5, 0.5);
        // gltf.scene.position.set(0, -4, 0);
        // gltf.scene.rotation.y = Math.PI * 0.5;
        Helmet.add(gltf.scene);
        scene.add(Helmet);

        //Update the lights
        updateAllMaterials();
    }
)

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 5);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);

//Régler les problèmes d'ombres shadowmap avec les geomtry smooth
directionalLight.shadow.bias = 5;
directionalLight.shadow.normalBias = 0.02;

scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper)
/**
 * Test sphere
 */
const material = new THREE.MeshStandardMaterial();
const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    material
)
// scene.add(testSphere)

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

    //Anti Aliasing: On doit l'activer à la création du renderer et pas après
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Use correct light
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()


    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/**
 * Debug
 */
const rendererUI = gui.addFolder('Renderer');

const lightUI = gui.addFolder('Light');
lightUI.close();

const helmetUI = gui.addFolder('Helmet');
helmetUI.close();

const EnvMapUI = gui.addFolder('EnvMap');
EnvMapUI.close()


lightUI
    .addColor(directionalLight, 'color')
    .name('Color directional light')

lightUI
    .add(directionalLight, 'intensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name('Light intensity')

lightUI
    .add(directionalLight.position, 'x')
    .min(-10)
    .max(10)
    .step(0.01)
    .name('Position X')

lightUI
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.01)
    .name('Position Y')

lightUI
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.01)
    .name('Position Z')

lightUI
    .add(directionalLight.shadow, 'bias')
    .min(0)
    .max(10)
    .step(0.001)
    .name('Bias')
    
lightUI
    .add(directionalLight.shadow, 'normalBias')
    .min(0)
    .max(10)
    .step(0.001)
    .name('Normal Bias')
    
helmetUI
    .add(Helmet.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('Rotation Y')

EnvMapUI
    .add(debugObject, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name('Env Map Intensity')
    .onChange(updateAllMaterials)

rendererUI
    .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
    })
    .onFinishChange(updateAllMaterials)

rendererUI
    .add(renderer, 'toneMappingExposure')
    .min(0)
    .max(10)
    .step(0.001)
    .name('Exposure')
