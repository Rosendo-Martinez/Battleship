import Player from "./Player";

/** A class represnation of an AI player of the Battleship boardgame. */
class AIPlayer extends Player {

    /**
     * Coordinates that have not been attacked.
     * @type {Array}
     * @private
     */
    #attackableCoordinates = [];
    /**
     * Coordinates of latests found ship that is not yet confirmed to be sunk.
     * @type {Array}
     * @private
     */
    #foundShipCoordinates = [];

    /**
     * @param {boolean} turn 
     * @param {Gameboard} gameboard 
     */
    constructor(turn, gameboard) {
        super(turn,gameboard);
        this.#initializeAttackableCoordinates();
    }

    /**
     * Initializes the attackable coordinates array (10x10, 0 index gameboard).
     */
    #initializeAttackableCoordinates() {
        for (let row = 0; row < 10; row++) {
            for (let column = 0; column < 10; column++) {
                this.#attackableCoordinates.push({row,column});
            };
        };
    }

    /**
     * Updates the coordinate attack history. 
     * 
     * IMPORTANT: You should update the coordinate attack history after every attack, so that your attack history can be accurate.
     * 
     * @param {Object} coordinate {row,column}
     * @param {boolean} isHit
     */
    updateAttackHistory(coordinate,isHit) {
        if (isHit) {
            this.#foundShipCoordinates.push(coordinate);
        }
        for (let i = 0; i < this.#attackableCoordinates.length; i++) {
            const currentCrd = this.#attackableCoordinates[i];
            const foundCrd = (coordinate.row === currentCrd.row && coordinate.column === currentCrd.column);
            if (foundCrd) {
                this.#attackableCoordinates.splice(i,1);
                return;
            }
        }
    }

    /**
     * Getter.
     * 
     * @returns {Array} The coordinates that can still be attacked
     */
    getAttackableCoordinates() {
        return this.#attackableCoordinates;
    }

    /**
     * Getter.
     * 
     * @returns The coordinates of the latest found ship;
     */
    getFoundShipCoordinates() {
        return this.#foundShipCoordinates;
    }

    /**
     * Gets the optimal attack coordinates.
     * 
     * WARNING: foundShipCoordinates WILL be mutated if the algorithm sees that all coordinates of ship have been found (i.e it is sunk), it will clear the array.
     * 
     * Note: foundShipCoordinates should only contain the coordinates for one ship who has been hit but not sunk! Otherwise, the function may not work properlly!
     * Note: Guerenty that getRandomItem will be used to pick random optimal solution if their is more than 1 optimal solution.
     * Note: No assumtions are made about board size.
     *
     * ASSUMTIONS: Minimum length of ship is 1 and maximum length is 5.
     * 
     * @param {Array} attackableCoordinates A list of coordinate objects {row,column} that can be attacked (they haven't been attacked before)
     * @param {Array} foundShipCoordinates A list of coordinate(s) of a ship that has been found (i.e hit) but not sunk (Note, the coordinates in this list should all be connected or belong to one ship.)
     * @param {function getRandomItem(Array)}
     * @returns {Object} {row,column}
     */
    static getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, getRandomItem) {
        if (foundShipCoordinates.length === 0) {
            // CASE 1: no ship found
            return getRandomItem(attackableCoordinates);
        } else if (foundShipCoordinates.length === 5) {
            // CASE 2: Ship of max size found
            foundShipCoordinates.length = 0;
            return getRandomItem(attackableCoordinates);
        } else if (foundShipCoordinates.length === 1) {
            // CASE 3: 1 part of ship found
            const shipLocation = foundShipCoordinates[0];
            const optimalAttackCoordinates = [];
            attackableCoordinates.forEach((coordinate) => {
                const rowDistance = Math.abs(coordinate.row - shipLocation.row);
                const columnDistance = Math.abs(coordinate.column - shipLocation.column);
                const isPossibleOptimalCoordinate = ((rowDistance === 0 && columnDistance !== 0) || (rowDistance !== 0 && columnDistance === 0));
                if (isPossibleOptimalCoordinate) {
                    optimalAttackCoordinates.push(coordinate);
                }
            })

            if (optimalAttackCoordinates.length === 0) {
                foundShipCoordinates.length = 0;  
                return getRandomItem(attackableCoordinates);
            } else {
                return getRandomItem(optimalAttackCoordinates);
            }
        } else {
            // CASE 4: more than 1 part of ship found
            const optimalAttackCoordinates = [];
            let possibleOptimalAttackCoordinate1;
            let possibleOptimalAttackCoordinate2;
            const isVerticalShip = (foundShipCoordinates[0].column === foundShipCoordinates[1].column);
            if (isVerticalShip) {
                const [coordinateWithSmallestRow, coordinateWithLargestRow] = AIPlayer.#getMinAndMaxCoordinates(foundShipCoordinates,"row");
                possibleOptimalAttackCoordinate1 = {row:coordinateWithLargestRow.row+1,column:coordinateWithLargestRow.column};
                possibleOptimalAttackCoordinate2 = {row:coordinateWithSmallestRow.row-1,column:coordinateWithSmallestRow.column};
            } else {
                const [coordinateWithSmallestColumn, coordinateWithLargestColumn] = AIPlayer.#getMinAndMaxCoordinates(foundShipCoordinates,"column");
                possibleOptimalAttackCoordinate1 = {row:coordinateWithLargestColumn.row,column:coordinateWithLargestColumn.column+1};
                possibleOptimalAttackCoordinate2 = {row:coordinateWithSmallestColumn.row,column:coordinateWithSmallestColumn.column-1};
            }

            if (AIPlayer.#hasCoordinate(possibleOptimalAttackCoordinate1,attackableCoordinates)) {
                optimalAttackCoordinates.push(possibleOptimalAttackCoordinate1)
            }
            if (AIPlayer.#hasCoordinate(possibleOptimalAttackCoordinate2,attackableCoordinates)) {
                optimalAttackCoordinates.push(possibleOptimalAttackCoordinate2)
            }

            const isShipSunk = optimalAttackCoordinates.length === 0;
            if (isShipSunk) {
                foundShipCoordinates.length = 0;
                return getRandomItem(attackableCoordinates);
            } else {
                return getRandomItem(optimalAttackCoordinates);
            }
        }
    }

    /**
     * Returns the maximum and minumum coordinates based on either row or column.
     * 
     * @param {Array} coordinates Array of coordinate objects {row,column}
     * @param {string} key The key to find max and min coordinates with (should be row or column)
     * @returns {Array} Min is in index 0, and Max is in index 1
     */
    static #getMinAndMaxCoordinates(coordinates, key) {
        let max = coordinates[0];
        let min = coordinates[0];
        coordinates.forEach((coordinate) => {
            const isLarger = (coordinate[key] > max[key]);
            const isSmaller = (coordinate[key] < min[key]);
            if (isLarger) {
                max = coordinate;
            } else if (isSmaller) {
                min = coordinate;
            }
        })
        return [min,max];
    }

    /**
     * Checks if an array of coordinates (coordinates) contains a given coordinate (toLookFor).
     * 
     * @param {Object} toLookFor The coordinate to look for
     * @param {Array} coordinates The list of coordinates
     * @returns {boolean}
     */
    static #hasCoordinate(toLookFor, coordinates) {
        for (let i = 0; i < coordinates.length; i++) {
            const currentCrd = coordinates[i];
            if (toLookFor.row === currentCrd.row && toLookFor.column === currentCrd.column) {
                return true;
            }
        }
        return false;
    }
}

export default AIPlayer;    