import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, unlinkSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
const file = 'docs/CONTEUDO_PARA_VALIDACAO.csv';
describe('devolução do DEPE', () => {
  it('prévia sem mudanças não altera cadastro', () => {
    const before = readFileSync('src/data/items.json','utf8');
    const out = execFileSync(process.execPath,['scripts/review.mjs','import',file],{encoding:'utf8'});
    expect(out).toContain('PRÉVIA'); expect(out).toContain('[]');
    expect(readFileSync('src/data/items.json','utf8')).toBe(before);
  });
  it.each(['duplicate','destination','origin','missing'])('rejeita entrada inválida: %s', kind => {
    const rows = parse(readFileSync(file,'utf8'),{columns:true,bom:true,delimiter:';'}) as Record<string,string>[];
    if(kind==='duplicate') rows[1].id=rows[0].id;
    if(kind==='destination') rows[0].destino_proposto='inexistente';
    if(kind==='origin') rows[0].nome_original='alterado';
    if(kind==='missing') rows.pop();
    const dir=mkdtempSync(join(tmpdir(),'destino-review-')), path=join(dir,'review.csv');
    try { writeFileSync(path,stringify(rows,{header:true,delimiter:';'}));expect(()=>execFileSync(process.execPath,['scripts/review.mjs','import',path],{stdio:'pipe'})).toThrow(); }
    finally { unlinkSync(path);rmdirSync(dir); }
  });
});
