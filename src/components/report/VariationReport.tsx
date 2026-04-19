import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Eye, Settings, Send } from 'lucide-react';
import type { Variation, Project, Company } from '../../types/domain';
import { cn, formatCurrency } from '../../utils/helpers';
import { calculateQuote } from '../../utils/pricing/quoteCalculator';
import { BuilderView } from './BuilderView';
import { CustomerView } from './CustomerView';
import { ProgressHub } from './ProgressHub';
import { ReportSendModal } from './ReportSendModal';

type Props = {
  variation: Variation;
  project: Project;
  company: Company;
  onUpdate: (v: Variation) => void;
};

export function VariationReport({ variation, project, company, onUpdate }: Props) {
  const [tab, setTab] = useState<'builder' | 'customer' | 'progress'>('builder');
  const [collapsed, setCollapsed] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const v = variation;
  const pricing = v.pricing;

  const handleOHChange = (pct: number) => {
    const newPricing = calculateQuote(pricing.tradeCost, pct, pricing.profitPercent, pricing.contingencyPercent);
    onUpdate({ ...v, pricing: newPricing });
  };
  const handleProfitChange = (pct: number) => {
    const newPricing = calculateQuote(pricing.tradeCost, pricing.overheadPercent, pct, pricing.contingencyPercent);
    onUpdate({ ...v, pricing: newPricing });
  };
  const handleContingencyChange = (pct: number) => {
    const newPricing = calculateQuote(pricing.tradeCost, pricing.overheadPercent, pricing.profitPercent, pct);
    onUpdate({ ...v, pricing: newPricing });
  };

  const handleMarkSent = () => {
    onUpdate({ ...v, status: 'sent', updatedAt: new Date().toISOString() });
  };

  const isApproved = v.status === 'approved';
  const docType = v.documentType === 'quote' ? 'Quote' : 'Variation';

  return (
    <div className="space-y-4">
      {/* Report Header */}
      <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all', collapsed && 'rounded-b-xl')}>
        <div className="flex items-center justify-between p-4 hover:bg-slate-50">
          <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 flex-1">
            <span className={cn('px-2 py-1 rounded-lg text-xs font-bold',
              v.documentType === 'quote' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')}>
              {v.documentType === 'quote' ? 'QTE' : 'VAR'}
            </span>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">{v.title}</h3>
              <p className="text-xs text-slate-500">
                {v.source === 'external'
                  ? `External baseline (${v.externalQuoteRef?.referenceNumber || 'linked'}) — ${formatCurrency(pricing.totalIncGst)} inc GST`
                  : `${v.scopes.length} scope(s) — ${formatCurrency(pricing.totalIncGst)} inc GST`}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {/* Send to Customer Button */}
            {v.status !== 'approved' && v.source !== 'external' && (
              <button onClick={() => setShowSendModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-3.5 h-3.5" />
                Send {docType}
              </button>
            )}
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
              v.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
              v.status === 'sent' ? 'bg-blue-100 text-blue-800' :
              v.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600')}>
              {v.status}
            </span>
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="border-t border-slate-200">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-4">
              <button onClick={() => setTab('builder')} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                tab === 'builder' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700')}>
                <Settings className="w-4 h-4" /> Builder View
              </button>
              <button onClick={() => setTab('customer')} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                tab === 'customer' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700')}>
                <Eye className="w-4 h-4" /> Customer Preview
              </button>
              {isApproved && (
                <button onClick={() => setTab('progress')} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  tab === 'progress' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700')}>
                  <FileText className="w-4 h-4" /> Progress
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {tab === 'builder' && (
                <BuilderView variation={v} onOHChange={handleOHChange} onProfitChange={handleProfitChange} onContingencyChange={handleContingencyChange}
                  onSave={() => onUpdate({ ...v, updatedAt: new Date().toISOString() })}
                  onAddLog={(entry) => onUpdate({ ...v, changeLog: [...(v.changeLog || []), entry], updatedAt: new Date().toISOString() })} />
              )}
              {tab === 'customer' && (
                <CustomerView variation={v} project={project} company={company}
                  onApprove={() => onUpdate({ ...v, status: 'approved', updatedAt: new Date().toISOString() })}
                  onRevise={() => onUpdate({ ...v, status: 'rejected', updatedAt: new Date().toISOString() })}
                  onSend={() => setShowSendModal(true)} />
              )}
              {tab === 'progress' && isApproved && (
                <ProgressHub photos={v.progressPhotos} stages={v.progressStages}
                  onAddPhoto={(photo) => onUpdate({ ...v, progressPhotos: [...(v.progressPhotos || []), photo] })}
                  onUpdateStage={(name, status) => {
                    const stages = (v.progressStages || []).map(s => s.name === name ? { ...s, status } : s);
                    onUpdate({ ...v, progressStages: stages });
                  }} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <ReportSendModal
          variation={v}
          project={project}
          company={company}
          onClose={() => setShowSendModal(false)}
          onMarkSent={handleMarkSent}
        />
      )}
    </div>
  );
}