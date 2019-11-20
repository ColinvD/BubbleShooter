class Field {
  constructor(types) {
    this.types = types;
    this.playfield = [];
    this.SetField();
  }

  SetField() {
    for (var i = 0; i < width; i++) {
      this.playfield[i] = [];
      for (var j = 0; j < height; j++) {
        var randNum = Math.floor((Math.random() * this.types.length));
        var randType = {};
        randType.tag = this.types[randNum];
        while (this.ScanForStartMatches(i,j,randType)) {
          randNum = Math.floor((Math.random() * this.types.length));
          randType.tag = this.types[randNum];
        }
        var cell = new Cell(i,j,randType.tag,inGameRef, cellSpacing);
        cell.on('pointerdown', Select);
        this.playfield[i][j] = cell;
      }
    }
  }

  ScanForStartMatches(column, row, object) {
    if (column > 1 && row > 1) {
      if (this.playfield[column -1][row].tag == object.tag && this.playfield[column-2][row].tag == object.tag) {
        return true;
      }
      if (this.playfield[column][row-1].tag == object.tag && this.playfield[column][row-2].tag == object.tag) {
        return true;
      }
    } else if (column <= 1 || row <= 1){
      if (row > 1) {
        if (this.playfield[column][row -1].tag == object.tag && this.playfield[column][row -2].tag == object.tag) {
          return true;
        }
      }
      if (column > 1) {
        if (this.playfield[column-1][row].tag == object.tag && this.playfield[column-2][row].tag == object.tag) {
          return true;
        }
      }
    }
    return false;
  }

  SwitchCells(cell1, cell2, field) {
    var tempCol = cell1.column;
    var tempRow = cell1.row;
    cell1.MoveToNewCell(inGameRef,cell2.column, cell2.row, 300, Counter);
    cell2.MoveToNewCell(inGameRef,tempCol, tempRow, 300, Counter);
    field.playfield[cell1.column][cell1.row] = cell1;
    field.playfield[cell2.column][cell2.row] = cell2;
  }

  FindMatches(cells) {
    var allMatches = [];
    for (var i = 0; i < cells.length; i++) {
      var horizonMatches = this.HorizontalMatch(cells[i]);
      var vertiMatches = this.VerticalMatch(cells[i]);
      Array.prototype.push.apply(allMatches, horizonMatches);
      Array.prototype.push.apply(allMatches, vertiMatches);
    }
    return allMatches;
  }

  MoveCellsDown(field) {
    movingCells = 0;
    movesCompleted = 0;
    var nullcount = 0;
    for (var i = width -1; i >= 0; i--) {
      for (var j = height -1; j >= 0; j--) {
        if (field.playfield[i][j] == null) {
          nullcount++;
        } else if(nullcount > 0){
          movingCells++;
          field.playfield[i][j].MoveToNewCell(inGameRef, i, j+nullcount, 300, Counter);
          field.playfield[i][j+nullcount] = field.playfield[i][j];
          field.playfield[i][j] = null;
        }
      }
      nullcount = 0;
    }
    func = field.Refill.bind(null,field);
    started = true;
  }

  Refill(field) {
    var emptySpots = [];
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        if (field.playfield[i][j] == null) {
          var spot = {i,j};
          emptySpots.push(spot);
        }
      }
    }

    movingCells = 0;
    movesCompleted = 0;
    for (var i = emptySpots.length - 1; i >= 0; i--) {
      var randNum = Math.floor((Math.random() * types.length));
      var cell = new Cell(emptySpots[i].i,emptySpots[emptySpots.length - 1 - i].j - height,types[randNum],inGameRef, cellSpacing);
      cell.on('pointerdown', Select);
      movingCells++;
      cell.MoveToNewCell(inGameRef, emptySpots[i].i, emptySpots[i].j, 500, Counter);
      field.playfield[emptySpots[i].i][emptySpots[i].j] = cell;
    }

    allMatches = [];
    for (var i = 0; i < width; i++) {
      Array.prototype.push.apply(allMatches, field.FindMatches(field.playfield[i]));
    }
    allMatches = Array.from(new Set(allMatches));
    if (allMatches.length > 0) {
      func = field.RemoveMatches.bind(null, allMatches, field.playfield, field.MoveCellsDown.bind(null, field));
      state = states[2];
      started = true;
    } else {
      state = states[3];
      started = true;
    }
  }

  RemoveMatches(matches, playfield, func) {
    var removeAnim = inGameRef.add.tween({
      targets: matches,
      onComplete: function() {
        for (var i = 0; i < this.targets.length; i++) {
          playfield[this.targets[i].column][this.targets[i].row].destroy(inGameRef);
          playfield[this.targets[i].column][this.targets[i].row] = null;
        }
        func();
      },
      props: {
        scaleX: { value: '-=0.1', duration: 300, ease: 'Liniar' },
        scaleY: { value: '-=0.1', duration: 300, ease: 'Liniar' }
      }
    });
  }

  HorizontalMatch(cell) {
    var leftlist = [cell];
    var rightlist = [cell];
    var horizonList = [];

    for (var i = 0; i < leftlist.length; i++) {
      if (leftlist[i].column > 0) {
        if (leftlist[i].tag == this.playfield[leftlist[i].column-1][leftlist[i].row].tag) {
          leftlist.push(this.playfield[leftlist[i].column-1][leftlist[i].row]);
        }
      }
    }

    for (var i = 0; i < rightlist.length; i++) {
      if (rightlist[i].column < width - 1) {
        if (rightlist[i].tag == this.playfield[rightlist[i].column+1][rightlist[i].row].tag) {
          rightlist.push(this.playfield[rightlist[i].column+1][rightlist[i].row]);
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

  VerticalMatch(cell) {
    var uplist = [cell];
    var downlist = [cell];
    var vertiList = [];

    for (var i = 0; i < uplist.length; i++) {
      if (uplist[i].row > 0) {
        if (uplist[i].tag == this.playfield[uplist[i].column][uplist[i].row-1].tag) {
          uplist.push(this.playfield[uplist[i].column][uplist[i].row-1]);
        }
      }
    }

    for (var i = 0; i < downlist.length; i++) {
      if (downlist[i].row < height - 1) {
        if (downlist[i].tag == this.playfield[downlist[i].column][downlist[i].row+1].tag) {
          downlist.push(this.playfield[downlist[i].column][downlist[i].row+1]);
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
}
