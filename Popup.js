class Popup {
  constructor(posX, posY, ref) {
    this.posX = posX;
    this.posY = posY;
    this.ref = ref;
    this.text = null;
  }

  ShowPopUp(text){
    var popupBG = this.ref.add.image(this.posX, this.posY, "popupbg");
    var popupTop = this.ref.add.image(this.posX, this.posY-125, "popuptop").setScale(0.75);
    this.text = this.ref.add.text(100, 250, text);
    this.text.setColor("#000f2b");
    this.text.setWordWrapWidth(this.posX);
  }
}
