import Ship from "./Ship";
import { randomInt } from "./Utility";

/** Class representing a gameboard that is used in the Battleship game. */
class Gameboard {
    /**
     * The number of rows the board has.
     * @type {int}
     * @private
     */
    #ROWS = 10;
    /**
     * The number of columns the board has.
     * @type {int}
     * @private
     */
    #COLS = 10;
    /**
     * A 2D arrray represenation of the board where the ships are placed.
     * @type {Array}
     * @private
     */
    #board;
    /**
     * A list of the ships on the game board.
     * @type {Array}
     * @private
     */
    #ships = [];
    /**
     * A list of past attacks and wether the attack was a hit or miss. The format of the past attacks is {'row,column':<boolean>}, where true indicates a hit.
     * @type {Array}
     * @private
     */
    #attacks = [];

    constructor() {
        this.#board = Array(this.#ROWS).fill(null).map(() => Array(this.#COLS).fill(null));
    }

    /**
     * Checks if a ship can be placed at the given coordinates.
     * 
     * @param {Array} coordinates Array of {row, column} objects
     * @returns {boolean} True if ship can be placed, else false
     */
    canPlaceShip(coordinates) {
        for (let i = 0; i < coordinates.length; i++) {
            const c = coordinates[i];
            if ((c.row < 0 || c.row >= this.#ROWS) ||
                (c.column < 0 || c.column >= this.#COLS) ||
                (this.#board[c.row][c.column] instanceof Ship)
            ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Creates a Ship and places it on the given coordinates. (Ship length will equal coordinates.length)
     * 
     * @param {Array} coordinates Array of {row, column} objects
     * @throws Throws error if coordinates are out of bounds, or if coordinates overlap with that of another ship
     */
    placeShip(coordinates) {
        // Checks if coordinates are legal
        for (let i = 0; i < coordinates.length; i++) {
            const c = coordinates[i];
            if (c.row < 0 || c.row >= this.#ROWS || c.column < 0 || c.column >= this.#COLS) {
                throw new Error('Coordinates are out of bounds. Can not place Ship outside gameboard!');
            } else if (this.#board[c.row][c.column] instanceof Ship) {
                throw new Error('Ship already placed at given coordinates. Can not place a ship on top of another ship!');
            }
        }


        const length = coordinates.length;
        const ship = new Ship(length);
        this.#ships.push(ship);

        coordinates.forEach(c => {
            this.#board[c.row][c.column] = ship;
        });
    }

    /**
     * Attacks the given coordinate. If coordinate has ship, then it will be hit, else attack will be a miss.
     * 
     * @param {Object} coordinate {row, column}
     * @returns {boolean} True if hit and false if miss
     * @throws {Error} Throws error if coordinate is out of bounds or if that position has already been attacked
     */
    recieveAttack(coordinate) {
        if (coordinate.row < 0 || coordinate.row >= this.#ROWS || coordinate.column < 0 || coordinate.column >= this.#COLS) {
            throw new Error('Attack coordinate is out of bounds!');
        }

        for (let i = 0; i < this.#attacks.length; i++) {
            const pastAttack = this.#attacks[i];
            if (pastAttack.hasOwnProperty(`${coordinate.row},${coordinate.column}`)) {
                throw new Error('Already attacked once at given coordinate!');
            }
        }

        if (this.#board[coordinate.row][coordinate.column] instanceof Ship) {
            const ship = this.#board[coordinate.row][coordinate.column];
            ship.hit();
            this.#attacks.push({[`${coordinate.row},${coordinate.column}`] : true})
            return true;   
        }
        this.#attacks.push({[`${coordinate.row},${coordinate.column}`] : false})
        return false;
    }

    /**
     * Checks if all ships are sunk.
     * 
     * @returns {boolean} True if all ships are sunk, else false
     */
    areAllShipsSunk() {
        for (let i = 0; i < this.#ships.length; i++) {
            const ship = this.#ships[i];
            if (!ship.isSunk()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns a random legal set of ship positions.
     * 
     * @param {Array} shipLengths An array of ints
     * @returns {Array} Returns a 2D array, each subarray represents one ship's coordinates
     */
    static getRandomPositionOfShips(shipLengths) {
        const ROWS = 10;
        const COLUMNS = 10;
        const VERTICAL = 0;
        const HORIZONTAL = 1;
        const ORIENTATIONS = 2;

        const myGameBoard = new Gameboard();
        const shipPositions = []
        for (const length of shipLengths) {
            let foundLegalPositionForShip = false;
            while (!foundLegalPositionForShip) {
                const randomCoordinate = {row:randomInt(ROWS),column:randomInt(COLUMNS)};
                const randomOrientation = randomInt(ORIENTATIONS);
                const randomShipPosition = Gameboard.#getShipCoordinates(randomCoordinate,length,VERTICAL === randomOrientation);
                if (myGameBoard.canPlaceShip(randomShipPosition)) {
                    myGameBoard.placeShip(randomShipPosition);
                    shipPositions.push(randomShipPosition);
                    foundLegalPositionForShip = true;
                }
            }
        }
        return shipPositions;
    }

    /**
     * Given the front/head coordinate of a ship, its length, and orientation it will return the coordinates of that ship.
     * 
     * @param {Object} coordinate {row,column} object that represents the head or front of ship
     * @param {int} length The length of the ship
     * @param {boolean} isVertical Determines orientation of ship
     * @returns {Array} Array of coordinates {row,column}
     */
    static #getShipCoordinates(coordinate, length, isVertical) {
        const shipCoordinates = [];
        let prevRow = coordinate.row;
        let prevColumn = coordinate.column;
        for (let i = 0; i < length; i++) {
            if (isVertical) {
                prevRow += 1;
                shipCoordinates.push({row:prevRow,column:prevColumn});
            } else {
                prevColumn += 1;
                shipCoordinates.push({row:prevRow,column:prevColumn});
            }
        }

        return shipCoordinates;
    }
}

export default Gameboard;