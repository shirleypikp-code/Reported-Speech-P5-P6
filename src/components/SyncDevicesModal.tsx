import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { RefreshCw, Copy, Check, Upload, Download, ArrowRight, Laptop, Smartphone } from 'lucide-react';
import { UserProfile } from '../types';

interface SyncDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncCompleted: (profile: UserProfile) => void;
}

export const SyncDevicesModal: React.FC<SyncDevicesModalProps> = ({
  isOpen,
  onClose,
  onSyncCompleted
}) => {
  const [copied, setCopied] = useState(false);
  const [pasteBundle, setPasteBundle] = useState('');
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const currentBundle = StorageService.generateSyncBundle();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentBundle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBackup = () => {
    const profile = StorageService.getCurrentProfile();
    const progress = StorageService.getUserProgress(profile.id);
    const data = JSON.stringify({ profile, progress, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reported_speech_backup_${profile.studentId || 'learner'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImportBundle = () => {
    if (!pasteBundle.trim()) return;
    const res = StorageService.importSyncBundle(pasteBundle.trim());
    if (res.success && res.profile) {
      setSyncStatus({ type: 'success', message: res.message });
      setTimeout(() => {
        onSyncCompleted(res.profile!);
        onClose();
      }, 1200);
    } else {
      setSyncStatus({ type: 'error', message: res.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Could be raw JSON or base64 bundle
        let bundleStr = text;
        if (text.startsWith('{')) {
          bundleStr = btoa(unescape(encodeURIComponent(text)));
        }
        const res = StorageService.importSyncBundle(bundleStr);
        if (res.success && res.profile) {
          setSyncStatus({ type: 'success', message: res.message });
          setTimeout(() => {
            onSyncCompleted(res.profile!);
            onClose();
          }, 1200);
        } else {
          setSyncStatus({ type: 'error', message: res.message });
        }
      } catch (err: any) {
        setSyncStatus({ type: 'error', message: 'Invalid backup file format' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cross-Platform Device Sync</h2>
              <p className="text-xs text-slate-500">Transfer progress across Chromebooks, tablets & phones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {syncStatus && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold ${
              syncStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {syncStatus.message}
          </div>
        )}

        <div className="mt-5 space-y-6">
          {/* Visual Device Sync Path */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-around text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-1">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Laptop / Desktop</span>
            </div>
            <div className="flex items-center gap-1 text-indigo-500">
              <span className="h-0.5 w-6 bg-indigo-300" />
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-1">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Mobile / Tablet</span>
            </div>
          </div>

          {/* Export section */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              1. Export This Device's Progress Passkey
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              Copy this portable passkey and paste it into the sync box on your other device.
            </p>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={currentBundle}
                className="w-full px-3 py-2 pr-24 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 bg-slate-50 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Key'}
              </button>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Or download offline JSON backup file
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              2. Import & Merge From Another Device
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              Paste the passkey from your other device to synchronize your streak and mastery scores.
            </p>
            <textarea
              rows={3}
              value={pasteBundle}
              onChange={e => setPasteBundle(e.target.value)}
              placeholder="Paste sync passkey here..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2 mt-2">
              <label className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center cursor-pointer flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                Upload JSON File
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={handleImportBundle}
                disabled={!pasteBundle.trim()}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Synchronize Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
