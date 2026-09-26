# 06 - Feedback, Som e Animação

## Acerto
- duração total ideal: < 900 ms;
- confete curto;
- check grande;
- leve escala do destino correto;
- som positivo de 2 notas gerado por Web Audio API.

## Erro
- X vermelho grande por 350-500 ms;
- shake curto no destino escolhido;
- som grave curto gerado por Web Audio API;
- destino correto destacado por pulse;
- explicação textual antes do próximo item.

## Sem arquivos de áudio obrigatórios
Na V1, gerar sons simples com Web Audio API mantém o app leve e offline. Assets sonoros podem ser adicionados depois.

## Vibração
Opcional e desativável. Se usada:
- sucesso: vibração muito curta;
- erro: padrão curto duplo.

Não depender de vibração para feedback.

## Redução de movimento
Com `prefers-reduced-motion: reduce`:
- remover confete;
- remover shake/pulse contínuo;
- manter ícones e texto.
