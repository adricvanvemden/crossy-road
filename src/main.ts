import * as THREE from 'three';
import { Camera } from './components/Camera.ts';
import { Renderer } from './components/Renderer.ts';
import { player } from './components/Player.ts';
import './style.css';
import { Map } from './components/Map.ts';
import { DirectionalLight } from './components/DirectionalLight.ts';
import './controllers/user-controller.ts';
import { hitTest } from './utils/hitTest.ts';

const canvas  = document.getElementById('game-canvas') as HTMLCanvasElement 

const scene = new THREE.Scene();
scene.add(player);
scene.add(Map.map);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const dirLight = new DirectionalLight();
dirLight.target = player;
player.add(dirLight);

const camera = new Camera();
player.add(camera);

const scoreDOM = document.getElementById("score");
const resultDOM = document.getElementById("result-container");


document.getElementById('restart-button')?.addEventListener('click', initializeGame);


function initializeGame() {
  player.reset();
  Map.initializeMap();

  // Initialize UI
  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";
}

initializeGame();
const renderer = new Renderer(canvas);
renderer.setAnimationLoop(animate);

function animate(){
    Map.update();
    player.update();
    hitTest();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    // Update camera dimensions
    const viewRatio = window.innerWidth / window.innerHeight;
    const size = 300;
    const width = viewRatio < 1 ? size : size * viewRatio;
    const height = viewRatio < 1 ? size / viewRatio : size;

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});