(function(){if(window._macroVersion>=16)return;window._macroVersion=16;
/* MACRO Brands — Master Site Script */
(function run(){
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);return;}

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
  var imgs=[];var loaded=0;
  function pad(n){return('0000'+n).slice(-4)}
  for(var i=1;i<=tot;i++){
    var img=new Image();img.src=base+pad(i)+'.jpg';
    img.onload=function(){loaded++;if(loaded===1)draw(0)};
    imgs.push(img);
  }
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
    var idx=Math.min(Math.floor(p*tot),tot-1);draw(idx);
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
  var links=[['Home','#'],['About','#about'],['Services','.section-dark'],['Certs','#certifications'],['FAQ','#faq']];
  links.forEach(function(l){
    var a=document.createElement('a');a.textContent=l[0];a.href=l[1];
    a.style.cssText='color:#ccc;text-decoration:none;padding:10px 16px;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap';
    a.onmouseover=function(){this.style.color='#fff'};
    a.onmouseout=function(){this.style.color='#ccc'};
    a.onclick=function(e){if(l[1].startsWith('.')||l[1].startsWith('#')){e.preventDefault();var t=l[1]==='#'?document.body:document.querySelector(l[1]);if(t)t.scrollIntoView({behavior:'smooth'})}};
    n.appendChild(a);
  });
  var cb=document.createElement('a');cb.href='/contact';
  cb.style.cssText='color:#1A1A1A;background:#C9A84C;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px;position:relative;overflow:hidden;display:inline-block';
  cb.innerHTML='<span style="position:relative;z-index:1">Contact</span>';
  // Liquid fill pseudo-element via a real div
  var fill=document.createElement('div');
  fill.style.cssText='position:absolute;bottom:0;left:0;width:100%;height:0;background:#fff;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px';
  cb.appendChild(fill);
  cb.onmouseenter=function(){fill.style.height='100%';cb.querySelector('span').style.color='#1A1A1A'};
  cb.onmouseleave=function(){fill.style.height='0';cb.querySelector('span').style.color='#1A1A1A'};
  n.appendChild(cb);

  // Inject global liquid-fill CTA style for all pages
  var ctaCSS=document.createElement('style');
  ctaCSS.textContent='.cta-liquid-fill{position:relative;overflow:hidden;display:inline-block;padding:16px 40px;border-radius:50px;font-weight:700;font-size:1.1rem;text-decoration:none;cursor:pointer;border:none;font-family:Inter,sans-serif}.cta-liquid-fill span{position:relative;z-index:1}.cta-liquid-fill .fill-bg{position:absolute;bottom:0;left:0;width:100%;height:0;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px}.cta-liquid-fill:hover .fill-bg{height:100%}.cta-gold{background:#C9A84C;color:#1A1A1A}.cta-gold .fill-bg{background:#fff}.cta-gold:hover span{color:#1A1A1A}.cta-outline{background:transparent;border:2px solid #C9A84C;color:#C9A84C}.cta-outline .fill-bg{background:#C9A84C}.cta-outline:hover span{color:#1A1A1A}';
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

  // Rename services heading
  var sd=document.querySelector('.section-dark');
  if(sd){
    var sdH2=sd.querySelector('h2');
    if(sdH2&&sdH2.textContent.match(/World Class/i))sdH2.textContent='Our Services';
  }

  // Fix "Our Services" heading legibility — make it white
  if(sd){
    var sdH2s=sd.querySelectorAll('h2');
    sdH2s.forEach(function(h){h.style.color='#fff'});
  }

  // Fix light section card titles — dark text on light backgrounds
  document.querySelectorAll('.section-light .card-title').forEach(function(el){
    el.style.color='#1a1a1a';
  });

  // Hide old services-grid (replaced by tabs)
  var oldGrid=document.querySelector('.services-grid');
  if(oldGrid)oldGrid.style.display='none';

  // Fix footer positioning
  var f=document.querySelector('.section-footer');
  if(f){f.style.position='relative';f.style.zIndex='1';f.style.top='auto'}
})();


// ============ 5b. SERVICES TAB VIEW ============
(function(){
  if(window.location.pathname.match(/\/contact/))return;
  setTimeout(function(){
  var sd=window._sdRef||document.querySelector('.section-dark');
  if(!sd)return;

  // Find or create content wrapper inside section-dark
  var cw=sd;

  // Tab data — short names with canvas animated icons
  var tabs=[
    {title:'Formulation',desc:'From kitchen recipe to production-ready formula. Our food scientists optimize your formulation for the target manufacturing process — retort, aseptic, tunnel pasteurization, or cold fill.',bullets:['Formulation optimization','Ingredient sourcing guidance','Flavor & stability profiling','Clean label solutions','Sensory evaluation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';var b=1+Math.sin(t*3)*.04;ctx.scale(b,b);ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-15,15);ctx.lineTo(15,15);ctx.lineTo(8,-20);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-8,-28);ctx.lineTo(8,-28);ctx.lineTo(8,-20);ctx.stroke();var wave=Math.sin(t*4)*3;ctx.fillStyle='#fff';ctx.globalAlpha=.15;ctx.beginPath();ctx.moveTo(-12,5+wave);ctx.quadraticCurveTo(0,1-wave,12,5+wave);ctx.lineTo(15,15);ctx.lineTo(-15,15);ctx.closePath();ctx.fill();ctx.globalAlpha=.6;for(var i=0;i<3;i++){var by=-3-((t*30+i*15)%25);ctx.beginPath();ctx.arc(-4+i*4,by,1.5,0,Math.PI*2);ctx.fill()}}},
    {title:'MicroThermic',desc:'Send us a half-gallon sample. We fill it in cans, process it through our MicroThermic or JBT Retort system, and confirm sensory and emulsion stability before you commit to production.',bullets:['MicroThermic validation','JBT Static Retort testing','Sensory & emulsion stability','High acid & low acid','Can format validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';/* Thermometer */ctx.beginPath();ctx.moveTo(-4,-26);ctx.lineTo(-4,8);ctx.arc(0,14,10,Math.PI*.8,Math.PI*.2);ctx.lineTo(4,8);ctx.lineTo(4,-26);ctx.arc(0,-26,4,0,Math.PI,true);ctx.stroke();/* Mercury rising */var mH=20+Math.sin(t*2)*8;ctx.fillStyle='#fff';ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(0,14,6,0,Math.PI*2);ctx.fill();ctx.fillRect(-2,14-mH,4,mH);/* Heat waves */ctx.globalAlpha=.4;ctx.lineWidth=1.5;for(var i=0;i<3;i++){var wx=14+i*6;var wave=Math.sin(t*4+i*1.5)*3;ctx.beginPath();ctx.moveTo(wx,0);ctx.quadraticCurveTo(wx+wave,-8,wx,-16);ctx.stroke()}}},
    {title:'Process Dev',desc:'We determine the right thermal process for your product. Scale-up from bench to pilot to production with validated parameters at every step.',bullets:['Thermal process design','Scale-up protocols','Emulsion & stability testing','Shelf life studies','Process validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.rotate(t*.8);var teeth=8,oR=20,iR=14;ctx.beginPath();for(var i=0;i<teeth;i++){var a1=i/teeth*Math.PI*2,a2=(i+.3)/teeth*Math.PI*2,a3=(i+.5)/teeth*Math.PI*2,a4=(i+.8)/teeth*Math.PI*2;if(i===0)ctx.moveTo(Math.cos(a1)*iR,Math.sin(a1)*iR);ctx.lineTo(Math.cos(a2)*oR,Math.sin(a2)*oR);ctx.lineTo(Math.cos(a3)*oR,Math.sin(a3)*oR);ctx.lineTo(Math.cos(a4)*iR,Math.sin(a4)*iR)}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff';ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill()}},
    {title:'PAL / Heat Pen',desc:'Our Process Authority (30 years experience) conducts heat penetration studies and validates your thermal process for FDA compliance. Required for all shelf-stable low-acid beverages.',bullets:['Heat penetration testing','21 CFR 113/114 compliance','Scheduled process filing','Inoculated pack studies','LACF validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';var sc=1+Math.sin(t*2)*.04;ctx.scale(sc,sc);ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(20,-16);ctx.lineTo(20,6);ctx.quadraticCurveTo(20,26,0,30);ctx.quadraticCurveTo(-20,26,-20,6);ctx.lineTo(-20,-16);ctx.closePath();ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-9,2);ctx.lineTo(-3,12);ctx.lineTo(12,-8);ctx.stroke();ctx.globalAlpha=Math.sin(t*4)*.1+.06;ctx.strokeStyle='#fff';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(20,-16);ctx.lineTo(20,6);ctx.quadraticCurveTo(20,26,0,30);ctx.quadraticCurveTo(-20,26,-20,6);ctx.lineTo(-20,-16);ctx.closePath();ctx.stroke()}},
    {title:'Scale-Up',desc:'Bridge the gap between pilot and full production. We handle packaging specs, process optimization, supply chain setup, and production scheduling to scale your product.',bullets:['Pilot to production transition','Packaging development','Supply chain coordination','Production scheduling','Launch management'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';var grow=Math.sin(t*2)*.08;ctx.beginPath();ctx.moveTo(-18,18);ctx.lineTo(-18,18-12);ctx.stroke();ctx.beginPath();ctx.moveTo(-8,18);ctx.lineTo(-8,18-22*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(2,18);ctx.lineTo(2,18-30*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(12,18);ctx.lineTo(12,18-38*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(-22,18);ctx.lineTo(18,18);ctx.stroke();ctx.fillStyle='#fff';ctx.globalAlpha=.6;var ay=-20-Math.sin(t*3)*3;ctx.beginPath();ctx.moveTo(14,ay);ctx.lineTo(18,ay+5);ctx.lineTo(10,ay+5);ctx.closePath();ctx.fill()}},
    {title:'Co-Packing',desc:'You bring the formula and materials — we handle production. Flexible co-packing for cans, bottles, and bag-in-box. Strict quality control, low MOQs, and full SQF-certified production.',bullets:['Retort canning: 12oz, 8oz, 8.4oz','Aseptic PET: 2-64oz bottles','Aseptic Bag-in-Box: 2-25L','Cold brew & tea extraction','Carbonation & nitro infusion'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineCap='round';/* Bottle outline */ctx.beginPath();ctx.moveTo(-10,22);ctx.lineTo(-12,-4);ctx.lineTo(-6,-16);ctx.lineTo(-6,-24);ctx.lineTo(6,-24);ctx.lineTo(6,-16);ctx.lineTo(12,-4);ctx.lineTo(10,22);ctx.closePath();ctx.stroke();/* Cap */ctx.fillStyle='#fff';ctx.globalAlpha=.5;ctx.fillRect(-7,-30,14,7);/* Liquid filling up */var fH=((t*20)%42);ctx.fillStyle='#fff';ctx.globalAlpha=.25;ctx.save();ctx.beginPath();ctx.rect(-12,22-fH,24,fH);ctx.clip();ctx.beginPath();ctx.moveTo(-10,22);ctx.lineTo(-12,-4);ctx.lineTo(-6,-16);ctx.lineTo(-6,-24);ctx.lineTo(6,-24);ctx.lineTo(6,-16);ctx.lineTo(12,-4);ctx.lineTo(10,22);ctx.closePath();ctx.fill();ctx.restore();/* Liquid stream from above */ctx.globalAlpha=.6;ctx.lineWidth=2;var streamY=-30-((t*40)%15);ctx.beginPath();ctx.moveTo(0,streamY);ctx.lineTo(0,-24);ctx.stroke();/* Drops */ctx.globalAlpha=.4;var dy=-30-((t*25)%20);ctx.beginPath();ctx.arc(0,dy,1.5,0,Math.PI*2);ctx.fill()}},
    {title:'Supply Chain',desc:'Autonomi AI manages your entire supply chain — from raw material procurement through finished goods logistics. 29 specialized AI agents working in real-time so nothing falls through the cracks.',bullets:['AI procurement & vendor management','Production scheduling optimization','Real-time inventory & FEFO tracking','Quality intelligence & COA automation','Logistics coordination & 3PL integration'],drawIcon:function(ctx,t){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';/* Network nodes */var nodes=[[-16,-16],[16,-16],[0,0],[-16,16],[16,16]];ctx.globalAlpha=.3;/* Connecting lines */for(var i=0;i<nodes.length;i++){for(var j=i+1;j<nodes.length;j++){ctx.beginPath();ctx.moveTo(nodes[i][0],nodes[i][1]);ctx.lineTo(nodes[j][0],nodes[j][1]);ctx.stroke()}}/* Animated pulse along lines */ctx.globalAlpha=.8;var pi=Math.floor(t*2)%5;var pj=(pi+1)%5;var pp=(t*2)%1;var px=nodes[pi][0]+(nodes[pj][0]-nodes[pi][0])*pp;var py=nodes[pi][1]+(nodes[pj][1]-nodes[pi][1])*pp;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();/* Nodes */ctx.globalAlpha=1;nodes.forEach(function(n,idx){var pulse=1+Math.sin(t*3+idx)*.15;ctx.fillStyle='#fff';ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(n[0],n[1],4*pulse,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(n[0],n[1],7*pulse,0,Math.PI*2);ctx.stroke()})}}
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
          '<h3 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">'+tab.title+'</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">'+tab.desc+'</p>'+
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;display:flex;flex-wrap:wrap;gap:4px 32px">'+
            tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        /* Bottom row: beaker left, parallax scientist right */
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">'+
          '<div id="carousel-wrap" style="border-radius:16px;overflow:hidden;background:#000;border:1px solid #222;height:380px;position:relative">'+
            '<img id="carousel-img-a" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:lighten;transition:opacity .35s ease;opacity:0" alt="Product">'+
            '<img id="carousel-img-b" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:lighten;transition:opacity .35s ease;opacity:0" alt="Product">'+
          '</div>'+
          '<div id="parallax-form-wrap" style="border-radius:16px;overflow:hidden;border:1px solid #222;height:380px;position:relative">'+
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
            /* Crossfade every 500 ms */
            setInterval(function(){
              idx=(idx+1)%urls.length;
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
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;display:flex;flex-wrap:wrap;gap:4px 32px">'+
            tab.bullets.map(function(b){return '<li style="padding:8px 0;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        /* Bottom row: photo left (sized to match caps card), capabilities right */
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;align-items:start">'+
          '<div style="border-radius:16px;overflow:hidden;background:#000;border:1px solid #222">'+
            '<div style="background:#000000;border-radius:12px;overflow:hidden;padding:6px;position:relative"><style>@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} } @keyframes scan { from{transform:translateY(-6px)} to{transform:translateY(520px)} } @keyframes fR { from{stroke-dashoffset:20} to{stroke-dashoffset:0} } @keyframes fL { from{stroke-dashoffset:0} to{stroke-dashoffset:20} } @keyframes fD { from{stroke-dashoffset:16} to{stroke-dashoffset:0} } @keyframes fU { from{stroke-dashoffset:0} to{stroke-dashoffset:16} } @keyframes rotor { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } @keyframes piston { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(.5)} } @keyframes aiGlow { 0%,100%{filter:drop-shadow(0 0 5px #fbbf24)} 50%{filter:drop-shadow(0 0 22px #fbbf24) drop-shadow(0 0 44px #fbbf2422)} } @keyframes flicker { 0%,88%,100%{opacity:1} 90%{opacity:.2} 95%{opacity:.7} } .fR { stroke-dasharray:7 5; animation:fR .75s linear infinite; } .fL { stroke-dasharray:7 5; animation:fL .75s linear infinite; } .fD { stroke-dasharray:7 5; animation:fD .75s linear infinite; } .fU { stroke-dasharray:7 5; animation:fU .75s linear infinite; } .fRs { stroke-dasharray:5 4; animation:fR 1.1s linear infinite; } .fDs { stroke-dasharray:5 4; animation:fD 1.1s linear infinite; } .fUs { stroke-dasharray:5 4; animation:fU 1.1s linear infinite; } .fCd { stroke-dasharray:5 4; animation:fD 1.2s linear infinite; } .fCu { stroke-dasharray:5 4; animation:fU 1.2s linear infinite; } .fSt { stroke-dasharray:6 4; animation:fD .65s linear infinite; } .tc { animation:flicker 6s ease-in-out infinite; } .psi { animation:flicker 7s ease-in-out 1.8s infinite; } .aiG { animation:aiGlow 2.4s ease-in-out infinite; }</style><svg viewBox="0 0 1400 470" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;"> <defs> <linearGradient id="gPre" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="#14532d"/><stop offset="100%" stop-color="#052e16"/> </linearGradient> <linearGradient id="gFin" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="#7f1d1d"/><stop offset="100%" stop-color="#3b0000"/> </linearGradient> <linearGradient id="gCool" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="rgba(255,255,255,0.14)"/><stop offset="100%" stop-color="rgba(255,255,255,0.06)"/> </linearGradient> <linearGradient id="gCond" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/><stop offset="100%" stop-color="rgba(255,255,255,0.10)"/> </linearGradient> <filter id="gO"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <filter id="gY"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> <filter id="gC"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> </defs> <!-- SECTION LABELS --> <text x="18" y="22" fill="#ffffff" font-family="JetBrains Mono" font-size="8" letter-spacing="3">DUAL PRODUCT INLET</text> <text x="18" y="98" fill="#ffffff" font-family="JetBrains Mono" font-size="8" letter-spacing="3">PRODUCT PUMP</text> <!-- ── CITY WATER SOURCE ── --> <rect x="18" y="30" width="74" height="28" rx="2" fill="#000000" stroke="#f59e0b" stroke-width="1"/> <text x="55" y="43" fill="#f59e0b" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">CITY WATER</text> <text x="55" y="53" fill="#f59e0b" font-family="JetBrains Mono" font-size="7" text-anchor="middle">SOURCE</text> <!-- Pipe right --> <line x1="92" y1="44" x2="118" y2="44" stroke="#ffffff" stroke-width="4"/> <line x1="92" y1="44" x2="118" y2="44" stroke="#f97316" fill="none" class="fR" style="animation-delay:.05s"/> <!-- Run Dry Valve --> <rect x="112" y="36" width="22" height="17" rx="2" fill="#000000" stroke="#ffffff" stroke-width="1"/> <line x1="116" y1="40" x2="130" y2="49" stroke="#f59e0b" stroke-width="1.5"/> <line x1="130" y1="40" x2="116" y2="49" stroke="#f59e0b" stroke-width="1.5"/> <text x="123" y="63" fill="#ffffff" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">RUN DRY VALVE</text> <!-- Down pipe to y=225 --> <line x1="123" y1="53" x2="123" y2="190" stroke="#0a1525" stroke-width="6"/> <line x1="123" y1="53" x2="123" y2="190" stroke="#ffffff" stroke-width="3"/> <path d="M123,53 L123,190" stroke="#f97316" fill="none" class="fD"/> <!-- ── MAIN PIPE y=225 ── --> <line x1="85" y1="225" x2="990" y2="225" stroke="#080f1e" stroke-width="9"/> <line x1="85" y1="225" x2="990" y2="225" stroke="#ffffff" stroke-width="5"/> <!-- flow segments --> <line x1="85" y1="225" x2="155" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:0s"/> <line x1="215" y1="225" x2="275" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.12s"/> <line x1="347" y1="225" x2="383" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.22s"/> <line x1="457" y1="225" x2="530" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.32s"/> <line x1="590" y1="225" x2="665" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.42s"/> <line x1="720" y1="225" x2="798" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.52s"/> <line x1="836" y1="225" x2="990" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.62s"/> <!-- ── PRODUCT PUMP ── --> <circle cx="120" cy="225" r="19" fill="#0c1828" stroke="#f97316" stroke-width="2" filter="url(#gO)"/> <g style="transform-origin:120px 225px;animation:rotor 1.3s linear infinite;"> <line x1="120" y1="213" x2="120" y2="237" stroke="#f97316" stroke-width="2.5"/> <line x1="108" y1="225" x2="132" y2="225" stroke="#f97316" stroke-width="2.5"/> <line x1="111" y1="216" x2="129" y2="234" stroke="#f97316" stroke-width="1.5" opacity=".5"/> <line x1="129" y1="216" x2="111" y2="234" stroke="#f97316" stroke-width="1.5" opacity=".5"/> </g> <text x="120" y="252" fill="#f97316" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PUMP</text> <!-- ── PREHEATER ── --> <rect x="155" y="188" width="60" height="74" rx="2" fill="url(#gPre)" stroke="#22c55e" stroke-width="1.5"/> <line x1="155" y1="262" x2="215" y2="188" stroke="#4ade80" stroke-width="2.5" opacity=".75"/> <line x1="155" y1="242" x2="205" y2="188" stroke="#4ade80" stroke-width="1.5" opacity=".45"/> <line x1="165" y1="262" x2="215" y2="212" stroke="#4ade80" stroke-width="1.5" opacity=".45"/> <text x="185" y="177" fill="#4ade80" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">PREHEATER</text> <!-- Sensors --> <g class="tc" filter="url(#gY)"> <circle cx="150" cy="178" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="150" y="182" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="psi" filter="url(#gY)" style="animation-delay:.5s"> <circle cx="220" cy="178" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="220" y="182" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PSI</text> </g> <!-- Hot water generator 1 --> <rect x="143" y="312" width="84" height="34" rx="2" fill="#000000" stroke="#ef4444" stroke-width="1"/> <text x="185" y="324" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" font-weight="700">INTERNAL HOT</text> <text x="185" y="335" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">WATER GENERATOR</text> <line x1="172" y1="262" x2="172" y2="312" stroke="#0a1525" stroke-width="4"/> <line x1="198" y1="262" x2="198" y2="312" stroke="#0a1525" stroke-width="4"/> <path d="M172,262 L172,312" stroke="#ef4444" fill="none" class="fDs" style="animation-delay:.1s"/> <path d="M198,312 L198,262" stroke="#ef4444" fill="none" class="fUs" style="animation-delay:.1s"/> <!-- ── FINAL HEATER ── --> <rect x="275" y="185" width="72" height="80" rx="2" fill="url(#gFin)" stroke="#f87171" stroke-width="1.5"/> <line x1="275" y1="265" x2="347" y2="185" stroke="#fca5a5" stroke-width="3" opacity=".8"/> <line x1="275" y1="245" x2="337" y2="185" stroke="#fca5a5" stroke-width="1.5" opacity=".45"/> <line x1="285" y1="265" x2="347" y2="205" stroke="#fca5a5" stroke-width="1.5" opacity=".45"/> <text x="311" y="174" fill="#f87171" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">FINAL HEATER</text> <g class="tc" filter="url(#gY)" style="animation-delay:.35s"> <circle cx="270" cy="175" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="270" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="tc" filter="url(#gY)" style="animation-delay:1.1s"> <circle cx="353" cy="175" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="353" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Hot water generator 2 --> <rect x="263" y="312" width="84" height="34" rx="2" fill="#000000" stroke="#ef4444" stroke-width="1"/> <text x="305" y="324" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" font-weight="700">INTERNAL HOT</text> <text x="305" y="335" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">WATER GENERATOR</text> <line x1="292" y1="265" x2="292" y2="312" stroke="#0a1525" stroke-width="4"/> <line x1="318" y1="265" x2="318" y2="312" stroke="#0a1525" stroke-width="4"/> <path d="M292,265 L292,312" stroke="#ef4444" fill="none" class="fDs" style="animation-delay:.25s"/> <path d="M318,312 L318,265" stroke="#ef4444" fill="none" class="fUs" style="animation-delay:.25s"/> <!-- ── HOLD TUBE BANK ── --> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="#080f1e" stroke-width="8"/> <path d="M383,225 L383,128 L457,128 L457,225" fill="none" stroke="#ffffff" stroke-width="5"/> <path d="M383,225 L383,128" stroke="#f97316" fill="none" class="fU" style="animation-delay:.08s"/> <path d="M383,128 L457,128" stroke="#f97316" fill="none" class="fR" style="animation-delay:.18s"/> <path d="M457,128 L457,225" stroke="#f97316" fill="none" class="fD" style="animation-delay:.28s"/> <rect x="360" y="108" width="120" height="38" rx="3" fill="#000000" stroke="#ef4444" stroke-width="2"/> <text x="420" y="124" fill="#ef4444" font-family="JetBrains Mono" font-size="9.5" text-anchor="middle" font-weight="700">HOLD TUBE BANK</text> <text x="420" y="138" fill="#ef4444" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle" opacity=".6">STERILISATION HOLD</text> <g class="tc" filter="url(#gY)" style="animation-delay:.65s"> <circle cx="463" cy="175" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="463" y="179" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- ── COOLER 1 ── --> <rect x="530" y="187" width="60" height="76" rx="2" fill="url(#gCool)" stroke="#818cf8" stroke-width="1.5"/> <line x1="530" y1="187" x2="590" y2="263" stroke="#a5b4fc" stroke-width="2.5" opacity=".8"/> <line x1="530" y1="207" x2="580" y2="263" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <line x1="540" y1="187" x2="590" y2="237" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <text x="560" y="176" fill="#818cf8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">COOLER</text> <g class="tc" filter="url(#gY)" style="animation-delay:.9s"> <circle cx="524" cy="176" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="524" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Chill flow control below C1 --> <line x1="560" y1="263" x2="560" y2="298" stroke="#0a1525" stroke-width="4"/> <path d="M560,263 L560,298" stroke="#3b82f6" fill="none" class="fCd"/> <g transform="translate(560,310)"> <polygon points="-12,-10 12,-10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="560" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle" font-weight="700">FLOW CONTROL VALVE</text> <text x="560" y="354" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- ── HOMOGENIZER ── --> <rect x="617" y="204" width="90" height="42" rx="19" fill="#080f1e" stroke="#f97316" stroke-width="1.5" filter="url(#gO)"/> <g style="transform-origin:637px 225px;animation:piston .5s ease-in-out infinite"> <rect x="631" y="211" width="8" height="28" rx="2" fill="#f97316" opacity=".85"/> </g> <g style="transform-origin:657px 225px;animation:piston .5s ease-in-out .17s infinite"> <rect x="651" y="211" width="8" height="28" rx="2" fill="#f97316" opacity=".85"/> </g> <g style="transform-origin:677px 225px;animation:piston .5s ease-in-out .34s infinite"> <rect x="671" y="211" width="8" height="28" rx="2" fill="#f97316" opacity=".85"/> </g> <text x="662" y="260" fill="#f97316" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">IN-LINE HOMOGENIZER</text> <text x="662" y="271" fill="#ffffff" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">2-STAGE · 3-PISTON · VARISPEED</text> <!-- ── COOLER 2 ── --> <rect x="720" y="187" width="60" height="76" rx="2" fill="url(#gCool)" stroke="#818cf8" stroke-width="1.5"/> <line x1="720" y1="187" x2="780" y2="263" stroke="#a5b4fc" stroke-width="2.5" opacity=".8"/> <line x1="720" y1="207" x2="770" y2="263" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <line x1="730" y1="187" x2="780" y2="237" stroke="#a5b4fc" stroke-width="1.5" opacity=".4"/> <text x="750" y="176" fill="#818cf8" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">COOLER</text> <g class="tc" filter="url(#gY)" style="animation-delay:1.2s"> <circle cx="714" cy="176" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="714" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <g class="psi" filter="url(#gY)" style="animation-delay:1.8s"> <circle cx="786" cy="176" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="786" y="180" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">PSI</text> </g> <!-- Chill flow control below C2 --> <line x1="750" y1="263" x2="750" y2="298" stroke="#0a1525" stroke-width="4"/> <path d="M750,263 L750,298" stroke="#3b82f6" fill="none" class="fCd" style="animation-delay:.3s"/> <g transform="translate(750,310)"> <polygon points="-12,-10 12,-10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="#0a1828" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="750" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle" font-weight="700">FLOW CONTROL VALVE</text> <text x="750" y="354" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- Back pressure valve --> <g transform="translate(817,225)"> <polygon points="-13,-13 13,-13 0,0" fill="#0a1828" stroke="#f97316" stroke-width="1.5"/> <polygon points="-13,13 13,13 0,0" fill="#0a1828" stroke="#f97316" stroke-width="1.5"/> </g> <text x="817" y="252" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">BACK PRESSURE</text> <text x="817" y="261" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">VALVE</text> <!-- ── CLEAN FILL HOOD ── --> <rect x="994" y="150" width="390" height="238" rx="4" fill="#000000" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="9 4"/> <text x="1189" y="410" fill="#3b82f6" font-family="JetBrains Mono" font-size="9" text-anchor="middle" letter-spacing="3" font-weight="700">CLEAN-FILL HOOD &amp; ACCUFILL</text> <!-- TC at hood entry --> <g class="tc" filter="url(#gY)" style="animation-delay:1.5s"> <circle cx="1013" cy="202" r="10" fill="#000000" stroke="#fbbf24" stroke-width="1.5"/> <text x="1013" y="206" fill="#fbbf24" font-family="JetBrains Mono" font-size="7.5" text-anchor="middle" font-weight="700">TC</text> </g> <!-- Sterile product outlet --> <rect x="1005" y="218" width="92" height="46" rx="3" fill="#000000" stroke="#22d3ee" stroke-width="1.5"/> <text x="1051" y="236" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">STERILE</text> <text x="1051" y="247" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">PRODUCT</text> <text x="1051" y="258" fill="#22d3ee" font-family="JetBrains Mono" font-size="8" text-anchor="middle" font-weight="700">OUTLET</text> <!-- Pipe inside hood: entry → sterile box → back pressure valve --> <line x1="990" y1="225" x2="1005" y2="225" stroke="#ffffff" stroke-width="5"/> <line x1="990" y1="225" x2="1005" y2="225" stroke="#f97316" fill="none" class="fR" style="animation-delay:.7s"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#0a1525" stroke-width="5"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#ffffff" stroke-width="3"/> <line x1="1097" y1="238" x2="1225" y2="238" stroke="#f97316" fill="none" class="fR" style="animation-delay:.82s"/> <!-- Back pressure valve (inside hood) --> <g transform="translate(1235,238)"> <polygon points="-12,-12 12,-12 0,0" fill="#000000" stroke="#f97316" stroke-width="1.5"/> <polygon points="-12,12 12,12 0,0" fill="#000000" stroke="#f97316" stroke-width="1.5"/> </g> <text x="1235" y="262" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">BACK PRESSURE</text> <text x="1235" y="271" fill="#f97316" font-family="JetBrains Mono" font-size="6.5" text-anchor="middle">VALVE</text> <!-- Pipe up from BPV to condenser --> <line x1="1235" y1="188" x2="1235" y2="226" stroke="#0a1525" stroke-width="5"/> <path d="M1235,188 L1235,226" stroke="#f97316" fill="none" class="fU" style="animation-delay:.9s"/> <!-- CONDENSER --> <rect x="1122" y="155" width="104" height="112" rx="3" fill="url(#gCond)" stroke="#60a5fa" stroke-width="2"/> <!-- Tube grid inside condenser --> <line x1="1132" y1="170" x2="1216" y2="170" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="181" x2="1216" y2="181" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="192" x2="1216" y2="192" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="203" x2="1216" y2="203" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="214" x2="1216" y2="214" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="225" x2="1216" y2="225" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="236" x2="1216" y2="236" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <line x1="1132" y1="247" x2="1216" y2="247" stroke="#60a5fa" stroke-width=".5" opacity=".25"/> <!-- Animated flow tubes inside condenser --> <line x1="1132" y1="175" x2="1216" y2="175" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fL" style="animation-delay:0s"/> <line x1="1132" y1="197" x2="1216" y2="197" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fR" style="animation-delay:.3s"/> <line x1="1132" y1="219" x2="1216" y2="219" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fL" style="animation-delay:.15s"/> <line x1="1132" y1="241" x2="1216" y2="241" stroke="#93c5fd" stroke-width="1.5" fill="none" class="fR" style="animation-delay:.45s"/> <text x="1174" y="283" fill="#93c5fd" font-family="JetBrains Mono" font-size="9.5" text-anchor="middle" font-weight="700">CONDENSER</text> <!-- Flow control + chill below condenser --> <line x1="1174" y1="267" x2="1174" y2="298" stroke="#0a1525" stroke-width="4"/> <path d="M1174,267 L1174,298" stroke="#3b82f6" fill="none" class="fCd" style="animation-delay:.6s"/> <g transform="translate(1174,310)"> <polygon points="-12,-10 12,-10 0,0" fill="#000000" stroke="#3b82f6" stroke-width="1.5"/> <polygon points="-12,10 12,10 0,0" fill="#000000" stroke="#3b82f6" stroke-width="1.5"/> </g> <text x="1174" y="342" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">FLOW CONTROL VALVE</text> <text x="1174" y="353" fill="#3b82f6" font-family="JetBrains Mono" font-size="7" text-anchor="middle">CHILL WATER</text> <!-- Condenser outlet pipe (right) --> <line x1="1226" y1="192" x2="1348" y2="192" stroke="#0a1525" stroke-width="4"/> <line x1="1226" y1="192" x2="1348" y2="192" stroke="#ffffff" stroke-width="2" stroke-dasharray="5 4"/> <!-- Outlet valve X --> <rect x="1332" y="183" width="22" height="18" rx="2" fill="#000000" stroke="#ffffff" stroke-width="1"/> <line x1="1336" y1="187" x2="1350" y2="197" stroke="#ffffff" stroke-width="1.5"/> <line x1="1350" y1="187" x2="1336" y2="197" stroke="#ffffff" stroke-width="1.5"/> <text x="1368" y="192" fill="#ffffff" font-family="JetBrains Mono" font-size="7.5" font-weight="700">CONDENSER</text> <text x="1368" y="203" fill="#ffffff" font-family="JetBrains Mono" font-size="7.5" font-weight="700">OUTLET</text> <!-- ── STERILE PRODUCT OUTLET DROP ── --> <line x1="1051" y1="264" x2="1051" y2="445" stroke="#041522" stroke-width="6"/> <line x1="1051" y1="264" x2="1051" y2="445" stroke="#0e4a5a" stroke-width="3"/> <path d="M1051,264 L1051,445" stroke="#22d3ee" fill="none" class="fSt" filter="url(#gC)"/> <polygon points="1051,453 1041,441 1061,441" fill="#22d3ee" filter="url(#gC)"/> <text x="1051" y="466" fill="#22d3ee" font-family="Bebas Neue,JetBrains Mono" font-size="15" text-anchor="middle" letter-spacing="6" filter="url(#gC)">STERILE PRODUCT OUTLET</text> <!-- ── LIVE READOUTS ── --> <text x="22" y="392" fill="#22c55e" font-family="JetBrains Mono" font-size="8" opacity=".7">TEMP_IN ▶ 142.4°C</text> <text x="22" y="405" fill="#3b82f6" font-family="JetBrains Mono" font-size="8" opacity=".7">CHILL_T ▶ 4.2°C</text> <text x="22" y="418" fill="#f97316" font-family="JetBrains Mono" font-size="8" opacity=".7">FLOW_RT ▶ 18.6 L/s</text> <text x="22" y="431" fill="#fbbf24" font-family="JetBrains Mono" font-size="8" opacity=".7">HOLD_TM ▶ 4.0 sec</text> <text x="22" y="444" fill="#818cf8" font-family="JetBrains Mono" font-size="8" opacity=".7">HOMO_PR ▶ 280 bar</text> <!-- Corner brackets --> <path d="M8,8 L8,26 M8,8 L26,8" fill="none" stroke="#ffffff" stroke-width="1.5"/> <path d="M1392,8 L1392,26 M1392,8 L1374,8" fill="none" stroke="#ffffff" stroke-width="1.5"/> <path d="M8,462 L8,444 M8,462 L26,462" fill="none" stroke="#ffffff" stroke-width="1.5"/> <path d="M1392,462 L1392,444 M1392,462 L1374,462" fill="none" stroke="#ffffff" stroke-width="1.5"/> </svg></div>'+
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
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
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
          '<h3 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">'+tab.title+'</h3>'+
          '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px;max-width:800px">'+tab.desc+'</p>'+
          '<ul style="list-style:none;padding:0;margin:0 0 24px 0;columns:2;column-gap:32px">'+
          tab.bullets.map(function(b){return '<li style="padding:4px 0;color:#bbb;font-size:.95rem"><span style="color:#C9A84C;margin-right:8px">✓</span>'+b+'</li>'}).join('')+
          '</ul>'+
          '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
        '</div>'+
        '<div id="pal-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">'+
          '<div style="background:transparent;border-radius:12px;padding:12px 16px 8px;border:1px solid #222;overflow:hidden">'+
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
            '<svg width="70%" viewBox="0 0 680 560" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible;margin:0 auto">'+
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
            '<rect x="228" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="228" y1="234" x2="256" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="266" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="266" y1="234" x2="294" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="326" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="326" y1="234" x2="354" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="386" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="386" y1="234" x2="414" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="424" y="222" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="424" y1="234" x2="452" y2="234" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '</g>'+
            '<g class="rsvg-fi rsvg-fi-6">'+
            '<rect x="228" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="228" y1="356" x2="256" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="266" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="266" y1="356" x2="294" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="326" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="326" y1="356" x2="354" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="386" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
            '<line x1="386" y1="356" x2="414" y2="356" stroke="#fff" stroke-width="1" stroke-opacity=".5"/>'+
            '<rect x="424" y="344" width="28" height="52" rx="3" fill="none" stroke="#fff" stroke-width="1.2" stroke-opacity=".7"/>'+
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
            '<div style="display:flex;gap:14px;margin-top:6px;flex-wrap:wrap;justify-content:center;transform:scale(.85);transform-origin:center top">'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #ff5533"></div><span style="color:#ff5533">Heat flow</span></div>'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #38bdf8"></div><span style="color:#38bdf8">Water / steam</span></div>'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:0;border-top:2px dashed #cbd5e1"></div><span style="color:#cbd5e1">Air vent</span></div>'+
            '<div style="display:flex;align-items:center;gap:6px;font-family:monospace;font-size:9px;color:rgba(255,255,255,.4);letter-spacing:1.5px;text-transform:uppercase"><div style="width:22px;height:2px;background:#fff;opacity:.35"></div>Vessel structure</div>'+
            '</div>'+
          '</div>'+
          '<div id="pal-right" style="background:transparent;border-radius:12px;padding:24px 28px;border:1px solid #222;overflow:hidden;display:flex;flex-direction:column;justify-content:center">'+
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
    } else {
    panel.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start">'+
      '<div>'+
        '<div id="icon-slot-'+i+'"></div>'+
        '<h3 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">'+tab.title+'</h3>'+
        '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px">'+tab.desc+'</p>'+
        '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C9A84C;color:#C9A84C;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C9A84C;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
      '</div>'+
      '<div style="background:#111;border-radius:16px;padding:32px;border:1px solid #222">'+
        '<div style="font-weight:700;color:#ccc;margin-bottom:16px;font-size:.95rem">What\'s Included</div>'+
        '<ul style="list-style:none;padding:0;margin:0">'+
          tab.bullets.map(function(b){return '<li style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C9A84C">✓</span> '+b+'</li>'}).join('')+
        '</ul>'+
      '</div>'+
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

  // Move native service cards into Co-Packing tab (index 5)
  var nativeGrid=document.querySelector('.services-grid');
  if(nativeGrid && panels.length>5){
    var coPackPanel=panels[5];
    var gridClone=nativeGrid;
    gridClone.style.display='grid';
    gridClone.style.gridTemplateColumns='repeat(3,1fr)';
    gridClone.style.gap='24px';
    gridClone.style.marginTop='40px';
    gridClone.style.paddingTop='40px';
    gridClone.style.borderTop='1px solid #222';
    gridClone.querySelectorAll('.service-card').forEach(function(c){c.style.display='block'});
    // Find the grid wrapper inside co-pack panel (after the 2-col layout)
    coPackPanel.appendChild(gridClone);
  }


  // Add fadeIn animation
  var style=document.createElement('style');
  style.textContent='@keyframes tabFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);

  cw.appendChild(tabWrap);
  },500);
})();

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

    // Native Webflow beaker + bulb — fade in from left on scroll, behind text
    var beaker=document.getElementById('parallax-beaker');
    var bulb=document.getElementById('parallax-bulb');
    // Beaker + bulb — full-width overlays, same canvas as original photo, behind text (z:0)
    if(beaker){
      beaker.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center 80%;z-index:0;pointer-events:none';
    }
    if(bulb){
      bulb.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center 80%;z-index:0;pointer-events:none';
    }
    // Beaker slides full canvas in from left — completes at 100vh
    if(beaker&&hasGsap){gsap.fromTo(beaker,{x:'-100%',opacity:0},{x:'0%',opacity:1,ease:'power2.out',scrollTrigger:{trigger:sec,start:'top bottom',end:'top top',scrub:true}})}
    // Bulb slides full canvas in from left — starts later, completes at 100vh
    if(bulb&&hasGsap){gsap.fromTo(bulb,{x:'-100%',opacity:0},{x:'0%',opacity:1,ease:'power2.out',scrollTrigger:{trigger:sec,start:'top 70%',end:'top top',scrub:true}})}

    // Apple parallax on content sections
    var sects=document.querySelectorAll('[id=who-we-serve],[id=about],[id=team],[id=certifications],[id=process-dev],[id=faq],[id=contact-cta],.section-dark,.section-light,.section-dark-alt');
    if(hasGsap)sects.forEach(function(sec2){
      if(sec2.closest('.video-hero-wrap'))return;
      sec2.querySelectorAll('h2').forEach(function(h){
        gsap.fromTo(h,{y:80,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 90%',end:'top 50%',scrub:.8}});
      });
      sec2.querySelectorAll('p').forEach(function(p){
        gsap.fromTo(p,{y:50,opacity:0},{y:0,opacity:1,duration:1,ease:'power2.out',scrollTrigger:{trigger:p,start:'top 92%',end:'top 60%',scrub:.6}});
      });
      sec2.querySelectorAll('.card-light,.service-card').forEach(function(c){
        gsap.fromTo(c,{y:100,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 95%',end:'top 55%',scrub:.5}});
        c.style.transition='transform .3s,box-shadow .3s';
        c.onmouseenter=function(){this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 48px rgba(0,0,0,.1)'};
        c.onmouseleave=function(){this.style.transform='';this.style.boxShadow=''};
      });
    });
  },1000);
})();

// ============ 7. SUPPLY CHAIN AI SECTION FIX ============
(function(){
  setTimeout(function(){
  var sec=document.getElementById('autonomi-ai');
  if(!sec)return;
  // Section layout: header text on top, video below
  sec.style.cssText='position:relative;overflow:hidden;background:#000';
  // Style header content — above the video
  var hdr=sec.querySelector('.sc-header');
  if(hdr){
    hdr.style.cssText='position:relative;z-index:2;text-align:center;max-width:800px;margin:0 auto;padding:80px 40px 60px';
    hdr.querySelectorAll('h2').forEach(function(h){h.style.cssText='font-size:clamp(2.5rem,5vw,4rem);font-weight:800;color:#fff;margin:16px 0';if(h.textContent.trim()==='Supply Chain AI')h.textContent='Agentic Supply Chain'});
    hdr.querySelectorAll('p').forEach(function(p){p.style.cssText='font-size:1.1rem;color:rgba(255,255,255,0.75);line-height:1.7;max-width:600px;margin:0 auto'});
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
    nativeVid.style.cssText='position:relative !important;z-index:0 !important;width:100% !important;height:auto !important;display:block !important;top:0 !important;left:0 !important;right:auto !important;bottom:auto !important;min-width:0 !important;min-height:0 !important';
    vidWrap=nativeVid.closest('.w-background-video')||nativeVid.parentElement;
    vidWrap.style.cssText='position:relative;width:100%;overflow:visible;height:auto';
  } else {
    vidWrap=document.createElement('div');
    vidWrap.style.cssText='position:relative;width:100%;overflow:hidden';
    scVid=document.createElement('video');
    scVid.src='https://lynz-tonomi.github.io/macrobrands/schero-web.mp4';
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
  // CTA button pinned to center bottom of video — liquid fill like Contact pill
  var ctaWrap=document.createElement('div');
  ctaWrap.style.cssText='position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:2;display:flex;align-items:center';
  var cta=document.createElement('a');
  cta.href='https://autonomi.dev';
  cta.target='_blank';
  cta.className='cta-liquid-fill cta-gold';
  cta.style.cssText='text-decoration:none;letter-spacing:.02em;font-size:17.6px';
  var ctaSpan=document.createElement('span');
  ctaSpan.textContent='Learn More';
  ctaSpan.style.cssText='position:relative;z-index:1';
  cta.appendChild(ctaSpan);
  var ctaFill=document.createElement('div');
  ctaFill.className='fill-bg';
  cta.appendChild(ctaFill);
  ctaWrap.appendChild(cta);
  if(vidWrap){
    // Append CTA to vidWrap — do NOT remove any native Webflow elements
    vidWrap.style.position='relative';
    vidWrap.appendChild(ctaWrap);
  }
  },500);
})();

// ============ 7b. SECTION-DARK-ALT (native Webflow Background Video) ============
// Video lives natively in Webflow's section-dark-alt — JS must NOT touch/remove it

// ============ 8. CONTACT PAGE ENHANCEMENTS ============
(function(){
  // Only run on /contact page
  if(!window.location.pathname.match(/\/contact/))return;

  // Update heading text
  var h1=document.querySelector('h1');
  if(h1)h1.textContent="Let's Build Your Beverage";

  // Update subtitle
  var sub=document.querySelector('.subtitle');
  if(sub)sub.textContent="Tell us about your product and we'll get back to you within 24 hours.";

  // Style the page — match home screen dark theme
  var body=document.body;
  body.style.background='#000';
  body.style.color='#fff';
  body.style.fontFamily='Inter,Helvetica Neue,Arial,sans-serif';

  // Match home page navbar: move nav-logo out of fixed-nav, make transparent
  var existingLogo=document.querySelector('.fixed-nav .nav-logo');
  if(existingLogo){document.body.appendChild(existingLogo)}
  document.querySelectorAll('.fixed-nav').forEach(function(el){el.style.display='none'});
  var nl=document.querySelector('.nav-logo');
  if(nl){
    nl.setAttribute('style','height:auto;width:180px;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9998;opacity:1;filter:brightness(0);background:transparent');
  }
  // White topbar
  var topbar=document.createElement('div');
  topbar.style.cssText='position:fixed;top:0;left:0;width:100%;height:60px;background:#fff;z-index:9997;box-shadow:0 1px 8px rgba(0,0,0,.08)';

  // Add floating nav bar (matching home page)
  var nav=document.createElement('div');
  document.body.appendChild(nav);
  nav.setAttribute('style','position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:0;background:rgba(20,20,20,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:50px;padding:8px 8px 8px 24px;box-shadow:0 4px 30px rgba(0,0,0,.3)');
  [['Home','/'],['Services','/#services'],['About','/#about'],['FAQ','/#faq']].forEach(function(l){
    var a=document.createElement('a');a.textContent=l[0];a.href=l[1];
    a.style.cssText='color:#ccc;text-decoration:none;padding:10px 16px;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap';
    a.onmouseover=function(){this.style.color='#fff'};a.onmouseout=function(){this.style.color='#ccc'};
    nav.appendChild(a);
  });
  var cb=document.createElement('a');cb.textContent='Contact';cb.href='/contact';
  cb.style.cssText='color:#1A1A1A;background:#C9A84C;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px';
  nav.appendChild(cb);

  // Find the form
  var form=document.querySelector('form');
  if(form){
    var formParent=form.parentElement;

    // Create a 2-column layout: info on left, form on right
    var wrapper=document.createElement('div');
    wrapper.style.cssText='max-width:1100px;margin:60px auto;padding:0 5%;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start';

    // Left column: contact info
    var info=document.createElement('div');
    info.innerHTML='<h2 style="font-size:2.5rem;font-weight:800;color:#fff;margin-bottom:20px;letter-spacing:-.03em">Get in Touch</h2>'+
      '<p style="font-size:1.1rem;line-height:1.7;color:#999;margin-bottom:40px">Whether you have a finished formula or a napkin sketch, we\'ll help you figure out the next step. No pressure. No minimums for your first conversation.</p>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Location</div><div style="color:#888;font-size:1rem">California, USA</div></div>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Certifications</div><div style="color:#888;font-size:.95rem">USDA Organic · SQF Level 2 · HACCP · FDA · GMP · Kosher · NSF</div></div>';

    // Right column: styled form
    var formWrap=document.createElement('div');
    formWrap.style.cssText='background:#111;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.3);border:1px solid #222';
    formWrap.innerHTML='<h3 style="font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:24px">Request a Free Consultation</h3>';
    formWrap.appendChild(form);

    // Style form inputs
    form.querySelectorAll('input,textarea').forEach(function(inp){
      inp.style.cssText='width:100%;padding:14px 16px;border:1px solid #ddd;border-radius:10px;font-size:1rem;font-family:Inter,sans-serif;margin-bottom:16px;background:#fff;color:#1a1a1a;transition:border-color .2s;outline:none';
      inp.onfocus=function(){this.style.borderColor='#C9A84C'};
      inp.onblur=function(){this.style.borderColor='#ddd'};
    });

    // Style submit button with liquid fill
    var submit=form.querySelector('[type="submit"],.w-button');
    if(submit){
      submit.style.cssText='width:100%;padding:16px;background:#C9A84C;color:#1A1A1A;border:none;border-radius:50px;font-size:1.1rem;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;margin-top:8px;position:relative;overflow:hidden';
      submit.value='Send Message →';
      var sf=document.createElement('div');
      sf.style.cssText='position:absolute;bottom:0;left:0;width:100%;height:0;background:#fff;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px;pointer-events:none';
      submit.style.position='relative';
      submit.appendChild(sf);
      submit.onmouseenter=function(){sf.style.height='100%'};
      submit.onmouseleave=function(){sf.style.height='0'};
    }

    wrapper.appendChild(info);
    wrapper.appendChild(formWrap);

    // Insert wrapper after the h1
    if(h1&&h1.parentElement){
      h1.parentElement.insertBefore(wrapper,h1.nextSibling);
      // Hide old subtitle since we have new layout
      if(sub)sub.style.display='none';
    }
  }

  // Style h1
  if(h1){
    h1.style.cssText='text-align:center;font-size:3.5rem;font-weight:800;color:#fff;padding:80px 5% 0;letter-spacing:-.03em;font-family:Inter,sans-serif';
  }

  // Hide old background image
  var bgImg=document.querySelector('.heading-18');
  if(bgImg){var imgParent=bgImg.closest('div');if(imgParent)imgParent.style.background='none'}
  document.querySelectorAll('img[alt="__wf_reserved_inherit"]').forEach(function(img){
    if(img.closest('form'))return;
    img.style.display='none';
  });
})();

})(); // end run

})(); // outer guard