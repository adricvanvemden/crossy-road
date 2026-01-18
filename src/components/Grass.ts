import * as THREE from 'three';
import { GRASS_COLOR, TILES_PER_ROW, TILE_SIZE } from '../constants';

export class Grass extends THREE.Group {
    constructor(rowIndex: number) {
        super();
        this.position.y = rowIndex * TILE_SIZE;

        const foundation = new THREE.Mesh(
            new THREE.BoxGeometry(TILES_PER_ROW * TILE_SIZE, TILE_SIZE, 3),
            new THREE.MeshLambertMaterial({ color: GRASS_COLOR, flatShading: true })
        );
        foundation.position.z = 1.5;
        foundation.receiveShadow = true;
        this.add(foundation);

        // Add fences at the left and right borders
        this.addFence(-TILES_PER_ROW / 2 * TILE_SIZE); // Left border
        this.addFence(TILES_PER_ROW / 2 * TILE_SIZE);  // Right border
    }

    private addFence(xPosition: number) {
        const fenceGroup = new THREE.Group();

        // Vertical posts
        const verticalPostGeometry = new THREE.BoxGeometry(4, 4, 20);
        const verticalPostMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513, flatShading: true });

        const leftPost = new THREE.Mesh(verticalPostGeometry, verticalPostMaterial);
        leftPost.position.set(xPosition, -20, 10);
        leftPost.castShadow = true;
        leftPost.receiveShadow = true;

        const rightPost = new THREE.Mesh(verticalPostGeometry, verticalPostMaterial);
        rightPost.position.set(xPosition, 20, 10);
        rightPost.castShadow = true;
        rightPost.receiveShadow = true;

        // Horizontal posts
        const horizontalPostGeometry = new THREE.BoxGeometry(5, 40, 2);

        const topPost = new THREE.Mesh(horizontalPostGeometry, verticalPostMaterial);
        topPost.position.set(xPosition, 0, 17.5);
        topPost.castShadow = true;
        topPost.receiveShadow = true;

        const bottomPost = new THREE.Mesh(horizontalPostGeometry, verticalPostMaterial);
        bottomPost.position.set(xPosition, 0, 7.5);
        bottomPost.castShadow = true;
        bottomPost.receiveShadow = true;

        // Add posts to the fence group
        fenceGroup.add(leftPost, rightPost, topPost, bottomPost);

        // Add the fence group to the grass
        this.add(fenceGroup);
    }
}