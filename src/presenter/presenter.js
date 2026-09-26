const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('hu-logo').src=DATA.images['brand/hu-horizontal.png'];
$('depe-logo').src=DATA.images['brand/depe.png'];
$('version').textContent=(DATA.items.some(i=>i.requiresInstitutionalValidation)?'Conteúdo em validação':'Conteúdo homologado')+' · '+DATA.version.content+' · Imagens de referência';
for(const d of DATA.destinations){const o=document.createElement('option');o.value=d.id;o.textContent=d.name;$('category').append(o);}
let index=0,step=0,selected='',filtered=[];
function filter(){
 const term=$('search').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 filtered=DATA.items.filter(i=>(i.enabled||$('pending').checked)&&(!$('category').value||i.destinationId===$('category').value)&&(!$('confusion').checked||i.commonConfusion)&&(i.name+' '+i.condition).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(term));
 index=0;reset();
}
function reset(){step=0;selected='';render();}
function art(i){
 if(i.image)return '<img src="'+DATA.images[i.image]+'" alt="">';
 const c=DATA.crops[i.id];if(!c)return '';
 return '<svg viewBox="'+c.slice(1).join(' ')+'" aria-hidden="true"><image href="'+DATA.images['reference/gabarito-'+c[0]+'.png']+'" width="1400" height="990"/></svg>';
}
function render(){
 $('prev').disabled=index===0;$('next').disabled=index>=filtered.length-1;
 $('counter').textContent=filtered.length?(index+1)+' de '+filtered.length:'Nenhum item';
 if(!filtered.length){$('stage').innerHTML='<p class="empty">Nenhum item corresponde aos filtros. Tente outra busca.</p>';return;}
 const i=filtered[index],d=DATA.destinations.find(d=>d.id===i.destinationId);
 $('stage').innerHTML='<div class="item"><div class="art">'+art(i)+'</div><div><span class="eyebrow">OBSERVE · CONVERSE · DESCUBRA</span><h2>'+esc(i.name)+'</h2><p class="condition">'+esc(i.condition)+'</p><p class="question">Qual seria o destino certo? O que fez você escolher?</p></div></div>'+
 (!i.enabled?'<div class="pending"><strong>Caso suspenso — decisão do DEPE necessária</strong><p>'+esc(i.reviewNote)+'</p><p>Este item não é apresentado nas partidas. Discuta as condições que faltam; nenhuma resposta é indicada como correta.</p></div>':
 '<div class="actions"><button id="show-choices" '+(step>=1?'disabled':'')+'>Mostrar destinos</button><button id="reveal" class="primary" '+(step>=2?'disabled':'')+'>Revelar resposta</button><button id="explain" '+(step<2||step>=3?'disabled':'')+'>Mostrar explicação</button></div>'+
 (step>=1?'<div class="choices">'+DATA.destinations.map(x=>'<button data-choice="'+x.id+'" class="'+(step>=2&&x.id===i.destinationId?'correct ':selected===x.id?'selected':'')+'" '+(step>=2?'disabled':'')+'>'+esc(x.name)+'</button>').join('')+'</div>':'')+
 (step>=2?'<section class="answer"><strong>Destino: '+esc(d.name)+'</strong>'+(step>=3?'<p>'+esc(i.explanation)+'</p><small>'+esc(i.technicalReference)+'</small>':'')+'</section>':''));
 if(i.enabled){
 $('show-choices').onclick=()=>{step=1;render();};
 $('reveal').onclick=()=>{step=2;render();};
 $('explain').onclick=()=>{step=3;render();};
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{selected=b.dataset.choice;render();});
 }
}
$('search').addEventListener('input',filter);
for(const id of ['category','confusion','pending'])$(id).addEventListener('change',filter);
$('prev').onclick=()=>{if(index>0){index--;reset();}};
$('next').onclick=()=>{if(index<filtered.length-1){index++;reset();}};
async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Use F11 no navegador';}}
$('fullscreen').onclick=full;
document.addEventListener('keydown',e=>{
 if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName))return;
 if(e.key==='ArrowLeft')$('prev').click();
 if(e.key==='ArrowRight')$('next').click();
 if(e.code==='Space'){e.preventDefault();if(filtered[index]?.enabled){step=Math.min(3,step+1);render();}}
 if(e.key.toLowerCase()==='f')void full();
});
filter();