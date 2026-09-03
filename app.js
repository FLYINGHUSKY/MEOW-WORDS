const FEATURED_WORDS = [
  {id:'abandon', word:'abandon', phonetic:'/əˈbændən/', pos:'v.', meaning:'放弃；抛弃；舍弃', note:'a + band（绑）→ 不再绑住 → 放弃', example:'They had to abandon the plan because of a lack of funds.', translation:'由于缺乏资金，他们不得不放弃这项计划。'},
  {id:'abrupt', word:'abrupt', phonetic:'/əˈbrʌpt/', pos:'adj.', meaning:'突然的；唐突的', note:'想象道路突然断裂，变化来得很 abrupt。', example:'The meeting came to an abrupt end.', translation:'会议突然结束了。'},
  {id:'acknowledge', word:'acknowledge', phonetic:'/əkˈnɒlɪdʒ/', pos:'v.', meaning:'承认；确认收到；致谢', note:'把 know（知道）说出来，就是承认与确认。', example:'She acknowledged that the decision had been a mistake.', translation:'她承认那个决定是一个错误。'},
  {id:'advocate', word:'advocate', phonetic:'/ˈædvəkeɪt/', pos:'v./n.', meaning:'提倡；拥护；倡导者', note:'为一个观点发声、辩护，就是 advocate。', example:'Many experts advocate reducing screen time before bed.', translation:'许多专家提倡睡前减少屏幕使用时间。'},
  {id:'ambiguous', word:'ambiguous', phonetic:'/æmˈbɪɡjuəs/', pos:'adj.', meaning:'模棱两可的；含糊的', note:'ambi 表示“两边”，两边都能解释，所以含糊。', example:'The wording of the agreement is rather ambiguous.', translation:'这份协议的措辞相当含糊。'},
  {id:'anticipate', word:'anticipate', phonetic:'/ænˈtɪsɪpeɪt/', pos:'v.', meaning:'预期；预料；期待', note:'事情到来之前先在脑中看见它，就是预期。', example:'We anticipate that demand will increase next year.', translation:'我们预计明年的需求会增加。'},
  {id:'arbitrary', word:'arbitrary', phonetic:'/ˈɑːbɪtrəri/', pos:'adj.', meaning:'任意的；武断的', note:'没有一致规则，只凭个人判断，就是 arbitrary。', example:'The deadline seems completely arbitrary.', translation:'这个截止日期似乎完全是随意定的。'},
  {id:'attain', word:'attain', phonetic:'/əˈteɪn/', pos:'v.', meaning:'达到；获得', note:'和 obtain 同族，强调经过努力“达到”目标。', example:'She worked hard to attain her goals.', translation:'她努力工作以实现自己的目标。'},
  {id:'authentic', word:'authentic', phonetic:'/ɔːˈθentɪk/', pos:'adj.', meaning:'真正的；真实的；可信的', note:'auth 表示“本人、原创”，本人出品就是真实的。', example:'The restaurant serves authentic local food.', translation:'这家餐厅供应正宗的当地食物。'},
  {id:'bewilder', word:'bewilder', phonetic:'/bɪˈwɪldə(r)/', pos:'v.', meaning:'使迷惑；使不知所措', note:'仿佛被丢进 wilderness（荒野），让人迷失。', example:'The complicated instructions bewildered me.', translation:'这些复杂的说明把我弄糊涂了。'},
  {id:'coherent', word:'coherent', phonetic:'/kəʊˈhɪərənt/', pos:'adj.', meaning:'连贯的；条理清楚的', note:'co（共同）+ here（黏着）→ 内容黏在一起，连贯。', example:'He presented a clear and coherent argument.', translation:'他提出了清晰连贯的论点。'},
  {id:'compel', word:'compel', phonetic:'/kəmˈpel/', pos:'v.', meaning:'强迫；迫使', note:'com（共同）+ pel（推）→ 推着某人去做。', example:'The evidence compelled him to tell the truth.', translation:'证据迫使他说出真相。'},
  {id:'consecutive', word:'consecutive', phonetic:'/kənˈsekjətɪv/', pos:'adj.', meaning:'连续不断的', note:'一件事紧跟着下一件事，连续不掉队。', example:'It rained for five consecutive days.', translation:'连续下了五天雨。'},
  {id:'controversial', word:'controversial', phonetic:'/ˌkɒntrəˈvɜːʃl/', pos:'adj.', meaning:'有争议的；引发争论的', note:'contro（相反）+ vers（转）→ 观点转向相反两边。', example:'The proposal remains highly controversial.', translation:'这项提议仍然极具争议。'},
  {id:'deteriorate', word:'deteriorate', phonetic:'/dɪˈtɪəriəreɪt/', pos:'v.', meaning:'恶化；变坏', note:'记作“低得越来越厉害”→ 情况恶化。', example:'His health began to deteriorate rapidly.', translation:'他的健康状况开始迅速恶化。'},
  {id:'dilemma', word:'dilemma', phonetic:'/dɪˈlemə/', pos:'n.', meaning:'困境；进退两难', note:'di 表示“两个”，两个选择都难，就是两难。', example:'She faced the dilemma of whether to stay or leave.', translation:'她面临着留下还是离开的两难选择。'},
  {id:'discrepancy', word:'discrepancy', phonetic:'/dɪsˈkrepənsi/', pos:'n.', meaning:'差异；不一致', note:'dis（分开）→ 两份信息分开了，出现差异。', example:'There is a discrepancy between the two reports.', translation:'这两份报告之间存在差异。'},
  {id:'elaborate', word:'elaborate', phonetic:'/ɪˈlæbərət/', pos:'adj./v.', meaning:'精心制作的；详尽说明', note:'labor 是“劳动”，花很多功夫做得很精细。', example:'She gave an elaborate explanation of the process.', translation:'她对这个过程作了详尽的说明。'},
  {id:'empirical', word:'empirical', phonetic:'/ɪmˈpɪrɪkl/', pos:'adj.', meaning:'以实验为依据的；经验主义的', note:'来自 experiment 的实际观察，而不是纯理论。', example:'The theory is supported by empirical evidence.', translation:'该理论得到了实证证据的支持。'},
  {id:'enhance', word:'enhance', phonetic:'/ɪnˈhɑːns/', pos:'v.', meaning:'提高；增强；增进', note:'让某种能力向上升级，就是 enhance。', example:'Good lighting can enhance the atmosphere of a room.', translation:'良好的照明可以提升房间的氛围。'},
  {id:'feasible', word:'feasible', phonetic:'/ˈfiːzəbl/', pos:'adj.', meaning:'可行的；办得到的', note:'能做（doable）的方案，就是可行方案。', example:'We need to determine whether the plan is feasible.', translation:'我们需要确定这个计划是否可行。'},
  {id:'fluctuate', word:'fluctuate', phonetic:'/ˈflʌktʃueɪt/', pos:'v.', meaning:'波动；起伏不定', note:'像 wave 一样忽高忽低，数值在波动。', example:'Oil prices fluctuate from month to month.', translation:'油价每个月都会波动。'},
  {id:'formidable', word:'formidable', phonetic:'/ˈfɔːmɪdəbl/', pos:'adj.', meaning:'令人敬畏的；难对付的', note:'体量或难度大到让人敬畏。', example:'They face a formidable challenge.', translation:'他们面临着一项艰巨的挑战。'},
  {id:'incentive', word:'incentive', phonetic:'/ɪnˈsentɪv/', pos:'n.', meaning:'激励；刺激；动机', note:'能把人“引进去”行动的东西，就是激励。', example:'The bonus gives employees an incentive to work harder.', translation:'奖金激励员工更加努力地工作。'},
  {id:'inevitable', word:'inevitable', phonetic:'/ɪnˈevɪtəbl/', pos:'adj.', meaning:'不可避免的；必然的', note:'in（不）+ evitable（可避免）→ 不可避免。', example:'Some degree of change is inevitable.', translation:'某种程度的变化是不可避免的。'},
  {id:'innovative', word:'innovative', phonetic:'/ˈɪnəveɪtɪv/', pos:'adj.', meaning:'创新的；革新的', note:'nova 是“新”，把新东西带进来就是创新。', example:'The company is known for its innovative products.', translation:'这家公司以其创新产品而闻名。'},
  {id:'intricate', word:'intricate', phonetic:'/ˈɪntrɪkət/', pos:'adj.', meaning:'错综复杂的；精细的', note:'许多细节交织在内部，结构复杂精细。', example:'The carpet has an intricate pattern.', translation:'这块地毯有着错综复杂的图案。'},
  {id:'manifest', word:'manifest', phonetic:'/ˈmænɪfest/', pos:'v./adj.', meaning:'表明；显现；明显的', note:'原本藏着的东西变得看得见，就是显现。', example:'Stress can manifest itself in many ways.', translation:'压力可以通过多种方式表现出来。'},
  {id:'notwithstanding', word:'notwithstanding', phonetic:'/ˌnɒtwɪðˈstændɪŋ/', pos:'prep./adv.', meaning:'尽管；仍然', note:'not + withstand，尽管有阻碍，事情仍然成立。', example:'Notwithstanding the rain, the event continued.', translation:'尽管下雨，活动仍继续进行。'},
  {id:'persistent', word:'persistent', phonetic:'/pəˈsɪstənt/', pos:'adj.', meaning:'坚持不懈的；持续的', note:'persist + ent，保持站立不退缩，就是坚持。', example:'Her persistent efforts finally paid off.', translation:'她坚持不懈的努力终于得到了回报。'},
  {id:'plausible', word:'plausible', phonetic:'/ˈplɔːzəbl/', pos:'adj.', meaning:'看似合理的；可信的', note:'合理到值得 applause（鼓掌），听起来可信。', example:'His explanation sounds plausible.', translation:'他的解释听起来合情合理。'},
  {id:'preliminary', word:'preliminary', phonetic:'/prɪˈlɪmɪnəri/', pos:'adj.', meaning:'初步的；预备的', note:'pre（前）+ limin（门槛）→ 正式开始前的准备。', example:'Preliminary results are encouraging.', translation:'初步结果令人鼓舞。'},
  {id:'profound', word:'profound', phonetic:'/prəˈfaʊnd/', pos:'adj.', meaning:'深刻的；意义深远的', note:'pro（向前）+ found（底部）→ 深入到底，深刻。', example:'The experience had a profound impact on her.', translation:'这段经历对她产生了深远的影响。'},
  {id:'reluctant', word:'reluctant', phonetic:'/rɪˈlʌktənt/', pos:'adj.', meaning:'不情愿的；勉强的', note:'想象脚步往回缩，不愿意向前。', example:'He was reluctant to admit his mistake.', translation:'他不愿承认自己的错误。'},
  {id:'scrutinize', word:'scrutinize', phonetic:'/ˈskruːtənaɪz/', pos:'v.', meaning:'仔细检查；详审', note:'像拿放大镜一样一处处认真查看。', example:'The documents were carefully scrutinized.', translation:'这些文件被仔细审查了。'},
  {id:'substantial', word:'substantial', phonetic:'/səbˈstænʃl/', pos:'adj.', meaning:'大量的；实质的；重大的', note:'有 substance（实质、分量）的，就是大量且重要的。', example:'The project requires a substantial investment.', translation:'该项目需要大量投资。'}
];

const featuredIds = new Set(FEATURED_WORDS.map(item => item.id));
const WORDS = [
  ...FEATURED_WORDS,
  ...(window.CET6_WORDS || []).filter(item => !featuredIds.has(item.id))
];

const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
const DAILY_COMPANIONS = [
  {src:'assets/cat-speaker.jpg', alt:'戴耳机陪读的猫咪'},
  {src:'assets/cat-study.jpg', alt:'认真学习的猫咪'},
  {src:'assets/cat-watermelon.jpg', alt:'戴西瓜帽的猫咪'},
  {src:'assets/cat-orange.jpg', alt:'戴橘子帽的猫咪'},
  {src:'assets/cat-focus.jpg', alt:'专注模式的猫咪'},
  {src:'assets/cat-rest.jpg', alt:'敷面膜休息的猫咪'},
  {src:'assets/cat-avatar.jpg', alt:'今日陪学橘猫'},
  {src:'assets/cat-overwhelmed.jpg', alt:'躲进黑色袋子的猫咪'},
  {src:'assets/cat-package.jpg', alt:'戴快递袋帽子的猫咪'},
  {src:'assets/cat-watermelon-snack.jpg', alt:'抱着西瓜零食的猫咪'},
  {src:'assets/cat-pilot.jpg', alt:'戴飞行员帽的猫咪'}
];
const DAILY_MAIN_BACKGROUNDS = [
  'assets/main-bg-01.jpg',
  'assets/main-bg-02.jpg',
  'assets/main-bg-03.jpg',
  'assets/main-bg-04.jpg',
  'assets/main-bg-05.jpg',
  'assets/main-bg-06.jpg',
  'assets/main-bg-07.jpg'
];
const STORAGE_KEY = 'meow-cet6-state-v1';
const DAY = 86400000;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

function defaultState() {
  return { dailyGoal: 10, progress: {}, activity: {}, totalReviews: 0, createdAt: Date.now() };
}

function loadState() {
  try { return {...defaultState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; }
  catch { return defaultState(); }
}

let state = loadState();
let session = [];
let sessionIndex = 0;
let sessionAnswered = 0;
let activeFilter = 'all';
let libraryVisible = 60;
let tempGoal = state.dailyGoal;

const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const addDays = (days) => startOfDay() + days * DAY + 9 * 3600000;
const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const getProgress = (id) => state.progress[id];
const getStatus = (id) => !getProgress(id) ? 'new' : getProgress(id).level >= 4 ? 'mastered' : 'learning';
const learnedWords = () => WORDS.filter(w => getProgress(w.id));
const dueWords = () => WORDS.filter(w => getProgress(w.id) && getProgress(w.id).due <= Date.now());
const newWords = () => WORDS.filter(w => !getProgress(w.id));
const todayActivity = () => state.activity[dateKey()] || {count: 0, reviews: 0};

function setDailyCompanion() {
  const dayNumber = Math.floor(startOfDay() / DAY);
  const companion = DAILY_COMPANIONS[dayNumber % DAILY_COMPANIONS.length];
  const image = $('#studyCompanion');
  image.src = companion.src;
  image.alt = companion.alt;
  image.dataset.dailyIndex = String(dayNumber % DAILY_COMPANIONS.length);
}

function setDailyBackgrounds() {
  const dayNumber = Math.floor(startOfDay() / DAY);
  const mainIndex = dayNumber % DAILY_MAIN_BACKGROUNDS.length;
  const main = $('.main-content');
  main.style.setProperty('--daily-main-background', `url("${DAILY_MAIN_BACKGROUNDS[mainIndex]}")`);
  main.dataset.dailyBackgroundIndex = String(mainIndex);
}

function saveAndRefresh() { saveState(); renderAll(); }

function showToast(message, icon = '✓') {
  const toast = $('#toast');
  $('span', toast).textContent = icon;
  $('p', toast).textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
}

function speak(text, rate = .9) {
  if (!('speechSynthesis' in window)) { showToast('当前浏览器暂不支持发音', '!'); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
  speechSynthesis.speak(utterance);
}

function getStreak() {
  let streak = 0;
  const cursor = new Date();
  if (!state.activity[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  while (state.activity[dateKey(cursor)]?.count > 0) { streak++; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function getWeekData() {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  return Array.from({length: 7}, (_, i) => {
    const date = new Date(monday); date.setDate(monday.getDate() + i);
    return { date, data: state.activity[dateKey(date)] || {count: 0} };
  });
}

function renderDashboard() {
  const due = dueWords().length;
  const remainingNew = Math.min(state.dailyGoal, newWords().length);
  const today = todayActivity();
  const target = state.dailyGoal + due;
  const completed = Math.min(today.count, target || state.dailyGoal);
  const percent = Math.min(100, Math.round(completed / Math.max(target, 1) * 100));
  $('#streakCount').textContent = `${getStreak()} 天`;
  $('#newCount').textContent = remainingNew;
  $('#dueCount').textContent = due;
  $('#reviewBadge').textContent = due;
  $('#estimateTime').textContent = Math.max(1, Math.ceil((remainingNew + due) * .55));
  $('#progressFraction').textContent = `${completed} / ${target || state.dailyGoal}`;
  $('#progressPercent').textContent = `${percent}%`;
  $('#progressRing').style.setProperty('--progress', `${percent * 3.6}deg`);
  $('#goalBar').style.width = `${percent}%`;
  $('#goalText').textContent = `${target || state.dailyGoal} 个`;
  const progressCopy = percent === 100 ? ['今日任务完成！','做得真棒，安心休息一会儿吧。'] : percent > 0 ? ['已经迈出好几步啦','保持节奏，一小步也是进步。'] : ['今天还没有开始','迈出第一步，喵老师会一直陪着你。'];
  $('#progressTitle').textContent = progressCopy[0]; $('#progressMessage').textContent = progressCopy[1];
  $('#encourageTitle').textContent = percent === 100 ? '圆满收工！' : percent >= 50 ? '已经过半啦！' : '先学一个试试！';
  $('#encourageText').textContent = percent === 100 ? '给坚持的自己一个大拇指～' : percent >= 50 ? '胜利就在前面，加油喵～' : '开始比完美更重要喵～';
  $('#startStudyBtn').textContent = percent === 100 && !due && !remainingNew ? '今日任务已完成 ✓' : today.count > 0 ? '继续今日学习 →' : '开始今日学习 →';
  const week = getWeekData();
  $('#weekGrid').innerHTML = week.map(({date,data}) => `<div class="day-cell ${data.count > 0 ? 'done' : ''} ${dateKey(date) === dateKey() ? 'today' : ''}"><span class="day-dot">${data.count > 0 ? '✓' : date.getDate()}</span><span>${['日','一','二','三','四','五','六'][date.getDay()]}</span></div>`).join('');
  $('#weekDays').textContent = week.filter(x => x.data.count > 0).length;
  $('#weeklyWords').textContent = week.reduce((sum,x) => sum + (x.data.count || 0), 0);
  $('#masteredWords').textContent = WORDS.filter(w => getStatus(w.id) === 'mastered').length;
  const learned = learnedWords().length;
  $('#profileLevel').textContent = learned >= 30 ? '六级猫王' : learned >= 15 ? '进阶学霸猫' : learned >= 5 ? '勤奋小橘' : '初来乍到';
}

function buildSession() {
  const due = dueWords();
  const todayNewIds = new Set(todayActivity().newIds || []);
  const newLimit = Math.max(0, state.dailyGoal - todayNewIds.size);
  const fresh = newWords().slice(0, newLimit);
  session = [...due, ...fresh].filter((word, idx, arr) => arr.findIndex(w => w.id === word.id) === idx);
  sessionIndex = 0; sessionAnswered = 0;
  if (session.length) renderStudyCard(); else renderStudyEmpty();
}

function openStudy() { buildSession(); switchView('study'); }

function renderStudyCard() {
  const word = session[sessionIndex];
  if (!word) { renderStudyEmpty(); return; }
  $('#studyCompanion').style.display = '';
  $('#companionBubble').style.display = '';
  $('#studyEmpty').classList.remove('visible'); $('#wordCard').style.display = 'block';
  $('#wordCard').classList.remove('revealed'); $('#answerPanel').classList.remove('visible'); $('#ratingPanel').classList.remove('visible'); $('#revealBtn').style.display = '';
  const progress = getProgress(word.id);
  $('#wordTag').textContent = progress ? `REVIEW · 第 ${Math.max(1, progress.level)} 次` : 'NEW WORD';
  $('#phonetic').textContent = word.phonetic; $('#wordText').textContent = word.word; $('#wordPos').textContent = word.pos;
  $('#wordMeaning').textContent = word.meaning; $('#wordNote').textContent = word.note; $('#wordExample').textContent = word.example; $('#wordTranslation').textContent = word.translation;
  const nextLevel = Math.min((progress?.level || 0) + 1, INTERVALS.length - 1);
  $('#nextInterval').textContent = `${INTERVALS[nextLevel]} 天后`;
  $('#sessionCounter').textContent = `${sessionIndex + 1} / ${session.length}`;
  $('#sessionBar').style.width = `${sessionIndex / session.length * 100}%`;
  $('#companionBubble').textContent = '先猜一猜，再翻卡喵！';
}

function revealCard() {
  if (!session[sessionIndex] || $('#wordCard').classList.contains('revealed')) return;
  $('#wordCard').classList.add('revealed'); $('#answerPanel').classList.add('visible'); $('#ratingPanel').classList.add('visible');
  $('#companionBubble').textContent = '回忆一下，再诚实选择喵～';
}

function rateWord(rating) {
  const word = session[sessionIndex]; if (!word) return;
  const existing = getProgress(word.id);
  const wasNew = !existing;
  const progress = existing || {level: 0, due: Date.now(), correct: 0, lapses: 0, reviews: 0};
  progress.reviews++;
  if (rating === 'again') {
    progress.level = 0;
    progress.due = Date.now();
    progress.lapses++;
    session.push(word);
  }
  if (rating === 'fuzzy') { progress.level = Math.max(1, progress.level); progress.due = addDays(1); }
  if (rating === 'know') { progress.level = Math.min(progress.level + 1, INTERVALS.length - 1); progress.due = addDays(INTERVALS[progress.level]); progress.correct++; }
  progress.lastReviewed = Date.now(); state.progress[word.id] = progress; state.totalReviews++;
  const key = dateKey(); const activity = state.activity[key] || {count:0,reviews:0,newIds:[],completedIds:[]};
  activity.newIds ||= []; activity.completedIds ||= [];
  activity.reviews++;
  if (rating !== 'again' && !activity.completedIds.includes(word.id)) {
    activity.completedIds.push(word.id);
    activity.count++;
  }
  if (wasNew && !activity.newIds.includes(word.id)) activity.newIds.push(word.id);
  state.activity[key] = activity;
  saveState(); sessionAnswered++;
  $('#sessionBar').style.width = `${(sessionIndex + 1) / session.length * 100}%`;
  $('#companionBubble').textContent = rating === 'know' ? '漂亮！记忆又加固了一层！' : rating === 'fuzzy' ? '没关系，明天再熟悉一次～' : '忘记很正常，稍后再见它！';
  setTimeout(() => { sessionIndex++; renderAll(); renderStudyCard(); }, 360);
}

function renderStudyEmpty() {
  $('#wordCard').style.display = 'none'; $('#ratingPanel').classList.remove('visible'); $('#studyEmpty').classList.add('visible');
  $('#sessionCounter').textContent = session.length ? `${session.length} / ${session.length}` : '0 / 0'; $('#sessionBar').style.width = '100%';
  $('#studyCompanion').style.display = 'none'; $('#companionBubble').style.display = 'none';
}

function formatDue(progress) {
  if (!progress) return '还未开始';
  const diff = progress.due - Date.now();
  if (diff <= 0) return '现在复习';
  if (diff < DAY) return `${Math.max(1, Math.ceil(diff / 3600000))} 小时后`;
  return `${Math.ceil(diff / DAY)} 天后复习`;
}

function renderLibrary(reset = false) {
  if (reset) libraryVisible = 60;
  const query = $('#wordSearch')?.value.trim().toLowerCase() || '';
  const list = WORDS.filter(w => (activeFilter === 'all' || getStatus(w.id) === activeFilter) && (!query || `${w.word} ${w.meaning}`.toLowerCase().includes(query)));
  const visibleList = list.slice(0, libraryVisible);
  $('#libraryCount').textContent = list.length;
  $('#wordList').innerHTML = list.length ? visibleList.map(w => {
    const status = getStatus(w.id), progress = getProgress(w.id);
    const statusText = {new:'未学习', learning:'学习中', mastered:'已掌握'}[status];
    return `<article class="library-word"><div><h3>${escapeHTML(w.word)}<span class="lib-phonetic">${escapeHTML(w.phonetic)}</span></h3><p>${escapeHTML(w.pos)} ${escapeHTML(w.meaning)}</p></div><button class="lib-speak" data-speak="${escapeHTML(w.word)}" aria-label="朗读 ${escapeHTML(w.word)}"><svg><use href="#i-sound"/></svg></button><footer><span class="status-badge status-${status}">${statusText}</span><span class="next-due">${formatDue(progress)}</span></footer></article>`;
  }).join('') : '<div class="empty-list">没有找到匹配的单词，换个关键词试试喵～</div>';
  const loadMore = $('#loadMoreWords');
  const remaining = Math.max(0, list.length - visibleList.length);
  loadMore.hidden = remaining === 0;
  loadMore.textContent = `继续加载 ${Math.min(60, remaining)} 个（还剩 ${remaining.toLocaleString()} 个）`;
  $$('[data-speak]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speak)));
}

function renderStats() {
  const learned = learnedWords().length, mastered = WORDS.filter(w => getStatus(w.id) === 'mastered').length, learning = learned - mastered;
  $('#statLearned').textContent = learned; $('#statMastered').textContent = mastered; $('#statReviews').textContent = state.totalReviews; $('#statStreak').textContent = getStreak();
  const masteryPct = Math.round(mastered / WORDS.length * 100), learningPct = Math.round(learning / WORDS.length * 100);
  $('#donutPercent').textContent = `${masteryPct}%`; $('#masteryDonut').style.setProperty('--progress', `${masteryPct*3.6}deg`); $('#masteryDonut').style.setProperty('--learning-end', `${(masteryPct+learningPct)*3.6}deg`);
  $('#legendMastered').textContent = mastered; $('#legendLearning').textContent = learning; $('#legendNew').textContent = WORDS.length - learned;
  const days = Array.from({length:14}, (_,i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return {d, count: state.activity[dateKey(d)]?.count || 0}; });
  const max = Math.max(5, ...days.map(x=>x.count));
  $('#barChart').innerHTML = days.map(({d,count},i) => `<div class="bar-col ${i===13?'today':''}" title="${dateKey(d)}：${count} 个"><i style="height:${Math.max(2,count/max*175)}px"></i><span>${d.getMonth()+1}/${d.getDate()}</span></div>`).join('');
  const upcoming = learnedWords().sort((a,b) => getProgress(a.id).due - getProgress(b.id).due).slice(0,4);
  $('#scheduleList').innerHTML = upcoming.length ? upcoming.map(w => `<div class="schedule-item"><b>${w.word}</b><span>${formatDue(getProgress(w.id))} · 第 ${getProgress(w.id).level} 轮</span></div>`).join('') : '<p class="schedule-empty">学过的单词会按记忆曲线出现在这里。</p>';
}

function renderAll() { renderDashboard(); renderLibrary(); renderStats(); }

function switchView(name) {
  $$('.view').forEach(v => v.classList.toggle('active', v.dataset.viewPanel === name));
  $$('.side-nav .nav-item').forEach(v => v.classList.toggle('active', v.dataset.view === name));
  $('.main-content').classList.toggle('study-mode', name === 'study');
  $('.sidebar').classList.remove('open'); $('#mobileMenuBtn').setAttribute('aria-expanded','false');
  location.hash = name; window.scrollTo({top:0, behavior:'smooth'});
  if (name === 'library') renderLibrary(); if (name === 'stats') renderStats();
}

function initEvents() {
  $$('.nav-item[data-view]').forEach(btn => btn.addEventListener('click', () => btn.dataset.view === 'study' ? openStudy() : switchView(btn.dataset.view)));
  $$('[data-go]').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.go)));
  $('#startStudyBtn').addEventListener('click', openStudy); $('#revealBtn').addEventListener('click', revealCard);
  $('#speakBtn').addEventListener('click', () => session[sessionIndex] && speak(session[sessionIndex].word, .82));
  $('#exampleSpeakBtn').addEventListener('click', () => session[sessionIndex] && speak(session[sessionIndex].example, .82));
  $$('.rating').forEach(btn => btn.addEventListener('click', () => rateWord(btn.dataset.rating)));
  $('#wordSearch').addEventListener('input', () => renderLibrary(true));
  $('#loadMoreWords').addEventListener('click', () => { libraryVisible += 60; renderLibrary(); });
  $$('#filterChips button').forEach(btn => btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; $$('#filterChips button').forEach(b=>b.classList.toggle('active',b===btn)); renderLibrary(true); }));
  $('#mobileMenuBtn').addEventListener('click', () => { const open = $('.sidebar').classList.toggle('open'); $('#mobileMenuBtn').setAttribute('aria-expanded', String(open)); });
  $('#settingsBtn').addEventListener('click', () => { tempGoal = state.dailyGoal; $('#goalValue').textContent = tempGoal; $('#settingsDialog').showModal(); });
  $('#goalMinus').addEventListener('click', () => { tempGoal = Math.max(5, tempGoal - 5); $('#goalValue').textContent = tempGoal; });
  $('#goalPlus').addEventListener('click', () => { tempGoal = Math.min(50, tempGoal + 5); $('#goalValue').textContent = tempGoal; });
  $('#saveSettingsBtn').addEventListener('click', () => { state.dailyGoal = tempGoal; saveAndRefresh(); showToast('学习目标已保存'); });
  $('#resetBtn').addEventListener('click', () => { if (confirm('确定清空全部学习记录吗？这个操作无法撤销。')) { state = defaultState(); saveAndRefresh(); $('#settingsDialog').close(); showToast('学习记录已清空'); } });
  document.addEventListener('keydown', e => {
    if (!$('#studyView').classList.contains('active') || e.target.matches('input, button')) return;
    if (e.code === 'Space') { e.preventDefault(); revealCard(); }
    if ($('#ratingPanel').classList.contains('visible') && ['1','2','3'].includes(e.key)) rateWord({1:'again',2:'fuzzy',3:'know'}[e.key]);
  });
  window.addEventListener('hashchange', () => { const hash = location.hash.slice(1); if (['dashboard','library','stats'].includes(hash)) switchView(hash); });
}

function init() {
  setDailyCompanion(); setDailyBackgrounds(); initEvents(); renderAll();
  const hash = location.hash.slice(1); if (['library','stats'].includes(hash)) switchView(hash);
}

init();
