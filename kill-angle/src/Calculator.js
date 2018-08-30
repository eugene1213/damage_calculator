import React, { Component } from 'react';
import './Calculator.css';

class Calculator extends Component {
  render() {
    return (
      <div className="formWrap">
        <AttackChampion />
        <AttackItem />
        <DefenseChampion />
        <DefenseItem />        
      </div>
    );
  }
}

class AttackChampion extends Component {
  render() { 
    return (
      <div className="inputWrap">
          <input id="id1" type="text" placeholder="champion id"/>
          <input id="lv1" type="text" placeholder="champion level"/>
      </div>
    );
  }
}
class DefenseChampion extends Component {
  render() { 
    return (
      <div className="inputWrap">
          <input id="id2" type="text" placeholder="champion id"/>
          <input id="lv2" type="text" placeholder="champion level"/>
      </div>
    );
  }
}

class AttackItem extends Component {
  render() { 
    return (
      <div className="inputWrap">
          <input id="item1" type="text" placeholder="item1"/>
          <input id="item2" type="text" placeholder="item2"/>
          <input id="item3" type="text" placeholder="item3"/>
          <input id="item4" type="text" placeholder="item4"/>
          <input id="item5" type="text" placeholder="item5"/>
          <input id="item6" type="text" placeholder="item6"/>
      </div>
    );
  }
}

class DefenseItem extends Component {
  render() { 
    return (
      <div className="inputWrap">
          <input id="item7" type="text" placeholder="item1"/>
          <input id="item8" type="text" placeholder="item2"/>
          <input id="item9" type="text" placeholder="item3"/>
          <input id="item10" type="text" placeholder="item4"/>
          <input id="item11" type="text" placeholder="item5"/>
          <input id="item12" type="text" placeholder="item6"/>
      </div>
    );
  }
}

export default Calculator;
