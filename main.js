const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    // Constructor takes in a 2D array as parameter
    // X is moving through an internal array
    // Y is moving between internal arrays

    constructor(fieldGrid) {
      this._field = fieldGrid;
      this._characterX = 0;
      this._characterY = 0;
    }

    get field() {
        return this._field;
    }

    set field(char) {
        this._field[this.characterY][this.characterX] = char;
    }

    get characterX() {
        return this._characterX;
    }

    set characterX(x) {
        if (x >= 0 && x < this.field[this.characterY].length ) {
            this._characterX = x;
        }
    }

    get characterY() {
        return this._characterY;
    }

    set characterY(y) {
        if (y >= 0 && y < this.field.length ) {
            this._characterY = y;
        }
    }

    print() {
        for(let row of this.field) {
            let newString = '';
            for (let element of row) {
                newString += element;
            }
            console.log(newString);
        }
    }

    updatePath(pathChar) {
        this.field = pathChar;
    }

    findHatXY(hat) {
        for (let i = 0; i < this.field.length; i++) {
            let index = this.field[i].findIndex(element => element === hat);
            if (index !== -1) {
                return [index, i];
            }
        }
    }

    static generateField(width, height, hat, hole, fieldChar, pathChar) {
        let newField = [];
        let holeCount = Math.round(width*height*0.3);
        let hatX = Math.ceil(Math.random()*(width-1));
        let hatY= Math.ceil(Math.random()*(height-1));

        for (let i = 0; i < height; i++) {
            let child = [];
            for (let j = 0; j < width; j++) {
                let element = Math.floor(Math.random()*3);
                if (element === 0) {
                    if (holeCount > 0) {
                        child.push(hole);
                        holeCount -= 1;
                    } else {
                        child.push(fieldChar);
                    }
                } else {
                    child.push(fieldChar);
                }
            }
            newField.push(child);
        }

        // Starting point
        newField[0][0] = pathChar;
        // Hat location
        newField[hatY][hatX] = hat;

        return newField;
    }
}

// Test field

/*const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '^'],
    ['░', '░', '░'],
]);*/

const newField = Field.generateField(10, 10, hat, hole, fieldCharacter, pathCharacter);

const myField = new Field(newField);

let gameEnd = false;

const myHat = myField.findHatXY(hat);

const checkForLoss = () => {
    if (myField.field[myField.characterY][myField.characterX] === hole) {
        return true;
    }
};

const checkForWin = () => {
    if (myField.characterX === myHat[0] && myField.characterY === myHat[1]) {
        return true;
    }
};

// Game loop

while (!gameEnd) {
    myField.print();

    let direction = prompt('Which way (w: up, d: right, s: down, a: left): ').toLowerCase();

    switch (direction) {
        case 'w':
            myField.characterY -= 1;
            break;
        case 's':
            myField.characterY += 1;
            break;
        case 'a':
            myField.characterX -= 1;
            break;
        case 'd':
            myField.characterX += 1;
            break;
    }

    if (checkForLoss()) {
        console.log('You fell down a hole and died...');
        gameEnd = true;
    } else if (checkForWin()) {
        console.log('Congratulations! You found your hat!');
        gameEnd = true;
    } else {
        myField.updatePath(pathCharacter);
    }
}