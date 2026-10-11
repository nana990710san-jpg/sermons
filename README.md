# Floating Wardrobe — SS24

스크롤하면 패션 오브젝트들이 떠다니며, **재질에 따라 다른 소리와 움직임**을 내는 인터랙티브 웹사이트.

| 재질 (`sound`) | 소리 | 움직임 |
| --- | --- | --- |
| `rustle` 코튼·캔버스·데님 | 사각사각 스치는 노이즈 + 바스락 알갱이 | 빠르게 기울었다 돌아옴 |
| `swish` 실크·나일론 | 부드럽게 쓸리는 슉 | 크게, 느리게 휘날림 |
| `beads` 진주·비즈 | 찰랑찰랑 부딪히는 작은 음 | 잘게 떨림 |
| `sequins` 스팽글 | 높고 반짝이는 시머 | 잘게 떨림 |
| `leather` 가죽 | 삐걱이는 크릭 + 버클 딸깍 | 무겁게 진자처럼 흔들림 |
| `metal` 금속 | 맑은 딸랑 | 가볍게 크게 흔들림 |

소리는 모두 Web Audio API로 실시간 합성합니다(오디오 파일 없음). 스크롤 속도가 빠를수록 크게, 화면 중앙에 가까울수록 크게, 화면 좌우 위치에 따라 스테레오로 납니다. 마우스를 올리거나 클릭해도 소리가 납니다.

## 실행

```bash
npm start            # http://localhost:5173
```

## 누끼 이미지 만들기 (GPT 이미지 API)

`assets/items/{id}.png` 가 없으면 임시 실루엣이 표시됩니다. OpenAI API 키로 투명 배경 PNG를 생성하세요.

```bash
export OPENAI_API_KEY=sk-...
npm run generate                                # 없는 것만 생성
npm run generate -- --only pearl-varsity-jacket # 특정 아이템만
npm run generate -- --force                     # 전부 다시 생성
```

### 실제 런웨이/룩북 사진으로 누끼 따기

`assets/source/{id}.jpg` (또는 png/webp)에 사진을 넣고:

```bash
npm run cutout
```

GPT 이미지 편집 API로 모델/배경을 지우고 옷만 투명 배경으로 남깁니다. 직접 딴 PNG를 `assets/items/{id}.png` 로 넣어도 됩니다.

> 사진 원본은 저작권이 있으니 `assets/source/` 는 git에 올라가지 않도록 `.gitignore` 처리되어 있습니다.

## 아이템 추가/수정

`items.js` 에서 이름, 설명, 재질(`sound`), 위치(`x`, `y`), 크기(`w`), 깊이(`depth`), 생성 프롬프트(`prompt`)를 바꾸면 됩니다.
