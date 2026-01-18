import { Map } from "../components/Map";
import { player } from "../components/Player";

export function bindInputs() {
    const directions = ['up', 'down', 'left', 'right'] as const;

    directions.forEach(dir => {
        document.getElementById(dir)?.addEventListener('click', () => player.handleInput(dir));
    });

    window.addEventListener('keydown', (e) => {
        e.preventDefault();
        switch(e.key) {
            case 'ArrowUp':
            case 'w': player.handleInput('up'); break;
            case 'ArrowDown':
            case 's': player.handleInput('down'); break;
            case 'ArrowLeft':
            case 'a': player.handleInput('left'); break;
            case 'ArrowRight':
            case 'd': player.handleInput('right'); break;
            case 'Enter':
                player.reset();
                Map.initializeMap();
                const scoreDOM = document.getElementById("score");
                const resultDOM = document.getElementById("result-container");
                if (scoreDOM) scoreDOM.innerText = "0";
                if (resultDOM) resultDOM.style.visibility = "hidden";
                break;
        }
    });
}