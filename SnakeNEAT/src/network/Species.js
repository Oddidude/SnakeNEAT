class Species {
    constructor(player) {
        this.players = [player]
        this.fittest = player.fitness
        this.fittestPlayer = player
        this.avgFitness = 0
        this.staleness = 0
        this.identifier = player.brain.clone()

        this.excessDisjointCoEff = 2
        this.weigthDiffCoEff = 0.5
        this.threshold = 2

        this.colour = color(this.getColour(), this.getColour(), this.getColour())
    }

    getColour() {
        return Math.floor(Math.random() * 256)
    }

    excessDisjointDiff(otherBrain) {
        let match = 0

        for (let i = 0; i < this.identifier.edges.length; i++) {
            for (let j = 0; j < otherBrain.edges.length; j++) {
                if (this.identifier.edges[i].innovation === otherBrain.edges[j].innovation) match++
            }
        }

        return (this.identifier.edges.length + otherBrain.edges.length) - (2 * match)
    }

    weightDiff(otherBrain) {
        let match = 0
        let weightDiff = 0

        for (let i = 0; i < this.identifier.edges.length; i++) {
            for (let j = 0; j < otherBrain.edges.length; j++) {
                if (this.identifier.edges[i].innovation === otherBrain.edges[j].innovation) {
                    match++
                    weightDiff += Math.abs(otherBrain.edges[j].weight - this.identifier.edges[i].weight)
                }
            }
        }

        if (match === 0) return 100
        return weightDiff / match
    }

    compatible(brain) {
        let compatibility
        let excessDisjointDiff = this.excessDisjointDiff(brain)
        let weightDiff = this.weightDiff(brain)

        let normalizer = Math.max(1, brain.edges.length - 20)

        compatibility = ((excessDisjointDiff * this.excessDisjointCoEff) / normalizer) + 
            (weightDiff * this.weigthDiffCoEff)

        return compatibility < this.threshold
    }

    getAvgFitness() {
        let avg = 0
        for (let i = 0; i < this.players.length; i++) avg += this.players[i].fitness

        this.avgFitness = avg / this.players.length
    }

    naturalSelection() {
        if (this.players.length > 2) this.players.splice(this.players.length / 2, this.players.length)
    }

    sortByFitness() {
        if (this.players.length === 0) return

        let fitnessCopy = [this.players[0]]

        for (let i = 1; i < this.players.length; i++) {
            for (let index = 0; index < fitnessCopy.length; index++) {
                if (fitnessCopy[index].fitness > this.players[i].fitness) {
                    fitnessCopy.splice(index, 0, this.players[i])
                    break
                }
            }
        }

        this.players = fitnessCopy

        if (this.players[0].fitness > this.fittest) {
            this.fittest = this.players[0].fitness
            this.fittestPlayer = this.players[0]
            this.identifier = this.players[0].clone()
        } else {
            this.staleness++
        }
    }

    shareFitness() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].fitness /= this.players.length
        }
    }

    getRandomPlayer() {
        let totalFitness = 0
        for (let i = 0; i < this.players.length; i++) totalFitness += Math.abs(this.players[i].fitness)

        let target = Math.floor(Math.random() * totalFitness)
        let sum = 0

        for (let i = 0; i < this.players.length; i++) {
            sum += Math.abs(this.players[i].fitness)
            if (sum > target) return this.players[i]
        }
        console.log("Not selected", target, sum)
    }

    makeChild() {
        let child
        if (Math.random() < 0.25) {
            child = this.getRandomPlayer().brain.clone()
        } else {
            let parent1 = this.getRandomPlayer()
            let parent2 = this.getRandomPlayer()

            child = parent1.fitness > parent2.fitness ? parent1.brain.crossover(parent2.brain) : parent2.brain.crossover(parent1.brain)
        }

        child = new Player(child)
        child.colour = this.colour
        this.players.push(child)
        return child
    }
}