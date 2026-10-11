// 떠다니는 오브젝트 목록.
// - id: assets/items/{id}.png 파일명 (투명 배경 누끼 PNG)
// - sound: 소리/움직임 성격 (rustle | swish | beads | sequins | leather | metal)
// - x: 왼쪽 위치(vw), y: 장면 안 세로 위치(vh), w: 너비(vw), depth: 패럴랙스 깊이(작을수록 멀리)
// - prompt: GPT 이미지 생성용 오브젝트 묘사 (scripts/generate-images.mjs 가 사용)
// - shape/pattern/color: 이미지가 아직 없을 때 보여줄 임시 실루엣

export const PROMPT_BASE = [
  'High-end fashion e-commerce cutout photo of a single item, isolated on a fully transparent background.',
  'Invisible ghost-mannequin style: no person, no mannequin, no hanger, no props, no shadow on floor.',
  'Entire object visible and centered with generous margin, soft diffused studio lighting, ultra-detailed material texture.',
  'Aesthetic: Spring/Summer 2024 Paris menswear runway, Pharrell-era luxury, pixelated brown-and-tan checkerboard "camouflage" motifs, warm tan, mustard yellow and cream palette.',
  'No text, no letters, no brand logos, no watermark.',
].join(' ');

export const ITEMS = [
  {
    id: 'pixel-camo-chore-jacket',
    name: 'Pixel Camo Chore Jacket',
    concept: '갈색·탄 체커보드를 픽셀 카모로 쪼갠 워크웨어 재킷. 코튼 캔버스가 스치는 소리.',
    sound: 'rustle',
    x: 8, y: 40, w: 26, depth: 1.15, aspect: 'portrait',
    shape: 'jacket', pattern: 'checker', color: '#8a5a33',
    prompt: 'boxy cotton-canvas chore jacket with patch pockets, covered in a pixelated camouflage made of brown, tan, khaki and olive checkerboard squares, front view',
  },
  {
    id: 'pearl-varsity-jacket',
    name: 'Pearl Varsity Jacket',
    concept: '크림 바시티 재킷 전체에 진주와 유리 비즈를 수놓은 피스. 움직일 때마다 찰랑.',
    sound: 'beads',
    x: 60, y: 85, w: 28, depth: 0.9, aspect: 'portrait',
    shape: 'jacket', pattern: 'pearls', color: '#efe6d2',
    prompt: 'cream wool varsity jacket with ribbed collar and cuffs, entire body densely hand-embroidered with freshwater pearls and clear glass beads forming a checkerboard pattern, front view',
  },
  {
    id: 'mustard-leather-boston',
    name: 'Mustard Leather Boston Bag',
    concept: '머스터드 옐로 소가죽 보스턴 백. 가죽이 눌리는 삐걱임과 금속 버클의 딸깍.',
    sound: 'leather',
    x: 22, y: 140, w: 24, depth: 1.3, aspect: 'square',
    shape: 'bag', pattern: 'solid', color: '#d9a21b',
    prompt: 'rounded barrel-shaped boston top-handle bag in glossy mustard-yellow grained calf leather with rolled leather handles, gold-tone zip and padlock hardware, three-quarter view',
  },
  {
    id: 'sequin-camp-shirt',
    name: 'Sequin Camo Camp Shirt',
    concept: '초록·금색 스팽글로 카모를 그린 캠프 칼라 셔츠. 빛처럼 반짝이는 시머.',
    sound: 'sequins',
    x: 64, y: 190, w: 24, depth: 1.05, aspect: 'portrait',
    shape: 'shirt', pattern: 'sequins', color: '#5d6b2f',
    prompt: 'short-sleeve camp-collar shirt fully covered in small overlapping sequins in olive green, bronze and gold forming a pixelated camouflage pattern, front view',
  },
  {
    id: 'silk-bandana',
    name: 'Silk Twill Bandana',
    concept: '체커 프린트 실크 트윌 반다나. 바람처럼 부드럽게 휘날리는 스윽.',
    sound: 'swish',
    x: 10, y: 230, w: 20, depth: 0.75, aspect: 'square',
    shape: 'scarf', pattern: 'checker', color: '#b07a3e',
    prompt: 'square silk twill bandana scarf loosely floating and folded mid-air with soft waves, printed with a tan and chocolate brown checkerboard and thin cream border',
  },
  {
    id: 'pixel-denim-trousers',
    name: 'Pixel Denim Trousers',
    concept: '와이드 레그 데님 위에 픽셀 체커를 레이저로 새긴 팬츠. 묵직한 데님이 비벼지는 소리.',
    sound: 'rustle',
    x: 40, y: 270, w: 20, depth: 1.2, aspect: 'portrait',
    shape: 'pants', pattern: 'denim', color: '#3f5f8a',
    prompt: 'wide-leg indigo denim trousers with a subtle laser-faded pixelated checkerboard pattern, cuffed hems, front view, laid as if worn by invisible person',
  },
  {
    id: 'tan-leather-trench',
    name: 'Tan Leather Trench',
    concept: '버터처럼 부드러운 탄 램스킨 트렌치. 가죽 특유의 낮은 크릭.',
    sound: 'leather',
    x: 66, y: 320, w: 26, depth: 0.85, aspect: 'portrait',
    shape: 'coat', pattern: 'solid', color: '#b9824f',
    prompt: 'long double-breasted trench coat in supple tan lambskin leather with belt and storm flap, front view',
  },
  {
    id: 'pearl-loafers',
    name: 'Pearl-Studded Loafers',
    concept: '갑피에 진주를 박은 블랙 로퍼. 작은 진주들이 부딪히는 짤랑.',
    sound: 'beads',
    x: 14, y: 370, w: 22, depth: 1.25, aspect: 'wide',
    shape: 'shoe', pattern: 'pearls', color: '#1d1a17',
    prompt: 'single black patent leather penny loafer with the vamp encrusted with white pearls, side three-quarter view',
  },
  {
    id: 'padlock-chain-charm',
    name: 'Padlock Chain Charm',
    concept: '골드 체인에 매달린 패드락 참. 금속이 맞닿는 맑은 딸랑.',
    sound: 'metal',
    x: 48, y: 405, w: 14, depth: 1.4, aspect: 'portrait',
    shape: 'charm', pattern: 'solid', color: '#c9a44c',
    prompt: 'polished gold-tone brass padlock charm hanging from a chunky curb chain with a small key, front view',
  },
  {
    id: 'yellow-nylon-blazer',
    name: 'Yellow Technical Blazer',
    concept: '선명한 옐로 테크니컬 나일론 블레이저. 매끈한 나일론이 스치는 슉.',
    sound: 'swish',
    x: 66, y: 450, w: 25, depth: 1.0, aspect: 'portrait',
    shape: 'jacket', pattern: 'solid', color: '#f0c419',
    prompt: 'single-breasted tailored blazer made of glossy lemon-yellow technical nylon with sharp lapels, front view',
  },
  {
    id: 'checker-trucker-cap',
    name: 'Checker Trucker Cap',
    concept: '픽셀 체커 캔버스 트러커 캡. 가벼운 캔버스의 바스락.',
    sound: 'rustle',
    x: 24, y: 495, w: 18, depth: 0.8, aspect: 'square',
    shape: 'cap', pattern: 'checker', color: '#7a4f2c',
    prompt: 'baseball trucker cap in canvas printed with a pixelated brown and tan checkerboard, curved brim, three-quarter view',
  },
];
