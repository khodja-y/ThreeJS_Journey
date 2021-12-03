import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Textures
 */

//JS Native
const imgSource = new Image()
const texture = new THREE.Texture(imgSource)

imgSource.onload = () =>{
    texture.needsUpdate = true;
}
imgSource.src = '/textures/door/color.jpg'

//THREE JS
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () =>
{
    console.log("OnStart");
}

loadingManager.onLoad = () =>
{
    console.log("onLoad");
}

loadingManager.onProgress = () =>
{
    console.log("onProgress");
}

loadingManager.onError = () =>
{
    console.log("OnError");
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexturetextureTJS = textureLoader.load('/textures/door/color.jpg')
const alphaTexturetextureTJS = textureLoader.load('/textures/door/alpha.jpg')
const heightTexturetextureTJS = textureLoader.load('/textures/door/height.jpg')
const normalTexturetextureTJS = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexturetextureTJS = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexturetextureTJS = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexturetextureTJS = textureLoader.load('/textures/door/roughness.jpg')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexturetextureTJS })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()