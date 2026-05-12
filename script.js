
// ВЕРСИЯ ИГРЫ — определяет доступный тариф
// free = только самостоятельно
// standard = базовый 100₽
// pro = углублённый 400₽
// vip = полный 800₽
var FORCED_PLAN = 'standard'; // тестовая версия — открыты Самостоятельно и Базовый // <-- меняется для каждой папки

// Защита от конфликта версий localStorage
(function() {
    try {
        var saved = localStorage.getItem('avatarGameState');
        if (saved) {
            var state = JSON.parse(saved);
            var CURRENT_VERSION = '2.0';
            if (!state.version || state.version !== CURRENT_VERSION) {
                localStorage.removeItem('avatarGameState');
                console.log('Сброс старого сохранения — версия обновилась');
            }
        }
    } catch(e) {
        localStorage.removeItem('avatarGameState');
    }
})();

const MAX_GRAVITONS = 10;
const MIN_GRAVITONS = -10;
const COOLDOWN_MINUTES = 5;

const FOLDER_MAP = {
    1: { 1:"1. Телесность", 2:"2. Бытийность", 3:"3. Чувственность", 4:"4. Ментальность", 5:"5. Реальность", 6:"6. Действительность", 7:"7. Духовность" },
    2: { 1:"1. Прошлое", 2:"2. Иллюзии", 3:"3. Настоящее", 4:"4. Вечность", 5:"5. Время перемен", 6:"6. Будущее", 7:"7. Твое время" },
    3: { 1:"1. Жизнь", 2:"2. Присутствие", 3:"3. Реализация", 4:"4. Любовь", 5:"5. Вера", 6:"6. Благодарность", 7:"7. Наслаждение" },
    4: { 1:"1. Иные миры", 2:"2. Иные времена", 3:"3. Другой Я", 4:"4. Другие измерения", 5:"5. Иллюзия", 6:"6. Бездна", 7:"7. Волшебство" },
    5: { 1:"1. АВАТАРЫ", 2:"3. Крылья", 3:"2. Благословения", 4:null }
};

const CARD_RANGES = {
    "1. СОЗНАНИЕ/1. Телесность":[58,97],
    "1. СОЗНАНИЕ/2. Бытийность":[1,40],
    "1. СОЗНАНИЕ/3. Чувственность":[39,78],
    "1. СОЗНАНИЕ/4. Ментальность":[20,59],
    "1. СОЗНАНИЕ/5. Реальность":[39,78],
    "1. СОЗНАНИЕ/6. Действительность":[20,59],
    "1. СОЗНАНИЕ/7. Духовность":[1,40],
    "1. СОЗНАНИЕ":[1,40],
    "3. ВРЕМЯ/1. Прошлое":[48,87],
    "3. ВРЕМЯ/2. Иллюзии":[1,40],
    "3. ВРЕМЯ/3. Настоящее":[29,68],
    "3. ВРЕМЯ/4. Вечность":[67,106],
    "3. ВРЕМЯ/5. Время перемен":[1,40],
    "3. ВРЕМЯ/6. Будущее":[1,40],
    "3. ВРЕМЯ/7. Твое время":[20,59],
    "2. ЭНЕРГИИ/1. Жизнь":[1,15],
    "2. ЭНЕРГИИ/2. Присутствие":[1,15],
    "2. ЭНЕРГИИ/3. Реализация":[1,15],
    "2. ЭНЕРГИИ/4. Любовь":[1,15],
    "2. ЭНЕРГИИ/5. Вера":[1,15],
    "2. ЭНЕРГИИ/6. Благодарность":[1,15],
    "2. ЭНЕРГИИ/7. Наслаждение":[1,15],
    "4. МНОГОМЕРНОСТЬ/1. Иные миры":[40,58],
    "4. МНОГОМЕРНОСТЬ/2. Иные времена":[21,39],
    "4. МНОГОМЕРНОСТЬ/3. Другой Я":[1,20],
    "4. МНОГОМЕРНОСТЬ/4. Другие измерения":[39,57],
    "4. МНОГОМЕРНОСТЬ/5. Иллюзия":[1,19],
    "4. МНОГОМЕРНОСТЬ/6. Бездна":[20,38],
    "4. МНОГОМЕРНОСТЬ/7. Волшебство":[1,19],
    "5. АВАТАРЫ и ТОТЕМЫ/1. АВАТАРЫ":[1,24],
    "5. АВАТАРЫ и ТОТЕМЫ/2. Благословения":[1,19],
    "5. АВАТАРЫ и ТОТЕМЫ/3. Крылья":[1,25],
    "5. АВАТАРЫ и ТОТЕМЫ":[1,24],
    "Сияние":[2,16]
};

const FIELD_CONFIG = {
    1:{ name:"Эволюция Сознания", folder:"1. СОЗНАНИЕ", bg:"field-1.jpg", gravitonType:"phys" },
    2:{ name:"Портал Времени", folder:"3. ВРЕМЯ", bg:"field-2.jpg", gravitonType:"emot" },
    3:{ name:"Энергия Творения", folder:"2. ЭНЕРГИИ", bg:"field-3.jpg", gravitonType:"emot" },
    4:{ name:"Многомерность", folder:"4. МНОГОМЕРНОСТЬ", bg:"field-4.jpg", gravitonType:"ment" },
    5:{ name:"Аватары", folder:"5. АВАТАРЫ и ТОТЕМЫ", bg:"field-5.jpg", gravitonType:"phys" },
    6:{ name:"СИЯНИЕ (БОНУС)", folder:"Сияние", bg:"field-shining.jpg", isBonus:true, gravitonType:"phys" }
};

var CENTER_ANIM = {
    phys: {
        symbol:"⚡", color:"#38bdf8", name:"Физический центр", sub:"Центр Тела и Действия",
        variants:[
            {title:"Центр Воли открыт!", desc:"Ваша физическая сила обрела новое измерение. Тело — не инструмент, а живой партнёр. Вы почувствовали это."},
            {title:"Энергия воплощения!", desc:"Физический центр активирован. Теперь ваши намерения обретают силу действия. Вы готовы воплощать."},
            {title:"Тело — Храм!", desc:"Вы вернули связь с телом. Каждый шаг теперь осознанный. Каждое движение — намеренное."}
        ]
    },
    emot: {
        symbol:"💧", color:"#a78bfa", name:"Эмоциональный центр", sub:"Центр Чувств и Связи",
        variants:[
            {title:"Центр Сердца открыт!", desc:"Ваш эмоциональный мир стал живым источником мудрости. Чувства — не слабость. Это ваш компас."},
            {title:"Поток любви!", desc:"Эмоциональный центр активирован. Вы разрешили себе чувствовать — полностью, без осуждения."},
            {title:"Глубина раскрылась!", desc:"Вы прикоснулись к своей эмоциональной глубине. Отныне ваши чувства ведут вас, а не управляют вами."}
        ]
    },
    ment: {
        symbol:"🧠", color:"#34d399", name:"Ментальный центр", sub:"Центр Разума и Творения",
        variants:[
            {title:"Центр Разума открыт!", desc:"Ваш ум обрёл ясность. Мысли стали инструментом созидания, а не клеткой ограничений."},
            {title:"Сознание расширяется!", desc:"Ментальный центр активирован. Вы видите больше, понимаете глубже, создаёте смелее."},
            {title:"Мудрость пробудилась!", desc:"Вы открыли доступ к своей внутренней мудрости. Разум теперь служит вашей душе."}
        ]
    }
};

let gameState = {
    gravitons:{ phys:0, emot:0, ment:0 },
    currentField:1, currentCell:0,
    tasks:{}, history:[],
    gameStarted:false, gameCompleted:false,
    pendingGravitonType:null,
    taskCompletedThisTurn:false,
    centerCooldown:{ active:false, lastFailTime:0 },
    userRequest:"",
    guideEnabled:false,
    guidePlan:'standard',
    guideMsgsUsed:{},
    centersUnlocked:{ phys:false, emot:false, ment:false },
    aiDialogs:[]
};

function shuffleArray(arr) {
    var a=arr.slice();
    for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}
    return a;
}
function rollD6(){ return Math.floor(Math.random()*6)+1; }
function rollD8(){ return Math.floor(Math.random()*8)+1; }
function isOdd(n){ return n%2!==0; }
function allCentersGathered(){
    return gameState.gravitons.phys>=MAX_GRAVITONS &&
           gameState.gravitons.emot>=MAX_GRAVITONS &&
           gameState.gravitons.ment>=MAX_GRAVITONS;
}
function allCentersUnlocked(){
    return gameState.centersUnlocked.phys && gameState.centersUnlocked.emot && gameState.centersUnlocked.ment;
}

function saveGame(){ localStorage.setItem('avatarStage3Save',JSON.stringify(gameState)); }
function loadGame(){
    var s=localStorage.getItem('avatarStage3Save'); if(!s) return;
    try{
        var d=JSON.parse(s);
        gameState.tasks                =d.tasks                ||{};
        gameState.history              =d.history              ||[];
        gameState.gravitons            =d.gravitons            ||{phys:0,emot:0,ment:0};
        gameState.currentField         =d.currentField         ||1;
        gameState.currentCell          =d.currentCell          ||0;
        gameState.gameStarted          =d.gameStarted          ||false;
        gameState.gameCompleted        =d.gameCompleted        ||false;
        gameState.userRequest          =d.userRequest          ||"";
        gameState.centersUnlocked      =d.centersUnlocked      ||{phys:false,emot:false,ment:false};
        gameState.guideEnabled         =d.guideEnabled         ||false;
        gameState.guidePlan            =d.guidePlan            ||'standard';
        gameState.guideMsgsUsed        =d.guideMsgsUsed        ||{};
        gameState.taskCompletedThisTurn=d.taskCompletedThisTurn||false;
        gameState.centerCooldown       =d.centerCooldown       ||{active:false,lastFailTime:0};
        gameState.pendingGravitonType  =d.pendingGravitonType  ||null;
        gameState.aiDialogs            =d.aiDialogs            ||[];
    }catch(e){ console.error(e); }
}

function openModal(id){ var el=document.getElementById(id); if(el) el.classList.add('active'); }
window.closeModal=function(id){
    var el=document.getElementById(id); if(el) el.classList.remove('active');
    if(id==='ai-modal' && window._currentAiDialog && window._currentAiDialog.messages.length>0){
        if(!gameState.aiDialogs) gameState.aiDialogs=[];
        gameState.aiDialogs.push(window._currentAiDialog);
        window._currentAiDialog=null;
        saveGame();
    }
    if(id==='zoom-modal'){
        var zi=document.getElementById('zoom-img-el'); if(zi) zi.style.display='block';
        var zt=document.getElementById('zoom-text-content'); if(zt) zt.style.display='none';
    }
};

function showMessage(title,text,callback,extra){
    document.getElementById('msg-title').textContent=title;
    document.getElementById('msg-text').innerHTML=text;
    var btns=document.getElementById('msg-buttons'); btns.innerHTML='';
    var ok=document.createElement('button');
    ok.className='btn-gold'; ok.textContent='OK'; ok.style.flex='1';
    ok.onclick=function(){ closeModal('message-modal'); if(callback) callback(); };
    btns.appendChild(ok);
    if(extra&&extra.length){ extra.forEach(function(cfg){
        var b=document.createElement('button');
        b.className=cfg.className||'btn-secondary'; b.textContent=cfg.text; b.style.flex='1';
        b.onclick=function(){ closeModal('message-modal'); if(cfg.onClick) cfg.onClick(); };
        btns.appendChild(b);
    }); }
    openModal('message-modal');
}

function showScreen(id){
    document.querySelectorAll('.view').forEach(function(el){ el.classList.remove('active'); });
    var t=document.getElementById('view-'+id); if(t) t.classList.add('active');
    document.getElementById('controls').style.display=(id==='full-board'||id==='current-field')?'block':'none';
}

window.onload=function(){
    loadGame();
    if(gameState.gameCompleted){ showScreen('start'); }
    else if(gameState.gameStarted){ showScreen('full-board'); updateGravitonsUI(); updateMainButton(); showCurrentRequest(); }
    else{ showScreen('start'); }
    window.initPlanUI();
};

function showCurrentRequest(){
    var d=document.getElementById('current-request-display');
    var t=document.getElementById('request-text');
    if(gameState.userRequest){ t.textContent=gameState.userRequest; d.style.display='block'; }
    else { d.style.display='none'; }
}

window.editRequest=function(){
    document.getElementById('request-input').value=gameState.userRequest;
    showScreen('start'); closeModal('task-modal'); closeModal('message-modal');
};

window.selectPlan=function(plan){
    var planData=GUIDE_PLANS[plan];
    if(!planData||!planData.active) return;
    // Блокируем тарифы выше доступного для этой версии
    var ORDER = ['free','standard','pro','vip'];
    var allowedIdx = ORDER.indexOf(FORCED_PLAN);
    var selectedIdx = ORDER.indexOf(plan);
    if(selectedIdx > allowedIdx) {
        showMessage('🔒 Недоступно в тестовой версии',
            'Углублённый и полный форматы будут доступны после запуска игры.<br><br>Если хотите попробовать — напишите нам через кнопку «Записаться».',
            null);
        return;
    }
    gameState.guidePlan=plan;
    gameState.guideEnabled=(plan!=='free');
    saveGame();
    ['free','standard','pro','vip'].forEach(function(p){
        var el=document.getElementById('plan-'+p);
        if(el) el.classList.remove('plan-selected');
    });
    var sel=document.getElementById('plan-'+plan);
    if(sel) sel.classList.add('plan-selected');
};

window.initPlanUI=function(){
    // Применяем FORCED_PLAN — принудительно устанавливаем тариф версии
    if(FORCED_PLAN && FORCED_PLAN !== 'free') {
        gameState.guidePlan = FORCED_PLAN;
        gameState.guideEnabled = true;
        saveGame();
    }
    var plan=gameState.guidePlan||'free';
    ['free','standard','pro','vip'].forEach(function(p){
        var el=document.getElementById('plan-'+p);
        if(!el) return;
        el.classList.remove('plan-selected');
        var planData=GUIDE_PLANS[p];
        if(planData && !planData.active){
            el.style.opacity='0.45';
            el.style.cursor='not-allowed';
            el.style.filter='grayscale(0.5)';
            if(!el.querySelector('.plan-soon')){
                var badge=document.createElement('span');
                badge.className='plan-soon';
                badge.textContent='Скоро';
                badge.style.cssText='font-size:0.7rem;color:#64748b;border:1px solid #334155;border-radius:8px;padding:2px 8px;margin-left:auto;font-family:sans-serif;';
                el.querySelector('div').appendChild(badge);
            }
        } else {
            el.style.opacity='';
            el.style.cursor='pointer';
            el.style.filter='';
        }
    });
    var sel=document.getElementById('plan-'+plan);
    if(sel) sel.classList.add('plan-selected');
};

window.toggleGuide=function(){};
window.toggleGuideInfo=function(){
    var info=document.getElementById('guide-info');
    if(info) info.style.display=info.style.display==='none'?'block':'none';
};

window.openMeditation = function() {
    openModal('meditation-modal');
    var audio = document.getElementById('meditation-audio');
    if (audio) audio.play().catch(function(){});
};
window.closeMeditation = function() {
    var audio = document.getElementById('meditation-audio');
    if (audio) { audio.pause(); audio.currentTime = 0; }
    closeModal('meditation-modal');
};

window.enterGame=function(){
    var val=document.getElementById('request-input').value.trim();
    if(!val){ showMessage("Внимание","Сначала напишите ваш запрос!"); return; }
    gameState.userRequest=val;
    showMessage("Проверка входа","Бросаем кубик...",function(){
        var r=rollD6();
        if(isOdd(r)){ showMessage("Путь открыт!","Выпало <b>"+r+"</b> (Нечёт). Добро пожаловать!",function(){ startNewGameSession(); }); }
        else{ showMessage("Путь закрыт","Выпало <b>"+r+"</b> (Чёт). Попробуйте снова.",null,[
            {text:"Попробовать снова", className:"btn-gold", onClick:function(){ window.enterGame(); }},
            {text:"Изменить запрос", className:"btn-secondary", onClick:function(){ window.editRequest(); }}
        ]); }
    });
};

function startNewGameSession(){
    var req=gameState.userRequest;
    var req_plan=gameState.guidePlan||'free';
    var req_guide=(req_plan!=='free');
    gameState={gravitons:{phys:0,emot:0,ment:0},currentField:1,currentCell:0,
        tasks:{},history:[],gameStarted:true,gameCompleted:false,guideEnabled:req_guide,guidePlan:req_plan,guideMsgsUsed:{},
        pendingGravitonType:null,taskCompletedThisTurn:false,
        centerCooldown:{active:false,lastFailTime:0},
        userRequest:req,centersUnlocked:{phys:false,emot:false,ment:false}};
    saveGame(); updateGravitonsUI(); showScreen('full-board'); updateMainButton(); showCurrentRequest();
    document.getElementById('status-text').textContent="Нажмите «Бросить кубики».";
}

window.resetGame=function(){
    var plan = gameState.guidePlan || 'free';
    var isPaid = (plan === 'standard' || plan === 'pro' || plan === 'vip');

    if (isPaid) {
        // Первое предупреждение для платных тарифов
        showMessage(
            "⚠️ Внимание",
            "Вы играете на платном тарифе.<br><br>" +
            "Если вы начнёте заново — ваша игра полностью обнулится. " +
            "Текущая ссылка перестанет работать и для продолжения потребуется получить новую платную ссылку.<br><br>" +
            "<b>Вы уверены что хотите начать заново?</b>",
            null,
            [
                {
                    text: "Да, начать заново",
                    className: "btn-secondary",
                    onClick: function() {
                        // Второе подтверждение
                        showMessage(
                            "Последнее подтверждение",
                            "Это действие нельзя отменить.<br><br>" +
                            "Весь прогресс, все ответы и диалоги с Проводником будут удалены безвозвратно.<br><br>" +
                            "Продолжить?",
                            null,
                            [
                                {
                                    text: "Да, удалить всё",
                                    className: "btn-secondary",
                                    onClick: function() {
                                        localStorage.clear();
                                        location.reload();
                                    }
                                },
                                {
                                    text: "Нет, остаться в игре",
                                    className: "btn-gold",
                                    onClick: function() {}
                                }
                            ]
                        );
                    }
                },
                {
                    text: "Нет, продолжить игру",
                    className: "btn-gold",
                    onClick: function() {}
                }
            ]
        );
    } else {
        // Для бесплатных тарифов — простое подтверждение
        showMessage(
            "Новая игра",
            "Начать заново? Весь прогресс будет сброшен.",
            function() { localStorage.clear(); location.reload(); },
            [
                {
                    text: "Отмена",
                    className: "btn-secondary",
                    onClick: function() {}
                }
            ]
        );
    }
};

window.completeGame=function(){
    gameState.gameCompleted=true; saveGame();
    var hasGuide = gameState.guideEnabled && (gameState.aiDialogs||[]).length > 0;
    var extraBtn = hasGuide ? [{
        text: '✨ Получить анализ пути',
        className: 'btn-gold',
        onClick: function(){ window.generateFinalAnalysis(); }
    }] : [];
    showMessage(
        "🌟 Вы — Аватар Творца!",
        "Все три центра созидания открыты. Ваш путь завершён.<br><br>"
        + (hasGuide ? "<span style='color:#a78bfa;'>Проводник готов создать для вас личный анализ этого путешествия — документ, который можно сохранить.</span><br><br>" : "")
        + "Начать новую игру?",
        function(){ localStorage.clear(); location.reload(); },
        extraBtn
    );
};

function updateMainButton(){
    var btn=document.getElementById('btn-roll-dice');
    if(allCentersUnlocked()){ btn.textContent="ПОБЕДА!"; btn.onclick=function(){ window.completeGame(); }; }
    else if(allCentersGathered()&&gameState.gameStarted){
        if(!gameState.taskCompletedThisTurn){
            btn.textContent="Бросить кубики";
            btn.onclick=function(){ window.rollDice(); };
        } else {
            btn.textContent="Открыть Центр Творца";
            btn.onclick=function(){ openAllCentersFlow(); };
        }
    }
    else{ btn.textContent="Бросить кубики"; btn.onclick=function(){ window.rollDice(); }; }
    btn.style.display='block';
}

window.rollDice=function(){
    var d6=rollD6(), d8=rollD8(), newField, newCell, attempts=0;
    do{
        d6=rollD6(); d8=rollD8();
        if(d8===8){ newField=6; newCell=1; }
        else{ newField=(d6===6)?Math.floor(Math.random()*5)+1:d6; newCell=d8; }
        if(newField===5 && newCell>4){ newCell=Math.floor(Math.random()*4)+1; }
        attempts++;
    }while(attempts<10 && newField===gameState.currentField && newCell===gameState.currentCell);
    gameState.taskCompletedThisTurn=false;
    aiHistoryByTurn = {}; // Сброс истории диалогов при новом ходу
    gameState.currentField=newField; gameState.currentCell=newCell;
    document.getElementById('dice-display').textContent="Поле: "+newField+" | Клетка: "+newCell;
    saveGame();
    setTimeout(function(){ selectField(gameState.currentField,gameState.currentCell); },400);
};

function selectField(fieldId,cellId){
    gameState.currentField=fieldId; gameState.currentCell=cellId;
    var cfg=FIELD_CONFIG[fieldId];
    document.getElementById('current-field-title').textContent=cfg.name;
    var key=fieldId+"_"+cellId;
    if(!gameState.history.some(function(h){ return (h.field+"_"+h.cell)===key; })){
        gameState.history.unshift({field:fieldId,cell:cellId,fieldName:cfg.name,time:new Date().toLocaleTimeString()});
    }
    var bgImg=document.getElementById('field-bg-img'), ph=document.getElementById('field-bg-placeholder');
    bgImg.style.display='none'; ph.style.display='flex';
    var img=new Image(); img.src=cfg.bg;
    img.onload=function(){ bgImg.src=cfg.bg; bgImg.style.display='block'; ph.style.display='none'; };
    showScreen('current-field'); renderCells(fieldId,cellId);
    document.getElementById('btn-roll-dice').style.display='none';
    document.getElementById('status-text').textContent="Нажмите на активную клетку для задания.";
    // FIX: бонусное поле — сначала показываем "коробку подарок", потом задание
    if(cfg.isBonus){
        showMessage(
            '🎁 Вселенная дарит вам подарок!',
            '<div style="text-align:center;margin:10px 0;">' +
            '<img src="field-shining.jpg" style="max-width:100%;max-height:220px;border-radius:12px;border:2px solid #fbbf24;box-shadow:0 0 20px #fbbf2466;">' +
            '</div>' +
            '<div style="color:#e2e8f0;margin-top:12px;">Вы попали в поле Сияния.<br>Откройте карточку — Вселенная приготовила для вас послание.</div>',
            function(){ openTask(1); }
        );
    }
    saveGame();
}

function renderCells(fieldId,activeCell){
    var left=document.getElementById('cells-left'), right=document.getElementById('cells-right');
    left.innerHTML=''; right.innerHTML='';
    var cellCount = (fieldId===5) ? 4 : (fieldId===6 ? 1 : 7);
    var field5Names = {1:'1. Аватары и Тотемы', 2:'2. Крылья', 3:'3. Благословения', 4:'4. Золотой Гид'};
    for(var i=1;i<=cellCount;i++){
        var btn=document.createElement('button'); btn.className='cell-btn';
        btn.textContent = (fieldId===5) ? field5Names[i] : ("Клетка "+i);
        if(fieldId===6){
            btn.style.display='none';
        } else if(i===activeCell||activeCell===8){
            btn.classList.add('active');
            (function(n){ btn.onclick=function(){ openTask(n); }; })(i);
        } else {
            btn.classList.add('locked');
            btn.disabled=true;
        }
        (fieldId===5 ? (i<=2?left:right) : (i<=3?left:right)).appendChild(btn);
    }
}

function buildDeckButtons(fieldId) {
    var area = document.getElementById('deck-buttons-area');
    if (!area) return;
    area.innerHTML = '';
    var configs = (fieldId === 5) ? [] : [{type:'meta', label:'🎴 Мета-карта'}];
    configs.forEach(function(c){
        var btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = c.label;
        btn.onclick = (function(t){ return function(){ openDeckInTask(t); }; })(c.type);
        area.appendChild(btn);
    });
}

window.openTask=function(cellId){
    var cfg=FIELD_CONFIG[gameState.currentField];
    document.getElementById('deck-title').textContent="Выберите колоду слева";
    document.getElementById('deck-content').innerHTML='<div style="grid-column:1/-1;text-align:center;color:#64748b;margin-top:50px;">Нажмите на кнопку колоды.</div>';
    document.getElementById('task-img').style.display='none';
    document.getElementById('zoom-task-btn').style.display='none';
    var ta=document.getElementById('task-answer');
    ta.value=''; ta.style.borderColor=''; ta.placeholder='Напишите ваш ответ, чтобы продолжить...';
    var saveBtn=document.getElementById('save-task-btn');
    if(saveBtn){ saveBtn.disabled=true; saveBtn.style.opacity='0.4'; saveBtn.style.cursor='not-allowed'; }
    var mc=document.querySelector('.task-modal-content');
    mc.classList.remove('split-view'); mc.classList.add('single-view');
    buildDeckButtons(gameState.currentField);
    var aiBtn=document.getElementById('ask-ai-btn');
    var planHasGuide=gameState.guidePlan&&gameState.guidePlan!=='free';
    if(aiBtn) aiBtn.style.display=planHasGuide?'block':'none';
    document.querySelectorAll('.action-btn').forEach(function(b){ b.disabled=false; });
    openModal('task-modal');
    loadTaskImage(cellId,cfg);
};

var FIELD_INTROS = {
    1: { field: "Эволюция Сознания", prefix: "Вы на ступени" },
    2: { field: "Портал Времени",    prefix: "Вы вошли в" },
    3: { field: "Энергия Творения",  prefix: "Вы в поле энергии" },
    4: { field: "Многомерность",     prefix: "Вы попали в" },
    5: { field: "Аватары",           prefix: null }
};

var CELL_NAMES = {
    1: { 1:"Телесность", 2:"Чувственность", 3:"Ментальность", 4:"Бытийность", 5:"Реальность", 6:"Действительность", 7:"Духовность" },
    2: { 1:"Прошлое", 2:"Иллюзии", 3:"Настоящее", 4:"Вечность", 5:"Время Перемен", 6:"Будущее", 7:"Твоё Время" },
    3: { 1:"Жизни", 2:"Присутствия", 3:"Реализации", 4:"Любви", 5:"Веры", 6:"Благодарности", 7:"Наслаждения" },
    4: { 1:"Иные Миры", 2:"Иные Времена", 3:"Другой Я", 4:"Другие Измерения", 5:"Иллюзию", 6:"Бездну", 7:"Волшебство" },
    5: { 1:"Аватары и Тотемы", 2:"Крылья", 3:"Благословения", 4:"Золотой Гид" }
};

var AVATAR_HEADERS = {
    1: "Вам пришла помощь от Вселенной в образе Аватара или Тотема.\n\nПосмотрите на карточку. Это существо — не случайность. Это ваша внутренняя сила, которую Вселенная предлагает активировать прямо сейчас.\n\nПочувствуйте эту силу в теле — она уже есть в вас. Как вы можете включить её в своём запросе?",
    2: "Вам даны Крылья.\n\nПосмотрите на образ и примерьте их — буквально. Расправьте плечи. Почувствуйте за спиной эту энергию — она реальна, если позволить себе её ощутить.\n\nПобудьте в этих крыльях одну минуту — дышите, чувствуйте. Как эта энергия поднимает вас к вашему запросу?",
    3: "Вы получаете Благословение.\n\nПрочитайте текст карточки как медитацию — медленно, вслух или про себя. Позвольте каждому слову дойти до тела, не только до ума.\n\nПримите это благословение полностью — без «но», без сомнений. Просто примите.\n\nЧто меняется в вас, когда вы это принимаете?",
    4: "Внутри вас живёт фигура, которая знает ваш истинный путь к реализации запроса. Это не ум, это не страх — это ваша глубинная безусловная любовь.\n\nВозможно, вы знакомы с ней, возможно — ещё нет. Но это та часть в вашем подсознании, которая видит больше и видит дальше. Она — ваш Золотой Гид. Она — ваша глубинная мудрость. Она — ваш проводник на пути реализации.\n\nА теперь...\n\nЗакройте глаза. Сделайте три вдоха. Позвольте проявиться этой части — в любом образе, в любой форме.\n\nКак она выглядит? Что она хочет сказать вам прямо сейчас — о вашем запросе, о ваших способностях, о вашем пути?"
};

// FIX: текст для поля 6 (Сияние) — не зависит от CARDS
var SIYANIE_TEXTS = [
    "Вселенная открывает окно возможностей.\n\nЭтот момент — не случайность. Что-то важное внутри вас сдвинулось, и мироздание откликнулось.\n\nВытяните Мета-карту — она подскажет, какая энергия сейчас работает на вас.\n\nЧто вы чувствуете прямо сейчас?",
    "Сияние — это отклик Вселенной на вашу внутреннюю работу.\n\nВы заслужили этот дар своей честностью и глубиной.\n\nВытяните Мета-карту. Позвольте образу говорить с вами.\n\nКакое послание вы получаете?",
    "В этом пространстве время замедляется.\n\nВселенная дарит вам знак — возможность увидеть то, что обычно скрыто.\n\nВытяните Мета-карту и побудьте с образом несколько минут.\n\nЧто открывается вам сейчас?",
    "Вы вошли в поле Сияния.\n\nЭто редкий подарок — момент, когда внутреннее и внешнее совпадают.\n\nВытяните Мета-карту. Доверьтесь первому образу.\n\nКак это связано с вашим запросом?",
    "Сияние приходит тогда, когда вы готовы.\n\nВаше путешествие привело вас именно сюда — в точку, где возможно всё.\n\nВытяните Мета-карту и задайте ей свой запрос мысленно.\n\nЧто она отражает в вас?"
];

function getTaskHeader(fieldId, cellId) {
    var intro = FIELD_INTROS[fieldId];
    var cellNames = CELL_NAMES[fieldId];
    if (!intro || !cellNames) return null;
    var cellName = cellNames[cellId] || ("Клетка " + cellId);
    if (!intro.prefix) return null;
    return intro.prefix + " «" + cellName + "»";
}

function loadTaskImage(cellId,cfg){
    var taskImg=document.getElementById('task-img'), zoomBtn=document.getElementById('zoom-task-btn');
    var taskText=document.getElementById('task-card-text');
    var tf=cfg.folder;
    var sf=FOLDER_MAP[gameState.currentField]&&FOLDER_MAP[gameState.currentField][cellId];
    if(sf) tf=cfg.folder+"/"+sf;
    var mn=1,mx=50,rk=sf?(cfg.folder+"/"+sf):cfg.folder;
    if(CARD_RANGES[rk]){ mn=CARD_RANGES[rk][0]; mx=CARD_RANGES[rk][1]; }
    var num=Math.floor(Math.random()*(mx-mn+1))+mn;
    var taskHeader = getTaskHeader(gameState.currentField, cellId);
    if(gameState.currentField===5){
        var f5names={1:'1. Аватары и Тотемы',2:'2. Крылья',3:'3. Благословения',4:'4. Золотой Гид'};
        taskHeader = f5names[cellId] || ('Клетка '+cellId);
    }
    document.getElementById('task-title').textContent = taskHeader || ('Клетка ' + cellId);
    taskImg.style.display='none'; zoomBtn.style.display='none';
    if(taskText) taskText.style.display='none';
    taskImg.dataset.cardText='';

    // FIX: Поле 5 — аватары с кнопкой увеличения и fallback при ненайденной картинке
    if(gameState.currentField===5){
        var avatarFolders={1:'5. АВАТАРЫ и ТОТЕМЫ/1. АВАТАРЫ', 2:'5. АВАТАРЫ и ТОТЕМЫ/3. Крылья', 3:'5. АВАТАРЫ и ТОТЕМЫ/2. Благословения', 4:null};
        var avatarRanges={1:[1,18], 2:[1,24], 3:[1,19], 4:[1,18]};
        var avatarIntro = AVATAR_HEADERS[cellId] || '';
        if(taskText && avatarIntro){
            var html=avatarIntro.split('\n').map(function(p){
                return p.trim()?'<p style="margin-bottom:14px;line-height:1.75;">'+p+'</p>':'';
            }).join('');
            taskText.innerHTML=html;
            taskText.style.display='block';
        }
        var aFolder=avatarFolders[cellId];
        if(aFolder){
            var aRange=avatarRanges[cellId]||[1,24];
            var EXTS_A=['.jpg','.JPG','.jpeg','.JPEG','.png','.PNG'];
            zoomBtn.onclick=function(){ window.zoomTaskImage(); };
            // Перебираем все номера в случайном порядке — показываем первый найденный
            var allNums=[];
            for(var nn=aRange[0];nn<=aRange[1];nn++) allNums.push(nn);
            allNums=shuffleArray(allNums);
            var numIdx=0, extIdx=0, avatarFound=false;
            function tryNextAvatar(){
                if(avatarFound) return;
                if(numIdx>=allNums.length) return; // ни одна не нашлась — молчим
                var aNum=allNums[numIdx];
                if(extIdx>=EXTS_A.length){ numIdx++; extIdx=0; tryNextAvatar(); return; }
                var src=encodeURI(aFolder+'/'+aNum+EXTS_A[extIdx]);
                var testImg=new Image();
                testImg.onload=function(){
                    avatarFound=true;
                    taskImg.src=src;
                    taskImg.style.display='block';
                    zoomBtn.style.display='block';
                };
                testImg.onerror=function(){ extIdx++; tryNextAvatar(); };
                testImg.src=src;
            }
            tryNextAvatar();
        }
        return;
    }

    // Поле 6 — Сияние: показываем текст из CARDS['Сияние'] (база заданий из cards.js)
    if(gameState.currentField===6){
        document.getElementById('task-title').textContent = '✨ Сияние';
        var siText = SIYANIE_TEXTS[Math.floor(Math.random()*SIYANIE_TEXTS.length)];
        // Берём текст из cards.js если он загружен
        try{
            if(typeof CARDS!=='undefined' && CARDS['Сияние']){
                var siKeys = Object.keys(CARDS['Сияние']).filter(function(k){ return parseInt(k)>=2; });
                if(siKeys.length>0){
                    var siKey = siKeys[Math.floor(Math.random()*siKeys.length)];
                    siText = CARDS['Сияние'][siKey];
                }
            }
        }catch(e){}
        if(taskText){
            var siHtml=siText.split('\n').map(function(p){
                return p.trim()?'<p style="margin-bottom:14px;line-height:1.75;">'+p+'</p>':'';
            }).join('');
            taskText.innerHTML=siHtml;
            taskText.style.display='block';
            taskImg.dataset.cardText=siText;
        }
        zoomBtn.style.display='block';
        zoomBtn.onclick=function(){ zoomTextCard(siText); };
        var saveBtn=document.getElementById('save-task-btn');
        if(saveBtn){ saveBtn.disabled=false; saveBtn.style.opacity='1'; saveBtn.style.cursor='pointer'; }
        return;
    }

    var textContent=null;
    try{
        if(typeof CARDS!=='undefined'&&CARDS[cfg.folder]){
            var sub=sf&&CARDS[cfg.folder][sf];
            if(sub&&sub[num]) textContent=sub[num];
            else if(!sf&&CARDS[cfg.folder][num]) textContent=CARDS[cfg.folder][num];
        }
    }catch(e){}

    if(textContent&&taskText){
        var html=textContent.split('\n').map(function(p){
            return p.trim()?'<p style="margin-bottom:14px;line-height:1.75;">'+p+'</p>':'';
        }).join('');
        taskText.innerHTML=html;
        taskText.style.display='block';
        taskImg.dataset.cardText=textContent;
        zoomBtn.style.display='block';
        zoomBtn.onclick=function(){ zoomTextCard(textContent); };
    } else {
        zoomBtn.onclick = function(){ window.zoomTaskImage(); };
        var exts=['.jpg','.JPG','.jpeg','.JPEG','.png','.PNG'],loaded=false;
        function tryLoad(i){
            if(i>=exts.length||loaded) return;
            taskImg.src=encodeURI(tf+"/"+num+exts[i]);
            taskImg.onload=function(){ loaded=true; taskImg.style.display='block'; zoomBtn.style.display='block'; };
            taskImg.onerror=function(){ tryLoad(i+1); };
        }
        tryLoad(0);
    }
}

window.zoomTextCard=function(text){
    var el=document.getElementById('zoom-img-el');
    var zm=document.getElementById('zoom-modal');
    el.style.display='none';
    var zt=document.getElementById('zoom-text-content');
    if(!zt){
        zt=document.createElement('div');
        zt.id='zoom-text-content';
        zt.style.cssText='max-width:700px;width:92%;background:#0f172a;border:2px solid rgba(251,191,36,0.6);border-radius:16px;padding:36px 40px;color:#e2e8f0;font-size:1.15rem;line-height:1.8;text-align:left;max-height:82vh;overflow-y:auto;box-shadow:0 0 40px rgba(251,191,36,0.15);';
        zm.appendChild(zt);
    }
    zt.innerHTML=text.split('\n').map(function(p){
        return p.trim()?'<p style="margin-bottom:16px;">'+p+'</p>':'';
    }).join('');
    zt.style.display='block';
    openModal('zoom-modal');
};

window.zoomTaskImage=function(){
    var ti=document.getElementById('task-img');
    if(ti&&ti.src){ document.getElementById('zoom-img-el').src=ti.src; openModal('zoom-modal'); }
};
window.zoomDeckCard=function(src){ if(!src) return; document.getElementById('zoom-img-el').src=src; openModal('zoom-modal'); };
window.closeTaskModal=function(){ closeModal('task-modal'); };
window.saveTaskAndClose=function(){ saveTask(); };
window.checkAnswerBtn=function(){
    var ta=document.getElementById('task-answer');
    var btn=document.getElementById('save-task-btn');
    if(!btn) return;
    // Поле 6 — кнопка всегда активна
    if(gameState.currentField===6){ btn.disabled=false; btn.style.opacity='1'; btn.style.cursor='pointer'; return; }
    var hasText=ta&&ta.value.trim().length>0;
    btn.disabled=!hasText;
    btn.style.opacity=hasText?'1':'0.4';
    btn.style.cursor=hasText?'pointer':'not-allowed';
};

function rollBonusGravitons(){
    var roll=rollD6();
    var bonus = roll<=2?2:roll<=4?3:4;
    var types=['phys','emot','ment'];
    var names={phys:'Физический',emot:'Эмоциональный',ment:'Ментальный'};
    var remaining=bonus;
    var msgParts=[];
    types.forEach(function(t){
        if(remaining<=0) return;
        if(gameState.centersUnlocked[t]||gameState.gravitons[t]>=10) return;
        var canAdd=Math.min(remaining, 10-gameState.gravitons[t]);
        gameState.gravitons[t]+=canAdd;
        remaining-=canAdd;
        msgParts.push('<b>+'+canAdd+'</b> → '+names[t]+' ('+gameState.gravitons[t]+'/10)');
    });
    updateGravitonsUI(); saveGame();
    var msg='🎁 Выпало <b>'+roll+'</b> — бонус <b>+'+bonus+' гравитона</b>!<br><br>'+msgParts.join('<br>');
    var anyReady=types.some(function(t){ return gameState.gravitons[t]>=10&&!gameState.centersUnlocked[t]; });
    if(anyReady){
        showMessage('Бонус Сияния!',msg+'<br><br>✨ Центр готов к открытию!',function(){ returnToFullBoard(); updateMainButton(); });
    } else {
        showMessage('Бонус Сияния!',msg,function(){ returnToFullBoard(); });
    }
}

window.saveTask=function(){
    var answer=document.getElementById('task-answer').value.trim();
    if(gameState.currentField===6){
        gameState.tasks['6_1']={field:6,cell:1,answer:answer||'Бонус',date:new Date().toLocaleString(),fieldName:'Сияние (Бонус)'};
        saveGame();
        closeModal('task-modal');
        var _bt=['phys','emot','ment'];
        var _bn={phys:'Физический',emot:'Эмоциональный',ment:'Ментальный'};
        var _bMin=999, _bType=null;
        _bt.forEach(function(t){
            if(!gameState.centersUnlocked[t]&&gameState.gravitons[t]<10&&gameState.gravitons[t]<_bMin){
                _bMin=gameState.gravitons[t]; _bType=t;
            }
        });
        if(_bType){
            var _bAdd=Math.min(3,10-gameState.gravitons[_bType]);
            gameState.gravitons[_bType]+=_bAdd;
            updateGravitonsUI(); saveGame();
            var _bReady=_bt.some(function(t){ return gameState.gravitons[t]>=10&&!gameState.centersUnlocked[t]; });
            var _bMsg='Вселенная добавила <b>+'+_bAdd+'</b> гравитона → '+_bn[_bType]+' ('+gameState.gravitons[_bType]+'/10)';
            if(_bReady){
                showMessage('✨ Бонус Сияния!',_bMsg+'<br><br>✨ Центр готов к открытию!',function(){ updateMainButton(); returnToFullBoard(); });
            } else {
                showMessage('✨ Бонус Сияния!',_bMsg,function(){ returnToFullBoard(); });
            }
        } else {
            returnToFullBoard();
        }
        return;
    }
    var cfg=FIELD_CONFIG[gameState.currentField];
    var key=gameState.currentField+"_"+gameState.currentCell;
    var ti=document.getElementById('task-img');
    var cardSrc=(ti&&ti.style.display!=='none')?ti.src:'';
    var cardText=(ti&&ti.dataset.cardText)||'';
    gameState.tasks[key]={
        field:gameState.currentField, cell:gameState.currentCell,
        answer:answer, cardImageSrc:cardSrc, cardText:cardText,
        date:new Date().toLocaleString(), fieldName:cfg.name
    };
    gameState.pendingGravitonType=cfg.gravitonType||'phys';
    gameState.taskCompletedThisTurn=true;
    saveGame(); closeModal('task-modal'); showGravitonRollModal();
};

function showGravitonRollModal(){
    var names={phys:'Физический',emot:'Эмоциональный',ment:'Ментальный'};
    var type=gameState.pendingGravitonType;
    // FIX: если центр уже на 10 — пропускаем бросок, сразу к открытию
    if(gameState.gravitons[type]>=MAX_GRAVITONS && !gameState.centersUnlocked[type]){
        showMessage("Центр готов!","Гравитоны уже на максимуме!<br>Бросьте кубик на открытие центра.",
            function(){ openSingleCenterFlow(type); });
        var ok=document.querySelector('#message-modal .btn-gold'); if(ok) ok.textContent='Открыть центр';
        return;
    }
    showMessage("Бросок на гравитоны",
        "Бросьте кубик для центра <b>"+names[type]+"</b>:<br><br>1–2 = −1 &nbsp; 3–4 = +1 &nbsp; 5–6 = +2",
        function(){ rollGravitonDice(); }
    );
    var ok=document.querySelector('#message-modal .btn-gold'); if(ok) ok.textContent='Бросить';
}

// FIX: гравитоны от -10 до +10; если уже 10 — заморожены
function rollGravitonDice(){
    var roll=rollD6(), change=0;
    var isBonus=FIELD_CONFIG[gameState.currentField]&&FIELD_CONFIG[gameState.currentField].isBonus;
    if(isBonus){
        if(roll<=2) change=1; else if(roll<=4) change=2; else change=3;
    } else {
        if(roll<=2) change=-1; else if(roll<=4) change=1; else change=2;
    }
    var type=gameState.pendingGravitonType;
    // FIX: если центр уже на максимуме — не меняем значение
    if(gameState.gravitons[type]>=MAX_GRAVITONS && !gameState.centersUnlocked[type]){
        openSingleCenterFlow(type);
        return;
    }
    gameState.gravitons[type]=Math.min(MAX_GRAVITONS, Math.max(MIN_GRAVITONS, gameState.gravitons[type]+change));
    updateGravitonsUI(); saveGame();
    var cur=gameState.gravitons[type];
    var txt="Выпало <b>"+roll+"</b>. Гравитоны: <b>"+(change>=0?"+":"")+change+"</b>. Итого: <b>"+cur+"</b>";
    if(cur>=MAX_GRAVITONS&&!gameState.centersUnlocked[type]){
        showMessage("Центр готов!",txt+"<br><br>Набрано 10 гравитонов! Бросьте кубик на открытие центра.",
            function(){ openSingleCenterFlow(type); });
        var ok=document.querySelector('#message-modal .btn-gold'); if(ok) ok.textContent='Открыть центр';
    } else {
        showMessage("Результат: "+roll, txt, function(){ returnToFullBoard(); });
    }
}

function returnToFullBoard(){ gameState.currentCell=0; saveGame(); showScreen('full-board'); updateMainButton(); }

function updateGravitonsUI(){
    var map={phys:'g-phys',emot:'g-emot',ment:'g-ment'};
    var pmap={phys:'grav-phys',emot:'grav-emot',ment:'grav-ment'};
    Object.keys(map).forEach(function(type){
        var el=document.getElementById(map[type]);
        var par=document.getElementById(pmap[type]);
        if(el) el.textContent=gameState.gravitons[type];
        if(par){
            par.classList.remove('graviton-glow','center-unlocked');
            if(gameState.centersUnlocked[type]) par.classList.add('center-unlocked');
            else if(gameState.gravitons[type]>=MAX_GRAVITONS) par.classList.add('graviton-glow');
        }
    });
}

function openSingleCenterFlow(ct){
    var names={phys:'Физический',emot:'Эмоциональный',ment:'Ментальный'};
    showMessage("Открытие центра","Бросьте кубик для центра <b>"+names[ct]+"</b>.<br>Нечётное — центр открывается!",
        function(){ rollSingleCenterDice(ct); });
    var ok=document.querySelector('#message-modal .btn-gold'); if(ok) ok.textContent='Бросить';
}

// FIX: убран window.confirm — заменён на showMessage с кнопками
function rollSingleCenterDice(ct){
    var roll=rollD6();
    if(isOdd(roll)){
        gameState.centersUnlocked[ct]=true; saveGame(); updateGravitonsUI();
        if(allCentersUnlocked()){
            showVictoryAnimation(function(){ window.completeGame(); });
        } else {
            showCenterOpenAnimation(ct, function(){ returnToFullBoard(); });
        }
    } else {
        gameState.taskCompletedThisTurn=false; saveGame();
        var guideOffer = gameState.guideEnabled
            ? '<br><br><span style="color:#a78bfa;font-size:0.9rem;">💡 Гид может помочь разобраться — почему центр не открывается</span>'
            : '';
        showMessage(
            "Центр не открылся",
            "Выпало <b>"+roll+"</b> (чёт). Следующая попытка — после следующего задания."+guideOffer,
            function(){ returnToFullBoard(); }
        );
    }
}

function openAllCentersFlow(){
    var order=['phys','emot','ment'];
    for(var i=0;i<order.length;i++){
        var ct=order[i];
        if(!gameState.centersUnlocked[ct]&&gameState.gravitons[ct]>=MAX_GRAVITONS){
            openSingleCenterFlow(ct);
            return;
        }
    }
}

window.tryOpenCenter=function(ct){
    if(!gameState.gameStarted||gameState.gameCompleted) return;
    if(gameState.centersUnlocked[ct]){ showMessage("Уже открыт","Этот центр уже открыт!"); return; }
    if(gameState.gravitons[ct]<MAX_GRAVITONS){
        showMessage("Недостаточно","Нужно ещё <b>"+(MAX_GRAVITONS-gameState.gravitons[ct])+"</b> гравитонов."); return;
    }
    if(!gameState.taskCompletedThisTurn){ showMessage("Подождите","Сначала выполните задание на этом ходу."); return; }
    openSingleCenterFlow(ct);
};

function showCenterOpenAnimation(centerType,callback){
    var cfg=CENTER_ANIM[centerType];
    var v=cfg.variants[Math.floor(Math.random()*cfg.variants.length)];
    var modal=document.getElementById('center-open-modal');
    var content=document.getElementById('center-open-content');
    var c=cfg.color;
    content.innerHTML=
        '<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:20px;padding:40px 30px;border:3px solid '+c+';box-shadow:0 0 60px '+c+'55;animation:canim 0.7s ease-out;">'+
        '<div style="width:110px;height:110px;border-radius:50%;border:4px solid '+c+';display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 0 30px '+c+'88;animation:canim 0.5s ease-out 0.2s both;">'+
        '<span style="font-size:52px;">'+cfg.symbol+'</span></div>'+
        '<div style="font-size:1.7rem;font-weight:bold;color:'+c+';margin-bottom:10px;animation:fup 0.5s ease-out 0.4s both;">'+v.title+'</div>'+
        '<div style="font-size:0.95rem;color:#94a3b8;margin-bottom:16px;animation:fup 0.5s ease-out 0.55s both;">'+cfg.name+' · '+cfg.sub+'</div>'+
        '<div style="font-size:1rem;color:#e2e8f0;line-height:1.7;margin-bottom:28px;animation:fup 0.5s ease-out 0.7s both;">'+v.desc+'</div>'+
        '<button onclick="closeCenterAnim()" class="btn-gold" style="min-width:200px;font-size:1rem;animation:fup 0.5s ease-out 0.85s both;">✨ Продолжить</button></div>';
    modal.classList.add('active');
    window._centerCb=callback||null;
}
window.closeCenterAnim=function(){
    document.getElementById('center-open-modal').classList.remove('active');
    if(window._centerCb){ window._centerCb(); window._centerCb=null; }
};

// FIX: яркая победная анимация
function showVictoryAnimation(callback){
    var modal=document.getElementById('victory-modal');
    var content=document.getElementById('victory-content');
    content.innerHTML=
        '<div style="background:linear-gradient(160deg,#06001a 0%,#130040 40%,#0a0030 70%,#06001a 100%);border-radius:20px;padding:32px 24px;max-width:480px;margin:0 auto;animation:canim 0.8s ease-out;">'+

        // Верхний блок
        '<div style="text-align:center;margin-bottom:28px;">'+
        '<div style="position:relative;width:110px;height:110px;border-radius:50%;background:rgba(251,191,36,0.08);border:2.5px solid rgba(251,191,36,0.5);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;animation:fup 0.6s ease-out 0.2s both;">'+
        '<span style="font-size:52px;">🌟</span>'+
        '</div>'+
        '<div style="font-size:26px;font-weight:800;color:#fff8e7;letter-spacing:1px;margin-bottom:6px;animation:fup 0.6s ease-out 0.35s both;">ВЫ — АВАТАР ТВОРЦА</div>'+
        '<div style="width:80px;height:2px;background:linear-gradient(90deg,transparent,#fbbf24,transparent);margin:14px auto;animation:fup 0.6s ease-out 0.45s both;"></div>'+
        '<div style="font-size:12px;color:#d97706;letter-spacing:2px;font-weight:600;animation:fup 0.6s ease-out 0.5s both;">ВСЕ ТРИ ЦЕНТРА СОЗИДАНИЯ ОТКРЫТЫ</div>'+
        '</div>'+

        // Карточки центров
        '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">'+

        '<div style="display:flex;align-items:center;gap:14px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:14px 16px;animation:fup 0.5s ease-out 0.6s both;">'+
        '<span style="font-size:32px;width:44px;text-align:center;flex-shrink:0;">⚡</span>'+
        '<div style="flex:1;">'+
        '<div style="font-size:14px;font-weight:700;color:#38bdf8;margin-bottom:3px;">Физический центр <span style="display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:6px;background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);">ОТКРЫТ</span></div>'+
        '<div style="font-size:12px;color:#94a3b8;line-height:1.5;">Тело стало партнёром, а не инструментом.<br>Вы готовы воплощать намерения в действие.</div>'+
        '</div></div>'+

        '<div style="display:flex;align-items:center;gap:14px;background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.3);border-radius:12px;padding:14px 16px;animation:fup 0.5s ease-out 0.75s both;">'+
        '<span style="font-size:32px;width:44px;text-align:center;flex-shrink:0;">💧</span>'+
        '<div style="flex:1;">'+
        '<div style="font-size:14px;font-weight:700;color:#a78bfa;margin-bottom:3px;">Эмоциональный центр <span style="display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:6px;background:rgba(167,139,250,0.15);color:#a78bfa;border:1px solid rgba(167,139,250,0.3);">ОТКРЫТ</span></div>'+
        '<div style="font-size:12px;color:#94a3b8;line-height:1.5;">Чувства стали компасом, а не клеткой.<br>Вы разрешили себе чувствовать полностью.</div>'+
        '</div></div>'+

        '<div style="display:flex;align-items:center;gap:14px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.3);border-radius:12px;padding:14px 16px;animation:fup 0.5s ease-out 0.9s both;">'+
        '<span style="font-size:32px;width:44px;text-align:center;flex-shrink:0;">🧠</span>'+
        '<div style="flex:1;">'+
        '<div style="font-size:14px;font-weight:700;color:#34d399;margin-bottom:3px;">Ментальный центр <span style="display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;margin-left:6px;background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);">ОТКРЫТ</span></div>'+
        '<div style="font-size:12px;color:#94a3b8;line-height:1.5;">Разум служит душе, а не управляет ею.<br>Мысли стали инструментом созидания.</div>'+
        '</div></div>'+

        '</div>'+

        // Финальная цитата
        '<div style="font-size:14px;color:#e2e8f0;line-height:1.75;text-align:center;margin-bottom:24px;animation:fup 0.6s ease-out 1s both;">'+
        'Пять пространств пройдены. Три центра открыты.<br>'+
        '<span style="color:#fbbf24;font-weight:700;">Ваш запрос был услышан.<br>Вы — Творец своей реальности.</span>'+
        '</div>'+

        // Кнопка
        '<button onclick="closeVictoryAnim()" style="width:100%;padding:16px;border-radius:50px;border:none;background:linear-gradient(90deg,#fbbf24,#f59e0b);color:#000;font-size:16px;font-weight:800;cursor:pointer;letter-spacing:0.5px;animation:fup 0.6s ease-out 1.1s both;">🎊 Завершить игру</button>'+

        '</div>';
    modal.classList.add('active');
    window._victoryCb=callback||null;
}
window.closeVictoryAnim=function(){
    document.getElementById('victory-modal').classList.remove('active');
    if(window._victoryCb){ window._victoryCb(); window._victoryCb=null; }
};

window.openDeckInTask=function(deckType){
    var content=document.getElementById('deck-content'), title=document.getElementById('deck-title');
    var mc=document.querySelector('.task-modal-content');
    mc.classList.remove('single-view'); mc.classList.add('split-view');
    document.querySelectorAll('.action-btn').forEach(function(btn){
        var active=(
            (deckType==='meta'      && btn.textContent.includes('Мета'))    ||
            (deckType==='blessings' && btn.textContent.includes('Благослов'))||
            (deckType==='wings'     && btn.textContent.includes('Крыл'))    ||
            (deckType==='avatars'   && btn.textContent.includes('Аватар'))  ||
            (deckType==='totems'    && btn.textContent.includes('Тотем'))   ||
            (deckType==='shining'   && btn.textContent.includes('Сияни'))
        );
        btn.disabled=!active;
    });
    var cfgs={
        meta:      {folder:"deck",prefix:"MK",range:[1,35],name:"Метафорические карты"},
        blessings: {folder:"5. АВАТАРЫ и ТОТЕМЫ/2. Благословения",range:[1,19],name:"Благословения"},
        wings:     {folder:"5. АВАТАРЫ и ТОТЕМЫ/3. Крылья",range:[1,25],name:"Крылья"},
        avatars:   {folder:"5. АВАТАРЫ и ТОТЕМЫ/1. АВАТАРЫ",range:[1,24],name:"Аватары"},
        totems:    {folder:"5. АВАТАРЫ и ТОТЕМЫ",range:[1,24],name:"Тотемы"},
        shining:   {folder:"Сияние",range:[2,28],name:"Сияние"}
    };
    var dcfg=cfgs[deckType]; if(!dcfg) return;
    title.textContent=dcfg.name;
    content.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#cbd5e1;">Загрузка...</div>';
    var mn=dcfg.range[0], mx=dcfg.range[1];
    var nums=shuffleArray(Array.from({length:mx-mn+1},function(_,i){return i+mn;}));
    content.innerHTML='';
    var cardOpened=false;
    var EXTS=['.jpg','.JPG','.jpeg','.JPEG','.png','.PNG'];
    nums.forEach(function(num){
        var card=document.createElement('div'); card.className='deck-card';
        var back=document.createElement('div'); back.className='card-back'; back.innerHTML='<span>🎴</span>';
        var fi=document.createElement('img');
        fi.style.cssText='width:100%;height:100%;object-fit:cover;display:none;position:absolute;top:0;left:0;border-radius:6px;';
        var zb=document.createElement('button'); zb.innerHTML='🔍';
        zb.style.cssText='display:none;position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,0.6);border:none;color:white;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:14px;z-index:5;';
        var imgOk=false, fsrc='', ei=0;
        var pfx=dcfg.prefix||'';
        function tryExt(){
            if(ei>=EXTS.length) return;
            var path=dcfg.folder+"/"+pfx+num+EXTS[ei];
            fi.src=encodeURI(path);
            fi.onload=function(){ imgOk=true; fsrc=encodeURI(path); };
            fi.onerror=function(){ ei++; tryExt(); };
        }
        tryExt();
        zb.onclick=function(e){ e.stopPropagation(); if(imgOk&&fsrc) window.zoomDeckCard(fsrc); };
        card.onclick=function(){
            if(cardOpened||card.classList.contains('flipped')||!imgOk) return;
            card.classList.add('flipped'); cardOpened=true;
            back.style.display='none'; fi.style.display='block'; zb.style.display='block';
            content.querySelectorAll('.deck-card').forEach(function(c){ if(c!==card) c.classList.add('locked'); });
            document.querySelectorAll('.action-btn').forEach(function(b){ b.disabled=true; });
        };
        card.appendChild(back); card.appendChild(fi); card.appendChild(zb);
        content.appendChild(card);
    });
};

window.openHistory=function(){
    var c=document.getElementById('history-content');
    var dialogs=gameState.aiDialogs||[];
    if(dialogs.length===0){
        c.innerHTML='<p style="color:#94a3b8;text-align:center;padding:20px;">Диалогов с Гидом пока нет.<br><small>Диалоги сохраняются автоматически после каждого общения с Проводником.</small></p>';
    } else {
        c.innerHTML=dialogs.map(function(d,i){
            var preview=d.messages&&d.messages.length>0 ? d.messages[0].content.replace(/<[^>]+>/g,'').slice(0,80)+'...' : '(пустой диалог)';
            var msgs=d.messages&&d.messages.length>0 ? d.messages.map(function(m){
                var isAi=m.role==='assistant';
                return '<div style="margin-bottom:12px;display:flex;'+(isAi?'':'justify-content:flex-end')+'">'
                    +'<div style="max-width:85%;padding:10px 14px;border-radius:12px;'
                    +(isAi?'background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.3);color:#e2e8f0;':'background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.3);color:#fef3c7;')
                    +'">'+(isAi?'<small style="color:#a78bfa;font-size:0.75rem;display:block;margin-bottom:4px;">🌟 Проводник</small>':'<small style="color:#fbbf24;font-size:0.75rem;display:block;margin-bottom:4px;">Вы</small>')
                    +m.content.replace(/<[^>]+>/g,'')+'</div></div>';
            }).join('') : '';
            return '<div class="history-dialog-item" style="background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.2);border-radius:10px;margin-bottom:10px;overflow:hidden;">'
                +'<div onclick="toggleHistoryDialog('+i+')" style="padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:10px;">'
                +'<span id="hd-arrow-'+i+'" style="color:#fbbf24;transition:transform 0.2s;">▶</span>'
                +'<div style="flex:1;">'
                +'<div style="font-weight:bold;color:#fbbf24;font-size:0.9rem;">'+d.fieldName+' · Клетка '+d.cell+'</div>'
                +'<div style="color:#94a3b8;font-size:0.78rem;margin-top:2px;">'+d.date+' · '+Math.floor(d.messages.length/2)+' обмен(а)</div>'
                +'<div style="color:#cbd5e1;font-size:0.82rem;margin-top:4px;font-style:italic;">'+preview+'</div>'
                +'</div></div>'
                +'<div id="hd-body-'+i+'" style="display:none;padding:0 16px 14px;">'
                +'<div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;">'+msgs+'</div>'
                +'</div></div>';
        }).join('');
    }
    openModal('history-modal');
};
window.toggleHistoryDialog=function(i){
    var body=document.getElementById('hd-body-'+i);
    var arrow=document.getElementById('hd-arrow-'+i);
    if(!body) return;
    var open=body.style.display==='block';
    body.style.display=open?'none':'block';
    if(arrow) arrow.style.transform=open?'':'rotate(90deg)';
};

window.openTasksList=function(){
    var c=document.getElementById('tasks-content');
    var list=Object.values(gameState.tasks);
    if(list.length===0){ c.innerHTML='<p style="color:#94a3b8;">Заданий пока нет</p>'; openModal('tasks-modal'); return; }
    c.innerHTML=list.map(function(t,i){
        var imgH='';
        if(t.cardText){
            var paras=t.cardText.split('\n').filter(function(p){return p.trim();})
                .map(function(p){return '<p style="margin:0 0 8px;font-size:0.9rem;color:#e2e8f0;">'+p+'</p>';}).join('');
            imgH='<div style="background:#0f172a;border-radius:8px;padding:14px;margin:10px 0;border:1px solid rgba(251,191,36,0.3);">'+paras+'</div>';
        } else if(t.cardImageSrc){
            imgH='<div style="text-align:center;margin:10px 0;"><img src="'+t.cardImageSrc+'" style="max-width:100%;max-height:220px;border-radius:8px;border:1px solid #fbbf24;cursor:pointer;" onclick="document.getElementById(\'zoom-img-el\').src=this.src;openModal(\'zoom-modal\');" onerror="this.style.display=\'none\'"></div>';
        } else {
            imgH='<div style="color:#475569;font-size:0.85rem;margin:8px 0;font-style:italic;">Карточка не сохранена</div>';
        }
        var ansH=t.answer
            ?'<div style="margin-top:6px;padding:8px 10px;background:#0f172a;border-radius:6px;color:#e2e8f0;font-size:0.9rem;line-height:1.5;">'+t.answer+'</div>'
            :'<div style="margin-top:4px;color:#475569;font-size:0.85rem;font-style:italic;">Ответ не записан</div>';
        return '<div style="background:rgba(251,191,36,0.08);padding:15px;border-radius:10px;margin-bottom:12px;border:1px solid rgba(251,191,36,0.2);">'
            +'<div style="font-weight:bold;color:#fbbf24;margin-bottom:4px;">#'+(i+1)+' '+t.fieldName+' → Клетка '+t.cell+'</div>'
            +'<small style="color:#64748b;">'+t.date+'</small>'
            +imgH
            +'<div style="font-size:0.8rem;color:#94a3b8;margin-top:8px;">✏️ Ваш ответ:</div>'
            +ansH+'</div>';
    }).join('');
    openModal('tasks-modal');
};

var aiHistory = [];
var aiMessageCount = 0;
var aiHistoryByTurn = {}; // История диалогов по ключу хода

var GUIDE_PLANS = {
    free:     {label:'Самостоятельно',             msgs:0,   price:0,   active:true},
    standard: {label:'С Проводником · базовый',   msgs:3,   price:0,   active:true},
    pro:      {label:'С Проводником · углублённый', msgs:10, price:400, active:true},
    vip:      {label:'С Проводником · полный',     msgs:20,  price:800, active:true}
};
function getGuideLimit(){
    var plan=GUIDE_PLANS[gameState.guidePlan];
    if(!plan) return 3;
    return plan.msgs;
}
function getTurnKey(){ return gameState.currentField+'_'+gameState.currentCell; }
function getMsgsUsed(){ return gameState.guideMsgsUsed[getTurnKey()]||0; }
function addMsgUsed(){
    var k=getTurnKey();
    gameState.guideMsgsUsed[k]=(gameState.guideMsgsUsed[k]||0)+1;
    saveGame();
}

window.openAiDialogWithContext = function(extraContext) {
    if(!gameState.guideEnabled) return;
    aiHistory = [];
    aiMessageCount = getMsgsUsed();
    var limit = getGuideLimit();
    if(aiMessageCount >= limit){ showMessage('Лимит','Лимит сообщений Проводника на этом ходу исчерпан.'); return; }
    var msgs = document.getElementById('ai-messages');
    msgs.innerHTML = '';
    var request = gameState.userRequest||'';
    var fieldName = FIELD_CONFIG[gameState.currentField]?FIELD_CONFIG[gameState.currentField].name:'';
    var systemPrompt = 'ВАЖНО: Всегда отвечай ТОЛЬКО на русском языке.\n\nТы — Гид. Мягкий, мудрый помощник в трансформационной игре «Аватар Творца».\n\n'+
        'Запрос игрока: «'+request+'»\n'+
        'Текущее поле: '+fieldName+'\n'+
        'Ситуация: Игрок пытался открыть центр созидания, но кубик выпал чётным — центр не открылся.\n'+
        (extraContext?'Вопрос игрока: '+extraContext+'\n':'') +
        '\nЗадай один мягкий вопрос — что внутри может мешать движению вперёд? Без давления, с теплом.'+
        '\nИногда ненавязчиво упомяни что автор игры проводит личные сессии.';
    window._aiSystemPrompt = systemPrompt;
    var counter=document.getElementById('ai-msg-counter');
    var limit2=getGuideLimit();
    if(counter){ counter.textContent='Осталось сообщений: '+(limit2-aiMessageCount); counter.style.color='#64748b'; }
    var inp=document.getElementById('ai-input'); if(inp){ inp.disabled=false; inp.placeholder='Напишите ваш ответ или вопрос...'; }
    var sendBtn=document.getElementById('ai-send-btn'); if(sendBtn) sendBtn.disabled=false;
    openModal('ai-modal');
    aiAddMsg('ai','');
    var loadingDiv=document.getElementById('ai-messages').lastChild;
    loadingDiv.innerHTML='<span style="color:#64748b;font-style:italic;">Настраиваю связь...</span>';
    callAI([{role:'user',content:extraContext||'Центр не открылся.'}], systemPrompt, function(text){
        loadingDiv.innerHTML=text;
        aiHistory.push({role:'assistant',content:text});
    });
};

window.openAiDialog = function() {
    var turnKey = getTurnKey();
    // Восстанавливаем историю если диалог на этом ходу уже был
    aiHistory = aiHistoryByTurn[turnKey] ? aiHistoryByTurn[turnKey].slice() : [];
    aiMessageCount = getMsgsUsed();
    var limit = getGuideLimit();
    if(limit === 0){ return; }
    if(limit !== -1 && aiMessageCount >= limit){
        showMessage('Лимит исчерпан','На этом ходу вы уже использовали все '+limit+' сообщений Гида.<br>Продолжите на следующем ходу.');
        return;
    }
    var msgs = document.getElementById('ai-messages');
    msgs.innerHTML = '';
    var request = gameState.userRequest || '';
    var taskText = document.getElementById('task-card-text');
    var cardContent = (taskText && taskText.style.display !== 'none') ? taskText.innerText.trim() : '';
    var taskImg = document.getElementById('task-img');
    if (!cardContent && taskImg && taskImg.style.display !== 'none') { cardContent = '[Карточка с изображением]'; }
    var playerAnswer = (document.getElementById('task-answer') || {}).value || '';
    var fieldName = FIELD_CONFIG[gameState.currentField] ? FIELD_CONFIG[gameState.currentField].name : '';
    var extraCtx = window._aiExtraContext || ''; window._aiExtraContext = '';
    var systemPrompt = 'ВАЖНО: Всегда отвечай ТОЛЬКО на русском языке, независимо от языка вопроса.\n\nТы — Проводник. Мягкий, мудрый помощник в трансформационной игре «Аватар Творца». Автор игры — Юния Бурэ (женщина). НИКОГДА не упоминай никаких других имён как автора игры — только Юния Бурэ. Если хочешь направить игрока к автору — пиши только «Юния Бурэ» и только через Telegram-бот в игре (кнопка «Записаться»). Твоя роль — сопровождать игрока в его путешествии к реализации запроса. Ты не терапевт и не даёшь диагнозов. Ты не давишь на болевые точки. Ты задаёшь мягкие, открытые вопросы, которые помогают игроку увидеть себя яснее — через любопытство, а не через боль. Иногда ты предлагаешь короткую медитативную технику или упражнение на осознанность.\n\n' +
        'Запрос игрока: «' + request + '»\n' +
        'Текущее поле: ' + fieldName + '\n' +
        (cardContent ? 'Задание карточки: ' + cardContent + '\n' : '') +
        (playerAnswer ? 'Ответ игрока: ' + playerAnswer + '\n' : '') +
        (extraCtx ? '\nДОПОЛНИТЕЛЬНЫЙ КОНТЕКСТ: ' + extraCtx + '\n' : '') +
        (function(){
            var hist=''; var tasks=Object.values(gameState.tasks||{});
            if(tasks.length>0){ hist+='\nИстория ответов игрока в этой игре:\n'; tasks.slice(-5).forEach(function(t,i){ if(t.answer) hist+=(i+1)+'. ['+t.fieldName+'] '+t.answer+'\n'; }); }
            return hist?'\nКОНТЕКСТ: '+hist:'';
        })() +
        '\nСтиль общения: тёплый, без клише, не поучительный. Говори как мудрый друг, а не как эксперт. Не задавай несколько вопросов подряд — только один. Не начинай ответ с «Я вижу», «Это важно» и подобных фраз. ' +
        '\nВажно: иногда (не чаще раза за сессию, ненавязчиво) можешь мягко упомянуть что автор игры проводит личные сессии — если человек хочет более глубокой работы со своим запросом. Никогда не дави и не продавай — только как нежное приглашение. ' +
        'Говори на русском языке. Не давай советов напрямую — только вопросы и мягкие отражения. ' +
        'Первый твой ответ — это один открывающий вопрос, связанный с карточкой и запросом игрока.';
    window._aiSystemPrompt = systemPrompt;
    window._currentAiDialog = { fieldName: fieldName, cell: gameState.currentCell, date: new Date().toLocaleString('ru'), messages: [] };
    var counter = document.getElementById('ai-msg-counter');
    var limit2 = getGuideLimit();
    if (counter) {
        counter.textContent = limit2===-1 ? 'Без ограничений ∞' : 'Осталось сообщений: ' + (limit2 - aiMessageCount);
        counter.style.color = limit2===-1 ? '#a78bfa' : '#64748b';
    }
    var inp = document.getElementById('ai-input');
    if (inp) { inp.disabled = false; inp.placeholder = 'Напишите ваш ответ или вопрос...'; }
    var sendBtn = document.getElementById('ai-send-btn');
    if (sendBtn) sendBtn.disabled = false;
    openModal('ai-modal');
    aiAddMsg('ai', '');
    var loadingDiv = document.getElementById('ai-messages').lastChild;
    loadingDiv.innerHTML = '<span style="color:#64748b;font-style:italic;">Настраиваю связь...</span>';
    callAI([], systemPrompt, function(text) {
        loadingDiv.innerHTML = text;
        aiHistory.push({role: 'assistant', content: text});
        if(window._currentAiDialog) window._currentAiDialog.messages.push({role:'assistant',content:text});
    });
};

window.sendToAi = function() {
    var input = document.getElementById('ai-input');
    var text = input.value.trim();
    if (!text) return;
    var limit = getGuideLimit();
    if (limit !== -1 && aiMessageCount >= limit) {
        input.placeholder = 'Лимит сообщений на этом ходу исчерпан';
        input.disabled = true;
        return;
    }
    aiMessageCount++;
    addMsgUsed();
    input.value = '';
    var counter = document.getElementById('ai-msg-counter');
    if (counter) {
        var limit3 = getGuideLimit();
        var left = limit3===-1 ? 999 : limit3 - aiMessageCount;
        counter.textContent = limit3===-1 ? 'Без ограничений ∞' : 'Осталось сообщений: ' + left;
        counter.style.color = limit3===-1 ? '#a78bfa' : (left <= 2 ? '#ef4444' : '#64748b');
        if (limit3 !== -1 && left <= 0) {
            input.disabled = true;
            input.placeholder = 'Лимит исчерпан. Продолжите после следующего хода.';
            document.getElementById('ai-send-btn').disabled = true;
        }
    }
    aiAddMsg('user', text);
    aiHistory.push({role: 'user', content: text});
    if(window._currentAiDialog) window._currentAiDialog.messages.push({role:'user',content:text});
    var isLastMsg = (getGuideLimit()!==-1 && (getGuideLimit()-aiMessageCount)<=1);
    var promptToUse = window._aiSystemPrompt;
    if(isLastMsg) promptToUse += '\n\nКОНТЕКСТ ДЛЯ ЭТОГО ОТВЕТА: у игрока закончился лимит сообщений на этом ходу. После твоего ответа поле ввода заблокируется — игрок физически не сможет тебе ответить. Поэтому если ты закончишь вопросом — он останется висеть без ответа, и это создаст ощущение незавершённости и разочарования. Построй свой ответ так, чтобы он давал завершение: подведи итог того что обсудили, дай наблюдение или инсайт. Тон тёплый, как финальная точка в разговоре. Не вопрос — а то, с чем человек уходит думать до следующего хода.';
    document.getElementById('ai-typing').style.display = 'block';
    aiAddMsg('ai', '');
    var loadingDiv = document.getElementById('ai-messages').lastChild;
    loadingDiv.innerHTML = '<span style="color:#64748b;font-style:italic;">Размышляю...</span>';
    callAI(aiHistory, promptToUse, function(text) {
        document.getElementById('ai-typing').style.display = 'none';
        loadingDiv.innerHTML = text;
        loadingDiv.innerHTML = text;
        // Если это последнее сообщение — перефразируем вопрос в наблюдение
        var limit4 = getGuideLimit();
        var leftNow = limit4 === -1 ? 999 : limit4 - aiMessageCount;
        if (leftNow <= 0) { finalizeLastMessage(text, loadingDiv); }
        aiHistory.push({role: 'assistant', content: text});
        if(window._currentAiDialog) window._currentAiDialog.messages.push({role:'assistant',content:text});
        // Сохраняем историю по ключу хода
        aiHistoryByTurn[getTurnKey()] = aiHistory.slice();
        var msgs = document.getElementById('ai-messages');
        msgs.scrollTop = msgs.scrollHeight;
    });
};

function finalizeLastMessage(text, div) {
    // Проверяем заканчивается ли текст вопросом
    var plain = text.replace(/<[^>]+>/g, ' ').replace(/  +/g, ' ').trim();
    var lastQ = plain.lastIndexOf('?');
    if (lastQ === -1 || lastQ < plain.length - 3) return; // нет вопроса в конце — всё ок

    // Находим последнее вопросительное предложение
    var before = plain.substring(0, lastQ);
    var lastStop = Math.max(before.lastIndexOf('.'), before.lastIndexOf('!'), before.lastIndexOf('<br>'));
    if (lastStop === -1) return;
    var questionSentence = plain.substring(lastStop + 1, lastQ + 1).trim();
    if (!questionSentence || questionSentence.length < 5) return;

    // Перефразируем вопрос в наблюдение через короткий вызов ИИ
    var PROXY = "/.netlify/functions/ai-proxy";
    fetch(PROXY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 80,
            system: 'Ты помогаешь редактировать текст. Отвечай ТОЛЬКО одним предложением на русском языке, без кавычек.',
            messages: [{
                role: 'user',
                content: 'Перефразируй это предложение-вопрос в тёплое, завершённое наблюдение или инсайт. Сохрани смысл, убери вопросительную форму. Предложение: "' + questionSentence + '"'
            }]
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.content && data.content[0] && data.content[0].text) {
            var rephrased = data.content[0].text.trim().replace(/^["«]|["»]$/g, '');
            // Заменяем вопрос в тексте на переформулированное предложение
            var idx = text.lastIndexOf(questionSentence);
            if (idx !== -1) {
                var newText = text.substring(0, idx) + rephrased + text.substring(idx + questionSentence.length);
                div.innerHTML = newText;
            }
        }
    })
    .catch(function() {}); // если не получилось — оставляем как есть
}

function aiAddMsg(role, text) {
    var msgs = document.getElementById('ai-messages');
    var div = document.createElement('div');
    div.className = role === 'ai' ? 'ai-msg-ai' : 'ai-msg-user';
    div.innerHTML = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

var TG_BOT_TOKEN = 'ВСТАВЬТЕ_ТОКЕН_БОТА';
var TG_CHAT_ID   = 'ВСТАВЬТЕ_CHAT_ID';

window.openContactForm = function() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-message').value = '';
    document.getElementById('contact-telegram').value = '';
    var st = document.getElementById('contact-status');
    st.style.display = 'none';
    openModal('contact-modal');
};

window.sendContactForm = function() {
    var name = document.getElementById('contact-name').value.trim();
    var msg  = document.getElementById('contact-message').value.trim();
    var tg   = document.getElementById('contact-telegram').value.trim();
    var st   = document.getElementById('contact-status');
    if (!name || !msg) {
        st.style.display = 'block';
        st.style.background = 'rgba(239,68,68,0.1)';
        st.style.border = '1px solid rgba(239,68,68,0.3)';
        st.style.color = '#ef4444';
        st.textContent = 'Пожалуйста, заполните имя и вопрос.';
        return;
    }
    var text = '🎮 Новая заявка из игры «Аватар Творца»\n\n' +
               '👤 Имя: ' + name + '\n' +
               (tg ? '📱 Telegram: ' + tg + '\n' : '') +
               '❓ Запрос: ' + msg + '\n\n' +
               '🗒 Запрос в игре: ' + (gameState.userRequest || '—');
    if (!TG_BOT_TOKEN || TG_BOT_TOKEN === 'ВСТАВЬТЕ_ТОКЕН_БОТА') {
        var encoded = encodeURIComponent('Хочу записаться на сессию. Имя: ' + name + '. ' + msg);
        window.open('https://t.me/osteopractican?text=' + encoded, '_blank');
        closeModal('contact-modal');
        return;
    }
    var url = 'https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage';
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: TG_CHAT_ID, text: text, parse_mode: 'HTML'})
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.ok) {
            st.style.display = 'block';
            st.style.background = 'rgba(34,197,94,0.1)';
            st.style.border = '1px solid rgba(34,197,94,0.3)';
            st.style.color = '#22c55e';
            st.textContent = '✅ Заявка отправлена! Денис ответит в течение 24 часов.';
            setTimeout(function(){ closeModal('contact-modal'); }, 2500);
        } else { throw new Error('API error'); }
    })
    .catch(function() {
        var encoded = encodeURIComponent('Хочу записаться на сессию. Имя: ' + name + '. ' + msg);
        window.open('https://t.me/osteopractican?text=' + encoded, '_blank');
        closeModal('contact-modal');
    });
};

function callAI(history, systemPrompt, callback) {
    // Запросы идут через прокси — ключ скрыт на сервере
    var PROXY = "/.netlify/functions/ai-proxy";

    var messages = history.length > 0 ? history.slice() : [{role:'user', content:'Начни сессию.'}];

    fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 600,
            system: systemPrompt,
            messages: messages
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.content && data.content[0] && data.content[0].text) {
            var text = data.content[0].text;
            text = text.replace(/\n\n/g, '</p><p style="margin-top:10px;">').replace(/\n/g, '<br>');
            callback('<p>' + text + '</p>');
        } else {
            var errMsg = (data.error && data.error.message) ? data.error.message : 'Попробуйте позже.';
            callback('<span style="color:#ef4444;">' + errMsg + '</span>');
        }
    })
    .catch(function(err) {
        callback('<span style="color:#ef4444;">Ошибка соединения: ' + (err.message||'нет сети') + '</span>');
    });
}

// ══════════════════════════════════════════════════
// ФИНАЛЬНЫЙ АНАЛИЗ — генерируется когда открыты все 3 центра
// ══════════════════════════════════════════════════
window.generateFinalAnalysis = function() {
    var tasks = Object.values(gameState.tasks || {});
    var dialogs = gameState.aiDialogs || [];
    var request = gameState.userRequest || '';

    var tasksText = tasks.map(function(t, i) {
        return (i+1) + '. [' + t.fieldName + ', клетка ' + t.cell + '] ' +
            (t.cardText ? 'Карточка: ' + t.cardText.slice(0,120) + '... ' : '') +
            (t.answer ? 'Ответ: ' + t.answer : '');
    }).join('\n');

    var dialogsText = dialogs.map(function(d, i) {
        var msgs = d.messages.map(function(m) {
            return (m.role === 'user' ? 'Игрок: ' : 'Проводник: ') + m.content.replace(/<[^>]+>/g,'').slice(0,200);
        }).join('\n');
        return 'Диалог ' + (i+1) + ' [' + d.fieldName + ']:\n' + msgs;
    }).join('\n\n');

    var analysisPrompt = 'Ты — Проводник трансформационной игры «Аватар Творца», созданной Юнией Бурэ. Игрок завершил путешествие — открыл все три центра созидания (Физический, Эмоциональный, Ментальный).\n\n' +
        'Запрос с которым игрок вошёл в игру: «' + request + '»\n\n' +
        'Пройденные задания:\n' + (tasksText || 'нет данных') + '\n\n' +
        (dialogsText ? 'Диалоги с Проводником:\n' + dialogsText + '\n\n' : '') +
        'Напиши структурированный анализ путешествия игрока. Формат:\n' +
        '1. Суть запроса — как ты понял с чем пришёл игрок\n' +
        '2. Ключевые открытия — что проявилось в процессе игры (3-5 пунктов)\n' +
        '3. Паттерны и блоки — что повторялось, где было сопротивление\n' +
        '4. Ресурсы — что оказалось силой игрока\n' +
        '5. Следующий шаг — одно конкретное направление для продолжения\n' +
        '6. Приглашение — мягко, без давления, упомяни что Юния Бурэ (автор игры) проводит личные сессии для тех кто хочет продолжить это путешествие вглубь. Свяжись через Telegram-бот в игре.\n\n' +
        'Пиши тепло, глубоко, без шаблонов. Максимум 600 слов. Только русский язык.';

    var modal = document.getElementById('analysis-modal');
    var content = document.getElementById('analysis-content');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'analysis-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;padding:20px;';
        modal.innerHTML = '<div style="max-width:680px;margin:0 auto;background:#1e293b;border-radius:16px;border:1px solid rgba(251,191,36,0.3);padding:28px;">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
            + '<h2 style="color:#fbbf24;margin:0;font-size:1.2rem;">✨ Анализ вашего путешествия</h2>'
            + '<button onclick="closeAnalysis()" style="background:rgba(255,255,255,0.1);border:none;color:#94a3b8;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:1rem;">✕</button>'
            + '</div>'
            + '<div id="analysis-content" style="color:#e2e8f0;line-height:1.7;font-size:0.95rem;"></div>'
            + '<div id="analysis-actions" style="display:none;margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">'
            + '<button onclick="printAnalysis()" style="background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);color:#fbbf24;border-radius:10px;padding:10px 20px;cursor:pointer;">📄 Сохранить PDF</button>'
            + '<button onclick="closeAnalysis()" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);color:#94a3b8;border-radius:10px;padding:10px 20px;cursor:pointer;">Закрыть</button>'
            + '</div>'
            + '</div>';
        modal.addEventListener('click', function(e){ if(e.target===modal) closeAnalysis(); });
        document.body.appendChild(modal);
    }
    content = document.getElementById('analysis-content');
    content.innerHTML = '<div style="text-align:center;padding:30px;color:#a78bfa;">🌟 Проводник анализирует ваш путь...<br><small style="color:#64748b;">Обычно занимает 10-20 секунд</small></div>';
    document.getElementById('analysis-actions').style.display = 'none';
    modal.style.display = 'block';
    window._analysisText = '';

    callAI([], analysisPrompt, function(text) {
        window._analysisText = text;
        content.innerHTML = '<div style="background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.2);border-radius:10px;padding:20px;">' + text + '</div>';
        document.getElementById('analysis-actions').style.display = 'flex';
    });
};

window.closeAnalysis = function() {
    var m = document.getElementById('analysis-modal');
    if (m) m.style.display = 'none';
};

window.printAnalysis = function() {
    var text = window._analysisText || '';
    var win = window.open('', '_blank');
    win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Анализ — Аватар Творца</title>'
        + '<style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#1a1a2e;line-height:1.8;font-size:16px;}'
        + 'h1{color:#5b21b6;border-bottom:2px solid #e9d5ff;padding-bottom:10px;}'
        + 'p{margin-bottom:12px;} @media print{body{margin:20mm;}}</style></head><body>'
        + '<h1>✨ Анализ вашего путешествия</h1>'
        + '<p style="color:#6b7280;font-size:14px;">Игра «Аватар Творца» · Автор: Юния Бурэ · ' + new Date().toLocaleDateString('ru') + '</p>'
        + '<p style="color:#6b7280;font-size:14px;margin-bottom:24px;">Запрос: <em>' + (gameState.userRequest || '') + '</em></p>'
        + text.replace(/<[^>]+>/g, function(t){ return t; })
        + '<hr style="margin-top:40px;border-color:#e9d5ff;">'
        + '<p style="color:#6b7280;font-size:13px;">Хотите продолжить путешествие? Юния Бурэ проводит личные сессии. Свяжитесь через Telegram-бот в игре.</p>'
        + '</body></html>');
    win.document.close();
    win.print();
};
