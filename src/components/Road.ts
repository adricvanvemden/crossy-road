import * as THREE from 'three';
import { ROAD_COLOR, TILES_PER_ROW, TILE_SIZE } from '../constants';

export class Road extends THREE.Group {
    constructor(rowIndex: number) {
        super();
        this.position.y = rowIndex * TILE_SIZE;

        const foundation = new THREE.Mesh(
            new THREE.BoxGeometry(TILES_PER_ROW * TILE_SIZE, TILE_SIZE, 3),
            new THREE.MeshLambertMaterial({color: ROAD_COLOR, flatShading: true})
        );
        foundation.receiveShadow = true;

        this.add(foundation);
    }
}