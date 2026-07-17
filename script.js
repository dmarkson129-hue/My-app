/*
ULTIMATE QUIZ V6.8 FULL MASSIVE JS
Focus:
✅ Bigger Question Bank
✅ Heavy Medium/Hard Expansion
✅ Randomized Answer Positions
✅ Quiz / Exam / Daily Challenge
✅ XP / Coins / Level System
✅ Works with previous HTML/CSS

NOTE:
This is a drop-in replacement for script.js
*/

/* =========================
CORE STATE
========================= */
const screens = [
"homeScreen","gameScreen","resultScreen",
"settingsScreen","statsScreen"
];

let quizCategory="General";
let quizDifficulty="Easy";
let examSubject="Mixed";
let examTime=20;

let mode="quiz";
let questions=[];
let current=0;
let score=0;
let timer=null;
let secondsLeft=0;
/* =========================
SOUND SYSTEM
========================= */

let soundEnabled =
localStorage.getItem("soundEnabled") !== "false";

function playTone(freq,duration){

if(!soundEnabled) return;

const audioCtx =
new (window.AudioContext || window.webkitAudioContext)();

const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.frequency.value = freq;
osc.type = "sine";

gain.gain.value = 0.05;

osc.start();

setTimeout(()=>{
osc.stop();
audioCtx.close();
},duration);
}

function clickSound(){
playTone(500,60);
}

function correctSound(){
playTone(800,120);
}

function wrongSound(){
playTone(220,180);
}
/* =========================
VIBRATION SYSTEM
========================= */

let vibrationEnabled =
localStorage.getItem("vibrationEnabled") !== "false";

function vibrate(ms){

if(!vibrationEnabled) return;

if(navigator.vibrate){
navigator.vibrate(ms);
}

}
function toggleVibration(){

vibrationEnabled = !vibrationEnabled;

localStorage.setItem(
"vibrationEnabled",
vibrationEnabled
);

document.getElementById("vibeText").innerText =
vibrationEnabled ? "ON" : "OFF";

}
function toggleSound(){

soundEnabled = !soundEnabled;

localStorage.setItem(
"soundEnabled",
soundEnabled
);

document.getElementById("soundText").innerText =
soundEnabled ? "ON" : "OFF";

}
/* =========================
STORAGE
========================= */
function num(k){ return parseInt(localStorage.getItem(k)||0); }
function setNum(k,v){ localStorage.setItem(k,v); }
function addNum(k,v){ setNum(k,num(k)+v); }

/* =========================
LEVEL SYSTEM
========================= */
function xp(){ return num("xp"); }
function level(){ return Math.floor(xp()/100)+1; }
function xpBar(){ return xp()%100; }
function gainXP(v){ addNum("xp",v); }

/* =========================
UI
========================= */
function showScreen(id){
screens.forEach(s=>{
document.getElementById(s).classList.remove("active");
});
document.getElementById(id).classList.add("active");
updateMini();
}

function goHome(){
clearInterval(timer);
showScreen("homeScreen");
}

function openSettings(){
showScreen("settingsScreen");
}

function openStats(){
renderStats();
showScreen("statsScreen");
}

function updateMini(){
let a=document.getElementById("coinMini");
let b=document.getElementById("streakMini");
let c=document.getElementById("highMini");

if(a) a.innerText=num("coins");
if(b) b.innerText=num("streak");
if(c) c.innerText="Lv."+level();
}

/* =========================
SELECTS
========================= */
function toggleSelect(id){
document.querySelectorAll(".custom-select").forEach(x=>{
if(x.id!==id) x.classList.remove("active");
});
document.getElementById(id).classList.toggle("active");
}

function chooseOption(type,box,label){

document.getElementById(box).classList.remove("active");

if(type==="quizCategory"){
quizCategory=clean(label);
document.getElementById("quizCategoryText").innerText=label;
}
if(type==="quizDifficulty"){
quizDifficulty=clean(label);
document.getElementById("quizDifficultyText").innerText=label;
}
if(type==="examSubject"){
examSubject=clean(label);
document.getElementById("examSubjectText").innerText=label;
}
if(type==="examTime"){
examTime=parseInt(label.match(/\d+/)[0]);
document.getElementById("examTimeText").innerText=label;
}
}

function clean(t){
return t.replace(/[^\w\s]/g,"").trim();
}

/* =========================
QUESTION BANK
FORMAT:
c = category
d = difficulty
q = question
correct = answer
wrong = 3 wrong options
========================= */

const bank = [

/* ===================================================
GENERAL EASY
=================================================== */
{c:"General",d:"Easy",q:"Capital of France?",correct:"Paris",wrong:["Rome","Madrid","Berlin"]},
{c:"General",d:"Easy",q:"How many days in a week?",correct:"7",wrong:["5","6","8"]},
{c:"General",d:"Easy",q:"Color of banana?",correct:"Yellow",wrong:["Blue","Black","Pink"]},
{c:"General",d:"Easy",q:"Which animal barks?",correct:"Dog",wrong:["Cat","Fish","Cow"]},
{c:"General",d:"Easy",q:"How many months in a year?",correct:"12",wrong:["10","11","13"]},
{c:"General",d:"Easy",q:"Which one can fly?",correct:"Bird",wrong:["Goat","Cow","Snake"]},
{c:"General",d:"Easy",q:"What do bees make?",correct:"Honey",wrong:["Milk","Oil","Rice"]},
{c:"General",d:"Easy",q:"Planet we live on?",correct:"Earth",wrong:["Mars","Moon","Venus"]},
{c:"General",d:"Easy",q:"How many hours in a day?",correct:"24",wrong:["20","12","30"]},
{c:"General",d:"Easy",q:"Which is a fruit?",correct:"Apple",wrong:["Stone","Rice","Fish"]},

/* ===================================================
GENERAL MEDIUM
=================================================== */
{c:"General",d:"Medium",q:"Largest ocean?",correct:"Pacific",wrong:["Atlantic","Indian","Arctic"]},
{c:"General",d:"Medium",q:"Currency of Japan?",correct:"Yen",wrong:["Peso","Dollar","Won"]},
{c:"General",d:"Medium",q:"Tallest animal?",correct:"Giraffe",wrong:["Horse","Tiger","Camel"]},
{c:"General",d:"Medium",q:"Fastest land animal?",correct:"Cheetah",wrong:["Lion","Tiger","Horse"]},
{c:"General",d:"Medium",q:"How many continents?",correct:"7",wrong:["5","6","8"]},
{c:"General",d:"Medium",q:"Primary language of Brazil?",correct:"Portuguese",wrong:["Spanish","English","French"]},
{c:"General",d:"Medium",q:"Gas plants absorb?",correct:"Carbon Dioxide",wrong:["Oxygen","Helium","Hydrogen"]},
{c:"General",d:"Medium",q:"Largest mammal?",correct:"Blue Whale",wrong:["Elephant","Hippo","Rhino"]},
{c:"General",d:"Medium",q:"Who wrote Hamlet?",correct:"Shakespeare",wrong:["Newton","Homer","Dickens"]},
{c:"General",d:"Medium",q:"Which country has pyramids?",correct:"Egypt",wrong:["Kenya","Spain","India"]},
{c:"General",d:"Medium",q:"Main gas in air?",correct:"Nitrogen",wrong:["Oxygen","Carbon Dioxide","Hydrogen"]},
{c:"General",d:"Medium",q:"Instrument with keys?",correct:"Piano",wrong:["Drum","Flute","Violin"]},

/* ===================================================
GENERAL HARD
=================================================== */
{c:"General",d:"Hard",q:"Capital of Canada?",correct:"Ottawa",wrong:["Toronto","Quebec","Vancouver"]},
{c:"General",d:"Hard",q:"Smallest country?",correct:"Vatican City",wrong:["Monaco","Malta","Nauru"]},
{c:"General",d:"Hard",q:"Largest hot desert?",correct:"Sahara",wrong:["Arabian","Gobi","Kalahari"]},
{c:"General",d:"Hard",q:"Who painted Mona Lisa?",correct:"Leonardo da Vinci",wrong:["Picasso","Van Gogh","Michelangelo"]},
{c:"General",d:"Hard",q:"Capital of Australia?",correct:"Canberra",wrong:["Sydney","Melbourne","Perth"]},
{c:"General",d:"Hard",q:"Deepest ocean trench?",correct:"Mariana Trench",wrong:["Java Trench","Tonga Trench","Peru Trench"]},
{c:"General",d:"Hard",q:"Country with most population (current era)?",correct:"India",wrong:["USA","China","Russia"]},
{c:"General",d:"Hard",q:"Chemical symbol for Silver?",correct:"Ag",wrong:["Au","Si","Sr"]},
{c:"General",d:"Hard",q:"First man in space?",correct:"Yuri Gagarin",wrong:["Neil Armstrong","Buzz Aldrin","John Glenn"]},
{c:"General",d:"Hard",q:"Longest river often cited?",correct:"Nile",wrong:["Amazon","Congo","Mississippi"]},

/* ===================================================
BRAIN EASY
=================================================== */
{c:"Brain",d:"Easy",q:"What has hands but can't clap?",correct:"Clock",wrong:["Dog","Book","Chair"]},
{c:"Brain",d:"Easy",q:"What gets wetter while drying?",correct:"Towel",wrong:["Stone","Chair","Fire"]},
{c:"Brain",d:"Easy",q:"What has legs but can't walk?",correct:"Table",wrong:["Cat","Boy","Dog"]},
{c:"Brain",d:"Easy",q:"What has teeth but can't bite?",correct:"Comb",wrong:["Lion","Shark","Dog"]},
{c:"Brain",d:"Easy",q:"What has pages but no mouth?",correct:"Book",wrong:["Cup","Wall","Rock"]},

/* ===================================================
BRAIN MEDIUM
=================================================== */
{c:"Brain",d:"Medium",q:"What has keys but no locks?",correct:"Piano",wrong:["Car","Road","Door"]},
{c:"Brain",d:"Medium",q:"What has one eye but can't see?",correct:"Needle",wrong:["Dog","Fish","Plate"]},
{c:"Brain",d:"Medium",q:"What goes up but never down?",correct:"Age",wrong:["Smoke","Rain","Balloon"]},
{c:"Brain",d:"Medium",q:"What has words but never speaks?",correct:"Book",wrong:["Chair","Road","Wall"]},
{c:"Brain",d:"Medium",q:"What can run but never walks?",correct:"Water",wrong:["Dog","Clock","Fan"]},
{c:"Brain",d:"Medium",q:"What begins with T ends with T and has T in it?",correct:"Teapot",wrong:["Tent","Toast","Ticket"]},
{c:"Brain",d:"Medium",q:"What can you catch but not throw?",correct:"Cold",wrong:["Ball","Stone","Fish"]},

/* ===================================================
BRAIN HARD
=================================================== */
{c:"Brain",d:"Hard",q:"What breaks when spoken?",correct:"Silence",wrong:["Glass","Wood","Stone"]},
{c:"Brain",d:"Hard",q:"The more you take, more you leave?",correct:"Footsteps",wrong:["Money","Food","Coins"]},
{c:"Brain",d:"Hard",q:"What fills a room but takes no space?",correct:"Light",wrong:["Dust","Smoke","Water"]},
{c:"Brain",d:"Hard",q:"What can travel world in a corner?",correct:"Stamp",wrong:["Bird","Coin","Wind"]},
{c:"Brain",d:"Hard",q:"What belongs to you but others use it more?",correct:"Your Name",wrong:["Your House","Your Phone","Your Bag"]},
{c:"Brain",d:"Hard",q:"What has many needles but doesn't sew?",correct:"Pine Tree",wrong:["Clock","Doctor","Road"]},
{c:"Brain",d:"Hard",q:"What goes through cities and fields but never moves?",correct:"Road",wrong:["Wind","River","Bus"]},

/* ===================================================
MATH EASY
=================================================== */
{c:"Math",d:"Easy",q:"5 × 6 = ?",correct:"30",wrong:["20","25","35"]},
{c:"Math",d:"Easy",q:"10 + 8 = ?",correct:"18",wrong:["17","16","19"]},
{c:"Math",d:"Easy",q:"9 ÷ 3 = ?",correct:"3",wrong:["2","4","5"]},
{c:"Math",d:"Easy",q:"15 - 7 = ?",correct:"8",wrong:["7","9","6"]},
{c:"Math",d:"Easy",q:"7 + 7 = ?",correct:"14",wrong:["12","15","13"]},

/* ===================================================
MATH MEDIUM
=================================================== */
{c:"Math",d:"Medium",q:"12² = ?",correct:"144",wrong:["124","142","122"]},
{c:"Math",d:"Medium",q:"Square root of 81?",correct:"9",wrong:["8","7","6"]},
{c:"Math",d:"Medium",q:"25% of 200?",correct:"50",wrong:["25","75","40"]},
{c:"Math",d:"Medium",q:"7 × 8 = ?",correct:"56",wrong:["54","58","48"]},
{c:"Math",d:"Medium",q:"15% of 300?",correct:"45",wrong:["30","60","50"]},
{c:"Math",d:"Medium",q:"If x+5=12, x=?",correct:"7",wrong:["5","6","8"]},
{c:"Math",d:"Medium",q:"Perimeter of square side 6?",correct:"24",wrong:["12","18","36"]},
{c:"Math",d:"Medium",q:"Area of rectangle 5×4?",correct:"20",wrong:["9","10","25"]},

/* ===================================================
MATH HARD
=================================================== */
{c:"Math",d:"Hard",q:"Derivative of x² ?",correct:"2x",wrong:["x²","x","1"]},
{c:"Math",d:"Hard",q:"Pi is approx?",correct:"3.14",wrong:["2.71","1.61","4.20"]},
{c:"Math",d:"Hard",q:"Solve 2x=10",correct:"5",wrong:["2","10","8"]},
{c:"Math",d:"Hard",q:"10! means?",correct:"Factorial",wrong:["Square","Cube","Fraction"]},
{c:"Math",d:"Hard",q:"3² + 4² = ?",correct:"25",wrong:["12","49","16"]},
{c:"Math",d:"Hard",q:"Slope formula uses change in y over change in ?",correct:"x",wrong:["z","angle","area"]},
{c:"Math",d:"Hard",q:"Value of 2³?",correct:"8",wrong:["6","9","4"]},
{c:"Math",d:"Hard",q:"Integral of constant 1 dx?",correct:"x + C",wrong:["1","0","C"]},

/* ===================================================
PHYSICS EASY
=================================================== */
{c:"Physics",d:"Easy",q:"Unit of force?",correct:"Newton",wrong:["Volt","Watt","Joule"]},
{c:"Physics",d:"Easy",q:"We measure temperature with?",correct:"Thermometer",wrong:["Barometer","Clock","Scale"]},
{c:"Physics",d:"Easy",q:"SI unit of mass?",correct:"Kilogram",wrong:["Meter","Second","Liter"]},

/* ===================================================
PHYSICS MEDIUM
=================================================== */
{c:"Physics",d:"Medium",q:"Speed = distance / ?",correct:"Time",wrong:["Mass","Power","Heat"]},
{c:"Physics",d:"Medium",q:"Light travels fastest in?",correct:"Vacuum",wrong:["Water","Steel","Wood"]},
{c:"Physics",d:"Medium",q:"SI unit of current?",correct:"Ampere",wrong:["Volt","Watt","Ohm"]},
{c:"Physics",d:"Medium",q:"Energy unit?",correct:"Joule",wrong:["Newton","Tesla","Pascal"]},
{c:"Physics",d:"Medium",q:"Instrument for pressure?",correct:"Barometer",wrong:["Thermometer","Ammeter","Ruler"]},
{c:"Physics",d:"Medium",q:"Object at rest stays at rest law by?",correct:"Newton",wrong:["Einstein","Tesla","Faraday"]},
{c:"Physics",d:"Medium",q:"Mirror that spreads light?",correct:"Convex",wrong:["Concave","Plane","Glass"]},

/* ===================================================
PHYSICS HARD
=================================================== */
{c:"Physics",d:"Hard",q:"Force = mass × ?",correct:"Acceleration",wrong:["Heat","Power","Speed"]},
{c:"Physics",d:"Hard",q:"SI unit of power?",correct:"Watt",wrong:["Volt","Amp","Tesla"]},
{c:"Physics",d:"Hard",q:"Resistance unit?",correct:"Ohm",wrong:["Henry","Volt","Newton"]},
{c:"Physics",d:"Hard",q:"Frequency unit?",correct:"Hertz",wrong:["Joule","Watt","Tesla"]},
{c:"Physics",d:"Hard",q:"Momentum = mass × ?",correct:"Velocity",wrong:["Area","Force","Heat"]},
{c:"Physics",d:"Hard",q:"Escape velocity relates to leaving a?",correct:"Planet",wrong:["Battery","Wire","Motor"]},
{c:"Physics",d:"Hard",q:"Lens used for short sightedness?",correct:"Concave",wrong:["Convex","Plane","Mirror"]},

/* ===================================================
CHEMISTRY EASY
=================================================== */
{c:"Chemistry",d:"Easy",q:"Formula of water?",correct:"H2O",wrong:["CO2","NaCl","O2"]},
{c:"Chemistry",d:"Easy",q:"Gas humans breathe?",correct:"Oxygen",wrong:["Helium","Neon","Hydrogen"]},
{c:"Chemistry",d:"Easy",q:"Common salt is?",correct:"NaCl",wrong:["H2SO4","CO2","CH4"]},

/* ===================================================
CHEMISTRY MEDIUM
=================================================== */
{c:"Chemistry",d:"Medium",q:"Symbol for Gold?",correct:"Au",wrong:["Ag","Go","Gd"]},
{c:"Chemistry",d:"Medium",q:"Symbol for Sodium?",correct:"Na",wrong:["So","S","Sn"]},
{c:"Chemistry",d:"Medium",q:"pH of neutral water?",correct:"7",wrong:["1","14","3"]},
{c:"Chemistry",d:"Medium",q:"Gas used in balloons?",correct:"Helium",wrong:["Oxygen","Nitrogen","Chlorine"]},
{c:"Chemistry",d:"Medium",q:"Acids turn blue litmus to?",correct:"Red",wrong:["Green","Yellow","White"]},
{c:"Chemistry",d:"Medium",q:"Atomic number of Carbon?",correct:"6",wrong:["8","12","4"]},
{c:"Chemistry",d:"Medium",q:"Chemical symbol of Iron?",correct:"Fe",wrong:["Ir","Fi","In"]},

/* ===================================================
CHEMISTRY HARD
=================================================== */
{c:"Chemistry",d:"Hard",q:"pH below 7 means?",correct:"Acid",wrong:["Base","Neutral","Metal"]},
{c:"Chemistry",d:"Hard",q:"Atomic number of Hydrogen?",correct:"1",wrong:["2","8","16"]},
{c:"Chemistry",d:"Hard",q:"Molecule with one carbon two oxygen?",correct:"CO2",wrong:["CO","CH4","H2O"]},
{c:"Chemistry",d:"Hard",q:"Strong acid among these?",correct:"HCl",wrong:["NaCl","H2O","NH3"]},
{c:"Chemistry",d:"Hard",q:"OH- ion indicates a?",correct:"Base",wrong:["Metal","Gas","Acid"]},
{c:"Chemistry",d:"Hard",q:"Avogadro concept relates to number of?",correct:"Particles",wrong:["Colors","Liquids","Metals"]},
{c:"Chemistry",d:"Hard",q:"Periodic table arranged by atomic ?",correct:"Number",wrong:["Mass only","Color","Volume"]}
];

/* =========================
BUILD QUESTION
========================= */
function buildQuestion(raw){
let options=[raw.correct,...raw.wrong];
options=shuffle(options);

return{
c:raw.c,
d:raw.d,
q:raw.q,
a:options,
r:options.indexOf(raw.correct)
};
}
/* =========================
FETCH ONLINE QUESTIONS
========================= */

async function getAPIQuestions(){

try{

const res = await fetch(
"https://opentdb.com/api.php?amount=10&type=multiple"
);

const data = await res.json();

return data.results.map(q=>({

c:"General",
d:"Easy",

q:decodeHTML(q.question),

correct:decodeHTML(q.correct_answer),

wrong:q.incorrect_answers.map(
x=>decodeHTML(x)
)

}));

}catch(err){

console.log("API failed:",err);

return [];
}

}

/* =========================
FIX HTML SYMBOLS
========================= */

function decodeHTML(text){

const txt=document.createElement("textarea");

txt.innerHTML=text;

return txt.value;

}
/* =========================
START MODES
========================= */
function startQuiz(){
async function startQuiz(){

clickSound();

mode="quiz";
current=0;
score=0;

/* Local questions */
let localQuestions = bank
.filter(x=>
x.c===quizCategory &&
x.d===quizDifficulty
);

/* Online questions */
let apiQuestions =
await getAPIQuestions();

/* Merge both */
questions = shuffle([

...localQuestions,
...apiQuestions

])
.slice(0,10)
.map(buildQuestion);

showScreen("gameScreen");
renderQuestion();


}

function startExam(){
mode="exam";
current=0;
score=0;

clickSound();

questions = (
examSubject==="Mixed"
? shuffle([...bank]).slice(0,20)
: shuffle(bank.filter(x=>x.c===examSubject)).slice(0,20)
).map(buildQuestion);

secondsLeft = examTime*60;

showScreen("gameScreen");
startTimer();
renderQuestion();
}

function startDailyChallenge(){
mode="daily";
current=0;
score=0;

questions = shuffle([...bank]).slice(0,10).map(buildQuestion);

showScreen("gameScreen");
renderQuestion();
}

/* =========================
TIMER
========================= */
function startTimer(){
clearInterval(timer);

timer=setInterval(()=>{
secondsLeft--;

let m=Math.floor(secondsLeft/60);
let s=secondsLeft%60;

document.getElementById("timerText").innerText=
`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

if(secondsLeft<=0) finishGame();

},1000);
}

/* =========================
RENDER
========================= */
function renderQuestion(){

const q=questions[current];

document.getElementById("questionCount").innerText=
`Question ${current+1}/${questions.length}`;

if(mode!=="exam"){
document.getElementById("timerText").innerText=
`${current+1}/${questions.length}`;
}

document.getElementById("questionText").innerText=q.q;

document.getElementById("progressBar").style.width=
((current/questions.length)*100)+"%";

const box=document.getElementById("answersBox");
box.innerHTML="";

q.a.forEach((ans,i)=>{
const btn=document.createElement("button");
btn.innerText=ans;
btn.onclick=()=>chooseAnswer(i);
box.appendChild(btn);
});

document.getElementById("nextBtn").style.display="none";
}

/* =========================
ANSWER
========================= */
function chooseAnswer(i){

const q=questions[current];
const btns=document.querySelectorAll("#answersBox button");

btns.forEach((b,index)=>{
b.disabled=true;

if(index===q.r){
b.style.background="#16a34a";
b.style.color="#fff";
}
else if(index===i){
b.style.background="#dc2626";
b.style.color="#fff";
}
});

if(i===q.r){

score++;
addNum("coins",5);
gainXP(10);
addNum("streak",1);

correctSound();
vibrate(100);

}else{

setNum("streak",0);

wrongSound();
vibrate(250);

}
updateMini();
document.getElementById("nextBtn").style.display="block";
}

/* =========================
NEXT
========================= */
function nextQuestion(){

clickSound();

current++;

if(current>=questions.length){
finishGame();
return;
}

renderQuestion();
}

/* =========================
FINISH
========================= */
function finishGame(){

clearInterval(timer);

let total=questions.length;
let percent=Math.round((score/total)*100);
let reward=score*5;

if(mode==="daily"){
reward += 50;
gainXP(30);
}

if(mode==="exam"){
gainXP(score*2);
}

addNum("coins",reward);

if(score>num("highscore")){
setNum("highscore",score);
}

document.getElementById("resultScore").innerText=
`${score}/${total}`;

document.getElementById("accuracyText").innerText=
percent+"%";

document.getElementById("rewardCoins").innerText=
reward;

document.getElementById("rewardStreak").innerText=
"Lv."+level();

let msg="Keep Practicing 📚";

if(percent===100) msg="Perfect Run 👑";
else if(percent>=80) msg="Excellent Work 🔥";
else if(percent>=60) msg="Nice Job 😎";

document.getElementById("resultExtra").innerText=msg;
document.getElementById("resultEmoji").innerText="🏆";
const soundText = document.getElementById("soundText");
const vibeText = document.getElementById("vibeText");

if(soundText){
soundText.innerText =
soundEnabled ? "ON" : "OFF";
}

if(vibeText){
vibeText.innerText =
vibrationEnabled ? "ON" : "OFF";
}
updateMini();
showScreen("resultScreen");
}

/* =========================
STATS
========================= */
function renderStats(){
document.getElementById("statsText").innerHTML=`
🪙 Coins: ${num("coins")}<br>
⭐ XP: ${xp()}<br>
🏅 Level: ${level()}<br>
📈 XP Progress: ${xpBar()}/100<br>
🔥 Streak: ${num("streak")}<br>
🏆 High Score: ${num("highscore")}<br>
`;
}

/* =========================
RESET
========================= */
function resetData(){
localStorage.clear();
location.reload();
}

/* =========================
HELPER
========================= */
function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

/* INIT */
updateMini();
const soundText = document.getElementById("soundText");
const vibeText = document.getElementById("vibeText");

if(soundText){
soundText.innerText =
soundEnabled ? "ON" : "OFF";
}

if(vibeText){
vibeText.innerText =
vibrationEnabled ? "ON" : "OFF";
}