export interface DuelQuestion {
  id: string;
  category: string;
  prompt: string;
  speaker: string;
  directSpeech: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  cambridgeRule: string;
}

export const DUEL_QUESTIONS_POOL: DuelQuestion[] = [
  // Objective 1: Questions
  {
    id: 'dq_1',
    category: 'Questions (Yes/No)',
    prompt: 'Convert Liam\'s question into Cambridge reported speech:',
    speaker: 'Liam',
    directSpeech: '\'Do you fancy a cup of tea?\' Liam asked me.',
    options: [
      'Liam asked me if I fancied a cup of tea.',
      'Liam asked me if did I fancy a cup of tea.',
      'Liam asked me that do I fancy a cup of tea.',
      'Liam asked me whether did I fancied a cup of tea.'
    ],
    correctIndex: 0,
    explanation: 'In reported Yes/No questions, connect with \'if\' or \'whether\'. Auxiliary \'do\' is eliminated and the verb backshifts from \'fancy\' (Present Simple) to \'fancied\' (Past Simple). Statement word order: Subject (\'I\') + Verb (\'fancied\').',
    cambridgeRule: 'Drop auxiliary do/did and never invert the subject and verb in reported questions.'
  },
  {
    id: 'dq_2',
    category: 'Questions (Wh- Inversion)',
    prompt: 'Report Percy the lost penguin\'s question without inversion:',
    speaker: 'Percy',
    directSpeech: '\'Where can I catch the train to Paddington?\' asked Percy.',
    options: [
      'Percy asked where could he catch the train to Paddington.',
      'Percy asked where he could catch the train to Paddington.',
      'Percy asked that where he can catch the train to Paddington.',
      'Percy asked where did he catch the train to Paddington.'
    ],
    correctIndex: 1,
    explanation: 'Keep the question word \'where\'. The modal \'can\' backshifts to \'could\', but Subject \'he\' MUST come BEFORE \'could\'! Affirmative word order: where + he + could catch.',
    cambridgeRule: 'In reported Wh- questions, maintain normal statement order (Wh-word + Subject + Verb).'
  },
  {
    id: 'dq_3',
    category: 'Suggestions',
    prompt: 'Convert Sophie\'s Cambridge suggestion accurately:',
    speaker: 'Sophie',
    directSpeech: '\'Let\'s visit the British Museum this afternoon,\' suggested Sophie.',
    options: [
      'Sophie suggested to visit the British Museum that afternoon.',
      'Sophie suggested visiting the British Museum that afternoon.',
      'Sophie suggested visiting the British Museum this afternoon.',
      'Sophie suggested that they visited the British Museum this afternoon.'
    ],
    correctIndex: 1,
    explanation: 'In Cambridge English, \'suggest\' is followed by a gerund (-ing: \'suggested visiting\') or a that-clause with base/should. It NEVER takes a to-infinitive (\'suggested to visit\' is wrong!). Also, \'this afternoon\' shifts to \'that afternoon\'.',
    cambridgeRule: 'Suggest takes -ing or a that-clause, never a to-infinitive.'
  },
  {
    id: 'dq_4',
    category: 'Requests & Demands',
    prompt: 'Report the officer\'s urgent command:',
    speaker: 'The officer',
    directSpeech: '\'Don\'t cross the yellow line!\' the officer ordered the passengers.',
    options: [
      'The officer ordered the passengers to not cross the yellow line.',
      'The officer ordered the passengers didn\'t cross the yellow line.',
      'The officer ordered the passengers not to cross the yellow line.',
      'The officer ordered the passengers that they don\'t cross the yellow line.'
    ],
    correctIndex: 2,
    explanation: 'Negative imperatives (\'Don\'t do X\') convert to \'ordered / told someone NOT TO + base verb\'. We say \'not to cross\', never \'to not cross\' or \'didn\'t cross\'.',
    cambridgeRule: 'Negative commands: told / ordered + object + NOT TO + base verb.'
  },
  // Objective 2: Tense & Time shifts
  {
    id: 'dq_5',
    category: 'Tense Backshifting',
    prompt: 'Convert Lucas\'s statement into reported speech:',
    speaker: 'Lucas',
    directSpeech: '\'I am revising for my Cambridge exam,\' Lucas said.',
    options: [
      'Lucas said that he was revising for his Cambridge exam.',
      'Lucas said that he is revising for his Cambridge exam.',
      'Lucas said that he had revised for his Cambridge exam.',
      'Lucas said that I was revising for my Cambridge exam.'
    ],
    correctIndex: 0,
    explanation: 'Present Continuous (\'am revising\') steps back into Past Continuous (\'was revising\'). Pronoun \'I\' changes to \'he\', and \'my\' changes to \'his\'.',
    cambridgeRule: 'Present Continuous backshifts to Past Continuous (was/were + V-ing).'
  },
  {
    id: 'dq_6',
    category: 'Past Simple to Past Perfect',
    prompt: 'Hannah reports yesterday\'s visit. Apply both tense and time shifts:',
    speaker: 'Hannah',
    directSpeech: '\'We visited Big Ben yesterday,\' Hannah told Oliver.',
    options: [
      'Hannah told Oliver that they visited Big Ben yesterday.',
      'Hannah told Oliver that they had visited Big Ben the previous day.',
      'Hannah told Oliver that they have visited Big Ben the day before.',
      'Hannah told Oliver that they would visit Big Ben the following day.'
    ],
    correctIndex: 1,
    explanation: 'Past Simple (\'visited\') backshifts into Past Perfect (\'had visited\'). The time deixis \'yesterday\' shifts to \'the previous day\' or \'the day before\'.',
    cambridgeRule: 'Past Simple shifts to Past Perfect (had + V3), and yesterday becomes the day before.'
  },
  {
    id: 'dq_7',
    category: 'Future Modal Shift',
    prompt: 'Convert the royal courier\'s promise:',
    speaker: 'The courier',
    directSpeech: '\'I will deliver these documents tomorrow,\' promised the courier.',
    options: [
      'The courier promised that he will deliver these documents tomorrow.',
      'The courier promised that he would deliver those documents the following day.',
      'The courier promised that he could deliver those documents yesterday.',
      'The courier promised that he would deliver these documents the next day.'
    ],
    correctIndex: 1,
    explanation: 'Future modal \'will\' shifts to conditional \'would\'. Demonstrative \'these\' shifts to \'those\'. Time expression \'tomorrow\' shifts to \'the following day\' or \'the next day\'.',
    cambridgeRule: 'Will ➔ would, these ➔ those, and tomorrow ➔ the following day.'
  },
  // Objective 3: Cambridge Single Speech Marks
  {
    id: 'dq_8',
    category: 'Cambridge Speech Marks',
    prompt: 'Identify the sentence with correct Cambridge English punctuation:',
    speaker: 'Inspector Lestrade',
    directSpeech: 'The inspector questions the witness.',
    options: [
      '\'The diamond was stolen at midnight,\' whispered the inspector.',
      'The diamond was stolen at midnight,\' whispered the inspector.',
      '\'The diamond was stolen at midnight\', whispered the inspector.',
      '\'The diamond was stolen at midnight,\' Whispered the inspector.'
    ],
    correctIndex: 0,
    explanation: 'In Cambridge English, direct speech uses SINGLE speech marks (\' \'). When dialogue precedes the attribution tag, the comma is placed INSIDE the closing speech mark (\'...,\'), followed by lowercase \'whispered\'.',
    cambridgeRule: 'Cambridge English uses single inverted commas (\' \') with the comma inside the closing mark.'
  },
  {
    id: 'dq_9',
    category: 'Cambridge Question Mark Placement',
    prompt: 'Which Cambridge direct speech question is punctuated flawlessly?',
    speaker: 'David',
    directSpeech: 'David inquires about the museum.',
    options: [
      '\'What time does the gallery open?\' asked David.',
      '\'What time does the gallery open\'? asked David.',
      '\'What time does the gallery open,\' asked David.',
      '\'What time does the gallery open,\' asked David?'
    ],
    correctIndex: 0,
    explanation: 'In Cambridge English: Enclose in single speech marks (\' \'), capitalize the first letter \'What\', place the question mark INSIDE the closing single speech mark (\'?\'), and end with a full stop after \'asked David.\'',
    cambridgeRule: 'Terminal question marks remain inside the closing single speech mark.'
  },
  {
    id: 'dq_10',
    category: 'Reported Speech Punctuation Trap',
    prompt: 'Which sentence correctly punctuates REPORTED speech?',
    speaker: 'Charlotte',
    directSpeech: 'Charlotte shares her thoughts.',
    options: [
      'Charlotte said that \'she loved reading Shakespeare\'.',
      'Charlotte said that, \'she loved reading Shakespeare\'.',
      'Charlotte said that she loved reading Shakespeare.',
      'Charlotte said, that she loved reading Shakespeare.'
    ],
    correctIndex: 2,
    explanation: 'Reported speech NEVER uses quotation marks or speech marks! It is an indirect statement, so no speech marks of any kind are permitted.',
    cambridgeRule: 'Never use quotation marks or speech marks in reported speech.'
  }
];

export function getRandomDuelQuestions(count = 5): DuelQuestion[] {
  const shuffled = [...DUEL_QUESTIONS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
