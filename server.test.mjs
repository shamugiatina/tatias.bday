import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const directory = await mkdtemp(path.join(os.tmpdir(), 'birthday-test-'));
process.env.RSVP_FILE = path.join(directory, 'responses.jsonl');
const { server } = await import('./server.mjs');
let base;
before(async () => { await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`; });
after(async () => { await new Promise(resolve => server.close(resolve)); await rm(directory, {recursive:true,force:true}); });
test('serves the invitation and scripts, keeps stored responses private', async () => {
 const response = await fetch(base);
 assert.equal(response.status,200); assert.match(await response.text(), /2026 · 20:00/);
 assert.equal((await fetch(base+'/app.js')).status,200);
 assert.equal((await fetch(base+'/data/responses.jsonl')).status,404);
});
test('persists yes and no responses with Georgian names', async () => {
 for(const attending of ['yes','no']) {
  const result = await fetch(base+'/api/rsvp', {method:'POST',body:JSON.stringify({name:'თათია',attending,note:'♡'})});
  assert.equal(result.status,201);
 }
 const lines = (await readFile(process.env.RSVP_FILE,'utf8')).trim().split('\n').map(JSON.parse);
 assert.equal(lines.length,2); assert.equal(lines[0].name,'თათია'); assert.equal(lines[1].attending,'no');
});
test('rejects malformed and oversized responses', async () => {
 for(const body of ['{',JSON.stringify({name:' ',attending:'yes'}),JSON.stringify({name:'ანა',attending:'maybe'})]) {
  assert.equal((await fetch(base+'/api/rsvp',{method:'POST',body})).status,400);
 }
 assert.equal((await fetch(base+'/api/rsvp',{method:'POST',body:'x'.repeat(5000)})).status,413);
});
