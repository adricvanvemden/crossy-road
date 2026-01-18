import * as THREE from 'three';
import { TILE_SIZE } from '../constants';
import { Wheel } from './Wheel.ts';

export class Car extends THREE.Group {
    constructor(initial_tile_index: number, direction: boolean, color: number) {
        super();
        this.position.x = initial_tile_index * TILE_SIZE;
        if (!direction) this.rotation.z = Math.PI;

        const main = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 15),
            new THREE.MeshLambertMaterial({ color, flatShading: true })
        );
        main.position.z = 12;
        main.castShadow = true;
        main.receiveShadow = true;
        this.add(main);

        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(33, 24, 12),
            new THREE.MeshLambertMaterial({ color: 'lightblue', flatShading: true })
        );
        cabin.position.set(-6, 0, 25.5);
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        this.add(cabin);

        const frontWheel = new Wheel(18);
        this.add(frontWheel);

        const backWheel = new Wheel(-18);
        this.add(backWheel);
    }
}