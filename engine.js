(function(root){
function affected(i,r,c){const y=Math.floor(i/c),x=i%c;return [[y,x],[y-1,x],[y+1,x],[y,x-1],[y,x+1]].filter(([a,b])=>a>=0&&a<r&&b>=0&&b<c).map(([a,b])=>a*c+b)}
function flip(b,i,r,c){const a=b.slice();affected(i,r,c).forEach(j=>a[j]^=1);return a}
function solve(b,r,c){const n=r*c,a=Array.from({length:n},(_,i)=>[...Array.from({length:n},(_,j)=>+affected(j,r,c).includes(i)),1^b[i]]);let row=0,p=[];for(let col=0;col<n;col++){let k=a.findIndex((v,i)=>i>=row&&v[col]);if(k<0)continue;[a[k],a[row]]=[a[row],a[k]];for(let i=0;i<n;i++)if(i!==row&&a[i][col])for(let j=col;j<=n;j++)a[i][j]^=a[row][j];p.push(col);row++}if(a.some(v=>v.slice(0,n).every(x=>!x)&&v[n]))return null;let x=Array(n).fill(0);p.forEach((col,i)=>x[col]=a[i][n]);return x.map((v,i)=>v?i:-1).filter(i=>i>=0)}
root.Engine={affected,flip,solve};if(typeof module!=='undefined')module.exports=root.Engine;
})(globalThis);
