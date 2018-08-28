var mongoose = require('mongoose');
var url = require('url');
var request = require('request');
var promise = require('promise');
var rp = require('request-promise');


const key = 'RGAPI-5d6d0a1a-89b2-4f2c-b1e1-44b790ac7430'; //api key(매일 삭제됨)

const api_championStats = 'https://kr.api.riotgames.com/lol/static-data/v3/champions?locale=ko_KR&tags=stats&dataById=true';
const api_championPassive = 'https://kr.api.riotgames.com/lol/static-data/v3/champions?locale=ko_KR&tags=passive&dataById=true';
const api_championSpells = 'https://kr.api.riotgames.com/lol/static-data/v3/champions?locale=ko_KR&tags=spells&dataById=true';

const api_items = 'https://kr.api.riotgames.com/lol/static-data/v3/items?locale=ko_KR&tags=stats';
const api_rune = 'https://kr.api.riotgames.com/lol/static-data/v3/reforged-rune-paths';

mongoose.connect('mongodb://localhost:27017/lol_static_data');
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', () => {
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', () => {
    console.log('DB Connected!');
});

var getStats = (apiUrl) => {
    let options = {
        url: apiUrl,
        headers: {
            "X-Riot-Token": key,
        },
        json: true
    };
    rp(options)
    .then(function (value) {
        console.log('value: ' + value);
        var obj_length = Object.keys(value.data).length;
        for(i=0;i<obj_length;i++){
            let id = Object.entries(value.data)[i][1].id;          //value의 첫번째 키의 id값
            let attackdamage = Object.entries(value.data)[i][1].stats.attackdamage;
            let attackdamageperlevel = Object.entries(value.data)[i][1].stats.attackdamageperlevel;
            let hp = Object.entries(value.data)[i][1].stats.hp;
            let hpperlevel = Object.entries(value.data)[i][1].stats.hpperlevel;
            let mp = Object.entries(value.data)[i][1].stats.mp;
            let mpperlevel = Object.entries(value.data)[i][1].stats.mpperlevel;
            let armor = Object.entries(value.data)[i][1].stats.armor;
            let armorperlevel = Object.entries(value.data)[i][1].stats.armorperlevel;
            let attackspeedoffset = Object.entries(value.data)[i][1].stats.attackspeedoffset;
            let attackspeedperlevel = Object.entries(value.data)[i][1].stats.attackspeedperlevel;
            let movespeed = Object.entries(value.data)[i][1].stats.movespeed;
            let spellblock = Object.entries(value.data)[i][1].stats.spellblock;
            let spellblockperlevel = Object.entries(value.data)[i][1].stats.spellblockperlevel;
            let name = Object.entries(value.data)[i][1].name;
            let key = Object.entries(value.data)[i][1].key;

            db.collection("championStats").updateOne(
                { "id": id },
                {
                    $set: {
                        "id": id,
                        "attackdamage": attackdamage,
                        "attackdamageperlevel": attackdamageperlevel,
                        "hp": hp,
                        "hpperlevel": hpperlevel,
                        "mp": mp,
                        "mpperlevel": mpperlevel,
                        "armor": armor,
                        "armorperlevel": armorperlevel,
                        "attackspeedoffset": attackspeedoffset,
                        "attackspeedperlevel": attackspeedperlevel,
                        "movespeed": movespeed,
                        "spellblock": spellblock,
                        "spellblockperlevel": spellblockperlevel,
                        "name": name,
                        "key": key
                    }
                },
                {
                  upsert: true
                }
            )
        }
    })
    .catch(function (err) {
        console.log('error msg: ' + err)
    });
};

var getItems = (apiUrl) => {
    let options = {
        url: apiUrl,
        headers: {
            "X-Riot-Token": key,
        },
        json: true
    };
    rp(options)
    .then(function (value) {
        console.log('value: ' + value);
        var obj_length = Object.keys(value.data).length;

        for(i=0;i<obj_length;i++){
            let id = Object.entries(value.data)[i][1].id;          //value의 첫번째 키의 id값(1번 인덱스를 넣는게 맞음)
            let name = Object.entries(value.data)[i][1].name;
            let attackdamage = 0;
            let FlatMagicDamageMod = 0;
            let hp = 0;
            let mp = 0;
            let armor = 0;
            let attackspeed = 0;
            let movespeed = 0;
            let spellblock = 0;
            let isEffectiveStats = false; //데미지나 방어에 효과를 주는 스탯이면 true

            if(Object.entries(value.data)[i][1].stats.FlatPhysicalDamageMod) attackdamage = Object.entries(value.data)[i][1].stats.FlatPhysicalDamageMod;
            if(Object.entries(value.data)[i][1].stats.FlatMagicDamageMod) FlatMagicDamageMod = Object.entries(value.data)[i][1].stats.FlatMagicDamageMod;            
            if(Object.entries(value.data)[i][1].stats.FlatHPPoolMod) hp = Object.entries(value.data)[i][1].stats.FlatHPPoolMod;
            if(Object.entries(value.data)[i][1].stats.FlatMPPoolMod) mp = Object.entries(value.data)[i][1].stats.FlatMPPoolMod;
            if(Object.entries(value.data)[i][1].stats.FlatArmorMod) armor = Object.entries(value.data)[i][1].stats.FlatArmorMod;
            if(Object.entries(value.data)[i][1].stats.PercentAttackSpeedMod) attackspeed = Object.entries(value.data)[i][1].stats.PercentAttackSpeedMod;
            if(Object.entries(value.data)[i][1].stats.FlatMovementSpeedMod) movespeed = Object.entries(value.data)[i][1].stats.FlatMovementSpeedMod;
            if(Object.entries(value.data)[i][1].stats.FlatSpellBlockMod) spellblock = Object.entries(value.data)[i][1].stats.FlatSpellBlockMod;
            if((spellblock + movespeed + attackspeed + armor + mp + hp + FlatMagicDamageMod + attackdamage)>0) isEffectiveStats = true;
            db.collection("items").updateOne(
                { "id": id },
                {
                    $set: {
                        "id": id,
                        "name": name,                        
                        "attackdamage": attackdamage,
                        "FlatMagicDamageMod": FlatMagicDamageMod,
                        "hp": hp,
                        "mp": mp,
                        "armor": armor,
                        "attackspeedoffset": attackspeed,
                        "movespeed": movespeed,
                        "spellblock": spellblock,
                        "isEffectiveStats": isEffectiveStats
                    }
                },
                {
                  upsert: true
                }
            )
        }
    })
    .catch(function (err) {
        console.log('error msg: ' + err)
    });
};

getStats(api_championStats);
getItems(api_items);
