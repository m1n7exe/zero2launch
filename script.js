'use strict';
const SIGNUP_URL=''; // Paste your hackathon signup link here.
const STORAGE_KEY='zero-to-launch-cash-board-v2';
const $=id=>document.getElementById(id);
const money=n=>'$'+n.toLocaleString('en-SG');
const signed=n=>(n>=0?'+':'−')+money(Math.abs(n));
const choice=(title,chance,win,lose,success,failure)=>({title,chance,win,lose,success,failure});
const ROUNDS=[
 {icon:'💻',title:'Build your app.',text:'Your idea is ready. How will you build it?',options:[
 choice('Code it yourself',.85,2000,-1000,'Your first customer pays.','The launch needs more work.'),
 choice('Hire a freelancer',.65,5000,-3000,'The app is a hit.','The developer misses the deadline.'),
 choice('Go all-in on AI',.4,10000,-6000,'Your AI demo takes off.','Your AI tool keeps hallucinating.') ]},
 {icon:'📣',title:'Get noticed.',text:'You need customers. Pick your launch.',options:[
 choice('Demo on campus',.85,2000,-1000,'Students start signing up.','Almost nobody stops by.'),
 choice('Run online ads',.65,5500,-3000,'The ads bring paying users.','Lots of clicks. No customers.'),
 choice('Pay an influencer',.4,11000,-6500,'Your app goes viral.','Their followers are mostly bots.') ]},
 {icon:'🏷️',title:'Time to charge.',text:'People like your app. Can you make money?',options:[
 choice('Offer a cheap plan',.85,2500,-1000,'Small payments add up.','Most users stay on the free plan.'),
 choice('Sell a premium plan',.65,6000,-3500,'Power users happily upgrade.','Your premium features disappoint.'),
 choice('Chase a big contract',.4,12000,-7000,'A major customer signs.','The deal falls through.') ]},
 {icon:'☁️',title:'Your servers are struggling.',text:'More users. More problems. Your move?',options:[
 choice('Fix it yourself',.8,2500,-1500,'Your patch saves the day.','The app goes down for hours.'),
 choice('Upgrade hosting',.7,5500,-3500,'The app runs smoothly.','Your cloud bill explodes.'),
 choice('Rebuild everything',.45,12000,-7500,'Your new platform flies.','The rebuild breaks checkout.') ]},
 {icon:'⚔️',title:'A rival copies your app.',text:'They even copied your colours. Fight back.',options:[
 choice('Reward loyal users',.85,3000,-1000,'Your customers stick around.','A few customers still leave.'),
 choice('Launch a new feature',.65,7000,-4000,'Users love the upgrade.','Nobody wanted that feature.'),
 choice('Start a price war',.4,14000,-8000,'You win their biggest customers.','The discounts eat your cash.') ]},
 {icon:'🌏',title:'Go bigger?',text:'Another campus wants your app.',options:[
 choice('Stay local',.85,3500,-1500,'Your home market keeps growing.','Your sales slow down.'),
 choice('Try one new campus',.65,8000,-4500,'The new campus loves it.','Your launch gets ignored.'),
 choice('Launch nationwide',.4,17000,-10000,'Your app becomes a campus staple.','You expand too fast.') ]},
 {icon:'🚀',title:'Your biggest opportunity.',text:'One last move before the final count.',options:[
 choice('Renew existing customers',.85,4000,-1500,'Renewals roll in.','Some customers cancel.'),
 choice('Pitch a major university',.6,10000,-5000,'The university signs.','They choose your rival.'),
 choice('Pitch an education group',.35,22000,-12000,'You land the biggest deal yet.','The deal collapses at the last minute.') ]},
 {icon:'🛟',title:'Save your startup.',text:'A rescue programme offers one last chance. Take safe cash or pitch for more.',bonus:true,options:[
 choice('Take the emergency grant',1,3000,0,'Grant approved. A little breathing room.',''),
 choice('Pitch a rescue investor',.6,12000,-3000,'An investor backs your comeback.','The pitch fails. You lose the preparation costs.'),
 choice('Chase a last-minute deal',.35,25000,-5000,'You close a game-changing deal.','The buyer walks away.') ]}
];
// Losses can never take cash below zero. No other scores or hidden bonuses.
function resolve(opt,cash,roll){const success=roll<opt.chance;const next=Math.max(0,cash+(success?opt.win:opt.lose));return {cash:next,delta:next-cash,success};}
let state=null,board=[];
try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));if(Array.isArray(saved))board=saved.filter(x=>typeof x.name==='string'&&Number.isFinite(x.cash)&&x.cash>=0).slice(0,10);}catch{}
function showBoard(){const list=$('leaderboard');list.replaceChildren();for(const entry of board){const li=document.createElement('li'),name=document.createElement('span'),score=document.createElement('b');name.textContent=entry.name;score.textContent=money(entry.cash);li.append(name,score);list.append(li);}$('emptyBoard').hidden=board.length>0;}
function focusElement(el){el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}
function renderRound(){const round=ROUNDS[state.round];state.phase='choice';$('roundLabel').textContent=round.bonus?'BONUS ROUND':`ROUND ${state.round+1} OF 7`;$('chapter').textContent=round.bonus?'The rescue':'CampusFlow';$('cash').textContent=money(state.cash);$('sceneIcon').textContent=round.icon;$('sceneLabel').textContent=round.bonus?'ONE LAST CHANCE':'MAKE YOUR MOVE';$('sceneTitle').textContent=round.title;$('sceneText').textContent=round.text;$('progress').replaceChildren();for(let i=0;i<8;i++){const step=document.createElement('span');step.className=i<=state.round?'done':'';step.setAttribute('aria-label',i===7?'Bonus round':`Round ${i+1}`);$('progress').append(step);}if($('outcome').open)$('outcome').close();$('decisionLabel').textContent='PICK ONE';$('choices').replaceChildren();round.options.forEach((opt,index)=>{const button=document.createElement('button');button.className='choice';const letter=document.createElement('span');letter.className='letter';letter.textContent=String.fromCharCode(65+index);const title=document.createElement('strong');title.textContent=opt.title;const payout=document.createElement('div');payout.className='payout';payout.textContent=signed(opt.win);const terms=document.createElement('div');terms.className='terms';terms.textContent=opt.chance===1?'Guaranteed':`${Math.round(opt.chance*100)}% chance · Otherwise ${signed(Math.max(-state.cash,opt.lose))}`;button.append(letter,title,payout,terms);button.addEventListener('click',()=>choose(index,button));$('choices').append(button);});focusElement($('sceneTitle'));}
function choose(index,button){if(state.phase!=='choice')return;state.phase='outcome';const round=ROUNDS[state.round],opt=round.options[index],result=resolve(opt,state.cash,Math.random());state.cash=result.cash;for(const b of $('choices').children)b.disabled=true;button.classList.add('selected');$('cash').textContent=money(state.cash);$('change').textContent=`${signed(result.delta)} this round`;$('outcome').classList.toggle('bad',!result.success);$('outcomeTag').textContent=result.success?'IT WORKED':'SETBACK';$('outcomeTitle').textContent=signed(result.delta);$('outcomeText').textContent=result.success?opt.success:opt.failure;$('outcomeMath').textContent=state.cash===0?'Out of cash? The rescue round is still ahead.':'';if(round.bonus)$('outcomeMath').textContent='Your final cash is ready.';document.body.classList.add('modal-open');$('outcome').showModal();$('next').textContent=state.round===7?'See my score ↗':state.round===6?'Save my startup · Bonus round ↗':'Next round ↗';const li=document.createElement('li');li.textContent=`${round.bonus?'Bonus':state.round+1}. ${opt.title}: ${signed(result.delta)}`;$('history').append(li);$('next').focus();}
function finish(){if(state.phase==='finished')return;state.phase='finished';$('game').hidden=true;$('finish').hidden=false;$('finalCash').textContent=money(state.cash);$('endTitle').textContent=state.cash>=60000?'Campus legend.':state.cash>=35000?'Ready for takeoff.':state.cash>=20000?'Still building.':state.cash>0?'You survived.':'Time for a comeback.';$('endText').textContent=`${state.name} · Started with $20,000 · Finished with ${money(state.cash)}`;const entry={name:state.name,cash:state.cash};board.push(entry);board.sort((a,b)=>b.cash-a.cash);const position=board.indexOf(entry)+1;board=board.slice(0,10);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(board));}catch{}$('rank').textContent=position<=10?`#${position} on the founder board`:'Try again to reach the top 10.';showBoard();focusElement($('endTitle'));window.scrollTo({top:0,behavior:'smooth'});}
$('startForm').addEventListener('submit',event=>{event.preventDefault();const name=$('nickname').value.trim().slice(0,24);if(!name){$('nickname').focus();return;}state={name,cash:20000,round:0,phase:'choice'};$('history').replaceChildren();$('change').textContent='';$('welcome').hidden=true;$('finish').hidden=true;$('game').hidden=false;renderRound();window.scrollTo({top:0,behavior:'smooth'});});
$('next').addEventListener('click',()=>{if(state?.phase!=='outcome')return;$('outcome').close();if(state.round===7)finish();else{state.round++;$('change').textContent='';renderRound();window.scrollTo({top:0,behavior:'smooth'});}});
// Keep the outcome visible until the player explicitly continues.
$('outcome').addEventListener('cancel',event=>event.preventDefault());
$('outcome').addEventListener('close',()=>{document.body.classList.remove('modal-open');});
$('replay').addEventListener('click',()=>{state=null;$('finish').hidden=true;$('welcome').hidden=false;$('nickname').value='';$('nickname').focus();window.scrollTo({top:0,behavior:'smooth'});});
if(/^https?:\/\//i.test(SIGNUP_URL)){$('signup').href=SIGNUP_URL;$('signup').hidden=false;}
showBoard();
