/* Original cafe jazz: soft electric piano, walking bass and brushed percussion, synthesized locally. No external soundtrack. */
(()=>{
 let enabled=true,ctx,bus,timer,started=false,next=0,step=0;
 const notes=new Set(),buttons=[...document.querySelectorAll('[data-music]')];
 try{enabled=localStorage.getItem('fm-music')!=='off'}catch{}
 const melody=[76,null,74,71,null,67,69,null,72,null,71,67,64,null,62,null,69,null,72,76,null,74,72,69,71,null,69,65,62,null,67,null,76,null,79,78,76,null,74,71,72,null,76,74,72,71,69,null,69,72,null,76,74,null,72,69,71,null,74,72,69,67,64,null];
 const chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,65]];
 const bass=[36,33,38,31];
 const frequency=n=>440*Math.pow(2,(n-69)/12);
 function label(){buttons.forEach(b=>{b.textContent=enabled?'♫ 音樂：開':'♫ 音樂：關';b.setAttribute('aria-pressed',String(enabled))})}
 function tone(note,time,length,volume){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=frequency(note);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.035);g.gain.exponentialRampToValueAtTime(.0001,time+length);o.connect(g);g.connect(bus);notes.add(o);o.onended=()=>{notes.delete(o);o.disconnect();g.disconnect()};o.start(time);o.stop(time+length+.03)}
 function piano(note,time,length,volume){tone(note,time,length,volume);tone(note+12,time,length*.45,volume*.23);tone(note+19,time,length*.2,volume*.055)}
 function brush(time){const buffer=ctx.createBuffer(1,ctx.sampleRate*.12,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*.024));const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type='highpass';filter.frequency.value=4200;gain.gain.value=.035;source.connect(filter);filter.connect(gain);gain.connect(bus);notes.add(source);source.onended=()=>{notes.delete(source);source.disconnect();filter.disconnect();gain.disconnect()};source.start(time)}
 function schedule(){if(!ctx||ctx.state!=='running'||!enabled||document.hidden)return;if(next<ctx.currentTime)next=ctx.currentTime+.05;while(next<ctx.currentTime+.3){const beat=step%8,bar=Math.floor(step/8)%4,note=melody[step%melody.length];if(note!==null)piano(note,next,1.1,beat%2?.085:.12);if(beat===0||beat===5)chords[bar].forEach((n,i)=>piano(n,next+i*.012,1.8,.055));if(beat%2===0){tone(bass[bar]+[0,7,12,7][beat/2],next,.65,.24);brush(next)}step++;next+=(step%2? .43:.30)}}
 async function start(){if(!enabled||document.hidden||timer)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!ctx){ctx=new Audio();bus=ctx.createGain();bus.gain.value=.3;bus.connect(ctx.destination)}await ctx.resume();if(!enabled||document.hidden||timer)return;next=ctx.currentTime+.08;schedule();timer=setInterval(schedule,100)}catch{}}
 function stop(){clearInterval(timer);timer=null;for(const o of notes){try{o.stop()}catch{}}notes.clear();if(ctx?.state==='running')ctx.suspend().catch(()=>{})}
 function activate(){started=true;start()}
 document.addEventListener('pointerdown',activate,{passive:true});document.addEventListener('keydown',activate);
 buttons.forEach(b=>b.onclick=()=>{enabled=!enabled;try{localStorage.setItem('fm-music',enabled?'on':'off')}catch{}label();if(enabled){started=true;start()}else stop()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(started)start()});window.addEventListener('pagehide',stop);label();
})();
