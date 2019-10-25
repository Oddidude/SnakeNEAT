const width = 500
const height = 500

var innovationHistory = new InnovationHistory()
var generation = 1

var fitNet

var mutationRate = 0.6
var mutationNumber = 5

var games = []
var maxSnakes = 50

var manual = false

var currentScore = 0
var highscore = 0

function setup() {
    frameRate(60)

    createCanvas(width, height)

    for (let i = 0; i < maxSnakes; i++) {
        games.push(new Game(new Network(6, 3, innovationHistory)))
    }
}

function keyPressed() {
    if (manual) {
        switch (keyCode) {
            case 71:
                for (let i = 0; i < games.length; i++) {
                    games[i].player.turnLeft()
                }
                break
            case 72:
                for (let i = 0; i < games.length; i++) {
                    games[i].player.turnRight()
                }
                break
            default:
                for (let i = 0; i < games.length; i++) {
                    games[i].reset()
                }
                break
        }

        for (let i = 0; i < games.length; i++) {
            games[i].player.move(keyCode)
        }
    }

    if (keyCode === 71 && !manual) fitNet.player.brain.printConsole()
    if (keyCode === 81) noLoop()
}

function allDead() {
    for (let i = 0; i < games.length; i++) {
        if (!games[i].player.dead) return false
    }
    return true
}

function evolve() {
    let fitnesses = []

    for (let i = 0; i < games.length; i++) {
        fitnesses.push(games[i].getFitness())
    }
    

    let max = Math.max(...fitnesses)
    fitNet = games[fitnesses.indexOf(max)]
    fitnesses.splice(fitnesses.indexOf(max), 1)
    let fitNet2 = games[fitnesses.indexOf(Math.max(...fitnesses))]
    /*
    for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < games[i].getFitness(); j++) {
            fitnesses.push(games[i])
        }
    }

    let fitNetPos = Math.floor(Math.random() * fitnesses.length)
    let fitNet = fitnesses[fitNetPos]
    fitnesses.splice(fitNetPos, 1)
    let fitNet2 = fitnesses[Math.floor(Math.random() * fitnesses.length)]
    */

    let fitBrain = fitNet.player.brain
    let fitBrain2 = fitNet2.player.brain
    let child = fitBrain.crossover(fitBrain2)

    games[0].reset(fitBrain)
    games[1].reset(fitBrain2)

    for (let i = 2; i < 15; i++) games[i].reset(fitBrain.clone())

    for (let i = 15; i < games.length; i++) games[i].reset(child)
    
    for (let i = 2; i < games.length; i++) {
        for (let mutation = 0; mutation < mutationNumber; mutation++) {
            if (Math.random() < mutationRate) {
                games[i].mutate(innovationHistory)
            }
        }
    }

    generation++
    currentScore = 0
}

function draw() {
    background(140)
    for (let i = 0; i < games.length; i++) {
        if (!games[i].player.dead) {
            games[i].update()
        }

        games[i].draw()

        if (games[i].score > currentScore) currentScore = games[i].score
        if (games[i].score > highscore) highscore = games[i].score
    }

    textSize(22)
    fill(color(255, 255, 255, 100))
    text("Generation: " + generation, 5, 22)
    text("Score: " + currentScore, 5, 44)
    text("Highest: " + highscore, 5, 66)

    if (allDead()) evolve()
}
