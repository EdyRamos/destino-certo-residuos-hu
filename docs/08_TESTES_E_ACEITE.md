# 08 - Testes e Critérios de Aceite

## Funcionais
- [ ] todos os itens do gabarito aparecem no nível misto;
- [ ] cada item aponta para um destinationId existente;
- [ ] acerto soma 100 + bônus de sequência;
- [ ] erro não soma pontos e zera sequência;
- [ ] erro mostra destino correto e explicação;
- [ ] sessão termina e exibe resumo;
- [ ] repetir erros cria nova sessão apenas com itens errados;
- [ ] som pode ser desligado;
- [ ] animações respeitam reduzir movimento.

## Touch/tablet
- [ ] drag funciona com Pointer Events;
- [ ] toque direto no destino funciona;
- [ ] nenhum destino exige gesto fino;
- [ ] interface funciona em 1280x800, 1920x1200 e portrait comum de tablet.

## Offline/PWA
- [ ] instalação disponível em navegador compatível;
- [ ] após primeira carga completa, desligar Wi-Fi e reiniciar app: jogo abre;
- [ ] todos os níveis e itens abrem offline;
- [ ] nenhum request externo é necessário;
- [ ] atualização não interrompe partida ativa.

## Conteúdo
- [ ] `CONTEUDO_PARA_VALIDACAO.csv` aprovado pela equipe responsável;
- [ ] nenhum item `REVIEW_REQUIRED` pendente para produção;
- [ ] versão de conteúdo registrada.

## Testes automatizados mínimos
- scoring;
- validação de IDs;
- contagem de itens por destino;
- randomização sem repetição;
- persistência do histórico local.

## Homologação humana
Realizar teste com pelo menos:
- 1 pessoa da DEP;
- 1 profissional assistencial;
- 1 usuário que nunca tenha visto o jogo físico.

Observar onde tocam, erros de interpretação e tempo por item.
