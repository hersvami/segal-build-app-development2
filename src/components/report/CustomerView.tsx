import { useState } from 'react';
import type { Variation, Company, Project } from '../../types/domain';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Check, Building2, Send } from 'lucide-react';
import { CustomerScopeSection, CustomerProgressPhotos } from './CustomerViewParts';

type Props = {
  variation: Variation;
  project: Project;
  company: Company;
  onApprove?: () => void;
  onRevise?: () => void;
  onSend?: () => void;
};

export function CustomerView({ variation, project, company, onApprove, onRevise, onSend }: Props) {
  const { pricing, scopes } = variation;
  const isApproved = variation.status === 'approved';
  const [signName, setSignName] = useState('');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto print:shadow-none print:border-0">
      {/* Letterhead */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-14 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
              <p className="text-sm text-slate-500">ABN: {company.abn}</p>
              {company.licence && <p className="text-sm text-slate-500">{company.licence}</p>}
            </div>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>{company.phone}</p>
            <p>{company.email}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {variation.documentType === 'quote' ? 'QUOTATION' : `VARIATION ${variation.variationNumber || ''}`}
            </h2>
            <p className="text-sm text-slate-500">{variation.title}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium">Date: {formatDate(variation.createdAt)}</p>
            <p className="text-slate-500">Ref: {variation.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Client & Project Info */}
      <div className="grid grid-cols-2 gap-4 p-6 border-b border-slate-100 bg-slate-50">
        <div>
          <h3 className="text-xs uppercase text-slate-500 font-semibold mb-1">Client</h3>
          <p className="font-medium text-slate-900">{project.customer.name}</p>
          <p className="text-sm text-slate-500">{project.customer.email}</p>
          {project.customer.phone && <p className="text-sm text-slate-500">{project.customer.phone}</p>}
        </div>
        <div>
          <h3 className="text-xs uppercase text-slate-500 font-semibold mb-1">Project</h3>
          <p className="font-medium text-slate-900">{project.name}</p>
          <p className="text-sm text-slate-500">{project.address}</p>
        </div>
      </div>

      {/* Variation Reference */}
      {variation.documentType === 'variation' && variation.reasonForChange && (
        <div className="p-6 border-b border-slate-100 bg-amber-50">
          <h3 className="text-xs uppercase text-amber-700 font-semibold mb-1">Variation Details</h3>
          <p className="text-sm text-amber-900">Reason: <span className="font-medium">{variation.reasonForChange}</span></p>
          {variation.costImpact && (
            <p className="text-sm text-amber-900 mt-1">Cost Impact: <span className="font-medium capitalize">{variation.costImpact}</span></p>
          )}
        </div>
      )}

      {/* Scopes — extracted to CustomerScopeSection */}
      <div className="p-6 space-y-6">
        {scopes.map((scope, i) => (
          <CustomerScopeSection key={scope.id} scope={scope} index={i} />
        ))}

        {/* Pricing Totals */}
        <div className="border-t-2 border-slate-900 pt-4 space-y-1 max-w-xs ml-auto">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(pricing.clientTotal)}</span>
          </div>
          {pricing.contingency > 0 && (
            <div className="flex justify-between text-sm">
              <span>Contingency ({pricing.contingencyPercent}%)</span>
              <span>{formatCurrency(pricing.contingency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>GST (10%)</span>
            <span>{formatCurrency(pricing.gst)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-slate-900 pt-2">
            <span>Total Inc GST</span>
            <span>{formatCurrency(pricing.totalIncGst)}</span>
          </div>
        </div>
      </div>

      {/* ─── Progress Photos (visible to customer) ─── */}
      <CustomerProgressPhotos photos={variation.progressPhotos} />

      {/* Terms & Conditions */}
      <div className="border-t border-slate-200 p-6 bg-slate-50 text-xs text-slate-500 space-y-1">
        <h4 className="font-semibold text-slate-700 text-sm">Terms & Conditions</h4>
        <p>• Valid for 30 days from issue date. • PC items are allowances — actuals adjusted on final invoice.</p>
        <p>• Variations documented and priced separately. • Payment: 30% deposit, progress payments, balance on completion.</p>
        <p>• All work complies with BCA and Australian Standards.</p>
        <h4 className="font-semibold text-slate-700 text-sm pt-2">Workmanship Guarantee</h4>
        <p>• 6 years structural / 2 years non-structural warranty (Domestic Building Contracts Act 1995 Vic)</p>
      </div>

      {/* Send to Customer */}
      {onSend && !isApproved && (
        <div className="border-t border-slate-200 p-6">
          <button onClick={onSend}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
            <Send className="w-4 h-4" />
            Send {variation.documentType === 'quote' ? 'Quote' : 'Variation'} to Customer
          </button>
        </div>
      )}

      {/* Signature & Approval */}
      {!isApproved && (
        <div className="border-t border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Authorised Signature — Full Name</label>
            <input type="text" value={signName} onChange={(e) => setSignName(e.target.value)}
              placeholder="Enter your full name to sign"
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <p className="text-xs text-slate-400 mt-1">By signing, you accept the scope, pricing, and terms above.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onApprove} disabled={!signName.trim()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors">
              Approve & Sign
            </button>
            <button onClick={onRevise}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-medium transition-colors">
              Request Revised Quote
            </button>
          </div>
        </div>
      )}

      {isApproved && variation.signature && (
        <div className="border-t border-slate-200 p-6">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <div className="inline-flex items-center gap-2 text-emerald-800 font-medium mb-2">
              <Check className="w-5 h-5" /> Approved & Signed
            </div>
            <p className="text-sm text-emerald-700">Signed by: <span className="font-medium">{variation.signature.name}</span></p>
            <p className="text-xs text-emerald-600">Date: {formatDate(variation.signature.date)}</p>
          </div>
        </div>
      )}

      {isApproved && !variation.signature && (
        <div className="border-t border-slate-200 p-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-xl font-medium">
            <Check className="w-5 h-5" /> Approved
          </div>
        </div>
      )}
    </div>
  );
}