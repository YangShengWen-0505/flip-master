/* Google Apps Script transport. Only acknowledged writes leave the durable queue. */
(()=>{
 const incoming=new URLSearchParams(location.hash.slice(1)),saved=read('fm-classroom',{});
 let classroom=incoming.has('endpoint')?{endpoint:incoming.get('endpoint'),key:incoming.get('room')}:saved;
 let outbox=read('fm-outbox',{}),owners=read('fm-owners',{}),revisions=read('fm-revisions',{}),busy=false,teacherSecret='',generation=0,reading=false;
 const validEndpoint=u=>/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(u||'');
 const configured=()=>validEndpoint(classroom.endpoint)&&typeof classroom.key==='string'&&classroom.key.length>=32;
 if(configured()){write('fm-classroom',classroom);history.replaceState(null,'',location.pathname+location.search)}
 $('endpoint').value=classroom.endpoint||'';$('roomKey').value=classroom.key||'';
 function status(s){$('syncStatus').textContent=s}
 function saveQueue(){write('fm-outbox',outbox)}
 window.queueRecord=g=>{
  if(!configured())return;
  if(!owners[g.id])owners[g.id]=crypto.randomUUID()+crypto.randomUUID();
  const rev=(revisions[g.id]||0)+1;revisions[g.id]=rev;
  // Pin destination at creation. Existing attempts never migrate to another teacher.
  const old=outbox[g.id],dest=read('fm-destinations',{});if(!dest[g.id]){dest[g.id]={...classroom};write('fm-destinations',dest)}
  outbox[g.id]={record:JSON.parse(JSON.stringify(g)),owner:owners[g.id],revision:rev,endpoint:dest[g.id].endpoint,key:dest[g.id].key};
  write('fm-owners',owners);write('fm-revisions',revisions);saveQueue();status('已保存，正在排隊送給老師…');
 };
 async function request(endpoint,data){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
  try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data),redirect:'follow',signal:controller.signal});if(!res.ok)throw Error('Google 連線失敗');const result=await res.json();if(!result.ok)throw Error(result.error||'伺服器未確認收件');return result}finally{clearTimeout(timer)}
 }
 async function flush(){
  if(busy)return;const next=Object.entries(outbox)[0];if(!next){if(configured())status('課堂已連結・所有排隊紀錄都已送達老師');return}if(!navigator.onLine){status('目前離線・紀錄已保留，恢復網路後自動補傳');return}
  busy=true;const [id,item]=next;
  try{status('正在送出探索紀錄…');const ack=await request(item.endpoint,{action:'write',key:item.key,record:item.record,owner:item.owner,revision:item.revision});if(ack.id!==id||ack.revision<item.revision)throw Error('收件版本不符');if(outbox[id]?.revision===item.revision){delete outbox[id];saveQueue()}status(Object.keys(outbox).length?'最新步驟待同步，請保持網頁開啟…':'老師已收到最新紀錄 ✓')}
  catch(e){status('尚未送達・已保留並會自動重試：'+(e.name==='AbortError'?'連線逾時':e.message))}finally{busy=false}
 }
 async function poll(){
  if(!teacherSecret||reading||$('teacher').hidden||document.hidden)return;reading=true;const gen=generation,secret=teacherSecret,endpoint=classroom.endpoint;
  try{let cursor=2,result=[];do{const page=await request(endpoint,{action:'read',key:secret,cursor});if(gen!==generation)return;if(!Array.isArray(page.records)||!page.records.every(valid))throw Error('紀錄格式不正確');result.push(...page.records);cursor=page.next}while(cursor);
   if(gen!==generation)return;collected=result;teacher();$('teacherStatus').textContent=`已更新 ${result.length} 筆紀錄・${new Date().toLocaleTimeString('zh-TW')}・每 10 秒更新`;
  }catch(e){if(gen===generation)$('teacherStatus').textContent='更新失敗：'+e.message}finally{reading=false}
 }
 function apply(){const c={endpoint:$('endpoint').value.trim(),key:$('roomKey').value.trim()};if(!validEndpoint(c.endpoint)||c.key.length<32)throw Error('請填入部署的 /exec 網址與完整學生課堂碼');const changed=c.endpoint!==classroom.endpoint||c.key!==classroom.key;classroom=c;write('fm-classroom',c);if(changed){teacherSecret='';generation++;collected=[];teacher()}status('課堂已連結，新的探索將自動送給老師');}
 const handle=fn=>async()=>{try{await fn()}catch(e){notify(e.message)}};
 $('connect').onclick=handle(()=>{apply();notify('課堂已啟用。開始新挑戰後，每一步都會自動送出。')});
 $('studentLink').onclick=handle(()=>{apply();const url=new URL(location.href);url.hash=new URLSearchParams({endpoint:classroom.endpoint,room:classroom.key}).toString();$('shareLink').value=url.href;notify('學生連結已產生，可複製給全班。連結不包含老師管理密碼。')});
 $('teacherConnect').onclick=handle(async()=>{apply();const secret=$('teacherKey').value.trim();if(secret.length<32)throw Error('請填寫試算表「教室設定」中的老師管理密碼');teacherSecret=secret;$('teacherKey').value='';generation++;collected=[];teacher();await poll()});
 $('teacherLogout').onclick=()=>{teacherSecret='';generation++;collected=[];teacher();$('teacherStatus').textContent='老師教室已鎖定';};
 $('cloudFetch').onclick=handle(async()=>{if(!teacherSecret)throw Error('請先開啟老師自動更新');await poll()});
 window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(!document.hidden){flush();poll()}});
 window.addEventListener('beforeunload',e=>{if(Object.keys(outbox).length){e.preventDefault();e.returnValue=''}});
 setInterval(flush,3000);setInterval(poll,10000);
 status(configured()?'課堂已連結・新探索將自動送出':'個人練習模式・請用老師提供的課堂連結進入');flush();
})();
