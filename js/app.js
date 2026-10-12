/**
 * 大阪・關西隨行助手 核心業務邏輯
 * 包含行程資料庫、時間順推、分帳結算及 Google Maps 連結處理
 */

const STORAGE_KEY = "osaka_5d4n_travel_proximity_v6";
    const EXPENSES_KEY = "osaka_expenses_data_v6";
    const THEME_KEY = "osaka_theme_v6";

    const POPULAR_LOCATIONS = [
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

    const AVAILABLE_ICONS = [
      { id: "fa-location-dot", label: "地標" },
      { id: "fa-torii-gate", label: "神社" },
      { id: "fa-train", label: "電車" },
      { id: "fa-plane-departure", label: "飛機" },
      { id: "fa-utensils", label: "美食" },
      { id: "fa-drumstick-bite", label: "燒肉" },
      { id: "fa-bowl-rice", label: "丼飯" },
      { id: "fa-beer-mug-empty", label: "啤酒" },
      { id: "fa-mug-hot", label: "咖啡" },
      { id: "fa-bag-shopping", label: "購物" },
      { id: "fa-store", label: "小店" },
      { id: "fa-mountain-sun", label: "瀑布" },
      { id: "fa-fort-awesome", label: "城堡" },
      { id: "fa-landmark", label: "古蹟" },
      { id: "fa-ticket", label: "樂園" },
      { id: "fa-hotel", label: "住宿" },
      { id: "fa-house", label: "民宿" },
      { id: "fa-suitcase-rolling", label: "行李" }
    ];

    const DEFAULT_ITINERARY_DATA = [
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
              { id: "sh-1", name: "551蓬萊 關西機場店", address: "關西國際機場 第1航廈 2F", icon: "fa-bowl-rice", cat: "food", price: "$", desc: "大阪必吃招牌現蒸肉包，出關即時充飢。" }
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
              { id: "sh-2", name: "藏壽司 なんば元町店", address: "大阪府大阪市浪速区難波中3-1-17", icon: "fa-utensils", cat: "food", price: "$$", desc: "民宿北側步行 2 分鐘，平價迴轉壽司。" },
              { id: "sh-3", name: "玉出超市 (大國町店)", address: "大阪府大阪市浪速区大国1-2-21", icon: "fa-bag-shopping", cat: "goods", price: "$", desc: "傳奇平價超市，採買飲用水與零食。" }
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
              { id: "sh-4", name: "末廣堂 薩摩燒老鋪", address: "大阪府大阪市住吉区東粉浜3丁目12-14", icon: "fa-bowl-rice", cat: "goods", price: "$", desc: "門前銘菓，酥香紅豆和菓子配熱茶絕配。" }
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
              { id: "sh-7", name: "あぶりや 千日前店", address: "大阪府大阪市中央区難波3丁目4-16 4F", icon: "fa-drumstick-bite", cat: "food", price: "$$", desc: "國產牛吃到飽代表名店，厚切牛排與橫膈膜超人氣。" }
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
              { id: "sh-6", name: "焼肉㐂舌 南船場店", address: "大阪府大阪市中央区南船場4丁目11-22", icon: "fa-drumstick-bite", cat: "food", price: "$$$", desc: "熟成黑毛和牛獨立包廂，肉質極致鮮美。" }
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
              { id: "sh-8", name: "全家便利商店 大國町站前店", address: "大阪府大阪市浪速区大国1丁目1-1", icon: "fa-store", cat: "night", price: "$", desc: "買瓶日本明治牛乳與甜點作為睡前宵夜。" }
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
              { id: "sh-9", name: "勝尾寺 達摩賣店", address: "大阪府箕面市粟生間谷2914-1 勝尾寺境內", icon: "fa-bag-shopping", cat: "goods", price: "$", desc: "購買專屬許願達摩不倒翁（點右眼祈願）。" }
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
              { id: "sh-11", name: "久國紅仙堂 炸楓葉", address: "大阪府箕面市箕面1丁目1-40", icon: "fa-bowl-rice", cat: "goods", price: "$", desc: "百年油炸楓葉名店，口感甜脆帶有淡淡白芝麻香。" }
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
              { id: "sh-14", name: "Asahi Museum 限定店", address: "大阪府吹田市西の庄町1-45 工廠境內", icon: "fa-beer-mug-empty", cat: "goods", price: "$", desc: "吹田工廠限定生啤酒杯與啤酒酵母點心。" }
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
              { id: "sh-18", name: "好古園 活水軒", address: "兵庫県姫路市本町68 好古園內", icon: "fa-mug-hot", cat: "cafe", price: "$$", desc: "姬路城旁日式庭園餐廳，邊品茶邊賞鯉魚池泉。" }
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
              { id: "sh-19", name: "神戸牛 喜山 (Kiyama)", address: "兵庫県神戸市中央区北長狭通2丁目12-6", icon: "fa-drumstick-bite", cat: "food", price: "$$$", desc: "A5 級神戶牛專門店，師傅鐵板現煎霜降牛排。" }
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
              { id: "sh-21", name: "星巴克 神戶北野異人館店", address: "兵庫県神戸市中央区北野町3-1-31", icon: "fa-mug-hot", cat: "cafe", price: "$", desc: "百年登錄有形文化財洋樓改建，保留木造復古氛圍。" }
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
              { id: "sh-26", name: "奇諾比奧咖啡店 (Kinopio's Cafe)", address: "USJ 超級任天堂世界園區內", icon: "fa-mug-hot", cat: "food", price: "$$", desc: "超級蘑菇披薩碗、無敵星米飯，造型吸睛美味！" }
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
              { id: "sh-28", name: "三根掃帚酒吧", address: "USJ 哈利波特園區內", icon: "fa-beer-mug-empty", cat: "food", price: "$$", desc: "必喝招牌「奶油啤酒」與英式烤雞餐盤。" }
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
              { id: "sh-30", name: "侏儸紀燻烤巨大火雞腿", address: "USJ 侏儸紀公園園區內餐車", icon: "fa-drumstick-bite", cat: "food", price: "$$", desc: "樂園必啃手拿美食！超大份量燻烤火雞腿。" }
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
              { id: "sh-32", name: "Snow Peak Cafe 臨空店", address: "大阪府泉佐野市りんくう往来南3-28 Seaside 棟", icon: "fa-mug-hot", cat: "cafe", price: "$$", desc: "海景露營風咖啡館，品嚐滴漏單品咖啡與厚鬆餅。" }
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
              { id: "sh-34", name: "KIX 免稅店伴手禮大街", address: "關西國際機場 T1 出境管制區內", icon: "fa-bag-shopping", cat: "goods", price: "$$", desc: "入關後購買薯條三兄弟、白色戀人、ROYCE生巧克力。" }
            ]
          }
        ]
      }
    ];

    let appData = [];
    let currentDayIndex = 0;
    let selectedStopId = null;
    let currentShopCategory = 'all';

    let expenseData = {
      members: ["我", "旅伴A", "旅伴B"],
      rate: 0.21,
      items: [
        { id: "exp-1", title: "Day 1 焼肉㐂舌晚餐", amount: 18000, currency: "JPY", payer: "我", participants: ["我", "旅伴A", "旅伴B"] }
      ]
    };

    function calculateDistanceKm(lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Number((R * c).toFixed(1));
    }

    function updateChainedScheduleForDay(day) {
      if (!day.stops || day.stops.length === 0) return;
      let curMins = parseMinutes(day.stops[0].depTime || "09:00");

      for (let i = 0; i < day.stops.length; i++) {
        const stop = day.stops[i];
        if (i > 0) {
          const prevStop = day.stops[i - 1];
          const distKm = calculateDistanceKm(prevStop.lat, prevStop.lng, stop.lat, stop.lng);

          if (!stop.travelMins || stop.travelMins === 0) {
            stop.travelMins = Math.max(10, Math.round(distKm * 2.5) + 5);
          }
          if (!stop.travelMode || stop.travelMode === "") {
            stop.travelMode = distKm < 1.2 ? "步行" : (distKm > 20 ? "JR 新快速 / 特急" : "大阪地鐵 / 私鐵");
          }
        }
        
        const travel = stop.travelMins || 0;
        const stay = stop.stayMins || 0;

        stop.depTime = formatTime(curMins);
        const arrival = curMins + travel;
        stop.arrTime = formatTime(arrival);
        curMins = arrival + stay;
      }
    }

    function syncStateToUrl() {
      try {
        const payload = {
          d: appData,
          e: expenseData
        };
        const jsonStr = JSON.stringify(payload);
        const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
        const newUrl = `${window.location.pathname}${window.location.search}#data=${encoded}`;
        window.history.replaceState(null, '', newUrl);
      } catch (err) {
        console.warn("URL sync compression warning:", err);
      }
    }

    function loadStateFromUrl() {
      try {
        const hash = window.location.hash;
        if (!hash || !hash.includes('#data=')) return false;
        const rawBase64 = decodeURIComponent(hash.split('#data=')[1]);
        const decodedStr = decodeURIComponent(escape(atob(rawBase64)));
        const parsed = JSON.parse(decodedStr);
        if (parsed && parsed.d && Array.isArray(parsed.d)) {
          appData = parsed.d;
          if (parsed.e) expenseData = parsed.e;
          return true;
        }
      } catch (err) {
        console.warn("Failed to load state from URL hash:", err);
      }
      return false;
    }

    function initData() {
      const loadedFromUrl = loadStateFromUrl();
      if (loadedFromUrl) {
        saveData(false);
        showToast("已載入網址中的最新行程資料！");
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          appData = JSON.parse(stored);
        } else {
          appData = JSON.parse(JSON.stringify(DEFAULT_ITINERARY_DATA));
          saveData(false);
        }

        const storedExpenses = localStorage.getItem(EXPENSES_KEY);
        if (storedExpenses) {
          expenseData = JSON.parse(storedExpenses);
        }
      } catch (err) {
        console.error("Storage loading error", err);
        appData = JSON.parse(JSON.stringify(DEFAULT_ITINERARY_DATA));
      }
      syncStateToUrl();
    }

    function saveData(notify = true) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenseData));
        syncStateToUrl();
        if (notify) showToast("已自動儲存並同步至網址！");
      } catch (e) {
        showToast("本機空間不足，儲存失敗");
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toastNotification');
      const toastMsg = document.getElementById('toastMsg');
      if (!toast || !toastMsg) return;
      toastMsg.textContent = msg;
      toast.classList.remove('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
      }, 1900);
    }

    function parseMinutes(timeStr) {
      if (!timeStr || !timeStr.includes(':')) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return (h * 60) + m;
    }

    function formatTime(totalMinutes) {
      const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
      const h = Math.floor(wrapped / 60);
      const m = wrapped % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function renderDayTabs() {
      const container = document.getElementById('dayTabsList');
      if (!container) return;
      container.innerHTML = '';

      appData.forEach((day, index) => {
        const isActive = index === currentDayIndex;
        const btn = document.createElement('button');
        btn.className = `flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1 ${
          isActive 
            ? 'theme-primary-bg text-white shadow-xs' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;
        btn.innerHTML = `
          <span>Day ${day.day}</span>
          <span class="text-[9px] opacity-80 font-normal hidden sm:inline">・${day.theme.split('・')[0]}</span>
        `;
        btn.addEventListener('click', () => {
          currentDayIndex = index;
          selectedStopId = null;
          renderAll();
        });
        container.appendChild(btn);
      });
    }

    function renderDayHeader() {
      const currentDay = appData[currentDayIndex];
      if (!currentDay) return;
      document.getElementById('currentDayBadge').textContent = `Day ${currentDay.day}`;
      document.getElementById('currentDayTheme').textContent = currentDay.theme;
      document.getElementById('currentDayTitle').textContent = currentDay.title;
      document.getElementById('currentDayDesc').textContent = currentDay.desc;
      document.getElementById('stopsCountBadge').textContent = currentDay.stops.length;
    }

    function openGoogleMapsForStop(stop) {
      let queryTarget = stop.address ? `${stop.name} ${stop.address}` : stop.name;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryTarget)}`;
      window.open(url, '_blank');
    }

    function renderTimeline() {
      const currentDay = appData[currentDayIndex];
      const container = document.getElementById('timelineContainer');
      if (!container) return;
      container.innerHTML = '';

      if (!currentDay.stops || currentDay.stops.length === 0) {
        container.innerHTML = `
          <div class="theme-card-bg rounded-xl p-6 text-center text-slate-400 space-y-1.5 border border-dashed theme-card-border">
            <i class="fa-solid fa-map-location-dot text-2xl"></i>
            <p class="text-xs">今天還沒有任何行程景點，點擊上方「加景點」開始規劃！</p>
          </div>
        `;
        return;
      }

      const originStop = currentDay.stops[0];
      const originLat = originStop.lat || 34.6548;
      const originLng = originStop.lng || 135.4983;

      currentDay.stops.forEach((stop, idx) => {
        const isSelected = selectedStopId === stop.id;
        const isFirst = idx === 0;
        const isLast = idx === currentDay.stops.length - 1;
        const stopIcon = stop.icon || "fa-location-dot";

        let distFromOrigin = 0;
        if (stop.lat && stop.lng) {
          distFromOrigin = calculateDistanceKm(originLat, originLng, stop.lat, stop.lng);
        }

        let badgeStyle = "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
        if (stop.category === 'food') badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
        else if (stop.category === 'transit') badgeStyle = "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
        else if (stop.category === 'lodging') badgeStyle = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

        const item = document.createElement('div');
        item.className = "w-full transition group";
        item.innerHTML = `
          <div class="theme-card-bg rounded-xl p-2.5 sm:p-3 border transition-all ${
            isSelected 
              ? 'theme-primary-border shadow-xs ring-1 ring-sky-500/20' 
              : 'theme-card-border hover:shadow-xs'
          }">
            
            <div class="flex items-center justify-between gap-1 pb-1.5 border-b theme-card-border">
              <div class="flex items-center gap-1.5 flex-wrap min-w-0">
                <span class="w-5 h-5 rounded-md ${
                  isSelected ? 'theme-primary-bg text-white' : 'theme-primary-light-bg theme-primary-text'
                } flex items-center justify-center text-[10px] flex-shrink-0">
                  <i class="fa-solid ${stopIcon}"></i>
                </span>
                <span class="text-[11px] font-black font-mono tracking-tight bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                  ${stop.depTime} → ${stop.arrTime}
                </span>
                ${stop.stayMins > 0 ? `<span class="text-[9px] font-bold text-slate-400">停${stop.stayMins}分</span>` : ''}
                
                ${idx > 0 && distFromOrigin > 0 ? `
                  <button type="button" data-action="open-map" class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 flex items-center gap-0.5 transition active:scale-95" title="點擊開啟 Google Maps 地圖">
                    <i class="fa-solid fa-location-arrow text-[8px]"></i>
                    <span>距起點 ${distFromOrigin}km</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[7px] ml-0.5 opacity-70"></i>
                  </button>
                ` : (isFirst ? `
                  <button type="button" data-action="open-map" class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-0.5 transition active:scale-95" title="點擊在 Google Maps 查看起點">
                    <i class="fa-solid fa-house-flag text-[8px]"></i>
                    <span>起點站</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[7px] ml-0.5 opacity-70"></i>
                  </button>
                ` : '')}

                <span class="text-[9px] font-black px-1.5 py-0.2 rounded border ${badgeStyle}">
                  ${stop.category.toUpperCase()}
                </span>
              </div>

              <div class="flex items-center gap-0.5 flex-shrink-0">
                <button data-action="move-up" class="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 active:scale-95 transition" ${isFirst ? 'disabled' : ''} title="上移">
                  <i class="fa-solid fa-chevron-up text-[10px]"></i>
                </button>
                <button data-action="move-down" class="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 active:scale-95 transition" ${isLast ? 'disabled' : ''} title="下移">
                  <i class="fa-solid fa-chevron-down text-[10px]"></i>
                </button>
                <button data-action="edit" class="p-1 theme-primary-text hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition active:scale-95" title="編輯">
                  <i class="fa-solid fa-pen text-[10px]"></i>
                </button>
              </div>
            </div>

            <div class="mt-1.5 space-y-1.5">
              <div class="flex items-center justify-between gap-1.5">
                <h4 class="text-xs sm:text-sm font-black leading-snug group-hover:theme-primary-text transition truncate flex-1">
                  ${stop.name}
                </h4>
                <button data-action="select-shops" class="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 active:scale-95 transition">
                  <i class="fa-solid fa-store text-[9px]"></i>
                  <span>街邊店 (${stop.shops ? stop.shops.length : 0})</span>
                </button>
              </div>

              ${stop.address ? `
                <button type="button" data-action="open-map-address" class="text-[9.5px] text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 px-2 py-1 rounded-md border theme-card-border flex items-center gap-1.5 max-w-full text-left transition active:scale-98 group/addr" title="點擊直接在 Google Maps 導航此地址">
                  <i class="fa-solid fa-location-dot text-[9px] text-rose-500 group-hover/addr:scale-110 transition-transform flex-shrink-0"></i>
                  <span class="truncate underline underline-offset-2 decoration-slate-300 dark:decoration-slate-600 group-hover/addr:decoration-sky-500">${stop.address}</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[7.5px] text-slate-400 group-hover/addr:text-sky-500 ml-auto flex-shrink-0"></i>
                </button>
              ` : ''}

              ${stop.travelMode ? `
                <div class="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-2 py-1 text-[10px] text-slate-600 dark:text-slate-400 border theme-card-border flex items-start sm:items-center gap-1.5 flex-wrap">
                  <i class="fa-solid fa-route text-slate-400 text-[9px] flex-shrink-0 mt-0.5 sm:mt-0"></i>
                  <span class="font-black text-slate-800 dark:text-slate-200">${stop.travelMode}</span>
                  ${stop.travelMins ? `<span class="text-slate-400">約${stop.travelMins}分</span>` : ''}
                  ${stop.travelDetail ? `<span class="text-slate-500 dark:text-slate-400 break-words whitespace-normal leading-relaxed w-full sm:w-auto">・${stop.travelDetail}</span>` : ''}
                </div>
              ` : ''}

              ${stop.note ? `
                <p class="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  <span class="font-black text-amber-600">💡 攻略：</span>${stop.note}
                </p>
              ` : ''}
            </div>

          </div>
        `;

        const openMapBtn = item.querySelector('[data-action="open-map"]');
        if (openMapBtn) {
          openMapBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openGoogleMapsForStop(stop);
          });
        }

        const openMapAddressBtn = item.querySelector('[data-action="open-map-address"]');
        if (openMapAddressBtn) {
          openMapAddressBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openGoogleMapsForStop(stop);
          });
        }

        const selectShopsBtn = item.querySelector('[data-action="select-shops"]');
        if (selectShopsBtn) {
          selectShopsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedStopId = stop.id;
            renderTimeline();
            renderShops();
            openShopsDrawer();
          });
        }

        const editBtn = item.querySelector('[data-action="edit"]');
        if (editBtn) {
          editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditStopModal(stop);
          });
        }

        const upBtn = item.querySelector('[data-action="move-up"]');
        if (upBtn) {
          upBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (idx > 0) {
              const temp = currentDay.stops[idx];
              currentDay.stops[idx] = currentDay.stops[idx - 1];
              currentDay.stops[idx - 1] = temp;
              updateChainedScheduleForDay(currentDay);
              saveData();
              renderTimeline();
            }
          });
        }

        const downBtn = item.querySelector('[data-action="move-down"]');
        if (downBtn) {
          downBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (idx < currentDay.stops.length - 1) {
              const temp = currentDay.stops[idx];
              currentDay.stops[idx] = currentDay.stops[idx + 1];
              currentDay.stops[idx + 1] = temp;
              updateChainedScheduleForDay(currentDay);
              saveData();
              renderTimeline();
            }
          });
        }

        item.addEventListener('click', () => {
          selectedStopId = selectedStopId === stop.id ? null : stop.id;
          renderTimeline();
          renderShops();
        });

        container.appendChild(item);
      });
    }

    function renderShops() {
      const currentDay = appData[currentDayIndex];
      const container = document.getElementById('shopsListContainer');
      const targetBadge = document.getElementById('shopTargetStopName');
      if (!container || !targetBadge) return;
      container.innerHTML = '';

      let targetStops = currentDay.stops;
      if (selectedStopId) {
        const found = currentDay.stops.find(s => s.id === selectedStopId);
        if (found) {
          targetStops = [found];
          targetBadge.textContent = `📍 ${found.name.split(' (')[0].split(' ➔')[0]}`;
        }
      } else {
        const total = currentDay.stops.reduce((acc, s) => acc + (s.shops ? s.shops.length : 0), 0);
        targetBadge.textContent = `📍 全部當日景點 (${total} 家)`;
      }

      let allShops = [];
      targetStops.forEach(stop => {
        if (stop.shops && Array.isArray(stop.shops)) {
          stop.shops.forEach(sh => {
            allShops.push({ ...sh, parentStopId: stop.id, parentStopName: stop.name });
          });
        }
      });

      if (currentShopCategory !== 'all') {
        allShops = allShops.filter(s => s.cat === currentShopCategory);
      }

      if (allShops.length === 0) {
        container.innerHTML = `
          <div class="py-8 text-center text-slate-400 space-y-1.5">
            <i class="fa-solid fa-store text-2xl"></i>
            <p class="text-xs">目前沒有符合條件的街邊店推薦</p>
          </div>
        `;
        return;
      }

      allShops.forEach(shop => {
        let catLabel = "美食";
        let catColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
        if (shop.cat === 'cafe') {
          catLabel = "咖啡甜點";
          catColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";
        } else if (shop.cat === 'goods') {
          catLabel = "伴手禮";
          catColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        } else if (shop.cat === 'night') {
          catLabel = "居酒屋";
          catColor = "bg-purple-500/10 text-purple-600 border-purple-500/20";
        }

        const shopIcon = shop.icon || "fa-utensils";
        const mapQuery = shop.address ? `${shop.name} ${shop.address}` : shop.name;

        const row = document.createElement('div');
        row.className = "pt-2 pb-2 group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-lg px-1.5 transition";
        row.innerHTML = `
          <div class="flex items-start justify-between gap-1.5">
            <div class="space-y-0.5 flex-1 min-w-0">
              <div class="flex items-center gap-1 flex-wrap">
                <span class="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] text-slate-500">
                  <i class="fa-solid ${shopIcon}"></i>
                </span>
                <span class="text-[9px] font-bold px-1 py-0.2 rounded border ${catColor}">${catLabel}</span>
                <span class="text-[9px] font-bold text-slate-400">${shop.price || '$'}</span>
                <span class="text-[9px] text-slate-400 truncate max-w-[120px]">@ ${shop.parentStopName.split(' (')[0]}</span>
              </div>
              <h5 class="text-xs font-black group-hover:text-orange-600 transition truncate">${shop.name}</h5>
              ${shop.address ? `
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}" target="_blank" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 text-[9.5px] text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:underline max-w-full transition group/shopaddr" title="點擊直接在地圖開啟此店家地址">
                  <i class="fa-solid fa-location-dot text-[8.5px] text-rose-500 flex-shrink-0"></i>
                  <span class="truncate">${shop.address}</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[7.5px] opacity-70 flex-shrink-0"></i>
                </a>
              ` : ''}
              <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">${shop.desc || '無特別備註'}</p>
            </div>

            <div class="flex items-center gap-0.5 flex-shrink-0 pt-0.5">
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}" target="_blank" class="p-1 theme-primary-text hover:opacity-80 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95" title="地圖導航">
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>
        `;
        container.appendChild(row);
      });
    }

    function renderIconSelector(containerId, inputId, selectedIcon, previewHeaderId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      AVAILABLE_ICONS.forEach(iconObj => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `icon-radio-btn p-1.5 rounded-lg border theme-card-border flex flex-col items-center justify-center gap-0.5 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
          selectedIcon === iconObj.id ? 'selected' : ''
        }`;
        btn.innerHTML = `
          <i class="fa-solid ${iconObj.id} text-xs"></i>
          <span class="text-[8px] font-medium leading-none">${iconObj.label}</span>
        `;
        btn.addEventListener('click', () => {
          container.querySelectorAll('.icon-radio-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          document.getElementById(inputId).value = iconObj.id;
          if (previewHeaderId) {
            const previewEl = document.getElementById(previewHeaderId);
            if (previewEl) previewEl.className = `fa-solid ${iconObj.id}`;
          }
        });
        container.appendChild(btn);
      });
    }

    function openAddStopModal() {
      const currentDay = appData[currentDayIndex];
      document.getElementById('stopModalTitle').textContent = `Day ${currentDay.day} - 新增行程景點`;
      document.getElementById('formStopId').value = '';
      document.getElementById('formStopName').value = '';
      document.getElementById('formStopAddress').value = '';
      document.getElementById('formStopLat').value = '';
      document.getElementById('formStopLng').value = '';
      document.getElementById('formStopCategory').value = 'sight';
      document.getElementById('formStopStayMins').value = 60;
      
      let lastArr = "09:00";
      if (currentDay.stops && currentDay.stops.length > 0) {
        lastArr = currentDay.stops[currentDay.stops.length - 1].arrTime || "09:00";
      }
      document.getElementById('formStopDepTime').value = lastArr;
      document.getElementById('formStopArrTime').value = lastArr;
      document.getElementById('formStopTravelMode').value = '';
      document.getElementById('formStopTravelMins').value = '';
      document.getElementById('formStopTravelDetail').value = '';
      document.getElementById('formStopNote').value = '';
      document.getElementById('formStopIcon').value = 'fa-location-dot';
      document.getElementById('deleteStopBtn').classList.add('hidden');

      const dropEl = document.getElementById('autocompleteDropdown');
      if (dropEl) dropEl.classList.add('hidden');

      renderIconSelector('stopIconGrid', 'formStopIcon', 'fa-location-dot', 'stopModalHeaderIcon');
      document.getElementById('stopModal').classList.remove('hidden');
    }

    function openEditStopModal(stop) {
      document.getElementById('stopModalTitle').textContent = `編輯景點：${stop.name.split(' (')[0]}`;
      document.getElementById('formStopId').value = stop.id;
      document.getElementById('formStopName').value = stop.name;
      document.getElementById('formStopAddress').value = stop.address || '';
      document.getElementById('formStopLat').value = (stop.lat !== null && stop.lat !== undefined) ? stop.lat : '';
      document.getElementById('formStopLng').value = (stop.lng !== null && stop.lng !== undefined) ? stop.lng : '';
      document.getElementById('formStopCategory').value = stop.category || 'sight';
      document.getElementById('formStopStayMins').value = stop.stayMins || 0;
      document.getElementById('formStopDepTime').value = stop.depTime || "09:00";
      document.getElementById('formStopArrTime').value = stop.arrTime || "10:00";
      document.getElementById('formStopTravelMode').value = stop.travelMode || '';
      document.getElementById('formStopTravelMins').value = stop.travelMins || '';
      document.getElementById('formStopTravelDetail').value = stop.travelDetail || '';
      document.getElementById('formStopNote').value = stop.note || '';
      
      const chosenIcon = stop.icon || 'fa-location-dot';
      document.getElementById('formStopIcon').value = chosenIcon;
      document.getElementById('deleteStopBtn').classList.remove('hidden');

      const dropEl = document.getElementById('autocompleteDropdown');
      if (dropEl) dropEl.classList.add('hidden');

      renderIconSelector('stopIconGrid', 'formStopIcon', chosenIcon, 'stopModalHeaderIcon');
      document.getElementById('stopModal').classList.remove('hidden');
    }

    function handleStopFormSubmit(e) {
      if (e) e.preventDefault();
      const currentDay = appData[currentDayIndex];
      const stopId = document.getElementById('formStopId').value;

      const rawLat = document.getElementById('formStopLat').value;
      const rawLng = document.getElementById('formStopLng').value;
      const parsedLat = rawLat !== '' ? parseFloat(rawLat) : null;
      const parsedLng = rawLng !== '' ? parseFloat(rawLng) : null;

      const stopData = {
        name: document.getElementById('formStopName').value.trim(),
        address: document.getElementById('formStopAddress').value.trim(),
        lat: isNaN(parsedLat) ? null : parsedLat,
        lng: isNaN(parsedLng) ? null : parsedLng,
        icon: document.getElementById('formStopIcon').value || 'fa-location-dot',
        category: document.getElementById('formStopCategory').value || 'sight',
        stayMins: parseInt(document.getElementById('formStopStayMins').value) || 0,
        depTime: document.getElementById('formStopDepTime').value || "09:00",
        arrTime: document.getElementById('formStopArrTime').value || "09:30",
        travelMode: document.getElementById('formStopTravelMode').value.trim(),
        travelMins: parseInt(document.getElementById('formStopTravelMins').value) || 0,
        travelDetail: document.getElementById('formStopTravelDetail').value.trim(),
        note: document.getElementById('formStopNote').value.trim(),
      };

      if (!stopData.name) {
        showToast("請輸入景點名稱！");
        return;
      }

      if (stopId) {
        const index = currentDay.stops.findIndex(s => s.id === stopId);
        if (index !== -1) {
          currentDay.stops[index] = { ...currentDay.stops[index], ...stopData };
        }
        updateChainedScheduleForDay(currentDay);
      } else {
        const newStop = {
          ...stopData,
          id: `stop-${Date.now()}`,
          shops: []
        };
        currentDay.stops.push(newStop);
        updateChainedScheduleForDay(currentDay);
      }

      saveData();
      document.getElementById('stopModal').classList.add('hidden');
      renderTimeline();
      renderShops();
      showToast("景點節點已儲存並同步！");
    }

    function handleDeleteStop() {
      const stopId = document.getElementById('formStopId').value;
      if (!stopId) return;
      const currentDay = appData[currentDayIndex];
      currentDay.stops = currentDay.stops.filter(s => s.id !== stopId);
      if (selectedStopId === stopId) selectedStopId = null;
      updateChainedScheduleForDay(currentDay);
      saveData();
      document.getElementById('stopModal').classList.add('hidden');
      renderTimeline();
      renderShops();
      showToast("景點已刪除");
    }

    function openAddShopModal() {
      const currentDay = appData[currentDayIndex];
      if (!currentDay.stops || currentDay.stops.length === 0) {
        showToast("今日尚無景點，請先新增景點後再加入名店！");
        return;
      }

      const select = document.getElementById('formShopStopTarget');
      select.innerHTML = '';
      currentDay.stops.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name.split(' ➔')[0];
        if (selectedStopId && s.id === selectedStopId) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });

      document.getElementById('shopModalTitle').textContent = "新增周邊街邊私房店";
      document.getElementById('formShopId').value = '';
      document.getElementById('formShopName').value = '';
      document.getElementById('formShopAddress').value = '';
      document.getElementById('formShopCat').value = 'food';
      document.getElementById('formShopPrice').value = '$';
      document.getElementById('formShopDesc').value = '';
      document.getElementById('formShopIcon').value = 'fa-utensils';
      document.getElementById('deleteShopBtn').classList.add('hidden');

      renderIconSelector('shopIconGrid', 'formShopIcon', 'fa-utensils', 'shopModalHeaderIcon');
      document.getElementById('shopModal').classList.remove('hidden');
    }

    function handleShopFormSubmit(e) {
      if (e) e.preventDefault();
      const currentDay = appData[currentDayIndex];
      const targetStopId = document.getElementById('formShopStopTarget').value;
      const shopId = document.getElementById('formShopId').value;
      const shopName = document.getElementById('formShopName').value.trim();

      if (!shopName) {
        showToast("請輸入店家名稱！");
        return;
      }

      const stop = currentDay.stops.find(s => s.id === targetStopId);
      if (!stop) {
        showToast("找不到關聯的景點！");
        return;
      }

      if (!stop.shops) stop.shops = [];

      const shopData = {
        name: shopName,
        address: document.getElementById('formShopAddress').value.trim(),
        icon: document.getElementById('formShopIcon').value || 'fa-utensils',
        cat: document.getElementById('formShopCat').value,
        price: document.getElementById('formShopPrice').value,
        desc: document.getElementById('formShopDesc').value.trim()
      };

      if (shopId) {
        const sIdx = stop.shops.findIndex(sh => sh.id === shopId);
        if (sIdx !== -1) {
          stop.shops[sIdx] = { ...stop.shops[sIdx], ...shopData };
        }
      } else {
        stop.shops.push({
          id: `sh-${Date.now()}`,
          ...shopData
        });
      }

      saveData();
      document.getElementById('shopModal').classList.add('hidden');
      renderTimeline();
      renderShops();
      showToast("街邊名店已成功儲存並同步！");
    }

    function handleDeleteShop() {
      const currentDay = appData[currentDayIndex];
      const shopId = document.getElementById('formShopId').value;
      if (!shopId) return;

      currentDay.stops.forEach(s => {
        if (s.shops) {
          s.shops = s.shops.filter(sh => sh.id !== shopId);
        }
      });

      saveData();
      document.getElementById('shopModal').classList.add('hidden');
      renderTimeline();
      renderShops();
      showToast("店家已刪除！");
    }

    function calculateDebts() {
      const netBalances = {};
      expenseData.members.forEach(m => netBalances[m] = 0);
      const rate = expenseData.rate || 0.21;

      expenseData.items.forEach(item => {
        let amtInTWD = item.currency === 'JPY' ? item.amount * rate : item.amount;
        const payer = item.payer;
        const participants = (item.participants && item.participants.length > 0) ? item.participants : expenseData.members;
        const share = amtInTWD / participants.length;

        if (netBalances[payer] !== undefined) {
          netBalances[payer] += amtInTWD;
        }

        participants.forEach(p => {
          if (netBalances[p] !== undefined) {
            netBalances[p] -= share;
          }
        });
      });

      const debtors = [];
      const creditors = [];

      Object.keys(netBalances).forEach(person => {
        const bal = netBalances[person];
        if (bal < -0.5) debtors.push({ name: person, amount: -bal });
        else if (bal > 0.5) creditors.push({ name: person, amount: bal });
      });

      debtors.sort((a, b) => b.amount - a.amount);
      creditors.sort((a, b) => b.amount - a.amount);

      const settlements = [];
      let i = 0, j = 0;

      while (i < debtors.length && j < creditors.length) {
        const payAmt = Math.min(debtors[i].amount, creditors[j].amount);
        settlements.push({
          from: debtors[i].name,
          to: creditors[j].name,
          amountTWD: Math.round(payAmt),
          amountJPY: Math.round(payAmt / rate)
        });

        debtors[i].amount -= payAmt;
        creditors[j].amount -= payAmt;

        if (debtors[i].amount < 0.5) i++;
        if (creditors[j].amount < 0.5) j++;
      }

      return settlements;
    }

    function renderExpenseModal() {
      const chipsContainer = document.getElementById('membersChipsContainer');
      chipsContainer.innerHTML = '';
      expenseData.members.forEach(m => {
        const chip = document.createElement('span');
        chip.className = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
        chip.innerHTML = `${m} <button type="button" data-member="${m}" class="text-rose-500 hover:text-rose-700 font-black">&times;</button>`;
        chip.querySelector('button').addEventListener('click', () => {
          if (expenseData.members.length <= 2) {
            showToast("至少需保留 2 位成員");
            return;
          }
          expenseData.members = expenseData.members.filter(mem => mem !== m);
          saveData();
          renderExpenseModal();
        });
        chipsContainer.appendChild(chip);
      });

      const payerSelect = document.getElementById('expensePayer');
      payerSelect.innerHTML = '';
      expenseData.members.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        payerSelect.appendChild(opt);
      });

      const partContainer = document.getElementById('splitParticipantsCheckboxes');
      partContainer.innerHTML = '';
      expenseData.members.forEach(m => {
        const label = document.createElement('label');
        label.className = "inline-flex items-center gap-1 text-[10px] text-slate-700 dark:text-slate-300 font-semibold cursor-pointer";
        label.innerHTML = `<input type="checkbox" value="${m}" checked class="part-check w-3.5 h-3.5 rounded text-emerald-600"> <span>${m}</span>`;
        partContainer.appendChild(label);
      });

      const debtContainer = document.getElementById('settlementDebtsList');
      debtContainer.innerHTML = '';
      const settlements = calculateDebts();

      if (settlements.length === 0) {
        debtContainer.innerHTML = `<p class="text-slate-400 text-[10px]">所有帳務已結清或尚無代墊記錄。</p>`;
      } else {
        settlements.forEach(s => {
          const div = document.createElement('div');
          div.className = "p-1.5 bg-white dark:bg-slate-900 rounded border border-emerald-300 dark:border-emerald-800 flex items-center justify-between font-bold text-[10.5px]";
          div.innerHTML = `
            <span><strong class="text-rose-600">${s.from}</strong> 應付給 <strong class="text-emerald-600">${s.to}</strong></span>
            <span class="text-slate-800 dark:text-slate-100 font-mono">NT$ ${s.amountTWD.toLocaleString()} <span class="text-[9px] text-slate-400 font-normal">(約 ¥${s.amountJPY.toLocaleString()})</span></span>
          `;
          debtContainer.appendChild(div);
        });
      }

      const historyContainer = document.getElementById('expensesHistoryList');
      historyContainer.innerHTML = '';
      document.getElementById('expensesTotalBadge').textContent = `共 ${expenseData.items.length} 筆開銷`;

      expenseData.items.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = "pt-1.5 pb-1.5 flex items-center justify-between gap-1 text-[10px]";
        row.innerHTML = `
          <div class="truncate flex-1 min-w-0">
            <span class="font-bold text-slate-800 dark:text-slate-200">${item.title}</span>
            <span class="text-slate-400"> (由 ${item.payer} 代墊)</span>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span class="font-mono font-bold text-emerald-600">${item.currency} ${item.amount.toLocaleString()}</span>
            <button data-idx="${idx}" class="text-rose-500 hover:text-rose-700 p-0.5"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        `;
        row.querySelector('button').addEventListener('click', () => {
          expenseData.items.splice(idx, 1);
          saveData();
          renderExpenseModal();
          showToast("已刪除該筆開銷");
        });
        historyContainer.appendChild(row);
      });
    }

    function openShopsDrawer() {
      document.getElementById('shopsDrawerContainer').classList.remove('hidden');
    }
    function closeShopsDrawer() {
      document.getElementById('shopsDrawerContainer').classList.add('hidden');
    }

    function copyCurrentShareLink() {
      syncStateToUrl();
      const currentUrl = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentUrl).then(() => {
          showToast("最新行程網址已複製到剪貼簿！");
        }).catch(() => fallbackCopy(currentUrl));
      } else {
        fallbackCopy(currentUrl);
      }
    }

    function fallbackCopy(text) {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast("最新行程網址已複製！");
    }

    function setupEventListeners() {
      const shareLinkBtn = document.getElementById('shareLinkBtn');
      if (shareLinkBtn) shareLinkBtn.addEventListener('click', copyCurrentShareLink);

      const copyShareLinkInModalBtn = document.getElementById('copyShareLinkInModalBtn');
      if (copyShareLinkInModalBtn) copyShareLinkInModalBtn.addEventListener('click', copyCurrentShareLink);

      document.getElementById('quickPresetFillBtn').addEventListener('click', () => {
        const queryName = document.getElementById('formStopName').value.trim();
        let match = POPULAR_LOCATIONS.find(loc => queryName && loc.name.includes(queryName));
        if (!match) {
          const names = POPULAR_LOCATIONS.map((l, i) => `${i + 1}. ${l.name}`).join("\n");
          const input = prompt(`請選擇要套用的熱門景點編號 (1-${POPULAR_LOCATIONS.length})：\n${names}`, "1");
          const idx = parseInt(input) - 1;
          if (idx >= 0 && idx < POPULAR_LOCATIONS.length) match = POPULAR_LOCATIONS[idx];
        }
        if (match) {
          document.getElementById('formStopName').value = match.name;
          document.getElementById('formStopAddress').value = match.address || '';
          document.getElementById('formStopLat').value = match.lat;
          document.getElementById('formStopLng').value = match.lng;
          document.getElementById('formStopIcon').value = match.icon;
          document.getElementById('formStopCategory').value = match.category;
          
          const previewEl = document.getElementById('stopModalHeaderIcon');
          if (previewEl) previewEl.className = `fa-solid ${match.icon}`;
          renderIconSelector('stopIconGrid', 'formStopIcon', match.icon, 'stopModalHeaderIcon');
          showToast(`已載入：${match.name} 與地址！`);
        }
      });

      document.getElementById('recalcTimesBtn').addEventListener('click', () => {
        const curDay = appData[currentDayIndex];
        updateChainedScheduleForDay(curDay);
        saveData();
        renderTimeline();
        showToast("已順延重算當日所有行程時刻！");
      });

      document.getElementById('addStopHeaderBtn').addEventListener('click', openAddStopModal);
      document.getElementById('mobileAddStopBtn').addEventListener('click', openAddStopModal);
      document.getElementById('closeStopModalBtn').addEventListener('click', () => document.getElementById('stopModal').classList.add('hidden'));
      document.getElementById('cancelStopModalBtn').addEventListener('click', () => document.getElementById('stopModal').classList.add('hidden'));
      document.getElementById('stopForm').addEventListener('submit', handleStopFormSubmit);
      document.getElementById('deleteStopBtn').addEventListener('click', handleDeleteStop);

      const addShopQuickBtn = document.getElementById('addShopQuickBtn');
      if (addShopQuickBtn) addShopQuickBtn.addEventListener('click', openAddShopModal);

      document.getElementById('closeShopModalBtn').addEventListener('click', () => document.getElementById('shopModal').classList.add('hidden'));
      document.getElementById('cancelShopModalBtn').addEventListener('click', () => document.getElementById('shopModal').classList.add('hidden'));
      document.getElementById('shopForm').addEventListener('submit', handleShopFormSubmit);
      document.getElementById('deleteShopBtn').addEventListener('click', handleDeleteShop);

      document.getElementById('mobileOpenSplitBtn').addEventListener('click', () => {
        renderExpenseModal();
        document.getElementById('splitModal').classList.remove('hidden');
      });
      document.getElementById('closeSplitModalBtn').addEventListener('click', () => {
        document.getElementById('splitModal').classList.add('hidden');
      });

      document.getElementById('addNewMemberBtn').addEventListener('click', () => {
        const input = document.getElementById('newMemberInput');
        const val = input.value.trim();
        if (val && !expenseData.members.includes(val)) {
          expenseData.members.push(val);
          input.value = '';
          saveData();
          renderExpenseModal();
        }
      });

      document.getElementById('addExpenseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const checkboxes = document.querySelectorAll('.part-check:checked');
        const parts = Array.from(checkboxes).map(c => c.value);
        if (parts.length === 0) {
          showToast("分攤成員不可為空！");
          return;
        }

        const newItem = {
          id: `exp-${Date.now()}`,
          title: document.getElementById('expenseItemName').value.trim(),
          amount: parseFloat(document.getElementById('expenseAmount').value),
          currency: document.getElementById('expenseCurrency').value,
          payer: document.getElementById('expensePayer').value,
          participants: parts
        };

        const rateInput = parseFloat(document.getElementById('customExchangeRate').value);
        if (rateInput > 0) expenseData.rate = rateInput;

        expenseData.items.push(newItem);
        saveData();
        document.getElementById('expenseItemName').value = '';
        document.getElementById('expenseAmount').value = '';
        renderExpenseModal();
        showToast("已記錄代墊開銷！");
      });

      document.getElementById('copySettlementSummaryBtn').addEventListener('click', () => {
        const settlements = calculateDebts();
        if (settlements.length === 0) {
          showToast("無待結清款項");
          return;
        }
        let text = "✈️【大阪自由行 分帳結算明細】\n";
        settlements.forEach(s => {
          text += `👉 ${s.from} 應轉給 ${s.to}：NT$ ${s.amountTWD.toLocaleString()} (約 ¥${s.amountJPY.toLocaleString()})\n`;
        });
        text += `\n📅 結算匯率基準：1 JPY = ${expenseData.rate} TWD`;
        fallbackCopy(text);
      });

      document.getElementById('viewToggleShopsBtn').addEventListener('click', openShopsDrawer);
      document.getElementById('mobileOpenShopsDrawerBtn').addEventListener('click', openShopsDrawer);
      document.getElementById('closeDrawerBtn').addEventListener('click', closeShopsDrawer);
      
      document.getElementById('themeToggleBtn').addEventListener('click', () => {
        document.getElementById('themePaletteBar').classList.toggle('hidden');
      });

      document.querySelectorAll('.theme-select-btn').forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme-val')));
      });

      document.getElementById('dataSettingsBtn').addEventListener('click', () => document.getElementById('dataModal').classList.remove('hidden'));
      document.getElementById('mobileOpenSettingsBtn').addEventListener('click', () => document.getElementById('dataModal').classList.remove('hidden'));
      document.getElementById('closeDataModalBtn').addEventListener('click', () => document.getElementById('dataModal').classList.add('hidden'));
      document.getElementById('finishDataModalBtn').addEventListener('click', () => document.getElementById('dataModal').classList.add('hidden'));

      document.querySelectorAll('.shop-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelectorAll('.shop-filter-btn').forEach(b => {
            b.classList.remove('bg-slate-900', 'text-white', 'dark:bg-slate-100', 'dark:text-slate-900');
            b.classList.add('text-slate-600', 'dark:text-slate-300');
          });
          btn.classList.add('bg-slate-900', 'text-white', 'dark:bg-slate-100', 'dark:text-slate-900');
          btn.classList.remove('text-slate-600', 'dark:text-slate-300');
          currentShopCategory = btn.getAttribute('data-cat');
          renderShops();
        });
      });

      document.getElementById('exportJsonBtn').addEventListener('click', () => {
        const fullBackup = { appData, expenseData };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `Osaka_Travel_Backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("已匯出 JSON 備份檔");
      });

      document.getElementById('importJsonInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            if (parsed.appData) {
              appData = parsed.appData;
              if (parsed.expenseData) expenseData = parsed.expenseData;
            } else if (Array.isArray(parsed)) {
              appData = parsed;
            }
            saveData();
            renderAll();
            document.getElementById('dataModal').classList.add('hidden');
            showToast("成功還原備份資料！");
          } catch (err) {
            showToast("檔案格式錯誤");
          }
        };
        reader.readAsText(file);
      });

      document.getElementById('resetDefaultBtn').addEventListener('click', () => {
        appData = JSON.parse(JSON.stringify(DEFAULT_ITINERARY_DATA));
        window.location.hash = '';
        saveData();
        document.getElementById('dataModal').classList.add('hidden');
        renderAll();
        showToast("已重設為預設行程！");
      });

      window.addEventListener('hashchange', () => {
        if (loadStateFromUrl()) {
          renderAll();
          showToast("已更新為網址指定行程！");
        }
      });
    }

    function initTheme() {
      const savedTheme = localStorage.getItem(THEME_KEY) || 'ocean';
      applyTheme(savedTheme, false);
    }

    function applyTheme(themeName, showNotif = true) {
      if (themeName === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', themeName);
      }
      localStorage.setItem(THEME_KEY, themeName);

      document.querySelectorAll('.theme-select-btn').forEach(btn => {
        if (btn.getAttribute('data-theme-val') === themeName) {
          btn.classList.add('ring-2', 'ring-offset-1', 'ring-slate-900', 'dark:ring-white');
        } else {
          btn.classList.remove('ring-2', 'ring-offset-1', 'ring-slate-900', 'dark:ring-white');
        }
      });
      if (showNotif) showToast(`已切換配色：${themeName}`);
    }

    function renderAll() {
      renderDayTabs();
      renderDayHeader();
      renderTimeline();
      renderShops();
    }

    window.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initData();
      renderAll();
      setupEventListeners();
    });
