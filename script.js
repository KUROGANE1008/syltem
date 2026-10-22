'use strict';
const characters = {
  "hayato": {
    "name": "クロガネ ハヤト",
    "roman": "KUROGANE HAYATO",
    "role": "元・特殊刑事課",
    "description": "特殊刑事課を退職した元刑事。肩書きを失っても、困っている人を見ると身体が動く。ある日の街での出会いをきっかけに、日常の裏側へ足を踏み入れる。",
    "detail": "茶髪を襟足で結び、黒い革ジャケットをまとう。"
  },
  "satoshi": {
    "name": "アカツキ サトシ",
    "roman": "AKATSUKI SATOSHI",
    "role": "SYLTEM / VEGAS-R",
    "description": "現場での救助と戦闘を担うSYLTEMの一員。危険の中でも目の前の相手を守ろうとする。カケルとは、遠慮のない軽口を交わす相棒。",
    "detail": "黒髪と青い瞳。赤いジャケットが印象的。"
  },
  "kakeru": {
    "name": "ヤマブキ カケル",
    "roman": "YAMABUKI KAKERU",
    "role": "SYLTEM / RAPHAEL-X",
    "description": "情報収集や潜入を担うSYLTEMの一員。軽やかな言動の奥に、周囲をよく見る慎重さを持つ。仲間とのやりとりでは、冗談を交わす一面もある。",
    "detail": "金髪に琥珀色の瞳。黒と金のジャケットを着用。"
  },
  "seika": {
    "name": "ニシキ セイカ",
    "roman": "NISHIKI SEIKA",
    "role": "SYLTEM / TACTICAL COMMANDER",
    "description": "現場を遠隔から支える指揮官。仲間の安全を優先し、状況を慎重に見極める。厳しい判断を担いながらも、一人ひとりへの気遣いを忘れない。",
    "detail": "長い髪と淡い青灰色の瞳。黒と金の制服。"
  },
  "shu": {
    "name": "シロガネ シュウ",
    "roman": "SHIROGANE SHU",
    "role": "SYLTEM / TECHNICAL DIRECTOR",
    "description": "兵装・認識解析・機体整備を支える技術者。現象だけでなく、現場で動く人にも目を向ける。口数の少なさの奥に、不器用な心配りを持つ。",
    "detail": "短い銀髪。眼鏡はかけず、黒いロングコートをまとう。"
  }
};
const tabs=[...document.querySelectorAll('[data-character]')];
function selectCharacter(tab){
 const key=tab.dataset.character,c=characters[key];
 tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});
 document.querySelector('#character-panel').setAttribute('aria-labelledby',tab.id);
 ['name','roman','role','description','detail'].forEach(field=>{document.querySelector('#character-'+field).textContent=c[field];});
 const img=document.querySelector('#character-image');img.src=''+key+'.webp';img.alt=c.name+'の正面の立ち姿';
 document.querySelector('#character-full').href=img.src;
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectCharacter(tab));tab.addEventListener('keydown',e=>{
 let index;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();selectCharacter(tabs[index]);tabs[index].focus();
});});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
const search=document.querySelector('#database-search'),entries=[...document.querySelectorAll('.database-entries details')];
search.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase('ja');let count=0;entries.forEach(d=>{const match=d.textContent.toLocaleLowerCase('ja').includes(q);d.hidden=!match;if(match){count++;if(q)d.open=true;}});document.querySelector('#search-status').textContent=q?(count?count+'件の記録が見つかりました。':'一致する記録はありません。'):'';});
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{const img=document.querySelector('#gallery-full');img.src=b.dataset.image;img.alt=b.querySelector('img').alt;document.querySelector('#gallery-caption').textContent=b.dataset.title;openDialog(document.querySelector('#gallery-dialog'));}));
document.querySelector('#character-full').addEventListener('click',event=>{
 event.preventDefault();
 const source=document.querySelector('#character-image');
 const name=document.querySelector('#character-name').textContent;
 const image=document.querySelector('#character-design-image');
 image.src=source.src;image.alt=name+'の公式三面図';
 document.querySelector('#character-design-title').textContent=name+' / 公式三面図';
 openDialog(document.querySelector('#character-dialog'));
});
document.querySelector('#intrusion-open').addEventListener('click',()=>openDialog(document.querySelector('#intrusion-dialog')));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>document.body.classList.remove('modal-open'));d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});


const relationPeople = {"hayato":{"name":"クロガネ ハヤト","short":"ハヤト","role":"観測対象・実働要員","faction":"SYLTEM","about":"誤記録への異常耐性を持つ存在。仲間の認識をつなぎ止め、イヴァンとは世界のあり方をめぐって対立する。","x":27,"y":20},"satoshi":{"name":"アカツキ サトシ","short":"サトシ","role":"エースパイロット","faction":"SYLTEM","about":"前線を支える実戦要員。正面から道を切り開く突破力を持ち、カケルとは対照的な戦い方で補い合う。","x":13,"y":51},"kakeru":{"name":"ヤマブキ カケル","short":"カケル","role":"潜入・情報回収","faction":"SYLTEM","about":"潜入と情報戦を担う実働エージェント。存在が曖昧になる後遺症を抱えるが、ハヤトは彼を見失わない。","x":41,"y":51},"shu":{"name":"シロガネ シュウ","short":"シュウ","role":"技術・認識解析","faction":"SYLTEM","about":"兵装・認識解析・機体整備を統括する技術者。機体を、搭乗者の認識を固定する装置として設計する。","x":13,"y":83},"seika":{"name":"ニシキ セイカ","short":"セイカ","role":"作戦指揮","faction":"SYLTEM","about":"崩れた情報から戦況を読み取り、全員を帰還させることを最優先する司令官。イヴァンの思想を危険視する。","x":41,"y":83},"ivan":{"name":"イヴァン・メルクリウス","short":"イヴァン","role":"世界の解放を求める者","faction":"OBLIVION","about":"固定された世界を解放し、書き換わり続ける状態へ戻そうとする。ハヤトとは、人類を救おうとする立場から深く対立する。","x":80,"y":31},"noa":{"name":"ノア・リコリス","short":"ノア","role":"直属研究者","faction":"OBLIVION","about":"イヴァン直属の研究者であり、彼の思想に最も近い理解者。ただし忠誠よりも、誤記録の先にあるものへの関心で動く。","x":80,"y":73}};
const relationEdges = [["satoshi","kakeru","相棒だからこその衝突","対照的な強みで補い合う長年の相棒。ただし、相手を守るために危険を一人で背負うと衝突する。助けられることより、相談されずに失いかけることが怖い。任務後のいつもの冗談は、互いの無事を確かめる習慣でもある。","ally"],["hayato","kakeru","存在をつなぐ信頼と怖さ","カケルにとって、自分を見失わないハヤトは救いである一方、依存してしまう怖さもある。普段はからかうが、核心に触れられると距離を取る。ハヤトも、見えていることと気持ちを理解できることの違いに向き合う。","ally"],["shu","kakeru","解析と支援","シュウはカケルの認識異常を理解し、認識固定ログを更新する。","ally"],["satoshi","shu","身体を張る者と帰還を支える者","前線で身体を張るサトシと、機体に残った損傷から危険を知るシュウ。修理中の軽口の奥には、無事に帰ってほしいという切実な思いがある。技術の支援だけでなく、無茶を叱れる信頼でつながっている。","ally"],["seika","satoshi","指揮・帰還支援","セイカは現場の仲間を指揮し、全員の帰還を最優先する。","ally"],["hayato","seika","選択の自由と指揮官の責任","ハヤトは自分で選びたい。セイカはその意志を尊重しながらも、「本人が望んだ」という理由だけで危険を正当化しない。本人の覚悟と、送り出す側の責任がぶつかる関係。帰還時に名前を呼び、返事を待つこともセイカの確認の習慣となる。","ally"],["hayato","shu","人としての信頼と観測の責任","シュウはハヤトを人として信じたい一方、観測しなければ守れない責任を負う。ハヤトは異常を知らされないことだけでなく、シュウが一人で抱え込むことも案じる。言葉にしにくい心配は、好みの飲み物を置くような小さな気遣いに表れる。","ally"],["hayato","ivan","同じ救済への異なる答え","どちらも人類を救おうとしている。同じ苦しみに目を向けながら、救うために世界をどう扱うかで答えが分かれる。一人を救う判断では一致できても、次の犠牲を防ぐ方法では決裂する。互いを理解できるからこそ対立は深い。","conflict"],["seika","ivan","警戒","セイカは、イヴァンが目指す世界とその思想を危険視する。","conflict"],["ivan","noa","理解と忠誠の違い","ノアはイヴァンの思想に最も近い理解者だが、理解は服従や個人への愛着と同じではない。彼の理想に反する結果でも研究上の事実を優先する。イヴァンにとっても、理解されていることが必ずしも安心につながらない関係。","research"],["hayato","noa","研究・観測対象","ノアはハヤトの特異性に注目し、誤記録への適応を研究対象として見ている。","research"],["seika","shu","帰還への願いと現実的な計算","全員を帰還させたいセイカと、全員は救えない可能性まで計算するシュウ。互いの責任を理解するからこそ、安易には譲れない。判断が分かれても別の手段を探し、作戦後には選択の代償を問い直す。","ally"],["seika","kakeru","信頼があるから言える冗談","互いの能力と判断を信頼しているからこそ、冗談を言い合える仲。カケルの軽口とセイカの返しには、相手への理解がある。任務中の指揮と報告は確実に守り、冗談の中にも互いを気遣う本音がにじむ。","ally"],["shu","noa","詳細不明の深い関係","深い関係性があるようだが、詳細は不明。","unknown"],["hayato","satoshi","背中を預ける、似た者同士","目の前の誰かを守るため、考えるより先に身体が動く二人。互いの行動を信頼する一方、自分を後回しにして危険を引き受ける姿には衝突する。相手には無事でいてほしいのに、自分の無茶は譲れない。その矛盾に向き合い、一人で背負うことから、互いに任せて帰ることへ関係を深めていく。","ally"]];
const relationSafePeople = {"hayato":{"name":"クロガネ ハヤト","short":"ハヤト","role":"元・特殊刑事課","faction":"主人公","about":"特殊刑事課を辞めた元刑事。困っている人を放っておけない、実直な性格。ある日の出会いから、SYLTEMの人々と関わっていく。","x":27,"y":20},"satoshi":{"name":"アカツキ サトシ","short":"サトシ","role":"エースパイロット","faction":"SYLTEM","about":"前線を支える実戦要員。正面から道を切り開く突破力を持ち、カケルとは対照的な戦い方で補い合う。","x":13,"y":51},"kakeru":{"name":"ヤマブキ カケル","short":"カケル","role":"潜入・情報回収","faction":"SYLTEM","about":"潜入と情報回収を担うSYLTEMの一員。軽口を交わす余裕と、周囲を見極める慎重さを併せ持つ。","x":41,"y":51},"shu":{"name":"シロガネ シュウ","short":"シュウ","role":"技術・認識解析","faction":"SYLTEM","about":"兵装・認識解析・機体整備を統括する技術者。仲間の活動を、装備と技術の面から支える。","x":13,"y":83},"seika":{"name":"ニシキ セイカ","short":"セイカ","role":"作戦指揮","faction":"SYLTEM","about":"現場の情報を見極め、仲間の安全を最優先に指揮を執る。厳しさの中に気遣いを持つ司令官。","x":41,"y":83},"ivan":{"name":"イヴァン・メルクリウス","short":"イヴァン","role":"世界の解放を求める者","faction":"OBLIVION","about":"固定された世界のあり方に問いを投げかける、OBLIVIONの人物。誤記録の解放を理念に掲げる。","x":80,"y":31},"noa":{"name":"ノア・リコリス","short":"ノア","role":"研究者","faction":"OBLIVION","about":"OBLIVIONに属する研究者。誤記録と世界のあり方に関心を向けている。","x":80,"y":73}};
const relationSafeEdges = [["satoshi","kakeru","軽口を交わす相棒","対照的な強みを持つ二人。任務では互いを支え、日常では遠慮のない軽口を交わす。","ally"],["hayato","kakeru","実直さと軽やかさ","まっすぐに行動するハヤトと、軽口を交えながら周囲を見るカケル。性格の違いが、二人の会話にも表れる。","ally"],["shu","kakeru","技術の支援","潜入と情報回収を担うカケルを、シュウが装備や技術の面から支える。","ally"],["satoshi","shu","身体を張る者と帰還を支える者","前線で身体を張るサトシと、機体に残った損傷から危険を知るシュウ。修理中の軽口の奥には、無事に帰ってほしいという切実な思いがある。技術の支援だけでなく、無茶を叱れる信頼でつながっている。","ally"],["seika","satoshi","指揮・帰還支援","セイカは現場の仲間を指揮し、全員の帰還を最優先する。","ally"],["hayato","seika","行動と判断","目の前の相手を助けようとするハヤトと、全体を見渡すセイカ。それぞれの立場から、人の安全に向き合う。","ally"],["hayato","shu","言葉よりも気遣い","率直に行動するハヤトと、静かに周囲へ目を配るシュウ。言葉にしにくい気遣いが、二人のやりとりに表れる。","ally"],["seika","ivan","異なる理念","秩序を守ろうとするSYLTEMと、世界の変化を求めるOBLIVION。それぞれの組織の理念を示す人物。","conflict"],["ivan","noa","理念と研究","世界のあり方を問うイヴァンと、研究に携わるノア。OBLIVIONでそれぞれの役割を担う。","research"],["seika","shu","指揮と技術","現場を指揮するセイカと、技術面を支えるシュウ。異なる専門から状況を見極め、仲間の活動を支える。","ally"],["seika","kakeru","信頼があるから言える冗談","互いの能力と判断を信頼しているからこそ、冗談を言い合える仲。カケルの軽口とセイカの返しには、相手への理解がある。任務中の指揮と報告は確実に守り、冗談の中にも互いを気遣う本音がにじむ。","ally"],["hayato","satoshi","誰かを放っておけない二人","目の前で困っている誰かを見ると、考えるより先に身体が動く。その実直さと、自分よりも相手を気にかけるところが似ている。","ally"]];
let relationSpoilerProtection = true;
let selectedRelationPerson = 'hayato';
const relationToggle = document.getElementById('relation-spoiler-toggle');
const relationNodes = [...document.querySelectorAll('[data-person]')];
function showRelations(key){
 selectedRelationPerson = key;
 const people = relationSpoilerProtection ? relationSafePeople : relationPeople;
 const edges = relationSpoilerProtection ? relationSafeEdges : relationEdges;
 const person = people[key];
 document.getElementById('relation-faction').textContent=person.faction;
 document.getElementById('relation-name').textContent=person.name;
 document.getElementById('relation-about').textContent=person.about;
 relationNodes.forEach(button=>{
  button.setAttribute('aria-pressed',String(button.dataset.person===key));
  button.querySelector('span').textContent=people[button.dataset.person].faction;
 });
 // Only these role labels differ between the introductory and full versions.
 const hayatoRole=document.querySelector('[data-person="hayato"] small');
 const roleParts=people.hayato.role.split('・');
 hayatoRole.replaceChildren(document.createTextNode(roleParts[0]+'・'),document.createElement('wbr'),document.createTextNode(roleParts[1]));
 document.querySelector('[data-person="noa"] small').textContent=people.noa.role;
 const plot=document.querySelector('#relationships .relation-stage svg');
 plot.replaceChildren();
 edges.forEach(([a,b,,,kind])=>{
  const line=document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('class','relation-line '+kind+((a===key||b===key)?' active':''));
  line.setAttribute('data-ends',a+' '+b);
  line.setAttribute('x1',people[a].x);line.setAttribute('y1',people[a].y);
  line.setAttribute('x2',people[b].x);line.setAttribute('y2',people[b].y);
  plot.append(line);
 });
 document.getElementById('relation-unknown-legend').hidden=relationSpoilerProtection;
 const list=document.getElementById('relation-list');list.replaceChildren();
 const order=['hayato','satoshi','kakeru','shu','seika','ivan','noa'];
 edges.filter(edge=>edge[0]===key||edge[1]===key)
 .sort((a,b)=>order.indexOf(a[0]===key?a[1]:a[0])-order.indexOf(b[0]===key?b[1]:b[0]))
 .forEach(([a,b,label,description,kind])=>{
  const item=document.createElement('li');item.className=kind;
  const detail=document.createElement('details');detail.name='character-relations';
  const summary=document.createElement('summary');
  const name=document.createElement('span');name.className='relation-partner';name.textContent=people[a===key?b:a].name;
  const heading=document.createElement('strong');heading.textContent=label;
  const icon=document.createElement('i');icon.textContent='＋';icon.setAttribute('aria-hidden','true');
  summary.append(name,heading,icon);
  const text=document.createElement('p');text.textContent=description;
  detail.append(summary,text);item.append(detail);list.append(item);
  detail.addEventListener('toggle',()=>{if(detail.open)list.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false;});});
 });
}
relationNodes.forEach(button=>button.addEventListener('click',()=>showRelations(button.dataset.person)));
relationToggle.addEventListener('click',()=>{
 relationSpoilerProtection=!relationSpoilerProtection;
 relationToggle.setAttribute('aria-checked',String(relationSpoilerProtection));
 document.getElementById('relation-spoiler-state').textContent=relationSpoilerProtection?'ON':'OFF';
 document.getElementById('relation-spoiler-note').textContent=relationSpoilerProtection
  ?'OFFにすると、本編のネタバレを含む全ての関係・説明を表示します。'
  :'全ての関係・説明を表示中です。ONに戻すとネタバレを隠します。';
 showRelations(selectedRelationPerson);
});
showRelations('hayato');
relationToggle.disabled=false;
