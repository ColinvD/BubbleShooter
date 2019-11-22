class Countdown {
  constructor(posX, posY, startTime, ref, func) {
    this.posX = posX;
    this.posY = posY;
    this.time = startTime;
    this.ref = ref;
    this.callback = func;
    this.counting = null;
    this.text = this.ref.add.text(this.posX, this.posY, "Countdown: " + this.FormatTime(this.time));
  }

  StartCountdown(){
    this.counting = this.ref.time.addEvent({ delay: 1000, callback: this.SecondsDown, callbackScope: this, loop: true });
  }

  FormatTime(seconds){
    var minutes = Math.floor(seconds/60);
    var remainingSeconds = seconds%60;
    remainingSeconds = remainingSeconds.toString().padStart(2,'0');
    return "" + minutes + ":" + remainingSeconds;
  }

  SecondsDown(){
    this.time -= 1;
    this.text.setText("Countdown: " + this.FormatTime(this.time));
    if(this.time <= 0){
      this.counting.remove();
      this.callback();
    }
  }
}
