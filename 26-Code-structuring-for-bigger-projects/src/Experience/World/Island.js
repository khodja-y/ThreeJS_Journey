import * as THREE from 'three'
import Experience from '../Experience'

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
            }
        })

        

    }

    setDebug()
    {
        //Debug
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