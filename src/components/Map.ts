
import * as THREE from 'three';
import { Grass } from './Grass.ts';
import { Tree } from './Tree.ts';
import { Road } from './Road.ts';
import { Car } from './Car.ts';
import { generateRows } from '../utils/generateRows.ts';
import { MAX_TILE_INDEX, MIN_TILE_INDEX, TILE_SIZE } from '../constants.ts';
import { Truck } from './Truck.ts';


export const RowType = {
  Foliage: 'foliage',
  Traffic: 'traffic',
} as const;

export type RowType = typeof RowType[keyof typeof RowType];

export type MetaDataForest = {
    type: typeof RowType.Foliage;
    trees: { tile_index: number; height: number }[];
}

export type MetaDataTraffic = {
    type: typeof RowType.Traffic;
    direction: boolean;
    speed: number;
    vehicles: {type: "car" | "truck"; initial_tile_index: number; color: number; ref?: Car | Truck }[];
}

export type MetaData = MetaDataForest  | MetaDataTraffic;

const clock = new THREE.Clock();

class MapManager {
    public readonly map = new THREE.Group();
    public readonly metaData: MetaData[] = [];

initializeMap() {
    // Create the central world
    const centralWorld = new THREE.Group();
    for (let rowIndex = 0; rowIndex > -13; rowIndex--) {
        const grass = new Grass(rowIndex);
        centralWorld.add(grass);
    }
    this.map.add(centralWorld);

    // Create the left duplicate
    const leftWorld = centralWorld.clone();
    leftWorld.position.x = -((MAX_TILE_INDEX - MIN_TILE_INDEX + 1) * TILE_SIZE);
    this.map.add(leftWorld);

    // Create the right duplicate
    const rightWorld = centralWorld.clone();
    rightWorld.position.x = (MAX_TILE_INDEX - MIN_TILE_INDEX + 1) * TILE_SIZE;
    this.map.add(rightWorld);

    this.addRows();
    return this.map;
}

    addRows(count: number = 20) {
        const newRows = generateRows(count);
        const startIndex = this.metaData.length;
        this.metaData.push(...newRows);

        newRows.forEach((rowData, rowIndex) => {
            const rowIndexPosition = startIndex + rowIndex + 1;

            if (rowData.type === RowType.Foliage) {
                const row = new Grass(rowIndexPosition);

                rowData.trees?.forEach(({ tile_index, height }) => {
                    const tree = new Tree(tile_index, height);
                    row.add(tree);
                });

                const leftRow = row.clone();
                leftRow.position.x = -((MAX_TILE_INDEX - MIN_TILE_INDEX + 1) * TILE_SIZE);
                this.map.add(leftRow);

                const rightRow = row.clone();
                rightRow.position.x = (MAX_TILE_INDEX - MIN_TILE_INDEX + 1) * TILE_SIZE;
                this.map.add(rightRow);

                this.map.add(row);
            }

            if (rowData.type === 'traffic') {
                const row = new Road(rowIndexPosition);
                const leftRow = row.clone();
                leftRow.position.x = -((MAX_TILE_INDEX - MIN_TILE_INDEX + 1) * TILE_SIZE);

                const rightRow = row.clone();
                rightRow.position.x = (MAX_TILE_INDEX - MIN_TILE_INDEX + 1) * TILE_SIZE;

                rowData.vehicles?.forEach((vehicle) => {
                    if(vehicle.type === "car"){
                        const car = new Car(vehicle.initial_tile_index, rowData.direction, vehicle.color);
                        vehicle.ref = car;
                        row.add(car);
                    } else {
                        const truck = new Truck(vehicle.initial_tile_index, rowData.direction, vehicle.color);
                        vehicle.ref = truck;
                        row.add(truck);
                    }
                });

                this.map.add(row);
                this.map.add(leftRow);
                this.map.add(rightRow);
            }
        });
    }

    public update() {
        this.animateVehicles();
    }

    private animateVehicles(){
        const delta  = clock.getDelta();
    
        Map.metaData.forEach((row) => {
            if(row.type === 'traffic'){
                const beginningPosition = (MIN_TILE_INDEX - 6) * TILE_SIZE;
                const endPosition = ( MAX_TILE_INDEX + 6) * TILE_SIZE;
    
                row.vehicles?.forEach(({ ref }) => {
                    if (!ref) return;
    
                    if (row.direction) {
                        ref.position.x = ref.position.x > endPosition ? beginningPosition : ref.position.x + row.speed * delta;
                    }else{
                        ref.position.x = ref.position.x < beginningPosition ? endPosition : ref.position.x - row.speed * delta;
                    }
                });
            }
        })
    }
}

export const Map = new MapManager();
