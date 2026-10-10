import React, { useState } from 'react';
import { 
  GRAMMAR_LESSONS, 
  TENSE_SHIFT_MATRIX, 
  TIME_PLACE_SHIFTS, 
  PRONOUN_SHIFTS 
} from '../data/grammarCurriculum';
import { BookOpen, ArrowRight, Lightbulb, AlertTriangle, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const InteractiveLessons: React.FC = () => {
  const [selectedObjectiveTab, setSelectedObjectiveTab] = useState<'obj1' | 'obj2' | 'obj3'>('obj1');
  const [selectedTenseIndex, setSelectedTenseIndex] = useState<number>(0);

  const selectedTense = TENSE_SHIFT_MATRIX[selectedTenseIndex];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section with typographic hierarchy */}
      <div>
        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Cambridge English Curriculum Standards 🇬🇧
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reported Speech Mastery Library
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Comprehensive step-by-step rules, conversion matrices, and Cambridge single speech marks (' ') conventions.
        </p>
      </div>

      {/* Segmented Objective Navigation */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => {
            setSelectedObjectiveTab('obj1');
            StorageService.playChime('click');
          }}
          className={`pb-3 text-sm font-semibold transition cursor-pointer relative ${
            selectedObjectiveTab === 'obj1'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Questions & Demands
          {selectedObjectiveTab === 'obj1' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => {
            setSelectedObjectiveTab('obj2');
            StorageService.playChime('click');
          }}
          className={`pb-3 text-sm font-semibold transition cursor-pointer relative ${
            selectedObjectiveTab === 'obj2'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Tenses, Pronouns & Time
          {selectedObjectiveTab === 'obj2' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => {
            setSelectedObjectiveTab('obj3');
            StorageService.playChime('click');
          }}
          className={`pb-3 text-sm font-semibold transition cursor-pointer relative ${
            selectedObjectiveTab === 'obj3'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          3. Cambridge Single Speech Marks (' ')
          {selectedObjectiveTab === 'obj3' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: OBJECTIVE 1 (QUESTIONS, SUGGESTIONS, REQUESTS, DEMANDS) */}
      {selectedObjectiveTab === 'obj1' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Yes/No Questions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    Q1
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Yes / No Questions (if / whether)</h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Reported Yes/No questions connect with <strong>if</strong> or <strong>whether</strong>, and ALWAYS use affirmative statement word order (Subject + Verb).
                </p>
                <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 mb-3 border border-slate-100">
                  asked + (object) + IF / WHETHER + Subject + Verb
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50/70 text-amber-950 border border-amber-200/60">
                    <span className="font-semibold block text-[11px] text-amber-800 uppercase tracking-wide">Cambridge Direct:</span>
                    'Do you fancy a cup of tea?' Liam asked.
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 text-emerald-950 border border-emerald-200/60">
                    <span className="font-semibold block text-[11px] text-emerald-800 uppercase tracking-wide">Reported:</span>
                    Liam asked if I fancied a cup of tea.
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Trap: Never keep auxiliary 'do/did' (NOT 'asked if did I fancy').</span>
              </div>
            </div>

            {/* Wh- Questions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                    Q2
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Wh- Questions (No Inversion)</h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Retain the question word (What, Where, Why, When, How), but reverse the question inversion into standard Subject + Verb.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 mb-3 border border-slate-100">
                  asked + (object) + Wh-word + Subject + Verb
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50/70 text-amber-950 border border-amber-200/60">
                    <span className="font-semibold block text-[11px] text-amber-800 uppercase tracking-wide">Cambridge Direct:</span>
                    'Where did you leave your coat?' she asked.
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 text-emerald-950 border border-emerald-200/60">
                    <span className="font-semibold block text-[11px] text-emerald-800 uppercase tracking-wide">Reported:</span>
                    She asked where I had left my coat.
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Trap: Do NOT invert (NOT 'where had I left my coat?').</span>
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    S1
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Suggestions (suggest + -ing)</h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  In Cambridge English, <strong>suggest</strong> is followed by a <strong>gerund (-ing)</strong> or <strong>that-clause</strong>. It NEVER takes a to-infinitive!
                </p>
                <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 mb-3 border border-slate-100">
                  suggested + V-ING  /  suggested that + Subj + (should) Verb
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50/70 text-amber-950 border border-amber-200/60">
                    <span className="font-semibold block text-[11px] text-amber-800 uppercase tracking-wide">Cambridge Direct:</span>
                    'Let\'s visit Big Ben today,' Arthur said.
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 text-emerald-950 border border-emerald-200/60">
                    <span className="font-semibold block text-[11px] text-emerald-800 uppercase tracking-wide">Reported:</span>
                    Arthur suggested visiting Big Ben that day.
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Never say: 'suggested to visit' (Suggest NEVER takes to + verb).</span>
              </div>
            </div>

            {/* Requests & Demands */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    R1
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">Requests & Commands (to / not to)</h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Polite requests become <strong>asked someone to...</strong>. Commands become <strong>told/ordered someone (not) to...</strong>.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 mb-3 border border-slate-100">
                  told / asked + object + (NOT) TO + base verb
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50/70 text-amber-950 border border-amber-200/60">
                    <span className="font-semibold block text-[11px] text-amber-800 uppercase tracking-wide">Cambridge Direct:</span>
                    'Don\'t feed the pigeons in Trafalgar Square!' the constable warned.
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 text-emerald-950 border border-emerald-200/60">
                    <span className="font-semibold block text-[11px] text-emerald-800 uppercase tracking-wide">Reported:</span>
                    The constable warned us not to feed the pigeons in Trafalgar Square.
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>'Please' is gracefully omitted because the politeness is stored in 'asked'.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OBJECTIVE 2 (TENSES, PRONOUNS & TIME EXPRESSIONS) */}
      {selectedObjectiveTab === 'obj2' && (
        <div className="space-y-8">
          {/* Interactive Tense Shift Calculator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Interactive Tense Backshift Calculator</h3>
                <p className="text-xs text-slate-500">Select a direct speech tense to see its exact reported form</p>
              </div>
              <span className="text-xs text-blue-600 font-semibold">Tense Chain</span>
            </div>

            {/* Tense selector segmented list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-5">
              {TENSE_SHIFT_MATRIX.map((item, idx) => (
                <button
                  key={item.directTense}
                  onClick={() => {
                    setSelectedTenseIndex(idx);
                    StorageService.playChime('click');
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition text-center cursor-pointer border ${
                    selectedTenseIndex === idx
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.directTense}
                </button>
              ))}
            </div>

            {/* Calculator Display card */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Direct Speech Tense</div>
                  <div className="text-base font-bold text-slate-900">{selectedTense.directTense}</div>
                  <div className="text-xs font-mono text-blue-600 mt-1">Form: {selectedTense.directVerb}</div>
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg text-xs italic text-slate-700">
                    {selectedTense.exampleDirect}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Backshifted Reported Form</div>
                  <div className="text-base font-bold text-slate-900">{selectedTense.reportedTense}</div>
                  <div className="text-xs font-mono text-emerald-600 mt-1">Form: {selectedTense.reportedVerb}</div>
                  <div className="mt-3 p-2 bg-emerald-50 rounded-lg text-xs italic text-emerald-900 border border-emerald-100">
                    {selectedTense.exampleReported}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                {selectedTense.note}
              </p>
            </div>
          </div>

          {/* Time & Place Matrix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Time & Place (Deictic) Shifts</h3>
            <p className="text-xs text-slate-500 mb-4">Words expressing 'here' and 'now' shift into 'there' and 'then'.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TIME_PLACE_SHIFTS.map(item => (
                <div key={item.direct} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 font-mono">'{item.direct}'</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-blue-700 font-mono font-semibold">{item.reported}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic truncate" title={item.example}>
                    {item.example}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pronouns Matrix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Pronouns & Perspective Alignment</h3>
            <p className="text-xs text-slate-500 mb-4">Shifts match who spoke and who was listening.</p>

            <div className="space-y-2.5">
              {PRONOUN_SHIFTS.map(p => (
                <div key={p.perspective} className="p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.perspective}</h4>
                    <p className="text-[11px] text-slate-500">{p.rule}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 py-1 px-2.5 rounded-lg">
                    <span className="text-slate-700">{p.direct}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-blue-600 font-bold">{p.reported}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OBJECTIVE 3 (CAMBRIDGE SINGLE SPEECH MARKS CONVENTION) */}
      {selectedObjectiveTab === 'obj3' && (
        <div className="space-y-6">
          {/* Cambridge Single Speech Marks Enforced Banner */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇬🇧</span>
                <h3 className="font-extrabold text-blue-950 text-base">Cambridge English Standard: Only Single Speech Marks (' ')</h3>
              </div>
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                Single Speech Marks Only
              </span>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed mb-4">
              In our Cambridge English lessons, dialogues in direct speech must use <strong>only single speech marks (' ')</strong> (single inverted commas). Double speech marks are strictly prohibited.
            </p>

            <div className="p-3.5 rounded-xl bg-white border border-blue-200 text-xs">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Required Format: Single Speech Marks Only (' ')
              </div>
              <div className="font-mono text-slate-800 p-2 bg-slate-50 rounded">
                'I love reading novels,' said Charlotte.
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Direct speech is exclusively wrapped in single speech marks (' '). Double speech marks are never used.
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                P1
              </span>
              <h3 className="font-bold text-slate-900 text-base">Cambridge Speech Marks Anatomy</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Inspect the exact placement of commas, capitals, and single speech marks.
            </p>

            {/* Visual Sentence Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white font-mono text-sm leading-relaxed mb-6 overflow-x-auto">
              <div className="text-xs text-slate-400 mb-2 font-sans uppercase font-bold tracking-wider">Cambridge Direct Speech Anatomy:</div>
              <div className="flex flex-wrap items-baseline gap-1 text-base">
                <span className="text-slate-300">She said</span>
                <span className="text-amber-400 font-bold bg-amber-400/20 px-1 rounded" title="Comma after attribution tag">,</span>
                <span className="text-emerald-400 font-bold bg-emerald-400/20 px-1.5 rounded" title="Opening single speech mark">'</span>
                <span className="text-blue-400 font-bold bg-blue-400/20 px-1 rounded" title="First letter inside quote capitalized">W</span>
                <span className="text-slate-100">e are traveling to London</span>
                <span className="text-amber-400 font-bold bg-amber-400/20 px-1 rounded" title="Full stop inside speech mark">.</span>
                <span className="text-emerald-400 font-bold bg-emerald-400/20 px-1.5 rounded" title="Closing single speech mark">'</span>
              </div>
            </div>

            {/* 4 Golden Cambridge Rules Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  1. Single Speech Marks (' ')
                </h4>
                <p className="text-xs text-slate-600">
                  Enclose direct dialogue inside single speech marks. In reported speech, NEVER use speech marks!
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  2. Comma Placement
                </h4>
                <p className="text-xs text-slate-600">
                  When dialogue comes first, the comma goes INSIDE the single speech marks before the reporting tag: <em>'I am ready,' said David.</em>
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  3. Capital Letter for Spoken Quote
                </h4>
                <p className="text-xs text-slate-600">
                  The initial letter of a quoted sentence is ALWAYS capitalized: He whispered, <em>'<strong>T</strong>he train has arrived.'</em>
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  4. Strictly Single Speech Marks (' ')
                </h4>
                <p className="text-xs text-slate-600">
                  Direct speech dialogues must use strictly single speech marks (' '). Never use double speech marks in dialogues.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
