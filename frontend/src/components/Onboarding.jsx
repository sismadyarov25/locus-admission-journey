import { useState } from 'react';

const INTERESTS = [
  'Data Science', 'UX Design', 'Психология', 'Бизнес',
  'Computer Science', 'Медицина', 'Инженерия', 'Право',
  'Архитектура', 'Маркетинг',
];

const COUNTRIES = [
  { name: 'Италия', flag: '🇮🇹' },
  { name: 'Германия', flag: '🇩🇪' },
  { name: 'Чехия', flag: '🇨🇿' },
  { name: 'Великобритания', flag: '🇬🇧' },
  { name: 'США', flag: '🇺🇸' },
  { name: 'Канада', flag: '🇨🇦' },
  { name: 'Франция', flag: '🇫🇷' },
  { name: 'Южная Корея', flag: '🇰🇷' },
];

const EXAMS = [
  'IELTS', 'TOEFL', 'SAT', 'Duolingo English Test',
  'DELF / DALF', 'TestDaF', 'TOPIK', 'Нет экзаменов',
];

const GRADES = [
  '9 класс', '10 класс', '11 класс',
  '1 курс (колледж)', '2 курс (колледж)',
  'Бакалавр (1–2 курс)', 'Бакалавр (3–4 курс)', 'Выпускник',
];

export default function Onboarding({ onResults }) {
  const [role, setRole] = useState('applicant');
  const [grade, setGrade] = useState('');
  const [interests, setInterests] = useState([]);
  const [countries, setCountries] = useState([]);
  const [budget, setBudget] = useState(150);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleChip = (value, list, setter, max = Infinity) => {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else if (list.length < max) {
      setter([...list, value]);
    }
  };

  const formatBudget = (v) => {
    if (v === 0) return '0 €';
    if (v >= 500) return '500 000+ €';
    return `${v} 000 €`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profilePayload = { role, grade, interests, countries, budget, exams };

      const res = await fetch('http://localhost:8000/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      });

      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);

      const data = await res.json();
      onResults(data, profilePayload);
    } catch (err) {
      setError(err.message || 'Не удалось получить рекомендации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* ── Hero ── */}
      <section className="px-5 pt-14 pb-10 text-center md:pt-20 md:pb-14">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
          <span className="text-base">✨</span> AI-навигатор поступления
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          Твой маршрут
          <span className="block bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            поступления
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base text-slate-500 md:text-lg">
          Расскажи о себе — и получи персональный план поступления в&nbsp;лучшие
          вузы мира за&nbsp;несколько минут.
        </p>
      </section>

      {/* ── Main Card ── */}
      <div className="mx-auto max-w-xl px-4 pb-16">
        <div className="rounded-3xl bg-white shadow-xl shadow-indigo-100/60 ring-1 ring-slate-100 p-6 md:p-10 space-y-8">

          {/* ─ Role Toggle ─ */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1">
              {[
                { id: 'applicant', label: '🎓 Я абитуриент' },
                { id: 'parent',    label: '👨‍👩‍👧 Помогаю поступить' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    role === r.id
                      ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─ Grade / Age ─ */}
          <fieldset className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              {role === 'applicant' ? 'Класс / курс обучения' : 'Класс / курс ребёнка'}
            </label>
            <div className="relative">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-800 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              >
                <option value="">Выберите...</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
          </fieldset>

          {/* ─ Interests ─ */}
          <fieldset className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Интересы <span className="font-normal text-slate-400">(до 3-х)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((item) => {
                const active = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChip(item, interests, setInterests, 3)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {item}{active && ' ✕'}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ─ Countries ─ */}
          <fieldset className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Страны поступления
            </label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map(({ name, flag }) => {
                const active = countries.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleChip(name, countries, setCountries)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{flag}</span> {name}{active && ' ✕'}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ─ Budget Slider ─ */}
          <fieldset className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Годовой бюджет</label>
              <span className="text-sm font-bold text-indigo-600">{formatBudget(budget)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0 €</span>
              <span>500 000+ €</span>
            </div>
          </fieldset>

          {/* ─ Language Exams ─ */}
          <fieldset className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Языковые экзамены
            </label>
            <div className="flex flex-wrap gap-2">
              {EXAMS.map((exam) => {
                const active = exams.includes(exam);
                return (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => toggleChip(exam, exams, setExams)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {exam}{active && ' ✕'}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ─ Error Message ─ */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              ⚠ {error}
            </div>
          )}

          {/* ─ CTA Button ─ */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-300/40 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-400/40 hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Генерируем маршрут…
                </>
              ) : (
                <>
                  Построить маршрут
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>

        {/* ─ Footer Note ─ */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Данные используются только для генерации плана и&nbsp;не&nbsp;передаются третьим лицам.
        </p>
      </div>
    </div>
  );
}
