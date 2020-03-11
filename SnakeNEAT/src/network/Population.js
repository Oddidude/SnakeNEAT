class Population {
  constructor() {
    this.innovationHistory = new InnovationHistory();
    this.generation = 1;

    this.mutationNumber = 4;

    this.threshold = 3;
    this.thresholdModifier = 0.3;
    this.targetSpeciesSize = 5;

    this.players = [];
    this.games = [];
    this.maxSnakes = 30;

    this.species = [];

    this.currentScore = 0;
    this.highscore = 0;

    for (let i = 0; i < this.maxSnakes; i++) {
      this.players.push(new Player(new Network(6, 3, this.innovationHistory)));
      this.mutate(this.players[i]);
    }

    this.fitNet = this.players[0].brain.clone();

    this.startGames();
  }

  allDead() {
    for (let i = 0; i < this.games.length; i++) {
      if (!this.games[i].player.dead) return false;
    }
    return true;
  }

  evolve() {
    for (let i = 0; i < this.species.length; i++) this.species[i].players = [];
    for (let i = 0; i < this.players.length; i++)
      this.findSpecies(this.players[i]);

    if (this.species.length < this.targetSpeciesSize) {
      this.threshold = Math.max(0, this.threshold - this.thresholdModifier);
    }
    if (this.species.length > this.targetSpeciesSize) {
      this.threshold += this.thresholdModifier;
    }
    this.calculateFitness();
    this.sortSpecies();

    let fitnessAvgSum = 0;
    for (let i = 0; i < this.species.length; i++) {
      this.species[i].naturalSelection();
      if (this.species[i].players.length <= 0) {
        this.species.splice(i, 1);
      } else {
        this.species[i].getAvgFitness();
        fitnessAvgSum += this.species[i].avgFitness;
      }
    }
    this.removeRedundant(fitnessAvgSum);

    let children = [];
    children.push(this.players[0].clone());

    for (let i = 0; i < this.species.length; i++) {
      children.push(this.species[i].fittestPlayer.clone());
      children[children.length - 1].colour = this.species[i].colour;

      let maxChildren = Math.floor(
        (this.species[i].avgFitness / fitnessAvgSum) * this.players.length - 1
      );
      for (let j = 0; j < maxChildren; j++) {
        children.push(this.species[i].makeChild());
        this.mutate(children[children.length - 1].brain);
      }
    }

    while (children.length < this.maxSnakes) {
      if (Math.random() < 0.25) {
        children.push(new Player(new Network(6, 3, this.innovationHistory)));
      } else {
        try {
          children.push(this.species[0].makeChild());
        } catch (err) {
          children.push(new Player(new Network(6, 3, this.innovationHistory)));
        }
      }
      this.mutate(children[children.length - 1].brain);
    }

    this.players = children;

    this.generation++;
    this.currentScore = -1;

    this.startGames();
  }

  calculateFitness() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].calculateFitness();
    }
    for (let i = 0; i < this.species.length; i++) {
      this.species[i].shareFitness();
    }
  }

  findSpecies(player) {
    for (let i = 0; i < this.species.length; i++) {
      if (this.species[i].compatible(player.brain)) {
        this.species[i].players.push(player);
        return;
      }
    }
    this.species.push(new Species(player, this.threshold));
  }

  sortSpecies() {
    for (let i = 0; i < this.species.length; i++) {
      this.species[i].sortByFitness();
      this.species[i].shareFitness();
      this.species[i].getAvgFitness();
    }
    this.species = this.quickSort(this.species);
  }

  quickSort(x) {
    let less = [];
    let pivotList = [];
    let more = [];

    if (x.length <= 1) return x;

    let pivot = x[0].fittest;
    for (let i of x) {
      if (i.fittest > pivot.fittest) {
        less.push(i);
      } else if (i.fittest < pivot.fittest) {
        more.push(i);
      } else {
        pivotList.push(i);
      }
    }
    less = this.quickSort(less);
    more = this.quickSort(more);
    return less.concat(pivotList.concat(more));
  }

  removeRedundant(fitnessAvgSum) {
    for (let i = 0; i < this.species.length; i++) {
      if (this.species[i].players.length === 0) {
        this.species.splice(i, 1);
        i--;
      } else {
        let avgFitness =
          (this.species[i].avgFitness / fitnessAvgSum) * this.players.length -
          1;

        if (isNaN(avgFitness)) {
          this.species.splice(i, 1);
          i--;
        }
        if (i >= 2) {
          if (avgFitness < 1 || this.species[i].staleness > 15) {
            this.species.splice(i, 1);
            i--;
          }
        }
      }
    }
  }

  mutate(brain) {
    for (let i = 0; i < this.mutationNumber; i++) {
      brain.mutate(this.innovationHistory);
    }
  }

  startGames() {
    this.games = [];
    for (let i = 0; i < this.players.length; i++) {
      this.games.push(new Game(this.players[i]));
    }
  }

  drawStats(x, y) {
    let alive = 0;
    for (let player of this.players) {
      if (!player.dead) alive++;
    }

    let size = 19;
    x += 2;
    strokeWeight(0);
    fill("Black");
    textSize(size);
    text("Generation: " + this.generation, x, y + size);
    text("Score: " + this.currentScore, x, y + 2 * size);
    text("Highest: " + this.highscore, x, y + 3 * size);
    text("Alive: " + alive, x, y + 4 * size);
    text("Species: " + this.species.length, x, y + 5 * size);
    strokeWeight(1);
  }

  draw(x, y, w, h, nodeSize = 5) {
    let canvasWidth = x + w;
    let canvasHeight = y + h;
    let statsSize = 200;

    fill("White");
    rect(0, canvasHeight - h, canvasWidth, h);

    fill("Black");
    line(statsSize - 5 - nodeSize, y, statsSize - 5 - nodeSize, canvasHeight);

    this.drawStats(x, y);
    this.fitNet.draw(x + statsSize, y, w - (statsSize + 10), h, nodeSize);
  }
}
