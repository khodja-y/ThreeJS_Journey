import * as THREE from 'three'
import Experience from '../Experience'
import waterVertexShader from '../Shaders/Water/vertex.glsl'
import waterFragmentShader from '../Shaders/Water/fragment.glsl'

export default class Island
{
    constructor()
    {
        this.experience = new Experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        //Debug
        this.debug = this.experience.debug;

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder(this.constructor.name);
        }

        //Setup
        this.resource = this.resources.items.islandModel;
        


        this.setModel();
        this.setMaterials();
        this.setDebug();

    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(1, 1, 1);
        
        this.scene.add(this.model);

        console.log(this.model);

        

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;

                if (child.material.name == 'Water') {

                    
                    
                    child.material = new THREE.ShaderMaterial(
                    {
                        vertexShader: waterVertexShader,
                        fragmentShader: waterFragmentShader,
                        side: THREE.DoubleSide,
                        // wireframe: true,
                        uniforms:
                        {
                            uBigWavesElevation: { value: 0.1 },
                            uBigWavesSpeed: { value: 0.75 },
                            uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                            uTime: { value : this.experience.time.delta },
                            uDepthColor: { value: new THREE.Color('#186691')},
                            uSurfaceColor: { value: new THREE.Color('#9bd8ff')},
                            uColorOffset: { value: 0.08 },
                            uColorMultiplier: { value: 5 },
                            uSmallWavesElevation: { value: 0.15 },
                            uSmallWavesFrequency: { value: 3.0 },
                            uSmallWavesSpeed: { value: 0.2 },
                            uSmallIterations: { value: 4.0 }
                        },
                        transparent: true
                    });
                    child.geometry = new THREE.BoxGeometry(2, 0.25, 2, 500, 500, 500)
                    child.position.y = 0.9
                    

                    this.material = child.material;
    
                    console.log(child.material);
    
                }
            }

            
        })

    }

    setMaterials()
    {
        this.materials = [];
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                this.materials.push(child.material);
            }
        })

        console.log(this.materials);
    }

    

    setDebug()
    {
        //Debug
        if(this.debug.active){
            this.debugFolder
                .add(this.model.scale, 'x')
                .min(0.01)
                .max(10)
                .step(0.01)
                .name('ScaleX');
            this.debugFolder
                .add(this.model.scale, 'y')
                .min(0.01)
                .max(10)
                .step(0.01)
                .name('ScaleY');
            this.debugFolder
                .add(this.model.scale, 'z')
                .min(0.01)
                .max(10)
                .step(0.01)
                .name('ScaleZ');
        }
    }

    update()
    {
        this.material.uniforms.uTime.value = this.experience.time.eslapsedTime * 0.001;
    }
        
        
}