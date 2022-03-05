import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Vector3 } from 'three'

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
colorTexturetextureTJS.repeat.x = 2;
colorTexturetextureTJS.repeat.y = 3;
colorTexturetextureTJS.wrapS = THREE.MirroredRepeatWrapping;
colorTexturetextureTJS.wrapT = THREE.RepeatWrapping;
colorTexturetextureTJS.offset.x = 0.5;
colorTexturetextureTJS.offset.y = 0.5;
colorTexturetextureTJS.rotation = Math.PI * 0.1;

const alphaTexturetextureTJS = textureLoader.load('/textures/door/alpha.jpg')
const heightTexturetextureTJS = textureLoader.load('/textures/door/height.jpg')
const normalTexturetextureTJS = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexturetextureTJS = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexturetextureTJS = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexturetextureTJS = textureLoader.load('/textures/door/roughness.jpg')

const CheckBoardTexture = textureLoader.load('textures/checkerboard-8x8.png');
CheckBoardTexture.magFilter = THREE.NearestFilter;
CheckBoardTexture.wrapS = THREE.RepeatWrapping;
CheckBoardTexture.wrapT = THREE.RepeatWrapping;
// CheckBoardTexture.repeat.x = 0.01;
// CheckBoardTexture.repeat.y = 0.01;

const MinecraftTexture = textureLoader.load('/textures/minecraft.png');
MinecraftTexture.generateMipmaps = false;
MinecraftTexture.magFilter = THREE.NearestFilter;
MinecraftTexture.wrapS = THREE.RepeatWrapping;
MinecraftTexture.wrapT = THREE.RepeatWrapping;

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

//  const loader = new FBXLoader();
//  loader.load('models/ModularWalls_YK.fbx', function(object){
//     object.traverse(function(child) {

//         if (child.isMesh) {

//             child.castShadow = true;
//             child.receiveShadow = true;
//         }

//     });
//      scene.add(object);
//  });

//  scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

// 				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
// 				hemiLight.position.set( 0, 200, 0 );
// 				scene.add( hemiLight );

//  const dirLight = new THREE.DirectionalLight( 0xffffff );
// 				dirLight.position.set( 0, 200, 100 );
// 				dirLight.castShadow = true;
// 				dirLight.shadow.camera.top = 180;
// 				dirLight.shadow.camera.bottom = - 100;
// 				dirLight.shadow.camera.left = - 120;
// 				dirLight.shadow.camera.right = 120;
// 				scene.add( dirLight );

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: MinecraftTexture })
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
    camera.
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