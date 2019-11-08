class Species {
    constructor(player) {
        this.players = [player]
        this.fittest = player.fitness
        this.fittestPlayer = player
        this.avgFitness = 0
        this.staleness = 0
        this.identifier = player.brain.clone()

        this.excessDisjointCoEff = 1
        this.weigthDiffCoEff = 0.5
        this.threshold = 3

        this.colour = color(this.getColour(), this.getColour(), this.getColour())
    }

    getColour() {
        return Math.floor(Math.random() * 256)
    }

    setPlayerColour() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].colour = this.colour
        }
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

        for (let i = 0; i < this.players.length; i++) {
            avg += this.players[i].fitness
        }

        return avg / this.players.length
    }

    naturalSelection() {
        this.players.splice(this.players.length / 2, this.players.length)
    }

    sortByFitness() {
        if (this.players.length === 0) return

        let fitnessCopy = []

        fitnessCopy.push(this.players[0])
        for (let i = 1; i < this.players.length; i++) {
            fitnessCopy = this.findPos(fitnessCopy, this.players[i])
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

    findPos(fitnessCopy, player) {
        for (let j = 0; j < fitnessCopy.length; j++) {
            if (player.fitness < fitnessCopy[j].fitness) {
                fitnessCopy.splice(j, 0, player)
                return fitnessCopy
            }
        }
        fitnessCopy.push(player)
        return fitnessCopy
    }

    shareFitness() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].fitness /= this.players.length
        }
    }

    getRandomPlayer() {
        return this.players[Math.floor(Math.random() * this.players.length)]
    }

    makeChild(innovationHistory) {
        let child
        if (Math.random() < 0.25) {
            child = this.getRandomPlayer().brain.clone()
        } else {
            let parent1 = this.getRandomPlayer()
            let parent2
            do {
                parent2 = this.getRandomPlayer()
            } while (parent1 === parent2)

            child = parent1.fitness > parent2.fitness ? parent1.brain.crossover(parent2) : parent2.brain.crossover(parent1)
        }

        child.mutate(innovationHistory)
        child = new Player(child)
        console.log(child)
        this.players.push(child)
        return child
    }
}