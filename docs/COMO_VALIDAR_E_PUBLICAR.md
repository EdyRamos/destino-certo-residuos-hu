# Como validar e distribuir

## Executar o projeto

Requer Node.js 22.12+ ou 24 LTS e npm.

```powershell
npm ci
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Abra `http://127.0.0.1:4173`. Para desenvolver: `npm run dev`.

Testes de navegador (após `npm run build`): `npm run test:e2e`. Eles sobem o pacote na raiz (porta 4173) e em subdiretório `/residuos/` (porta 4174). Sem o Chromium do Playwright instalado, use o Chrome ou o Edge da máquina:

```powershell
$env:PW_CHANNEL='chrome'; npm run test:e2e
```

## Gabarito pelo pendrive

O build produz `output/gabarito/Destino-Certo-Gabarito-DEPE.html`. Copie somente esse arquivo para o pendrive e abra no Chrome ou Edge. Não depende da pasta do projeto nem de internet.

1. Escolha um item ou use a busca/filtros.
2. Pergunte qual seria o destino e o motivo.
3. Mostre os destinos, permitindo destacar uma hipótese sem corrigi-la ainda.
4. Clique em Revelar resposta e depois Mostrar explicação.
5. Use as setas para navegar. Cada troca esconde a resposta anterior.

Casos suspensos ficam ocultos por padrão; quando incluídos, mostram a dúvida para discussão, sem indicar uma classificação como correta. Imagens ainda são referências para homologação interna.

## Revisão do DEPE

Enviar `docs/CONTEUDO_PARA_VALIDACAO.csv`, em UTF-8 com separador ponto e vírgula. Ao abrir no Excel, usar Dados > De Texto/CSV caso necessário.

Não modificar `id`, `nome_original` e `destino_original`. Editar os campos propostos, preencher `decisao_depe` com `APROVADO`, `PENDENTE` ou `REVISAR` e `habilitado` com `SIM` ou `NAO`.

```powershell
# Apenas comparar, sem alterar cadastro:
npm run review:import -- "caminho/DEVOLUCAO_DEPE.csv"
# Depois de conferir a prévia, aplicar com nova versão:
npm run review:import -- "caminho/DEVOLUCAO_DEPE.csv" --apply 2026-10-01-depe-1
npm test
npm run build
```

O importador exige os 52 itens, valida IDs, destinos e campos obrigatórios e guarda uma cópia anterior em `docs/revisoes`. Casos suspensos precisam de aprovação para entrar nas perguntas. Uma versão nova de conteúdo separa a carreira e o ranking dos anteriores; as preferências continuam. Os dados antigos não são apagados automaticamente.

`npm run review:export` regenera o CSV a partir do cadastro atual. Não executar sobre a única cópia da devolução humana antes de importá-la.

## PWA offline

Hospedar a pasta `dist` em HTTPS. No primeiro acesso, aguardar “Pronto para uso offline”. Instalar pelo botão quando oferecido ou pelo menu do navegador. Desligar a rede, fechar e reabrir para homologar no tablet físico.

Uma PWA exige o primeiro acesso pelo navegador; não é um instalador executável. A atualização aparece fora da tela de jogo e depende de confirmação. O conteúdo essencial é local e não depende de CDN.

## GitHub Pages

O projeto usa caminhos relativos e foi preparado para subdiretórios. Após criar o repositório na conta escolhida, publicar o conteúdo de `dist`, ou usar o workflow manual fornecido em `.github/workflows/pages.yml` e habilitar Pages com origem GitHub Actions. Não enviar `node_modules`.

Nenhum repositório remoto foi criado nem publicação executada. O workflow é manual para não publicar automaticamente uma versão em homologação.

## Cloudflare Pages

Usar `npm run build` como comando e `dist` como diretório de saída, com Node.js compatível. O mesmo pacote estático é utilizável sem backend.

## Limites conhecidos e aceite humano

- Falta arte original 3D: serviço de geração retornou falha de autenticação. A produção não está visualmente finalizada.
- Os 52 itens aguardam aprovação; sete casos estão suspensos por ambiguidade.
- Confirmar direitos das imagens antes de distribuir referências do PDF fora da homologação.
- Confirmar conteúdo e fluxo de roupas com DEPE e responsáveis pelo PGRSS.
- Homologar em tablets reais, inclusive instalação, áudio, arraste, orientação e atualização de versão. Emulação de navegador não substitui esse aceite.
- Ranking é local e de confiança: não há identificação obrigatória nem proteção contra edição manual do armazenamento do navegador.
- Limpar os dados do navegador ou trocar de navegador/origem remove ou separa os resultados disponíveis.
