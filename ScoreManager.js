class ScoreManager {
  constructor(posX, posY, ref) {
    this.ref = ref;
    this.comboMul = 1;
    this.score = 0;
    this.scoreText = this.ref.add.text(posX, posY, "Score: " + this.score);
  }

  AddScore(value){
    this.score += value * this.comboMul;
  }

  UpdateHUD(){
    this.scoreText.setText("Score: " + this.score);
  }

  IncreaseMultiplier(){
    this.comboMul++;
    if (this.comboMul > 5) {
      this.comboMul = 5;
    }
  }

}
