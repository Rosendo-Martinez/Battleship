import Player from "./Player";


/** toggleTurn Test */

test('Toggle turn to true to return true', () => {
    const isStartingPlayer = false;
    const myPlayer = new Player(isStartingPlayer,null);
    expect(myPlayer.toggleTurn()).toBe(true);
})

test('Toggle turn to false to return false', () => {
    const isStartingPlayer = true;
    const myPlayer = new Player(isStartingPlayer,null);
    expect(myPlayer.toggleTurn()).toBe(false);
})


/** attack Tests */

test('Attack is a hit', () => {
    const myPlayer = new Player(null,null);
    const attackCoordinate = {row:0,column:0};
    const mockRecieveAttack = jest.fn((coordinate) => true);
    const mockEnemyGameBoard = {recieveAttack: mockRecieveAttack};
    expect(myPlayer.attack(attackCoordinate, mockEnemyGameBoard)).toBe(true);
    expect(mockRecieveAttack.mock.calls).toHaveLength(1);
    expect(mockRecieveAttack.mock.calls[0][0]).toBe(attackCoordinate);
})

test('Attack is a miss', () => {
    const myPlayer = new Player(null,null);
    const attackCoordinate = {row:0,column:0};
    const mockRecieveAttack = jest.fn((coordinate) => false);
    const mockEnemyGameBoard = {recieveAttack: mockRecieveAttack};
    expect(myPlayer.attack(attackCoordinate, mockEnemyGameBoard)).toBe(false);
    expect(mockRecieveAttack.mock.calls).toHaveLength(1);
    expect(mockRecieveAttack.mock.calls[0][0]).toBe(attackCoordinate);
})

test('Can not attack if not player turn', () => {
    const initialTurn = false;
    const myPlayer = new Player(initialTurn,null);
    const attackCoordinate = {row:0,column:0};
    const mockEnemyGameBoard = {recieveAttack: () => {}};
    expect(() => {myPlayer.attack(attackCoordinate,mockEnemyGameBoard)}).toThrow('Not player turn. Can not attack!');
})

test('Can not attack more than once per turn', () => {
    const initialTurn = true;
    const myPlayer = new Player(initialTurn,null);
    const attackCoordinate = {row:0,column:0};
    const mockEnemyGameBoard = {recieveAttack: () => {}};
    myPlayer.attack(attackCoordinate, mockEnemyGameBoard);
    expect(() => {myPlayer.attack(attackCoordinate, mockEnemyGameBoard)}).toThrow('Not player turn. Can not attack!');
})


/** hasWon Tests */

test('Player has not won', () => {
    const myPlayer = new Player(null,null);
    const mockAreAllShipsSunk = jest.fn(() => false); 
    const mockEnemyGameBoard = {areAllShipsSunk: mockAreAllShipsSunk};
    expect(myPlayer.hasWon(mockEnemyGameBoard)).toBe(false);
    expect(mockAreAllShipsSunk.mock.calls).toHaveLength(1);
})

test('Player has won', () => {
    const myPlayer = new Player(null,null);
    const mockAreAllShipsSunk = jest.fn(() => true); 
    const mockEnemyGameBoard = {areAllShipsSunk: mockAreAllShipsSunk};
    expect(myPlayer.hasWon(mockEnemyGameBoard)).toBe(true);
    expect(mockAreAllShipsSunk.mock.calls).toHaveLength(1);
})

/** constructor Tests */

test('Constructor throws error if not passed required arguments', () => {
    expect(() => new Player()).toThrow('Must pass required constructor arguments!');
    expect(() => new Player(true)).toThrow('Must pass required constructor arguments!');
})