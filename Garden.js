function Garden(gardenWidth, gardenHeight, stones){
  this.width = gardenWidth;
  this.height = gardenHeight;
  this.garden;
  this.perimeter = 2*(gardenWidth + gardenHeight);

  this.init = () => {
    //init 2d array
    this.garden = new Array(this.width);
    for(let i=0; i < this.width; i++){
      this.garden[i]  = new Array(this.height);
    }
  }

  this.unrake = () => {
    //set to zeros
    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        this.garden[x][y] = 0;
      }
    }

    //add stones
    for(let i in stones){
      this.garden[stones[i][0]][stones[i][1]] = -1;
    }
  }

  this.countZeros = () => {
    let count = 0;

    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        if(this.garden[x][y] == 0)
          count++;
      }
    }

    return count;
  }

  this.init();

  this.newStartingPosition = () => {
    let coord = {};
    let pos = floor(random(this.perimeter)+1);

    let w = this.width;
    let h = this.height;

    if(pos > 0 && pos <= w){
      coord['x'] = pos-1;
      coord['y'] = -1;
    }
    else if (pos > w && pos <= w+h) {
      coord['x'] = w;
      coord['y'] = pos-(w+1);
    }
    else if (pos > w+h && pos <= 2*w+h) {
      coord['x'] = pos-(w+h+1);
      coord['y'] = h;
    }
    else if (pos > 2*w+h && pos <= 2*(w+h)) {
      coord['x'] = -1;
      coord['y'] = pos-(2*w+h+1);
    }

    return coord;
  }

  this.newPreferredRotationDirection = () => {
    return random(["left", "right"]);
  }

  this.getGarden = () => {
    return this.garden;
  }

  this.getWidth = () => {
    return this.width;
  }

  this.getHeight = () => {
    return this.height;
  }

  this.printGarden = () => {
    let ans='';
    let line = '';
    for(let y=0; y < this.height; y++){
      for(let x = 0; x < this.width; x++){
        if(this.garden[x][y].toString().length > 1)
          line += ' ' + this.garden[x][y] + ' ';
        else
          line += '  ' + this.garden[x][y] + ' ';

      }
      console.log(line);
      ans+=line+"<br>";
      line = '';
    }
    return ans;
  }
}
