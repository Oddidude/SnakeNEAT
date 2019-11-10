class Game {
    constructor(player) {
        this.player = player
        this.apple = new Apple(this.player.pos)
    }

    mutate(innovationHistory) {
        this.player.mutate(innovationHistory)
    }

    crossover(otherGame) {
        return this.player.crossover(otherGame.player)
    }

    getFitness() {
        return this.player.getFitness()
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
    }
}