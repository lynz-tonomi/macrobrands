/* LynZ Animated SVG Icons — replaces emoji with white-outline animated SVGs */
(function(){
  var icons = {
    /* Trio section */
    '\ud83e\uddea': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6v16l-9 16a3 3 0 002.6 4.5h22.8A3 3 0 0038 38L29 22V6" class="lynz-svg-draw"/><line x1="16" y1="6" x2="32" y2="6" class="lynz-svg-draw"/><circle cx="22" cy="33" r="2" fill="#4FACFE" opacity="0" class="lynz-svg-pulse"/><circle cx="28" cy="29" r="1.5" fill="#00BFFF" opacity="0" class="lynz-svg-pulse" style="animation-delay:.3s"/><circle cx="25" cy="36" r="1" fill="#4FACFE" opacity="0" class="lynz-svg-pulse" style="animation-delay:.6s"/></svg>',
    '\ud83d\udcca': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="36" height="40" rx="3" class="lynz-svg-draw"/><line x1="12" y1="38" x2="12" y2="24" stroke="#4FACFE" stroke-width="3" class="lynz-svg-bar" style="--h:14"/><line x1="20" y1="38" x2="20" y2="18" stroke="#4FACFE" stroke-width="3" class="lynz-svg-bar" style="--h:20;animation-delay:.15s"/><line x1="28" y1="38" x2="28" y2="14" stroke="#4FACFE" stroke-width="3" class="lynz-svg-bar" style="--h:24;animation-delay:.3s"/><line x1="36" y1="38" x2="36" y2="20" stroke="#4FACFE" stroke-width="3" class="lynz-svg-bar" style="--h:18;animation-delay:.45s"/><polyline points="12,22 20,16 28,12 36,18" stroke="#00BFFF" stroke-width="1" fill="none" class="lynz-svg-draw" style="animation-delay:.6s"/></svg>',
    '\ud83c\udfed': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 44h40" class="lynz-svg-draw"/><rect x="6" y="20" width="10" height="24" rx="1" class="lynz-svg-draw"/><rect x="19" y="14" width="10" height="30" rx="1" class="lynz-svg-draw" style="animation-delay:.2s"/><rect x="32" y="8" width="10" height="36" rx="1" class="lynz-svg-draw" style="animation-delay:.4s"/><line x1="11" y1="14" x2="11" y2="8" stroke="#4FACFE" class="lynz-svg-smoke"/><line x1="24" y1="8" x2="24" y2="2" stroke="#4FACFE" class="lynz-svg-smoke" style="animation-delay:.3s"/><line x1="37" y1="2" x2="37" y2="-4" stroke="#4FACFE" class="lynz-svg-smoke" style="animation-delay:.6s"/></svg>',
    /* Feature section */
    '\ud83d\udcdd': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="4" width="32" height="40" rx="3" class="lynz-svg-draw"/><line x1="14" y1="14" x2="34" y2="14" class="lynz-svg-draw" style="animation-delay:.2s"/><line x1="14" y1="22" x2="30" y2="22" class="lynz-svg-draw" style="animation-delay:.35s"/><line x1="14" y1="30" x2="26" y2="30" class="lynz-svg-draw" style="animation-delay:.5s"/><path d="M32 30l4-4 4 4-4 4z" fill="#4FACFE" opacity="0" class="lynz-svg-pulse"/></svg>',
    '\u2696\ufe0f': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="24" y1="4" x2="24" y2="40" class="lynz-svg-draw"/><line x1="14" y1="40" x2="34" y2="40" class="lynz-svg-draw" style="animation-delay:.1s"/><line x1="8" y1="14" x2="40" y2="14" class="lynz-svg-draw" style="animation-delay:.3s"/><path d="M8 14l-2 12h12l-2-12" stroke="#4FACFE" class="lynz-svg-draw" style="animation-delay:.5s"/><path d="M32 14l-2 12h12l-2-12" stroke="#00BFFF" class="lynz-svg-draw" style="animation-delay:.6s"/><circle cx="24" cy="6" r="3" class="lynz-svg-draw" style="animation-delay:.2s"/></svg>',
    '\ud83d\udee3\ufe0f': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 40L24 8l20 32" class="lynz-svg-draw"/><circle cx="12" cy="34" r="3" fill="none" stroke="#4FACFE" class="lynz-svg-pulse"/><circle cx="24" cy="20" r="3" fill="none" stroke="#4FACFE" class="lynz-svg-pulse" style="animation-delay:.2s"/><circle cx="36" cy="34" r="3" fill="none" stroke="#00BFFF" class="lynz-svg-pulse" style="animation-delay:.4s"/><line x1="12" y1="34" x2="24" y2="20" stroke="#4FACFE" stroke-dasharray="3 3" class="lynz-svg-draw" style="animation-delay:.3s"/><line x1="24" y1="20" x2="36" y2="34" stroke="#00BFFF" stroke-dasharray="3 3" class="lynz-svg-draw" style="animation-delay:.5s"/></svg>',
    '\ud83d\udee1\ufe0f': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4L6 12v12c0 11 8 18 18 22 10-4 18-11 18-22V12L24 4z" class="lynz-svg-draw"/><polyline points="16,24 22,30 34,18" stroke="#4FACFE" stroke-width="2.5" class="lynz-svg-draw" style="animation-delay:.5s"/></svg>',
    '\ud83c\udf99\ufe0f': '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="4" width="16" height="24" rx="8" class="lynz-svg-draw"/><line x1="24" y1="32" x2="24" y2="40" class="lynz-svg-draw" style="animation-delay:.3s"/><line x1="16" y1="40" x2="32" y2="40" class="lynz-svg-draw" style="animation-delay:.4s"/><path d="M10 20v4a14 14 0 0028 0v-4" class="lynz-svg-draw" style="animation-delay:.2s"/><circle cx="24" cy="16" r="2" fill="#4FACFE" opacity="0" class="lynz-svg-pulse"/><line x1="20" y1="12" x2="28" y2="12" stroke="#4FACFE" stroke-width="1" opacity="0" class="lynz-svg-pulse" style="animation-delay:.2s"/><line x1="20" y1="16" x2="28" y2="16" stroke="#4FACFE" stroke-width="1" opacity="0" class="lynz-svg-pulse" style="animation-delay:.4s"/><line x1="20" y1="20" x2="28" y2="20" stroke="#4FACFE" stroke-width="1" opacity="0" class="lynz-svg-pulse" style="animation-delay:.6s"/></svg>'
  };

  /* Inject animation CSS */
  var style=document.createElement('style');
  style.textContent=
    '@keyframes lynzDraw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}'+
    '@keyframes lynzPulse{0%,100%{opacity:.3}50%{opacity:1}}'+
    '@keyframes lynzSmoke{0%{opacity:.6;transform:translateY(0)}100%{opacity:0;transform:translateY(-8px)}}'+
    '@keyframes lynzBar{from{stroke-dashoffset:var(--h)}to{stroke-dashoffset:0}}'+
    '.lynz-svg-draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:lynzDraw 1.5s ease forwards}'+
    '.lynz-svg-pulse{animation:lynzPulse 2s ease-in-out infinite}'+
    '.lynz-svg-smoke{animation:lynzSmoke 2s ease-in-out infinite}'+
    '.lynz-svg-bar{stroke-dasharray:var(--h);stroke-dashoffset:var(--h);animation:lynzBar 1s ease forwards}'+
    '.lynz-trio-icon svg,.lynz-feat-icon svg,.lynz-adv-icon svg{width:36px;height:36px}';
  document.head.appendChild(style);

  /* Replace emoji divs with SVGs */
  document.querySelectorAll('.lynz-trio-icon, .lynz-feat-icon').forEach(function(el){
    var text=el.textContent.trim();
    if(icons[text]){
      el.innerHTML=icons[text];
      /* Calculate stroke lengths for draw animation */
      el.querySelectorAll('.lynz-svg-draw').forEach(function(path){
        try{var len=path.getTotalLength();path.style.setProperty('--len',len)}catch(e){}
      });
    }
  });

  /* Replace emoji prefixes in advantage card titles */
  document.querySelectorAll('.lynz-adv-title').forEach(function(h){
    var text=h.textContent;
    for(var emoji in icons){
      if(text.indexOf(emoji)!==-1){
        var span=document.createElement('span');
        span.className='lynz-adv-icon';
        span.style.cssText='display:inline-block;width:24px;height:24px;vertical-align:middle;margin-right:8px';
        span.innerHTML=icons[emoji].replace('viewBox="0 0 48 48"','viewBox="0 0 48 48" width="24" height="24"');
        h.textContent=text.replace(emoji,'').trim();
        h.insertBefore(span,h.firstChild);
        span.querySelectorAll('.lynz-svg-draw').forEach(function(path){
          try{var len=path.getTotalLength();path.style.setProperty('--len',len)}catch(e){}
        });
        break;
      }
    }
  });
})();
