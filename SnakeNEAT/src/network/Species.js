class Species {
  constructor(player, threshold) {
    this.players = [player];
    this.fittest = player.fitness;
    this.fittestPlayer = player;
    this.avgFitness = 0;
    this.staleness = 0;
    this.identifier = player.brain.clone();

    this.excessDisjointCoEff = 2;
    this.weightDiffCoEff = 7;
    this.threshold = threshold;

    this.colour = color(this.getColour(), this.getColour(), this.getColour());
  }

  getColour() {
    return Math.floor(Math.random() * 256);
  }

  differences(otherBrain) {
    let match = 0;
    let weightDiff = 0;

    for (let i = 0; i < this.identifier.edges.length; i++) {
      for (let j = 0; j < otherBrain.edges.length; j++) {
        if (
          this.identifier.edges[i].innovation === otherBrain.edges[j].innovation
        ) {
          match++;
          weightDiff += Math.abs(
            otherBrain.edges[j].weight - this.identifier.edges[i].weight
          );
        }
      }
    }

    let results = [];
    results[0] = match === 0 ? 100 : weightDiff / match;
    results[1] =
      this.identifier.edges.length + otherBrain.edges.length - 2 * match;

    return results;
  }

  compatible(brain) {
    let compatibility;
    let results = this.differences(brain);
    let weightDiff = results[0];
    let excessDisjointDiff = results[1];

    let normalizer = Math.max(1, brain.edges.length - 20);

    compatibility =
      (excessDisjointDiff * this.excessDisjointCoEff) / normalizer +
      weightDiff * this.weigthDiffCoEff;

    return compatibility < this.threshold;
  }

  getAvgFitness() {
    let avg = 0;
    for (let i = 0; i < this.players.length; i++)
      avg += this.players[i].fitness;

    this.avgFitness = avg / this.players.length;
  }

  naturalSelection() {
    if (this.players.length > 2)
      this.players.splice(this.players.length / 2, this.players.length);
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

  sortByFitness() {
    if (this.players.length === 0) return;

    this.players = this.quickSort(this.players);

    if (this.players[0].fitness > this.fittest) {
      this.fittest = this.players[0].fitness;
      this.fittestPlayer = this.players[0];
      this.identifier = this.players[0].brain.clone();
    } else {
      this.staleness++;
    }
  }

  shareFitness() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].fitness /= this.players.length;
    }
  }

  getRandomPlayer() {
    let totalFitness = 0;
    for (let i = 0; i < this.players.length; i++)
      totalFitness += Math.abs(this.players[i].fitness);

    let target = Math.floor(Math.random() * totalFitness);
    let sum = 0;

    for (var i = 0; sum < target && i < this.players.length - 1; i++) {
      sum += Math.abs(this.players[i].fitness);
    }
    return this.players[i];
  }

  makeChild() {
    let child;
    if (Math.random() < 0.25) {
      child = this.getRandomPlayer().brain.clone();
    } else {
      let parent1 = this.getRandomPlayer();
      let parent2 = this.getRandomPlayer();

      child =
        parent1.fitness > parent2.fitness
          ? parent1.brain.crossover(parent2.brain)
          : parent2.brain.crossover(parent1.brain);
    }

    child = new Player(child);
    child.colour = this.colour;
    this.players.push(child);
    return child;
  }
}
