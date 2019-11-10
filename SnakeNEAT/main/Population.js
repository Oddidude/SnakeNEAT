class Population {
    constructor() {
        this.innovationHistory = new InnovationHistory()
        this.generation = 1
        
        this.mutationRate = 0.6
        this.mutationNumber = 5
        
        this.players = []
        this.games = []
        this.maxSnakes = 30
        
        this.species = []
        
        this.currentScore = 0
        this.highscore = 0

        for (let i = 0; i < this.maxSnakes; i++) {
            this.players.push(new Player(new Network(6, 3, this.innovationHistory)))
            this.players[i].mutate(this.innovationHistory)
        }

        this.fitNet = this.players[0].brain.clone()

        this.startGames()
    }

    allDead() {
        for (let i = 0; i < this.games.length; i++) {
            if (!this.games[i].player.dead) return false
        }
        return true
    }

    evolve() {
        for (let i = 0; i < 10; i++) this.players[0].mutate(this.innovationHistory)
        this.species = []
        let fitnessAvgSum
        for (let i = 0; i < this.species.length; i++) fitnessAvgSum += this.species[i].getAvgFitness()

        for (let i = 0; i < this.players.length; i++) this.speciate(this.players[i])
        this.calculateFitness()
        this.sortSpecies()
        this.removeRedundant(fitnessAvgSum)

        let children = []

        for (let i = 0; i < this.species.length; i++) {
            children.push(this.species[i].fittestPlayer.clone())

            let maxChildren = Math.floor(this.species[i].getAvgFitness / fitnessAvgSum * this.players.length - 1)
            for (let j = 0; j < maxChildren; i++) {
                children.push(species[i].makeChild(this.innovationHistory))
                this.mutate(children[children.length - 1])
            }
        }

        while (children.length < this.players.length) {
            children.push(new Player(new Network(6, 3, this.innovationHistory)))
        }

        this.players = children


        this.generation++
        this.currentScore = -1

        for (let i = 0; i < this.players.length; i++) this.speciate(this.players[i])
        for (let i = 0; i < this.species.length; i++) {
            this.species[i].setPlayerColour()
        }
        this.startGames()
    }

    calculateFitness() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].calculateFitness()
        }
    }

    speciate(player) {
        for (let j = 0; j < this.species.length; j++) {
            if (this.species[j].compatible(player.brain)) {
                this.species[j].players.push(player)
                return
            }
        }
        this.species.push(new Species(player))
    }

    sortSpecies() {
        for (let i = 0; i < this.species.length; i++) {
            this.species[i].sortByFitness()
            this.species[i].shareFitness()
            this.species[i].getAvgFitness()
        }
    }

    removeRedundant(fitnessAvgSum) {
        for (let i = 0; i < this.species.length; i++) {
            this.species[i].naturalSelection()
            if (i >= 2 && this.species[i].staleness > 15) this.species.splice(i, 0)
            if (this.species[i].getAvgFitness() / fitnessAvgSum * this.players.length < 1) this.species.splice(i, 1)
        }
    }

    mutate(brain) {
        for (let i = 0; i < this.mutationNumber; i++) {
            if (Math.random() < this.mutationRate) brain.mutate(this.innovationHistory)
        }
    }

    startGames() {
        this.games.splice(0, this.games.length)
        for (let i = 0; i < this.players.length; i++) {
            this.games.push(new Game(this.players[i]))
        }
    }
    drawStats(y) {
        let size = 20
        y -= 100
        strokeWeight(0)
        fill("Black")
        textSize(size)
        text("Generation: " + population.generation, 2, y + size)
        text("Score: " + population.currentScore, 2, y + (2 * size))
        text("Highest: " + population.highscore, 2, y + (3 * size))
        text("Species: " + population.species.length, 2, y + (4 * size))
        strokeWeight(1)
    }

    draw(x, y) {
        let size = 100
        fill("White")
        rect(0, y - size, x, size)
        this.drawStats(y)
        this.fitNet.draw(y)
    }
}
