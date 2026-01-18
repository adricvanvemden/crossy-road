import * as THREE from 'three';

export class DirectionalLight extends THREE.DirectionalLight {
    constructor() {
        super();

        this.position.set(-100, -100, 200);
        this.up.set(0, 0, 1);
        this.castShadow = true;

        this.shadow.mapSize.width = 2048;
        this.shadow.mapSize.height = 2048;

        this.shadow.camera.near = 50;
        this.shadow.camera.far = 400;
        this.shadow.camera.left = -400;
        this.shadow.camera.right = 400;
        this.shadow.camera.top = 400;
        this.shadow.camera.bottom = -400;
    }
}