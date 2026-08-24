import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  User,
  ZoomIn,
  Check,
  ShieldAlert,
} from 'lucide-react';
import {
  DEFAULT_AVATAR_COLLECTION,
  getDefaultAvatarForUser,
  validateAvatarFile,
  processAndCompressImage,
} from '../../utils/avatars';

interface ProfilePictureModalProps {
  isOpen: boolean;
  currentAvatar?: string;
  userName?: string;
  userEmail?: string;
  onClose: () => void;
  onSaveAvatar: (newAvatarUrl: string) => void;
  title?: string;
  subtitle?: string;
}

export const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  currentAvatar,
  userName = 'Traveler',
  userEmail = 'user@voyagego.com',
  onClose,
  onSaveAvatar,
  title = 'Manage Profile Picture',
  subtitle = 'Upload a custom photo or choose from our curated travel avatar collection.',
}) => {
  const defaultFallback = getDefaultAvatarForUser(userEmail || userName);
  const initialAvatar = currentAvatar || defaultFallback;

  const [selectedAvatar, setSelectedAvatar] = useState<string>(initialAvatar);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      const compressedDataUrl = await processAndCompressImage(file, 400, 400);
      setSelectedAvatar(compressedDataUrl);
      setSuccessMessage('Photo uploaded successfully! Preview your image below.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process profile photo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    try {
      setIsUploading(true);
      const compressedDataUrl = await processAndCompressImage(file, 400, 400);
      setSelectedAvatar(compressedDataUrl);
      setSuccessMessage('Photo uploaded and cropped successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process dropped photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleResetToDefault = () => {
    const randomDefault = getDefaultAvatarForUser(`${userEmail}_${Date.now()}`);
    setSelectedAvatar(randomDefault);
    setSuccessMessage('Reverted to assigned default avatar.');
    setErrorMessage(null);
  };

  const handleConfirmSave = () => {
    onSaveAvatar(selectedAvatar);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{title}</h3>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Active Preview & Crop Control Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              <div
                className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-orange-500/30 shadow-md bg-white flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${previewZoom})` }}
              >
                <img
                  src={selectedAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 right-0 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                PREVIEW
              </span>
            </div>

            <div className="flex-1 space-y-3 w-full text-center md:text-left">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{userName}</h4>
                <p className="text-xs text-slate-500 font-medium">{userEmail}</p>
              </div>

              {/* Upload Drag & Drop Box */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white hover:bg-orange-50/50 p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-3 text-slate-600 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />
                <Upload className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">
                    {isUploading ? 'Processing Image...' : 'Click or Drop Custom Photo Here'}
                  </p>
                  <p className="text-[10px] text-slate-400">JPG, PNG, WebP • Max 5 MB</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Remove Photo (Reset)</span>
                </button>

                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <ZoomIn className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[10px] font-bold">Zoom:</span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(Math.max(0.9, previewZoom - 0.1))}
                    className="px-1.5 font-bold hover:bg-slate-100 rounded"
                  >
                    -
                  </button>
                  <span className="font-mono text-[11px]">{Math.round(previewZoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(Math.min(1.3, previewZoom + 0.1))}
                    className="px-1.5 font-bold hover:bg-slate-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Avatars Gallery */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Or Choose from Modern Avatars Collection
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">18 Preset Options</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {DEFAULT_AVATAR_COLLECTION.map((avatar) => {
                const isSelected = selectedAvatar === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(avatar.url);
                      setSuccessMessage(`Selected '${avatar.name}' default avatar.`);
                      setErrorMessage(null);
                    }}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-md scale-105'
                        : 'border-slate-200 hover:border-slate-300 hover:scale-102'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-full h-16 object-cover rounded-xl"
                    />
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    <span className="block text-[9px] font-bold text-slate-600 truncate mt-1 text-center">
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSave}
            className="py-2.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Profile Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
