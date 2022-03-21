import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON, { Plane } from 'cannon'



/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    nbrSpheres: 2,
};
const debugObject = {};


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
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */


//World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

//Physics Material
const concreteMaterial = new CANNON.Material('concrete');
const plasticMaterial = new CANNON.Material('plastic');

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
// world.addContactMaterial(concretePlasticContactMaterial);

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
world.addContactMaterial(defaultContactMaterial);

//Instead of using different material in every body
world.defaultContactMaterial = defaultContactMaterial;

//Sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     // material: defaultMaterial
// });
//Local force
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));

// world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    // material: defaultMaterial
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 3
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Create sphere
 */

let objectToUpdate = [];
const sphere = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) =>
{

    const mesh = new THREE.Mesh(
        sphere,
        sphereMaterial
    );
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);

    scene.add(mesh);

    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    });
    body.position.copy(mesh.position);
    world.addBody(body);
    
    objectToUpdate.push({mesh, body});
}

const nbrSpheres = parameters.nbrSpheres;
createSphere(0.5, {x: 0, y: 3, z: 0});

const createSpheres = (count) => 
{
    if(objectToUpdate.length != 0)
    {
        for(let object of objectToUpdate){
            scene.remove(object.mesh)
            world.remove(object.body)
            // delete object.mesh;
            // delete object.shape;
        }
        objectToUpdate = [];
    }

    for(let i=0; i<count; i++)
    {
        
        createSphere(0.5, {
            x: (Math.random() - 0.5) * 3, 
            y: 3, 
            z: (Math.random() - 0.5) * 3})
    }
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    //Wind
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
    
    //Update physics world
    world.step(
        1/60,
        deltaTime,
        3
    );
    // console.log(planeBody.position.y);
    
    for(const object of objectToUpdate)
    {
        object.mesh.position.copy(object.body.position)
    }

    // sphere.position.copy(sphereBody.position);

    // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 1), Math.sin(Math.PI * 0.5));

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
gui.add(parameters, 'nbrSpheres')
    .min(1)
    .max(100)
    .step(1)
    .onChange(createSpheres)


debugObject.createSphere = () =>
{
    createSphere(Math.random() * 0.5, {   
        x: (Math.random() - 0.5) * 3, 
        y: 3, 
        z: (Math.random() - 0.5) * 3
    })
}

gui.add(debugObject, 'createSphere')

