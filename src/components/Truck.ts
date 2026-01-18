import * as THREE from 'three';
import { TILE_SIZE, CARGO_COLOR } from '../constants.ts';
import { Wheel } from './Wheel.ts';

export class Truck extends THREE.Group {
    constructor(initial_tile_index: number, direction: boolean, color: number) {
        super();
        this.position.x = initial_tile_index * TILE_SIZE;
        if (!direction) this.rotation.z = Math.PI;

        const cargo = new THREE.Mesh(
            new THREE.BoxGeometry(70, 35, 35),
            new THREE.MeshLambertMaterial({ color: CARGO_COLOR, flatShading: true })
        );
        cargo.position.z = 25;
        cargo.position.x = -15;
        cargo.castShadow = true;
        cargo.receiveShadow = true;
        this.add(cargo);
        
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(30, 30, 30),
            new THREE.MeshLambertMaterial({ color, flatShading: true })
        );
        cabin.position.set(35, 0, 20);
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        this.add(cabin);

        const frontWheel = new Wheel(37);
        this.add(frontWheel);

        const middleWheel = new Wheel(5);
        this.add(middleWheel);

        const backWheel = new Wheel(-35);
        this.add(backWheel);
    }
}