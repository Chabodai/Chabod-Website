(function(){
  var root=document.documentElement;
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
  function setLang(l){
    root.setAttribute('lang',l);
    store('sop-lang',l);
    document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===l?'true':'false');});
    if(lb && !lb.hidden) renderCap();
  }
  var saved=store('sop-lang');
  var nav=(navigator.language||'en').toLowerCase();
  setLang(saved==='en'||saved==='es'?saved:(nav.indexOf('es')===0?'es':'en'));
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang);});});

  var lb=document.getElementById('lb'),stage=document.getElementById('lbstage'),capEl=document.getElementById('lbcap'),cntEl=document.getElementById('lbcount');
  var prev=lb.querySelector('.lb-prev'),next=lb.querySelector('.lb-next'),closeB=lb.querySelector('.lb-close');
  var group=[],idx=0,opener=null;

  function renderCap(){
    var t=group[idx];
    capEl.textContent=root.getAttribute('lang')==='es'?t.dataset.capEs:t.dataset.capEn;
    cntEl.textContent=group.length>1?(idx+1)+' / '+group.length:'';
  }
  function show(){
    var t=group[idx];
    stage.textContent='';
    var el;
    if(t.dataset.kind==='video'){
      el=document.createElement('video');
      el.setAttribute('controls','');
      el.setAttribute('controlsList','nodownload noplaybackrate');
      el.setAttribute('disablePictureInPicture','');
      el.setAttribute('playsinline','');
      el.setAttribute('preload','metadata');
      el.setAttribute('muted','');
      el.muted=true;
      el.poster=t.dataset.poster;
      el.src=t.dataset.src;
    }else{
      el=document.createElement('img');
      el.src=t.dataset.src;
      el.alt=t.dataset.capEn;
      el.draggable=false;
    }
    el.addEventListener('contextmenu',function(e){e.preventDefault();});
    stage.appendChild(el);
    prev.hidden=next.hidden=group.length<2;
    renderCap();
  }
  function open(t){
    opener=t;
    group=Array.prototype.slice.call(t.closest('.gallery').querySelectorAll('.thumb'));
    idx=group.indexOf(t);
    lb.hidden=false;
    document.body.style.overflow='hidden';
    show();
    closeB.focus();
  }
  function close(){
    var v=stage.querySelector('video');if(v){v.pause();v.removeAttribute('src');v.load();}
    stage.textContent='';
    lb.hidden=true;
    document.body.style.overflow='';
    if(opener)opener.focus();
  }
  function step(d){var v=stage.querySelector('video');if(v)v.pause();idx=(idx+d+group.length)%group.length;show();}

  document.querySelectorAll('.thumb').forEach(function(t){
    t.addEventListener('click',function(){open(t);});
    t.addEventListener('contextmenu',function(e){e.preventDefault();});
  });
  prev.addEventListener('click',function(){step(-1);});
  next.addEventListener('click',function(){step(1);});
  closeB.addEventListener('click',close);
  lb.addEventListener('click',function(e){if(e.target===lb||e.target===stage)close();});
  document.addEventListener('keydown',function(e){
    if(lb.hidden)return;
    if(e.key==='Escape')close();
    else if(e.key==='ArrowLeft'&&group.length>1)step(-1);
    else if(e.key==='ArrowRight'&&group.length>1)step(1);
  });
  var sx=null;
  stage.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
  stage.addEventListener('touchend',function(e){
    if(sx===null||group.length<2)return;
    var dx=e.changedTouches[0].clientX-sx;sx=null;
    if(Math.abs(dx)>60)step(dx<0?1:-1);
  },{passive:true});
})();
