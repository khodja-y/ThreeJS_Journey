import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js'
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js'
import {RGBShiftShader} from 'three/examples/jsm/shaders/RGBShiftShader.js'

import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js'

import {GammaCorrectionShader} from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js'


import tintVertexShader from './Shaders/PostProcess/Tint/vertex.glsl'
import tintFragmentShader from './Shaders/PostProcess/Tint/fragment.glsl'

import displacementVertexShader from './Shaders/PostProcess/Displacement/vertex.glsl'
import displacementFragmentShader from './Shaders/PostProcess/Displacement/fragment.glsl'


import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

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
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

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

    //update effect composer
    effectComposer.setSize(sizes.width, sizes.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post processing
 */


//Handles all the browsers
let RenderTargetClass = null;

if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
{
    RenderTargetClass = THREE.WebGLRenderTarget
    RenderTargetClass.samples = 1;
    console.log('Using WebGLMultisampleRenderTarget')
}
else
{
    RenderTargetClass = THREE.WebGLRenderTarget
    console.log('Using WebGLRenderTarget')
}

const renderTarget = new RenderTargetClass(
    800,
    600,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    }
)


const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
// effectComposer.addPass(dotScreenPass);

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.enabled = true;
unrealBloomPass.strength = 0.3;
unrealBloomPass.radius = 1;
unrealBloomPass.threshold = 0.6;
effectComposer.addPass(unrealBloomPass);

const filmPass = new FilmPass();
// effectComposer.addPass(filmPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const tintShader = 
{
    uniforms: 
    {
        tDiffuse: {value: null},
        uTint: {value: null}
    },
    vertexShader: tintVertexShader,
    fragmentShader: tintFragmentShader
}
const tintPass = new ShaderPass(tintShader);
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass);

const displacementShader =
{
    uniforms: 
    {
        tDiffuse: {value: null},
        uFrequency: {value: 10.0},
        uOffset: {value:0.1},
        uTime: {value:null},
        uNormalMap: {value:null}
    },
    vertexShader: displacementVertexShader,
    fragmentShader: displacementFragmentShader
}

const displacementPass = new ShaderPass(displacementShader);
displacementPass.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png');
effectComposer.addPass(displacementPass);



//needs to be the last one before smaa
const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionShader);

//SMAA pass
if(renderer.getPixelRatio() == 1 && !renderer.capabilities.isWebGL2)
{
    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);

    console.log('Using SMAA');
}


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin();

    const elapsedTime = clock.getElapsedTime()


    displacementPass.material.uniforms.uTime.value = elapsedTime;
    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)

    effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    stats.end()
}

tick()

const debugObject =
{
    color: THREE.Color
}

const bloomUI = gui.addFolder('Bloom');

const tintUI = gui.addFolder('Tint');

const displacementUI = gui.addFolder('Displacement');

bloomUI
    .add(unrealBloomPass, 'enabled')

bloomUI
    .add(unrealBloomPass, 'strength')
    .min(0)
    .max(2)
    .step(0.001)
    .name('Strength')

bloomUI
    .add(unrealBloomPass, 'radius')
    .min(0)
    .max(2)
    .step(0.001)
    .name('Radius')

bloomUI
    .add(unrealBloomPass, 'threshold')
    .min(0)
    .max(1)
    .step(0.001)
    .name('Threshold')

tintUI
    .add(tintPass.material.uniforms.uTint.value, 'x')
    .min(-1)
    .max(1)
    .step(0.001)
    .name('TintX')

tintUI
    .add(tintPass.material.uniforms.uTint.value, 'y')
    .min(-1)
    .max(1)
    .step(0.001)
    .name('TintY')

tintUI
    .add(tintPass.material.uniforms.uTint.value, 'z')
    .min(-1)
    .max(1)
    .step(0.001)
    .name('TintZ')

tintUI
    .addColor(debugObject, 'color')
    .onChange(() => {tintPass.material.uniforms.uTint.value = debugObject.color})

displacementUI
    .add(displacementPass.material.uniforms.uFrequency, 'value')
    .min(0)
    .max(20)
    .step(0.001)
    .name('Frequency')

displacementUI
    .add(displacementPass.material.uniforms.uOffset, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name('Offset')