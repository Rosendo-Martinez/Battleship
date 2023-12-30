import Gameboard from "./Gameboard";
import Player from "./Player";
import AIPlayer from "./AIPlayer";
import {getRandomItem} from "./Utility";


describe('Player, Gameboard, and Ship integration tests', () => {
    /**
     * player1's Gameboard
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - - - - - - - -
     * 1 - - - - - - - - - -
     * 2 - - - - - - - - - -
     * 3 - - - - - - - - - -
     * 4 - - - - - - - - - -
     * 5 - - - - - x x - - -
     * 6 - - - - - - - - - -
     * 7 - - - - - - - - - -
     * 8 - - - - - - - - - -
     * 9 - - - - - - - - - -
     */
    const player1Ship1Coordinates = [{row:5,column:5}, {row:5,column:6}];
    
    /**
     * player2's Gameboard
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - - - - - - - -
     * 1 - - - - - - - - - x
     * 2 - - - - - - - - - x
     * 3 - - - - - - - - - -
     * 4 - - - - - - - - - -
     * 5 - - - - - - - - - -
     * 6 - - - - - - - - - -
     * 7 - - - - - - - - - -
     * 8 - - - - - - - - - -
     * 9 - - - - - - - - - -
     */
    const player2Ship1Coordinates = [{row:1,column:9}, {row:2,column:9}];
    
    let player1GameBoard;
    let player2GameBoard;
    let player1;
    let player2;

    beforeEach(() => {
        player1GameBoard = new Gameboard();
        player1GameBoard.placeShip(player1Ship1Coordinates);
        player2GameBoard = new Gameboard();
        player2GameBoard.placeShip(player2Ship1Coordinates);
        
        player1 = new Player(true,player1GameBoard);
        player2 = new Player(false,player2GameBoard);
    })
    
    test('Player2 wins game', () => {
        player1.attack(player2Ship1Coordinates[0],player2GameBoard); // Player1: hit
        player2.toggleTurn();
        player2.attack(player1Ship1Coordinates[0],player1GameBoard); // Player2: hit
        player1.toggleTurn();
        player1.attack({row:0,column:0},player2GameBoard);           // Player1: miss
        player2.toggleTurn();
        player2.attack(player1Ship1Coordinates[1],player1GameBoard); // Player2: hit
    
        expect(player1.hasWon(player2GameBoard)).toBe(false);        // Player1: Lost
        expect(player2.hasWon(player1GameBoard)).toBe(true);         // Player2: Won
    })
    
    test('Player1 wins game', () => {
        player1.attack(player2Ship1Coordinates[0],player2GameBoard); // Player1: hit
        player2.toggleTurn();
        player2.attack(player1Ship1Coordinates[0],player1GameBoard); // Player2: hit
        player1.toggleTurn();
        player1.attack(player2Ship1Coordinates[1],player2GameBoard); // Player1: hit
    
        expect(player1.hasWon(player2GameBoard)).toBe(true);         // Player1: Won
        expect(player2.hasWon(player1GameBoard)).toBe(false);        // Player2: Lost
    })

})

describe('AIPlayer, Gameboard, and Ship integration tests', () => {
    /**
     * player1's Gameboard
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - - - - - - - -
     * 1 - - - - - - - - - -
     * 2 - - x - - - - - - -    <-- Ship1
     * 3 - - x - - - - - - -
     * 4 - - x - - - - - - -
     * 5 - - - - - x x - - -    <-- Ship2
     * 6 - - - - - - - - - -
     * 7 - - - - - - - - - -
     * 8 - - - - - - - - - -
     * 9 x x x x - - - - - -    <-- Ship3
     */
    const ship1 = [{row:2,column:2},{row:3,column:2},{row:4,column:2}];
    const ship2 = [{row:5,column:5}, {row:5,column:6}];
    const ship3 = [{row:9,column:0},{row:9,column:1},{row:9,column:2},{row:9,column:3}];
    
    /**
     * player2's Gameboard
     * 
     *   0 1 2 3 4 5 6 7 8 9
     * 0 - - - - - - - - - -
     * 1 - - - - - - - - - x    <-- ship4
     * 2 - - - - - - - - - x
     * 3 - - - - - - - - - -
     * 4 - - - - - - - - - -
     * 5 - - - - - - x x x x    <-- Ship5
     * 6 - - - - - - - - - -
     * 7 - - - - - - - - - -
     * 8 - - - - - - x x x -    <-- Ship6
     * 9 - - - - - - - - - -
     */
    const ship4 = [{row:1,column:9},{row:2,column:9}];
    const ship5 = [{row:5,column:6}, {row:5,column:7},{row:5,column:8},{row:5,column:9}];
    const ship6 = [{row:8,column:6},{row:8,column:7},{row:8,column:8}];
    
    let aiPlayer1GameBoard = new Gameboard();
    aiPlayer1GameBoard.placeShip(ship1);
    aiPlayer1GameBoard.placeShip(ship2);
    aiPlayer1GameBoard.placeShip(ship3);
    let aiPlayer2GameBoard = new Gameboard();
    aiPlayer2GameBoard.placeShip(ship4);
    aiPlayer2GameBoard.placeShip(ship5);
    aiPlayer2GameBoard.placeShip(ship6);
    const aiPlayer1StartsFirst = true;
    const aiPlayer1 = new AIPlayer(aiPlayer1StartsFirst,aiPlayer1GameBoard);
    const aiPlayer2 = new AIPlayer(!aiPlayer1StartsFirst,aiPlayer2GameBoard);

    test('AIPlayer vs AIPlayer: Expect one to win', () => {
        let isGameOver = false;
        expect(aiPlayer1.hasWon(aiPlayer2.gameboard)).toBe(false);
        expect(aiPlayer2.hasWon(aiPlayer1.gameboard)).toBe(false);
        let turnPlayer = aiPlayer1;
        let previousTurnPlayer = aiPlayer2;
        while (!isGameOver) {
            const attackCoordinate = AIPlayer.getOptimalAttackCoordinate(turnPlayer.getAttackableCoordinates(),turnPlayer.getFoundShipCoordinates(),getRandomItem);
            const isHit = turnPlayer.attack(attackCoordinate,previousTurnPlayer.gameboard);
            turnPlayer.updateAttackHistory(attackCoordinate, isHit);
            if (turnPlayer.hasWon(previousTurnPlayer.gameboard)) {
                isGameOver = true;
            } else {
                previousTurnPlayer.toggleTurn();
                const temp = turnPlayer;
                turnPlayer = previousTurnPlayer;
                previousTurnPlayer = temp;
            }
        }
        expect(turnPlayer.hasWon(previousTurnPlayer.gameboard)).toBe(true);
    })
})

// Note: The toggleTurn thing seems uncessry and easy to forget or mess up
// TODO: Replace and delete the toggleTurn method
