/* A3 · a composer on every screen, and B2 · the paperclip is real. Counted per PHONE, because the
   rule is per screen and a board is many screens. The one documented exception is the confirm sheet. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createServer as probePort } from 'node:net';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const { chromium } = require(join(REPO, 'node_modules', 'playwright'));
const PORT = await new Promise((res, rej) => { const s = probePort(); s.once('error', rej); s.listen(0,'127.0.0.1',()=>{const {port}=s.address(); s.close(()=>res(port));}); });
const server = spawn(process.execPath,[join(REPO,'tools','preview-server.mjs')],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
process.on('exit',()=>{try{server.kill();}catch{}});
await new Promise(r=>setTimeout(r,1400));
const PAGES=['screens/journey-a/risk-profile.html','screens/journey-b/01-home.html','screens/journey-b/03-thread-answer.html','screens/journey-b/05-decide.html','screens/journey-c/funds.html','screens/journey-d/proposal.html','screens/journey-e/rebalance.html','screens/journey-f/review.html','screens/thread/ledger.html','screens/thread/refusals.html','screens/thread/going-back.html','screens/shell/drawer.html','screens/prototype.html'];
const browser=await chromium.launch(); let tot=0, withC=0, sheets=0, inert=0, live=0;
const gaps=[];
for(const rel of PAGES){
  const page=await browser.newPage({viewport:{width:1500,height:2600}});
  await page.goto(`http://localhost:${PORT}/${rel}`,{waitUntil:'domcontentloaded',timeout:40000});
  await page.waitForFunction(()=>(document.getElementById('root')||document.body).innerHTML.length>200,null,{timeout:30000});
  await page.waitForTimeout(1300);
  const o=await page.evaluate(()=>{
    const phones=[...document.querySelectorAll('div')].filter(d=>{const r=d.getBoundingClientRect(),cs=getComputedStyle(d);
      return Math.round(r.width)===375&&Math.round(r.height)===812&&cs.overflow.includes('hidden')&&parseFloat(cs.borderTopLeftRadius)>20;});
    return phones.map((p,i)=>({i,
      composer:p.querySelectorAll('.ds-composer-input').length,
      money:!!p.querySelector('[data-money-composer], input[inputmode="numeric"]'),
      sheet:!!p.querySelector('[role="dialog"]'),
      sheetLabel:(p.querySelector('[role="dialog"]')||{getAttribute:()=>null}).getAttribute('aria-label'),
      attachLive:p.querySelectorAll('[data-attach="live"]').length,
      attachInert:p.querySelectorAll('[data-attach="inert"]').length,
      head:(p.textContent||'').replace(/\s+/g,' ').trim().slice(0,46)}));
  });
  for(const p of o){ tot++; if(p.composer) withC++; if(p.sheet) sheets++; inert+=p.attachInert; live+=p.attachLive;
    if(!p.composer) gaps.push({rel:rel.replace('screens/',''),...p}); }
  await page.close();
}
await browser.close(); try{server.kill();}catch{}
console.log(`phones measured: ${tot}`);
console.log(`  with a composer            : ${withC}`);
console.log(`  WITHOUT a composer         : ${tot-withC}`);
console.log(`  carrying a [role=dialog]   : ${sheets}`);
console.log(`  paperclip LIVE (data-attach="live")  : ${live}`);
console.log(`  paperclip INERT (a drawing of one)   : ${inert}`);
console.log('\nphones with no composer — each must be the documented sheet exception:');
for(const g of gaps) console.log(`  ${g.rel} phone ${g.i+1}  dialog=${g.sheet?JSON.stringify(g.sheetLabel):'NONE'}  "${g.head}"`);
