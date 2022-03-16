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
 * Helpers
 */
 const axesHelper = new THREE.AxesHelper( 5 );
 //scene.add( axesHelper );


//Parameters
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 10.0;
parameters.branches = 3.0;
parameters.spin = 1.0;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';


let bufferGeometry = null;
let material = null;
let particles = null;



/*
Galaxy
*/
const generateGalaxy = () =>
{
    if(particles != null){
        bufferGeometry.dispose();
        material.dispose();
        scene.remove(particles);
    }   

    
    bufferGeometry = new THREE.BufferGeometry();
    let vertices = new Float32Array(parameters.count * 3);

    let colors = new Float32Array(parameters.count, 3);
    
    for(let i=0; i<=parameters.count; i++){
        const i3 = i * 3;

        //Positions
        const radius = parameters.radius * Math.random();
        const spinAngle = radius * parameters.spin;
        let branchesAngle = i % parameters.branches;
        branchesAngle /= parameters.branches;
        branchesAngle *= Math.PI * 2.0;
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;

        vertices[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
        vertices[i3 + 1] = randomY;
        vertices[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;

        //Colors
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        const mixtColor = colorInside.clone();

        mixtColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixtColor.r;
        colors[i3 + 1] = mixtColor.g;
        colors[i3 + 2] = mixtColor.b;
       
    }

    bufferGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3)
    );

    bufferGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    );

    material = new THREE.PointsMaterial({
        size : parameters.size,
        sizeAttenuation : true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true 
    });

    particles = new THREE.Points(bufferGeometry, material);
    scene.add(particles);
    
}

generateGalaxy();

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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




//Debug

gui.add(parameters, 'count').min(1).max(1000000).step(1).onFinishChange(generateGalaxy).name('StarCount');
gui.add(parameters, 'size').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy).name('Starsize');
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy).name('Radius');
gui.add(parameters, 'branches').min(1).max(20).step(1).onFinishChange(generateGalaxy).name('Branches');
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy).name('SpinAngle');
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy).name('Randomness');
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy).name('RandomnessPower');

gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);