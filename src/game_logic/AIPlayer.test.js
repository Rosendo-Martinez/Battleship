import AIPlayer from "./AIPlayer";


/** getOptimalAttackCoordinate Tests */

test('0 optimal attacks, and 5 unoptimal attacks, (no ship)', () => {
    /**
     * o = miss, - = not attacked
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 o o o o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o - - - o o o o o
     * 3 o o o o o o o o o o
     * 4 o o o o o o o o o o
     * 5 o o o o o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o - - o o o o o o
     */

    const attackableCoordinates = [{row:2,column:2},{row:2,column:3},{row:2,column:4},{row:9,column:2},{row:9,column:3}];
    const foundShipCoordinates = [];
    const mockGetRandomItem = jest.fn((array) => array[1])
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(mockGetRandomItem.mock.calls[0][0]).toBe(attackableCoordinates);
    expect(attackableCoordinates).toContainEqual(result);
})

test('4 optimal attacks, and 3 unoptimal attacks, (unkown orientation of ship)', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o - o o o o o o
     * 3 o o - x - o o o o o
     * 4 o o o - o o o o o o
     * 5 o o o - o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const optimalAttackCoordinates = [{row:2,column:3},{row:3,column:2},{row:3,column:4}, {row:4,column:3}];
    const unoptimalAttackCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2}, {row:5,column:3}];
    const attackableCoordinates = [...unoptimalAttackCoordinates,...optimalAttackCoordinates,];
    const foundShipCoordinates = [{row:3,column:3}];
    const mockGetRandomItem = jest.fn((array) => array[1]);
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(new Set(mockGetRandomItem.mock.calls[0][0])).toEqual(new Set(optimalAttackCoordinates));
    expect(optimalAttackCoordinates).toContainEqual(result);
})

test('0 optimal attacks, and 3 unoptimal attacks, (ship of length 1 found and confirmed sunk)', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o o o o o o o o
     * 3 o o o x o o o o o o
     * 4 o o o o o o o o o o
     * 5 o o o o o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const unoptimalAttackCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2}];
    const attackableCoordinates = [...unoptimalAttackCoordinates];
    const foundShipCoordinates = [{row:3,column:3}];
    const mockGetRandomItem = jest.fn((array) => array[0]);
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(new Set(mockGetRandomItem.mock.calls[0][0])).toEqual(new Set(unoptimalAttackCoordinates));
    expect(foundShipCoordinates).toHaveLength(0);
    expect(unoptimalAttackCoordinates).toContainEqual(result);
})

test('2 optimal attacks, and 5 unoptimal attacks, (vertical ship)', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o - o o o o o o
     * 3 o o o x o o o o o o
     * 4 o - - x o o o o o o
     * 5 o o o - o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const optimalAttackCoordinates = [{row:2,column:3},{row:5,column:3}];
    const unoptimalAttackCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2},{row:4,column:1},{row:4,column:2}];
    const attackableCoordinates = [...unoptimalAttackCoordinates,...optimalAttackCoordinates,];
    const foundShipCoordinates = [{row:3,column:3}, {row:4,column:3}];
    const mockGetRandomItem = jest.fn((array) => array[0]);
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(new Set(mockGetRandomItem.mock.calls[0][0])).toEqual(new Set(optimalAttackCoordinates));
    expect(optimalAttackCoordinates).toContainEqual(result);
})

test('0 optimal attacks, and 5 unoptimal attacks, (vertical ship), and check array mutation', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o o o o o o o o
     * 3 o o o x o o o o o o
     * 4 o - - x o o o o o o
     * 5 o o o o o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const attackCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2},{row:4,column:1},{row:4,column:2}];
    const foundShipCoordinates = [{row:3,column:3}, {row:4,column:3}];
    const mockGetRandomItem = jest.fn((array) => array[0]);
    const result = AIPlayer.getOptimalAttackCoordinate(attackCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(foundShipCoordinates.length).toBe(0);
    expect(new Set(mockGetRandomItem.mock.calls[0][0])).toEqual(new Set(attackCoordinates));
    expect(attackCoordinates).toContainEqual(result);
})

test('2 optimal attacks, and 5 unoptimal attacks (horizontal ship)', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o o o o o o o o
     * 3 o o o o o o o o o o
     * 4 o - - x x - o o o o
     * 5 o o o - o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const optimalAttackCoordinates = [{row:4,column:2},{row:4,column:5}];
    const unoptimalAttackCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2},{row:4,column:1},{row:5,column:3}];
    const attackableCoordinates = [...unoptimalAttackCoordinates,...optimalAttackCoordinates,];
    const foundShipCoordinates = [{row:4,column:3}, {row:4,column:4}];
    const mockGetRandomItem = jest.fn((array) => array[0]);
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(new Set(mockGetRandomItem.mock.calls[0][0])).toEqual(new Set(optimalAttackCoordinates));
    expect(optimalAttackCoordinates).toContainEqual(result);
})

test('1 optimal attack, and 5 unoptimal attacks (horizontal ship)', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o o o o o o o o
     * 3 o o o o o o o o o o
     * 4 o - o x x - o o o o
     * 5 o o o - o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const optimalAttackCoordinates = [{row:4,column:5}];
    const unoptimalAttackCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2},{row:4,column:1},{row:5,column:3}];
    const attackableCoordinates = [...unoptimalAttackCoordinates,...optimalAttackCoordinates,];
    const foundShipCoordinates = [{row:4,column:3}, {row:4,column:4}];
    const mockGetRandomItem = (array) => array[0];
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(optimalAttackCoordinates).toContainEqual(result);
})

test('Found ship of max size (5)', () => {
    /**
     * o = miss, - = not attacked, x = hit
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - o o o o o o o
     * 1 o o o o o o o o o o
     * 2 o o o o o o o o o o
     * 3 o o o o o o o o o o
     * 4 x x x x x - o o o o
     * 5 o o o o o o o o o o
     * 6 o o o o o o o o o o
     * 7 o o o o o o o o o o
     * 8 o o o o o o o o o o
     * 9 o o o o o o o o o o
     */

    const attackableCoordinates = [{row:0,column:0},{row:0,column:1},{row:0,column:2},{row:4,column:5}];
    const foundShipCoordinates = [{row:4,column:0}, {row:4,column:1},{row:4,column:2},{row:4,column:3},{row:4,column:4}];
    const mockGetRandomItem = jest.fn((array) => array[0]);
    const result = AIPlayer.getOptimalAttackCoordinate(attackableCoordinates, foundShipCoordinates, mockGetRandomItem);
    expect(mockGetRandomItem.mock.calls).toHaveLength(1);
    expect(new Set(mockGetRandomItem.mock.calls[0][0])).toEqual(new Set(attackableCoordinates));
    expect(attackableCoordinates).toContainEqual(result);
    expect(foundShipCoordinates.length).toBe(0);
})


/** updateAttackHistory Tests */

test('Update attack history with hit', () => {
    const ROWS = 10;
    const COLUMNS = 10;
    const myAIPlayer = new AIPlayer(null,null);
    const attackCoordinate = {row:0,column:1};
    const isHit = true;
    myAIPlayer.updateAttackHistory(attackCoordinate,isHit);
    expect(myAIPlayer.getFoundShipCoordinates()).toContainEqual(attackCoordinate);
    expect(myAIPlayer.getFoundShipCoordinates()).toHaveLength(1);
    expect(myAIPlayer.getAttackableCoordinates()).not.toContainEqual(attackCoordinate);
    expect(myAIPlayer.getAttackableCoordinates()).toHaveLength(ROWS * COLUMNS - 1);
})

test('Update attack history with miss', () => {
    const ROWS = 10;
    const COLUMNS = 10;
    const myAIPlayer = new AIPlayer(null,null);
    const attackCoordinate = {row:0,column:1};
    const isHit = false;
    myAIPlayer.updateAttackHistory(attackCoordinate,isHit);
    expect(myAIPlayer.getFoundShipCoordinates()).toHaveLength(0);
    expect(myAIPlayer.getAttackableCoordinates()).not.toContainEqual(attackCoordinate);
    expect(myAIPlayer.getAttackableCoordinates()).toHaveLength(ROWS * COLUMNS - 1);
})