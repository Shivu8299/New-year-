// --- TWINKLE & FIREWORK ---
const sC = document.getElementById('star-canvas');
const fC = document.getElementById('firework-canvas');
const sX = sC.getContext('2d');
const fX = fC.getContext('2d');

sC.width = fC.width = window.innerWidth;
sC.height = fC.height = window.innerHeight;

let stars = [];
for(let i=0; i<150; i++) stars.push({ x: Math.random()*sC.width, y: Math.random()*sC.height, r: Math.random()*1.5, a: Math.random() });

function drawS() {
    sX.clearRect(0,0,sC.width,sC.height);
    stars.forEach(s => {
        sX.fillStyle = `rgba(255,255,255,${s.a})`;
        sX.beginPath(); sX.arc(s.x, s.y, s.r, 0, Math.PI*2); sX.fill();
        s.a += (Math.random()-0.5)*0.05;
        if(s.a<0) s.a=0; if(s.a>1) s.a=1;
    });
    requestAnimationFrame(drawS);
}
drawS();

let rocket = { x: fC.width/2, y: fC.height, tY: fC.height/2.5, active: true };
let parts = [];

function animateF() {
    fX.clearRect(0,0,fC.width,fC.height);
    if(rocket.active) {
        fX.fillStyle = "#f4c430";
        fX.beginPath(); fX.arc(rocket.x, rocket.y, 3, 0, Math.PI*2); fX.fill();
        rocket.y -= 7;
        if(rocket.y <= rocket.tY) {
            rocket.active = false;
            for(let i=0; i<80; i++) parts.push({ x: rocket.x, y: rocket.y, angle: Math.random()*Math.PI*2, spd: Math.random()*5+2, a: 1 });
            setTimeout(() => document.getElementById('intro-content').classList.add('visible-content'), 500);
        }
    }
    parts.forEach((p, i) => {
        p.x += Math.cos(p.angle)*p.spd; p.y += Math.sin(p.angle)*p.spd;
        p.a -= 0.015; p.spd *= 0.96;
        fX.fillStyle = `rgba(244, 196, 48, ${p.a})`;
        fX.beginPath(); fX.arc(p.x, p.y, 2, 0, Math.PI*2); fX.fill();
        if(p.a <= 0) parts.splice(i, 1);
    });
    requestAnimationFrame(animateF);
}
animateF();

// --- NAVIGATION ---
function goToScene(n) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(`scene-${n}`).classList.add('active');
    if(n === 7) startLoading();
    if(n === 9) startTypewriter();
    if(n !== 4) player.pause();
}

// --- MUSIC PLAYER ---
const player = document.getElementById('player');
function toggleMusic(src, el) {
    if(!player.paused && player.src.includes(src)) {
        player.pause();
        el.classList.remove('shaking');
    } else {
        document.querySelectorAll('.cassette-player').forEach(c => c.classList.remove('shaking'));
        player.src = src;
        player.play();
        el.classList.add('shaking');
        startWave(el);
    }
}

function startWave(el) {
    const cvs = el.querySelector('.wave-c');
    const ctx = cvs.getContext('2d');
    let off = 0;
    function d() {
        if(!el.classList.contains('shaking')) return;
        ctx.clearRect(0,0,cvs.width,cvs.height);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for(let x=0; x<cvs.width; x++) ctx.lineTo(x, 15 + Math.sin(x*0.1 + off)*8);
        ctx.stroke();
        off += 0.15;
        requestAnimationFrame(d);
    }
    d();
}

// --- LOADING ---
function startLoading() {
    let p = 0;
    const bar = document.getElementById('loadBar');
    const txt = document.getElementById('loadText');
    const inv = setInterval(() => {
        if(p>=100) { clearInterval(inv); setTimeout(() => goToScene(8), 500); }
        else { p++; bar.style.width = p+'%'; txt.innerText = p+'%'; }
    }, 40);
}

// --- TYPEWRITER ---
function startTypewriter() {
    const text = "Happy New Year Anushka! May 2026 be kind, exciting, and full of opportunities 🌟";
    const el = document.getElementById('finalTypewriter');
    let i = 0;
    function t() {
        if(i < text.length) { el.innerHTML += text.charAt(i); i++; setTimeout(t, 60); }
        else { document.getElementById('restartBtn').style.opacity = "1"; }
    }
    t();
}
