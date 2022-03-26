import * as THREE from 'three'


import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Resources from './Utils/Resources';

import sources from './Sources.js'
import Debug from './Utils/Debug';


let instance = null;

export default class Experience
{
    constructor(canvas)
    {
        if(instance)
        {
            return instance;
        }

        instance = this;
        console.log('Here starts the experience');

        //Global access
        window.experience = this;

        //Options
        this.canvas = canvas;

        //Debug
        this.debug = new Debug();

        //Setup
        this.sizes = new Sizes(canvas);

        //Time 
        this.time = new Time();

        //Scene
        this.scene = new THREE.Scene();

        //Ressources
        this.resources = new Resources(sources);

        //Camera
        this.camera = new Camera();

        //Renderer
        this.renderer = new Renderer();

        //World
        this.world = new World();

        //Resize event
        this.sizes.on('resize', () =>
        {
            this.resize();
        });

        //Time tick event
        this.time.on('tick', () =>
        {
            this.update();
        });
    }

    resize()
    {
        // console.log('resize');
        this.camera.resize();
        this.renderer.resize();
    }

    update()
    {
        // console.log('tick');
        //Camera before renderer
        this.camera.update();
        this.world.update();
        
        this.renderer.update();
    }

    destroy()
    {
        //Note: we need to remove listeners too
        
        //Stop listenning 
        this.sizes.off('resize');
        this.time.off('tick');

        //Traverse the whole scene
        this.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose();

                //loop through the material propreties
                for(const key in child.material)
                {
                    const value = child.material[key];

                    if(value && typeof value.dispose == 'function')
                    {
                        value.dispose();
                    }
                }
            }
        })

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if(this.debug.active)
        {
            this.debug.ui.destroy();
        }
    }
}