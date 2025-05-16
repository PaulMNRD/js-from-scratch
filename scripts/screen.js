import {Game} from "./game.js";

export const GAME = document.getElementById("game");
export const PLAYER = document.getElementById("player");
export const GAME_OVER_SCREEN = document.getElementById("game-over-screen");
export const START_SCREEN = document.getElementById("start-screen");

//INPUTS
export const KEYS = {}
window.addEventListener("keydown", (e) => {
    KEYS[e.code] = true;
});
window.addEventListener("keyup", (e) => {
    KEYS[e.code] = false;
});

//VIES ET SCORE
const LIVES = document.getElementById("lives-display");
const SCORE =  document.getElementById("score-display");
export function update_hud(state) {
    LIVES.textContent = `Score: ${state.score}`;
    SCORE.textContent = "❤️".repeat(state.lives);
}

//MENUS
const RESTART_BTN = document.getElementById("restart-button");
const START_BTN = document.getElementById("start-button");
const CHARACTERS_SELECTORS = document.querySelectorAll(".character:not(#character-select)")
const CHARACTERS_SELECTOR = document.getElementById("character-select");
export const AUDIO = new Audio("assets/music.mp3");
AUDIO.loop = true;
AUDIO.volume = 0.1;
RESTART_BTN.addEventListener("click", () => {
    GAME_OVER_SCREEN.classList.add('hidden');
    AUDIO.play();
    new Game();
});
START_BTN.addEventListener("click", () => {
    PLAYER.dataset.character = CHARACTERS_SELECTOR.dataset.character;
    START_SCREEN.classList.add('hidden');
    GAME.classList.remove('hidden');
    AUDIO.play();
    new Game();
});
CHARACTERS_SELECTORS.forEach(char => {
    char.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", e.target.dataset.character);
    });
})

CHARACTERS_SELECTOR.addEventListener("dragover", e => {
    e.preventDefault();
});
CHARACTERS_SELECTOR.addEventListener("drop", e => {
    const sel_char = e.dataTransfer.getData("text/plain");
    CHARACTERS_SELECTORS.forEach(char => {
        if (char.dataset.character === sel_char) {
            char.classList.add("rotate")
            return
        }
        char.classList.remove("rotate")
    });
    e.target.dataset.character = sel_char;
})

export const PLATFORMS = document.querySelectorAll(".platform");

const BEST_SCORE = document.getElementById("best-score");
const AVERAGE_SCORE = document.getElementById("average-score");
const WON_NUMBER = document.getElementById("won-number");
const MOST_PLAYED = document.getElementById("most-played");
const history = JSON.parse(localStorage.getItem("history")) || [];
export function writeStats(score) {
    let character = CHARACTERS_SELECTOR.dataset.character
    history.push({character, score})

    const won_number = history.filter(h => h.score > 200).length;
    const best_score = history.map(h => h.score)
        .reduce((max, s) => Math.max(max, s), 0)
    const average_score = history.reduce((sum, h) => sum + h.score, 0) / history.length;
    const chars= history.map(h => h.character)
        .reduce((acc, character) => {
        acc[character] = (acc[character] || 0) + 1;
        return acc;
    }, {})
    const most_played = Object.entries(chars)
        .reduce((max, [char, count]) => {
            return count > max[1] ? [char, count] : max;
        }, ["", 0]);

    BEST_SCORE.textContent = `Meilleur Score: ${best_score}`;
    AVERAGE_SCORE.textContent = `Score Moyen: ${average_score.toFixed(1)}`;
    WON_NUMBER.textContent = `Nombre de victoire: ${won_number}`;
    MOST_PLAYED.textContent = `Personnage le plus joué: ${most_played[0]} (${most_played[1]})`;

    localStorage.setItem("history", JSON.stringify(history));
}