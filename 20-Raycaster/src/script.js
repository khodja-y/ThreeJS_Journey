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
const scene = new THREE.Scene();



/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2
object1.position.y = 4

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object2.position.y = 4

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2
object3.position.y = 4

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
 const raycaster = new THREE.Raycaster();

//  const rayOrigin = new THREE.Vector3(-3, 0, 0);
//  const rayDirection = new THREE.Vector3(10, 0, 0);
//  rayDirection.normalize();

//  raycaster.set(rayOrigin, rayDirection);

//  const intersect = raycaster.intersectObject(object2)
//  console.log(intersect)
 
//  const intersects = raycaster.intersectObjects([object1, object2, object3])
//  console.log(intersects)



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
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (_event) =>
{
    mouse.x = _event.clientX / sizes.width * 2 - 1;
    mouse.y = - (_event.clientY / sizes.height * 2 - 1);

    // console.log(mouse);
});

let cptClick1 = 0;

window.addEventListener('click', () =>
{
    if(currentIntersect)
    {
        switch(currentIntersect.object)
        {
            case object1:
                object1.material.color.set('#00ffff');
                console.log('#00ffff');
                cptClick1++;
                break;

            case object2:
                object2.material.color.set('#ff00ff');
                console.log('#ff00ff');
                break;

            case object3:
                object3.material.color.set('#ffff00');
                console.log('#ffff00');
                break;
        }
        if(cptClick1 >= 2){
            object1.material.color.set('#ff0000');
            cptClick1 = 0;
        }
    }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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

let currentIntersect = null;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update();

    //Animate spheres
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    const objectsToTest = [object1, object2, object3];

    // for(const object of objectsToTest)
    // {
    //     object.material.color.set('#ff0000');
    // }

    //Update raycaster
    /* const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(10, 0, 0);
    rayDirection.normalize();

    raycaster.set(rayOrigin, rayDirection);

    
    const intersectObjects = raycaster.intersectObjects(objectsToTest);
    // console.log(intersectObjects.length);

    for(const intersect of intersectObjects)
    {
        intersect.object.material.color.set('#0000ff');
    }

    const intersectObject = raycaster.intersectObject(object2);
    console.log(intersectObject.point);
    */
    
    //Raycaster and mouse
    

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objectsToTest);

    // for(const intersect of intersects)
    // {
    //     intersect.object.material.color.set('#0000ff');
    // }

    if(intersects.length){
        //something being hover
        if(!currentIntersect)
        {
            console.log('mouseEnter');
        }
        currentIntersect = intersects[0];
    }
    else{
        //nothing being hover
        if(currentIntersect)
        {
            console.log('mouseLeave');
        }
        currentIntersect = null;

    }
    
    renderer.render(scene, camera);



    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()