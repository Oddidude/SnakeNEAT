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
            this.mutate(this.players[i])
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
        this.species = []
        for (let i = 0; i < this.players.length; i++) this.findSpecies(this.players[i])
        this.calculateFitness()
        this.sortSpecies()

        let fitnessAvgSum = 0
        for (let i = 0; i < this.species.length; i++) {
            this.species[i].naturalSelection()
            this.species[i].getAvgFitness()
            fitnessAvgSum += this.species[i].avgFitness
        }
        this.removeRedundant(fitnessAvgSum)

        let children = []

        for (let i = 0; i < this.species.length; i++) {
            children.push(this.species[i].fittestPlayer.clone())
            children[children.length - 1].colour = this.species[i].colour

            let maxChildren = Math.floor((this.species[i].avgFitness / fitnessAvgSum * this.players.length) - 1)
            for (let j = 0; j < maxChildren; j++) {
                children.push(this.species[i].makeChild())
                this.mutate(children[children.length - 1].brain)
            }
        }

        while (children.length < this.maxSnakes) {
            if (Math.random() < 0.25) {
                children.push(new Player(new Network(6, 3, this.innovationHistory)))
            } else {
                children.push(this.species[0].makeChild())
            }
            this.mutate(children[children.length - 1].brain)
        }

        this.players = children

        this.generation++
        this.currentScore = -1

        this.startGames()
    }

    calculateFitness() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].calculateFitness()
        }
        for (let i = 0; i < this.species.length; i++) {
            this.species[i].shareFitness()
        }
    }

    findSpecies(player) {
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

        let fitnessCopy = [this.species[0]]

        for (let i = 1; i < this.species.length; i++) {
            for (let index = 0; index < fitnessCopy.length; index++) {
                if (fitnessCopy[index].fittest > this.species[i].fittest) {
                    fitnessCopy.splice(index, 0, this.species[i])
                    break
                }
            }
        }

        this.species = fitnessCopy
    }

    removeRedundant(fitnessAvgSum) {
        for (let i = 0; i < this.species.length; i++) {
            if (i >= 2 && this.species[i].staleness > 15) {
                this.species.splice(i, 1)
                i--
            }
            if (this.species[i].avgFitness / fitnessAvgSum * this.players.length - 1 < 1) {
                this.species.splice(i, 1)
                i--
            }
        }
    }

    mutate(brain) {
        for (let i = 0; i < this.mutationNumber; i++) {
            if (Math.random() < this.mutationRate) brain.mutate(this.innovationHistory)
        }
    }

    startGames() {
        this.games = []
        for (let i = 0; i < this.players.length; i++) {
            this.games.push(new Game(this.players[i]))
        }
    }
    drawStats(x, y) {
        let size = 20
        x += 2
        strokeWeight(0)
        fill("Black")
        textSize(size)
        text("Generation: " + this.generation, x, y + size)
        text("Score: " + this.currentScore, x, y + (2 * size))
        text("Highest: " + this.highscore, x, y + (3 * size))
        text("Species: " + this.species.length, x, y + (4 * size))
        strokeWeight(1)
    }

    draw(x, y, w, h, nodeSize = 5) {
        let canvasWidth = x + w
        let canvasHeight = y + h
        let statsSize = 200

        fill("White")
        rect(0, canvasHeight - h, canvasWidth, h)

        fill("Black")
        line(statsSize - 5 - nodeSize, y, statsSize - 5 - nodeSize, canvasHeight)

        this.drawStats(x, y)
        this.fitNet.draw(x + statsSize, y, w - (statsSize + 10), h, nodeSize)
    }
}
