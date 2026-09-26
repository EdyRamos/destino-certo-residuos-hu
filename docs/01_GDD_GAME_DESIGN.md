# 01 - Game Design Document

## Loop principal
1. O jogo apresenta um item.
2. O usuário arrasta o item para um destino ou toca no destino.
3. O sistema avalia.
4. Acerto: recompensa visual/sonora + pontuação.
5. Erro: feedback forte + destino correto + explicação.
6. Próximo item.
7. Ao final, resumo da sessão.

## Modos
### Treino
Correção imediata e educativa. Ideal para primeira exposição.

### Desafio
Mesmo conteúdo, menos pistas visuais antes da resposta. Mantém correção imediata após a tentativa para não consolidar erro.

## Pontuação
- acerto na primeira tentativa: **100 pontos**;
- bônus de sequência: +10 por acerto consecutivo, limitado a +50 por item;
- erro: **0 pontos naquele item** e sequência volta a zero;
- não usar pontuação negativa na V1;
- métrica principal no resultado: **acurácia (%)**;
- métricas secundárias: pontos, sequência máxima e erros por categoria.

## Feedback de acerto
- check visual;
- confete de 400 a 700 ms;
- tom curto positivo;
- item "viaja" para o destino;
- texto curto: "Correto: Perfurocortantes".

## Feedback de erro
1. X vermelho grande por ~450 ms;
2. som curto de erro;
3. destino escolhido recebe shake curto;
4. destino correto ganha destaque e pulse;
5. painel: `O correto é: <destino>`;
6. explicação em 1 ou 2 frases;
7. botão `Entendi / próximo`.

Exemplo para uma lâmina de bisturi:
`O correto é PERFUROCORTANTES. O item pode cortar ou perfurar e, conforme o gabarito institucional, deve ir ao coletor específico.`

## Progressão
- **Nível 1 - Aquecimento:** itens óbvios e representativos.
- **Nível 2 - Olho clínico:** pares que mudam de destino conforme condição, como seringa com sangue x sem sangue, gesso com sangue x sem sangue, frasco-ampola vazio x com medicação.
- **Nível 3 - Plantão misto:** todas as categorias e itens randomizados.

## Fim da sessão
Mostrar:
- acurácia;
- pontos;
- acertos/erros;
- sequência máxima;
- 3 categorias com mais erros;
- botão `Repetir itens que errei`;
- botão `Novo desafio`;
- botão `Ver gabarito`.

## Regras de randomização
- não repetir item dentro da mesma sessão, salvo no modo de revisão;
- evitar mais de 3 respostas seguidas do mesmo destino quando possível;
- preservar pares pedagógicos em nível 2;
- seed opcional apenas para testes.
