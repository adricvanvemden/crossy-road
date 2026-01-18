import * as THREE from 'three';
import { TILE_SIZE } from '../constants.ts';
import { Map } from './Map';
import { endsUpInValidPosition } from '../utils/endsUpInValidPosition';
import { bindInputs } from '../controllers/user-controller.ts';
import { lerp } from 'three/src/math/MathUtils.js';

type Direction = 'up' | 'down' | 'left' | 'right';

export class Player extends THREE.Group {
    private inner: THREE.Group;

    public positionState = { currentRow: 0, currentTile: 0 };

    private currentMove: Direction | null = null;
    private nextMove: Direction | null = null;
    private clock = new THREE.Clock(false);
    private stepTime = 0.2;

    private isLocked: boolean = false;

    constructor() {
        super();
        this.inner = new THREE.Group();

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 12.5),
            new THREE.MeshLambertMaterial({ color: 'white', flatShading: true })
        );
        body.castShadow = true;
        body.receiveShadow = true;
        body.position.set(0, 0, 10);

        const cap = new THREE.Mesh(
            new THREE.BoxGeometry(2, 4, 2),
            new THREE.MeshLambertMaterial({ color: 'red', flatShading: true })
        );
        cap.castShadow = true;
        cap.receiveShadow = true;
        cap.position.set(0, 0, 17.5);

        this.inner.add(body, cap);
        this.add(this.inner);

        bindInputs();
    }

    public handleInput(direction: Direction) {
        if (this.isLocked) return;

        const isValidMove = endsUpInValidPosition(
            { rowIndex: this.positionState.currentRow, tileIndex: this.positionState.currentTile },
            [this.currentMove, direction].filter(Boolean) as Direction[]
        );
        if (!isValidMove) return;

        if (!this.currentMove) {
            this.currentMove = direction;
            this.clock.start();
        } else {
            this.nextMove = direction;
        }
    }

    public update() {
        if (!this.currentMove) return;

        const progress = Math.min(1, this.clock.getElapsedTime() / this.stepTime);

        this.updatePosition(progress);
        this.updateRotation(progress);

        if (progress >= 1) {
            switch (this.currentMove) {
                case 'up': this.positionState.currentRow += 1; break;
                case 'down': this.positionState.currentRow -= 1; break;
                case 'left': this.positionState.currentTile -= 1; break;
                case 'right': this.positionState.currentTile += 1; break;
            }

            // Check for map expansion
            if (this.positionState.currentRow > Map.metaData.length - 10) Map.addRows();

            // Reset clock
            this.clock.stop();
            this.clock.elapsedTime = 0;

            // Start next move if exists
            this.currentMove = this.nextMove;
            this.nextMove = null;
            if (this.currentMove) this.clock.start();

            // Update score UI
            const scoreDom = document.getElementById('score');
            if (scoreDom) scoreDom.innerText = `${this.positionState.currentRow}`;
        }
    }

    /** Animate player position with Z-bounce */
    private updatePosition(progress: number) {
        if (!this.currentMove) return;

        const startX = this.positionState.currentTile * TILE_SIZE;
        const startY = this.positionState.currentRow * TILE_SIZE;

        let targetX = startX;
        let targetY = startY;

        switch (this.currentMove) {
            case 'up': targetY += TILE_SIZE; break;
            case 'down': targetY -= TILE_SIZE; break;
            case 'left': targetX -= TILE_SIZE; break;
            case 'right': targetX += TILE_SIZE; break;
        }

        this.position.x = THREE.MathUtils.lerp(startX, targetX, progress);
        this.position.y = THREE.MathUtils.lerp(startY, targetY, progress);
        this.inner.position.z = Math.sin(progress * Math.PI) * 12;
    }

    /** Animate rotation smoothly */
    private updateRotation(progress: number) {
        if (!this.currentMove) return;

        let targetRotation = 0;
        switch (this.currentMove) {
            case 'up': targetRotation = 0; break;
            case 'down': targetRotation = Math.PI; break;
            case 'left': targetRotation = Math.PI / 2; break;
            case 'right': targetRotation = -Math.PI / 2; break;
        }

        const startRotation = this.inner.rotation.z;
        this.inner.rotation.z = lerp(startRotation, targetRotation, progress);
    }

    /** Reset player */
    public reset() {
        this.position.set(0, 0, 0);
        this.inner.position.z = 0;
        this.inner.rotation.set(0, 0, 0);
        this.positionState.currentRow = 0;
        this.positionState.currentTile = 0;
        this.currentMove = null;
        this.nextMove = null;
        this.clock.stop();
        this.clock.elapsedTime = 0;
        this.isLocked = false;
    }

    public Lock() {
        this.isLocked = true;
    }
}


export const player = new Player();
