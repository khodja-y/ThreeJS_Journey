import * as THREE from 'three'
import Experience from "../Experience";



export default class Floor
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Setup
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.geometry = new THREE.CircleGeometry(5, 64);
        
    }

    setTextures()
    {
        this.textures = {};
        this.textures.baseColor = this.resources.items.grassColorTexture;
        this.textures.baseColor.encoding = THREE.sRGBEncoding;
        this.textures.baseColor.repeat.set(1.5, 1.5);
        this.textures.baseColor.wrapS = THREE.RepeatWrapping;
        this.textures.baseColor.wrapT = THREE.RepeatWrapping;

        this.textures.normal = this.resources.items.grassNormalTexture;
        this.textures.normal.repeat.set(1.5, 1.5);
        this.textures.normal.wrapS = THREE.RepeatWrapping;
        this.textures.normal.wrapT = THREE.RepeatWrapping;

       
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.baseColor,
            normalMap: this.textures.normal
        });

        
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh)

        // this.scene.add(this.mesh);
    }

    
}