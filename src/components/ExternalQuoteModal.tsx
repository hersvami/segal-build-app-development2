import { useState } from 'react';
import { X } from 'lucide-react';
import type { ExternalQuoteReference } from '../types/domain';

type Props = {
  onCancel: () => void;
  onSubmit: (payload: ExternalQuoteReference) => void;
};

export function ExternalQuoteModal({ onCancel, onSubmit }: Props) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [originalQuoteDate, setOriginalQuoteDate] = useState('');
  const [originalApprovedAmount, setOriginalApprovedAmount] = useState('');
  const [summaryScope, setSummaryScope] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit =
    referenceNumber.trim().length > 0 &&
    originalQuoteDate.trim().length > 0 &&
    Number(originalApprovedAmount) > 0 &&
    summaryScope.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Link External Quote</h2>
            <p className="text-sm text-slate-500">Create an approved baseline so you can issue a new variation.</p>
          </div>
          <button onClick={onCancel} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Reference Number</span>
            <input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="e.g. EXT-2026-014"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Original Quote Date</span>
            <input
              type="date"
              value={originalQuoteDate}
              onChange={(e) => setOriginalQuoteDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Original Approved Amount (AUD)</span>
            <input
              type="number"
              min="0"
              value={originalApprovedAmount}
              onChange={(e) => setOriginalApprovedAmount(e.target.value)}
              placeholder="e.g. 48500"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Original Scope Summary</span>
            <textarea
              value={summaryScope}
              onChange={(e) => setSummaryScope(e.target.value)}
              rows={3}
              placeholder="Short summary of works from the external quote"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Notes (Optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-5">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() =>
              onSubmit({
                referenceNumber: referenceNumber.trim(),
                originalQuoteDate,
                originalApprovedAmount: Number(originalApprovedAmount),
                summaryScope: summaryScope.trim(),
                notes: notes.trim() || undefined,
              })
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Save External Baseline
          </button>
        </div>
      </div>
    </div>
  );
}
