"""Locus Admission Journey — FastAPI Backend."""

from __future__ import annotations

import json
import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# ── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(title="Locus Admission API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Models ──────────────────────────────────────────────────────────


class UserProfile(BaseModel):
    role: str  # "applicant" | "parent"
    grade: str
    interests: List[str]
    countries: List[str]
    budget: int  # тысячи евро в год
    exams: List[str]


class UniversityRecommendation(BaseModel):
    id: int
    name: str
    program: str
    country: str
    tags: List[str]
    matchPercent: int
    reason: str


class RecommendationsResponse(BaseModel):
    goal: str
    strengths: List[str]
    constraints: List[str]
    universities: List[UniversityRecommendation]


# ── Fallback Mock Data ───────────────────────────────────────────────────────

MOCK_RESPONSE = RecommendationsResponse(
    goal="Бакалавриат в Европе",
    strengths=["Высокий GPA (4.8/5.0)", "IELTS 7.0", "Опыт олимпиад"],
    constraints=["Бюджет: до 40 000 € / год", "Без немецкого языка"],
    universities=[
        UniversityRecommendation(
            id=1,
            name="Sapienza University of Rome",
            program="Computer Science and AI",
            country="🇮🇹 Италия",
            tags=["Стипендия", "Английский язык", "Top-200"],
            matchPercent=94,
            reason=(
                "Программа полностью на английском, есть стипендия за заслуги "
                "до 100% от стоимости. Стоимость жизни в Риме ниже, чем в "
                "большинстве столиц ЕС, что укладывается в бюджет."
            ),
        ),
        UniversityRecommendation(
            id=2,
            name="Czech Technical University",
            program="Software Engineering",
            country="🇨🇿 Чехия",
            tags=["Бесплатно (чешский)", "Английский трек", "Стажировки"],
            matchPercent=88,
            reason=(
                "Бесплатное обучение на чешском языке, англоязычный трек "
                "~3 800 € / год. Сильная IT-экосистема Праги даёт доступ к "
                "стажировкам в международных компаниях."
            ),
        ),
        UniversityRecommendation(
            id=3,
            name="Politecnico di Milano",
            program="Engineering of Computing Systems",
            country="🇮🇹 Италия",
            tags=["Стипендия DSU", "Английский язык", "Top-150"],
            matchPercent=85,
            reason=(
                "Один из лучших технических вузов Европы с программой полностью "
                "на английском. Стипендия DSU покрывает проживание и питание "
                "при подтверждении дохода."
            ),
        ),
    ],
)


# ── OpenAI Integration ───────────────────────────────────────────────────────

SYSTEM_PROMPT = (
    "Ты образовательный консультант. Верни JSON с 3 университетами. "
    "Для каждого вуза обязательно напиши человеческим языком, почему "
    "этот вариант подходит, учитывая бюджет и интересы."
)

RESPONSE_SCHEMA = """
Верни ответ строго в формате JSON (без markdown-обёртки):
{
  "goal": "краткая цель (например: Бакалавриат в Европе)",
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "constraints": ["ограничение 1", "ограничение 2"],
  "universities": [
    {
      "id": 1,
      "name": "Название университета",
      "program": "Название программы",
      "country": "🏳 Страна",
      "tags": ["Тег1", "Тег2"],
      "matchPercent": 90,
      "reason": "Подробное объяснение почему подходит"
    }
  ]
}
"""


def _build_user_message(profile: UserProfile) -> str:
    return (
        f"Профиль абитуриента:\n"
        f"- Роль: {'Абитуриент' if profile.role == 'applicant' else 'Родитель'}\n"
        f"- Класс/курс: {profile.grade}\n"
        f"- Интересы: {', '.join(profile.interests) if profile.interests else 'не указаны'}\n"
        f"- Желаемые страны: {', '.join(profile.countries) if profile.countries else 'не указаны'}\n"
        f"- Годовой бюджет: {profile.budget} 000 €\n"
        f"- Языковые экзамены: {', '.join(profile.exams) if profile.exams else 'нет'}\n"
        f"\n{RESPONSE_SCHEMA}"
    )


async def _get_ai_recommendations(profile: UserProfile) -> RecommendationsResponse:
    """Call OpenAI API; falls back to mock data if key is missing or call fails."""
    api_key = os.getenv("OPENAI_API_KEY", "").strip()

    if not api_key:
        print("⚠️  OPENAI_API_KEY not set — returning mock data")
        return MOCK_RESPONSE

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.7,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_message(profile)},
            ],
        )

        raw = completion.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0]

        data = json.loads(raw)
        return RecommendationsResponse(**data)

    except Exception as e:
        print(f"⚠️  OpenAI call failed: {e} — returning mock data")
        return MOCK_RESPONSE


# ── Endpoints ────────────────────────────────────────────────────────────────


@app.get("/")
async def root():
    return {"status": "ok", "service": "Locus Admission API"}


@app.post("/api/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(profile: UserProfile):
    """Generate personalized university recommendations based on user profile."""
    return await _get_ai_recommendations(profile)
