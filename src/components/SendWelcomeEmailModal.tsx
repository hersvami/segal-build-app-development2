import { useState } from 'react';
import { X, Mail, Copy, Check, SkipForward, MessageCircle, Phone } from 'lucide-react';
import type { Company } from '../types/domain';
import {
  generateTempPassword,
  formatPhoneForWhatsApp,
  formatPhoneForLink,
  buildEmailBody,
  buildSmsBody,
  getEmailSubject,
} from './welcomeMessages';

type Props = {
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: Company;
  onClose: () => void;
};

export function SendWelcomeEmailModal({
  projectName,
  customerName,
  customerEmail,
  customerPhone,
  company,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');

  const tempPassword = generateTempPassword();
  const emailBody = buildEmailBody(customerName, projectName, customerEmail, tempPassword, company);
  const smsBody = buildSmsBody(customerName, projectName, customerEmail, tempPassword, company);

  const subject = encodeURIComponent(getEmailSubject(projectName, company));
  const encodedEmailBody = encodeURIComponent(emailBody);
  const encodedSmsBody = encodeURIComponent(smsBody);

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${customerEmail}&su=${subject}&body=${encodedEmailBody}`;
  const mailtoLink = `mailto:${customerEmail}?subject=${subject}&body=${encodedEmailBody}`;

  const cleanPhone = formatPhoneForLink(customerPhone);
  const whatsappPhone = formatPhoneForWhatsApp(customerPhone);
  const smsLink = `sms:${cleanPhone}?body=${encodedSmsBody}`;
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodedSmsBody}`;

  const hasPhone = !!customerPhone.trim();
  const hasEmail = !!customerEmail.trim();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send Welcome Message</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Send portal login & project details to {customerName || 'your customer'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'email'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-1.5" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              activeTab === 'sms'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-1.5" />
            SMS / WhatsApp
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Portal Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              🔐 Customer Portal Access Included
            </h3>
            <p className="text-xs text-blue-700">
              Your customer will receive their login details and can view & download
              their quotation, approve documents, and track project progress online.
            </p>
            <p className="text-xs text-blue-600 mt-1 font-mono">
              Temp password: {tempPassword}
            </p>
          </div>

          {/* Message Preview */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
              {activeTab === 'email' ? 'Email Preview' : 'Message Preview'}
            </h3>
            <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {activeTab === 'email' ? emailBody : smsBody}
              </pre>
            </div>
          </div>

          {/* EMAIL ACTIONS */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              {hasEmail ? (
                <>
                  <ChannelButton
                    href={gmailLink}
                    icon={<Mail className="w-5 h-5 text-red-600" />}
                    label="Open in Gmail"
                    desc="Compose in Gmail web client"
                    bgColor="bg-red-50 hover:bg-red-100"
                    iconBg="bg-red-100"
                    labelColor="text-red-900"
                    descColor="text-red-600"
                  />
                  <ChannelButton
                    href={mailtoLink}
                    icon={<Mail className="w-5 h-5 text-blue-600" />}
                    label="Open in Mail App"
                    desc="Uses your default email client"
                    bgColor="bg-blue-50 hover:bg-blue-100"
                    iconBg="bg-blue-100"
                    labelColor="text-blue-900"
                    descColor="text-blue-600"
                  />
                </>
              ) : (
                <NoContactWarning type="email" />
              )}
              <CopyButton
                copied={copied}
                onClick={() => copyToClipboard(
                  `Subject: ${getEmailSubject(projectName, company)}\nTo: ${customerEmail}\n\n${emailBody}`
                )}
                label="Copy Email to Clipboard"
              />
            </div>
          )}

          {/* SMS / WHATSAPP ACTIONS */}
          {activeTab === 'sms' && (
            <div className="space-y-3">
              {hasPhone ? (
                <>
                  <ChannelButton
                    href={whatsappLink}
                    icon={<MessageCircle className="w-5 h-5 text-green-600" />}
                    label="Send via WhatsApp"
                    desc={`Opens WhatsApp to ${customerPhone}`}
                    bgColor="bg-green-50 hover:bg-green-100"
                    iconBg="bg-green-100"
                    labelColor="text-green-900"
                    descColor="text-green-600"
                  />
                  <ChannelButton
                    href={smsLink}
                    icon={<Phone className="w-5 h-5 text-purple-600" />}
                    label="Send via SMS"
                    desc={`Opens messaging app to ${customerPhone}`}
                    bgColor="bg-purple-50 hover:bg-purple-100"
                    iconBg="bg-purple-100"
                    labelColor="text-purple-900"
                    descColor="text-purple-600"
                  />
                </>
              ) : (
                <NoContactWarning type="phone" />
              )}
              <CopyButton
                copied={copied}
                onClick={() => copyToClipboard(smsBody)}
                label="Copy Message to Clipboard"
              />
            </div>
          )}

          {/* Skip */}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function ChannelButton({ href, icon, label, desc, bgColor, iconBg, labelColor, descColor }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  bgColor: string;
  iconBg: string;
  labelColor: string;
  descColor: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-4 ${bgColor} rounded-xl transition-colors cursor-pointer`}
    >
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className={`font-medium ${labelColor}`}>{label}</div>
        <div className={`text-xs ${descColor}`}>{desc}</div>
      </div>
    </a>
  );
}

function CopyButton({ copied, onClick, label }: {
  copied: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
    >
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
        {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-slate-600" />}
      </div>
      <div className="text-left">
        <div className="font-medium text-slate-900">{copied ? 'Copied!' : label}</div>
        <div className="text-xs text-slate-500">Paste into any app</div>
      </div>
    </button>
  );
}

function NoContactWarning({ type }: { type: 'email' | 'phone' }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
      <p className="text-sm text-amber-800">
        No {type === 'email' ? 'email address' : 'phone number'} provided.
        Add customer {type} to use this option.
      </p>
    </div>
  );
}