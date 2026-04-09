/* Exact copy of MACRO Brands site18.js Section 7: Supply Chain AI */
document.body.style.backgroundColor='#000';
// ============ 7. SUPPLY CHAIN AI SECTION FIX ============
(function(){
  setTimeout(function(){
  var sec=document.getElementById('autonomi-ai');
  if(!sec)return;
  // Section layout: header text on top, video below
  sec.style.cssText='position:relative;overflow:visible;background:#000;min-height:100vh';
  // Hide native "Supply Chain Intelligence" heading; move + shorten its desc under sc-header h2
  var nativeSCH2=sec.querySelector('.svc-h2-for-sc');
  if(nativeSCH2)nativeSCH2.style.display='none';
  var nativeSCDesc=sec.querySelector('.svc-desc.is-centered');
  if(nativeSCDesc){
    nativeSCDesc.innerHTML='Autonomi manages all aspect of manufacturing &amp; supply chain and deploys a fleet of AI agents that monitor, decide, and act across your entire supply chain in real time.';
    nativeSCDesc.style.cssText='font-size:1.15rem;color:rgba(255,255,255,0.7);line-height:1.7;max-width:640px;margin:12px auto 0;text-align:center';
  }
  // Style header content — above the video
  var hdr=sec.querySelector('.sc-header');
  if(hdr){
    hdr.style.cssText='position:relative;z-index:2;text-align:center;max-width:800px;margin:0 auto;padding:80px 40px 60px';
    hdr.querySelectorAll('h2').forEach(function(h){
      h.style.cssText='font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:800;color:#fff;margin:16px 0;white-space:nowrap';
      // Move shortened native desc right after the heading
      if(nativeSCDesc&&!nativeSCDesc._moved){nativeSCDesc._moved=true;h.parentNode.insertBefore(nativeSCDesc,h.nextSibling);}
    });
    hdr.querySelectorAll('p').forEach(function(p){p.style.cssText='font-size:1.1rem;color:rgba(255,255,255,0.75);line-height:1.7;max-width:600px;margin:0 auto';
      if(p.textContent.indexOf('Autonomi')!==-1){p.innerHTML=p.innerHTML.replace('Autonomi','<span style="color:#00BFFF;font-weight:700">Autonomi</span>')}
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
  // When GSAP pins sc-section, it wraps it in a pin-spacer div — walk from pin-spacer if needed
  var darkAlt=sec.nextElementSibling||(sec.parentElement.classList.contains('pin-spacer')?sec.parentElement.nextElementSibling:null);
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
    nativeVid.autoplay=false;nativeVid.removeAttribute('autoplay');
    nativeVid.preload='auto';nativeVid.setAttribute('preload','auto');
    nativeVid.load();
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
  // Hide the original video section — only the pin video will be used
  var vidParent=vidWrap.closest('section')||vidWrap.parentElement;
  vidParent.style.display='none';
  scVid.pause();
  // Create pin video container with 7-segment ping-pong player
  var pinVidWrap=document.createElement('div');
  pinVidWrap.style.cssText='position:absolute;inset:0;z-index:20;overflow:hidden;opacity:0';
  pinVidWrap.className='pin-vid-wrap';

  // 7 supply chain video segments — played back-to-back via two alternating video elements
  var scBase='https://lynz-tonomi.github.io/macrobrands/';
  var scSegments=[scBase+'sc_01.mp4',scBase+'sc_02.mp4',scBase+'sc_03.mp4',scBase+'sc_04.mp4',scBase+'sc_05.mp4',scBase+'sc_06.mp4',scBase+'sc_07.mp4'];
  var scIdx=0; // current segment index

  // Two video elements — "front" (visible) and "back" (preloading next)
  var vidA=document.createElement('video');
  var vidB=document.createElement('video');
  [vidA,vidB].forEach(function(v){
    v.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;';
    v.muted=true;v.playsInline=true;v.preload='auto';
    v.setAttribute('muted','');v.setAttribute('playsinline','');
    pinVidWrap.appendChild(v);
  });
  vidA.style.opacity='1';vidA.style.transition='opacity 0.3s';
  vidB.style.opacity='0';vidB.style.transition='opacity 0.3s';
  vidA.src=scSegments[0];vidA.load();

  // Preload next segment into back element
  function scPreloadNext(backVid){
    var nextIdx=(scIdx+1)%scSegments.length;
    if(backVid.getAttribute('data-seg')!==''+nextIdx){
      backVid.src=scSegments[nextIdx];
      backVid.setAttribute('data-seg',''+nextIdx);
      backVid.load();
    }
  }

  // When front video ends, swap to back and play next segment
  var frontVid=vidA,backVid=vidB;
  function scOnEnded(){
    scIdx=(scIdx+1)%scSegments.length;
    // Back video should already have this segment loaded
    backVid.currentTime=0;
    backVid.play().catch(function(){});
    backVid.style.opacity='1';
    frontVid.style.opacity='0';
    // Swap roles
    var tmp=frontVid;frontVid=backVid;backVid=tmp;
    // Preload the NEXT segment into the now-back element
    setTimeout(function(){scPreloadNext(backVid);},300);
  }
  vidA.addEventListener('ended',scOnEnded);
  vidB.addEventListener('ended',scOnEnded);

  // Preload segment 2 into back element
  scPreloadNext(vidB);

  window._pinVidEl=vidA;
  window._pinVidFront=function(){return frontVid;};
  window._pinVidWrap=pinVidWrap;
  // Hide original sc-header paragraphs (replaced by moved native desc above)
  if(hdr){
    var pars=hdr.querySelectorAll('p.sc-desc');
    pars.forEach(function(p){p.style.display='none';});
  }

  // ── INJECT AI CHIP CIRCUIT SVG WITH SCROLL-DRIVEN EXPANDING TRACES ──
  if(hdr){
    var scFlow=document.createElement('div');
    scFlow.id='sc-flow-viz';
    scFlow.style.cssText='max-width:100%;margin:40px auto 20px;padding:0;overflow:visible;position:relative;z-index:3';
    scFlow.innerHTML='<svg id="ai-chip-svg" viewBox="-200 -120 1600 1100" width="100%" style="display:block;margin:0 auto;overflow:visible"><defs><filter id="aig" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="35%" stop-color="#fff" stop-opacity="0"/><stop offset="46%" stop-color="#fff" stop-opacity=".08"/><stop offset="49%" stop-color="#fff" stop-opacity=".25"/><stop offset="50%" stop-color="#fff" stop-opacity=".9"/><stop offset="51%" stop-color="#fff" stop-opacity=".25"/><stop offset="54%" stop-color="#fff" stop-opacity=".08"/><stop offset="65%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="scanTrail" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="30%" stop-color="#fff" stop-opacity="0"/><stop offset="50%" stop-color="#fff" stop-opacity=".04"/><stop offset="70%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="508" y="308" width="184" height="184" rx="4" fill="#0a0a0a" stroke="#333" stroke-width="1"/><rect x="520" y="320" width="160" height="160" rx="14" fill="#1a1a1a" stroke="#fff" stroke-width="2.5" stroke-opacity=".7"/><rect x="526" y="326" width="148" height="148" rx="10" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".85"/><rect x="545" y="345" width="110" height="110" rx="6" fill="#111" stroke="#fff" stroke-width="1" stroke-opacity=".7"/><rect x="554" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="354" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="370" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="386" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="402" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="418" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="554" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="570" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="586" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="602" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="618" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="634" y="434" width="6" height="4" rx=".5" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-width=".2" stroke-opacity=".08"/><rect x="556" y="420" width="28" height="12" rx="2" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><text x="570" y="429" font-size="5" fill="#fff" fill-opacity=".2" text-anchor="middle" font-family="monospace">REG</text><rect x="596" y="420" width="28" height="12" rx="2" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><text x="610" y="429" font-size="5" fill="#fff" fill-opacity=".2" text-anchor="middle" font-family="monospace">ALU</text><image href="https://lynz-tonomi.github.io/macrobrands/AI-small-blue.png" x="552" y="352" width="96" height="91" opacity=".85"/><clipPath id="scanClip"><rect x="508" y="308" width="184" height="184" rx="4"/></clipPath><rect x="508" y="308" width="184" height="184" fill="url(#scanTrail)" clip-path="url(#scanClip)" opacity=".5"><animate attributeName="y" values="308;492;308" dur="4s" repeatCount="indefinite"/></rect><rect x="508" y="308" width="184" height="184" fill="url(#scanGrad)" clip-path="url(#scanClip)" opacity=".8"><animate attributeName="y" values="308;492;308" dur="4s" repeatCount="indefinite"/></rect><line x1="508" y1="400" x2="692" y2="400" stroke="#fff" stroke-width="1" stroke-opacity=".7" clip-path="url(#scanClip)" filter="url(#aig)"><animate attributeName="y1" values="308;492;308" dur="4s" repeatCount="indefinite"/><animate attributeName="y2" values="308;492;308" dur="4s" repeatCount="indefinite"/></line><rect x="527" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="530" y1="300" x2="530" y2="308" stroke="#777" stroke-width="1.8"/><rect x="545" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="548" y1="300" x2="548" y2="308" stroke="#777" stroke-width="1.8"/><rect x="563" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="566" y1="300" x2="566" y2="308" stroke="#777" stroke-width="1.8"/><rect x="581" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="584" y1="300" x2="584" y2="308" stroke="#777" stroke-width="1.8"/><rect x="599" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="602" y1="300" x2="602" y2="308" stroke="#777" stroke-width="1.8"/><rect x="617" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="620" y1="300" x2="620" y2="308" stroke="#777" stroke-width="1.8"/><rect x="635" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="638" y1="300" x2="638" y2="308" stroke="#777" stroke-width="1.8"/><rect x="653" y="288" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="656" y1="300" x2="656" y2="308" stroke="#777" stroke-width="1.8"/><rect x="527" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="530" y1="492" x2="530" y2="500" stroke="#777" stroke-width="1.8"/><rect x="545" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="548" y1="492" x2="548" y2="500" stroke="#777" stroke-width="1.8"/><rect x="563" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="566" y1="492" x2="566" y2="500" stroke="#777" stroke-width="1.8"/><rect x="581" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="584" y1="492" x2="584" y2="500" stroke="#777" stroke-width="1.8"/><rect x="599" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="602" y1="492" x2="602" y2="500" stroke="#777" stroke-width="1.8"/><rect x="617" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="620" y1="492" x2="620" y2="500" stroke="#777" stroke-width="1.8"/><rect x="635" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="638" y1="492" x2="638" y2="500" stroke="#777" stroke-width="1.8"/><rect x="653" y="500" width="6" height="12" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="656" y1="492" x2="656" y2="500" stroke="#777" stroke-width="1.8"/><rect x="488" y="327" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="330" x2="508" y2="330" stroke="#777" stroke-width="1.8"/><rect x="488" y="345" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="348" x2="508" y2="348" stroke="#777" stroke-width="1.8"/><rect x="488" y="363" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="366" x2="508" y2="366" stroke="#777" stroke-width="1.8"/><rect x="488" y="381" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="384" x2="508" y2="384" stroke="#777" stroke-width="1.8"/><rect x="488" y="399" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="402" x2="508" y2="402" stroke="#777" stroke-width="1.8"/><rect x="488" y="417" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="420" x2="508" y2="420" stroke="#777" stroke-width="1.8"/><rect x="488" y="435" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="438" x2="508" y2="438" stroke="#777" stroke-width="1.8"/><rect x="488" y="453" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="500" y1="456" x2="508" y2="456" stroke="#777" stroke-width="1.8"/><rect x="700" y="327" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="330" x2="700" y2="330" stroke="#777" stroke-width="1.8"/><rect x="700" y="345" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="348" x2="700" y2="348" stroke="#777" stroke-width="1.8"/><rect x="700" y="363" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="366" x2="700" y2="366" stroke="#777" stroke-width="1.8"/><rect x="700" y="381" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="384" x2="700" y2="384" stroke="#777" stroke-width="1.8"/><rect x="700" y="399" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="402" x2="700" y2="402" stroke="#777" stroke-width="1.8"/><rect x="700" y="417" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="420" x2="700" y2="420" stroke="#777" stroke-width="1.8"/><rect x="700" y="435" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="438" x2="700" y2="438" stroke="#777" stroke-width="1.8"/><rect x="700" y="453" width="12" height="6" rx="1" fill="#555" stroke="#777" stroke-width=".5"/><line x1="692" y1="456" x2="700" y2="456" stroke="#777" stroke-width="1.8"/><path class="ai-trace" d="M488,330 L458,330 L438,310 L318,310 L303,300 L223,300" fill="none" stroke="#00DFFF" stroke-width="1.8" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M488,336 L458,336 L435,310 L290,310 L275,296 L175,296" fill="none" stroke="#fff" stroke-width="0.9" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M488,342 L458,342 L432,310 L262,310 L247,292 L127,292" fill="none" stroke="#fff" stroke-width="0.9" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M488,348 L458,348 L429,310 L234,310 L219,288 L79,288" fill="none" stroke="#00DFFF" stroke-width="0.9" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M488,354 L458,354 L426,310 L206,310 L191,284 L31,284" fill="none" stroke="#fff" stroke-width="1.8" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M488,365 L448,365 L433,355 L283,355 L263,360 L163,360" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M488,372 L448,372 L431,367 L251,367 L231,375 L116,375" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M488,379 L448,379 L429,379 L219,379 L199,390 L69,390" fill="none" stroke="#fff" stroke-width="1.8" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M488,386 L448,386 L427,391 L187,391 L167,405 L22,405" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M488,393 L448,393 L425,403 L155,403 L135,420 L-25,420" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M488,400 L453,400 L435,415 L305,415 L293,423 L203,423" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M488,407 L453,407 L433,428 L283,428 L271,441 L163,441" fill="none" stroke="#00DFFF" stroke-width="1.6" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M488,414 L453,414 L431,441 L261,441 L249,459 L123,459" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M488,421 L453,421 L429,454 L239,454 L227,477 L83,477" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M488,428 L453,428 L427,467 L217,467 L205,495 L43,495" fill="none" stroke="#00DFFF" stroke-width="1.6" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M712,330 L742,330 L762,310 L882,310 L897,300 L977,300" fill="none" stroke="#00DFFF" stroke-width="1.8" stroke-opacity="0.9" filter="url(#aig)"/><path class="ai-trace" d="M712,336 L742,336 L765,310 L910,310 L925,296 L1025,296" fill="none" stroke="#fff" stroke-width="0.9" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M712,342 L742,342 L768,310 L938,310 L953,292 L1073,292" fill="none" stroke="#fff" stroke-width="0.9" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M712,348 L742,348 L771,310 L966,310 L981,288 L1121,288" fill="none" stroke="#00DFFF" stroke-width="1.8" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M712,354 L742,354 L774,310 L994,310 L1009,284 L1169,284" fill="none" stroke="#fff" stroke-width="0.9" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M712,365 L752,365 L767,355 L917,355 L937,360 L1037,360" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M712,372 L752,372 L769,367 L949,367 L969,375 L1084,375" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M712,379 L752,379 L771,379 L981,379 L1001,390 L1131,390" fill="none" stroke="#fff" stroke-width="1.8" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M712,386 L752,386 L773,391 L1013,391 L1033,405 L1178,405" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M712,393 L752,393 L775,403 L1045,403 L1065,420 L1225,420" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M712,400 L747,400 L765,415 L895,415 L907,423 L997,423" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M712,407 L747,407 L767,428 L917,428 L929,441 L1037,441" fill="none" stroke="#00DFFF" stroke-width="1.6" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M712,414 L747,414 L769,441 L939,441 L951,459 L1077,459" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M712,421 L747,421 L771,454 L961,454 L973,477 L1117,477" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M712,428 L747,428 L773,467 L983,467 L995,495 L1157,495" fill="none" stroke="#00DFFF" stroke-width="1.6" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M530,288 L530,263 L500,243 L500,203 L480,188 L420,188" fill="none" stroke="#fff" stroke-width="1.6" stroke-opacity="0.95" filter="url(#aig)"/><path class="ai-trace" d="M538,288 L538,263 L493,235 L493,180 L463,160 L378,160" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M546,288 L546,263 L486,227 L486,157 L446,132 L336,132" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M554,288 L554,263 L479,219 L479,134 L429,104 L294,104" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M575,288 L575,238 L567,223 L567,163" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M593,288 L593,218 L593,203 L593,128" fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M611,288 L611,198 L619,183 L619,93" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M640,288 L640,263 L670,243 L670,203 L690,188 L750,188" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M648,288 L648,263 L693,235 L693,180 L723,160 L808,160" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M656,288 L656,263 L716,227 L716,157 L756,132 L866,132" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M664,288 L664,263 L739,219 L739,134 L789,104 L924,104" fill="none" stroke="#fff" stroke-width="1.6" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M530,512 L530,537 L500,557 L500,597 L480,612 L420,612" fill="none" stroke="#fff" stroke-width="1.6" stroke-opacity="0.9" filter="url(#aig)"/><path class="ai-trace" d="M538,512 L538,537 L493,565 L493,620 L463,640 L378,640" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M546,512 L546,537 L486,573 L486,643 L446,668 L336,668" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M554,512 L554,537 L479,581 L479,666 L429,696 L294,696" fill="none" stroke="#00DFFF" stroke-width="1.6" stroke-opacity="0.85" filter="url(#aig)"/><path class="ai-trace" d="M575,512 L575,562 L567,577 L567,637" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M593,512 L593,582 L593,597 L593,672" fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M611,512 L611,602 L619,617 L619,707" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M640,512 L640,537 L670,557 L670,597 L690,612 L750,612" fill="none" stroke="#00DFFF" stroke-width="0.8" stroke-opacity="0.45" filter="url(#aig)"/><path class="ai-trace" d="M648,512 L648,537 L693,565 L693,620 L723,640 L808,640" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M656,512 L656,537 L716,573 L716,643 L756,668 L866,668" fill="none" stroke="#00DFFF" stroke-width="1.6" stroke-opacity="1" filter="url(#aig)"/><path class="ai-trace" d="M664,512 L664,537 L739,581 L739,666 L789,696 L924,696" fill="none" stroke="#fff" stroke-width="0.8" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M488,340 L438,340 L398,300 L218,300 L193,275 L73,275" fill="none" stroke="#fff" stroke-width="1.4" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M488,348 L443,348 L408,313 L248,313 L218,293 L78,293" fill="none" stroke="#00DFFF" stroke-width="0.7" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M712,340 L762,340 L802,300 L982,300 L1007,275 L1127,275" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M712,348 L757,348 L792,313 L952,313 L982,293 L1122,293" fill="none" stroke="#00DFFF" stroke-width="0.7" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M488,435 L438,435 L398,475 L218,475 L193,500 L73,500" fill="none" stroke="#fff" stroke-width="1.4" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M488,443 L443,443 L408,478 L248,478 L218,498 L78,498" fill="none" stroke="#00DFFF" stroke-width="0.7" stroke-opacity="0.4" filter="url(#aig)"/><path class="ai-trace" d="M712,435 L762,435 L802,475 L982,475 L1007,500 L1127,500" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.5" filter="url(#aig)"/><path class="ai-trace" d="M712,443 L757,443 L792,478 L952,478 L982,498 L1122,498" fill="none" stroke="#00DFFF" stroke-width="0.7" stroke-opacity="0.35" filter="url(#aig)"/><path class="ai-trace" d="M488,380 L88,380 L68,390 L-82,390" fill="none" stroke="#fff" stroke-width="1.4" stroke-opacity="0.8" filter="url(#aig)"/><path class="ai-trace" d="M488,395 L108,395 L93,387 L-87,387" fill="none" stroke="#00DFFF" stroke-width="0.7" stroke-opacity="0.3" filter="url(#aig)"/><path class="ai-trace" d="M712,380 L1112,380 L1132,390 L1282,390" fill="none" stroke="#fff" stroke-width="0.7" stroke-opacity="0.55" filter="url(#aig)"/><path class="ai-trace" d="M712,395 L1092,395 L1107,387 L1287,387" fill="none" stroke="#00DFFF" stroke-width="0.7" stroke-opacity="0.4" filter="url(#aig)"/><rect x="-28" y="172" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="-23" cy="177" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="-17" cy="177" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="-23" cy="183" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="-17" cy="183" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="178" cy="118" r="1" fill="#fff" fill-opacity=".15"/><circle cx="182" cy="118" r="1" fill="#fff" fill-opacity=".15"/><circle cx="178" cy="122" r="1" fill="#fff" fill-opacity=".15"/><circle cx="182" cy="122" r="1" fill="#fff" fill-opacity=".15"/><path d="M350,195 L355,200 L350,205 L345,200 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="292" y="442" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="297" cy="447" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="303" cy="447" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="297" cy="453" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="303" cy="453" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="198" cy="548" r="1" fill="#fff" fill-opacity=".15"/><circle cx="202" cy="548" r="1" fill="#fff" fill-opacity=".15"/><circle cx="198" cy="552" r="1" fill="#fff" fill-opacity=".15"/><circle cx="202" cy="552" r="1" fill="#fff" fill-opacity=".15"/><path d="M850,115 L855,120 L850,125 L845,120 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="1042" y="192" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="1047" cy="197" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1053" cy="197" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1047" cy="203" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1053" cy="203" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="898" cy="448" r="1" fill="#fff" fill-opacity=".15"/><circle cx="902" cy="448" r="1" fill="#fff" fill-opacity=".15"/><circle cx="898" cy="452" r="1" fill="#fff" fill-opacity=".15"/><circle cx="902" cy="452" r="1" fill="#fff" fill-opacity=".15"/><path d="M1000,545 L1005,550 L1000,555 L995,550 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="1192" y="172" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="1197" cy="177" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1203" cy="177" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1197" cy="183" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1203" cy="183" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="-42" cy="378" r="1" fill="#fff" fill-opacity=".15"/><circle cx="-38" cy="378" r="1" fill="#fff" fill-opacity=".15"/><circle cx="-42" cy="382" r="1" fill="#fff" fill-opacity=".15"/><circle cx="-38" cy="382" r="1" fill="#fff" fill-opacity=".15"/><path d="M150,295 L155,300 L150,305 L145,300 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="1042" y="372" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="1047" cy="377" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1053" cy="377" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1047" cy="383" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1053" cy="383" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1098" cy="298" r="1" fill="#fff" fill-opacity=".15"/><circle cx="1102" cy="298" r="1" fill="#fff" fill-opacity=".15"/><circle cx="1098" cy="302" r="1" fill="#fff" fill-opacity=".15"/><circle cx="1102" cy="302" r="1" fill="#fff" fill-opacity=".15"/><path d="M350,645 L355,650 L350,655 L345,650 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="492" y="742" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="497" cy="747" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="503" cy="747" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="497" cy="753" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="503" cy="753" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="698" cy="748" r="1" fill="#fff" fill-opacity=".15"/><circle cx="702" cy="748" r="1" fill="#fff" fill-opacity=".15"/><circle cx="698" cy="752" r="1" fill="#fff" fill-opacity=".15"/><circle cx="702" cy="752" r="1" fill="#fff" fill-opacity=".15"/><path d="M850,645 L855,650 L850,655 L845,650 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="1092" y="592" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="1097" cy="597" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1103" cy="597" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1097" cy="603" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1103" cy="603" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="148" cy="598" r="1" fill="#fff" fill-opacity=".15"/><circle cx="152" cy="598" r="1" fill="#fff" fill-opacity=".15"/><circle cx="148" cy="602" r="1" fill="#fff" fill-opacity=".15"/><circle cx="152" cy="602" r="1" fill="#fff" fill-opacity=".15"/><path d="M-30,495 L-25,500 L-30,505 L-35,500 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="1212" y="492" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="1217" cy="497" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1223" cy="497" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1217" cy="503" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="1223" cy="503" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="418" cy="278" r="1" fill="#fff" fill-opacity=".15"/><circle cx="422" cy="278" r="1" fill="#fff" fill-opacity=".15"/><circle cx="418" cy="282" r="1" fill="#fff" fill-opacity=".15"/><circle cx="422" cy="282" r="1" fill="#fff" fill-opacity=".15"/><path d="M780,275 L785,280 L780,285 L775,280 Z" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".18"/><rect x="412" y="512" width="16" height="16" rx="2" fill="#111" stroke="#fff" stroke-width=".5" stroke-opacity=".9"/><circle cx="417" cy="517" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="423" cy="517" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="417" cy="523" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="423" cy="523" r="1.2" fill="#fff" fill-opacity=".12"/><circle cx="778" cy="518" r="1" fill="#fff" fill-opacity=".15"/><circle cx="782" cy="518" r="1" fill="#fff" fill-opacity=".15"/><circle cx="778" cy="522" r="1" fill="#fff" fill-opacity=".15"/><circle cx="782" cy="522" r="1" fill="#fff" fill-opacity=".15"/><circle cx="100" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="105" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="110" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="115" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="100" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="105" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="110" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="115" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="100" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="105" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="110" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="115" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="250" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="255" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="260" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="265" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="250" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="255" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="260" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="265" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="250" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="255" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="260" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="265" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1050" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1055" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1060" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1065" cy="250" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1050" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1055" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1060" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1065" cy="255" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1050" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1055" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1060" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1065" cy="260" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="950" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="955" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="960" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="965" cy="150" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="950" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="955" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="960" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="965" cy="155" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="950" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="955" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="960" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="965" cy="160" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="100" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="105" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="110" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="115" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="100" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="105" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="110" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="115" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="100" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="105" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="110" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="115" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="250" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="255" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="260" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="265" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="250" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="255" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="260" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="265" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="250" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="255" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="260" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="265" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1050" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1055" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1060" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1065" cy="500" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1050" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1055" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1060" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1065" cy="505" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1050" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1055" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1060" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="1065" cy="510" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="950" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="955" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="960" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="965" cy="620" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="950" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="955" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="960" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="965" cy="625" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="950" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="955" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="960" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="965" cy="630" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="450" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="455" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="460" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="465" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="450" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="455" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="460" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="465" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="450" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="455" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="460" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="465" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="750" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="755" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="760" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="765" cy="100" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="750" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="755" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="760" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="765" cy="105" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="750" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="755" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="760" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="765" cy="110" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="450" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="455" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="460" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="465" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="450" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="455" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="460" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="465" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="450" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="455" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="460" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="465" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="750" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="755" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="760" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="765" cy="700" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="750" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="755" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="760" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="765" cy="705" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="750" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="755" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="760" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle cx="765" cy="710" r=".8" fill="#fff" fill-opacity=".1"/><circle class="ai-node-b" cx="223" cy="300" r="4.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="175" cy="296" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="127" cy="292" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="79" cy="288" r="3" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="31" cy="284" r="4.5" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="163" cy="360" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="116" cy="375" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="69" cy="390" r="4.5" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="22" cy="405" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="-25" cy="420" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="203" cy="423" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="163" cy="441" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="123" cy="459" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="83" cy="477" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="43" cy="495" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-b" cx="977" cy="300" r="4.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="1025" cy="296" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1073" cy="292" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="1121" cy="288" r="4.5" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="1169" cy="284" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1037" cy="360" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1084" cy="375" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="1131" cy="390" r="4.5" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="1178" cy="405" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1225" cy="420" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="997" cy="423" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="1037" cy="441" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="1077" cy="459" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1117" cy="477" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="1157" cy="495" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-b" cx="420" cy="188" r="4" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="378" cy="160" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="336" cy="132" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="294" cy="104" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="567" cy="163" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="593" cy="128" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="619" cy="93" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="750" cy="188" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="808" cy="160" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="866" cy="132" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="924" cy="104" r="4" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-b" cx="420" cy="612" r="4" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="378" cy="640" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="336" cy="668" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="294" cy="696" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="567" cy="637" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="593" cy="672" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="619" cy="707" r="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="750" cy="612" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="808" cy="640" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="866" cy="668" r="4" fill="#00DFFF" stroke="none" opacity="0"/><circle class="ai-node-w" cx="924" cy="696" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="73" cy="275" r="3.5" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="78" cy="293" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1127" cy="275" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1122" cy="293" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="73" cy="500" r="3.5" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="78" cy="498" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1127" cy="500" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1122" cy="498" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-b" cx="-82" cy="390" r="3.5" fill="#fff" stroke="none" opacity="0"/><circle class="ai-node-w" cx="-87" cy="387" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1282" cy="390" r="2.5" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/><circle class="ai-node-w" cx="1287" cy="387" r="2.5" fill="none" stroke="#00DFFF" stroke-width="1.5" opacity="0"/><circle class="ai-dept" cx="-80" cy="120" r="20" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="-80" cy="120" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="-80" cy="120" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="-80" y="90" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">SOURCING</text><circle class="ai-dept" cx="1280" cy="100" r="20" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1280" cy="100" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1280" cy="100" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1280" y="70" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">LOGISTICS</text><circle class="ai-dept" cx="-100" cy="350" r="20" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="-100" cy="350" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="-100" cy="350" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="-100" y="320" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">FORECASTING</text><circle class="ai-dept" cx="-90" cy="520" r="20" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="-90" cy="520" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="-90" cy="520" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="-90" y="490" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">SCHEDULING</text><circle class="ai-dept" cx="1300" cy="320" r="20" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1300" cy="320" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1300" cy="320" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1300" y="290" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">MONITORING</text><circle class="ai-dept" cx="1280" cy="520" r="20" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1280" cy="520" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1280" cy="520" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1280" y="490" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">ANALYTICS</text><circle class="ai-dept" cx="200" cy="870" r="20" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="200" cy="870" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="200" cy="870" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="200" y="840" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">INVENTORY</text><circle class="ai-dept" cx="600" cy="890" r="20" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="600" cy="890" r="10" fill="#fff" fill-opacity="0" stroke="#fff" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="600" cy="890" r="5" fill="#fff" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="600" y="860" font-size="13" fill="#fff" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">COMPLIANCE</text><circle class="ai-dept" cx="1000" cy="870" r="20" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="2" stroke-opacity="0"/><circle class="ai-dept" cx="1000" cy="870" r="10" fill="#00DFFF" fill-opacity="0" stroke="#00DFFF" stroke-width="1" stroke-opacity="0"/><circle class="ai-dept-inner" cx="1000" cy="870" r="5" fill="#00DFFF" fill-opacity="0" opacity="0"/><text class="ai-dept-label" x="1000" y="840" font-size="13" fill="#00DFFF" fill-opacity="0" text-anchor="middle" font-family="monospace" letter-spacing="3" font-weight="bold">TRACEABILITY</text></svg>';
    hdr.appendChild(scFlow);

    // ── MODULE OVERLAY CARDS ──
    scFlow.style.position='relative';scFlow.style.perspective='800px';
    // Circuit background image — fades in during zoom
    var circBg=document.createElement('div');
    circBg.className='ai-circ-bg';
    circBg.style.cssText='position:absolute;inset:0;background:url(https://lynz-tonomi.github.io/macrobrands/blue-circuite2.png) calc(50% + 2px) calc(47% - 13px)/cover no-repeat;opacity:0;z-index:0;pointer-events:none';
    scFlow.insertBefore(circBg,scFlow.firstChild);
    // LED blinking nodes on circuit background
    var ledPositions=[
      {x:12,y:8,c:'b'},{x:22,y:5,c:'w'},{x:35,y:3,c:'b'},{x:48,y:6,c:'w'},{x:62,y:4,c:'b'},{x:75,y:7,c:'w'},{x:88,y:5,c:'b'},
      {x:5,y:18,c:'w'},{x:15,y:22,c:'b'},{x:28,y:15,c:'w'},{x:72,y:16,c:'b'},{x:85,y:20,c:'w'},{x:95,y:17,c:'b'},
      {x:3,y:32,c:'b'},{x:18,y:35,c:'w'},{x:30,y:28,c:'b'},{x:70,y:30,c:'w'},{x:82,y:33,c:'b'},{x:97,y:28,c:'w'},
      {x:7,y:48,c:'w'},{x:20,y:45,c:'b'},{x:32,y:50,c:'w'},{x:68,y:48,c:'b'},{x:80,y:52,c:'w'},{x:93,y:46,c:'b'},
      {x:4,y:62,c:'b'},{x:16,y:58,c:'w'},{x:25,y:65,c:'b'},{x:75,y:60,c:'w'},{x:84,y:66,c:'b'},{x:96,y:58,c:'w'},
      {x:10,y:75,c:'w'},{x:22,y:78,c:'b'},{x:35,y:72,c:'w'},{x:65,y:74,c:'b'},{x:78,y:70,c:'w'},{x:90,y:76,c:'b'},
      {x:15,y:88,c:'b'},{x:30,y:92,c:'w'},{x:45,y:85,c:'b'},{x:55,y:90,c:'w'},{x:70,y:88,c:'b'},{x:85,y:92,c:'w'}
    ];
    var ledContainer=document.createElement('div');
    ledContainer.className='ai-led-wrap';
    ledContainer.style.cssText='position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0';
    ledPositions.forEach(function(led){
      var dot=document.createElement('div');
      var isBlue=led.c==='b';
      var color=isBlue?'#00DFFF':'#fff';
      dot.className='ai-led';
      dot.style.cssText='position:absolute;left:'+led.x+'%;top:'+led.y+'%;width:4px;height:4px;border-radius:50%;background:'+color+';box-shadow:0 0 6px 2px '+color+(isBlue?'80':'60')+';opacity:0;transform:translate(-50%,-50%)';
      ledContainer.appendChild(dot);
    });
    circBg.appendChild(ledContainer);
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
      var iconSvgs={SOURCING:'<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="r" values="7;8;7" dur="2s" repeatCount="indefinite"/></circle><line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"><animate attributeName="x2" values="21;22;21" dur="2s" repeatCount="indefinite"/><animate attributeName="y2" values="21;22;21" dur="2s" repeatCount="indefinite"/></line></svg>',LOGISTICS:'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="1" y="8" width="14" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15 11h4l3 4v3h-7v-7z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="19" r="2" fill="currentColor"><animate attributeName="cy" values="19;18.5;19" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="18" cy="19" r="2" fill="currentColor"><animate attributeName="cy" values="19;18.5;19" dur="1.5s" begin="0.3s" repeatCount="indefinite"/></circle><animateTransform attributeName="transform" type="translate" values="0,0;1,0;0,0" dur="2s" repeatCount="indefinite"/></svg>',FORECASTING:'<svg viewBox="0 0 24 24" width="20" height="20"><polyline points="3,18 8,12 13,15 21,6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="30" stroke-dashoffset="30"><animate attributeName="stroke-dashoffset" values="30;0" dur="2s" repeatCount="indefinite"/></polyline><polyline points="17,6 21,6 21,10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><animate attributeName="opacity" values="0;1;1" dur="2s" repeatCount="indefinite"/></polyline></svg>',SCHEDULING:'<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="7" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="8s" repeatCount="indefinite"/></line><line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="3s" repeatCount="indefinite"/></line></svg>',MONITORING:'<svg viewBox="0 0 24 24" width="20" height="20"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="currentColor"><animate attributeName="r" values="3;3.5;3" dur="1.8s" repeatCount="indefinite"/></circle><animate attributeName="opacity" values="1;0.7;1" dur="2.5s" repeatCount="indefinite"/></svg>',ANALYTICS:'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="3" y="14" width="4" height="7" rx="0.5" fill="currentColor"><animate attributeName="height" values="7;9;7" dur="2s" repeatCount="indefinite"/><animate attributeName="y" values="14;12;14" dur="2s" repeatCount="indefinite"/></rect><rect x="10" y="9" width="4" height="12" rx="0.5" fill="currentColor"><animate attributeName="height" values="12;10;12" dur="2s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="y" values="9;11;9" dur="2s" begin="0.4s" repeatCount="indefinite"/></rect><rect x="17" y="5" width="4" height="16" rx="0.5" fill="currentColor"><animate attributeName="height" values="16;14;16" dur="2s" begin="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="5;7;5" dur="2s" begin="0.8s" repeatCount="indefinite"/></rect></svg>',INVENTORY:'<svg viewBox="0 0 24 24" width="20" height="20"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" fill="none" stroke="currentColor" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" values="0 12 12;3 12 12;-3 12 12;0 12 12" dur="4s" repeatCount="indefinite"/></animateTransform></path><polyline points="3.27,6.96 12,12.01 20.73,6.96" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="1" opacity="0.5"/></svg>',COMPLIANCE:'<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.5"><animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/></path><polyline points="9,12 11,14 15,10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10" stroke-dashoffset="10"><animate attributeName="stroke-dashoffset" values="10;0;0;10" dur="3s" repeatCount="indefinite"/></polyline></svg>',TRACEABILITY:'<svg viewBox="0 0 24 24" width="20" height="20"><rect x="4" y="4" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="4" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="14" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="14" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="7" x2="14" y2="7" stroke="currentColor" stroke-width="1"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/></line><line x1="7" y1="10" x2="7" y2="14" stroke="currentColor" stroke-width="1"><animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" repeatCount="indefinite"/></line><line x1="17" y1="10" x2="17" y2="14" stroke="currentColor" stroke-width="1"><animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.6s" repeatCount="indefinite"/></line><line x1="10" y1="17" x2="14" y2="17" stroke="currentColor" stroke-width="1"><animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.9s" repeatCount="indefinite"/></line></svg>'};
      card.innerHTML='<span style="color:'+m.color+';display:flex;align-items:center">'+(iconSvgs[m.name]||m.icon)+'</span><div><div style="font-size:10px;font-family:monospace;letter-spacing:2px;color:'+m.color+';font-weight:bold">'+m.name+'</div><div style="font-size:9px;color:#666;font-family:sans-serif;margin-top:2px">'+m.sub+'</div></div>';
      scFlow.appendChild(card);
    });

    // ── GSAP SCROLL-DRIVEN CIRCUIT EXPANSION ──
    // Deferred to 2000ms so barn door pin-spacer (created at 1500ms) exists
    // before this pin calculates its position — otherwise start/end are off
    // by the barn door scroll distance
    if(typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
      setTimeout(function(){
        var paths=scFlow.querySelectorAll('.ai-trace');
        paths.forEach(function(p){
          var len=p.getTotalLength();
          p.style.strokeDasharray=len;
          p.style.strokeDashoffset=len;
        });
        // Build a single timeline for all circuit animations, scrubbed by the pin
        var pinSec=document.getElementById('autonomi-ai');
        var scFlowEl=document.querySelector('#sc-flow-viz');
        if(scFlowEl){scFlowEl.style.transformOrigin='50% 45%';scFlowEl.style.willChange='transform';}
        pinSec.style.overflow='clip';
        pinSec.style.backgroundColor='#111';
        var juncs=scFlow.querySelectorAll('.ai-junc');
        var allNodes=scFlow.querySelectorAll('.ai-node-w,.ai-node-b');
        var mods=scFlow.querySelectorAll('.ai-mod-card');
        var spawns=scFlow.querySelectorAll('.ai-spawn');

        var tl=gsap.timeline({
          scrollTrigger:{
            trigger:pinSec,
            start:'top top',
            end:'+=200%',
            scrub:0.3,
            pin:true,
            pinSpacing:true,
            anticipatePin:1
          }
        });

        // Timeline positions (out of 10 total):
        // 0-5: traces draw
        // 0-8: zoom
        // 1-4: spawns
        // 1.5-4.5: junctions
        // 2-3.5: fade text
        // 3-5.5: endpoint nodes
        // 4-5.5: module cards in
        // 5-6: cards drift + fade
        // 4.5-5.5: circuit bg in
        // 5.5-6: circuit bg out
        // 6.5-8: fade to black + SVG gone

        tl.to(paths,{strokeDashoffset:0,ease:'none',stagger:.003,duration:5},0);
        tl.to(scFlowEl,{scale:6,ease:'power2.in',duration:8},0);
        tl.to(spawns,{opacity:1,ease:'none',stagger:.012,duration:3},1);
        tl.to(juncs,{opacity:.6,ease:'none',stagger:.003,duration:3},1.5);
        tl.to(hdr.querySelectorAll('h2, p, .sc-badge, .sc-learn-more-btn'),{opacity:0,duration:1},4.5);
        tl.to(allNodes,{opacity:1,ease:'none',duration:2.5},3);
        // Module cards with parallax depth
        var depths=[1.2,0.7,1.5,0.9,1.3,0.6,1.1,0.8,1.4];
        mods.forEach(function(card,i){
          var d=depths[i%depths.length];
          tl.to(card,{opacity:1,y:-12*d,ease:'none',duration:1.5},3.8+i*0.08);
          tl.to(card,{y:-30*d,scale:1+d*0.3,ease:'power1.in',duration:1.5},5);
          tl.to(card,{opacity:0,duration:0.8},5.5+i*0.03);
        });
        // Circuit background: quick flash
        var circBgEl=scFlow.querySelector('.ai-circ-bg');
        if(circBgEl){
          tl.to(circBgEl,{opacity:.4,ease:'power1.in',duration:1},4.5);
        }
        // Fade to white — starts at 65%, done by 80%
        tl.to(scFlowEl,{opacity:0,ease:'power2.in',duration:1.5},6.5);
        tl.to(pinSec,{backgroundColor:'#000',ease:'power1.in',duration:1.5},6.5);
        // 8-9.5: fade video in from black
        if(window._pinVidWrap){
          pinSec.appendChild(window._pinVidWrap);
          tl.to(window._pinVidWrap,{opacity:1,ease:'power2.out',duration:1.5,
            onStart:function(){
              var v=window._pinVidEl;
              v.currentTime=0;v.play().catch(function(){});
            }
          },8);
        }
        // Pad after video fade-in for viewing time before pin releases
        tl.to({},{duration:1},9.5);


        // LED nodes: fade in with background, then blink randomly
        var ledWrap=scFlow.querySelector('.ai-led-wrap');
        if(ledWrap){
          tl.to(ledWrap,{opacity:1,ease:'none',duration:1},4.5);
          var leds=ledWrap.querySelectorAll('.ai-led');
          leds.forEach(function(led){
            var delay=Math.random()*3;
            var dur=0.4+Math.random()*0.8;
            gsap.to(led,{opacity:1,duration:0.15,repeat:-1,repeatDelay:dur+Math.random()*2,yoyo:true,ease:'power2.out',delay:delay});
          });
        }
        // Electricity charges traveling along circuit paths at full zoom
        var chipSvg=document.getElementById('ai-chip-svg');
        if(chipSvg){
          var chargeGroup=document.createElementNS('http://www.w3.org/2000/svg','g');
          chargeGroup.setAttribute('class','ai-charges');
          chargeGroup.style.opacity='0';
          chipSvg.appendChild(chargeGroup);
          // Animate charge dots along paths using getPointAtLength
          var chargeActive=false;
          var chargeDots=[];
          paths.forEach(function(p,pi){
            if(pi%2!==0)return;// every other path to keep performance
            var isBlue=p.getAttribute('stroke')==='#00DFFF';
            var color=isBlue?'#00DFFF':'#fff';
            var len=p.getTotalLength();
            if(len<80)return;
            for(var ci=0;ci<2;ci++){
              var dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
              dot.setAttribute('r',isBlue?'3':'2.5');
              dot.setAttribute('fill',color);
              dot.setAttribute('filter','url(#aig)');
              dot.style.opacity='0.9';
              chargeGroup.appendChild(dot);
              // Glow halo
              var halo=document.createElementNS('http://www.w3.org/2000/svg','circle');
              halo.setAttribute('r',isBlue?'7':'5');
              halo.setAttribute('fill',color);
              halo.setAttribute('opacity',isBlue?'0.25':'0.15');
              halo.setAttribute('filter','url(#aig)');
              chargeGroup.appendChild(halo);
              chargeDots.push({dot:dot,halo:halo,path:p,len:len,offset:ci*0.5+Math.random()*0.3,speed:0.3+Math.random()*0.4});
            }
          });
          // Chip pin sparks
          var sparkPins=[
            {x:548,y:298},{x:572,y:298},{x:596,y:298},{x:620,y:298},{x:644,y:298},
            {x:548,y:502},{x:572,y:502},{x:596,y:502},{x:620,y:502},{x:644,y:502},
            {x:498,y:345},{x:498,y:375},{x:498,y:405},{x:498,y:435},{x:498,y:460},
            {x:702,y:345},{x:702,y:375},{x:702,y:405},{x:702,y:435},{x:702,y:460}
          ];
          sparkPins.forEach(function(sp){
            var spark=document.createElementNS('http://www.w3.org/2000/svg','circle');
            spark.setAttribute('cx',sp.x);spark.setAttribute('cy',sp.y);
            spark.setAttribute('r','2');spark.setAttribute('fill','#fff');
            spark.setAttribute('filter','url(#aig)');
            chargeGroup.appendChild(spark);
            gsap.to(spark,{attr:{r:4},opacity:0,duration:0.2,repeat:-1,repeatDelay:0.5+Math.random()*2,yoyo:false,ease:'power2.out',delay:Math.random()*3});
          });
          // RAF loop to move charges along paths
          function animateCharges(time){
            if(!chargeActive){requestAnimationFrame(animateCharges);return;}
            var t=time*0.001;
            chargeDots.forEach(function(c){
              var pos=((t*c.speed+c.offset)%1)*c.len;
              try{
                var pt=c.path.getPointAtLength(pos);
                c.dot.setAttribute('cx',pt.x);c.dot.setAttribute('cy',pt.y);
                c.halo.setAttribute('cx',pt.x);c.halo.setAttribute('cy',pt.y);
              }catch(e){}
            });
            requestAnimationFrame(animateCharges);
          }
          requestAnimationFrame(animateCharges);
          // Fade charge group in at full zoom (position 5), activate animation
          tl.to(chargeGroup,{opacity:1,ease:'none',duration:0.8,onStart:function(){chargeActive=true;}},5);
        }

        // Non-timeline blinking (runs independently)
        allNodes.forEach(function(n){
          gsap.to(n,{opacity:.2,duration:.7+Math.random()*.5,repeat:-1,yoyo:true,ease:'sine.inOut',delay:2+Math.random()*2});
        });
        spawns.forEach(function(s){
          gsap.to(s,{opacity:.2,duration:.9+Math.random()*.5,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2});
        });
        // Department nodes: glow in when traces fully complete
        // Dept nodes are on the timeline (add before zoom)
        var deptRings=scFlow.querySelectorAll('.ai-dept');
        var deptInner=scFlow.querySelectorAll('.ai-dept-inner');
        var deptLabels=scFlow.querySelectorAll('.ai-dept-label');
        tl.to(deptRings,{attr:{'fill-opacity':.12,'stroke-opacity':.8},stagger:.03,duration:2},5);
        tl.to(deptInner,{opacity:1,attr:{'fill-opacity':1},stagger:.03,duration:2},5);
        tl.to(deptLabels,{attr:{'fill-opacity':1},stagger:.02,duration:1.5},5.5);
        // Dept rings pulse (independent)
        deptRings.forEach(function(d){
          gsap.to(d,{attr:{'fill-opacity':.03,'stroke-opacity':.3},duration:1.5+Math.random()*.8,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*2});
        });
        deptInner.forEach(function(d){
          gsap.to(d,{opacity:.3,duration:1+Math.random()*.6,repeat:-1,yoyo:true,ease:'sine.inOut',delay:Math.random()*1.5});
        });
        // Force ScrollTrigger to recalculate after dynamic content injection
        ScrollTrigger.refresh();
        // Ensure pin-spacer wrapper gets dark bg to prevent white gap between supporting → supply chain
        requestAnimationFrame(function(){
          if(pinSec.parentElement&&pinSec.parentElement.classList.contains('pin-spacer')){
            pinSec.parentElement.style.backgroundColor='#000';
          }
        });
      },2000);

      // Parallax header elements removed — timeline controls their opacity now
    }
  }
  // Learn More CTA is now a native Webflow element in sc-header — no JS needed

  // Pin + zoom is handled by the unified timeline in the circuit animation block above

  },500);
})();

// ============ 7b. SECTION-DARK-ALT (native Webflow Background Video) ============
