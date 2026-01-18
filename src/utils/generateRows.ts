import * as THREE from 'three';
import { MAX_TILE_INDEX, MIN_TILE_INDEX } from '../constants';
import { RowType, type MetaData, type MetaDataForest, type MetaDataTraffic } from '../components/Map';

export function generateRows(amount: number): MetaData[] {
  const rows: MetaData[] = [];
  let consecutiveCount = 0;
  let lastType: RowType | null = null;

  for (let i = 0; i < amount; i++) {
    let rowData: MetaData;

    // Ensure no more than 3 rows of the same type in a row
    if (consecutiveCount >= 3) {
      rowData = lastType === RowType.Foliage ? generateTrafficLaneMetadata() : generateForestMetadata();
      consecutiveCount = 1;
    } else {
      rowData = generateRow();
      if (rowData.type === lastType) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
      }
    }

    lastType = rowData.type;
    rows.push(rowData);
  }

  return rows;
}

function generateRow() {
  const type = randomElement(["traffic", "foliage"]);
  if (type === "traffic") return generateTrafficLaneMetadata();
  return generateForestMetadata();
}


function randomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateForestMetadata(): MetaDataForest {
  const occupiedTiles = new Set();
  const trees = Array.from({ length: 4 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(MIN_TILE_INDEX, MAX_TILE_INDEX);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = randomElement([20, 45, 30, 60]);

    return { tile_index: tileIndex, height };
  });

  return { type: RowType.Foliage, trees };
}

function generateTrafficLaneMetadata(): MetaDataTraffic {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188, 220]);

  const occupiedTiles = new Set();
  const amountOfVehicles = randomElement([3, 4, 5]);


  const vehicles = Array.from({ length: amountOfVehicles }, () => {
    let initialTileIndex;
    const type = randomElement(["car", "truck"]);
    do {
      initialTileIndex = THREE.MathUtils.randInt(MIN_TILE_INDEX, MAX_TILE_INDEX);
    } while (occupiedTiles.has(initialTileIndex));

      if(type === "car"){
        occupiedTiles.add(initialTileIndex - 1);
        occupiedTiles.add(initialTileIndex);
        occupiedTiles.add(initialTileIndex + 1);
      } else {
        occupiedTiles.add(initialTileIndex - 2);
        occupiedTiles.add(initialTileIndex - 1);
        occupiedTiles.add(initialTileIndex);
        occupiedTiles.add(initialTileIndex + 1);
        occupiedTiles.add(initialTileIndex + 2);
      }

    const color = randomElement([0x40e0d0, 0xffb6c1, 0x90ee90, 0xFFAE61,]);

    return { initial_tile_index: initialTileIndex, color, type };
  });

  return { type: RowType.Traffic, direction, speed, vehicles };
}