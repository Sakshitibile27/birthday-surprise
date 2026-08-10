let current="p1",giftOpened=false,candleDone=false,micStream=null,audioCtx=null,analyser=null,micTimer=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
for(let i=0;i<65;i++){let s=document.createElement("span");s.style.left=Math.random()*100+"%";s.style.top=Math.random()*100+"%";s.style.width=s.style.height=(2+Math.random()*4)+"px";s.style.animationDelay=Math.random()*3+"s";$("#stars").appendChild(s)}
function nextPage(id,e){if(e)e.stopPropagation();document.getElementById(current).classList.remove("active");current=id;document.getElementById(id).classList.add("active");if(id==="p5")initBalloons();if(id==="p6")initPuzzle();if(id==="p7")initScratch()}
function openGift(){if(giftOpened)return;giftOpened=true;$("#giftScene").classList.add("opening");$("#giftText").textContent="✨ Opening your surprise…";setTimeout(()=>$("#giftNext").classList.remove("hidden"),1300)}
function checkPassword(){let p=$("#password").value.trim().toLowerCase();if(p==="banashankari21"||p==="banashankari"){ $("#passMsg").textContent="🔓 Unlocked!";setTimeout(()=>nextPage("p3"),700)}else $("#passMsg").textContent="❌ Wrong password. Try again."}
$("#password").addEventListener("keydown",e=>{if(e.key==="Enter")checkPassword()})
function blowCandle(){finishBlow("👆✨ Candle blown out!")}
async function startMic(){if(candleDone)return;if(!navigator.mediaDevices?.getUserMedia){$("#candleMsg").textContent="Microphone unavailable — tap either candle 💨";return}try{micStream=await navigator.mediaDevices.getUserMedia({audio:true});$("#blowBtn").textContent="🎤 Listening… Blow now!";$("#candleMsg").textContent="🎤 Microphone ready — blow toward it";audioCtx=new(window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();analyser=audioCtx.createAnalyser();analyser.fftSize=512;let src=audioCtx.createMediaStreamSource(micStream);src.connect(analyser);let d=new Uint8Array(analyser.fftSize),strong=0;micTimer=setInterval(()=>{analyser.getByteTimeDomainData(d);let sum=0,peak=0;for(let x of d){let v=Math.abs((x-128)/128);sum+=v*v;peak=Math.max(peak,v)}let rms=Math.sqrt(sum/d.length);if(rms>.045||peak>.2)strong++;else strong=Math.max(0,strong-1);if(strong>=3)finishBlow("💨✨ Candles blown out!")},70)}catch(e){$("#candleMsg").textContent="Microphone permission failed — tap either candle instead 💨"}}
function finishBlow(msg){if(candleDone)return;candleDone=true;clearInterval(micTimer);micStream?.getTracks().forEach(t=>t.stop());audioCtx?.close().catch(()=>{});$(".flame")&&$$(".flame").forEach(x=>x.classList.add("out"));$$(".sideCandle i").forEach(x=>x.classList.add("out"));$("#blowBtn").classList.add("hidden");$("#candleMsg").textContent=msg+" Make a wish… ✨";setTimeout(()=>$("#cakeNext").classList.remove("hidden"),900)}
const photos=["her1.jpg","her2.jpg","her3.jpg","her4.jpg","her5.jpg","her6.jpg"];
const caps=["A lovely memory ✨","One beautiful day to remember 💕","A smile worth remembering 🌸","Beautiful moments, beautiful you ✨","A memory that will stay forever 🌿","Always keep smiling 💖"];
let mi=0;
function updateMemoryDots(){ $("#memoryDots").textContent=photos.map((_,i)=>i===mi?"●":"○").join(" "); }
function nextMemory(){
 if(mi<photos.length-1){
  mi++;
  const img=$("#memoryImage"); img.classList.remove("memoryChanging"); void img.offsetWidth; img.classList.add("memoryChanging");
  img.src="assets/photos/"+photos[mi]; $("#memoryCaption").textContent=caps[mi]; updateMemoryDots();
  if(mi===photos.length-1){$("#memoryNextPhoto").classList.add("hidden");$("#memoryNext").classList.remove("hidden");}
 }
}
updateMemoryDots();

let bs=0;
function initBalloons(){
 if($("#balloons").children.length)return;
 let wishes=["May your smile always stay this beautiful. 💖","May every dream you have come true. ✨","Years may pass, but our friendship will always remain the same. 🫶🏻","May your life be filled with happiness and success. 🌸","Always stay the amazing person you are. 🎂"];
 wishes.forEach((w,i)=>{let b=document.createElement("div");b.className="balloon";b.style.background=["#ff5d77","#8d6bff","#57baff","#a46be8","#6ed878"][i];b.onclick=()=>{if(b.classList.contains("pop"))return;b.classList.add("pop");$("#wishBox").textContent=w;bs++;$("#balloonCount").textContent=`Popped ${bs}/5`;if(bs===5)$("#balloonNext").classList.remove("hidden")};$("#balloons").appendChild(b)})
}

let tiles=[],sel=null;
function initPuzzle(){
 if(tiles.length)return;
 let p=[0,1,2,3,4,5,6,7,8]; do{p.sort(()=>Math.random()-.5)}while(p.every((v,i)=>v===i)); tiles=p; renderPuzzle();
}
function renderPuzzle(){
 let box=$("#puzzle"); box.innerHTML="";
 tiles.forEach((v,i)=>{let d=document.createElement("div");d.className="piece";let row=Math.floor(v/3),col=v%3;d.style.backgroundImage='url("assets/photos/her2.jpg")';d.style.backgroundSize="300% 300%";d.style.backgroundPosition=`${col*50}% ${row*50}%`;d.onclick=()=>swapTile(i);box.appendChild(d)})
}
function swapTile(i){
 if(sel===null){sel=i;$("#puzzle").children[i].classList.add("selected");return}
 if(sel===i){sel=null;$("#puzzle").children[i].classList.remove("selected");return}
 [tiles[sel],tiles[i]]=[tiles[i],tiles[sel]];sel=null;renderPuzzle();
 if(tiles.every((v,i)=>v===i)){$("#puzzleMsg").textContent="🎉 Puzzle complete! You found her photo.";$("#puzzleNext").classList.remove("hidden")}
}

let scInit=false,scCount=0,down=false;function initScratch(){if(scInit)return;scInit=true;let c=$("#scratchCanvas"),r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;let x=c.getContext("2d");x.scale(d,d);x.fillStyle="#d8a936";x.fillRect(0,0,r.width,r.height);x.fillStyle="#c6a04b";for(let i=0;i<50;i++){x.beginPath();x.arc(Math.random()*r.width,Math.random()*r.height,Math.random()*3,0,7);x.fill()}x.fillStyle="#fff";x.font="bold 25px Arial";x.textAlign="center";x.fillText("Scratch here 🪙",r.width/2,r.height/2);x.font="14px Arial";x.fillText("drag your finger across the card",r.width/2,r.height/2+28);function er(e){if(!down)return;let p=e.touches?e.touches[0]:e,rr=c.getBoundingClientRect();x.globalCompositeOperation="destination-out";x.beginPath();x.arc(p.clientX-rr.left,p.clientY-rr.top,34,0,7);x.fill();if(++scCount>70){c.style.opacity=0;$("#scratchHint").style.display="none";$("#scratchNext").classList.remove("hidden")}}c.onpointerdown=()=>down=true;c.onpointerup=()=>down=false;c.onpointerleave=()=>down=false;c.onpointermove=er;c.ontouchstart=e=>{down=true;er(e)};c.ontouchmove=er;c.ontouchend=()=>down=false}
const letter=`Happy Birthday, Banashankari! 🎂🥳✨

Another year of your life, and I’m so grateful that our paths crossed all those years ago.

It has been years since we became friends, and even though life has taken us in different directions, some friendships never fade. I still remember our laughs, silly talks, school memories, and all those little moments that made our friendship special.

I hope you get to meet your one true love, marry the most beautiful person, and build a beautiful life together. May you always have happiness, success, love and countless reasons to smile.

Years may pass, but our friendship will always remain the same. No matter how much time goes by, you will always be one of the most special people in my life.

Always your friend,
Sakshi 💕
Happy Birthday once again! ✨`;
let opened=false;function openLetter(){if(opened)return;opened=true;$("#envelope").classList.add("open");setTimeout(()=>{$("#envelope").classList.add("hidden");$("#letterHint").classList.add("hidden");$("#letterPaper").classList.remove("hidden");typeLetter()},900)}
function typeLetter(){let i=0,e=$("#letterText"),t=setInterval(()=>{e.textContent+=letter[i++];e.parentElement.scrollTop=e.parentElement.scrollHeight;if(i>=letter.length){clearInterval(t);$("#finalNext").classList.remove("hidden")}},18)}
