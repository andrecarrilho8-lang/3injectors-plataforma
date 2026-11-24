(function(){
'use strict';
/* Link de compra da inscrição. Preencha aqui e o botão da seção de inscrição passa a usá-lo. */
const PURCHASE_URL = '';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch  = matchMedia('(hover: none)').matches || window.innerWidth < 860;
const lerp = (a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smoothing = reduce ? 1 : (touch ? 0.34 : 0.14);
const S = Object.create(null);
function ease(key,to){ const f=S[key]; S[key]=(f===undefined)?to:lerp(f,to,smoothing); return S[key]; }

const $=id=>document.getElementById(id);
const nav=$('nav'), prog=$('prog');
const heroSec=document.querySelector('.hero'), heroMedia=$('heroMedia'), heroCopy=$('heroCopy'),
      heroVeil=$('heroVeil'), heroNames=$('heroNames'), scrollHint=document.querySelector('.scroll-hint');
const mosaic=$('mosaic'), mrows=[...document.querySelectorAll('.mrow')];
const trioSec=$('trio'), trioMedia=$('trioMedia'), trioSweep=$('trioSweep'), trioLine=$('trioLine'), trioHead=$('trioHead');
const tns=[...document.querySelectorAll('.tn')];
const mobile=()=>innerWidth<=760;
const mbar=$('mbar');
if(mobile()){ const hs=document.querySelector('.hero-strip .inner'); if(hs) hs.innerHTML+='<span class="dot"></span>'+hs.innerHTML+'<span class="dot"></span>'; }
/* posiciona cada nome embaixo da pessoa, respeitando o recorte do object-fit:cover */
function placeNames(){
  if(!trioSec) return;
  if(mobile()){ tns.forEach(t=>{ t.style.removeProperty('--l'); t.style.removeProperty('--t'); }); return; }
  const st=trioSec.querySelector('.trio-stage'), w=st.clientWidth, h=st.clientHeight, ar=1400/788;
  let W,H,ox,oy;
  if(w/h>ar){ W=w; H=w/ar; ox=0; oy=(H-h)*0.30; } else { H=h; W=h*ar; oy=0; ox=(W-w)*0.5; }
  tns.forEach(t=>{ t.style.setProperty('--l',(+t.dataset.x*W-ox)+'px'); t.style.setProperty('--t',(+t.dataset.y*H-oy)+'px'); });
  /* a frase fica sempre abaixo do nome mais baixo; se não couber, sobe os nomes */
  const maxB=Math.max(...tns.map(t=>t.offsetTop+t.offsetHeight));
  const lh=trioLine.offsetHeight, gap=Math.max(24,h*0.035), limit=h-lh-Math.max(28,h*0.05);
  let lineTop=maxB+gap;
  if(lineTop>limit){ const d=lineTop-limit; tns.forEach(t=>t.style.setProperty('--t',(parseFloat(t.style.getPropertyValue('--t'))-d)+'px')); lineTop=limit; }
  trioLine.style.top=lineTop+'px'; trioLine.style.bottom='auto';
}
placeNames(); addEventListener('resize',placeNames); addEventListener('load',placeNames);
if(document.fonts) document.fonts.ready.then(placeNames);
const slist=$('slist'), srail=$('srailfill');
const liveImg=$('liveImg'), closeImg=$('closeImg'), manBg=$('manBg');
const man=$('manifesto');
const pxEls=[...document.querySelectorAll('.px')];

/* faixa de fotos: duplica a trilha para o loop não ter emenda */
document.querySelectorAll('.mq-track,.vtrack,.htrack2').forEach(t=>{ t.innerHTML+=t.innerHTML; });
let manWords=[];

function progressOf(el){
  const r=el.getBoundingClientRect(), total=r.height-innerHeight;
  if(total<=0) return clamp(-r.top/Math.max(r.height,1),0,1);
  return clamp(-r.top/total,0,1);
}
function centerProgress(el){
  const r=el.getBoundingClientRect();
  return clamp(1-(r.top-innerHeight*0.15)/(innerHeight+r.height),0,1);
}

function render(){
  const y=scrollY, docH=document.documentElement.scrollHeight;
  nav.classList.toggle('stuck', y>40);
  prog.style.transform='scaleX('+clamp(y/Math.max(docH-innerHeight,1),0,1)+')';

  if(heroSec && !mobile()){
    const p=ease('hero',progressOf(heroSec)), e=p*p;
    if(mosaic){
      mosaic.style.transform='scale('+(1.08-p*0.08)+')';
      mosaic.style.filter='brightness('+(0.7+p*0.4).toFixed(3)+') saturate('+(0.8+p*0.3).toFixed(3)+')';
      mrows.forEach((r,i)=>{ const d=+r.dataset.dir||1; r.style.transform='translate3d('+(d*(p*90-45))+'px,0,0)'; });
    }
    if(heroMedia){ heroMedia.style.transform='scale('+(1.12-p*0.12)+') translate3d(0,'+(p*-16)+'px,0)';
    heroMedia.style.filter='blur('+((1-p)*4.5).toFixed(2)+'px) saturate('+(0.78+p*0.34).toFixed(3)+
      ') brightness('+(0.84+p*0.30).toFixed(3)+') contrast('+(0.96+p*0.10).toFixed(3)+')'; }
    if(heroVeil) heroVeil.style.opacity=(1-p*0.88).toFixed(3);
    heroCopy.style.transform='translate3d(0,'+(p*-104)+'px,0) scale('+(1-p*0.07)+')';
    heroCopy.style.filter='blur('+(e*17)+'px)';
    heroCopy.style.opacity=String(clamp(1-p*1.7,0,1));
    const np=clamp((p-0.46)/0.32,0,1);
    if(heroNames){ heroNames.style.opacity=np.toFixed(3); heroNames.style.transform='translate3d(0,'+((1-np)*26)+'px,0)'; }
    if(scrollHint) scrollHint.style.opacity=clamp(0.5-p*1.6,0,1).toFixed(3);
  }

  if(trioSec && !mobile()){
    const p=ease('trio',progressOf(trioSec));
    const a=clamp(p/0.45,0,1);
    trioMedia.style.transform='scale('+(1.22-a*0.22).toFixed(4)+')';
    trioMedia.style.filter='blur('+((1-a)*9).toFixed(2)+'px) brightness('+(0.38+a*0.62).toFixed(3)+') saturate('+(0.7+a*0.35).toFixed(3)+')';
    const sw=clamp((p-0.18)/0.4,0,1);
    trioSweep.style.opacity=(Math.sin(sw*Math.PI)*0.9).toFixed(3);
    trioSweep.style.transform='translate3d('+(-30+sw*60)+'%,0,0)';
    tns.forEach((t,i)=>{
      const q=clamp((p-0.34-i*0.08)/0.16,0,1);
      t.style.opacity=q.toFixed(3); t.style.filter='blur('+((1-q)*10).toFixed(2)+'px)';
      t.style.transform='translate(-50%,'+((1-q)*24).toFixed(1)+'px)';
      t.classList.toggle('on',q>0.9);
    });
    const lq=clamp((p-0.66)/0.16,0,1);
    trioLine.style.opacity=lq.toFixed(3); trioLine.style.transform='translate3d(0,'+((1-lq)*20)+'px,0)';
  }
  if(mbar){ const ins=$('inscricao').getBoundingClientRect(); mbar.classList.toggle('on', mobile() && y>innerHeight*0.9 && !(ins.top<innerHeight && ins.bottom>0)); }
  if(slist && srail){
    const r=slist.getBoundingClientRect();
    const p=ease('rail',clamp((innerHeight*0.72-r.top)/r.height,0,1));
    srail.style.transform='scaleY('+p+')';
    slist.querySelectorAll('[data-step]').forEach(s=>s.classList.toggle('dim', s.getBoundingClientRect().top>innerHeight*0.72));
  }

  if(liveImg){ const p=ease('li',centerProgress(liveImg)); liveImg.style.transform='scale(1.12) translate3d(0,'+((0.5-p)*54)+'px,0)'; }
  if(closeImg){ const p=ease('cl',centerProgress(closeImg)); closeImg.style.transform='scale(1.14) translate3d(0,'+((0.5-p)*70)+'px,0)'; }
  pxEls.forEach((el,i)=>{ const p=ease('px'+i,centerProgress(el.parentElement)); el.style.transform='translate3d(0,'+((0.5-p)*80)+'px,0)'; });
  if(manBg){ const p=ease('mb',centerProgress(manBg)); manBg.style.transform='scale('+(1.05+p*0.12)+') translate3d(0,'+((0.5-p)*90)+'px,0)'; }

  if(manWords.length){
    const r=man.getBoundingClientRect();
    const p=clamp((innerHeight*0.84-r.top)/(r.height+innerHeight*0.36),0,1);
    const n=Math.round(p*manWords.length*1.3);
    for(let i=0;i<manWords.length;i++) manWords[i].classList.toggle('lit', i<n);
  }
}
(function raf(){ render(); requestAnimationFrame(raf); })();
addEventListener('resize',render);

/* reveal */
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{rootMargin:'0px 0px -12% 0px',threshold:.08});
document.querySelectorAll('[data-anim],[data-rule]').forEach(el=>io.observe(el));

addEventListener('load',()=>heroSec.classList.add('ready'));
setTimeout(()=>heroSec.classList.add('ready'),260);

/* manifesto: palavra por palavra, "a sério" em dourado */
if(man){
  const words=man.textContent.trim().split(/\s+/);
  man.innerHTML=words.map((w,i)=>'<span class="w'+(i>=words.length-2?' acc':'')+'">'+w+'</span>').join(' ');
  manWords=Array.prototype.slice.call(man.querySelectorAll('.w'));
}

/* contadores, com separador de milhar */
const fmt=n=>n.toLocaleString('pt-BR');
const cio=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target, end=+el.dataset.count, suf=el.dataset.suffix||'', t0=performance.now(), dur=1500;
    (function tick(t){
      const p=clamp((t-t0)/dur,0,1);
      el.textContent=fmt(Math.round(end*(1-Math.pow(1-p,3))))+(p===1?suf:'');
      if(p<1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

/* FAQ */
document.querySelectorAll('.fitem').forEach(item=>{
  const btn=item.querySelector('.fq'), pan=item.querySelector('.fa'), inner=pan.querySelector('.in');
  btn.addEventListener('click',()=>{
    const open=item.classList.contains('open');
    document.querySelectorAll('.fitem.open').forEach(o=>{ o.classList.remove('open'); o.querySelector('.fa').style.height='0px'; });
    if(!open){ item.classList.add('open'); pan.style.height=inner.offsetHeight+'px'; }
  });
});

/* link de compra */
const bb=$('buyBtn');
if(bb && PURCHASE_URL){ bb.href=PURCHASE_URL; bb.target='_blank'; bb.rel='noopener'; }

/* âncoras */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',ev=>{
    const id=a.getAttribute('href'); if(id==='#') { ev.preventDefault(); return; }
    const el=document.querySelector(id); if(!el) return;
    ev.preventDefault();
    scrollTo({top:el.getBoundingClientRect().top+scrollY-70, behavior:'smooth'});
  });
});

/* galeria: lightbox */
const items=[...document.querySelectorAll('#gal .gi')], lb=$('lb');
if(items.length && lb){
  const img=lb.querySelector('img'), cap=lb.querySelector('.cap');
  let cur=0;
  const show=i=>{ cur=(i+items.length)%items.length; const src=items[cur].querySelector('img');
    img.src=src.src; img.alt=src.alt; cap.textContent=items[cur].querySelector('figcaption').textContent; };
  const open=i=>{ show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); };
  const close=()=>{ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); };
  items.forEach((it,i)=>{
    it.addEventListener('click',()=>open(i));
    it.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(i); } });
  });
  lb.querySelector('.x').addEventListener('click',close);
  lb.querySelector('.pv').addEventListener('click',e=>{ e.stopPropagation(); show(cur-1); });
  lb.querySelector('.nx').addEventListener('click',e=>{ e.stopPropagation(); show(cur+1); });
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  addEventListener('keydown',e=>{ if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close(); if(e.key==='ArrowLeft') show(cur-1); if(e.key==='ArrowRight') show(cur+1); });
}
})();
