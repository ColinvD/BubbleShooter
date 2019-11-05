var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var width = 6;
var height = 10;
var playfield = [];
var types = [];
var startClickPos, endClickPos = {
  x: null,
  y: null,
  z: null
}
var dragging = false;
var selectedCell = null;

function preload ()
{
  this.load.image("background", "Assets/ui_assets/bg.png");
  //this.load.image("bear", "Assets/characters/Bear/Grey-Bear.png");
  //this.load.image("cat", "Assets/characters/Cat/White-Cat.png");
  this.load.image("deer", "Assets/characters/Deer/Brown-Deer.png");
  //this.load.image("dog", "Assets/characters/Dog/Brown-Dog.png");
  this.load.image("duck", "Assets/characters/Duck/Yellow-Duck.png");
  this.load.image("frog", "Assets/characters/Frog/Green-Frog.png");
  //this.load.image("mouse", "Assets/characters/Mouse/Blue-Mouse.png");
  this.load.image("panda", "Assets/characters/Panda/White-Panda.png");
  this.load.image("pig", "Assets/characters/Pig/Pink-Pig.png");
  //this.load.image("rabbit", "Assets/characters/Rabbit/Grey-Rabbit.png");
  types = ["deer", "duck", "frog", "panda", "pig"];
}

function create ()
{
  background = this.add.image(765,375,"background");
  background.height = window.innerHeight;
  background.width = window.innerWidth;
  background.displayHeight = window.innerHeight;
  background.displayWidth = window.innerWidth;
  SetField(this);
  this.input.on('pointermove', StartSwipe);
  this.input.on('pointerup', StopSwipe);
}

function update ()
{
}

function SetField(myObject) {
  for (var i = 0; i < width; i++) {
    playfield[i] = [];
    for (var j = 0; j < height; j++) {
      randNum = Math.floor((Math.random() * types.length));
      cell = {};
      cell.tag = types[randNum];
      while (ScanForStartMatches(i,j,cell)) {
        randNum = Math.floor((Math.random() * types.length));
        cell.tag = types[randNum];
      }
      cell = myObject.add.image(60 + i * 60, 60 + j * 60, types[randNum]).setScale(0.1);
      cell.name = "( " + i + " , " + j + " )";
      cell.tag = types[randNum];
      cell.column = i;
      cell.row = j;
      cell.selectable = true;
      cell.matched = false;
      cell.setInteractive();
      cell.on('pointerdown', Select);
      playfield[i][j] = cell;
    }
  }
}

function Select(pointer) {
  if (this.selectable) {
    dragging = true;
    if (selectedCell == null) {
      this.setScale(0.15);
      selectedCell = this;
    } else {
      if (this == selectedCell) {
        selectedCell.setScale(0.1);
        selectedCell = null;
      } else {
        if (((this.column == selectedCell.column +1 || this.column == selectedCell.column - 1) && this.row == selectedCell.row) || ((this.row == selectedCell.row +1 || this.row == selectedCell.row - 1) && this.column == selectedCell.column)) {
          console.log("They are next to eachother!!!");
          selectedCell.setScale(0.1);
          SwitchCells(this, selectedCell);
          selectedCell = null;
        } else {
          selectedCell.setScale(0.1);
          this.setScale(0.15);
          selectedCell = this;
        }
      }
    }
  }
}

function StartSwipe(pointer) {
  if (dragging) {
    console.log(pointer.worldX);
  }
}

function StopSwipe(pointer) {
  dragging = false;
}

function SwitchCells(cell1, cell2) {
  tempName = cell1.name;
  tempCol = cell1.column;
  tempRow = cell1.row;
  tempPosX = cell1.x;
  tempPosY = cell1.y;

  cell1.name = cell2.name;
  cell1.column = cell2.column;
  cell1.row = cell2.row;
  cell1.setPosition(cell2.x, cell2.y);

  cell2.name = tempName;
  cell2.column = tempCol;
  cell2.row = tempRow;
  cell2.setPosition(tempPosX, tempPosY);

  playfield[cell1.column][cell1.row] = cell1;
  playfield[cell2.column][cell2.row] = cell2;

  FindMatches(cell1);
  FindMatches(cell2);
}

function FindMatches(cell) {
  var horizonMatches = HorizontalMatch(cell);
  var vertiMatches = VerticalMatch(cell);
  var allMatches = [];
  Array.prototype.push.apply(allMatches, horizonMatches);
  Array.prototype.push.apply(allMatches, vertiMatches);
  allMatches = Array.from(new Set(allMatches));
}

function HorizontalMatch(cell) {
  var leftlist = [cell];
  var rightlist = [cell];
  var horizonList = [];

  for (var i = 0; i < leftlist.length; i++) {
    if (leftlist[i].column > 0) {
      if (leftlist[i].tag == playfield[leftlist[i].column-1][leftlist[i].row].tag) {
        leftlist.push(playfield[leftlist[i].column-1][leftlist[i].row]);
      }
    }
  }

  for (var i = 0; i < rightlist.length; i++) {
    if (rightlist[i].column < width - 1) {
      if (rightlist[i].tag == playfield[rightlist[i].column+1][rightlist[i].row].tag) {
        rightlist.push(playfield[rightlist[i].column+1][rightlist[i].row]);
      }
    }
  }

  Array.prototype.push.apply(horizonList, leftlist);
  Array.prototype.push.apply(horizonList, rightlist);
  horizonList.shift();

  if (horizonList.length >= 3) {
    for (var i = 0; i < horizonList.length; i++) {
      horizonList[i].setScale(0.09);
    }
    return horizonList;
  }
}

function VerticalMatch(cell) {
  var uplist = [cell];
  var downlist = [cell];
  var vertiList = [];

  for (var i = 0; i < uplist.length; i++) {
    if (uplist[i].row > 0) {
      if (uplist[i].tag == playfield[uplist[i].column][uplist[i].row-1].tag) {
        uplist.push(playfield[uplist[i].column][uplist[i].row-1]);
      }
    }
  }

  for (var i = 0; i < downlist.length; i++) {
    if (downlist[i].row < height - 1) {
      if (downlist[i].tag == playfield[downlist[i].column][downlist[i].row+1].tag) {
        downlist.push(playfield[downlist[i].column][downlist[i].row+1]);
      }
    }
  }

  Array.prototype.push.apply(vertiList, uplist);
  Array.prototype.push.apply(vertiList, downlist);
  vertiList.shift();

  if (vertiList.length >= 3) {
    for (var i = 0; i < vertiList.length; i++) {
      vertiList[i].setScale(0.09);
    }
    return vertiList;
  }
}

function ScanForStartMatches(column, row, object) {
  if (column > 1 && row > 1) {
    if (playfield[column -1][row].tag == object.tag && playfield[column-2][row].tag == object.tag) {
      return true;
    }
    if (playfield[column][row-1].tag == object.tag && playfield[column][row-2].tag == object.tag) {
      return true;
    }
  } else if (column <= 1 || row <= 1){
    if (row > 1) {
      if (playfield[column][row -1].tag == object.tag && playfield[column][row -2].tag == object.tag) {
        return true;
      }
    }
    if (column > 1) {
      if (playfield[column-1][row].tag == object.tag && playfield[column-2][row].tag == object.tag) {
        return true;
      }
    }
  }
  return false;
}
