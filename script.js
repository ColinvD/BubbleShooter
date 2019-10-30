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
var width = 10;
var height = 10;
var playfield = [];

function preload ()
{
  this.load.image("background", "Assets/ui_assets/bg.png");
  this.load.image("milk", "Assets/characters/characters_0001.png");
  this.load.image("apple", "Assets/characters/characters_0002.png");
  this.load.image("orange", "Assets/characters/characters_0003.png");
}

function create ()
{
  background = this.add.image(765,375,"background");
  background.height = window.innerHeight;
  background.width = window.innerWidth;
  background.displayHeight = window.innerHeight;
  background.displayWidth = window.innerWidth;
  for (var i = 0; i < width; i++) {
    playfield[i] = [];
    for (var j = 0; j < height; j++) {
      cell = this.add.image(60 + i * 60, 60 + j * 60, "apple").setScale(0.2);
      cell.name = "( " + i + " , " + j + " )";
      playfield[i][j] = cell;
    }
  }

  //this.add.image(60,60,"milk").setScale(0.2);
  //this.add.image(120,60,"apple").setScale(0.2);
  //this.add.image(180,60,"orange").setScale(0.2);
}

function update ()
{
}
