
let garden;
let limitCounter;

let gardenWidth = 12;
let gardenHeight = 10;

let canDrawFlag = false;
let canvas;
let squareSize = 40;

function gatherInput(){
  gardenWidth = parseInt(document.getElementById('gardenWidth').value);
  gardenHeight = parseInt(document.getElementById('gardenHeight').value);

  let populationSize = parseInt(document.getElementById('populationSize').value);
  let mutationRate = parseInt(document.getElementById('mutationRate').value)/100.0;
  let generationLimit = parseInt(document.getElementById('generationLimit').value);

  let strategy;
  (document.getElementById('tournament').checked)?  strategy = 'tournament' : strategy = 'roulette';

  let stonesInput = document.getElementById('stones').value;
  let stones = [];

  stonesInput = stonesInput.replace(/\[/g, '');
  stonesInput = stonesInput.replace(/\]/g, '');

  temp = stonesInput.split(',');
  for(let x=0; x< temp.length; x+=2){
    stones.push([parseInt(temp[x]), parseInt(temp[x+1])]);
  }

  garden = new Garden(gardenWidth, gardenHeight, stones);

  let genomesMaxSize = gardenWidth + gardenHeight + stones.length;
  let targetScore = gardenWidth*gardenHeight - stones.length;

  let population = new Population(populationSize, mutationRate, genomesMaxSize, targetScore, strategy);
  limitCounter = generationLimit;

  canvas = createCanvas(squareSize*gardenWidth+1, squareSize*gardenHeight+1);

  evolve(population);
}

function evolve(population){
  population.calcFitness();
  
  while(!population.isEvolved() && limitCounter > 0){
    population.makeSelection();
    population.generateOffspring();
    population.calcFitness();
    population.evaluate();
    limitCounter--;
  }

  console.log(population.best);

  population.best.calcFitness();
  garden.printGarden();
  canDrawFlag = true;

  loop();
}

 // p5.js setup function for canvas
function setup() {
  noLoop();
}

// p5.js function for drawing to canvas
function draw() {
  if(canDrawFlag){

    let xPos = 0;
    let yPos = 0;

    textSize(15);

    let garten = garden.getGarden();

     background(51);

     for(let y=0; y<gardenHeight;y++){
       for(let x=0; x<gardenWidth;x++){

         // darkening colors if too bright
         let r = (garten[x][y]*100%256 > 192 )? garten[x][y]*100%256 - 64 : garten[x][y]*100%256;
         let g = (garten[x][y]*200%256 > 192 )? garten[x][y]*200%256 - 64 : garten[x][y]*200%256;
         let b = (garten[x][y]*300%256 > 192 )? garten[x][y]*300%256 - 64 : garten[x][y]*300%256;

         fill(r, g, b);
         rect(xPos, yPos, squareSize, squareSize);
         fill('#fff');

          if(garten[x][y]<10)
             (garten[x][y] == -1)? text('K', xPos+18, yPos+26) : text(garten[x][y], xPos+18, yPos+26);
          else
            text(garten[x][y], xPos+13, yPos+26);

         xPos += squareSize;
       }
       xPos = 0;
        yPos += squareSize;
     }
    noLoop();
  }
}
