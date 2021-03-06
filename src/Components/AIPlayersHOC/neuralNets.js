
const synaptic = require('synaptic');
const {Architect} = synaptic;
const learningRate = .1e-5;

let generativeAdversarialNetwork =
    {
    "X" : {network: new Architect.Perceptron(9,1,1)},
    "O" : {network: new Architect.Perceptron(9,1,1)}
};


//I understand adding to the prototype is frowned upon but these functions are additive and something that really should exist.
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.replaceAll = function(search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.tokenCount = function (char)
{
    return [...this].filter((n) => n=== char).length;
};

function teach(gameData, val)
{generativeAdversarialNetwork.O.network.activate(gameData);
    generativeAdversarialNetwork.O.network.propagate(gameData,[1])}

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
           count+=row.tokenCount("1");
        }
        if (column.indexOf(targetNum) > -1 && column.indexOf(opponentNum) === -1)
        {
            //console.log(`COLUMN: ${column}`);
            count+=column.tokenCount("1");

        }
        if (diag.indexOf(targetNum) > -1 && diag.indexOf(opponentNum) === -1)
        {
            count+=diag.tokenCount("1");
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
    return group.tokenCount(test);
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
const opponent  = player === "X" ? "O" : "X";

   // if(countImmanentWins(opponent, gameString)) return - 10;
    return ((countBlockedPaths(opponent,true) * 8) +1 )  * (countBlockedPaths(opponent, false)/2  + 1) * (countImmanentWins(opponent)*-10+1)

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
    if (gameString.tokenCount("1") === 9) return false;
    let xCount = gameString.tokenCount("0");
    let oCount = gameString.tokenCount("2");
    let valid = xCount === oCount;
    valid = valid || xCount - 1 === oCount;
    return valid;

}

//   }
let winningGames = [];
let losingGames = [];
for (let h = 0; h<2; h++)
for (let i = parseInt("011111111",3); i < parseInt("222222222",3) ; i++) {
    gameString = i.toString(3);
    while (gameString.length < 9) //Make sure the number has a full 8 digits.
        gameString = "0" + gameString;
    if (isValidGame(gameString))
    {
           if(isGameOver(gameString).wins.toString().indexOf("O") > -1 || isGameOver(gameString).toString().indexOf("draw") > -1)
               winningGames.concat(gameString)
        else
            losingGames.concat(gameString)
    }
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

winningGames.forEach(gameString =>
{
    let gameData = normalize(gameString);
    for (let i = 0; i<9; i++)
    {
        if (gameString.charAt(i)==="2"); //Character for O
     //  teach(gameData,learningRate*1);
    }
})
losingGames.forEach(gameString =>
{
    let gameData = normalize(gameString);
    for (let i = 0; i<9; i++)
    {
        if (gameString.charAt(i)==="2") //Character for O
            ;//teach(gameData,-learningRate*0);
    }
})


export {generativeAdversarialNetwork as gan, normalize as norm}