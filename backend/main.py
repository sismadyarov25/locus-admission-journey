"""Locus Admission Journey — FastAPI Backend."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Явно указываем путь к .env относительно этого файла,
# чтобы load_dotenv работал из любой рабочей директории
_ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

# Отладочный вывод при старте сервера
_key = os.getenv("OPENAI_API_KEY", "")
print(f"🔑 OPENAI_API_KEY loaded: {'YES (' + _key[:8] + '...)' if _key else 'NO — will use mock data'}")

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
    why_it_fits: str


class RecommendationsResponse(BaseModel):
    goal: str
    strengths: List[str]
    constraints: List[str]
    universities: List[UniversityRecommendation]


class RoadmapRequest(BaseModel):
    profile: UserProfile
    universityName: str


class NextAction(BaseModel):
    title: str
    description: str


class RoadmapStep(BaseModel):
    timeframe: str
    title: str
    description: str


class RoadmapResponse(BaseModel):
    next_action: NextAction
    steps: List[RoadmapStep]


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
            why_it_fits=(
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
            why_it_fits=(
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
            why_it_fits=(
                "Один из лучших технических вузов Европы с программой полностью "
                "на английском. Стипендия DSU покрывает проживание и питание "
                "при подтверждении дохода."
            ),
        ),
    ],
)

MOCK_ROADMAP_RESPONSE = RoadmapResponse(
    next_action=NextAction(
        title="Зарегистрироваться на IELTS/TOEFL",
        description="Выберите дату сдачи не позднее чем через 2 месяца и начните интенсивную подготовку к формату экзамена."
    ),
    steps=[
        RoadmapStep(
            timeframe="Месяц 1-2",
            title="Подготовка к языковому экзамену",
            description="Интенсивные занятия английским (цель B2-C1). Параллельно соберите информацию о требованиях к GPA."
        ),
        RoadmapStep(
            timeframe="Месяц 2-3",
            title="Сбор академических документов",
            description="Сделайте выписку оценок, переведите на английский и заверьте. Подготовьте рекомендательные письма от учителей."
        ),
        RoadmapStep(
            timeframe="Месяц 3-4",
            title="Написание мотивационного эссе",
            description="Сформулируйте свои цели и покажите, почему именно вы подходите этой программе. Отдайте на proofreading."
        ),
        RoadmapStep(
            timeframe="Месяц 4-5",
            title="Подача заявки (Application)",
            description="Заполните анкету на портале вуза, загрузите все документы и оплатите application fee."
        ),
        RoadmapStep(
            timeframe="После оффера",
            title="Оформление визы",
            description="Получите приглашение от вуза, соберите финансовые гарантии и подайте документы в визовый центр."
        )
    ]
)

# ── OpenAI Integration ───────────────────────────────────────────────────────

SYSTEM_PROMPT = (
    "Ты образовательный консультант. Твоя задача — вернуть JSON с ровно 3 университетами. "
    "Для каждого вуза обязательно напиши человеческим языком в поле 'why_it_fits', "
    "почему этот вариант подходит, учитывая бюджет и интересы пользователя. "
    "Ответ должен быть строго в формате JSON, без markdown-оберток."
)

RESPONSE_SCHEMA = """
Ожидаемый JSON формат:
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
      "why_it_fits": "Подробное объяснение почему подходит"
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

    print(f"🤖 Calling OpenAI with key {api_key[:8]}... for profile: grade={profile.grade}, interests={profile.interests}")

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.7,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_message(profile)},
            ],
        )

        raw = completion.choices[0].message.content.strip()
        print(f"✅ OpenAI response received ({len(raw)} chars)")
        data = json.loads(raw)
        return RecommendationsResponse(**data)

    except Exception as e:
        print(f"⚠️  OpenAI call failed: {e} — returning mock data")
        return MOCK_RESPONSE


ROADMAP_SYSTEM_PROMPT = (
    "Ты консультант по поступлению. На основе профиля ученика (класс/возраст, направление) "
    "и выбранного вуза, сгенерируй детальный пошаговый план поступления. Верни JSON "
    "с одним самым приоритетным ближайшим шагом (next_action) и списком из 4-5 основных "
    "этапов подготовки (steps). Учитывай возраст: если это 9 класс, фокус на оценки и язык; "
    "если 11 класс или последний курс колледжа — жесткий фокус на дедлайны подачи и сбор документов. "
    "Ответ должен быть строго в формате JSON, без markdown-оберток."
)

ROADMAP_RESPONSE_SCHEMA = """
Ожидаемый JSON формат:
{
  "next_action": {
    "title": "Краткое название действия",
    "description": "Понятное объяснение, что нужно сделать прямо сейчас"
  },
  "steps": [
    {
      "timeframe": "Например: Сентябрь-Октябрь или Месяц 1-2",
      "title": "Название этапа",
      "description": "Детали подготовки"
    }
  ]
}
"""


def _build_roadmap_message(request: RoadmapRequest) -> str:
    profile = request.profile
    return (
        f"Профиль абитуриента:\n"
        f"- Роль: {'Абитуриент' if profile.role == 'applicant' else 'Родитель'}\n"
        f"- Класс/курс: {profile.grade}\n"
        f"- Интересы: {', '.join(profile.interests) if profile.interests else 'не указаны'}\n"
        f"- Годовой бюджет: {profile.budget} 000 €\n"
        f"- Языковые экзамены: {', '.join(profile.exams) if profile.exams else 'нет'}\n"
        f"\nВыбранный университет: {request.universityName}\n"
        f"\n{ROADMAP_RESPONSE_SCHEMA}"
    )


async def _get_ai_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    """Call OpenAI API for roadmap generation; falls back to mock data on error."""
    api_key = os.getenv("OPENAI_API_KEY", "").strip()

    if not api_key:
        print("⚠️  OPENAI_API_KEY not set — returning mock roadmap data")
        return MOCK_ROADMAP_RESPONSE

    print(f"🤖 Calling OpenAI (Roadmap) for {request.universityName}...")

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=api_key)
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.7,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": ROADMAP_SYSTEM_PROMPT},
                {"role": "user", "content": _build_roadmap_message(request)},
            ],
        )

        raw = completion.choices[0].message.content.strip()
        print(f"✅ OpenAI roadmap response received ({len(raw)} chars)")
        data = json.loads(raw)
        return RoadmapResponse(**data)

    except Exception as e:
        print(f"⚠️  OpenAI roadmap call failed: {e} — returning mock data")
        return MOCK_ROADMAP_RESPONSE


# ── Endpoints ────────────────────────────────────────────────────────────────


@app.get("/")
async def root():
    return {"status": "ok", "service": "Locus Admission API"}


@app.post("/api/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(profile: UserProfile):
    """Generate personalized university recommendations based on user profile."""
    print(f"📩 POST /api/recommendations — role={profile.role}, budget={profile.budget}")
    result = await _get_ai_recommendations(profile)
    print(f"📤 Returning {len(result.universities)} universities")
    return result


@app.post("/api/roadmap", response_model=RoadmapResponse)
async def get_roadmap(request: RoadmapRequest):
    """Generate personalized roadmap based on user profile and selected university."""
    print(f"📩 POST /api/roadmap — university={request.universityName}")
    result = await _get_ai_roadmap(request)
    print(f"📤 Returning roadmap with {len(result.steps)} steps")
    return result
