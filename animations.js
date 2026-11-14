/* Visual-only board transitions and celebration; no audio APIs. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let burstTimer;
 function clear(){clearTimeout(burstTimer);document.getElementById('celebration')?.remove();document.getElementById('board')?.classList.remove('board-win')}
 function flip(indices){if(reduced.matches)return;const cells=document.querySelectorAll('#board .tile');indices.forEach(i=>{const b=cells[i];if(!b)return;b.animate([{transform:'perspective(400px) rotateY(-80deg) scale(.92)'},{transform:'perspective(400px) rotateY(0deg) scale(1.05)',offset:.7},{transform:'scale(1)'}],{duration:320,easing:'ease-out'})})}
 function win(){if(reduced.matches)return;const board=document.getElementById('board');board.classList.add('board-win');const burst=document.createElement('div');burst.id='celebration';burst.setAttribute('aria-hidden','true');for(let i=0;i<30;i++){const p=document.createElement('i');p.style.setProperty('--x',(Math.random()*100)+'%');p.style.setProperty('--drift',(Math.random()*180-90)+'px');p.style.setProperty('--delay',(Math.random()*.35)+'s');p.style.background=['#f47458','#90e0da','#ffe2a0'][i%3];burst.append(p)}document.body.append(burst);burstTimer=setTimeout(()=>{burst.remove();board.classList.remove('board-win')},2200)}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
 window.Animations={flip,win,clear};
})();
