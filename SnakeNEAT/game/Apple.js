class Apple {
    constructor(snakePos){
        this.pos = createVector(0, 0)

        this.move(snakePos)
    }

    move(snakePos) {
        do {
            this.pos.set(
                Math.floor((Math.random() * 0.49) * 100) * 10,
                Math.floor((Math.random() * 0.49) * 100) * 10,
            )
        } while(this.inSnake(snakePos))
    }

    inSnake(snakePos) {
        for (let i = 0; i < snakePos.length; i++) {
            if (this.pos.equals(snakePos[i])) return true
        }
        return false
    }

    draw() {
        fill("Red")
        rect(this.pos.x, this.pos.y, 10, 10)
    }
}