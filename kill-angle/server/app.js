const express = require('express');
const app = express();
const mongoose = require('mongoose');
var ChampionStats = require('./championStats');
var Items = require('./items');
var promise = require('promise');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/lol_static_data');
var db = mongoose.connection;

db.on('error', () => {
    console.log('Connection Failed!');
});

db.once('open', () => {
    console.log('DB Connected!');
});

var stats = 
[{
    ad: 0,
    ap: 0,
    hp: 0,
    mp: 0,
    adar: 0,
    apar: 0,
    speed: 0,
    attackSpeed: 1
},//attackChampion
{
    ad: 0,
    ap: 0,
    hp: 0,
    mp: 0,
    adar: 0,
    apar: 0,
    speed: 0,
    attackSpeed: 1
}]; //defenseChampion

    //  itemObj:{
        //  id,
        //  name,
        //  attackdamage,
        //  FlatMagicDamageMod,
        //  hp,
        //  mp,
        //  armor,
        //  attackspeed,
        //  movespeed,
        //  spellblock,
        //  isEffectiveStats,
    //  }

var addStatsOfChampion = (statsObj, championStats, lv) => { // stats 배열에 챔피언 레벨에 맞는 성장치를 계산해서 넣는다.
    if(championStats != undefined){
        statsObj.ad = championStats.attackdamage;
        statsObj.ad += championStats.attackdamageperlevel * lv;   
        statsObj.adar = championStats.armor;
        statsObj.adar += championStats.armorperlevel * lv;
        statsObj.apar = championStats.spellblock;                
        statsObj.apar += championStats.spellblockperlevel * lv; 
        statsObj.hp = championStats.hp;
        statsObj.hp += championStats.hpperlevel * lv;  
        statsObj.mp = championStats.mp;
        statsObj.mp += championStats.mpperlevel * lv;
        statsObj.attackSpeed = 0.625/(1 + championStats.attackspeedoffset);
        statsObj.attackSpeed += statsObj.attackSpeed * (championStats.attackspeedperlevel * 0.01 * lv);
        statsObj.speed = championStats.movespeed;
    }
}

var addStatsOfItems = (itemObj, statsObj) => {  // 아이템에 붙은 스탯을 stats 배열에 더한다.
    if(itemObj != undefined){
        statsObj.ad += itemObj.attackdamage;
        statsObj.ap += itemObj.FlatMagicDamageMod;
        statsObj.hp += itemObj.hp;
        statsObj.mp += itemObj.mp;
        statsObj.adar += itemObj.armor;
        statsObj.apar += itemObj.spellblock;
        statsObj.speed += itemObj.movespeed;
        statsObj.attackSpeed += statsObj.attackSpeed * (itemObj.attackspeedoffset * 0.01);
    }
}
  
app.get('/killangle',async (req, res) => {

    let id1 = parseInt(req.query.id1),
        lv1 = parseInt(req.query.lv1),
        item1 = parseInt(req.query.item1),
        item2 = parseInt(req.query.item2),
        item3 = parseInt(req.query.item3),
        item4 = parseInt(req.query.item4),
        item5 = parseInt(req.query.item5),
        item6 = parseInt(req.query.item6),      //여기까지 공격자 리퀘스트 데이터
        id2 = parseInt(req.query.id2),
        lv2 = parseInt(req.query.lv2),
        item7 = parseInt(req.query.item7),
        item8 = parseInt(req.query.item8),
        item9 = parseInt(req.query.item9),
        item10 = parseInt(req.query.item10),
        item11 = parseInt(req.query.item11),
        item12 = parseInt(req.query.item12);    //여기까지 방어자 리퀘스트 데이터

    await ChampionStats.find( { "id": id1 } )
        .then(result => addStatsOfChampion(stats[0], result[0], lv1))
        .catch(err => console.log(err))
    await ChampionStats.find( { "id": id2 } )
        .then(result => addStatsOfChampion(stats[1], result[0], lv2))
        .catch(err => console.log(err));

    await Items.find( { "id": item1 } )
        .then(result => addStatsOfItems(result[0], stats[0]))
        .catch(err => console.log(err));
    await Items.find( { "id": item2 } )
        .then(result => addStatsOfItems(result[0], stats[0]))
        .catch(err => console.log(err));
    await Items.find( { "id": item3 } )
        .then(result => addStatsOfItems(result[0], stats[0]))
        .catch(err => console.log(err));
    await Items.find( { "id": item4 } )
        .then(result => addStatsOfItems(result[0], stats[0]))
        .catch(err => console.log(err));
    await Items.find( { "id": item5 } )
        .then(result => addStatsOfItems(result[0], stats[0]))
        .catch(err => console.log(err));
    await Items.find( { "id": item6 } )
        .then(result => addStatsOfItems(result[0], stats[0]))
        .catch(err => console.log(err));

    await Items.find( { "id": item7 } )
        .then(result => addStatsOfItems(result[0], stats[1]))
        .catch(err => console.log(err));
    await Items.find( { "id": item8 } )
        .then(result => addStatsOfItems(result[0], stats[1]))
        .catch(err => console.log(err));
    await Items.find( { "id": item9 } )
        .then(result => addStatsOfItems(result[0], stats[1]))
        .catch(err => console.log(err));
    await Items.find( { "id": item10 } )
        .then(result => addStatsOfItems(result[0], stats[1]))
        .catch(err => console.log(err));
    await Items.find( { "id": item11 } )
        .then(result => addStatsOfItems(result[0], stats[1]))
        .catch(err => console.log(err));
    await Items.find( { "id": item12 } )
        .then(result => addStatsOfItems(result[0], stats[1]))
        .catch(err => console.log(err));
    
    return await res.json(stats);
 });

app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});