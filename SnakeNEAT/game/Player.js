const direction = {
    LEFT : 1,
    RIGHT : 2,
    UP : 3,
    DOWN : 4
}

class Player {
    constructor(brain) {
        this.pos = [createVector(250, 250)]
        this.length = 3

        this.colour = color("White")

        this.direction = direction.UP

        for (let i = 1; i < this.length; i++) {
            let head = this.pos[0]
            this.pos.push(head.copy().add(0, 10 * i))
        }

        this.distance
        this.dead = false

        this.vision = []
        this.brain = brain

        this.steps = 100
        this.fitness = 0

        this.score = 0
    }

    calculateFitness() {
        this.fitness =  (this.score * 100) + this.steps
    }

    mutate(innovationHistory) {
        this.brain.mutate(innovationHistory)
    }

    crossover(otherPlayer) {
        return this.brain.crossover(otherPlayer.brain)
    }

    turnRight() {
        switch (this.direction) {
            case direction.LEFT:
                this.direction = direction.UP
                break
            case direction.RIGHT:
                this.direction = direction.DOWN
                break
            case direction.UP:
                this.direction = direction.RIGHT
                break
            default:
                this.direction = direction.LEFT
                break
        }
    }

    turnLeft() {
        switch (this.direction) {
            case direction.LEFT:
                this.direction = direction.DOWN
                break
            case direction.RIGHT:
                this.direction = direction.UP
                break
            case direction.UP:
                this.direction = direction.LEFT
                break
            default:
                this.direction = direction.RIGHT
                break
        }
    }

    move(keyCode) {
        switch (keyCode) {
            case 37:
                if (!this.pos[0].copy().add(-10, 0).equals(this.pos[1])) {
                    this.direction = direction.LEFT
                }
                break
            case 39:
                if (!this.pos[0].copy().add(10, 0).equals(this.pos[1])) {
                    this.direction = direction.RIGHT
                }
                break
            case 38:
                if (!this.pos[0].copy().add(0, -10).equals(this.pos[1])) {
                    this.direction = direction.UP
                }
                break
            case 40:
                if (!this.pos[0].copy().add(0, 10).equals(this.pos[1])) {
                    this.direction = direction.DOWN
                }
                break
        }
    }

    getVision(apple) {
        /**
         * Neural Network inputs:
         * 0 : Left
         * 1 : Forward
         * 2 : Right
         * 
         * 3 : is left clear
         * 4 : is forward clear
         * 5 : is right clear
         */

        this.vision = [0, 0, 0, 0, 0, 0]
        let checkDirections

        switch (this.direction) {
            case direction.LEFT:
                checkDirections = [createVector(0, 10), createVector(-10, 0), createVector(0, -10)]
                break
            case direction.RIGHT:
                checkDirections = [createVector(0, -10), createVector(10, 0), createVector(0, 10)]
                break
            case direction.UP:
                checkDirections = [createVector(-10, 0), createVector(0, -10), createVector(10, 0)]
                break
            default:
                checkDirections = [createVector(10, 0), createVector(0, 10), createVector(-10, 0)]
                break
        }

        for (let i = 0; i < checkDirections.length; i++) {
            this.checkApple(checkDirections[i], i, apple)
        }

        if (!this.isDead(this.pos[0].copy().add(checkDirections[0]))) this.vision[3] = 1
        if (!this.isDead(this.pos[0].copy().add(checkDirections[1]))) this.vision[4] = 1
        if (!this.isDead(this.pos[0].copy().add(checkDirections[2]))) this.vision[5] = 1
    }

    checkApple(direc, visionIndex, apple) {
        let pos = this.pos[0].copy()

        while (!this.outOfBounds(pos) && this.vision[visionIndex] !== 1) {
            if (pos.add(direc).equals(apple.pos)) this.vision[visionIndex] = 1
        }
    }

    processData() {
        let result = this.brain.feedForward(this.vision)

        if (result[0] > result[1] && result[0] > result[2]) this.turnLeft()
        if (result[2] > result[0] && result[2] > result[1]) this.turnRight()
    }

    outOfBounds(pos) {
        return (pos.x < 0 ||
            pos.x > 490 ||
            pos.y < 0 ||
            pos.y > 490)
    }

    hitSelf(pos) {
        for (let i = 1; i < this.pos.length; i++) {
            if (pos.equals(this.pos[i])) return true
        }
        return false
    }

    isDead(pos = this.pos[0].copy()) {
        return (this.steps <= 1.5) ||
        this.outOfBounds(pos) ||
        this.hitSelf(pos)
    }

    checkEat(apple) {
        if (this.pos[0].equals(apple.pos)) {
            apple.move(this.pos)
            this.length++
            this.steps += 300
            this.score++
        }
    }

    clone() {
        return new Player(this.brain.clone())
    }

    update(apple) {
        if (!this.dead) {
            this.pos.unshift(this.pos[0].copy())

            switch (this.direction) {
                case direction.LEFT:
                    this.pos[0].add(createVector(-10, 0))
                    break
                case direction.RIGHT:
                    this.pos[0].add(createVector(10, 0))
                    break
                case direction.UP:
                    this.pos[0].add(createVector(0, -10))
                    break
                default:
                    this.pos[0].add(createVector(0, 10))
                    break
            }

            if (this.pos.length > this.length) this.pos.pop()

            this.distance = this.pos[0].dist(apple.pos)

            if (this.distance < this.pos[0].dist(apple.pos)) {
                this.steps++
            } else {
                this.steps -= 1.5
            }

            this.checkEat(apple)

            this.getVision(apple)
            this.processData()
        }
    }

    draw() {
        for (let i = 0; i < this.pos.length; i++) {
            if (!this.dead) {
                fill(this.colour)
            } else {
                fill(color(50, 50))
            }
            rect(this.pos[i].x, this.pos[i].y, 10, 10)
        }

        if (this.isDead()) {
            this.dead = true
            this.steps -= 100
        }
    }
}