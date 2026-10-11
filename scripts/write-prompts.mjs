#!/usr/bin/env node
// items.js 의 프롬프트를 ChatGPT에 그대로 붙여넣을 수 있는 PROMPTS.md 로 만든다.
import { writeFile } from 'node:fs/promises';
import { ITEMS, PROMPT_BASE } from '../items.js';

const lines = [
  '# 이미지 생성 프롬프트 (ChatGPT용)',
  '',
  '각 블록을 통째로 복사해 ChatGPT에 붙여넣고, 받은 PNG를 **파일 이름 그대로** `assets/items/` 에 올리세요.',
  '배경이 투명하지 않게 나오면 remove.bg 같은 무료 배경 제거 도구로 한 번 더 누끼를 따 주세요.',
  '',
  '> 이 파일은 `node scripts/write-prompts.mjs` 로 `items.js` 에서 자동 생성됩니다.',
  '',
];
ITEMS.forEach((item, i) => {
  lines.push(`## ${i + 1}. ${item.name}`, '', `- 파일 이름: \`${item.id}.png\``, `- 분석: ${item.concept}`, '', '```', `${PROMPT_BASE}`, '', `Object: ${item.prompt}`, '```', '');
});
await writeFile(new URL('../PROMPTS.md', import.meta.url), lines.join('\n'));
console.log(`PROMPTS.md (${ITEMS.length} items)`);
