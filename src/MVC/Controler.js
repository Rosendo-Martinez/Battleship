import Gameboard from '../game_logic/Gameboard';
import Player from '../game_logic/Player';
import AIPlayer from '../game_logic/AIPlayer';
import {getRandomItem} from '../game_logic/Utility';
import View from './View';

class Controler {

    #view;
    /**
     * Player1 is the real player when the game mode is Human vs AI, else it is an AI player.
     */
    #player1;
    /**
     * Player2 is an AI player.
     */
    #player2;
    #player1ShipPositions;
    #player2ShipPositions;
    #player1Starts = true;
    SHIP_LENGTHS = [2,3,3,4,5];
    #hasStarted = false;
    #gameMode = 'Human vs AI';
    #aiBattleTimeoutID;


    constructor() {
        this.#view = new View();

        this.#player1ShipPositions = Gameboard.getRandomPositionOfShips(this.SHIP_LENGTHS);
        this.#player2ShipPositions = Gameboard.getRandomPositionOfShips(this.SHIP_LENGTHS);

        this.#view.createSubGrids();
        this.#view.showBoats(this.#view.BOARD_1,this.#player1ShipPositions);
        this.#view.bindStartClick(this.start.bind(this));
        this.#view.updateMainStatus('Start Game?');
        this.#view.bindGameModeClick(this.toggleGameMode.bind(this));
        this.#view.bindResetClick(this.reset.bind(this));
    }

    /**
     * Function that is binded to the subgrid click event. The click event represents the user attacking the enemy board.
     * 
     * @param {string} id ID of clicked subgrid
     */
    handleSubgridClick(id) {
        const attackCoordinate = this.#view.parseSubGridID(id);
        const isHit = this.#player1.attack(attackCoordinate,this.#player2.gameboard);
        this.#view.unbindSubGridClick(id);
        this.#view.showAttack(this.#view.BOARD_2,attackCoordinate,isHit);
        if (this.#player1.hasWon(this.#player2.gameboard)) {
            this.gameOver('You won!')
        } else {
            this.#view.updateMainStatus('AI Turn');
            setTimeout(() => {
                this.#player2.toggleTurn();
                this.aiPlayTurn(this.#player2,this.#player1,this.#view.BOARD_1)
                if (this.#player2.hasWon(this.#player1.gameboard)) {
                    this.gameOver('AI won!')
                } else {
                    this.#view.updateMainStatus('Your Turn');
                    this.#player1.toggleTurn();
                }
            },600);
        }
    }

    /**
     * Creates and populates a Gameboard with the given boat positions. (Factory Function)
     * 
     * @param {Array} boatPositions [[{row,column},...],...] each inner array represents the coordinates of one ship
     * @returns {Gameboard}
     */
    createGameboard(boatPositions) {
        const gameboard = new Gameboard();
        for (const boat of boatPositions) {
          gameboard.placeShip(boat);
        }
        return gameboard;
    }


    /**
     * Play AI turn. Note, does not toggle enemey's turn.
     * 
     * @param {AIPlayer} ai
     * @param {Player} enemey
     * @param {number} enemeyBoardNumber
     */
    aiPlayTurn(ai,enemey,enemeyBoardNumber) {
        const attackCoordinate = AIPlayer.getOptimalAttackCoordinate(ai.getAttackableCoordinates(),ai.getFoundShipCoordinates(),getRandomItem);
        const isHit = ai.attack(attackCoordinate,enemey.gameboard);
        ai.updateAttackHistory(attackCoordinate,isHit);
        this.#view.showAttack(enemeyBoardNumber,attackCoordinate,isHit);
    }

    /**
     * Function is binded to the start button click event. The click event represents the user starting the game.
     */
    start() {
        if (!this.#hasStarted) {
            this.#hasStarted = true;
            if (this.#gameMode === 'Human vs AI') {
                this.#view.updateMainStatus('Your Turn');
        
                this.#player1 = new Player(this.#player1Starts, this.createGameboard(this.#player1ShipPositions));
                this.#player2 = new AIPlayer(!this.#player1Starts, this.createGameboard(this.#player2ShipPositions));

                this.#view.bindAllSubGridClick(this.#view.BOARD_2,this.handleSubgridClick.bind(this));
            } else {
                this.#player1 = new AIPlayer(this.#player1Starts, this.createGameboard(this.#player1ShipPositions));
                this.#player2 = new AIPlayer(!this.#player1Starts, this.createGameboard(this.#player2ShipPositions));

                this.#view.updateMainStatus('AI 1 Turn');
                setTimeout(() => {
                    this.startAIBattle(this.#player1,this.#player2)
                }, 200);
            }
        }
    }

    /**
     * Ends the game.
     * 
     * @param {string} msg Game over message
     */
    gameOver(msg) {        
        if (this.#gameMode === 'Human vs AI') {
            this.#view.showBoats(this.#view.BOARD_2,this.#player2ShipPositions);
            this.#view.unbindAllSubGridClick();
        } else {
            this.#aiBattleTimeoutID = null;
        }
        this.#view.updateMainStatus(msg);
    }

    /**
     * Resets the game if it has started, else if it has not then it resets the boards (picks new boat positins).
     */
    reset() {
        if (this.#aiBattleTimeoutID !== null) {
            clearTimeout(this.#aiBattleTimeoutID);
            this.#aiBattleTimeoutID = null;
        }

        this.#hasStarted = false;
        this.#view.clearBoards();
        this.#player1ShipPositions = Gameboard.getRandomPositionOfShips(this.SHIP_LENGTHS);
        this.#player2ShipPositions = Gameboard.getRandomPositionOfShips(this.SHIP_LENGTHS);

        if (this.#gameMode === 'Human vs AI') {
            this.#view.showBoats(this.#view.BOARD_1,this.#player1ShipPositions);
            this.#view.unbindAllSubGridClick();
        } else {
            this.#view.showBoats(this.#view.BOARD_1,this.#player1ShipPositions);
            this.#view.showBoats(this.#view.BOARD_2,this.#player2ShipPositions);
        }
        this.#view.updateMainStatus('Start Game?');
    }

    /**
     * Function is binded to the 'Game Mode' button click event. The click event represents the user switching game modes.
     */
    toggleGameMode() {
        this.#gameMode = this.#gameMode === 'Human vs AI' ? 'AI vs AI' : 'Human vs AI';
        this.reset();
        this.#view.updateGameMode(this.#gameMode);
    }

    /**
     * Starts the AI battle.
     * 
     * @param {AIPlayer} playerTurn AI player with current turn
     * @param {AIPlayer} prevPlayerTurn AI player with previous turn
     */
    startAIBattle(playerTurn,prevPlayerTurn) {
        this.aiPlayTurn(playerTurn,prevPlayerTurn, this.#player1 === playerTurn ? this.#view.BOARD_2 : this.#view.BOARD_1);
        if (this.#player1.hasWon(this.#player2.gameboard)) {
            this.gameOver('AI 1 Won');
        } else if (this.#player2.hasWon(this.#player1.gameboard)) {
            this.gameOver('AI 2 Won');
        } else {
            prevPlayerTurn.toggleTurn();
            const temp = playerTurn;
            playerTurn = prevPlayerTurn;
            prevPlayerTurn = temp;
            this.#view.updateMainStatus(this.#player1 === playerTurn ? 'AI 1 Turn' : 'AI 2 Turn');
            const aiBattleCB = () => { this.startAIBattle(playerTurn,prevPlayerTurn) };
            this.#aiBattleTimeoutID = setTimeout(aiBattleCB.bind(this), 200);
        }
    }

}

export default Controler;