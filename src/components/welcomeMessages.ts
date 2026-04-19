import type { Company } from '../types/domain';

const PORTAL_URL = 'https://segal-build-app.web.app/portal';

export function generateTempPassword(): string {
  return `SB-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

export function formatPhoneForWhatsApp(phone: string): string {
  const clean = phone.replace(/[\s\-()]/g, '');
  return clean.startsWith('0') ? '61' + clean.slice(1) : clean;
}

export function formatPhoneForLink(phone: string): string {
  return phone.replace(/[\s\-()]/g, '');
}

export function buildEmailBody(
  customerName: string,
  projectName: string,
  customerEmail: string,
  tempPassword: string,
  company: Company
): string {
  const name = customerName || 'Valued Client';
  const licence = company.licence ? `  |  ${company.licence}` : '';

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${company.name}
  ABN: ${company.abn}${licence}
  📞 ${company.phone}  |  📧 ${company.email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${name},

Thank you for choosing ${company.name}. We're delighted to welcome you and look forward to bringing your project to life.

Your project "${projectName}" has been created in our system and we're ready to begin preparing your detailed quotation.


YOUR PROJECT
─────────────
  📋  Project:   ${projectName}
  👤  Client:    ${name}
  📧  Email:     ${customerEmail}


YOUR ONLINE PORTAL
──────────────────
We've set up a personal online portal where you can manage everything related to your project — from viewing and downloading your quotation, to approving work and tracking progress.

  🌐  Portal:     ${PORTAL_URL}
  📧  Login:      ${customerEmail}
  🔑  Password:   ${tempPassword}

Please log in and update your password on your first visit.


WHAT HAPPENS NEXT
─────────────────
  1.  We'll conduct a thorough assessment of your requirements
  2.  A detailed quotation will be prepared and sent to your portal
  3.  You'll receive a notification when it's ready to view
  4.  Review the quotation, then approve or request changes — all online
  5.  Once approved, we'll schedule the works and keep you updated every step of the way


THROUGH YOUR PORTAL YOU CAN
────────────────────────────
  ✓  View and download your quotation or variation documents
  ✓  Review a full breakdown of the scope of works
  ✓  Approve quotes with a digital signature
  ✓  Request a revised quotation if anything needs adjusting
  ✓  Track variations and any changes to the original scope
  ✓  View progress photos and stage-by-stage updates
  ✓  Communicate directly with your project team


We pride ourselves on transparency, quality workmanship, and keeping you informed throughout every stage of your project.

If you have any questions at all, please don't hesitate to get in touch:

  📞  ${company.phone}
  📧  ${company.email}

We look forward to delivering an outstanding result for you.


Warm regards,

${company.name}
ABN: ${company.abn}${company.licence ? `\n${company.licence}` : ''}
${company.phone}  |  ${company.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message from ${company.name}.
Please do not reply directly to this message.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`.trim();
}

export function buildSmsBody(
  customerName: string,
  projectName: string,
  customerEmail: string,
  tempPassword: string,
  company: Company
): string {
  const name = customerName || 'there';

  return `Hi ${name} 👋

Thank you for choosing ${company.name}!

Your project "${projectName}" is all set up. We've created a personal portal for you to view and download your quotation, track progress, and approve works online.

🌐 Portal: ${PORTAL_URL}
📧 Login: ${customerEmail}
🔑 Password: ${tempPassword}

What's next:
• We'll prepare your detailed quotation
• You'll be notified when it's ready to view
• Review, approve, or request changes — all online
• Track progress photos and updates anytime

Questions? Call ${company.phone} or email ${company.email}

— ${company.name}`.trim();
}

export function getEmailSubject(projectName: string, company: Company): string {
  return `Welcome to Your Project — ${projectName} | ${company.name}`;
}
