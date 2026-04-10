/* LynZ SC v21 - dashboard cards + hero + safe scroll animations + AI chip */
(function(){
var I={
flask:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='lzflg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#60a5fa'/><stop offset='1' stop-color='#2563eb'/></linearGradient></defs><path d='M26 8h12' stroke='#ffffff' stroke-width='2.5' stroke-linecap='round' fill='none'/><path d='M28 8v18L14 52q-2 6 4 6h28q6 0 4-6L36 26V8' stroke='#ffffff' stroke-width='2.5' stroke-linejoin='round' fill='none'/><path d='M20 44h24q10 14 2 14H18q-10 0 2-14z' fill='url(#lzflg)' opacity='.85'/><circle cx='26' cy='48' r='1.5' fill='#dbeafe'><animate attributeName='cy' values='54;40' dur='2s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;1;0' dur='2s' repeatCount='indefinite'/></circle><circle cx='32' cy='50' r='1.2' fill='#dbeafe'><animate attributeName='cy' values='55;42' dur='2.3s' begin='.4s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;1;0' dur='2.3s' begin='.4s' repeatCount='indefinite'/></circle><circle cx='28' cy='48' r='1' fill='#dbeafe'><animate attributeName='cy' values='56;38' dur='2.6s' begin='.8s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;1;0' dur='2.6s' begin='.8s' repeatCount='indefinite'/></circle></svg>",
chart:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><line x1='12' y1='52' x2='56' y2='52' stroke='#ffffff' stroke-width='2' stroke-linecap='round'/><line x1='12' y1='52' x2='12' y2='12' stroke='#ffffff' stroke-width='2' stroke-linecap='round'/><rect x='18' y='36' width='8' height='16' fill='#3b82f6' rx='1'><animate attributeName='height' values='0;16' dur='.8s' begin='.3s' fill='freeze'/><animate attributeName='y' values='52;36' dur='.8s' begin='.3s' fill='freeze'/></rect><rect x='30' y='20' width='8' height='32' fill='#60a5fa' rx='1'><animate attributeName='height' values='0;32' dur='.8s' begin='.5s' fill='freeze'/><animate attributeName='y' values='52;20' dur='.8s' begin='.5s' fill='freeze'/></rect><rect x='42' y='28' width='8' height='24' fill='#93c5fd' rx='1'><animate attributeName='height' values='0;24' dur='.8s' begin='.7s' fill='freeze'/><animate attributeName='y' values='52;28' dur='.8s' begin='.7s' fill='freeze'/></rect><circle cx='22' cy='36' r='2' fill='#fbbf24'><animate attributeName='r' values='0;3;2' dur='.5s' begin='1.3s' fill='freeze'/></circle><circle cx='34' cy='20' r='2' fill='#fbbf24'><animate attributeName='r' values='0;3;2' dur='.5s' begin='1.5s' fill='freeze'/></circle><circle cx='46' cy='28' r='2' fill='#fbbf24'><animate attributeName='r' values='0;3;2' dur='.5s' begin='1.7s' fill='freeze'/></circle></svg>",
factory:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><path d='M8 56V32h14V22l14 10 14-10v34z' stroke='#ffffff' stroke-width='2.5' stroke-linejoin='round' fill='#1e3a8a' fill-opacity='.3'/><rect x='12' y='44' width='4' height='4' fill='#fbbf24'><animate attributeName='opacity' values='.3;1;.5;1' dur='2s' repeatCount='indefinite'/></rect><rect x='26' y='40' width='4' height='4' fill='#fbbf24'><animate attributeName='opacity' values='1;.3;.8' dur='2.2s' begin='.3s' repeatCount='indefinite'/></rect><rect x='40' y='44' width='4' height='4' fill='#fbbf24'><animate attributeName='opacity' values='.4;1;.5' dur='1.8s' begin='.6s' repeatCount='indefinite'/></rect><rect x='42' y='10' width='4' height='12' fill='none' stroke='#ffffff' stroke-width='2'/><circle cx='44' cy='6' r='3' fill='#94a3b8'><animate attributeName='cy' values='8;-8' dur='3s' repeatCount='indefinite'/><animate attributeName='r' values='2;7' dur='3s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;.7;0' dur='3s' repeatCount='indefinite'/></circle><circle cx='44' cy='6' r='3' fill='#94a3b8'><animate attributeName='cy' values='8;-8' dur='3s' begin='1.5s' repeatCount='indefinite'/><animate attributeName='r' values='2;7' dur='3s' begin='1.5s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;.7;0' dur='3s' begin='1.5s' repeatCount='indefinite'/></circle></svg>",
pencil:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><g><animateTransform attributeName='transform' type='rotate' values='0 32 40;-3 32 40;0 32 40' dur='3s' repeatCount='indefinite'/><rect x='10' y='36' width='4' height='8' fill='#f87171' stroke='#dc2626' stroke-width='1.2' rx='1'/><rect x='14' y='36' width='32' height='8' fill='#fbbf24' stroke='#d97706' stroke-width='1.2'/><path d='M46 36l8 4-8 4z' fill='#e7e5e4' stroke='#78716c' stroke-width='1.2' stroke-linejoin='round'/><path d='M52 38.5l2 1.5-2 1.5z' fill='#050b1a'/></g><path d='M8 54q8-4 16 0t16 0 16 0' stroke='#ffffff' stroke-width='2' fill='none' stroke-linecap='round' stroke-dasharray='60'><animate attributeName='stroke-dashoffset' values='60;0' dur='2s' repeatCount='indefinite'/></path></svg>",
scale:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><g><animateTransform attributeName='transform' type='rotate' values='-6 32 20;6 32 20;-6 32 20' dur='3s' repeatCount='indefinite'/><line x1='12' y1='20' x2='52' y2='20' stroke='#ffffff' stroke-width='2.5' stroke-linecap='round'/><path d='M16 20l-4 8h8z' stroke='#ffffff' stroke-width='2' fill='#1e3a8a' fill-opacity='.3'/><path d='M48 20l-4 8h8z' stroke='#ffffff' stroke-width='2' fill='#1e3a8a' fill-opacity='.3'/></g><line x1='32' y1='20' x2='32' y2='52' stroke='#ffffff' stroke-width='2.5'/><rect x='26' y='52' width='12' height='4' fill='#93c5fd' rx='1'/></svg>",
road:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><path d='M10 54q8-4 22-8t22-32' stroke='#ffffff' stroke-width='3' fill='none' stroke-linecap='round'/><path d='M10 54q8-4 22-8t22-32' stroke='#fbbf24' stroke-width='1' fill='none' stroke-linecap='round' stroke-dasharray='4 6'><animate attributeName='stroke-dashoffset' values='0;-20' dur='1.5s' repeatCount='indefinite'/></path><circle cx='10' cy='54' r='3' fill='#60a5fa'/><circle cx='32' cy='38' r='3' fill='#93c5fd'><animate attributeName='r' values='2;4;2' dur='2s' repeatCount='indefinite'/></circle><circle cx='54' cy='14' r='4' fill='#fbbf24'><animate attributeName='r' values='3;5;3' dur='2s' begin='.5s' repeatCount='indefinite'/></circle><path d='M52 12l2 2 4-4' stroke='#050b1a' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>",
shield:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><path d='M32 6l20 6v16c0 14-10 24-20 30-10-6-20-16-20-30V12z' stroke='#ffffff' stroke-width='2.5' stroke-linejoin='round' fill='#1e3a8a' fill-opacity='.3'/><path d='M22 32l8 8 14-14' stroke='#10b981' stroke-width='3.5' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='32'><animate attributeName='stroke-dashoffset' values='32;0' dur='1s' begin='.3s' fill='freeze'/></path><circle cx='32' cy='32' r='28' stroke='#ffffff' stroke-width='1' fill='none' opacity='.3'><animate attributeName='r' values='28;34' dur='2s' repeatCount='indefinite'/><animate attributeName='opacity' values='.4;0' dur='2s' repeatCount='indefinite'/></circle></svg>",
mic:"<svg viewBox='0 0 64 64' width='48' height='48' xmlns='http://www.w3.org/2000/svg'><rect x='26' y='8' width='12' height='28' rx='6' fill='#60a5fa' stroke='#ffffff' stroke-width='1.5'/><path d='M18 28a14 14 0 0028 0' stroke='#ffffff' stroke-width='2.5' fill='none' stroke-linecap='round'/><line x1='32' y1='42' x2='32' y2='52' stroke='#ffffff' stroke-width='2.5' stroke-linecap='round'/><line x1='24' y1='52' x2='40' y2='52' stroke='#ffffff' stroke-width='2.5' stroke-linecap='round'/><circle cx='32' cy='22' r='14' stroke='#ffffff' stroke-width='2' fill='none' opacity='0'><animate attributeName='r' values='14;22' dur='1.5s' repeatCount='indefinite'/><animate attributeName='opacity' values='.6;0' dur='1.5s' repeatCount='indefinite'/></circle><circle cx='32' cy='22' r='14' stroke='#ffffff' stroke-width='2' fill='none' opacity='0'><animate attributeName='r' values='14;22' dur='1.5s' begin='.75s' repeatCount='indefinite'/><animate attributeName='opacity' values='.6;0' dur='1.5s' begin='.75s' repeatCount='indefinite'/></circle></svg>",
dollar:"<svg viewBox='0 0 64 64' width='28' height='28' xmlns='http://www.w3.org/2000/svg' style='vertical-align:middle;margin-right:8px;display:inline-block'><circle cx='32' cy='32' r='24' stroke='#fbbf24' stroke-width='3' fill='#78350f' fill-opacity='.2'/><text x='32' y='42' text-anchor='middle' font-size='28' font-weight='bold' fill='#fbbf24'>$</text><circle cx='32' cy='32' r='28' stroke='#fbbf24' stroke-width='1' fill='none' opacity='0'><animate attributeName='r' values='24;32' dur='2s' repeatCount='indefinite'/><animate attributeName='opacity' values='.6;0' dur='2s' repeatCount='indefinite'/></circle></svg>",
lock:"<svg viewBox='0 0 64 64' width='28' height='28' xmlns='http://www.w3.org/2000/svg' style='vertical-align:middle;margin-right:8px;display:inline-block'><path d='M18 28v-6a14 14 0 0128 0v6' stroke='#ffffff' stroke-width='3' fill='none'/><rect x='12' y='28' width='40' height='28' rx='4' fill='#1e3a8a' fill-opacity='.5' stroke='#ffffff' stroke-width='2.5'/><circle cx='32' cy='42' r='4' fill='#fbbf24'/><line x1='32' y1='42' x2='32' y2='50' stroke='#fbbf24' stroke-width='3'/></svg>",
wings:"<svg viewBox='0 0 64 64' width='28' height='28' xmlns='http://www.w3.org/2000/svg' style='vertical-align:middle;margin-right:8px;display:inline-block'><g><animateTransform attributeName='transform' type='translate' values='0 0;0 -4;0 0' dur='2s' repeatCount='indefinite'/><path d='M8 32q8-8 16-2' stroke='#ffffff' stroke-width='2' fill='none' stroke-linecap='round'/><path d='M56 32q-8-8-16-2' stroke='#ffffff' stroke-width='2' fill='none' stroke-linecap='round'/><circle cx='32' cy='32' r='14' stroke='#fbbf24' stroke-width='2.5' fill='#78350f' fill-opacity='.3'/><text x='32' y='40' text-anchor='middle' font-size='18' font-weight='bold' fill='#fbbf24'>$</text></g></svg>"
};
var M={
"formulate":"flask","test":"chart","scale":"factory",
"recipe builder":"pencil","bench trial log":"flask","scale-up calculator":"scale",
"stage-gate pipeline":"road","quality \u0026 compliance":"shield","lynz voice ai":"mic"};
var A=[
["\uD83D\uDCB0","dollar"],
["\uD83E\uDDEA","flask"],
["\u2696\uFE0F","scale"],
["\uD83D\uDEE3\uFE0F","road"],
["\uD83C\uDF99\uFE0F","mic"],
["\uD83D\uDD12","lock"],
["\uD83D\uDEE1\uFE0F","shield"],
["\uD83D\uDCB8","wings"]
];
function sizeSvg(el,sz){var s=el.querySelector("svg");if(!s)return;s.setAttribute("width",sz);s.setAttribute("height",sz);s.style.width=sz+"px";s.style.height=sz+"px";s.style.maxWidth="none";s.style.flex="0 0 auto";}
function injectContrast(){if(document.getElementById("lynz-contrast-fix"))return;var s=document.createElement("style");s.id="lynz-contrast-fix";s.textContent=".au-body-text{color:rgba(255,255,255,0.92)!important}.au-subtitle{color:rgba(255,255,255,0.85)!important}.lynz-feat-bullets,.lynz-feat-bullets li,.lynz-feat-text ul,.lynz-feat-text ul li,.lynz-feat-text ol,.lynz-feat-text ol li{color:rgba(255,255,255,0.85)!important}";document.head.appendChild(s);}
function loadGsap(cb){if(window.gsap&&window.ScrollTrigger){cb();return;}var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";s.onload=function(){var s2=document.createElement("script");s2.src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js";s2.onload=function(){window.gsap.registerPlugin(window.ScrollTrigger);cb();};document.head.appendChild(s2);};document.head.appendChild(s);}
function injectCardCss(){if(document.getElementById("lz-card-css"))return;var s=document.createElement("style");s.id="lz-card-css";s.textContent=".lynz-feat-visual.lz-card{padding:0!important;background:transparent!important;border:0!important;font-size:0;overflow:hidden;border-radius:14px;will-change:transform,opacity;direction:ltr!important;unicode-bidi:isolate-override!important;box-shadow:0 0 0 1px rgba(255,255,255,.25),0 20px 60px -20px rgba(255,255,255,.2)}.lynz-screenshot-placeholder.lz-card{display:block!important;width:100%!important;height:auto!important;min-height:min(82vh,860px)!important;aspect-ratio:5/2!important;padding:0!important;background:#0a2472!important;border:2px solid #ffffff!important;border-radius:18px!important;overflow:hidden!important;font-size:0;will-change:transform,opacity;direction:ltr!important;unicode-bidi:isolate-override!important;box-shadow:0 0 0 1px rgba(255,255,255,.3),0 40px 100px -20px rgba(10,36,114,.6)}.lz-card svg{width:100%;height:auto;display:block;direction:ltr!important}.lynz-screenshot-placeholder.lz-card svg{width:100%!important;height:100%!important}.lz-card svg text,.lz-card svg tspan{direction:ltr!important;unicode-bidi:isolate-override!important}";document.head.appendChild(s);}
function cR(){var rows=[["Cherry Concentrate","42.0","21.00","0.42","1.85","92.50"],["Cane Sugar","28.5","14.25","0.29","0.42","21.00"],["Pectin","3.2","1.60","0.03","0.18","9.00"],["Citric Acid","1.8","0.90","0.02","0.09","4.50"],["Vanilla Extract","2.5","1.25","0.03","0.31","15.50"]];var r="";for(var i=0;i<rows.length;i++){var d=rows[i],y=104+i*26;r+="<g class='lz-row'><rect x='14' y='"+(y-15)+"' width='540' height='22' rx='4' fill='#050b1a' fill-opacity='.4'/><text x='24' y='"+y+"' fill='#e2e8f0' font-size='11' font-weight='500'>"+d[0]+"</text><text x='222' y='"+y+"' fill='#94a3b8' font-size='11' text-anchor='end'>"+d[1]+"</text><text x='302' y='"+y+"' fill='#94a3b8' font-size='11' text-anchor='end'>"+d[2]+"</text><text x='378' y='"+y+"' fill='#94a3b8' font-size='11' text-anchor='end'>"+d[3]+"</text><text x='452' y='"+y+"' fill='#10b981' font-size='11' text-anchor='end' data-count='"+d[4]+"' data-prefix='$' data-decimals='2'>$0.00</text><text x='540' y='"+y+"' fill='#10b981' font-size='11' font-weight='600' text-anchor='end' data-count='"+d[5]+"' data-prefix='$' data-decimals='2'>$0.00</text></g>";}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='rb1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#rb1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='34' rx='8' fill='#1e3a8a' fill-opacity='.35'/><circle cx='32' cy='31' r='9' fill='#3b82f6'/><path d='M27.5 31.5l3 3 5.5-6' stroke='#fff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/><text x='50' y='36' fill='#dbeafe' font-size='13' font-weight='600'>Recipe Builder \u00b7 Cherry Vanilla Sauce</text><rect x='478' y='22' width='62' height='18' rx='9' fill='#fbbf24' fill-opacity='.18' stroke='#fbbf24' stroke-width='1'/><circle cx='488' cy='31' r='2.2' fill='#10b981'><animate attributeName='opacity' values='1;.3;1' dur='1.4s' repeatCount='indefinite'/></circle><text x='500' y='35' fill='#fbbf24' font-size='9' font-weight='700'>v1.4 LIVE</text><text x='24' y='76' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1'>INGREDIENT</text><text x='222' y='76' fill='#64748b' font-size='9' font-weight='700' text-anchor='end'>%</text><text x='302' y='76' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1' text-anchor='end'>LB/BATCH</text><text x='378' y='76' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1' text-anchor='end'>LB/UNIT</text><text x='452' y='76' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1' text-anchor='end'>$/UNIT</text><text x='540' y='76' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1' text-anchor='end'>$/RUN</text><line x1='14' y1='84' x2='554' y2='84' stroke='#ffffff' stroke-width='1' stroke-dasharray='2 3'/>"+r+"<line x1='14' y1='248' x2='554' y2='248' stroke='#ffffff' stroke-width='1' opacity='.5'/><rect x='14' y='252' width='540' height='34' rx='8' fill='#fbbf24' fill-opacity='.08' stroke='#fbbf24' stroke-width='1' stroke-opacity='.4'/><text x='24' y='274' fill='#fbbf24' font-size='11' font-weight='700' letter-spacing='1'>TOTAL RUN COST</text><text x='222' y='274' fill='#fbbf24' font-size='11' font-weight='600' text-anchor='end'>100%</text><text x='302' y='274' fill='#fbbf24' font-size='11' font-weight='600' text-anchor='end' data-count='39' data-decimals='2'>0.00</text><text x='540' y='274' fill='#fbbf24' font-size='14' font-weight='800' text-anchor='end' data-count='142.50' data-prefix='$' data-decimals='2'>$0.00</text></svg>";}
function cB(){var f=[["DATE","2026-04-09"],["BATCH ID","BT-0042"],["pH","3.42"],["VISCOSITY","2,850 cP"],["BRIX","58.2\u00b0"],["COLOR","Deep Red"],["AROMA","9/10"],["YIELD","98.5%"],["TEMP","185\u00b0F"]];var o="";for(var i=0;i<f.length;i++){var col=i%3,row=Math.floor(i/3),x=24+col*180,y=88+row*60;o+="<g class='lz-item'><rect x='"+x+"' y='"+y+"' width='164' height='48' rx='6' fill='#050b1a' fill-opacity='.6' stroke='#ffffff' stroke-width='1'/><text x='"+(x+10)+"' y='"+(y+18)+"' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1.2'>"+f[i][0]+"</text><text x='"+(x+10)+"' y='"+(y+38)+"' fill='#e2e8f0' font-size='14' font-weight='600'>"+f[i][1]+"</text></g>";}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='bn1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#bn1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='40' rx='8' fill='#1e3a8a' fill-opacity='.35'/><circle cx='34' cy='34' r='11' fill='#3b82f6' fill-opacity='.25' stroke='#ffffff' stroke-width='1.5'/><path d='M30 34l3 3 5-7' stroke='#ffffff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/><text x='52' y='32' fill='#dbeafe' font-size='13' font-weight='700'>Bench Trial \u00b7 BT-0042</text><text x='52' y='46' fill='#64748b' font-size='10'>9 parameters captured</text><rect x='458' y='22' width='84' height='22' rx='11' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><circle cx='469' cy='33' r='3' fill='#10b981'><animate attributeName='opacity' values='.5;1;.5' dur='1.5s' repeatCount='indefinite'/></circle><text x='478' y='37' fill='#10b981' font-size='10' font-weight='700'>RECORDING</text>"+o+"<rect x='14' y='270' width='540' height='20' rx='6' fill='#10b981' fill-opacity='.1'/><text x='24' y='284' fill='#10b981' font-size='11' font-weight='700'>\u2713 Auto-saved \u00b7 Synced to cloud \u00b7 v3 of 12</text></svg>";}
function cS(){var st=[["BENCH","1","lb","#3b82f6"],["PILOT","50","lb","#60a5fa"],["PRODUCTION","5,000","lb","#fbbf24"]];var p="";for(var i=0;i<3;i++){var x=40+i*180,s=st[i];p+="<g class='lz-item'><rect x='"+x+"' y='80' width='148' height='160' rx='10' fill='#050b1a' fill-opacity='.5' stroke='"+s[3]+"' stroke-width='1.5'/><rect x='"+(x+24)+"' y='92' width='100' height='14' rx='7' fill='"+s[3]+"' fill-opacity='.2'/><text x='"+(x+74)+"' y='103' text-anchor='middle' fill='"+s[3]+"' font-size='9' font-weight='800' letter-spacing='1.5'>"+s[0]+"</text><path d='M"+(x+58)+" 116l32 0 0 8q0 12-6 12l-2 28q-1 8-8 8h0q-7 0-8-8l-2-28q-6 0-6-12z' fill='"+s[3]+"' fill-opacity='.3' stroke='"+s[3]+"' stroke-width='1.5'/><circle cx='"+(x+74)+"' cy='"+(160+i*4)+"' r='1.5' fill='"+s[3]+"'><animate attributeName='cy' values='"+(170+i*4)+";"+(140+i*4)+"' dur='2s' begin='"+(0.3+i*0.2)+"s' repeatCount='indefinite'/><animate attributeName='opacity' values='0;1;0' dur='2s' begin='"+(0.3+i*0.2)+"s' repeatCount='indefinite'/></circle><text x='"+(x+74)+"' y='205' text-anchor='middle' fill='#e2e8f0' font-size='22' font-weight='800' data-count='"+s[1].replace(/,/g,"")+"' data-decimals='0'>0</text><text x='"+(x+74)+"' y='222' text-anchor='middle' fill='#94a3b8' font-size='10' font-weight='600'>"+s[2].toUpperCase()+"/BATCH</text></g>";if(i<2){var ax=x+150,ay=160;p+="<g><line x1='"+ax+"' y1='"+ay+"' x2='"+(ax+24)+"' y2='"+ay+"' stroke='#475569' stroke-width='2' stroke-dasharray='40'><animate attributeName='stroke-dashoffset' values='40;0' dur='1.5s' begin='"+(0.8+i*0.4)+"s' fill='freeze'/></line><path d='M"+(ax+18)+" "+(ay-5)+"l6 5-6 5' stroke='#fbbf24' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='0'><animate attributeName='opacity' from='0' to='1' begin='"+(2+i*0.4)+"s' dur='.3s' fill='freeze'/></path></g>";}}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='su1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#su1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='34' rx='8' fill='#1e3a8a' fill-opacity='.35'/><text x='24' y='36' fill='#dbeafe' font-size='13' font-weight='700'>Scale-Up Calculator \u00b7 Cherry Vanilla Sauce</text><rect x='458' y='22' width='84' height='18' rx='9' fill='#fbbf24' fill-opacity='.18' stroke='#fbbf24' stroke-width='1'/><text x='500' y='35' text-anchor='middle' fill='#fbbf24' font-size='9' font-weight='700'>5,000\u00d7 SCALE</text>"+p+"<rect x='14' y='252' width='540' height='34' rx='8' fill='#10b981' fill-opacity='.08' stroke='#10b981' stroke-width='1' stroke-opacity='.4'/><text x='24' y='273' fill='#10b981' font-size='11' font-weight='700'>FORMULA INTEGRITY</text><text x='540' y='273' text-anchor='end' fill='#10b981' font-size='14' font-weight='800' data-count='100' data-decimals='0' data-suffix='%'>0%</text><rect x='14' y='278' width='540' height='3' rx='1.5' fill='#10b981' fill-opacity='.2'/><rect x='14' y='278' width='0' height='3' rx='1.5' fill='#10b981'><animate attributeName='width' from='0' to='540' begin='1.5s' dur='1.2s' fill='freeze' calcMode='spline' keySplines='.22 .61 .36 1'/></rect></svg>";}
function cP(){var stages=["IDEA","BENCH","PILOT","PROD"];var counts=["12","5","3","2"];var col="";for(var i=0;i<4;i++){var x=18+i*135;col+="<g><rect x='"+x+"' y='68' width='125' height='220' rx='8' fill='#050b1a' fill-opacity='.4' stroke='#ffffff' stroke-width='1'/><text x='"+(x+12)+"' y='86' fill='#94a3b8' font-size='10' font-weight='800' letter-spacing='1.5'>"+stages[i]+"</text><rect x='"+(x+92)+"' y='74' width='22' height='14' rx='7' fill='#1e3a8a'/><text x='"+(x+103)+"' y='84' text-anchor='middle' fill='#60a5fa' font-size='9' font-weight='700'>"+counts[i]+"</text></g>";}var pj=[[0,"Mango Habanero","#3b82f6",35,98],[0,"Cinnamon Toast","#3b82f6",20,150],[1,"Cherry Vanilla","#60a5fa",65,98],[1,"Strawberry Lime","#60a5fa",50,150],[2,"Vanilla Bean","#fbbf24",85,98],[2,"Espresso","#fbbf24",78,150],[3,"Lemon Cream","#10b981",100,98]];var p="";for(var j=0;j<pj.length;j++){var pr=pj[j],px=24+pr[0]*135,py=pr[4];p+="<g class='lz-item'><rect x='"+px+"' y='"+py+"' width='113' height='46' rx='6' fill='#020713' stroke='"+pr[2]+"' stroke-width='1.5' fill-opacity='.85'/><text x='"+(px+8)+"' y='"+(py+16)+"' fill='#e2e8f0' font-size='10' font-weight='700'>"+pr[1]+"</text><rect x='"+(px+8)+"' y='"+(py+24)+"' width='97' height='4' rx='2' fill='"+pr[2]+"' fill-opacity='.2'/><rect x='"+(px+8)+"' y='"+(py+24)+"' width='0' height='4' rx='2' fill='"+pr[2]+"'><animate attributeName='width' from='0' to='"+(0.97*pr[3])+"' begin='"+(1+j*0.13)+"s' dur='.9s' fill='freeze' calcMode='spline' keySplines='.22 .61 .36 1'/></rect><text x='"+(px+8)+"' y='"+(py+38)+"' fill='#64748b' font-size='8' font-weight='600'>"+pr[3]+"%</text><circle cx='"+(px+103)+"' cy='"+(py+36)+"' r='2.5' fill='"+pr[2]+"'><animate attributeName='opacity' values='.4;1;.4' dur='1.5s' begin='"+(j*0.2)+"s' repeatCount='indefinite'/></circle></g>";}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='pl1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#pl1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='40' rx='8' fill='#1e3a8a' fill-opacity='.35'/><text x='24' y='32' fill='#dbeafe' font-size='13' font-weight='700'>Stage-Gate Pipeline</text><text x='24' y='46' fill='#64748b' font-size='10'>22 active projects \u00b7 Q2 2026</text><rect x='458' y='22' width='84' height='22' rx='11' fill='#fbbf24' fill-opacity='.15' stroke='#fbbf24' stroke-width='1'/><text x='500' y='37' text-anchor='middle' fill='#fbbf24' font-size='10' font-weight='800' data-count='68' data-decimals='0' data-suffix='% ON-TIME'>0% ON-TIME</text>"+col+p+"</svg>";}
function cQ(){var ck=[["Allergen documentation","complete"],["SDS sheets uploaded","complete"],["COA verification","complete"],["Lot traceability","complete"],["HACCP review","complete"],["FDA labeling","complete"],["Kosher cert","pending"]];var c="";for(var i=0;i<ck.length;i++){var y=86+i*26,ok=ck[i][1]==="complete",col=ok?"#10b981":"#fbbf24";c+="<g class='lz-item'><circle cx='32' cy='"+y+"' r='9' fill='"+col+"' fill-opacity='.15' stroke='"+col+"' stroke-width='1.5'/>"+(ok?"<path d='M27.5 "+y+"l3 3 5.5-6' stroke='"+col+"' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='14'><animate attributeName='stroke-dashoffset' values='14;0' begin='"+(1+i*.13)+"s' dur='.4s' fill='freeze'/></path>":"<text x='32' y='"+(y+4)+"' text-anchor='middle' fill='"+col+"' font-size='11' font-weight='800'>!</text>")+"<text x='48' y='"+(y+4)+"' fill='#e2e8f0' font-size='12'>"+ck[i][0]+"</text><text x='370' y='"+(y+4)+"' text-anchor='end' fill='"+col+"' font-size='9' font-weight='700' letter-spacing='1'>"+ck[i][1].toUpperCase()+"</text></g>";}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='ql1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient><linearGradient id='qlsh' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#10b981'/><stop offset='1' stop-color='#34d399'/></linearGradient><clipPath id='qlclip'><path d='M480 80l50 15v40c0 35-25 60-50 75-25-15-50-40-50-75v-40z'/></clipPath></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#ql1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='40' rx='8' fill='#1e3a8a' fill-opacity='.35'/><text x='24' y='32' fill='#dbeafe' font-size='13' font-weight='700'>Quality \u0026 Compliance</text><text x='24' y='46' fill='#64748b' font-size='10'>Cherry Vanilla Sauce \u00b7 Audit Ready</text><rect x='420' y='22' width='122' height='22' rx='11' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><text x='481' y='37' text-anchor='middle' fill='#10b981' font-size='9' font-weight='800'>FDA \u00b7 HACCP \u00b7 GFSI</text>"+c+"<g><path d='M480 80l50 15v40c0 35-25 60-50 75-25-15-50-40-50-75v-40z' fill='#1e3a8a' fill-opacity='.2' stroke='#ffffff' stroke-width='1.5'/><rect x='430' y='80' width='100' height='200' fill='url(#qlsh)' clip-path='url(#qlclip)' opacity='.85'><animate attributeName='y' from='280' to='84' begin='.6s' dur='2.2s' fill='freeze' calcMode='spline' keySplines='.22 .61 .36 1'/></rect><circle cx='480' cy='150' r='22' fill='#020713' opacity='.7'/><text x='480' y='158' text-anchor='middle' fill='#fff' font-size='18' font-weight='800' data-count='98' data-decimals='0' data-suffix='%'>0%</text><text x='480' y='235' text-anchor='middle' fill='#a7f3d0' font-size='9' font-weight='800' letter-spacing='1.2'>COMPLIANT</text></g></svg>";}
function cV(){var bars="";for(var i=0;i<26;i++){var bx=24+i*7,dur=0.7+(i%5)*0.18;bars+="<rect x='"+bx+"' y='78' width='3' height='20' rx='1.5' fill='#60a5fa'><animate attributeName='height' values='6;28;10;24;8' dur='"+dur+"s' begin='"+(i*0.04)+"s' repeatCount='indefinite'/><animate attributeName='y' values='89;78;87;80;88' dur='"+dur+"s' begin='"+(i*0.04)+"s' repeatCount='indefinite'/></rect>";}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='vi1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#vi1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='40' rx='8' fill='#1e3a8a' fill-opacity='.35'/><circle cx='34' cy='34' r='12' fill='#3b82f6' fill-opacity='.3' stroke='#ffffff' stroke-width='1.5'><animate attributeName='r' values='12;14;12' dur='1.5s' repeatCount='indefinite'/></circle><rect x='30' y='28' width='8' height='12' rx='4' fill='#3b82f6'/><path d='M28 36a6 6 0 0012 0' stroke='#ffffff' stroke-width='1.5' fill='none'/><text x='56' y='32' fill='#dbeafe' font-size='13' font-weight='700'>LynZ Voice AI</text><text x='56' y='46' fill='#64748b' font-size='10'>Listening \u00b7 0:23</text><rect x='450' y='22' width='92' height='22' rx='11' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><circle cx='461' cy='33' r='3' fill='#10b981'><animate attributeName='opacity' values='.4;1;.4' dur='1s' repeatCount='indefinite'/></circle><text x='471' y='37' fill='#10b981' font-size='9' font-weight='800'>ACTIVE SESSION</text>"+bars+"<g class='lz-item'><rect x='14' y='118' width='360' height='34' rx='14' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><text x='28' y='132' fill='#64748b' font-size='9' font-weight='700'>YOU</text><text x='28' y='146' fill='#e2e8f0' font-size='11'>Cost per unit on cherry vanilla?</text></g><g class='lz-item'><rect x='194' y='160' width='360' height='34' rx='14' fill='#1e3a8a' fill-opacity='.5' stroke='#ffffff' stroke-width='1'/><text x='208' y='174' fill='#60a5fa' font-size='9' font-weight='700'>LYNZ</text><text x='208' y='188' fill='#e2e8f0' font-size='11'>Run cost $1.85/unit. Margin 68% at $5.79 retail.</text></g><g class='lz-item'><rect x='14' y='202' width='360' height='34' rx='14' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><text x='28' y='216' fill='#64748b' font-size='9' font-weight='700'>YOU</text><text x='28' y='230' fill='#e2e8f0' font-size='11'>Log a bench trial pH 3.4 brix 58.</text></g><g class='lz-item'><rect x='194' y='244' width='360' height='34' rx='14' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><circle cx='210' cy='261' r='7' fill='#10b981'/><path d='M205.5 261l3 3 5-6' stroke='#fff' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/><text x='224' y='265' fill='#10b981' font-size='11' font-weight='600'>Trial #BT-0042 logged successfully</text></g></svg>";}
function cA(){var k=[["ACTIVE SKUS","142","#3b82f6","data-count='142' data-decimals='0'"],["REVENUE","$2.4M","#10b981",""],["MARGIN","68%","#fbbf24","data-count='68' data-decimals='0' data-suffix='%'"]];var ki="";for(var i=0;i<3;i++){var x=14+i*180,d=k[i],txt=d[3]?"<text x='"+(x+12)+"' y='112' fill='"+d[2]+"' font-size='20' font-weight='800' "+d[3]+">0</text>":"<text x='"+(x+12)+"' y='112' fill='"+d[2]+"' font-size='20' font-weight='800'>"+d[1]+"</text>";ki+="<g class='lz-item'><rect x='"+x+"' y='66' width='172' height='56' rx='8' fill='#050b1a' fill-opacity='.5' stroke='"+d[2]+"' stroke-width='1' stroke-opacity='.4'/><text x='"+(x+12)+"' y='84' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1.2'>"+d[0]+"</text>"+txt+"<text x='"+(x+160)+"' y='112' text-anchor='end' fill='#10b981' font-size='10'>\u219112%</text></g>";}var bars="",hg=[60,90,75,110,130],lb=["Jan","Feb","Mar","Apr","May"];for(var b=0;b<5;b++){var bx=30+b*38,h=hg[b];bars+="<rect x='"+bx+"' y='"+(250-h)+"' width='22' height='0' rx='3' fill='#3b82f6'><animate attributeName='height' from='0' to='"+h+"' begin='"+(0.6+b*0.12)+"s' dur='.7s' fill='freeze' calcMode='spline' keySplines='.22 .61 .36 1'/></rect><text x='"+(bx+11)+"' y='266' text-anchor='middle' fill='#64748b' font-size='9'>"+lb[b]+"</text>";}var pts="244,218 274,200 304,206 334,170 364,180 394,140 424,148 454,108 484,118 514,80";return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='an1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient><linearGradient id='anl' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#10b981' stop-opacity='.4'/><stop offset='1' stop-color='#10b981' stop-opacity='0'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#an1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='40' rx='8' fill='#1e3a8a' fill-opacity='.35'/><text x='24' y='32' fill='#dbeafe' font-size='13' font-weight='700'>Analytics \u00b7 Q2 2026</text><text x='24' y='46' fill='#64748b' font-size='10'>Cherry Vanilla Sauce \u00b7 Live</text><rect x='458' y='22' width='84' height='22' rx='11' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><text x='500' y='37' text-anchor='middle' fill='#10b981' font-size='10' font-weight='800'>\u2191 23% YoY</text>"+ki+"<line x1='20' y1='250' x2='220' y2='250' stroke='#ffffff' stroke-width='1'/><line x1='20' y1='140' x2='220' y2='140' stroke='#050b1a' stroke-width='1' stroke-dasharray='2 3'/>"+bars+"<g><line x1='240' y1='250' x2='540' y2='250' stroke='#ffffff' stroke-width='1'/><line x1='240' y1='140' x2='540' y2='140' stroke='#050b1a' stroke-width='1' stroke-dasharray='2 3'/><polyline points='"+pts+"' fill='none' stroke='#10b981' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='600' stroke-dashoffset='600'><animate attributeName='stroke-dashoffset' from='600' to='0' begin='1s' dur='1.5s' fill='freeze' calcMode='spline' keySplines='.22 .61 .36 1'/></polyline><polygon points='"+pts+" 514,250 244,250' fill='url(#anl)' opacity='0'><animate attributeName='opacity' from='0' to='1' begin='2.3s' dur='.5s' fill='freeze'/></polygon><circle cx='514' cy='80' r='4' fill='#10b981' stroke='#fff' stroke-width='1.5' opacity='0'><animate attributeName='opacity' from='0' to='1' begin='2.5s' dur='.3s' fill='freeze'/><animate attributeName='r' values='4;6;4' begin='2.8s' dur='1.5s' repeatCount='indefinite'/></circle></g></svg>";}
function cI(){var dt=[["Cherry Concentrate",["Sulfite"],"Tart Cherry Co","1.85"],["Cane Sugar",[],"Domino Foods","0.42"],["Pectin",[],"CP Kelco","5.60"],["Citric Acid",[],"Jungbunzlauer","1.10"],["Vanilla Extract",["Soy"],"Nielsen-Massey","12.40"],["Natural Color",[],"GNT USA","8.20"]];var ac={"Sulfite":"#fbbf24","Soy":"#f87171","Dairy":"#60a5fa","Nut":"#a78bfa","Egg":"#fb923c","Wheat":"#34d399"};var r="";for(var i=0;i<dt.length;i++){var d=dt[i],y=104+i*30,bd="";for(var j=0;j<d[1].length;j++){var c=ac[d[1][j]]||"#94a3b8";bd+="<rect x='"+(220+j*54)+"' y='"+(y-13)+"' width='50' height='17' rx='8' fill='"+c+"' fill-opacity='.18' stroke='"+c+"' stroke-width='1'/><text x='"+(245+j*54)+"' y='"+(y-1)+"' text-anchor='middle' fill='"+c+"' font-size='9' font-weight='700'>"+d[1][j].toUpperCase()+"</text>";}if(d[1].length===0)bd="<text x='220' y='"+(y-2)+"' fill='#475569' font-size='9' font-style='italic'>none</text>";r+="<g class='lz-row'><rect x='14' y='"+(y-19)+"' width='540' height='27' rx='5' fill='#050b1a' fill-opacity='.4'/><circle cx='30' cy='"+(y-5)+"' r='6' fill='#3b82f6' fill-opacity='.3' stroke='#ffffff' stroke-width='1'/><text x='44' y='"+(y-1)+"' fill='#e2e8f0' font-size='11' font-weight='600'>"+d[0]+"</text>"+bd+"<text x='380' y='"+(y-1)+"' fill='#94a3b8' font-size='11'>"+d[2]+"</text><text x='540' y='"+(y-1)+"' text-anchor='end' fill='#10b981' font-size='11' font-weight='600' data-count='"+d[3]+"' data-prefix='$' data-suffix='/lb' data-decimals='2'>$0.00/lb</text></g>";}return "<svg viewBox='0 0 568 300' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='in1' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#020713'/><stop offset='1' stop-color='#000000'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='568' height='300' rx='14' fill='url(#in1)' stroke='#ffffff' stroke-width='1.5'/><rect x='14' y='14' width='540' height='40' rx='8' fill='#1e3a8a' fill-opacity='.35'/><text x='24' y='32' fill='#dbeafe' font-size='13' font-weight='700'>Ingredients \u0026 Suppliers</text><text x='24' y='46' fill='#64748b' font-size='10'>487 ingredients \u00b7 32 suppliers</text><rect x='280' y='22' width='170' height='22' rx='11' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><circle cx='294' cy='33' r='4' fill='none' stroke='#64748b' stroke-width='1.5'/><line x1='297' y1='36' x2='300' y2='39' stroke='#64748b' stroke-width='1.5' stroke-linecap='round'/><text x='306' y='37' fill='#64748b' font-size='9'>Search ingredients...</text><rect x='460' y='22' width='82' height='22' rx='11' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><text x='501' y='37' text-anchor='middle' fill='#10b981' font-size='9' font-weight='800'>+ NEW SKU</text><text x='14' y='80' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1'>INGREDIENT</text><text x='220' y='80' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1'>ALLERGENS</text><text x='380' y='80' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1'>SUPPLIER</text><text x='540' y='80' text-anchor='end' fill='#64748b' font-size='9' font-weight='700' letter-spacing='1'>PRICE</text>"+r+"</svg>";}
var CARDS={"recipe builder & bom":cR,"bench trial logging":cB,"scale-up calculator":cS,"stage-gate pipeline":cP,"quality & compliance":cQ,"lynz voice ai":cV,"analytics & reporting":cA,"ingredients & suppliers":cI};
function cHero(){var nav=["Dashboard","Recipes","Trials","Pipeline","Reports","Settings"];var no="";for(var i=0;i<nav.length;i++){var ny=72+i*28,act=i===1;no+="<g class='lz-item'><rect x='12' y='"+(ny-14)+"' width='116' height='22' rx='5' fill='"+(act?"#1e3a8a":"#000")+"' fill-opacity='"+(act?".55":"0")+"' stroke='"+(act?"#3b82f6":"none")+"' stroke-width='1'/><circle cx='26' cy='"+(ny-3)+"' r='2.5' fill='"+(act?"#60a5fa":"#1e40af")+"'/><text x='38' y='"+(ny+1)+"' fill='"+(act?"#dbeafe":"#60a5fa")+"' font-size='10' font-weight='"+(act?"700":"500")+"'>"+nav[i]+"</text></g>";}var kpis=[{l:"ACTIVE RECIPES",v:47,s:"",d:"+12%",x:156},{l:"TRIALS THIS WEEK",v:23,s:"",d:"+8",x:372},{l:"COMPLIANCE",v:98,s:"%",d:"\u2191 2.1",x:588}];var ko="";for(var k=0;k<kpis.length;k++){var p=kpis[k];ko+="<g class='lz-item'><rect x='"+p.x+"' y='56' width='196' height='74' rx='8' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><text x='"+(p.x+14)+"' y='76' fill='#3b82f6' font-size='9' font-weight='700' letter-spacing='1.2'>"+p.l+"</text><text x='"+(p.x+14)+"' y='112' fill='#dbeafe' font-size='30' font-weight='800' data-count='"+p.v+"' data-suffix='"+p.s+"'>0</text><rect x='"+(p.x+148)+"' y='66' width='42' height='18' rx='9' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><text x='"+(p.x+169)+"' y='79' text-anchor='middle' fill='#10b981' font-size='9' font-weight='700'>"+p.d+"</text></g>";}var pts=[60,55,72,68,84,78,92,88,96,90,102,98,108,104],maxV=110,minV=50,cx0=170,cy0=190,cw=372,ch=88,px="",dots="";for(var j=0;j<pts.length;j++){var x=cx0+(j/(pts.length-1))*cw,y=cy0+ch-((pts[j]-minV)/(maxV-minV))*ch;px+=(j===0?"M":"L")+x.toFixed(1)+","+y.toFixed(1);dots+="<circle cx='"+x.toFixed(1)+"' cy='"+y.toFixed(1)+"' r='2.5' fill='#60a5fa' stroke='#000' stroke-width='1' class='lz-item'/>";}var acts=[["DR","Dr. Chen","approved Trial #BT-0042","2m"],["MK","Mike K","logged Brix reading","8m"],["AI","LynZ AI","flagged pH variance","14m"],["SR","Sarah R","scaled batch to 50gal","23m"],["JT","James T","completed QA review","41m"]];var ao="";for(var a=0;a<acts.length;a++){var ay=180+a*24;ao+="<g class='lz-row'><circle cx='584' cy='"+ay+"' r='9' fill='#1e3a8a' stroke='#ffffff' stroke-width='1'/><text x='584' y='"+(ay+3)+"' text-anchor='middle' fill='#dbeafe' font-size='8' font-weight='700'>"+acts[a][0]+"</text><text x='600' y='"+(ay-2)+"' fill='#dbeafe' font-size='9' font-weight='600'>"+acts[a][1]+"</text><text x='600' y='"+(ay+8)+"' fill='#60a5fa' font-size='8'>"+acts[a][2]+"</text><text x='774' y='"+(ay+3)+"' text-anchor='end' fill='#1e40af' font-size='8'>"+acts[a][3]+"</text></g>";}return "<svg viewBox='0 0 800 320' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='hbg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#0a2472'/><stop offset='1' stop-color='#051845'/></linearGradient></defs><style>text{font-family:-apple-system,Inter,Helvetica,sans-serif}</style><rect width='800' height='320' rx='12' fill='url(#hbg)' stroke='#ffffff' stroke-width='1.5'/><rect x='0' y='0' width='140' height='320' fill='#000510'/><line x1='140' y1='0' x2='140' y2='320' stroke='#ffffff' stroke-width='1'/><text x='20' y='30' fill='#60a5fa' font-size='13' font-weight='800' letter-spacing='1.5'>LYN<tspan fill='#3b82f6'>Z</tspan></text><rect x='20' y='38' width='40' height='2' fill='#3b82f6'/>"+no+"<rect x='12' y='280' width='116' height='28' rx='14' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><circle cx='26' cy='294' r='8' fill='#1e3a8a' stroke='#ffffff' stroke-width='1'/><text x='26' y='297' text-anchor='middle' fill='#dbeafe' font-size='8' font-weight='700'>WL</text><text x='40' y='292' fill='#dbeafe' font-size='9' font-weight='600'>Weston L.</text><text x='40' y='302' fill='#60a5fa' font-size='7'>Formulator</text><rect x='140' y='0' width='660' height='40' fill='#000510'/><line x1='140' y1='40' x2='800' y2='40' stroke='#ffffff' stroke-width='1'/><text x='156' y='25' fill='#60a5fa' font-size='10'>Recipes</text><text x='195' y='25' fill='#1e40af' font-size='10'>/</text><text x='205' y='25' fill='#dbeafe' font-size='11' font-weight='700'>Citrus Burst Hard Seltzer</text><rect x='700' y='12' width='84' height='18' rx='9' fill='#10b981' fill-opacity='.15' stroke='#10b981' stroke-width='1'/><circle cx='712' cy='21' r='3' fill='#10b981'><animate attributeName='opacity' values='.4;1;.4' dur='1.5s' repeatCount='indefinite'/></circle><text x='722' y='25' fill='#10b981' font-size='9' font-weight='700'>LIVE \u00b7 v3.2</text>"+ko+"<rect x='156' y='146' width='400' height='158' rx='8' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><text x='168' y='164' fill='#dbeafe' font-size='10' font-weight='700'>BRIX STABILITY</text><text x='168' y='176' fill='#1e40af' font-size='8'>Last 14 trials</text><text x='544' y='168' text-anchor='end' fill='#3b82f6' font-size='16' font-weight='800' data-count='12.4' data-suffix='\u00b0' data-decimals='1'>0</text><text x='544' y='180' text-anchor='end' fill='#10b981' font-size='8' font-weight='700'>\u2191 0.8 vs target</text><line x1='170' y1='200' x2='542' y2='200' stroke='#ffffff' stroke-width='.5' stroke-dasharray='2 3'/><line x1='170' y1='234' x2='542' y2='234' stroke='#ffffff' stroke-width='.5' stroke-dasharray='2 3'/><line x1='170' y1='268' x2='542' y2='268' stroke='#ffffff' stroke-width='.5' stroke-dasharray='2 3'/><path d='"+px+"L 542,278 L 170,278 Z' fill='#3b82f6' fill-opacity='0'><animate attributeName='fill-opacity' values='0;.18' dur='.8s' begin='1.6s' fill='freeze'/></path><path d='"+px+"' stroke='#ffffff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='800' stroke-dashoffset='800'><animate attributeName='stroke-dashoffset' from='800' to='0' dur='1.6s' begin='.4s' fill='freeze'/></path>"+dots+"<rect x='572' y='146' width='212' height='158' rx='8' fill='#050b1a' stroke='#ffffff' stroke-width='1'/><text x='584' y='164' fill='#dbeafe' font-size='10' font-weight='700'>ACTIVITY</text><circle cx='772' cy='159' r='3' fill='#10b981'><animate attributeName='opacity' values='.4;1;.4' dur='1.5s' repeatCount='indefinite'/></circle>"+ao+"</svg>";}
function buildHero(){var b=document.querySelector(".lynz-screenshot-placeholder,.lynz-screenshot-body");if(!b)return false;if(b.dataset.lzHero)return true;b.dataset.lzHero="1";b.innerHTML=cHero();b.classList.add("lz-card");return true;}
function buildCards(){injectCardCss();var built=0;document.querySelectorAll(".lynz-feat-visual").forEach(function(v){var sec=v.closest(".lynz-feat-section");if(!sec)return;var h=sec.querySelector("h2,h3");if(!h)return;var key=h.textContent.trim().toLowerCase();var fn=CARDS[key];if(!fn)return;v.innerHTML=fn();v.classList.add("lz-card");built++;});if(buildHero())built++;if(!built)return;loadGsap(function(){var g=window.gsap;document.querySelectorAll(".lz-card").forEach(function(card){var tl=g.timeline({scrollTrigger:{trigger:card,start:"top 85%",toggleActions:"play none none none"}});tl.from(card,{y:60,autoAlpha:0,scale:.96,duration:.9,ease:"power3.out"});var rows=card.querySelectorAll(".lz-row");if(rows.length){g.set(rows,{x:-15,autoAlpha:0});tl.to(rows,{x:0,autoAlpha:1,stagger:.08,duration:.5,ease:"power2.out"},.3);}var its=card.querySelectorAll(".lz-item");if(its.length){g.set(its,{autoAlpha:0,y:8});tl.to(its,{autoAlpha:1,y:0,stagger:.07,duration:.4,ease:"power2.out"},.3);}card.querySelectorAll("[data-count]").forEach(function(el,i){var t=parseFloat(el.dataset.count);var px=el.dataset.prefix||"";var sx=el.dataset.suffix||"";var dc=parseInt(el.dataset.decimals||"0");var ob={v:0};tl.to(ob,{v:t,duration:1.1,ease:"power2.out",onUpdate:function(){el.textContent=px+ob.v.toFixed(dc)+sx;}},.5+i*.04);});});});}
function run(){
injectContrast();
buildCards();
document.querySelectorAll(".lynz-trio-icon,.lynz-feat-icon").forEach(function(el){
var card=el.parentElement;
var h3=card.querySelector("h3");
if(!h3)return;
var key=M[h3.textContent.trim().toLowerCase()];
if(key&&I[key]){
el.innerHTML=I[key];
el.style.display="flex";
el.style.justifyContent="center";
el.style.alignItems="center";
el.style.fontSize="0";
el.style.minHeight="64px";
el.style.height="auto";
el.style.marginBottom="24px";
el.style.overflow="visible";
sizeSvg(el,56);
}
});
document.querySelectorAll(".lynz-adv-title").forEach(function(h3){
var t=h3.textContent;
var sp=h3.firstElementChild;
if(sp&&sp.nodeName==="SPAN"&&sp.querySelector("svg")){
sp.style.display="inline-flex";
sp.style.alignItems="center";
sp.style.justifyContent="center";
sp.style.verticalAlign="middle";
sp.style.marginRight="14px";
sp.style.width="32px";
sp.style.height="32px";
sp.style.flex="0 0 auto";
sizeSvg(sp,32);
h3.style.display="flex";
h3.style.alignItems="center";
h3.style.gap="0";
return;
}
for(var i=0;i<A.length;i++){
if(t.indexOf(A[i][0])===0){
var clean=t.replace(A[i][0],"").replace(/^\s+/,"");
h3.innerHTML=I[A[i][1]]+"<span>"+clean+"</span>";
var ns=h3.firstElementChild;
if(ns&&ns.nodeName==="svg"){ns.setAttribute("width","32");ns.setAttribute("height","32");ns.style.width="32px";ns.style.height="32px";ns.style.marginRight="14px";ns.style.verticalAlign="middle";ns.style.flex="0 0 auto";}
h3.style.display="flex";
h3.style.alignItems="center";
break;
}
}
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();

/* --- site-wide scroll animations --- */
// Autonomi/LynZ — site-wide GSAP scroll animations
// Loads after the existing webflow-animated-icons.js script (which loads GSAP + ScrollTrigger).
// Adds: section reveals, word-split headings, parallax, count-ups, navbar morph, card hover,
// alternating slide-ins, mask reveals, and pinned hero scrub.
(function(){
  function ready(cb){
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  }
  function loadGsap(cb){
    if(window.gsap && window.ScrollTrigger){ cb(); return; }
    if(window.gsap && !window.ScrollTrigger){
      var st = document.createElement("script");
      st.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
      st.onload = cb;
      document.head.appendChild(st);
      return;
    }
    var g = document.createElement("script");
    g.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    g.onload = function(){
      var st = document.createElement("script");
      st.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
      st.onload = cb;
      document.head.appendChild(st);
    };
    document.head.appendChild(g);
  }

  function splitWords(el){
    if(el.dataset.lzSplit) return;
    el.dataset.lzSplit = "1";
    var html = "";
    var nodes = Array.from(el.childNodes);
    nodes.forEach(function(n){
      if(n.nodeType === 3){
        var parts = n.textContent.split(/(\s+)/);
        parts.forEach(function(p){
          if(/\s/.test(p)) html += p;
          else if(p.length) html += "<span class='lz-word' style='display:inline-block;will-change:transform,opacity'>" + p + "</span>";
        });
      } else {
        html += n.outerHTML || n.textContent;
      }
    });
    el.innerHTML = html;
  }

  function init(){
    var g = window.gsap;
    var ST = window.ScrollTrigger;
    if(!g || !ST) return;
    g.registerPlugin(ST);
    g.config({ nullTargetWarn: false });

    // ---------- 1. Word-split headings ----------
    document.querySelectorAll("h1, h2, .lynz-hero h3, .au-section-header h2").forEach(function(h){
      if(h.querySelector("svg")) return; // skip if contains svg
      // skip if heading is already in viewport on load (avoids stuck-hidden state)
      var rect = h.getBoundingClientRect();
      var initiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      splitWords(h);
      var words = h.querySelectorAll(".lz-word");
      if(!words.length) return;
      if(initiallyVisible) return; // leave hero/above-fold headings as-is
      g.set(words, { yPercent: 110, opacity: 0, rotate: 6 });
      g.to(words, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.9,
        stagger: 0.045,
        ease: "expo.out",
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: h, start: "top 95%", once: true }
      });
    });

    // ---------- 2. Paragraph subtle slide (no opacity to avoid hiding content) ----------
    // intentionally skipped — opacity-based fades caused content to disappear when ScrollTriggers
    // mis-fired. Paragraphs stay in their natural visible state.

    // ---------- 3. Section card reveals (stagger children) ----------
    document.querySelectorAll(".lynz-trio-grid, .lynz-feat-section, .au-section, .lynz-stats-section, .lynz-faq, .lynz-cta-section").forEach(function(sec){
      var kids = sec.querySelectorAll(".lynz-trio-card, .lynz-feat-visual, .lynz-stat, .lynz-faq-item, .au-pricing-card, .au-btn, .au-btn-secondary, .au-badge, .au-label");
      if(!kids.length) return;
      g.from(kids, {
        y: 70,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "opacity,transform",
        immediateRender: false,
        scrollTrigger: { trigger: sec, start: "top 95%", once: true }
      });
    });

    // ---------- 4. Pricing compare rows: alternating slide-in ----------
    document.querySelectorAll(".lynz-compare-row").forEach(function(row, i){
      var fromX = i % 2 === 0 ? -40 : 40;
      g.from(row, {
        x: fromX,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "opacity,transform",
        immediateRender: false,
        scrollTrigger: { trigger: row, start: "top 95%", once: true }
      });
    });

    // ---------- 5. Hero screenshot parallax + tilt ----------
    var heroShot = document.querySelector(".lynz-hero-screenshot, .lynz-screenshot-body");
    if(heroShot){
      g.to(heroShot, {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: heroShot, start: "top bottom", end: "bottom top", scrub: 1 }
      });
      g.fromTo(heroShot, { rotateX: 8, scale: 0.96 }, {
        rotateX: 0,
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: heroShot, start: "top 85%", toggleActions: "play none none reverse" }
      });
    }

    // ---------- 6. Generic image / icon parallax ----------
    document.querySelectorAll(".lynz-feat-visual, .lynz-trio-icon, .au-section img, .lynz-hero img").forEach(function(el){
      g.to(el, {
        y: -25,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 }
      });
    });

    // ---------- 7. Number count-ups ----------
    document.querySelectorAll(".lynz-stat-num, .lynz-stat-value, [data-count-up]").forEach(function(el){
      var raw = el.textContent.trim();
      var m = raw.match(/^([^\d.-]*)([\d,.]+)([^\d]*)$/);
      if(!m) return;
      var prefix = m[1] || "", target = parseFloat(m[2].replace(/,/g, "")), suffix = m[3] || "";
      if(isNaN(target)) return;
      var ob = { v: 0 };
      g.to(ob, {
        v: target,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        onUpdate: function(){
          var n = ob.v;
          var formatted = target >= 1000 ? Math.round(n).toLocaleString() : (target % 1 === 0 ? Math.round(n) : n.toFixed(1));
          el.textContent = prefix + formatted + suffix;
        }
      });
    });

    // ---------- 8. Navbar morph on scroll ----------
    var nav = document.querySelector(".lynz-nav, nav.au-nav, nav");
    if(nav){
      ST.create({
        start: "top -60",
        end: 99999,
        toggleClass: { className: "lz-nav-scrolled", targets: nav }
      });
    }

    // ---------- 9. Card hover lift (delegated) ----------
    var hoverSel = ".lynz-trio-card, .au-pricing-card, .lynz-faq-item, .lz-card";
    document.querySelectorAll(hoverSel).forEach(function(card){
      if(card.dataset.lzHover) return;
      card.dataset.lzHover = "1";
      card.addEventListener("mouseenter", function(){
        g.to(card, { y: -10, scale: 1.02, duration: 0.4, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", function(){
        g.to(card, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
      });
    });

    // ---------- 10. Feature sections: alternating slide-in ----------
    document.querySelectorAll(".lynz-feat-section").forEach(function(sec, i){
      var visual = sec.querySelector(".lynz-feat-visual");
      var text = sec.querySelector(".lynz-feat-text, .lynz-feat-content");
      if(visual){
        g.from(visual, {
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
          immediateRender: false,
          scrollTrigger: { trigger: sec, start: "top 95%", once: true }
        });
      }
      if(text){
        g.from(text, {
          x: i % 2 === 0 ? 80 : -80,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
          immediateRender: false,
          scrollTrigger: { trigger: sec, start: "top 95%", once: true }
        });
      }
    });

    // ---------- 11. Floating subtle motion (badges, icons) ----------
    document.querySelectorAll(".au-badge, .au-label, .lynz-nav-logo-accent").forEach(function(el, i){
      g.to(el, {
        y: -6,
        duration: 2 + (i % 3) * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });

    // ---------- 12. CTA pulse on view ----------
    document.querySelectorAll(".lynz-nav-cta, .au-btn-primary, .au-btn").forEach(function(btn){
      g.from(btn, {
        scale: 0.85,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2)",
        clearProps: "opacity,transform",
        immediateRender: false,
        scrollTrigger: { trigger: btn, start: "top 98%", once: true }
      });
    });

    // ---------- 13. AI Chip animation in #sc-flow-viz (Agentic Supply Chain) ----------
    (function buildAiChip(){
      var host = document.getElementById("sc-flow-viz");
      if(!host || host.dataset.lzChip) return;
      host.dataset.lzChip = "1";
      host.innerHTML = "";
      host.style.cssText = "position:relative;width:100%;max-width:980px;margin:24px auto 8px;aspect-ratio:5/2;overflow:visible";

      var NS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(NS,"svg");
      svg.setAttribute("viewBox","0 0 1000 400");
      svg.setAttribute("preserveAspectRatio","xMidYMid meet");
      svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";

      // background glow
      var defs = document.createElementNS(NS,"defs");
      defs.innerHTML =
        '<radialGradient id="lzChipGlow" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" stop-color="#00BFFF" stop-opacity=".35"/>' +
          '<stop offset="60%" stop-color="#00BFFF" stop-opacity=".05"/>' +
          '<stop offset="100%" stop-color="#00BFFF" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="lzChipFill" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#0a1428"/>' +
          '<stop offset="100%" stop-color="#020610"/>' +
        '</linearGradient>' +
        '<filter id="lzChipBlur" x="-50%" y="-50%" width="200%" height="200%">' +
          '<feGaussianBlur stdDeviation="6"/>' +
        '</filter>';
      svg.appendChild(defs);

      // ambient halo
      var halo = document.createElementNS(NS,"circle");
      halo.setAttribute("cx","500"); halo.setAttribute("cy","200"); halo.setAttribute("r","260");
      halo.setAttribute("fill","url(#lzChipGlow)");
      svg.appendChild(halo);

      // outer chip body (rounded square)
      var chip = document.createElementNS(NS,"rect");
      chip.setAttribute("x","380"); chip.setAttribute("y","80");
      chip.setAttribute("width","240"); chip.setAttribute("height","240");
      chip.setAttribute("rx","28"); chip.setAttribute("ry","28");
      chip.setAttribute("fill","url(#lzChipFill)");
      chip.setAttribute("stroke","#00BFFF"); chip.setAttribute("stroke-width","2");
      svg.appendChild(chip);

      // inner die
      var die = document.createElementNS(NS,"rect");
      die.setAttribute("x","430"); die.setAttribute("y","130");
      die.setAttribute("width","140"); die.setAttribute("height","140");
      die.setAttribute("rx","12"); die.setAttribute("ry","12");
      die.setAttribute("fill","none");
      die.setAttribute("stroke","#ffffff"); die.setAttribute("stroke-width","1.5");
      die.setAttribute("stroke-opacity",".7");
      svg.appendChild(die);

      // center "AI" label
      var label = document.createElementNS(NS,"text");
      label.setAttribute("x","500"); label.setAttribute("y","210");
      label.setAttribute("text-anchor","middle"); label.setAttribute("dominant-baseline","middle");
      label.setAttribute("font-family","Inter, system-ui, sans-serif");
      label.setAttribute("font-size","48"); label.setAttribute("font-weight","800");
      label.setAttribute("fill","#00BFFF"); label.setAttribute("letter-spacing","2");
      label.textContent = "AI";
      svg.appendChild(label);

      // grid lines inside die
      for(var gx=0; gx<5; gx++){
        var l = document.createElementNS(NS,"line");
        l.setAttribute("x1", 430 + gx*35); l.setAttribute("y1","130");
        l.setAttribute("x2", 430 + gx*35); l.setAttribute("y2","270");
        l.setAttribute("stroke","#00BFFF"); l.setAttribute("stroke-opacity",".15"); l.setAttribute("stroke-width","1");
        svg.appendChild(l);
      }
      for(var gy=0; gy<5; gy++){
        var l2 = document.createElementNS(NS,"line");
        l2.setAttribute("x1","430"); l2.setAttribute("y1", 130 + gy*35);
        l2.setAttribute("x2","570"); l2.setAttribute("y2", 130 + gy*35);
        l2.setAttribute("stroke","#00BFFF"); l2.setAttribute("stroke-opacity",".15"); l2.setAttribute("stroke-width","1");
        svg.appendChild(l2);
      }

      // 16 pins per side, each with a trace running outward to a node
      var sides = [
        {axis:"top",    fixed:"y", from:80,  outward:-1, count:8},
        {axis:"bottom", fixed:"y", from:320, outward: 1, count:8},
        {axis:"left",   fixed:"x", from:380, outward:-1, count:8},
        {axis:"right",  fixed:"x", from:620, outward: 1, count:8}
      ];
      var traces = [];
      var nodes = [];
      sides.forEach(function(side){
        for(var i=0;i<side.count;i++){
          var t = (i+0.5)/side.count;
          var px,py,nx,ny;
          if(side.axis==="top" || side.axis==="bottom"){
            px = 380 + t*240; py = side.from;
            nx = px; ny = py + side.outward*70;
          } else {
            py = 80 + t*240; px = side.from;
            nx = px + side.outward*70; ny = py;
          }
          // pin (small rect on chip edge)
          var pin = document.createElementNS(NS,"rect");
          var pw = (side.axis==="top"||side.axis==="bottom") ? 6 : 14;
          var ph = (side.axis==="top"||side.axis==="bottom") ? 14 : 6;
          var poff = side.outward*7;
          pin.setAttribute("x", (px - pw/2));
          pin.setAttribute("y", (py - ph/2 + (side.axis==="top"||side.axis==="bottom"? poff : 0)));
          if(side.axis==="left"||side.axis==="right"){
            pin.setAttribute("x", (px - pw/2 + poff));
            pin.setAttribute("y", (py - ph/2));
          }
          pin.setAttribute("width", pw); pin.setAttribute("height", ph);
          pin.setAttribute("fill","#00BFFF"); pin.setAttribute("opacity",".8");
          svg.appendChild(pin);

          // trace line
          var tr = document.createElementNS(NS,"line");
          tr.setAttribute("x1", px); tr.setAttribute("y1", py);
          tr.setAttribute("x2", nx); tr.setAttribute("y2", ny);
          tr.setAttribute("stroke","#00BFFF"); tr.setAttribute("stroke-width","1.5");
          tr.setAttribute("stroke-opacity",".5");
          svg.appendChild(tr);
          traces.push(tr);

          // node at trace end
          var nd = document.createElementNS(NS,"circle");
          nd.setAttribute("cx", nx); nd.setAttribute("cy", ny); nd.setAttribute("r","4");
          nd.setAttribute("fill","#ffffff"); nd.setAttribute("opacity",".9");
          svg.appendChild(nd);
          nodes.push(nd);
        }
      });

      host.appendChild(svg);

      // Animations
      g.set([chip, die, label], { transformOrigin: "500px 200px" });
      g.from(chip, { scale: 0.6, opacity: 0, duration: 1.0, ease: "back.out(1.6)",
        scrollTrigger: { trigger: host, start: "top 90%", once: true }, immediateRender: false, clearProps: "all" });
      g.from(die,  { scale: 0.6, opacity: 0, duration: 0.9, ease: "back.out(1.6)", delay: 0.15,
        scrollTrigger: { trigger: host, start: "top 90%", once: true }, immediateRender: false, clearProps: "all" });
      g.from(label,{ scale: 0.4, opacity: 0, duration: 0.9, ease: "back.out(2)", delay: 0.25,
        scrollTrigger: { trigger: host, start: "top 90%", once: true }, immediateRender: false, clearProps: "all" });
      g.from(traces, { opacity: 0, stagger: 0.03, duration: 0.6, ease: "power2.out", delay: 0.4,
        scrollTrigger: { trigger: host, start: "top 90%", once: true }, immediateRender: false, clearProps: "all" });
      g.from(nodes,  { scale: 0, opacity: 0, stagger: 0.02, duration: 0.4, ease: "back.out(2)", delay: 0.6, transformOrigin: "center center",
        scrollTrigger: { trigger: host, start: "top 90%", once: true }, immediateRender: false, clearProps: "all" });

      // Pulse loop on the AI label
      g.to(label, { scale: 1.06, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // Subtle floating halo
      g.to(halo, { scale: 1.08, transformOrigin: "500px 200px", duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // Traveling pulse along traces (random nodes light up)
      function pulse(){
        var idx = Math.floor(Math.random()*nodes.length);
        var nd = nodes[idx];
        g.fromTo(nd, { r: 4, fill: "#ffffff" }, { r: 8, fill: "#00BFFF", duration: 0.45, yoyo: true, repeat: 1, ease: "sine.out" });
      }
      setInterval(pulse, 350);
    })();

    // ---------- 14. Refresh after images load ----------
    window.addEventListener("load", function(){ ST.refresh(); });
  }

  ready(function(){
    loadGsap(init);
  });
})();
