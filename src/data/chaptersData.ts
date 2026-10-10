import { SkillCategory, ObjectiveType } from '../types';

export interface ChapterLevel {
  id: string; // e.g. 'ch1_lvl1'
  chapterNumber: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  objective: ObjectiveType;
  category: SkillCategory;
  directSpeech: string;
  promptPrefix?: string;
  correctAnswers: string[];
  hints: {
    generalHint: string;
    ruleHint: string;
  };
  explanation: string;
  cambridgeRule: string;
}

export interface ChapterInfo {
  chapterNumber: number;
  title: string;
  description: string;
  icon: string;
  themeColor: string;
  levels: ChapterLevel[];
}

export const CHAPTERS_DATA: ChapterInfo[] = [
  // ==========================================
  // CHAPTER 1: QUESTIONS, SUGGESTIONS & COMMANDS
  // ==========================================
  {
    chapterNumber: 1,
    title: 'Chapter 1: Questions, Suggestions & Demands',
    description: 'Master statement word order, if/whether connectors, gerund suggestions, and infinitive imperatives.',
    icon: '❓',
    themeColor: 'blue',
    levels: [
      {
        id: 'ch1_lvl1',
        chapterNumber: 1,
        levelNumber: 1,
        title: 'Level 1: Yes/No Questions (if / whether)',
        subtitle: 'The High Tea Invitation',
        objective: 'questions_commands',
        category: 'yes_no_questions',
        directSpeech: '\'Do you fancy a cup of Earl Grey tea?\' Liam asked me.',
        promptPrefix: 'Liam asked me',
        correctAnswers: [
          'if I fancied a cup of Earl Grey tea',
          'whether I fancied a cup of Earl Grey tea',
          'if I fancied a cup of Earl Grey tea.',
          'whether I fancied a cup of Earl Grey tea.'
        ],
        hints: {
          generalHint: 'Begin with \'if\' or \'whether\', then subject \'I\', then verb \'fancied\'.',
          ruleHint: 'Drop auxiliary \'do\' and backshift \'fancy\' into Past Simple \'fancied\'.'
        },
        explanation: 'In reported Yes/No questions, we use \'if\' or \'whether\'. Auxiliary \'do\' is dropped because reported questions are affirmative statements. Never say \'asked if did I fancy\'!',
        cambridgeRule: 'Drop auxiliary do/did and use statement word order: if/whether + Subject + Verb.'
      },
      {
        id: 'ch1_lvl2',
        chapterNumber: 1,
        levelNumber: 2,
        title: 'Level 2: Wh- Questions (Inversion Buster)',
        subtitle: 'The Lost Penguin at Paddington',
        objective: 'questions_commands',
        category: 'wh_questions',
        directSpeech: '\'Where do you live in London?\' the police officer asked Percy the penguin.',
        promptPrefix: 'The police officer asked Percy the penguin',
        correctAnswers: [
          'where he lived in London',
          'where he lived in London.',
          'where Percy lived in London'
        ],
        hints: {
          generalHint: 'Keep \'where\', then subject \'he\', then verb \'lived\'.',
          ruleHint: 'Never invert in reported speech! Say \'where he lived\', NOT \'where did he live\'.'
        },
        explanation: 'In Wh- questions, retain \'where\', drop auxiliary \'do\', and restore normal affirmative order (Subject \'he\' + Verb \'lived\').',
        cambridgeRule: 'Wh- questions retain the question word followed immediately by Subject + Verb.'
      },
      {
        id: 'ch1_lvl3',
        chapterNumber: 1,
        levelNumber: 3,
        title: 'Level 3: Polite Requests (to + verb)',
        subtitle: 'The Royal Afternoon Scone Request',
        objective: 'questions_commands',
        category: 'requests_demands',
        directSpeech: '\'Could you please pass the strawberry jam?\' Lady Beatrice asked me.',
        promptPrefix: 'Lady Beatrice asked me',
        correctAnswers: [
          'to pass the strawberry jam',
          'to pass the strawberry jam.'
        ],
        hints: {
          generalHint: 'Use \'to + base verb\': to pass the strawberry jam.',
          ruleHint: '\'Please\' is politely absorbed by the reporting verb \'asked\'.'
        },
        explanation: 'Polite requests with \'could you please\' transform into \'asked + object + to + base verb\'. We drop \'please\' because \'asked\' already conveys courtesy.',
        cambridgeRule: 'Requests become: asked + object + TO + base verb.'
      },
      {
        id: 'ch1_lvl4',
        chapterNumber: 1,
        levelNumber: 4,
        title: 'Level 4: Suggestions (suggest + -ing)',
        subtitle: 'The Cinema Proposal',
        objective: 'questions_commands',
        category: 'suggestions',
        directSpeech: '\'Let\'s watch a classic comedy at the cinema tonight,\' Sophie said.',
        promptPrefix: 'Sophie suggested',
        correctAnswers: [
          'watching a classic comedy at the cinema that night',
          'watching a classic comedy at the cinema that night.',
          'that they watch a classic comedy at the cinema that night',
          'that they should watch a classic comedy at the cinema that night'
        ],
        hints: {
          generalHint: 'In Cambridge English, suggest takes a gerund (-ing) or a that-clause!',
          ruleHint: 'Never say \'suggested to watch\'! Also shift \'tonight\' to \'that night\'.'
        },
        explanation: 'In Cambridge English, \'suggest\' NEVER takes a to-infinitive. Always use a gerund (\'suggested watching\') or that-clause (\'suggested that they watch\'). Also, \'tonight\' shifts to \'that night\'.',
        cambridgeRule: 'Suggest is followed by [Verb-ING] or that-clause, never a to-infinitive.'
      },
      {
        id: 'ch1_lvl5',
        chapterNumber: 1,
        levelNumber: 5,
        title: 'Level 5: Demands & Urgent Commands (not to)',
        subtitle: 'Space Commander Orion\'s Order',
        objective: 'questions_commands',
        category: 'requests_demands',
        directSpeech: '\'Don\'t touch the glowing cosmic hyperdrive!\' Commander Orion ordered the cadet.',
        promptPrefix: 'Commander Orion ordered the cadet',
        correctAnswers: [
          'not to touch the glowing cosmic hyperdrive',
          'not to touch the glowing cosmic hyperdrive.',
          'ordered the cadet not to touch the glowing cosmic hyperdrive'
        ],
        hints: {
          generalHint: 'Negative commands use \'not to + verb\': not to touch...',
          ruleHint: 'Never write \'to not touch\' or \'didn\'t touch\'.'
        },
        explanation: 'Negative imperatives (\'Don\'t touch\') transform directly into \'not to touch\'. Formula: ordered / told + object + NOT TO + base verb.',
        cambridgeRule: 'Negative commands: told / ordered + object + NOT TO + base verb.'
      }
    ]
  },

  // ==========================================
  // CHAPTER 2: THE TIME MACHINE (TENSES & PERSPECTIVES)
  // ==========================================
  {
    chapterNumber: 2,
    title: 'Chapter 2: The Time Machine (Tenses & Time)',
    description: 'Step one step down into the past: backshift continuous tenses, past simple, modals, and deictic time expressions.',
    icon: '⏳',
    themeColor: 'indigo',
    levels: [
      {
        id: 'ch2_lvl1',
        chapterNumber: 2,
        levelNumber: 1,
        title: 'Level 1: Present Simple ➔ Past Simple',
        subtitle: 'Living in London',
        objective: 'tense_pronouns_time',
        category: 'tense_backshift',
        directSpeech: '\'I live in central London,\' Arthur said.',
        promptPrefix: 'Arthur said that',
        correctAnswers: [
          'he lived in central London',
          'he lived in central London.'
        ],
        hints: {
          generalHint: '\'I\' becomes \'he\', and \'live\' becomes \'lived\'.',
          ruleHint: 'Present Simple shifts one step back into Past Simple.'
        },
        explanation: 'Present Simple (\'live\') steps back into Past Simple (\'lived\'). First person pronoun (\'I\') aligns to Arthur (\'he\').',
        cambridgeRule: 'Present Simple backshifts to Past Simple.'
      },
      {
        id: 'ch2_lvl2',
        chapterNumber: 2,
        levelNumber: 2,
        title: 'Level 2: Present Continuous ➔ Past Continuous',
        subtitle: 'The Cambridge Revision',
        objective: 'tense_pronouns_time',
        category: 'tense_backshift',
        directSpeech: '\'I am revising for my Cambridge English exam,\' Lucas said.',
        promptPrefix: 'Lucas said that',
        correctAnswers: [
          'he was revising for his Cambridge English exam',
          'he was revising for his Cambridge English exam.',
          'he was revising for his exam'
        ],
        hints: {
          generalHint: '\'am revising\' shifts to \'was revising\'.',
          ruleHint: 'Pronouns shift: \'I\' ➔ \'he\' and \'my\' ➔ \'his\'.'
        },
        explanation: 'Present Continuous (\'am revising\') steps back into Past Continuous (\'was revising\'). Pronouns (\'I\', \'my\') align to third person (\'he\', \'his\').',
        cambridgeRule: 'Present Continuous shifts to Past Continuous (was/were + V-ing).'
      },
      {
        id: 'ch2_lvl3',
        chapterNumber: 2,
        levelNumber: 3,
        title: 'Level 3: Past Simple ➔ Past Perfect',
        subtitle: 'The Big Ben Excursion',
        objective: 'tense_pronouns_time',
        category: 'time_place_shift',
        directSpeech: '\'We visited Big Ben and Westminster yesterday,\' Hannah told Oliver.',
        promptPrefix: 'Hannah told Oliver that',
        correctAnswers: [
          'they had visited Big Ben and Westminster the day before',
          'they had visited Big Ben and Westminster the previous day',
          'they had visited Big Ben and Westminster the day before.',
          'they had visited Big Ben and Westminster the previous day.'
        ],
        hints: {
          generalHint: 'Past Simple (\'visited\') shifts to Past Perfect (\'had visited\').',
          ruleHint: '\'yesterday\' shifts to \'the day before\' or \'the previous day\'.'
        },
        explanation: 'Past Simple (\'visited\') backshifts into Past Perfect (\'had visited\'). \'We\' becomes \'they\', and \'yesterday\' becomes \'the day before\' or \'the previous day\'.',
        cambridgeRule: 'Past Simple shifts to Past Perfect (had + V3), and yesterday becomes the day before.'
      },
      {
        id: 'ch2_lvl4',
        chapterNumber: 2,
        levelNumber: 4,
        title: 'Level 4: Modal Backshifts (will ➔ would)',
        subtitle: 'The Royal Letters Dispatch',
        objective: 'tense_pronouns_time',
        category: 'time_place_shift',
        directSpeech: '\'I will deliver these royal letters tomorrow,\' the dispatch rider promised.',
        promptPrefix: 'The dispatch rider promised that',
        correctAnswers: [
          'he would deliver those royal letters the following day',
          'he would deliver those royal letters the next day',
          'she would deliver those royal letters the following day',
          'she would deliver those royal letters the next day',
          'he would deliver those royal letters the following day.'
        ],
        hints: {
          generalHint: 'Will becomes would, these becomes those, and tomorrow becomes the following day.',
          ruleHint: 'Triple shift: modal + demonstrative + time expression.'
        },
        explanation: 'Three shifts occur: \'will\' ➔ \'would\', \'these\' ➔ \'those\', and \'tomorrow\' ➔ \'the following day\' / \'the next day\'.',
        cambridgeRule: 'Will becomes would, these becomes those, and tomorrow becomes the following day.'
      },
      {
        id: 'ch2_lvl5',
        chapterNumber: 2,
        levelNumber: 5,
        title: 'Level 5: Pronoun Alignment (Perspective Mastery)',
        subtitle: 'The Forgotten Umbrella',
        objective: 'tense_pronouns_time',
        category: 'pronoun_shift',
        directSpeech: '\'You have left your umbrella in my flat,\' Daniel told me.',
        promptPrefix: 'Daniel told me that',
        correctAnswers: [
          'I had left my umbrella in his flat',
          'I had left my umbrella in his flat.',
          'I had forgotten my umbrella in his flat'
        ],
        hints: {
          generalHint: 'Present Perfect (\'have left\') shifts to Past Perfect (\'had left\').',
          ruleHint: '\'You have left your\' ➔ \'I had left my\', and \'my flat\' ➔ \'his flat\'.'
        },
        explanation: 'Because Daniel spoke to \'me\', \'you have left your\' shifts to \'I had left my\', and \'my flat\' (Daniel\'s flat) becomes \'his flat\'. Present Perfect backshifts to Past Perfect.',
        cambridgeRule: 'Align pronouns to the listener perspective and backshift have left to had left.'
      }
    ]
  },

  // ==========================================
  // CHAPTER 3: THE CAMBRIDGE INSPECTOR (SINGLE SPEECH MARKS)
  // ==========================================
  {
    chapterNumber: 3,
    title: 'Chapter 3: Cambridge Single Speech Marks (\' \')',
    description: 'Enforce strictly single speech marks (\' \'), punctuation inside quotes, and capital letters.',
    icon: '🇬🇧',
    themeColor: 'emerald',
    levels: [
      {
        id: 'ch3_lvl1',
        chapterNumber: 3,
        levelNumber: 1,
        title: 'Level 1: Single Speech Marks (\' \') & Capital Letter',
        subtitle: 'The Train Ticket to Oxford',
        objective: 'punctuation_structure',
        category: 'direct_speech_punctuation',
        directSpeech: 'Alice said I need to buy a train ticket to Oxford',
        correctAnswers: [
          'Alice said, \'I need to buy a train ticket to Oxford.\'',
          'Alice said, ‘I need to buy a train ticket to Oxford.’',
          'Alice said, \'I need to buy a train ticket to Oxford.\''
        ],
        hints: {
          generalHint: 'Format: Alice said, \'I need to buy a train ticket to Oxford.\'',
          ruleHint: 'Use ONLY single speech marks (\' \'). Never use double quotation marks!'
        },
        explanation: 'In Cambridge English, direct speech is enclosed in single speech marks (\' \'). Comma after \'said,\' capital \'I\', and full stop inside the closing speech mark.',
        cambridgeRule: 'Use strictly single speech marks (\' \') for direct speech.'
      },
      {
        id: 'ch3_lvl2',
        chapterNumber: 3,
        levelNumber: 2,
        title: 'Level 2: Dialogue Tag Comma Placement',
        subtitle: 'David is Ready',
        objective: 'punctuation_structure',
        category: 'direct_speech_punctuation',
        directSpeech: 'I am completely ready said David',
        correctAnswers: [
          '\'I am completely ready,\' said David.',
          '‘I am completely ready,’ said David.'
        ],
        hints: {
          generalHint: 'Place the comma INSIDE the closing single speech mark: \'I am completely ready,\' said David.',
          ruleHint: 'The sentence ends with a full stop after said David.'
        },
        explanation: 'When dialogue precedes the reporting tag, place a comma inside the single speech marks before the reporting tag (\'...,\').',
        cambridgeRule: 'Comma stays INSIDE closing single speech mark before said David.'
      },
      {
        id: 'ch3_lvl3',
        chapterNumber: 3,
        levelNumber: 3,
        title: 'Level 3: Question Mark Placement Inside Speech Marks',
        subtitle: 'Opening Hours at the British Museum',
        objective: 'punctuation_structure',
        category: 'direct_speech_punctuation',
        directSpeech: 'what time does the British Museum open asked Marcus',
        correctAnswers: [
          '\'What time does the British Museum open?\' asked Marcus.',
          '‘What time does the British Museum open?’ asked Marcus.'
        ],
        hints: {
          generalHint: 'Question mark stays INSIDE the single speech marks: \'...open?\' asked Marcus.',
          ruleHint: 'Capitalize \'What\', and finish with a full stop after Marcus.'
        },
        explanation: 'In Cambridge direct speech questions: Enclose in single speech marks (\' \'), capitalize \'What\', place the question mark INSIDE the closing single speech mark (\'?\'), and terminate after \'asked Marcus.\'',
        cambridgeRule: 'Question marks are placed inside the closing single speech mark.'
      },
      {
        id: 'ch3_lvl4',
        chapterNumber: 3,
        levelNumber: 4,
        title: 'Level 4: Interrupted / Split Dialogue Tagging',
        subtitle: 'Arriving in London',
        objective: 'punctuation_structure',
        category: 'direct_speech_punctuation',
        directSpeech: 'we have reached London said Chloe so grab your rucksacks',
        correctAnswers: [
          '\'We have reached London,\' said Chloe, \'so grab your rucksacks.\'',
          '‘We have reached London,’ said Chloe, ‘so grab your rucksacks.’'
        ],
        hints: {
          generalHint: 'First quote ends with comma inside quotes: \'We have reached London,\' said Chloe, \'so grab your rucksacks.\'',
          ruleHint: 'Second quote resumes in lowercase because it continues the same sentence.'
        },
        explanation: 'Interrupted dialogue in Cambridge English: First quote ends with comma inside single speech marks (\'We have reached London,\'), tag follows with comma (\'said Chloe,\'), and second quote resumes in single speech marks lowercase (\'so grab your rucksacks.\').',
        cambridgeRule: 'Interrupted speech uses commas after both dialogue parts and single speech marks.'
      },
      {
        id: 'ch3_lvl5',
        chapterNumber: 3,
        levelNumber: 5,
        title: 'Level 5: Grand Cambridge Master Challenge',
        subtitle: 'The Inspector\'s Clue',
        objective: 'punctuation_structure',
        category: 'direct_speech_punctuation',
        directSpeech: 'the diamond was stolen at midnight whispered the inspector',
        correctAnswers: [
          '\'The diamond was stolen at midnight,\' whispered the inspector.',
          '‘The diamond was stolen at midnight,’ whispered the inspector.'
        ],
        hints: {
          generalHint: 'Enclose with single speech marks, capitalize \'The\', comma inside speech mark, lowercase \'whispered\'.',
          ruleHint: '\'The diamond was stolen at midnight,\' whispered the inspector.'
        },
        explanation: 'Single speech marks enclose the quote, comma inside the quote, lowercase \'whispered\', and full stop at the end.',
        cambridgeRule: 'Single speech marks only, comma inside quotes, period terminates sentence.'
      }
    ]
  }
];

export const TOTAL_PRACTICE_LEVELS = 15; // 3 Chapters * 5 Levels
