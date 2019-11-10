const width = 500
const height = 600

var manual = false

var population;

function setup() {
    frameRate(60)
    createCanvas(width, height)
    population = new Population()
}

function keyPressed() {
    if (manual) {
        switch (keyCode) {
            case 71:
                for (let i = 0; i < population.games.length; i++) {
                    population.games[i].player.turnLeft()
                }
                break
            case 72:
                for (let i = 0; i < population.games.length; i++) {
                    population.games[i].player.turnRight()
                }
                break
            default:
                for (let i = 0; i < population.games.length; i++) {
                    population.games[i].reset()
                }
                break
        }

        for (let i = 0; i < population.games.length; i++) {
            population.games[i].player.move(keyCode)
        }
    }

    if (keyCode === 71 && !manual) population.fitNet.printConsole()
    if (keyCode === 81) noLoop()
}

function draw() {
    background(140)
    for (let i = 0; i < population.games.length; i++) {
        if (!population.games[i].player.dead) {
            population.games[i].update()
        }

        population.games[i].draw()

        if (population.games[i].player.score > population.currentScore) {
            population.currentScore = population.games[i].player.score
            population.fitNet = population.games[i].player.brain.clone()
        }
        if (population.games[i].player.score > population.highscore) population.highscore = population.games[i].player.score
    }

    population.draw(width, height)

    if (population.allDead()) population.evolve()
}
