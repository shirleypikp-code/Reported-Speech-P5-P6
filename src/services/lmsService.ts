import { UserProfile, UserProgress, LMSAssignment } from '../types';

export const SAMPLE_ASSIGNMENT_CODES: LMSAssignment[] = [
  {
    code: 'REP-OBJ1-QUEST',
    title: 'Assignment #1: Questions, Suggestions & Demands',
    targetObjective: 'questions_commands',
    requiredExerciseCount: 4,
    minMasteryPercentage: 80,
    dueDateTime: '2026-10-15T23:59',
    assignedByTeacher: 'Ms. Shirley (Bina Bangsa School)'
  },
  {
    code: 'REP-OBJ2-TENSE',
    title: 'Assignment #2: Tense Backshifting & Time Deixis',
    targetObjective: 'tense_pronouns_time',
    requiredExerciseCount: 4,
    minMasteryPercentage: 80,
    dueDateTime: '2026-10-18T23:59',
    assignedByTeacher: 'Ms. Shirley (Bina Bangsa School)'
  },
  {
    code: 'REP-OBJ3-PUNC',
    title: 'Assignment #3: Direct Speech Punctuation Lab',
    targetObjective: 'punctuation_structure',
    requiredExerciseCount: 3,
    minMasteryPercentage: 85,
    dueDateTime: '2026-10-20T23:59',
    assignedByTeacher: 'Ms. Shirley (Bina Bangsa School)'
  },
  {
    code: 'REP-MASTERY-ALL',
    title: 'Final Reported Speech Comprehensive Exam',
    targetObjective: 'all',
    requiredExerciseCount: 8,
    minMasteryPercentage: 90,
    dueDateTime: '2026-10-25T23:59',
    assignedByTeacher: 'English Dept (Bina Bangsa School)'
  }
];

export const LMSService = {
  // Look up an assignment code
  findAssignment(code: string): LMSAssignment | undefined {
    const clean = code.trim().toUpperCase();
    return SAMPLE_ASSIGNMENT_CODES.find(a => a.code.toUpperCase() === clean);
  },

  // Export Canvas LMS Gradebook CSV
  exportCanvasGradebookCSV(profile: UserProfile, progress: UserProgress): string {
    const overallScore = progress.totalExercisesCompleted > 0 
      ? Math.round((progress.totalCorrect / progress.totalExercisesCompleted) * 100)
      : 0;
    
    const obj1Score = Math.round(
      ((progress.skills.yes_no_questions.accuracyRate +
        progress.skills.wh_questions.accuracyRate +
        progress.skills.suggestions.accuracyRate +
        progress.skills.requests_demands.accuracyRate) / 4)
    );

    const obj2Score = Math.round(
      ((progress.skills.tense_backshift.accuracyRate +
        progress.skills.pronoun_shift.accuracyRate +
        progress.skills.time_place_shift.accuracyRate) / 3)
    );

    const obj3Score = progress.skills.direct_speech_punctuation.accuracyRate;

    const headers = [
      'Student',
      'ID',
      'SIS User ID',
      'SIS Login ID',
      'Section',
      'Reported Speech Overall Mastery [100 pts]',
      'Obj 1 Questions & Demands [100 pts]',
      'Obj 2 Tenses & Time Shifts [100 pts]',
      'Obj 3 Punctuation & Quotes [100 pts]'
    ].join(',');

    const studentRow = [
      `"${profile.name}"`,
      profile.studentId || 'N/A',
      profile.studentId || 'N/A',
      profile.email || `${profile.id}@school.edu`,
      `"${profile.classGroup}"`,
      overallScore,
      obj1Score,
      obj2Score,
      obj3Score
    ].join(',');

    return `${headers}\n${studentRow}`;
  },

  // Export Google Classroom CSV format
  exportGoogleClassroomCSV(profile: UserProfile, progress: UserProgress): string {
    const accuracy = progress.totalExercisesCompleted > 0 
      ? Math.round((progress.totalCorrect / progress.totalExercisesCompleted) * 100)
      : 0;

    const headers = ['Learner Name', 'Student ID', 'Class Section', 'Total Exercises', 'Score (%)', 'Streak (Days)', 'Proficiency Level'];
    const row = [
      `"${profile.name}"`,
      `"${profile.studentId}"`,
      `"${profile.classGroup}"`,
      progress.totalExercisesCompleted,
      `${accuracy}%`,
      progress.streakDays,
      accuracy >= 85 ? 'Master' : accuracy >= 70 ? 'Proficient' : 'Developing'
    ].join(',');

    return `${headers.join(',')}\n${row}`;
  },

  // Export Moodle Gradebook XML format
  exportMoodleGradebookXML(profile: UserProfile, progress: UserProgress): string {
    const accuracy = progress.totalExercisesCompleted > 0 
      ? Math.round((progress.totalCorrect / progress.totalExercisesCompleted) * 100)
      : 0;

    return `<?xml version="1.0" encoding="UTF-8"?>
<moodle_grades>
  <student id="${profile.studentId}">
    <name>${profile.name}</name>
    <course_section>${profile.classGroup}</course_section>
    <grade_item id="reported_speech_unit">
      <itemname>Reported Speech Mastery Assessment</itemname>
      <grademax>100</grademax>
      <grade>${accuracy}</grade>
      <feedback>Completed ${progress.totalExercisesCompleted} conversions with ${progress.streakDays} day streak.</feedback>
    </grade_item>
  </student>
</moodle_grades>`;
  },

  // Export SCORM / xAPI / CMI5 Statement
  exportXAPIStatement(profile: UserProfile, progress: UserProgress): object {
    const accuracy = progress.totalExercisesCompleted > 0 
      ? (progress.totalCorrect / progress.totalExercisesCompleted)
      : 0;

    return {
      id: 'urn:uuid:' + Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
      actor: {
        objectType: 'Agent',
        name: profile.name,
        mbox: `mailto:${profile.email || profile.studentId + '@school.org'}`
      },
      verb: {
        id: 'http://adlnet.gov/expapi/verbs/completed',
        display: { 'en-US': 'completed' }
      },
      object: {
        id: 'https://ais-reported-speech.app/module/grammar-conversion',
        definition: {
          name: { 'en-US': 'Reported Speech: Questions, Tenses & Punctuation' },
          description: { 'en-US': 'Interactive mastery in direct to reported speech conversions.' }
        }
      },
      result: {
        score: {
          scaled: accuracy,
          raw: progress.totalCorrect,
          min: 0,
          max: progress.totalExercisesCompleted
        },
        success: accuracy >= 0.75,
        completion: true,
        duration: `PT${progress.totalMinutesPracticed}M`
      }
    };
  },

  // Helper to trigger file download in browser
  downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
