# 논문 리뷰 기여 가이드

## 브랜치 명명 규칙

```
review/이름-논문약어
예: review/parkjs-memgpt
    review/parkjs-efficient-kvcache
```

## 파일 경로 규칙

```
YYYY-MM/YYYY-MM-DD-논문약어.md
예: 2026-07/2026-07-15-memgpt-agent-memory.md
```

## 작성 절차

| 단계 | 행동 | 위치 |
|------|------|------|
| 1 | 논문 후보 이슈 등록 | Issues → `paper-review` 템플릿 |
| 2 | 브랜치 생성 | `review/이름-논문약어` |
| 3 | `TEMPLATE.md` 복사해 작성 | `YYYY-MM/` 폴더 |
| 4 | PR 생성 → 팀원 1명 리뷰 요청 | main 브랜치 대상 |
| 5 | Approve 후 머지 | 리뷰어가 수행 |

## 커밋 메시지

```
feat: add review - [논문 제목 약어]
예: feat: add review - MemGPT agent memory
    fix: fix typo in 2026-07-15-memgpt review
    docs: update README review index
```

## 웹사이트 자동 동기화

`YYYY-MM/*.md` 리뷰 파일이 `main`에 merge되면 `.github/workflows/sync-to-site.yml`이
자동으로 `scripts/sync-to-site.js`로 front matter 형식을 변환해
`ai-researchlab.github.io` 레포의 `content/surveys/`에 바로 push합니다.
별도 작업 없이 merge만 하면 몇 분 안에 `https://ai-researchlab.github.io/survey/`에 반영됩니다.

TEMPLATE.md의 `**arXiv**`, `**저자**`, `**발표**`, `**카테고리**`, `**리뷰어**`, `**리뷰 날짜**`,
`## 1️⃣ 한 줄 요약`, `## 7️⃣ 관련 자료`(공식 코드 링크) 형식을 그대로 지켜서 작성해야
변환 스크립트가 정상적으로 값을 추출합니다.

## README 인덱스 업데이트

머지 후 `README.md`의 `<!-- REVIEW_INDEX_START -->` 섹션에 새 리뷰 링크를 추가하세요.

```markdown
### 2026년 7월
- [MemGPT: Towards LLMs as Operating Systems](./2026-07/2026-07-15-memgpt-agent-memory.md) — @parkjs
```

## 리뷰 품질 체크리스트

PR 머지 전 리뷰어가 확인합니다:

- [ ] 한 줄 요약이 논문 핵심을 정확히 담고 있는가
- [ ] 방법론 설명이 논문을 읽지 않은 팀원도 이해할 수 있는가
- [ ] 실험 결과 수치가 논문과 일치하는가
- [ ] "팀 인사이트" 섹션에 단순 요약을 넘어 팀의 관점이 있는가
- [ ] 파일명/폴더 경로가 규칙에 맞는가
