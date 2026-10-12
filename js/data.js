// 關西大阪・神戶 預設行程與熱門景點資料庫
export const POPULAR_LOCATIONS = [
  { name: "香榭麗大國 2 (大國町民宿)", address: "大阪府大阪市浪速区大国2-4-15", lat: 34.6548, lng: 135.4983, icon: "fa-hotel", category: "lodging" },
  { name: "木津卸売市場 (木津批發市場)", address: "大阪府大阪市浪速区敷津東2丁目2-8", lat: 34.6575, lng: 135.4998, icon: "fa-bowl-rice", category: "food" },
  { name: "住吉大社", address: "大阪府大阪市住吉区住吉2丁目9-89", lat: 34.6133, lng: 135.4929, icon: "fa-torii-gate", category: "sight" },
  { name: "焼肉㐂舌 南船場店 (心齋橋)", address: "大阪府大阪市中央区南船場4丁目11-22", lat: 34.6775, lng: 135.5015, icon: "fa-drumstick-bite", category: "food" },
  { name: "道頓堀 固力果跑跑人", address: "大阪府大阪市中央区道頓堀1丁目10-3", lat: 34.6687, lng: 135.5013, icon: "fa-camera", category: "sight" },
  { name: "勝尾寺 (滿山達摩)", address: "大阪府箕面市粟生間谷2914-1", lat: 34.8601, lng: 135.4912, icon: "fa-torii-gate", category: "sight" },
  { name: "箕面瀑布", address: "大阪府箕面市箕面公園2-2", lat: 34.8488, lng: 135.4746, icon: "fa-mountain-sun", category: "sight" },
  { name: "朝日啤酒吹田工廠", address: "大阪府吹田市西の庄町1-45", lat: 34.7610, lng: 135.5218, icon: "fa-beer-mug-empty", category: "sight" },
  { name: "梅田藍天大廈空中庭園", address: "大阪府大阪市北区大淀中1丁目1-88", lat: 34.7059, lng: 135.4897, icon: "fa-camera", category: "sight" },
  { name: "國寶姬路城 (白鷺城)", address: "兵庫県姫路市本町68", lat: 34.8394, lng: 134.6939, icon: "fa-fort-awesome", category: "sight" },
  { name: "神戸牛 喜山 (三宮)", address: "兵庫県神戸市中央区北長狭通2丁目12-6", lat: 34.6943, lng: 135.1955, icon: "fa-drumstick-bite", category: "food" },
  { name: "北野異人館街", address: "兵庫県神戸市中央区北野町", lat: 34.7003, lng: 135.1903, icon: "fa-landmark", category: "sight" },
  { name: "神戶臨海樂園 umie", address: "兵庫県神戸市中央区東川崎町1丁目7-2", lat: 34.6792, lng: 135.1834, icon: "fa-camera", category: "sight" },
  { name: "日本環球影城 (USJ)", address: "大阪府大阪市此花区桜島2丁目1-33", lat: 34.6654, lng: 135.4323, icon: "fa-ticket", category: "sight" },
  { name: "臨空城 Outlet (Rinku)", address: "大阪府泉佐野市りんくう往来南3-28", lat: 34.4072, lng: 135.2952, icon: "fa-bag-shopping", category: "sight" },
  { name: "關西國際機場 (KIX)", address: "大阪府泉佐野市泉州空港北1", lat: 34.4320, lng: 135.2304, icon: "fa-plane-departure", category: "transit" }
];

export const DEFAULT_ITINERARY_DATA = [
  {
    day: 1,
    title: "抵達大阪 ＆ 悠閒住吉大社巡禮",
    theme: "南大阪歷史・極上熟成和牛",
    desc: "抵達後先至民宿放置行李，隨後南下走訪千年住吉大社反橋洗滌身心，傍晚漫步道頓堀，品嚐極上熟成黑毛和牛燒肉。",
    stops: [
      {
        id: "d1-s1",
        name: "關西國際機場 (KIX)",
        address: "大阪府泉佐野市泉州空港北1",
        lat: 34.4320,
        lng: 135.2304,
        icon: "fa-plane-departure",
        category: "transit",
        stayMins: 20,
        travelMode: "南海電鐵 空港急行",
        travelMins: 45,
        travelDetail: "搭南海空港急行至新今宮，轉地鐵1站至大國町",
        depTime: "14:00",
        arrTime: "14:45",
        note: "出關後直接感應 iPhone Suica/ICOCA 快速進站乘車。",
        shops: [
          { id: "sh-1", name: "551蓬萊 關西機場店", address: "關西國際機場 第1航廈 2F", cat: "food", price: "$", desc: "大阪必吃招牌現蒸肉包，出關即時充飢。" }
        ]
      },
      {
        id: "d1-s2",
        name: "香榭麗大國 2 民宿 (入住放行李)",
        address: "大阪府大阪市浪速区大国2-4-15",
        lat: 34.6548,
        lng: 135.4983,
        icon: "fa-hotel",
        category: "lodging",
        stayMins: 35,
        travelMode: "南海電鐵高野線",
        travelMins: 15,
        travelDetail: "大國町站搭車至住吉東站，徒步 5 分",
        depTime: "15:05",
        arrTime: "15:20",
        note: "放妥行李換上輕便步行鞋，準備前往南大阪歷史古蹟。",
        shops: [
          { id: "sh-2", name: "藏壽司 なんば元町店", address: "大阪府大阪市浪速区難波中3-1-17", cat: "food", price: "$$", desc: "民宿北側步行 2 分鐘，平價迴轉壽司。" },
          { id: "sh-3", name: "玉出超市 (大國町店)", address: "大阪府大阪市浪速区大国1-2-21", cat: "goods", price: "$", desc: "傳奇平價超市，採買飲用水與零食。" }
        ]
      },
      {
        id: "d1-s3",
        name: "住吉大社 (千年古社 ＆ 反橋祈願)",
        address: "大阪府大阪市住吉区住吉2丁目9-89",
        lat: 34.6133,
        lng: 135.4929,
        icon: "fa-torii-gate",
        category: "sight",
        stayMins: 75,
        travelMode: "大阪地鐵 御堂筋線",
        travelMins: 20,
        travelDetail: "搭車回大國町轉乘御堂筋線，直達難波/心齋橋商圈",
        depTime: "15:55",
        arrTime: "16:15",
        note: "跨越拱形反橋洗滌身心，在第一本宮尋找五大力石頭求福。",
        shops: [
          { id: "sh-4", name: "末廣堂 薩摩燒老鋪", address: "大阪府大阪市住吉区東粉浜3丁目12-14", cat: "goods", price: "$", desc: "門前銘菓，酥香紅豆和菓子配熱茶絕配。" }
        ]
      },
      {
        id: "d1-s4",
        name: "道頓堀 固力果跑跑人 ＆ 心齋橋漫步",
        address: "大阪府大阪市中央区道頓堀1丁目10-3",
        lat: 34.6687,
        lng: 135.5013,
        icon: "fa-camera",
        category: "sight",
        stayMins: 50,
        travelMode: "步行",
        travelMins: 10,
        travelDetail: "沿著心齋橋筋商店街北行至南船場",
        depTime: "17:30",
        arrTime: "17:40",
        note: "戎橋經典打卡地標拍照，感受大阪繁華熱鬧氛圍。",
        shops: [
          { id: "sh-7", name: "あぶりや 千日前店", address: "大阪府大阪市中央区難波3丁目4-16 4F", cat: "food", price: "$$", desc: "國產牛吃到飽代表名店，厚切牛排與橫膈膜超人氣。" }
        ]
      },
      {
        id: "d1-s5",
        name: "晚餐：焼肉㐂舌 南船場店 (熟成黑毛和牛)",
        address: "大阪府大阪市中央区南船場4丁目11-22",
        lat: 34.6775,
        lng: 135.5015,
        icon: "fa-drumstick-bite",
        category: "food",
        stayMins: 90,
        travelMode: "大阪地鐵 御堂筋線",
        travelMins: 10,
        travelDetail: "心齋橋站搭御堂筋線，2站4分鐘直達大國町站",
        depTime: "18:30",
        arrTime: "18:40",
        note: "低溫熟成黑毛和牛個室包廂，肉質極致鮮美，線上中文訂位。",
        shops: [
          { id: "sh-6", name: "焼肉㐂舌 南船場店", address: "大阪府大阪市中央区南船場4丁目11-22", cat: "food", price: "$$$", desc: "熟成黑毛和牛獨立包廂，肉質極致鮮美。" }
        ]
      },
      {
        id: "d1-s6",
        name: "返回香榭麗大國 2 休息",
        address: "大阪府大阪市浪速区大国2-4-15",
        lat: 34.6548,
        lng: 135.4983,
        icon: "fa-house",
        category: "lodging",
        stayMins: 0,
        travelMode: "步行",
        travelMins: 5,
        travelDetail: "大國町站步行 4 分鐘回民宿",
        depTime: "20:20",
        arrTime: "20:25",
        note: "整理行李，確認明早前往箕面勝尾寺的電車時刻。",
        shops: [
          { id: "sh-8", name: "全家便利商店 大國町站前店", address: "大阪府大阪市浪速区大国1丁目1-1", cat: "night", price: "$", desc: "買瓶日本明治牛乳與甜點作為睡前宵夜。" }
        ]
      }
    ]
  },
  {
    day: 2,
    title: "北大阪自然祈運 ＆ 朝日啤酒體驗",
    theme: "萬尊達摩勝運・森林瀑布・Super Dry 見學",
    desc: "民宿出發一路北上：勝尾寺祈求勝運，順溪谷健行至箕面瀑布，下午探訪吹田朝日啤酒見學，傍晚登梅田藍天大廈空中庭園賞落日夜景。",
    stops: [
      {
        id: "d2-s1",
        name: "香榭麗大國 2 (民宿出發)",
        address: "大阪府大阪市浪速区大国2-4-15",
        lat: 34.6548,
        lng: 135.4983,
        icon: "fa-house",
        category: "lodging",
        stayMins: 10,
        travelMode: "御堂筋線(直通北急) + 阪急巴士",
        travelMins: 50,
        travelDetail: "大國町站直達箕面萱野站，轉乘公車直達勝尾寺門口",
        depTime: "08:30",
        arrTime: "09:20",
        note: "北大阪急行延伸後免轉車直通箕面山腳，交通極為順暢。",
        shops: []
      },
      {
        id: "d2-s2",
        name: "勝尾寺 (滿山達摩 ＆ 勝運祈願)",
        address: "大阪府箕面市粟生間谷2914-1",
        lat: 34.8601,
        lng: 135.4912,
        icon: "fa-torii-gate",
        category: "sight",
        stayMins: 80,
        travelMode: "自然步道下坡",
        travelMins: 30,
        travelDetail: "漫步連接自然步道前往箕面瀑布步道起點",
        depTime: "09:30",
        arrTime: "10:00",
        note: "境內階梯擺滿遊客還願的小達摩，祈求事業與人生勝運極為靈驗。",
        shops: [
          { id: "sh-9", name: "勝尾寺 達摩賣店", address: "大阪府箕面市粟生間谷2914-1 勝尾寺境內", cat: "goods", price: "$", desc: "購買專屬許願達摩不倒翁（點右眼祈願）。" }
        ]
      },
      {
        id: "d2-s3",
        name: "箕面瀑布 (落差33米壯麗飛瀑)",
        address: "大阪府箕面市箕面公園2-2",
        lat: 34.8488,
        lng: 135.4746,
        icon: "fa-mountain-sun",
        category: "sight",
        stayMins: 50,
        travelMode: "健行溪谷步道",
        travelMins: 30,
        travelDetail: "沿著平緩溪谷步道下行至箕面萱野商圈",
        depTime: "11:20",
        arrTime: "11:50",
        note: "沿路店家現場油炸販售箕面名物「炸楓葉天婦羅」。",
        shops: [
          { id: "sh-11", name: "久國紅仙堂 炸楓葉", address: "大阪府箕面市箕面1丁目1-40", cat: "goods", price: "$", desc: "百年油炸楓葉名店，口感甜脆帶有淡淡白芝麻香。" }
        ]
      },
      {
        id: "d2-s4",
        name: "Minoh Q's MALL 午餐 (musi-vege+cafe)",
        address: "大阪府箕面市西宿1丁目17-22",
        lat: 34.8340,
        lng: 135.4890,
        icon: "fa-utensils",
        category: "food",
        stayMins: 60,
        travelMode: "北急電車 轉 JR",
        travelMins: 30,
        travelDetail: "由箕面萱野搭至千里中央，轉電車至 JR 吹田站",
        depTime: "12:40",
        arrTime: "13:10",
        note: "musi-vege+cafe 享用高纖蒸蔬菜與豆乳湯定食，少油清爽回血。",
        shops: []
      },
      {
        id: "d2-s5",
        name: "朝日啤酒吹田工廠 (Super Dry 見學 ＆ 現壓試飲)",
        address: "大阪府吹田市西の庄町1-45",
        lat: 34.7610,
        lng: 135.5218,
        icon: "fa-beer-mug-empty",
        category: "sight",
        stayMins: 80,
        travelMode: "JR 東海道本線",
        travelMins: 15,
        travelDetail: "吹田站搭電車直達大阪梅田站，步行至空中庭園",
        depTime: "14:30",
        arrTime: "14:45",
        note: "體驗虛擬裝罐影像，結尾試飲 2 杯極致低溫 Super Dry 生啤酒（需提前預約）。",
        shops: [
          { id: "sh-14", name: "Asahi Museum 限定店", address: "大阪府吹田市西の庄町1-45 工廠境內", cat: "goods", price: "$", desc: "吹田工廠限定生啤酒杯與啤酒酵母點心。" }
        ]
      },
      {
        id: "d2-s6",
        name: "梅田藍天大廈空中庭園 (落日與夜景)",
        address: "大阪府大阪市北区大淀中1丁目1-88",
        lat: 34.7059,
        lng: 135.4897,
        icon: "fa-camera",
        category: "sight",
        stayMins: 70,
        travelMode: "大阪地鐵 御堂筋線",
        travelMins: 15,
        travelDetail: "梅田站直達大國町站回民宿",
        depTime: "17:30",
        arrTime: "17:45",
        note: "360度露天環形展望台，俯瞰淀川夕陽與大阪市璀璨百萬夜景。",
        shops: []
      }
    ]
  },
  {
    day: 3,
    title: "日本第一名城 ＆ 神戶洋風異人館",
    theme: "世界文化遺產白鷺城・神戶牛・北野天滿神社",
    desc: "從民宿出發直衝最西端姬路城大天守，午後回程至神戶三宮品嚐頂級神戶牛，漫步北野異人館街，傍晚欣賞神戶港灣夕陽夜景後直達回大阪。",
    stops: [
      {
        id: "d3-s1",
        name: "香榭麗大國 2 (民宿出發)",
        address: "大阪府大阪市浪速区大国2-4-15",
        lat: 34.6548,
        lng: 135.4983,
        icon: "fa-house",
        category: "lodging",
        stayMins: 10,
        travelMode: "地鐵御堂筋線 + JR 新快速",
        travelMins: 70,
        travelDetail: "大國町搭地鐵至梅田，轉乘【JR 新快速】直達姬路（約 62 分）",
        depTime: "07:50",
        arrTime: "09:00",
        note: "出姬路站沿大手前通步行約 15 分鐘抵達姬路城大門。",
        shops: []
      },
      {
        id: "d3-s2",
        name: "國寶姬路城 (白鷺城登大天守)",
        address: "兵庫県姫路市本町68",
        lat: 34.8394,
        lng: 134.6939,
        icon: "fa-fort-awesome",
        category: "sight",
        stayMins: 130,
        travelMode: "JR 新快速 (直達神戶三之宮)",
        travelMins: 40,
        travelDetail: "步行回姬路站，搭乘 JR 新快速約 40 分抵達三之宮站",
        depTime: "09:20",
        arrTime: "12:10",
        note: "日本保存最完整的十二現存天守之首。天守閣階梯陡峭，建議預留 2 小時。",
        shops: [
          { id: "sh-18", name: "好古園 活水軒", address: "兵庫県姫路市本町68 好古園內", cat: "cafe", price: "$$", desc: "姬路城旁日式庭園餐廳，邊品茶邊賞鯉魚池泉。" }
        ]
      },
      {
        id: "d3-s3",
        name: "神戶三宮午餐：神戸牛 喜山 (鐵板燒)",
        address: "兵庫県神戸市中央区北長狭通2丁目12-6",
        lat: 34.6943,
        lng: 135.1955,
        icon: "fa-drumstick-bite",
        category: "food",
        stayMins: 80,
        travelMode: "步行爬坡沿北野坂",
        travelMins: 15,
        travelDetail: "三宮站沿北野坂步行約 12–15 分鐘抵達異人館街",
        depTime: "12:15",
        arrTime: "12:30",
        note: "A5 級神戶牛專門店，師傅鐵板現煎霜降牛排入口即化。",
        shops: [
          { id: "sh-19", name: "神戸牛 喜山 (Kiyama)", address: "兵庫県神戸市中央区北長狭通2丁目12-6", cat: "food", price: "$$$", desc: "A5 級神戶牛專門店，師傅鐵板現煎霜降牛排。" }
        ]
      },
      {
        id: "d3-s4",
        name: "北野異人館街 ＆ 北野天滿神社",
        address: "兵庫県神戸市中央区北野町",
        lat: 34.7003,
        lng: 135.1903,
        icon: "fa-landmark",
        category: "sight",
        stayMins: 85,
        travelMode: "散步下坡至元町 / 神戶港",
        travelMins: 20,
        travelDetail: "下山漫步至海濱公園欣賞夜景",
        depTime: "14:15",
        arrTime: "14:35",
        note: "登上北野天滿神社鳥居階梯，俯瞰紅磚風見雞洋樓與神戶港海景同框絕景！",
        shops: [
          { id: "sh-21", name: "星巴克 神戶北野異人館店", address: "兵庫県神戸市中央区北野町3-1-31", cat: "cafe", price: "$", desc: "百年登錄有形文化財洋樓改建，保留木造復古氛圍。" }
        ]
      },
      {
        id: "d3-s5",
        name: "神戶臨海樂園 umie ＆ 美利堅公園夜景",
        address: "兵庫県神戸市中央区東川崎町1丁目7-2",
        lat: 34.6792,
        lng: 135.1834,
        icon: "fa-camera",
        category: "sight",
        stayMins: 80,
        travelMode: "JR 新快速 (直達大阪站)",
        travelMins: 25,
        travelDetail: "JR 神戶站搭新快速至大阪站（約 25 分），轉御堂筋線回大國町",
        depTime: "17:30",
        arrTime: "18:00",
        note: "欣賞全新點燈的神戶港塔（Port Tower）與紅色摩天輪夜景。",
        shops: []
      }
    ]
  },
  {
    day: 4,
    title: "日本環球影城 USJ 全日狂歡",
    theme: "任天堂世界・哈利波特・飛天翼龍震撼體驗",
    desc: "清晨早起直奔 USJ！開園第一波衝進超級任天堂世界玩瑪利歐賽車，全日暢玩禁忌之旅與刺激遊樂設施，夜晚順路電車回民宿。",
    stops: [
      {
        id: "d4-s1",
        name: "香榭麗大國 2 (民宿出發)",
        address: "大阪府大阪市浪速区大国2-4-15",
        lat: 34.6548,
        lng: 135.4983,
        icon: "fa-house",
        category: "lodging",
        stayMins: 10,
        travelMode: "JR 環狀線 + 櫻島線",
        travelMins: 30,
        travelDetail: "民宿步行 8 分至【JR 今宮站】，搭至西九條轉櫻島線直達 USJ",
        depTime: "06:45",
        arrTime: "07:15",
        note: "香榭麗大國 2 離 JR 今宮站極近，約 30 分鐘即可抵達樂園大門口！",
        shops: []
      },
      {
        id: "d4-s2",
        name: "日本環球影城：超級任天堂世界",
        address: "大阪府大阪市此花区桜島2丁目1-33 USJ園區內",
        lat: 34.6660,
        lng: 135.4300,
        icon: "fa-ticket",
        category: "sight",
        stayMins: 180,
        travelMode: "園區步行",
        travelMins: 10,
        travelDetail: "開園第一時間無整理券直接衝入，或使用 App 抽整理券",
        depTime: "07:30",
        arrTime: "07:40",
        note: "暢玩【瑪利歐賽車～庫巴的挑戰書～】、戴上能量手環敲磚塊拿金幣。",
        shops: [
          { id: "sh-26", name: "奇諾比奧咖啡店 (Kinopio's Cafe)", address: "USJ 超級任天堂世界園區內", cat: "food", price: "$$", desc: "超級蘑菇披薩碗、無敵星米飯，造型吸睛美味！" }
        ]
      },
      {
        id: "d4-s3",
        name: "哈利波特禁忌之旅 ＆ 活米村",
        address: "大阪府大阪市此花区桜島2丁目1-33 USJ園區內",
        lat: 34.6658,
        lng: 135.4345,
        icon: "fa-fort-awesome",
        category: "sight",
        stayMins: 120,
        travelMode: "園區步行",
        travelMins: 10,
        travelDetail: "穿過巨石陣森林，造訪白雪皚皚活米村與霍格華茲城堡",
        depTime: "11:30",
        arrTime: "11:40",
        note: "體驗【哈利波特禁忌之旅 4K3D】，喝杯招牌冰涼奶油啤酒。",
        shops: [
          { id: "sh-28", name: "三根掃帚酒吧", address: "USJ 哈利波特園區內", cat: "food", price: "$$", desc: "必喝招牌「奶油啤酒」與英式烤雞餐盤。" }
        ]
      },
      {
        id: "d4-s4",
        name: "飛天翼龍 ＆ 小小兵樂園 ➔ 返回民宿",
        address: "大阪府大阪市此花区桜島2丁目1-33",
        lat: 34.6645,
        lng: 135.4330,
        icon: "fa-camera",
        category: "sight",
        stayMins: 200,
        travelMode: "JR 櫻島線 + 環狀線",
        travelMins: 30,
        travelDetail: "閉園後搭 JR 經西九條回 JR 今宮站，步行回大國町民宿",
        depTime: "14:30",
        arrTime: "15:00",
        note: "挑戰世界最長最陡懸吊式過山車【飛天翼龍】，善用 Single Rider 走道大幅省時。",
        shops: [
          { id: "sh-30", name: "侏儸紀燻烤巨大火雞腿", address: "USJ 侏儸紀公園園區內餐車", cat: "food", price: "$$", desc: "樂園必啃手拿美食！超大份量燻烤火雞腿。" }
        ]
      }
    ]
  },
  {
    day: 5,
    title: "木津市場晨食 ＆ 臨空城Outlet直達機場",
    theme: "在地海鮮丼・名品血拚・6分鐘電車直達KIX",
    desc: "民宿退房後徒步至木津批發市場吃海鮮早餐，接著搭南海空港急行直達臨空城 Outlet 大採購，最後電車 1 站（6分鐘）直抵關西機場出境！",
    stops: [
      {
        id: "d5-s1",
        name: "香榭麗大國 2 (退房出發)",
        address: "大阪府大阪市浪速区大国2-4-15",
        lat: 34.6548,
        lng: 135.4983,
        icon: "fa-suitcase-rolling",
        category: "lodging",
        stayMins: 15,
        travelMode: "步行",
        travelMins: 5,
        travelDetail: "推行李步行約 4 分鐘至木津批發市場",
        depTime: "08:30",
        arrTime: "08:45",
        note: "退房後帶著行李出發，開始最後一天的順暢行程。",
        shops: []
      },
      {
        id: "d5-s2",
        name: "木津卸売市場 (木津批發市場海鮮早餐)",
        address: "大阪府大阪市浪速区敷津東2丁目2-8",
        lat: 34.6575,
        lng: 135.4998,
        icon: "fa-bowl-rice",
        category: "food",
        stayMins: 60,
        travelMode: "南海電鐵 空港急行",
        travelMins: 40,
        travelDetail: "步行至南海難波站，搭【南海空港急行】直達臨空城站（約 38 分）",
        depTime: "09:00",
        arrTime: "09:40",
        note: "品嚐極上現切生魚片丼飯、海膽與玉子燒，在地人最愛的三百年魚市場！",
        shops: []
      },
      {
        id: "d5-s3",
        name: "臨空城 Outlet (Rinku Premium Outlets)",
        address: "大阪府泉佐野市りんくう往来南3-28",
        lat: 34.4072,
        lng: 135.2952,
        icon: "fa-bag-shopping",
        category: "sight",
        stayMins: 180,
        travelMode: "南海電鐵 / JR (僅1站)",
        travelMins: 6,
        travelDetail: "走回臨空城站，刷卡搭南海急行或 JR 關空快速【跨海大橋 1 站 6 分鐘直達機場】",
        depTime: "10:50",
        arrTime: "11:00",
        note: "置物櫃寄放大件行李，血拚 Nike、Adidas、Snow Peak，出示護照領優惠券。",
        shops: [
          { id: "sh-32", name: "Snow Peak Cafe 臨空店", address: "大阪府泉佐野市りんくう往来南3-28 Seaside 棟", cat: "cafe", price: "$$", desc: "海景露營風咖啡館，品嚐滴漏單品咖啡與厚鬆餅。" }
        ]
      },
      {
        id: "d5-s4",
        name: "關西國際機場 (辦理退稅、登機返台)",
        address: "大阪府泉佐野市泉州空港北1",
        lat: 34.4320,
        lng: 135.2304,
        icon: "fa-plane-departure",
        category: "transit",
        stayMins: 120,
        travelMode: "國際航班",
        travelMins: 0,
        travelDetail: "T1 直接由二樓出站走空橋進報到大廳；T2 搭 Aeroplaza 免費接駁車",
        depTime: "14:15",
        arrTime: "16:15",
        note: "起飛前至少 2.5 小時抵達機場報到出關，退稅並做最後免稅品補貨。",
        shops: [
          { id: "sh-34", name: "KIX 免稅店伴手禮大街", address: "關西國際機場 T1 出境管制區內", cat: "goods", price: "$$", desc: "入關後購買薯條三兄弟、白色戀人、ROYCE生巧克力。" }
        ]
      }
    ]
  }
];
