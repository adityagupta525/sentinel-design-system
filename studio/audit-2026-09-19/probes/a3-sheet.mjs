import { createRequire } from 'node:module'; import { spawn } from 'node:child_process';
import { createServer as p } from 'node:net'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url); const REPO=join(dirname(fileURLToPath(import.meta.url)),'..','..','..');
const {chromium}=require(join(REPO,'node_modules','playwright'));
const PORT=await new Promise((r,j)=>{const s=p();s.once('error',j);s.listen(0,'127.0.0.1',()=>{const{port}=s.address();s.close(()=>r(port));});});
const sv=spawn(process.execPath,[join(REPO,'tools','preview-server.mjs')],{env:{...process.env,PORT:String(PORT)},stdio:'ignore'});
process.on('exit',()=>{try{sv.kill();}catch{}}); await new Promise(r=>setTimeout(r,1400));
const b=await chromium.launch();
for(const rel of ['screens/journey-b/05-decide.html','screens/journey-d/proposal.html','screens/journey-a/risk-profile.html','screens/journey-b/03-thread-answer.html','screens/thread/refusals.html']){
  const pg=await b.newPage({viewport:{width:1500,height:2600}});
  await pg.goto(`http://localhost:${PORT}/${rel}`,{waitUntil:'domcontentloaded',timeout:40000});
  await pg.waitForFunction(()=>(document.getElementById('root')||document.body).innerHTML.length>200,null,{timeout:30000});
  await pg.waitForTimeout(1300);
  const o=await pg.evaluate(()=>[...document.querySelectorAll('[role="dialog"]')].map(d=>{
    const r=d.getBoundingClientRect(); const cs=getComputedStyle(d);
    const scrim=d.previousElementSibling;
    return {label:d.getAttribute('aria-label'),modal:d.getAttribute('aria-modal'),
      w:Math.round(r.width),h:Math.round(r.height),
      composerInsideSheet:d.querySelectorAll('.ds-composer-input').length,
      scrimOpacity:scrim?getComputedStyle(scrim).opacity:'n/a',
      tabbable:d.querySelectorAll('button:not([disabled]):not([tabindex="-1"]),a[href],input:not([type=hidden])').length,
      trapCounts:Array.prototype.filter.call(d.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),(n)=>!n.disabled&&n.getAttribute('aria-hidden')!=='true').length};
  }));
  console.log('\n'+rel.replace('screens/',''));
  for(const d of o) console.log('   ',JSON.stringify(d));
  await pg.close();
}
await b.close(); try{sv.kill();}catch{}
