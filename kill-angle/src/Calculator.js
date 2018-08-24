import React, { Component } from 'react';
import './Calculator.css';

class Calculator extends Component {
  render() {
    return (
      <div>
        <InputName />
      </div>
    );
  }
}

class InputName extends Component {
  render() { 
    return (
      <input type="text" placeholder="소환사명 입력."/>
    );
  }
}

export default Calculator;
