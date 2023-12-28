class Ship {

    length;
    hits = 0;

    constructor(length) {
        this.length = length;
    }

    /**
     * Hit the ship once.
     * 
     * @returns {boolean} True if ship was hit, else false.
     */
    hit() {
        if (this.isSunk()) {
            return false;
        }
        this.hits++;
        return true;
    }

    /**
     * Checks if ship is sunk.
     * 
     * @returns {boolean} True if sunk, else false
     */
    isSunk() {
        return this.hits === this.length;
    }
}

export default Ship;