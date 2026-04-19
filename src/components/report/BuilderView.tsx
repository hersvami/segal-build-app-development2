import { useState } from 'react';
import { ChevronDown, ChevronUp, Save, Plus, MessageSquare } from 'lucide-react';
import type { Variation, ChangeLogEntry } from '../../types/domain';
import { formatCurrency, generateId } from '../../utils/helpers';

type Props = {
  variation: Variation;
  onOHChange?: (pct: number) => void;
  onProfitChange?: (pct: number) => void;
  onContingencyChange?: (pct: number) => void;
  onSave?: () => void;
  onAddLog?: (entry: ChangeLogEntry) => void;
};

export function BuilderView({ variation, onOHChange, onProfitChange, onContingencyChange, onSave, onAddLog }: Props) {
  const [openScopes, setOpenScopes] = useState<Record<number, boolean>>({ 0: true });
  const [noteText, setNoteText] = useState('');
  const { pricing, scopes, changeLog = [] } = variation;

  const toggleScope = (i: number) => setOpenScopes(prev => ({ ...prev, [i]: !prev[i] }));

  const handleAddNote = () => {
    if (!noteText.trim() || !onAddLog) return;
    onAddLog({
      id: generateId(),
      action: 'note',
      timestamp: new Date().toISOString(),
      user: 'Builder',
      details: noteText.trim(),
    });
    setNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Pricing Controls */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Pricing Controls</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Overhead %</label>
            <input type="range" min={5} max={25} value={pricing.overheadPercent} onChange={e => onOHChange?.(Number(e.target.value))} className="w-full mt-1" />
            <div className="text-center font-bold text-blue-600">{pricing.overheadPercent}%</div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Profit %</label>
            <input type="range" min={5} max={30} value={pricing.profitPercent} onChange={e => onProfitChange?.(Number(e.target.value))} className="w-full mt-1" />
            <div className="text-center font-bold text-emerald-600">{pricing.profitPercent}%</div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Contingency %</label>
            <input type="range" min={0} max={20} value={pricing.contingencyPercent} onChange={e => onContingencyChange?.(Number(e.target.value))} className="w-full mt-1" />
            <div className="text-center font-bold text-amber-600">{pricing.contingencyPercent}%</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Trade Cost', value: pricing.tradeCost, color: 'text-slate-700' },
          { label: 'Overheads', value: pricing.overhead, color: 'text-blue-600' },
          { label: 'Profit', value: pricing.profit, color: 'text-emerald-600' },
          { label: 'GST', value: pricing.gst, color: 'text-amber-600' },
          { label: 'Client Total', value: pricing.totalIncGst, color: 'text-blue-800', bold: true },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className="text-xs text-slate-500 mb-1">{card.label}</div>
            <div className={`font-bold ${card.color} ${card.bold ? 'text-lg' : ''}`}>{formatCurrency(card.value)}</div>
          </div>
        ))}
      </div>

      {/* Profit Analysis */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <h4 className="font-semibold text-emerald-900 mb-2">Profit Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-emerald-600">True Cost:</span> <span className="font-bold">{formatCurrency(pricing.tradeCost + pricing.overhead)}</span></div>
          <div><span className="text-emerald-600">Your Profit:</span> <span className="font-bold">{formatCurrency(pricing.profit)}</span></div>
          <div><span className="text-emerald-600">Effective Margin:</span> <span className="font-bold">{pricing.clientTotal > 0 ? Math.round((pricing.profit / pricing.clientTotal) * 100) : 0}%</span></div>
        </div>
      </div>

      {/* Scopes */}
      {scopes.map((scope, i) => (
        <div key={scope.id} className="border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => toggleScope(i)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <div className="text-left">
                <span className="font-semibold text-slate-900">{scope.categoryLabel}</span>
                <p className="text-xs text-slate-500">{scope.description}</p>
              </div>
            </div>
            {openScopes[i] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          {openScopes[i] && (
            <div className="p-4 space-y-3">
              {scope.stages.length > 0 && (
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-slate-500">
                    <th className="pb-2">Stage</th><th className="pb-2">Trade</th><th className="pb-2 text-right">Cost</th><th className="pb-2">Duration</th>
                  </tr></thead>
                  <tbody>
                    {scope.stages.map((stage, si) => (
                      <tr key={si} className="border-b border-slate-100">
                        <td className="py-2 font-medium">{stage.name}</td>
                        <td className="py-2 text-slate-500">{stage.trade}</td>
                        <td className="py-2 text-right">{formatCurrency(stage.cost)}</td>
                        <td className="py-2 text-slate-500">{stage.duration}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {scope.pcItems.length > 0 && (
                <div><h5 className="font-medium text-sm mb-1">PC Items</h5>
                  {scope.pcItems.map(item => <div key={item.id} className="flex justify-between text-sm py-1"><span>{item.description}</span><span>{formatCurrency(item.allowance)} ({item.unit})</span></div>)}</div>
              )}
              {scope.inclusions.length > 0 && (
                <div><h5 className="font-medium text-sm text-emerald-700 mb-1">Inclusions</h5>
                  {scope.inclusions.map(inc => <div key={inc.id} className="text-sm text-emerald-600 py-0.5">✓ {inc.text}</div>)}</div>
              )}
              {scope.exclusions.length > 0 && (
                <div><h5 className="font-medium text-sm text-red-700 mb-1">Exclusions</h5>
                  {scope.exclusions.map(exc => <div key={exc.id} className="text-sm text-red-600 py-0.5">✗ {exc.text}</div>)}</div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Action Log */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-600" /> Action Log
        </h3>
        {changeLog.length > 0 ? (
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {changeLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 text-sm bg-white rounded-lg p-3 border border-slate-200">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${
                  entry.action === 'note' ? 'bg-blue-100 text-blue-700' :
                  entry.action === 'created' ? 'bg-emerald-100 text-emerald-700' :
                  entry.action === 'status_change' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>{entry.action}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800">{entry.details}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {entry.user} · {new Date(entry.timestamp).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 mb-4">No log entries yet. Add internal notes below.</p>
        )}
        <div className="flex gap-2">
          <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            placeholder="Add internal note..." className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleAddNote} disabled={!noteText.trim()} className="bg-slate-700 hover:bg-slate-800 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Plus className="w-4 h-4" /> Add Note
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button onClick={onSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
        <Save className="w-4 h-4" /> Save Pricing
      </button>
    </div>
  );
}