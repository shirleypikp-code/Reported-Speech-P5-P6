import { ExerciseItem, Badge } from '../types';

export const EXERCISES_DATABASE: ExerciseItem[] = [
  // ==========================================
  // OBJECTIVE 1: QUESTIONS, SUGGESTIONS, REQUESTS & DEMANDS
  // ==========================================
  {
    id: 'ex_q1',
    objective: 'questions_commands',
    category: 'yes_no_questions',
    level: 'beginner',
    title: 'The High Tea Dilemma (Yes/No Question)',
    instruction: 'Convert this direct question into reported speech using Cambridge English rules. Drop auxiliary \'do\' and unwind into statement word order!',
    directSpeech: '\'Do you fancy a cup of Earl Grey tea?\' Liam asked me.',
    speaker: 'Liam',
    listener: 'me',
    speechType: 'question',
    promptPrefix: 'Liam asked me',
    correctAnswers: [
      'if I fancied a cup of Earl Grey tea',
      'whether I fancied a cup of Earl Grey tea',
      'if I liked a cup of Earl Grey tea',
      'if I fancied a cup of Earl Grey tea.',
      'whether I fancied a cup of Earl Grey tea.'
    ],
    hints: {
      reportingVerbHint: 'Liam asked me...',
      tenseHint: 'Present Simple (\'fancy\') backshifts to Past Simple (\'fancied\').',
      pronounHint: '\'you\' addressed to \'me\' becomes \'I\'.',
      generalHint: 'Begin with \'if\' or \'whether\', followed by subject \'I\' and verb \'fancied\'.'
    },
    explanation: 'In reported Yes/No questions, we introduce the clause with \'if\' or \'whether\'. Auxiliary \'do\' vanishes, and the verb shifts from \'fancy\' to \'fancied\'. Notice affirmative statement word order: Subject (\'I\') + Verb (\'fancied\').'
  },
  {
    id: 'ex_q2',
    objective: 'questions_commands',
    category: 'wh_questions',
    level: 'intermediate',
    title: 'Paddington Station Mystery (Wh- Question)',
    instruction: 'Percy the lost penguin is asked for his address! Convert the officer\'s Wh- question into reported speech without subject-verb inversion.',
    directSpeech: '\'Where do you live in London?\' the police officer asked Percy the penguin.',
    speaker: 'The police officer',
    listener: 'Percy the penguin',
    speechType: 'wh_question',
    promptPrefix: 'The police officer asked Percy the penguin',
    correctAnswers: [
      'where he lived in London',
      'where he lived in London.',
      'where Percy lived in London'
    ],
    hints: {
      tenseHint: '\'live\' backshifts to Past Simple \'lived\'.',
      pronounHint: '\'you\' refers to Percy ➔ \'he\'.',
      generalHint: 'Keep the question word \'where\', then subject \'he\', then verb \'lived\'. Do NOT invert into \'where did he live\'!'
    },
    explanation: 'For Wh- questions, keep \'where\', omit auxiliary \'do\', and restore affirmative order: \'where he lived in London\'.'
  },
  {
    id: 'ex_q3',
    objective: 'questions_commands',
    category: 'wh_questions',
    level: 'advanced',
    title: 'The Stolen Vintage Camera (Past Wh- Question)',
    instruction: 'Convert this Wh- question with Past Simple. Remember: Past Simple backshifts one step deeper into Past Perfect!',
    directSpeech: '\'Why did you purchase this antique camera?\' Detective Holmes asked Watson.',
    speaker: 'Detective Holmes',
    listener: 'Watson',
    speechType: 'wh_question',
    promptPrefix: 'Detective Holmes asked Watson',
    correctAnswers: [
      'why he had purchased that antique camera',
      'why he had purchased that antique camera.',
      'why he had bought that antique camera',
      'why he purchased that antique camera'
    ],
    hints: {
      tenseHint: 'Past Simple (\'did purchase\') shifts to Past Perfect (\'had purchased\').',
      timeHint: '\'this antique camera\' shifts to \'that antique camera\'.',
      pronounHint: '\'you\' refers to Watson ➔ \'he\'.',
      generalHint: 'Structure: why + he + had purchased + that antique camera.'
    },
    explanation: 'Past Simple (\'did purchase\') shifts to Past Perfect (\'had purchased\'). Demonstrative \'this\' shifts to \'that\'.'
  },
  {
    id: 'ex_sugg1',
    objective: 'questions_commands',
    category: 'suggestions',
    level: 'intermediate',
    title: 'The Cinema Proposal (Cambridge Suggestion)',
    instruction: 'Convert Sophie\'s suggestion. Remember: In Cambridge English, \'suggest\' NEVER takes a to-infinitive! Use -ing or that-clause.',
    directSpeech: '\'Let\'s watch a classic comedy at the cinema tonight,\' Sophie said.',
    speaker: 'Sophie',
    speechType: 'suggestion',
    promptPrefix: 'Sophie suggested',
    correctAnswers: [
      'watching a classic comedy at the cinema that night',
      'watching a classic comedy at the cinema that night.',
      'that they watch a classic comedy at the cinema that night',
      'that they should watch a classic comedy at the cinema that night',
      'that we watch a classic comedy at the cinema that night'
    ],
    hints: {
      reportingVerbHint: 'Sophie suggested...',
      timeHint: '\'tonight\' shifts to \'that night\'.',
      generalHint: 'Use \'watching...\' or \'that they should watch...\'. Never say \'suggested to watch\'!'
    },
    explanation: '\'Let\'s\' signals a suggestion. In Cambridge English, \'suggest\' takes a gerund (\'suggested watching\') or that-clause (\'suggested that they watch\'). Never use an infinitive! Also, \'tonight\' becomes \'that night\'.'
  },
  {
    id: 'ex_req1',
    objective: 'questions_commands',
    category: 'requests_demands',
    level: 'beginner',
    title: 'The Scone Polite Request',
    instruction: 'Convert this polite request using \'asked me to...\'. Notice how \'please\' is politely absorbed by the reporting verb.',
    directSpeech: '\'Could you please pass the strawberry jam?\' Lady Beatrice asked me.',
    speaker: 'Lady Beatrice',
    listener: 'me',
    speechType: 'request',
    promptPrefix: 'Lady Beatrice asked me',
    correctAnswers: [
      'to pass the strawberry jam',
      'to pass the strawberry jam.'
    ],
    hints: {
      reportingVerbHint: 'Lady Beatrice asked me...',
      generalHint: 'Polite request formula: asked + person + to + base verb: to pass the strawberry jam.'
    },
    explanation: 'Requests introduced by \'could you please\' become \'asked + object + to + base verb\'. Politeness word \'please\' is dropped.'
  },
  {
    id: 'ex_dem1',
    objective: 'questions_commands',
    category: 'requests_demands',
    level: 'intermediate',
    title: 'The Space Commander Order (Negative Demand)',
    instruction: 'Convert Commander Orion\'s urgent command! For negative imperatives, use \'ordered... not to...\'.',
    directSpeech: '\'Don\'t touch the glowing cosmic hyperdrive!\' Commander Orion ordered the cadet.',
    speaker: 'Commander Orion',
    listener: 'the cadet',
    speechType: 'demand',
    promptPrefix: 'Commander Orion ordered the cadet',
    correctAnswers: [
      'not to touch the glowing cosmic hyperdrive',
      'not to touch the glowing cosmic hyperdrive.',
      'ordered the cadet not to touch the glowing cosmic hyperdrive'
    ],
    hints: {
      generalHint: 'For negative commands (\'Don\'t do X\'), use \'not to + verb\': not to touch the glowing cosmic hyperdrive.'
    },
    explanation: 'Negative imperatives (\'Don\'t touch\') transform directly into \'not to touch\'. Never write \'to not touch\' or \'didn\'t touch\'.'
  },

  // ==========================================
  // OBJECTIVE 2: VERB TENSE, PRONOUNS & TIME EXPRESSIONS
  // ==========================================
  {
    id: 'ex_t1',
    objective: 'tense_pronouns_time',
    category: 'tense_backshift',
    level: 'beginner',
    title: 'Exam Preparation (Present Continuous Backshift)',
    instruction: 'Convert this sentence into reported speech. Watch verb tense and pronoun alignment.',
    directSpeech: '\'I am revising for my Cambridge English exam,\' Lucas said.',
    speaker: 'Lucas',
    speechType: 'statement',
    promptPrefix: 'Lucas said that',
    correctAnswers: [
      'he was revising for his Cambridge English exam',
      'he was revising for his Cambridge English exam.',
      'he was revising for his exam'
    ],
    hints: {
      tenseHint: '\'am revising\' (Present Continuous) shifts to \'was revising\' (Past Continuous).',
      pronounHint: '\'I\' ➔ \'he\', and \'my\' ➔ \'his\'.',
      generalHint: 'Lucas said that he was revising for his Cambridge English exam.'
    },
    explanation: 'Present Continuous (\'am revising\') steps back into Past Continuous (\'was revising\'). Pronouns (\'I\', \'my\') align to third person (\'he\', \'his\').'
  },
  {
    id: 'ex_t2',
    objective: 'tense_pronouns_time',
    category: 'time_place_shift',
    level: 'intermediate',
    title: 'The Big Ben Excursion (Time & Past Simple)',
    instruction: 'Convert Hannah\'s report, applying both tense backshift and Cambridge time deixis for \'yesterday\'.',
    directSpeech: '\'We visited Big Ben and Westminster yesterday,\' Hannah told Oliver.',
    speaker: 'Hannah',
    listener: 'Oliver',
    speechType: 'statement',
    promptPrefix: 'Hannah told Oliver that',
    correctAnswers: [
      'they had visited Big Ben and Westminster the day before',
      'they had visited Big Ben and Westminster the previous day',
      'they had visited Big Ben and Westminster the day before.',
      'they had visited Big Ben and Westminster the previous day.'
    ],
    hints: {
      tenseHint: 'Past Simple (\'visited\') shifts to Past Perfect (\'had visited\').',
      pronounHint: '\'We\' shifts to \'they\'.',
      timeHint: '\'yesterday\' shifts to \'the day before\' or \'the previous day\'.',
      generalHint: 'Don\'t forget both the verb shift and the time expression change!'
    },
    explanation: 'Past Simple (\'visited\') shifts into Past Perfect (\'had visited\'). \'We\' becomes \'they\', and \'yesterday\' becomes \'the day before\' or \'the previous day\'.'
  },
  {
    id: 'ex_t3',
    objective: 'tense_pronouns_time',
    category: 'time_place_shift',
    level: 'advanced',
    title: 'Royal Courier Dispatch (Modal & Tomorrow)',
    instruction: 'Convert the courier\'s pledge. Apply modal backshift, demonstrative pronoun shift, and time expression change!',
    directSpeech: '\'I will deliver these royal letters tomorrow,\' the dispatch rider promised.',
    speaker: 'The dispatch rider',
    speechType: 'statement',
    promptPrefix: 'The dispatch rider promised that',
    correctAnswers: [
      'he would deliver those royal letters the following day',
      'he would deliver those royal letters the next day',
      'she would deliver those royal letters the following day',
      'she would deliver those royal letters the next day',
      'they would deliver those royal letters the following day',
      'he would deliver those royal letters the following day.',
      'he would deliver those royal letters the next day.'
    ],
    hints: {
      tenseHint: '\'will deliver\' shifts to conditional \'would deliver\'.',
      timeHint: '\'these\' ➔ \'those\', and \'tomorrow\' ➔ \'the following day\' or \'the next day\'.',
      generalHint: 'Triple conversion: will ➔ would, these ➔ those, tomorrow ➔ the following day.'
    },
    explanation: 'Three shifts occur in harmony: \'will\' ➔ \'would\', \'these\' ➔ \'those\', and \'tomorrow\' ➔ \'the following day\' / \'the next day\'.'
  },
  {
    id: 'ex_t4',
    objective: 'tense_pronouns_time',
    category: 'pronoun_shift',
    level: 'intermediate',
    title: 'The Forgotten Umbrella (Perspective Shift)',
    instruction: 'Daniel addresses \'me\'. Convert the pronouns and Present Perfect tense accurately.',
    directSpeech: '\'You have left your umbrella in my flat,\' Daniel told me.',
    speaker: 'Daniel',
    listener: 'me',
    speechType: 'statement',
    promptPrefix: 'Daniel told me that',
    correctAnswers: [
      'I had left my umbrella in his flat',
      'I had left my umbrella in his flat.',
      'I had forgotten my umbrella in his flat'
    ],
    hints: {
      tenseHint: 'Present Perfect (\'have left\') backshifts to Past Perfect (\'had left\').',
      pronounHint: '\'You have left your\' ➔ \'I had left my\', and \'my flat\' ➔ \'his flat\'.',
      generalHint: 'Shift from Daniel speaking to you, to you reporting Daniel\'s statement.'
    },
    explanation: 'Because Daniel spoke to \'me\', \'you have left your\' converts to \'I had left my\', and \'my flat\' (Daniel\'s flat) becomes \'his flat\'.'
  },

  // ==========================================
  // OBJECTIVE 3: CAMBRIDGE DIRECT SPEECH STRUCTURE & PUNCTUATION
  // ==========================================
  {
    id: 'ex_punc1',
    objective: 'punctuation_structure',
    category: 'direct_speech_punctuation',
    level: 'beginner',
    title: 'Cambridge Single Speech Marks: Train Ticket',
    instruction: 'Punctuate using Cambridge English single speech marks (\' \'). Add opening & closing single speech marks, comma, and capitalize the first word.',
    directSpeech: 'Alice said I need to buy a train ticket to Oxford',
    speaker: 'Alice',
    speechType: 'statement',
    correctAnswers: [
      'Alice said, \'I need to buy a train ticket to Oxford.\'',
      'Alice said, ‘I need to buy a train ticket to Oxford.’',
      'Alice said, \'I need to buy a train ticket to Oxford.\''
    ],
    hints: {
      generalHint: 'Cambridge English format: Alice said, \'I need to buy a train ticket to Oxford.\''
    },
    explanation: 'In Cambridge English, direct speech is enclosed in single speech marks (\' \'). Place a comma after \'said,\' capitalize \'I\', and keep the full stop inside the closing single speech mark.',
    punctuationData: {
      unpunctuated: 'Alice said I need to buy a train ticket to Oxford',
      tokens: [
        { word: 'Alice' },
        { word: 'said', requiresCommaAfter: true },
        { word: 'I', requiresQuoteBefore: true, requiresCapital: true },
        { word: 'need' },
        { word: 'to' },
        { word: 'buy' },
        { word: 'a' },
        { word: 'train' },
        { word: 'ticket' },
        { word: 'to' },
        { word: 'Oxford', requiresQuoteAfter: true }
      ],
      rulesHighlighted: [
        'Comma separates reporting clause: Alice said,',
        'Single speech marks enclose spoken words: \'...\'',
        'Initial word inside speech marks is capitalized',
        'Full stop rests inside the closing single speech mark'
      ]
    }
  },
  {
    id: 'ex_punc2',
    objective: 'punctuation_structure',
    category: 'direct_speech_punctuation',
    level: 'intermediate',
    title: 'Cambridge Question with Tag at End',
    instruction: 'Punctuate Marcus\'s direct speech question using Cambridge single speech marks (\' \'). Notice the question comes BEFORE the tag.',
    directSpeech: 'what time does the British Museum open asked Marcus',
    speaker: 'Marcus',
    speechType: 'question',
    correctAnswers: [
      '\'What time does the British Museum open?\' asked Marcus.',
      '‘What time does the British Museum open?’ asked Marcus.',
      '\'What time does the British Museum open?\' asked Marcus'
    ],
    hints: {
      generalHint: 'Enclose the question in single speech marks with question mark INSIDE: \'What time does the British Museum open?\' asked Marcus.'
    },
    explanation: 'In Cambridge English: Begin with an opening single speech mark (\'\'), capitalize \'What\', place the question mark INSIDE the single speech marks (\'?\'), and end with a full stop after \'asked Marcus.\'',
    punctuationData: {
      unpunctuated: 'what time does the British Museum open asked Marcus',
      tokens: [
        { word: 'what', requiresQuoteBefore: true, requiresCapital: true },
        { word: 'time' },
        { word: 'does' },
        { word: 'the' },
        { word: 'British', requiresCapital: true },
        { word: 'Museum', requiresCapital: true },
        { word: 'open', requiresQuoteAfter: true },
        { word: 'asked' },
        { word: 'Marcus' }
      ],
      rulesHighlighted: [
        'Opening single speech mark and capital: \'What...',
        'Question mark placed inside closing single speech mark: ...open?\'',
        'No comma needed when question mark is present',
        'Full stop placed after the reporting tag: asked Marcus.'
      ]
    }
  },
  {
    id: 'ex_punc3',
    objective: 'punctuation_structure',
    category: 'direct_speech_punctuation',
    level: 'advanced',
    title: 'Split Dialogue in Cambridge English',
    instruction: 'Punctuate this split sentence where the reporting tag interrupts Chloe\'s speech. Use Cambridge single speech marks (\' \').',
    directSpeech: 'we have reached London said Chloe so grab your rucksacks',
    speaker: 'Chloe',
    speechType: 'statement',
    correctAnswers: [
      '\'We have reached London,\' said Chloe, \'so grab your rucksacks.\'',
      '‘We have reached London,’ said Chloe, ‘so grab your rucksacks.’'
    ],
    hints: {
      generalHint: 'First speech mark ends with comma inside quotes: \'We have reached London,\' said Chloe, \'so grab your rucksacks.\''
    },
    explanation: 'Interrupted dialogue in Cambridge English: First quote ends with comma inside single speech marks (\'We have reached London,\'), tag follows with comma (\'said Chloe,\'), and second quote resumes in single speech marks lowercase (\'so grab your rucksacks.\').',
    punctuationData: {
      unpunctuated: 'we have reached London said Chloe so grab your rucksacks',
      tokens: [
        { word: 'we', requiresQuoteBefore: true, requiresCapital: true },
        { word: 'have' },
        { word: 'reached' },
        { word: 'London', requiresCommaAfter: true, requiresQuoteAfter: true },
        { word: 'said' },
        { word: 'Chloe', requiresCommaAfter: true },
        { word: 'so', requiresQuoteBefore: true },
        { word: 'grab' },
        { word: 'your' },
        { word: 'rucksacks', requiresQuoteAfter: true }
      ],
      rulesHighlighted: [
        'Comma inside first closing single speech mark: \'We have reached London,\'',
        'Comma after speaker tag: said Chloe,',
        'Second quote wrapped in single speech marks: \'so grab your rucksacks.\''
      ]
    }
  },

  // ==========================================
  // SCENARIO STORY EXERCISES (SPEECH BUBBLE DIALOGUES)
  // ==========================================
  {
    id: 'ex_scenario1',
    objective: 'questions_commands',
    category: 'wh_questions',
    level: 'intermediate',
    title: 'Heathrow Airport Flight Enquiry',
    instruction: 'A traveler asks at the British Airways desk. Report the passenger\'s question using statement word order.',
    directSpeech: '\'Which gate does the flight to Singapore depart from?\' asked the passenger.',
    speaker: 'The passenger',
    listener: 'the flight agent',
    speechType: 'wh_question',
    promptPrefix: 'The passenger asked the flight agent',
    correctAnswers: [
      'which gate the flight to Singapore departed from',
      'which gate the flight to Singapore departed from.',
      'which gate the flight to Singapore left from'
    ],
    hints: {
      tenseHint: '\'does depart\' (Present Simple) shifts to \'departed\' (Past Simple).',
      generalHint: 'Keep \'which gate\', then subject \'the flight to Singapore\', then verb \'departed from\'.'
    },
    explanation: 'Keep \'which gate\', remove auxiliary \'does\', follow with subject \'the flight to Singapore\', and shift \'depart\' to \'departed\'.',
    scenarioContext: {
      avatar: '✈️',
      scene: 'Heathrow Terminal 5',
      speakerName: 'Passenger',
      listenerName: 'Flight Agent'
    }
  },
  {
    id: 'ex_scenario2',
    objective: 'questions_commands',
    category: 'requests_demands',
    level: 'beginner',
    title: 'Dr. Watson\'s Medical Advice',
    instruction: 'Dr. Watson gives instructions to a patient. Report the doctor\'s medical instruction.',
    directSpeech: '\'Take this herbal tonic twice a day after meals,\' Dr. Watson told the patient.',
    speaker: 'Dr. Watson',
    listener: 'the patient',
    speechType: 'demand',
    promptPrefix: 'Dr. Watson advised the patient',
    correctAnswers: [
      'to take that herbal tonic twice a day after meals',
      'to take that tonic twice a day after meals',
      'to take that herbal tonic twice a day after meals.',
      'to take that tonic twice a day after meals.'
    ],
    hints: {
      timeHint: '\'this herbal tonic\' shifts to \'that herbal tonic\'.',
      generalHint: 'Use \'to + base verb\': to take that herbal tonic twice a day after meals.'
    },
    explanation: 'Doctor\'s advice shifts to \'advised the patient to take...\'. Note demonstrative \'this\' shifts to \'that\'.',
    scenarioContext: {
      avatar: '🩺',
      scene: 'Baker Street Surgery',
      speakerName: 'Dr. Watson',
      listenerName: 'Patient'
    }
  },
  {
    id: 'ex_scenario3',
    objective: 'questions_commands',
    category: 'suggestions',
    level: 'intermediate',
    title: 'The Royal Crumpet Mystery',
    instruction: 'Chef Pierre suggests afternoon tea! Convert his cheerful suggestion.',
    directSpeech: '\'Shall we bake fresh warm scones for tea?\' Chef Pierre suggested to the staff.',
    speaker: 'Chef Pierre',
    listener: 'the staff',
    speechType: 'suggestion',
    promptPrefix: 'Chef Pierre suggested',
    correctAnswers: [
      'baking fresh warm scones for tea',
      'baking fresh warm scones for tea.',
      'that they bake fresh warm scones for tea',
      'that they should bake fresh warm scones for tea'
    ],
    hints: {
      reportingVerbHint: 'Chef Pierre suggested...',
      generalHint: 'Use gerund: baking fresh warm scones for tea.'
    },
    explanation: '\'Shall we\' turns into \'suggested baking\' or \'suggested that they should bake\'. Remember: never use \'suggested to bake\'!',
    scenarioContext: {
      avatar: '🧁',
      scene: 'Buckingham Palace Kitchen',
      speakerName: 'Chef Pierre',
      listenerName: 'Kitchen Staff'
    }
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'Cadet Reporter',
    description: 'Completed your first reported speech conversion.',
    icon: '🎯'
  },
  {
    id: 'question_master',
    name: 'Inspector Inversion',
    description: 'Mastered Yes/No & Wh- questions without auxiliary do/did traps.',
    icon: '🔍'
  },
  {
    id: 'tense_time_traveler',
    name: 'Tense Time Lord',
    description: 'Achieved 85%+ accuracy on backshifting past tenses and time words.',
    icon: '⏳'
  },
  {
    id: 'punctuation_perfectionist',
    name: 'Single Speech Marks Maestro',
    description: 'Mastered Cambridge single inverted commas (\' \') and direct speech punctuation.',
    icon: '🇬🇧'
  },
  {
    id: 'streak_flame',
    name: 'Grammar Habit Hero',
    description: 'Maintained a 3-day reported speech study streak.',
    icon: '🔥'
  },
  {
    id: 'lms_scholar',
    name: 'Cambridge English Scholar',
    description: 'Synced progress or achieved Level 3 Cambridge Scholar rank.',
    icon: '🎓'
  }
];
