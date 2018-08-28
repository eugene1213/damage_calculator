var http = require("http");
var fs = require('fs');
var url = require('url');
var request = require('request');
var promise = require('promise');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lol_static_data');
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('DB Connected!');
});
/**
 * 필요한 데이터:
 * [
 *  챔프,
 *  챔프 1레벨 기본 능력치,
 *  챔프 레벨당 성장치,
 *  스킬 & 패시브 메커니즘,
 *  아이템 정보,
 *  스펠,
 *  룬 정보
 * ]
 * 
 * 데이터 계산:
 * 
 *  공격 챔프의 레벨, 아이템, 룬, 스펠(점화,헤카림->유체화), 스킬트리, 스킬 메커니즘을 토대로 스킬 데미지와 평타 데미지 계산.
 *  공격 아이템:
 * {
 *  [
 *   {
 *    ad: []
 *   },
 *   {
 *    ap: []
 *   }
 *  ] 
 * }
 *  방어 챔프의 레벨, 아이템, 룬, 스펠(힐,탈진,쉴드,강타), 스킬트리, 스킬 메커니즘을 토대로 물리방어력,마법방어력,데미지감소 효과를 계산해서 실제 입을 데미지 계산.
 *  챔프별 특성이 천차만별이기 때문에 각각 계산 필요.
 * 
 *  공격 챔프에게 체력비례 데미지 스킬,패시브,룬이 있는지 확인
 * 1. 현재체력비례
 *   a. 현재체력비례 스킬or평타 데미지 계산
 *   b. 방어 챔프가 실제 받을 데미지 계산
 *   c. 공격 챔프의 남은 스킬 데미지 계산
 *   d. 방어 챔프가 실제 받을 데미지 계산
 * 
 * 2. 잃은체력비례
 *   a. 잃은체력비례 스킬or평타를 제외한 나머지로 가할 수 있는 데미지 계산(점화 등 도트 스킬 먼저 시전)
 *   b. 방어 챔프가 실제 받을 데미지 계산
 *   c. 잃은체력비례 스킬 데미지 가장 마지막에 계산
 *   d. 방어 챔프가 실제 받을 데미지 계산
 * 
 * 3. 체력비례가 없는 경우 or 최대체력비례
 *   a. 공격 챔프의 스킬 & 평타 데미지 계산
 *   b. 방어 챔프가 실제 받을 데미지 계산
 * 
 * 데미지 메커니즘이 심하게 가변적이어서 초기에 지원하지 않을 챔프: 
 * {
 *  헤카림(패시브가 이속비례 데미지),
 *  
 * }
 * 
 * 고려될 아이템들:
 * {
 * 
 * }
 * 고려될 룬들:
 *    정밀: 집중공격,정복자,최후의일격,체력차극복,최후의저항
 *    마법: 콩콩이,유성,난입(헤카림,기민함),무효화구체,마나순환팔찌(라이즈,여눈상위템),빛의망토(헤카림,기민함),깨달음,기민함,절대집중,주문작열,폭풍의결집(인게임)
 *    지배: 감전,포식자,비열한한방,돌발일격,시야수집(인게임),끈질긴사냥꾼(헤카림),
 *    결의: 착취의손아귀,여진,뼈방패,사전준비(인게임),번데기,
 *    영감: 쾌속접근(헤카림,기민함)
 * 
 * 고려될 아이템들:
 *  ad: 롱소드,도란검,밀렵꾼단검,처형인대검,곡괭이,흡혈의낫,톱날단검,콜필드의전투망치,요림의주먹,티아멧,탐식의망치,bf대검,주문포식자,최후의속삭임,빌지워터해적검,마나무네,척후병의사브르:용사,추적자의검:용사,폭풍갈퀴,수호천사,필멸자의운명,도미닉경의인사,요우무의유령검,드락사르의황혼검,칠흑의양날도끼,얼어붙은망치,밤의끝자락,정수약탈자,스테락의도전,맬모셔스의아귀,구인수의격노검,무한의대검,마법공학총검,헤르메스의시미터,피바라기,거대한히드라,죽음의무도,굶주린히드라,삼위일체
 *  치명타:
 *  ap: 암흑의인장,주문도둑검,도란의반지,증폭의고서,
 *  ad방어:
 *  ap방어:
 *  체력:
 *  이속:
 * 
 * 사용할 api:
 * {
 *  LOL-STATIC-DATA-V3
 * }
 */

var res; // response api


/**
 *  기능 프로세스
 *  페이지 첫 로딩시 챔피언 리스트, 스킬, 아이템 리스트, 룬 리스트 필요
 *  공격 챔피언, 방어 챔피언, 레벨, 스킬레벨, 아이템, 룬 입력 받아서 api 요청
 *  유저가 선택한 챔피언의 스탯 계산. 공격 챔피언의 ad,ap,방관,마관 계산. 방어 챔피언의 ad방어,ap방어 계산
 *  챔피언별로 스킬 콤보 
 */
const key = 'RGAPI-5d6d0a1a-89b2-4f2c-b1e1-44b790ac7430'; //api key(매일 삭제됨)

const api_championStats1 = 'https://kr.api.riotgames.com/lol/static-data/v3/champions/';
const api_championStats2 = '?locale=ko_KR&tags=stats';
const api_items1 = 'https://kr.api.riotgames.com/lol/static-data/v3/items/';
const api_items2 = '?locale=ko_KR&tags=stats';  //apiUrl = api_items1 + params + api_items2

// leesinId = '64';
// 

var userRequest = 
    [{
        lv: 1,
        championId: 64,
        skillLevel: {
            q: 0,
            w: 0,
            e: 0,
            r: 0
        },
        spell: {
            spell1: 0,
            spell2: 0
        },
        perk: {
            mainPerk: {
                rune1: 0,
                rune2: 0,
                rune3: 0,
                rune4: 0
            },
            subPerk: {
                subRune1: 0,
                subRune2: 0,               
            }
        },
        items: {
            slot1: 0,
            slot2: 0,
            slot3: 0,
            slot4: 0,
            slot5: 0,
            slot6: 0        
        }
    },//attackChampion
    {
        lv: 1,
        championId: 63,
        skillLevel: {
            q: 0,
            w: 0,
            e: 0,
            r: 0
        },
        spell: {
            spell1: 0,
            spell2: 0
        },
        perk: {
            mainPerk: {
                rune1: 0,
                rune2: 0,
                rune3: 0,
                rune4: 0
            },
            subPerk: {
                subRune1: 0,
                subRune2: 0,               
            }
        },
        items: {
            slot1: 0,
            slot2: 0,
            slot3: 0,
            slot4: 0,
            slot5: 0,
            slot6: 0        
        }
    }];//defenseChampion
/**
 * request riot api
 */

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
    }];//defenseChampion
var getStats = (apiUrl,lv,i) => {
    var options = {
        url: apiUrl,
        headers: {
            "X-Riot-Token": key,
        }
    };
    request(options, (err,response,body) => {
        console.log('error:', err);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', JSON.parse(body));
    
        res = body;
        bodyJson = JSON.parse(body);
        stats[i].ad = bodyJson.stats.attackdamage;
        stats[i].ad += bodyJson.stats.attackdamageperlevel * lv;   
        stats[i].adar = bodyJson.stats.armor;
        stats[i].adar += bodyJson.stats.armorperlevel * lv;
        stats[i].apar = bodyJson.stats.spellblock;                
        stats[i].apar += bodyJson.stats.spellblockperlevel * lv; 
        stats[i].hp = bodyJson.stats.hp;
        stats[i].hp += bodyJson.stats.hpperlevel * lv;  
        stats[i].mp = bodyJson.stats.mp;
        stats[i].attackSpeed += bodyJson.stats.attackspeedoffset;
        stats[i].attackSpeed += bodyJson.stats.attackspeedperlevel * lv;
        stats[i].speed = bodyJson.stats.movespeed;
        console.log(stats[i]);
        console.log(bodyJson.stats.attackdamage)
        console.log(bodyJson.stats.attackdamageperlevel * lv)
    });
};

var apiUrl = [ api_championStats1 + userRequest[0].championId + api_championStats2,
               api_championStats1 + userRequest[1].championId + api_championStats2 ];

var lv = [ userRequest[0].lv,
           userRequest[1].lv ];

getStats(apiUrl[0],lv[0],0);    //attackChampion stats
getStats(apiUrl[1],lv[1],1);    //defenseChampion stats
/**
 * 챔피언 기본 스탯에 아이템으로 증가된 스탯 추가
 */


/**
 * 아이템으로 증가된 스탯에 룬으로 증가된 스탯 추가
*/

/**
 * 서버 생성
 */
http.createServer(function(request, response){
    /* 
        HTTP 헤더 전송
        HTTP Status: 200 : OK
        Content Type: 'application/json'
    */
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(res));
}).listen(8081);

console.log("Server running at http://127.0.0.1:8081");