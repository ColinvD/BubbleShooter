class ScoreManager {
  constructor(posX, posY, ref) {
    this.ref = ref;
    this.score = 0;
    this.scoreText = this.ref.add.text(posX, posY, "Score: " + this.score);
  }

  AddScore(value){
    this.score += value;
    this.UpdateHUD();
  }

  UpdateHUD(){
    this.scoreText.setText("Score: " + this.score);
  }

}
