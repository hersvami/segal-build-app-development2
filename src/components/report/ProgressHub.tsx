import { useState } from 'react';
import { Camera, Copy, Check, ArrowRight, Phone, MessageCircle, Mail } from 'lucide-react';
import { cn } from '../../utils/helpers';
import type { ProgressPhoto, ProgressStage } from '../../types/domain';

type Props = {
  photos?: ProgressPhoto[];
  stages?: ProgressStage[];
  onAddPhoto?: (photo: ProgressPhoto) => void;
  onUpdateStage?: (name: string, status: ProgressStage['status']) => void;
};

export function ProgressHub({ photos: initialPhotos = [], stages: initialStages = [], onAddPhoto, onUpdateStage }: Props) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [stages, setStages] = useState<ProgressStage[]>(initialStages.length > 0 ? initialStages : [
    { name: 'Demolition', status: 'complete' }, { name: 'Rough-in', status: 'in-progress' },
    { name: 'Fit-off', status: 'not-started' }, { name: 'Finishes', status: 'not-started' },
  ]);
  const [activeTab, setActiveTab] = useState<'photos' | 'tracker' | 'update'>('photos');
  const [caption, setCaption] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const overallProgress = Math.round((stages.filter(s => s.status === 'complete').length / stages.length) * 100);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const photo = { id: Date.now().toString(), url, caption, stage: stages.find(s => s.status === 'in-progress')?.name || '', date: new Date().toISOString() };
    setPhotos(prev => [...prev, photo]);
    onAddPhoto?.(photo);
    setCaption('');
  };

  const cycleStage = (name: string) => {
    const cycle: ProgressStage['status'][] = ['not-started', 'in-progress', 'complete'];
    const stage = stages.find(s => s.name === name);
    if (!stage) return;
    const next = cycle[(cycle.indexOf(stage.status) + 1) % 3];
    setStages(prev => prev.map(s => s.name === name ? { ...s, status: next } : s));
    onUpdateStage?.(name, next);
  };

  const generateUpdate = () => {
    const done = stages.filter(s => s.status === 'complete').map(s => s.name);
    const active = stages.filter(s => s.status === 'in-progress').map(s => s.name);
    setUpdateMsg(`Hi! Quick update on your project:\n\n✅ Completed: ${done.join(', ') || 'None yet'}\n🔧 In Progress: ${active.join(', ') || 'None'}\n📊 Overall: ${overallProgress}% complete\n\nWe'll keep you posted on the next steps!`);
  };

  const copyUpdate = () => {
    navigator.clipboard.writeText(updateMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(['photos', 'tracker', 'update'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('flex-1 py-3 text-sm font-medium capitalize transition-colors',
              activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700')}>
            {tab === 'photos' ? '📸 Progress Photos' : tab === 'tracker' ? '📊 Stage Tracker' : '📤 Send Update'}
          </button>
        ))}
      </div>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
              <Camera className="w-4 h-4" /> Upload Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map(p => (
              <div key={p.id} className="relative group rounded-xl overflow-hidden bg-slate-100 aspect-square">
                <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs">{p.caption}</p>
                  <p className="text-white/70 text-xs">{new Date(p.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {photos.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">No photos yet. Upload progress photos above.</div>}
          </div>
        </div>
      )}

      {/* Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="text-sm text-slate-500 text-center">{overallProgress}% Complete</p>
          <div className="space-y-2">
            {stages.map(stage => (
              <button key={stage.name} onClick={() => cycleStage(stage.name)}
                className={cn('w-full flex items-center justify-between p-3 rounded-xl border transition-colors text-left',
                  stage.status === 'complete' ? 'bg-emerald-50 border-emerald-200' :
                  stage.status === 'in-progress' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200')}>
                <span className="font-medium text-sm">{stage.name}</span>
                <span className={cn('text-xs px-2 py-1 rounded-full',
                  stage.status === 'complete' ? 'bg-emerald-200 text-emerald-800' :
                  stage.status === 'in-progress' ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600')}>
                  {stage.status === 'complete' ? '✓ Complete' : stage.status === 'in-progress' ? '🔧 In Progress' : 'Not Started'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Update Tab */}
      {activeTab === 'update' && (
        <div className="space-y-4">
          <button onClick={generateUpdate} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Auto-generate update message
          </button>
          <textarea value={updateMsg} onChange={e => setUpdateMsg(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex flex-wrap gap-2">
            <button onClick={copyUpdate} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy'}
            </button>
            <a href={`sms:?body=${encodeURIComponent(updateMsg)}`} className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium text-blue-800">
              <Phone className="w-4 h-4" /> SMS
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(updateMsg)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-medium text-emerald-800">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`mailto:?subject=Project Update&body=${encodeURIComponent(updateMsg)}`} className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg text-sm font-medium text-amber-800">
              <Mail className="w-4 h-4" /> Email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}