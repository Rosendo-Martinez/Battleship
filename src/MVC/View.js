class View {

    #board1;
    #board2;
    #onClickHandlerWrapper;
    BOARD_1 = 1;
    BOARD_2 = 2;

    constructor() {
        this.#board1 = document.getElementById('player1-gameboard');
        this.#board2 = document.getElementById('player2-gameboard');
    }

    /**
     * Create the 'subgrids' for both boards.
     */
    createSubGrids() {
        this.#createSubGridsFor(this.#board1,this.BOARD_1);
        this.#createSubGridsFor(this.#board2,this.BOARD_2);
    }

    /**
     * Create the 'subgrids' for the given board.
     * @param {*} board The DOM board element
     * @param {number} boardNumber The respective board number
     */
    #createSubGridsFor(board,boardNumber) {
        const ROWS = 10;
        const COLUMNS = 10;
      
        for (let i = 0; i < ROWS; i++) {
          for (let j = 0; j < COLUMNS; j++) {
            const subgrid = document.createElement('div');
            subgrid.classList.add("subgrid");
            subgrid.id = (`B${boardNumber}R${i}C${j}`);
            board.appendChild(subgrid);
          }
        }
    }

    /**
     * Returns the ID of the subgrid at the specified board, row, and column.
     * 
     * @param {number} boardNumber 
     * @param {number} row 
     * @param {number} column 
     * @returns {string} The ID of subgrid
     */
    toSubgridID(boardNumber, row, column) {
        return `B${boardNumber}R${row}C${column}`;
    }

    /**
     * Creates a click event for every subgrid. Binds handler to each click event.
     * The handler is passed the ID of the subgrid that fired the click event.
     * 
     * @param {number} boardNumber 
     * @param {Function} handler The function to bind which will be called when event happens
     */
    bindAllSubGridClick(boardNumber,handler) {
        this.#onClickHandlerWrapper = (event) => {
            handler(event.target.id);
        };

        let board = boardNumber === this.BOARD_1 ? this.#board1 : this.#board2;
        const subgrids = board.querySelectorAll('.subgrid');
        for (const sg of subgrids) {
            sg.addEventListener('click',this.#onClickHandlerWrapper)
        }
    }

    /**
     * Unbinds all click events from the subgrids of the given board.
     * 
     * @param {number} boardNumber Number that represents a board
     */
    unbindAllSubGridClick(boardNumber) {
        let board = boardNumber === this.BOARD_1 ? this.#board1 : this.#board2;
        const subgrids = board.querySelectorAll('.subgrid');
        for (const sg of subgrids) {
            sg.removeEventListener('click',this.#onClickHandlerWrapper)
        }
    }

    /**
     * Unbind click event from subgrid with given ID.
     * 
     * @param {string} subgridID ID of the subgrid
     */
    unbindSubGridClick(subgridID) {
        const subgrid = document.querySelector(`#${subgridID}`);
        subgrid.removeEventListener('click',this.#onClickHandlerWrapper);
    }

    /**
     * Parses the ID of a subgrid for the row and column values.
     * 
     * @param {string} subgridID 
     * @returns {Object} {row, column}
     */
    parseSubGridID(subgridID) {
        const row = parseInt(subgridID[3]);
        const column = parseInt(subgridID[5]);
        return {row,column};
    }

    /**
     * Styles the subgrids to visually represent the boats.
     * 
     * @param {Number} boardNumber The number representing the board to show the boats on
     * @param {Array} boatPositions [[{row,column},...],...] each inner array represents the position of 1 boat
     */
    showBoats(boardNumber,boatPositions) {
        let board = boardNumber === this.BOARD_1 ? this.#board1 : this.#board2;
        for (const boat of boatPositions) {
            for (const coordinate of boat) {
                const subgridId = this.toSubgridID(boardNumber,coordinate.row,coordinate.column);
                const subgrid = document.querySelector(`#${subgridId}`);
                subgrid.classList.add('boat');
            }
        }
    }

    /**
     * Styles the subgrid to visually represent the attack.
     * 
     * @param {Number} boardNumber 
     * @param {Object} coordinate {row,column} 
     * @param {boolean} isHit Hit = true, miss = false
     */
    showAttack(boardNumber,coordinate,isHit) {
        const subgridId = this.toSubgridID(boardNumber,coordinate.row,coordinate.column);
        const subgrid = document.querySelector(`#${subgridId}`);
        subgrid.classList.add(isHit ? 'hit' : 'miss');
    }

    /**
     * Updates the main status.
     * 
     * @param {string} newStatus 
     */
    updateMainStatus(newStatus) {
        const mainStatus = document.querySelector('.main-status');
        mainStatus.textContent = newStatus;
        mainStatus.classList.remove('blink-in');
        mainStatus.classList.add('blink-in');
    }

    /**
     * Creates a click event for the 'Start' button. Binds the given handler to it.
     * 
     * @param {Function} handler Handles the event
     */
    bindStartClick(handler) {
        const start = document.querySelector('.start');
        start.addEventListener('click',handler);
    }

    /**
     * Creates a click event for the 'Game Mode' button. Binds the given handler to it.
     * 
     * @param {Function} handler Handles the event
     */
    bindGameModeClick(handler) {
        const gameMode = document.querySelector('.game-mode');
        gameMode.addEventListener('click',handler);
    }

    /**
     * Updates the game mode.
     * 
     * @param {string} newGameMode
     */
    updateGameMode(newGameMode) {
        const gameModeStatus = document.querySelector('.sub-status.bottom');
        gameModeStatus.textContent = newGameMode;
    }

    /**
     * Removes hit, miss, and boat visualls from both boards.
     */
    clearBoards() {
        this.clearBoard(this.BOARD_1);
        this.clearBoard(this.BOARD_2);
    }

    /**
     * Removes hit, miss, and boat visualls from the given board.
     * @param {number} boardNumber 
     */
    clearBoard(boardNumber) {
        let board = boardNumber === this.BOARD_1 ? this.#board1 : this.#board2;
        const subgrids = board.querySelectorAll('.subgrid');
        for (const sg of subgrids) {
            sg.classList.remove('miss');
            sg.classList.remove('hit');
            sg.classList.remove('boat');
        }
    }

    /**
     * Creates a click event for the 'Reset' button. Binds the given handler to it.
     * 
     * @param {Function} handler Handles the event
     */
    bindResetClick(handler) {
        const reset = document.querySelector('.reset');
        reset.addEventListener('click',handler);
    }
}

export default View;