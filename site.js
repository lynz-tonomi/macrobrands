/* MACRO Brands — Master Site Script */
(function run(){
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);return;}

// ============ 1. FRAME SCRUBBER ============
(function(){
  var w=document.querySelector('.video-hero-wrap');
  var s=document.querySelector('.video-hero-sticky');
  if(!w||!s)return;
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
  var fn=document.querySelector('.fixed-nav');
  var ob=document.createElement('div');
  ob.style.cssText='position:absolute;inset:0;background:#000;z-index:10;pointer-events:none;opacity:1';
  s.appendChild(ob);
  var ow=document.createElement('div');
  ow.style.cssText='position:absolute;inset:0;background:#F8F7F4;z-index:10;pointer-events:none;opacity:0';
  s.appendChild(ow);
  if(lg)lg.style.cssText='position:absolute;z-index:20;width:42vw;max-width:550px;filter:brightness(0) invert(1);transform-origin:center center;opacity:1';
  if(nl)nl.style.opacity='0';
  if(fn){fn.style.opacity='0';fn.style.transform='translateY(20px)'}
  function u(){
    var h=window.innerHeight;var ms=w.offsetHeight-h;if(ms<=0)return;
    var p=window.scrollY/ms;if(p<0)p=0;if(p>1)p=1;
    ob.style.opacity=p<.05?String(1-p*20):'0';
    ow.style.opacity=p>.92?String((p-.92)*12.5):'0';
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
      if(fn){var np=Math.min(lp*1.2,1);fn.style.opacity=String(np);fn.style.transform='translateY('+String(20*(1-np))+'px)'}
    }else if(p<.10){
      var fo=(p-.085)/.015;lg.style.opacity=String(1-fo);
      if(nl)nl.style.opacity=String(fo);
      if(fn){fn.style.opacity='1';fn.style.transform='translateY(0)'}
    }else{
      lg.style.opacity='0';lg.style.display='none';
      if(nl)nl.style.opacity='1';
      if(fn){fn.style.opacity='1';fn.style.transform='translateY(0)'}
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
  wrap.style.cssText='position:absolute;left:5%;bottom:12%;z-index:8;pointer-events:none';
  s.appendChild(wrap);
  var D=['Product Development','Process Development','Process Authority','Tunnel Pasteurization','Retort Canning','Aseptic/ESL Bottling','Aseptic Bag-in-Box','Coffee & Tea Extraction','Turn-Key Manufacturing'];
  var els=[];
  D.forEach(function(t,i){
    var e=document.createElement('div');
    e.style.cssText='position:absolute;bottom:0;left:0;opacity:0;pointer-events:none;transition:opacity .5s,transform .5s';
    e.innerHTML='<div style="font-size:.85rem;color:rgba(255,255,255,.35);margin-bottom:8px;letter-spacing:.1em">0'+(i+1)+'</div><div style="font-size:clamp(2.2rem,4.5vw,3.8rem);font-weight:800;color:#fff;text-shadow:0 2px 30px rgba(0,0,0,.5);letter-spacing:-.02em">'+t+'</div>';
    wrap.appendChild(e);els.push(e);
  });
  var active=-1;
  function u(){
    var ms=w.offsetHeight-window.innerHeight;if(ms<=0)return;
    var p=window.scrollY/ms;
    var S=.08,E=.94,n=D.length;
    if(p<S||p>E){if(active>=0){els[active].style.opacity='0';els[active].style.transform='translateY(20px)';active=-1}return}
    var idx=Math.floor((p-S)/(E-S)*n);if(idx>=n)idx=n-1;
    if(idx!==active){
      if(active>=0){els[active].style.opacity='0';els[active].style.transform='translateY(-20px)'}
      els[idx].style.opacity='1';els[idx].style.transform='translateY(0)';active=idx;
    }
  }
  window.addEventListener('scroll',u,{passive:true});u();
})();

// ============ 4. FLOATING NAV BAR ============
(function(){
  var n=document.createElement('div');
  n.className='fixed-nav';
  n.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999;display:flex;align-items:center;gap:0;background:rgba(20,20,20,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:50px;padding:8px 8px 8px 24px;box-shadow:0 4px 30px rgba(0,0,0,.3);opacity:0;transition:opacity .4s,transform .4s';
  var links=[['Home','#'],['Services','.section-dark'],['About','#about'],['Certs','#certifications'],['FAQ','#faq']];
  links.forEach(function(l){
    var a=document.createElement('a');a.textContent=l[0];a.href=l[1];
    a.style.cssText='color:#ccc;text-decoration:none;padding:10px 16px;font-size:.9rem;font-weight:500;transition:color .2s;white-space:nowrap';
    a.onmouseover=function(){this.style.color='#fff'};
    a.onmouseout=function(){this.style.color='#ccc'};
    a.onclick=function(e){if(l[1].startsWith('.')||l[1].startsWith('#')){e.preventDefault();var t=l[1]==='#'?document.body:document.querySelector(l[1]);if(t)t.scrollIntoView({behavior:'smooth'})}};
    n.appendChild(a);
  });
  var cb=document.createElement('a');cb.textContent='Contact';cb.href='/contact';
  cb.style.cssText='color:#1A1A1A;background:#C4A35A;padding:10px 24px;border-radius:50px;font-size:.9rem;font-weight:700;text-decoration:none;margin-left:8px;transition:background .2s;position:relative;overflow:hidden';
  cb.onmouseover=function(){this.style.background='#D4B46A'};
  cb.onmouseout=function(){this.style.background='#C4A35A'};
  n.appendChild(cb);
  var nl=document.createElement('img');nl.className='nav-logo';
  nl.src=document.querySelector('.hero-logo')?document.querySelector('.hero-logo').src:'';
  nl.style.cssText='height:28px;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:998;opacity:0;transition:opacity .3s;filter:brightness(0) invert(1)';
  document.body.appendChild(nl);
  document.body.appendChild(n);
})();

// ============ 5. PAGE INIT (reorder sections, theme) ============
(function(){
  var vm=document.querySelector('.video-hero-media');if(vm)vm.style.display='none';
  var sd=document.querySelector('.section-dark');
  if(sd){
    sd.style.background='#F8F7F4';sd.style.color='#1A1A1A';
    sd.querySelectorAll('h2,h3,.section-heading,.service-title').forEach(function(h){h.style.color='#1A1A1A'});
    sd.querySelectorAll('.service-card').forEach(function(c){c.style.background='#fff';c.style.border='1px solid #eee'});
  }
  var b=document.body;var f=b.querySelector('.section-footer');
  var c2=b.querySelector('.cta-section');if(c2)c2.style.display='none';
  // Move parallax section right after the video hero wrap
  var heroWrap=b.querySelector('.video-hero-wrap');
  var plx=document.getElementById('parallax-hero');
  if(heroWrap&&plx&&heroWrap.nextSibling){b.insertBefore(plx,heroWrap.nextSibling)}
  var ids=['who-we-serve','how-it-works','about','team','certifications','process-dev','faq','contact-cta'];
  if(f){ids.forEach(function(id){var el=document.getElementById(id);if(el)b.insertBefore(el,f)});
    var ex=document.querySelectorAll('.section-light:not([id])');ex.forEach(function(el){b.insertBefore(el,f)});
  }
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
      // Remove placeholder paragraph
      var ph=img.querySelector('p,.section-subhead');
      if(ph)ph.remove();
    }

    // Measure viewport to scale text to fit width
    var vw=window.innerWidth;

    // Helper: create a text row with perfectly aligned solid + outline layers
    function makeRow(text,yPos,yProp){
      var wrap=document.createElement('div');
      wrap.style.cssText='position:absolute;'+yProp+':'+yPos+';left:0;width:100%;pointer-events:none;text-align:center';

      // Single inner container so both layers share exact same box
      var inner=document.createElement('div');
      inner.style.cssText='position:relative;display:inline-block';

      // Outline layer (z1, behind bottle)
      var outline=document.createElement('div');
      outline.style.cssText='font-weight:900;letter-spacing:-.04em;line-height:1;white-space:nowrap;-webkit-text-stroke:1.5px rgba(255,255,255,0.35);-webkit-text-fill-color:transparent;position:relative;z-index:1';
      outline.textContent=text;
      inner.appendChild(outline);

      // Solid layer (z3, in front — mix-blend hides over bottle)
      var solid=document.createElement('div');
      solid.style.cssText='font-weight:900;letter-spacing:-.04em;line-height:1;white-space:nowrap;color:#fff;position:absolute;top:0;left:0;z-index:3;mix-blend-mode:difference';
      solid.textContent=text;
      inner.appendChild(solid);

      wrap.appendChild(inner);
      sec.appendChild(wrap);

      // Scale font so text fits viewport width at start
      // Temporarily measure
      outline.style.fontSize='10vw';solid.style.fontSize='10vw';
      var measured=inner.offsetWidth;
      var targetW=vw*0.92;
      var scale=targetW/measured;
      var finalSize=Math.min(10*scale,12)+'vw';
      outline.style.fontSize=finalSize;solid.style.fontSize=finalSize;

      return {wrap:wrap,inner:inner};
    }

    // Row 1: "FROM CONCEPT" — starts centered, scrolls RIGHT
    var r1=makeRow('FROM CONCEPT','30%','top');
    r1.wrap.setAttribute('data-row','1');
    // Row 2: "TO COMMERCIALIZATION" — starts centered, scrolls LEFT
    var r2=makeRow('TO COMMERCIALIZATION','22%','bottom');
    r2.wrap.setAttribute('data-row','2');

    // GSAP: both layers inside each wrap move together (perfectly aligned)
    // Row 1 scrolls RIGHT
    gsap.fromTo(r1.wrap,{x:0},{x:'25%',ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});
    // Row 2 scrolls LEFT
    gsap.fromTo(r2.wrap,{x:0},{x:'-25%',ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}});

    // Bottle gentle parallax
    if(img){gsap.fromTo(img,{y:60,scale:.95},{y:-30,scale:1.05,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:true}})}

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

})(); // end run
