const topics = [
  ["🏛️","History","The Roman Empire","How did Rome rise, expand, and eventually fall?"],
  ["🔬","Science","Black Holes","What are black holes and what happens near one?"],
  ["🧠","Psychology","The Dunning–Kruger Effect","Why can people with limited knowledge overestimate their ability?"],
  ["⚙️","Engineering","How Bridges Work","How do bridges carry enormous loads without collapsing?"],
  ["💰","Money","How Compound Interest Works","Why can money grow dramatically over long periods?"],
  ["🌎","Geography","Why Deserts Form","What causes some places on Earth to receive so little rain?"],
  ["🧬","Biology","How Your Immune System Works","How does your body recognize and fight threats?"],
  ["🚀","Space","How Rockets Reach Space","How does a rocket overcome Earth's gravity?"],
  ["💻","Technology","How the Internet Works","What actually happens when you visit a website?"],
  ["🏺","Ancient World","Ancient Egyptian Pyramids","How and why were the great pyramids built?"],
  ["⚡","Physics","Electricity","What is electricity and how does it move through a circuit?"],
  ["🐺","Animals","Wolf Packs","How do wolves communicate, hunt, and organize themselves?"],
  ["🎨","Art","The Renaissance","Why was the Renaissance such a major turning point in art and culture?"],
  ["🌋","Earth Science","Volcanoes","Why do volcanoes erupt and what happens during an eruption?"],
  ["🗣️","Communication","Body Language","How much can people communicate without saying a word?"]
];

let currentTopic = null;
let mode = "research";
let duration = 900;
let remaining = duration;
let timerId = null;
let explainDuration = 60;
let explainRemaining = 60;
let explainTimerId = null;

const $ = id => document.getElementById(id);

function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}
function showHome(){stopAll();showPage("home")}
function showTopics(){stopAll();renderTopics();showPage("topics")}
function showChallenge(){stopAll();showPage("challenge")}

function renderTopics(){
  $("topicGrid").innerHTML = topics.map((t,i)=>`
    <button class="topic-choice" onclick="chooseTopic(${i})">
      <div class="emoji">${t[0]}</div>
      <h3>${t[2]}</h3>
      <p>${t[1]}</p>
    </button>`).join("");
}
function chooseTopic(i){
  currentTopic = topics[i];
  $("categoryPill").textContent = currentTopic[1].toUpperCase();
  $("topicTitle").textContent = currentTopic[2];
  $("topicPrompt").textContent = currentTopic[3];
  $("notes").value = localStorage.getItem("notes-"+currentTopic[2]) || "";
  resetTimer();
  showPage("challenge");
}
function startRandom(){ chooseTopic(Math.floor(Math.random()*topics.length)); }

function toggleTimer(){
  if(timerId){ clearInterval(timerId); timerId=null; $("timerBtn").textContent="Resume"; return; }
  $("timerBtn").textContent="Pause";
  timerId=setInterval(()=>{
    remaining--;
    updateResearch();
    if(remaining<=0){remaining=0;updateResearch();clearInterval(timerId);timerId=null;$("timerBtn").textContent="Finished";$("timerSub").textContent="Research complete. Now explain what you learned.";beep();}
  },1000);
}
function resetTimer(){
  if(timerId) clearInterval(timerId); timerId=null;
  mode="research";duration=900;remaining=900;
  $("timerLabel").textContent="RESEARCH";$("timer").textContent="15:00";$("timerSub").textContent="Learn as much as you can.";$("timerBtn").textContent="Start Timer";$("progressBar").style.width="100%";
}
function updateResearch(){
  $("timer").textContent=fmt(remaining);
  $("progressBar").style.width=(remaining/duration*100)+"%";
  if(currentTopic) localStorage.setItem("notes-"+currentTopic[2],$("notes").value);
}
function startExplain(seconds){
  stopAll(); explainDuration=seconds; explainRemaining=seconds;
  $("explainTopic").textContent=currentTopic ? currentTopic[2] : "this topic";
  $("explainTimer").textContent=fmt(explainRemaining);
  $("explainBtn").textContent="Start Timer";
  $("explainProgress").style.width="100%";
  showPage("explain");
}
function toggleExplainTimer(){
  if(explainTimerId){clearInterval(explainTimerId);explainTimerId=null;$("explainBtn").textContent="Resume";return}
  $("explainBtn").textContent="Pause";
  explainTimerId=setInterval(()=>{
    explainRemaining--; updateExplain();
    if(explainRemaining<=0){explainRemaining=0;updateExplain();clearInterval(explainTimerId);explainTimerId=null;$("explainBtn").textContent="Finished";beep();}
  },1000);
}
function resetExplainTimer(){
  if(explainTimerId) clearInterval(explainTimerId);explainTimerId=null;
  explainRemaining=explainDuration;$("explainTimer").textContent=fmt(explainRemaining);$("explainBtn").textContent="Start Timer";$("explainProgress").style.width="100%";
}
function updateExplain(){
  $("explainTimer").textContent=fmt(explainRemaining);
  $("explainProgress").style.width=(explainRemaining/explainDuration*100)+"%";
}
function finishChallenge(level){
  stopAll();
  $("completeTopic").textContent=currentTopic ? currentTopic[2] : "your topic";
  $("confidenceResult").textContent=level;
  showPage("complete");
}
function clearNotes(){
  $("notes").value="";
  if(currentTopic)localStorage.removeItem("notes-"+currentTopic[2]);
}
$("notes").addEventListener("input",()=>{if(currentTopic)localStorage.setItem("notes-"+currentTopic[2],$("notes").value)});
function fmt(sec){return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`}
function stopAll(){if(timerId)clearInterval(timerId);if(explainTimerId)clearInterval(explainTimerId);timerId=null;explainTimerId=null}
function beep(){
  try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=660;g.gain.value=.06;o.start();o.stop(c.currentTime+.18)}catch(e){}
}
$("themeBtn").onclick=()=>{
  document.body.classList.toggle("dark");
  const dark=document.body.classList.contains("dark");
  $("themeBtn").textContent=dark?"☾":"☀";
  localStorage.setItem("theme",dark?"dark":"light");
};
if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark");$("themeBtn").textContent="☾"}
renderTopics();
