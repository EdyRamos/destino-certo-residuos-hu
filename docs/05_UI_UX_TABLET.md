# 05 - UI/UX Tablet

## Orientação
Tablet-first. Priorizar landscape, mas manter portrait utilizável.

## Tela de jogo em landscape
- topo: logo/nome, nível, pontuação, sequência, som;
- centro: carta do item atual com imagem grande + nome;
- base/laterais: destinos em grade 4x2;
- feedback ocupa camada central sem deslocar a interface.

## Tamanho de toque
Alvos principais com pelo menos ~64 px de altura/largura no tablet. Espaçamento suficiente para uso com luvas quando aplicável ao contexto de treinamento.

## Interação
### Primária
Arrastar item para o destino usando Pointer Events.

### Alternativa
Tocar no destino para classificar o item atual.

Isso evita falha de usabilidade quando o drag estiver difícil para algum usuário.

## Destinos
Mostrar simultaneamente os 8 destinos, com:
- nome curto;
- nome completo acessível;
- cor institucional do recipiente;
- símbolo;
- ilustração do recipiente na arte final.

## Acessibilidade
- texto sempre acompanha cor;
- contraste alto;
- fonte do sistema;
- opção de reduzir animações;
- som pode ser desligado;
- foco visível para teclado;
- botões com `aria-label`;
- feedback de acerto/erro com texto e ícone, não só cor/som.

## Tela Aprender
Grade por destino com todos os itens. Deve funcionar offline e servir como gabarito rápido.
