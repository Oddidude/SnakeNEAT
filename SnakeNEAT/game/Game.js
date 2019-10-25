class Game {
    constructor(brain) {
        this.player = new Player(brain)
        this.apple = new Apple(this.player.pos)

        this.score
    }

    mutate(innovationHistory) {
        this.player.mutate(innovationHistory)
    }

    crossover(otherGame) {
        return this.player.crossover(otherGame.player)
    }

    getFitness() {
        return (this.score * 100) + this.player.fitness
    }

    reset(brain) {
        this.player = new Player(brain)
        this.apple = new Apple(this.player.pos)
    }

    update() {
        this.player.update(this.apple)
    }

    draw() {
        this.player.draw()
        if (!this.player.dead) this.apple.draw()

        this.score = this.player.length - 3
    }
}