import * as THREE from 'three';

export class Camera extends THREE.OrthographicCamera {
    constructor() {
        const size = 300;
        const viewRatio = window.innerWidth / window.innerHeight;
        const width = viewRatio < 1 ? size : size * viewRatio;
        const height = viewRatio < 1 ? size / viewRatio : size;

        super(width / -2, width / 2, height / 2, height / -2, 200, 1000);

        this.up.set(0, 0, 1);
        this.position.set(300, -300, 300);
        this.lookAt(0, 0, 0);
    }
}