/* Original character dialogue for learning; no timers interrupt the board. */
(()=>{
 const el=id=>document.getElementById(id);
 const names={xiaoshi:'程小石',luguang:'陸洸',qiaoling:'喬玲'};
 let typingTimer=null,typingText='',typing=false;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function completeText(){clearTimeout(typingTimer);typing=false;el('characterLine').textContent=typingText;el('skipTyping').hidden=true;el('characterLine').classList.remove('typing');el('chatNext').hidden=false;el('skipTyping').hidden=true}
 function typeText(text){clearTimeout(typingTimer);typingText=text;el('dialogueAnnouncement').textContent=text;if(reduced.matches){completeText();return}const chars=Array.from(text);let n=0;typing=true;el('skipTyping').hidden=true;el('chatNext').hidden=true;el('characterLine').classList.add('typing');el('characterLine').textContent='';function tick(){el('characterLine').textContent=chars.slice(0,++n).join('');if(n<chars.length)typingTimer=setTimeout(tick,/[，。！？：]/.test(chars[n-1])?140:28);else completeText()}tick()}
 el('skipTyping').onclick=completeText;
 reduced.addEventListener('change',()=>{if(reduced.matches)completeText()});
 let current=null,lines=[],position=0,chatIndex=0,muted=false;
 const line=(speaker,text,mood)=>({speaker,text,mood});
 function display(){const item=lines[position];if(!item)return;el('companion').dataset.speaker=item.speaker;el('speakerName').textContent=names[item.speaker];el('speechMood').textContent=item.mood;typeText(item.text);el('chatNext').textContent='聽下一位夥伴說 →'}
 function speak(items){lines=items;position=0;display()}
 function win(g){return [line('qiaoling',`成功了！你用 ${g.moves.length} 次翻動，把這張 ${g.rows} × ${g.cols} 的照片全部染紅了。每一次認真嘗試，都算數！`,'任務完成'),line('xiaoshi','太好了，這次任務完成！要不要去「我的紀錄」，看看我們剛剛走過的每一步？','擊掌慶祝'),line('luguang','回看一下你的翻動順序。你發現了什麼規律？試著用自己的話說給老師聽。','回顧線索')]}
 function event(kind,g,index){current=g;if(kind==='start'){chatIndex=0;if(!muted)speak([line('xiaoshi',`新的 ${g.rows} × ${g.cols} 任務！先選一顆棋子，看看它和哪些鄰居一起變色。慢慢來，我陪你！`,'一起出發')]);return}
 if(kind==='hint'){const row=Math.floor(index/g.cols)+1,col=index%g.cols+1;speak([line('luguang',`看看第 ${row} 行、第 ${col} 列，黃色框已經標出來了。先猜猜：按下去，哪些棋子會一起翻面？`,'觀察提示'),line('qiaoling','需要提示很正常！試完之後，把變色的棋子和剛才的猜想比一比，就有新發現。','陪你想一想')]);return}
 if(muted)return;
 if(kind==='win'){speak(win(g));return}
 if(kind==='saved'){speak([line('qiaoling','這段探索保存好了！還沒全部翻紅也沒關係，下次可以從紀錄裡找新線索。','休息一下')]);return}
 if(kind==='move'){
 const n=g.moves.length;
 if(n===1)speak([line('luguang','看見了嗎？被按到的棋子，還有它上下左右的鄰居，都會翻面；斜角的棋子不會。','第一個發現')]);
 else if(n%5===0)speak([line('qiaoling','已經留下好多思考的足跡了！不用急著比快。想一想下一步，也可以按提示找線索。','為努力加油')]);
 else if(n%4===0)speak([line('xiaoshi','紅色變回黑色也別慌，這也是探索的一部分！先觀察，再試一次。','繼續探索')]);
 }
 }
 function chat(){if(typing){completeText();return}if(position<lines.length-1){position++;display();return}if(current?.status==='won'){speak(win(current));return}
 const tips=[line('xiaoshi','來個小實驗吧：同一顆棋子連按兩次，棋盤會變成什麼樣子？先猜猜，再試試！','小小實驗'),line('luguang','角落、邊緣和中間的棋子，會影響的鄰居數量不同。你能各找一顆比一比嗎？','找出差別'),line('qiaoling','把你的想法說出來也很棒！例如：「我想按這裡，因為……」我們很想聽你的發現。','說說你的想法')];speak([tips[chatIndex++%tips.length]])}
 el('chatNext').onclick=chat;
 window.Companion={event,restore(g){current=g;if(g?.status==='won'&&!muted)speak(win(g));else if(g&&!g.ended&&!muted)speak([line('xiaoshi','歡迎回來！剛才的棋盤和每一步都還在，我們接著找線索吧。','繼續任務')])}};
})();
