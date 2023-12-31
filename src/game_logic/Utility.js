/**
 * Gets a random item from the given array.
 * 
 * @param {Array} array 
 * @returns {*} The random item
 */
function getRandomItem(array) {
    const randomIndex = randomInt(array.length);
    return array[randomIndex];
};

/**
 * Returns a random int in range 0 (inclusive) to x (exclusive). Note, x is required.
 * 
 * @param {int} x
 * @returns {int} The random int
 * @throws {Error} Throws error if x is not passed a int
 */
function randomInt(x) {
    if (x === undefined) {
        throw new Error("The parameter x is required! Pass it a int.");
    };

    return Math.floor(Math.random() * x);
};

export {getRandomItem, randomInt}