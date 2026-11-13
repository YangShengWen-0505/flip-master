/* Original gentle pentatonic loop, synthesized locally. No external soundtrack. */
(()=>{
 let enabled=true,ctx,bus,timer,started=false,next=0,step=0;
 const notes=new Set(),buttons=[...document.querySelectorAll('[data-music]')];
 try{enabled=localStorage.getItem('fm-music')!=='off'}catch{}
 const melody=[64,67,69,67,64,62,60,null,62,64,67,72,69,67,64,null,69,72,74,72,69,67,64,null,67,64,62,60,62,64,60,null];
 const chords=[[48,55,64],[45,52,60],[41,48,57],[43,50,62]];
 const frequency=n=>440*Math.pow(2,(n-69)/12);
 function label(){buttons.forEach(b=>{b.textContent=enabled?'♫ 音樂：開':'♫ 音樂：關';b.setAttribute('aria-pressed',String(enabled))})}
 function tone(note,time,length,volume){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=frequency(note);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.035);g.gain.exponentialRampToValueAtTime(.0001,time+length);o.connect(g);g.connect(bus);notes.add(o);o.onended=()=>{notes.delete(o);o.disconnect();g.disconnect()};o.start(time);o.stop(time+length+.03)}
 function schedule(){if(!ctx||ctx.state!=='running'||!enabled||document.hidden)return;if(next<ctx.currentTime)next=ctx.currentTime+.05;while(next<ctx.currentTime+.3){const note=melody[step%melody.length];if(note!==null){tone(note,next,.7,.2);tone(note+12,next,.35,.025)}if(step%8===0)chords[Math.floor(step/8)%4].forEach((n,i)=>tone(n,next+i*.08,3.3,.075));step++;next+=.43}}
 async function start(){if(!enabled||document.hidden||timer)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!ctx){ctx=new Audio();bus=ctx.createGain();bus.gain.value=.23;bus.connect(ctx.destination)}await ctx.resume();if(!enabled||document.hidden||timer)return;next=ctx.currentTime+.08;schedule();timer=setInterval(schedule,100)}catch{}}
 function stop(){clearInterval(timer);timer=null;for(const o of notes){try{o.stop()}catch{}}notes.clear();if(ctx?.state==='running')ctx.suspend().catch(()=>{})}
 function activate(){started=true;start()}
 document.addEventListener('pointerdown',activate,{passive:true});document.addEventListener('keydown',activate);
 buttons.forEach(b=>b.onclick=()=>{enabled=!enabled;try{localStorage.setItem('fm-music',enabled?'on':'off')}catch{}label();if(enabled){started=true;start()}else stop()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(started)start()});window.addEventListener('pagehide',stop);label();
})();
