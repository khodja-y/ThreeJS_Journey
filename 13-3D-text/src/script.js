import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

/* 
    Fonts / Text3D
*/
const fontLoader = new FontLoader();

fontLoader.load(
    '/fonts/helvetiker_bold.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'JM VAS BOSSER!',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        );
        textGeometry.computeBoundingBox();
        //Center        
        // textGeometry.translate(
        //     - textGeometry.boundingBox.max.x * 0.5,
        //     0,
        //     0
        // );

        textGeometry.center();
        //Right
        // textGeometry.translate(
        //     - textGeometry.boundingBox.max.x,
        //     0,
        //     0
        // );
        
        const textMaterial = new THREE.MeshMatcapMaterial();
        
        textMaterial.matcap = matcapTexture;
        // textMaterial.color = new THREE.Color('blue');
        // textMaterial.flatShading = true;
        const text = new THREE.Mesh(textGeometry, textMaterial);

        gsap.to(text.position, {duration : 1, delay: 1, x: 3});
        gsap.to(text.position, {duration : 1, delay: 2, x: 0});

        scene.add(text);
    }
)



const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;


// Scene
const scene = new THREE.Scene()

const axisHelper = new THREE.AxesHelper();
// scene.add(axisHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('textures/matcaps/8.png');
/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

for(let i = 0; i < 100; i++)
{
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.x = (Math.random() - 0.5) * 12;
    donut.position.y = (Math.random() - 0.5) * 12;
    donut.position.z = (Math.random() - 0.5) * 12;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    // gsap.to(donut.position, {duration : 1, delay: 2, x: 0})
    scene.add(donut)
}

// scene.add(cube)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()