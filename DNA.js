function DNA(genomesMaxSize) {
  this.genes = [];
  this.fitness = 0;
  this.stuck = false;

  //init genes
  for (var i = 0; i < genomesMaxSize; i++) {
    let newStartingPosition = garden.newPosition();

    let gene = {
      x: newStartingPosition['x'],
      y: newStartingPosition['y'],
      prefDir: garden.newDirection()
    }

    this.genes[i] = gene;
  }

  this.calcFitness = function(target) {
     let score = 0;
     garden.unrake();
    //  this.genes[0]['x'] = 2;
    //  this.genes[0]['y'] = -1;


     for(i in this.genes){
       if(this.stuck)
        break;

       let startState = {
         x: this.genes[i]['x'],
         y: this.genes[i]['y'],
         prefDir: this.genes[i]['prefDir']
       };

       //console.log('start');
       //console.log(i);
       //console.log(startState);
       //garden.printGarden();
       //console.log('');

       if(startState['y'] == -1){
         //rake downwards
         ////console.log(startState);
         this.rake(startState, 'down', i);
       }
       else if(startState['x'] == garden.getWidth()){
         //rake leftwards
         this.rake(startState, 'left', i);
       }
       else if(startState['y'] == garden.getHeight()){
         //rake upwards
         this.rake(startState, 'up', i);
       }
       else if(startState['x'] == -1){
         //rake rightwards
         this.rake(startState, 'right', i);
       }

     }

     //console.log('finish');
    /// garden.printGarden();

     score = target - garden.countZeros();
     //console.log('score:' + score);
     this.fitness = score;
  }


  this.mutate = function(mutationRate) {
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < mutationRate) {
        let newStartingPosition = garden.newPosition();

        let gene = {
          x: newStartingPosition['x'],
          y: newStartingPosition['y'],
          prefDir: garden.newDirection()
        }

        this.genes[i] = gene;
      }
    }
  }
this.limit = 100;
  this.rake = (state, direction, index) => {
    if(this.limit == 0)
    return;
    this.limit --;
    //console.log(state);

    let tempGarden = garden.getGarden();
    let marker = parseInt(index) +1;
    let x = state['x'];
    let y = state['y'];

    switch (direction) {
      case 'down':
        while(tempGarden[x][y+1] == 0){
          tempGarden[x][y+1] = marker;
          y++;
          if(tempGarden[x][y+1] == undefined)
            y++;
        }

        break;
      case 'left':
        while(tempGarden[x-1] != undefined && tempGarden[x-1][y] == 0){
          tempGarden[x-1][y] = marker;
          x--;
          if(tempGarden[x-1] == undefined)
            x--;
        }

        break;
      case 'up':
        while(tempGarden[x][y-1] == 0){
          tempGarden[x][y-1] = marker;
          y--;
          if(tempGarden[x][y-1] == undefined)
            y--;
        }

        break;
      case 'right':
        while(tempGarden[x+1] != undefined && tempGarden[x+1][y] == 0){
          tempGarden[x+1][y] = marker;
          x++;
          if(tempGarden[x+1] == undefined)
            x++;
        }

        break;
    }


    // garden.printGarden();
//console.log(' ');
    if(this.isOut(x, y))
      return;



    //change direction and rake again if possible
    state['x'] = x;
    state['y'] = y;
    let newDir = this.findNewDirection(state, direction);

    if(newDir)
      this.rake(state, newDir, index);
    else {
      this.stuck = true;
    }
  }

  this.findNewDirection = (state, direction) => {
    let tempGarden = garden.getGarden();
    let x = state['x'];
    let y = state['y'];
    let newDir;
    let canGo = [];
    let i=0;

    if(direction == 'down'){
      //look left
      if(tempGarden[x+1] == undefined || tempGarden[x+1][y] == 0){
        canGo[i++] = 'left';
      }
      //look right
      if(tempGarden[x-1] == undefined || tempGarden[x-1][y] == 0){
        canGo[i] = 'right';
      }
      //console.log(canGo);
      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else {
          newDir = state['prefDir'];
        }
        if(newDir == 'right')
          newDir = 'left';
        else
          newDir = 'right';
      }


    }
    else if(direction == 'up'){
      //look left
      if(tempGarden[x-1] == undefined || tempGarden[x-1][y] == 0){
        canGo[i++] = 'left';
      }
      //look right
      if(tempGarden[x+1] == undefined || tempGarden[x+1][y] == 0){
        canGo[i] = 'right';
      }
      //console.log(canGo);
      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else {
          newDir = state['prefDir'];
        }
        if(newDir == 'left')
          newDir = 'left';
        else
          newDir = 'right';
      }

    }
    else if(direction == 'left'){
      //look left
      if(tempGarden[x][y+1] == 0 || tempGarden[x][y+1] == undefined){
        canGo[i++] = 'left';
      }
      //look right
      if(tempGarden[x][y-1] == 0 || tempGarden[x][y-1] == undefined){
        canGo[i] = 'right';
      }
      //console.log(canGo);
      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else {
          newDir = state['prefDir'];
        }
        if(newDir == 'left')
          newDir = 'down';
        else
          newDir = 'up';
          //console.log(newDir);
      }


    }
    else if(direction == 'right'){
      //look left
      if(tempGarden[x][y-1] == 0 || tempGarden[x][y-1] == undefined){
        canGo[i++] = 'left';
      }
      //look right
      if(tempGarden[x][y+1] == 0 || tempGarden[x][y+1] == undefined){
        canGo[i] = 'right';
      }
      //console.log(canGo);
      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else {
          newDir = state['prefDir'];
        }
        if(newDir == 'left')
          newDir = 'up';
        else
          newDir = 'down';
      }

    }



    return newDir;
  }

  this.isOut = (x, y) => {
    if(y == -1 || y == garden.getHeight()){
      return true;
    }
    else if(x == -1 || x == garden.getWidth()){
      return true;
    }
    return false;
  }
}
