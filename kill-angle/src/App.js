import React, { Component } from 'react';
import './App.css';
import Calculator from './Calculator.js'

class App extends Component {

  componentDidMount(){
    fetch('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/RiotSchmick?api_key=RGAPI-5b02683d-e97d-45a7-8ff8-bd2b3790a574');
  }
  /* na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/RiotSchmick?api_key=RGAPI-5b02683d-e97d-45a7-8ff8-bd2b3790a574*/
  render() {
    return (
      <div className="App">
        <Calculator />
      </div>
    );
  }
}

export default App;
