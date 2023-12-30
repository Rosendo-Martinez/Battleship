/** Class representing a player of the Battleship game. */
class Player {
    /**
     * Indicates if is this player's turn to attack.
     * @type {boolean}
     * @private
     */
    #turn;
    /**
     * This player's gameboard.
     * @private
     */
    #gameboard;

    /**
     * @param {boolean} turn 
     * @param {Gameboard} gameboard 
     */
    constructor(turn, gameboard) {
        if (turn === undefined || gameboard === undefined) {
            throw new Error('Must pass required constructor arguments!');
        }
        this.#turn = turn;
        this.#gameboard = gameboard;
    }

    get gameboard() {
        return this.#gameboard;
    }

    /**
     * Attacks the enemy gameboard at the given coordinates and toggles this player's turn.
     * 
     * @param {Object} coordinate 
     * @param {Gameboard} enemyBoard
     * @returns {boolean} True if hit, and false if miss
     * @throws Throws error if is not player turn, and calls method that can throws errors
     */
    attack(coordinate, enemyBoard) {
        if (this.#turn === false) {
            throw new Error('Not player turn. Can not attack!');
        }

        const isHit = enemyBoard.recieveAttack(coordinate);
        this.toggleTurn();

        return isHit;
    }

    /**
     * Checks if this player has won. Should be called after every attack! Note, false does not indicate that player has lost, only that he has not won!
     * 
     * @param {Gameboard} enemyBoard The enemy gameboard
     * @returns {boolean} True if won, else false 
     */
    hasWon(enemyBoard) {
        return enemyBoard.areAllShipsSunk();
    }

    /**
     * Toggles this player's turn.
     * 
     * @returns {boolean} Returns new turn state
     */
    toggleTurn() {
        this.#turn = !this.#turn;
        return this.#turn;
    }
}

export default Player;