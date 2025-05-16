let next_id = 0;

export class Bomb{
    constructor(x, y, game){
        this.elm = document.createElement("div");
        this.x = x;
        this.y = y;
        this.game = game;

        this.speed = 400;

        this.elm.classList.add("enemy")
        game.elm.appendChild(this.elm);
        this.id = next_id++;
        game.enemies.push(this);
    }

    update(delta) {
        this.x -= this.speed * delta;

        if (this.x <= -50){
            this.destroy()
            this.game.add_score(5);
        }

        this.draw()
    }

    draw(){
        this.elm.style.left = `${this.x}px`;
        this.elm.style.bottom = `${this.y}px`;
    }

    destroy(){
        this.elm.remove()
        let id = this.game.enemies.findIndex(b => b.id === this.id);
        this.game.enemies.splice(id, 1);
    }
}