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
var cellSpacing = 60;
var playfield = [];
var types = [];
var startClickPos, endClickPos = {
  x: null,
  y: null,
  z: null
}
var dragging = false;
var canPick = true;
var selectedCell = null;
var inGameRef;

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
  inGameRef = this;
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

function SetField() {
  for (var i = 0; i < width; i++) {
    playfield[i] = [];
    for (var j = 0; j < height; j++) {
      randNum = Math.floor((Math.random() * types.length));
      randType = {};
      randType.tag = types[randNum];
      while (ScanForStartMatches(i,j,randType)) {
        randNum = Math.floor((Math.random() * types.length));
        randType.tag = types[randNum];
      }
      cell = new Cell(i,j,randType.tag,inGameRef, cellSpacing);
      cell.on('pointerdown', Select);
      playfield[i][j] = cell;
    }
  }
}

function Select(pointer) {
  if (canPick) {
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
          canPick = false;
          selectedCell.setScale(0.1);
          SwitchCells(this, selectedCell);
          allMatches = FindMatches([this, selectedCell]);
          allMatches = Array.from(new Set(allMatches));
          if (allMatches.length > 0) {
            setTimeout(RemoveMatches.bind(null, allMatches), 300);
            setTimeout(MoveCellsDown, 600);
            setTimeout(Refill, 900);
          } else {
            setTimeout(SwitchCells.bind(null, this, selectedCell),300);
            canPick = true;
            console.log("test");
          }
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
  tempCol = cell1.column;
  tempRow = cell1.row;
  cell1.MoveToNewCell(inGameRef,cell2.column, cell2.row);
  cell2.MoveToNewCell(inGameRef,tempCol, tempRow);
  playfield[cell1.column][cell1.row] = cell1;
  playfield[cell2.column][cell2.row] = cell2;
}

function FindMatches(cells) {
  var allMatches = [];
  for (var i = 0; i < cells.length; i++) {
    var horizonMatches = HorizontalMatch(cells[i]);
    var vertiMatches = VerticalMatch(cells[i]);
    Array.prototype.push.apply(allMatches, horizonMatches);
    Array.prototype.push.apply(allMatches, vertiMatches);
  }
  return allMatches;
}

function MoveCellsDown() {
  var nullcount = 0;
  for (var i = width -1; i >= 0; i--) {
    for (var j = height -1; j >= 0; j--) {
      if (playfield[i][j] == null) {
        nullcount++;
      } else if(nullcount > 0){
        playfield[i][j].MoveToNewCell(inGameRef,i, j+nullcount);
        playfield[i][j+nullcount] = playfield[i][j];
        playfield[i][j] = null;
      }
    }
    nullcount = 0;
  }
}

function Refill() {
  var emptySpots = [];
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      if (playfield[i][j] == null) {
        spot = {i,j};
        emptySpots.push(spot);
      }
    }
  }

  for (var i = emptySpots.length - 1; i >= 0; i--) {
    randNum = Math.floor((Math.random() * types.length));
    cell = new Cell(emptySpots[i].i,emptySpots[i].j,types[randNum],inGameRef, cellSpacing);
    cell.on('pointerdown', Select);
    playfield[emptySpots[i].i][emptySpots[i].j] = cell;
  }

  allMatches = [];
  for (var i = 0; i < width; i++) {
    Array.prototype.push.apply(allMatches, FindMatches(playfield[i]));
  }
  allMatches = Array.from(new Set(allMatches));
  if (allMatches.length > 0) {
    setTimeout(RemoveMatches.bind(null, allMatches), 300);
    setTimeout(MoveCellsDown, 600);
    setTimeout(Refill, 900);
  } else {
    canPick = true;
  }
}

function RemoveMatches(matches) {
  /*for (var i = 0; i < matches.length; i++) {
    var removeAnim = inGameRef.add.tween({
      targets: playfield[matches[i].column][matches[i].row],
      onComplete: function() {
        console.log("Column: " + this.targets[0].column + " and Row: " + this.targets[0].row);
        console.log(playfield[this.targets[0].column][this.targets[0].row]);
        playfield[this.targets[0].column][this.targets[0].row].destroy(inGameRef);
        playfield[this.targets[0].column][this.targets[0].row] = null;
      },
      props: {
        scaleX: { value: '-=0.1', duration: 300, ease: 'Liniar' },
        scaleY: { value: '-=0.1', duration: 300, ease: 'Liniar' }
      }
    });
    console.log(playfield[matches[i].column][matches[i].row]);
    console.log(removeAnim.targets);
  }*/
   for (var i = 0; i < matches.length; i++) {
    playfield[matches[i].column][matches[i].row].destroy(inGameRef);
    playfield[matches[i].column][matches[i].row] = null;
  }
  /*var removeAnim = inGameRef.add.tween({
    targets: matches,
    onComplete: function() {
      console.log("Column: " + this.targets[0].column + " and Row: " + this.targets[0].row);
      console.log(playfield[this.targets[0].column][this.targets[0].row]);
      playfield[this.targets[0].column][this.targets[0].row].destroy(inGameRef);
      playfield[this.targets[0].column][this.targets[0].row] = null;
    },
    props: {
      scaleX: { value: '-=0.1', duration: 300, ease: 'Liniar' },
      scaleY: { value: '-=0.1', duration: 300, ease: 'Liniar' }
    }
  });*/
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
