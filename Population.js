function Population(populationSize, mutationRate, genomesMaxSize, targetScore, strategy){
  this.bestScore = 0;
  this.evolved = false;
  this.generations = 0;
  this.makeSelection;
  this.matingPool = [];
  this.mutationRate = mutationRate;
  this.population = [];
  this.targetScore = targetScore;

  for(let i = 0; i< populationSize; i++){
    this.population[i] = new Individual(genomesMaxSize);
  }

  this.calcFitness = () => {
    for(let i in this.population){
      this.population[i].calcFitness(this.targetScore);
    }
  }

  this.tournamentSelection = () => {
    this.matingPool = [];

    for (let i in this.population) {
      let contester1 = floor(random(this.population.length));
      let contester2 = floor(random(this.population.length));
      let contester3 = floor(random(this.population.length));

      if(this.population[contester1].getFitness() > this.population[contester2].getFitness()
      && this.population[contester1].getFitness() > this.population[contester3].getFitness())
        this.matingPool.push(this.population[contester1]);
      else
        if(this.population[contester2].getFitness() > this.population[contester3].getFitness())
            this.matingPool.push(this.population[contester2]);
        else
          this.matingPool.push(this.population[contester3]);
    }

  }

  this.rouletteSelection = () => {
    this.matingPool = [];

    let maxFitness = 0;
    for (let i in this.population) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    for (let i in this.population) {
      let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
      let n = floor(fitness * 100);

      for (let j = 0; j < n; j++)
        this.matingPool.push(this.population[i]);
    }
  }

  (strategy == 'tournament')? this.makeSelection = this.tournamentSelection : this.makeSelection = this.rouletteSelection;

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
    let child = new Individual(genomesMaxSize);

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
    let maxScore = 0;
    let index = 0;

    for (let i in this.population) {
      if (this.population[i].getFitness() > maxScore) {
        index = i;
        maxScore = this.population[i].getFitness();
      }
    }


    if(this.bestScore < maxScore){
      this.best = this.population[index];
      this.bestScore = maxScore;
    }


    console.log(this.bestScore);

    if (this.bestScore === this.targetScore) {
      console.log('number of generations: ', this.generations);
      this.evolved = true;
    }
  }

  this.isEvolved = function() {
    return this.evolved;
  }

  this.getGenerations = function() {
    return this.generations;
  }
}
