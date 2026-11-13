/* Google Apps Script transport. Only acknowledged writes leave the durable queue. */
(()=>{
 const classroom={endpoint:'https://script.google.com/macros/s/AKfycbyhoRjHHdJc340fTca57a_uZfygt4x_OXRV4GFQ5LDY-ENfshdnDbLKVhXBzkNtQLUX/exec',key:'4237b125-c061-4fd4-8f02-4745c25aa2fe4a98a36c-16ec-408f-8aef-2797a4d3dbbd'};
 let outbox=read('fm-outbox',{}),owners=read('fm-owners',{}),revisions=read('fm-revisions',{}),busy=false,teacherSecret='',generation=0,reading=false;
 const validEndpoint=u=>/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(u||'');
 const configured=()=>validEndpoint(classroom.endpoint)&&typeof classroom.key==='string'&&classroom.key.length>=32;
 if(configured()){write('fm-classroom',classroom);history.replaceState(null,'',location.pathname+location.search)}

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
  if(busy)return;const next=Object.entries(outbox)[0];if(!next){if(configured())status(Object.keys(revisions).length?'紀錄已同步給老師 ✓':'課堂已連線・開始挑戰後會自動記錄');return}if(!navigator.onLine){status('目前離線・紀錄已保留，恢復網路後自動補傳');return}
  busy=true;const [id,item]=next;
  try{status('正在送出探索紀錄…');const ack=await request(item.endpoint,{action:'write',key:item.key,record:item.record,owner:item.owner,revision:item.revision});if(ack.id!==id||ack.revision<item.revision)throw Error('收件版本不符');if(outbox[id]?.revision===item.revision){delete outbox[id];saveQueue()}status(Object.keys(outbox).length?'最新步驟待同步，請保持網頁開啟…':'老師已收到最新紀錄 ✓')}
  catch(e){status('尚未送達・已保留並會自動重試：'+(e.name==='AbortError'?'連線逾時':e.message))}finally{busy=false}
 }
 async function poll(){
  if(!teacherSecret||reading||$('teacher').hidden||document.hidden)return;reading=true;const gen=generation,secret=teacherSecret,endpoint=classroom.endpoint;
  try{let cursor=2,result=[];do{const page=await request(endpoint,{action:'read',key:secret,cursor});if(gen!==generation)return;if(!Array.isArray(page.records)||!page.records.every(valid))throw Error('紀錄格式不正確');result.push(...page.records);cursor=page.next}while(cursor);
   if(gen!==generation)return;collected=result;teacher();$('teacherLogin').hidden=true;$('teacherDashboard').hidden=false;$('teacherStatus').textContent=`已更新 ${result.length} 筆紀錄・${new Date().toLocaleTimeString('zh-TW')}・每 10 秒更新`;
  }catch(e){if(gen===generation){$('teacherStatus').textContent='登入或更新失敗：'+e.message;if($('teacherDashboard').hidden)teacherSecret=''}}finally{reading=false}
 }
 const handle=fn=>async()=>{try{await fn()}catch(e){notify(e.message)}};
 $('teacherForm').onsubmit=async e=>{e.preventDefault();if(reading)return;const secret=$('teacherKey').value.trim();if(!secret)return;$('teacherConnect').disabled=true;$('teacherStatus').textContent='正在驗證管理密碼…';teacherSecret=secret;generation++;collected=[];teacher();await poll();$('teacherConnect').disabled=false;if(teacherSecret)$('teacherKey').value=''};
 $('teacherLogout').onclick=()=>{teacherSecret='';generation++;collected=[];teacher();$('teacherDashboard').hidden=true;$('teacherLogin').hidden=false;$('teacherKey').value='';$('teacherStatus').textContent='已登出老師觀察室';};
 $('cloudFetch').onclick=handle(async()=>{if(!teacherSecret)throw Error('請先輸入管理密碼登入');await poll()});
 window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(!document.hidden){flush();poll()}});
 window.addEventListener('beforeunload',e=>{if(Object.keys(outbox).length){e.preventDefault();e.returnValue=''}});
 setInterval(flush,3000);setInterval(poll,10000);
 status(configured()?'課堂已連結・新探索將自動送出':'個人練習模式・請用老師提供的課堂連結進入');flush();
})();
