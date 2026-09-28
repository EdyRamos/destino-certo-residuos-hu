# Changelog

## 0.10.0 — Missão Nery (28/09/2026, atualização local)
- Nery refinada, oito destinos ilustrados e substituição das figuras de perguntas por sprites 3D;
- três capítulos narrativos, objetivos de observação, conquistas e revisão de erros ao fim da fase;
- trilha procedural original opcional, efeitos independentes, pausa por diálogo/visibilidade e preferências persistentes;
- animações com redução de movimento, respostas visuais dos destinos e retorno ao topo ao mudar de tela;
- gabarito offline com as mesmas artes dos itens e destinos; catálogo de artes para conferência;
- camada de jogo: item voando até o coletor, coletor reagindo, "+pontos" flutuante, placar animado, trilha de progresso por item e sequência de acertos de primeira;
- Nery com poses por situação (acerto, dica, incentivo, explicação, troféu), diálogos digitados na abertura dos capítulos e dicas gerais durante o jogo;
- estrelas por fase, medalhas de capítulo e conquistas (fase perfeita, sequência, aprender com o erro), mapa da jornada e final com troféu;
- Coleção da equipe com os itens já descobertos no aparelho e reabertura das explicações;
- trilha com temas de menu, jogo e final, ligada por padrão após o primeiro toque e abaixada durante diálogos; novos efeitos sonoros;
- pipeline de artes (`npm run art`): versões por arquivo, recorte de fundo liso, manifesto, cenários, poses e medalhas com reserva automática;
- arte própria para os 45 itens do jogo, seis poses da Nery, cenários do início e dos capítulos, medalhas dos capítulos 1 e 2 e fotos reais dos coletores de vidro do HU;
- conteúdo clínico, critério de aprovação, pontuação e histórico local preservados.

## 0.9.0 - versão de homologação (25/09/2026)
- carreira com três fases sequenciais, dez perguntas e aprovação com seis acertos;
- até três tentativas por pergunta (100/60/30 pontos), sem bônus de sequência, com dica antes da revelação;
- prática por fase isolada da carreira e do ranking;
- ranking local das 20 melhores carreiras, com desempate por acertos na primeira tentativa;
- persistência versionada e validada, com retomada entre tentativas e tolerância a armazenamento indisponível;
- nova interface tablet-first com identidade HU/DEPE, guia Nery (provisória), arraste, toque e teclado;
- gabarito independente em HTML único para apresentação offline;
- revisão preliminar do conteúdo (45 itens habilitados, 7 suspensos), planilha e importador validado para o DEPE;
- PWA com status offline real, atualização fora da partida e compatível com subdiretórios (GitHub Pages);
- testes unitários (Vitest) e de navegador (Playwright);
- conteúdo ainda em validação e arte final 3D pendente (ver `IMPLEMENTATION_REPORT.md`).

## 0.1.0 - pacote inicial
- arquitetura PWA offline-first definida;
- conteúdo transcrito do gabarito fornecido;
- scaffold Vite/TypeScript;
- engine básica de pontuação;
- protótipo de interação touch/Pointer Events;
- documentação para Astra e homologação institucional.
