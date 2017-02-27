var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

var myTurn = false;

if (myTurn) {
    makeMove();
}

function restartGame() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    myTurn = false;
    updateTurn();
}

$(document).ready(function() {
    $("button").click(function() {
        var cell = $(this).attr("id");
        var row = parseInt(cell[1]);
        var col = parseInt(cell[2]);
        if (!myTurn) {
            board[row][col] = false;
            myTurn = true;
            updateTurn();
            makeMove();
        }
    });
    $("#restart").click(restartGame);
});

function updateTurn() {
    updateButtons();
    var winner = findWinner(board);
    $("#winner").text(winner == 1 ? "Oh man, the AI Won!" : winner == 0 ? "WOW, You Won!" : winner == -1 ? "You only tied! Maybe next time." : "");
    $("#move").text(myTurn ? "AI's Move" : "Your move Mr. Fisher");
}

function findWinner(board) {    
    vals = [true, false];
    var allNotNull = true;
    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];
        var diagonalComplete1 = true;
        var diagonalComplete2 = true;
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagonalComplete1 = false;
            }
            if (board[2 - i][i] != value) {
                diagonalComplete2 = false;
            }
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] == null) {
                    allNotNull = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagonalComplete1 || diagonalComplete2) {
            return value ? 1 : 0;
        }
    }
    if (allNotNull) {
        return -1;
    }
    return null;
}

function updateButtons() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $("#c" + i + "" + j).text(board[i][j] === false ? "X" : board[i][j] === true ? "O" : "");
        }
    }
}

function makeMove() {
    board = minMaxMove(board);    
    myTurn = false;
    updateTurn();
}

function minMaxMove(board) {
    numNodes = 0;
    return recurseMinMax(board, true)[1];
}

var numNodes = 0;

function recurseMinMax(board, player) {
    numNodes++;
    var winner = findWinner(board);
    if (winner != null) {
        switch(winner) {
            case 1: return [1, board];
            case 0: return [-1, board];
            case -1: return [0, board];
        }
    } else {        
        var nextVal = null;
        var nextBoard = null;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    board[i][j] = player;
                    var value = recurseMinMax(board, !player)[0];
                    if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                        nextBoard = board.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}

updateTurn();