// ═══════════════════════════════════════════════════════════
//  CONTENT BANK
// ═══════════════════════════════════════════════════════════
const BANK = {
  words: [
    "le chat dort sur le canapé rouge et chaud",
    "le soleil brille dans le ciel bleu ce matin",
    "la pluie tombe doucement sur les feuilles vertes",
    "les enfants jouent dans le parc près de la maison",
    "elle lit un livre passionnant dans son lit blanc",
    "nous allons au marché acheter des fruits frais",
    "la programmation est un art qui demande de la patience",
    "les algorithmes permettent de résoudre des problèmes complexes",
    "apprendre à taper rapidement améliore votre productivité",
    "la pratique régulière est la clé pour maîtriser une compétence",
    "les interfaces bien conçues rendent les applications agréables",
    "comprendre les bases facilite l'apprentissage de nouveaux langages",
    "le développement web nécessite créativité et rigueur technique",
    "chaque ligne de code est une décision de conception importante",
  ],
  "words-en": [
    "the quick brown fox jumps over the lazy dog",
    "programming is the art of telling a computer what to do",
    "practice makes perfect when it comes to typing speed",
    "clean code reads like well-written prose and documentation",
    "every great developer was once a beginner who kept going",
    "the best way to learn is by building real projects",
    "debugging is twice as hard as writing the code itself",
    "simplicity is the soul of efficiency in software design",
    "first solve the problem then write the code afterward",
    "good software is written for humans not just computers",
  ],
  quote: [
    "Le génie c'est un pour cent d'inspiration et quatre-vingt-dix-neuf pour cent de transpiration. — Thomas Edison",
    "La vie c'est comme une bicyclette il faut avancer pour ne pas perdre l'équilibre. — Albert Einstein",
    "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas c'est parce que nous n'osons pas qu'elles sont difficiles. — Sénèque",
    "La perfection n'est pas une destination mais un voyage sans fin vers l'amélioration continue.",
    "Toute personne qui n'a jamais commis d'erreur n'a jamais tenté d'innover. — Albert Einstein",
    "Il n'y a qu'une façon d'échouer c'est d'abandonner avant d'avoir réussi. — Georges Clemenceau",
    "L'imagination est plus importante que le savoir car le savoir est limité tandis que l'imagination embrasse le monde entier. — Albert Einstein",
  ],
  code: [
    `const sum = (a, b) => a + b;`,
    `const fetchData = async (url) => { const res = await fetch(url); return res.json(); };`,
    `arr.filter(x => x > 0).map(x => x * 2).reduce((a, b) => a + b, 0);`,
    `class Animal { constructor(name) { this.name = name; } speak() { return this.name; } }`,
    `const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };`,
    `function mergeSort(arr) { if (arr.length <= 1) return arr; const m = arr.length >> 1; return merge(mergeSort(arr.slice(0,m)), mergeSort(arr.slice(m))); }`,
    `const memoize = fn => { const c = new Map(); return (...a) => { const k = JSON.stringify(a); return c.has(k) ? c.get(k) : c.set(k,fn(...a)).get(k); }; };`,
  ],
  numbers: [
    "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20",
    "3.14159 2.71828 1.41421 1.61803 0.57721 1.73205 2.30258",
    "42 256 1024 4096 65536 128 64 32 16 8 4 2 1",
    "100 200 350 500 750 1000 1500 2000 3000 5000 10000",
  ],
};

// ═══════════════════════════════════════════════════════════
//  AUDIO ENGINE
// ═══════════════════════════════════════════════════════════
const AC = new AudioContext();
function playClick(type, isError = false) {
  if (S.sound === "off") return;
  try {
    AC.resume();
    const o = AC.createOscillator(), g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    const now = AC.currentTime;
    if (type === "mech") {
      o.type = "square"; o.frequency.setValueAtTime(isError ? 180 : 800, now);
      o.frequency.exponentialRampToValueAtTime(isError ? 80 : 400, now + .04);
      g.gain.setValueAtTime(.12, now); g.gain.exponentialRampToValueAtTime(.001, now + .06);
      o.start(now); o.stop(now + .06);
    } else if (type === "soft") {
      o.type = "sine"; o.frequency.setValueAtTime(isError ? 280 : 600 + Math.random()*200, now);
      g.gain.setValueAtTime(.06, now); g.gain.exponentialRampToValueAtTime(.001, now + .1);
      o.start(now); o.stop(now + .1);
    } else if (type === "retro") {
      o.type = "square"; o.frequency.setValueAtTime(isError ? 60 : 440, now);
      g.gain.setValueAtTime(.08, now); g.gain.exponentialRampToValueAtTime(.001, now + .05);
      o.start(now); o.stop(now + .05);
    }
  } catch(e){}
}

// ═══════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════
const S = {
  mode:"words", gameType:"timed", timeLimit:15, sound:"off",
  text:"", chars:[], typed:[], charIndex:0,
  started:false, finished:false,
  startTime:null, timer:null, elapsed:0,
  errors:0, totalTyped:0,
  wpmHistory:[], // [{t, wpm}] during game
  keyErrors:{},  // key -> error count
  history: JSON.parse(localStorage.getItem("typerush_history")||"[]"),
};

// ═══════════════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════════════
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  document.querySelectorAll(".theme-pill").forEach(p => p.classList.toggle("active", p.dataset.t===t));
  localStorage.setItem("typerush_theme", t);
  // Re-render charts if open
  if (document.getElementById("tab-stats").style.display !== "none") renderStatsTab();
}
(()=>{ const t=localStorage.getItem("typerush_theme")||"dark"; setTheme(t); })();

// ═══════════════════════════════════════════════════════════
//  TABS
// ═══════════════════════════════════════════════════════════
function switchTab(t) {
  ["solo","multi","stats"].forEach(id => {
    document.getElementById(`tab-${id}`).style.display = id===t?"block":"none";
  });
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab===t));
  if (t==="stats") renderStatsTab();
  if (t==="multi") initMulti();
}

// ═══════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════
function setMode(m) {
  S.mode = m;
  btnGroup("mode-group", m);
  document.getElementById("custom-wrap").classList.toggle("show", m==="custom");
  document.getElementById("time-group").style.opacity = (S.gameType==="zen"||S.gameType==="marathon") ? ".4" : "1";
  newGame();
}
function setGameType(t) {
  S.gameType = t;
  btnGroup("gametype-group", t);
  const tg = document.getElementById("time-group");
  tg.style.opacity = (t==="zen"||t==="marathon") ? ".4" : "1";
  newGame();
}
function setTime(n) { S.timeLimit=n; btnGroup("time-group", String(n)); newGame(); }
function setSound(s) { S.sound=s; btnGroup("sound-group", s); }
function btnGroup(id, val) {
  document.querySelectorAll(`#${id} .cfg-btn`).forEach(b => b.classList.toggle("active", b.dataset.v===val));
}
function onCustomInput() { if (S.mode==="custom") newGame(); }

// ═══════════════════════════════════════════════════════════
//  TEXT GENERATION
// ═══════════════════════════════════════════════════════════
function generateText() {
  if (S.mode==="custom") {
    const t = document.getElementById("custom-text").value.trim();
    return t || "Entre ton texte dans la zone ci-dessus pour commencer.";
  }
  const pool = BANK[S.mode] || BANK.words;
  if (S.gameType==="marathon") {
    let r="";
    while (r.length < 600) r += (r?" ":"") + pool[Math.floor(Math.random()*pool.length)];
    return r;
  }
  if (S.mode==="words"||S.mode==="words-en"||S.mode==="numbers") {
    let r="";
    while(r.length<220) r+=(r?" ":"")+pool[Math.floor(Math.random()*pool.length)];
    return r.slice(0,260);
  }
  return pool[Math.floor(Math.random()*pool.length)];
}

// ═══════════════════════════════════════════════════════════
//  RENDER TEXT
// ═══════════════════════════════════════════════════════════
function renderText() {
  const d = document.getElementById("text-display");
  d.innerHTML = S.chars.map((c,i)=>`<span class="ch ${i===0?"cur":"todo"}" data-i="${i}">${c===" "?"&nbsp;":c}</span>`).join("");
}
function updateChars() {
  document.querySelectorAll(".ch").forEach((el,i)=>{
    el.className="ch";
    if(i<S.charIndex) el.classList.add(S.typed[i]===S.chars[i]?"ok":"ng");
    else if(i===S.charIndex) el.classList.add("cur");
    else el.classList.add("todo");
  });
  // scroll current into view
  const cur=document.querySelector(".ch.cur");
  if(cur) cur.scrollIntoView({block:"nearest",behavior:"smooth"});
}

// ═══════════════════════════════════════════════════════════
//  GAME FLOW
// ═══════════════════════════════════════════════════════════
function focusInput() { document.getElementById("typing-input").focus(); }

function onKeydown(e) {
  if(e.key==="Escape"){ newGame(); return; }
  if(e.key==="Tab"){ e.preventDefault(); newText(); return; }
}

function onInput() {
  const inp = document.getElementById("typing-input");
  const val = inp.value;
  if (!val.length) return;

  if (!S.started) startGame();
  if (S.finished) { inp.value=""; return; }

  // backspace
  if (val.length < S.typed.length) {
    S.typed.pop();
    S.charIndex = Math.max(0, S.charIndex-1);
    updateChars(); updateLive(); updateProgress();
    return;
  }

  const ch = val[val.length-1];
  S.typed.push(ch);
  const expected = S.chars[S.charIndex];

  if (ch !== expected) {
    S.errors++;
    S.keyErrors[expected] = (S.keyErrors[expected]||0)+1;
    playClick(S.sound, true);
    inp.classList.add("shake");
    setTimeout(()=>inp.classList.remove("shake"),300);

    // Sudden death
    if (S.gameType==="sudden") { flashDeath(); finish(); return; }
  } else {
    playClick(S.sound, false);
  }

  S.charIndex++;
  S.totalTyped++;
  updateChars(); updateLive(); updateProgress();
  if(S.charIndex>=S.chars.length) finish();
}

function startGame() {
  S.started=true; S.startTime=Date.now();
  document.getElementById("overlay").classList.add("gone");
  document.getElementById("results").classList.remove("show");
  if(S.gameType==="timed") document.getElementById("ring-wrap").classList.add("show");

  S.timer = setInterval(()=>{
    S.elapsed=(Date.now()-S.startTime)/1000;
    const rem = Math.max(0, S.timeLimit-S.elapsed);

    if(S.gameType==="timed"||S.gameType==="sudden") {
      document.getElementById("sv-time").textContent=Math.ceil(rem)+"s";
      const frac=rem/S.timeLimit;
      const ring=document.getElementById("ring-fg");
      ring.style.strokeDashoffset=119*(1-frac);
      ring.style.stroke=frac>.4?"var(--accent)":frac>.2?"var(--warn)":"var(--err)";
      if(rem<=0){ finish(); return; }
    } else {
      document.getElementById("sv-time").textContent=Math.floor(S.elapsed)+"s";
    }

    const wpm=calcWpm();
    S.wpmHistory.push({t:Math.round(S.elapsed), wpm});
    drawLiveGraph();
    updateLive();
  },200);
}

function calcWpm() {
  const elapsed=(Date.now()-S.startTime)/1000;
  const mins=elapsed/60;
  const correct=S.typed.filter((c,i)=>c===S.chars[i]).length;
  return mins>0?Math.round(correct/5/mins):0;
}

function updateLive() {
  if(!S.started) return;
  const wpm=calcWpm();
  const acc=S.totalTyped>0?Math.round((S.totalTyped-S.errors)/S.totalTyped*100):100;
  document.getElementById("sv-wpm").textContent=wpm;
  document.getElementById("sv-acc").textContent=acc+"%";
  document.getElementById("sv-err").textContent=S.errors;
  document.getElementById("sv-chars").textContent=S.typed.filter((c,i)=>c===S.chars[i]).length;
  const accEl=document.getElementById("sv-acc");
  accEl.className="lstat-val"+(acc>=95?" ok":acc>=80?"":" err");
}

function updateProgress() {
  document.getElementById("progress").style.width=(S.charIndex/S.chars.length*100)+"%";
}

// ═══════════════════════════════════════════════════════════
//  LIVE WPM GRAPH
// ═══════════════════════════════════════════════════════════
let liveCtx=null, liveData=[];
function drawLiveGraph() {
  const canvas=document.getElementById("wpm-canvas");
  if(!canvas) return;
  canvas.width=canvas.offsetWidth; canvas.height=40;
  const ctx=canvas.getContext("2d");
  const pts=S.wpmHistory.slice(-60);
  if(pts.length<2){ctx.clearRect(0,0,canvas.width,canvas.height);return;}
  const maxW=Math.max(...pts.map(p=>p.wpm),10);
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  const grad=ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0,"rgba(124,106,247,.4)");
  grad.addColorStop(1,"rgba(124,106,247,.0)");
  ctx.beginPath();
  pts.forEach((p,i)=>{
    const x=i/(pts.length-1)*w;
    const y=h-p.wpm/maxW*(h-4)-2;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.strokeStyle="var(--accent)";ctx.lineWidth=2;ctx.stroke();
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fillStyle=grad;ctx.fill();
}

// ═══════════════════════════════════════════════════════════
//  FINISH
// ═══════════════════════════════════════════════════════════
function finish() {
  if(S.finished) return;
  S.finished=true;
  clearInterval(S.timer);
  document.getElementById("ring-wrap").classList.remove("show");

  const elapsed=(Date.now()-S.startTime)/1000;
  const correct=S.typed.filter((c,i)=>c===S.chars[i]).length;
  const wpm=Math.round(correct/5/(elapsed/60));
  const acc=S.totalTyped>0?Math.round((S.totalTyped-S.errors)/S.totalTyped*100):100;

  // Show results
  animNum("res-wpm",wpm);
  document.getElementById("res-acc").textContent=acc+"%";
  document.getElementById("res-chars").textContent=correct;
  document.getElementById("res-errs").textContent=S.errors;
  document.getElementById("res-time").textContent=Math.round(elapsed)+"s";
  document.getElementById("results").classList.add("show");

  // Record check
  const bestWpm=Math.max(0,...S.history.map(h=>h.wpm));
  const isRecord=wpm>bestWpm&&S.totalTyped>5;
  if(isRecord) {
    document.getElementById("record-badge").classList.add("show");
    launchConfetti();
  } else {
    document.getElementById("record-badge").classList.remove("show");
  }

  // WPM result chart
  drawResultChart();
  // Heatmap
  buildHeatmap();

  // Save history
  const entry={wpm,acc,errors:S.errors,chars:correct,mode:S.mode,type:S.gameType,elapsed:Math.round(elapsed),date:new Date().toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})};
  S.history.unshift(entry);
  if(S.history.length>50) S.history=S.history.slice(0,50);
  localStorage.setItem("typerush_history",JSON.stringify(S.history));
  renderHistory();

  document.getElementById("typing-input").disabled=true;
}

function animNum(id,target) {
  const el=document.getElementById(id);
  let cur=0;const step=Math.max(1,Math.round(target/25));
  const iv=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur;if(cur>=target)clearInterval(iv);},16);
}

// ═══════════════════════════════════════════════════════════
//  CHARTS
// ═══════════════════════════════════════════════════════════
const charts={};
function destroyChart(id){if(charts[id]){charts[id].destroy();delete charts[id];}}

function drawResultChart() {
  destroyChart("wpm-result");
  const ctx=document.getElementById("wpm-result-chart").getContext("2d");
  const pts=S.wpmHistory.filter((_,i)=>i%3===0);
  charts["wpm-result"]=new Chart(ctx,{
    type:"line",
    data:{
      labels:pts.map(p=>p.t+"s"),
      datasets:[{label:"WPM",data:pts.map(p=>p.wpm),borderColor:"var(--accent)",backgroundColor:"rgba(124,106,247,.1)",borderWidth:2,pointRadius:0,tension:.3,fill:true}]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:"var(--muted)",maxTicksLimit:8}},y:{ticks:{color:"var(--muted)"},beginAtZero:true}}}
  });
}

function renderStatsTab() {
  const hist=S.history;
  // Global stats
  const globalEl=document.getElementById("global-stats");
  if(!hist.length){ globalEl.innerHTML=`<p style="color:var(--muted);font-size:13px;grid-column:1/-1">Aucune donnée encore.</p>`; return; }
  const bestWpm=Math.max(...hist.map(h=>h.wpm));
  const avgWpm=Math.round(hist.reduce((a,h)=>a+h.wpm,0)/hist.length);
  const avgAcc=Math.round(hist.reduce((a,h)=>a+h.acc,0)/hist.length);
  globalEl.innerHTML=[
    ["Meilleur WPM",bestWpm,"ok"],["Moyenne WPM",avgWpm,""],["Précision moy.",avgAcc+"%",""],
  ].map(([l,v,c])=>`<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.9rem 1.1rem">
    <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${l}</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;${c?"color:var(--ok)":""}">${v}</div>
  </div>`).join("");

  // Progress chart
  destroyChart("progress");
  const last20=hist.slice(0,20).reverse();
  const ctx=document.getElementById("progress-chart").getContext("2d");
  charts["progress"]=new Chart(ctx,{
    type:"line",
    data:{
      labels:last20.map(h=>h.date.split(",")[0]),
      datasets:[{label:"WPM",data:last20.map(h=>h.wpm),borderColor:"var(--accent)",backgroundColor:"rgba(124,106,247,.08)",borderWidth:2,pointRadius:3,pointBackgroundColor:"var(--accent)",tension:.35,fill:true}]
    },
    options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:"var(--muted)",maxTicksLimit:8}},y:{ticks:{color:"var(--muted)"},beginAtZero:false}}}
  });

  // Top 10
  const sorted=[...hist].sort((a,b)=>b.wpm-a.wpm).slice(0,10);
  document.getElementById("top-grid").innerHTML=sorted.map((h,i)=>histRowHTML(h,i,i===0)).join("")||`<div class="no-hist">Aucun résultat</div>`;
}

// ═══════════════════════════════════════════════════════════
//  HEATMAP
// ═══════════════════════════════════════════════════════════
const QWERTY=[["a","z","e","r","t","y","u","i","o","p"],["q","s","d","f","g","h","j","k","l","m"],["w","x","c","v","b","n",",",".","-"]];
function buildHeatmap() {
  const maxErr=Math.max(1,...Object.values(S.keyErrors));
  const kb=document.getElementById("keyboard");
  kb.innerHTML=QWERTY.map(row=>`<div class="kb-row">${row.map(k=>{
    const err=S.keyErrors[k]||0;
    const heat=err===0?0:err<maxErr*.25?1:err<maxErr*.5?2:err<maxErr*.75?3:4;
    return `<div class="key" data-heat="${heat}" title="${k}: ${err} erreur(s)">${k.toUpperCase()}<span class="key-count">${err||""}</span></div>`;
  }).join("")}</div>`).join("");
}

// ═══════════════════════════════════════════════════════════
//  HISTORY
// ═══════════════════════════════════════════════════════════
function histRowHTML(h,i,best=false) {
  return `<div class="hrow">
    <span class="hrow-rank">#${i+1}</span>
    <div class="hrow-meta">
      <span class="hrow-info">${h.date} · ${h.elapsed}s</span>
    </div>
    <span class="hrow-mode">${h.mode} · ${h.type}</span>
    <span class="hrow-acc">${h.acc}%</span>
    ${best?`<span class="hrow-best">🏆</span>`:"<span></span>"}
    <span class="hrow-wpm">${h.wpm}</span>
  </div>`;
}

function renderHistory() {
  const el=document.getElementById("history-grid");
  if(!S.history.length){ el.innerHTML=`<div class="no-hist">Aucune partie jouée.</div>`; return; }
  const bestWpm=Math.max(...S.history.map(h=>h.wpm));
  el.innerHTML=S.history.slice(0,10).map((h,i)=>histRowHTML(h,i,h.wpm===bestWpm&&i===S.history.findIndex(x=>x.wpm===bestWpm))).join("");
}

// ═══════════════════════════════════════════════════════════
//  CONFETTI
// ═══════════════════════════════════════════════════════════
function launchConfetti() {
  const canvas=document.getElementById("confetti-canvas");
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  const ctx=canvas.getContext("2d");
  const colors=["#7c6af7","#4ade80","#fb923c","#f472b6","#38bdf8","#facc15"];
  const pieces=Array.from({length:120},()=>({
    x:Math.random()*canvas.width, y:-10,
    r:Math.random()*6+3, c:colors[Math.floor(Math.random()*colors.length)],
    vy:Math.random()*3+2, vx:(Math.random()-.5)*3,
    rot:Math.random()*360, vrot:(Math.random()-.5)*5
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vrot;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.c; ctx.fillRect(-p.r,-p.r,p.r*2,p.r*.6); ctx.restore();
    });
    frame++;
    if(frame<120) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}

// ═══════════════════════════════════════════════════════════
//  SUDDEN DEATH FLASH
// ═══════════════════════════════════════════════════════════
function flashDeath() {
  const el=document.getElementById("death-flash");
  el.style.opacity=".4";
  setTimeout(()=>el.style.opacity="0",150);
}

// ═══════════════════════════════════════════════════════════
//  GAME RESET
// ═══════════════════════════════════════════════════════════
function newGame() {
  clearInterval(S.timer);
  S.text=S.currentText||generateText();
  S.currentText=S.text;
  resetGameState();
}
function newText() {
  S.currentText=generateText();
  newGame();
}
function resetGameState() {
  S.chars=S.text.split("");
  S.typed=[]; S.charIndex=0;
  S.started=false; S.finished=false;
  S.startTime=null; S.elapsed=0;
  S.errors=0; S.totalTyped=0;
  S.wpmHistory=[]; S.keyErrors={};

  const inp=document.getElementById("typing-input");
  inp.value=""; inp.disabled=false;

  ["sv-wpm","sv-acc","sv-err","sv-chars"].forEach(id=>{ const el=document.getElementById(id); if(el)el.textContent="—"; });
  document.getElementById("sv-err").textContent="0";
  document.getElementById("sv-time").textContent=(S.gameType==="zen"||S.gameType==="marathon")?"∞":S.timeLimit+"s";
  document.getElementById("progress").style.width="0%";
  document.getElementById("results").classList.remove("show");
  document.getElementById("overlay").classList.remove("gone");
  document.getElementById("ring-wrap").classList.remove("show");
  document.getElementById("ring-fg").style.strokeDashoffset="0";

  // clear live graph
  const canvas=document.getElementById("wpm-canvas");
  if(canvas){canvas.width=canvas.offsetWidth;canvas.getContext("2d").clearRect(0,0,canvas.width,40);}

  renderText();
  renderHistory();
}

// ═══════════════════════════════════════════════════════════
//  MULTIPLAYER
// ═══════════════════════════════════════════════════════════
const M={started:false,finished:false,startTime:null,timer:null,
  p1:{typed:[],errors:0,total:0,chars:[]},
  p2:{typed:[],errors:0,total:0,chars:[]}};

function initMulti() {
  const text=generateText();
  M.p1.chars=text.split(""); M.p2.chars=text.split("");
  renderPlayerText(1); renderPlayerText(2);
  M.started=false; M.finished=false;
  document.getElementById("p1-input").disabled=true;
  document.getElementById("p2-input").disabled=true;
  document.getElementById("p1-card").classList.remove("winner");
  document.getElementById("p2-card").classList.remove("winner");
}

function startMulti() {
  initMulti();
  M.started=true; M.startTime=Date.now();
  document.getElementById("p1-input").disabled=false;
  document.getElementById("p2-input").disabled=false;
  document.getElementById("p1-input").focus();
  M.timer=setInterval(()=>{
    updateMultiWpm(1); updateMultiWpm(2);
  },300);
}

function resetMulti(){clearInterval(M.timer);initMulti();}

function renderPlayerText(p) {
  const chars=M[`p${p}`].chars;
  document.getElementById(`p${p}-text`).innerHTML=chars.map((c,i)=>`<span class="ch ${i===0?"cur":"todo"}">${c===" "?"&nbsp;":c}</span>`).join("");
}

function updatePlayerChars(p) {
  const player=M[`p${p}`];
  const spans=document.querySelectorAll(`#p${p}-text .ch`);
  spans.forEach((el,i)=>{
    el.className="ch";
    if(i<player.typed.length) el.classList.add(player.typed[i]===player.chars[i]?"ok":"ng");
    else if(i===player.typed.length) el.classList.add("cur");
    else el.classList.add("todo");
  });
}

function onMultiInput(p) {
  if(!M.started||M.finished) return;
  const player=M[`p${p}`];
  const inp=document.getElementById(`p${p}-input`);
  const val=inp.value;

  if(val.length<player.typed.length){player.typed.pop();updatePlayerChars(p);updateMultiProg(p);return;}
  const ch=val[val.length-1];
  player.typed.push(ch);
  if(ch!==player.chars[player.typed.length-1]) player.errors++;
  player.total++;
  updatePlayerChars(p);
  updateMultiProg(p);
  if(player.typed.length>=player.chars.length) finishMulti(p);
}

function updateMultiProg(p) {
  const player=M[`p${p}`];
  const pct=player.typed.length/player.chars.length*100;
  document.getElementById(`p${p}-prog`).style.width=pct+"%";
}

function updateMultiWpm(p) {
  const player=M[`p${p}`];
  const elapsed=(Date.now()-M.startTime)/60000;
  const correct=player.typed.filter((c,i)=>c===player.chars[i]).length;
  const wpm=elapsed>0?Math.round(correct/5/elapsed):0;
  document.getElementById(`p${p}-wpm`).textContent=wpm+" WPM";
}

function finishMulti(winnerP) {
  if(M.finished) return;
  M.finished=true;
  clearInterval(M.timer);
  document.getElementById(`p${winnerP}-card`).classList.add("winner");
  document.getElementById("p1-input").disabled=true;
  document.getElementById("p2-input").disabled=true;
  launchConfetti();
}

// ═══════════════════════════════════════════════════════════
//  BIGRAM ANALYSIS (bonus: logged to console)
// ═══════════════════════════════════════════════════════════
// Tracked automatically via keyErrors — could be extended

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
newText();
renderHistory();
