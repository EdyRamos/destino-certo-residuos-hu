import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',timeout:90000,expect:{timeout:10000},fullyParallel:false,workers:1,
 // PW_CHANNEL=chrome ou msedge usa o navegador já instalado, sem baixar o Chromium do Playwright.
 use:{baseURL:'http://127.0.0.1:4173',viewport:{width:1280,height:800},headless:true,trace:'retain-on-failure',channel:process.env.PW_CHANNEL||undefined},
 reporter:[['list'],['html',{outputFolder:'output/browser-report',open:'never'}]],
 webServer:[
  {command:'npm run preview -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:true},
  // Mesmo pacote servido em subdiretório, como no GitHub Pages (/<repositorio>/).
  {command:'npm run preview -- --base /residuos/ --host 127.0.0.1 --port 4174',url:'http://127.0.0.1:4174/residuos/',reuseExistingServer:true}
 ]
});