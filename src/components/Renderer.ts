import * as THREE from 'three';

export class Renderer extends THREE.WebGLRenderer {
    constructor(canvasElement: HTMLCanvasElement) {
        if (!canvasElement) {
            throw new Error('Canvas element not found');
        }

        super({ antialias: true, alpha: true, canvas: canvasElement });

        this.setSize(window.innerWidth, window.innerHeight);
        this.setPixelRatio(window.devicePixelRatio);
        this.shadowMap.enabled = true;
    }
}