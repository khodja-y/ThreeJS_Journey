import * as THREE from 'three'
import Experience from '../Experience'
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';
import Island from './Island';

export default class World
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        
        

        //Test Mesh
        // const testMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(1, 1, 1),
        //     new THREE.MeshStandardMaterial()
        // );
        

        // this.scene.add(testMesh)

        this.resources.on('ready', () =>
        {
            //Setup
            // this.floor = new Floor();
            // this.fox = new Fox();
            this.island = new Island();

            //Apply the envMap after the object to update the materials
            this.environment = new Environment();
            
        })

               

    }

    update()
    {
        if(this.fox) this.fox.update();
    }
}