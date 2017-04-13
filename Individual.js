function Individual(genomesMaxSize) {
  this.genes = [];
  this.fitness = 0;
  this.stuck = false;

  //init genes
  for (let i = 0; i < genomesMaxSize; i++) {
    let newStartingPosition = garden.newStartingPosition();

    let gene = {
      x: newStartingPosition['x'],
      y: newStartingPosition['y'],
      prefRotDir: garden.newPreferredRotationDirection()
    }

    this.genes[i] = gene;
  }

  this.getFitness = () => {
    return this.fitness;
  }

  this.calcFitness = function(target) {
     let score = 0;
     let marker = 1;

     garden.unrake();

     for(i in this.genes){
       if(this.stuck) break;

       let startState = {
         x: this.genes[i]['x'],
         y: this.genes[i]['y'],
         prefRotDir: this.genes[i]['prefRotDir']
       };

       // start posotion is top of garden?
       if(startState['y'] == -1){
         //rake downwards
         if(this.rake(startState, 'down', marker))
          marker++;
       }
       // start posotion is right of garden?
       else if(startState['x'] == garden.getWidth()){
         //rake leftwards
         if(this.rake(startState, 'left', marker))
          marker++;
       }
       // start posotion is bottom of garden?
       else if(startState['y'] == garden.getHeight()){
         //rake upwards
         if(this.rake(startState, 'up', marker))
          marker++;
       }
       // start posotion is left of garden?
       else if(startState['x'] == -1){
         //rake rightwards
         if(this.rake(startState, 'right', marker))
          marker++;
       }

     }

     score = target - garden.countZeros();

     if(this.stuck)
      this.fitness -= 1000;
    else
     this.fitness = score;
  }

  this.mutate = function(mutationRate) {
    for (let i in this.genes) {
      if (random(1) < mutationRate) {
        let newStartingPosition = garden.newStartingPosition();

        let gene = {
          x: newStartingPosition['x'],
          y: newStartingPosition['y'],
          prefRotDir: garden.newPreferredRotationDirection()
        }

        this.genes[i] = gene;
      }
    }
  }

  this.rake = (state, direction, marker) => {
    let rakedFlag = false;
    let tempGarden = garden.getGarden();
    let x = state['x'];
    let y = state['y'];

    switch (direction) {
      case 'down':
        while(tempGarden[x][y+1] == 0){
          tempGarden[x][y+1] = marker;
          y++;
        }
        if(tempGarden[x][y+1] == undefined)
          y++;

        break;
      case 'left':
        while(tempGarden[x-1] != undefined && tempGarden[x-1][y] == 0){
          tempGarden[x-1][y] = marker;
          x--;
        }
        if(tempGarden[x-1] == undefined)
          x--;

        break;
      case 'up':
        while(tempGarden[x][y-1] == 0){
          tempGarden[x][y-1] = marker;
          y--;
        }
        if(tempGarden[x][y-1] == undefined)
          y--;

        break;
      case 'right':
        while(tempGarden[x+1] != undefined && tempGarden[x+1][y] == 0){
          tempGarden[x+1][y] = marker;
          x++;
        }
        if(tempGarden[x+1] == undefined)
          x++;

        break;
    }

    // has raked something
    if(abs(x - state['x']) > 0 || abs(y - state['y']) > 0)
      rakedFlag = true;

    if(this.isOut(x, y))
      return rakedFlag;

    //change direction and rake again if possible
    state['x'] = x;
    state['y'] = y;
    let newDir = this.findNewDirection(state, direction);

    if(newDir)
      this.rake(state, newDir, marker);
    else
      this.stuck = true;

    return rakedFlag;
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

  // za tuto funkciu sa hanbim
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

      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else
          newDir = state['prefRotDir'];

        (newDir == 'right')? newDir = 'left' : newDir = 'right';
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

      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else
          newDir = state['prefRotDir'];
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

      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else
          newDir = state['prefRotDir'];

        (newDir == 'left')? newDir = 'down' : newDir = 'up';
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

      if(canGo.length != 0){
        if(canGo.length == 1)
          newDir = canGo[0];
        else {
          newDir = state['prefRotDir'];
        }
        (newDir == 'left')? newDir = 'up' : newDir = 'down';
      }

    }

    return newDir;
  }


}
