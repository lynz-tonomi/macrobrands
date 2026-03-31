(function(){if(window._macroVersion>=18)return;window._macroVersion=18;
/* MACRO Brands — Master Site Script v18.1 (no scaffold — native Webflow content) */
(function run(){
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);return;}

// Disable Webflow Interactions (IX2) on homepage — conflicts with GSAP scroll handlers
if(window.location.pathname==='/'||window.location.pathname==='/index.html'){
  try{if(window.Webflow&&window.Webflow.require){window.Webflow.require('ix2').destroy()}}catch(e){}
}

// ============ 1. FRAME SCRUBBER ============
(function(){
  var w=document.querySelector('.video-hero-wrap');
  var s=document.querySelector('.video-hero-sticky');
  if(!w||!s)return;
  // Set hero height: 850 frames × 5px per frame + 1 viewport = exact end on last frame
  var fh=850*5+window.innerHeight;
  w.style.height=fh+'px';
  var c=document.createElement('canvas');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1';
  s.appendChild(c);
  var ctx=c.getContext('2d');
  var tot=850;
  var base='https://lynz-tonomi.github.io/macrobrands/frames/frame_';
  var imgs=new Array(tot);
  function pad(n){return('0000'+n).slice(-4)}
  // Lazy loader — only fetch frames near current scroll position (not all 850 at once)
  var loadedSet={};
  var loadBuf=40;
  function loadFrame(idx){
    if(idx<0||idx>=tot||loadedSet[idx])return;
    loadedSet[idx]=true;
    var img=new Image();
    img.onload=function(){imgs[idx]=img;if(idx===0)draw(0)};
    img.src=base+pad(idx+1)+'.jpg';
  }
  function loadRange(center){
    for(var j=Math.max(0,center-loadBuf);j<Math.min(tot,center+loadBuf);j++)loadFrame(j);
  }
  // Load first 20 frames immediately for fast first paint
  for(var i=0;i<20;i++)loadFrame(i);
  function draw(idx){
    if(!imgs[idx]||!imgs[idx].complete)return;
    c.width=s.offsetWidth;c.height=s.offsetHeight;
    var iw=imgs[idx].width,ih=imgs[idx].height;
    var sc=Math.max(c.width/iw,c.height/ih);
    var nw=iw*sc,nh=ih*sc;
    ctx.drawImage(imgs[idx],(c.width-nw)/2,(c.height-nh)/2,nw,nh);
  }
  var vm=s.querySelector('.video-hero-media');if(vm)vm.style.display='none';
  function up(){
    var h=window.innerHeight;var p=window.scrollY/(w.offsetHeight-h);
    if(p<0)p=0;if(p>1)p=1;
    var idx=Math.min(Math.floor(p*tot),tot-1);loadRange(idx);draw(idx);
  }
  window.addEventListener('scroll',up,{passive:true});
  window.addEventListener('resize',up);up();
})();

// ============ 2. HERO ANIMATION (logo + fade overlays) ============
(function(){
  var s=document.querySelector('.video-hero-sticky');
  var w=document.querySelector('.video-hero-wrap');
  if(!s||!w)return;
  var all=document.querySelectorAll('.hero-logo');
  var lg=null;
  all.forEach(function(l){if(!lg&&l.closest('.video-hero-wrap')){lg=l;l.remove();s.appendChild(l)}});
  all.forEach(function(l){if(l!==lg)l.style.display='none'});
  var nl=document.querySelector('.nav-logo');
  var fn=null; // will be looked up dynamically since it's created later
  var ob=document.createElement('div');
  ob.style.cssText='position:absolute;inset:0;background:#000;z-index:10;pointer-events:none;opacity:1';
  s.appendChild(ob);
  var ow=document.createElement('div');
  ow.style.cssText='position:absolute;inset:0;background:#000;z-index:10;pointer-events:none;opacity:0';
  s.appendChild(ow);
  if(lg){
    lg.style.cssText='position:absolute;z-index:20;width:42vw;max-width:550px;filter:brightness(0) invert(1);transform-origin:center center;opacity:0;transition:opacity 1.2s ease-out';
    // Fade in the logo on page load
    setTimeout(function(){lg.style.opacity='1'},100);
  }
  if(nl)nl.style.opacity='0';
  if(fn){fn.style.opacity='0';fn.style.transform='translateX(-50%) translateY(20px)'}
  function u(){
    var h=window.innerHeight;var ms=w.offsetHeight-h;if(ms<=0)return;
    var p=window.scrollY/ms;if(p<0)p=0;if(p>1)p=1;
    ob.style.opacity=p<.05?String(1-p*20):'0';
    ow.style.opacity=p>.96?String((p-.96)*25):'0';
    // Look up floating nav dynamically (created after this section runs)
    if(!fn)fn=document.querySelector('.mb-floating-nav');
    if(!lg)return;
    var nr=nl?nl.getBoundingClientRect():null;
    var nCx=nr?nr.left+nr.width/2:window.innerWidth/2;
    var nCy=nr?nr.top+nr.height/2:36;
    var nW=nr?nr.width:189;
    var lgW=lg.offsetWidth||550;
    var endSc=nW/lgW;
    var startCy=h*.75;
    var lp=Math.min(p/.08,1);lp=lp*lp*(3-2*lp);
    var sc=1-(1-endSc)*lp;
    var cx=window.innerWidth/2;
    lg.style.left=String(cx+(nCx-cx)*lp)+'px';
    lg.style.top=String(startCy+(nCy-startCy)*lp)+'px';
    lg.style.transform='translate(-50%,-50%) scale('+sc+')';
    lg.style.filter='brightness(0) invert(1)';
    if(p<.085){
      lg.style.opacity='1';lg.style.display='block';
      if(nl)nl.style.opacity='0';
      if(fn){var np=Math.min(lp*1.2,1);fn.style.opacity=String(np);fn.style.transform='translateX(-50%) translateY('+String(20*(1-np))+'px)'}
    }else if(p<.10){
      var fo=(p-.085)/.015;lg.style.opacity=String(1-fo);
      if(nl)nl.style.opacity=String(fo);
      if(fn){fn.style.opacity='1';fn.style.transform='translateX(-50%) translateY(0)'}
    }else{
      lg.style.opacity='0';lg.style.display='none';
      // Don't set opacity here — let overAI check below handle it
    }
    // Detect if nav logo is over a light section (hardcoded IDs)
    var lightIds=['about','certifications','faq','who-we-serve'];
    function isOverLight(yPos){
      for(var li=0;li<lightIds.length;li++){
        var el=document.getElementById(lightIds[li]);
        if(!el)continue;
        var r=el.getBoundingClientRect();
        if(yPos>=r.top&&yPos<=r.bottom)return true;
      }
      // Also check section-light class elements without IDs
      var sls=document.querySelectorAll('.section-light:not([id])');
      for(var si=0;si<sls.length;si++){
        var r2=sls[si].getBoundingClientRect();
        if(yPos>=r2.top&&yPos<=r2.bottom)return true;
      }
      return false;
    }
    // Check if over Autonomi AI section — hide nav
    var aiEl=document.getElementById('autonomi-ai');
    var overAI=false;
    if(aiEl){var aiR=aiEl.getBoundingClientRect();overAI=aiR.top<100&&aiR.bottom>100}
    if(nl&&p>=.10){
      var logoY=nl.getBoundingClientRect().top+nl.offsetHeight/2;
      var light=isOverLight(logoY);
      nl.style.filter=light?'brightness(0)':'brightness(0) invert(1)';
      nl.style.transition='filter .3s,opacity .3s';
      nl.style.opacity=overAI?'0':'1';
    }
    if(fn&&p>=.10){
      var navY=fn.getBoundingClientRect().top;
      var navLight=isOverLight(navY);
      fn.style.background=navLight?'rgba(255,255,255,.85)':'rgba(20,20,20,.9)';
      fn.style.transition='background .3s,opacity .3s,transform .3s';
      fn.querySelectorAll('a:not([href="/contact"])').forEach(function(a){a.style.color=navLight?'#333':'#ccc'});
      if(overAI){fn.style.opacity='0';fn.style.transform='translateX(-50%) translateY(20px)'}
      else{fn.style.opacity='1';fn.style.transform='translateX(-50%) translateY(0)'}
    }
  }
  window.addEventListener('scroll',u,{passive:true});
  requestAnimationFrame(function(){requestAnimationFrame(u)});
})();

// ============ 3. SCROLL SEGMENT TITLES ============
(function(){
  var s=document.querySelector('.video-hero-sticky');
  var w=document.querySelector('.video-hero-wrap');
  if(!s||!w)return;
  var old=document.getElementById('seg-wrap');if(old)old.remove();
  var wrap=document.createElement('div');
  wrap.id='seg-wrap';
  wrap.style.cssText='position:absolute;left:5%;bottom:27%;z-index:8;pointer-events:none';
  s.appendChild(wrap);
  var D=[
    {text:'Extraction',start:.15,end:.42},
    {text:'Formulation',start:.38,end:.65},
    {text:'Infusion',start:.70,end:.94}
  ];
  var els=[];
  D.forEach(function(d){
    var e=document.createElement('div');
    e.style.cssText='position:absolute;bottom:0;left:0;opacity:0;pointer-events:none;transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)';
    e.innerHTML='<div style="font-family:Inter,Helvetica Neue,Arial,sans-serif;font-size:clamp(3rem,7vw,5.5rem);font-weight:800;color:#fff;text-shadow:0 4px 40px rgba(0,0,0,.6);letter-spacing:-.04em;text-transform:uppercase">'+d.text+'</div>';
    wrap.appendChild(e);els.push(e);
  });
  var active=-1;
  function u(){
    var ms=w.offsetHeight-window.innerHeight;if(ms<=0)return;
    var p=window.scrollY/ms;
    // Find which segment is active based on custom ranges
    var idx=-1;
    for(var i=0;i<D.length;i++){
      var mid=(D[i].start+D[i].end)/2;
      var fadeIn=D[i].start;
      var fadeOut=D[i].end;
      if(p>=fadeIn&&p<=fadeOut)idx=i;
    }
    if(idx<0&&active>=0){els[active].style.opacity='0';els[active].style.transform='translateY(20px)';active=-1;return}
    if(idx!==active){
      if(active>=0){els[active].style.opacity='0';els[active].style.transform='translateY(-20px)'}
      if(idx>=0){els[idx].style.opacity='1';els[idx].style.transform='translateY(0)'}
      active=idx;
    }
  }
  window.addEventListener('scroll',u,{passive:true});u();
})();

// ============ 4. FLOATING NAV BAR ============
(function(){
  // Move nav-logo out of fixed-nav BEFORE hiding it
  var existingNavLogo = document.querySelector('.fixed-nav .nav-logo');
  if(existingNavLogo){document.body.appendChild(existingNavLogo)}
  // Now hide the Webflow fixed-nav container
  document.querySelectorAll('.fixed-nav').forEach(function(el){el.style.display='none'});
  var n=document.createElement('div');
  n.className='mb-floating-nav';
  document.body.appendChild(n);
  n.setAttribute('style','position:fixed;bottom:24px;top:auto;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:0;background:rgba(20,20,20,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:50px;padding:8px 8px 8px 24px;box-shadow:0 4px 30px rgba(0,0,0,.3);opacity:0;transition:opacity .4s,transform .4s');
  var isHome=window.location.pathname==='/'||window.location.pathname==='/index.html';
  var links=[['Home','#'],['About','#about'],['Services','#svc-formulation'],['Certs','#certifications'],['FAQ','#faq']];
  links.forEach(function(l){
    var a=document.createElement('a');a.textContent=l[0];
    // On non-home pages, link back to homepage with anchor
    if(!isHome){a.href=l[1]==='#'?'/':'/'+(l[1].startsWith('.')?'':l[1])}else{a.href=l[1]}
    a.style.cssText='color:#ccc;text-decoration:none;padding:10px 16px;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap';
    a.onmouseover=function(){this.style.color='#fff'};
    a.onmouseout=function(){this.style.color='#ccc'};
    if(isHome){a.onclick=function(e){if(l[1].startsWith('.')||l[1].startsWith('#')){e.preventDefault();var t=l[1]==='#'?document.body:document.querySelector(l[1]);if(t)t.scrollIntoView({behavior:'smooth'})}}}
    n.appendChild(a);
  });
  var cb=document.createElement('a');cb.href='/contact';
  cb.style.cssText='color:#1A1A1A;background:#C9A84C;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px;position:relative;overflow:visible;display:inline-block';
  cb.innerHTML='<span style="position:relative;z-index:1">Contact</span>';
  // Liquid fill pseudo-element via a real div
  var fill=document.createElement('div');
  fill.style.cssText='position:absolute;bottom:0;left:0;width:100%;height:0;background:#fff;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px';
  cb.appendChild(fill);
  cb.onmouseenter=function(){fill.style.height='100%';cb.querySelector('span').style.color='#1A1A1A'};
  cb.onmouseleave=function(){fill.style.height='0';cb.querySelector('span').style.color='#1A1A1A'};
  n.appendChild(cb);

  // On non-home pages, show nav immediately (no scroll-based reveal)
  if(!isHome){n.style.opacity='1';n.style.transform='translateX(-50%) translateY(0)'}

  // Inject global liquid-fill CTA style for all pages
  var ctaCSS=document.createElement('style');
  ctaCSS.textContent='.cta-liquid-fill{position:relative;overflow:visible;display:inline-block;padding:16px 40px;border-radius:50px;font-weight:700;font-size:1.1rem;text-decoration:none;cursor:pointer;border:none;font-family:Inter,sans-serif}.cta-liquid-fill span{position:relative;z-index:1}.cta-liquid-fill .fill-bg{position:absolute;bottom:0;left:0;width:100%;height:0;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px}.cta-liquid-fill:hover .fill-bg{height:100%}.cta-gold{background:#C9A84C;color:#1A1A1A}.cta-gold .fill-bg{background:#fff}.cta-gold:hover span{color:#1A1A1A}.cta-outline{background:transparent;border:2px solid #C9A84C;color:#C9A84C}.cta-outline .fill-bg{background:#C9A84C}.cta-outline:hover span{color:#1A1A1A}';
  document.head.appendChild(ctaCSS);
  // Use the existing Webflow nav-logo but fix its positioning and make parent transparent
  var nl=document.querySelector('.nav-logo');
  if(nl){
    nl.setAttribute('style','height:auto;width:180px;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9998;opacity:0;transition:opacity .3s,filter .3s;filter:brightness(0) invert(1)');
    // Make any parent container transparent
    var nlParent=nl.parentElement;
    if(nlParent&&nlParent!==document.body){
      nlParent.setAttribute('style','background:transparent;border:none;box-shadow:none;position:static');
    }
  }
})();

// ============ 5. PAGE INIT (minimal — native order is correct) ============
(function(){
  // Hide video-hero-media (replaced by canvas frame scrubber)
  var vm=document.querySelector('.video-hero-media');if(vm)vm.style.display='none';

  // Hide old services-grid (replaced by tabs)
  var oldGrid=document.querySelector('.services-grid');
  if(oldGrid)oldGrid.style.display='none';

  // Fix footer positioning
  var f=document.querySelector('.section-footer');
  if(f){f.style.position='relative';f.style.zIndex='1';f.style.top='auto'}
})();


// ── 5b. SERVICES TAB VIEW — DISABLED ──
// Native Webflow sections now handle service display:
// #svc-formulation, #svc-microthermic, #svc-copacking,
// #svc-supporting (with Process Dev / PAL / Scale-Up sub-tabs),
// #autonomi-ai (Supply Chain)
// All with Lottie icons and SVG line drawings built natively.
if(false){(function(){

  // Tab data — short names with canvas animated icons
  var tabs=[
    {title:'Formulation',desc:'From kitchen recipe to production-ready formula. Our food scientists optimize your formulation for the target manufacturing process — retort, aseptic, tunnel pasteurization, or cold fill.',bullets:['Formulation optimization','Ingredient sourcing guidance','Flavor & stability profiling','Clean label solutions','Sensory evaluation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';var b=1+Math.sin(t*3)*.04;ctx.scale(b,b);ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-15,15);ctx.lineTo(15,15);ctx.lineTo(8,-20);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-8,-28);ctx.lineTo(8,-28);ctx.lineTo(8,-20);ctx.stroke();var wave=Math.sin(t*4)*3;ctx.fillStyle='#fff';ctx.globalAlpha=.15;ctx.beginPath();ctx.moveTo(-12,5+wave);ctx.quadraticCurveTo(0,1-wave,12,5+wave);ctx.lineTo(15,15);ctx.lineTo(-15,15);ctx.closePath();ctx.fill();ctx.globalAlpha=.6;for(var i=0;i<3;i++){var by=-3-((t*30+i*15)%25);ctx.beginPath();ctx.arc(-4+i*4,by,1.5,0,Math.PI*2);ctx.fill()}}},
    {title:'MicroThermic',desc:'Send us a half-gallon sample. We fill it in cans, process it through our MicroThermic or JBT Retort system, and confirm sensory and emulsion stability before you commit to production.',bullets:['MicroThermic validation','JBT Static Retort testing','Sensory & emulsion stability','High acid & low acid','Can format validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';/* Thermometer */ctx.beginPath();ctx.moveTo(-4,-26);ctx.lineTo(-4,8);ctx.arc(0,14,10,Math.PI*.8,Math.PI*.2);ctx.lineTo(4,8);ctx.lineTo(4,-26);ctx.arc(0,-26,4,0,Math.PI,true);ctx.stroke();/* Mercury rising */var mH=20+Math.sin(t*2)*8;ctx.fillStyle='#fff';ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(0,14,6,0,Math.PI*2);ctx.fill();ctx.fillRect(-2,14-mH,4,mH);/* Heat waves */ctx.globalAlpha=.4;ctx.lineWidth=1.5;for(var i=0;i<3;i++){var wx=14+i*6;var wave=Math.sin(t*4+i*1.5)*3;ctx.beginPath();ctx.moveTo(wx,0);ctx.quadraticCurveTo(wx+wave,-8,wx,-16);ctx.stroke()}}},
    {title:'Process Dev',desc:'We determine the right thermal process for your product. Scale-up from bench to pilot to production with validated parameters at every step.',bullets:['Thermal process design','Scale-up protocols','Emulsion & stability testing','Shelf life studies','Process validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.rotate(t*.8);var teeth=8,oR=20,iR=14;ctx.beginPath();for(var i=0;i<teeth;i++){var a1=i/teeth*Math.PI*2,a2=(i+.3)/teeth*Math.PI*2,a3=(i+.5)/teeth*Math.PI*2,a4=(i+.8)/teeth*Math.PI*2;if(i===0)ctx.moveTo(Math.cos(a1)*iR,Math.sin(a1)*iR);ctx.lineTo(Math.cos(a2)*oR,Math.sin(a2)*oR);ctx.lineTo(Math.cos(a3)*oR,Math.sin(a3)*oR);ctx.lineTo(Math.cos(a4)*iR,Math.sin(a4)*iR)}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff';ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill()}},
    {title:'PAL / Heat Pen',desc:'Our Process Authority (30 years experience) conducts heat penetration studies and validates your thermal process for FDA compliance. Required for all shelf-stable low-acid beverages.',bullets:['Heat penetration testing','21 CFR 113/114 compliance','Scheduled process filing','Inoculated pack studies','LACF validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';var sc=1+Math.sin(t*2)*.04;ctx.scale(sc,sc);ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(20,-16);ctx.lineTo(20,6);ctx.quadraticCurveTo(20,26,0,30);ctx.quadraticCurveTo(-20,26,-20,6);ctx.lineTo(-20,-16);ctx.closePath();ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-9,2);ctx.lineTo(-3,12);ctx.lineTo(12,-8);ctx.stroke();ctx.globalAlpha=Math.sin(t*4)*.1+.06;ctx.strokeStyle='#fff';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(20,-16);ctx.lineTo(20,6);ctx.quadraticCurveTo(20,26,0,30);ctx.quadraticCurveTo(-20,26,-20,6);ctx.lineTo(-20,-16);ctx.closePath();ctx.stroke()}},
    {title:'Scale-Up',desc:'From bench-top to pilot trial to full production. We run pilot batches on our in-house equipment to validate your formula at scale, dial in process parameters, and confirm product quality before committing to a commercial run.',bullets:['Pilot trial runs (50\u2013500 gal)','Bench-to-production scale-up','Process parameter validation','First article inspection & QC','Packaging & label development','Production line qualification'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';var grow=Math.sin(t*2)*.08;ctx.beginPath();ctx.moveTo(-18,18);ctx.lineTo(-18,18-12);ctx.stroke();ctx.beginPath();ctx.moveTo(-8,18);ctx.lineTo(-8,18-22*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(2,18);ctx.lineTo(2,18-30*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(12,18);ctx.lineTo(12,18-38*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(-22,18);ctx.lineTo(18,18);ctx.stroke();ctx.fillStyle='#fff';ctx.globalAlpha=.6;var ay=-20-Math.sin(t*3)*3;ctx.beginPath();ctx.moveTo(14,ay);ctx.lineTo(18,ay+5);ctx.lineTo(10,ay+5);ctx.closePath();ctx.fill()}},
    {title:'Co-Packing',desc:'You bring the formula and materials — we handle production. Flexible co-packing for cans, bottles, and bag-in-box. Strict quality control, low MOQs, and full SQF-certified production.',bullets:['Retort canning: 12oz, 8oz, 8.4oz','Aseptic PET: 2-64oz bottles','Aseptic Bag-in-Box: 2-25L','Cold brew & tea extraction','Carbonation & nitro infusion'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';/* Bottle outline */ctx.beginPath();ctx.moveTo(-10,22);ctx.lineTo(-12,-4);ctx.lineTo(-6,-16);ctx.lineTo(-6,-24);ctx.lineTo(6,-24);ctx.lineTo(6,-16);ctx.lineTo(12,-4);ctx.lineTo(10,22);ctx.closePath();ctx.stroke();/* Cap */ctx.fillStyle='#fff';ctx.globalAlpha=.5;ctx.fillRect(-7,-30,14,7);/* Liquid filling up */var fH=((t*20)%42);ctx.fillStyle='#fff';ctx.globalAlpha=.25;ctx.save();ctx.beginPath();ctx.rect(-12,22-fH,24,fH);ctx.clip();ctx.beginPath();ctx.moveTo(-10,22);ctx.lineTo(-12,-4);ctx.lineTo(-6,-16);ctx.lineTo(-6,-24);ctx.lineTo(6,-24);ctx.lineTo(6,-16);ctx.lineTo(12,-4);ctx.lineTo(10,22);ctx.closePath();ctx.fill();ctx.restore();/* Liquid stream from above */ctx.globalAlpha=.6;ctx.lineWidth=2;var streamY=-30-((t*40)%15);ctx.beginPath();ctx.moveTo(0,streamY);ctx.lineTo(0,-24);ctx.stroke();/* Drops */ctx.globalAlpha=.4;var dy=-30-((t*25)%20);ctx.beginPath();ctx.arc(0,dy,1.5,0,Math.PI*2);ctx.fill()}},
    {title:'Supply Chain',desc:'Autonomi deploys 29 specialized AI agents across procurement, production, quality, and logistics \u2014 eliminating the manual coordination that costs F&B brands millions every year.',bullets:['AI procurement & vendor management','Production scheduling optimization','Real-time inventory & FEFO tracking','Quality intelligence & COA automation','Logistics coordination & 3PL integration'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';/* Network nodes */var nodes=[[-16,-16],[16,-16],[0,0],[-16,16],[16,16]];ctx.globalAlpha=.3;/* Connecting lines */for(var i=0;i<nodes.length;i++){for(var j=i+1;j<nodes.length;j++){ctx.beginPath();ctx.moveTo(nodes[i][0],nodes[i][1]);ctx.lineTo(nodes[j][0],nodes[j][1]);ctx.stroke()}}/* Animated pulse along lines */ctx.globalAlpha=.8;var pi=Math.floor(t*2)%5;var pj=(pi+1)%5;var pp=(t*2)%1;var px=nodes[pi][0]+(nodes[pj][0]-nodes[pi][0])*pp;var py=nodes[pi][1]+(nodes[pj][1]-nodes[pi][1])*pp;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();/* Nodes */ctx.globalAlpha=1;nodes.forEach(function(n,idx){var pulse=1+Math.sin(t*3+idx)*.15;ctx.fillStyle='#fff';ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(n[0],n[1],4*pulse,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(n[0],n[1],7*pulse,0,Math.PI*2);ctx.stroke()})}}
  ];

  // Build tab container
  var tabWrap=document.createElement('div');
  tabWrap.style.cssText='margin-top:40px';

  // Tab buttons row
  var tabRow=document.createElement('div');
  tabRow.style.cssText='display:flex;gap:0;margin-bottom:32px;border-bottom:1px solid #222;padding-bottom:0;justify-content:space-between;width:100%';
  tabWrap.appendChild(tabRow);

  // Tab content area
  var tabContent=document.createElement('div');
  tabContent.style.cssText='min-height:300px';
  tabWrap.appendChild(tabContent);

  var panels=[];
  var buttons=[];

  tabs.forEach(function(tab,i){
    // Button
    var btn=document.createElement('button');
    btn.textContent=tab.title;
    btn.style.cssText='padding:12px 8px;background:transparent;color:#bbb;border:none;border-bottom:2px solid transparent;font-size:.85rem;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;transition:all .3s;white-space:nowrap;flex:1;text-align:center';
    tabRow.appendChild(btn);
    buttons.push(btn);

    // Panel
    var panel=document.createElement('div');
    panel.style.cssText='display:none;animation:tabFadeIn .4s ease-out';

    // Create canvas icon
    var iconCanvas=document.createElement('canvas');
    iconCanvas.width=70;iconCanvas.height=70;
    iconCanvas.style.cssText='display:block;margin-bottom:16px';
    iconCanvas._draw=tab.drawIcon;
    iconCanvas._animT=0;
    iconCanvas._active=false;

    // Formulation tab — full-width info top, bottles left + scientist right bottom
    if(i===0){
      var ghBase='https://lynz-tonomi.github.io/macrobrands/';
      panel.innerHTML=
        /* Full-width title + description + bullets across top */
        '<div style="margin-bottom:32px">'+
          '<div id="icon-slot-'+i+'"></div>'+
          '<h3 style="font-size:3rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em;line-height:1.15">'+tab.title+'</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">'+tab.desc+'</p>'+
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;columns:2;column-gap:32px">'+
            tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:visible"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        /* Bottom row: beaker left, parallax scientist right */
        '<div style="display:flex;flex-direction:column;gap:24px">'+
          '<div id="carousel-wrap" style="border-radius:16px;overflow:visible;background:#000;border:1px solid #222;height:380px;position:relative">'+
            '<img id="carousel-img-a" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:lighten;transition:opacity .35s ease;opacity:0" alt="Product">'+
            '<img id="carousel-img-b" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:lighten;transition:opacity .35s ease;opacity:0" alt="Product">'+
          '</div>'+
          '<div id="parallax-form-wrap" style="border-radius:16px;overflow:visible;border:1px solid #222;height:380px;position:relative">'+
            '<img id="parallax-form-img" src="'+ghBase+'Lab_formulation.png" style="width:100%;height:140%;object-fit:cover;object-position:center top;position:absolute;top:-20%;will-change:transform" alt="Lab scientist formulating">'+
          '</div>'+
        '</div>';
      /* Parallax scroll for right image — native rAF */
      (function(){
        var ticking=false;
        function update(){
          var wrap=document.getElementById('parallax-form-wrap');
          var img=document.getElementById('parallax-form-img');
          if(wrap&&img){
            var rect=wrap.getBoundingClientRect();
            var vh=window.innerHeight||document.documentElement.clientHeight;
            var p=(vh-rect.top)/(vh+rect.height);
            p=Math.max(0,Math.min(1,p));
            img.style.transform='translateY('+((p-0.5)*80)+'px)';
          }
          ticking=false;
        }
        window.addEventListener('scroll',function(){
          if(!ticking){requestAnimationFrame(update);ticking=true;}
        },{passive:true});
        update();
      })();
      /* Carousel — fetch image list from GitHub carousel/ folder dynamically.
         To add images: drop any .png/.jpg into the repo's carousel/ folder.
         They will appear automatically on next page load (no code changes needed). */
      (function(){
        var apiUrl='https://api.github.com/repos/lynz-tonomi/macrobrands/contents/carousel';
        fetch(apiUrl,{headers:{'Accept':'application/vnd.github.v3+json'}})
          .then(function(r){return r.json();})
          .then(function(files){
            /* Filter to image files only, grab the raw download URL */
            var urls=files
              .filter(function(f){return /\.(png|jpe?g|webp)$/i.test(f.name)&&f.download_url;})
              .map(function(f){return f.download_url;});
            if(!urls.length)return;
            /* Fisher-Yates shuffle for random order every load */
            for(var i=urls.length-1;i>0;i--){
              var j=Math.floor(Math.random()*(i+1));
              var tmp=urls[i];urls[i]=urls[j];urls[j]=tmp;
            }
            var idx=0,aActive=true;
            var a=document.getElementById('carousel-img-a');
            var b=document.getElementById('carousel-img-b');
            if(!a||!b)return;
            /* Seed first image */
            a.src=urls[0];a.style.opacity='1';
            if(urls[1])b.src=urls[1];
            /* Crossfade every 500 ms — re-shuffle when cycle completes */
            function shuffleUrls(){for(var i=urls.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=urls[i];urls[i]=urls[j];urls[j]=tmp;}}
            setInterval(function(){
              idx++;
              if(idx>=urls.length){idx=0;shuffleUrls();}
              if(aActive){
                b.src=urls[idx];
                b.style.opacity='1';a.style.opacity='0';
              }else{
                a.src=urls[idx];
                a.style.opacity='1';b.style.opacity='0';
              }
              aActive=!aActive;
            },500);
          })
          .catch(function(e){console.warn('Carousel fetch failed:',e);});
      })();
    } else if(i===1){
      // MicroThermic tab — full-width top info, then photo left + specs right
      var ghBase2='https://lynz-tonomi.github.io/macrobrands/';
      panel.innerHTML=
        /* Full-width title + description + bullets across top */
        '<div style="margin-bottom:32px">'+
          '<div id="icon-slot-'+i+'"></div>'+
          '<h3 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">MicroThermic Processing</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">Our in-house MicroThermics AI Series UHT/HTST processor bridges the gap between lab development and commercial production. Fully automated with both direct injection and indirect heat transfer — send us a half-gallon sample and we validate your thermal process before you commit to a full run.</p>'+
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;columns:2;column-gap:32px">'+
            tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:visible"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        /* Bottom row: photo left (sized to match caps card), capabilities right */
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;align-items:start">'+
          '<div style="border-radius:16px;overflow:visible;background:#000;border:1px solid #222">'+
            '<div style="background:#000000;border-radius:12px;overflow:visible;padding:6px;position:relative"><style>@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} } @keyframes scan { from{transform:translateY(-6px)} to{transform:translateY(520px)} } @keyframes fR { from{stroke-dashoffset:20} to{stroke-dashoffset:0} } @keyframes fL { from{stroke-dashoffset:0} to{stroke-dashoffset:20} } @keyframes fD { from{stroke-dashoffset:16} to{stroke-dashoffset:0} } @keyframes fU { from{stroke-dashoffset:0} to{stroke-dashoffset:16} } @keyframes rotor { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } @keyframes piston { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(.5)} } @keyframes aiGlow { 0%,100%{filter:drop-shadow(0 0 5px #fbbf24)} 50%{filter:drop-shadow(0 0 22px #fbbf24) drop-shadow(0 0 44px #fbbf2422)} } @keyframes flicker { 0%,88%,100%{opacity:1} 90%{opacity:.2} 95%{opacity:.7} } .fR { stroke-dasharray:7 5; animation:fR .75s linear infinite; } .fL { stroke-dasharray:7 5; animation:fL .75s linear infinite; } .fD { stroke-dasharray:7 5; animation:fD .75s linear infinite; } .fU { stroke-dasharray:7 5; animation:fU .75s linear infinite; } .fRs { stroke-dasharray:5 4; animation:fR 1.1s linear infinite; } .fDs { stroke-dasharray:5 4; animation:fD 1.1s linear infinite; } .fUs { stroke-dasharray:5 4; animation:fU 1.1s linear infinite; } .fCd { stroke-dasharray:5 4; animation:fD 1.2s linear infinite; } .fCu { stroke-dasharray:5 4; animation:fU 1.2s linear infinite; } .fSt { stroke-dasharray:6 4; animation:fD .65s linear infinite; } .tc { animation:flicker 6s ease-in-out infinite; } .psi { animation:flicker 7s ease-in-out 1.8s infinite; } .aiG { animation:aiGlow 2.4s ease-in-out infinite; } @keyframes liquidFill { 0% { transform:translateY(100%); } 50% { transform:translateY(20%); } 100% { transform:translateY(0%); } } @keyframes liquidWave { 0%,100% { d:path("M0,4 Q15,0 30,4 Q45,8 60,4 Q75,0 90,4 L90,80 L0,80 Z"); } 50% { d:path("M0,4 Q15,8 30,4 Q45,0 60,4 Q75,8 90,4 L90,80 L0,80 Z"); } } @keyframes liquidBubble { 0% { transform:translateY(0); opacity:0.7; } 100% { transform:translateY(-30px); opacity:0; } }</style><svg viewBox="0 0 1400 470" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;"> <defs> <linearGradient id="gPre" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="#14532d"/><stop offset="100%" stop-color="#052e16"/> </linearGradient> <linearGradient id="gFin" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="#7f1d1d"/><stop offset="100%" stop-color="#3b0000"/> </linearGradient> <linearGradient id="gCool" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="rgba(255,255,255,0.14)"/><stop offset="100%" stop-color="rgba(255,255,255,0.06)"/> </linearGradient> <linearGradient id="gCond" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/><stop offset="100%" stop-color="rgba(255,255,255,0.10)"/> </linearGradient> <filter id="gO"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <filter id="gY"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <filter id="gC"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <clipPath id="cpPre"><rect x="155" y="188" width="60" height="74" rx="2"/></clipPath><clipPath id="cpFin"><rect x="275" y="185" width="72" height="80" rx="2"/></clipPath><clipPath id="cpC1"><rect x="530" y="187" width="60" height="76" rx="2"/></clipPath><clipPath id="cpC2"><rect x="720" y="187" width="60" height="76" rx="2"/></clipPath></defs> <!-- SECTION LABELS --> <text x="18" y="22" fill="#ffffff" font-family="JetBrains Mono" font-size="8" letter-spacing="3">DUAL PRODUCT INLET</text> <text x="18" y="98" fill="#ffffff" font-family="JetBrains Mono" font-size="8" letter-spacing="3">PRODUCT PUMP</text> <!-- ── CITY WATER SOURCE ── --> <rect x="18" y="30" width="74" height="28" rx="2" fill="#000000" stroke="#f59e0b" stroke-width="1"/> <text x="55" y="43" fill="#f59e0b" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">CITY WATER</text> <text x="55" y="53" fill="#f59e0b" font-family="JetBrains Mono" font-size="7" text-anchor="middle">SOURCE</text> <!-- Pipe right --> <line x1="92" y1="44" x2="118" y2="44" stroke="#ffffff" stroke-width="4"/> <line x1="92" y1="44" x2="118" y2="44" stroke="#f97316" fill="none" class="fR" style="animation-delay:.05s"/> <!-- Run Dry Valve --> <rect x="112" y="36" width="22" height="17" rx="2" fill="#000000" stroke="#ffffff" stroke-width="1"/> <line x1="116" y1="40" x2="130" y2="49" stroke="#f59e0b" stroke-width="1.5"/> <line x1="130" y1="40" x2="116" y2="49" stroke="#f59e0b" stroke-width="1.5"/> <text x="123" y="63" fill="#ffffff" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">RUN DRY VALVE</text> <!-- Down pipe to y=225 --> <line x1="123" y1="53" x2="123" y2="190" stroke="#0a1525" stroke-width="6"/> <line x1="123" y1="53" x2="123" y2="190" stroke="#ffffff" stroke-width="3"/> <path d="M123,53 L123,190" stroke="#f97316" fill="none" class="fD"/> <!-- ── MAIN PIPE y=225 ── --> <line x1="85" y1="225" x2="990" y2="225" stroke="#080f1e" stroke-width="9"/> <line x1="85" y1="225" x2="990" y2="225" stroke="#ffffff" stroke-width="5"/> <!-- flow segments --> <line x1="85" y1="225" x2="155" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:0s"/> <line x1="215" y1="225" x2="275" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.12s"/> <line x1="347" y1="225" x2="383" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.22s"/> <line x1="457" y1="225" x2="530" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.32s"/> <line x1="590" y1="225" x2="665" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.42s"/> <line x1="720" y1="225" x2="798" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.52s"/> <line x1="836" y1="225" x2="990" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.62s"/> <!-- ── PRODUCT PUMP ── --> <circle cx="120" cy="225" r="19" fill="#0c1828" stroke="#f97316" stroke-width="2" filter="url(#gO)"/> <g style="transform-origin:120px 225px;animation:rotor 1.3s linear infinite;"> <line x1="120" y1="213" x2="120" y2="237" stroke="#f97316" stroke-width="2.5"/> <line x1="108" y1="225" x2="132" y2="225" stroke="#f97316" stroke-width="2.5"/> <line x1="111" y1="216" x2="129" y2="234" stroke="#f97316" stroke-width="1.5" opacity=".5"/> <line x1="129" y1="216" x2="111" y2="234" stroke="#f97316" stroke-width="1.5" opacity=".5"/> </g> <text x="120" y="252" fill="#f97316" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PUMP</text> <!-- ── PREHEATER ── --> <rect x="155" y="188" width="60" height="74" rx="2" fill="url(#gPre)" stroke="#22c55e" stroke-width="1.5"/> <line x1="155" y1="262" x2="215" y2="188" stroke="#4ade80" stroke-width="2.5" opacity=".75"/> <line x1="155" y1="242" x2="205" y2="188" stroke="#4ade80" stroke-width="1.5" opacity=".45"/> <line x1="165" y1="262" x2="215" y2="212" stroke="#4ade80" stroke-width="1.5" opacity=".45"/> <text x="185" y="177" fill="#4ade80" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">PREHEATER</text> <!-- Preheater liquid fill --><g clip-path="url(#cpPre)"><rect x="155" y="188" width="60" height="74" fill="#22c55e" opacity=".2"><animate attributeName="height" values="0;74;74" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite"/><animate attributeName="y" values="262;188;188" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite"/></rect><rect x="155" y="186" width="60" height="6" fill="#4ade80" opacity=".4" rx="3"><animate attributeName="y" values="262;186;186" keyTimes="0;0.6;1" dur="3s" repeatCount="indefinite"/><animate attributeName="rx" values="0;3;3" dur="1.5s" repeatCount="indefinite"/></rect></g><!-- Sensors --> <g class="tc" filter="url(#gY)"> <circle cx="150" cy="178" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="150" y="182" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="psi" filter="url(#gY)" style="animation-delay:.5s"> <circle cx="220" cy="178" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="220" y="182" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PSI</text> </g> <!-- Hot water generator 1 --> <rect x="143" y="312" width="84" height="34" rx="2" fill="#000000" stroke="#ef4444" stroke-width="1"/> <text x="185" y="324" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" font-weight="700">INTERNAL HOT</text> <text x="185" y="335" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">WATER GENERATOR</text> <line x1="172" y1="262" x2="172" y2="312" stroke="#0a1525" stroke-width="4"/> <line x1="198" y1="262" x2="198" y2="312" stroke="#0a1525" stroke-width="4"/> <path d="M172,262 L172,312" stroke="#ef4444" fill="none" class="fDs" style="animation-delay:.1s"/> <path d="M198,312 L198,262" stroke="#ef4444" fill="none" class="fUs" style="animation-delay:.1s"/> <!-- ── FINAL HEATER ── --> <rect x="275" y="185" width="72" height="80" rx="2" fill="url(#gFin)" stroke="#f87171" stroke-width="1.5"/> <line x1="275" y1="265" x2="347" y2="185" stroke="#fca5a5" stroke-width="3" opacity=".8"/> <line x1="275" y1="245" x2="337" y2="185" stroke="#fca5a5" stroke-width="1.5" opacity=".45"/> <line x1="285" y1="265" x2="347" y2="205" stroke="#fca5a5" stroke-width="1.5" opacity=".45"/> <text x="311" y="174" fill="#f87171" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">FINAL HEATER</text> <!-- Final Heater liquid fill --><g clip-path="url(#cpFin)"><rect x="275" y="185" width="72" height="80" fill="#ef4444" opacity=".2"><animate attributeName="height" values="0;80;80" keyTimes="0;0.6;1" dur="3.5s" repeatCount="indefinite"/><animate attributeName="y" values="265;185;185" keyTimes="0;0.6;1" dur="3.5s" repeatCount="indefinite"/></rect><rect x="275" y="183" width="72" height="6" fill="#fca5a5" opacity=".4" rx="3"><animate attributeName="y" values="265;183;183" keyTimes="0;0.6;1" dur="3.5s" repeatCount="indefinite"/></rect></g><g class="tc" filter="url(#gY)" style="animation-delay:.35s"> <circle cx="270" cy="175" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="270" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="tc" filter="url(#gY)" style="animation-delay:1.1s"> <circle cx="353" cy="175" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="353" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Hot water generator 2 --> <rect x="263" y="312" width="84" height="34" rx="2" fill="#000000" stroke="#ef4444" stroke-width="1"/> <text x="305" y="324" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" font-weight="700">INTERNAL HOT</text> <text x="305" y="335" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">WATER GENERATOR</text> <line x1="292" y1="265" x2="292" y2="312" stroke="#0a1525" stroke-width="4"/> <line x1="318" y1="265" x2="318" y2="312" stroke="#0a1525" stroke-width="4"/> <path d="M292,265 L292,312" stroke="#ef4444" fill="none" class="fDs" style="animation-delay:.25s"/> <path d="M318,312 L318,265" stroke="#ef4444" fill="none" class="fUs" style="animation-delay:.25s"/> <!-- ── HOLD TUBE BANK ── --> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="#080f1e" stroke-width="8"/> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="#ffffff" stroke-width="5"/> <path d="M383,225 L383,128" stroke="#f97316" fill="none" class="fU" style="animation-delay:.08s"/> <path d="M383,128 L457,128" stroke="#f97316" fill="none" class="fR" style="animation-delay:.18s"/> <path d="M457,128 L457,225" stroke="#f97316" fill="none" class="fD" style="animation-delay:.28s"/> <rect x="360" y="108" width="120" height="38" rx="3" fill="#000000" stroke="#ef4444" stroke-width="2"/> <text x="420" y="124" fill="#ef4444" font-family="JetBrains Mono" font-size="9.5" text-anchor="middle" font-weight="700">HOLD TUBE BANK</text> <text x="420" y="138" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" opacity=".6">STERILIZATION HOLD</text> <g class="tc" filter="url(#gY)" style="animation-delay:.65s"> <circle cx="463" cy="175" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="463" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- ── COOLER 1 ── --> <rect x="530" y="187" width="60" height="76" rx="2" fill="url(#gCool)" stroke="#818cf8" stroke-width="1.5"/> <line x1="530" y1="187" x2="590" y2="263" stroke="#a5b4fc" stroke-width="2.5" opacity=".8"/> <line x1="530" y1="207" x2="580" y2="263" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <line x1="540" y1="187" x2="590" y2="237" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <text x="560" y="176" fill="#818cf8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">COOLER</text> <g class="tc" filter="url(#gY)" style="animation-delay:.9s"> <circle cx="524" cy="176" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="524" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Cooler 1 liquid fill --><g clip-path="url(#cpC1)"><rect x="530" y="187" width="60" height="76" fill="#818cf8" opacity=".2"><animate attributeName="height" values="0;76;76" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite"/><animate attributeName="y" values="263;187;187" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite"/></rect><rect x="530" y="185" width="60" height="6" fill="#a5b4fc" opacity=".4" rx="3"><animate attributeName="y" values="263;185;185" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite"/></rect></g><!-- Chill flow control below C1 --> <line x1="560" y1="263" x2="560" y2="298" stroke="#0a1525" stroke-width="4"/> <path d="M560,263 L560,298" stroke="#3b82f6" fill="none" class="fCd"/> <g transform="translate(560,310)"> <polygon points="-12,-10 12,-10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="560" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle" font-weight="700">FLOW CONTROL VALVE</text> <text x="560" y="354" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- ── HOMOGENIZER ── --> <rect x="617" y="204" width="90" height="42" rx="19" fill="#080f1e" stroke="#f97316" stroke-width="1.5" filter="url(#gO)"/> <g style="transform-origin:637px 225px;animation:piston .5s ease-in-out infinite"> <rect x="631" y="211" width="8" height="28" rx="2" fill="#f97316" opacity=".85"/> </g> <g style="transform-origin:657px 225px;animation:piston .5s ease-in-out .17s infinite"> <rect x="651" y="211" width="8" height="28" rx="2" fill="#f97316" opacity=".85"/> </g> <g style="transform-origin:677px 225px;animation:piston .5s ease-in-out .34s infinite"> <rect x="671" y="211" width="8" height="28" rx="2" fill="#f97316" opacity=".85"/> </g> <text x="662" y="260" fill="#f97316" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">IN-LINE HOMOGENIZER</text> <text x="662" y="271" fill="#ffffff" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">2-STAGE · 3-PISTON · VARISPEED</text> <!-- ── COOLER 2 ── --> <rect x="720" y="187" width="60" height="76" rx="2" fill="url(#gCool)" stroke="#818cf8" stroke-width="1.5"/> <line x1="720" y1="187" x2="780" y2="263" stroke="#a5b4fc" stroke-width="2.5" opacity=".8"/> <line x1="720" y1="207" x2="770" y2="263" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <line x1="730" y1="187" x2="780" y2="237" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <text x="750" y="176" fill="#818cf8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">COOLER</text> <g class="tc" filter="url(#gY)" style="animation-delay:1.2s"> <circle cx="714" cy="176" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="714" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="psi" filter="url(#gY)" style="animation-delay:1.8s"> <circle cx="786" cy="176" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="786" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PSI</text> </g> <!-- Cooler 2 liquid fill --><g clip-path="url(#cpC2)"><rect x="720" y="187" width="60" height="76" fill="#818cf8" opacity=".2"><animate attributeName="height" values="0;76;76" keyTimes="0;0.6;1" dur="4.5s" repeatCount="indefinite"/><animate attributeName="y" values="263;187;187" keyTimes="0;0.6;1" dur="4.5s" repeatCount="indefinite"/></rect><rect x="720" y="185" width="60" height="6" fill="#a5b4fc" opacity=".4" rx="3"><animate attributeName="y" values="263;185;185" keyTimes="0;0.6;1" dur="4.5s" repeatCount="indefinite"/></rect></g><!-- Chill flow control below C2 --> <line x1="750" y1="263" x2="750" y2="298" stroke="#0a1525" stroke-width="4"/> <path d="M750,263 L750,298" stroke="#3b82f6" fill="none" class="fCd" style="animation-delay:.3s"/> <g transform="translate(750,310)"> <polygon points="-12,-10 12,-10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="750" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle" font-weight="700">FLOW CONTROL VALVE</text> <text x="750" y="354" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- Back pressure valve --> <g transform="translate(817,225)"> <polygon points="-13,-13 13,-13 0,0" fill="#0a1828" stroke="#f97316" stroke-width="1.5"/> <polygon points="-13,13 13,13 0,0" fill="#0a1828" stroke="#f97316" stroke-width="1.5"/> </g> <text x="817" y="252" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">BACK PRESSURE</text> <text x="817" y="261" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">VALVE</text> <!-- ── CLEAN FILL HOOD ── --> <rect x="994" y="150" width="390" height="238" rx="4" fill="#000000" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="9 4"/> <text x="1189" y="410" fill="#3b82f6" font-family="JetBrains Mono" font-size="9" text-anchor="middle" letter-spacing="3" font-weight="700">CLEAN-FILL HOOD &amp; ACCUFILL</text> <!-- TC at hood entry --> <g class="tc" filter="url(#gY)" style="animation-delay:1.5s"> <circle cx="1013" cy="202" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="1013" y="206" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Sterile product outlet --> <rect x="1005" y="218" width="92" height="46" rx="3" fill="#000000" stroke="#22d3ee" stroke-width="1.5"/> <text x="1051" y="236" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">STERILE</text> <text x="1051" y="247" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">PRODUCT</text> <text x="1051" y="258" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">OUTLET</text> <!-- Pipe inside hood: entry → sterile box → back pressure valve --> <line x1="990" y1="225" x2="1005" y2="225" stroke="#ffffff" stroke-width="5"/> <line x1="990" y1="225" x2="1005" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.7s"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#0a1525" stroke-width="5"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#ffffff" stroke-width="3"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#f97316" fill="none" class="fR" style="animation-delay:.82s"/> <!-- Back pressure valve (inside hood) --> <g transform="translate(1235,238)"> <polygon points="-12,-12 12,-12 0,0" fill="#000000" stroke="#f97316" stroke-width="1.5"/> <polygon points="-12,12 12,12 0,0" fill="#000000" stroke="#f97316" stroke-width="1.5"/> </g> <text x="1235" y="262" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">BACK PRESSURE</text> <text x="1235" y="271" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">VALVE</text> <!-- Pipe up from BPV to condenser --> <line x1="1235" y1="188" x2="1235" y2="226" stroke="#0a1525" stroke-width="5"/> <path d="M1235,188 L1235,226" stroke="#f97316" fill="none" class="fU" style="animation-delay:.9s"/> <!-- CONDENSER --> <rect x="1122" y="155" width="104" height="112" rx="3" fill="url(#gCond)" stroke="#60a5fa" stroke-width="2"/> <!-- Tube grid inside condenser --> <line x1="1132" y1="170" x2="1216" y2="170" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="181" x2="1216" y2="181" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="192" x2="1216" y2="192" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="203" x2="1216" y2="203" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="214" x2="1216" y2="214" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="225" x2="1216" y2="225" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="236" x2="1216" y2="236" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="247" x2="1216" y2="247" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <!-- Animated flow tubes inside condenser --> <line x1="1132" y1="175" x2="1216" y2="175" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fL" style="animation-delay:0s"/> <line x1="1132" y1="197" x2="1216" y2="197" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fR" style="animation-delay:.3s"/> <line x1="1132" y1="219" x2="1216" y2="219" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fL" style="animation-delay:.15s"/> <line x1="1132" y1="241" x2="1216" y2="241" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fR" style="animation-delay:.45s"/> <text x="1174" y="283" fill="#93c5fd" font-family="JetBrains Mono" font-size="9.5" text-anchor="middle" font-weight="700">CONDENSER</text> <!-- Flow control + chill below condenser --> <line x1="1174" y1="267" x2="1174" y2="298" stroke="#0a1525" stroke-width="4"/> <path d="M1174,267 L1174,298" stroke="#3b82f6" fill="none" class="fCd" style="animation-delay:.6s"/> <g transform="translate(1174,310)"> <polygon points="-12,-10 12,-10 0,0" fill="#000000" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="#000000" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="1174" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">FLOW CONTROL VALVE</text> <text x="1174" y="353" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- Condenser outlet pipe (right) --> <line x1="1226" y1="192" x2="1348" y2="192" stroke="#0a1525" stroke-width="4"/> <line x1="1226" y1="192" x2="1348" y2="192" stroke="#ffffff" stroke-width="2" stroke-dasharray="5 4"/> <!-- Outlet valve X --> <rect x="1332" y="183" width="22" height="18" rx="2" fill="#000000" stroke="#ffffff" stroke-width="1"/> <line x1="1336" y1="187" x2="1350" y2="197" stroke="#ffffff" stroke-width="1.5"/> <line x1="1350" y1="187" x2="1336" y2="197" stroke="#ffffff" stroke-width="1.5"/> <text x="1368" y="192" fill="#ffffff" font-family="JetBrains Mono" font-size="7.5" font-weight="700">CONDENSER</text> <text x="1368" y="203" fill="#ffffff" font-family="JetBrains Mono" font-size="7.5" font-weight="700">OUTLET</text> <!-- ── STERILE PRODUCT OUTLET DROP ── --> <line x1="1051" y1="264" x2="1051" y2="445" stroke="#041522" stroke-width="6"/> <line x1="1051" y1="264" x2="1051" y2="445" stroke="#0e4a5a" stroke-width="3"/> <path d="M1051,264 L1051,445" stroke="#22d3ee" fill="none" class="fSt" filter="url(#gC)"/> <polygon points="1051,453 1041,441 1061,441" fill="#22d3ee" filter="url(#gC)"/> <text x="1051" y="466" fill="#22d3ee" font-family="Bebas Neue,JetBrains Mono" font-size="15" text-anchor="middle" letter-spacing="6" filter="url(#gC)">STERILE PRODUCT OUTLET</text> <!-- ── LIVE READOUTS ── --> <text x="22" y="392" fill="#22c55e" font-family="JetBrains Mono" font-size="8" opacity=".7">TEMP_IN ▶ 142.4°C</text> <text x="22" y="405" fill="#3b82f6" font-family="JetBrains Mono" font-size="8" opacity=".7">CHILL_T ▶ 4.2°C</text> <text x="22" y="418" fill="#f97316" font-family="JetBrains Mono" font-size="8" opacity=".7">FLOW_RT ▶ 18.6 L/s</text> <text x="22" y="431" fill="#fbbf24" font-family="JetBrains Mono" font-size="8" opacity=".7">HOLD_TM ▶ 4.0 sec</text> <text x="22" y="444" fill="#818cf8" font-family="JetBrains Mono" font-size="8" opacity=".7">HOMO_PR ▶ 280 bar</text> <!-- Corner brackets --> <path d="M8,8 L8,26 M8,8 L26,8" fill="none" stroke="#ffffff" stroke-width="1.5"/> <path d="M1392,8 L1392,26 M1392,8 L1374,8" fill="none" stroke="#ffffff" stroke-width="1.5"/> <path d="M8,462 L8,444 M8,462 L26,462" fill="none" stroke="#ffffff" stroke-width="1.5"/> <path d="M1392,462 L1392,444 M1392,462 L1374,462" fill="none" stroke="#ffffff" stroke-width="1.5"/> <circle class="ai-junc" cx="192" cy="173" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="137" cy="159" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="21" cy="104" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="204" cy="181" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="149" cy="167" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="33" cy="112" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="942" cy="168" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1070" cy="149" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1137" cy="89" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="930" cy="158" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="1058" cy="139" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="1125" cy="79" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="194" cy="331" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="131" cy="347" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="8" cy="324" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="206" cy="321" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="143" cy="337" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="20" cy="314" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="139" cy="455" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="91" cy="504" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="127" cy="463" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="79" cy="512" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="990" cy="354" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="1112" cy="353" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="1173" cy="311" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="1002" cy="344" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="1124" cy="343" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="1185" cy="301" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="985" cy="439" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1102" cy="476" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1158" cy="473" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="973" cy="429" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="1090" cy="466" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="1146" cy="463" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="393" cy="655" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="370" cy="737" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="288" cy="778" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="405" cy="663" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="382" cy="745" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="300" cy="786" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="537" cy="651" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="583" cy="744" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="569" cy="797" r="3" fill="none" stroke="#fff" stroke-width="1.2" opacity="0"/><circle class="ai-junc" cx="525" cy="641" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="571" cy="734" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="557" cy="787" r="2.5" fill="#fff" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="750" cy="662" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="842" cy="742" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="873" cy="781" r="3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="762" cy="652" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="854" cy="732" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-junc" cx="885" cy="771" r="2.5" fill="#00DFFF" fill-opacity=".4" opacity="0"/><circle class="ai-spawn" cx="285" cy="211" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M285,211 L248,211 L232,187 L179,171" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><circle class="ai-node-b" cx="179" cy="171" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="189" cy="179" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="171" cy="165" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M171,165 L134,165 L118,142 L64,126" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.75" filter="url(#aig)"/><circle class="ai-node-b" cx="64" cy="126" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="74" cy="118" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="56" cy="120" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M56,120 L19,120 L3,96 L-50,80" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.9" filter="url(#aig)"/><circle class="ai-dept" cx="-50" cy="80" r="18" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="-50" cy="80" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="-50" cy="80" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="-50" y="52" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">SOURCING</text><circle class="ai-spawn" cx="870" cy="206" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M870,206 L912,206 L928,181 L989,165" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.75" filter="url(#aig)"/><circle class="ai-node-b" cx="989" cy="165" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="979" cy="173" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="1000" cy="154" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M1000,154 L1042,154 L1059,129 L1120,112" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.9" filter="url(#aig)"/><circle class="ai-node-b" cx="1120" cy="112" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1110" cy="104" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="1131" cy="101" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M1131,101 L1173,101 L1189,76 L1250,60" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.65" filter="url(#aig)"/><circle class="ai-dept" cx="1250" cy="60" r="18" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1250" cy="60" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1250" cy="60" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1250" y="32" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">LOGISTICS</text><circle class="ai-spawn" cx="288" cy="336" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M288,336 L250,336 L248,338 L178,339" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.8" filter="url(#aig)"/><circle class="ai-node-w" cx="178" cy="339" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="188" cy="347" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="164" cy="331" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M164,331 L126,331 L124,333 L54,335" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.5" filter="url(#aig)"/><circle class="ai-node-w" cx="54" cy="335" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="64" cy="327" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="40" cy="327" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M40,327 L2,327 L0,329 L-70,330" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="1" filter="url(#aig)"/><circle class="ai-dept" cx="-70" cy="330" r="18" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="-70" cy="330" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="-70" cy="330" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="-70" y="302" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">FORECASTING</text><circle class="ai-spawn" cx="215" cy="450" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M215,450 L185,450 L175,465 L128,475" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.65" filter="url(#aig)"/><circle class="ai-node-b" cx="128" cy="475" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="118" cy="483" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="111" cy="488" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M111,488 L81,488 L71,502 L24,512" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.95" filter="url(#aig)"/><circle class="ai-node-b" cx="24" cy="512" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="14" cy="504" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="7" cy="525" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M7,525 L-23,525 L-33,540 L-80,550" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.8" filter="url(#aig)"/><circle class="ai-dept" cx="-80" cy="550" r="18" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="-80" cy="550" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="-80" cy="550" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="-80" y="522" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">SCHEDULING</text><circle class="ai-spawn" cx="923" cy="375" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M923,375 L962,375 L969,364 L1035,357" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="1" filter="url(#aig)"/><circle class="ai-node-w" cx="1035" cy="357" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="1045" cy="365" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="1045" cy="347" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M1045,347 L1085,347 L1092,336 L1158,328" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.6" filter="url(#aig)"/><circle class="ai-node-w" cx="1158" cy="328" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="1168" cy="320" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="1168" cy="318" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M1168,318 L1207,318 L1214,307 L1280,300" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.75" filter="url(#aig)"/><circle class="ai-dept" cx="1280" cy="300" r="18" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1280" cy="300" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1280" cy="300" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1280" y="272" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">MONITORING</text><circle class="ai-spawn" cx="926" cy="439" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M926,439 L962,439 L968,449 L1029,455" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.8" filter="url(#aig)"/><circle class="ai-node-b" cx="1029" cy="455" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1019" cy="463" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="1042" cy="462" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M1042,462 L1078,462 L1084,471 L1144,477" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><circle class="ai-node-b" cx="1144" cy="477" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="1134" cy="469" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="1157" cy="484" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M1157,484 L1193,484 L1199,494 L1260,500" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.7" filter="url(#aig)"/><circle class="ai-dept" cx="1260" cy="500" r="18" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1260" cy="500" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1260" cy="500" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1260" y="472" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">ANALYTICS</text><circle class="ai-spawn" cx="444" cy="615" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M444,615 L425,615 L397,657 L390,685" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.75" filter="url(#aig)"/><circle class="ai-node-w" cx="390" cy="685" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="400" cy="693" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="374" cy="697" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M374,697 L355,697 L327,740 L320,768" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.5" filter="url(#aig)"/><circle class="ai-node-w" cx="320" cy="768" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="330" cy="760" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="304" cy="780" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M304,780 L285,780 L257,822 L250,850" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.95" filter="url(#aig)"/><circle class="ai-dept" cx="250" cy="850" r="18" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="250" cy="850" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="250" cy="850" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="250" y="822" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">INVENTORY</text><circle class="ai-spawn" cx="545" cy="597" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M545,597 L549,597 L584,650 L557,685" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.5" filter="url(#aig)"/><circle class="ai-node-w" cx="557" cy="685" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="547" cy="693" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="566" cy="694" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M566,694 L571,694 L606,747 L579,783" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.95" filter="url(#aig)"/><circle class="ai-node-w" cx="579" cy="783" r="4" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-junc" cx="569" cy="775" r="2.5" fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width=".8" opacity="0"/><circle class="ai-spawn" cx="588" cy="792" r="3.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><path class="ai-trace" d="M588,792 L592,792 L627,845 L600,880" fill="none" stroke="#fff" stroke-width="1" stroke-opacity="0.9" filter="url(#aig)"/><circle class="ai-dept" cx="600" cy="880" r="18" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="600" cy="880" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="600" cy="880" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="600" y="852" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">COMPLIANCE</text><circle class="ai-spawn" cx="715" cy="619" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M715,619 L740,619 L769,663 L785,692" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.85" filter="url(#aig)"/><circle class="ai-node-b" cx="785" cy="692" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="795" cy="700" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="797" cy="698" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M797,698 L822,698 L851,742 L868,771" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><circle class="ai-node-b" cx="868" cy="771" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="878" cy="763" r="2.5" fill="#00DFFF"  opacity="0"/><circle class="ai-spawn" cx="880" cy="777" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><path class="ai-trace" d="M880,777 L905,777 L934,821 L950,850" fill="none" stroke="#00DFFF" stroke-width="1.1" stroke-opacity="0.75" filter="url(#aig)"/><circle class="ai-dept" cx="950" cy="850" r="18" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="950" cy="850" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="950" cy="850" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="950" y="822" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">TRACEABILITY</text></svg></div>'+
          '</div>'+
          '<div style="background:#111;border-radius:16px;padding:32px;border:1px solid #222">'+
            '<div style="font-weight:700;color:#ccc;margin-bottom:16px;font-size:.95rem">Equipment Capabilities</div>'+
            '<ul style="list-style:none;padding:0;margin:0">'+
              ['Direct injection UHT processing','Indirect heat transfer HTST','Dual-mode AI DIPW system','Fully automated process control','Lab-to-production formula accuracy','High acid & low acid validation','Aseptic & retort compatibility'].map(function(b){return '<li style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
            '</ul>'+
          '</div>'+
        '</div>';
    } else if(i===2){
      // Process Dev tab — 4-phase production pipeline
      var phases=[
        {title:'Pre-Production',steps:['Raw material staging and preparation','Equipment calibration and setup','Ingredient tempering and pre-treatment','Batch room readiness verification'],
         drawIcon:function(ctx,t){/* Clipboard with checklist */ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.roundRect(-14,-22,28,44,4);ctx.stroke();ctx.beginPath();ctx.roundRect(-6,-26,12,8,2);ctx.stroke();ctx.globalAlpha=.7;for(var i=0;i<3;i++){var y=-10+i*12;var done=((t*2+i)%3)<2;if(done){ctx.beginPath();ctx.moveTo(-8,y);ctx.lineTo(-5,y+3);ctx.lineTo(-1,y-3);ctx.stroke()}ctx.beginPath();ctx.moveTo(3,y);ctx.lineTo(10,y);ctx.stroke()}}},
        {title:'Batching',steps:['Precision ingredient weighing and kitting','High-shear mixing and emulsification','Buffer and stabilizer incorporation','Temperature-controlled blending stages'],
         drawIcon:function(ctx,t){/* Mixing tank with swirl */ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-14,-18);ctx.lineTo(-16,16);ctx.quadraticCurveTo(-16,22,-10,22);ctx.lineTo(10,22);ctx.quadraticCurveTo(16,22,16,16);ctx.lineTo(14,-18);ctx.closePath();ctx.stroke();/* Liquid swirl */ctx.globalAlpha=.4;var a=t*3;ctx.beginPath();ctx.moveTo(-8,4+Math.sin(a)*3);ctx.quadraticCurveTo(0,-2+Math.cos(a)*3,8,4+Math.sin(a+1)*3);ctx.stroke();ctx.beginPath();ctx.moveTo(-6,10+Math.sin(a+2)*2);ctx.quadraticCurveTo(0,6+Math.cos(a+1)*2,6,10+Math.sin(a+3)*2);ctx.stroke();/* Stirrer */ctx.globalAlpha=.8;var sr=t*4;ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(0,-10);ctx.stroke();ctx.beginPath();ctx.moveTo(-4+Math.sin(sr)*2,-10);ctx.lineTo(4+Math.sin(sr)*2,-4);ctx.stroke()}},
        {title:'QC & Sterilization',steps:['In-process lab analysis (pH, Brix, total solids)','Spec confirmation and batch adjustment','Thermal sterilization (UHT/HTST/retort)','Homogenization and rapid cooling'],
         drawIcon:function(ctx,t){/* Test tube + thermometer */ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';/* Test tube */ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-8,12);ctx.arc(-2,12,6,Math.PI,0);ctx.lineTo(4,-20);ctx.stroke();/* Liquid */ctx.globalAlpha=.3;var lv=Math.sin(t*2)*3;ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-7,2+lv);ctx.quadraticCurveTo(-2,-2+lv,3,2+lv);ctx.lineTo(3,12);ctx.arc(-2,12,5,0,Math.PI);ctx.closePath();ctx.fill();/* Thermometer */ctx.globalAlpha=.8;ctx.beginPath();ctx.moveTo(12,-18);ctx.lineTo(12,8);ctx.arc(12,12,4,Math.PI*1.5,Math.PI*3.5);ctx.stroke();/* Mercury */ctx.fillStyle='#fff';ctx.globalAlpha=.6;var mh=12+Math.sin(t*1.5)*6;ctx.fillRect(11,12-mh,2,mh);ctx.beginPath();ctx.arc(12,12,3,0,Math.PI*2);ctx.fill();/* Checkmark pulse */ctx.globalAlpha=Math.abs(Math.sin(t*2))*.5;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(-9,4);ctx.lineTo(-4,-4);ctx.stroke()}},
        {title:'Packaging & Palletizing',steps:['Product filling and sealing','Labeling and case packing','Pallet stacking per spec diagram','Final QC, wrapping, and shipment staging'],
         drawIcon:function(ctx,t){/* Box with arrow */ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';/* Box front */ctx.beginPath();ctx.rect(-14,-8,28,24);ctx.stroke();/* Box flaps */ctx.beginPath();ctx.moveTo(-14,-8);ctx.lineTo(-8,-18);ctx.lineTo(8,-18);ctx.lineTo(14,-8);ctx.stroke();ctx.beginPath();ctx.moveTo(14,-8);ctx.lineTo(20,-18);ctx.lineTo(8,-18);ctx.stroke();/* Center line */ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(0,-8);ctx.stroke();/* Down arrow — filling animation */ctx.globalAlpha=.7;var ay=-24-((t*20)%12);ctx.beginPath();ctx.moveTo(0,ay);ctx.lineTo(0,ay+8);ctx.moveTo(-3,ay+5);ctx.lineTo(0,ay+8);ctx.lineTo(3,ay+5);ctx.stroke();/* Stacking boxes below */ctx.globalAlpha=.25;ctx.beginPath();ctx.rect(-10,16,8,6);ctx.rect(0,16,8,6);ctx.rect(-6,10,8,6);ctx.stroke()}}
      ];
      var phaseCardStyle='background:#111;border-radius:12px;padding:20px;border:1px solid #222;position:relative';
      var phaseHTML=
        '<div style="margin-bottom:32px">'+
          '<div id="icon-slot-'+i+'"></div>'+
          '<h3 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">Process Development</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">We design, validate, and document your complete production process — from ingredient prep through packaging and palletizing. Every step is mapped so your product runs flawlessly at scale.</p>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:visible"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        /* 4-phase pipeline with connecting arrows */
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;position:relative">';
      phases.forEach(function(ph,pi){
        phaseHTML+=
          '<div class="proc-phase" data-phase="'+pi+'" style="'+phaseCardStyle+';opacity:0;transform:translateY(20px);transition:all .5s ease '+(.15*pi)+'s">'+
            '<canvas class="phase-icon" data-phase-idx="'+pi+'" width="48" height="48" style="display:block;margin-bottom:8px"></canvas>'+
            '<div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Phase '+(pi+1)+'</div>'+
            '<div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:12px">'+ph.title+'</div>'+
            '<ul style="list-style:none;padding:0;margin:0">';
        ph.steps.forEach(function(s){
          phaseHTML+='<li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> '+s+'</li>';
        });
        phaseHTML+='</ul>';
        /* Arrow connector between cards (except last) */
        if(pi<3){
          phaseHTML+='<div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:#C9A84C;font-size:1.2rem;z-index:1">▶</div>';
        }
        phaseHTML+='</div>';
      });
      phaseHTML+='</div>';
      /* Phase cards only — no thermal viz here */
      panel.innerHTML=phaseHTML;
      /* Animate phase cards in on reveal + start canvas icon animations */
      setTimeout(function(){
        var cards=panel.querySelectorAll('.proc-phase');
        cards.forEach(function(c){c.style.opacity='1';c.style.transform='translateY(0)'});
        /* Animate phase canvas icons */
        var phaseCanvases=panel.querySelectorAll('.phase-icon');
        function animPhases(){
          phaseCanvases.forEach(function(cv){
            var idx=parseInt(cv.getAttribute('data-phase-idx'));
            var ctx=cv.getContext('2d');
            ctx.clearRect(0,0,48,48);
            ctx.save();
            ctx.translate(24,24);
            ctx.globalAlpha=1;
            phases[idx].drawIcon(ctx,performance.now()/1000);
            ctx.restore();
          });
          requestAnimationFrame(animPhases);
        }
        animPhases();
      },100);
    } else if(i===3){
      /* ===== PAL / Heat Pen tab — retort diagram + temp graph ===== */
      var palHTML=
        '<div style="margin-bottom:32px">'+
          '<div id="icon-slot-'+i+'"></div>'+
          '<h3 style="font-size:3rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em;line-height:1.15">'+tab.title+'</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">'+tab.desc+'</p>'+
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;columns:2;column-gap:32px">'+
          tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:visible"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        '<div id="pal-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">'+
          '<div style="background:transparent;border-radius:12px;padding:12px 16px 8px;border:1px solid #222;overflow:visible">'+
            '<div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Heat Penetration Study</div>'+
            '<style>'+
            '@keyframes rsvg-draw{to{stroke-dashoffset:0}}'+
            '@keyframes rsvg-fadeIn{from{opacity:0}to{opacity:1}}'+
            '.rsvg-drawn{stroke-dasharray:var(--len,2000);stroke-dashoffset:var(--len,2000);animation:rsvg-draw 1.4s cubic-bezier(.4,0,.2,1) forwards}'+
            '.rsvg-drawn-2{animation-delay:.15s}.rsvg-drawn-3{animation-delay:.3s}.rsvg-drawn-4{animation-delay:.45s}.rsvg-drawn-5{animation-delay:.6s}.rsvg-drawn-6{animation-delay:.75s}.rsvg-drawn-7{animation-delay:.9s}.rsvg-drawn-8{animation-delay:1.05s}.rsvg-drawn-9{animation-delay:1.2s}'+
            '.rsvg-fi{opacity:0;animation:rsvg-fadeIn .4s ease forwards}'+
            '.rsvg-fi-2{animation-delay:.5s}.rsvg-fi-3{animation-delay:.7s}.rsvg-fi-4{animation-delay:.9s}.rsvg-fi-5{animation-delay:1.1s}.rsvg-fi-6{animation-delay:1.3s}.rsvg-fi-7{animation-delay:1.5s}.rsvg-fi-8{animation-delay:1.7s}.rsvg-fi-9{animation-delay:1.9s}.rsvg-fi-10{animation-delay:2.1s}.rsvg-fi-11{animation-delay:2.3s}'+
            '@keyframes rsvg-flowR{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}'+
            '@keyframes rsvg-flowDown{from{stroke-dashoffset:0}to{stroke-dashoffset:30}}'+
            '@keyframes rsvg-flowUp{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}'+
            '.rsvg-pipe-heat{stroke:#ff5533;stroke-width:3px;stroke-dasharray:10 6;fill:none;animation:rsvg-flowR .55s linear infinite;animation-delay:1.8s}'+
            '.rsvg-pipe-water{stroke:#38bdf8;stroke-width:3px;stroke-dasharray:10 6;fill:none;animation:rsvg-flowR .65s linear infinite;animation-delay:1.8s}'+
            '.rsvg-pipe-water-down{stroke:#38bdf8;stroke-width:3px;stroke-dasharray:10 6;fill:none;animation:rsvg-flowDown .65s linear infinite;animation-delay:1.8s}'+
            '.rsvg-pipe-vent{stroke:#cbd5e1;stroke-width:2px;stroke-dasharray:7 5;fill:none;animation:rsvg-flowUp .8s linear infinite;animation-delay:1.8s}'+
            '@keyframes rsvg-thermFill{0%{height:4px;y:160px}50%{height:76px;y:88px}100%{height:4px;y:160px}}'+
            '.rsvg-therm-mercury{animation:rsvg-thermFill 3.8s ease-in-out infinite;animation-delay:1.8s}'+
            '@keyframes rsvg-arrowPop{0%,100%{opacity:0}30%,70%{opacity:1}}'+
            '.rsvg-ha1{animation:rsvg-arrowPop 1.6s ease-in-out infinite;animation-delay:1.9s;opacity:0}'+
            '.rsvg-ha2{animation:rsvg-arrowPop 1.6s ease-in-out .25s infinite;animation-delay:2.15s;opacity:0}'+
            '.rsvg-ha3{animation:rsvg-arrowPop 1.6s ease-in-out .5s infinite;animation-delay:2.4s;opacity:0}'+
            '.rsvg-ha4{animation:rsvg-arrowPop 1.6s ease-in-out .12s infinite;animation-delay:2.05s;opacity:0}'+
            '.rsvg-ha5{animation:rsvg-arrowPop 1.6s ease-in-out .38s infinite;animation-delay:2.3s;opacity:0}'+
            '.rsvg-ha6{animation:rsvg-arrowPop 1.6s ease-in-out .62s infinite;animation-delay:2.55s;opacity:0}'+
            '.rsvg-hu1{animation:rsvg-arrowPop 1.6s ease-in-out .08s infinite;animation-delay:2.0s;opacity:0}'+
            '.rsvg-hu2{animation:rsvg-arrowPop 1.6s ease-in-out .32s infinite;animation-delay:2.24s;opacity:0}'+
            '.rsvg-hu3{animation:rsvg-arrowPop 1.6s ease-in-out .56s infinite;animation-delay:2.48s;opacity:0}'+
            '.rsvg-wa1{animation:rsvg-arrowPop 1.6s ease-in-out .18s infinite;animation-delay:2.1s;opacity:0}'+
            '.rsvg-wa2{animation:rsvg-arrowPop 1.6s ease-in-out .42s infinite;animation-delay:2.34s;opacity:0}'+
            '.rsvg-wa3{animation:rsvg-arrowPop 1.6s ease-in-out .66s infinite;animation-delay:2.58s;opacity:0}'+
            '@keyframes rsvg-steamRise{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(-22px);opacity:0}}'+
            '@keyframes rsvg-steamRise2{0%{transform:translateY(0);opacity:.75}100%{transform:translateY(-28px);opacity:0}}'+
            '.rsvg-sa{animation:rsvg-steamRise 2s ease-out infinite;animation-delay:2s}'+
            '.rsvg-sb{animation:rsvg-steamRise2 2s ease-out .7s infinite;animation-delay:2.7s}'+
            '.rsvg-sc{animation:rsvg-steamRise 2s ease-out 1.3s infinite;animation-delay:3.3s}'+
            '@keyframes rsvg-valveSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}'+
            '.rsvg-valve{transform-box:fill-box;transform-origin:center;animation:rsvg-valveSpin 4s linear infinite;animation-delay:1.8s}'+
            '@keyframes rsvg-blink{0%,90%,100%{opacity:1}93%{opacity:0}96%{opacity:.8}}'+
            '.rsvg-temp{animation:rsvg-blink 8s ease-in-out infinite;animation-delay:2s}'+
            '</style>'+
            '<svg width="100%" viewBox="0 0 680 560" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;margin:0 auto">'+
            '<defs>'+
            '<marker id="rsvg-mh" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#ff5533"/></marker>'+
            '<marker id="rsvg-mw" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#38bdf8"/></marker>'+
            '<marker id="rsvg-ms" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#cbd5e1"/></marker>'+
            '<filter id="rsvg-fh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
            '<filter id="rsvg-fw" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
            '</defs>'+
            '<ellipse cx="138" cy="290" rx="22" ry="178" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn" style="--len:1250"/>'+
            '<rect x="138" y="114" width="404" height="354" rx="4" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-2" style="--len:1520"/>'+
            '<ellipse cx="542" cy="290" rx="22" ry="178" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-3" style="--len:1250"/>'+
            '<ellipse cx="340" cy="290" rx="168" ry="178" fill="none" stroke="#fff" stroke-width="2" stroke-opacity=".35" class="rsvg-drawn rsvg-drawn-4" style="--len:1100"/>'+
            '<rect x="312" y="94" width="56" height="22" rx="3" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-5" style="--len:160"/>'+
            '<rect x="312" y="466" width="56" height="22" rx="3" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-5" style="--len:160"/>'+
            '<rect x="218" y="214" width="244" height="68" rx="3" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".4" stroke-dasharray="5 4" class="rsvg-drawn rsvg-drawn-6" style="--len:640"/>'+
            '<rect x="218" y="336" width="244" height="68" rx="3" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".4" stroke-dasharray="5 4" class="rsvg-drawn rsvg-drawn-6" style="--len:640"/>'+
            '<g class="rsvg-fi rsvg-fi-5">'+
            '<rect x="228" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="1"/>'+
            '<line x1="228" y1="234" x2="256" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="266" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.6"/>'+
            '<line x1="266" y1="234" x2="294" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="326" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.9"/>'+
            '<line x1="326" y1="234" x2="354" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="386" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.45"/>'+
            '<line x1="386" y1="234" x2="414" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="424" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="1"/>'+
            '<line x1="424" y1="234" x2="452" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '</g>'+
            '<g class="rsvg-fi rsvg-fi-6">'+
            '<rect x="228" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.75"/>'+
            '<line x1="228" y1="356" x2="256" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="266" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.5"/>'+
            '<line x1="266" y1="356" x2="294" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="326" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.95"/>'+
            '<line x1="326" y1="356" x2="354" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="386" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.65"/>'+
            '<line x1="386" y1="356" x2="414" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="424" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.85"/>'+
            '<line x1="424" y1="356" x2="452" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '</g>'+
            '<line x1="28" y1="290" x2="116" y2="290" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-7" style="--len:90"/>'+
            '<line x1="28" y1="290" x2="116" y2="290" class="rsvg-pipe-heat rsvg-fi rsvg-fi-8" marker-end="url(#rsvg-mh)" filter="url(#rsvg-fh)"/>'+
            '<text x="20" y="282" fill="#ff5533" font-family="monospace" font-size="13" font-weight="600" letter-spacing="1" class="rsvg-fi rsvg-fi-9">HEAT</text>'+
            '<line x1="28" y1="500" x2="312" y2="500" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-7" style="--len:285"/>'+
            '<line x1="312" y1="466" x2="312" y2="500" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-7" style="--len:35"/>'+
            '<line x1="28" y1="500" x2="310" y2="500" class="rsvg-pipe-water rsvg-fi rsvg-fi-8" filter="url(#rsvg-fw)"/>'+
            '<text x="20" y="492" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="600" letter-spacing="1" class="rsvg-fi rsvg-fi-9">WATER</text>'+
            '<line x1="340" y1="72" x2="340" y2="94" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-8" style="--len:23"/>'+
            '<line x1="340" y1="78" x2="490" y2="78" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-8" style="--len:150"/>'+
            '<line x1="340" y1="50" x2="340" y2="78" class="rsvg-pipe-vent rsvg-fi rsvg-fi-10" marker-end="url(#rsvg-ms)"/>'+
            '<circle cx="490" cy="78" r="14" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-8" style="--len:90"/>'+
            '<g class="rsvg-valve rsvg-fi rsvg-fi-10"><line x1="480" y1="68" x2="500" y2="88" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><line x1="500" y1="68" x2="480" y2="88" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/></g>'+
            '<g class="rsvg-fi rsvg-fi-10"><line x1="490" y1="62" x2="490" y2="50" stroke="#fff" stroke-width="1" stroke-opacity=".3" stroke-dasharray="2 2"/><text x="536" y="56" fill="#cbd5e1" font-family="monospace" font-size="12" font-weight="600" letter-spacing="1">AIR VENTING</text></g>'+
            '<g class="rsvg-sa rsvg-fi rsvg-fi-11"><ellipse cx="487" cy="57" rx="11" ry="7" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-opacity=".7"/><ellipse cx="502" cy="53" rx="9" ry="6" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-opacity=".6"/><ellipse cx="475" cy="52" rx="7" ry="5" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-opacity=".5"/></g>'+
            '<g class="rsvg-sb rsvg-fi rsvg-fi-11"><ellipse cx="490" cy="48" rx="13" ry="8" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-opacity=".55"/><ellipse cx="506" cy="44" rx="10" ry="7" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-opacity=".4"/></g>'+
            '<g class="rsvg-sc rsvg-fi rsvg-fi-11"><ellipse cx="484" cy="42" rx="8" ry="5" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-opacity=".35"/></g>'+
            '<polygon points="172,248 188,240 188,256" fill="#ff5533" class="rsvg-ha1" filter="url(#rsvg-fh)"/>'+
            '<polygon points="172,290 188,282 188,298" fill="#ff5533" class="rsvg-ha2" filter="url(#rsvg-fh)"/>'+
            '<polygon points="172,332 188,324 188,340" fill="#ff5533" class="rsvg-ha3" filter="url(#rsvg-fh)"/>'+
            '<polygon points="508,248 492,240 492,256" fill="#ff5533" class="rsvg-ha4" filter="url(#rsvg-fh)"/>'+
            '<polygon points="508,290 492,282 492,298" fill="#ff5533" class="rsvg-ha5" filter="url(#rsvg-fh)"/>'+
            '<polygon points="508,332 492,324 492,340" fill="#ff5533" class="rsvg-ha6" filter="url(#rsvg-fh)"/>'+
            '<polygon points="270,208 262,192 278,192" fill="#ff5533" class="rsvg-hu1" filter="url(#rsvg-fh)"/>'+
            '<polygon points="340,202 332,186 348,186" fill="#ff5533" class="rsvg-hu2" filter="url(#rsvg-fh)"/>'+
            '<polygon points="410,208 402,192 418,192" fill="#ff5533" class="rsvg-hu3" filter="url(#rsvg-fh)"/>'+
            '<polygon points="270,372 262,388 278,388" fill="#38bdf8" class="rsvg-wa1" filter="url(#rsvg-fw)"/>'+
            '<polygon points="340,378 332,394 348,394" fill="#38bdf8" class="rsvg-wa2" filter="url(#rsvg-fw)"/>'+
            '<polygon points="410,372 402,388 418,388" fill="#38bdf8" class="rsvg-wa3" filter="url(#rsvg-fw)"/>'+
            '<rect x="50" y="130" width="16" height="130" rx="8" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-4" style="--len:305"/>'+
            '<circle cx="58" cy="268" r="12" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-5" style="--len:76"/>'+
            '<rect class="rsvg-therm-mercury rsvg-fi rsvg-fi-5" x="55" y="160" width="6" height="40" rx="3" fill="#ff5533" filter="url(#rsvg-fh)"/>'+
            '<circle cx="58" cy="268" r="7" fill="#ff5533" class="rsvg-fi rsvg-fi-5" filter="url(#rsvg-fh)"/>'+
            '<g class="rsvg-fi rsvg-fi-6" stroke="#fff" stroke-width="1" stroke-opacity=".4"><line x1="66" y1="138" x2="72" y2="138"/><line x1="66" y1="160" x2="72" y2="160"/><line x1="66" y1="182" x2="72" y2="182"/><line x1="66" y1="204" x2="72" y2="204"/><line x1="66" y1="226" x2="72" y2="226"/><line x1="66" y1="248" x2="72" y2="248"/></g>'+
            '<polygon points="58,116 52,128 64,128" fill="#ff5533" class="rsvg-ha1" filter="url(#rsvg-fh)"/>'+
            '<g class="rsvg-temp rsvg-fi rsvg-fi-7"><rect x="42" y="94" width="52" height="20" rx="2" fill="none" stroke="#ff5533" stroke-width="1" stroke-opacity=".5"/><text x="68" y="108" fill="#ff5533" font-family="monospace" font-size="9" font-weight="500" text-anchor="middle" letter-spacing=".5">72 \u2192 121\u00b0C</text></g>'+
            '<g class="rsvg-fi rsvg-fi-4"><text x="340" y="538" fill="#fff" font-family="monospace" font-size="11" font-weight="600" letter-spacing="3" text-anchor="middle" fill-opacity=".35">RETORT VESSEL</text></g>'+
            '<g class="rsvg-fi rsvg-fi-7"><line x1="460" y1="255" x2="480" y2="245" stroke="#fff" stroke-width="1" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="484" y="243" fill="#fff" font-family="monospace" font-size="8" fill-opacity=".4" letter-spacing=".5">PRODUCT LOAD</text></g>'+
            '<g class="rsvg-fi rsvg-fi-7"><line x1="168" y1="470" x2="148" y2="482" stroke="#fff" stroke-width="1" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="28" y="480" fill="#38bdf8" font-family="monospace" font-size="8" fill-opacity=".55" letter-spacing=".5">HEATING MEDIUM</text></g>'+
            '<g class="rsvg-fi rsvg-fi-8"><text x="340" y="50" fill="#fff" font-family="monospace" font-size="9" fill-opacity=".3" letter-spacing="2" text-anchor="middle">T : 0 \u2192 F\u2080 HOLD</text></g>'+
            '</svg>'+
            '<div style="display:flex;gap:14px;margin-top:6px;flex-wrap:wrap;justify-content:center;transform:scale(1);transform-origin:center top">'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #ff5533"></div><span style="color:#ff5533">Heat flow</span></div>'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #38bdf8"></div><span style="color:#38bdf8">Water / steam</span></div>'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #cbd5e1"></div><span style="color:#cbd5e1">Air vent</span></div>'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:2px;background:#fff;opacity:.35"></div>Vessel structure</div>'+
            '</div>'+
          '</div>'+
          '<div id="pal-right" style="background:transparent;border-radius:12px;padding:24px 28px;border:1px solid #222;overflow:visible;display:flex;flex-direction:column;justify-content:center">'+
            '<div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em">Heat Penetration Studies</div>'+
            '<ul id="pal-bullets" style="list-style:none;padding:0;margin:0">'+
              '<li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Thermocouple Placement</strong><br><span style="color:#999;font-size:.85rem">Sensors inserted at the cold spot of each container to record real-time temperature data throughout the thermal process</span></div></li>'+
              '<li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Lethality Calculation (F\u2080)</strong><br><span style="color:#999;font-size:.85rem">Cumulative sterilization value computed from time-temperature data to ensure commercial sterility (F\u2080 \u2265 3.0 min)</span></div></li>'+
              '<li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Come-Up Time (CUT)</strong><br><span style="color:#999;font-size:.85rem">Time for retort to reach processing temperature \u2014 only the final 58% of CUT counts toward lethality per 21 CFR 113</span></div></li>'+
              '<li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Worst-Case Container</strong><br><span style="color:#999;font-size:.85rem">Testing identifies the slowest-heating container position in the retort to establish the scheduled process</span></div></li>'+
              '<li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Temperature Distribution</strong><br><span style="color:#999;font-size:.85rem">Mapping retort temperature uniformity to verify consistent heat delivery across all container positions</span></div></li>'+
              '<li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">FDA Scheduled Process Filing</strong><br><span style="color:#999;font-size:.85rem">Process Authority files validated thermal process with FDA for each product/container/retort combination</span></div></li>'+
            '</ul>'+
          '</div>'+
        '</div>';
      panel.innerHTML=palHTML;
      /* Animate bullet points in one at a time */
      (function(){
        var bullets=panel.querySelectorAll('.pal-bp');
        bullets.forEach(function(b,idx){
          setTimeout(function(){
            b.style.opacity='1';
            b.style.transform='translateY(0)';
          },300+idx*400);
        });
      })();
    } else if(i===4){
      /* ===== Scale-Up tab — production line SVG + animated bullets ===== */
      var suHTML=
        '<div style="margin-bottom:32px">'+
          '<div id="icon-slot-'+i+'"></div>'+
          '<h3 style="font-size:3rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em;line-height:1.15">'+tab.title+'</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">'+tab.desc+'</p>'+
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;columns:2;column-gap:32px">'+
          tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:visible"><span style="position:relative;z-index:1">Get Started \u2192</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">'+
          /* Left: animated production line SVG */
          '<div style="background:transparent;border-radius:12px;padding:16px;border:1px solid #222;overflow:visible">'+
            '<div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Pilot Trial \u2192 Production Line</div>'+
            '<style>'+
            '@keyframes su-draw{to{stroke-dashoffset:0}}'+
            '@keyframes su-fadeIn{from{opacity:0}to{opacity:1}}'+
            '.su-d{stroke-dasharray:var(--l,800);stroke-dashoffset:var(--l,800);animation:su-draw 1.2s cubic-bezier(.4,0,.2,1) forwards}'+
            '.su-d2{animation-delay:.2s}.su-d3{animation-delay:.4s}.su-d4{animation-delay:.6s}.su-d5{animation-delay:.8s}.su-d6{animation-delay:1s}.su-d7{animation-delay:1.2s}'+
            '.su-fi{opacity:0;animation:su-fadeIn .5s ease forwards}'+
            '.su-fi2{animation-delay:.6s}.su-fi3{animation-delay:.9s}.su-fi4{animation-delay:1.2s}.su-fi5{animation-delay:1.5s}.su-fi6{animation-delay:1.8s}.su-fi7{animation-delay:2.1s}'+
            '@keyframes su-flow{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}'+
            '.su-pipe{stroke:#C9A84C;stroke-width:2;stroke-dasharray:8 4;fill:none;animation:su-flow .6s linear infinite}'+
            '@keyframes su-pulse{0%,100%{opacity:.3}50%{opacity:.9}}'+
            '.su-glow{animation:su-pulse 2s ease-in-out infinite}'+
            '@keyframes su-agitate{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}'+
            '.su-stir{transform-box:fill-box;transform-origin:center top;animation:su-agitate .6s ease-in-out infinite;animation-delay:1.5s}'+
            '@keyframes su-fillUp{from{height:0}to{height:24px}}'+
            '.su-liquid{animation:su-fillUp 1.5s ease forwards;animation-delay:1.8s}'+
            '</style>'+
            '<svg width="100%" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">'+
            '<defs>'+
              '<marker id="su-ma" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#C9A84C"/></marker>'+
            '</defs>'+
            /* Stage 1: Ingredient Tank */
            '<g class="su-fi su-fi2">'+
              '<rect x="20" y="80" width="70" height="100" rx="6" fill="none" stroke="#fff" stroke-width="2" class="su-d" style="--l:350"/>'+
              '<ellipse cx="55" cy="80" rx="35" ry="10" fill="none" stroke="#fff" stroke-width="2" class="su-d" style="--l:220"/>'+
              '<rect x="40" y="130" width="30" height="24" rx="2" fill="#C9A84C" fill-opacity=".15" class="su-liquid"/>'+
              '<text x="55" y="200" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">INGREDIENTS</text>'+
            '</g>'+
            /* Pipe 1→2 */
            '<line x1="90" y1="130" x2="140" y2="130" class="su-pipe su-fi su-fi3" marker-end="url(#su-ma)"/>'+
            /* Stage 2: Mixing Vessel */
            '<g class="su-fi su-fi3">'+
              '<path d="M150,90 L145,170 Q148,180 170,180 Q192,180 195,170 L190,90 Z" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d3" style="--l:300"/>'+
              '<line x1="170" y1="70" x2="170" y2="110" stroke="#fff" stroke-width="2" class="su-d su-d3" style="--l:40"/>'+
              '<g class="su-stir"><line x1="160" y1="110" x2="180" y2="120" stroke="#fff" stroke-width="1.5" stroke-opacity=".7"/><line x1="180" y1="110" x2="160" y2="120" stroke="#fff" stroke-width="1.5" stroke-opacity=".7"/></g>'+
              '<text x="170" y="200" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">BLENDING</text>'+
            '</g>'+
            /* Pipe 2→3 */
            '<line x1="195" y1="130" x2="245" y2="130" class="su-pipe su-fi su-fi4" marker-end="url(#su-ma)"/>'+
            /* Stage 3: Filler */
            '<g class="su-fi su-fi4">'+
              '<rect x="250" y="90" width="60" height="80" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d4" style="--l:290"/>'+
              /* Nozzles */
              '<line x1="265" y1="170" x2="265" y2="185" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/>'+
              '<line x1="280" y1="170" x2="280" y2="185" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/>'+
              '<line x1="295" y1="170" x2="295" y2="185" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/>'+
              /* Cans below nozzles */
              '<rect x="258" y="186" width="14" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<rect x="273" y="186" width="14" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<rect x="288" y="186" width="14" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<text x="280" y="222" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">FILLING</text>'+
            '</g>'+
            /* Pipe 3→4 */
            '<line x1="310" y1="130" x2="355" y2="130" class="su-pipe su-fi su-fi5" marker-end="url(#su-ma)"/>'+
            /* Stage 4: Seamer */
            '<g class="su-fi su-fi5">'+
              '<rect x="360" y="95" width="50" height="65" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d5" style="--l:240"/>'+
              '<circle cx="385" cy="90" r="12" fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/>'+
              '<line x1="385" y1="78" x2="385" y2="102" stroke="#fff" stroke-width="1" stroke-opacity=".4"/>'+
              '<line x1="373" y1="90" x2="397" y2="90" stroke="#fff" stroke-width="1" stroke-opacity=".4"/>'+
              '<text x="385" y="178" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">SEAMING</text>'+
            '</g>'+
            /* Pipe 4→5 */
            '<line x1="410" y1="130" x2="445" y2="130" class="su-pipe su-fi su-fi6" marker-end="url(#su-ma)"/>'+
            /* Stage 5: Retort/Thermal */
            '<g class="su-fi su-fi6">'+
              '<ellipse cx="455" cy="130" rx="12" ry="40" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d6" style="--l:320"/>'+
              '<rect x="455" y="90" width="80" height="80" rx="3" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d6" style="--l:330"/>'+
              '<ellipse cx="535" cy="130" rx="12" ry="40" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d6" style="--l:320"/>'+
              /* Heat waves */
              '<g class="su-glow"><text x="470" y="125" fill="#ff5533" font-size="14" fill-opacity=".5">\u2248</text><text x="500" y="140" fill="#ff5533" font-size="14" fill-opacity=".4">\u2248</text><text x="515" y="120" fill="#ff5533" font-size="12" fill-opacity=".35">\u2248</text></g>'+
              '<text x="495" y="190" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">THERMAL</text>'+
            '</g>'+
            /* Second row: Cooling → Labeling → Palletizer */
            /* Pipe down from Retort */
            '<path d="M535,170 L535,260 L500,260" fill="none" class="su-pipe su-fi su-fi7" marker-end="url(#su-ma)"/>'+
            /* Stage 6: Cooling */
            '<g class="su-fi su-fi7">'+
              '<rect x="420" y="240" width="75" height="55" rx="6" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d7" style="--l:270"/>'+
              '<g class="su-glow"><text x="440" y="270" fill="#38bdf8" font-size="14" fill-opacity=".5">\u2744</text><text x="465" y="262" fill="#38bdf8" font-size="11" fill-opacity=".4">\u2744</text><text x="478" y="278" fill="#38bdf8" font-size="9" fill-opacity=".35">\u2744</text></g>'+
              '<text x="457" y="312" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">COOLING</text>'+
            '</g>'+
            /* Pipe Cooling → Labeling */
            '<line x1="420" y1="268" x2="370" y2="268" fill="none" class="su-pipe su-fi su-fi7" marker-end="url(#su-ma)"/>'+
            /* Stage 7: Labeling/QC */
            '<g class="su-fi su-fi7">'+
              '<rect x="290" y="245" width="75" height="48" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d7" style="--l:255"/>'+
              '<rect x="305" y="252" width="18" height="26" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<rect x="330" y="252" width="18" height="26" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<line x1="308" y1="260" x2="320" y2="260" stroke="#C9A84C" stroke-width="1" stroke-opacity=".6"/>'+
              '<line x1="308" y1="265" x2="318" y2="265" stroke="#C9A84C" stroke-width="1" stroke-opacity=".4"/>'+
              '<line x1="333" y1="260" x2="345" y2="260" stroke="#C9A84C" stroke-width="1" stroke-opacity=".6"/>'+
              '<line x1="333" y1="265" x2="343" y2="265" stroke="#C9A84C" stroke-width="1" stroke-opacity=".4"/>'+
              '<text x="327" y="312" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">LABELING + QC</text>'+
            '</g>'+
            /* Pipe Labeling → Palletizer */
            '<line x1="290" y1="268" x2="230" y2="268" fill="none" class="su-pipe su-fi su-fi7" marker-end="url(#su-ma)"/>'+
            /* Stage 8: Palletizer */
            '<g class="su-fi su-fi7">'+
              '<rect x="130" y="240" width="95" height="60" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d7" style="--l:320"/>'+
              /* Stacked boxes */
              '<rect x="145" y="270" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<rect x="165" y="270" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<rect x="185" y="270" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
              '<rect x="155" y="254" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".35"/>'+
              '<rect x="175" y="254" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".35"/>'+
              '<text x="177" y="318" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">PALLETIZING</text>'+
            '</g>'+
            /* Output arrow */
            '<g class="su-fi su-fi7">'+
              '<line x1="130" y1="270" x2="80" y2="270" stroke="#C9A84C" stroke-width="2" marker-end="url(#su-ma)"/>'+
              '<text x="55" y="265" fill="#C9A84C" font-family="monospace" font-size="9" font-weight="600" text-anchor="middle" fill-opacity=".7">SHIP</text>'+
              '<text x="55" y="278" fill="#C9A84C" font-family="monospace" font-size="7" text-anchor="middle" fill-opacity=".5">READY</text>'+
            '</g>'+
            /* Legend */
            '<g style="font-family:monospace;font-size:8px">'+
              '<line x1="20" y1="380" x2="50" y2="380" class="su-pipe"/><text x="55" y="383" fill="rgba(255,255,255,.4)">Product flow</text>'+
              '<line x1="140" y1="380" x2="170" y2="380" stroke="#fff" stroke-width="2" stroke-opacity=".5"/><text x="175" y="383" fill="rgba(255,255,255,.4)">Equipment</text>'+
              '<text x="270" y="383" fill="#ff5533" fill-opacity=".5" font-size="10">\u2248</text><text x="283" y="383" fill="rgba(255,255,255,.4)">Heat</text>'+
              '<text x="330" y="383" fill="#38bdf8" fill-opacity=".5" font-size="10">\u2744</text><text x="343" y="383" fill="rgba(255,255,255,.4)">Cooling</text>'+
            '</g>'+
            '</svg>'+
          '</div>'+
          /* Right: animated scale-up bullet points */
          '<div style="background:transparent;border-radius:12px;padding:24px 28px;border:1px solid #222;overflow:visible;display:flex;flex-direction:column;justify-content:center">'+
            '<div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em">Pilot Trial & Scale-Up</div>'+
            '<ul id="su-bullets" style="list-style:none;padding:0;margin:0">'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Pilot Batch Runs</strong><br><span style="color:#999;font-size:.85rem">Small-scale production trials (50\u2013500 gal) on our in-house equipment to validate your formula before committing to a full commercial run</span></div></li>'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Formula Scale-Up Adjustments</strong><br><span style="color:#999;font-size:.85rem">Bench-top recipes don\u2019t always scale linearly \u2014 we adjust emulsifiers, stabilizers, pH, and thermal parameters for production-volume behavior</span></div></li>'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Pilot Trial QC & Sensory</strong><br><span style="color:#999;font-size:.85rem">Every pilot batch undergoes full QC (Brix, pH, viscosity, micro) and sensory panel evaluation against your gold standard sample</span></div></li>'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Equipment & Line Qualification</strong><br><span style="color:#999;font-size:.85rem">Verify filler speeds, seamer specs, retort capacity, and cooling throughput \u2014 dial in CPM, fill weights, headspace, and seam dimensions</span></div></li>'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Shelf Life Confirmation</strong><br><span style="color:#999;font-size:.85rem">Accelerated and real-time stability studies on pilot samples to validate shelf life, emulsion stability, and sensory integrity</span></div></li>'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">First Production Run</strong><br><span style="color:#999;font-size:.85rem">Once pilot results are approved, we execute the first full-scale production run with first article inspection, seam teardowns, and batch release QC</span></div></li>'+
              '<li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Production SOP & Tech Transfer</strong><br><span style="color:#999;font-size:.85rem">Complete documentation package: batch records, process parameters, QC checkpoints, packaging specs, HACCP integration, and operator training</span></div></li>'+
            '</ul>'+
          '</div>'+
        '</div>';
      panel.innerHTML=suHTML;
      /* Animate scale-up bullets in one at a time */
      (function(){
        var bullets=panel.querySelectorAll('.su-bp');
        bullets.forEach(function(b,idx){
          setTimeout(function(){
            b.style.opacity='1';
            b.style.transform='translateY(0)';
          },300+idx*400);
        });
      })();
    } else if(i===6){
      /* ═══ SUPPLY CHAIN TAB — teaser pointing to Agentic Supply Chain section ═══ */
      panel.innerHTML=
        '<div style="text-align:center;max-width:760px;margin:0 auto;padding:20px 0">'+
          '<div id="icon-slot-'+i+'" style="margin-bottom:12px"></div>'+
          '<h3 style="font-size:2rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">The Agentic Integration</h3>'+
          '<p style="font-size:1.1rem;line-height:1.8;color:#999;margin-bottom:20px;max-width:640px;margin-left:auto;margin-right:auto">The food and beverage industry loses billions every year to manual coordination \u2014 reordering ingredients too late, missing quality flags, filing compliance paperwork after the fact.</p>'+
          '<p style="font-size:1.15rem;line-height:1.8;color:#ccc;margin-bottom:28px;max-width:640px;margin-left:auto;margin-right:auto;font-weight:600">Agentic AI changes that. <span style="color:#C9A84C">Autonomous agents that monitor, decide, and act</span> across your entire operation in real time.</p>'+
          /* ROI callout */
          '<div style="display:inline-flex;align-items:center;gap:16px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-radius:12px;padding:16px 28px;margin-bottom:32px">'+
            '<div style="font-size:2.4rem;font-weight:800;color:#C9A84C;line-height:1">15%</div>'+
            '<div style="text-align:left">'+
              '<div style="font-size:.85rem;font-weight:700;color:#fff;letter-spacing:.03em">Profit Efficiency Gain</div>'+
              '<div style="font-size:.8rem;color:#999;line-height:1.4;margin-top:2px">For $100M\u2013$200M F&B brands, that\u2019s<br><span style="color:#C9A84C;font-weight:600">$15M\u2013$30M</span> back to the bottom line</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        /* Supply Chain process flow — matching beverage-process equipment style */
        '<div style="display:flex;justify-content:center;margin-bottom:32px">'+
          '<svg viewBox="0 0 900 300" width="100%" style="max-width:900px">'+
            '<defs>'+
              '<filter id="scgo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
              '<filter id="scgb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
              '<marker id="scm" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#C9A84C"/></marker>'+
            '</defs>'+
            /* ─── AUTONOMI INTELLIGENCE BAR (top) ─── */
            '<rect x="60" y="16" width="780" height="42" rx="21" stroke="#C9A84C" stroke-width="1.2" fill="none" stroke-opacity=".2" class="cp-d" style="--l:1640;animation-delay:.05s"/>'+
            '<rect x="66" y="22" width="768" height="30" rx="15" stroke="#C9A84C" stroke-width=".6" fill="none" stroke-opacity=".08" class="cp-fi" style="animation-delay:1.2s"/>'+
            /* Neural pulse line inside bar */
            '<line x1="90" y1="37" x2="810" y2="37" stroke="#C9A84C" stroke-width="1.5" stroke-dasharray="4 8" class="cp-pO" style="stroke:#C9A84C" filter="url(#scgo)"/>'+
            /* Hub nodes along the bar */
            '<circle cx="140" cy="37" r="4" fill="#C9A84C" fill-opacity=".6" class="cp-fi" style="animation-delay:1.4s" filter="url(#scgo)"/>'+
            '<circle cx="290" cy="37" r="4" fill="#C9A84C" fill-opacity=".6" class="cp-fi" style="animation-delay:1.5s" filter="url(#scgo)"/>'+
            '<circle cx="450" cy="37" r="6" fill="#C9A84C" fill-opacity=".8" class="cp-fi" style="animation-delay:1.3s" filter="url(#scgo)"/>'+
            '<circle cx="610" cy="37" r="4" fill="#C9A84C" fill-opacity=".6" class="cp-fi" style="animation-delay:1.6s" filter="url(#scgo)"/>'+
            '<circle cx="760" cy="37" r="4" fill="#C9A84C" fill-opacity=".6" class="cp-fi" style="animation-delay:1.7s" filter="url(#scgo)"/>'+
            '<text x="450" y="27" class="cp-lbl" style="font-size:7px;fill:#C9A84C;fill-opacity:.7;letter-spacing:3px">AUTONOMI \u00b7 29 AI AGENTS \u00b7 REAL-TIME</text>'+
            /* ─── VERTICAL DATA FEEDS (bar → stages) ─── */
            '<line x1="140" y1="58" x2="140" y2="108" stroke="#C9A84C" stroke-width="1" stroke-dasharray="3 5" stroke-opacity=".25" class="cp-d" style="--l:50;animation-delay:.8s"/>'+
            '<line x1="290" y1="58" x2="290" y2="108" stroke="#C9A84C" stroke-width="1" stroke-dasharray="3 5" stroke-opacity=".25" class="cp-d" style="--l:50;animation-delay:.9s"/>'+
            '<line x1="450" y1="58" x2="450" y2="108" stroke="#C9A84C" stroke-width="1" stroke-dasharray="3 5" stroke-opacity=".25" class="cp-d" style="--l:50;animation-delay:1s"/>'+
            '<line x1="610" y1="58" x2="610" y2="108" stroke="#C9A84C" stroke-width="1" stroke-dasharray="3 5" stroke-opacity=".25" class="cp-d" style="--l:50;animation-delay:1.1s"/>'+
            '<line x1="760" y1="58" x2="760" y2="108" stroke="#C9A84C" stroke-width="1" stroke-dasharray="3 5" stroke-opacity=".25" class="cp-d" style="--l:50;animation-delay:1.2s"/>'+
            /* ─── GUIDELINE ─── */
            '<line x1="40" y1="270" x2="860" y2="270" stroke="white" stroke-width=".6" stroke-opacity=".05" class="cp-d" style="--l:820;animation-delay:0s"/>'+
            /* ═══ STAGE 1: VENDOR SOURCING (database icon) ═══ */
            '<rect x="100" y="108" width="80" height="100" rx="8" class="cp-d" style="--l:360;animation-delay:.15s"/>'+
            '<path d="M100,108 Q140,94 180,108" class="cp-d" style="--l:88;animation-delay:.2s"/>'+
            /* server/database shelves */
            '<line x1="112" y1="132" x2="168" y2="132" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:56;animation-delay:.5s"/>'+
            '<line x1="112" y1="152" x2="168" y2="152" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:56;animation-delay:.55s"/>'+
            '<line x1="112" y1="172" x2="168" y2="172" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:56;animation-delay:.6s"/>'+
            /* status lights */
            '<circle cx="122" cy="125" r="2" fill="#4ade80" fill-opacity=".5" class="cp-fi" style="animation-delay:1.8s"/>'+
            '<circle cx="122" cy="145" r="2" fill="#4ade80" fill-opacity=".5" class="cp-fi" style="animation-delay:1.9s"/>'+
            '<circle cx="122" cy="165" r="2" fill="#f97316" fill-opacity=".5" class="cp-fi" style="animation-delay:2s"/>'+
            /* data rows */
            '<rect x="130" y="122" width="30" height="5" rx="1" fill="white" fill-opacity=".06" class="cp-fi" style="animation-delay:2s"/>'+
            '<rect x="130" y="142" width="24" height="5" rx="1" fill="white" fill-opacity=".06" class="cp-fi" style="animation-delay:2.1s"/>'+
            '<rect x="130" y="162" width="28" height="5" rx="1" fill="white" fill-opacity=".06" class="cp-fi" style="animation-delay:2.2s"/>'+
            '<text x="140" y="230" class="cp-lbl">VENDOR</text>'+
            '<text x="140" y="241" class="cp-lbl" fill-opacity=".4">SOURCING</text>'+
            /* ─── PIPE: vendor → procurement ─── */
            '<line x1="180" y1="158" x2="240" y2="158" stroke="white" stroke-width="1.5" stroke-opacity=".15" class="cp-d" style="--l:60;animation-delay:.7s"/>'+
            '<line x1="180" y1="158" x2="240" y2="158" class="cp-pO" filter="url(#scgo)"/>'+
            '<polygon points="225,158 215,154 215,162" fill="#f97316" class="cp-ap" filter="url(#scgo)"/>'+
            /* ═══ STAGE 2: PROCUREMENT (PO document) ═══ */
            '<rect x="250" y="108" width="80" height="100" rx="8" class="cp-d" style="--l:360;animation-delay:.3s"/>'+
            /* document icon inside */
            '<rect x="268" y="120" width="44" height="56" rx="3" stroke="white" stroke-width=".8" stroke-opacity=".25" fill="none" class="cp-d" style="--l:200;animation-delay:.65s"/>'+
            /* corner fold */
            '<path d="M298,120 L312,120 L312,134 Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:.75s"/>'+
            /* text lines on doc */
            '<line x1="274" y1="140" x2="300" y2="140" stroke="white" stroke-width=".8" stroke-opacity=".15" class="cp-fi" style="animation-delay:2.1s"/>'+
            '<line x1="274" y1="148" x2="306" y2="148" stroke="white" stroke-width=".8" stroke-opacity=".12" class="cp-fi" style="animation-delay:2.15s"/>'+
            '<line x1="274" y1="156" x2="296" y2="156" stroke="white" stroke-width=".8" stroke-opacity=".1" class="cp-fi" style="animation-delay:2.2s"/>'+
            /* approval checkmark */
            '<path d="M280,164 L286,170 L300,158" stroke="#4ade80" stroke-width="1.5" fill="none" class="cp-d" style="--l:32;animation-delay:1.6s" filter="url(#scgb)"/>'+
            '<text x="290" y="230" class="cp-lbl">PROCUREMENT</text>'+
            '<text x="290" y="241" class="cp-lbl" fill-opacity=".4">AI AGENTS</text>'+
            /* ─── PIPE: procurement → production ─── */
            '<line x1="330" y1="158" x2="400" y2="158" stroke="white" stroke-width="1.5" stroke-opacity=".15" class="cp-d" style="--l:70;animation-delay:.9s"/>'+
            '<line x1="330" y1="158" x2="400" y2="158" class="cp-pO" filter="url(#scgo)"/>'+
            '<polygon points="385,158 375,154 375,162" fill="#f97316" class="cp-ap" filter="url(#scgo)"/>'+
            /* ═══ STAGE 3: PRODUCTION (factory w/ gear) ═══ */
            '<rect x="410" y="108" width="80" height="100" rx="8" class="cp-d" style="--l:360;animation-delay:.4s"/>'+
            /* factory roof line */
            '<path d="M410,108 L430,94 L450,108 L470,94 L490,108" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:100;animation-delay:.45s"/>'+
            /* gear */
            '<circle cx="450" cy="150" r="16" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:100;animation-delay:.8s"/>'+
            '<circle cx="450" cy="150" r="6" stroke="white" stroke-width="1" fill="none" class="cp-imp"/>'+
            /* gear teeth */
            '<line x1="450" y1="132" x2="450" y2="126" stroke="white" stroke-width="2" class="cp-d" style="--l:6;animation-delay:.85s"/>'+
            '<line x1="450" y1="168" x2="450" y2="174" stroke="white" stroke-width="2" class="cp-d" style="--l:6;animation-delay:.87s"/>'+
            '<line x1="432" y1="150" x2="426" y2="150" stroke="white" stroke-width="2" class="cp-d" style="--l:6;animation-delay:.89s"/>'+
            '<line x1="468" y1="150" x2="474" y2="150" stroke="white" stroke-width="2" class="cp-d" style="--l:6;animation-delay:.91s"/>'+
            /* smokestack */
            '<rect x="422" y="94" width="8" height="18" rx="1" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-d" style="--l:52;animation-delay:.7s"/>'+
            /* steam from stack */
            '<path d="M426,90 Q428,84 430,90" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-ws"/>'+
            '<path d="M424,84 Q427,78 430,84" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".25" class="cp-ws1"/>'+
            '<text x="450" y="230" class="cp-lbl">PRODUCTION</text>'+
            '<text x="450" y="241" class="cp-lbl" fill-opacity=".4">SCHEDULING</text>'+
            /* ─── PIPE: production → quality ─── */
            '<line x1="490" y1="158" x2="560" y2="158" stroke="white" stroke-width="1.5" stroke-opacity=".15" class="cp-d" style="--l:70;animation-delay:1.1s"/>'+
            '<line x1="490" y1="158" x2="560" y2="158" class="cp-pO" filter="url(#scgo)"/>'+
            '<polygon points="545,158 535,154 535,162" fill="#f97316" class="cp-ap" filter="url(#scgo)"/>'+
            /* ═══ STAGE 4: QUALITY (shield + checkmark) ═══ */
            '<rect x="570" y="108" width="80" height="100" rx="8" class="cp-d" style="--l:360;animation-delay:.5s"/>'+
            /* shield outline */
            '<path d="M610,118 L632,126 L632,154 Q632,172 610,178 Q588,172 588,154 L588,126 Z" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:180;animation-delay:.85s"/>'+
            /* inner shield fill */
            '<path d="M610,124 L626,130 L626,152 Q626,166 610,172 Q594,166 594,152 L594,130 Z" fill="white" fill-opacity=".03" class="cp-fi" style="animation-delay:2s"/>'+
            /* checkmark inside shield */
            '<path d="M600,148 L607,156 L622,140" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round" class="cp-d" style="--l:36;animation-delay:1.4s" filter="url(#scgb)"/>'+
            /* COA badge */
            '<text x="610" y="195" class="cp-lbl" style="font-size:7px;fill:#4ade80;fill-opacity:.5">COA \u2713</text>'+
            '<text x="610" y="230" class="cp-lbl">QUALITY</text>'+
            '<text x="610" y="241" class="cp-lbl" fill-opacity=".4">INTELLIGENCE</text>'+
            /* ─── PIPE: quality → logistics ─── */
            '<line x1="650" y1="158" x2="710" y2="158" stroke="white" stroke-width="1.5" stroke-opacity=".15" class="cp-d" style="--l:60;animation-delay:1.3s"/>'+
            '<line x1="650" y1="158" x2="710" y2="158" class="cp-pO" filter="url(#scgo)"/>'+
            '<polygon points="698,158 688,154 688,162" fill="#f97316" class="cp-ap" filter="url(#scgo)"/>'+
            /* ═══ STAGE 5: LOGISTICS (truck + route) ═══ */
            '<rect x="720" y="108" width="80" height="100" rx="8" class="cp-d" style="--l:360;animation-delay:.6s"/>'+
            /* truck body */
            '<rect x="734" y="140" width="36" height="24" rx="3" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:120;animation-delay:.95s"/>'+
            /* truck cab */
            '<path d="M770,148 L782,148 L786,156 L786,164 L770,164" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:60;animation-delay:1s"/>'+
            /* wheels */
            '<circle cx="744" cy="166" r="5" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:32;animation-delay:1.1s"/>'+
            '<circle cx="778" cy="166" r="5" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:32;animation-delay:1.15s"/>'+
            /* hub caps */
            '<circle cx="744" cy="166" r="2" fill="white" fill-opacity=".3" class="cp-fi" style="animation-delay:2.3s"/>'+
            '<circle cx="778" cy="166" r="2" fill="white" fill-opacity=".3" class="cp-fi" style="animation-delay:2.35s"/>'+
            /* route dots (GPS path) */
            '<circle cx="740" cy="126" r="2" fill="#f97316" fill-opacity=".4" class="cp-fi" style="animation-delay:2.4s"/>'+
            '<circle cx="752" cy="122" r="1.5" fill="#f97316" fill-opacity=".3" class="cp-fi" style="animation-delay:2.5s"/>'+
            '<circle cx="764" cy="126" r="1.5" fill="#f97316" fill-opacity=".3" class="cp-fi" style="animation-delay:2.6s"/>'+
            '<circle cx="776" cy="122" r="2" fill="#f97316" fill-opacity=".4" class="cp-fi" style="animation-delay:2.7s"/>'+
            '<path d="M740,126 Q746,120 752,122 Q758,124 764,126 Q770,120 776,122" stroke="#f97316" stroke-width=".8" fill="none" stroke-opacity=".25" class="cp-d" style="--l:40;animation-delay:1.5s"/>'+
            '<text x="760" y="230" class="cp-lbl">LOGISTICS</text>'+
            '<text x="760" y="241" class="cp-lbl" fill-opacity=".4">&amp; 3PL</text>'+
            /* ─── STAGE NUMBERS ─── */
            '<text x="140" y="258" class="cp-lbl" style="font-size:7px;fill:#C9A84C;fill-opacity:.35">01</text>'+
            '<text x="290" y="258" class="cp-lbl" style="font-size:7px;fill:#C9A84C;fill-opacity:.35">02</text>'+
            '<text x="450" y="258" class="cp-lbl" style="font-size:7px;fill:#C9A84C;fill-opacity:.35">03</text>'+
            '<text x="610" y="258" class="cp-lbl" style="font-size:7px;fill:#C9A84C;fill-opacity:.35">04</text>'+
            '<text x="760" y="258" class="cp-lbl" style="font-size:7px;fill:#C9A84C;fill-opacity:.35">05</text>'+
          '</svg>'+
        '</div>'+
        /* Bullet capabilities in 2 columns */
        '<div style="max-width:800px;margin:0 auto 36px">'+
          '<ul style="list-style:none;padding:0;margin:0;columns:2;column-gap:32px">'+
            tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">\u2713</span> '+b+'</li>'}).join('')+
          '</ul>'+
        '</div>'+
        /* CTA — scroll to Agentic Supply Chain section */
        '<div style="text-align:center;padding-bottom:8px">'+
          '<a id="sc-explore-btn" href="#autonomi-ai" style="display:inline-flex;align-items:center;gap:10px;padding:14px 36px;font-size:1rem;font-weight:700;border-radius:50px;border:2px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;transition:all .4s ease;letter-spacing:.03em;cursor:pointer">'+
            '<span>Explore The Agentic Supply Chain</span>'+
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3L9 15M9 15L4 10M9 15L14 10" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
          '</a>'+
        '</div>';
      /* Smooth scroll for the explore button */
      (function(){
        setTimeout(function(){
          var btn=document.getElementById('sc-explore-btn');
          if(btn)btn.addEventListener('click',function(e){
            e.preventDefault();
            var target=document.getElementById('autonomi-ai');
            if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
          });
        },100);
      })();
    } else {
    panel.innerHTML=
      '<div style="margin-bottom:32px">'+
        '<div id="icon-slot-'+i+'"></div>'+
        '<h3 style="font-size:3rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em;line-height:1.15">'+tab.title+'</h3>'+
        '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">'+tab.desc+'</p>'+
        '<ul style="list-style:none;padding:0;margin:0 0 24px 0;columns:2;column-gap:32px">'+
          tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">\u2713</span> '+b+'</li>'}).join('')+
        '</ul>'+
        '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:visible"><span style="position:relative;z-index:1">Get Started \u2192</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
      '</div>';
    }
    tabContent.appendChild(panel);
    panels.push(panel);

    // Insert canvas into icon slot
    var slot=panel.querySelector('#icon-slot-'+i);
    if(slot)slot.appendChild(iconCanvas);

    // Click handler
    btn.onclick=function(){
      buttons.forEach(function(b){b.style.color='#bbb';b.style.borderBottomColor='transparent'});
      panels.forEach(function(p){p.style.display='none';var cv=p.querySelector('canvas');if(cv)cv._active=false});
      btn.style.color='#fff';
      btn.style.borderBottomColor='#C9A84C';
      panel.style.display='block';
      // Start icon animation
      iconCanvas._active=true;iconCanvas._animT=0;
      function animIcon(){
        if(!iconCanvas._active)return;
        iconCanvas._animT+=.016;
        var ictx=iconCanvas.getContext('2d');
        ictx.clearRect(0,0,70,70);
        ictx.save();ictx.translate(35,35);
        iconCanvas._draw(ictx,iconCanvas._animT);
        ictx.restore();
        requestAnimationFrame(animIcon);
      }
      animIcon();
      // Liquid fill on Get Started buttons
      panel.querySelectorAll('.cta-outline').forEach(function(a){
        var fb=a.querySelector('.fill-bg');
        if(fb){a.onmouseenter=function(){fb.style.height='100%';a.querySelector('span').style.color='#1A1A1A'};a.onmouseleave=function(){fb.style.height='0';a.querySelector('span').style.color='#C9A84C'}}
      });
    };

    btn.onmouseenter=function(){if(btn.style.color!=='rgb(255, 255, 255)')btn.style.color='#ccc'};
    btn.onmouseleave=function(){if(btn.style.color!=='rgb(255, 255, 255)')btn.style.color='#bbb'};
  });

  // Activate first tab
  buttons[0].onclick();

  // Co-Packing process cards with expandable SVG diagrams (index 5)
  if(panels.length>5){
    var coPackPanel=panels[5];
    /* CSS for draw-on + expansion — beverage-process style */
    var cpStyle=document.createElement('style');
    cpStyle.textContent='@keyframes cpDraw{to{stroke-dashoffset:0}}'+
      '@keyframes cpFade{from{opacity:0}to{opacity:1}}'+
      '@keyframes cpFlow{from{stroke-dashoffset:28}to{stroke-dashoffset:0}}'+
      '@keyframes cpPop{0%,100%{opacity:0}30%,70%{opacity:1}}'+
      '@keyframes cpSwell{0%{transform:translateY(0)scaleY(1);opacity:.8}45%{transform:translateY(-4px)scaleY(1.03);opacity:1}100%{transform:translateY(0)scaleY(1);opacity:.8}}'+
      '@keyframes cpWisp{0%{transform:translateY(0);opacity:.7}100%{transform:translateY(-14px);opacity:0}}'+
      '@keyframes cpDrip{0%,100%{opacity:0;transform:scaleY(0)}30%,70%{opacity:1;transform:scaleY(1)}}'+
      '@keyframes cpSpin{to{transform:rotate(360deg)}}'+
      '@keyframes cpBelt{from{stroke-dashoffset:36}to{stroke-dashoffset:0}}'+
      '@keyframes cpSweep{0%{transform:rotate(-35deg)}55%{transform:rotate(40deg)}100%{transform:rotate(-35deg)}}'+
      '.cp-d{fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:cpDraw 1.1s cubic-bezier(.4,0,.15,1) forwards}'+
      '.cp-glow{fill:none;stroke:#C9A84C;stroke-width:1;opacity:0;animation:cpFade .6s ease 1s forwards}'+
      '.cp-fi{opacity:0;animation:cpFade .4s ease forwards}'+
      '.cp-pO{stroke:#f97316;stroke-width:2.5;stroke-dasharray:10 6;fill:none;animation:cpFlow .5s linear infinite;animation-delay:2s}'+
      '.cp-pB{stroke:#38bdf8;stroke-width:2.5;stroke-dasharray:10 6;fill:none;animation:cpFlow .6s linear infinite;animation-delay:2s}'+
      '.cp-ap{animation:cpPop 1.6s ease-in-out infinite;animation-delay:2s;opacity:0}'+
      '.cp-liq{transform-box:fill-box;transform-origin:bottom center;animation:cpSwell 3.5s ease-in-out infinite;animation-delay:2s}'+
      '.cp-ws{animation:cpWisp 2.2s ease-out infinite;animation-delay:2s}'+
      '.cp-ws1{animation:cpWisp 2.2s ease-out .7s infinite;animation-delay:2.7s}'+
      '.cp-drip{transform-box:fill-box;transform-origin:top center;animation:cpDrip 1.4s ease-in-out infinite;animation-delay:2s;opacity:0}'+
      '.cp-drip2{transform-box:fill-box;transform-origin:top center;animation:cpDrip 1.4s ease-in-out .35s infinite;animation-delay:2.35s;opacity:0}'+
      '.cp-drip3{transform-box:fill-box;transform-origin:top center;animation:cpDrip 1.4s ease-in-out .7s infinite;animation-delay:2.7s;opacity:0}'+
      '.cp-imp{transform-box:fill-box;transform-origin:center;animation:cpSpin 1s linear infinite;animation-delay:2s}'+
      '.cp-belt{animation:cpBelt .7s linear infinite;animation-delay:2s}'+
      '.cp-ndl{transform-box:fill-box;transform-origin:50% 100%;animation:cpSweep 3.2s ease-in-out infinite;animation-delay:2s}'+
      '.cp-lbl{fill:rgba(255,255,255,.5);font-family:monospace;font-size:9px;text-anchor:middle}'+
      '.cp-lbl2{fill:#f97316;font-family:monospace;font-size:8px;text-anchor:middle;fill-opacity:.6}'+
      '.cp-card{background:rgba(255,255,255,.03);border:1px solid #222;border-radius:14px;padding:24px;cursor:pointer;transition:border-color .3s,transform .3s,box-shadow .3s}'+
      '.cp-card:hover{border-color:#C9A84C;transform:translateY(-4px)}.cp-card.cp-active{border-color:#C9A84C;box-shadow:0 0 20px rgba(201,168,76,.15)}'+
      '.cp-expand{max-height:0;overflow:visible;transition:max-height .5s cubic-bezier(.4,0,.2,1),opacity .4s ease;opacity:0}'+
      '.cp-expand.cp-open{max-height:400px;opacity:1}';
    document.head.appendChild(cpStyle);
    var cpProcs=[
      {title:'Tunnel Pasteurization',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><rect x="6" y="14" width="52" height="22" rx="3" class="cp-d" style="--l:160;animation-delay:.2s"/><line x1="6" y1="25" x2="58" y2="25" class="cp-d" style="--l:52;animation-delay:.5s"/><rect x="14" y="18" width="8" height="14" rx="2" class="cp-d" style="--l:48;animation-delay:.7s"/><rect x="28" y="18" width="8" height="14" rx="2" class="cp-d" style="--l:48;animation-delay:.85s"/><rect x="42" y="18" width="8" height="14" rx="2" class="cp-d" style="--l:48;animation-delay:1s"/><path d="M18,10 Q18,6 22,6 M32,10 Q32,6 36,6 M46,10 Q46,6 50,6" class="cp-glow" stroke-width="1.2"/></svg>',
       desc:'Continuous hot-water tunnel for high-acid beverages \u2014 juice, tea, kombucha.',
       specs:['High-acid (pH < 4.6)','Glass & PET','12\u201364 oz','Continuous'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g1o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g1b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m1" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="118" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:0.3s"/><line x1="78" y1="120" x2="118" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="98,120 90,116 90,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="118" y="58" width="72" height="105" rx="6" class="cp-d" style="--l:354;animation-delay:.35s"/><line x1="124" y1="82" x2="184" y2="82" stroke="white" stroke-width="1.5" class="cp-d" style="--l:60;animation-delay:.5s"/><line x1="133" y1="82" x2="133" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:30;animation-delay:.6s"/><line x1="150" y1="82" x2="150" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:30;animation-delay:.67s"/><line x1="167" y1="82" x2="167" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:30;animation-delay:.74s"/><line x1="133" y1="112" x2="133" y2="145" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g1o)"/><line x1="150" y1="112" x2="150" y2="145" stroke="#f97316" stroke-width="1.5" class="cp-drip2" filter="url(#g1o)"/><line x1="167" y1="112" x2="167" y2="145" stroke="#f97316" stroke-width="1.5" class="cp-drip3" filter="url(#g1o)"/><path d="M129,145 L129,160 Q133,164 137,160 L137,145" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.5s"/><path d="M146,145 L146,160 Q150,164 154,160 L154,145" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.6s"/><path d="M163,145 L163,160 Q167,164 171,160 L171,145" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.7s"/><text x="154" y="205" class="cp-lbl">FILLER</text><line x1="190" y1="120" x2="228" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:38;animation-delay:0.85s"/><line x1="190" y1="120" x2="228" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="209,120 201,116 201,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="228" y="52" width="330" height="122" rx="10" class="cp-d" style="--l:904;animation-delay:.9s"/><line x1="393" y1="52" x2="393" y2="174" stroke="white" stroke-width="1" stroke-opacity=".15" class="cp-d" style="--l:122;animation-delay:1.2s"/><text x="310" y="72" class="cp-lbl2">185&#176;F+</text><path d="M265,82 Q270,75 275,82 Q280,89 285,82" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g1o)"/><path d="M320,82 Q325,75 330,82 Q335,89 340,82" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g1o)"/><path d="M365,82 Q370,75 375,82 Q380,89 385,82" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g1o)"/><text x="470" y="72" class="cp-lbl" style="fill:#38bdf8;fill-opacity:.6">COOLING</text><path d="M425,84 Q430,78 435,84" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".35" class="cp-fi" style="animation-delay:2s"/><path d="M465,84 Q470,78 475,84" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".35" class="cp-fi" style="animation-delay:2.1s"/><path d="M505,84 Q510,78 515,84" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".35" class="cp-fi" style="animation-delay:2.2s"/><line x1="238" y1="160" x2="548" y2="160" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="248" cy="160" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:1.1s"/><circle cx="538" cy="160" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:1.15s"/><path d="M280,144 L280,157 Q284,161 288,157 L288,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.8s"/><path d="M345,144 L345,157 Q349,161 353,157 L353,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.9s"/><path d="M435,144 L435,157 Q439,161 443,157 L443,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:2s"/><path d="M505,144 L505,157 Q509,161 513,157 L513,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:2.1s"/><text x="310" y="205" class="cp-lbl">HEAT ZONE</text><text x="470" y="205" class="cp-lbl">COOL ZONE</text><line x1="558" y1="120" x2="598" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:1.4s"/><line x1="558" y1="120" x2="598" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="578,120 570,116 570,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="598" y="68" width="64" height="92" rx="6" class="cp-d" style="--l:312;animation-delay:1.5s"/><circle cx="630" cy="95" r="12" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:76;animation-delay:1.65s"/><circle cx="630" cy="95" r="4" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><text x="630" y="205" class="cp-lbl">LABEL</text><text x="630" y="216" class="cp-lbl" fill-opacity=".4">&amp; QA</text><line x1="662" y1="120" x2="698" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:36;animation-delay:1.8s"/><line x1="662" y1="120" x2="698" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="680,120 672,116 672,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="698" y="128" width="70" height="42" rx="3" class="cp-d" style="--l:224;animation-delay:1.9s"/><rect x="703" y="106" width="60" height="26" rx="2" class="cp-d" style="--l:172;animation-delay:2s" stroke-opacity=".6"/><rect x="708" y="88" width="50" height="22" rx="2" class="cp-d" style="--l:144;animation-delay:2.1s" stroke-opacity=".4"/><text x="733" y="205" class="cp-lbl">PALLET</text><text x="733" y="216" class="cp-lbl" fill-opacity=".4">PACK</text></svg>'},
      {title:'Retort Processing',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><ellipse cx="12" cy="24" rx="6" ry="16" class="cp-d" style="--l:100;animation-delay:.2s"/><rect x="12" y="8" width="40" height="32" rx="2" class="cp-d" style="--l:150;animation-delay:.4s"/><ellipse cx="52" cy="24" rx="6" ry="16" class="cp-d" style="--l:100;animation-delay:.6s"/><circle cx="32" cy="24" r="3" class="cp-d" style="--l:20;animation-delay:.9s"/><path d="M24,16 Q26,12 28,16 M34,16 Q36,12 38,16" class="cp-glow" stroke-width="1.5"/><line x1="52" y1="8" x2="58" y2="4" class="cp-d" style="--l:10;animation-delay:1s"/><line x1="52" y1="40" x2="58" y2="44" class="cp-d" style="--l:10;animation-delay:1s"/></svg>',
       desc:'Batch pressure-cooking for low-acid shelf-stable products \u2014 soups, broths, plant milks.',
       specs:['Low-acid (pH \u2265 4.6)','Cans: 8\u201312oz','250\u00b0F+','FDA filed'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g2o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g2b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="20" y="48" width="56" height="90" rx="6" class="cp-d" style="--l:292;animation-delay:.1s"/><path d="M20,48 Q48,32 76,48" class="cp-d" style="--l:64;animation-delay:.15s"/><rect x="26" y="90" width="44" height="36" rx="3" fill="#f97316" fill-opacity=".12" class="cp-liq"/><line x1="48" y1="138" x2="48" y2="165" stroke="white" stroke-width="1.2" class="cp-d" style="--l:27;animation-delay:.35s"/><line x1="48" y1="152" x2="48" y2="178" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g2o)"/><rect x="38" y="178" width="20" height="28" rx="2" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:1.2s"/><text x="48" y="205" class="cp-lbl">CAN</text><text x="48" y="216" class="cp-lbl" fill-opacity=".4">FILLER</text><line x1="76" y1="120" x2="120" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:44;animation-delay:0.4s"/><line x1="76" y1="120" x2="120" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="98,120 90,116 90,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><rect x="120" y="68" width="60" height="90" rx="6" class="cp-d" style="--l:300;animation-delay:.5s"/><ellipse cx="150" cy="68" rx="30" ry="8" class="cp-d" style="--l:100;animation-delay:.55s"/><ellipse cx="150" cy="158" rx="30" ry="8" class="cp-d" style="--l:100;animation-delay:.6s"/><circle cx="150" cy="112" r="14" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:90;animation-delay:.7s"/><circle cx="150" cy="112" r="5" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><text x="150" y="205" class="cp-lbl">DOUBLE</text><text x="150" y="216" class="cp-lbl" fill-opacity=".4">SEAM</text><line x1="180" y1="120" x2="228" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:48;animation-delay:0.8s"/><line x1="180" y1="120" x2="228" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="204,120 196,116 196,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><ellipse cx="240" cy="120" rx="14" ry="42" class="cp-d" style="--l:180;animation-delay:.9s"/><rect x="240" y="78" width="180" height="84" rx="3" class="cp-d" style="--l:528;animation-delay:.95s"/><ellipse cx="420" cy="120" rx="14" ry="42" class="cp-d" style="--l:180;animation-delay:1s"/><line x1="260" y1="100" x2="400" y2="100" stroke="white" stroke-width=".6" stroke-opacity=".15" class="cp-d" style="--l:140;animation-delay:1.2s"/><line x1="260" y1="140" x2="400" y2="140" stroke="white" stroke-width=".6" stroke-opacity=".15" class="cp-d" style="--l:140;animation-delay:1.25s"/><rect x="270" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.5s"/><rect x="290" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.55s"/><rect x="310" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.6s"/><rect x="330" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.65s"/><rect x="350" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.7s"/><circle cx="380" cy="78" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:1.1s"/><line x1="380" y1="78" x2="380" y2="70" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g2o)"/><path d="M270,72 Q275,65 280,72 Q285,79 290,72" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g2o)"/><path d="M310,72 Q315,65 320,72 Q325,79 330,72" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g2o)"/><path d="M350,72 Q355,65 360,72 Q365,79 370,72" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g2o)"/><text x="330" y="135" class="cp-lbl2">250&#176;F</text><text x="330" y="205" class="cp-lbl">RETORT</text><text x="330" y="216" class="cp-lbl" fill-opacity=".4">VESSEL</text><line x1="434" y1="120" x2="478" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:44;animation-delay:1.4s"/><line x1="434" y1="120" x2="478" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="456,120 448,116 448,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><rect x="478" y="58" width="72" height="110" rx="8" class="cp-d" style="--l:364;animation-delay:1.5s"/><path d="M478,58 Q514,42 550,58" class="cp-d" style="--l:80;animation-delay:1.55s"/><rect x="484" y="98" width="60" height="50" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".4" fill="none" class="cp-fi" style="animation-delay:2s"/><rect x="485" y="118" width="58" height="29" rx="2" fill="#38bdf8" fill-opacity=".2" class="cp-liq"/><path d="M490,58 L490,42 L530,42 L530,58" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 4" fill="none" class="cp-fi" style="animation-delay:2.2s"/><text x="514" y="205" class="cp-lbl">COOLING</text><line x1="550" y1="120" x2="598" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:48;animation-delay:1.8s"/><line x1="550" y1="120" x2="598" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="574,120 566,116 566,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><rect x="598" y="78" width="80" height="80" rx="6" class="cp-d" style="--l:320;animation-delay:1.9s"/><line x1="598" y1="158" x2="720" y2="158" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="608" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2s"/><circle cx="710" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.05s"/><rect x="688" y="130" width="24" height="26" rx="2" class="cp-d" style="--l:100;animation-delay:2.1s" stroke-opacity=".4"/><rect x="718" y="130" width="24" height="26" rx="2" class="cp-d" style="--l:100;animation-delay:2.2s" stroke-opacity=".3"/><rect x="696" y="110" width="24" height="22" rx="2" class="cp-d" style="--l:92;animation-delay:2.3s" stroke-opacity=".25"/><text x="660" y="205" class="cp-lbl">LABEL &amp;</text><text x="660" y="216" class="cp-lbl" fill-opacity=".4">CASE PACK</text></svg>'},
      {title:'ESL Bottling',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><path d="M24,42 L22,18 L26,8 L26,4 L38,4 L38,8 L42,18 L40,42 Z" class="cp-d" style="--l:120;animation-delay:.2s"/><line x1="22" y1="28" x2="42" y2="28" class="cp-d" style="--l:20;animation-delay:.6s"/><rect x="26" y="1" width="12" height="4" rx="1" class="cp-d" style="--l:36;animation-delay:.4s"/><path d="M16,12 Q10,24 16,36" class="cp-d" style="--l:30;animation-delay:.8s" stroke-opacity=".5"/><path d="M48,12 Q54,24 48,36" class="cp-d" style="--l:30;animation-delay:.8s" stroke-opacity=".5"/><circle cx="10" cy="18" r="2" class="cp-glow" fill="#C9A84C" stroke="none"/><circle cx="54" cy="30" r="2" class="cp-glow" fill="#C9A84C" stroke="none"/></svg>',
       desc:'Extended Shelf Life \u2014 light pasteurization + clean-fill for 180\u2013365 day refrigerated shelf life.',
       specs:['Refrigerated','180\u2013365 day','PET & HDPE','Accelerated Shelf Life Study'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g3o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g3b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m3" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="128" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:0.3s"/><line x1="78" y1="120" x2="128" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="103,120 95,116 95,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="128" y="50" width="110" height="120" rx="8" class="cp-d" style="--l:460;animation-delay:.4s"/><line x1="148" y1="60" x2="148" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.6s"/><line x1="163" y1="60" x2="163" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.65s"/><line x1="178" y1="60" x2="178" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.7s"/><line x1="193" y1="60" x2="193" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.75s"/><line x1="208" y1="60" x2="208" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.8s"/><line x1="223" y1="60" x2="223" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.85s"/><line x1="155" y1="70" x2="155" y2="150" stroke="#f97316" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pO" filter="url(#g3o)"/><line x1="185" y1="70" x2="185" y2="150" stroke="#f97316" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pO" filter="url(#g3o)"/><line x1="215" y1="150" x2="215" y2="70" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pB" filter="url(#g3b)"/><circle cx="183" cy="43" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:1.0s"/><line x1="183" y1="43" x2="183" y2="35" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g3o)"/><text x="183" y="75" class="cp-lbl2">270&#176;F</text><text x="183" y="205" class="cp-lbl">UHT</text><text x="183" y="216" class="cp-lbl" fill-opacity=".4">PASTEURIZER</text><line x1="238" y1="120" x2="285" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:47;animation-delay:1.1s"/><line x1="238" y1="120" x2="285" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="261,120 253,116 253,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="285" y="42" width="140" height="130" rx="8" class="cp-d" style="--l:540;animation-delay:1.2s"/><rect x="292" y="49" width="126" height="116" rx="5" stroke="#C9A84C" stroke-width="1" stroke-opacity=".25" stroke-dasharray="6 4" fill="none" class="cp-fi" style="animation-delay:1.8s"/><text x="355" y="68" class="cp-lbl" style="fill:#C9A84C;fill-opacity:.5">ACCEL. SHELF LIFE</text><line x1="310" y1="85" x2="400" y2="85" stroke="white" stroke-width="1.5" class="cp-d" style="--l:90;animation-delay:1.4s"/><line x1="325" y1="85" x2="325" y2="110" stroke="white" stroke-width="1" class="cp-d" style="--l:25;animation-delay:1.5s"/><line x1="355" y1="85" x2="355" y2="110" stroke="white" stroke-width="1" class="cp-d" style="--l:25;animation-delay:1.55s"/><line x1="385" y1="85" x2="385" y2="110" stroke="white" stroke-width="1" class="cp-d" style="--l:25;animation-delay:1.6s"/><line x1="325" y1="110" x2="325" y2="140" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g3o)"/><line x1="355" y1="110" x2="355" y2="140" stroke="#f97316" stroke-width="1.5" class="cp-drip2" filter="url(#g3o)"/><line x1="385" y1="110" x2="385" y2="140" stroke="#f97316" stroke-width="1.5" class="cp-drip3" filter="url(#g3o)"/><path d="M319,140 L319,158 Q325,163 331,158 L331,140" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.8s"/><path d="M349,140 L349,158 Q355,163 361,158 L361,140" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.85s"/><path d="M379,140 L379,158 Q385,163 391,158 L391,140" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.9s"/><text x="355" y="205" class="cp-lbl">ACCEL. SHELF LIFE</text><text x="355" y="216" class="cp-lbl" fill-opacity=".4">STUDY</text><line x1="425" y1="120" x2="470" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:1.7s"/><line x1="425" y1="120" x2="470" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="447,120 439,116 439,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="470" y="62" width="60" height="100" rx="6" class="cp-d" style="--l:320;animation-delay:1.8s"/><line x1="500" y1="68" x2="500" y2="95" stroke="white" stroke-width="1.5" class="cp-d" style="--l:27;animation-delay:1.95s"/><rect x="490" y="92" width="20" height="10" rx="2" class="cp-d" style="--l:60;animation-delay:2s"/><path d="M491,110 L491,150 Q500,155 509,150 L509,110" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:2.1s"/><text x="500" y="205" class="cp-lbl">CAPPING</text><line x1="530" y1="120" x2="575" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:2.1s"/><line x1="530" y1="120" x2="575" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="552,120 544,116 544,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="575" y="55" width="90" height="115" rx="8" class="cp-d" style="--l:410;animation-delay:2.2s"/><rect x="582" y="62" width="76" height="101" rx="5" stroke="white" stroke-width=".6" stroke-opacity=".15" fill="none" class="cp-fi" style="animation-delay:2.5s"/><circle cx="600" cy="92" r="3" fill="#38bdf8" fill-opacity=".4" class="cp-fi" style="animation-delay:2.6s"/><circle cx="620" cy="85" r="2" fill="#38bdf8" fill-opacity=".3" class="cp-fi" style="animation-delay:2.65s"/><circle cx="640" cy="95" r="2.5" fill="#38bdf8" fill-opacity=".35" class="cp-fi" style="animation-delay:2.7s"/><text x="620" y="130" class="cp-lbl" style="fill:#38bdf8;fill-opacity:.5">36&#176;F</text><text x="620" y="205" class="cp-lbl">COLD</text><text x="620" y="216" class="cp-lbl" fill-opacity=".4">CHAIN</text></svg>'},
      {title:'Aseptic Bottling',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><path d="M24,42 L22,18 L26,8 L26,4 L38,4 L38,8 L42,18 L40,42 Z" class="cp-d" style="--l:120;animation-delay:.2s"/><rect x="26" y="1" width="12" height="4" rx="1" class="cp-d" style="--l:36;animation-delay:.4s"/><line x1="32" y1="10" x2="32" y2="38" class="cp-d" style="--l:28;animation-delay:.7s" stroke-opacity=".3"/><path d="M14,6 L20,14 M50,6 L44,14 M14,42 L20,34 M50,42 L44,34" class="cp-glow" stroke-width="1.5"/><circle cx="32" cy="24" r="10" class="cp-d" style="--l:64;animation-delay:.9s" stroke-opacity=".2" stroke-dasharray="4 4"/></svg>',
       desc:'UHT sterilization + aseptic PET filling. No preservatives \u2014 12+ month ambient shelf life.',
       specs:['Ambient','PET 2\u201364oz','No preservatives','12+ months'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g4o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g4b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m4" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="18" y="52" width="52" height="118" rx="8" class="cp-d" style="--l:340;animation-delay:0.1s"/><path d="M18,52 Q44,36 70,52" class="cp-d" style="--l:70;animation-delay:0.15000000000000002s"/><rect x="23" y="111" width="42" height="53" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="24" y="137" width="40" height="29" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="44" y="205" class="cp-lbl">PRODUCT</text><text x="44" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="70" y1="120" x2="108" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:38;animation-delay:0.3s"/><line x1="70" y1="120" x2="108" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="89,120 81,116 81,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="108" y="48" width="100" height="124" rx="8" class="cp-d" style="--l:448;animation-delay:.4s"/><path d="M120,70 Q145,62 145,80 Q145,98 120,90 Q145,82 145,100 Q145,118 120,110 Q145,102 145,120 Q145,138 120,130 Q145,122 145,140 Q145,158 120,150" stroke="#f97316" stroke-width="1.2" fill="none" stroke-opacity=".5" class="cp-d" style="--l:400;animation-delay:.6s"/><line x1="170" y1="65" x2="170" y2="155" stroke="white" stroke-width="1.5" class="cp-d" style="--l:90;animation-delay:.55s"/><line x1="190" y1="65" x2="190" y2="155" stroke="white" stroke-width="1.5" class="cp-d" style="--l:90;animation-delay:.58s"/><line x1="170" y1="65" x2="190" y2="65" stroke="white" stroke-width="1" class="cp-d" style="--l:20;animation-delay:.62s"/><line x1="170" y1="155" x2="190" y2="155" stroke="white" stroke-width="1" class="cp-d" style="--l:20;animation-delay:.65s"/><circle cx="180" cy="42" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:0.8s"/><line x1="180" y1="42" x2="180" y2="34" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g4o)"/><text x="158" y="108" class="cp-lbl2">280&#176;F</text><path d="M125,42 Q130,35 135,42 Q140,49 145,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g4o)"/><path d="M155,42 Q160,35 165,42 Q170,49 175,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g4o)"/><text x="158" y="205" class="cp-lbl">UHT</text><text x="158" y="216" class="cp-lbl" fill-opacity=".4">STERILIZER</text><line x1="208" y1="120" x2="248" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:1.0s"/><line x1="208" y1="120" x2="248" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="228,120 220,116 220,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="248" y="62" width="70" height="100" rx="6" class="cp-d" style="--l:340;animation-delay:1.1s"/><path d="M258,80 L308,80 L258,95 L308,95 L258,110 L308,110 L258,125 L308,125 L258,140 L308,140" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-d" style="--l:450;animation-delay:1.3s"/><line x1="270" y1="70" x2="270" y2="152" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pB" filter="url(#g4b)"/><text x="283" y="205" class="cp-lbl">FLASH</text><text x="283" y="216" class="cp-lbl" fill-opacity=".4">COOLER</text><line x1="318" y1="120" x2="358" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:1.4s"/><line x1="318" y1="120" x2="358" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="338,120 330,116 330,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="358" y="62" width="50" height="100" rx="8" class="cp-d" style="--l:300;animation-delay:1.5s"/><path d="M358,62 Q383,46 408,62" class="cp-d" style="--l:58;animation-delay:1.55s"/><rect x="363" y="67" width="40" height="90" rx="5" stroke="white" stroke-width=".6" stroke-opacity=".12" fill="none" class="cp-fi" style="animation-delay:2s"/><rect x="365" y="105" width="36" height="40" rx="2" fill="#f97316" fill-opacity=".1" class="cp-liq"/><text x="383" y="205" class="cp-lbl">STERILE</text><text x="383" y="216" class="cp-lbl" fill-opacity=".4">HOLD</text><line x1="408" y1="120" x2="452" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:44;animation-delay:1.7s"/><line x1="408" y1="120" x2="452" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="430,120 422,116 422,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="452" y="40" width="145" height="135" rx="8" class="cp-d" style="--l:560;animation-delay:1.8s"/><rect x="459" y="47" width="131" height="121" rx="5" stroke="#C9A84C" stroke-width="1" stroke-opacity=".25" stroke-dasharray="6 4" fill="none" class="cp-fi" style="animation-delay:2.2s"/><text x="524" y="65" class="cp-lbl" style="fill:#C9A84C;fill-opacity:.5">STERILE ZONE</text><line x1="475" y1="85" x2="575" y2="85" stroke="white" stroke-width="1.5" class="cp-d" style="--l:100;animation-delay:2s"/><line x1="492" y1="85" x2="492" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:27;animation-delay:2.05s"/><line x1="524" y1="85" x2="524" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:27;animation-delay:2.1s"/><line x1="556" y1="85" x2="556" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:27;animation-delay:2.15s"/><line x1="492" y1="112" x2="492" y2="142" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g4o)"/><line x1="524" y1="112" x2="524" y2="142" stroke="#f97316" stroke-width="1.5" class="cp-drip2" filter="url(#g4o)"/><line x1="556" y1="112" x2="556" y2="142" stroke="#f97316" stroke-width="1.5" class="cp-drip3" filter="url(#g4o)"/><path d="M486,142 L486,162 Q492,167 498,162 L498,142" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:2.3s"/><path d="M518,142 L518,162 Q524,167 530,162 L530,142" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:2.35s"/><path d="M550,142 L550,162 Q556,167 562,162 L562,142" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:2.4s"/><text x="524" y="205" class="cp-lbl">ASEPTIC</text><text x="524" y="216" class="cp-lbl" fill-opacity=".4">PET FILLER</text><line x1="597" y1="120" x2="640" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:43;animation-delay:2.3s"/><line x1="597" y1="120" x2="640" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="618,120 610,116 610,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="640" y="65" width="65" height="95" rx="6" class="cp-d" style="--l:320;animation-delay:2.4s"/><line x1="672" y1="72" x2="672" y2="98" stroke="white" stroke-width="1.2" class="cp-d" style="--l:26;animation-delay:2.55s"/><rect x="662" y="95" width="20" height="8" rx="2" class="cp-d" style="--l:56;animation-delay:2.6s"/><circle cx="672" cy="130" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:2.65s"/><circle cx="672" cy="130" r="3.5" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><text x="672" y="205" class="cp-lbl">CAP &amp;</text><text x="672" y="216" class="cp-lbl" fill-opacity=".4">LABEL</text></svg>'},
      {title:'Aseptic Bag-in-Box',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><rect x="8" y="6" width="48" height="36" rx="2" class="cp-d" style="--l:175;animation-delay:.2s"/><path d="M16,12 Q32,18 48,12 L46,36 Q32,30 18,36 Z" class="cp-d" style="--l:120;animation-delay:.5s" stroke-opacity=".5"/><circle cx="44" cy="10" r="3" class="cp-d" style="--l:20;animation-delay:.8s"/><line x1="44" y1="10" x2="56" y2="4" class="cp-d" style="--l:16;animation-delay:.9s"/><path d="M8,6 L2,2 M56,6 L62,2" class="cp-d" style="--l:12;animation-delay:.4s" stroke-opacity=".3"/></svg>',
       desc:'Large-format aseptic fill for foodservice, industrial, and bulk retail \u2014 2L\u201325L.',
       specs:['2L\u201325L','Foodservice','Concentrate & RTD','Aseptic valve'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g5o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g5b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m5" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="128" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:0.3s"/><line x1="78" y1="120" x2="128" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="103,120 95,116 95,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="128" y="48" width="95" height="124" rx="8" class="cp-d" style="--l:438;animation-delay:.4s"/><path d="M140,68 Q170,62 170,80 Q170,98 140,90 Q170,82 170,100 Q170,118 140,110 Q170,102 170,120 Q170,138 140,130 Q170,122 170,140" stroke="#f97316" stroke-width="1.2" fill="none" stroke-opacity=".5" class="cp-d" style="--l:380;animation-delay:.6s"/><line x1="192" y1="62" x2="192" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.55s"/><line x1="210" y1="62" x2="210" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.58s"/><line x1="192" y1="62" x2="210" y2="62" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.62s"/><line x1="192" y1="158" x2="210" y2="158" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.65s"/><circle cx="200" cy="42" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:0.8s"/><line x1="200" y1="42" x2="200" y2="34" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g5o)"/><path d="M145,42 Q150,35 155,42 Q160,49 165,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g5o)"/><path d="M175,42 Q180,35 185,42 Q190,49 195,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g5o)"/><text x="175" y="108" class="cp-lbl2">280&#176;F</text><text x="175" y="205" class="cp-lbl">UHT</text><line x1="223" y1="120" x2="268" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:1.0s"/><line x1="223" y1="120" x2="268" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="245,120 237,116 237,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="268" y="60" width="55" height="105" rx="8" class="cp-d" style="--l:320;animation-delay:1.1s"/><path d="M268,60 Q295,44 323,60" class="cp-d" style="--l:62;animation-delay:1.15s"/><rect x="275" y="110" width="41" height="40" rx="2" fill="#f97316" fill-opacity=".1" class="cp-liq"/><text x="295" y="205" class="cp-lbl">STERILE</text><text x="295" y="216" class="cp-lbl" fill-opacity=".4">HOLD</text><line x1="323" y1="120" x2="378" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:55;animation-delay:1.4s"/><line x1="323" y1="120" x2="378" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="350,120 342,116 342,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="378" y="38" width="165" height="140" rx="8" class="cp-d" style="--l:610;animation-delay:1.5s"/><rect x="385" y="45" width="151" height="126" rx="5" stroke="#C9A84C" stroke-width="1" stroke-opacity=".25" stroke-dasharray="6 4" fill="none" class="cp-fi" style="animation-delay:1.9s"/><text x="460" y="63" class="cp-lbl" style="fill:#C9A84C;fill-opacity:.5">STERILE ZONE</text><rect x="440" y="72" width="40" height="16" rx="3" class="cp-d" style="--l:112;animation-delay:1.7s"/><line x1="460" y1="88" x2="460" y2="108" stroke="white" stroke-width="1.2" class="cp-d" style="--l:20;animation-delay:1.8s"/><circle cx="460" cy="98" r="4" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:26;animation-delay:1.85s"/><line x1="460" y1="105" x2="460" y2="125" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g5o)"/><rect x="418" y="120" width="84" height="48" rx="2" class="cp-d" style="--l:264;animation-delay:1.6s" stroke-opacity=".5"/><path d="M425,128 Q460,118 495,128 L492,160 Q460,150 428,160 Z" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:2s"/><path d="M430,142 Q460,135 490,142 L488,155 Q460,148 432,155 Z" fill="#f97316" fill-opacity=".08" class="cp-liq"/><circle cx="490" cy="128" r="4" stroke="#C9A84C" stroke-width="1" fill="none" class="cp-d" style="--l:26;animation-delay:2.1s"/><text x="460" y="205" class="cp-lbl">ASEPTIC</text><text x="460" y="216" class="cp-lbl" fill-opacity=".4">BAG FILLER</text><line x1="543" y1="120" x2="595" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:52;animation-delay:2.2s"/><line x1="543" y1="120" x2="595" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="569,120 561,116 561,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="595" y="68" width="80" height="95" rx="6" class="cp-d" style="--l:350;animation-delay:2.3s"/><rect x="612" y="85" width="46" height="32" rx="2" class="cp-d" style="--l:156;animation-delay:2.45s" stroke-opacity=".5"/><path d="M612,85 L625,75" stroke="white" stroke-width=".8" class="cp-d" style="--l:16;animation-delay:2.5s" stroke-opacity=".4"/><path d="M658,85 L645,75" stroke="white" stroke-width=".8" class="cp-d" style="--l:16;animation-delay:2.5s" stroke-opacity=".4"/><line x1="595" y1="163" x2="720" y2="163" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="605" cy="163" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.4s"/><circle cx="710" cy="163" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.45s"/><rect x="690" y="135" width="26" height="26" rx="2" class="cp-d" style="--l:104;animation-delay:2.55s" stroke-opacity=".35"/><rect x="695" y="114" width="26" height="24" rx="2" class="cp-d" style="--l:100;animation-delay:2.65s" stroke-opacity=".25"/><text x="650" y="205" class="cp-lbl">BOX SEAL</text><text x="650" y="216" class="cp-lbl" fill-opacity=".4">&amp; PALLET</text></svg>'},
      {title:'Tetra Pak',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><path d="M18,44 L18,8 L32,2 L46,8 L46,44 Z" class="cp-d" style="--l:140;animation-delay:.2s"/><line x1="18" y1="8" x2="46" y2="8" class="cp-d" style="--l:28;animation-delay:.5s"/><path d="M18,8 L32,2 L46,8" class="cp-d" style="--l:36;animation-delay:.6s"/><line x1="32" y1="2" x2="32" y2="8" class="cp-d" style="--l:6;animation-delay:.7s" stroke-opacity=".4"/><rect x="26" y="14" width="12" height="8" rx="1" class="cp-d" style="--l:44;animation-delay:.8s" stroke-opacity=".4"/><circle cx="32" cy="18" r="2" class="cp-glow" fill="#C9A84C" stroke="none"/><path d="M22,30 L42,30 M22,36 L42,36" class="cp-d" style="--l:44;animation-delay:1s" stroke-opacity=".25"/></svg>',
       desc:'Multi-layer carton packaging for dairy alternatives, juice, broth \u2014 200mL\u20131L.',
       specs:['Carton','200mL\u20131L','Ambient','Sustainable'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g6o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g6b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m6" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="128" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:0.3s"/><line x1="78" y1="120" x2="128" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="103,120 95,116 95,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="128" y="48" width="90" height="124" rx="8" class="cp-d" style="--l:428;animation-delay:.4s"/><path d="M140,68 Q165,62 165,80 Q165,98 140,90 Q165,82 165,100 Q165,118 140,110 Q165,102 165,120 Q165,138 140,130" stroke="#f97316" stroke-width="1.2" fill="none" stroke-opacity=".5" class="cp-d" style="--l:360;animation-delay:.6s"/><line x1="186" y1="62" x2="186" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.55s"/><line x1="204" y1="62" x2="204" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.58s"/><line x1="186" y1="62" x2="204" y2="62" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.62s"/><line x1="186" y1="158" x2="204" y2="158" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.65s"/><circle cx="195" cy="42" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:0.8s"/><line x1="195" y1="42" x2="195" y2="34" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g6o)"/><path d="M142,42 Q147,35 152,42 Q157,49 162,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g6o)"/><path d="M168,42 Q173,35 178,42 Q183,49 188,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g6o)"/><text x="172" y="108" class="cp-lbl2">280&#176;F</text><text x="172" y="205" class="cp-lbl">UHT</text><line x1="218" y1="120" x2="265" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:47;animation-delay:1.0s"/><line x1="218" y1="120" x2="265" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="241,120 233,116 233,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="265" y="40" width="200" height="140" rx="8" class="cp-d" style="--l:680;animation-delay:1.1s"/><circle cx="295" cy="75" r="18" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:114;animation-delay:1.25s"/><circle cx="295" cy="75" r="6" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><path d="M295,93 L295,145 Q295,155 305,155 L430,155" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".25" class="cp-d" style="--l:200;animation-delay:1.4s"/><line x1="330" y1="55" x2="330" y2="165" stroke="white" stroke-width="1.2" class="cp-d" style="--l:110;animation-delay:1.3s"/><line x1="350" y1="55" x2="350" y2="85" stroke="white" stroke-width="1.2" class="cp-d" style="--l:30;animation-delay:1.45s"/><line x1="350" y1="85" x2="350" y2="115" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g6o)"/><path d="M360,95 L360,135 L390,135 L390,95" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.7s"/><path d="M400,90 L400,135 L430,135 L430,90 L415,82 L400,90" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:1.8s"/><path d="M440,88 L440,135 L455,135 L455,88 L447,82 L440,88" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:1.9s"/><line x1="340" y1="140" x2="370" y2="140" stroke="#f97316" stroke-width="1.5" stroke-opacity=".4" class="cp-fi" style="animation-delay:2s"/><line x1="340" y1="95" x2="370" y2="95" stroke="#f97316" stroke-width="1" stroke-opacity=".3" class="cp-fi" style="animation-delay:2.05s"/><text x="380" y="60" class="cp-lbl">FORM</text><text x="380" y="72" class="cp-lbl" fill-opacity=".4">FILL SEAL</text><text x="365" y="205" class="cp-lbl">FORM-FILL</text><text x="365" y="216" class="cp-lbl" fill-opacity=".4">SEAL</text><line x1="465" y1="120" x2="510" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:2.0s"/><line x1="465" y1="120" x2="510" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="487,120 479,116 479,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="510" y="60" width="70" height="110" rx="6" class="cp-d" style="--l:360;animation-delay:2.1s"/><path d="M528,88 L528,148 L562,148 L562,88 L545,80 L528,88" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:2.3s"/><line x1="520" y1="75" x2="548" y2="75" stroke="white" stroke-width="1.2" class="cp-d" style="--l:28;animation-delay:2.35s"/><rect x="538" y="72" width="10" height="7" rx="1" stroke="#C9A84C" stroke-width="1" fill="none" class="cp-d" style="--l:34;animation-delay:2.4s"/><line x1="545" y1="100" x2="545" y2="115" stroke="#C9A84C" stroke-width="1" stroke-opacity=".5" class="cp-fi" style="animation-delay:2.5s"/><text x="545" y="205" class="cp-lbl">CAP &amp;</text><text x="545" y="216" class="cp-lbl" fill-opacity=".4">STRAW</text><line x1="580" y1="120" x2="625" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:2.5s"/><line x1="580" y1="120" x2="625" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="602,120 594,116 594,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="625" y="70" width="75" height="88" rx="6" class="cp-d" style="--l:326;animation-delay:2.6s"/><line x1="625" y1="158" x2="770" y2="158" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="635" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.65s"/><circle cx="760" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.7s"/><rect x="710" y="128" width="30" height="28" rx="2" class="cp-d" style="--l:116;animation-delay:2.75s" stroke-opacity=".4"/><rect x="745" y="128" width="30" height="28" rx="2" class="cp-d" style="--l:116;animation-delay:2.85s" stroke-opacity=".3"/><rect x="718" y="106" width="30" height="24" rx="2" class="cp-d" style="--l:108;animation-delay:2.95s" stroke-opacity=".25"/><text x="680" y="205" class="cp-lbl">CASE</text><text x="680" y="216" class="cp-lbl" fill-opacity=".4">PACK</text></svg>'}
    ];
    /* Build layout: Row1 → Expansion → Row2 */
    var cpWrap=document.createElement('div');
    cpWrap.style.cssText='margin-top:36px;padding-top:36px;border-top:1px solid #222';
    var row1=document.createElement('div');row1.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:20px';
    var expSlot=document.createElement('div');expSlot.className='cp-expand';expSlot.style.cssText='margin:16px 0;border-radius:14px;background:rgba(255,255,255,.02);border:1px solid transparent;padding:0 24px';
    var row2=document.createElement('div');row2.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:20px';
    var activeIdx=-1;
    var allCards=[];
    function openSlot(idx){
      if(activeIdx===idx){expSlot.className='cp-expand';expSlot.style.borderColor='transparent';allCards[idx].classList.remove('cp-active');activeIdx=-1;return;}
      if(activeIdx>=0)allCards[activeIdx].classList.remove('cp-active');
      activeIdx=idx;
      allCards[idx].classList.add('cp-active');
      expSlot.innerHTML='<div style="padding:20px 0"><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:12px;letter-spacing:.05em">'+cpProcs[idx].title.toUpperCase()+' \u2014 PROCESS FLOW</div>'+cpProcs[idx].diagram+'</div>';
      expSlot.style.borderColor='#222';
      expSlot.className='cp-expand cp-open';
    }
    cpProcs.forEach(function(p,pi){
      var card=document.createElement('div');
      card.className='cp-card';
      card.style.cssText+='opacity:0;animation:tabFadeIn .5s ease '+(.15+pi*.1)+'s forwards';
      card.innerHTML=
        '<div style="margin-bottom:12px">'+p.svg+'</div>'+
        '<div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:6px">'+p.title+'</div>'+
        '<p style="font-size:.82rem;line-height:1.5;color:#888;margin-bottom:10px">'+p.desc+'</p>'+
        '<ul style="list-style:none;padding:0;margin:0">'+p.specs.map(function(s){return '<li style="padding:2px 0;color:#666;font-size:.78rem"><span style="color:#C9A84C;margin-right:6px">\u25b8</span>'+s+'</li>'}).join('')+'</ul>';
      card.onclick=function(){openSlot(pi)};
      allCards.push(card);
      if(pi<3)row1.appendChild(card);else row2.appendChild(card);
    });
    cpWrap.appendChild(row1);
    cpWrap.appendChild(expSlot);
    cpWrap.appendChild(row2);
    coPackPanel.appendChild(cpWrap);
    /* Hide native service cards */
    var nativeGrid=document.querySelector('.services-grid');
    if(nativeGrid)nativeGrid.style.display='none';
  }


  // Add fadeIn animation
  var style=document.createElement('style');
  style.textContent='@keyframes tabFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);

})();}
// ── END disabled tab view ──

// ── 5c. SERVICE SECTION NATIVE ANIMATIONS ──
// Carousel, parallax, animated icons, and co-packing cards
// injected into native Webflow sections (no tab system).
(function(){
  setTimeout(function(){

      var ghBase='https://lynz-tonomi.github.io/macrobrands/';

      // ── 0. ALIGN SERVICE CONTAINERS to match About section (no padding, left-aligned) ──
      document.querySelectorAll('.svc-container').forEach(function(c){
        c.style.cssText+=';padding-left:0;padding-right:0';
      });
      document.querySelectorAll('.svc-h2,.svc-desc,.svc-label').forEach(function(el){
        el.style.textAlign='left';
      });

      // ── 0b. SHORTEN DESCRIPTIONS + BIGGER FONTS ──
      var shortCopy={
        'svc-formulation':'We reverse-engineer your kitchen recipe for commercial production — adjusting pH, stability, and shelf life so your formula is locked, validated, and ready to scale from day one.',
        'svc-microthermic':'Our in-house MicroThermics UHT/HTST processor lets you validate your exact thermal curve on a bench-top unit before committing to a full production run. Send us a half-gallon sample and get validated time-temperature data within days.',
        'svc-copacking':'From pilot batches to full-scale production runs, our co-packing operation keeps quality consistent, timelines tight, and per-unit costs under control. Retort, aseptic, hot-fill, and cold-fill — all under one roof.',
        'svc-supporting':'End-to-end support from process development through FDA filing. Our in-house Process Authority and QA team handle thermal validation, regulatory compliance, and shelf-life testing so you can focus on building your brand.'
      };
      Object.keys(shortCopy).forEach(function(secId){
        var sec=document.getElementById(secId);
        if(!sec)return;
        var desc=sec.querySelector('.svc-desc');
        if(desc) desc.textContent=shortCopy[secId];
      });
      // ── GLOBAL FONT + LEGIBILITY BOOST ──
      // Inject a style block for global readability
      var readStyle=document.createElement('style');
      readStyle.textContent=
        // Service section headings
        '.svc-h2{font-size:3rem !important;line-height:1.15 !important;font-weight:800 !important;letter-spacing:-0.02em !important}'+
        // Service descriptions — bright on dark bg, dark on light bg
        '.svc-desc{font-size:1.25rem !important;line-height:1.8 !important;color:rgba(255,255,255,0.85) !important;max-width:680px}'+
        '#svc-microthermic .svc-desc{color:#333 !important}'+
        '#svc-microthermic .svc-section p,#svc-microthermic p,#svc-microthermic span,#svc-microthermic li{color:#444 !important}'+
        '#svc-microthermic h3,#svc-microthermic h4{color:#111 !important}'+
        // Service labels
        '.svc-label{font-size:0.85rem !important;letter-spacing:0.12em !important;font-weight:600 !important;color:#C9A84C !important}'+
        // Service bullet items
        '.svc-bullet-item{font-size:1rem !important}'+
        '.svc-check{color:#C9A84C !important}'+
        // About / light section body text
        '.section-body{font-size:1.2rem !important;line-height:1.8 !important;color:#333 !important}'+
        // Dark section text legibility
        '.section-dark p,.section-dark span,.section-dark li,.section-dark-alt p,.section-dark-alt span,.section-dark-alt li{color:rgba(255,255,255,0.8) !important;font-size:1.1rem !important;line-height:1.75 !important}'+
        '.section-dark h2,.section-dark h3,.section-dark-alt h2,.section-dark-alt h3{color:#fff !important}'+
        '.section-dark .section-subhead,.section-dark-alt .section-subhead{color:rgba(255,255,255,0.7) !important;font-size:1.15rem !important;line-height:1.7 !important}'+
        // Card text on light bg
        '.card-text{font-size:1.05rem !important;line-height:1.7 !important;color:#555 !important}'+
        // General body text boost
        'p{line-height:1.75 !important}'+
        // Co-packing card text on dark bg
        '.svc-section p,.svc-section li,.svc-section span{color:rgba(255,255,255,0.8) !important}'+
        '.svc-section h3,.svc-section h4{color:#fff !important}'+
        // Remove underlines from Equipment Capabilities items
        '.svc-caps-item{border-bottom:none !important}';
      document.head.appendChild(readStyle);

      // ── 1. ANIMATED CANVAS ICONS next to section headings ──
      var iconDefs={
        'svc-formulation':function(ctx,t){
          // Detailed Erlenmeyer flask with measurement lines, bubbling liquid, vapour
          var c='#fff';ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';
          var b=1+Math.sin(t*2.5)*.015;ctx.scale(b,b);
          // Flask body
          ctx.beginPath();ctx.moveTo(-7,-28);ctx.lineTo(-7,-12);ctx.lineTo(-20,24);ctx.lineTo(20,24);ctx.lineTo(7,-12);ctx.lineTo(7,-28);ctx.stroke();
          // Neck rim
          ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-9,-28);ctx.lineTo(9,-28);ctx.stroke();
          // Measurement tick marks
          ctx.lineWidth=1;ctx.globalAlpha=.4;
          for(var i=0;i<4;i++){var my=20-i*8;var mw=4+i*1;ctx.beginPath();ctx.moveTo(-18+i*2.5,my);ctx.lineTo(-18+i*2.5+mw,my);ctx.stroke();}
          // Liquid fill with animated wave surface
          ctx.globalAlpha=.2;ctx.fillStyle=c;
          var wv=Math.sin(t*3)*2.5;var wv2=Math.sin(t*3+2)*1.5;
          ctx.beginPath();ctx.moveTo(-17,8+wv);ctx.bezierCurveTo(-8,5-wv,8,5+wv2,17,8-wv);ctx.lineTo(20,24);ctx.lineTo(-20,24);ctx.closePath();ctx.fill();
          // Second liquid layer
          ctx.globalAlpha=.1;ctx.beginPath();ctx.moveTo(-17,12+wv2);ctx.bezierCurveTo(-6,9-wv2,6,9+wv,17,12-wv2);ctx.lineTo(20,24);ctx.lineTo(-20,24);ctx.closePath();ctx.fill();
          // Bubbles rising
          ctx.globalAlpha=.55;ctx.fillStyle=c;
          for(var i=0;i<6;i++){
            var bx=-8+Math.sin(i*2.1+t*1.5)*6;
            var by=22-((t*18+i*12)%30);
            var br=0.8+Math.sin(i*3)*.5;
            if(by>5){ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.fill();}
          }
          // Vapour wisps above flask
          ctx.globalAlpha=.25;ctx.strokeStyle=c;ctx.lineWidth=1;
          for(var i=0;i<3;i++){
            var vx=-3+i*3;var vy=-30-((t*12+i*8)%18);var vw=Math.sin(t*3+i*2)*3;
            ctx.beginPath();ctx.moveTo(vx,vy+6);ctx.quadraticCurveTo(vx+vw,vy+3,vx,vy);ctx.stroke();
          }
          // Stirring rod
          ctx.globalAlpha=.6;ctx.strokeStyle=c;ctx.lineWidth=1.2;
          var rodAng=Math.sin(t*2)*.15;
          ctx.save();ctx.rotate(rodAng);
          ctx.beginPath();ctx.moveTo(2,-34);ctx.lineTo(2,2);ctx.stroke();
          ctx.restore();
        },
        'svc-microthermic':function(ctx,t){
          // Detailed thermometer with graduated scale, mercury column, radiating heat
          var c='#444';ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';
          // Thermometer outer shell
          ctx.beginPath();
          ctx.moveTo(-5,-32);ctx.lineTo(-5,6);ctx.arc(0,12,12,Math.PI*0.92,Math.PI*0.08);ctx.lineTo(5,6);ctx.lineTo(5,-32);
          ctx.arc(0,-32,5,0,Math.PI,true);ctx.stroke();
          // Inner tube
          ctx.lineWidth=1;ctx.globalAlpha=.3;
          ctx.beginPath();ctx.moveTo(-2.5,-28);ctx.lineTo(-2.5,6);ctx.moveTo(2.5,-28);ctx.lineTo(2.5,6);ctx.stroke();
          // Scale ticks
          ctx.globalAlpha=.5;ctx.lineWidth=.8;
          for(var i=0;i<8;i++){var ty=-26+i*4.5;var tw=(i%2===0)?5:3;ctx.beginPath();ctx.moveTo(5,ty);ctx.lineTo(5+tw,ty);ctx.stroke();}
          // Mercury bulb
          var mH=22+Math.sin(t*1.8)*6;
          ctx.fillStyle='#ef4444';ctx.globalAlpha=.85;
          ctx.beginPath();ctx.arc(0,12,8,0,Math.PI*2);ctx.fill();
          // Mercury column rising
          ctx.fillRect(-2,12-mH,4,mH);
          // Mercury column highlight
          ctx.fillStyle='#ff8888';ctx.globalAlpha=.3;ctx.fillRect(-0.5,12-mH,1.5,mH);
          // Degree markers on mercury side
          ctx.fillStyle=c;ctx.globalAlpha=.35;ctx.font='5px sans-serif';ctx.textAlign='left';
          var labels=['20','40','60','80'];
          for(var i=0;i<4;i++){ctx.fillText(labels[i],11,-24+i*8);}
          // Heat waves radiating
          ctx.globalAlpha=.6;ctx.strokeStyle='#ef4444';ctx.lineWidth=1.5;
          for(var i=0;i<4;i++){
            var wx=18+i*5;var amp=Math.sin(t*3.5+i*1.2)*3;
            ctx.beginPath();ctx.moveTo(wx,4);ctx.quadraticCurveTo(wx+amp,-4,wx,-12);ctx.stroke();
          }
          // Small heat particles
          ctx.fillStyle='#ef4444';ctx.globalAlpha=.4;
          for(var i=0;i<5;i++){
            var px=20+Math.sin(t*2+i*1.7)*8;var py=-8+Math.cos(t*1.5+i*2.3)*10;
            ctx.beginPath();ctx.arc(px,py,.8,0,Math.PI*2);ctx.fill();
          }
        },
        'svc-copacking':function(ctx,t){
          // Detailed bottle on conveyor belt with cap, label, fill animation
          var c='#fff';ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';
          // Bottle body - detailed shape with shoulder
          ctx.beginPath();
          ctx.moveTo(-10,24);ctx.lineTo(-12,4);ctx.quadraticCurveTo(-12,-2,-8,-8);
          ctx.lineTo(-5,-14);ctx.lineTo(-5,-22);ctx.lineTo(5,-22);ctx.lineTo(5,-14);
          ctx.lineTo(8,-8);ctx.quadraticCurveTo(12,-2,12,4);ctx.lineTo(10,24);ctx.closePath();ctx.stroke();
          // Cap
          ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-22);ctx.lineTo(-6,-27);ctx.lineTo(6,-27);ctx.lineTo(6,-22);ctx.stroke();
          ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-7,-27);ctx.lineTo(7,-27);ctx.stroke();
          // Cap ridges
          ctx.lineWidth=.6;ctx.globalAlpha=.4;
          for(var i=0;i<5;i++){var cx=-5+i*2.5;ctx.beginPath();ctx.moveTo(cx,-27);ctx.lineTo(cx,-22);ctx.stroke();}
          // Label area
          ctx.globalAlpha=.15;ctx.fillStyle=c;
          ctx.fillRect(-10,2,20,14);
          ctx.globalAlpha=.3;ctx.strokeStyle=c;ctx.lineWidth=.8;
          ctx.strokeRect(-10,2,20,14);
          // Label text lines
          ctx.globalAlpha=.2;ctx.lineWidth=.8;
          ctx.beginPath();ctx.moveTo(-7,6);ctx.lineTo(7,6);ctx.stroke();
          ctx.beginPath();ctx.moveTo(-7,9);ctx.lineTo(4,9);ctx.stroke();
          ctx.beginPath();ctx.moveTo(-7,12);ctx.lineTo(6,12);ctx.stroke();
          // Liquid filling animation
          var fH=((t*14)%38);
          ctx.fillStyle=c;ctx.globalAlpha=.12;
          ctx.save();
          ctx.beginPath();ctx.rect(-12,24-fH,24,fH);ctx.clip();
          ctx.beginPath();
          ctx.moveTo(-10,24);ctx.lineTo(-12,4);ctx.quadraticCurveTo(-12,-2,-8,-8);
          ctx.lineTo(-5,-14);ctx.lineTo(-5,-22);ctx.lineTo(5,-22);ctx.lineTo(5,-14);
          ctx.lineTo(8,-8);ctx.quadraticCurveTo(12,-2,12,4);ctx.lineTo(10,24);ctx.closePath();ctx.fill();
          ctx.restore();
          // Conveyor belt
          ctx.globalAlpha=.5;ctx.strokeStyle=c;ctx.lineWidth=1.5;
          ctx.beginPath();ctx.moveTo(-30,26);ctx.lineTo(30,26);ctx.stroke();
          // Conveyor rollers
          ctx.globalAlpha=.3;ctx.lineWidth=1;
          var rollOff=(t*20)%10;
          for(var i=-3;i<4;i++){
            var rx=-25+i*10+rollOff;
            ctx.beginPath();ctx.arc(rx,28,2.5,0,Math.PI*2);ctx.stroke();
            // Roller rotation lines
            var ra=t*4;
            ctx.beginPath();ctx.moveTo(rx+Math.cos(ra)*1.5,28+Math.sin(ra)*1.5);
            ctx.lineTo(rx-Math.cos(ra)*1.5,28-Math.sin(ra)*1.5);ctx.stroke();
          }
          // Filling stream from top
          ctx.globalAlpha=.5;ctx.strokeStyle=c;ctx.lineWidth=1;
          var streamOff=(t*30)%8;
          ctx.setLineDash([2,3]);
          ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(0,-27);ctx.stroke();
          ctx.setLineDash([]);
          // Droplets
          ctx.globalAlpha=.4;ctx.fillStyle=c;
          for(var i=0;i<3;i++){
            var dy=-34+((t*25+i*10)%12);
            var dx=Math.sin(i*1.5)*.8;
            ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);ctx.fill();
          }
        },
        'svc-supporting':function(ctx,t){
          // Detailed gear + wrench combo with inner details
          var c='#fff';ctx.strokeStyle=c;ctx.lineWidth=1.8;ctx.lineCap='round';ctx.lineJoin='round';
          // Main gear - rotating
          var ga=t*0.8;ctx.save();ctx.rotate(ga);
          var teeth=8;var outerR=16;var innerR=12;var toothH=5;
          ctx.beginPath();
          for(var i=0;i<teeth;i++){
            var a1=i*Math.PI*2/teeth-Math.PI/(teeth*2);
            var a2=i*Math.PI*2/teeth+Math.PI/(teeth*2);
            var a3=(i+0.5)*Math.PI*2/teeth-Math.PI/(teeth*2.5);
            var a4=(i+0.5)*Math.PI*2/teeth+Math.PI/(teeth*2.5);
            if(i===0)ctx.moveTo(Math.cos(a1)*innerR,Math.sin(a1)*innerR);
            ctx.lineTo(Math.cos(a1)*(innerR+toothH),Math.sin(a1)*(innerR+toothH));
            ctx.lineTo(Math.cos(a2)*(innerR+toothH),Math.sin(a2)*(innerR+toothH));
            ctx.lineTo(Math.cos(a3)*innerR,Math.sin(a3)*innerR);
          }
          ctx.closePath();ctx.stroke();
          // Inner circles
          ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.stroke();
          ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.stroke();
          // Spokes
          ctx.globalAlpha=.25;ctx.lineWidth=1;
          for(var i=0;i<4;i++){var sa=i*Math.PI/2;ctx.beginPath();ctx.moveTo(Math.cos(sa)*3.5,Math.sin(sa)*3.5);ctx.lineTo(Math.cos(sa)*6.5,Math.sin(sa)*6.5);ctx.stroke();}
          ctx.globalAlpha=1;
          ctx.restore();
          // Small gear - counter-rotating
          ctx.save();ctx.translate(18,-14);ctx.rotate(-ga*1.6);
          ctx.lineWidth=1.5;
          var teeth2=6;var outerR2=9;var innerR2=6;var toothH2=3.5;
          ctx.beginPath();
          for(var i=0;i<teeth2;i++){
            var a1=i*Math.PI*2/teeth2-Math.PI/(teeth2*2);
            var a2=i*Math.PI*2/teeth2+Math.PI/(teeth2*2);
            var a3=(i+0.5)*Math.PI*2/teeth2-Math.PI/(teeth2*2.5);
            if(i===0)ctx.moveTo(Math.cos(a1)*innerR2,Math.sin(a1)*innerR2);
            ctx.lineTo(Math.cos(a1)*(innerR2+toothH2),Math.sin(a1)*(innerR2+toothH2));
            ctx.lineTo(Math.cos(a2)*(innerR2+toothH2),Math.sin(a2)*(innerR2+toothH2));
            ctx.lineTo(Math.cos(a3)*innerR2,Math.sin(a3)*innerR2);
          }
          ctx.closePath();ctx.stroke();
          ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.stroke();
          ctx.restore();
          // Wrench
          ctx.globalAlpha=.7;ctx.lineWidth=1.5;
          ctx.save();ctx.translate(-14,16);ctx.rotate(-.6+Math.sin(t*2)*.1);
          ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(18,-18);ctx.stroke();
          // Wrench head
          ctx.lineWidth=1.2;
          ctx.beginPath();ctx.arc(19,-19,5,Math.PI*0.8,Math.PI*1.8);ctx.stroke();
          ctx.beginPath();ctx.arc(19,-19,5,Math.PI*-.2,Math.PI*.3);ctx.stroke();
          // Wrench handle grip lines
          ctx.globalAlpha=.3;ctx.lineWidth=.8;
          for(var i=0;i<3;i++){
            var gp=3+i*3;
            ctx.beginPath();ctx.moveTo(gp*Math.cos(-.78)-1,gp*Math.sin(-.78)+1);
            ctx.lineTo(gp*Math.cos(-.78)+1,gp*Math.sin(-.78)-1);ctx.stroke();
          }
          ctx.restore();
          // Small decorative dots
          ctx.globalAlpha=.2;ctx.fillStyle=c;
          for(var i=0;i<4;i++){
            var dx=-22+Math.sin(t+i*1.5)*3;var dy=8+Math.cos(t*1.2+i*2)*5;
            ctx.beginPath();ctx.arc(dx,dy,.7,0,Math.PI*2);ctx.fill();
          }
        }
      };

      Object.keys(iconDefs).forEach(function(secId){
        var sec=document.getElementById(secId);
        if(!sec)return;
        var heading=sec.querySelector('h2')||sec.querySelector('h3');
        if(!heading)return;
        var cv=document.createElement('canvas');
        cv.width=200;cv.height=200;
        cv.style.cssText='display:block;flex-shrink:0;width:80px;height:80px';
        // Wrap heading + canvas in a flex row
        var iconRow=document.createElement('div');
        iconRow.style.cssText='display:flex;align-items:center;gap:16px';
        heading.parentNode.insertBefore(iconRow,heading);
        iconRow.appendChild(cv);
        iconRow.appendChild(heading);
        var drawFn=iconDefs[secId];
        (function animLoop(){
          var ctx=cv.getContext('2d');
          ctx.clearRect(0,0,200,200);
          ctx.save();
          ctx.translate(100,100);
          ctx.scale(2.2,2.2);
          ctx.globalAlpha=1;
          drawFn(ctx,performance.now()/1000);
          ctx.restore();
          requestAnimationFrame(animLoop);
        })();
      });

      // ── 2. PRODUCT CAROUSEL + PARALLAX → native .svc-img-box in #svc-formulation ──
      var formImgBoxes=document.querySelectorAll('#svc-formulation .svc-img-row .svc-img-box');
      if(formImgBoxes.length>=2){
        // First box → product carousel
        var box0=formImgBoxes[0];
        box0.id='svc-carousel-wrap';
        box0.style.cssText+='position:relative;overflow:visible';
        var imgA=document.createElement('img');
        imgA.id='svc-carousel-img-a';
        imgA.alt='Product';
        imgA.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:lighten;transition:opacity .35s ease;opacity:0';
        var imgB=document.createElement('img');
        imgB.id='svc-carousel-img-b';
        imgB.alt='Product';
        imgB.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:lighten;transition:opacity .35s ease;opacity:0';
        box0.appendChild(imgA);
        box0.appendChild(imgB);

        // Second box → parallax scientist image
        var box1=formImgBoxes[1];
        box1.id='svc-parallax-form-wrap';
        box1.style.cssText+='position:relative;overflow:visible';
        var parallaxImg=document.createElement('img');
        parallaxImg.id='svc-parallax-form-img';
        parallaxImg.src=ghBase+'Lab_formulation.png';
        parallaxImg.alt='Lab scientist formulating';
        parallaxImg.style.cssText='width:100%;height:140%;object-fit:cover;object-position:center top;position:absolute;top:-20%;will-change:transform';
        box1.appendChild(parallaxImg);

        // Parallax scroll handler
        (function(){
          var ticking=false;
          function update(){
            var wrap=document.getElementById('svc-parallax-form-wrap');
            var img=document.getElementById('svc-parallax-form-img');
            if(wrap&&img){
              var rect=wrap.getBoundingClientRect();
              var vh=window.innerHeight||document.documentElement.clientHeight;
              var p=(vh-rect.top)/(vh+rect.height);
              p=Math.max(0,Math.min(1,p));
              img.style.transform='translateY('+((p-0.5)*80)+'px)';
            }
            ticking=false;
          }
          window.addEventListener('scroll',function(){
            if(!ticking){requestAnimationFrame(update);ticking=true;}
          },{passive:true});
          update();
        })();

        // Carousel — fetch images from GitHub API
        (function(){
          var apiUrl='https://api.github.com/repos/lynz-tonomi/macrobrands/contents/carousel';
          fetch(apiUrl,{headers:{'Accept':'application/vnd.github.v3+json'}})
            .then(function(r){return r.json();})
            .then(function(files){
              var urls=files
                .filter(function(f){return /\.(png|jpe?g|webp)$/i.test(f.name)&&f.download_url;})
                .map(function(f){return f.download_url;});
              if(!urls.length)return;
              for(var i=urls.length-1;i>0;i--){
                var j=Math.floor(Math.random()*(i+1));
                var tmp=urls[i];urls[i]=urls[j];urls[j]=tmp;
              }
              var idx=0,aActive=true;
              var a=document.getElementById('svc-carousel-img-a');
              var b=document.getElementById('svc-carousel-img-b');
              if(!a||!b)return;
              a.src=urls[0];a.style.opacity='1';
              if(urls[1])b.src=urls[1];
              function shuffleUrls(){for(var i=urls.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var tmp=urls[i];urls[i]=urls[j];urls[j]=tmp;}}
              setInterval(function(){
                idx++;
                if(idx>=urls.length){idx=0;shuffleUrls();}
                if(aActive){
                  b.src=urls[idx];
                  b.style.opacity='1';a.style.opacity='0';
                }else{
                  a.src=urls[idx];
                  a.style.opacity='1';b.style.opacity='0';
                }
                aActive=!aActive;
              },500);
            })
            .catch(function(e){console.warn('Carousel fetch failed:',e);});
        })();
      }

      // ── 2b. MICROTHERMIC DIAGRAM → #svc-microthermic (full original SVG) ──
      var mtSec=document.getElementById("svc-microthermic");
      if(mtSec){
        // Build 2-column grid: text left, Equipment Capabilities right
        var mtTextCol=mtSec.querySelector(".svc-text-right");
        var mtCapsBox=mtSec.querySelector(".svc-caps-box"); // lives in .svc-img-row-mt natively
        if(mtTextCol&&mtCapsBox){
          // Make the text column a 2-col grid
          mtTextCol.style.cssText+=";display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start;align-content:start";
          // Create left wrapper for all existing text children
          var mtLeftCol=document.createElement("div");
          mtLeftCol.style.cssText="display:flex;flex-direction:column;gap:0";
          var mtKids=Array.from(mtTextCol.children);
          mtTextCol.insertBefore(mtLeftCol,mtTextCol.firstChild);
          mtKids.forEach(function(k){if(k!==mtLeftCol)mtLeftCol.appendChild(k)});
          // Move caps-box from img-row into text grid as 2nd column
          mtTextCol.appendChild(mtCapsBox);
          // Style caps-box: yellow/gold theme
          mtCapsBox.style.cssText+=";margin-top:0;background:linear-gradient(135deg,#c9a84c 0%,#a8872e 100%);border:none;border-radius:16px;padding:24px;color:#1a1a1a;font-size:13px;overflow:visible";
          // Style caps heading + items for dark text on gold
          var capsHeadings=mtCapsBox.querySelectorAll('h3,h4,[class*=caps-title],[class*=caps-heading]');
          capsHeadings.forEach(function(ch){ch.style.cssText+=";color:#1a1a1a;font-weight:700"});
          var capsAll=mtCapsBox.querySelectorAll('*');
          capsAll.forEach(function(el){
            var cs=getComputedStyle(el);
            if(cs.color==='rgb(153, 153, 153)'||cs.color==='rgb(255, 255, 255)')el.style.color='#1a1a1a';
            if(cs.borderBottomColor==='rgb(34, 34, 34)')el.style.borderColor='rgba(0,0,0,0.15)';
          });
          // GSAP parallax scroll: caps slides in from right and moves at different rate
          if(typeof gsap!=='undefined'){
            gsap.set(mtCapsBox,{x:300,opacity:0});
            gsap.to(mtCapsBox,{x:0,opacity:1,ease:'none',scrollTrigger:{trigger:mtSec,start:'top 80%',end:'top 30%',scrub:true}});
            // Parallax vertical offset: caps moves slower than page scroll
            gsap.to(mtCapsBox,{y:-60,ease:'none',scrollTrigger:{trigger:mtSec,start:'top bottom',end:'bottom top',scrub:true}});
          }
        }
        // After DOM restructure, force heading/desc visible (GSAP batch sets opacity:0 on h2/p)
        setTimeout(function(){
          var mtH2el=mtSec.querySelector(".svc-h2");
          var mtDescEl=mtSec.querySelector(".svc-desc");
          if(mtH2el)gsap.set(mtH2el,{opacity:1,y:0});
          if(mtDescEl)gsap.set(mtDescEl,{opacity:1,y:0});
          if(typeof ScrollTrigger!=='undefined')ScrollTrigger.refresh();
        },1200);
        // Make img-box full width with dark background for SVG
        var mtImgRow=mtSec.querySelector(".svc-img-row-mt");
        if(mtImgRow){
          mtImgRow.style.cssText+=";display:block;width:100%";
        }
        var mtImgBox=mtSec.querySelector(".svc-img-box");
        if(mtImgBox){
          mtImgBox.style.cssText+=";width:100%;background:transparent;border:none;overflow:visible;padding:0";
          // Inject original CSS animations
          var mtStyle=document.createElement("style");
          mtStyle.textContent='@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} } @keyframes scan { from{transform:translateY(-6px)} to{transform:translateY(520px)} } @keyframes fR { from{stroke-dashoffset:20} to{stroke-dashoffset:0} } @keyframes fL { from{stroke-dashoffset:0} to{stroke-dashoffset:20} } @keyframes fD { from{stroke-dashoffset:16} to{stroke-dashoffset:0} } @keyframes fU { from{stroke-dashoffset:0} to{stroke-dashoffset:16} } @keyframes rotor { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } @keyframes piston { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(.5)} } @keyframes aiGlow { 0%,100%{filter:drop-shadow(0 0 5px #fbbf24)} 50%{filter:drop-shadow(0 0 22px #fbbf24) drop-shadow(0 0 44px #fbbf2422)} } @keyframes flicker { 0%,88%,100%{opacity:1} 90%{opacity:.2} 95%{opacity:.7} } .fR { stroke-dasharray:7 5; animation:fR .75s linear infinite; } .fL { stroke-dasharray:7 5; animation:fL .75s linear infinite; } .fD { stroke-dasharray:7 5; animation:fD .75s linear infinite; } .fU { stroke-dasharray:7 5; animation:fU .75s linear infinite; } .fRs { stroke-dasharray:5 4; animation:fR 1.1s linear infinite; } .fDs { stroke-dasharray:5 4; animation:fD 1.1s linear infinite; } .fUs { stroke-dasharray:5 4; animation:fU 1.1s linear infinite; } .fCd { stroke-dasharray:5 4; animation:fD 1.2s linear infinite; } .fCu { stroke-dasharray:5 4; animation:fU 1.2s linear infinite; } .fSt { stroke-dasharray:6 4; animation:fD .65s linear infinite; } .tc { animation:flicker 6s ease-in-out infinite; } .psi { animation:flicker 7s ease-in-out 1.8s infinite; } .aiG { animation:aiGlow 2.4s ease-in-out infinite; }';
          document.head.appendChild(mtStyle);
          // Inject full original SVG diagram
          mtImgBox.innerHTML='<svg viewBox="0 0 1400 470" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;background:transparent"> <defs> <linearGradient id="gPre" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="#14532d"/><stop offset="100%" stop-color="#052e16"/> </linearGradient> <linearGradient id="gFin" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="#7f1d1d"/><stop offset="100%" stop-color="#3b0000"/> </linearGradient> <linearGradient id="gCool" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="rgba(255,255,255,0.14)"/><stop offset="100%" stop-color="rgba(255,255,255,0.06)"/> </linearGradient> <linearGradient id="gCond" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/><stop offset="100%" stop-color="rgba(255,255,255,0.10)"/> </linearGradient> <filter id="gO"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <filter id="gY"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <filter id="gC"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> </defs> <!-- SECTION LABELS --> <text x="18" y="22" fill="#888" font-family="JetBrains Mono" font-size="8" letter-spacing="3">DUAL PRODUCT INLET</text> <text x="18" y="98" fill="#888" font-family="JetBrains Mono" font-size="8" letter-spacing="3">PRODUCT PUMP</text> <!-- ── CITY WATER SOURCE ── --> <rect x="18" y="30" width="74" height="28" rx="2" fill="transparent" stroke="#f59e0b" stroke-width="1"/> <text x="55" y="43" fill="#f59e0b" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">CITY WATER</text> <text x="55" y="53" fill="#f59e0b" font-family="JetBrains Mono" font-size="7" text-anchor="middle">SOURCE</text> <!-- Pipe right --> <line x1="92" y1="44" x2="118" y2="44" stroke="#333" stroke-width="8"/> <line x1="92" y1="44" x2="118" y2="44" stroke="#999" stroke-width="5"/> <line x1="92" y1="44" x2="118" y2="44" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.05s"/> <!-- Run Dry Valve --> <rect x="112" y="36" width="22" height="17" rx="2" fill="transparent" stroke="#888" stroke-width="1"/> <line x1="116" y1="40" x2="130" y2="49" stroke="#f59e0b" stroke-width="1.5"/> <line x1="130" y1="40" x2="116" y2="49" stroke="#f59e0b" stroke-width="1.5"/> <text x="123" y="63" fill="#888" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">RUN DRY VALVE</text> <!-- Down pipe to y=225 --> <line x1="123" y1="53" x2="123" y2="190" stroke="transparent" stroke-width="6"/> <line x1="123" y1="53" x2="123" y2="190" stroke="#333" stroke-width="8"/> <line x1="123" y1="53" x2="123" y2="190" stroke="#999" stroke-width="5"/> <path d="M123,53 L123,190" stroke="#3b82f6" stroke-width="3" fill="none" class="fD"/> <!-- ── MAIN PIPE y=225 ── --> <line x1="85" y1="225" x2="990" y2="225" stroke="transparent" stroke-width="9"/> <line x1="85" y1="225" x2="990" y2="225" stroke="#333" stroke-width="9"/> <line x1="85" y1="225" x2="990" y2="225" stroke="#999" stroke-width="6"/> <!-- flow segments --> <line x1="85" y1="225" x2="155" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:0s"/> <line x1="215" y1="225" x2="275" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.12s"/> <line x1="347" y1="225" x2="383" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.22s"/> <line x1="457" y1="225" x2="530" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.32s"/> <line x1="590" y1="225" x2="665" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.42s"/> <line x1="720" y1="225" x2="798" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.52s"/> <line x1="836" y1="225" x2="990" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.62s"/> <!-- ── PRODUCT PUMP ── --> <circle cx="120" cy="225" r="19" fill="transparent" stroke="#3b82f6" stroke-width="2" filter="url(#gO)"/> <g style="transform-origin:120px 225px;animation:rotor 1.3s linear infinite;"> <line x1="120" y1="213" x2="120" y2="237" stroke="#3b82f6" stroke-width="2.5"/> <line x1="108" y1="225" x2="132" y2="225" stroke="#3b82f6" stroke-width="2.5"/> <line x1="111" y1="216" x2="129" y2="234" stroke="#3b82f6" stroke-width="1.5" opacity=".5"/> <line x1="129" y1="216" x2="111" y2="234" stroke="#3b82f6" stroke-width="1.5" opacity=".5"/> </g> <text x="120" y="252" fill="#3b82f6" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PUMP</text> <!-- ── PREHEATER ── --> <rect x="155" y="188" width="60" height="74" rx="2" fill="url(#gPre)" stroke="#22c55e" stroke-width="1.5"/> <line x1="155" y1="262" x2="215" y2="188" stroke="#4ade80" stroke-width="2.5" opacity=".75"/> <line x1="155" y1="242" x2="205" y2="188" stroke="#4ade80" stroke-width="1.5" opacity=".45"/> <line x1="165" y1="262" x2="215" y2="212" stroke="#4ade80" stroke-width="1.5" opacity=".45"/> <text x="185" y="177" fill="#4ade80" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">PREHEATER</text> <!-- Sensors --> <g class="tc" filter="url(#gY)"> <circle cx="150" cy="178" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="150" y="182" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="psi" filter="url(#gY)" style="animation-delay:.5s"> <circle cx="220" cy="178" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="220" y="182" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PSI</text> </g> <!-- Hot water generator 1 --> <rect x="143" y="312" width="84" height="34" rx="2" fill="transparent" stroke="#ef4444" stroke-width="1"/> <text x="185" y="324" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" font-weight="700">INTERNAL HOT</text> <text x="185" y="335" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">WATER GENERATOR</text> <line x1="172" y1="262" x2="172" y2="312" stroke="transparent" stroke-width="4"/> <line x1="198" y1="262" x2="198" y2="312" stroke="transparent" stroke-width="4"/> <path d="M172,262 L172,312" stroke="#ef4444" fill="none" class="fDs" style="animation-delay:.1s"/> <path d="M198,312 L198,262" stroke="#ef4444" fill="none" class="fUs" style="animation-delay:.1s"/> <!-- ── FINAL HEATER ── --> <rect x="275" y="185" width="72" height="80" rx="2" fill="url(#gFin)" stroke="#f87171" stroke-width="1.5"/> <line x1="275" y1="265" x2="347" y2="185" stroke="#fca5a5" stroke-width="3" opacity=".8"/> <line x1="275" y1="245" x2="337" y2="185" stroke="#fca5a5" stroke-width="1.5" opacity=".45"/> <line x1="285" y1="265" x2="347" y2="205" stroke="#fca5a5" stroke-width="1.5" opacity=".45"/> <text x="311" y="174" fill="#f87171" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">FINAL HEATER</text> <g class="tc" filter="url(#gY)" style="animation-delay:.35s"> <circle cx="270" cy="175" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="270" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="tc" filter="url(#gY)" style="animation-delay:1.1s"> <circle cx="353" cy="175" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="353" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Hot water generator 2 --> <rect x="263" y="312" width="84" height="34" rx="2" fill="transparent" stroke="#ef4444" stroke-width="1"/> <text x="305" y="324" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" font-weight="700">INTERNAL HOT</text> <text x="305" y="335" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">WATER GENERATOR</text> <line x1="292" y1="265" x2="292" y2="312" stroke="transparent" stroke-width="4"/> <line x1="318" y1="265" x2="318" y2="312" stroke="transparent" stroke-width="4"/> <path d="M292,265 L292,312" stroke="#ef4444" fill="none" class="fDs" style="animation-delay:.25s"/> <path d="M318,312 L318,265" stroke="#ef4444" fill="none" class="fUs" style="animation-delay:.25s"/> <!-- ── HOLD TUBE BANK ── --> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="transparent" stroke-width="8"/> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="#333" stroke-width="9"/> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="#999" stroke-width="6"/> <path d="M383,225 L383,128" stroke="#3b82f6" stroke-width="3" fill="none" class="fU" style="animation-delay:.08s"/> <path d="M383,128 L457,128" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.18s"/> <path d="M457,128 L457,225" stroke="#3b82f6" stroke-width="3" fill="none" class="fD" style="animation-delay:.28s"/> <rect x="360" y="108" width="120" height="38" rx="3" fill="transparent" stroke="#ef4444" stroke-width="2"/> <text x="420" y="124" fill="#ef4444" font-family="JetBrains Mono" font-size="9.5" text-anchor="middle" font-weight="700">HOLD TUBE BANK</text> <text x="420" y="138" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" opacity=".6">STERILIZATION HOLD</text> <g class="tc" filter="url(#gY)" style="animation-delay:.65s"> <circle cx="463" cy="175" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="463" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- ── COOLER 1 ── --> <rect x="530" y="187" width="60" height="76" rx="2" fill="url(#gCool)" stroke="#818cf8" stroke-width="1.5"/> <line x1="530" y1="187" x2="590" y2="263" stroke="#a5b4fc" stroke-width="2.5" opacity=".8"/> <line x1="530" y1="207" x2="580" y2="263" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <line x1="540" y1="187" x2="590" y2="237" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <text x="560" y="176" fill="#818cf8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">COOLER</text> <g class="tc" filter="url(#gY)" style="animation-delay:.9s"> <circle cx="524" cy="176" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="524" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Chill flow control below C1 --> <line x1="560" y1="263" x2="560" y2="298" stroke="transparent" stroke-width="4"/> <path d="M560,263 L560,298" stroke="#3b82f6" stroke-width="3" fill="none" class="fCd"/> <g transform="translate(560,310)"> <polygon points="-12,-10 12,-10 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="560" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle" font-weight="700">FLOW CONTROL VALVE</text> <text x="560" y="354" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- ── HOMOGENIZER ── --> <rect x="617" y="204" width="90" height="42" rx="19" fill="transparent" stroke="#3b82f6" stroke-width="1.5" filter="url(#gO)"/> <g style="transform-origin:637px 225px;animation:piston .5s ease-in-out infinite"> <rect x="631" y="211" width="8" height="28" rx="2" fill="#3b82f6" opacity=".85"/> </g> <g style="transform-origin:657px 225px;animation:piston .5s ease-in-out .17s infinite"> <rect x="651" y="211" width="8" height="28" rx="2" fill="#3b82f6" opacity=".85"/> </g> <g style="transform-origin:677px 225px;animation:piston .5s ease-in-out .34s infinite"> <rect x="671" y="211" width="8" height="28" rx="2" fill="#3b82f6" opacity=".85"/> </g> <text x="662" y="260" fill="#3b82f6" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">IN-LINE HOMOGENIZER</text> <text x="662" y="271" fill="#888" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">2-STAGE · 3-PISTON · VARISPEED</text> <!-- ── COOLER 2 ── --> <rect x="720" y="187" width="60" height="76" rx="2" fill="url(#gCool)" stroke="#818cf8" stroke-width="1.5"/> <line x1="720" y1="187" x2="780" y2="263" stroke="#a5b4fc" stroke-width="2.5" opacity=".8"/> <line x1="720" y1="207" x2="770" y2="263" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <line x1="730" y1="187" x2="780" y2="237" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <text x="750" y="176" fill="#818cf8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">COOLER</text> <g class="tc" filter="url(#gY)" style="animation-delay:1.2s"> <circle cx="714" cy="176" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="714" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="psi" filter="url(#gY)" style="animation-delay:1.8s"> <circle cx="786" cy="176" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="786" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PSI</text> </g> <!-- Chill flow control below C2 --> <line x1="750" y1="263" x2="750" y2="298" stroke="transparent" stroke-width="4"/> <path d="M750,263 L750,298" stroke="#3b82f6" stroke-width="3" fill="none" class="fCd" style="animation-delay:.3s"/> <g transform="translate(750,310)"> <polygon points="-12,-10 12,-10 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="750" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle" font-weight="700">FLOW CONTROL VALVE</text> <text x="750" y="354" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- Back pressure valve --> <g transform="translate(817,225)"> <polygon points="-13,-13 13,-13 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-13,13 13,13 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="817" y="252" fill="#3b82f6" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">BACK PRESSURE</text> <text x="817" y="261" fill="#3b82f6" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">VALVE</text> <!-- ── CLEAN FILL HOOD ── --> <rect x="994" y="150" width="390" height="238" rx="4" fill="transparent" stroke="#888" stroke-width="1.5" stroke-dasharray="9 4"/> <text x="1189" y="410" fill="#3b82f6" font-family="JetBrains Mono" font-size="9" text-anchor="middle" letter-spacing="3" font-weight="700">CLEAN-FILL HOOD &amp; ACCUFILL</text> <!-- TC at hood entry --> <g class="tc" filter="url(#gY)" style="animation-delay:1.5s"> <circle cx="1013" cy="202" r="10" fill="transparent" stroke="#fbbf24" stroke-width="1.5"/> <text x="1013" y="206" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Sterile product outlet --> <rect x="1005" y="218" width="92" height="46" rx="3" fill="transparent" stroke="#22d3ee" stroke-width="1.5"/> <text x="1051" y="236" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">STERILE</text> <text x="1051" y="247" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">PRODUCT</text> <text x="1051" y="258" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">OUTLET</text> <!-- Pipe inside hood: entry → sterile box → back pressure valve --> <line x1="990" y1="225" x2="1005" y2="225" stroke="#333" stroke-width="9"/> <line x1="990" y1="225" x2="1005" y2="225" stroke="#999" stroke-width="6"/> <line x1="990" y1="225" x2="1005" y2="225" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.7s"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="transparent" stroke-width="5"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#333" stroke-width="8"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#999" stroke-width="5"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#3b82f6" stroke-width="3" fill="none" class="fR" style="animation-delay:.82s"/> <!-- Back pressure valve (inside hood) --> <g transform="translate(1235,238)"> <polygon points="-12,-12 12,-12 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,12 12,12 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="1235" y="262" fill="#3b82f6" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">BACK PRESSURE</text> <text x="1235" y="271" fill="#3b82f6" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">VALVE</text> <!-- Pipe up from BPV to condenser --> <line x1="1235" y1="188" x2="1235" y2="226" stroke="transparent" stroke-width="5"/> <path d="M1235,188 L1235,226" stroke="#3b82f6" stroke-width="3" fill="none" class="fU" style="animation-delay:.9s"/> <!-- CONDENSER --> <rect x="1122" y="155" width="104" height="112" rx="3" fill="url(#gCond)" stroke="#60a5fa" stroke-width="2"/> <!-- Tube grid inside condenser --> <line x1="1132" y1="170" x2="1216" y2="170" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="181" x2="1216" y2="181" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="192" x2="1216" y2="192" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="203" x2="1216" y2="203" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="214" x2="1216" y2="214" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="225" x2="1216" y2="225" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="236" x2="1216" y2="236" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="247" x2="1216" y2="247" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <!-- Animated flow tubes inside condenser --> <line x1="1132" y1="175" x2="1216" y2="175" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fL" style="animation-delay:0s"/> <line x1="1132" y1="197" x2="1216" y2="197" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fR" style="animation-delay:.3s"/> <line x1="1132" y1="219" x2="1216" y2="219" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fL" style="animation-delay:.15s"/> <line x1="1132" y1="241" x2="1216" y2="241" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fR" style="animation-delay:.45s"/> <text x="1174" y="283" fill="#93c5fd" font-family="JetBrains Mono" font-size="9.5" text-anchor="middle" font-weight="700">CONDENSER</text> <!-- Flow control + chill below condenser --> <line x1="1174" y1="267" x2="1174" y2="298" stroke="transparent" stroke-width="4"/> <path d="M1174,267 L1174,298" stroke="#3b82f6" stroke-width="3" fill="none" class="fCd" style="animation-delay:.6s"/> <g transform="translate(1174,310)"> <polygon points="-12,-10 12,-10 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="transparent" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="1174" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">FLOW CONTROL VALVE</text> <text x="1174" y="353" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- Condenser outlet pipe (right) --> <line x1="1226" y1="192" x2="1348" y2="192" stroke="transparent" stroke-width="4"/> <line x1="1226" y1="192" x2="1348" y2="192" stroke="#333" stroke-width="8" stroke-dasharray="5 4"/> <line x1="1226" y1="192" x2="1348" y2="192" stroke="#999" stroke-width="5" stroke-dasharray="5 4"/> <!-- Outlet valve X --> <rect x="1332" y="183" width="22" height="18" rx="2" fill="transparent" stroke="#888" stroke-width="1"/> <line x1="1336" y1="187" x2="1350" y2="197" stroke="#888" stroke-width="1.5"/> <line x1="1350" y1="187" x2="1336" y2="197" stroke="#888" stroke-width="1.5"/> <text x="1368" y="192" fill="#888" font-family="JetBrains Mono" font-size="7.5" font-weight="700">CONDENSER</text> <text x="1368" y="203" fill="#888" font-family="JetBrains Mono" font-size="7.5" font-weight="700">OUTLET</text> <!-- ── STERILE PRODUCT OUTLET DROP ── --> <line x1="1051" y1="264" x2="1051" y2="445" stroke="transparent" stroke-width="6"/> <line x1="1051" y1="264" x2="1051" y2="445" stroke="#0e4a5a" stroke-width="3"/> <path d="M1051,264 L1051,445" stroke="#22d3ee" fill="none" class="fSt" filter="url(#gC)"/> <polygon points="1051,453 1041,441 1061,441" fill="#22d3ee" filter="url(#gC)"/> <text x="1051" y="466" fill="#22d3ee" font-family="Bebas Neue,JetBrains Mono" font-size="15" text-anchor="middle" letter-spacing="6" filter="url(#gC)">STERILE PRODUCT OUTLET</text> <!-- ── LIVE READOUTS ── --> <text x="22" y="392" fill="#22c55e" font-family="JetBrains Mono" font-size="8" opacity=".7">TEMP_IN ▶ 142.4°C</text> <text x="22" y="405" fill="#3b82f6" font-family="JetBrains Mono" font-size="8" opacity=".7">CHILL_T ▶ 4.2°C</text> <text x="22" y="418" fill="#3b82f6" font-family="JetBrains Mono" font-size="8" opacity=".7">FLOW_RT ▶ 18.6 L/s</text> <text x="22" y="431" fill="#fbbf24" font-family="JetBrains Mono" font-size="8" opacity=".7">HOLD_TM ▶ 4.0 sec</text> <text x="22" y="444" fill="#818cf8" font-family="JetBrains Mono" font-size="8" opacity=".7">HOMO_PR ▶ 280 bar</text> <!-- Corner brackets --> <path d="M8,8 L8,26 M8,8 L26,8" fill="none" stroke="#888" stroke-width="1.5"/> <path d="M1392,8 L1392,26 M1392,8 L1374,8" fill="none" stroke="#888" stroke-width="1.5"/> <path d="M8,462 L8,444 M8,462 L26,462" fill="none" stroke="#888" stroke-width="1.5"/> <path d="M1392,462 L1392,444 M1392,462 L1374,462" fill="none" stroke="#888" stroke-width="1.5"/> </svg>';
        }
        // Move bullet row above diagram as full-width single row
        var mtBulletRow=mtSec.querySelector(".svc-bullet-row");
        var mtImgRowEl=mtSec.querySelector(".svc-img-row-mt");
        if(mtBulletRow&&mtImgRowEl){
          mtImgRowEl.parentNode.insertBefore(mtBulletRow,mtImgRowEl);
          mtBulletRow.style.cssText+=";display:flex;flex-wrap:nowrap;justify-content:center;gap:24px;width:100%;margin-bottom:24px";
          var mtBulletItems=mtBulletRow.querySelectorAll(".svc-bullet-item");
          mtBulletItems.forEach(function(bi){bi.style.cssText+=";white-space:nowrap;font-size:14px"});
        }
      }

      // ── 3. CO-PACKING EXPANDABLE CARDS → #svc-copacking ──
      var cpSec=document.querySelector('#svc-copacking .svc-container');
      if(cpSec){
        // Inject CSS keyframes and classes
        var cpStyle=document.createElement('style');
        cpStyle.textContent='@keyframes cpDraw{to{stroke-dashoffset:0}}'+
      '@keyframes cpFade{from{opacity:0}to{opacity:1}}'+
      '@keyframes cpFlow{from{stroke-dashoffset:28}to{stroke-dashoffset:0}}'+
      '@keyframes cpPop{0%,100%{opacity:0}30%,70%{opacity:1}}'+
      '@keyframes cpSwell{0%{transform:translateY(0)scaleY(1);opacity:.8}45%{transform:translateY(-4px)scaleY(1.03);opacity:1}100%{transform:translateY(0)scaleY(1);opacity:.8}}'+
      '@keyframes cpWisp{0%{transform:translateY(0);opacity:.7}100%{transform:translateY(-14px);opacity:0}}'+
      '@keyframes cpDrip{0%,100%{opacity:0;transform:scaleY(0)}30%,70%{opacity:1;transform:scaleY(1)}}'+
      '@keyframes cpSpin{to{transform:rotate(360deg)}}'+
      '@keyframes cpBelt{from{stroke-dashoffset:36}to{stroke-dashoffset:0}}'+
      '@keyframes cpSweep{0%{transform:rotate(-35deg)}55%{transform:rotate(40deg)}100%{transform:rotate(-35deg)}}'+
      '.cp-d{fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:cpDraw 1.1s cubic-bezier(.4,0,.15,1) forwards}'+
      '.cp-glow{fill:none;stroke:#C9A84C;stroke-width:1;opacity:0;animation:cpFade .6s ease 1s forwards}'+
      '.cp-fi{opacity:0;animation:cpFade .4s ease forwards}'+
      '.cp-pO{stroke:#f97316;stroke-width:2.5;stroke-dasharray:10 6;fill:none;animation:cpFlow .5s linear infinite;animation-delay:2s}'+
      '.cp-pB{stroke:#38bdf8;stroke-width:2.5;stroke-dasharray:10 6;fill:none;animation:cpFlow .6s linear infinite;animation-delay:2s}'+
      '.cp-ap{animation:cpPop 1.6s ease-in-out infinite;animation-delay:2s;opacity:0}'+
      '.cp-liq{transform-box:fill-box;transform-origin:bottom center;animation:cpSwell 3.5s ease-in-out infinite;animation-delay:2s}'+
      '.cp-ws{animation:cpWisp 2.2s ease-out infinite;animation-delay:2s}'+
      '.cp-ws1{animation:cpWisp 2.2s ease-out .7s infinite;animation-delay:2.7s}'+
      '.cp-drip{transform-box:fill-box;transform-origin:top center;animation:cpDrip 1.4s ease-in-out infinite;animation-delay:2s;opacity:0}'+
      '.cp-drip2{transform-box:fill-box;transform-origin:top center;animation:cpDrip 1.4s ease-in-out .35s infinite;animation-delay:2.35s;opacity:0}'+
      '.cp-drip3{transform-box:fill-box;transform-origin:top center;animation:cpDrip 1.4s ease-in-out .7s infinite;animation-delay:2.7s;opacity:0}'+
      '.cp-imp{transform-box:fill-box;transform-origin:center;animation:cpSpin 1s linear infinite;animation-delay:2s}'+
      '.cp-belt{animation:cpBelt .7s linear infinite;animation-delay:2s}'+
      '.cp-ndl{transform-box:fill-box;transform-origin:50% 100%;animation:cpSweep 3.2s ease-in-out infinite;animation-delay:2s}'+
      '.cp-lbl{fill:rgba(255,255,255,.5);font-family:monospace;font-size:9px;text-anchor:middle}'+
      '.cp-lbl2{fill:#f97316;font-family:monospace;font-size:8px;text-anchor:middle;fill-opacity:.6}'+
      '.cp-card{background:rgba(255,255,255,.03);border:1px solid #222;border-radius:14px;padding:24px;cursor:pointer;transition:border-color .3s,transform .3s,box-shadow .3s}'+
      '.cp-card:hover{border-color:#C9A84C;transform:translateY(-4px)}.cp-card.cp-active{border-color:#C9A84C;box-shadow:0 0 20px rgba(201,168,76,.15)}'+
      '.cp-expand{max-height:0;overflow:visible;transition:max-height .5s cubic-bezier(.4,0,.2,1),opacity .4s ease;opacity:0}'+
      '.cp-expand.cp-open{max-height:400px;opacity:1}';
        document.head.appendChild(cpStyle);

        // Add fadeIn animation for cards
        var fadeStyle=document.createElement('style');
        fadeStyle.textContent='@keyframes tabFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(fadeStyle);

    var cpProcs=[
      {title:'Tunnel Pasteurization',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><rect x="6" y="14" width="52" height="22" rx="3" class="cp-d" style="--l:160;animation-delay:.2s"/><line x1="6" y1="25" x2="58" y2="25" class="cp-d" style="--l:52;animation-delay:.5s"/><rect x="14" y="18" width="8" height="14" rx="2" class="cp-d" style="--l:48;animation-delay:.7s"/><rect x="28" y="18" width="8" height="14" rx="2" class="cp-d" style="--l:48;animation-delay:.85s"/><rect x="42" y="18" width="8" height="14" rx="2" class="cp-d" style="--l:48;animation-delay:1s"/><path d="M18,10 Q18,6 22,6 M32,10 Q32,6 36,6 M46,10 Q46,6 50,6" class="cp-glow" stroke-width="1.2"/></svg>',
       desc:'Continuous hot-water tunnel for high-acid beverages \u2014 juice, tea, kombucha.',
       specs:['High-acid (pH < 4.6)','Glass & PET','12\u201364 oz','Continuous'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g1o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g1b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m1" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="118" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:0.3s"/><line x1="78" y1="120" x2="118" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="98,120 90,116 90,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="118" y="58" width="72" height="105" rx="6" class="cp-d" style="--l:354;animation-delay:.35s"/><line x1="124" y1="82" x2="184" y2="82" stroke="white" stroke-width="1.5" class="cp-d" style="--l:60;animation-delay:.5s"/><line x1="133" y1="82" x2="133" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:30;animation-delay:.6s"/><line x1="150" y1="82" x2="150" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:30;animation-delay:.67s"/><line x1="167" y1="82" x2="167" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:30;animation-delay:.74s"/><line x1="133" y1="112" x2="133" y2="145" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g1o)"/><line x1="150" y1="112" x2="150" y2="145" stroke="#f97316" stroke-width="1.5" class="cp-drip2" filter="url(#g1o)"/><line x1="167" y1="112" x2="167" y2="145" stroke="#f97316" stroke-width="1.5" class="cp-drip3" filter="url(#g1o)"/><path d="M129,145 L129,160 Q133,164 137,160 L137,145" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.5s"/><path d="M146,145 L146,160 Q150,164 154,160 L154,145" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.6s"/><path d="M163,145 L163,160 Q167,164 171,160 L171,145" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.7s"/><text x="154" y="205" class="cp-lbl">FILLER</text><line x1="190" y1="120" x2="228" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:38;animation-delay:0.85s"/><line x1="190" y1="120" x2="228" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="209,120 201,116 201,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="228" y="52" width="330" height="122" rx="10" class="cp-d" style="--l:904;animation-delay:.9s"/><line x1="393" y1="52" x2="393" y2="174" stroke="white" stroke-width="1" stroke-opacity=".15" class="cp-d" style="--l:122;animation-delay:1.2s"/><text x="310" y="72" class="cp-lbl2">185&#176;F+</text><path d="M265,82 Q270,75 275,82 Q280,89 285,82" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g1o)"/><path d="M320,82 Q325,75 330,82 Q335,89 340,82" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g1o)"/><path d="M365,82 Q370,75 375,82 Q380,89 385,82" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g1o)"/><text x="470" y="72" class="cp-lbl" style="fill:#38bdf8;fill-opacity:.6">COOLING</text><path d="M425,84 Q430,78 435,84" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".35" class="cp-fi" style="animation-delay:2s"/><path d="M465,84 Q470,78 475,84" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".35" class="cp-fi" style="animation-delay:2.1s"/><path d="M505,84 Q510,78 515,84" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".35" class="cp-fi" style="animation-delay:2.2s"/><line x1="238" y1="160" x2="548" y2="160" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="248" cy="160" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:1.1s"/><circle cx="538" cy="160" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:1.15s"/><path d="M280,144 L280,157 Q284,161 288,157 L288,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.8s"/><path d="M345,144 L345,157 Q349,161 353,157 L353,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.9s"/><path d="M435,144 L435,157 Q439,161 443,157 L443,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:2s"/><path d="M505,144 L505,157 Q509,161 513,157 L513,144Z" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:2.1s"/><text x="310" y="205" class="cp-lbl">HEAT ZONE</text><text x="470" y="205" class="cp-lbl">COOL ZONE</text><line x1="558" y1="120" x2="598" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:1.4s"/><line x1="558" y1="120" x2="598" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="578,120 570,116 570,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="598" y="68" width="64" height="92" rx="6" class="cp-d" style="--l:312;animation-delay:1.5s"/><circle cx="630" cy="95" r="12" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:76;animation-delay:1.65s"/><circle cx="630" cy="95" r="4" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><text x="630" y="205" class="cp-lbl">LABEL</text><text x="630" y="216" class="cp-lbl" fill-opacity=".4">&amp; QA</text><line x1="662" y1="120" x2="698" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:36;animation-delay:1.8s"/><line x1="662" y1="120" x2="698" y2="120" class="cp-pO" filter="url(#g1o)"/><polygon points="680,120 672,116 672,124" fill="#f97316" class="cp-ap" filter="url(#g1o)"/><rect x="698" y="128" width="70" height="42" rx="3" class="cp-d" style="--l:224;animation-delay:1.9s"/><rect x="703" y="106" width="60" height="26" rx="2" class="cp-d" style="--l:172;animation-delay:2s" stroke-opacity=".6"/><rect x="708" y="88" width="50" height="22" rx="2" class="cp-d" style="--l:144;animation-delay:2.1s" stroke-opacity=".4"/><text x="733" y="205" class="cp-lbl">PALLET</text><text x="733" y="216" class="cp-lbl" fill-opacity=".4">PACK</text></svg>'},
      {title:'Retort Processing',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><ellipse cx="12" cy="24" rx="6" ry="16" class="cp-d" style="--l:100;animation-delay:.2s"/><rect x="12" y="8" width="40" height="32" rx="2" class="cp-d" style="--l:150;animation-delay:.4s"/><ellipse cx="52" cy="24" rx="6" ry="16" class="cp-d" style="--l:100;animation-delay:.6s"/><circle cx="32" cy="24" r="3" class="cp-d" style="--l:20;animation-delay:.9s"/><path d="M24,16 Q26,12 28,16 M34,16 Q36,12 38,16" class="cp-glow" stroke-width="1.5"/><line x1="52" y1="8" x2="58" y2="4" class="cp-d" style="--l:10;animation-delay:1s"/><line x1="52" y1="40" x2="58" y2="44" class="cp-d" style="--l:10;animation-delay:1s"/></svg>',
       desc:'Batch pressure-cooking for low-acid shelf-stable products \u2014 soups, broths, plant milks.',
       specs:['Low-acid (pH \u2265 4.6)','Cans: 8\u201312oz','250\u00b0F+','FDA filed'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g2o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g2b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="20" y="48" width="56" height="90" rx="6" class="cp-d" style="--l:292;animation-delay:.1s"/><path d="M20,48 Q48,32 76,48" class="cp-d" style="--l:64;animation-delay:.15s"/><rect x="26" y="90" width="44" height="36" rx="3" fill="#f97316" fill-opacity=".12" class="cp-liq"/><line x1="48" y1="138" x2="48" y2="165" stroke="white" stroke-width="1.2" class="cp-d" style="--l:27;animation-delay:.35s"/><line x1="48" y1="152" x2="48" y2="178" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g2o)"/><rect x="38" y="178" width="20" height="28" rx="2" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:1.2s"/><text x="48" y="205" class="cp-lbl">CAN</text><text x="48" y="216" class="cp-lbl" fill-opacity=".4">FILLER</text><line x1="76" y1="120" x2="120" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:44;animation-delay:0.4s"/><line x1="76" y1="120" x2="120" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="98,120 90,116 90,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><rect x="120" y="68" width="60" height="90" rx="6" class="cp-d" style="--l:300;animation-delay:.5s"/><ellipse cx="150" cy="68" rx="30" ry="8" class="cp-d" style="--l:100;animation-delay:.55s"/><ellipse cx="150" cy="158" rx="30" ry="8" class="cp-d" style="--l:100;animation-delay:.6s"/><circle cx="150" cy="112" r="14" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:90;animation-delay:.7s"/><circle cx="150" cy="112" r="5" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><text x="150" y="205" class="cp-lbl">DOUBLE</text><text x="150" y="216" class="cp-lbl" fill-opacity=".4">SEAM</text><line x1="180" y1="120" x2="228" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:48;animation-delay:0.8s"/><line x1="180" y1="120" x2="228" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="204,120 196,116 196,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><ellipse cx="240" cy="120" rx="14" ry="42" class="cp-d" style="--l:180;animation-delay:.9s"/><rect x="240" y="78" width="180" height="84" rx="3" class="cp-d" style="--l:528;animation-delay:.95s"/><ellipse cx="420" cy="120" rx="14" ry="42" class="cp-d" style="--l:180;animation-delay:1s"/><line x1="260" y1="100" x2="400" y2="100" stroke="white" stroke-width=".6" stroke-opacity=".15" class="cp-d" style="--l:140;animation-delay:1.2s"/><line x1="260" y1="140" x2="400" y2="140" stroke="white" stroke-width=".6" stroke-opacity=".15" class="cp-d" style="--l:140;animation-delay:1.25s"/><rect x="270" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.5s"/><rect x="290" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.55s"/><rect x="310" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.6s"/><rect x="330" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.65s"/><rect x="350" y="104" width="12" height="16" rx="1" stroke="white" stroke-width=".6" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.7s"/><circle cx="380" cy="78" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:1.1s"/><line x1="380" y1="78" x2="380" y2="70" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g2o)"/><path d="M270,72 Q275,65 280,72 Q285,79 290,72" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g2o)"/><path d="M310,72 Q315,65 320,72 Q325,79 330,72" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g2o)"/><path d="M350,72 Q355,65 360,72 Q365,79 370,72" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g2o)"/><text x="330" y="135" class="cp-lbl2">250&#176;F</text><text x="330" y="205" class="cp-lbl">RETORT</text><text x="330" y="216" class="cp-lbl" fill-opacity=".4">VESSEL</text><line x1="434" y1="120" x2="478" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:44;animation-delay:1.4s"/><line x1="434" y1="120" x2="478" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="456,120 448,116 448,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><rect x="478" y="58" width="72" height="110" rx="8" class="cp-d" style="--l:364;animation-delay:1.5s"/><path d="M478,58 Q514,42 550,58" class="cp-d" style="--l:80;animation-delay:1.55s"/><rect x="484" y="98" width="60" height="50" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".4" fill="none" class="cp-fi" style="animation-delay:2s"/><rect x="485" y="118" width="58" height="29" rx="2" fill="#38bdf8" fill-opacity=".2" class="cp-liq"/><path d="M490,58 L490,42 L530,42 L530,58" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 4" fill="none" class="cp-fi" style="animation-delay:2.2s"/><text x="514" y="205" class="cp-lbl">COOLING</text><line x1="550" y1="120" x2="598" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:48;animation-delay:1.8s"/><line x1="550" y1="120" x2="598" y2="120" class="cp-pO" filter="url(#g2o)"/><polygon points="574,120 566,116 566,124" fill="#f97316" class="cp-ap" filter="url(#g2o)"/><rect x="598" y="78" width="80" height="80" rx="6" class="cp-d" style="--l:320;animation-delay:1.9s"/><line x1="598" y1="158" x2="720" y2="158" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="608" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2s"/><circle cx="710" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.05s"/><rect x="688" y="130" width="24" height="26" rx="2" class="cp-d" style="--l:100;animation-delay:2.1s" stroke-opacity=".4"/><rect x="718" y="130" width="24" height="26" rx="2" class="cp-d" style="--l:100;animation-delay:2.2s" stroke-opacity=".3"/><rect x="696" y="110" width="24" height="22" rx="2" class="cp-d" style="--l:92;animation-delay:2.3s" stroke-opacity=".25"/><text x="660" y="205" class="cp-lbl">LABEL &amp;</text><text x="660" y="216" class="cp-lbl" fill-opacity=".4">CASE PACK</text></svg>'},
      {title:'ESL Bottling',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><path d="M24,42 L22,18 L26,8 L26,4 L38,4 L38,8 L42,18 L40,42 Z" class="cp-d" style="--l:120;animation-delay:.2s"/><line x1="22" y1="28" x2="42" y2="28" class="cp-d" style="--l:20;animation-delay:.6s"/><rect x="26" y="1" width="12" height="4" rx="1" class="cp-d" style="--l:36;animation-delay:.4s"/><path d="M16,12 Q10,24 16,36" class="cp-d" style="--l:30;animation-delay:.8s" stroke-opacity=".5"/><path d="M48,12 Q54,24 48,36" class="cp-d" style="--l:30;animation-delay:.8s" stroke-opacity=".5"/><circle cx="10" cy="18" r="2" class="cp-glow" fill="#C9A84C" stroke="none"/><circle cx="54" cy="30" r="2" class="cp-glow" fill="#C9A84C" stroke="none"/></svg>',
       desc:'Extended Shelf Life \u2014 light pasteurization + clean-fill for 180\u2013365 day refrigerated shelf life.',
       specs:['Refrigerated','180\u2013365 day','PET & HDPE','Accelerated Shelf Life Study'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g3o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g3b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m3" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="128" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:0.3s"/><line x1="78" y1="120" x2="128" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="103,120 95,116 95,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="128" y="50" width="110" height="120" rx="8" class="cp-d" style="--l:460;animation-delay:.4s"/><line x1="148" y1="60" x2="148" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.6s"/><line x1="163" y1="60" x2="163" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.65s"/><line x1="178" y1="60" x2="178" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.7s"/><line x1="193" y1="60" x2="193" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.75s"/><line x1="208" y1="60" x2="208" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.8s"/><line x1="223" y1="60" x2="223" y2="160" stroke="white" stroke-width=".8" stroke-opacity=".2" class="cp-d" style="--l:100;animation-delay:.85s"/><line x1="155" y1="70" x2="155" y2="150" stroke="#f97316" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pO" filter="url(#g3o)"/><line x1="185" y1="70" x2="185" y2="150" stroke="#f97316" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pO" filter="url(#g3o)"/><line x1="215" y1="150" x2="215" y2="70" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pB" filter="url(#g3b)"/><circle cx="183" cy="43" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:1.0s"/><line x1="183" y1="43" x2="183" y2="35" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g3o)"/><text x="183" y="75" class="cp-lbl2">270&#176;F</text><text x="183" y="205" class="cp-lbl">UHT</text><text x="183" y="216" class="cp-lbl" fill-opacity=".4">PASTEURIZER</text><line x1="238" y1="120" x2="285" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:47;animation-delay:1.1s"/><line x1="238" y1="120" x2="285" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="261,120 253,116 253,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="285" y="42" width="140" height="130" rx="8" class="cp-d" style="--l:540;animation-delay:1.2s"/><rect x="292" y="49" width="126" height="116" rx="5" stroke="#C9A84C" stroke-width="1" stroke-opacity=".25" stroke-dasharray="6 4" fill="none" class="cp-fi" style="animation-delay:1.8s"/><text x="355" y="68" class="cp-lbl" style="fill:#C9A84C;fill-opacity:.5">ACCEL. SHELF LIFE</text><line x1="310" y1="85" x2="400" y2="85" stroke="white" stroke-width="1.5" class="cp-d" style="--l:90;animation-delay:1.4s"/><line x1="325" y1="85" x2="325" y2="110" stroke="white" stroke-width="1" class="cp-d" style="--l:25;animation-delay:1.5s"/><line x1="355" y1="85" x2="355" y2="110" stroke="white" stroke-width="1" class="cp-d" style="--l:25;animation-delay:1.55s"/><line x1="385" y1="85" x2="385" y2="110" stroke="white" stroke-width="1" class="cp-d" style="--l:25;animation-delay:1.6s"/><line x1="325" y1="110" x2="325" y2="140" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g3o)"/><line x1="355" y1="110" x2="355" y2="140" stroke="#f97316" stroke-width="1.5" class="cp-drip2" filter="url(#g3o)"/><line x1="385" y1="110" x2="385" y2="140" stroke="#f97316" stroke-width="1.5" class="cp-drip3" filter="url(#g3o)"/><path d="M319,140 L319,158 Q325,163 331,158 L331,140" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.8s"/><path d="M349,140 L349,158 Q355,163 361,158 L361,140" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.85s"/><path d="M379,140 L379,158 Q385,163 391,158 L391,140" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:1.9s"/><text x="355" y="205" class="cp-lbl">ACCEL. SHELF LIFE</text><text x="355" y="216" class="cp-lbl" fill-opacity=".4">STUDY</text><line x1="425" y1="120" x2="470" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:1.7s"/><line x1="425" y1="120" x2="470" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="447,120 439,116 439,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="470" y="62" width="60" height="100" rx="6" class="cp-d" style="--l:320;animation-delay:1.8s"/><line x1="500" y1="68" x2="500" y2="95" stroke="white" stroke-width="1.5" class="cp-d" style="--l:27;animation-delay:1.95s"/><rect x="490" y="92" width="20" height="10" rx="2" class="cp-d" style="--l:60;animation-delay:2s"/><path d="M491,110 L491,150 Q500,155 509,150 L509,110" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:2.1s"/><text x="500" y="205" class="cp-lbl">CAPPING</text><line x1="530" y1="120" x2="575" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:2.1s"/><line x1="530" y1="120" x2="575" y2="120" class="cp-pO" filter="url(#g3o)"/><polygon points="552,120 544,116 544,124" fill="#f97316" class="cp-ap" filter="url(#g3o)"/><rect x="575" y="55" width="90" height="115" rx="8" class="cp-d" style="--l:410;animation-delay:2.2s"/><rect x="582" y="62" width="76" height="101" rx="5" stroke="white" stroke-width=".6" stroke-opacity=".15" fill="none" class="cp-fi" style="animation-delay:2.5s"/><circle cx="600" cy="92" r="3" fill="#38bdf8" fill-opacity=".4" class="cp-fi" style="animation-delay:2.6s"/><circle cx="620" cy="85" r="2" fill="#38bdf8" fill-opacity=".3" class="cp-fi" style="animation-delay:2.65s"/><circle cx="640" cy="95" r="2.5" fill="#38bdf8" fill-opacity=".35" class="cp-fi" style="animation-delay:2.7s"/><text x="620" y="130" class="cp-lbl" style="fill:#38bdf8;fill-opacity:.5">36&#176;F</text><text x="620" y="205" class="cp-lbl">COLD</text><text x="620" y="216" class="cp-lbl" fill-opacity=".4">CHAIN</text></svg>'},
      {title:'Aseptic Bottling',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><path d="M24,42 L22,18 L26,8 L26,4 L38,4 L38,8 L42,18 L40,42 Z" class="cp-d" style="--l:120;animation-delay:.2s"/><rect x="26" y="1" width="12" height="4" rx="1" class="cp-d" style="--l:36;animation-delay:.4s"/><line x1="32" y1="10" x2="32" y2="38" class="cp-d" style="--l:28;animation-delay:.7s" stroke-opacity=".3"/><path d="M14,6 L20,14 M50,6 L44,14 M14,42 L20,34 M50,42 L44,34" class="cp-glow" stroke-width="1.5"/><circle cx="32" cy="24" r="10" class="cp-d" style="--l:64;animation-delay:.9s" stroke-opacity=".2" stroke-dasharray="4 4"/></svg>',
       desc:'UHT sterilization + aseptic PET filling. No preservatives \u2014 12+ month ambient shelf life.',
       specs:['Ambient','PET 2\u201364oz','No preservatives','12+ months'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g4o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g4b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m4" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="18" y="52" width="52" height="118" rx="8" class="cp-d" style="--l:340;animation-delay:0.1s"/><path d="M18,52 Q44,36 70,52" class="cp-d" style="--l:70;animation-delay:0.15000000000000002s"/><rect x="23" y="111" width="42" height="53" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="24" y="137" width="40" height="29" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="44" y="205" class="cp-lbl">PRODUCT</text><text x="44" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="70" y1="120" x2="108" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:38;animation-delay:0.3s"/><line x1="70" y1="120" x2="108" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="89,120 81,116 81,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="108" y="48" width="100" height="124" rx="8" class="cp-d" style="--l:448;animation-delay:.4s"/><path d="M120,70 Q145,62 145,80 Q145,98 120,90 Q145,82 145,100 Q145,118 120,110 Q145,102 145,120 Q145,138 120,130 Q145,122 145,140 Q145,158 120,150" stroke="#f97316" stroke-width="1.2" fill="none" stroke-opacity=".5" class="cp-d" style="--l:400;animation-delay:.6s"/><line x1="170" y1="65" x2="170" y2="155" stroke="white" stroke-width="1.5" class="cp-d" style="--l:90;animation-delay:.55s"/><line x1="190" y1="65" x2="190" y2="155" stroke="white" stroke-width="1.5" class="cp-d" style="--l:90;animation-delay:.58s"/><line x1="170" y1="65" x2="190" y2="65" stroke="white" stroke-width="1" class="cp-d" style="--l:20;animation-delay:.62s"/><line x1="170" y1="155" x2="190" y2="155" stroke="white" stroke-width="1" class="cp-d" style="--l:20;animation-delay:.65s"/><circle cx="180" cy="42" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:0.8s"/><line x1="180" y1="42" x2="180" y2="34" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g4o)"/><text x="158" y="108" class="cp-lbl2">280&#176;F</text><path d="M125,42 Q130,35 135,42 Q140,49 145,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g4o)"/><path d="M155,42 Q160,35 165,42 Q170,49 175,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g4o)"/><text x="158" y="205" class="cp-lbl">UHT</text><text x="158" y="216" class="cp-lbl" fill-opacity=".4">STERILIZER</text><line x1="208" y1="120" x2="248" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:1.0s"/><line x1="208" y1="120" x2="248" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="228,120 220,116 220,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="248" y="62" width="70" height="100" rx="6" class="cp-d" style="--l:340;animation-delay:1.1s"/><path d="M258,80 L308,80 L258,95 L308,95 L258,110 L308,110 L258,125 L308,125 L258,140 L308,140" stroke="#38bdf8" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-d" style="--l:450;animation-delay:1.3s"/><line x1="270" y1="70" x2="270" y2="152" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 5" class="cp-pB" filter="url(#g4b)"/><text x="283" y="205" class="cp-lbl">FLASH</text><text x="283" y="216" class="cp-lbl" fill-opacity=".4">COOLER</text><line x1="318" y1="120" x2="358" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:40;animation-delay:1.4s"/><line x1="318" y1="120" x2="358" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="338,120 330,116 330,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="358" y="62" width="50" height="100" rx="8" class="cp-d" style="--l:300;animation-delay:1.5s"/><path d="M358,62 Q383,46 408,62" class="cp-d" style="--l:58;animation-delay:1.55s"/><rect x="363" y="67" width="40" height="90" rx="5" stroke="white" stroke-width=".6" stroke-opacity=".12" fill="none" class="cp-fi" style="animation-delay:2s"/><rect x="365" y="105" width="36" height="40" rx="2" fill="#f97316" fill-opacity=".1" class="cp-liq"/><text x="383" y="205" class="cp-lbl">STERILE</text><text x="383" y="216" class="cp-lbl" fill-opacity=".4">HOLD</text><line x1="408" y1="120" x2="452" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:44;animation-delay:1.7s"/><line x1="408" y1="120" x2="452" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="430,120 422,116 422,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="452" y="40" width="145" height="135" rx="8" class="cp-d" style="--l:560;animation-delay:1.8s"/><rect x="459" y="47" width="131" height="121" rx="5" stroke="#C9A84C" stroke-width="1" stroke-opacity=".25" stroke-dasharray="6 4" fill="none" class="cp-fi" style="animation-delay:2.2s"/><text x="524" y="65" class="cp-lbl" style="fill:#C9A84C;fill-opacity:.5">STERILE ZONE</text><line x1="475" y1="85" x2="575" y2="85" stroke="white" stroke-width="1.5" class="cp-d" style="--l:100;animation-delay:2s"/><line x1="492" y1="85" x2="492" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:27;animation-delay:2.05s"/><line x1="524" y1="85" x2="524" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:27;animation-delay:2.1s"/><line x1="556" y1="85" x2="556" y2="112" stroke="white" stroke-width="1" class="cp-d" style="--l:27;animation-delay:2.15s"/><line x1="492" y1="112" x2="492" y2="142" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g4o)"/><line x1="524" y1="112" x2="524" y2="142" stroke="#f97316" stroke-width="1.5" class="cp-drip2" filter="url(#g4o)"/><line x1="556" y1="112" x2="556" y2="142" stroke="#f97316" stroke-width="1.5" class="cp-drip3" filter="url(#g4o)"/><path d="M486,142 L486,162 Q492,167 498,162 L498,142" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:2.3s"/><path d="M518,142 L518,162 Q524,167 530,162 L530,142" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:2.35s"/><path d="M550,142 L550,162 Q556,167 562,162 L562,142" stroke="white" stroke-width=".7" fill="none" stroke-opacity=".25" class="cp-fi" style="animation-delay:2.4s"/><text x="524" y="205" class="cp-lbl">ASEPTIC</text><text x="524" y="216" class="cp-lbl" fill-opacity=".4">PET FILLER</text><line x1="597" y1="120" x2="640" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:43;animation-delay:2.3s"/><line x1="597" y1="120" x2="640" y2="120" class="cp-pO" filter="url(#g4o)"/><polygon points="618,120 610,116 610,124" fill="#f97316" class="cp-ap" filter="url(#g4o)"/><rect x="640" y="65" width="65" height="95" rx="6" class="cp-d" style="--l:320;animation-delay:2.4s"/><line x1="672" y1="72" x2="672" y2="98" stroke="white" stroke-width="1.2" class="cp-d" style="--l:26;animation-delay:2.55s"/><rect x="662" y="95" width="20" height="8" rx="2" class="cp-d" style="--l:56;animation-delay:2.6s"/><circle cx="672" cy="130" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:2.65s"/><circle cx="672" cy="130" r="3.5" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><text x="672" y="205" class="cp-lbl">CAP &amp;</text><text x="672" y="216" class="cp-lbl" fill-opacity=".4">LABEL</text></svg>'},
      {title:'Aseptic Bag-in-Box',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><rect x="8" y="6" width="48" height="36" rx="2" class="cp-d" style="--l:175;animation-delay:.2s"/><path d="M16,12 Q32,18 48,12 L46,36 Q32,30 18,36 Z" class="cp-d" style="--l:120;animation-delay:.5s" stroke-opacity=".5"/><circle cx="44" cy="10" r="3" class="cp-d" style="--l:20;animation-delay:.8s"/><line x1="44" y1="10" x2="56" y2="4" class="cp-d" style="--l:16;animation-delay:.9s"/><path d="M8,6 L2,2 M56,6 L62,2" class="cp-d" style="--l:12;animation-delay:.4s" stroke-opacity=".3"/></svg>',
       desc:'Large-format aseptic fill for foodservice, industrial, and bulk retail \u2014 2L\u201325L.',
       specs:['2L\u201325L','Foodservice','Concentrate & RTD','Aseptic valve'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g5o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g5b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m5" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="128" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:0.3s"/><line x1="78" y1="120" x2="128" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="103,120 95,116 95,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="128" y="48" width="95" height="124" rx="8" class="cp-d" style="--l:438;animation-delay:.4s"/><path d="M140,68 Q170,62 170,80 Q170,98 140,90 Q170,82 170,100 Q170,118 140,110 Q170,102 170,120 Q170,138 140,130 Q170,122 170,140" stroke="#f97316" stroke-width="1.2" fill="none" stroke-opacity=".5" class="cp-d" style="--l:380;animation-delay:.6s"/><line x1="192" y1="62" x2="192" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.55s"/><line x1="210" y1="62" x2="210" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.58s"/><line x1="192" y1="62" x2="210" y2="62" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.62s"/><line x1="192" y1="158" x2="210" y2="158" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.65s"/><circle cx="200" cy="42" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:0.8s"/><line x1="200" y1="42" x2="200" y2="34" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g5o)"/><path d="M145,42 Q150,35 155,42 Q160,49 165,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g5o)"/><path d="M175,42 Q180,35 185,42 Q190,49 195,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g5o)"/><text x="175" y="108" class="cp-lbl2">280&#176;F</text><text x="175" y="205" class="cp-lbl">UHT</text><line x1="223" y1="120" x2="268" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:1.0s"/><line x1="223" y1="120" x2="268" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="245,120 237,116 237,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="268" y="60" width="55" height="105" rx="8" class="cp-d" style="--l:320;animation-delay:1.1s"/><path d="M268,60 Q295,44 323,60" class="cp-d" style="--l:62;animation-delay:1.15s"/><rect x="275" y="110" width="41" height="40" rx="2" fill="#f97316" fill-opacity=".1" class="cp-liq"/><text x="295" y="205" class="cp-lbl">STERILE</text><text x="295" y="216" class="cp-lbl" fill-opacity=".4">HOLD</text><line x1="323" y1="120" x2="378" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:55;animation-delay:1.4s"/><line x1="323" y1="120" x2="378" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="350,120 342,116 342,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="378" y="38" width="165" height="140" rx="8" class="cp-d" style="--l:610;animation-delay:1.5s"/><rect x="385" y="45" width="151" height="126" rx="5" stroke="#C9A84C" stroke-width="1" stroke-opacity=".25" stroke-dasharray="6 4" fill="none" class="cp-fi" style="animation-delay:1.9s"/><text x="460" y="63" class="cp-lbl" style="fill:#C9A84C;fill-opacity:.5">STERILE ZONE</text><rect x="440" y="72" width="40" height="16" rx="3" class="cp-d" style="--l:112;animation-delay:1.7s"/><line x1="460" y1="88" x2="460" y2="108" stroke="white" stroke-width="1.2" class="cp-d" style="--l:20;animation-delay:1.8s"/><circle cx="460" cy="98" r="4" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:26;animation-delay:1.85s"/><line x1="460" y1="105" x2="460" y2="125" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g5o)"/><rect x="418" y="120" width="84" height="48" rx="2" class="cp-d" style="--l:264;animation-delay:1.6s" stroke-opacity=".5"/><path d="M425,128 Q460,118 495,128 L492,160 Q460,150 428,160 Z" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:2s"/><path d="M430,142 Q460,135 490,142 L488,155 Q460,148 432,155 Z" fill="#f97316" fill-opacity=".08" class="cp-liq"/><circle cx="490" cy="128" r="4" stroke="#C9A84C" stroke-width="1" fill="none" class="cp-d" style="--l:26;animation-delay:2.1s"/><text x="460" y="205" class="cp-lbl">ASEPTIC</text><text x="460" y="216" class="cp-lbl" fill-opacity=".4">BAG FILLER</text><line x1="543" y1="120" x2="595" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:52;animation-delay:2.2s"/><line x1="543" y1="120" x2="595" y2="120" class="cp-pO" filter="url(#g5o)"/><polygon points="569,120 561,116 561,124" fill="#f97316" class="cp-ap" filter="url(#g5o)"/><rect x="595" y="68" width="80" height="95" rx="6" class="cp-d" style="--l:350;animation-delay:2.3s"/><rect x="612" y="85" width="46" height="32" rx="2" class="cp-d" style="--l:156;animation-delay:2.45s" stroke-opacity=".5"/><path d="M612,85 L625,75" stroke="white" stroke-width=".8" class="cp-d" style="--l:16;animation-delay:2.5s" stroke-opacity=".4"/><path d="M658,85 L645,75" stroke="white" stroke-width=".8" class="cp-d" style="--l:16;animation-delay:2.5s" stroke-opacity=".4"/><line x1="595" y1="163" x2="720" y2="163" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="605" cy="163" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.4s"/><circle cx="710" cy="163" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.45s"/><rect x="690" y="135" width="26" height="26" rx="2" class="cp-d" style="--l:104;animation-delay:2.55s" stroke-opacity=".35"/><rect x="695" y="114" width="26" height="24" rx="2" class="cp-d" style="--l:100;animation-delay:2.65s" stroke-opacity=".25"/><text x="650" y="205" class="cp-lbl">BOX SEAL</text><text x="650" y="216" class="cp-lbl" fill-opacity=".4">&amp; PALLET</text></svg>'},
      {title:'Tetra Pak',
       svg:'<svg viewBox="0 0 64 48" width="64" height="48"><path d="M18,44 L18,8 L32,2 L46,8 L46,44 Z" class="cp-d" style="--l:140;animation-delay:.2s"/><line x1="18" y1="8" x2="46" y2="8" class="cp-d" style="--l:28;animation-delay:.5s"/><path d="M18,8 L32,2 L46,8" class="cp-d" style="--l:36;animation-delay:.6s"/><line x1="32" y1="2" x2="32" y2="8" class="cp-d" style="--l:6;animation-delay:.7s" stroke-opacity=".4"/><rect x="26" y="14" width="12" height="8" rx="1" class="cp-d" style="--l:44;animation-delay:.8s" stroke-opacity=".4"/><circle cx="32" cy="18" r="2" class="cp-glow" fill="#C9A84C" stroke="none"/><path d="M22,30 L42,30 M22,36 L42,36" class="cp-d" style="--l:44;animation-delay:1s" stroke-opacity=".25"/></svg>',
       desc:'Multi-layer carton packaging for dairy alternatives, juice, broth \u2014 200mL\u20131L.',
       specs:['Carton','200mL\u20131L','Ambient','Sustainable'],
       diagram:'<svg viewBox="0 0 900 240" width="100%"><defs><filter id="g6o" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="g6b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="m6" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#f97316"/></marker></defs><line x1="10" y1="218" x2="880" y2="218" stroke="white" stroke-width=".7" stroke-opacity=".05" class="cp-d" style="--l:870;animation-delay:0s"/><rect x="22" y="50" width="56" height="124" rx="8" class="cp-d" style="--l:360;animation-delay:0.1s"/><path d="M22,50 Q50,34 78,50" class="cp-d" style="--l:74;animation-delay:0.15000000000000002s"/><rect x="27" y="112" width="46" height="56" rx="3" stroke="#38bdf8" stroke-width="1" stroke-opacity=".35" fill="none" class="cp-fi" style="animation-delay:1.1s"/><rect x="28" y="140" width="44" height="31" rx="2" fill="#38bdf8" fill-opacity=".18" class="cp-liq"/><text x="50" y="205" class="cp-lbl">PRODUCT</text><text x="50" y="216" class="cp-lbl" fill-opacity=".4">TANK</text><line x1="78" y1="120" x2="128" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:50;animation-delay:0.3s"/><line x1="78" y1="120" x2="128" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="103,120 95,116 95,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="128" y="48" width="90" height="124" rx="8" class="cp-d" style="--l:428;animation-delay:.4s"/><path d="M140,68 Q165,62 165,80 Q165,98 140,90 Q165,82 165,100 Q165,118 140,110 Q165,102 165,120 Q165,138 140,130" stroke="#f97316" stroke-width="1.2" fill="none" stroke-opacity=".5" class="cp-d" style="--l:360;animation-delay:.6s"/><line x1="186" y1="62" x2="186" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.55s"/><line x1="204" y1="62" x2="204" y2="158" stroke="white" stroke-width="1.5" class="cp-d" style="--l:96;animation-delay:.58s"/><line x1="186" y1="62" x2="204" y2="62" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.62s"/><line x1="186" y1="158" x2="204" y2="158" stroke="white" stroke-width="1" class="cp-d" style="--l:18;animation-delay:.65s"/><circle cx="195" cy="42" r="10" stroke="white" stroke-width="1" fill="none" class="cp-d" style="--l:64;animation-delay:0.8s"/><line x1="195" y1="42" x2="195" y2="34" stroke="#f97316" stroke-width="1.5" class="cp-ndl" filter="url(#g6o)"/><path d="M142,42 Q147,35 152,42 Q157,49 162,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws" filter="url(#g6o)"/><path d="M168,42 Q173,35 178,42 Q183,49 188,42" stroke="#f97316" stroke-width="1" fill="none" stroke-opacity=".4" class="cp-ws1" filter="url(#g6o)"/><text x="172" y="108" class="cp-lbl2">280&#176;F</text><text x="172" y="205" class="cp-lbl">UHT</text><line x1="218" y1="120" x2="265" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:47;animation-delay:1.0s"/><line x1="218" y1="120" x2="265" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="241,120 233,116 233,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="265" y="40" width="200" height="140" rx="8" class="cp-d" style="--l:680;animation-delay:1.1s"/><circle cx="295" cy="75" r="18" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:114;animation-delay:1.25s"/><circle cx="295" cy="75" r="6" stroke="white" stroke-width="1" fill="none" class="cp-imp"/><path d="M295,93 L295,145 Q295,155 305,155 L430,155" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".25" class="cp-d" style="--l:200;animation-delay:1.4s"/><line x1="330" y1="55" x2="330" y2="165" stroke="white" stroke-width="1.2" class="cp-d" style="--l:110;animation-delay:1.3s"/><line x1="350" y1="55" x2="350" y2="85" stroke="white" stroke-width="1.2" class="cp-d" style="--l:30;animation-delay:1.45s"/><line x1="350" y1="85" x2="350" y2="115" stroke="#f97316" stroke-width="1.5" class="cp-drip" filter="url(#g6o)"/><path d="M360,95 L360,135 L390,135 L390,95" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".2" class="cp-fi" style="animation-delay:1.7s"/><path d="M400,90 L400,135 L430,135 L430,90 L415,82 L400,90" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:1.8s"/><path d="M440,88 L440,135 L455,135 L455,88 L447,82 L440,88" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:1.9s"/><line x1="340" y1="140" x2="370" y2="140" stroke="#f97316" stroke-width="1.5" stroke-opacity=".4" class="cp-fi" style="animation-delay:2s"/><line x1="340" y1="95" x2="370" y2="95" stroke="#f97316" stroke-width="1" stroke-opacity=".3" class="cp-fi" style="animation-delay:2.05s"/><text x="380" y="60" class="cp-lbl">FORM</text><text x="380" y="72" class="cp-lbl" fill-opacity=".4">FILL SEAL</text><text x="365" y="205" class="cp-lbl">FORM-FILL</text><text x="365" y="216" class="cp-lbl" fill-opacity=".4">SEAL</text><line x1="465" y1="120" x2="510" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:2.0s"/><line x1="465" y1="120" x2="510" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="487,120 479,116 479,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="510" y="60" width="70" height="110" rx="6" class="cp-d" style="--l:360;animation-delay:2.1s"/><path d="M528,88 L528,148 L562,148 L562,88 L545,80 L528,88" stroke="white" stroke-width=".8" fill="none" stroke-opacity=".3" class="cp-fi" style="animation-delay:2.3s"/><line x1="520" y1="75" x2="548" y2="75" stroke="white" stroke-width="1.2" class="cp-d" style="--l:28;animation-delay:2.35s"/><rect x="538" y="72" width="10" height="7" rx="1" stroke="#C9A84C" stroke-width="1" fill="none" class="cp-d" style="--l:34;animation-delay:2.4s"/><line x1="545" y1="100" x2="545" y2="115" stroke="#C9A84C" stroke-width="1" stroke-opacity=".5" class="cp-fi" style="animation-delay:2.5s"/><text x="545" y="205" class="cp-lbl">CAP &amp;</text><text x="545" y="216" class="cp-lbl" fill-opacity=".4">STRAW</text><line x1="580" y1="120" x2="625" y2="120" stroke="white" stroke-width="1.5" stroke-opacity=".2" class="cp-d" style="--l:45;animation-delay:2.5s"/><line x1="580" y1="120" x2="625" y2="120" class="cp-pO" filter="url(#g6o)"/><polygon points="602,120 594,116 594,124" fill="#f97316" class="cp-ap" filter="url(#g6o)"/><rect x="625" y="70" width="75" height="88" rx="6" class="cp-d" style="--l:326;animation-delay:2.6s"/><line x1="625" y1="158" x2="770" y2="158" stroke="white" stroke-width="2" stroke-dasharray="8 4" class="cp-belt"/><circle cx="635" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.65s"/><circle cx="760" cy="158" r="5" stroke="white" stroke-width="1.2" fill="none" class="cp-d" style="--l:32;animation-delay:2.7s"/><rect x="710" y="128" width="30" height="28" rx="2" class="cp-d" style="--l:116;animation-delay:2.75s" stroke-opacity=".4"/><rect x="745" y="128" width="30" height="28" rx="2" class="cp-d" style="--l:116;animation-delay:2.85s" stroke-opacity=".3"/><rect x="718" y="106" width="30" height="24" rx="2" class="cp-d" style="--l:108;animation-delay:2.95s" stroke-opacity=".25"/><text x="680" y="205" class="cp-lbl">CASE</text><text x="680" y="216" class="cp-lbl" fill-opacity=".4">PACK</text></svg>'}
    ];

        // Build layout: Row1 → Expansion → Row2
        var cpWrap=document.createElement('div');
        cpWrap.style.cssText='margin-top:36px;padding-top:36px;border-top:1px solid #222';
        var row1=document.createElement('div');row1.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:20px';
        var expSlot=document.createElement('div');expSlot.className='cp-expand';expSlot.style.cssText='margin:16px 0;border-radius:14px;background:rgba(255,255,255,.02);border:1px solid transparent;padding:0 24px';
        var row2=document.createElement('div');row2.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:20px';
        var activeIdx=-1;
        var allCards=[];
        function openSlot(idx){
          if(activeIdx===idx){expSlot.className='cp-expand';expSlot.style.borderColor='transparent';allCards[idx].classList.remove('cp-active');activeIdx=-1;return;}
          if(activeIdx>=0)allCards[activeIdx].classList.remove('cp-active');
          activeIdx=idx;
          allCards[idx].classList.add('cp-active');
          expSlot.innerHTML='<div style="padding:20px 0"><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:12px;letter-spacing:.05em">'+cpProcs[idx].title.toUpperCase()+' \u2014 PROCESS FLOW</div>'+cpProcs[idx].diagram+'</div>';
          expSlot.style.borderColor='#222';
          expSlot.className='cp-expand cp-open';
        }
        cpProcs.forEach(function(p,pi){
          var card=document.createElement('div');
          card.className='cp-card';
          card.style.cssText+='opacity:0;animation:tabFadeIn .5s ease '+(.15+pi*.1)+'s forwards';
          card.innerHTML=
            '<div style="margin-bottom:12px">'+p.svg+'</div>'+
            '<div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:6px">'+p.title+'</div>'+
            '<p style="font-size:.82rem;line-height:1.5;color:#888;margin-bottom:10px">'+p.desc+'</p>'+
            '<ul style="list-style:none;padding:0;margin:0">'+p.specs.map(function(s){return '<li style="padding:2px 0;color:#666;font-size:.78rem"><span style="color:#C9A84C;margin-right:6px">\u25b8</span>'+s+'</li>'}).join('')+'</ul>';
          card.onclick=function(){openSlot(pi)};
          allCards.push(card);
          if(pi<3)row1.appendChild(card);else row2.appendChild(card);
        });
        cpWrap.appendChild(row1);
        cpWrap.appendChild(expSlot);
        cpWrap.appendChild(row2);
        cpSec.appendChild(cpWrap);

        // Auto-open first card (Tunnel Pasteurization) after 300ms
        setTimeout(function(){openSlot(0);},300);
      }

      // ── 4. SUPPORTING SERVICES TAB SWITCHING ──
      var supSec=document.getElementById('svc-supporting');
      if(supSec){
        var tabBtns=supSec.querySelectorAll('.svc-tabs-btn');
        var tabPanels=supSec.querySelectorAll('.svc-tab-panel');
        // Hide Supply Chain tab (last btn + last panel) — content moved to next section
        if(tabBtns.length>=4){tabBtns[3].style.display='none'}
        if(tabPanels.length>=4){tabPanels[3].style.display='none'}
        tabBtns.forEach(function(btn,idx){
          btn.style.cursor='pointer';
          btn.addEventListener('click',function(){
            tabBtns.forEach(function(b){b.classList.remove('is-active')});
            tabPanels.forEach(function(p){p.classList.remove('is-active');p.style.maxHeight='0';p.style.opacity='0';p.style.overflow='hidden';p.style.transition='max-height .4s ease, opacity .3s ease'});
            btn.classList.add('is-active');
            var panel=tabPanels[idx];
            if(panel){
              panel.classList.add('is-active');
              panel.style.maxHeight='2000px';
              panel.style.opacity='1';
            }
          });
        });
        // Ensure first panel is visible with proper styles
        if(tabPanels[0]){
          tabPanels[0].style.maxHeight='2000px';
          tabPanels[0].style.opacity='1';
        }
        // Set inactive panels to hidden
        for(var ti=1;ti<tabPanels.length;ti++){
          tabPanels[ti].style.maxHeight='0';
          tabPanels[ti].style.opacity='0';
          tabPanels[ti].style.overflow='hidden';
          tabPanels[ti].style.transition='max-height .4s ease, opacity .3s ease';
        }
      }


      // ── 4b. INJECT ANIMATED VISUALS INTO SUPPORTING SERVICES TAB PANELS ──
      if(supSec){
        // Process Dev panel (index 0): 4-phase pipeline cards
        var pdPanel=tabPanels[0];
        if(pdPanel){
          var pdViz=document.createElement('div');
          pdViz.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;position:relative;margin-top:24px"><div class="proc-phase" data-phase="0" style="background:#111;border-radius:12px;padding:20px;border:1px solid #222;position:relative;opacity:0;transform:translateY(20px);transition:all .5s ease 0s"><canvas class="phase-icon" data-phase-idx="0" width="48" height="48" style="display:block;margin-bottom:8px"></canvas><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Phase 1</div><div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:12px">Pre-Production</div><ul style="list-style:none;padding:0;margin:0"><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Raw material staging and preparation</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Equipment calibration and setup</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Ingredient tempering and pre-treatment</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Batch room readiness verification</li></ul><div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:#C9A84C;font-size:1.2rem;z-index:1">▶</div></div><div class="proc-phase" data-phase="1" style="background:#111;border-radius:12px;padding:20px;border:1px solid #222;position:relative;opacity:0;transform:translateY(20px);transition:all .5s ease 0.15s"><canvas class="phase-icon" data-phase-idx="1" width="48" height="48" style="display:block;margin-bottom:8px"></canvas><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Phase 2</div><div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:12px">Batching</div><ul style="list-style:none;padding:0;margin:0"><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Precision ingredient weighing and kitting</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> High-shear mixing and emulsification</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Buffer and stabilizer incorporation</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Temperature-controlled blending stages</li></ul><div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:#C9A84C;font-size:1.2rem;z-index:1">▶</div></div><div class="proc-phase" data-phase="2" style="background:#111;border-radius:12px;padding:20px;border:1px solid #222;position:relative;opacity:0;transform:translateY(20px);transition:all .5s ease 0.3s"><canvas class="phase-icon" data-phase-idx="2" width="48" height="48" style="display:block;margin-bottom:8px"></canvas><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Phase 3</div><div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:12px">QC & Sterilization</div><ul style="list-style:none;padding:0;margin:0"><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> In-process lab analysis (pH, Brix, total solids)</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Spec confirmation and batch adjustment</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Thermal sterilization (UHT/HTST/retort)</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Homogenization and rapid cooling</li></ul><div style="position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:#C9A84C;font-size:1.2rem;z-index:1">▶</div></div><div class="proc-phase" data-phase="3" style="background:#111;border-radius:12px;padding:20px;border:1px solid #222;position:relative;opacity:0;transform:translateY(20px);transition:all .5s ease 0.44999999999999996s"><canvas class="phase-icon" data-phase-idx="3" width="48" height="48" style="display:block;margin-bottom:8px"></canvas><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Phase 4</div><div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:12px">Packaging & Palletizing</div><ul style="list-style:none;padding:0;margin:0"><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Product filling and sealing</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Labeling and case packing</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Pallet stacking per spec diagram</li><li style="padding:5px 0;color:#888;font-size:.8rem;line-height:1.4;display:flex;gap:8px"><span style="color:#C9A84C;flex-shrink:0">→</span> Final QC, wrapping, and shipment staging</li></ul></div></div>';
          pdPanel.appendChild(pdViz);
          // Animate cards in + start phase canvas icons
          setTimeout(function(){
            pdViz.querySelectorAll('.proc-phase').forEach(function(c){c.style.opacity='1';c.style.transform='translateY(0)'});
            // Phase icon drawers (from old scaffold)
            var phaseDraw=[
              function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.roundRect(-14,-22,28,44,4);ctx.stroke();ctx.beginPath();ctx.roundRect(-6,-26,12,8,2);ctx.stroke();ctx.globalAlpha=.7;for(var i=0;i<3;i++){var y=-10+i*12;var done=((t*2+i)%3)<2;if(done){ctx.beginPath();ctx.moveTo(-8,y);ctx.lineTo(-5,y+3);ctx.lineTo(-1,y-3);ctx.stroke()}ctx.beginPath();ctx.moveTo(3,y);ctx.lineTo(10,y);ctx.stroke()}},
              function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-14,-18);ctx.lineTo(-16,16);ctx.quadraticCurveTo(-16,22,-10,22);ctx.lineTo(10,22);ctx.quadraticCurveTo(16,22,16,16);ctx.lineTo(14,-18);ctx.closePath();ctx.stroke();ctx.globalAlpha=.4;var a=t*3;ctx.beginPath();ctx.moveTo(-8,4+Math.sin(a)*3);ctx.quadraticCurveTo(0,-2+Math.cos(a)*3,8,4+Math.sin(a+1)*3);ctx.stroke();ctx.globalAlpha=.8;var sr=t*4;ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(0,-10);ctx.stroke();ctx.beginPath();ctx.moveTo(-4+Math.sin(sr)*2,-10);ctx.lineTo(4+Math.sin(sr)*2,-4);ctx.stroke()},
              function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-8,12);ctx.arc(-2,12,6,Math.PI,0);ctx.lineTo(4,-20);ctx.stroke();ctx.globalAlpha=.3;var lv=Math.sin(t*2)*3;ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-7,2+lv);ctx.quadraticCurveTo(-2,-2+lv,3,2+lv);ctx.lineTo(3,12);ctx.arc(-2,12,5,0,Math.PI);ctx.closePath();ctx.fill();ctx.globalAlpha=.8;ctx.beginPath();ctx.moveTo(12,-18);ctx.lineTo(12,8);ctx.arc(12,12,4,Math.PI*1.5,Math.PI*3.5);ctx.stroke();ctx.fillStyle='#fff';ctx.globalAlpha=.6;var mh=12+Math.sin(t*1.5)*6;ctx.fillRect(11,12-mh,2,mh);ctx.beginPath();ctx.arc(12,12,3,0,Math.PI*2);ctx.fill()},
              function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.rect(-14,-8,28,24);ctx.stroke();ctx.beginPath();ctx.moveTo(-14,-8);ctx.lineTo(-8,-18);ctx.lineTo(8,-18);ctx.lineTo(14,-8);ctx.stroke();ctx.beginPath();ctx.moveTo(14,-8);ctx.lineTo(20,-18);ctx.lineTo(8,-18);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(0,-8);ctx.stroke();ctx.globalAlpha=.7;var ay=-24-((t*20)%12);ctx.beginPath();ctx.moveTo(0,ay);ctx.lineTo(0,ay+8);ctx.moveTo(-3,ay+5);ctx.lineTo(0,ay+8);ctx.lineTo(3,ay+5);ctx.stroke();ctx.globalAlpha=.25;ctx.beginPath();ctx.rect(-10,16,8,6);ctx.rect(0,16,8,6);ctx.rect(-6,10,8,6);ctx.stroke()}
            ];
            var phCvs=pdViz.querySelectorAll('.phase-icon');
            (function animPh(){phCvs.forEach(function(cv){var idx=parseInt(cv.getAttribute('data-phase-idx'));var ctx=cv.getContext('2d');ctx.clearRect(0,0,48,48);ctx.save();ctx.translate(24,24);ctx.globalAlpha=1;phaseDraw[idx](ctx,performance.now()/1000);ctx.restore()});requestAnimationFrame(animPh)})();
          },300);
        }
        // PAL / Heat Pen panel (index 1): retort vessel SVG + animated bullets
        var palPanel=tabPanels[1];
        if(palPanel){
          var palViz=document.createElement('div');
          palViz.innerHTML='<div id="pal-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start"><div style="background:transparent;border-radius:12px;padding:12px 16px 8px;border:1px solid #222;overflow:visible"><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Heat Penetration Study</div><style>@keyframes rsvg-draw{to{stroke-dashoffset:0}}@keyframes rsvg-fadeIn{from{opacity:0}to{opacity:1}}.rsvg-drawn{stroke-dasharray:var(--len,2000);stroke-dashoffset:var(--len,2000);animation:rsvg-draw 1.4s cubic-bezier(.4,0,.2,1) forwards}.rsvg-drawn-2{animation-delay:.15s}.rsvg-drawn-3{animation-delay:.3s}.rsvg-drawn-4{animation-delay:.45s}.rsvg-drawn-5{animation-delay:.6s}.rsvg-drawn-6{animation-delay:.75s}.rsvg-drawn-7{animation-delay:.9s}.rsvg-drawn-8{animation-delay:1.05s}.rsvg-drawn-9{animation-delay:1.2s}.rsvg-fi{opacity:0;animation:rsvg-fadeIn .4s ease forwards}.rsvg-fi-2{animation-delay:.5s}.rsvg-fi-3{animation-delay:.7s}.rsvg-fi-4{animation-delay:.9s}.rsvg-fi-5{animation-delay:1.1s}.rsvg-fi-6{animation-delay:1.3s}.rsvg-fi-7{animation-delay:1.5s}.rsvg-fi-8{animation-delay:1.7s}.rsvg-fi-9{animation-delay:1.9s}.rsvg-fi-10{animation-delay:2.1s}.rsvg-fi-11{animation-delay:2.3s}@keyframes rsvg-flowR{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}@keyframes rsvg-flowDown{from{stroke-dashoffset:0}to{stroke-dashoffset:30}}@keyframes rsvg-flowUp{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}.rsvg-pipe-heat{stroke:#ff5533;stroke-width:3px;stroke-dasharray:10 6;fill:none;animation:rsvg-flowR .55s linear infinite;animation-delay:1.8s}.rsvg-pipe-water{stroke:#38bdf8;stroke-width:3px;stroke-dasharray:10 6;fill:none;animation:rsvg-flowR .65s linear infinite;animation-delay:1.8s}.rsvg-pipe-water-down{stroke:#38bdf8;stroke-width:3px;stroke-dasharray:10 6;fill:none;animation:rsvg-flowDown .65s linear infinite;animation-delay:1.8s}.rsvg-pipe-vent{stroke:#cbd5e1;stroke-width:2px;stroke-dasharray:7 5;fill:none;animation:rsvg-flowUp .8s linear infinite;animation-delay:1.8s}@keyframes rsvg-thermFill{0%{height:4px;y:160px}50%{height:76px;y:88px}100%{height:4px;y:160px}}.rsvg-therm-mercury{animation:rsvg-thermFill 3.8s ease-in-out infinite;animation-delay:1.8s}@keyframes rsvg-arrowPop{0%,100%{opacity:0}30%,70%{opacity:1}}.rsvg-ha1{animation:rsvg-arrowPop 1.6s ease-in-out infinite;animation-delay:1.9s;opacity:0}.rsvg-ha2{animation:rsvg-arrowPop 1.6s ease-in-out .25s infinite;animation-delay:2.15s;opacity:0}.rsvg-ha3{animation:rsvg-arrowPop 1.6s ease-in-out .5s infinite;animation-delay:2.4s;opacity:0}.rsvg-ha4{animation:rsvg-arrowPop 1.6s ease-in-out .12s infinite;animation-delay:2.05s;opacity:0}.rsvg-ha5{animation:rsvg-arrowPop 1.6s ease-in-out .38s infinite;animation-delay:2.3s;opacity:0}.rsvg-ha6{animation:rsvg-arrowPop 1.6s ease-in-out .62s infinite;animation-delay:2.55s;opacity:0}.rsvg-hu1{animation:rsvg-arrowPop 1.6s ease-in-out .08s infinite;animation-delay:2.0s;opacity:0}.rsvg-hu2{animation:rsvg-arrowPop 1.6s ease-in-out .32s infinite;animation-delay:2.24s;opacity:0}.rsvg-hu3{animation:rsvg-arrowPop 1.6s ease-in-out .56s infinite;animation-delay:2.48s;opacity:0}.rsvg-wa1{animation:rsvg-arrowPop 1.6s ease-in-out .18s infinite;animation-delay:2.1s;opacity:0}.rsvg-wa2{animation:rsvg-arrowPop 1.6s ease-in-out .42s infinite;animation-delay:2.34s;opacity:0}.rsvg-wa3{animation:rsvg-arrowPop 1.6s ease-in-out .66s infinite;animation-delay:2.58s;opacity:0}@keyframes rsvg-steamRise{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(-22px);opacity:0}}@keyframes rsvg-steamRise2{0%{transform:translateY(0);opacity:.75}100%{transform:translateY(-28px);opacity:0}}.rsvg-sa{animation:rsvg-steamRise 2s ease-out infinite;animation-delay:2s}.rsvg-sb{animation:rsvg-steamRise2 2s ease-out .7s infinite;animation-delay:2.7s}.rsvg-sc{animation:rsvg-steamRise 2s ease-out 1.3s infinite;animation-delay:3.3s}@keyframes rsvg-valveSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.rsvg-valve{transform-box:fill-box;transform-origin:center;animation:rsvg-valveSpin 4s linear infinite;animation-delay:1.8s}@keyframes rsvg-blink{0%,90%,100%{opacity:1}93%{opacity:0}96%{opacity:.8}}.rsvg-temp{animation:rsvg-blink 8s ease-in-out infinite;animation-delay:2s}</style><svg width="100%" viewBox="0 0 900 720" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;margin:0 auto"><defs><marker id="rsvg-mh" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#ff5533"/></marker><marker id="rsvg-mw" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#38bdf8"/></marker><marker id="rsvg-ms" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0,7 3.5,0 7" fill="#cbd5e1"/></marker><filter id="rsvg-fh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="rsvg-fw" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="rsvg-vesselGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".12"/><stop offset="50%" stop-color="#fff" stop-opacity=".03"/><stop offset="100%" stop-color="#fff" stop-opacity=".08"/></linearGradient><linearGradient id="rsvg-insulation" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff5533" stop-opacity=".06"/><stop offset="100%" stop-color="#ff5533" stop-opacity=".02"/></linearGradient></defs><rect x="160" y="120" width="480" height="420" rx="6" fill="url(#rsvg-insulation)" stroke="#ff5533" stroke-width=".5" stroke-opacity=".15" stroke-dasharray="4 4" class="rsvg-drawn" style="--len:1800"/><rect x="175" y="135" width="450" height="390" rx="4" fill="url(#rsvg-vesselGrad)" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-2" style="--len:1700"/><ellipse cx="175" cy="330" rx="28" ry="196" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn" style="--len:1300"/><ellipse cx="625" cy="330" rx="28" ry="196" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-3" style="--len:1300"/><g class="rsvg-fi rsvg-fi-3" stroke="#fff" stroke-width="1" stroke-opacity=".2"><line x1="280" y1="135" x2="280" y2="525"/><line x1="400" y1="135" x2="400" y2="525"/><line x1="520" y1="135" x2="520" y2="525"/></g><g class="rsvg-fi rsvg-fi-2" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"><line x1="230" y1="525" x2="220" y2="565"/><line x1="220" y1="565" x2="250" y2="565"/><line x1="570" y1="525" x2="580" y2="565"/><line x1="580" y1="565" x2="550" y2="565"/><line x1="225" y1="548" x2="245" y2="548" stroke-opacity=".25"/><line x1="555" y1="548" x2="575" y2="548" stroke-opacity=".25"/></g><g class="rsvg-fi rsvg-fi-4" fill="#fff" fill-opacity=".3"><circle cx="175" cy="160" r="2.5"/><circle cx="175" cy="200" r="2.5"/><circle cx="175" cy="240" r="2.5"/><circle cx="175" cy="280" r="2.5"/><circle cx="175" cy="320" r="2.5"/><circle cx="175" cy="360" r="2.5"/><circle cx="175" cy="400" r="2.5"/><circle cx="175" cy="440" r="2.5"/><circle cx="175" cy="480" r="2.5"/><circle cx="625" cy="160" r="2.5"/><circle cx="625" cy="200" r="2.5"/><circle cx="625" cy="240" r="2.5"/><circle cx="625" cy="280" r="2.5"/><circle cx="625" cy="320" r="2.5"/><circle cx="625" cy="360" r="2.5"/><circle cx="625" cy="400" r="2.5"/><circle cx="625" cy="440" r="2.5"/><circle cx="625" cy="480" r="2.5"/></g><g class="rsvg-fi rsvg-fi-4" stroke="#fff" stroke-width="1.5" stroke-opacity=".35"><rect x="640" y="170" width="18" height="30" rx="3" fill="none"/><rect x="640" y="350" width="18" height="30" rx="3" fill="none"/><circle cx="649" cy="185" r="4" fill="none"/><circle cx="649" cy="365" r="4" fill="none"/></g><g class="rsvg-fi rsvg-fi-5" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"><rect x="643" y="260" width="14" height="60" rx="7" fill="none"/><line x1="650" y1="270" x2="650" y2="310"/></g><ellipse cx="400" cy="330" rx="195" ry="175" fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity=".25" class="rsvg-drawn rsvg-drawn-4" style="--len:1200"/><g class="rsvg-fi rsvg-fi-6" stroke="#fff" stroke-width="1" stroke-opacity=".3"><line x1="210" y1="170" x2="590" y2="170"/><circle cx="260" cy="170" r="3" fill="none"/><circle cx="340" cy="170" r="3" fill="none"/><circle cx="420" cy="170" r="3" fill="none"/><circle cx="500" cy="170" r="3" fill="none"/><circle cx="560" cy="170" r="3" fill="none"/></g><rect x="370" y="100" width="60" height="35" rx="4" fill="none" stroke="#fff" stroke-width="1.5" class="rsvg-drawn rsvg-drawn-5" style="--len:200"/><line x1="365" y1="108" x2="435" y2="108" stroke="#fff" stroke-width="1" stroke-opacity=".3" class="rsvg-fi rsvg-fi-5"/><rect x="370" y="525" width="60" height="28" rx="4" fill="none" stroke="#fff" stroke-width="1.5" class="rsvg-drawn rsvg-drawn-5" style="--len:180"/><line x1="365" y1="545" x2="435" y2="545" stroke="#fff" stroke-width="1" stroke-opacity=".3" class="rsvg-fi rsvg-fi-5"/><g class="rsvg-fi rsvg-fi-5"><rect x="240" y="210" width="320" height="80" rx="2" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".25" stroke-dasharray="4 3"/><rect x="250" y="218" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.5"/><line x1="250" y1="230" x2="300" y2="230" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="258" y="236" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="262" y1="258" x2="262" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="267" y1="258" x2="267" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="272" y1="258" x2="272" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="277" y1="258" x2="277" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="282" y1="258" x2="282" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="310" y="218" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="1"/><line x1="310" y1="230" x2="360" y2="230" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="318" y="236" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="322" y1="258" x2="322" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="327" y1="258" x2="327" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="332" y1="258" x2="332" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="337" y1="258" x2="337" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="342" y1="258" x2="342" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="370" y="218" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.7"/><line x1="370" y1="230" x2="420" y2="230" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="378" y="236" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="382" y1="258" x2="382" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="387" y1="258" x2="387" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="392" y1="258" x2="392" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="397" y1="258" x2="397" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="402" y1="258" x2="402" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="430" y="218" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.55"/><line x1="430" y1="230" x2="480" y2="230" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="438" y="236" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="442" y1="258" x2="442" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="447" y1="258" x2="447" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="452" y1="258" x2="452" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="457" y1="258" x2="457" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="462" y1="258" x2="462" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="490" y="218" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.9"/><line x1="490" y1="230" x2="540" y2="230" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="498" y="236" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="502" y1="258" x2="502" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="507" y1="258" x2="507" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="512" y1="258" x2="512" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="517" y1="258" x2="517" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="522" y1="258" x2="522" y2="270" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/></g><g class="rsvg-fi rsvg-fi-6"><rect x="240" y="310" width="320" height="80" rx="2" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".25" stroke-dasharray="4 3"/><rect x="250" y="318" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.8"/><line x1="250" y1="330" x2="300" y2="330" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="258" y="336" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="262" y1="358" x2="262" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="267" y1="358" x2="267" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="272" y1="358" x2="272" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="277" y1="358" x2="277" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="282" y1="358" x2="282" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="310" y="318" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.45"/><line x1="310" y1="330" x2="360" y2="330" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="318" y="336" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="322" y1="358" x2="322" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="327" y1="358" x2="327" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="332" y1="358" x2="332" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="337" y1="358" x2="337" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="342" y1="358" x2="342" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="370" y="318" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="1"/><line x1="370" y1="330" x2="420" y2="330" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="378" y="336" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="382" y1="358" x2="382" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="387" y1="358" x2="387" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="392" y1="358" x2="392" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="397" y1="358" x2="397" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="402" y1="358" x2="402" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="430" y="318" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.6"/><line x1="430" y1="330" x2="480" y2="330" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="438" y="336" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="442" y1="358" x2="442" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="447" y1="358" x2="447" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="452" y1="358" x2="452" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="457" y1="358" x2="457" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="462" y1="358" x2="462" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><rect x="490" y="318" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.95"/><line x1="490" y1="330" x2="540" y2="330" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="498" y="336" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><line x1="502" y1="358" x2="502" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="507" y1="358" x2="507" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="512" y1="358" x2="512" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="517" y1="358" x2="517" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/><line x1="522" y1="358" x2="522" y2="370" stroke="#fff" stroke-width=".6" stroke-opacity=".15"/></g><g class="rsvg-fi rsvg-fi-7"><rect x="240" y="410" width="320" height="80" rx="2" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".25" stroke-dasharray="4 3"/><rect x="250" y="418" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.5"/><line x1="250" y1="430" x2="300" y2="430" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="258" y="436" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><rect x="310" y="418" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.85"/><line x1="310" y1="430" x2="360" y2="430" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="318" y="436" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><rect x="370" y="418" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.7"/><line x1="370" y1="430" x2="420" y2="430" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="378" y="436" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><rect x="430" y="418" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="1"/><line x1="430" y1="430" x2="480" y2="430" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="438" y="436" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><rect x="490" y="418" width="50" height="64" rx="3" fill="none" stroke="#fff" stroke-width="1.3" stroke-opacity="0.55"/><line x1="490" y1="430" x2="540" y2="430" stroke="#fff" stroke-width=".8" stroke-opacity=".4"/><rect x="498" y="436" width="34" height="18" rx="1" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/></g><g class="rsvg-fi rsvg-fi-8" stroke="#C9A84C" stroke-width=".8" stroke-opacity=".5" fill="none"><path d="M400,135 C400,180 275,190 275,245"/><path d="M400,135 C400,175 395,185 395,245"/><path d="M400,135 C400,180 515,190 515,245"/><circle cx="275" cy="245" r="2.5" fill="#C9A84C" fill-opacity=".6"/><circle cx="395" cy="245" r="2.5" fill="#C9A84C" fill-opacity=".6"/><circle cx="515" cy="245" r="2.5" fill="#C9A84C" fill-opacity=".6"/></g><g class="rsvg-fi rsvg-fi-9"><text x="408" y="155" fill="#C9A84C" font-family="monospace" font-size="8" fill-opacity=".5" letter-spacing=".5">TC WIRES</text></g><rect x="55" y="140" width="24" height="175" rx="12" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-4" style="--len:420"/><circle cx="67" cy="330" r="18" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-5" style="--len:115"/><rect x="63" y="150" width="8" height="168" rx="4" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".3" class="rsvg-fi rsvg-fi-4"/><g class="rsvg-fi rsvg-fi-5" stroke="#fff" stroke-width=".7" stroke-opacity=".35"><line x1="79" y1="148" x2="87" y2="148"/><line x1="79" y1="158.5" x2="84" y2="158.5"/><line x1="79" y1="169" x2="87" y2="169"/><line x1="79" y1="179.5" x2="84" y2="179.5"/><line x1="79" y1="190" x2="87" y2="190"/><line x1="79" y1="200.5" x2="84" y2="200.5"/><line x1="79" y1="211" x2="87" y2="211"/><line x1="79" y1="221.5" x2="84" y2="221.5"/><line x1="79" y1="232" x2="87" y2="232"/><line x1="79" y1="242.5" x2="84" y2="242.5"/><line x1="79" y1="253" x2="87" y2="253"/><line x1="79" y1="263.5" x2="84" y2="263.5"/><line x1="79" y1="274" x2="87" y2="274"/><line x1="79" y1="284.5" x2="84" y2="284.5"/><line x1="79" y1="295" x2="87" y2="295"/><line x1="79" y1="305.5" x2="84" y2="305.5"/></g><g class="rsvg-fi rsvg-fi-6" fill="#fff" font-family="monospace" font-size="7" fill-opacity=".35" text-anchor="start"><text x="90" y="152">120</text><text x="90" y="173">100</text><text x="90" y="194">80</text><text x="90" y="215">60</text><text x="90" y="236">40</text><text x="90" y="257">20</text><text x="90" y="278">0</text></g><rect class="rsvg-therm-mercury rsvg-fi rsvg-fi-5" x="64" y="200" width="6" height="50" rx="3" fill="#ff5533" filter="url(#rsvg-fh)"/><circle cx="67" cy="330" r="12" fill="#ff5533" class="rsvg-fi rsvg-fi-5" filter="url(#rsvg-fh)"/><rect class="rsvg-therm-mercury rsvg-fi rsvg-fi-5" x="66" y="200" width="2" height="50" rx="1" fill="#ff8888" opacity=".4"/><polygon points="67,128 60,140 74,140" fill="#ff5533" class="rsvg-ha1" filter="url(#rsvg-fh)"/><g class="rsvg-temp rsvg-fi rsvg-fi-7"><rect x="32" y="96" width="70" height="28" rx="3" fill="#111" stroke="#ff5533" stroke-width="1" stroke-opacity=".6"/><text x="67" y="114" fill="#ff5533" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">121.1°C</text><text x="67" y="92" fill="#ff5533" font-family="monospace" font-size="7" font-weight="500" text-anchor="middle" fill-opacity=".5">TEMP</text></g><text x="30" y="365" fill="#ff5533" font-family="monospace" font-size="14" font-weight="600" letter-spacing="2" class="rsvg-fi rsvg-fi-9">HEAT</text><g class="rsvg-fi rsvg-fi-7"><circle cx="200" cy="105" r="22" fill="#111" stroke="#fff" stroke-width="1.5" stroke-opacity=".5"/><circle cx="200" cy="105" r="18" fill="none" stroke="#fff" stroke-width=".8" stroke-opacity=".3"/><g stroke="#fff" stroke-width=".6" stroke-opacity=".3"><line x1="190.1" y1="95.1" x2="188.0" y2="93.0"/><line x1="198.4" y1="91.1" x2="198.1" y2="88.1"/><line x1="207.4" y1="93.1" x2="209.0" y2="90.6"/><line x1="213.2" y1="100.4" x2="216.0" y2="99.4"/><line x1="213.2" y1="109.6" x2="216.0" y2="110.6"/><line x1="207.4" y1="116.9" x2="209.0" y2="119.4"/><line x1="198.4" y1="118.9" x2="198.1" y2="121.9"/><line x1="190.1" y1="114.9" x2="188.0" y2="117.0"/></g><line x1="200" y1="105" x2="189" y2="95" stroke="#ff5533" stroke-width="1.2" stroke-linecap="round"/><circle cx="200" cy="105" r="2.5" fill="#fff" fill-opacity=".5"/><text x="200" y="120" fill="#fff" font-family="monospace" font-size="5.5" text-anchor="middle" fill-opacity=".35">PSI</text><line x1="200" y1="127" x2="200" y2="135" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"/><text x="200" y="82" fill="#fff" font-family="monospace" font-size="7" text-anchor="middle" fill-opacity=".4" letter-spacing="1">15 PSIG</text></g><g class="rsvg-fi rsvg-fi-8"><rect x="540" y="102" width="30" height="33" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".4"/><line x1="555" y1="102" x2="555" y2="90" stroke="#fff" stroke-width="1.5" stroke-opacity=".35"/><polygon points="548,90 555,80 562,90" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".3"/><text x="555" y="122" fill="#fff" font-family="monospace" font-size="6" text-anchor="middle" fill-opacity=".3">RELIEF</text></g><line x1="30" y1="330" x2="147" y2="330" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-7" style="--len:120"/><g class="rsvg-fi rsvg-fi-7" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"><line x1="50" y1="320" x2="50" y2="340"/><line x1="140" y1="320" x2="140" y2="340"/><circle cx="50" cy="322" r="1.5" fill="#fff" fill-opacity=".2"/><circle cx="50" cy="338" r="1.5" fill="#fff" fill-opacity=".2"/><circle cx="140" cy="322" r="1.5" fill="#fff" fill-opacity=".2"/><circle cx="140" cy="338" r="1.5" fill="#fff" fill-opacity=".2"/></g><line x1="30" y1="330" x2="145" y2="330" class="rsvg-pipe-heat rsvg-fi rsvg-fi-8" marker-end="url(#rsvg-mh)" filter="url(#rsvg-fh)"/><line x1="30" y1="580" x2="370" y2="580" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-7" style="--len:340"/><line x1="370" y1="553" x2="370" y2="580" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-7" style="--len:30"/><g class="rsvg-fi rsvg-fi-7" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"><line x1="100" y1="572" x2="100" y2="588"/><line x1="300" y1="572" x2="300" y2="588"/></g><line x1="30" y1="580" x2="368" y2="580" class="rsvg-pipe-water rsvg-fi rsvg-fi-8" filter="url(#rsvg-fw)"/><text x="30" y="572" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="600" letter-spacing="2" class="rsvg-fi rsvg-fi-9">WATER</text><g class="rsvg-fi rsvg-fi-8"><line x1="430" y1="553" x2="430" y2="600" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"/><line x1="430" y1="600" x2="480" y2="600" stroke="#fff" stroke-width="1.5" stroke-opacity=".4"/><rect x="475" y="593" width="16" height="14" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".35"/><line x1="483" y1="593" x2="483" y2="585" stroke="#fff" stroke-width="1" stroke-opacity=".3"/><circle cx="483" cy="583" r="3" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".3"/><text x="430" y="618" fill="#fff" font-family="monospace" font-size="7" fill-opacity=".3" letter-spacing="1">DRAIN</text></g><line x1="400" y1="78" x2="400" y2="100" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-8" style="--len:23"/><line x1="400" y1="78" x2="680" y2="78" stroke="#fff" stroke-width="2" stroke-opacity=".5" class="rsvg-drawn rsvg-drawn-8" style="--len:280"/><line x1="400" y1="50" x2="400" y2="78" class="rsvg-pipe-vent rsvg-fi rsvg-fi-10" marker-end="url(#rsvg-ms)"/><circle cx="680" cy="78" r="18" fill="none" stroke="#fff" stroke-width="2" class="rsvg-drawn rsvg-drawn-8" style="--len:115"/><g class="rsvg-valve rsvg-fi rsvg-fi-10"><line x1="668" y1="66" x2="692" y2="90" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><line x1="692" y1="66" x2="668" y2="90" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/></g><g class="rsvg-fi rsvg-fi-10"><line x1="680" y1="58" x2="680" y2="46" stroke="#fff" stroke-width="1" stroke-opacity=".3" stroke-dasharray="2 2"/><text x="720" y="50" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="600" letter-spacing="2">AIR VENTING</text></g><g class="rsvg-sa rsvg-fi rsvg-fi-11"><ellipse cx="676" cy="50" rx="14" ry="8" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-opacity=".6"/><ellipse cx="694" cy="46" rx="10" ry="7" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-opacity=".5"/><ellipse cx="664" cy="44" rx="8" ry="5" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-opacity=".4"/></g><g class="rsvg-sb rsvg-fi rsvg-fi-11"><ellipse cx="680" cy="40" rx="16" ry="9" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-opacity=".45"/><ellipse cx="698" cy="36" rx="11" ry="7" fill="none" stroke="#cbd5e1" stroke-width=".8" stroke-opacity=".3"/></g><g class="rsvg-sc rsvg-fi rsvg-fi-11"><ellipse cx="672" cy="32" rx="9" ry="5" fill="none" stroke="#cbd5e1" stroke-width=".8" stroke-opacity=".3"/></g><polygon points="200,260 218,250 218,270" fill="#ff5533" class="rsvg-ha1" filter="url(#rsvg-fh)"/><polygon points="200,330 218,320 218,340" fill="#ff5533" class="rsvg-ha2" filter="url(#rsvg-fh)"/><polygon points="200,400 218,390 218,410" fill="#ff5533" class="rsvg-ha3" filter="url(#rsvg-fh)"/><polygon points="600,260 582,250 582,270" fill="#ff5533" class="rsvg-ha4" filter="url(#rsvg-fh)"/><polygon points="600,330 582,320 582,340" fill="#ff5533" class="rsvg-ha5" filter="url(#rsvg-fh)"/><polygon points="600,400 582,390 582,410" fill="#ff5533" class="rsvg-ha6" filter="url(#rsvg-fh)"/><polygon points="300,200 292,182 308,182" fill="#ff5533" class="rsvg-hu1" filter="url(#rsvg-fh)"/><polygon points="400,195 392,177 408,177" fill="#ff5533" class="rsvg-hu2" filter="url(#rsvg-fh)"/><polygon points="500,200 492,182 508,182" fill="#ff5533" class="rsvg-hu3" filter="url(#rsvg-fh)"/><polygon points="300,495 292,510 308,510" fill="#38bdf8" class="rsvg-wa1" filter="url(#rsvg-fw)"/><polygon points="400,500 392,515 408,515" fill="#38bdf8" class="rsvg-wa2" filter="url(#rsvg-fw)"/><polygon points="500,495 492,510 508,510" fill="#38bdf8" class="rsvg-wa3" filter="url(#rsvg-fw)"/><g class="rsvg-fi rsvg-fi-4"><text x="400" y="660" fill="#fff" font-family="monospace" font-size="14" font-weight="600" letter-spacing="4" text-anchor="middle" fill-opacity=".35">RETORT VESSEL</text></g><g class="rsvg-fi rsvg-fi-8"><text x="400" y="50" fill="#fff" font-family="monospace" font-size="10" fill-opacity=".3" letter-spacing="3" text-anchor="middle">T : 0 → F₀ HOLD</text></g><g class="rsvg-fi rsvg-fi-7"><line x1="548" y1="260" x2="580" y2="248" stroke="#fff" stroke-width=".8" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="585" y="250" fill="#fff" font-family="monospace" font-size="9" fill-opacity=".4" letter-spacing="1">PRODUCT LOAD</text></g><g class="rsvg-fi rsvg-fi-7"><line x1="200" y1="510" x2="180" y2="540" stroke="#fff" stroke-width=".8" stroke-opacity=".25" stroke-dasharray="2 2"/><text x="50" y="545" fill="#38bdf8" font-family="monospace" font-size="9" fill-opacity=".55" letter-spacing="1">HEATING MEDIUM</text></g><g class="rsvg-fi rsvg-fi-9"><line x1="160" y1="190" x2="130" y2="190" stroke="#ff5533" stroke-width=".6" stroke-opacity=".3" stroke-dasharray="2 2"/><text x="85" y="193" fill="#ff5533" font-family="monospace" font-size="7" fill-opacity=".4" letter-spacing=".5">INSULATION</text></g></svg><div style="display:flex;gap:14px;margin-top:6px;flex-wrap:wrap;justify-content:center;transform:scale(.85);transform-origin:center top"><div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #ff5533"></div><span style="color:#ff5533">Heat flow</span></div><div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #38bdf8"></div><span style="color:#38bdf8">Water / steam</span></div><div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #cbd5e1"></div><span style="color:#cbd5e1">Air vent</span></div><div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:2px;background:#fff;opacity:.35"></div>Vessel structure</div></div></div><div id="pal-right" style="background:transparent;border-radius:12px;padding:24px 28px;border:1px solid #222;overflow:hidden;display:flex;flex-direction:column;justify-content:center"><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em">Heat Penetration Studies</div><ul id="pal-bullets" style="list-style:none;padding:0;margin:0"><li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Thermocouple Placement</strong><br><span style="color:#999;font-size:.85rem">Sensors inserted at the cold spot of each container to record real-time temperature data throughout the thermal process</span></div></li><li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Lethality Calculation (F₀)</strong><br><span style="color:#999;font-size:.85rem">Cumulative sterilization value computed from time-temperature data to ensure commercial sterility (F₀ ≥ 3.0 min)</span></div></li><li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Come-Up Time (CUT)</strong><br><span style="color:#999;font-size:.85rem">Time for retort to reach processing temperature — only the final 58% of CUT counts toward lethality per 21 CFR 113</span></div></li><li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Worst-Case Container</strong><br><span style="color:#999;font-size:.85rem">Testing identifies the slowest-heating container position in the retort to establish the scheduled process</span></div></li><li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Temperature Distribution</strong><br><span style="color:#999;font-size:.85rem">Mapping retort temperature uniformity to verify consistent heat delivery across all container positions</span></div></li><li class="pal-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">FDA Scheduled Process Filing</strong><br><span style="color:#999;font-size:.85rem">Process Authority files validated thermal process with FDA for each product/container/retort combination</span></div></li></ul></div></div>';
          palPanel.appendChild(palViz);
          // Animate bullet points in
          var palBullets=palViz.querySelectorAll('.pal-bp');
          palBullets.forEach(function(b,idx){setTimeout(function(){b.style.opacity='1';b.style.transform='translateY(0)'},300+idx*400)});
        }
        // Scale-Up panel (index 2): production line SVG
        var suPanel=tabPanels[2];
        if(suPanel){
          var suViz=document.createElement('div');
          suViz.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start"><div style="background:transparent;border-radius:12px;padding:16px;border:1px solid #222;overflow:visible"><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Pilot Trial → Production Line</div><style>@keyframes su-draw{to{stroke-dashoffset:0}}@keyframes su-fadeIn{from{opacity:0}to{opacity:1}}.su-d{stroke-dasharray:var(--l,800);stroke-dashoffset:var(--l,800);animation:su-draw 1.2s cubic-bezier(.4,0,.2,1) forwards}.su-d2{animation-delay:.2s}.su-d3{animation-delay:.4s}.su-d4{animation-delay:.6s}.su-d5{animation-delay:.8s}.su-d6{animation-delay:1s}.su-d7{animation-delay:1.2s}.su-fi{opacity:0;animation:su-fadeIn .5s ease forwards}.su-fi2{animation-delay:.6s}.su-fi3{animation-delay:.9s}.su-fi4{animation-delay:1.2s}.su-fi5{animation-delay:1.5s}.su-fi6{animation-delay:1.8s}.su-fi7{animation-delay:2.1s}@keyframes su-flow{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}.su-pipe{stroke:#C9A84C;stroke-width:2;stroke-dasharray:8 4;fill:none;animation:su-flow .6s linear infinite}@keyframes su-pulse{0%,100%{opacity:.3}50%{opacity:.9}}.su-glow{animation:su-pulse 2s ease-in-out infinite}@keyframes su-agitate{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}.su-stir{transform-box:fill-box;transform-origin:center top;animation:su-agitate .6s ease-in-out infinite;animation-delay:1.5s}@keyframes su-fillUp{from{height:0}to{height:24px}}.su-liquid{animation:su-fillUp 1.5s ease forwards;animation-delay:1.8s}</style><svg width="100%" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible"><defs><marker id="su-ma" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#C9A84C"/></marker></defs><g class="su-fi su-fi2"><rect x="20" y="80" width="70" height="100" rx="6" fill="none" stroke="#fff" stroke-width="2" class="su-d" style="--l:350"/><ellipse cx="55" cy="80" rx="35" ry="10" fill="none" stroke="#fff" stroke-width="2" class="su-d" style="--l:220"/><rect x="40" y="130" width="30" height="24" rx="2" fill="#C9A84C" fill-opacity=".15" class="su-liquid"/><text x="55" y="200" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">INGREDIENTS</text></g><line x1="90" y1="130" x2="140" y2="130" class="su-pipe su-fi su-fi3" marker-end="url(#su-ma)"/><g class="su-fi su-fi3"><path d="M150,90 L145,170 Q148,180 170,180 Q192,180 195,170 L190,90 Z" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d3" style="--l:300"/><line x1="170" y1="70" x2="170" y2="110" stroke="#fff" stroke-width="2" class="su-d su-d3" style="--l:40"/><g class="su-stir"><line x1="160" y1="110" x2="180" y2="120" stroke="#fff" stroke-width="1.5" stroke-opacity=".7"/><line x1="180" y1="110" x2="160" y2="120" stroke="#fff" stroke-width="1.5" stroke-opacity=".7"/></g><text x="170" y="200" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">BLENDING</text></g><line x1="195" y1="130" x2="245" y2="130" class="su-pipe su-fi su-fi4" marker-end="url(#su-ma)"/><g class="su-fi su-fi4"><rect x="250" y="90" width="60" height="80" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d4" style="--l:290"/><line x1="265" y1="170" x2="265" y2="185" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><line x1="280" y1="170" x2="280" y2="185" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><line x1="295" y1="170" x2="295" y2="185" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><rect x="258" y="186" width="14" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><rect x="273" y="186" width="14" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><rect x="288" y="186" width="14" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><text x="280" y="222" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">FILLING</text></g><line x1="310" y1="130" x2="355" y2="130" class="su-pipe su-fi su-fi5" marker-end="url(#su-ma)"/><g class="su-fi su-fi5"><rect x="360" y="95" width="50" height="65" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d5" style="--l:240"/><circle cx="385" cy="90" r="12" fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity=".6"/><line x1="385" y1="78" x2="385" y2="102" stroke="#fff" stroke-width="1" stroke-opacity=".4"/><line x1="373" y1="90" x2="397" y2="90" stroke="#fff" stroke-width="1" stroke-opacity=".4"/><text x="385" y="178" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">SEAMING</text></g><line x1="410" y1="130" x2="445" y2="130" class="su-pipe su-fi su-fi6" marker-end="url(#su-ma)"/><g class="su-fi su-fi6"><ellipse cx="455" cy="130" rx="12" ry="40" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d6" style="--l:320"/><rect x="455" y="90" width="80" height="80" rx="3" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d6" style="--l:330"/><ellipse cx="535" cy="130" rx="12" ry="40" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d6" style="--l:320"/><g class="su-glow"><text x="470" y="125" fill="#ff5533" font-size="14" fill-opacity=".5">≈</text><text x="500" y="140" fill="#ff5533" font-size="14" fill-opacity=".4">≈</text><text x="515" y="120" fill="#ff5533" font-size="12" fill-opacity=".35">≈</text></g><text x="495" y="190" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">THERMAL</text></g><path d="M535,170 L535,260 L500,260" fill="none" class="su-pipe su-fi su-fi7" marker-end="url(#su-ma)"/><g class="su-fi su-fi7"><rect x="420" y="240" width="75" height="55" rx="6" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d7" style="--l:270"/><g class="su-glow"><text x="440" y="270" fill="#38bdf8" font-size="14" fill-opacity=".5">❄</text><text x="465" y="262" fill="#38bdf8" font-size="11" fill-opacity=".4">❄</text><text x="478" y="278" fill="#38bdf8" font-size="9" fill-opacity=".35">❄</text></g><text x="457" y="312" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">COOLING</text></g><line x1="420" y1="268" x2="370" y2="268" fill="none" class="su-pipe su-fi su-fi7" marker-end="url(#su-ma)"/><g class="su-fi su-fi7"><rect x="290" y="245" width="75" height="48" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d7" style="--l:255"/><rect x="305" y="252" width="18" height="26" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><rect x="330" y="252" width="18" height="26" rx="2" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><line x1="308" y1="260" x2="320" y2="260" stroke="#C9A84C" stroke-width="1" stroke-opacity=".6"/><line x1="308" y1="265" x2="318" y2="265" stroke="#C9A84C" stroke-width="1" stroke-opacity=".4"/><line x1="333" y1="260" x2="345" y2="260" stroke="#C9A84C" stroke-width="1" stroke-opacity=".6"/><line x1="333" y1="265" x2="343" y2="265" stroke="#C9A84C" stroke-width="1" stroke-opacity=".4"/><text x="327" y="312" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">LABELING + QC</text></g><line x1="290" y1="268" x2="230" y2="268" fill="none" class="su-pipe su-fi su-fi7" marker-end="url(#su-ma)"/><g class="su-fi su-fi7"><rect x="130" y="240" width="95" height="60" rx="4" fill="none" stroke="#fff" stroke-width="2" class="su-d su-d7" style="--l:320"/><rect x="145" y="270" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><rect x="165" y="270" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><rect x="185" y="270" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".5"/><rect x="155" y="254" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".35"/><rect x="175" y="254" width="18" height="16" rx="1" fill="none" stroke="#fff" stroke-width="1" stroke-opacity=".35"/><text x="177" y="318" fill="#fff" font-family="monospace" font-size="8" text-anchor="middle" fill-opacity=".5">PALLETIZING</text></g><g class="su-fi su-fi7"><line x1="130" y1="270" x2="80" y2="270" stroke="#C9A84C" stroke-width="2" marker-end="url(#su-ma)"/><text x="55" y="265" fill="#C9A84C" font-family="monospace" font-size="9" font-weight="600" text-anchor="middle" fill-opacity=".7">SHIP</text><text x="55" y="278" fill="#C9A84C" font-family="monospace" font-size="7" text-anchor="middle" fill-opacity=".5">READY</text></g><g style="font-family:monospace;font-size:8px"><line x1="20" y1="380" x2="50" y2="380" class="su-pipe"/><text x="55" y="383" fill="rgba(255,255,255,.4)">Product flow</text><line x1="140" y1="380" x2="170" y2="380" stroke="#fff" stroke-width="2" stroke-opacity=".5"/><text x="175" y="383" fill="rgba(255,255,255,.4)">Equipment</text><text x="270" y="383" fill="#ff5533" fill-opacity=".5" font-size="10">≈</text><text x="283" y="383" fill="rgba(255,255,255,.4)">Heat</text><text x="330" y="383" fill="#38bdf8" fill-opacity=".5" font-size="10">❄</text><text x="343" y="383" fill="rgba(255,255,255,.4)">Cooling</text></g></svg></div><div style="background:transparent;border-radius:12px;padding:24px 28px;border:1px solid #222;overflow:hidden;display:flex;flex-direction:column;justify-content:center"><div style="font-size:.85rem;font-weight:700;color:#C9A84C;margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em">Pilot Trial & Scale-Up</div><ul id="su-bullets" style="list-style:none;padding:0;margin:0"><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Pilot Batch Runs</strong><br><span style="color:#999;font-size:.85rem">Small-scale production trials (50–500 gal) on our in-house equipment to validate your formula before committing to a full commercial run</span></div></li><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Formula Scale-Up Adjustments</strong><br><span style="color:#999;font-size:.85rem">Bench-top recipes don’t always scale linearly — we adjust emulsifiers, stabilizers, pH, and thermal parameters for production-volume behavior</span></div></li><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Pilot Trial QC & Sensory</strong><br><span style="color:#999;font-size:.85rem">Every pilot batch undergoes full QC (Brix, pH, viscosity, micro) and sensory panel evaluation against your gold standard sample</span></div></li><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Equipment & Line Qualification</strong><br><span style="color:#999;font-size:.85rem">Verify filler speeds, seamer specs, retort capacity, and cooling throughput — dial in CPM, fill weights, headspace, and seam dimensions</span></div></li><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Shelf Life Confirmation</strong><br><span style="color:#999;font-size:.85rem">Accelerated and real-time stability studies on pilot samples to validate shelf life, emulsion stability, and sensory integrity</span></div></li><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">First Production Run</strong><br><span style="color:#999;font-size:.85rem">Once pilot results are approved, we execute the first full-scale production run with first article inspection, seam teardowns, and batch release QC</span></div></li><li class="su-bp" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease;padding:12px 0;color:#ccc;font-size:.95rem;display:flex;align-items:flex-start;gap:12px"><span style="color:#C9A84C;font-size:1.1rem;line-height:1">&#9670;</span><div><strong style="color:#fff">Production SOP & Tech Transfer</strong><br><span style="color:#999;font-size:.85rem">Complete documentation package: batch records, process parameters, QC checkpoints, packaging specs, HACCP integration, and operator training</span></div></li></ul></div></div>';
          suPanel.appendChild(suViz);
        }
      }

    },600); // end setTimeout — wait for Webflow elements
})();
// ── END service section native animations ──

// ============ 6. DUAL TEXT OUTLINE PARALLAX ============
(function(){
  setTimeout(function(){
    var hasGsap=(typeof gsap!=='undefined');
    if(hasGsap)gsap.registerPlugin(ScrollTrigger);
    var sec=document.getElementById('parallax-hero');
    if(!sec)return;
    // Remove ALL old text elements (Webflow-created h2s and any previous JS text)
    sec.querySelectorAll('[data-parallax]').forEach(function(el){el.remove()});
    sec.querySelectorAll('.parallax-text-back,.parallax-text-front').forEach(function(el){el.remove()});
    sec.querySelectorAll('h2').forEach(function(el){el.remove()});
    // Remove any previous JS-created rows and icon layers
    sec.querySelectorAll('[data-row],[data-layer]').forEach(function(el){el.remove()});

    // Restore background image for moody atmosphere
    sec.style.backgroundPosition='center 80%';
    // Cutout — swap to wide transparent bottle PNG, shifted up slightly, IN FRONT of text (z:3)
    var cutout=sec.querySelector('.parallax-cutout');
    if(cutout){
      cutout.srcset='';
      cutout.sizes='';
      cutout.src='https://lynz-tonomi.github.io/macrobrands/Aura-Bottle-bg-wide-transparent.png';
      cutout.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center 80%;z-index:3;pointer-events:none;display:block'
    }
    // Measure viewport to scale text to fit width
    var vw=window.innerWidth;

    // Helper: create a text row with perfectly aligned solid + outline layers
    function makeRow(text,yPos,yProp,widthPct){
      var wp=widthPct||0.92;
      var wrap=document.createElement('div');
      wrap.style.cssText='position:absolute;'+yProp+':'+yPos+';left:0;width:100%;pointer-events:none;text-align:center';

      var inner=document.createElement('div');
      inner.style.cssText='position:relative;display:inline-block';

      var outline=document.createElement('div');
      outline.style.cssText='font-weight:900;letter-spacing:-.04em;line-height:1;white-space:nowrap;-webkit-text-stroke:1.5px rgba(255,255,255,0.35);-webkit-text-fill-color:transparent;position:relative;z-index:1';
      outline.textContent=text;
      inner.appendChild(outline);

      var solid=document.createElement('div');
      solid.style.cssText='font-weight:900;letter-spacing:-.04em;line-height:1;white-space:nowrap;color:#fff;position:absolute;top:0;left:0;z-index:3;mix-blend-mode:difference';
      solid.textContent=text;
      inner.appendChild(solid);

      wrap.appendChild(inner);
      sec.appendChild(wrap);

      outline.style.fontSize='10vw';solid.style.fontSize='10vw';
      var measured=inner.offsetWidth;
      var targetW=vw*wp;
      var scale=targetW/measured;
      var finalSize=Math.min(10*scale,12)+'vw';
      outline.style.fontSize=finalSize;solid.style.fontSize=finalSize;

      return {wrap:wrap,inner:inner};
    }

    // Row 1: "FROM CONCEPT" — 25% smaller, starts centered, scrolls RIGHT
    var r1=makeRow('FROM CONCEPT','21%','top',0.69);
    r1.wrap.setAttribute('data-row','1');
    r1.wrap.style.zIndex='1';
    // Row 2: "THROUGH PRODUCTION" — full width, starts centered, scrolls LEFT, IN FRONT of bottle
    var r2=makeRow('THROUGH PRODUCTION','77%','top',0.92);
    r2.wrap.setAttribute('data-row','2');
    r2.wrap.style.zIndex='4';

    // GSAP: centered at midpoint (50% scroll), spreading outward
    // Row 1: starts left, crosses center, ends right
    gsap.fromTo(r1.wrap,{x:'-20%'},{x:'20%',ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
    // Row 2: starts right, crosses center, ends left
    gsap.fromTo(r2.wrap,{x:'20%'},{x:'-20%',ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});

    // Cutout gentle parallax — only if visible
    // Cutout bottle stays locked in position — no parallax movement, must align with background

    // Native Webflow beaker hidden, bulb restored
    var beaker=document.getElementById('parallax-beaker');
    var bulb=document.getElementById('parallax-bulb');
    if(beaker){beaker.style.display='none';}
    if(bulb){
      bulb.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center 80%;z-index:0;pointer-events:none';
    }
    // Bulb slides full canvas in from left on scroll
    if(bulb&&hasGsap){gsap.fromTo(bulb,{x:'-100%',opacity:0},{x:'0%',opacity:1,ease:'power2.out',scrollTrigger:{trigger:sec,start:'top 70%',end:'top top',scrub:true}})}

    // Apple parallax on content sections
    var sects=document.querySelectorAll('[id=who-we-serve],[id=about],[id=team],[id=certifications],[id=process-dev],[id=faq],[id=contact-cta],.section-dark,.section-light,.section-dark-alt,.svc-section,.sc-section');
    if(hasGsap){
      var revealH=[],revealP=[],revealC=[];
      sects.forEach(function(sec2){
        if(sec2.closest('.video-hero-wrap'))return;
        sec2.querySelectorAll('h2').forEach(function(h){gsap.set(h,{y:80,opacity:0});revealH.push(h)});
        sec2.querySelectorAll('p').forEach(function(p){gsap.set(p,{y:50,opacity:0});revealP.push(p)});
        sec2.querySelectorAll('.card-light,.service-card').forEach(function(c){
          gsap.set(c,{y:100,opacity:0,scale:.96});revealC.push(c);
          c.style.transition='transform .3s,box-shadow .3s';
          c.onmouseenter=function(){this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 48px rgba(0,0,0,.1)'};
          c.onmouseleave=function(){this.style.transform='';this.style.boxShadow=''};
        });
      });
      // Parallax scrub reveals — each element animates tied to scroll position
      revealH.forEach(function(h){
        gsap.to(h,{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:h,start:'top 95%',end:'top 60%',scrub:true}});
      });
      revealP.forEach(function(p){
        gsap.to(p,{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:p,start:'top 95%',end:'top 65%',scrub:true}});
      });
      revealC.forEach(function(c){
        gsap.to(c,{y:0,opacity:1,scale:1,ease:'none',scrollTrigger:{trigger:c,start:'top 98%',end:'top 65%',scrub:true}});
      });
    }
  },1000);
})();

// ============ 7. SUPPLY CHAIN AI SECTION FIX ============
(function(){
  setTimeout(function(){
  var sec=document.getElementById('autonomi-ai');
  if(!sec)return;
  // Section layout: header text on top, video below
  sec.style.cssText='position:relative;overflow:visible;background:#000';
  // Hide native "Supply Chain Intelligence" heading; move + shorten its desc under sc-header h2
  var nativeSCH2=sec.querySelector('.svc-h2-for-sc');
  if(nativeSCH2)nativeSCH2.style.display='none';
  var nativeSCDesc=sec.querySelector('.svc-desc.is-centered');
  if(nativeSCDesc){
    nativeSCDesc.innerHTML='Autonomi replaces manual coordination with 29 AI agents that monitor, decide, and act across your entire supply chain in real time.';
    nativeSCDesc.style.cssText='font-size:1.15rem;color:rgba(255,255,255,0.7);line-height:1.7;max-width:640px;margin:12px auto 0;text-align:center';
  }
  // Style header content — above the video
  var hdr=sec.querySelector('.sc-header');
  if(hdr){
    hdr.style.cssText='position:relative;z-index:2;text-align:center;max-width:800px;margin:0 auto;padding:80px 40px 60px';
    hdr.querySelectorAll('h2').forEach(function(h){
      h.style.cssText='font-size:clamp(2.5rem,5vw,4rem);font-weight:800;color:#fff;margin:16px 0';
      // Move shortened native desc right after the heading
      if(nativeSCDesc&&!nativeSCDesc._moved){nativeSCDesc._moved=true;h.parentNode.insertBefore(nativeSCDesc,h.nextSibling);}
    });
    hdr.querySelectorAll('p').forEach(function(p){p.style.cssText='font-size:1.1rem;color:rgba(255,255,255,0.75);line-height:1.7;max-width:600px;margin:0 auto';
      if(p.textContent.indexOf('Autonomi')!==-1){p.innerHTML=p.innerHTML.replace('Autonomi','<img src=\"https://lynz-tonomi.github.io/macrobrands/Autonomi-logo-blue.png\" alt=\"Autonomi\" style=\"height:52px;vertical-align:-12px;margin:0 4px\">')}
    });
    /* Electric-blue badge */
    var badge=hdr.querySelector('.sc-badge');
    if(badge){badge.style.borderColor='#00BFFF';badge.style.color='#00BFFF';
      var bImg=badge.querySelector('img');
      if(bImg){bImg.src='https://lynz-tonomi.github.io/macrobrands/AI-small-blue.png';bImg.style.height='22px';bImg.style.width='auto'}
    }
  }
  // Look for native Webflow bg video in sc-section or the section-dark-alt sibling below it
  var vidWrap=null;var scVid=null;
  var darkAlt=sec.nextElementSibling;
  // Walk siblings to find section-dark-alt with a video
  while(darkAlt&&!darkAlt.querySelector('video')){darkAlt=darkAlt.nextElementSibling}
  // Hide the old "How It Works" content-wrapper text inside section-dark-alt, keep only the video
  if(darkAlt){
    var cw=darkAlt.querySelector('.content-wrapper');
    if(cw)cw.style.display='none';
    // Remove section padding so video is full-bleed
    darkAlt.style.padding='0';
    darkAlt.style.overflow='hidden';
  }
  var nativeVid=sec.querySelector('video')||(darkAlt?darkAlt.querySelector('video'):null);
  if(nativeVid){
    scVid=nativeVid;
    nativeVid.muted=true;nativeVid.loop=true;nativeVid.playsInline=true;
    nativeVid.pause();
    // Override Webflow's background-video CSS (z-index:-100, top/left/right/bottom:-100%)
    nativeVid.style.cssText='position:relative !important;z-index:0 !important;width:100% !important;height:auto !important;display:block !important;top:0 !important;left:0 !important;right:auto !important;bottom:auto !important;min-width:0 !important;min-height:0 !important;aspect-ratio:16/9';
    vidWrap=nativeVid.closest('.w-background-video')||nativeVid.parentElement;
    vidWrap.style.cssText='position:relative;width:100%;overflow:visible;height:auto;aspect-ratio:16/9';
    // Ensure parent section has proper height for video
    var vidSection=vidWrap.closest('section');
    if(vidSection){vidSection.style.minHeight='auto';vidSection.style.overflow='hidden'}
  } else {
    vidWrap=document.createElement('div');
    vidWrap.style.cssText='position:relative;width:100%;overflow:visible';
    scVid=document.createElement('video');
    scVid.src='https://lynz-tonomi.github.io/macrobrands/schero-web3.mp4';
    scVid.muted=true;scVid.loop=true;scVid.playsInline=true;
    scVid.style.cssText='width:100%;height:auto;display:block;opacity:1';
    vidWrap.appendChild(scVid);
    sec.appendChild(vidWrap);
  }
  // Only play when scrolled into view, pause when out
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){scVid.play().catch(function(){})}
      else{scVid.pause()}
    });
  },{threshold:0.2});
  observer.observe(vidWrap);
  // Hide original sc-header paragraphs (replaced by moved native desc above)
  if(hdr){
    var pars=hdr.querySelectorAll('p.sc-desc');
    pars.forEach(function(p){p.style.display='none';});
  }

  // ── INJECT AI CHIP CIRCUIT SVG WITH SCROLL-DRIVEN EXPANDING TRACES ──
  if(hdr){
    var scFlow=document.createElement('div');
    scFlow.id='sc-flow-viz';
    scFlow.style.cssText='max-width:100%;margin:40px auto 20px;padding:0;overflow:visible';
    scFlow.innerHTML='<svg id="ai-chip-svg" viewBox="-150 -100 1500 1000" width="100%" style="display:block;margin:0 auto;overflow:visible"><defs><filter id="aig" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00DFFF" stop-opacity="0"/><stop offset="42%" stop-color="#00DFFF" stop-opacity="0"/><stop offset="50%" stop-color="#00DFFF" stop-opacity=".5"/><stop offset="58%" stop-color="#00DFFF" stop-opacity="0"/><stop offset="100%" stop-color="#00DFFF" stop-opacity="0"/></linearGradient></defs><rect x="508" y="308" width="184" height="184" rx="4" fill="#0a0a0a" stroke="#333" stroke-width=".8"/><rect x="520" y="320" width="160" height="160" rx="14" fill="#1a1a1a" stroke="#fff" stroke-width="2.5" stroke-opacity=".7"/><rect x="526" y="326" width="148" height="148" rx="10" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><rect x="545" y="345" width="110" height="110" rx="6" fill="#111" stroke="#fff" stroke-width="1" stroke-opacity=".3"/><rect x="550" y="350" width="100" height="100" rx="4" fill="none" stroke="#fff" stroke-width=".4" stroke-opacity=".15"/><rect x="554" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="556" y="420" width="28" height="12" rx="2" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><text x="570" y="429" font-size="5" fill="#fff" fill-opacity=".2" text-anchor="middle" font-family="monospace">REG</text><rect x="596" y="420" width="28" height="12" rx="2" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><text x="610" y="429" font-size="5" fill="#fff" fill-opacity=".2" text-anchor="middle" font-family="monospace">ALU</text><rect x="636" y="420" width="14" height="12" rx="2" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".2"/><text x="643" y="429" font-size="4" fill="#fff" fill-opacity=".15" text-anchor="middle" font-family="monospace">$</text><line x1="556" y1="440" x2="650" y2="440" stroke="#fff" stroke-width=".3" stroke-opacity=".12"/><line x1="556" y1="443" x2="650" y2="443" stroke="#fff" stroke-width=".3" stroke-opacity=".08"/><text x="600" y="410" font-size="36" fill="#fff" fill-opacity=".65" text-anchor="middle" font-family="monospace" font-weight="bold">AI</text><clipPath id="scanClip"><rect x="520" y="320" width="160" height="160" rx="14"/></clipPath><rect x="520" y="320" width="160" height="160" fill="url(#scanGrad)" clip-path="url(#scanClip)" opacity=".6"><animate attributeName="y" values="320;480;320" dur="3s" repeatCount="indefinite"/></rect><rect x="516" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="518" y1="302" x2="518" y2="308" stroke="#888" stroke-width="1.2"/><rect x="526.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="528.5" y1="302" x2="528.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="537" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="539" y1="302" x2="539" y2="308" stroke="#888" stroke-width="1.2"/><rect x="547.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="549.5" y1="302" x2="549.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="558" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="560" y1="302" x2="560" y2="308" stroke="#888" stroke-width="1.2"/><rect x="568.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="570.5" y1="302" x2="570.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="579" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="581" y1="302" x2="581" y2="308" stroke="#888" stroke-width="1.2"/><rect x="589.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="591.5" y1="302" x2="591.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="600" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="602" y1="302" x2="602" y2="308" stroke="#888" stroke-width="1.2"/><rect x="610.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="612.5" y1="302" x2="612.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="621" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="623" y1="302" x2="623" y2="308" stroke="#888" stroke-width="1.2"/><rect x="631.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="633.5" y1="302" x2="633.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="642" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="644" y1="302" x2="644" y2="308" stroke="#888" stroke-width="1.2"/><rect x="652.5" y="292" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="654.5" y1="302" x2="654.5" y2="308" stroke="#888" stroke-width="1.2"/><rect x="516" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="518" y1="498" x2="518" y2="492" stroke="#888" stroke-width="1.2"/><rect x="526.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="528.5" y1="498" x2="528.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="537" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="539" y1="498" x2="539" y2="492" stroke="#888" stroke-width="1.2"/><rect x="547.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="549.5" y1="498" x2="549.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="558" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="560" y1="498" x2="560" y2="492" stroke="#888" stroke-width="1.2"/><rect x="568.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="570.5" y1="498" x2="570.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="579" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="581" y1="498" x2="581" y2="492" stroke="#888" stroke-width="1.2"/><rect x="589.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="591.5" y1="498" x2="591.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="600" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="602" y1="498" x2="602" y2="492" stroke="#888" stroke-width="1.2"/><rect x="610.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="612.5" y1="498" x2="612.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="621" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="623" y1="498" x2="623" y2="492" stroke="#888" stroke-width="1.2"/><rect x="631.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="633.5" y1="498" x2="633.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="642" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="644" y1="498" x2="644" y2="492" stroke="#888" stroke-width="1.2"/><rect x="652.5" y="498" width="4" height="10" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="654.5" y1="498" x2="654.5" y2="492" stroke="#888" stroke-width="1.2"/><rect x="492" y="316" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="318" x2="508" y2="318" stroke="#888" stroke-width="1.2"/><rect x="492" y="326.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="328.5" x2="508" y2="328.5" stroke="#888" stroke-width="1.2"/><rect x="492" y="337" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="339" x2="508" y2="339" stroke="#888" stroke-width="1.2"/><rect x="492" y="347.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="349.5" x2="508" y2="349.5" stroke="#888" stroke-width="1.2"/><rect x="492" y="358" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="360" x2="508" y2="360" stroke="#888" stroke-width="1.2"/><rect x="492" y="368.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="370.5" x2="508" y2="370.5" stroke="#888" stroke-width="1.2"/><rect x="492" y="379" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="381" x2="508" y2="381" stroke="#888" stroke-width="1.2"/><rect x="492" y="389.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="391.5" x2="508" y2="391.5" stroke="#888" stroke-width="1.2"/><rect x="492" y="400" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="402" x2="508" y2="402" stroke="#888" stroke-width="1.2"/><rect x="492" y="410.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="412.5" x2="508" y2="412.5" stroke="#888" stroke-width="1.2"/><rect x="492" y="421" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="423" x2="508" y2="423" stroke="#888" stroke-width="1.2"/><rect x="492" y="431.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="433.5" x2="508" y2="433.5" stroke="#888" stroke-width="1.2"/><rect x="492" y="442" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="444" x2="508" y2="444" stroke="#888" stroke-width="1.2"/><rect x="492" y="452.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="502" y1="454.5" x2="508" y2="454.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="316" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="318" x2="692" y2="318" stroke="#888" stroke-width="1.2"/><rect x="698" y="326.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="328.5" x2="692" y2="328.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="337" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="339" x2="692" y2="339" stroke="#888" stroke-width="1.2"/><rect x="698" y="347.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="349.5" x2="692" y2="349.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="358" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="360" x2="692" y2="360" stroke="#888" stroke-width="1.2"/><rect x="698" y="368.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="370.5" x2="692" y2="370.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="379" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="381" x2="692" y2="381" stroke="#888" stroke-width="1.2"/><rect x="698" y="389.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="391.5" x2="692" y2="391.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="400" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="402" x2="692" y2="402" stroke="#888" stroke-width="1.2"/><rect x="698" y="410.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="412.5" x2="692" y2="412.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="421" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="423" x2="692" y2="423" stroke="#888" stroke-width="1.2"/><rect x="698" y="431.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="433.5" x2="692" y2="433.5" stroke="#888" stroke-width="1.2"/><rect x="698" y="442" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="444" x2="692" y2="444" stroke="#888" stroke-width="1.2"/><rect x="698" y="452.5" width="10" height="4" rx="1" fill="#666" stroke="#888" stroke-width=".5"/><line x1="698" y1="454.5" x2="692" y2="454.5" stroke="#888" stroke-width="1.2"/><rect x="344" y="174" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="348" cy="178" r="1" fill="#fff" fill-opacity=".1"/><circle cx="352" cy="178" r="1" fill="#fff" fill-opacity=".1"/><circle cx="348" cy="182" r="1" fill="#fff" fill-opacity=".1"/><circle cx="352" cy="182" r="1" fill="#fff" fill-opacity=".1"/><rect x="774" y="154" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="778" cy="158" r="1" fill="#fff" fill-opacity=".1"/><circle cx="782" cy="158" r="1" fill="#fff" fill-opacity=".1"/><circle cx="778" cy="162" r="1" fill="#fff" fill-opacity=".1"/><circle cx="782" cy="162" r="1" fill="#fff" fill-opacity=".1"/><rect x="294" y="344" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="298" cy="348" r="1" fill="#fff" fill-opacity=".1"/><circle cx="302" cy="348" r="1" fill="#fff" fill-opacity=".1"/><circle cx="298" cy="352" r="1" fill="#fff" fill-opacity=".1"/><circle cx="302" cy="352" r="1" fill="#fff" fill-opacity=".1"/><rect x="844" y="294" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="848" cy="298" r="1" fill="#fff" fill-opacity=".1"/><circle cx="852" cy="298" r="1" fill="#fff" fill-opacity=".1"/><circle cx="848" cy="302" r="1" fill="#fff" fill-opacity=".1"/><circle cx="852" cy="302" r="1" fill="#fff" fill-opacity=".1"/><rect x="274" y="474" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="278" cy="478" r="1" fill="#fff" fill-opacity=".1"/><circle cx="282" cy="478" r="1" fill="#fff" fill-opacity=".1"/><circle cx="278" cy="482" r="1" fill="#fff" fill-opacity=".1"/><circle cx="282" cy="482" r="1" fill="#fff" fill-opacity=".1"/><rect x="894" y="464" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="898" cy="468" r="1" fill="#fff" fill-opacity=".1"/><circle cx="902" cy="468" r="1" fill="#fff" fill-opacity=".1"/><circle cx="898" cy="472" r="1" fill="#fff" fill-opacity=".1"/><circle cx="902" cy="472" r="1" fill="#fff" fill-opacity=".1"/><rect x="414" y="574" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="418" cy="578" r="1" fill="#fff" fill-opacity=".1"/><circle cx="422" cy="578" r="1" fill="#fff" fill-opacity=".1"/><circle cx="418" cy="582" r="1" fill="#fff" fill-opacity=".1"/><circle cx="422" cy="582" r="1" fill="#fff" fill-opacity=".1"/><rect x="744" y="594" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="748" cy="598" r="1" fill="#fff" fill-opacity=".1"/><circle cx="752" cy="598" r="1" fill="#fff" fill-opacity=".1"/><circle cx="748" cy="602" r="1" fill="#fff" fill-opacity=".1"/><circle cx="752" cy="602" r="1" fill="#fff" fill-opacity=".1"/><rect x="174" y="244" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="178" cy="248" r="1" fill="#fff" fill-opacity=".1"/><circle cx="182" cy="248" r="1" fill="#fff" fill-opacity=".1"/><circle cx="178" cy="252" r="1" fill="#fff" fill-opacity=".1"/><circle cx="182" cy="252" r="1" fill="#fff" fill-opacity=".1"/><rect x="944" y="374" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="948" cy="378" r="1" fill="#fff" fill-opacity=".1"/><circle cx="952" cy="378" r="1" fill="#fff" fill-opacity=".1"/><circle cx="948" cy="382" r="1" fill="#fff" fill-opacity=".1"/><circle cx="952" cy="382" r="1" fill="#fff" fill-opacity=".1"/><rect x="344" y="544" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="348" cy="548" r="1" fill="#fff" fill-opacity=".1"/><circle cx="352" cy="548" r="1" fill="#fff" fill-opacity=".1"/><circle cx="348" cy="552" r="1" fill="#fff" fill-opacity=".1"/><circle cx="352" cy="552" r="1" fill="#fff" fill-opacity=".1"/><rect x="844" y="544" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="848" cy="548" r="1" fill="#fff" fill-opacity=".1"/><circle cx="852" cy="548" r="1" fill="#fff" fill-opacity=".1"/><circle cx="848" cy="552" r="1" fill="#fff" fill-opacity=".1"/><circle cx="852" cy="552" r="1" fill="#fff" fill-opacity=".1"/><rect x="444" y="124" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="448" cy="128" r="1" fill="#fff" fill-opacity=".1"/><circle cx="452" cy="128" r="1" fill="#fff" fill-opacity=".1"/><circle cx="448" cy="132" r="1" fill="#fff" fill-opacity=".1"/><circle cx="452" cy="132" r="1" fill="#fff" fill-opacity=".1"/><rect x="694" y="114" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="698" cy="118" r="1" fill="#fff" fill-opacity=".1"/><circle cx="702" cy="118" r="1" fill="#fff" fill-opacity=".1"/><circle cx="698" cy="122" r="1" fill="#fff" fill-opacity=".1"/><circle cx="702" cy="122" r="1" fill="#fff" fill-opacity=".1"/><rect x="194" y="394" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="198" cy="398" r="1" fill="#fff" fill-opacity=".1"/><circle cx="202" cy="398" r="1" fill="#fff" fill-opacity=".1"/><circle cx="198" cy="402" r="1" fill="#fff" fill-opacity=".1"/><circle cx="202" cy="402" r="1" fill="#fff" fill-opacity=".1"/><rect x="994" y="244" width="12" height="12" rx="1" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".15"/><circle cx="998" cy="248" r="1" fill="#fff" fill-opacity=".1"/><circle cx="1002" cy="248" r="1" fill="#fff" fill-opacity=".1"/><circle cx="998" cy="252" r="1" fill="#fff" fill-opacity=".1"/><circle cx="1002" cy="252" r="1" fill="#fff" fill-opacity=".1"/><path class="ai-trace" d="M518,292 L518,262 L493,237 L413,237 L393,217 L293,217" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M528.5,292 L529,257 L509,237 L449,237 L434,222 L394,222" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M539,292 L539,242 L524,227 L494,227" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M549.5,292 L550,252 L565,237 L565,187 L545,167 L485,167" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.75" filter="url(#aig)"/><path class="ai-trace" d="M560,292 L560,247 L550,237 L550,207" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M570.5,292 L571,237 L581,227 L621,227" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M581,292 L581,232 L566,217 L516,217 L506,207 L506,177" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M602,292 L602,242 L617,227 L667,227 L677,217 L677,182" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.65" filter="url(#aig)"/><path class="ai-trace" d="M612.5,292 L613,252 L623,242 L653,242" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M623,292 L623,257 L643,237 L703,237 L718,222 L758,222" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.6" filter="url(#aig)"/><path class="ai-trace" d="M633.5,292 L634,262 L659,237 L739,237 L759,217 L859,217" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M644,292 L644,247 L659,232 L729,232 L739,222 L789,222" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.75" filter="url(#aig)"/><path class="ai-trace" d="M654.5,292 L655,237 L675,217 L765,217" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M518,508 L518,538 L498,558 L428,558 L413,573 L373,573" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M528.5,508 L529,548 L514,563 L464,563" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.9" filter="url(#aig)"/><path class="ai-trace" d="M549.5,508 L550,543 L540,553 L540,583 L520,603 L460,603" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M570.5,508 L571,553 L581,563 L581,588" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.7" filter="url(#aig)"/><path class="ai-trace" d="M581,508 L581,543 L566,558 L536,558 L536,588" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.65" filter="url(#aig)"/><path class="ai-trace" d="M591.5,508 L592,558 L607,573 L647,573" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M612.5,508 L613,543 L623,553 L623,593 L643,613 L703,613" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.9" filter="url(#aig)"/><path class="ai-trace" d="M623,508 L623,548 L638,563 L688,563 L698,573 L728,573" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M644,508 L644,553 L664,573 L744,573" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M654.5,508 L655,538 L680,563 L770,563 L785,578 L835,578" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M492,318 L462,318 L442,298 L382,298 L367,283 L317,283" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M492,339 L457,339 L442,324 L402,324 L382,344 L302,344" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M492,349.5 L452,350 L437,365 L387,365" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.6" filter="url(#aig)"/><path class="ai-trace" d="M492,370.5 L462,371 L442,361 L372,361" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M492,391.5 L457,392 L442,407 L402,407 L392,417 L332,417 L312,437 L232,437" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M492,402 L452,402 L432,422 L382,422" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.7" filter="url(#aig)"/><path class="ai-trace" d="M492,423 L462,423 L447,438 L387,438 L377,428 L337,428" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M492,444 L457,444 L437,464 L387,464 L372,479 L342,479" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M492,454.5 L447,455 L432,465 L372,465" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.75" filter="url(#aig)"/><path class="ai-trace" d="M708,318 L738,318 L758,298 L818,298 L833,283 L883,283" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M708,339 L743,339 L758,324 L798,324 L818,314 L898,314" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.9" filter="url(#aig)"/><path class="ai-trace" d="M708,360 L738,360 L758,370 L818,370 L833,385 L913,385" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M708,381 L743,381 L758,396 L808,396" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M708,402 L748,402 L768,422 L828,422 L843,432 L913,432" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M708,412.5 L738,413 L753,403 L793,403" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.75" filter="url(#aig)"/><path class="ai-trace" d="M708,433.5 L743,434 L763,454 L843,454 L853,464 L893,464" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M708,444 L748,444 L763,459 L813,459 L833,479 L893,479" fill="none" stroke="#00DFFF" stroke-width="1.2" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M708,454.5 L738,455 L753,465 L813,465" fill="none" stroke="#fff" stroke-width="1.1" stroke-opacity="0.6" filter="url(#aig)"/><circle class="ai-node-w" cx="293" cy="217" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="394" cy="222" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="494" cy="227" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="485" cy="167" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="550" cy="207" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-w" cx="621" cy="227" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="506" cy="177" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-b" cx="677" cy="182" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="653" cy="242" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-w" cx="758" cy="222" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="859" cy="217" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="789" cy="222" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="765" cy="217" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="373" cy="573" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="464" cy="563" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="460" cy="603" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="581" cy="588" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="536" cy="588" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="647" cy="573" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="703" cy="613" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="728" cy="573" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="744" cy="573" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="835" cy="578" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="317" cy="283" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-w" cx="302" cy="344" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="387" cy="365" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="372" cy="361" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="232" cy="437" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="382" cy="422" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="337" cy="428" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="342" cy="479" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="372" cy="465" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="883" cy="283" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="898" cy="314" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="913" cy="385" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="808" cy="396" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="913" cy="432" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="793" cy="403" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="893" cy="464" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-node-b" cx="893" cy="479" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="813" cy="465" r="4.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0"/><circle class="ai-junc" cx="275" cy="228" r="3.3" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="412" cy="233" r="2.7" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="418" cy="213" r="2.3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="482" cy="241" r="4.2" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="468" cy="209" r="2.7" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="468" cy="159" r="2.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="516" cy="184" r="2.9" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="534" cy="195" r="3.8" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="603" cy="214" r="3.2" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="481" cy="186" r="4.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="690" cy="202" r="2.9" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="653" cy="190" r="3.2" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="664" cy="232" r="3.8" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="740" cy="231" r="4.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="873" cy="236" r="3.4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="806" cy="234" r="4.1" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="815" cy="235" r="2.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="750" cy="202" r="3.8" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="356" cy="557" r="3.3" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="476" cy="551" r="3.3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="439" cy="611" r="3.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="478" cy="596" r="3.2" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="570" cy="600" r="3.0" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="517" cy="577" r="4.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="665" cy="583" r="3.2" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="690" cy="630" r="3.7" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="681" cy="602" r="2.6" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="713" cy="564" r="4.0" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="729" cy="583" r="4.2" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="775" cy="560" r="2.3" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="857" cy="590" r="3.8" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="852" cy="598" r="3.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="301" cy="268" r="2.8" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="286" cy="275" r="2.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="318" cy="359" r="3.4" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="327" cy="338" r="3.1" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="368" cy="377" r="3.3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="389" cy="375" r="2.6" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="390" cy="369" r="2.1" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="211" cy="451" r="2.6" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="207" cy="426" r="3.3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="406" cy="431" r="4.0" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="347" cy="412" r="4.3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="366" cy="465" r="4.3" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="355" cy="478" r="3.6" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="399" cy="448" r="3.2" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="899" cy="270" r="4.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="861" cy="300" r="2.6" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="887" cy="330" r="4.3" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="916" cy="308" r="2.4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="897" cy="402" r="3.0" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="827" cy="378" r="4.1" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="893" cy="419" r="3.0" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="886" cy="425" r="2.8" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="777" cy="411" r="2.7" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="916" cy="472" r="4.1" fill="none" stroke="#fff" stroke-width="1" opacity="0"/><circle class="ai-junc" cx="881" cy="471" r="3.0" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="877" cy="495" r="2.1" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-junc" cx="831" cy="482" r="4.5" fill="none" stroke="#fff" stroke-width="1" opacity="0"/></svg>';
    hdr.appendChild(scFlow);

    // ── MODULE OVERLAY CARDS ──
    scFlow.style.position='relative';
    var moduleData=[
      {name:'SOURCING',sub:'Vendor Discovery',icon:'\u{1F50D}',x:8.4,y:3.1,color:'#00BFFF'},
      {name:'LOGISTICS',sub:'Route Optimization',icon:'\u{1F69A}',x:91.6,y:2.0,color:'#00BFFF'},
      {name:'FORECASTING',sub:'Demand Prediction',icon:'\u{1F4CA}',x:2.0,y:35.0,color:'#fff'},
      {name:'SCHEDULING',sub:'Production Planning',icon:'\u{1F552}',x:2.0,y:53.8,color:'#fff'},
      {name:'MONITORING',sub:'Real-time Alerts',icon:'\u{1F441}',x:92.5,y:35.0,color:'#fff'},
      {name:'ANALYTICS',sub:'Data Intelligence',icon:'\u{1F4C8}',x:92.5,y:53.8,color:'#00BFFF'},
      {name:'INVENTORY',sub:'Stock Management',icon:'\u{1F4E6}',x:28.8,y:90.0,color:'#fff'},
      {name:'COMPLIANCE',sub:'Regulatory Checks',icon:'\u{1F6E1}',x:52.1,y:93.8,color:'#fff'},
      {name:'TRACEABILITY',sub:'Batch Tracking',icon:'\u{1F517}',x:68.8,y:90.0,color:'#00BFFF'}
    ];
    moduleData.forEach(function(m){
      var card=document.createElement('div');
      card.className='ai-mod-card';
      card.style.cssText='position:absolute;left:'+m.x+'%;top:'+m.y+'%;transform:translate(-50%,-50%) translateY(12px);opacity:0;background:#111;border:1px solid '+m.color+'40;border-radius:8px;padding:8px 14px;pointer-events:none;white-space:nowrap;display:flex;align-items:center;gap:8px;';
      card.innerHTML='<span style="font-size:18px">'+m.icon+'</span><div><div style="font-size:10px;font-family:monospace;letter-spacing:2px;color:'+m.color+';font-weight:bold">'+m.name+'</div><div style="font-size:9px;color:#666;font-family:sans-serif;margin-top:2px">'+m.sub+'</div></div>';
      scFlow.appendChild(card);
    });

    // ── GSAP SCROLL-DRIVEN CIRCUIT EXPANSION ──
    if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
      setTimeout(function(){
        var paths=scFlow.querySelectorAll('.ai-trace');
        paths.forEach(function(p){
          var len=p.getTotalLength();
          p.style.strokeDasharray=len;
          p.style.strokeDashoffset=len;
        });
        // Scrub: traces complete when section is 100% in viewport
        gsap.to(paths,{strokeDashoffset:0,ease:'none',stagger:.006,scrollTrigger:{trigger:scFlow,start:'top 95%',end:'top 10%',scrub:true}});
        // Junction dots appear as traces grow
        var juncs=scFlow.querySelectorAll('.ai-junc');
        gsap.to(juncs,{opacity:.6,ease:'none',stagger:.005,scrollTrigger:{trigger:scFlow,start:'top 80%',end:'top 20%',scrub:true}});
        // Labels fade in near completion
        var lbls=scFlow.querySelectorAll('.ai-label');
        gsap.to(lbls,{opacity:.6,ease:'none',stagger:.02,scrollTrigger:{trigger:scFlow,start:'top 40%',end:'top 10%',scrub:true}});
        // Endpoint nodes: appear + start blinking when traces reach them
        var allNodes=scFlow.querySelectorAll('.ai-node-w,.ai-node-b');
        allNodes.forEach(function(n,i){
          var delay=.02*i;
          // Scrub-linked appear
          gsap.to(n,{opacity:1,scale:1.8,ease:'none',scrollTrigger:{trigger:scFlow,start:'top 30%',end:'top 10%',scrub:true,onEnter:function(){
            // Connection burst + blink
            gsap.fromTo(n,{scale:2.5,opacity:1},{scale:1,opacity:.8,duration:.4,ease:'elastic.out(1,.5)'});
            gsap.to(n,{opacity:.2,duration:.7+Math.random()*.5,repeat:-1,yoyo:true,ease:'sine.inOut',delay:.3+Math.random()});
          }}});
        });
        // Module cards: animate in when traces complete (section fully in view)
        var mods=scFlow.querySelectorAll('.ai-mod-card');
        mods.forEach(function(m,i){
          gsap.to(m,{opacity:1,y:-12,ease:'none',scrollTrigger:{trigger:scFlow,start:'top 20%',end:'top 5%',scrub:true}});
        });

        });

        // Spawned nodes: appear progressively
        var spawns=scFlow.querySelectorAll('.ai-spawn');
        gsap.to(spawns,{opacity:1,ease:'none',stagger:.02,scrollTrigger:{trigger:scFlow,start:'top 50%',end:'top 10%',scrub:true}});
        spawns.forEach(function(s){
          gsap.to(s,{opacity:.2,duration:.9+Math.random()*.5,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2});
        });
        // Department nodes: glow in when traces fully complete
        var deptRings=scFlow.querySelectorAll('.ai-dept');
        gsap.to(deptRings,{attr:{'fill-opacity':.12,'stroke-opacity':.8},ease:'none',stagger:.04,scrollTrigger:{trigger:scFlow,start:'top 10%',end:'top -5%',scrub:true}});
        var deptInner=scFlow.querySelectorAll('.ai-dept-inner');
        gsap.to(deptInner,{opacity:1,attr:{'fill-opacity':1},ease:'none',stagger:.04,scrollTrigger:{trigger:scFlow,start:'top 10%',end:'top -5%',scrub:true}});
        var deptLabels=scFlow.querySelectorAll('.ai-dept-label');
        gsap.to(deptLabels,{attr:{'fill-opacity':1},ease:'none',stagger:.03,scrollTrigger:{trigger:scFlow,start:'top 5%',end:'top -10%',scrub:true}});
        // Dept rings pulse
        deptRings.forEach(function(d){
          gsap.to(d,{attr:{'fill-opacity':.03,'stroke-opacity':.3},duration:1.5+Math.random()*.8,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2});
        });
        deptInner.forEach(function(d){
          gsap.to(d,{opacity:.3,duration:1+Math.random()*.6,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*1.5});
        });
      },200);

      // Parallax header elements
      hdr.querySelectorAll('h2').forEach(function(h){
        gsap.from(h,{y:30,opacity:0,ease:'none',scrollTrigger:{trigger:h,start:'top 95%',end:'top 70%',scrub:true}});
      });
      hdr.querySelectorAll('p').forEach(function(p){
        gsap.from(p,{y:20,opacity:0,ease:'none',scrollTrigger:{trigger:p,start:'top 95%',end:'top 72%',scrub:true}});
      });
    }
  }
  // Learn More CTA is now a native Webflow element in sc-header — no JS needed
  },500);
})();

// ============ 7b. SECTION-DARK-ALT (native Webflow Background Video) ============
// Video lives natively in Webflow's section-dark-alt — JS must NOT touch/remove it

// ============ 7c. HIDE PHONE NUMBER + "WE MAKE BEVERAGES" SECTION ============
// Now hidden natively via Webflow "is-hidden" combo class

// ============ 7d. FAQ COPY UPDATES ============
// All FAQ answers are now native Webflow — no JS overrides needed

// ============ 8. CONTACT PAGE ENHANCEMENTS ============
// Text, colors, backgrounds, logo inversion, and nav transparency are ALL native Webflow.
/// JS only handles: floating nav bar (UI component), 2-column form layout (DOM restructuring).
(function(){
  if(!window.location.pathname.match(/\/contact/))return;

  var h1=document.querySelector('h1');
  var sub=document.querySelector('.subtitle');

  // Floating nav bar (matching home page — UI component, not styling)
  var nav=document.createElement('div');
  document.body.appendChild(nav);
  nav.setAttribute('style','position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:0;background:rgba(20,20,20,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:50px;padding:8px 8px 8px 24px;box-shadow:0 4px 30px rgba(0,0,0,.3)');
  [['Home','/'],['About','/#about'],['Services','/#services'],['Certs','/#certifications'],['FAQ','/#faq']].forEach(function(l){
    var a=document.createElement('a');a.textContent=l[0];a.href=l[1];
    a.style.cssText='color:#ccc;text-decoration:none;padding:10px 16px;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap';
    a.onmouseover=function(){this.style.color='#fff'};a.onmouseout=function(){this.style.color='#ccc'};
    nav.appendChild(a);
  });
  var cb=document.createElement('a');cb.href='/contact';
  cb.style.cssText='color:#1A1A1A;background:#C9A84C;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px;position:relative;overflow:visible;display:inline-block';
  cb.innerHTML='<span style="position:relative;z-index:1">Contact</span>';
  var fill=document.createElement('div');
  fill.style.cssText='position:absolute;bottom:0;left:0;width:100%;height:0;background:#fff;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px';
  cb.appendChild(fill);
  cb.onmouseenter=function(){fill.style.height='100%';cb.querySelector('span').style.color='#1A1A1A'};
  cb.onmouseleave=function(){fill.style.height='0';cb.querySelector('span').style.color='#1A1A1A'};
  nav.appendChild(cb);

  // 2-column form layout (DOM restructuring — can't do natively)
  var form=document.querySelector('form');
  if(form){
    var wrapper=document.createElement('div');
    wrapper.style.cssText='max-width:1100px;margin:60px auto;padding:0 5%;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start';

    var info=document.createElement('div');
    info.innerHTML='<h2 style="font-size:2.5rem;font-weight:800;color:#fff;margin-bottom:20px;letter-spacing:-.03em">Get in Touch</h2>'+
      '<p style="font-size:1.1rem;line-height:1.7;color:#999;margin-bottom:40px">Whether you have a finished formula or a napkin sketch, we\'ll help you figure out the next step. No pressure. No minimums for your first conversation.</p>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Location</div><div style="color:#888;font-size:1rem">California, USA</div></div>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Certifications</div><div style="color:#888;font-size:.95rem">USDA Organic · SQF Level 2 · HACCP · FDA · GMP · Kosher · NSF</div></div>';

    var formWrap=document.createElement('div');
    formWrap.style.cssText='background:#0D0D0D;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.3);border:1px solid #222';
    formWrap.innerHTML='<h3 style="font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:24px">Request a Free Consultation</h3>';
    formWrap.appendChild(form);

    form.querySelectorAll('input,textarea').forEach(function(inp){
      inp.style.cssText='width:100%;padding:14px 16px;border:1px solid #ddd;border-radius:10px;font-size:1rem;font-family:Inter,sans-serif;margin-bottom:16px;background:#fff;color:#1a1a1a;transition:border-color .2s;outline:none';
      inp.onfocus=function(){this.style.borderColor='#C9A84C'};
      inp.onblur=function(){this.style.borderColor='#ddd'};
    });

    var submit=form.querySelector('[type="submit"],.w-button');
    if(submit){
      submit.style.cssText='width:100%;padding:16px;background:#C9A84C;color:#1A1A1A;border:none;border-radius:50px;font-size:1.1rem;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;margin-top:8px;position:relative;overflow:visible';
      submit.value='Send Message \u2192';
      var sf=document.createElement('div');
      sf.style.cssText='position:absolute;bottom:0;left:0;width:100%;height:0;background:#fff;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px;pointer-events:none';
      submit.style.position='relative';
      submit.appendChild(sf);
      submit.onmouseenter=function(){sf.style.height='100%'};
      submit.onmouseleave=function(){sf.style.height='0'};
    }

    wrapper.appendChild(info);
    wrapper.appendChild(formWrap);

    if(h1&&h1.parentElement){
      h1.parentElement.insertBefore(wrapper,h1.nextSibling);
      if(sub)sub.style.display='none';
    }
  }

  // H1 layout positioning only (color/font are native)
  if(h1){
    h1.style.cssText='text-align:center;font-size:3.5rem;padding:80px 5% 0';
  }
})();

})(); // end run

})(); // outer guard
