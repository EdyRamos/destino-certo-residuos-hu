# 04 - Arquitetura PWA Offline

## Decisão
PWA estático offline-first. V1 sem backend.

## Stack
- Vite;
- TypeScript;
- HTML/CSS nativos;
- `vite-plugin-pwa` / Workbox para precache;
- LocalStorage para preferências e histórico curto;
- JSON local para conteúdo.

## Por que esta arquitetura
O jogo é essencialmente uma máquina de estados local. Um framework pesado e um servidor não agregam valor na primeira versão.

## Fluxo de instalação
1. tablet acessa a URL em HTTPS;
2. app carrega e registra Service Worker;
3. assets essenciais são precacheados;
4. navegador oferece instalação/Add to Home Screen;
5. depois da primeira carga completa, o jogo funciona sem rede.

## Requisito offline
Nenhuma tela essencial pode depender de:
- CDN;
- fonte externa;
- API;
- analytics remoto;
- imagem hospedada fora do pacote.

## Atualização
Ao publicar nova versão:
- Service Worker detecta novo build;
- exibir banner `Nova versão disponível`;
- atualizar ao comando do usuário ou ao reiniciar sessão;
- nunca interromper uma partida em andamento.

## Conteúdo versionado
Adicionar em V1 final:
```ts
export const APP_VERSION = '1.0.0';
export const CONTENT_VERSION = '2026-09-25-draft';
```

## Futuro, se necessário
Sem reescrever a V1, pode ser adicionado:
- sync de resultados quando online;
- painel administrativo;
- QR Code de sessão;
- SSO institucional;
- empacotamento Android via Capacitor/TWA.

Esses itens ficam fora do escopo inicial.
