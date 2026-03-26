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
  var base='https://cdn.jsdelivr.net/gh/lynz-tonomi/macrobrands@4744ca9a/frames/frame_';
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
      if(nl)nl.style.opacity='1';
      if(fn){fn.style.opacity='1';fn.style.transform='translateX(-50%) translateY(0)'}
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
    if(nl){
      var logoY=nl.getBoundingClientRect().top+nl.offsetHeight/2;
      var light=isOverLight(logoY);
      nl.style.filter=light?'brightness(0)':'brightness(0) invert(1)';
      nl.style.transition='filter .3s';
    }
    if(fn){
      var navY=fn.getBoundingClientRect().top;
      var navLight=isOverLight(navY);
      fn.style.background=navLight?'rgba(255,255,255,.85)':'rgba(20,20,20,.9)';
      fn.style.transition='background .3s';
      fn.querySelectorAll('a:not([href="/contact"])').forEach(function(a){a.style.color=navLight?'#333':'#ccc'});
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
    {text:'Extraction',start:.15,end:.40},
    {text:'Formulation',start:.35,end:.58},
    {text:'Transformation',start:.53,end:.75},
    {text:'Infusion',start:.80,end:.94}
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
  var links=[['Home','#'],['Services','.section-dark'],['About','#about'],['Certs','#certifications'],['FAQ','#faq']];
  links.forEach(function(l){
    var a=document.createElement('a');a.textContent=l[0];a.href=l[1];
    a.style.cssText='color:#ccc;text-decoration:none;padding:10px 16px;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap';
    a.onmouseover=function(){this.style.color='#fff'};
    a.onmouseout=function(){this.style.color='#ccc'};
    a.onclick=function(e){if(l[1].startsWith('.')||l[1].startsWith('#')){e.preventDefault();var t=l[1]==='#'?document.body:document.querySelector(l[1]);if(t)t.scrollIntoView({behavior:'smooth'})}};
    n.appendChild(a);
  });
  var cb=document.createElement('a');cb.href='/contact';
  cb.style.cssText='color:#1A1A1A;background:#C4A35A;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px;position:relative;overflow:hidden;display:inline-block';
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
  ctaCSS.textContent='.cta-liquid-fill{position:relative;overflow:hidden;display:inline-block;padding:16px 40px;border-radius:50px;font-weight:700;font-size:1.1rem;text-decoration:none;cursor:pointer;border:none;font-family:Inter,sans-serif}.cta-liquid-fill span{position:relative;z-index:1}.cta-liquid-fill .fill-bg{position:absolute;bottom:0;left:0;width:100%;height:0;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px}.cta-liquid-fill:hover .fill-bg{height:100%}.cta-gold{background:#C4A35A;color:#1A1A1A}.cta-gold .fill-bg{background:#fff}.cta-gold:hover span{color:#1A1A1A}.cta-outline{background:transparent;border:2px solid #C4A35A;color:#C4A35A}.cta-outline .fill-bg{background:#C4A35A}.cta-outline:hover span{color:#1A1A1A}';
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

// ============ 5. PAGE INIT (reorder sections, theme) ============
(function(){
  var vm=document.querySelector('.video-hero-media');if(vm)vm.style.display='none';
  var sd=document.querySelector('.section-dark');
  if(sd){
    sd.style.background='#000';sd.style.color='#fff';
    sd.querySelectorAll('h2,h3,.section-heading,.service-title').forEach(function(h){h.style.color='#fff'});
    sd.querySelectorAll('.service-card').forEach(function(c){c.style.background='#111';c.style.border='1px solid #222';c.style.color='#ccc'});
    // Rename heading
    var sdH2=sd.querySelector('h2');
    if(sdH2&&sdH2.textContent.match(/World Class/i))sdH2.textContent='Our Services';
  }
  var b=document.body;var f=b.querySelector('.section-footer');
  // Fix footer: remove sticky positioning
  if(f){f.style.position='relative';f.style.zIndex='1';f.style.top='auto'}
  var c2=b.querySelector('.cta-section');if(c2)c2.style.display='none';
  // Move parallax section right after the video hero wrap
  var heroWrap=b.querySelector('.video-hero-wrap');
  var plx=document.getElementById('parallax-hero');
  if(heroWrap&&plx&&heroWrap.nextSibling){b.insertBefore(plx,heroWrap.nextSibling)}
  var ids=['who-we-serve','how-it-works','about','team','certifications','process-dev','faq','contact-cta'];
  if(f){ids.forEach(function(id){var el=document.getElementById(id);if(el)b.insertBefore(el,f)});
    var ex=document.querySelectorAll('.section-light:not([id])');ex.forEach(function(el){b.insertBefore(el,f)});
  }
  // Move footer to absolute last position
  if(f){b.appendChild(f)}

  // Replace "Products We Manufacture" or add Autonomi AI section
  // Find and hide any existing "products" section
  document.querySelectorAll('h2').forEach(function(h){
    if(h.textContent.match(/Products We|We Make Beverages/i)){
      var sec=h.closest('section')||h.closest('[id]')||h.parentElement.parentElement;
      if(sec)sec.style.display='none';
    }
  });

  // Create Autonomi AI Supply Chain section
  var aiSec=document.createElement('section');
  aiSec.id='autonomi-ai';
  aiSec.setAttribute('style','background:#000;color:#fff;padding:100px 5%;font-family:Inter,sans-serif');
  aiSec.innerHTML='<div style="max-width:1200px;margin:0 auto">'+
    '<div style="text-align:center;margin-bottom:60px">'+
      '<div style="display:inline-block;padding:6px 16px;border-radius:50px;border:1px solid #C4A35A;color:#C4A35A;font-size:.8rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:20px">Powered by AI</div>'+
      '<h2 style="font-size:clamp(2rem,4vw,3.2rem);font-weight:800;letter-spacing:-.03em;margin-bottom:16px">Supply Chain AI</h2>'+
      '<p style="color:#888;font-size:1.1rem;max-width:640px;margin:0 auto;line-height:1.7">Autonomi is our proprietary AI platform that manages every stage of beverage production — from raw material procurement through finished goods logistics. 29 specialized AI agents working together so nothing falls through the cracks.</p>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:48px">'+
      '<div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">'+
        '<div style="font-size:1.5rem;margin-bottom:12px">🔗</div>'+
        '<h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px">Procurement Agent</h3>'+
        '<p style="color:#888;font-size:.9rem;line-height:1.6">Automated PO generation, vendor scoring, price tracking, and lead time optimization. Monitors 200+ ingredient suppliers in real-time.</p>'+
      '</div>'+
      '<div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">'+
        '<div style="font-size:1.5rem;margin-bottom:12px">📊</div>'+
        '<h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px">Production Scheduler</h3>'+
        '<p style="color:#888;font-size:.9rem;line-height:1.6">AI-optimized production scheduling across retort, aseptic, and cold brew lines. Minimizes changeover time and maximizes OEE.</p>'+
      '</div>'+
      '<div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">'+
        '<div style="font-size:1.5rem;margin-bottom:12px">🔬</div>'+
        '<h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px">Quality Intelligence</h3>'+
        '<p style="color:#888;font-size:.9rem;line-height:1.6">Real-time QC monitoring, automated COA generation, deviation detection, and CAPA tracking. SQF audit-ready documentation at all times.</p>'+
      '</div>'+
      '<div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">'+
        '<div style="font-size:1.5rem;margin-bottom:12px">📦</div>'+
        '<h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px">Inventory & FEFO</h3>'+
        '<p style="color:#888;font-size:.9rem;line-height:1.6">First-Expired-First-Out tracking, safety stock alerts, shelf life monitoring, and automated reorder triggers across all SKUs.</p>'+
      '</div>'+
      '<div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">'+
        '<div style="font-size:1.5rem;margin-bottom:12px">🚚</div>'+
        '<h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px">Logistics Coordinator</h3>'+
        '<p style="color:#888;font-size:.9rem;line-height:1.6">Carrier selection, shipment tracking, BOL generation, and delivery confirmation. Integrated with major 3PLs and freight platforms.</p>'+
      '</div>'+
      '<div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px">'+
        '<div style="font-size:1.5rem;margin-bottom:12px">📈</div>'+
        '<h3 style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:8px">Demand Forecasting</h3>'+
        '<p style="color:#888;font-size:.9rem;line-height:1.6">ML-powered demand prediction, seasonal planning, and S&OP intelligence. Reduces overstock by 30% and stockouts by 85%.</p>'+
      '</div>'+
    '</div>'+
    '<div style="text-align:center">'+
      '<p style="color:#666;font-size:.9rem;margin-bottom:20px">29 AI agents · Real-time visibility · Zero manual data entry</p>'+
      '<a href="/contact" style="display:inline-block;padding:14px 36px;border-radius:50px;border:1.5px solid #C4A35A;color:#C4A35A;text-decoration:none;font-weight:700;font-size:.95rem;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Learn More About Autonomi →</span><div style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C4A35A;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px" class="fill-bg"></div></a>'+
    '</div>'+
  '</div>';

  // Insert after services section (section-dark) or before who-we-serve
  var whoServe=document.getElementById('who-we-serve');
  if(whoServe){b.insertBefore(aiSec,whoServe)}
  else if(sd&&sd.nextSibling){b.insertBefore(aiSec,sd.nextSibling)}

  // Wire up the liquid fill on the CTA
  setTimeout(function(){
    var aiCta=aiSec.querySelector('a[href="/contact"]');
    if(aiCta){
      var fb=aiCta.querySelector('.fill-bg');
      if(fb){aiCta.onmouseenter=function(){fb.style.height='100%';aiCta.querySelector('span').style.color='#1A1A1A'};aiCta.onmouseleave=function(){fb.style.height='0';aiCta.querySelector('span').style.color='#C4A35A'}}
    }
  },100);

  // Upgrade all CTA buttons to liquid-fill
  document.querySelectorAll('.cta-button,a[href="/contact"].get-started-link,.button-primary-2').forEach(function(btn){
    btn.style.cssText+='position:relative;overflow:hidden;border-radius:50px;';
    var existingText=btn.textContent;
    btn.innerHTML='<span style="position:relative;z-index:1">'+existingText+'</span>';
    var bf=document.createElement('div');
    bf.style.cssText='position:absolute;bottom:0;left:0;width:100%;height:0;background:#fff;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px;pointer-events:none';
    btn.appendChild(bf);
    btn.onmouseenter=function(){bf.style.height='100%'};
    btn.onmouseleave=function(){bf.style.height='0'};
  });
})();

// ============ 5b. SERVICES TAB VIEW ============
(function(){
  if(window.location.pathname.match(/\/contact/))return;
  var sd=document.querySelector('.section-dark');
  if(!sd)return;

  // Hide old service cards grid
  sd.querySelectorAll('.services-grid,.grid-3col').forEach(function(g){g.style.display='none'});
  // Also hide old individual service cards
  sd.querySelectorAll('.service-card').forEach(function(c){c.style.display='none'});

  // Find or create content wrapper inside section-dark
  var cw=sd.querySelector('.content-wrapper')||sd;

  // Tab data — short names with canvas animated icons
  var tabs=[
    {title:'Formulation',desc:'From kitchen recipe to production-ready formula. Our food scientists optimize your formulation for the target manufacturing process — retort, aseptic, tunnel pasteurization, or cold fill.',bullets:['Formulation optimization','Ingredient sourcing guidance','Flavor & stability profiling','Clean label solutions','Sensory evaluation'],drawIcon:function(ctx,t){ctx.strokeStyle='#C4A35A';ctx.lineWidth=2.5;ctx.lineCap='round';var b=1+Math.sin(t*3)*.04;ctx.scale(b,b);ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-15,15);ctx.lineTo(15,15);ctx.lineTo(8,-20);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-8,-28);ctx.lineTo(8,-28);ctx.lineTo(8,-20);ctx.stroke();var wave=Math.sin(t*4)*3;ctx.fillStyle='#C4A35A';ctx.globalAlpha=.15;ctx.beginPath();ctx.moveTo(-12,5+wave);ctx.quadraticCurveTo(0,1-wave,12,5+wave);ctx.lineTo(15,15);ctx.lineTo(-15,15);ctx.closePath();ctx.fill();ctx.globalAlpha=.6;for(var i=0;i<3;i++){var by=-3-((t*30+i*15)%25);ctx.beginPath();ctx.arc(-4+i*4,by,1.5,0,Math.PI*2);ctx.fill()}}},
    {title:'MicroThermic',desc:'Send us a half-gallon sample. We fill it in cans, process it through our MicroThermic or JBT Retort system, and confirm sensory and emulsion stability before you commit to production.',bullets:['MicroThermic validation','JBT Static Retort testing','Sensory & emulsion stability','High acid & low acid','Can format validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#C4A35A';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(-8,-8);ctx.lineTo(-18,-8);ctx.lineTo(-6,4);ctx.lineTo(-10,20);ctx.lineTo(0,12);ctx.lineTo(10,20);ctx.lineTo(6,4);ctx.lineTo(18,-8);ctx.lineTo(8,-8);ctx.closePath();ctx.stroke();ctx.fillStyle='#C4A35A';ctx.globalAlpha=Math.sin(t*5)*.15+.1;ctx.fill();var pulse=Math.sin(t*6)*.3+.3;ctx.globalAlpha=pulse*.2;ctx.beginPath();ctx.arc(0,0,22+Math.sin(t*4)*4,0,Math.PI*2);ctx.fill()}},
    {title:'Process Dev',desc:'We determine the right thermal process for your product. Scale-up from bench to pilot to production with validated parameters at every step.',bullets:['Thermal process design','Scale-up protocols','Emulsion & stability testing','Shelf life studies','Process validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#C4A35A';ctx.lineWidth=2.5;ctx.rotate(t*.8);var teeth=8,oR=20,iR=14;ctx.beginPath();for(var i=0;i<teeth;i++){var a1=i/teeth*Math.PI*2,a2=(i+.3)/teeth*Math.PI*2,a3=(i+.5)/teeth*Math.PI*2,a4=(i+.8)/teeth*Math.PI*2;if(i===0)ctx.moveTo(Math.cos(a1)*iR,Math.sin(a1)*iR);ctx.lineTo(Math.cos(a2)*oR,Math.sin(a2)*oR);ctx.lineTo(Math.cos(a3)*oR,Math.sin(a3)*oR);ctx.lineTo(Math.cos(a4)*iR,Math.sin(a4)*iR)}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#C4A35A';ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill()}},
    {title:'PAL / Heat Pen',desc:'Our Process Authority (30 years experience) conducts heat penetration studies and validates your thermal process for FDA compliance. Required for all shelf-stable low-acid beverages.',bullets:['Heat penetration testing','21 CFR 113/114 compliance','Scheduled process filing','Inoculated pack studies','LACF validation'],drawIcon:function(ctx,t){ctx.strokeStyle='#C4A35A';ctx.lineWidth=2.5;ctx.lineCap='round';var sc=1+Math.sin(t*2)*.04;ctx.scale(sc,sc);ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(20,-16);ctx.lineTo(20,6);ctx.quadraticCurveTo(20,26,0,30);ctx.quadraticCurveTo(-20,26,-20,6);ctx.lineTo(-20,-16);ctx.closePath();ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-9,2);ctx.lineTo(-3,12);ctx.lineTo(12,-8);ctx.stroke();ctx.globalAlpha=Math.sin(t*4)*.1+.06;ctx.strokeStyle='#C4A35A';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(20,-16);ctx.lineTo(20,6);ctx.quadraticCurveTo(20,26,0,30);ctx.quadraticCurveTo(-20,26,-20,6);ctx.lineTo(-20,-16);ctx.closePath();ctx.stroke()}},
    {title:'Scale-Up',desc:'Bridge the gap between pilot and full production. We handle packaging specs, process optimization, supply chain setup, and production scheduling to scale your product.',bullets:['Pilot to production transition','Packaging development','Supply chain coordination','Production scheduling','Launch management'],drawIcon:function(ctx,t){ctx.strokeStyle='#C4A35A';ctx.lineWidth=2.5;ctx.lineCap='round';var grow=Math.sin(t*2)*.08;ctx.beginPath();ctx.moveTo(-18,18);ctx.lineTo(-18,18-12);ctx.stroke();ctx.beginPath();ctx.moveTo(-8,18);ctx.lineTo(-8,18-22*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(2,18);ctx.lineTo(2,18-30*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(12,18);ctx.lineTo(12,18-38*(1+grow));ctx.stroke();ctx.beginPath();ctx.moveTo(-22,18);ctx.lineTo(18,18);ctx.stroke();ctx.fillStyle='#C4A35A';ctx.globalAlpha=.6;var ay=-20-Math.sin(t*3)*3;ctx.beginPath();ctx.moveTo(14,ay);ctx.lineTo(18,ay+5);ctx.lineTo(10,ay+5);ctx.closePath();ctx.fill()}},
    {title:'Co-Packing',desc:'You bring the formula and materials — we handle production. Flexible co-packing for cans, bottles, and bag-in-box. Strict quality control, low MOQs, and full SQF-certified production.',bullets:['Retort canning: 12oz, 8oz, 8.4oz','Aseptic PET: 2-64oz bottles','Aseptic Bag-in-Box: 2-25L','Cold brew & tea extraction','Carbonation & nitro infusion'],drawIcon:function(ctx,t){ctx.strokeStyle='#C4A35A';ctx.lineWidth=2.5;ctx.lineCap='round';var tilt=Math.sin(t*2)*.04;ctx.rotate(tilt);ctx.strokeRect(-16,-14,32,32);ctx.beginPath();ctx.moveTo(-16,-14);ctx.lineTo(-8,-24);ctx.lineTo(24,-24);ctx.lineTo(16,-14);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(16,-14);ctx.lineTo(24,-24);ctx.lineTo(24,4);ctx.lineTo(16,18);ctx.closePath();ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-8,2);ctx.lineTo(-2,8);ctx.lineTo(8,-2);ctx.stroke()}}
  ];

  // Build tab container
  var tabWrap=document.createElement('div');
  tabWrap.style.cssText='margin-top:40px';

  // Tab buttons row
  var tabRow=document.createElement('div');
  tabRow.style.cssText='display:flex;gap:4px;flex-wrap:wrap;margin-bottom:32px;border-bottom:1px solid #222;padding-bottom:0';
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
    btn.style.cssText='padding:12px 20px;background:transparent;color:#666;border:none;border-bottom:2px solid transparent;font-size:.9rem;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;transition:all .3s;white-space:nowrap';
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

    panel.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start">'+
      '<div>'+
        '<div id="icon-slot-'+i+'"></div>'+
        '<h3 style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em">'+tab.title+'</h3>'+
        '<p style="font-size:1.05rem;line-height:1.7;color:#999;margin-bottom:24px">'+tab.desc+'</p>'+
        '<a href="/contact" class="cta-liquid-fill cta-outline" style="padding:12px 28px;font-size:.9rem;border-radius:50px;border:1.5px solid #C4A35A;color:#C4A35A;background:transparent;text-decoration:none;display:inline-block;position:relative;overflow:hidden"><span style="position:relative;z-index:1">Get Started →</span><div class="fill-bg" style="position:absolute;bottom:0;left:0;width:100%;height:0;background:#C4A35A;transition:height .4s cubic-bezier(.4,0,.2,1);z-index:0;border-radius:50px"></div></a>'+
      '</div>'+
      '<div style="background:#111;border-radius:16px;padding:32px;border:1px solid #222">'+
        '<div style="font-weight:700;color:#ccc;margin-bottom:16px;font-size:.95rem">What\'s Included</div>'+
        '<ul style="list-style:none;padding:0;margin:0">'+
          tab.bullets.map(function(b){return '<li style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#999;font-size:.95rem;display:flex;align-items:center;gap:10px"><span style="color:#C4A35A">✓</span> '+b+'</li>'}).join('')+
        '</ul>'+
      '</div>'+
    '</div>';
    tabContent.appendChild(panel);
    panels.push(panel);

    // Insert canvas into icon slot
    var slot=panel.querySelector('#icon-slot-'+i);
    if(slot)slot.appendChild(iconCanvas);

    // Click handler
    btn.onclick=function(){
      buttons.forEach(function(b){b.style.color='#666';b.style.borderBottomColor='transparent'});
      panels.forEach(function(p){p.style.display='none';var cv=p.querySelector('canvas');if(cv)cv._active=false});
      btn.style.color='#fff';
      btn.style.borderBottomColor='#C4A35A';
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
        if(fb){a.onmouseenter=function(){fb.style.height='100%';a.querySelector('span').style.color='#1A1A1A'};a.onmouseleave=function(){fb.style.height='0';a.querySelector('span').style.color='#C4A35A'}}
      });
    };

    btn.onmouseenter=function(){if(btn.style.color!=='rgb(255, 255, 255)')btn.style.color='#ccc'};
    btn.onmouseleave=function(){if(btn.style.color!=='rgb(255, 255, 255)')btn.style.color='#666'};
  });

  // Activate first tab
  buttons[0].onclick();

  // Add fadeIn animation
  var style=document.createElement('style');
  style.textContent='@keyframes tabFadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);

  cw.appendChild(tabWrap);
})();

// ============ 6. DUAL TEXT OUTLINE PARALLAX ============
(function(){
  setTimeout(function(){
    if(typeof gsap==='undefined')return;
    gsap.registerPlugin(ScrollTrigger);
    var sec=document.getElementById('parallax-hero');
    if(!sec)return;
    // Remove ALL old text elements (Webflow-created h2s and any previous JS text)
    sec.querySelectorAll('[data-parallax]').forEach(function(el){el.remove()});
    sec.querySelectorAll('.parallax-text-back,.parallax-text-front').forEach(function(el){el.remove()});
    sec.querySelectorAll('h2').forEach(function(el){el.remove()});
    // Remove any previous JS-created rows
    sec.querySelectorAll('[data-row]').forEach(function(el){el.remove()});

    // Remove placeholder text from parallax-img div
    var img=document.getElementById('parallax-img');
    if(img){
      img.style.zIndex='2';
      img.style.position='relative';
      img.style.height='130vh';
      img.style.maxWidth='100%';
      img.style.maxHeight='none';
      // Remove placeholder paragraph
      var ph=img.querySelector('p,.section-subhead');
      if(ph)ph.remove();
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
    var r1=makeRow('FROM CONCEPT','30%','top',0.69);
    r1.wrap.setAttribute('data-row','1');
    // Row 2: "TO COMMERCIALIZATION" — full width, starts centered, scrolls LEFT, IN FRONT of bottle
    var r2=makeRow('TO COMMERCIALIZATION','65%','top',0.92);
    r2.wrap.setAttribute('data-row','2');
    r2.wrap.style.zIndex='4';

    // GSAP: centered at midpoint (50% scroll), spreading outward
    // Row 1: starts left, crosses center, ends right
    gsap.fromTo(r1.wrap,{x:'-20%'},{x:'20%',ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
    // Row 2: starts right, crosses center, ends left
    gsap.fromTo(r2.wrap,{x:'20%'},{x:'-20%',ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});

    // Bottle gentle parallax
    if(img){gsap.fromTo(img,{y:80,scale:.9},{y:-40,scale:1.05,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}})}

    // Apple parallax on content sections
    var sects=document.querySelectorAll('[id=who-we-serve],[id=how-it-works],[id=about],[id=team],[id=certifications],[id=process-dev],[id=faq],[id=contact-cta],.section-dark,.section-light');
    sects.forEach(function(sec2){
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

// ============ 7. CONTACT PAGE ENHANCEMENTS ============
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

  // Add centered nav logo at top (matching home page)
  var heroLogo=document.querySelector('.hero-logo')||document.querySelector('.nav-logo');
  if(heroLogo){
    var logo=document.createElement('img');
    logo.src=heroLogo.src;
    logo.setAttribute('style','height:auto;width:180px;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9998;filter:brightness(0) invert(1)');
    document.body.appendChild(logo);
  }
  // Hide old Webflow nav elements
  document.querySelectorAll('.fixed-nav').forEach(function(el){el.style.display='none'});

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
  cb.style.cssText='color:#1A1A1A;background:#C4A35A;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px';
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
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Phone</div><a href="tel:4088925844" style="color:#C4A35A;text-decoration:none;font-size:1.1rem;font-weight:600">(408) 892-5844</a></div>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Email</div><a href="mailto:weston@macrobrands.llc" style="color:#C4A35A;text-decoration:none;font-size:1.1rem;font-weight:600">weston@macrobrands.llc</a></div>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Location</div><div style="color:#888;font-size:1rem">24855 Corbit Pl., Yorba Linda, CA 92887</div></div>'+
      '<div style="margin-bottom:28px"><div style="font-weight:700;color:#ccc;margin-bottom:4px;font-size:.95rem">Certifications</div><div style="color:#888;font-size:.95rem">USDA Organic · SQF Level 2 · HACCP · FDA · GMP · Kosher · NSF</div></div>';

    // Right column: styled form
    var formWrap=document.createElement('div');
    formWrap.style.cssText='background:#111;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.3);border:1px solid #222';
    formWrap.innerHTML='<h3 style="font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:24px">Request a Free Consultation</h3>';
    formWrap.appendChild(form);

    // Style form inputs
    form.querySelectorAll('input,textarea').forEach(function(inp){
      inp.style.cssText='width:100%;padding:14px 16px;border:1px solid #333;border-radius:10px;font-size:1rem;font-family:Inter,sans-serif;margin-bottom:16px;background:#1a1a1a;color:#fff;transition:border-color .2s;outline:none';
      inp.onfocus=function(){this.style.borderColor='#C4A35A'};
      inp.onblur=function(){this.style.borderColor='#333'};
    });

    // Style submit button with liquid fill
    var submit=form.querySelector('[type="submit"],.w-button');
    if(submit){
      submit.style.cssText='width:100%;padding:16px;background:#C4A35A;color:#1A1A1A;border:none;border-radius:50px;font-size:1.1rem;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;margin-top:8px;position:relative;overflow:hidden';
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
