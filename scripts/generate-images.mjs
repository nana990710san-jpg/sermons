#!/usr/bin/env node
// OpenAI 이미지 API(GPT)로 items.js의 오브젝트들을 투명 배경 누끼 PNG로 만든다.
//
//   OPENAI_API_KEY=sk-... npm run generate                 # 없는 이미지만 새로 생성
//   OPENAI_API_KEY=sk-... npm run generate -- --force      # 전부 다시 생성
//   OPENAI_API_KEY=sk-... npm run generate -- --only pearl-varsity-jacket,silk-bandana
//   OPENAI_API_KEY=sk-... npm run cutout                   # assets/source/{id}.jpg|png 실제 사진에서 배경만 제거
//
// 환경변수: OPENAI_IMAGE_MODEL (기본 gpt-image-1), OPENAI_IMAGE_QUALITY (low|medium|high, 기본 high)
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { ITEMS, PROMPT_BASE } from '../items.js';

const API = 'https://api.openai.com/v1/images';
const key = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const quality = process.env.OPENAI_IMAGE_QUALITY || 'high';

const args = process.argv.slice(2);
const force = args.includes('--force');
const fromPhotos = args.includes('--from-photos');
const onlyArg = args.indexOf('--only');
const only = onlyArg >= 0 ? args[onlyArg + 1]?.split(',') : null;

if (!key) {
  console.error('OPENAI_API_KEY 환경변수가 필요합니다. 예) OPENAI_API_KEY=sk-... npm run generate');
  process.exit(1);
}

const outDir = new URL('../assets/items/', import.meta.url);
const srcDir = new URL('../assets/source/', import.meta.url);
await mkdir(outDir, { recursive: true });

const exists = (u) => access(u).then(() => true, () => false);
const SIZE = { portrait: '1024x1536', square: '1024x1024', wide: '1536x1024' };

async function findSource(id) {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const u = new URL(`${id}.${ext}`, srcDir);
    if (await exists(u)) return { url: u, ext };
  }
  return null;
}

async function generate(item) {
  const res = await fetch(`${API}/generations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: `${PROMPT_BASE}\n\nObject: ${item.prompt}`,
      size: SIZE[item.aspect] || 'auto',
      background: 'transparent',
      output_format: 'png',
      quality,
      n: 1,
    }),
  });
  return res;
}

async function cutout(item, src) {
  const form = new FormData();
  const type = src.ext === 'jpg' ? 'image/jpeg' : `image/${src.ext}`;
  form.append('image', new Blob([await readFile(src.url)], { type }), `${item.id}.${src.ext}`);
  form.append('model', model);
  form.append('prompt',
    'Remove the background and the model/person completely. Keep only the garment or accessory exactly as it is ' +
    '(same shape, color, pattern, embellishment and details), as a clean product cutout on a fully transparent background.');
  form.append('background', 'transparent');
  form.append('quality', quality);
  form.append('size', 'auto');
  return fetch(`${API}/edits`, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form });
}

let ok = 0, fail = 0;
for (const item of ITEMS) {
  if (only && !only.includes(item.id)) continue;
  const out = new URL(`${item.id}.png`, outDir);
  if (!force && (await exists(out))) {
    console.log(`• skip ${item.id} (이미 있음, --force 로 덮어쓰기)`);
    continue;
  }

  let res;
  if (fromPhotos) {
    const src = await findSource(item.id);
    if (!src) {
      console.log(`• skip ${item.id} (assets/source/${item.id}.jpg|png 없음)`);
      continue;
    }
    console.log(`… cutout ${item.id}`);
    res = await cutout(item, src);
  } else {
    console.log(`… generate ${item.id}`);
    res = await generate(item);
  }

  if (!res.ok) {
    console.error(`✗ ${item.id}: ${res.status} ${await res.text()}`);
    fail++;
    continue;
  }
  const b64 = (await res.json()).data?.[0]?.b64_json;
  if (!b64) {
    console.error(`✗ ${item.id}: 응답에 이미지가 없습니다`);
    fail++;
    continue;
  }
  await writeFile(out, Buffer.from(b64, 'base64'));
  console.log(`✓ assets/items/${item.id}.png`);
  ok++;
}
console.log(`\n완료: 성공 ${ok}, 실패 ${fail}`);
if (fail) process.exitCode = 1;
