// Run setup once, then deploy as Web app: execute as Me, access Anyone.
function setup() {
 const p=PropertiesService.getScriptProperties();
 if(p.getProperty('SHEET_ID')) throw Error('Already set up. Open the existing spreadsheet.');
 const ss=SpreadsheetApp.create('Flip Master 學生探索紀錄');
 const student=Utilities.getUuid()+Utilities.getUuid(),teacher=Utilities.getUuid()+Utilities.getUuid();
 p.setProperties({SHEET_ID:ss.getId(),STUDENT_KEY:student,TEACHER_KEY:teacher});
 const sheet=ss.getSheets()[0];sheet.setName('紀錄');sheet.appendRow(['局數 ID','寫入憑證雜湊','版本','更新時間','班級','學生','翻動次數','狀態',...Array.from({length:30},(_,i)=>'資料'+(i+1))]);
 const settings=ss.insertSheet('教室設定');settings.getRange(1,1,4,2).setValues([['項目','值'],['學生課堂碼',student],['老師管理密碼（勿分享）',teacher],['使用方式','部署後將 /exec 網址貼到遊戲老師教室，填入這兩組資料。']]);
 console.log('已建立私人試算表：'+ss.getUrl());
}
function doGet(){return ContentService.createTextOutput(JSON.stringify({ok:true,service:'Flip Master'})).setMimeType(ContentService.MimeType.JSON)}
function doPost(e){try{return json_(handle_(JSON.parse(e.postData.contents)))}catch(error){return json_({ok:false,error:error.message})}}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function hash_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s).map(x=>(x&255).toString(16).padStart(2,'0')).join('')}
function handle_(req){
 const p=PropertiesService.getScriptProperties();
 if(!p.getProperty('SHEET_ID'))throw Error('老師尚未完成設定');
 const ss=SpreadsheetApp.openById(p.getProperty('SHEET_ID')),sheet=ss.getSheetByName('紀錄');
 if(req.action==='read'){
  if(!req.key||req.key!==p.getProperty('TEACHER_KEY'))throw Error('老師管理密碼不正確');
  const start=Math.max(2,Number(req.cursor)||2),last=sheet.getLastRow(),count=Math.min(30,Math.max(0,last-start+1));
  const data=count?sheet.getRange(start,1,count,38).getValues():[];
  return {ok:true,records:data.map(r=>JSON.parse(r.slice(8).join(''))),next:start+count<=last?start+count:null};
 }
 if(req.action!=='write'||!req.key||req.key!==p.getProperty('STUDENT_KEY'))throw Error('課堂碼不正確');
 const g=req.record;validate_(g);
 if(typeof req.owner!=='string'||req.owner.length<32||req.owner.length>100)throw Error('紀錄憑證不正確');
 if(!Number.isSafeInteger(req.revision)||req.revision<1)throw Error('版本不正確');
 const encoded=JSON.stringify(g);if(encoded.length>1200000)throw Error('單局紀錄過大，請保存後開新局');
 const chunks=encoded.match(/[\s\S]{1,40000}/g)||[];
 const lock=LockService.getScriptLock();lock.waitLock(20000);
 try {
  const last=sheet.getLastRow(),ids=last>1?sheet.getRange(2,1,last-1,3).getValues():[],index=ids.findIndex(r=>r[0]===g.id),owner=hash_(req.owner);
  if(index>=0){const old=ids[index];if(old[1]!==owner)throw Error('無權修改這筆紀錄');if(Number(old[2])>=req.revision)return {ok:true,id:g.id,revision:Number(old[2])};}
  const row=index<0?last+1:index+2;
  const literal=s=>"'"+s;
  sheet.getRange(row,1,1,38).setValues([[g.id,owner,req.revision,new Date().toISOString(),literal(g.className),literal(g.student),g.moves.length,g.status,...Array.from({length:30},(_,i)=>chunks[i]||'')]]);
  SpreadsheetApp.flush();return {ok:true,id:g.id,revision:req.revision};
 }finally{lock.releaseLock()}
}
function validate_(g){
 if(!g||!/^[a-f0-9-]{36}$/i.test(g.id)||!['3x3','4x4','5x5','3x4','3x6'].includes(g.rows+'x'+g.cols)||typeof g.student!=='string'||g.student.length>30||typeof g.className!=='string'||g.className.length>30||!Array.isArray(g.moves)||g.moves.length>1500||!Array.isArray(g.hints)||g.hints.length>1500||!Number.isFinite(Date.parse(g.started))||!['playing','saved','won'].includes(g.status))throw Error('紀錄格式不正確');
 const n=g.rows*g.cols,board=b=>Array.isArray(b)&&b.length===n&&b.every(x=>x===0||x===1),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 if(!board(g.initial)||!board(g.board))throw Error('棋盤格式不正確');let b=g.initial.slice();
 for(const m of g.moves){if(!Number.isInteger(m.index)||m.index<0||m.index>=n||!same(b,m.before)||!Number.isFinite(m.elapsed)||m.elapsed<0||!Number.isFinite(Date.parse(m.at)))throw Error('翻動紀錄不正確');const y=Math.floor(m.index/g.cols),x=m.index%g.cols;if(m.row!==y+1||m.col!==x+1)throw Error('座標不正確');[[y,x],[y-1,x],[y+1,x],[y,x-1],[y,x+1]].filter(([a,c])=>a>=0&&a<g.rows&&c>=0&&c<g.cols).forEach(([a,c])=>b[a*g.cols+c]^=1);if(!same(b,m.after))throw Error('盤面不一致')}
 if(!same(b,g.board)||(g.status==='won'&&!b.every(Boolean))||(g.ended&&!Number.isFinite(Date.parse(g.ended))))throw Error('結束盤面不正確');
}
