import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { TorusGeometry, Vector3 } from 'three'
import gsap from 'gsap'


const gui = new dat.GUI()

const parameters = {
    materialColor: '#cb3a3a',
    sizeParticle: 0.025 
}


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const gradient1 = textureLoader.load('textures/gradients/3.jpg');
gradient1.magFilter = THREE.NearestFilter;
const gradient2 = textureLoader.load('textures/gradients/5.jpg');
gradient2.magFilter = THREE.NearestFilter;


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// scene.add(cube)

//Lights
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(2, 2, 0);

scene.add(dirLight);

// const ambientLight = new THREE.AmbientLight();
// scene.add(ambientLight);

//Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradient1
});

//Meshs

const objectsDistance = 4;

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);

mesh1.position.x = 1;
mesh1.position.y = objectsDistance * 0;
// mesh1.position.z = -4;

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
);
mesh2.position.y = - objectsDistance * 1;
mesh2.position.x = -1;
 
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);

mesh3.position.x = 1;
mesh3.position.y = - objectsDistance * 2;
// mesh3.position.z = -4;

const meshs = new THREE.Group();
meshs.add(mesh1, mesh2, mesh3);

scene.add(meshs);

const meshsArray = [mesh1, mesh2, mesh3];

//Particles
const particlesCount = 500;
const positions = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount; i++){
    let i3 = i * 3;

    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = objectsDistance * 0.4 - Math.random() * objectsDistance * meshsArray.length;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
};
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: parameters.sizeParticle
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// console.log(particles);



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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setClearAlpha(0);
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () =>{
    scrollY = window.scrollY;

    const newSection = Math.round(scrollY / sizes.width);
    if(newSection != currentSection) currentSection = newSection;

    gsap.to(
        meshsArray[currentSection].rotation,
        {
            duration: 1,
            ease: 'power2.inOut',
            x: '+=10',
            y: '+=3',
            z: '+=1.5'
        }
    )
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (_event) =>{
    cursor.x = _event.clientX / sizes.width - 0.5;
    cursor.y = -(_event.clientY / sizes.height - 0.5);

    // console.log(cursor);
});



const cameraGroup = new THREE.Group();
cameraGroup.add(camera);

scene.add(cameraGroup);

/**
 * Animate
 */
 const clock = new THREE.Clock()
 let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    // console.log(deltaTime);
    //Update the camera
    camera.position.y = - scrollY / sizes.height * objectsDistance;

    //Easing / Smooth
     
    //Parallax
    const parallaxX = cursor.x * 0.5;
    const parallaxY = cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    

    //Animate objects
    for(const object of meshsArray){
        object.rotation.y += Math.sin(Math.PI * deltaTime * 0.1);
        object.rotation.x += Math.sin(Math.PI * deltaTime * 0.1);
    }

    //Animate Objects 2
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


/**
 * Debug
 */
 
 gui
     .addColor(parameters, 'materialColor')
     .onChange(() => {
         material.color.set(parameters.materialColor);
         particlesMaterial.color.set(parameters.materialColor);
     })
 gui
     .add(parameters, 'sizeParticle')
     .min(0.01)
     .max(10)
     .step(0.01)
     .onChange(() => {
        particlesMaterial.size = parameters.sizeParticle
    })