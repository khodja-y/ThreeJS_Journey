import './style.css'
import * as THREE from 'three'
import { Color } from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
/* const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1

mesh.position.set(2, -0.6, -2)
mesh.scale.set(2, 0.5, 2)
// mesh.position.set(mesh.position.x, 1, mesh.position.z - 1)

//Rotation with Euler
mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0)

//Rotation with quaternion


scene.add(mesh) */

//Group objects
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color : '#D84120'})
);


const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color : 'blue'})
);


const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color : 'yellow'})
);

group.add(cube1, cube2, cube3)

group.children[0].position.set(2, 1, -0.5)
group.children[1].position.set(-2, -1, -5)
group.children[2].position.set(0, 2, -3)

group.position.x = 2
group.rotation.set(0, Math.PI / 4, 0)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

// camera.lookAt(mesh.position)

scene.add(camera)


/**
 * Axes Helper
 */
 const axesHelper = new THREE.AxesHelper(3)
 scene.add(axesHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)