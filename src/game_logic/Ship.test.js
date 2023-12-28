import Ship from "./Ship";

test('ship not hit to not be sunk', () => {
    const length = 3;
    const myShip = new Ship(length)
    expect(myShip.isSunk()).toBe(false);
});

test('ship hit but not sunk to not be sunk', () => {
    const length = 3;
    const myShip = new Ship(length)
    myShip.hit();
    expect(myShip.isSunk()).toBe(false);
});

test('ship sunk to be sunk', () => {
    const length = 3;
    const myShip = new Ship(length)
    for (let i = 0; i < length; i++) {
        myShip.hit();
    };
    expect(myShip.isSunk()).toBe(true);
});

test('hit to return true after hitting not sunk ship', () => {
    const length = 3;
    const myShip = new Ship(length)
    expect(myShip.hit()).toBe(true);
})

test('hit to return false after hitting sunk ship', () => {
    const length = 3;
    const myShip = new Ship(length)
    for (let i = 0; i < length; i++) {
        myShip.hit();
    };
    expect(myShip.hit()).toBe(false);
})