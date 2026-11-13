(()=>{
 let context,master,enabled=true,burstTimer;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),voices=new Set();
 try{enabled=localStorage.getItem('fm-sound')!=='off'}catch{}
 const toggle=document.getElementById('soundToggle');
 function label(){toggle.textContent=enabled?'♪ 音效：開':'♪ 音效：關';toggle.setAttribute('aria-pressed',String(enabled))}
 function unlock(){if(!enabled)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!context){context=new Audio();master=context.createGain();master.gain.value=.18;master.connect(context.destination)}if(context.state==='suspended')context.resume().catch(()=>{})}catch{}}
 function tone(freq,delay,length,type='sine'){if(!enabled)return;unlock();if(!context||!master)return;try{const o=context.createOscillator(),g=context.createGain(),t=context.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+.012);g.gain.exponentialRampToValueAtTime(.001,t+length);o.connect(g);g.connect(master);voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect()};o.start(t);o.stop(t+length+.02)}catch{}}
 function silence(){for(const o of voices){try{o.stop()}catch{}}voices.clear()}
 toggle.onclick=()=>{enabled=!enabled;if(!enabled)silence();else{unlock();tone(660,0,.12)}try{localStorage.setItem('fm-sound',enabled?'on':'off')}catch{}label()};label();
 document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
 function clear(){clearTimeout(burstTimer);document.getElementById('celebration')?.remove();document.getElementById('board').classList.remove('board-win');silence()}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
 function flip(indices){tone(480,0,.075,'triangle');tone(720,.035,.09);if(reduced.matches)return;const cells=document.querySelectorAll('#board .tile');indices.forEach(i=>{const b=cells[i];if(!b)return;b.animate([{transform:'perspective(400px) rotateY(-80deg) scale(.92)'},{transform:'perspective(400px) rotateY(0deg) scale(1.05)',offset:.7},{transform:'scale(1)'}],{duration:320,easing:'ease-out'})})}
 function win(){[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,.13*i,.28));if(reduced.matches)return;const board=document.getElementById('board');board.classList.add('board-win');const burst=document.createElement('div');burst.id='celebration';burst.setAttribute('aria-hidden','true');for(let i=0;i<30;i++){const p=document.createElement('i');p.style.setProperty('--x',(Math.random()*100)+'%');p.style.setProperty('--drift',(Math.random()*180-90)+'px');p.style.setProperty('--delay',(Math.random()*.35)+'s');p.style.background=['#f47458','#90e0da','#ffe2a0'][i%3];burst.append(p)}document.body.append(burst);burstTimer=setTimeout(()=>{burst.remove();board.classList.remove('board-win')},2200)}
 window.Effects={flip,win,clear};
})();
