import Gameboard from "./Gameboard";

// WARNING: Test made specfily for gameboard that is 10x10 and 0 index, may not work for other size boards


/* placeShip Tests */

test('Can place ship on empty board', () => {
    const myGameBoard = new Gameboard();
    const coordinates = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    expect(myGameBoard.placeShip(coordinates)).toBe(undefined);
});

test('Can place ship on non-empty board', () => {
    const myGameBoard = new Gameboard();
    const coordinates1 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    const coordinates2 = [{row:0,column:2},{row:1,column:2},{row:2,column:2}];
    myGameBoard.placeShip(coordinates1)
    expect(myGameBoard.placeShip(coordinates2)).toBe(undefined);
});

test('Can not place ship on top of another ship', () => {
    const myGameBoard = new Gameboard();
    const coordinates1 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    const coordinates2 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    myGameBoard.placeShip(coordinates1)
    expect(() => {myGameBoard.placeShip(coordinates2)}).toThrow('Ship already placed at given coordinates. Can not place a ship on top of another ship!');
})

test('Can not place ship out of bounds (10x10) (part in part out, vertical ship)', () => {
    // WARNING: Test work specfily for gameboard that is 10x10 and 0 index
    const myGameBoard = new Gameboard();
    const coordinates = [{row:9,column:0},{row:10,column:0},{row:11,column:0}];
    expect(() => {myGameBoard.placeShip(coordinates)}).toThrow('Coordinates are out of bounds. Can not place Ship outside gameboard!');
})

test('Can not place ship out of bounds (10x10) (part in part out, horizontal ship)', () => {
    // WARNING: Test work specfily for gameboard that is 10x10 and 0 index
    const myGameBoard = new Gameboard();
    const coordinates = [{row:0,column:9},{row:0,column:10},{row:0,column:11}];
    expect(() => {myGameBoard.placeShip(coordinates)}).toThrow('Coordinates are out of bounds. Can not place Ship outside gameboard!'); 
})


/* canPlaceShip Tests */

test('Can place ship on empty board', () => {
    const myGameBoard = new Gameboard();
    const coordinates = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    expect(myGameBoard.canPlaceShip(coordinates)).toBe(true);
});

test('Can not place ship on top of another ship', () => {
    const myGameBoard = new Gameboard();
    const coordinates1 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    const coordinates2 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    myGameBoard.placeShip(coordinates1);
    expect(myGameBoard.canPlaceShip(coordinates2)).toBe(false);
})

test('Can not place ship out of bounds (10x10) (part in part out, vertical ship)', () => {
    // WARNING: Test work specfily for gameboard that is 10x10 and 0 index
    const myGameBoard = new Gameboard();
    const coordinates = [{row:9,column:0},{row:10,column:0},{row:11,column:0}];
    expect(myGameBoard.canPlaceShip(coordinates)).toBe(false);
})

test('Can not place ship out of bounds (10x10) (part in part out, horizontal ship)', () => {
    // WARNING: Test work specfily for gameboard that is 10x10 and 0 index
    const myGameBoard = new Gameboard();
    const coordinates = [{row:0,column:9},{row:0,column:10},{row:0,column:11}];
    expect(myGameBoard.canPlaceShip(coordinates)).toBe(false);   
})


/* recieveAttack Tests */

test('Miss attack on board with no ships', () => {
    const myGameBoard = new Gameboard();
    const attackCoordinates = {row:0,column:0};
    expect(myGameBoard.recieveAttack(attackCoordinates)).toBe(false);
})

test('Hit ship with attack', () => {
    const myGameBoard = new Gameboard();
    const coordinates = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    myGameBoard.placeShip(coordinates);
    const attackCoordinates = {row:1,column:0};
    expect(myGameBoard.recieveAttack(attackCoordinates)).toBe(true);
})

test('Can not attack out of bounds coordinate', () => {
    const myGameBoard = new Gameboard();
    const attackCoordinates = {row:20,column:34};
    expect(() => {myGameBoard.recieveAttack(attackCoordinates)}).toThrow('Attack coordinate is out of bounds!');
})

test('Can not attack same place more than once', () => {
    const myGameBoard = new Gameboard();
    const attackCoordinates = {row:0,column:0};
    myGameBoard.recieveAttack(attackCoordinates);
    expect(() => {myGameBoard.recieveAttack(attackCoordinates)}).toThrow('Already attacked once at given coordinate!');
})


/** areAllShipsSunk Tests  */

test('No ship hit to be not all ships sunk', () => {
    const myGameBoard = new Gameboard();
    const coordinates1 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    const coordinates2 = [{row:0,column:2},{row:1,column:2},{row:2,column:2}];
    myGameBoard.placeShip(coordinates1);
    myGameBoard.placeShip(coordinates2);
    expect(myGameBoard.areAllShipsSunk()).toBe(false);
})

test('Some ships hit but not sunk to be not all ships sunk', () => {
    const myGameBoard = new Gameboard();
    const coordinates1 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    const coordinates2 = [{row:0,column:2},{row:1,column:2},{row:2,column:2}];
    myGameBoard.placeShip(coordinates1);
    myGameBoard.placeShip(coordinates2);
    const attackCoordinate1 = {row:1,column:0};
    const attackCoordinate2 = {row:2,column:2};
    myGameBoard.recieveAttack(attackCoordinate1);
    myGameBoard.recieveAttack(attackCoordinate2);
    expect(myGameBoard.areAllShipsSunk()).toBe(false);
})

test('All ships sunk to be all ships sunk', () => {
    const myGameBoard = new Gameboard();
    const coordinates1 = [{row:0,column:0},{row:1,column:0},{row:2,column:0}];
    const coordinates2 = [{row:0,column:2},{row:1,column:2},{row:2,column:2}];
    myGameBoard.placeShip(coordinates1);
    myGameBoard.placeShip(coordinates2);
    for (let i = 0; i < coordinates1.length; i++) {
        const attackCoordinate = coordinates1[i];
        myGameBoard.recieveAttack(attackCoordinate);
    }
    for (let i = 0; i < coordinates2.length; i++) {
        const attackCoordinate = coordinates2[i];
        myGameBoard.recieveAttack(attackCoordinate);
    }
    expect(myGameBoard.areAllShipsSunk()).toBe(true);
})


/** getRandomPositionOfShips Tests */

test('Test random position of ships is correct (test 1)', () => {
    const shipLengths = [1,2];
    const randomPositionOfShips = Gameboard.getRandomPositionOfShips(shipLengths);
    expect(randomPositionOfShips).toHaveLength(shipLengths.length);
    const myGameBoard = new Gameboard();
    for (const shipCoordinates of randomPositionOfShips) {
        expect(myGameBoard.canPlaceShip(shipCoordinates)).toBe(true);
        myGameBoard.placeShip(shipCoordinates);
    }

    const returnShipLengths = randomPositionOfShips.map((shipCoordinates) => {
        return shipCoordinates.length;
    })

    expect(returnShipLengths.sort()).toEqual(shipLengths);
})

test('Test random position of ships is correct (test 2)', () => {
    const shipLengths = [1,2,3];
    const randomPositionOfShips = Gameboard.getRandomPositionOfShips(shipLengths);
    expect(randomPositionOfShips).toHaveLength(shipLengths.length);
    const myGameBoard = new Gameboard();
    for (const shipCoordinates of randomPositionOfShips) {
        expect(myGameBoard.canPlaceShip(shipCoordinates)).toBe(true);
        myGameBoard.placeShip(shipCoordinates);
    }

    const returnShipLengths = randomPositionOfShips.map((shipCoordinates) => {
        return shipCoordinates.length;
    })

    expect(returnShipLengths.sort()).toEqual(shipLengths);
})   