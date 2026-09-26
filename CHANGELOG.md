# Changelog

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
