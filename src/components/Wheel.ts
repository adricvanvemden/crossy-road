import * as THREE from 'three';

export class Wheel extends THREE.Mesh {
    constructor(x_offset: number) {
        const geometry = new THREE.BoxGeometry(12, 33, 12);
        const material = new THREE.MeshLambertMaterial({ color: 'black', flatShading: true });
        super(geometry, material);
        this.position.set(x_offset, 0, 6);
    }
}