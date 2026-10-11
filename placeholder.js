// 누끼 PNG가 아직 없을 때 보여주는 임시 실루엣 SVG.
const SHAPES = {
  jacket: 'M62 22 L84 12 Q100 34 116 12 L138 22 L188 74 L170 150 L148 132 L150 244 L50 244 L52 132 L30 150 L12 74 Z',
  shirt: 'M62 30 L84 20 Q100 40 116 20 L138 30 L185 70 L165 112 L148 100 L150 230 L50 230 L52 100 L35 112 L15 70 Z',
  coat: 'M66 8 L86 2 Q100 24 114 2 L134 8 L180 60 L168 142 L150 126 L162 256 L38 256 L50 126 L32 142 L20 60 Z',
  pants: 'M52 12 L148 12 L166 252 L116 252 L100 92 L84 252 L34 252 Z',
  bag: 'M30 112 Q30 92 52 92 L148 92 Q170 92 170 112 L176 212 Q176 228 160 228 L40 228 Q24 228 24 212 Z',
  scarf: 'M16 50 L184 34 L162 128 L110 236 L92 236 L60 140 L28 128 Z',
  shoe: 'M18 176 Q18 146 50 140 L92 128 Q112 104 142 114 L178 154 Q194 180 182 194 L26 198 Q12 194 18 176 Z',
  cap: 'M36 160 Q36 74 108 74 Q172 74 176 160 Z M150 154 L198 168 L176 180 L140 162 Z',
  skirt: 'M70 20 L130 20 L150 90 L176 160 L190 240 L10 240 L24 160 L50 90 Z',
  corset: 'M56 20 Q100 40 144 20 L150 110 Q130 140 160 230 L40 230 Q70 140 50 110 Z',
  charm: 'M64 120 L136 120 Q146 120 146 130 L146 214 Q146 224 136 224 L64 224 Q54 224 54 214 L54 130 Q54 120 64 120 Z',
};

// bag 손잡이는 몸통 뒤, charm 고리는 몸통 앞에 그린다.
const BEHIND = {
  bag: '<path d="M68 94 Q68 42 92 42 M108 42 Q132 42 132 94" fill="none" stroke="#6b4a10" stroke-width="9" stroke-linecap="round"/>',
};
const FRONT = {
  bag: '<circle cx="100" cy="150" r="7" fill="#c9a44c"/>',
  charm: '<path d="M72 122 L72 92 Q72 62 100 62 Q128 62 128 92 L128 122" fill="none" stroke="#b08a34" stroke-width="12"/><path d="M100 8 L100 62" stroke="#b08a34" stroke-width="5" stroke-dasharray="8 4"/><circle cx="100" cy="166" r="9" fill="#5a4517"/>',
};

function pattern(id, item) {
  const c = item.color;
  switch (item.pattern) {
    case 'checker':
      return `<pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="${c}"/><rect width="12" height="12" fill="#d6b88a"/>
        <rect x="12" y="12" width="12" height="12" fill="#5c3b20"/></pattern>`;
    case 'pearls':
      return `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="${c}"/>
        <circle cx="7" cy="7" r="4.4" fill="#fffaf0" stroke="#cfc3a8" stroke-width=".8"/>
        <circle cx="5.6" cy="5.6" r="1.4" fill="#fff"/></pattern>`;
    case 'sequins':
      return `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="${c}"/><circle cx="5" cy="5" r="4" fill="#b59a3a" opacity=".85"/>
        <circle cx="0" cy="0" r="3.5" fill="#8f9c45"/><circle cx="10" cy="10" r="3.5" fill="#d8c06a"/></pattern>`;
    case 'denim':
      return `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <rect width="6" height="6" fill="${c}"/><rect width="2" height="6" fill="#5876a0"/></pattern>`;
    default:
      return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".78"/></linearGradient>`;
  }
}

export function placeholderSVG(item) {
  const id = `p-${item.id}`;
  return `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.name}">
    <defs>${pattern(id, item)}</defs>
    ${BEHIND[item.shape] || ''}
    <path d="${SHAPES[item.shape] || SHAPES.jacket}" fill="url(#${id})" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>
    ${FRONT[item.shape] || ''}
  </svg>`;
}
