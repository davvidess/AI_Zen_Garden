
var garden;
var population;
// p5.js setup function for canvas
function setup() {
  let gardenWidth = 12;
  let gardenHeight = 10;
  let stones = [
    [1,2], [5,1], [4,3], [2,4], [8, 6], [9, 6]
  ];

  garden = new Garden(gardenWidth, gardenHeight, stones);

  let populationSize = 300;
  let mutationRate = 0.02;
  let genomesMaxSize = gardenWidth + gardenHeight + stones.length;
  //let genomesMaxSize = 2;
  let targetScore = gardenWidth*gardenHeight - stones.length;

  population = new Population(populationSize, mutationRate, genomesMaxSize, targetScore);

  //garden.newPosition();
  // for(let i=0;i<100;i++){
  //   //garden.newPosition();
  //   console.log(garden.newPosition());
  // }
}
var limit = 1000;
// p5.js function for drawing to canvas
function draw() {
  limit--;
  if(limit == 0)
    noLoop();

    //population.calcFitness();
    population.makeSelection();
    population.generateOffspring();
    population.calcFitness();
    population.evaluate();

  if (population.isFinished()) {
    noLoop();
    population.best.calcFitness();
    garden.printGarden();
  }
}

// function keyPressed(){
//   switch(keyCode){
//     case LEFT_ARROW:
//     step("left");
//     break;
//     case RIGHT_ARROW:
//     step("right");
//     break;
//   }
// }
