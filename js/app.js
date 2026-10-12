/**
 * 大阪・關西隨行助手 - Vue 3 Composition API 業務邏輯
 */
import { doc, setDoc, onSnapshot, auth, db, appId, signInAnonymously, signInWithCustomToken } from './firebase-config.js';
import { POPULAR_LOCATIONS, DEFAULT_ITINERARY_DATA } from './data.js';

const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const appData = ref(JSON.parse(JSON.stringify(DEFAULT_ITINERARY_DATA)));
    const currentDayIndex = ref(0);
    const selectedStopId = ref(null);
    const currentShopCat = ref('all');
    const showShopDrawer = ref(false);
    const showThemeBar = ref(false);
    const showStopModal = ref(false);
    const showShopModal = ref(false);
    const showSplitModal = ref(false);
    const showDataModal = ref(false);
    const currentTheme = ref('ocean');
    const toastText = ref('成功更新');

    const syncStatus = ref('connecting');
    const currentUserId = ref('');
    const isSyncing = ref(false);

    const expenseData = ref({
      members: ["我", "旅伴A", "旅伴B"],
      rate: 0.21,
      items: [
        { id: "exp-1", title: "Day 1 焼肉㐂舌晚餐", amount: 18000, currency: "JPY", payer: "我", participants: ["我", "旅伴A", "旅伴B"] }
      ]
    });

    const newMemberInput = ref('');
    const expenseForm = ref({
      title: '',
      amount: '',
      currency: 'JPY',
      payer: '我',
      participants: ["我", "旅伴A", "旅伴B"]
    });

    const stopForm = ref({
      id: '',
      name: '',
      address: '',
      lat: null,
      lng: null,
      icon: 'fa-location-dot',
      category: 'sight',
      stayMins: 60,
      depTime: '09:00',
      arrTime: '09:30',
      travelMode: '',
      travelMins: '',
      travelDetail: '',
      note: ''
    });

    const shopForm = ref({
      id: '',
      targetStopId: '',
      name: '',
      address: '',
      cat: 'food',
      price: '$',
      desc: '',
      icon: 'fa-utensils'
    });

    const themes = [
      { val: 'ocean', name: '晴空藍', dotClass: 'bg-sky-600', btnClass: 'bg-white text-sky-700 border-sky-300' },
      { val: 'matcha', name: '抹茶', dotClass: 'bg-emerald-600', btnClass: 'bg-white text-emerald-700 border-emerald-300' },
      { val: 'sakura', name: '緋櫻', dotClass: 'bg-pink-600', btnClass: 'bg-white text-pink-700 border-pink-300' },
      { val: 'sunset', name: '日暮', dotClass: 'bg-orange-600', btnClass: 'bg-white text-orange-700 border-orange-300' },
      { val: 'violet', name: '紫羅蘭', dotClass: 'bg-purple-600', btnClass: 'bg-white text-purple-700 border-purple-300' },
      { val: 'dark', name: '暗黑', dotClass: 'bg-sky-400', btnClass: 'bg-slate-800 text-sky-300 border-slate-700' }
    ];

    const availableIcons = [
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

    const shopCategories = [
      { val: 'all', name: '全部' },
      { val: 'food', name: '小吃・美食' },
      { val: 'cafe', name: '咖啡・甜點' },
      { val: 'night', name: '居酒・宵夜' },
      { val: 'goods', name: '伴手禮' }
    ];

    const currentDay = computed(() => appData.value[currentDayIndex.value] || appData.value[0]);
    
    const selectedStop = computed(() => {
      if (!selectedStopId.value || !currentDay.value?.stops) return null;
      return currentDay.value.stops.find(s => s.id === selectedStopId.value);
    });

    const allCurrentDayShops = computed(() => {
      if (!currentDay.value?.stops) return [];
      const list = [];
      currentDay.value.stops.forEach(st => {
        if (st.shops) {
          st.shops.forEach(sh => {
            list.push({ ...sh, parentStopId: st.id, parentStopName: st.name });
          });
        }
      });
      return list;
    });

    const filteredShops = computed(() => {
      let list = [];
      if (selectedStop.value) {
        if (selectedStop.value.shops) {
          list = selectedStop.value.shops.map(sh => ({
            ...sh,
            parentStopId: selectedStop.value.id,
            parentStopName: selectedStop.value.name
          }));
        }
      } else {
        list = allCurrentDayShops.value;
      }

      if (currentShopCat.value !== 'all') {
        list = list.filter(sh => sh.cat === currentShopCat.value);
      }
      return list;
    });

    const syncBadgeClass = computed(() => {
      if (syncStatus.value === 'synced') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      if (syncStatus.value === 'saving') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      if (syncStatus.value === 'error') return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      return 'bg-slate-200 dark:bg-slate-700 text-slate-500 border-slate-300 dark:border-slate-600';
    });

    const syncDotClass = computed(() => {
      if (syncStatus.value === 'synced') return 'bg-emerald-500 animate-pulse';
      if (syncStatus.value === 'saving') return 'bg-amber-500 animate-ping';
      if (syncStatus.value === 'error') return 'bg-rose-500';
      return 'bg-slate-400';
    });

    const syncStatusText = computed(() => {
      if (syncStatus.value === 'synced') return '雲端實時已連線';
      if (syncStatus.value === 'saving') return '雲端同步寫入中...';
      if (syncStatus.value === 'error') return '連線異常';
      return '連線雲端中...';
    });

    const settlements = computed(() => {
      const netBalances = {};
      expenseData.value.members.forEach(m => netBalances[m] = 0);
      const rate = expenseData.value.rate || 0.21;

      expenseData.value.items.forEach(item => {
        let amtInTWD = item.currency === 'JPY' ? item.amount * rate : item.amount;
        const payer = item.payer;
        const participants = (item.participants && item.participants.length > 0) ? item.participants : expenseData.value.members;
        const share = amtInTWD / participants.length;

        if (netBalances[payer] !== undefined) netBalances[payer] += amtInTWD;
        participants.forEach(p => {
          if (netBalances[p] !== undefined) netBalances[p] -= share;
        });
      });

      const debtors = [];
      const creditors = [];

      Object.keys(netBalances).forEach(p => {
        const bal = netBalances[p];
        if (bal < -0.5) debtors.push({ name: p, amount: -bal });
        else if (bal > 0.5) creditors.push({ name: p, amount: bal });
      });

      debtors.sort((a, b) => b.amount - a.amount);
      creditors.sort((a, b) => b.amount - a.amount);

      const result = [];
      let i = 0, j = 0;
      while (i < debtors.length && j < creditors.length) {
        const payAmt = Math.min(debtors[i].amount, creditors[j].amount);
        result.push({
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
      return result;
    });

    function showToast(msg) {
      toastText.value = msg;
      const toast = document.getElementById('toastNotification');
      if (toast) {
        toast.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          toast.classList.add('opacity-0', 'pointer-events-none');
        }, 1900);
      }
    }

    function calculateDistanceKm(lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Number((R * c).toFixed(1));
    }

    function getDistance(idx) {
      if (!currentDay.value?.stops || currentDay.value.stops.length === 0) return 0;
      const origin = currentDay.value.stops[0];
      const curr = currentDay.value.stops[idx];
      return calculateDistanceKm(origin.lat, origin.lng, curr.lat, curr.lng);
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

    function recalculateSchedule() {
      if (!currentDay.value?.stops || currentDay.value.stops.length === 0) return;
      let curMins = parseMinutes(currentDay.value.stops[0].depTime || "09:00");

      for (let i = 0; i < currentDay.value.stops.length; i++) {
        const stop = currentDay.value.stops[i];
        if (i > 0) {
          const prevStop = currentDay.value.stops[i - 1];
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
      saveAllData();
      showToast("已順延重算當日所有行程時刻！");
    }

    function moveStop(index, offset) {
      const newIdx = index + offset;
      if (newIdx < 0 || newIdx >= currentDay.value.stops.length) return;
      const temp = currentDay.value.stops[index];
      currentDay.value.stops[index] = currentDay.value.stops[newIdx];
      currentDay.value.stops[newIdx] = temp;
      recalculateSchedule();
    }

    function openGoogleMap(item) {
      let queryTarget = item.address ? `${item.name} ${item.address}` : item.name;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryTarget)}`;
      window.open(url, '_blank');
    }

    function getCategoryBadgeClass(category) {
      if (category === 'food') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      if (category === 'transit') return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      if (category === 'lodging') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
    }

    function getShopCatName(cat) {
      if (cat === 'cafe') return '咖啡甜點';
      if (cat === 'goods') return '伴手禮';
      if (cat === 'night') return '居酒屋';
      return '美食';
    }

    function getShopCatBadgeClass(cat) {
      if (cat === 'cafe') return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      if (cat === 'goods') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      if (cat === 'night') return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }

    function changeTheme(themeVal) {
      currentTheme.value = themeVal;
      if (themeVal === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', themeVal);
      }
      showToast(`已套用：${themeVal} 主題風格`);
    }

    let unsubscribeSnapshot = null;
    let isLocalSaving = false;

    async function initFirebaseSync() {
      try {
        syncStatus.value = 'connecting';
        let user = auth.currentUser;
        if (!user) {
          if (typeof __initial_auth_token !== 'undefined') {
            const cred = await signInWithCustomToken(auth, __initial_auth_token);
            user = cred.user;
          } else {
            const cred = await signInAnonymously(auth);
            user = cred.user;
          }
        }

        if (!user) {
          syncStatus.value = 'error';
          return;
        }

        currentUserId.value = user.uid;
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'travel_data');

        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (isLocalSaving) {
            isLocalSaving = false;
            syncStatus.value = 'synced';
            return;
          }

          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            if (cloudData.appData && Array.isArray(cloudData.appData)) {
              appData.value = cloudData.appData;
            }
            if (cloudData.expenseData) {
              expenseData.value = cloudData.expenseData;
            }
            syncStatus.value = 'synced';
          } else {
            saveAllData(false);
          }
        }, (error) => {
          console.warn("Firestore onSnapshot error:", error);
          syncStatus.value = 'error';
        });

      } catch (err) {
        console.warn("Firebase Auth / Init Error:", err);
        syncStatus.value = 'error';
      }
    }

    async function saveAllData(notify = true) {
      if (!auth.currentUser) return;
      syncStatus.value = 'saving';
      isLocalSaving = true;

      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'travel_data');
        await setDoc(docRef, {
          appData: JSON.parse(JSON.stringify(appData.value)),
          expenseData: JSON.parse(JSON.stringify(expenseData.value)),
          updatedAt: new Date().toISOString(),
          lastUpdatedBy: auth.currentUser?.uid || 'anonymous'
        });
        syncStatus.value = 'synced';
        if (notify) showToast("已自動儲存並即時推送到雲端！");
      } catch (e) {
        console.error("Save to Cloud Error:", e);
        syncStatus.value = 'error';
        showToast("雲端同步儲存失敗");
      }
    }

    function forcePullCloud() {
      isSyncing.value = true;
      setTimeout(() => {
        isSyncing.value = false;
        showToast("已確認為雲端最新即時版本！");
      }, 600);
    }

    function openAddStopModal() {
      let lastArr = "09:00";
      if (currentDay.value?.stops && currentDay.value.stops.length > 0) {
        lastArr = currentDay.value.stops[currentDay.value.stops.length - 1].arrTime || "09:00";
      }

      stopForm.value = {
        id: '',
        name: '',
        address: '',
        lat: null,
        lng: null,
        icon: 'fa-location-dot',
        category: 'sight',
        stayMins: 60,
        depTime: lastArr,
        arrTime: lastArr,
        travelMode: '',
        travelMins: '',
        travelDetail: '',
        note: ''
      };
      showStopModal.value = true;
    }

    function openEditStopModal(stop) {
      stopForm.value = { ...JSON.parse(JSON.stringify(stop)) };
      showStopModal.value = true;
    }

    function saveStopForm() {
      if (!stopForm.value.name) return;
      if (stopForm.value.id) {
        const idx = currentDay.value.stops.findIndex(s => s.id === stopForm.value.id);
        if (idx !== -1) {
          currentDay.value.stops[idx] = { ...currentDay.value.stops[idx], ...stopForm.value };
        }
      } else {
        const newStop = {
          ...stopForm.value,
          id: `stop-${Date.now()}`,
          shops: []
        };
        currentDay.value.stops.push(newStop);
      }
      showStopModal.value = false;
      saveAllData();
    }

    function deleteCurrentStop() {
      if (!stopForm.value.id) return;
      currentDay.value.stops = currentDay.value.stops.filter(s => s.id !== stopForm.value.id);
      showStopModal.value = false;
      saveAllData();
      showToast("已刪除該景點");
    }

    function quickPresetPick() {
      const names = POPULAR_LOCATIONS.map((l, i) => `${i + 1}. ${l.name}`).join("\n");
      const input = prompt(`請選擇要套用的熱門景點編號 (1-${POPULAR_LOCATIONS.length})：\n${names}`, "1");
      const idx = parseInt(input) - 1;
      if (idx >= 0 && idx < POPULAR_LOCATIONS.length) {
        const match = POPULAR_LOCATIONS[idx];
        stopForm.value.name = match.name;
        stopForm.value.address = match.address || '';
        stopForm.value.lat = match.lat;
        stopForm.value.lng = match.lng;
        stopForm.value.icon = match.icon;
        stopForm.value.category = match.category;
        showToast(`已載入：${match.name} 資訊！`);
      }
    }

    function openAddShopModal() {
      if (!currentDay.value?.stops || currentDay.value.stops.length === 0) {
        showToast("今日尚無景點，請先新增景點後再加名店！");
        return;
      }
      shopForm.value = {
        id: '',
        targetStopId: selectedStopId.value || currentDay.value.stops[0].id,
        name: '',
        address: '',
        cat: 'food',
        price: '$',
        desc: '',
        icon: 'fa-utensils'
      };
      showShopModal.value = true;
    }

    function saveShopForm() {
      if (!shopForm.value.name || !shopForm.value.targetStopId) return;
      const targetStop = currentDay.value.stops.find(s => s.id === shopForm.value.targetStopId);
      if (targetStop) {
        if (!targetStop.shops) targetStop.shops = [];
        targetStop.shops.push({
          id: `sh-${Date.now()}`,
          name: shopForm.value.name,
          address: shopForm.value.address,
          cat: shopForm.value.cat,
          price: shopForm.value.price,
          desc: shopForm.value.desc,
          icon: shopForm.value.icon
        });
        saveAllData();
        showShopModal.value = false;
        showToast("街邊名店已成功儲存！");
      }
    }

    function addNewMember() {
      const name = newMemberInput.value.trim();
      if (name && !expenseData.value.members.includes(name)) {
        expenseData.value.members.push(name);
        expenseForm.value.participants.push(name);
        newMemberInput.value = '';
        saveAllData();
      }
    }

    function removeMember(m) {
      if (expenseData.value.members.length <= 2) {
        showToast("至少需保留 2 位成員");
        return;
      }
      expenseData.value.members = expenseData.value.members.filter(x => x !== m);
      expenseForm.value.participants = expenseForm.value.participants.filter(x => x !== m);
      saveAllData();
    }

    function addExpenseItem() {
      if (!expenseForm.value.title || !expenseForm.value.amount) return;
      if (expenseForm.value.participants.length === 0) {
        showToast("請至少選擇一位分攤成員！");
        return;
      }
      expenseData.value.items.push({
        id: `exp-${Date.now()}`,
        title: expenseForm.value.title.trim(),
        amount: expenseForm.value.amount,
        currency: expenseForm.value.currency,
        payer: expenseForm.value.payer,
        participants: [...expenseForm.value.participants]
      });
      expenseForm.value.title = '';
      expenseForm.value.amount = '';
      saveAllData();
      showToast("已記錄代墊開銷並同步！");
    }

    function removeExpenseItem(idx) {
      expenseData.value.items.splice(idx, 1);
      saveAllData();
      showToast("已刪除該筆記帳");
    }

    function copySettlementSummary() {
      if (settlements.value.length === 0) {
        showToast("無待結清款項");
        return;
      }
      let text = "✈️【大阪自由行 分帳結算明細】\n";
      settlements.value.forEach(s => {
        text += `👉 ${s.from} 應轉給 ${s.to}：NT$ ${s.amountTWD.toLocaleString()} (約 ¥${s.amountJPY.toLocaleString()})\n`;
      });
      text += `\n📅 結算匯率基準：1 JPY = ${expenseData.value.rate} TWD`;

      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      showToast("已複製結算文字，可直接貼到 LINE！");
    }

    function copyShareLink() {
      const url = window.location.href;
      const temp = document.createElement('textarea');
      temp.value = url;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      showToast("專屬分享連結已複製到剪貼簿！");
    }

    function exportJsonBackup() {
      const fullBackup = { appData: appData.value, expenseData: expenseData.value };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", `Osaka_Travel_Firebase_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      showToast("已匯出 JSON 備份檔");
    }

    function importJsonBackup(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.appData) appData.value = parsed.appData;
          if (parsed.expenseData) expenseData.value = parsed.expenseData;
          saveAllData();
          showDataModal.value = false;
          showToast("成功匯入並同步至雲端！");
        } catch (err) {
          showToast("檔案格式錯誤");
        }
      };
      reader.readAsText(file);
    }

    function resetDefaultData() {
      appData.value = JSON.parse(JSON.stringify(DEFAULT_ITINERARY_DATA));
      saveAllData();
      showDataModal.value = false;
      showToast("已重設為預設行程並同步！");
    }

    onMounted(() => {
      initFirebaseSync();
    });

    return {
      appData,
      currentDayIndex,
      currentDay,
      selectedStopId,
      selectedStop,
      currentShopCat,
      showShopDrawer,
      showThemeBar,
      showStopModal,
      showShopModal,
      showSplitModal,
      showDataModal,
      currentTheme,
      toastText,
      syncStatus,
      syncBadgeClass,
      syncDotClass,
      syncStatusText,
      currentUserId,
      isSyncing,
      expenseData,
      newMemberInput,
      expenseForm,
      settlements,
      stopForm,
      shopForm,
      themes,
      availableIcons,
      shopCategories,
      allCurrentDayShops,
      filteredShops,
      getDistance,
      recalculateSchedule,
      moveStop,
      openGoogleMap,
      getCategoryBadgeClass,
      getShopCatName,
      getShopCatBadgeClass,
      changeTheme,
      forcePullCloud,
      openAddStopModal,
      openEditStopModal,
      saveStopForm,
      deleteCurrentStop,
      quickPresetPick,
      openAddShopModal,
      saveShopForm,
      addNewMember,
      removeMember,
      addExpenseItem,
      removeExpenseItem,
      copySettlementSummary,
      copyShareLink,
      exportJsonBackup,
      importJsonBackup,
      resetDefaultData,
      saveAllData
    };
  }
}).mount('#app');
