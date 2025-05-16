export class Player {
    constructor(x, y, elm) {
        this.elm = elm;
        //Position
        this.x = x;
        this.y = y;

        //Velocity
        this.vy = 0;

        //Controllers
        this.direction = 0;
        this.isJumping = false;
        this.groundY = 0;

        //Constants
        this.speed = 200;

        this.gravity = 1200;
        this.jumpForce = 500;
    }

    update(delta) {
        //this.handleJump(delta);

        this.x += this.direction * this.speed * delta;
        this.y += this.vy * delta;

        if (this.y <= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isJumping = false;
        } else {
            this.vy -= this.gravity * delta;
        }

        this.draw()
    }

    handleJump(delta) {
        if (this.isJumping) {
            this.vy -= this.gravity * delta;
        }
    }

    handleInput(keys) {
        this.direction = (+!!keys["KeyD"]) - (+!!keys["KeyA"]);
        if (keys["Space"] && !this.isJumping) {
            this.isJumping = true
            this.vy = this.jumpForce;
        }
    }

    draw(){
        this.elm.style.left = `${this.x}px`;
        this.elm.style.bottom = `${this.y}px`;
        if (this.direction !== 0)
            this.elm.style.transform = `scaleX(${-this.direction})`;
    }
}