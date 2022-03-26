import * as THREE from 'three'
import Experience from '../Experience'


export default class Fox
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
        this.resource = this.resources.items.foxModel;


        this.setModel();

        this.setAnimation();
        this.animate();

        this.setDebug();
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.02, 0.02, 0.02);
        
        this.scene.add(this.model);

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true;
            }
        })
    }

    setAnimation()
    {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        // this.animation.action = this.animation.mixer.clipAction(this.resource.animations[1]);

        this.animation.actions = {};
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[1]);
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[2]);

        this.animation.actions.current = this.animation.actions.idle;

        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();

            newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        }

        
    }

    animate()
    {
        this.animation.actions.current.play();
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001);
    }

    setDebug()
    {
        //Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => {this.animation.play('idle')},
                playWalk: () => {this.animation.play('walk')},
                playRun: () => {this.animation.play('run')}
            }

            this.debugFolder.add(debugObject, 'playIdle');
            this.debugFolder.add(debugObject, 'playWalk');
            this.debugFolder.add(debugObject, 'playRun');
        }

        this.debugFolder
            .add(this.model.position, 'x')
            .name('PositionX')
            .min(-5)
            .max(5)
            .step(0.1)
            
    }
}