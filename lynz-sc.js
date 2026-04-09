/* LynZ SC v8 — Uses LIVE SVG from macrobrands.llc with correct class names
   Sequence: chip alone → traces draw outward → nodes appear → zoom → video */
(function(){
  document.body.style.backgroundColor='#000';
  if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
  gsap.registerPlugin(ScrollTrigger);

  var sec=document.getElementById('autonomi-ai');
  if(!sec)return;

  sec.style.cssText='position:relative;background:#000;min-height:100vh;padding:0;overflow:hidden;display:block';

  /* Header */
  var hdr=sec.querySelector('.sc-header');
  if(hdr){
    hdr.style.cssText='position:absolute;top:0;left:0;right:0;z-index:4;text-align:center;max-width:800px;margin:0 auto;padding:60px 40px 40px';
    hdr.querySelectorAll('p').forEach(function(p){
      if(p.textContent.indexOf('Autonomi')!==-1)
        p.innerHTML=p.innerHTML.replace(/Autonomi/g,'<span style="color:#00BFFF;font-weight:700">Autonomi</span>');
    });
  }

  /* Hide native video elements */
  var vidFrame=sec.querySelector('.sc-video-frame');
  if(vidFrame)vidFrame.style.display='none';
  var origVid=sec.querySelector('video');
  if(origVid&&origVid.parentElement)origVid.parentElement.style.display='none';

  /* Video overlay */
  var pinVid=document.createElement('div');
  pinVid.style.cssText='position:absolute;inset:0;z-index:20;overflow:hidden;opacity:0;background:#000';
  var vidEl=document.createElement('video');
  vidEl.src='https://lynz-tonomi.github.io/macrobrands/schero-web3.mp4';
  vidEl.muted=true;vidEl.loop=true;vidEl.playsInline=true;vidEl.preload='auto';
  vidEl.style.cssText='width:100%;height:100%;object-fit:cover';
  vidEl.load();
  pinVid.appendChild(vidEl);
  sec.appendChild(pinVid);

  /* Chip container — centered in viewport */
  var scFlow=document.getElementById('sc-flow-viz');
  if(!scFlow){scFlow=document.createElement('div');scFlow.id='sc-flow-viz';sec.appendChild(scFlow)}
  scFlow.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%;max-width:1200px;overflow:visible;z-index:3;transform-origin:center center';

  /* Load the LIVE SVG from GitHub */
  fetch('https://lynz-tonomi.github.io/macrobrands/ai-chip-live.svg?v=1')
    .then(function(r){return r.text()})
    .then(function(svgText){
      scFlow.innerHTML=svgText;
      initAnimation();
    });

  function initAnimation(){
    /* Correct class names from live macrobrands.llc: */
    var traces=scFlow.querySelectorAll('.ai-trace');         /* 64 paths */
    var nodesB=scFlow.querySelectorAll('.ai-node-b');        /* 18 circles */
    var nodesW=scFlow.querySelectorAll('.ai-node-w');        /* 46 circles */
    var depts=scFlow.querySelectorAll('.ai-dept');            /* 18 circles */
    var deptInner=scFlow.querySelectorAll('.ai-dept-inner');  /* 9 circles */
    var deptLabels=scFlow.querySelectorAll('.ai-dept-label'); /* 9 texts */

    /* HIDE everything immediately — just show the chip die */
    traces.forEach(function(p){
      var l=p.getTotalLength();
      p.style.strokeDasharray=l;
      p.style.strokeDashoffset=l;
    });
    nodesB.forEach(function(n){n.style.opacity='0'});
    nodesW.forEach(function(n){n.style.opacity='0'});
    depts.forEach(function(d){d.setAttribute('fill-opacity','0');d.setAttribute('stroke-opacity','0')});
    deptInner.forEach(function(d){d.style.opacity='0'});
    deptLabels.forEach(function(d){d.setAttribute('fill-opacity','0')});

    /*
       SCROLL SEQUENCE (200% scroll distance):
       0:     Just the chip die centered. Nothing else visible.
       0-5:   Traces DRAW outward from chip to nodes
       2-4:   White nodes (small) appear along traces
       3-5:   Blue nodes (large) appear at endpoints
       4-5.5: Department rings + labels at edges
       5:     Traces 100% complete. Full circuit.
       5-5.5: Header fades
       5.5-8: ZOOM 1x → 8x into chip
       7-8:   SVG fades to black
       8-9.5: Video fades in
       9.5-10: Hold
    */
    var tl=gsap.timeline({
      scrollTrigger:{
        trigger:sec,
        start:'top top',
        end:'+=200%',
        scrub:0.3,
        pin:true,
        pinSpacing:true,
        anticipatePin:1
      }
    });

    /* Phase 1: Traces draw outward (0→5) */
    tl.to(traces,{strokeDashoffset:0,ease:'none',stagger:.003,duration:5},0);
    /* Nodes appear as traces reach them */
    tl.to(nodesW,{opacity:1,ease:'none',stagger:.01,duration:2},2);
    tl.to(nodesB,{opacity:1,ease:'none',stagger:.02,duration:2},3);
    /* Dept rings at edges */
    tl.to(depts,{attr:{'fill-opacity':.12,'stroke-opacity':.8},stagger:.05,duration:2},4);
    tl.to(deptInner,{opacity:1,attr:{'fill-opacity':1},stagger:.05,duration:1.5},4);
    tl.to(deptLabels,{attr:{'fill-opacity':1},stagger:.03,duration:1.5},4.5);

    /* Phase 2: Header fades, zoom (5→8) */
    if(hdr)tl.to(hdr.querySelectorAll('h2,p,.sc-badge,.sc-learn-more-btn'),{opacity:0,duration:.5},5);
    tl.to(scFlow,{scale:8,ease:'power2.in',duration:2.5},5.5);

    /* Phase 3: Fade to black → video (7→9.5) */
    tl.to(scFlow,{opacity:0,ease:'power2.in',duration:1},7);
    tl.to(pinVid,{opacity:1,ease:'power2.out',duration:1.5,
      onStart:function(){vidEl.currentTime=0;vidEl.play().catch(function(){});}
    },8);
    tl.to({},{duration:.5},9.5);

    /* Ambient pulses */
    nodesB.forEach(function(n){gsap.to(n,{opacity:.3,duration:.8+Math.random()*.6,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2})});
    depts.forEach(function(d){gsap.to(d,{attr:{'fill-opacity':.03,'stroke-opacity':.3},duration:1.5+Math.random()*.8,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2})});

    ScrollTrigger.refresh();
    requestAnimationFrame(function(){
      if(sec.parentElement&&sec.parentElement.classList.contains('pin-spacer'))
        sec.parentElement.style.backgroundColor='#000';
    });
  }
})();
