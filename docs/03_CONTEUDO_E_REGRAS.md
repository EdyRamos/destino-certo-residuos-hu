# 03 - Conteúdo e Regras

## Fonte provisória de verdade
O conteúdo inicial foi transcrito do `A4 GABARITO JOGO RESÍDUOS PEÇAS.pdf` enviado pela equipe.

O gabarito contém, entre outros grupos:
- saco branco leitoso: 16 itens;
- hamper: 9 itens;
- saco vermelho;
- saco verde: 9 itens;
- saco preto: 7 itens;
- perfurocortantes: 6 itens;
- vidros (frasco-ampola);
- vidros (frasco-ampola) químico.

## Regra editorial
O software **não deve decidir normas de descarte**. Ele executa o conteúdo institucional aprovado.

Cada item possui:
- `id` estável;
- `name`;
- `destinationId`;
- imagem/placeholder;
- explicação;
- referência de página;
- status de validação.

## Conteúdo condicional importante
O design deve destacar pares que parecem iguais mas mudam de destino conforme condição, por exemplo:
- gesso/tala **com sangue** x **sem sangue**;
- seringa **com sangue e sem agulha** x **sem agulha e sem sangue**;
- frasco-ampola **vazio** x **com resto de medicação**;
- bolsa de hemocomponentes **após transfusão** x **vencida/infectada**.

Esses pares são pedagógicos e devem aparecer com frequência no nível 2.

## Revisão de conteúdo
Antes da produção:
1. DEP revisa `CONTEUDO_PARA_VALIDACAO.csv`;
2. responsável técnico confirma classificações;
3. explicações são ajustadas;
4. `requiresInstitutionalValidation` passa a `false`;
5. incrementar `contentVersion`;
6. registrar no changelog.

## Não fazer
- não inferir destino pela cor do objeto;
- não usar apenas imagem sem nome textual;
- não criar justificativa normativa sem validação;
- não substituir o gabarito por busca na internet sem decisão institucional.
