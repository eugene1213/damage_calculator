import React, { Component } from 'react';
import './App.css';
import Calculator from './Calculator.js'
import Button from 'antd/lib/button';
import { Table } from 'antd';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

var ajax = () => {
  let id1 = document.getElementById('id1').value;
  let id2 = document.getElementById('id2').value;
  let lv1 = document.getElementById('lv1').value;
  let lv2 = document.getElementById('lv2').value;
  let item1 = document.getElementById('item1').value;
  let item2 = document.getElementById('item2').value;
  let item3 = document.getElementById('item3').value;
  let item4 = document.getElementById('item4').value;
  let item5 = document.getElementById('item5').value;
  let item6 = document.getElementById('item6').value;
  let item7 = document.getElementById('item7').value;
  let item8 = document.getElementById('item8').value;
  let item9 = document.getElementById('item9').value;
  let item10 = document.getElementById('item10').value;
  let item11 = document.getElementById('item11').value;
  let item12 = document.getElementById('item12').value;
  
  let queryStr = 'id1='+id1+'&id2='+id2+'&lv1='+lv1+'&lv2='+lv2+'&item1='+item1+'&item2='+item2+'&item3='+item3+'&item4='+item4+'&item5='+item5+'&item6='+item6+'&item7='+item7+'&item8='+item8+'&item9='+item9+'&item10='+item10+'&item11='+item11+'&item12='+item12+''
  fetch('https://127.0.0.1:3001/killangle?'+queryStr)
  .then((response) => {
    console.log(response)
  })
  .catch(err => console.log(err));
};

const columns = [ 
  {
    title: 'type',
    dataIndex: 'type',
    key: 'type'
  }, {
    title: '공격력',
    dataIndex: 'ad',
    key: 'ad'
  }, {
    title: '마법공격력',
    dataIndex: 'ap',
    key: 'ap',
  }, {
    title: '물리방어',
    dataIndex: 'amor',
    key: 'amor',
  }, {
    title: '마법방어',
    dataIndex: 'ap_amor',
    key: 'ap_amor',
  }, {
    title: '체력',
    dataIndex: 'hp',
    key: 'hp',
  }, {
    title: '마나',
    dataIndex: 'mp',
    key: 'mp',
  }, {
    title: '이동속도',
    dataIndex: 'movement_speed',
    key: 'movement_speed',
  }, {
    title: '공격속도',
    dataIndex: 'attack_speed',
    key: 'attack_speed',
  }
];

var data = [
  {
    key: '1',
    type: 'Attack',
    ad: 100,
    ap: 32,
    amor: 100,
    ap_amor: 100,
    hp: 1000,
    mp: 1000,
    movement_speed: 300,
    attack_speed: '1.00'
  }, {
    key: '2',
    type: 'Defense',
    ad: 150,
    ap: 130,
    amor: 200,
    ap_amor: 20,
    hp: 2000,
    mp: 2000,
    movement_speed: 350,
    attack_speed: '2.00'
  }];
class App extends Component {

  state = {

  }
  componentDidMount(){

  }
  _setData = () => {
    const stats = this.state.stats.map((stat,index) => {
      data = [{
        key: '1',
        type: index===0?'Attack':'Defense',
        ad: Math.round(stat.ad),
        ap: Math.round(stat.ap),
        amor: Math.round(stat.adar),
        ap_amor: Math.round(stat.apar),
        hp: Math.round(stat.hp),
        mp: Math.round(stat.mp),
        movement_speed: Math.round(stat.speed*100)/100,
        attack_speed: Math.round(stat.attackSpeed*100)/100
      }]
      return <Table columns={columns} dataSource={data} pagination={false} key={index} />
    })
    return stats;
  }
  _getResult =  async () => {
    const stats = await this._callAPI();
    this.setState({
      stats
    })
  }
  _callAPI = () => {
    let id1 = document.getElementById('id1').value;
    let id2 = document.getElementById('id2').value;
    let lv1 = document.getElementById('lv1').value;
    let lv2 = document.getElementById('lv2').value;
    let item1 = document.getElementById('item1').value;
    let item2 = document.getElementById('item2').value;
    let item3 = document.getElementById('item3').value;
    let item4 = document.getElementById('item4').value;
    let item5 = document.getElementById('item5').value;
    let item6 = document.getElementById('item6').value;
    let item7 = document.getElementById('item7').value;
    let item8 = document.getElementById('item8').value;
    let item9 = document.getElementById('item9').value;
    let item10 = document.getElementById('item10').value;
    let item11 = document.getElementById('item11').value;
    let item12 = document.getElementById('item12').value;

    let queryStr = 'id1='+id1+'&id2='+id2+'&lv1='+lv1+'&lv2='+lv2+'&item1='+item1+'&item2='+item2+'&item3='+item3+'&item4='+item4+'&item5='+item5+'&item6='+item6+'&item7='+item7+'&item8='+item8+'&item9='+item9+'&item10='+item10+'&item11='+item11+'&item12='+item12+''
    
    return fetch('http://127.0.0.1:3001/killangle?'+queryStr
    ,{
        method: 'GET',
        protocol: 'http'
    }).then(response=>response.json())
    .then(json=>json.stats)
    .catch(err=>console.log(err));
  }
  render() {
    return (
      <div className="App">
        <Layout>
          <Header>Damage Calculator - 킬각 계산기</Header>
          <Content>
              <Calculator />
              <Button id="calc" type="primary" onClick={() => this._getResult()}>계산하기</Button>
              {this.state.stats?this._setData():'공격,방어 챔피언 선택 후, [계산하기] 버튼 Click!'}
          </Content>
          <Footer>Copyright ⓒ TLoL</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
