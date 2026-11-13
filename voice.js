/* Device speech synthesis. Independent from the Web Audio effects switch. */
(()=>{
 const toggle=document.getElementById('voiceToggle'),replay=document.getElementById('replayVoice'),status=document.getElementById('voiceStatus');
 const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window,synth=window.speechSynthesis;
 let enabled=true,last=null,sequence=0,voices=[];
 try{enabled=localStorage.getItem('fm-voice')!=='off'}catch{}
 const profiles={xiaoshi:{pitch:1.05,rate:1.03,index:0},luguang:{pitch:.78,rate:.9,index:1},qiaoling:{pitch:1.28,rate:1,index:2}};
 function label(){toggle.textContent=supported?(enabled?'◉ 語音：開':'◉ 語音：關'):'語音不支援';toggle.setAttribute('aria-pressed',String(enabled&&supported));toggle.disabled=!supported;replay.disabled=!supported||!enabled;toggle.title='裝置合成語音，與遊戲音效分開控制'}
 function load(){if(!supported)return;voices=synth.getVoices().filter(v=>/^zh|^cmn/i.test(v.lang)).sort((a,b)=>Number(/TW|HK/i.test(b.lang))-Number(/TW|HK/i.test(a.lang)))}
 function stop(){sequence++;if(supported)synth.cancel();status.textContent=''}
 function say(speaker,text){last={speaker,text};stop();if(!enabled||!supported||document.hidden||document.getElementById('play').hidden)return;load();const profile=profiles[speaker]||profiles.xiaoshi;const utterance=new SpeechSynthesisUtterance(text.replace(/(\d+)\s*×\s*(\d+)/g,'$1 乘 $2'));
 const male=voices.filter(v=>/yun|male|zhiwei/i.test(v.name)&&!/female/i.test(v.name)),female=voices.filter(v=>/female|xiaoxiao|hsiao|hanhan|huihui|ting|meijia/i.test(v.name));
 let voice=speaker==='qiaoling'?female[0]:male[speaker==='luguang'?1:0];voice=voice||voices[profile.index%Math.max(1,voices.length)];
 if(voice)utterance.voice=voice;utterance.lang=voice?.lang||'zh-TW';utterance.pitch=profile.pitch;utterance.rate=profile.rate;utterance.volume=.85;const ticket=sequence;
 utterance.onstart=()=>{if(ticket===sequence)status.textContent='正在朗讀・'+({xiaoshi:'程小時',luguang:'陸光',qiaoling:'喬苓'})[speaker]};
 utterance.onend=()=>{if(ticket===sequence)status.textContent=''};
 utterance.onerror=e=>{if(ticket===sequence&&!['canceled','interrupted'].includes(e.error))status.textContent='這台裝置暫時無法播放語音，可再按「再聽一次」。'};
 try{synth.speak(utterance)}catch{status.textContent='這台裝置暫時無法播放語音，文字仍可閱讀。'}
 }
 toggle.onclick=()=>{enabled=!enabled;try{localStorage.setItem('fm-voice',enabled?'on':'off')}catch{}label();if(!enabled)stop();else if(last)say(last.speaker,last.text)};
 replay.onclick=()=>{if(last)say(last.speaker,last.text)};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);
 if(supported){load();synth.addEventListener('voiceschanged',load)}else status.textContent='此瀏覽器不支援語音，請閱讀角色對話。';label();window.Voice={say,stop};
})();
