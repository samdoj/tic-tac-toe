
const synaptic = require('synaptic');
const {Architect} = synaptic;
const learningRate = .1e-15;

let generativeAdversarialNetwork =
    {
    "X" : {network: new Architect.Perceptron(9,18,1)},
    "O" : {network: new Architect.Perceptron(9,18,1)}
};

let lastX, lastO;
let dumbNetwork, mediumNetwork, smartNetwork, unbeatableNetwork;

global.potentialOutcomes={"X":[], "O":[]};
let turnX = true;

//I understand adding to the prototype is frowned upon but these functions are additive and something that should exist.
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.replaceAll = function(search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.instanceCount = function (char)
{
    const target = this;
    return [...this].filter((n) => n=== char).length;
};

//console.log=()=>{return true};
function isGameOver(theGameString) {
        const base3 = theGameString ? theGameString : "111111111";
        const columnsArray = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
        const diagonalArray = [[0, 4, 8], [2, 4, 6]];
        const rowsArray = [[0,1,2], [3,4,5], [6,7,8]];
        if (base3 === "111111111") return ({winningSquares:undefined, wins:false});

        // if (topRow * middleRow * bottomRow === 0) return "O wins!";

        for (let i = 0; i < 3; i++) {
            let verticalStr = "";
            let diagonalStr = "";
            let horizontalStr = "";
            for (let j = 0; j < 3; j++) {
                verticalStr += (base3.charAt(columnsArray[i][j]));
                horizontalStr += (base3.charAt(rowsArray[i][j]));
                if (i !== 2) diagonalStr += (base3.charAt(diagonalArray[i][j]))
            }

            let verticalNum = parseInt(verticalStr, 3);
            let diagonalNum = parseInt(diagonalStr, 3);
            let rowSum = parseInt(horizontalStr, 3);
            let wins = "";
            let winningSquares;

            if (verticalNum === 0 || diagonalNum === 0 || rowSum === 0) wins = "X wins!";

            if (verticalNum === 26 || diagonalNum === 26 || rowSum === 26) wins = "O wins!";

            if (wins.length > 0)
            {
                if (verticalNum === 0 || verticalNum === 26)
                    winningSquares = columnsArray[i];

                if (rowSum === 0 || rowSum === 26)
                    winningSquares = rowsArray[i];
                if (diagonalNum === 0 || diagonalNum === 26)
                    winningSquares = diagonalArray[i];

            }
            if (base3.indexOf('1') === -1 && !wins) wins = "It's a draw.";

            if (winningSquares !== undefined || base3.indexOf("1") === -1) return {winningSquares, wins};
            else if (i===2) return {winningSquares: false, wins: false}

        }

}

/**
 *
 * @param player One of "X" or "O";
 * @param gameString a flattened array marking X's moves as 0, and O's moves as 2
 * @param [explicit] pass true if you want to see each step of the algorithm.
 * @returns {boolean}
 */
function countImmanentWins(player, gameString, explicit) {
    player = player ? player.toUpperCase() : "X";
    if ("XO".indexOf(player)===-1) {
        console.trace();
        throw "Must be either 'X' or 'O', not "}
    if (!gameString || gameString === "111111111") return false;
    const columnsArray = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    const diagonalArray = [[0, 4, 8], [2, 4, 6]];
    const rowsArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const targetNum = player === "X" ? "0" : "2";
    const opponentNum = player !== "X" ? "0" : "2";
    let count = 0;
    if (explicit) {
        console.log("Player     Opponent");
        console.log("-------------------");
        console.log(player, player === "X" ? "      O" : "          X");
    }
    // noinspection EqualityComparisonWithCoercionJS
    const freeSquares = [...gameString].filter((n) => n == 1).length;
    if (freeSquares < 2) return false; //This game will result in a draw.

    for (let i = 0; i < 3; i++) {
        let verticalStr = "";
        let diagonalStr = "";
        let horizontalStr = "";
        for (let j = 0; j < 3; j++) {
            verticalStr += (gameString.charAt(columnsArray[i][j]));
            horizontalStr += (gameString.charAt(rowsArray[i][j]));
            if (i - 2 !== 0) diagonalStr += (gameString.charAt(diagonalArray[i][j]))
        }

        const opponentInVertical = verticalStr.indexOf(opponentNum) > -1;
        const opponentInHorizontal = horizontalStr.indexOf(opponentNum) > -1;
        const opponentInDiagonal = diagonalStr.indexOf(opponentNum) > -1;
        // noinspection EqualityComparisonWithCoercionJS
        const targetCountVertical = [...verticalStr].filter((n) => n == targetNum).length === 2;
        // noinspection EqualityComparisonWithCoercionJS
        const targetCountHorizontal = [...horizontalStr].filter((n) => n == targetNum).length === 2;
        // noinspection EqualityComparisonWithCoercionJS
        const targetCountDiagonal = [...diagonalStr].filter((n) => n == targetNum).length === 2;
        // noinspection EqualityComparisonWithCoercionJS
        if(explicit){
        console.log("Opponent in:");
        console.log("i Horizontal Vertical Diagonal","color: blue");
        console.log("------------------------------");
        console.log(`${i} ${opponentInHorizontal.toString().toUpperCase().charAt(0)}         ${opponentInVertical
            .toString().toUpperCase().charAt(0)}          ${
            opponentInDiagonal.toString().toUpperCase().charAt(0)}\n`);
        console.log("2 targets in:");
        console.log("i Horizontal Vertical Diagonal");
        console.log("----------------------------");
        console.log(`${i} ${targetCountHorizontal.toString().toUpperCase().charAt(0)}         ${targetCountVertical
            .toString().toUpperCase().charAt(0)}          ${
            targetCountDiagonal.toString().toUpperCase().charAt(0)}\n`);}if (!(targetCountVertical || targetCountDiagonal || targetCountHorizontal)) continue;
        if (targetCountVertical && !opponentInVertical) count++;
        if (targetCountVertical && !opponentInHorizontal) count++;
        if (targetCountDiagonal && !opponentInDiagonal) count++;
    }
    return count;
}


const {random, round} = Math;
let gameString = "111111111";

function gameStringPrint(gameString) {
    let gameStringPrint;
    gameStringPrint = gameString.replaceAll("1","-");
    gameStringPrint = gameStringPrint.replaceAll("0","X");
    gameStringPrint = gameStringPrint.replaceAll("2","O");
    console.log(gameStringPrint.substr(0,3)+'');
    console.log(gameStringPrint.substr(3,3)+'');
    console.log(gameStringPrint.substr(6,3)+'');
    console.log('\n');
    return gameStringPrint;  //Nothing needs to be returned but this is useful in debugging.
}

function countWinningPaths(player, gs) {
    const columnsArray = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    const diagonalArray = [[0, 4, 8], [2, 4, 6]];
    const rowsArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const targetNum = player === "X" ? "0" : "2";
    const opponentNum = player !== "X" ? "0" : "2";
    if (!gs) gs = gameString;
    let count = 0;
    for (let i = 0; i < 3 ; i++) {
        let row = "", column = "", diag = "";
        for (let j = 0; j < 3; j++) {
            row = row.concat(gs.charAt(rowsArray[i][j]));
            column = column.concat(gs.charAt(columnsArray[i][j]));
            if (i < 2)
                diag = diag.concat(gs.charAt(diagonalArray[i][j]))
        }
        if (row.indexOf(targetNum) > -1 && row.indexOf(opponentNum) === -1)
        {
            //console.log(`ROW: ${row}`);
           count+=row.instanceCount("1");
        }
        if (column.indexOf(targetNum) > -1 && column.indexOf(opponentNum) === -1)
        {
            //console.log(`COLUMN: ${column}`);
            count+=column.instanceCount("1");

        }
        if (diag.indexOf(targetNum) > -1 && diag.indexOf(opponentNum) === -1)
        {
            count+=diag.instanceCount("1");
            //console.log(`DIAG: ${diag}`);
          }
        //console.log(row, column, diag)
    }
    //gameStringPrint(gameString)

    //console.log(`There are ${count} winning paths for ${player}`);

return count;
}

function isBlocked(gameStringPiece, opponent) {
    let player = opponent === "X" ? "2" : "0";
    let tmp = opponent === "X" ? "0" : "2";
    opponent = tmp;
    tmp = canBlock(gameStringPiece, opponent) && gameStringPiece.indexOf(player) > -1;
    return tmp;
}

function canBlock(gameStringPiece, player)
{   if (player === "X")
    player = "0";
    if (player === "O")
        player = "2";
    return gameStringPiece.indexOf(player) !== gameStringPiece.lastIndexOf(player);

}

function isWinBlocked(group, test) {
    return group.instanceCount(test);
}

/**
 * Returns 0 if the player didn't block the opponent and could not have.  Negative one if the player could have blocked the opponent, and 1 if they did.
 * @param opponent
 */
function countBlockedPaths(opponent, detectBlockedWins) {
    const columnsArray = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    const diagonalArray = [[0, 4, 8], [2, 4, 6]];
    const rowsArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
      let sum = 0;
    let count = 0;
    let blockedWinCount = 0;

    for (let i = 0; i < 3; i++) {
        let row = "", column = "", diag = "";
        for (let j = 0; j < 3; j++) {
            row = row.concat(gameString.charAt(rowsArray[i][j]));
            column = column.concat(gameString.charAt(columnsArray[i][j]));
            if (i < 2)
                diag = diag.concat(gameString.charAt(diagonalArray[i][j]))
        }
        let winBlocked = {row: isWinBlocked(row,opponent), column : isWinBlocked(column, opponent), diag: isWinBlocked(diag, opponent)};

        //Either both indexOf and lastIndexOf are -1, which means it's not there or only one is there, or they're different.
        if (isBlocked(row, opponent) && (winBlocked.row || !detectBlockedWins)) {
            sum += 1;
            count += 1;

            if (detectBlockedWins && winBlocked.row)
                blockedWinCount++;
        }
        else if (canBlock(row, opponent))
            sum++;
        if (isBlocked(column, opponent) && (winBlocked.column || !detectBlockedWins)) {
            sum += 1;
            count += 1;
            if (detectBlockedWins && winBlocked.column)
                blockedWinCount++;
        }
        else if (canBlock(column, opponent))
            sum++;

        if (isBlocked(diag, opponent) && (winBlocked || !detectBlockedWins)) {
            sum += 1;
            count += 1;

            if (detectBlockedWins && winBlocked.diag)
                blockedWinCount++;
        }
        else if (canBlock(diag, opponent))
            sum++;
    }
       //gameStringPrint(gameString)
        //console.log(`sum: ${sum}\ncount: ${count}`);
    return detectBlockedWins ? blockedWinCount : sum;


}


function moveVal(player) {
let val=1;
const opponent  = player === "X" ? "O" : "X";
const squaresLeft = gameString.instanceCount("1");

if (squaresLeft > 6 )
    return countWinningPaths(player)*1000;

//If the game is over, reward is 1 if the game is won, if it's a loss, it's a -1
if (isGameOver(gameString).wins)
    {
        if (isGameOver(gameString).wins.indexOf(opponent)) return -100;
        else return 100;
    }
    if(countImmanentWins(opponent)) return - 100;
    val = countWinningPaths(player) + 8*countBlockedPaths(opponent) + 13 * countBlockedPaths(opponent,true);
    return val
}


//Neural nets in this library don't take inputs > 1, so the data must be normalized.  2 is turned to .5
function normalize(n)
{
n = parseInt(n);
        switch (n) {
            case 0:
                return 0;

            case 1:
                return 1;
            case 2:
                return .5
        }
}

// //Main body of code
// for (let i=0; i < 1e3; i++) {
//     if (i % 10000 === 0)
//     {
//         let num = new Intl.NumberFormat("en-us");
//     console.log(`i = ${num.format(i)}`);
//     }
//     let iterations = 0;
//     gameString = "111111111";
// while (!isGameOver(gameString).wins) {
//     iterations++;
//     let index = round(random() * 8);
//    // console.log(`gameString: ${gameString} Index: ${index}`);
//     while (gameString.charAt(index) !== '1')
//     { //console.log(`Collision at ${index}`)
//         index = round(random() * 8);
//     }
//    // console.log('\n');
//     let replacement = turnX ? "0" : "2";
//     gameString = gameString.replaceAt(index, replacement);
//
// //gameStringPrint(gameString);
//     let player = turnX ? "X" : "O";
//     let pValueForMove = moveVal(player);
//     let gameData = [...gameString];
//     gameData = gameData.map((n) => normalize(n));
//     if (turnX) lastX = gameData;
//     else lastO = gameData;
//    if (turnX) {
//        generativeAdversarialNetwork.X.network.activate(gameData);
//        generativeAdversarialNetwork.X.network.propagate(.2, [pValueForMove]);
//        // if(isGameOver(gameString).wins.toString().indexOf("X") > -1) generativeAdversarialNetwork.X.network.propagate(.6, [pValueForMove]);
//        // if(isGameOver(gameString).wins.toString().indexOf("O") > -1) generativeAdversarialNetwork.X.network.propagate(.6, [pValueForMove]);
//
//    }
//    else {
//        generativeAdversarialNetwork.O.network.activate(gameData);
//        generativeAdversarialNetwork.O.network.propagate(.2, [pValueForMove]);
//        // if(isGameOver(gameString).wins.toString().indexOf("X") > -1) generativeAdversarialNetwork.O.network.propagate(.6, [pValueForMove]);
//        // if(isGameOver(gameString).wins.toString().indexOf("O") > -1) generativeAdversarialNetwork.O.network.propagate(.6, [pValueForMove]);
//
//    }
//    turnX = !turnX;
// //console.log(oValueForMove)
// }
//
// let gameData = [...gameString];
//     let xWins = isGameOver(gameString).wins.indexOf("X") > -1;
//     let xVal = xWins ? 1 : -1;
//     let oVal = -xWins;
//     let xInputs  = lastX;
//     let oInputs  = lastO;
//     //console.dir(xInputs)
//     if(!turnX) //turnX was just negated
//     {
//         generativeAdversarialNetwork.X.network.activate(gameData);
//         generativeAdversarialNetwork.X.network.propagate(1, [xVal]);
//     }
//     else {
//         generativeAdversarialNetwork.O.network.activate(gameData);
//         generativeAdversarialNetwork.X.network.propagate(1, [oVal]);
//     }
//
//     lastX = "111111111";
//     lastO = "111111111";
function isValidGame(gameString) {
    if (gameString.instanceCount("1") === 9) return false;
    let xCount = gameString.instanceCount("0");
    let oCount = gameString.instanceCount("2");
    let valid = xCount === oCount;
    valid = valid || xCount - 1 === oCount;
    return valid;

}

//   }
for (let h = 0; h<2; h++)
for (let i = parseInt("011111111",3); i < parseInt("222222222",3) ; i++) {
    gameString = i.toString(3);
    while (gameString.length < 9) //Make sure the number has a full 8 digits.
        gameString = "0" + gameString;
    if (isValidGame(gameString))
    {
           let gameData = [...gameString].map( (n) => normalize(n));

           let xval = moveVal("X");
           generativeAdversarialNetwork.X.network.activate(gameData);
           generativeAdversarialNetwork.X.network.propagate(learningRate,[xval]);

           if (gameString.indexOf("2") > -1 )
           {
               let oval = moveVal("O");
               generativeAdversarialNetwork.O.network.activate(gameData);
               generativeAdversarialNetwork.O.network.propagate(learningRate,[oval]);
           console.log();
           }
    }

}
let xWinCount = 0;
let oWinCount = 0;
for (let trainee = 0; trainee<3; trainee += 2);
// {
//     console.log(`Trainee is ${trainee ? "O" : "X"}`);
//     let states = [];
//     let xTurn = false;
// for (let i = 0; i < 5e4 ; i++) {
//     if (i % 1000 === 0) console.log(i)
//         let replacement;
//     let player = xTurn ? "X" : "O";
//     gameString = "111111111";
//     xTurn= !xTurn;
//
//     while (!isGameOver(gameString).wins)
//     {
//         let ct=0;
//         let moves = [];
//         let gameData;
//     //Loop over the game string alternating turns and finding the highest activation of the changed string going from 0-8
//         for (let j = 0; j < 9 ; j++)
//         {
//          let afterMove = gameString;
//          if (afterMove.charAt(j) === "1") afterMove = afterMove.replaceAt(j,player);
//          replacement = xTurn ? "0" : "2";
//          afterMove = afterMove.replace(player, replacement);
//                 gameData = [...afterMove];
//                 gameData.map((n) => normalize(n));
//             if (afterMove === gameString) {
//                 moves.push(-2)
//             }
//             else {
//                 moves.push(...generativeAdversarialNetwork[player].network.activate(gameData));
//             }
//         }
//            // gameStringPrint(gameString);
//         let bestSpot = moves.indexOf(Math.max(...moves)); //We're training one player at a time to make the best moves.
//             //console.log(`BEST index = : ${bestSpot}`);
//
// // Play best move if the current player is the neural net we're training.
//         gameString = gameString.replaceAt(bestSpot, player);
//         gameString = gameString.replace(player, replacement);
//
//         gameData = [...gameString].map((n) => normalize(n));
//            states.push(gameData);
//            xTurn = !xTurn;
//            //todo: propagate here
//         let network = xTurn ? generativeAdversarialNetwork.X.network : generativeAdversarialNetwork.O.network;
//         network.activate(gameData);
//         network.propagate(.3, [moveVal(player)])
//         ct++
//
//     }
// //    console.dir(isGameOver(gameString));
//     let winner = isGameOver(gameString).wins;
//     let backPropNum = 0;
//
//     }
//
// }
let xTurn;
const iterations = 1e2;
for (let i = 0; i < iterations ; i++) {
    if (i % 1000 === 0) console.log(i);
    let replacement;
    gameString = "111111111";
    xTurn= true;

    while (!isGameOver(gameString).wins)
    {

        let player = xTurn ? "X" : "O";
        let ct=0;
        let moves = [];
        let gameData;
        //Loop over the game string alternating turns and finding the highest activation of the changed string going from 0-8
        for (let j = 0; j < 9 ; j++)
        {
            let afterMove = gameString;
            if (afterMove.charAt(j) === "1") afterMove = afterMove.replaceAt(j,player);
            replacement = xTurn ? "0" : "2";
            afterMove = afterMove.replace(player, replacement);
            gameData = [...afterMove];
            gameData.map((n) => normalize(n));
            if (afterMove !== gameString)

                moves.push(...generativeAdversarialNetwork[player].network.activate(gameData));
            else moves.push(-1)
        }
        let bestSpot = moves.indexOf(Math.max(...moves));
        if(player === "X" && ct === 0)
            do {
                const {round, random} = Math;
                bestSpot = round(random()*8)
            }
            while (gameString.charAt(bestSpot) !=="1");
            gameString = gameString.replaceAt(bestSpot, player);
            gameString = gameString.replace(player, replacement);

           gameData = [...gameString].map((n) => normalize(n));



        xTurn = !xTurn;
        ct++

    }

    let winner = isGameOver(gameString).wins;
    if (winner)
    {
        //console.dir(isGameOver(gameString));
        gameStringPrint(gameString);
        if (winner.indexOf("X") > -1) xWinCount++;
        if (winner.indexOf("O") > -1) oWinCount++;
    }


    //turnX = true;
}

console.warn(`X wins: ${xWinCount} or ${xWinCount/ iterations * 100}%`);
console.warn(`O wins: ${oWinCount} or ${oWinCount / iterations * 100}%`);
console.warn(`draws: ${iterations-xWinCount-oWinCount} or ${(iterations-oWinCount-xWinCount) / iterations * 100}%`);
export {generativeAdversarialNetwork as gan, normalize as norm}