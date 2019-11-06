class Cell extends Phaser.GameObjects.Image {
  constructor(newColumn, newRow, newTag, ref, size) {
    super(ref, size + newColumn * size, size + newRow * size, newTag);
    this.column = newColumn;
    this.row = newRow;
    this.tag = newTag;
    ref.add.existing(this).setScale(0.1);
    this.name = "( " + this.column + " , " + this.row + " )";
    this.selectable = true;
    this.matched = false;
    this.setInteractive();
  }
}
