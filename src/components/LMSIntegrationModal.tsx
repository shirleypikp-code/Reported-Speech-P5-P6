import React, { useState } from 'react';
import { UserProfile, UserProgress, LMSAssignment } from '../types';
import { LMSService, SAMPLE_ASSIGNMENT_CODES } from '../services/lmsService';
import { BookOpen, Download, Share2, Check, FileSpreadsheet, Code2, Sparkles, ExternalLink } from 'lucide-react';

interface LMSIntegrationModalProps {
  profile: UserProfile;
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
  onSelectAssignment: (assignment: LMSAssignment) => void;
}

export const LMSIntegrationModal: React.FC<LMSIntegrationModalProps> = ({
  profile,
  progress,
  isOpen,
  onClose,
  onSelectAssignment
}) => {
  const [activeTab, setActiveTab] = useState<'lms_export' | 'assignment_code'>('lms_export');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleDownloadGoogleClassroom = () => {
    const csv = LMSService.exportGoogleClassroomCSV(profile, progress);
    LMSService.downloadFile(`GoogleClassroom_ReportedSpeech_${profile.studentId}.csv`, csv, 'text/csv');
  };

  const handleDownloadCanvas = () => {
    const csv = LMSService.exportCanvasGradebookCSV(profile, progress);
    LMSService.downloadFile(`Canvas_Gradebook_ReportedSpeech_${profile.studentId}.csv`, csv, 'text/csv');
  };

  const handleDownloadMoodle = () => {
    const xml = LMSService.exportMoodleGradebookXML(profile, progress);
    LMSService.downloadFile(`Moodle_Grades_${profile.studentId}.xml`, xml, 'application/xml');
  };

  const handleDownloadSCORM = () => {
    const xapi = LMSService.exportXAPIStatement(profile, progress);
    LMSService.downloadFile(`xAPI_ActivityStatement_${profile.studentId}.json`, JSON.stringify(xapi, null, 2), 'application/json');
  };

  const handleCopyShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApplyAssignmentCode = () => {
    setCodeError('');
    const found = LMSService.findAssignment(enteredCode);
    if (found) {
      onSelectAssignment(found);
      onClose();
    } else {
      setCodeError('Assignment code not found. Please verify with your teacher.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Learning Management System (LMS)</h2>
              <p className="text-xs text-slate-500">Google Classroom, Canvas, Moodle & SCORM interoperability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Segmented Tab Controls (Strict anti-pill styling) */}
        <div className="mt-4 flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('lms_export')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'lms_export' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Export Gradebook & Sync
          </button>
          <button
            onClick={() => setActiveTab('assignment_code')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'assignment_code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Load Teacher Assignment Code
          </button>
        </div>

        {activeTab === 'lms_export' ? (
          <div className="mt-5 space-y-4">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Ready for Academic Submission:</strong>
                Export learner mastery records formatted specifically for school gradebooks and LMS importers.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Google Classroom */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900">Google Classroom</h3>
                    <span className="text-[10px] text-slate-500 font-medium">CSV Format</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Export student completion rates, accuracy percentage, and streak status.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={handleDownloadGoogleClassroom}
                    className="flex-1 py-1.5 px-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleCopyShareLink}
                    className="py-1.5 px-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                    title="Share Classroom link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Canvas LMS */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900">Canvas LMS</h3>
                    <span className="text-[10px] text-slate-500 font-medium">Gradebook CSV</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Itemized rubric columns for Question Inversions, Tense Shifts, and Punctuation.
                  </p>
                </div>
                <button
                  onClick={handleDownloadCanvas}
                  className="w-full py-1.5 px-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Download Canvas CSV
                </button>
              </div>

              {/* Moodle */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900">Moodle LMS</h3>
                    <span className="text-[10px] text-slate-500 font-medium">XML Gradebook</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Direct XML import compatible with Moodle Gradebook assessment entries.
                  </p>
                </div>
                <button
                  onClick={handleDownloadMoodle}
                  className="w-full py-1.5 px-2 border border-slate-200 bg-white text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Moodle XML
                </button>
              </div>

              {/* SCORM / xAPI */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-slate-900">SCORM & xAPI</h3>
                    <span className="text-[10px] text-slate-500 font-medium">Activity Statement</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    LRS statement recording verb completed, scaled score, and session duration.
                  </p>
                </div>
                <button
                  onClick={handleDownloadSCORM}
                  className="w-full py-1.5 px-2 border border-slate-200 bg-white text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Download xAPI JSON
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Enter Teacher Assignment Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. REP-OBJ1-QUEST"
                  value={enteredCode}
                  onChange={e => setEnteredCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleApplyAssignmentCode}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Load Assignment
                </button>
              </div>
              {codeError && <p className="text-xs text-rose-500 mt-1.5">{codeError}</p>}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Available Class Assignments
              </h4>
              <div className="space-y-2">
                {SAMPLE_ASSIGNMENT_CODES.map(a => (
                  <div
                    key={a.code}
                    onClick={() => {
                      onSelectAssignment(a);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {a.code}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">{a.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {a.assignedByTeacher} · Target: {a.minMasteryPercentage}% mastery
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">Start →</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
