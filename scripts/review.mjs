import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
const path = 'src/data/items.json';
const items = JSON.parse(fs.readFileSync(path, 'utf8'));
const destinationIds = new Set(JSON.parse(fs.readFileSync('src/data/destinations.json','utf8')).map(d => d.id));
const fields = ['id','nome_original','destino_original','nome_proposto','condicao','destino_proposto','explicacao','dica','referencia','habilitado','decisao_depe','observacoes'];
export function validateReview(rows, current, destinations) {
  const ids = new Set();
  if (rows.length !== current.length) throw new Error('A planilha precisa conter todos os itens.');
  for (const r of rows) {
    if (!current.some(i => i.id === r.id) || ids.has(r.id)) throw new Error('ID desconhecido ou duplicado: ' + r.id);
    ids.add(r.id);
    if (!destinations.has(r.destino_proposto)) throw new Error('Destino inválido: ' + r.id);
    if (!['PENDENTE','APROVADO','REVISAR'].includes(r.decisao_depe)) throw new Error('Decisão inválida: ' + r.id);
    if (!['SIM','NAO'].includes(r.habilitado)) throw new Error('Habilitado deve ser SIM ou NAO: ' + r.id);
    for (const f of ['nome_proposto','condicao','explicacao','dica','referencia']) if (!r[f]?.trim()) throw new Error('Campo vazio: ' + f + ' / ' + r.id);
    const original = current.find(i => i.id === r.id);
    if (r.nome_original !== original.originalName || r.destino_original !== original.originalDestinationId) throw new Error('Campos de origem alterados: ' + r.id);
  }
}
if (process.argv[1]?.endsWith('review.mjs')) {
  const [mode = 'export', input, flag, revision] = process.argv.slice(2);
  if (mode === 'export') {
    const rows = items.map(i => ({ id:i.id, nome_original:i.originalName, destino_original:i.originalDestinationId, nome_proposto:i.name, condicao:i.condition, destino_proposto:i.destinationId, explicacao:i.explanation, dica:i.hint, referencia:i.technicalReference, habilitado:i.enabled?'SIM':'NAO', decisao_depe:i.requiresInstitutionalValidation?'PENDENTE':'APROVADO', observacoes:i.reviewNote }));
    fs.writeFileSync('docs/CONTEUDO_PARA_VALIDACAO.csv', '\uFEFF'+stringify(rows,{header:true,columns:fields,delimiter:';'}));
    console.log('Exportados 52 itens para docs/CONTEUDO_PARA_VALIDACAO.csv.');
  } else if (mode === 'import') {
    if (!input) throw new Error('Informe o CSV devolvido pelo DEPE.');
    const rows = parse(fs.readFileSync(input,'utf8'),{columns:true,bom:true,delimiter:';',skip_empty_lines:true});
    validateReview(rows,items,destinationIds);
    const next = items.map(i => {
      const r=rows.find(r=>r.id===i.id), approved=r.decisao_depe==='APROVADO';
      const enabled=r.habilitado==='SIM' && (i.enabled || approved);
      return {...i,name:r.nome_proposto,condition:r.condicao,destinationId:r.destino_proposto,explanation:r.explicacao,hint:r.dica,technicalReference:r.referencia,enabled,requiresInstitutionalValidation:!approved,contentStatus:approved?'APPROVED':r.decisao_depe==='REVISAR'||!enabled?'REVIEW_REQUIRED':'DRAFT_REVISED',reviewNote:r.observacoes};
    });
    console.log(JSON.stringify(next.flatMap((i,n)=>Object.keys(i).filter(k=>JSON.stringify(i[k])!==JSON.stringify(items[n][k])).map(k=>({id:i.id,campo:k,antes:items[n][k],depois:i[k]}))),null,2));
    const levels=JSON.parse(fs.readFileSync('src/data/levels.json','utf8'));
    const pools=levels.map((l,n)=>({...l,pool:next.filter(i=>i.enabled && (n===0?i.difficulty===1:n===1?i.difficulty===2:i.difficulty>=2)).map(i=>i.id)}));
    if(pools.some(l=>l.pool.length<10)) throw new Error('Uma fase ficaria com menos de dez itens.');
    if (flag === '--apply') {
      if (!revision || !/^[a-zA-Z0-9._-]+$/.test(revision)) throw new Error('Informe uma nova versão de conteúdo após --apply.');
      const v=JSON.parse(fs.readFileSync('src/data/version.json','utf8'));
      if(v.content===revision) throw new Error('A versão deve mudar.');
      fs.mkdirSync('docs/revisoes',{recursive:true});
      fs.writeFileSync('docs/revisoes/'+Date.now()+'-antes.json',JSON.stringify(items,null,2));
      fs.writeFileSync(path,JSON.stringify(next,null,2)+'\n');
      fs.writeFileSync('src/data/levels.json',JSON.stringify(pools,null,2)+'\n');
      fs.writeFileSync('src/data/version.json',JSON.stringify({...v,content:revision},null,2)+'\n');
      console.log('Aplicado. Reconstrua jogo e gabarito; execute testes antes da distribuição.');
    } else console.log('PRÉVIA: nenhum arquivo alterado. Para aplicar: --apply NOVA_VERSAO');
  } else throw new Error('Use export ou import.');
}
