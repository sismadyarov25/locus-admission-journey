import { useState } from 'react';

/* ── Icons ── */
const ArrowLeftIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>
);

const ScaleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
  </svg>
);

/* ── Match Ring ── */
function MatchRing({ percent }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#e0e7ff" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke="url(#grad)" strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-indigo-700">{percent}%</span>
    </div>
  );
}

/* ── University Card ── */
function UniversityCard({ uni, onSelect, isCompared, onToggleCompare, compareDisabled }) {
  return (
    <article className="group flex flex-col rounded-2xl bg-white shadow-md shadow-indigo-50/50 ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/60 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 pb-3">
        <MatchRing percent={uni.matchPercent} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-400">{uni.country}</p>
          <h3 className="text-base font-bold text-slate-800 leading-snug">{uni.name}</h3>
          <p className="mt-0.5 text-sm text-indigo-600 font-medium">{uni.program}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-5 pb-3">
        {uni.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* AI Reason */}
      <div className="mx-5 mb-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-violet-50/60 p-4 ring-1 ring-indigo-100/60">
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
          <SparkleIcon /> Почему подходит
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{uni.why_it_fits}</p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2.5 border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={onToggleCompare}
          disabled={!isCompared && compareDisabled}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
            isCompared
              ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200/50'
              : compareDisabled
                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          {isCompared ? <CheckIcon /> : <PlusIcon />}
          {isCompared ? 'В сравнении' : 'Сравнить'}
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-150 cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200/50 hover:shadow-lg hover:brightness-110"
        >
          Выбрать
        </button>
      </div>
    </article>
  );
}

/* ── Comparison View ── */
function ComparisonView({ universities, onBack }) {
  const ROWS = [
    { label: '🏫 Программа',  key: 'program' },
    { label: '🌍 Страна',     key: 'country' },
    { label: '🏷️ Теги',       key: 'tags',       render: (v) => v.join(', ') },
    { label: '📊 Совпадение',  key: 'matchPercent', render: (v) => `${v}%` },
    { label: '💡 Почему подходит', key: 'why_it_fits' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
          <ScaleIcon className="inline h-6 w-6 mr-1 -mt-0.5 text-indigo-500" />
          Сравнение программ
        </h2>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeftIcon /> Вернуться к рекомендациям
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[600px]">
          {/* University Names Header */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `140px repeat(${universities.length}, 1fr)` }}>
            <div></div>
            {universities.map((uni) => (
              <div key={uni.id} className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 p-4 text-center shadow-lg shadow-indigo-200/40">
                <h3 className="text-sm font-bold text-white leading-snug">{uni.name}</h3>
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((row, idx) => (
            <div
              key={row.key}
              className={`mt-2 grid items-start gap-3 rounded-xl p-3 ${
                idx % 2 === 0 ? 'bg-slate-50/80' : 'bg-white'
              }`}
              style={{ gridTemplateColumns: `140px repeat(${universities.length}, 1fr)` }}
            >
              <div className="text-sm font-semibold text-slate-500 pt-0.5">{row.label}</div>
              {universities.map((uni) => {
                const val = uni[row.key];
                const display = row.render ? row.render(val) : val;
                return (
                  <div key={uni.id} className="text-sm text-slate-700 leading-relaxed">
                    {display}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ResultsDashboard({ data, onBack, onSelectUniversity }) {
  const { goal, strengths, constraints, universities } = data;
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleCompare = (uni) => {
    setCompareList((prev) => {
      const exists = prev.find((u) => u.id === uni.id);
      if (exists) return prev.filter((u) => u.id !== uni.id);
      if (prev.length >= 3) return prev;
      return [...prev, uni];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-24">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeftIcon /> Назад к профилю
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            Результаты готовы
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-10">

        {showComparison ? (
          /* ── Comparison View ── */
          <ComparisonView
            universities={compareList}
            onBack={() => setShowComparison(false)}
          />
        ) : (
          <>
            {/* ── Diagnosis Card ── */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-800 md:text-2xl">
                📋 Диагностика профиля
              </h2>

              <div className="rounded-2xl bg-white p-6 shadow-md shadow-indigo-50/50 ring-1 ring-slate-100 md:p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Цель</p>
                    <p className="text-lg font-bold text-slate-800">{goal}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                      Сильные стороны
                    </p>
                    <ul className="space-y-1">
                      {strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-0.5 text-emerald-500">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                      Ограничения
                    </p>
                    <ul className="space-y-1">
                      {constraints.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-0.5 text-amber-500">⚠</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Recommendations ── */}
            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
                  🎯 Рекомендации
                </h2>
                <p className="text-sm text-slate-400">
                  Найдено <span className="font-semibold text-indigo-600">{universities.length}</span> подходящих программ
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {universities.map((uni) => (
                  <UniversityCard
                    key={uni.id}
                    uni={uni}
                    onSelect={() => onSelectUniversity(uni)}
                    isCompared={!!compareList.find((u) => u.id === uni.id)}
                    onToggleCompare={() => toggleCompare(uni)}
                    compareDisabled={compareList.length >= 3}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── Footer Note ── */}
        {!showComparison && (
          <p className="text-center text-xs text-slate-400 pb-4">
            Рекомендации сгенерированы ИИ на основе вашего профиля. Проверяйте актуальность информации
            на&nbsp;сайтах вузов.
          </p>
        )}
      </div>

      {/* ── Sticky Compare Bar ── */}
      {compareList.length > 0 && !showComparison && (
        <div className="fixed bottom-0 inset-x-0 z-30 border-t border-indigo-100 bg-white/90 backdrop-blur-lg shadow-[0_-4px_20px_rgba(99,102,241,0.1)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                <ScaleIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Выбрано: <span className="text-indigo-600">{compareList.length}/3</span>
                </p>
                <p className="text-xs text-slate-400">
                  {compareList.map((u) => u.name.split(' ')[0]).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/50 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.97] cursor-pointer"
            >
              Сравнить программы
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
