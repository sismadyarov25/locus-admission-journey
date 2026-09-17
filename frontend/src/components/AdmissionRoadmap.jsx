import { useState, useEffect } from 'react';

/* ── Icons ── */
const ArrowLeftIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightningIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

/* ── Mock Timeline Data ── */
const TIMELINE_STEPS = [
  {
    id: 1,
    title: 'Подготовка к языковому экзамену',
    description: 'Запись на тестирование, интенсивная подготовка и сдача экзамена на нужный балл.',
    timeline: 'Месяц 1-2',
  },
  {
    id: 2,
    title: 'Сбор транскриптов оценок',
    description: 'Заказ выписки оценок, перевод документов и нотариальное заверение.',
    timeline: 'Месяц 2',
  },
  {
    id: 3,
    title: 'Написание мотивационного эссе',
    description: 'Составление драфта, вычитка (proofreading) и адаптация под конкретную программу.',
    timeline: 'Месяц 3',
  },
  {
    id: 4,
    title: 'Подача заявки',
    description: 'Оплата application fee, загрузка всех документов в портал университета.',
    timeline: 'Месяц 4',
  },
  {
    id: 5,
    title: 'Оформление визы',
    description: 'Получение оффера, сбор финансовых гарантий и подача документов в консульство.',
    timeline: 'Месяц 5-6',
  },
];

export default function AdmissionRoadmap({ university, profile, onBack }) {
  const [isNextActionDone, setIsNextActionDone] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const uniName = university?.name || 'выбранный вуз';

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: profile || { role: 'applicant', grade: '', interests: [], countries: [], budget: 0, exams: [] },
            universityName: uniName
          }),
        });

        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);

        const data = await res.json();
        setRoadmapData(data);
      } catch (err) {
        setError(err.message || 'Не удалось сгенерировать план');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [profile, uniName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeftIcon /> Назад к выбору
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm font-medium text-slate-500">
            {isLoading ? 'Генерация...' : 'Маршрут построен'}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:py-12 space-y-10">
        {/* ── Header ── */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Твой пошаговый план поступления в{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              {uniName}
            </span>
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Мы разбили процесс на понятные этапы. Начни с самого главного прямо сейчас.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            ⚠ {error}
          </div>
        )}

        {isLoading ? (
          /* ── Skeletons ── */
          <div className="animate-pulse space-y-10">
            {/* Next Action Skeleton */}
            <div className="h-48 rounded-3xl bg-slate-200 w-full"></div>
            
            <div className="space-y-8 pl-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 rounded-2xl bg-slate-200 w-full"></div>
              ))}
            </div>
          </div>
        ) : roadmapData ? (
          <>
            {/* ── Next Action Block (Critical First Step) ── */}
            <section className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-100/50 ring-1 ring-slate-100 sm:p-8 p-6">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-50 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    <LightningIcon /> Фокус на этой неделе
                  </div>
                  <h3 className={`text-xl font-bold transition-all duration-300 ${isNextActionDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {roadmapData.next_action.title}
                  </h3>
                  <p className={`mt-2 text-sm transition-all duration-300 ${isNextActionDone ? 'text-slate-300' : 'text-slate-600'}`}>
                    {roadmapData.next_action.description}
                  </p>
                </div>

                <button
                  onClick={() => setIsNextActionDone(!isNextActionDone)}
                  className={`group relative flex-shrink-0 flex items-center gap-2 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isNextActionDone
                      ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300'
                  }`}
                >
                  <CheckCircleIcon className={`h-5 w-5 ${isNextActionDone ? 'text-emerald-500' : 'text-indigo-200 group-hover:text-white transition-colors'}`} />
                  {isNextActionDone ? 'Выполнено' : 'Отметить как выполненное'}
                </button>
              </div>
            </section>

            {/* ── Timeline ── */}
            <section className="pt-4">
              <h2 className="mb-8 text-2xl font-bold text-slate-800">
                План подготовки
              </h2>

              <div className="relative ml-4 md:ml-6 border-l-2 border-indigo-100 pb-4">
                <div className="space-y-10">
                  {roadmapData.steps.map((step, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-10">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-indigo-500 ring-4 ring-indigo-50"></div>
                      
                      {/* Content */}
                      <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-indigo-100">
                        <div className="mb-1 text-xs font-bold tracking-wide text-indigo-500 uppercase">
                          {step.timeframe}
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {idx + 1}. {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}

      </main>
    </div>
  );
}
