const width = 500;
const height = 600;

var drawFittest = false;
var statsOnly = false;
var pause = false;

var population;

function setup() {
  frameRate(60);
  var canvas = createCanvas(width, height);
  canvas.parent("game");
  population = new Population();
}

function keyPressed() {
  switch (keyCode) {
    case 70:
      population.fitNet.printConsole();
      break;
    case 72:
      drawFittest = !drawFittest;
      break;
    case 74:
      statsOnly = !statsOnly;
      break;
    case 80:
      pause = !pause;
      break;
    case 81:
      noLoop();
  }
}

function draw() {
  if (!pause) {
    background(140);
    for (let i = 0; i < population.games.length; i++) {
      if (!population.games[i].player.dead) population.games[i].update();

      if (population.games[i].player.score > population.currentScore) {
        population.currentScore = population.games[i].player.score;
        population.fitNet = population.games[i].player.brain.clone();
      }
      if (population.games[i].player.score > population.highscore)
        population.highscore = population.games[i].player.score;
    }

    if (population.allDead()) population.evolve();

    if (!statsOnly) {
      for (let i = 0; i < population.games.length; i++) {
        if (drawFittest) {
          if (!population.games[i].player.dead) {
            population.games[i].draw();
            break;
          }
        } else {
          population.games[i].draw();
        }
      }
      population.draw(0, height - 100, width, 100);
    } else {
      population.draw(0, 0, width, height, 15);
    }
  }
}
