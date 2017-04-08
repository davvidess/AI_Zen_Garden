function Population(populationSize, mutationRate, genomesMaxSize, targetScore){
  this.population = [];
  this.matingPool = [];
  this.generations = 0;
  this.finished = false;
  this.mutationRate = mutationRate;
  this.targetScore = targetScore;

  for(let i = 0; i< populationSize; i++){
    this.population[i] = new DNA(genomesMaxSize);

  }

  this.calcFitness = () => {
    for(let i in this.population){
      this.population[i].calcFitness(this.targetScore);
    }
  }
  this.calcFitness();

  this.makeSelection = () => {
    // Clear the ArrayList
    this.matingPool = [];

    var maxFitness = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    // Based on fitness, each member will get added to the mating pool a certain number of times
    // a higher fitness = more entries to mating pool = more likely to be picked as a parent
    // a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
    for (var i = 0; i < this.population.length; i++) {

      var fitness = map(this.population[i].fitness,0,maxFitness,0,1);
      var n = floor(fitness * 100);  // Arbitrary multiplier, we can also use monte carlo method
      for (var j = 0; j < n; j++) {              // and pick two random numbers
        this.matingPool.push(this.population[i]);
      }
    }
  }

  this.generateOffspring = () => {
    for(let i in this.population){
      let rand1 = floor(random(this.matingPool.length));
      let rand2 = floor(random(this.matingPool.length));

      while(rand2 === rand1)
        rand2 = floor(random(this.matingPool.length));

      let parent1 = this.matingPool[rand1];
      let parent2 = this.matingPool[rand2];

      let child = this.crossover(parent1, parent2);
      child.mutate(this.mutationRate);
      this.population[i] = child;
    }
    this.generations++;
  }

  this.crossover = function(parent1, parent2) {
    let child = new DNA(genomesMaxSize);

    let midpoint = floor(random(child.genes.length));

    for (let i in this.positionGenes) {
      if (i > midpoint){
        child.genes[i] = partner1.genes[i];
      }
      else {
        child.genes[i] = partner2.genes[i];
      }
    }

    return child;
  }

  this.evaluate = function() {
    let bestScore = 0;
    let index = 0;

    for (let i in this.population) {
      if (this.population[i].fitness > bestScore) {
        index = i;
        bestScore = this.population[i].fitness;
      }
    }

    this.best = this.population[index];
    console.log('best', bestScore);
    if (bestScore === this.targetScore) {
      console.log('best', bestScore);
      this.finished = true;
    }
  }

  this.isFinished = function() {
    return this.finished;
  }

  this.getGenerations = function() {
    return this.generations;
  }
}
