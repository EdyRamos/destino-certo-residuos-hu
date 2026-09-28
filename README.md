# Destino Certo - Resíduos HU

Jogo educativo para tablet sobre segregação e acondicionamento de resíduos no HU-UEL. Versão de homologação 0.10.0, publicada em https://edyramos.github.io/destino-certo-residuos-hu/.

## Conceito
O participante recebe itens do cotidiano hospitalar com a condição de uso descrita e deve encaminhá-los ao destino correto. Cada pergunta admite três tentativas (100, 60 e 30 pontos); antes da revelação há uma dica, e depois do acerto ou do terceiro erro aparecem o destino e a explicação. A carreira tem três fases; é preciso acertar 6 de 10 para avançar. A prática por fase não altera a carreira nem o ranking local.

## Missão Nery
Capítulos com diálogos da Nery, item voando até o coletor, estrelas, medalhas, conquistas, Coleção da equipe e revisão dos itens que exigiram atenção. Trilha original com temas por tela e efeitos, sem dependência de rede. Consulte `docs/ARTE_E_GAMIFICACAO.md`; novas artes entram com `npm run art` (lista para gerar em `docs/LEONARDO_ASSETS.md`).

## PWA e offline
O aplicativo é instalado no tablet pelo navegador. A primeira visita precisa de rede; depois de exibir “Pronto para uso offline”, o jogo funciona sem internet.

## Comandos
```bash
npm ci
npm test
npm run build
npm run preview
npm run test:e2e
```
Sem o Chromium do Playwright instalado, use o navegador da máquina: `PW_CHANNEL=chrome npm run test:e2e`.

## Estrutura
- `src/`: jogo (`game/` motor, `storage/` persistência, `ui/` apoio de interface, `data/` conteúdo em JSON, `presenter/` gabarito).
- `scripts/`: gerador do gabarito, importação/exportação da planilha do DEPE e ícones.
- `tests/` e `e2e/`: testes unitários e de navegador.
- `docs/`: especificação, revisão do conteúdo, assets pendentes e instruções de validação e publicação.
- `assets/reference/`: PDF e fotos do jogo físico fornecidos pela equipe.

## Documentos principais
- `IMPLEMENTATION_REPORT.md`: o que foi feito, verificações e pendências.
- `docs/COMO_VALIDAR_E_PUBLICAR.md`: instalação, revisão do DEPE e publicação.
- `docs/ARTE_E_GAMIFICACAO.md`: direção visual, missão, áudio e integração dos assets.
- `docs/REVISAO_CONTEUDO.md`: revisão preliminar e casos suspensos.

## V1 não tem
- login obrigatório;
- backend;
- dependência de internet durante o jogo;
- analytics externos;
- anúncios;
- dados clínicos ou de pacientes.

## Próxima etapa humana
A Divisão de Ensino e Pesquisa deve revisar `docs/CONTEUDO_PARA_VALIDACAO.csv` e aprovar as classificações e explicações antes da publicação.
