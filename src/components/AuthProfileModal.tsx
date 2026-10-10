import React, { useState } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { User, Shield, GraduationCap, Key, Check, Plus, Lock } from 'lucide-react';

interface AuthProfileModalProps {
  currentProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileChange: (profile: UserProfile) => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  currentProfile,
  isOpen,
  onClose,
  onProfileChange
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => StorageService.getAllProfiles());
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classGroup, setClassGroup] = useState('English B2 - Period 3');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [pin, setPin] = useState('');
  const [avatar, setAvatar] = useState('🎓');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [selectedProfileToSwitch, setSelectedProfileToSwitch] = useState<UserProfile | null>(null);

  if (!isOpen) return null;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      studentId: studentId.trim() || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar,
      role,
      classGroup: classGroup.trim(),
      passcodeHash: pin ? btoa(pin) : undefined,
      createdAt: Date.now()
    };

    StorageService.saveCurrentProfile(newProfile);
    setProfiles(StorageService.getAllProfiles());
    onProfileChange(newProfile);
    setIsCreatingNew(false);
    setName('');
    setStudentId('');
    setPin('');
    onClose();
  };

  const handleSelectProfile = (profile: UserProfile) => {
    if (profile.passcodeHash) {
      setSelectedProfileToSwitch(profile);
      setPinInput('');
      setPinError('');
    } else {
      StorageService.saveCurrentProfile(profile);
      onProfileChange(profile);
      onClose();
    }
  };

  const handleVerifyPin = () => {
    if (!selectedProfileToSwitch) return;
    if (btoa(pinInput) === selectedProfileToSwitch.passcodeHash) {
      StorageService.saveCurrentProfile(selectedProfileToSwitch);
      onProfileChange(selectedProfileToSwitch);
      setSelectedProfileToSwitch(null);
      onClose();
    } else {
      setPinError('Incorrect 4-digit passcode.');
    }
  };

  const avatarsList = ['🎓', '📚', '🦉', '💡', '🚀', '🌟', '✍️', '🦁'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Learner Authentication & Profiles</h2>
              <p className="text-xs text-slate-500">Secure cross-device profile & PIN protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        {selectedProfileToSwitch ? (
          <div className="py-6 space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-2xl mb-2">
                {selectedProfileToSwitch.avatar}
              </div>
              <h3 className="text-base font-bold text-slate-900">Unlock {selectedProfileToSwitch.name}</h3>
              <p className="text-xs text-slate-500">Enter the 4-digit PIN for this account</p>
            </div>
            <div>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="4-digit PIN"
                className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-500 text-center mt-1.5">{pinError}</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedProfileToSwitch(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerifyPin}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Unlock
              </button>
            </div>
          </div>
        ) : !isCreatingNew ? (
          <div className="py-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Learner</span>
                <span className="text-xs text-blue-600 font-medium">Logged in</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border-2 border-blue-500 bg-blue-50/40">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentProfile.avatar}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {currentProfile.name}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-200/70 text-blue-800">
                        {currentProfile.role}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">ID: {currentProfile.studentId} · {currentProfile.classGroup}</p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {profiles.length > 1 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Switch Accounts on this Device
                </span>
                <div className="space-y-2">
                  {profiles
                    .filter(p => p.id !== currentProfile.id)
                    .map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProfile(p)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{p.avatar}</span>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                              {p.name}
                              {p.passcodeHash && <Lock className="w-3 h-3 text-slate-400" />}
                            </div>
                            <div className="text-xs text-slate-500">{p.studentId} · {p.classGroup}</div>
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">Switch</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Student / Teacher Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateProfile} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Choose Avatar</label>
              <div className="flex gap-2">
                {avatarsList.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border cursor-pointer transition ${avatar === a ? 'border-blue-600 bg-blue-50 scale-105' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Code</label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-99"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Section / Group</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10 English"
                  value={classGroup}
                  onChange={e => setClassGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="student">Student Learner</option>
                  <option value="teacher">Teacher / Educator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional 4-Digit Passcode (PIN Protection)
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="Leave blank for quick access"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Useful when sharing tablets or school computer labs.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm"
              >
                Save & Start Learning
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
