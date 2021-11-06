import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

console.log(gsap);

//----------------------------------------------------
//Functions
//----------------------------------------------------
//Animation
/* function:
const tick = () =>
{

} */


let time = Date.now();
function tick()
{
    const currentTime = Date.now(); 
    const deltaTime = currentTime - time;
    time = currentTime;
     
    console.log(deltaTime);

    //Update objects
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 0.0001 * deltaTime); 

    //Render
    renderer.render(scene, camera);

    //Update clock
    window.requestAnimationFrame(tick);
    
}

const clock = new THREE.Clock();
function tick2()
{
    const elapsedTime = clock.getElapsedTime();

    //Update objects
    // mesh.position.x = Math.cos(elapsedTime);
    // mesh.position.y = Math.sin(elapsedTime);
    
    // camera.position.x = Math.cos(elapsedTime);
    // camera.position.y = Math.sin(elapsedTime);
    camera.lookAt(mesh.position);

    // gsap.to(mesh.position, {duration : 1, x: 3})

    //Render
    renderer.render(scene, camera);

    //Update clock
    window.requestAnimationFrame(tick2);
}




//----------------------------------------------------


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)



// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
// renderer.render(scene, camera)



//----------------------------------------
//GSAP
//----------------------------------------
gsap.to(mesh.position, {duration : 1, delay: 1, x: 3})
gsap.to(mesh.position, {duration : 1, delay: 2, x: 0})



//---------------------------------------
//Game loop
// tick();
tick2();