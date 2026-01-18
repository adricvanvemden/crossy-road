import * as THREE from 'three';
import { TILE_SIZE, TRUNK_COLOR, FOLIAGE_COLOR}  from '../constants.ts';

export class Tree extends THREE.Group {
    constructor(tile_index: number, height: number) {
        super();
        this.position.x = tile_index * TILE_SIZE;

        const trunk = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, height),
            new THREE.MeshLambertMaterial({ color: TRUNK_COLOR, flatShading: true })
        );
        trunk.position.z = height / 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.add(trunk);

        const foliage = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, height),
            new THREE.MeshLambertMaterial({ color: FOLIAGE_COLOR, flatShading: true })
        );
        foliage.position.z = height / 2 + 20;
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        this.add(foliage);
    }
}