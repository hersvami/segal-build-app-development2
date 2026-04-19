import { useState } from 'react';
import { X, Mail, MessageSquare, Phone, Copy, Check, Send, ExternalLink } from 'lucide-react';
import type { Project, Variation, Company } from '../../types/domain';
import { formatCurrency } from '../../utils/helpers';

type Props = {
  variation: Variation;
  project: Project;
  company: Company;
  onClose: () => void;
  onMarkSent: () => void;
};

type Channel = 'email' | 'sms';

export function ReportSendModal({ variation, project, company, onClose, onMarkSent }: Props) {
  const [channel, setChannel] = useState<Channel>('email');
  const [copied, setCopied] = useState(false);

  const docType = variation.documentType === 'quote' ? 'Quotation' : 'Variation';
  const docRef = variation.documentType === 'quote'
    ? `QTE-${String((variation as any).quoteNumber || 1).padStart(3, '0')}`
    : `VAR-${variation.variationNumber || '001'}`;
  const customerName = project.customer.name.split(' ')[0];
  const portalUrl = `https://segal-build-app.web.app/portal/${project.id}`;
  const total = formatCurrency(variation.pricing.totalIncGst);
  const scopeCount = variation.scopes.length;
  const scopeSummary = variation.scopes.map(s => s.categoryLabel).join(', ');

  // Professional email body
  const emailSubject = `${docType} ${docRef} — ${project.name} | ${company.name}`;
  const emailBody = [
    `Dear ${project.customer.name},`,
    '',
    `Thank you for the opportunity to provide this ${docType.toLowerCase()} for your project at ${project.address}.`,
    '',
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `${docType.toUpperCase()} DETAILS`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `Reference: ${docRef}`,
    `Project: ${project.name}`,
    `Site Address: ${project.address}`,
    `Scope: ${scopeSummary}`,
    `${scopeCount} scope item(s)`,
    '',
    `Total (inc GST): ${total}`,
    '',
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `VIEW YOUR ${docType.toUpperCase()}`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    '',
    `You can view, download and approve your ${docType.toLowerCase()} through your secure project portal:`,
    '',
    `🔗 ${portalUrl}`,
    '',
    `Through your portal you can:`,
    `  ✓ View and download your ${docType.toLowerCase()} as a professional document`,
    `  ✓ Review the full scope of works and pricing breakdown`,
    `  ✓ Approve the ${docType.toLowerCase()} with a digital signature`,
    `  ✓ Request revisions if anything needs adjusting`,
    `  ✓ Track project progress and view site photos`,
    `  ✓ Communicate directly with our team`,
    '',
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `WHAT HAPPENS NEXT`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    '',
    `1. Review the ${docType.toLowerCase()} at your convenience`,
    `2. If you're happy, approve it through the portal`,
    `3. We'll confirm your approval and arrange a start date`,
    `4. If you have any questions, reply to this message or call us`,
    '',
    `We appreciate your trust in ${company.name} and look forward to delivering exceptional results for your project.`,
    '',
    `Kind regards,`,
    '',
    `${company.name}`,
    `${company.licence ? `Licence: ${company.licence}` : ''}`,
    `ABN: ${company.abn}`,
    `📞 ${company.phone}`,
    `✉️ ${company.email}`,
  ].join('\n');

  // Shorter SMS/WhatsApp message
  const smsBody = [
    `Hi ${customerName} 👋`,
    '',
    `Your ${docType.toLowerCase()} for ${project.name} is ready!`,
    '',
    `📋 Ref: ${docRef}`,
    `📍 ${project.address}`,
    `💰 Total: ${total} (inc GST)`,
    `🔨 Scope: ${scopeSummary}`,
    '',
    `View, download & approve your ${docType.toLowerCase()} here:`,
    `🔗 ${portalUrl}`,
    '',
    `Questions? Call ${company.phone} or reply to this message.`,
    '',
    `— ${company.name}`,
  ].join('\n');

  const phone = project.customer.phone?.replace(/^0/, '+61').replace(/\s/g, '') || '';

  const handleGmail = () => {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(project.customer.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(url, '_blank');
  };

  const handleMailApp = () => {
    window.location.href = `mailto:${project.customer.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleCopy = () => {
    const text = channel === 'email'
      ? `Subject: ${emailSubject}\n\n${emailBody}`
      : smsBody;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(smsBody)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    window.location.href = `sms:${phone}?body=${encodeURIComponent(smsBody)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              Send {docType} to Customer
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {docRef} — {total} inc GST
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Tabs */}
        <div className="flex border-b border-slate-200">
          <button onClick={() => setChannel('email')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              channel === 'email' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            <Mail className="w-4 h-4" /> Email
          </button>
          <button onClick={() => setChannel('sms')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              channel === 'sms' ? 'text-green-600 border-green-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            <MessageSquare className="w-4 h-4" /> SMS / WhatsApp
          </button>
        </div>

        {/* Message Preview */}
        <div className="flex-1 overflow-auto p-4">
          <div className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
            {channel === 'email' ? 'Email' : 'SMS / WhatsApp'} Preview
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-auto">
            {channel === 'email' ? emailBody : smsBody}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Customer: {project.customer.name} | {project.customer.email}
            {project.customer.phone ? ` | ${project.customer.phone}` : ''}
          </p>
        </div>

        {/* Send Buttons */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          {channel === 'email' ? (
            <>
              <button onClick={handleGmail}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 font-medium transition-colors">
                <Mail className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Open in Gmail</div>
                  <div className="text-xs text-red-500">Compose in Gmail web client</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </button>
              <button onClick={handleMailApp}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium transition-colors">
                <Mail className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Open in Mail App</div>
                  <div className="text-xs text-blue-500">Uses your default email client</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </button>
            </>
          ) : (
            <>
              <button onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 font-medium transition-colors">
                <MessageSquare className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Send via WhatsApp</div>
                  <div className="text-xs text-green-500">Opens WhatsApp with message</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </button>
              <button onClick={handleSMS}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 font-medium transition-colors">
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Send via SMS</div>
                  <div className="text-xs text-purple-500">Opens native messaging app</div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </button>
            </>
          )}

          {/* Copy always visible */}
          <button onClick={handleCopy}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 font-medium transition-colors">
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            <div className="text-left">
              <div className="font-semibold">{copied ? 'Copied!' : 'Copy to Clipboard'}</div>
              <div className="text-xs text-slate-500">Paste into any app</div>
            </div>
          </button>

          {/* Mark as Sent */}
          <button onClick={() => { onMarkSent(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-colors mt-3">
            <Check className="w-4 h-4" /> Mark as Sent
          </button>
        </div>
      </div>
    </div>
  );
}