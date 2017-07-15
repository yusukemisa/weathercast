// This loads the environment variables from the .env file
require('dotenv-extended').load();

const builder = require('botbuilder');
const restify = require('restify');
const request = require('request');

// おきまりのBot Framework定義
// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID || '',
  appPassword: process.env.MICROSOFT_APP_PASSWORD || ''
});

// Listen for messages
server.post('/api/messages', connector.listen());


// Botの応答内容定義
const bot = new builder.UniversalBot(connector);

let intents = new builder.IntentDialog();

bot.dialog('/', intents);
// デフォルトの応答内容
intents.onDefault(function (session) {
  session.send(usage);
});

const usage = [
  "↓のような感じでメンションくれたら天気を教えますよー\n",
  "```\n",
  "@w_cast 今日の天気を教えてくだされ\n",
  "```\n"
].join("");

//複数の条件を指定する場合はmatchesAnyに配列で渡す
//正規表現で .*hoge.* は「hogeが入っているなら」にマッチする
// 「/  /i」  正規表現のiフラグは大文字小文字を区別しないようにできる
// http://kyu-mu.net/coffeescript/regexp/
intents.matchesAny([
  /.*今日の天気*/i,
  /.*今日のてんき*/i,
  /.*今の天気*/i,
  /.*今のてんき*/i,
  /.*きょうの天気*/i],
  function (session) {
    session.send('助手、天気を教えてあげなさい・・・！');
    getOpenWeather().then(function (weather) {
      mimi(weather.weatherName, weather);
    }).catch(function (error) {
      console.log(error);
    });

  });

// SlackのWebFookに対してPOSTします（Slack出力確認用）
function mimi(string, Weather) {
  let out = {
    uri: process.env.SLACK_WEBFOOK_URL,
    headers: {
      "Content-type": "application/json",
    },
    json: {
      "text": '<@misawa> ' + string,
      "link_names": true,
      "attachments": [
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#36a64f",
          "pretext": "Optional text that appears above the attachment block",
          "author_name": "Weather Cast",
          "author_link": "http://flickr.com/bobby/",
          "author_icon": Weather.weatherIconURL,
          "title": "今日の東京の天気",
          "title_link": "https://openweathermap.org/city/1850147",
          "text": "アタッチメントテキスト",
          "fields": [
            {
              "title": "天気",
              "value": Weather.weatherName,
              "short": false
            },
            {
              "title": "気温",
              "value": Weather.getAbsoluteTemp(),
              "short": false
            }
          ],
          "image_url": Weather.weatherIconURL,
          "thumb_url": "http://example.com/path/to/thumb.png",
          "footer": "Slack API",
          "footer_icon": Weather.weatherIconURL,
          "ts": 123456789
        }
      ]
    }
  }
  request.post(out, function (error, response, body) { });
};

// 天気表示用オブジェクト
class Weather {
  constructor(weatherName, weatherIconId, temp) {
    this.weatherName = weatherName; //天気
    this.weatherIconId = weatherIconId; //天気アイコンID
    this.weatherIconURL = `http://openweathermap.org/img/w/${weatherIconId}.png`; //天気アイコンImageURL
    this.temp = temp; //気温(K)
    console.log("Weatherオブジェクト作成");
  }
  getAbsoluteTemp() {
    return this.temp - 273;
  }
}

// 天気取得
// Promiseを返却
function getOpenWeather() {
  const appId = process.env.OPEN_WEATHER_MAP_APIKEY || '';
  const cityName = "Tokyo";
  const options = {
    url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=ja&appid=${appId}`,
    json: true
  };
  // API 叩く
  return new Promise(function (resolve, reject) {
    console.log("天気取得中・・・");
    request.get(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log("天気取得成功！");
        let weatherMain = body.weather[0];
        let w = new Weather(weatherMain.main, weatherMain.icon, body.main.temp);
        console.log(w);
        resolve(w);
      } else {
        console.log('error: ' + error);
      }
    });
  });
}


