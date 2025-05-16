import {Player} from "./player.js";
import {AUDIO, GAME, GAME_OVER_SCREEN, KEYS, PLATFORMS, PLAYER, update_hud, writeStats} from "./screen.js";
import {check_collision, check_collision_above} from "./utils.js";
import {Bomb} from "./bomb.js";

const FIXED_TIME_STEP = 1000 / 60;

export class Game {
    constructor() {
        this.elm = GAME;
        this.state = {
            score: 0,
            lives: 3,
            gameOver: false,
        }
        this.player = new Player(50, 0, PLAYER);
        this.enemies = [];
        this.timestamp = 0;

        this._loop()
        this._spawn_bomb_loop()
        this._increase_score_loop()
    }

    _loop() {
        let game = this;
        game.timestamp = performance.now();
        (function run() {
            let now = performance.now();
            let delta = (now - game.timestamp) / 1000;
            game.timestamp = now;

            game.player.update(delta);
            game.player.handleInput(KEYS);
            game.enemies.forEach(e => {
                if (check_collision(game.player.elm, e.elm) && !game.state.gameOver) {
                    e.destroy();
                    game.loose_life();
                }
                e.update(delta);
            })
            for(let platform of PLATFORMS) {
                if(check_collision_above(game.player.elm, platform)){
                    game.player.groundY = game.player.y;
                    break;
                } else {
                    game.player.groundY = 0;
                }
            }

            update_hud(game.state);

            if(!game.state.gameOver) {
                setTimeout(run, FIXED_TIME_STEP);
            }
        })();
    }

    _spawn_bomb_loop() {
        let game = this;
        (function run() {
            let bomb = new Bomb(800, 0, game);
            let highBomb = new Bomb(1200, 90, game);
            let difficulty = game.get_difficulty()

            if (bomb.elm.previousElementSibling?.classList.contains("enemy") && bomb.y === 0) {
                bomb.speed *= difficulty;
            }

            highBomb.speed = (Math.floor(Math.random() * (highBomb.speed * difficulty - 100)) + 100) ;

            if(!game.state.gameOver) {
                setTimeout(run, 3000 / difficulty);
            }
        })();
    }

    get_difficulty() {
        if (this.state.score > 100) return 2;
        if (this.state.score > 50) return 1.5;
        return 1;
    }

    _increase_score_loop() {
        let game = this;
        (function run() {
            game.add_score(1)

            if (!game.state.gameOver) {
                setTimeout(run, 1000)
            }
        })();
    }

    add_score(score){
        this.state.score += score;
    }
    game_over() {
        this.enemies.slice().forEach(e => e.destroy());
        this.state.gameOver = true;
        writeStats(this.state.score);
        GAME_OVER_SCREEN.classList.remove("hidden");
        AUDIO.pause();
    }
    loose_life(){
        this.state.lives--;
        if (this.state.lives <= 0) {
            this.game_over()
        }
    }
}