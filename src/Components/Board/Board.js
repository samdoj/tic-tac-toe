import React, {Component} from 'react';
import './Board.css';
import 'bootstrap/dist/css/bootstrap.css'
import $ from 'jquery';
import {gan, norm} from '../../Components/AIPlayersHOC/neuralNets.js'


class Board extends Component {

    isGameOver() {
        const {base3} = this.state;
        let wins = "";
        let winningSquares = [];
        let i;
        const columnsArray = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
        const diagonalArray = [[0, 4, 8], [2, 4, 6]];
        const rowsArray = [[0,1,2], [3,4,5], [6,7,8]];

       // if (topRow * middleRow * bottomRow === 0) return "O wins!";

        for (i = 0; i < 3; i++) {
            let verticalStr = "";
            let diagonalStr = "";
            let horizontalStr = "";
            let verticalNum, diagonalNum,rowSum;
            for (let j = 0; j < 3; j++) {
                verticalStr += (base3.charAt(columnsArray[i][j]));
                horizontalStr += (base3.charAt(rowsArray[i][j]));
                if (i - 2 !== 0) diagonalStr += (base3.charAt(diagonalArray[i][j]))
            }

            verticalNum = parseInt(verticalStr, 3);
            diagonalNum = parseInt(diagonalStr, 3);
            rowSum = parseInt(horizontalStr, 3);


            if (verticalNum === 0 || diagonalNum === 0 || rowSum === 0) wins = "X wins!";

            if (verticalNum === 26 || diagonalNum === 26 || rowSum === 26) wins = "O wins!";

            if (wins.length > 0)
            {
                if (verticalNum === 0 || verticalNum === 26)
                    winningSquares.push(...columnsArray[i]);

                if (rowSum === 0 || rowSum === 26)
                    winningSquares.push(...rowsArray[i]);
                if (diagonalNum === 0 || diagonalNum === 26)
                    winningSquares.push(...diagonalArray[i]);
            }


        }

        if (base3.indexOf('1') === -1 && !wins.length) wins = "It's a draw.";
        if (winningSquares != undefined || base3.indexOf("1") === -1 && !winningSquares.length) return {winningSquares, wins};
        else if (i===2) return {winningSquares: false, wins: false}
    }
    oTurn (){
        let cells = document.getElementsByClassName("tic-box");
        let moveStrength = [];
        let moves = [];
        const {max} = Math;
        let {base3} = this.state;
        if (this.state.turn === "O") {
            for (let i = 0; i < 9; i++) {
                let potential = [...base3];
                if (potential[i] === "1") {
                    potential[i] = 2; // O's number
                    moves.push(potential);
                    let move = potential.map((n) => norm(n)); //normalize the data
                    moveStrength.push(gan.O.network.activate(move));
                }
                else moveStrength.push([-2]);

            }
            moveStrength = moveStrength.map((moves) => {
                return moves[0]
            });
            let bestMove = moveStrength.indexOf(max(...moveStrength));
            if (bestMove === -2 || base3.charAt(bestMove) !== "1" || this.state.winner) return;
            if(this.isGameOver().wins=='' && bestMove > -2 && base3.charAt(bestMove)==='1') cells[bestMove].innerText = "O";
            $('#activations').html(`${moveStrength[0]}, ${moveStrength[1]}, ${moveStrength[2]}
            <br/>${moveStrength[3]}, ${moveStrength[4]}, ${moveStrength[5]}
            <br/>${moveStrength[6]}, ${moveStrength[7]}, ${moveStrength[8]}`);
            this.setState({base3: base3.replaceAt(bestMove, "2"), turn: "X"}, () => {


            })
        }
    }

    constructor(props) {
        super(props);
        this.state =
            {
                turn: "X",
                base3: "111111111", //A Base 3 number used to train a neural net and to determine if either has won.
                inProgress: true,
                key: props.key,
                winner: undefined
            }
            this.oTurn=this.oTurn.bind(this)

    }


    componentDidUpdate() {
        // alert(this.state.base3)
        const {wins, winningSquares} = this.isGameOver();
        const winner = wins;
        const squares = winningSquares;
        if (winner) {
            this.setState({winner});
            this.setState({base3: "111111111"});
            Board.removeListeners();
            let boxes = $(".tic-box");
            if (winningSquares) //No winning squares if this game is a draw.
            for (let i = 0; i < winningSquares.length; i++) {
                boxes[winningSquares[i]].style.background='green';
            }
            setTimeout(function(){this.initializeSquares()}.bind(this), 2700);
            let winnerDiv = document.getElementById("winner");
            winnerDiv.innerText = winner;
            winnerDiv.style.opacity = "1" ;
            $("#winner").fadeIn(1500);
            $("#winner").fadeOut(1500);

        }
           }

    static removeListeners() {
        const cells = [...document.getElementsByClassName("tic-box")];
        let i;
        try {
            for (i = 0; i < 9; i++) {

                let elNode = cells[i];
                let elClone = elNode.cloneNode(true);
                elNode.parentNode.replaceChild(elClone, elNode); //This exploit removes any listeners attached,
                // as listeners can't be accessed directly nor are the listeners cloned as they aren't children.

            }
        }
        catch (e) {
            alert(i + "  " + e.message);
        }
        console.log("Listeners removed");

    }

    initializeSquares() {
        console.log("Squares initialized");
        this.setState({winner:undefined});
        $("#winner").text("");
        $("#winner").fadeIn();
        let i;
        let currentCell;
        this.setState({inProgress: true});  //Start or restart with game in progress.
        const cells = document.getElementsByClassName("tic-box");
        for (i = 1; i < 10; i++) {
            currentCell = cells[i - 1];
            currentCell.innerHTML = "&nbsp;";
            currentCell.id = i.toString();
            currentCell.style.background="";
            currentCell.addEventListener("mouseover", (e) => {
                    if ("OX".indexOf(e.currentTarget.innerText) > -1) e.currentTarget.style.cursor = 'not-allowed'
                }
            );

            currentCell.addEventListener("click", (e) => {
                //let turn = "OX".indexOf(e.currentTarget.innerText) > -1 ? e.currentTarget.innerText : this.state.turn;
               if ("OX".indexOf(e.currentTarget.innerText) > -1) return;
                let turn = "X";
                e.currentTarget.innerText = "X";
                let toBase3 = this.state.base3;
                let id = parseInt(e.currentTarget.id) - 1;


                this.setState
                (
                    {//X is represented as 0
                        turn: "O" , base3: toBase3.replaceAt(id, '0') //Always replace with 2.
                    },()=>
                    {
                        setTimeout(this.oTurn, 250

                        )
                    })
            });

            if (i < 4)
                currentCell.classList.add("top");
            if (i > 6)
                currentCell.classList.add("bottom");

            if (!(i % 3)) {
                currentCell.classList.add("right")
            }
            else if (!((i - 1) % 3)) {
                currentCell.classList.add("left");
            }
        }

    }


    componentDidMount() {
        this.initializeSquares();
    }


    render() {
        return <div>
            <span></span>
            <div class="align-content-center align-items-center" style={{height:'calc(300px + 10vh'}}>


                <div class="containerj">
                    <div class="row justify-content-center content">

                            <div class="tic-container">
                                <div class="row">
                                    <div class="col-4 tic-box">

                                    </div>
                                    <div class="col-4 tic-box ">

                                    </div>
                                    <div class="col-4 tic-box">

                                    </div>

                                    <div class="col-4 tic-box middle">

                                    </div>
                                    <div class="col-4 tic-box middle">

                                    </div>
                                    <div class="col-4 tic-box middle">

                                    </div>

                                    <div class="col-4 tic-box  left">

                                    </div>
                                    <div class="col-4 tic-box  ">

                                    </div>
                                    <div class="col-4 tic-box  right">


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="text-xl-center hugeText" id="winner">
            </div>
        </div> 


    }
}


export default Board;

