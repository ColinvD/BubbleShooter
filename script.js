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
//var playfield = [];
var field;
var types = [];
var startClickPos = {x: null, y: null};
var endClickPos = {x: null, y: null};
var dragging = false;
var canPick = true;
var selectedCell = null;
var inGameRef;
var movingCells = 0;
var movesCompleted = 0;
var started = false;
var state;
var states = ["Selecting", "Removing", "Refilling", "Waiting"];
var func;
var maxDif = 10;

function preload ()
{
  this.load.image("background", "Assets/ui_assets/bg.png");
  this.load.image("popupbg", "Assets/ui_assets/popup_base.png");
  this.load.image("popuptop", "Assets/ui_assets/popup_header.png");
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
  background = this.add.image(0,0,"background");
  background.displayHeight = game.config.height;
  background.scaleX = background.scaleY*4;
  background.y = game.config.height/2;
  background.x = game.config.width/2;

  field = new Field(types);
  timer = new Countdown(400, 40, 180, inGameRef, EndScreen);
  timer.StartCountdown();
  state = states[0];
  this.input.on('pointermove', StartSwipe);
  this.input.on('pointerup', StopSwipe);
}

function update ()
{
  ManageGame();
}

function ManageGame(){
  switch (state) {
    case states[0]:
      if (movesCompleted == movingCells && started) {
        started = false;
        movesCompleted = 0;
        movingCells = 0;
        state = states[1];
        func();
      }
      break;
    case states[1]:
      if (movesCompleted == movingCells && started) {
        started = false;
        movesCompleted = 0;
        movingCells = 0;
        func();
      }
      break;
    case states[2]:
      if (movesCompleted == movingCells && started) {
        started = false;
        movesCompleted = 0;
        movingCells = 0;
        func();
        state = states[1];
      }
      break;
    case states[3]:
      if (movesCompleted == movingCells && started) {
        func();
        started = false;
        movesCompleted = 0;
        movingCells = 0;
        canPick = true;
        func = null;
        state = states[0];
      }
      break;
    default:

  }
}

function Select(pointer) {
  if (canPick) {
    dragging = true;
    startClickPos.x = pointer.worldX;
    startClickPos.y = pointer.worldY;
    if (selectedCell == null) {
      this.setScale(0.15);
      selectedCell = this;
    } else {
      if (this == selectedCell) {
        selectedCell.setScale(0.1);
        selectedCell = null;
      } else {
        if (((this.column == selectedCell.column +1 || this.column == selectedCell.column - 1) && this.row == selectedCell.row) || ((this.row == selectedCell.row +1 || this.row == selectedCell.row - 1) && this.column == selectedCell.column)) {
          canPick = false;
          selectedCell.setScale(0.1);
          movesCompleted = 0;
          movingCells = 2;
          field.SwitchCells(this, selectedCell, field);
          allMatches = field.FindMatches([this, selectedCell]);
          allMatches = Array.from(new Set(allMatches));
          if (allMatches.length > 0) {
            func = field.RemoveMatches.bind(null, allMatches, field.playfield, field.MoveCellsDown.bind(null, field));
            started = true;
          } else {
            func = field.SwitchCells.bind(null, this, selectedCell, field);
            state = states[3];
            started = true;
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
  if (dragging && selectedCell != null) {
    endClickPos.x = pointer.worldX;
    endClickPos.y = pointer.worldY;

    distance = Math.sqrt(Math.pow(Math.abs(endClickPos.y) - Math.abs(startClickPos.y),2) + Math.pow(Math.abs(endClickPos.x) - Math.abs(startClickPos.x),2));
    if (distance > maxDif) {
      dragging = false;
      angle = Math.atan2(endClickPos.y - startClickPos.y, endClickPos.x - startClickPos.x) * 180 / Math.PI;
      var otherCell = null;

      if (angle > -45 && angle <= 45 && selectedCell.column != width -1) {
        //right
        otherCell = field.playfield[selectedCell.column + 1][selectedCell.row];
      } else if (angle < -45 && angle >= -135 && selectedCell.row != 0) {
        //up
        otherCell = field.playfield[selectedCell.column][selectedCell.row -1];
      } else if (angle > 135 || angle <= -135 && selectedCell.column != 0){
        //left
        otherCell = field.playfield[selectedCell.column - 1][selectedCell.row];
      } else if (angle > 45 && angle <= 135 && selectedCell.row != height -1){
        //down
        otherCell = field.playfield[selectedCell.column][selectedCell.row + 1];
      }

      if (otherCell != null) {
        if (((otherCell.column == selectedCell.column +1 || otherCell.column == selectedCell.column - 1) && otherCell.row == selectedCell.row) || ((otherCell.row == selectedCell.row +1 || otherCell.row == selectedCell.row - 1) && otherCell.column == selectedCell.column)) {
          canPick = false;
          selectedCell.setScale(0.1);
          movesCompleted = 0;
          movingCells = 2;
          field.SwitchCells(otherCell, selectedCell, field);
          allMatches = field.FindMatches([otherCell, selectedCell]);
          allMatches = Array.from(new Set(allMatches));
          if (allMatches.length > 0) {
            func = field.RemoveMatches.bind(null, allMatches, field.playfield, field.MoveCellsDown.bind(null, field));
            started = true;
          } else {
            func = field.SwitchCells.bind(null, otherCell, selectedCell, field);
            state = states[3];
            started = true;
          }
          selectedCell = null;
        }
      }
    }
  }
}

function StopSwipe(pointer) {
  dragging = false;
}

function Counter() {
  movesCompleted++;
}

function EndScreen(){
  var popupBG = inGameRef.add.image(200,300,"popupbg");
  var popupTop = inGameRef.add.image(200,175,"popuptop").setScale(0.75);
  var popupText = inGameRef.add.text(100, 250, "Hello I want to see how long this will go");
  popupText.setColor("#000f2b");
  popupText.setWordWrapWidth(200);
  canPick = false;
}
