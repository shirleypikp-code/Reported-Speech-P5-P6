export interface GrammarRuleTopic {
  id: string;
  title: string;
  objective: 'questions_commands' | 'tense_pronouns_time' | 'punctuation_structure';
  summary: string;
  rules: {
    ruleName: string;
    description: string;
    formula?: string;
    directExample: string;
    reportedExample: string;
    explanation: string;
    commonPitfall?: string;
    funTip?: string;
  }[];
}

export const TENSE_SHIFT_MATRIX = [
  {
    directTense: 'Present Simple',
    directVerb: 'am / is / are / write',
    reportedTense: 'Past Simple',
    reportedVerb: 'was / were / wrote',
    exampleDirect: '\'I live in London,\' he said.',
    exampleReported: 'He said (that) he lived in London.',
    note: 'Universal truths can sometimes remain in present (e.g. \'The Earth orbits the sun\').'
  },
  {
    directTense: 'Present Continuous',
    directVerb: 'am/is/are writing',
    reportedTense: 'Past Continuous',
    reportedVerb: 'was/were writing',
    exampleDirect: '\'I am drinking a cup of Earl Grey,\' she said.',
    exampleReported: 'She said she was drinking a cup of Earl Grey.',
    note: 'Remember to match the subject with was or were.'
  },
  {
    directTense: 'Past Simple',
    directVerb: 'wrote / didn\'t write',
    reportedTense: 'Past Perfect',
    reportedVerb: 'had written / hadn\'t written',
    exampleDirect: '\'We visited Cambridge yesterday,\' they said.',
    exampleReported: 'They said they had visited Cambridge the day before.',
    note: 'Past Simple backshifts into Past Perfect (had + V3).'
  },
  {
    directTense: 'Present Perfect',
    directVerb: 'have / has written',
    reportedTense: 'Past Perfect',
    reportedVerb: 'had written',
    exampleDirect: '\'I have finished my essay,\' Leo said.',
    exampleReported: 'Leo said he had finished his essay.',
    note: 'Both Present Perfect and Past Simple shift into Past Perfect.'
  },
  {
    directTense: 'Future Simple (will)',
    directVerb: 'will write',
    reportedTense: 'Conditional (would)',
    reportedVerb: 'would write',
    exampleDirect: '\'I will phone you tonight,\' Maya promised.',
    exampleReported: 'Maya promised that she would phone me that night.',
    note: 'Will becomes would; shall becomes should or would.'
  },
  {
    directTense: 'Can / May / Must',
    directVerb: 'can / may / must',
    reportedTense: 'Modal Past',
    reportedVerb: 'could / might / had to',
    exampleDirect: '\'You must wear your school blazer,\' the headmaster said.',
    exampleReported: 'The headmaster said I had to wear my school blazer.',
    note: 'Could, would, should, might, and ought to remain unchanged.'
  }
];

export const TIME_PLACE_SHIFTS = [
  { direct: 'today', reported: 'that day', example: '\'I feel great today.\' ➔ He said he felt great that day.' },
  { direct: 'yesterday', reported: 'the day before / the previous day', example: '\'I saw him yesterday.\' ➔ She said she had seen him the day before.' },
  { direct: 'tomorrow', reported: 'the following day / the next day', example: '\'We travel tomorrow.\' ➔ They said they traveled the following day.' },
  { direct: 'now', reported: 'then / at that moment', example: '\'I am busy now.\' ➔ He said he was busy then.' },
  { direct: 'tonight', reported: 'that night', example: '\'Let us go to the cinema tonight.\' ➔ She suggested going to the cinema that night.' },
  { direct: 'last week/month/year', reported: 'the previous week/month/year', example: '\'I passed last year.\' ➔ He said he had passed the previous year.' },
  { direct: 'next week/month/year', reported: 'the following week/month/year', example: '\'We will arrive next week.\' ➔ They said they would arrive the following week.' },
  { direct: 'ago', reported: 'before', example: '\'Two hours ago.\' ➔ Two hours before.' },
  { direct: 'here', reported: 'there', example: '\'Leave it here.\' ➔ She told me to leave it there.' },
  { direct: 'this / these', reported: 'that / those', example: '\'Take these books.\' ➔ He told me to take those books.' },
];

export const PRONOUN_SHIFTS = [
  {
    perspective: 'First Person (Speaker)',
    direct: 'I, me, my, mine, myself',
    reported: 'he/she, him/her, his/her, his/hers, himself/herself',
    rule: 'Aligns with the gender and identity of the original speaker.'
  },
  {
    perspective: 'First Person Plural',
    direct: 'we, us, our, ours, ourselves',
    reported: 'they, them, their, theirs, themselves',
    rule: 'Shifts to third person plural unless the reporter was also part of the group.'
  },
  {
    perspective: 'Second Person (Listener)',
    direct: 'you, your, yours, yourself',
    reported: 'I/me/my (if reporting about oneself) or he/she/they',
    rule: 'Adjusts based on who was spoken to in the dialogue.'
  }
];

export const GRAMMAR_LESSONS: GrammarRuleTopic[] = [
  {
    id: 'lesson_questions',
    title: 'Objective 1: Questions (Yes/No & Wh-)',
    objective: 'questions_commands',
    summary: 'Turn direct questions into reported statements without question marks or auxiliary do/did.',
    rules: [
      {
        ruleName: 'Yes / No Questions (if / whether)',
        description: 'Connect with \'if\' or \'whether\' and use affirmative statement word order (Subject + Verb). Drop auxiliary do, does, and did!',
        formula: 'asked + (object) + IF / WHETHER + Subject + Backshifted Verb',
        directExample: '\'Do you like British tea?\' Liam asked me.',
        reportedExample: 'Liam asked me if I liked British tea.',
        explanation: 'Auxiliary \'do\' is eliminated because reported questions are affirmative sentences. There is NO question mark at the end.',
        commonPitfall: '❌ Liam asked me if did I like British tea. (Never keep auxiliary do/did in reported speech).',
        funTip: '💡 Think of \'if\' as the magic doorway that turns an inverted question back into a calm statement!'
      },
      {
        ruleName: 'Wh- Questions (What, Where, Why, When, How, Who)',
        description: 'Retain the question word (where, what, why), but unwind the question order into standard Subject + Verb.',
        formula: 'asked + (object) + Wh-word + Subject + Backshifted Verb',
        directExample: '\'Where did you hide the biscuit tin?\' Inspector Lestrade asked.',
        reportedExample: 'Inspector Lestrade asked where I had hidden the biscuit tin.',
        explanation: '\'Where\' stays at the front, but \'did you hide\' backshifts into \'I had hidden\' (Past Simple ➔ Past Perfect).',
        commonPitfall: '❌ Inspector Lestrade asked where had I hidden the tin. (Subject MUST come before the verb!).',
        funTip: '🕵️‍♂️ Detective Rule: The subject leads the investigation in reported speech, not the auxiliary verb!'
      }
    ]
  },
  {
    id: 'lesson_suggestions_commands',
    title: 'Objective 1: Suggestions, Requests & Demands',
    objective: 'questions_commands',
    summary: 'Use Cambridge reporting verbs with gerunds (-ing) or infinitive clauses (to / not to).',
    rules: [
      {
        ruleName: 'Suggestions (suggested + -ing / suggested that...)',
        description: 'Conversational prompts starting with \'Let\'s\', \'Why don\'t we\', or \'Shall we\' transform using \'suggested + -ing\' or \'suggested that + subject + (should) verb\'.',
        formula: 'suggested + [Verb-ING]  OR  suggested that + Subject + (should) Verb',
        directExample: '\'Let\'s explore the British Museum this afternoon,\' Oliver said.',
        reportedExample: 'Oliver suggested exploring the British Museum that afternoon.',
        explanation: 'In Cambridge English, \'suggest\' NEVER takes a to-infinitive. Always use the gerund (-ing) or a that-clause.',
        commonPitfall: '❌ Oliver suggested to explore the museum. (\'Suggest to do\' is a classic error!).',
        funTip: '🎯 Golden Cambridge Rule: Suggest loves -ing! Say \'suggested doing\', never \'suggested to do\'.'
      },
      {
        ruleName: 'Requests (asked + someone + to do)',
        description: 'Polite questions (\'Could you please...\', \'Would you mind...\') become \'asked + object + to + infinitive\'.',
        formula: 'asked / requested + object + TO + base verb',
        directExample: '\'Could you please pass the marmalade?\' Aunt Clara asked me.',
        reportedExample: 'Aunt Clara asked me to pass the marmalade.',
        explanation: '\'Please\' and \'could you\' are dropped because the courtesy is already expressed by the verb \'asked\'.'
      },
      {
        ruleName: 'Commands & Demands (told / ordered + not to do)',
        description: 'Imperative orders become \'told / ordered / commanded + someone + (not) to + base verb\'.',
        formula: 'told / ordered + object + (NOT) TO + base verb',
        directExample: '\'Don\'t feed the royal swans!\' the park warden shouted.',
        reportedExample: 'The park warden ordered us not to feed the royal swans.',
        explanation: 'Negative commands (\'Don\'t do X\') convert to \'not to do\', never \'to not do\' or \'didn\'t do\'.'
      }
    ]
  },
  {
    id: 'lesson_tense_pronouns_time',
    title: 'Objective 2: Verb Tense, Pronouns & Time Shifts',
    objective: 'tense_pronouns_time',
    summary: 'When the reporting verb is in the past, backshift the verb one step deeper into the past and align points of view.',
    rules: [
      {
        ruleName: 'The Tense Backshift Staircase',
        description: 'Step one step down into the past: Present Simple ➔ Past Simple; Present Cont ➔ Past Cont; Past Simple ➔ Past Perfect.',
        directExample: '\'I have misplaced my umbrella,\' Arthur sighed.',
        reportedExample: 'Arthur sighed that he had misplaced his umbrella.',
        explanation: '\'Have misplaced\' (Present Perfect) steps back into \'had misplaced\' (Past Perfect).'
      },
      {
        ruleName: 'Pronoun Perspective Adjustment',
        description: 'Adjust pronouns so the sentence makes sense from the listener\'s or narrator\'s viewpoint.',
        directExample: '\'You forgot your train pass in my flat,\' George told me.',
        reportedExample: 'George told me that I had forgotten my train pass in his flat.',
        explanation: '\'You\' and \'your\' refer to the listener (\'me\') ➔ \'I\' and \'my\'. \'My flat\' (George\'s flat) ➔ \'his flat\'.'
      },
      {
        ruleName: 'Time & Place Shifts (Deixis)',
        description: 'Words anchored in the immediate \'here\' and \'now\' shift to distant points in time and space.',
        directExample: '\'We shall meet here tomorrow,\' the professor announced.',
        reportedExample: 'The professor announced that they would meet there the following day.',
        explanation: '\'Here\' ➔ \'there\', and \'tomorrow\' ➔ \'the following day\' or \'the next day\'.'
      }
    ]
  },
  {
    id: 'lesson_punctuation_direct_speech',
    title: 'Objective 3: Cambridge Direct Speech Structure & Punctuation',
    objective: 'punctuation_structure',
    summary: 'In Cambridge English, direct speech dialogues use SINGLE speech marks (\' \') with precise comma and capitalization rules.',
    rules: [
      {
        ruleName: 'Cambridge Single Speech Marks (\' \')',
        description: 'Cambridge English / British convention uses single inverted commas / single speech marks (\'...\') for direct speech dialogues.',
        formula: 'Reporting clause + comma + \'Capitalized spoken sentence with terminal mark inside speech marks.\'',
        directExample: 'Charlotte said, \'We must catch the morning train to Oxford.\'',
        reportedExample: 'Charlotte said that they had to catch the morning train to Oxford. (NO speech marks in reported speech!)',
        explanation: 'Enclose the exact spoken words in single speech marks (\' \'). Notice the comma after \'said\', the capital \'W\', and the full stop inside the closing speech mark.',
        funTip: '🇬🇧 Cambridge Style Tip: Always use single speech marks (\' \'). Never use double speech marks!'
      },
      {
        ruleName: 'Comma Placement Before Dialogue Tags',
        description: 'When the spoken dialogue comes first, place a comma INSIDE the single speech marks before the reporting tag.',
        directExample: '\'I am completely ready,\' said David.',
        reportedExample: 'David said that he was completely ready.',
        explanation: 'Notice the comma is inside the single speech marks (\'...,\') because the sentence continues with \'said David.\''
      },
      {
        ruleName: 'Capital Letters in Direct Speech',
        description: 'The first word of quoted direct speech ALWAYS begins with a capital letter, even when following an attribution tag.',
        directExample: 'The headteacher smiled and asked, \'Who solved the puzzle?\'',
        reportedExample: 'The headteacher smiled and asked who had solved the puzzle.',
        explanation: '\'Who\' has a capital \'W\' in direct speech. In reported speech, it takes lowercase unless starting the sentence.'
      },
      {
        ruleName: 'Strict Rule: Use ONLY Single Speech Marks (\' \')',
        description: 'Direct speech dialogues must use strictly single speech marks (\' \'). Double speech marks are never used in our dialogues.',
        directExample: '\'We are arriving at Oxford station,\' explained the conductor.',
        reportedExample: 'The conductor explained that they were arriving at Oxford station.',
        explanation: 'Always enclose direct speech in single speech marks (\' \'). Never use double speech marks.'
      }
    ]
  }
];
