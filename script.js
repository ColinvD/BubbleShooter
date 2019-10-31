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
      while (ScanForMatches(i,j,cell)) {
        randNum = Math.floor((Math.random() * types.length));
        cell.tag = types[randNum];
      }
      cell = myObject.add.image(60 + i * 60, 60 + j * 60, types[randNum]).setScale(0.1);
      cell.name = "( " + i + " , " + j + " )";
      cell.tag = types[randNum];
      playfield[i][j] = cell;
    }
  }

  function ScanForMatches(column, row, object) {
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
}
