## weathercast
天気予報Botです。以下のようなやり取りができます。

// TODO ここにBotとのやり取り画像が入る

## Feature
* MicrosoftのBot Frameworkをベースにしています。
* Slack連携を前提として作成しています。

## Get started
### Local
#### prerequisite
BotFramework-Emulator
https://github.com/Microsoft/BotFramework-Emulator/

#### Enter the following command
```
npm install

npm start
```

#### BotFramework-Emulator
// TODO ここにエミュレーターの画像が入る
Enter the following string in the connection destination.
```
http://localhost:3978/api/messages
```
then you can start a conversation with Bot.

### Slack Integration

// TODO ここにSlack連携アプリとして登録する手順を記載する

## 内部の動きについて
### どうやって天気を知るか
openweathermapを使用
http://openweathermap.org/city/1850147

> 天気予報APIは意外に提供がない。過去Google、マイクロソフトが提供していたが最近提供終了となっている。
> また、気象庁等も提供は行っていない。

#### openweathermap usage
```
http://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
```

#### Response
```
{	
	"coord":{"lon":139.69,"lat":35.69}, // 都市の緯度経度
	"weather":[{
		"id":801, // 天気ID
		"main":"Clouds",  // 天気
		"description":"薄い雲",  // 説明
		"icon":"02d"            // 天気アイコンID (http://openweathermap.org/img/w/02d.png から取得できる)
	}],
	"base":"stations",        // 内部変数・・・おそらくこの場合東京駅の天気を返している？
	"main":{
		"temp":296.31,          // 気温（K）なので約２３℃
		"pressure":1012,        // 気圧
		"humidity":46,          // 湿度
		"temp_min":295.15,      // 最低気温
		"temp_max":298.15       // 最高気温
  },
	"visibility":10000,       // 視界・・・10km
	"wind":{
		"speed":3.6,            // 風速(m)
		"deg":120               // 風向き(北を0とした時計回りの度数)
	},
	"clouds":{"all":20},
	"dt":1496635200,
	"sys":{
		"type":1,
		"id":7619,
		"message":0.0081,
		"country":"JP",
		"sunrise":1496604339,
		"sunset":1496656445
	},
	"id":1850147,
	"name":"Tokyo",
	"cod":200
}
```