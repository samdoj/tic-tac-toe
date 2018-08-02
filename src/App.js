import React, { Component, } from 'react';

import { Container } from 'semantic-ui-react'
import logo from './Tic_Tac_Toe.png';
import './App.css';
import  'bootstrap/dist/css/bootstrap.css'
import Board from "./Components/Board/Board";
import ReactDOM, {render} from 'react-dom';
const navMenu = require('./navMenu.php').read;
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};


      const _DEV = !true;
class App extends Component {
    constructor()
    {
        super()
        this.state = {menuBar:""};
    }

    shouldComponentUpdate()
    {
        return false;
    }

  render() {




      return (

         <div className="App">
             <div id="navMenuDiv">{navMenu}</div>
             <div id = "mb"></div>
             <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"/>
             <header className="App-header panel container-fluid">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Tic-Tac-Toe</h1>
        </header>
          <div id = 'gameContainer' className = "ContainerClass align-items-center container-fluid">
                 <div className={"col-xl-12 row"} className="dropdown-menu">
                     <div className="dropdown-header"> Game </div>

</div>
                  <Board/>
          </div>
      <script>
          document.getElementById("mb").setInnerHTML(menuBar);
      </script>
         </div>

    );
  }

}

export default App;
