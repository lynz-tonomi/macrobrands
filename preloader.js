(function(){
// MACRO BRANDS Particle Preloader — matches hero logo position exactly
var ov=document.createElement('div');
ov.id='preloader';
ov.style.cssText='position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center';
document.body.prepend(ov);
// Prevent scroll during preloader
document.body.style.overflow='hidden';

var c=document.createElement('canvas');
var dpr=window.devicePixelRatio||1;
// Size canvas to fill viewport, position logo at 75% height to match hero
var vw=window.innerWidth,vh=window.innerHeight;
c.width=vw*dpr;c.height=vh*dpr;
c.style.cssText='width:100%;height:100%';
ov.appendChild(c);
var ctx=c.getContext('2d');
ctx.scale(dpr,dpr);

var W=vw,H=vh;
var particles=[],t=0,running=true;
var COL='#ffffff';

// Logo dimensions matching hero: 42vw, max 550px, centered at 75vh
var logoW=Math.min(vw*.42,550);
var logoH=logoW*.28; // aspect ratio of MACRO BRANDS text
var logoX=(vw-logoW)/2;
var logoY=vh*.75-logoH/2;
var fontSize=Math.round(logoW*.1); // scale font to logo width

function getTextPixels(text,font,x,y){
  var tc=document.createElement('canvas');tc.width=W;tc.height=H;
  var tx=tc.getContext('2d');tx.font=font;tx.fillStyle='#fff';tx.textBaseline='middle';tx.fillText(text,x,y);
  var d=tx.getImageData(0,0,W,H).data,pts=[];
  var step=3;
  for(var py=0;py<H;py+=step)for(var px=0;px<W;px+=step){
    if(d[(py*W+px)*4+3]>128)pts.push({tx:px,ty:py});
  }
  return pts;
}

function init(){
  particles=[];t=0;running=true;
  var boldFont='bold '+fontSize+'px -apple-system,BlinkMacSystemFont,sans-serif';
  var lightFont='300 '+fontSize+'px -apple-system,BlinkMacSystemFont,sans-serif';
  var tmFont='300 '+Math.round(fontSize*.4)+'px -apple-system,sans-serif';

  // Measure text widths to center properly
  ctx.font=boldFont;
  var macroW=ctx.measureText('MACRO').width;
  ctx.font=lightFont;
  var brandsW=ctx.measureText(' BRANDS').width;
  var totalW=macroW+brandsW;
  var startX=(vw-totalW)/2;
  var cy=vh*.75;

  var p1=getTextPixels('MACRO',boldFont,startX,cy);
  var p2=getTextPixels(' BRANDS',lightFont,startX+macroW,cy);
  var p3=getTextPixels('\u2122',tmFont,startX+totalW+4,cy-fontSize*.35);
  var all=p1.concat(p2).concat(p3);
  var step=Math.max(1,Math.floor(all.length/800));
  for(var i=0;i<all.length;i+=step){
    var pt=all[i];
    var angle=Math.random()*Math.PI*2;
    var dist=200+Math.random()*500;
    particles.push({
      x:pt.tx+Math.cos(angle)*dist,
      y:pt.ty+Math.sin(angle)*dist,
      tx:pt.tx,ty:pt.ty,
      size:1+Math.random()*2.5,
      speed:.018+Math.random()*.04,
      delay:Math.random()*.4,
      alpha:0
    });
  }
  // Store text params for crisp overlay
  window._preloaderText={boldFont:boldFont,lightFont:lightFont,tmFont:tmFont,startX:startX,macroW:macroW,totalW:totalW,cy:cy,fontSize:fontSize};
}

function drawFrame(){
  ctx.clearRect(0,0,W,H);
  t+=.012; // Faster: ~3 seconds total
  if(t>2.5){running=false;t=2.5}

  particles.forEach(function(p){
    if(t<p.delay)return;
    var lt=Math.min((t-p.delay)/.8,1);
    var ease=1-Math.pow(1-lt,3);
    p.x+=(p.tx-p.x)*p.speed*4;
    p.y+=(p.ty-p.y)*p.speed*4;
    p.alpha=ease;
    ctx.save();
    ctx.fillStyle=COL;
    if(lt<.85){
      ctx.globalAlpha=p.alpha*.8;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size*(1+(.85-lt)*.8),0,Math.PI*2);
      ctx.fill();
      var dx=p.tx-p.x,dy=p.ty-p.y;
      ctx.globalAlpha=p.alpha*.15;
      ctx.beginPath();ctx.arc(p.x-dx*.08,p.y-dy*.08,p.size*.4,0,Math.PI*2);ctx.fill();
    } else {
      ctx.globalAlpha=p.alpha;
      ctx.fillRect(p.tx,p.ty,2,2);
    }
    ctx.restore();
  });

  // Crisp text overlay after particles settle
  if(t>1.2){
    var T=window._preloaderText;
    var ta=Math.min((t-1.2)/.4,1);
    ctx.save();
    ctx.globalAlpha=ta;
    ctx.fillStyle=COL;
    ctx.textBaseline='middle';
    ctx.font=T.boldFont;
    ctx.fillText('MACRO',T.startX,T.cy);
    ctx.font=T.lightFont;
    ctx.fillText(' BRANDS',T.startX+T.macroW,T.cy);
    ctx.font=T.tmFont;
    ctx.globalAlpha=ta*.5;
    ctx.fillText('\u2122',T.startX+T.totalW+4,T.cy-T.fontSize*.35);
    ctx.restore();

    // Subtle glow
    if(t>1.8){
      var gp=Math.sin((t-1.8)*4)*.15+.15;
      ctx.save();
      ctx.globalAlpha=gp*.06;
      ctx.shadowColor='#fff';ctx.shadowBlur=40;
      ctx.fillStyle='#fff';
      ctx.textBaseline='middle';
      ctx.font=T.boldFont;
      ctx.fillText('MACRO',T.startX,T.cy);
      ctx.font=T.lightFont;
      ctx.fillText(' BRANDS',T.startX+T.macroW,T.cy);
      ctx.restore();
    }
  }

  if(running){
    requestAnimationFrame(drawFrame);
  } else {
    // Fade out preloader — hero logo is in exact same position underneath
    setTimeout(function(){
      ov.style.transition='opacity .6s ease-out';
      ov.style.opacity='0';
      document.body.style.overflow='';
      setTimeout(function(){ov.remove()},600);
    },400);
  }
}

init();drawFrame();
})();
