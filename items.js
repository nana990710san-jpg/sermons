// 떠다니는 오브젝트 목록.
// - id: assets/items/{id}.png 파일명 (투명 배경 누끼 PNG)
// - sound: 소리/움직임 성격 (rustle | swish | beads | sequins | leather | metal)
// - x: 왼쪽 위치(vw), y: 장면 안 세로 위치(vh), w: 너비(vw), depth: 패럴랙스 깊이(작을수록 멀리)
// - prompt: GPT 이미지 생성용 오브젝트 묘사 (scripts/generate-images.mjs 가 사용)
// - shape/pattern/color: 이미지가 아직 없을 때 보여줄 임시 실루엣

export const PROMPT_BASE = [
  'Create a PNG image with a fully transparent background (alpha channel).',
  'High-end fashion e-commerce cutout photo of a single item, invisible ghost-mannequin style: no person, no mannequin, no hanger, no props, no floor shadow.',
  'Whole object visible and centered with generous margin, soft diffused studio lighting, ultra-detailed realistic material texture.',
  'No text, no letters, no logos, no watermark.',
].join(' ');

// 루이비통 2024 S/S 리뷰에서 확인한 피스들을 바탕으로 한 묘사 (정확한 룩 복제가 아니라 디자인 특징 요약).
// 남성복: 퍼렐 윌리엄스 데뷔 쇼 (2023.6.20, 퐁뇌프) / 여성복: 니콜라 제스키에르 (2023.10.2, 샹젤리제)
export const ITEMS = [
  {
    id: 'damoflage-suit-jacket',
    name: 'Damoflage Suit Jacket',
    concept: '다미에 체커를 8비트 픽셀 카모로 쪼갠 "다모플라주" 수트 재킷. 퍼렐이 피날레 인사 때 입은 바로 그 패턴. 울 캔버스가 스치는 사각.',
    sound: 'rustle',
    x: 8, y: 40, w: 26, depth: 1.15, aspect: 'portrait',
    shape: 'jacket', pattern: 'checker', color: '#7d5a3a',
    prompt: 'single-breasted tailored suit jacket with notch lapels, fabric printed all over with a pixelated 8-bit camouflage built from small checkerboard squares in brown, tan, khaki and olive green, front view',
  },
  {
    id: 'pearl-track-jacket',
    name: 'Pearl-Trimmed Track Jacket',
    concept: '포켓과 솔기 라인을 따라 유리 진주를 손으로 하나하나 박은 트랙 재킷. 진주끼리 부딪히는 찰랑.',
    sound: 'beads',
    x: 60, y: 85, w: 28, depth: 0.9, aspect: 'portrait',
    shape: 'jacket', pattern: 'pearls', color: '#2c3a52',
    prompt: 'zip-up track jacket in deep navy technical fabric with stand collar, every seam, zip placket and pocket edge outlined with rows of hand-applied white glass pearls, small pearl-outlined emblem on the chest, front view',
  },
  {
    id: 'millionaire-speedy',
    name: 'Yellow Croc "Millionaire" Speedy',
    concept: '퍼렐이 들고 나온 강렬한 옐로 크로커다일 스피디. 골드 체인 스트랩과 다이아몬드 패드락. 가죽 크릭과 체인의 딸깍.',
    sound: 'leather',
    x: 22, y: 140, w: 24, depth: 1.3, aspect: 'square',
    shape: 'bag', pattern: 'solid', color: '#f2c200',
    prompt: 'soft barrel-shaped boston top-handle bag in glossy bright lemon-yellow crocodile leather with rolled handles, chunky gold chain shoulder strap and a gold padlock set with diamonds hanging from the zip, three-quarter view',
  },
  {
    id: 'lvers-leather-varsity',
    name: 'LVERS Leather Varsity',
    concept: '"Virginia is for Lovers"에서 따온 LVERS 레터링 감성의 가죽 바시티 재킷. 두꺼운 가죽이 접히는 삐걱.',
    sound: 'leather',
    x: 64, y: 190, w: 26, depth: 1.05, aspect: 'portrait',
    shape: 'jacket', pattern: 'solid', color: '#7a1f24',
    prompt: 'varsity bomber jacket made entirely of smooth burgundy-red leather with cream leather sleeves, striped ribbed knit collar, cuffs and hem, snap buttons, a large chenille varsity letter patch with an abstract heart motif on the chest, front view',
  },
  {
    id: 'damoflage-denim-jeans',
    name: 'Damoflage Denim Jeans',
    concept: '인디고 데님 위에 다모플라주 픽셀 카모를 입힌 진. 퍼렐이 직접 입은 피스. 묵직한 데님이 비벼지는 소리.',
    sound: 'rustle',
    x: 40, y: 240, w: 20, depth: 1.2, aspect: 'portrait',
    shape: 'pants', pattern: 'denim', color: '#34507a',
    prompt: 'straight wide-leg indigo denim jeans with a tonal pixelated 8-bit camouflage of small checkerboard squares printed in faded indigo, light blue and tan, front view as if worn by an invisible person',
  },
  {
    id: 'pearl-tweed-jacket',
    name: 'Pearl-Accented Tweed Jacket',
    concept: '진주 장식이 군데군데 박힌 트위드 재킷. 거친 트위드의 바스락 위로 진주가 짤랑.',
    sound: 'beads',
    x: 10, y: 285, w: 26, depth: 0.85, aspect: 'portrait',
    shape: 'jacket', pattern: 'pearls', color: '#d8cdb8',
    prompt: 'boxy collarless jacket in nubby cream, beige and brown woven boucle tweed with frayed edges, accented with clusters of white pearls along the edges and pockets, front view',
  },
  {
    id: 'padlock-key-charm',
    name: 'Padlock & Key Charm',
    concept: '스피디의 상징 패드락과 열쇠를 체인에 매단 참. 금속이 맞닿는 맑은 딸랑.',
    sound: 'metal',
    x: 52, y: 320, w: 14, depth: 1.4, aspect: 'portrait',
    shape: 'charm', pattern: 'solid', color: '#c9a44c',
    prompt: 'polished gold-tone brass padlock and small key hanging from a chunky curb chain keyring, front view',
  },
  {
    id: 'embroidered-denim-jacket',
    name: 'Artist-Embroidered Denim Jacket',
    concept: '화가 헨리 테일러의 작품을 자수로 옮긴 데님 재킷에서 영감. 단단한 데님의 사각.',
    sound: 'rustle',
    x: 66, y: 360, w: 26, depth: 1.0, aspect: 'portrait',
    shape: 'jacket', pattern: 'denim', color: '#3f5f8a',
    prompt: 'classic indigo denim trucker jacket with a large dense hand-embroidered painterly scene of people in bold flat colors covering the back panel, seen from the back',
  },
  {
    id: 'fluted-leather-corset',
    name: 'Fluted Leather Corset',
    concept: '여성복 쇼의 블랙 가죽 플루티드 코르셋. 구조적인 가죽이 버티며 내는 낮은 크릭.',
    sound: 'leather',
    x: 14, y: 410, w: 20, depth: 1.25, aspect: 'portrait',
    shape: 'corset', pattern: 'solid', color: '#1d1a17',
    prompt: 'sculptural strapless corset bodice in glossy black leather with vertical fluted pleats fanning out at the waist and hips, structured boning, front view',
  },
  {
    id: 'mousseline-tiered-skirt',
    name: 'Mousseline Tiered Skirt',
    concept: '코르셋과 함께 나온 모슬린·샤르뫼즈 티어드 스커트. 실크가 바람에 쓸리는 부드러운 슉.',
    sound: 'swish',
    x: 60, y: 455, w: 26, depth: 0.8, aspect: 'portrait',
    shape: 'skirt', pattern: 'solid', color: '#c9b9a6',
    prompt: 'long flowing tiered skirt made of layered sheer silk mousseline and liquid charmeuse in champagne, dusty rose and taupe, the tiers floating and rippling as if caught in a breeze',
  },
  {
    id: 'houndstooth-bomber',
    name: 'Distorted Houndstooth Bomber',
    concept: '여성복 쇼의 일그러진 하운즈투스 패턴을 입힌 볼륨 봄버. 빳빳한 원단의 바스락.',
    sound: 'rustle',
    x: 24, y: 500, w: 26, depth: 1.1, aspect: 'portrait',
    shape: 'jacket', pattern: 'checker', color: '#222222',
    prompt: 'voluminous cropped bomber jacket with rounded balloon sleeves, in a warped stretched black and ivory houndstooth pattern, ribbed collar and cuffs, front view',
  },
];
