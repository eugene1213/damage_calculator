var http = require("http");
var fs = require('fs');
var url = require('url');
var curl = require('curlrequest');
var request = require('request');
var promise = require('promise');


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
 *  방어 챔프의 레벨, 아이템, 룬, 스펠(힐,탈진,쉴드), 스킬트리, 스킬 메커니즘을 토대로 물리방어력,마법방어력,데미지감소 효과를 계산해서 실제 입을 데미지 계산.
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
 *    지배: 감전,포식자,어둠의수확,칼날비(진),비열한한방,돌발일격,시야수집(인게임),끈질긴사냥꾼(헤카림),
 *    결의: 착취의손아귀,여진,뼈방패,사전준비(인게임),번데기,
 *    영감: 쾌속접근(헤카림,기민함)
 * 
 * 사용할 api:
 * {
 *  
 * }
 */

var res; // response api

const key = 'RGAPI-749d9ec2-fd30-4046-978b-2b4a343adf38'; //api key(매일 삭제됨)

/**
 *  기능별 api와 해당 url
 */
const api_summonerByName = 'https://kr.api.riotgames.com/lol/summoner/v3/summoners/by-name/';
const api_matchList = 'https://kr.api.riotgames.com/lol/match/v3/matchlists/by-account/'

accountId = '1294273';
summonerName = '%EC%A1%B4%EB%B2%84%EB%96%A1%EB%9D%BD%EA%B0%80%EC%A6%88%EC%95%84';
params = '';

apiUrl = api_matchList;
params = accountId;

var options = {
        url: apiUrl+params,
        headers: {
            "X-Riot-Token": key,
        }
    };
request(options, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', JSON.parse(body));

    res = body.split(0,4);
});

http.createServer(function(request, response){
    /* 
        HTTP 헤더 전송
        HTTP Status: 200 : OK
        Content Type: text/plain
    */
    response.writeHead(200, {'Content-Type': 'application/json'});
    
    /*
        Response Body 를 "Hello World" 로 설정
    */
    response.end(JSON.stringify(res));    
}).listen(8081);

console.log("Server running at http://127.0.0.1:8081");