class Population {
    constructor() {
        this.innovationHistory = new InnovationHistory()
        this.generation = 1
        
        this.fitNet
        
        this.mutationRate = 0.6
        this.mutationNumber = 5
        
        this.players = []
        this.games = []
        this.maxSnakes = 30
        
        this.species = []
        
        this.currentScore = 0
        this.highscore = 0

        for (let i = 0; i < this.maxSnakes; i++) this.players.push(new Player(new Network(6, 3, this.innovationHistory)))
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
            }
        }

        while (children.length < this.players.length) {
            children.push(new Player(new Network(6, 3, this.innovationHistory)))
        }

        this.players.splice(0, this.players.length, [...children])

        this.generation++
        this.currentScore = 0

        for (let i = 0; i < this.players.length; i++) this.speciate(this.players[i])
        for (let i = 0; i < this.species.length; i++) this.species[i].setPlayerColour()
        console.log(this.players)
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

    startGames() {
        this.games.splice(0, this.games.length)
        for (let i = 0; i < this.players.length; i++) {
            this.games.push(new Game(this.players[i]))
        }
    }
}
