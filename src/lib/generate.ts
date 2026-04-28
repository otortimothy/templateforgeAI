import { TemplateType } from './templates';

// ── Mock AI Template Generation ────────────────────────────────────────────
// In Phase 2, replace the return of `generateTemplate` with a real API call
// to OpenRouter, Gemini, or another LLM provider.

export interface GeneratedTemplate {
  id: string;
  type: TemplateType;
  title: string;
  html: string;
  createdAt: string;
  formData: Record<string, string>;
}

function today(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Individual generators ─────────────────────────────────────────────────

function generateResume(data: Record<string, string>): string {
  const skills = data.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const workLines = data.workHistory?.split('\n').filter(Boolean) || [];

  // Randomly select a color palette
  const palettes = [
    { name: 'Navy', primary: '#1e3a8a', heading: '#0f172a', body: '#334155', accent: '#3b82f6' },
    { name: 'Forest', primary: '#166534', heading: '#064e3b', body: '#1f2937', accent: '#22c55e' },
    { name: 'Burgundy', primary: '#7f1d1d', heading: '#450a0a', body: '#374151', accent: '#ef4444' },
    { name: 'Charcoal', primary: '#334155', heading: '#0f172a', body: '#475569', accent: '#64748b' },
    { name: 'Rust', primary: '#8c421b', heading: '#27272a', body: '#3f3f46', accent: '#f97316' }
  ];
  const theme = palettes[Math.floor(Math.random() * palettes.length)];
  
  // Randomly select a layout structure
  const layoutStyle = Math.floor(Math.random() * 3); // 0 = Classic 2-Col, 1 = Modern Header 1-Col, 2 = Minimalist
  
  if (layoutStyle === 0) {
    // CLASSIC 2-COLUMN
    return `
    <div class="template-output" style="max-width:800px; margin:0 auto; background:#fff; font-family:'Inter',sans-serif; color:${theme.body}; border:1px solid #e2e8f0; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      <div style="padding: 40px; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 800; color: ${theme.heading}; margin: 0 0 8px;">${data.fullName || 'Your Name'}</h1>
        <p style="font-size: 18px; color: ${theme.body}; margin: 0 0 20px;">${data.jobTitle || 'Professional Title'}</p>
        <div style="display: flex; justify-content: center; gap: 16px; font-size: 13px; color: ${theme.heading}; flex-wrap: wrap;">
          ${data.email ? `<span>Email: ${data.email}</span>` : ''} ${data.phone ? `<span>| Phone: ${data.phone}</span>` : ''}
        </div>
      </div>
      <div style="display: flex; flex: 1;">
        <div style="width: 32%; background-color: ${theme.primary}; color: white; padding: 32px 24px;">
          <h2 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 16px;">Technical Skills</h2>
          <ul style="list-style-type: disc; margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.8;">
            ${skills.map(skill => `<li style="margin-bottom:4px;">${skill}</li>`).join('') || '<li>Add your skills here</li>'}
          </ul>
          ${data.education ? `<div style="margin-top: 32px;">
            <h2 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; margin-bottom: 16px;">Education</h2>
            <p style="font-size: 14px; line-height: 1.6;">${data.education}</p>
          </div>` : ''}
        </div>
        <div style="width: 68%; background-color: #ffffff; padding: 32px 32px 32px 24px;">
          <div style="margin-bottom: 32px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${theme.heading}; margin-bottom: 12px;">Professional Summary</h2>
            <p style="font-size: 14px; line-height: 1.6; margin: 0;">${data.summary || 'Summary placeholder.'}</p>
          </div>
          <div style="margin-bottom: 32px;">
            <h2 style="font-size: 20px; font-weight: 700; color: ${theme.heading}; margin-bottom: 16px;">Professional Experience</h2>
            <div style="display: flex; flex-direction: column; gap: 24px;">
              ${workLines.map((line, i) => {
                const parts = line.split('|').map(p => p.trim());
                return `<div>
                  <p style="margin: 0 0 8px; font-size: 15px;"><strong style="color: ${theme.heading};">${parts[1] || `Role ${i+1}`} - ${parts[0] || 'Company'}</strong></p>
                  <ul style="list-style-type: disc; margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">
                    <li style="margin-bottom:4px;">${parts[2] || 'Key achievements and responsibilities in this role.'}</li>
                  </ul>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  } else if (layoutStyle === 1) {
    // MODERN HEADER 1-COLUMN
    return `
    <div class="template-output" style="max-width:850px; margin:0 auto; background:#ffffff; font-family:'Inter',system-ui,sans-serif; color:${theme.body}; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 15px 35px -5px rgba(0,0,0,0.08);">
      <div style="background-color: ${theme.primary}; color: white; padding: 48px; text-align: left;">
        <h1 style="font-size: 36px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.5px;">${data.fullName || 'Your Name'}</h1>
        <p style="font-size: 20px; font-weight: 500; margin: 0 0 24px; color: rgba(255,255,255,0.9);">${data.jobTitle || 'Professional Title'}</p>
        <div style="display: flex; gap: 20px; font-size: 14px; color: rgba(255,255,255,0.8); flex-wrap: wrap;">
          ${data.email ? `<span>${data.email}</span>` : ''} ${data.phone ? `<span>${data.phone}</span>` : ''} ${data.location ? `<span>${data.location}</span>` : ''}
        </div>
      </div>
      <div style="padding: 48px;">
        <div style="margin-bottom: 36px;">
          <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${theme.primary}; margin-bottom: 16px;">Summary</h2>
          <p style="font-size: 15px; line-height: 1.8;">${data.summary || 'Summary placeholder.'}</p>
        </div>
        <div style="margin-bottom: 36px;">
          <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${theme.primary}; margin-bottom: 16px;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.map(skill => `<span style="background: #f1f5f9; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">${skill}</span>`).join('') || '<span style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 13px;">Add your skills here</span>'}
          </div>
        </div>
        <div>
          <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${theme.primary}; margin-bottom: 24px;">Experience</h2>
          <div style="display: flex; flex-direction: column; gap: 28px;">
            ${workLines.map((line, i) => {
              const parts = line.split('|').map(p => p.trim());
              return `<div style="border-left: 3px solid ${theme.primary}; padding-left: 20px;">
                <h3 style="font-size: 18px; font-weight: 700; color: ${theme.heading}; margin: 0 0 4px;">${parts[1] || `Role ${i+1}`}</h3>
                <p style="font-size: 14px; font-weight: 600; color: ${theme.accent}; margin: 0 0 12px;">${parts[0] || 'Company'}</p>
                <p style="font-size: 14px; line-height: 1.6;">${parts[2] || 'Key achievements in this role.'}</p>
              </div>`;
            }).join('')}
          </div>
        </div>
        ${data.education ? `<div style="margin-top: 36px;">
          <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${theme.primary}; margin-bottom: 16px;">Education</h2>
          <div style="border-left: 3px solid ${theme.primary}; padding-left: 20px;">
            <p style="font-size: 15px; font-weight: 700; color: ${theme.heading}; margin: 0 0 4px;">${data.education}</p>
          </div>
        </div>` : ''}
      </div>
    </div>`;
  } else {
    // MINIMALIST ELEGANT
    return `
    <div class="template-output" style="max-width:800px; margin:0 auto; background:#fff; font-family:'Georgia',serif; color:${theme.body}; padding: 64px 48px; border:1px solid #e2e8f0; box-shadow:0 5px 15px rgba(0,0,0,0.02);">
      <div style="text-align: center; margin-bottom: 48px;">
        <h1 style="font-size: 38px; font-weight: normal; color: ${theme.heading}; margin: 0 0 12px; letter-spacing: 1px;">${data.fullName?.toUpperCase() || 'YOUR NAME'}</h1>
        <p style="font-size: 16px; font-style: italic; color: ${theme.body}; margin: 0 0 16px;">${data.jobTitle || 'Professional Title'}</p>
        <div style="font-size: 13px; font-family:'Inter',sans-serif; color: #64748b;">
          ${data.email ? `${data.email}` : ''} ${data.phone ? ` • ${data.phone}` : ''}
        </div>
      </div>
      
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: normal; text-transform: uppercase; letter-spacing: 2px; color: ${theme.heading}; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 20px;">Profile</h2>
        <p style="font-size: 15px; line-height: 1.8; margin: 0;">${data.summary || 'Summary placeholder.'}</p>
      </div>

      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: normal; text-transform: uppercase; letter-spacing: 2px; color: ${theme.heading}; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 24px;">Experience</h2>
        <div style="display: flex; flex-direction: column; gap: 32px;">
          ${workLines.map((line, i) => {
            const parts = line.split('|').map(p => p.trim());
            return `<div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                <h3 style="font-size: 16px; font-weight: bold; color: ${theme.heading}; margin: 0;">${parts[1] || `Role ${i+1}`}</h3>
                <span style="font-size: 14px; font-style: italic; font-family:'Inter',sans-serif;">${parts[0] || 'Company'}</span>
              </div>
              <ul style="list-style-type: circle; margin: 0; padding-left: 20px; font-size: 14px; font-family:'Inter',sans-serif; line-height: 1.7;">
                <li style="margin-bottom:6px;">${parts[2] || 'Key achievements in this role.'}</li>
              </ul>
            </div>`;
          }).join('')}
        </div>
      </div>
      
      ${data.education ? `<div style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: normal; text-transform: uppercase; letter-spacing: 2px; color: ${theme.heading}; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 20px;">Education</h2>
        <p style="font-size: 15px; font-weight: bold; color: ${theme.heading}; font-family:'Inter',sans-serif; margin: 0;">${data.education}</p>
      </div>` : ''}
      
      <div>
        <h2 style="font-size: 18px; font-weight: normal; text-transform: uppercase; letter-spacing: 2px; color: ${theme.heading}; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 20px;">Skills</h2>
        <p style="font-size: 14px; line-height: 1.8; font-family:'Inter',sans-serif; margin: 0;">${skills.join(' • ') || 'Skill 1 • Skill 2 • Skill 3'}</p>
      </div>
    </div>`;
  }
}

function generateCoverLetter(data: Record<string, string>): string {
  return `
<div class="template-output" style="max-width:720px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="margin-bottom:32px;">
    <p style="color:#64748b; font-size:0.9rem; margin-bottom:8px;">${today()}</p>
    <h3 style="color:#0f172a; font-weight:700; margin-bottom:2px;">${data.hiringManager || 'Hiring Manager'}</h3>
    <p style="color:#6366f1; margin:0;">${data.company || 'Company Name'}</p>
  </div>

  <h1 style="font-size:1.5rem; font-weight:800; color:#0f172a; margin-bottom:4px;">${data.applicantName || 'Your Name'}</h1>
  <p style="color:#6366f1; font-weight:600; margin-bottom:32px;">Applying for: ${data.position || 'Position'}</p>

  <div style="line-height:1.8; color:#475569;">
    <p>Dear ${data.hiringManager || 'Hiring Manager'},</p>
    <br/>
    <p>I am writing to express my enthusiastic interest in the <strong style="color:#0f172a;">${data.position || 'open position'}</strong> at <strong style="color:#0f172a;">${data.company || 'your organization'}</strong>. With ${data.experience ? 'extensive experience in ' + data.experience.slice(0, 100) : 'a strong background'}, I am confident in my ability to make a meaningful contribution to your team.</p>
    <br/>
    <p>${data.motivation || 'Your organization\'s commitment to excellence and innovation aligns perfectly with my professional values and goals. I have followed your work with great admiration and am excited by the opportunity to contribute to your continued success.'}</p>
    <br/>
    <p>One of my most significant achievements includes: <em>${data.achievement || 'delivering measurable results that exceeded organizational goals through strategic planning and execution'}</em>. This experience has equipped me with the skills necessary to excel in this role.</p>
    <br/>
    <p>I am eager to bring my expertise, collaborative spirit, and results-driven mindset to ${data.company || 'your team'}. Thank you for considering my application. I would love the opportunity to discuss how I can contribute to your team's success.</p>
    <br/>
    <p>I look forward to hearing from you.</p>
    <br/>
    <p style="color:#0f172a; font-weight:600;">Sincerely,<br/>${data.applicantName || 'Your Name'}</p>
  </div>
</div>`;
}

function generateBusinessPlan(data: Record<string, string>): string {
  return `
<div class="template-output" style="max-width:800px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6); padding:32px; border-radius:12px; margin-bottom:32px; color:white; text-align:center;">
    <h1 style="font-size:2rem; font-weight:800; margin:0 0 8px; color:white;">${data.businessName || 'Business Name'}</h1>
    <p style="opacity:0.9; margin:0; font-size:1.1rem;">Business Plan · ${today()}</p>
    <p style="opacity:0.7; margin:8px 0 0; font-size:0.9rem;">${data.industry || 'Industry'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #6366f1;">
    <h2 style="font-size:1rem; font-weight:700; color:#6366f1; margin-bottom:8px;">📋 EXECUTIVE SUMMARY</h2>
    <p style="color:#475569; line-height:1.7; margin:0;">${data.businessName} is a ${data.industry}-focused company addressing a critical market need. Our solution directly targets ${data.targetAudience || 'our target customers'}, solving the fundamental challenge of <em>${data.problem || 'significant market inefficiencies'}</em>.</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #8b5cf6;">
    <h2 style="font-size:1rem; font-weight:700; color:#8b5cf6; margin-bottom:8px;">🎯 PROBLEM & SOLUTION</h2>
    <p style="color:#475569; margin-bottom:12px;"><strong>Problem:</strong> ${data.problem || 'The market lacks an efficient, scalable solution.'}</p>
    <p style="color:#475569; margin:0;"><strong>Solution:</strong> ${data.solution || 'We provide an innovative approach that directly solves this challenge.'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #06b6d4;">
    <h2 style="font-size:1rem; font-weight:700; color:#06b6d4; margin-bottom:8px;">👥 TARGET MARKET</h2>
    <p style="color:#475569; margin:0;">${data.targetAudience || 'Our target audience is defined by specific demographic and psychographic characteristics that align with our product\'s value proposition.'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #10b981;">
    <h2 style="font-size:1rem; font-weight:700; color:#10b981; margin-bottom:8px;">💰 REVENUE MODEL</h2>
    <p style="color:#475569; margin-bottom:8px;"><strong>Model:</strong> ${data.revenue || 'Subscription-based'}</p>
    <p style="color:#475569; margin:0;"><strong>Starting Budget:</strong> ${data.budget || 'To be determined'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #f59e0b;">
    <h2 style="font-size:1rem; font-weight:700; color:#f59e0b; margin-bottom:8px;">🚀 YEAR 1 GOALS</h2>
    <p style="color:#475569; white-space:pre-line; margin:0;">${data.goals || 'Achieve product-market fit, acquire first 100 customers, establish brand presence.'}</p>
  </div>

  <div style="padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #ef4444;">
    <h2 style="font-size:1rem; font-weight:700; color:#ef4444; margin-bottom:8px;">👨‍💼 TEAM & OPERATIONS</h2>
    <p style="color:#475569; margin-bottom:4px;"><strong>Team Size:</strong> ${data.teamSize || 'To be determined'}</p>
    <p style="color:#475569; margin:0;"><strong>Location:</strong> ${data.location || 'TBD'}</p>
  </div>
</div>`;
}

function generateInvoice(data: Record<string, string>): string {
  const serviceLines = data.services?.split('\n').filter(Boolean) || [];
  let subtotal = 0;

  const rows = serviceLines.map(line => {
    const parts = line.split('|').map(p => p.trim());
    const qty = parseFloat(parts[1]) || 1;
    const unit = parseFloat(parts[2]?.replace(/[$,]/g, '')) || 0;
    const total = qty * unit;
    subtotal += total;
    return `<tr>
      <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; color:#475569;">${parts[0] || 'Service'}</td>
      <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; text-align:center; color:#475569;">${qty}</td>
      <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; text-align:right; color:#475569;">$${unit.toFixed(2)}</td>
      <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; text-align:right; font-weight:600; color:#0f172a;">$${total.toFixed(2)}</td>
    </tr>`;
  }).join('');

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return `
<div class="template-output" style="max-width:760px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:40px;">
    <div>
      <div style="width:48px; height:48px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
        <span style="color:white; font-size:1.4rem;">⚡</span>
      </div>
      <h2 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin:0;">${data.businessName || 'Your Business'}</h2>
      <p style="color:#64748b; margin:4px 0 0; font-size:0.9rem;">${data.businessEmail || 'you@company.com'}</p>
    </div>
    <div style="text-align:right;">
      <h1 style="font-size:2rem; font-weight:800; color:#6366f1; margin:0;">INVOICE</h1>
      <p style="color:#64748b; margin:4px 0 0;">${data.invoiceNumber || 'INV-001'}</p>
    </div>
  </div>

  <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:32px; padding:20px; background:#f8fafc; border-radius:10px;">
    <div>
      <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; margin-bottom:4px;">Bill To</p>
      <p style="font-weight:700; color:#0f172a; margin:0;">${data.clientName || 'Client Name'}</p>
      ${data.clientEmail ? `<p style="color:#64748b; margin:2px 0 0; font-size:0.875rem;">${data.clientEmail}</p>` : ''}
    </div>
    <div>
      <div style="display:flex; gap:24px; justify-content:flex-end;">
        <div>
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; margin-bottom:4px;">Issue Date</p>
          <p style="font-weight:600; color:#0f172a; margin:0;">${data.issueDate || today()}</p>
        </div>
        <div>
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; margin-bottom:4px;">Due Date</p>
          <p style="font-weight:600; color:#ef4444; margin:0;">${data.dueDate || 'Net 30'}</p>
        </div>
      </div>
    </div>
  </div>

  <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
    <thead>
      <tr style="background:#f1f5f9;">
        <th style="padding:12px 16px; text-align:left; font-size:0.8rem; text-transform:uppercase; color:#64748b; letter-spacing:1px;">Description</th>
        <th style="padding:12px 16px; text-align:center; font-size:0.8rem; text-transform:uppercase; color:#64748b; letter-spacing:1px;">Qty</th>
        <th style="padding:12px 16px; text-align:right; font-size:0.8rem; text-transform:uppercase; color:#64748b; letter-spacing:1px;">Rate</th>
        <th style="padding:12px 16px; text-align:right; font-size:0.8rem; text-transform:uppercase; color:#64748b; letter-spacing:1px;">Amount</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="4" style="padding:16px; color:#94a3b8; text-align:center;">Add services above</td></tr>'}</tbody>
  </table>

  <div style="display:flex; justify-content:flex-end;">
    <div style="min-width:220px;">
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-top:1px solid #e2e8f0; color:#64748b;">
        <span>Subtotal</span><span>$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:8px 0; color:#64748b;">
        <span>Tax (10%)</span><span>$${tax.toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; padding:12px 16px; background:linear-gradient(135deg,#6366f1,#8b5cf6); border-radius:8px; margin-top:8px; color:white; font-weight:700; font-size:1.1rem;">
        <span>Total</span><span>$${total.toFixed(2)}</span>
      </div>
    </div>
  </div>

  ${data.notes ? `
  <div style="margin-top:32px; padding:16px; background:#f8fafc; border-radius:8px; border-left:3px solid #6366f1;">
    <p style="font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#6366f1; margin-bottom:6px;">Notes</p>
    <p style="color:#64748b; margin:0; font-size:0.9rem;">${data.notes}</p>
  </div>` : ''}
</div>`;
}

function generateContentCalendar(data: Record<string, string>): string {
  const pillars = data.contentPillars?.split(',').map(p => p.trim()).filter(Boolean) || ['Education', 'Inspiration', 'Promotion'];
  const platformList = data.platforms?.split(',').map(p => p.trim()).filter(Boolean) || ['Instagram'];

  const weeks = [
    { week: 1, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { week: 2, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { week: 3, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { week: 4, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  ];

  const sampleContent = [
    `${pillars[0]} post: "5 tips for ${data.niche || 'your niche'}"`,
    `${pillars[1] || 'Motivation'} reel: Client transformation story`,
    `${pillars[0]} carousel: Common mistakes in ${data.niche || 'your industry'}`,
    `Behind-the-scenes story series`,
    `Product/Service spotlight — ${data.brand}`,
    `Community Q&A or poll`,
    `Weekly insight: Trend or news in ${data.niche || 'your niche'}`,
    `User-generated content or testimonial`,
    `Tutorial or how-to content`,
    `Promotion: Special offer or announcement`,
  ];

  return `
<div class="template-output" style="max-width:900px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="text-align:center; margin-bottom:36px;">
    <h1 style="font-size:2rem; font-weight:800; color:#0f172a;">${data.brand || 'Brand'} — Content Calendar</h1>
    <p style="color:#6366f1; font-weight:600; margin:4px 0;">${data.month || 'Monthly'} Content Plan</p>
    <div style="display:flex; gap:8px; justify-content:center; margin-top:12px; flex-wrap:wrap;">
      ${platformList.map(p => `<span style="background:#f1f5f9; border:1px solid #e2e8f0; padding:2px 10px; border-radius:20px; font-size:0.8rem; color:#6366f1; font-weight:600;">${p}</span>`).join('')}
    </div>
  </div>

  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px;">
    ${pillars.map((p, i) => {
      const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
      return `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-top:3px solid ${colors[i % colors.length]}; padding:12px; border-radius:8px;">
        <p style="font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; color:${colors[i % colors.length]}; margin-bottom:4px; font-weight:600;">Pillar ${i+1}</p>
        <p style="font-weight:700; color:#0f172a; margin:0;">${p}</p>
      </div>`;
    }).join('')}
  </div>

  ${weeks.map(w => `
  <div style="margin-bottom:24px;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#6366f1; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; padding:8px 12px; background:#f8fafc; border-radius:6px;">Week ${w.week}</h2>
    <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:8px;">
      ${w.days.map((day, di) => {
        const contentIdx = (w.week - 1) * 5 + di;
        return `<div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px; border-radius:8px; min-height:80px;">
          <p style="font-size:0.7rem; font-weight:700; color:#94a3b8; margin-bottom:6px; text-transform:uppercase;">${day}</p>
          <p style="font-size:0.78rem; color:#475569; line-height:1.4; margin:0;">${sampleContent[contentIdx % sampleContent.length]}</p>
        </div>`;
      }).join('')}
    </div>
  </div>`).join('')}

  <div style="margin-top:32px; padding:20px; background:#f0fdf4; border-radius:10px; border-left:4px solid #10b981;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#10b981; margin-bottom:8px;">🎯 Monthly Goals</h2>
    <p style="color:#475569; white-space:pre-line; margin:0;">${data.goals || 'Grow audience, increase engagement, drive conversions.'}</p>
  </div>
</div>`;
}

function generateProposal(data: Record<string, string>): string {
  const deliverables = data.deliverables?.split('\n').filter(Boolean) || [];
  return `
<div class="template-output" style="max-width:800px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6); padding:32px; border-radius:12px; margin-bottom:36px; color:white;">
    <p style="opacity:0.8; font-size:0.85rem; margin-bottom:8px;">PROJECT PROPOSAL</p>
    <h1 style="font-size:1.8rem; font-weight:800; margin:0 0 8px; color:white;">${data.projectTitle || 'Project Proposal'}</h1>
    <div style="display:flex; gap:24px; margin-top:16px; flex-wrap:wrap;">
      <div><p style="opacity:0.7; font-size:0.75rem; margin-bottom:2px;">PREPARED BY</p><p style="font-weight:600; margin:0;">${data.yourName || 'Your Company'}</p></div>
      <div><p style="opacity:0.7; font-size:0.75rem; margin-bottom:2px;">PREPARED FOR</p><p style="font-weight:600; margin:0;">${data.clientName || 'Client'}</p></div>
      <div><p style="opacity:0.7; font-size:0.75rem; margin-bottom:2px;">DATE</p><p style="font-weight:600; margin:0;">${today()}</p></div>
    </div>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #6366f1;">
    <h2 style="font-size:1rem; font-weight:700; color:#6366f1; margin-bottom:12px;">📋 Project Scope</h2>
    <p style="color:#475569; line-height:1.7; margin:0; white-space:pre-line;">${data.scope || 'Detailed project scope to be defined.'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #8b5cf6;">
    <h2 style="font-size:1rem; font-weight:700; color:#8b5cf6; margin-bottom:12px;">✅ Deliverables</h2>
    <ul style="margin:0; padding-left:20px; color:#475569;">
      ${deliverables.map(d => `<li style="margin-bottom:6px;">${d}</li>`).join('') || '<li>Deliverables to be outlined</li>'}
    </ul>
  </div>

  <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:28px;">
    <div style="padding:16px; background:#f0fdf4; border-radius:10px; text-align:center;">
      <p style="font-size:0.75rem; color:#10b981; font-weight:600; text-transform:uppercase; margin-bottom:4px;">Timeline</p>
      <p style="font-weight:700; color:#0f172a; margin:0;">${data.timeline || 'TBD'}</p>
    </div>
    <div style="padding:16px; background:#fef3c7; border-radius:10px; text-align:center;">
      <p style="font-size:0.75rem; color:#f59e0b; font-weight:600; text-transform:uppercase; margin-bottom:4px;">Investment</p>
      <p style="font-weight:700; color:#0f172a; margin:0;">${data.budget || 'TBD'}</p>
    </div>
    <div style="padding:16px; background:#f0f0ff; border-radius:10px; text-align:center;">
      <p style="font-size:0.75rem; color:#6366f1; font-weight:600; text-transform:uppercase; margin-bottom:4px;">Payment</p>
      <p style="font-weight:700; color:#0f172a; margin:0; font-size:0.85rem;">${data.terms || 'Net 30'}</p>
    </div>
  </div>

  <div style="padding:20px; background:#f8fafc; border-radius:10px;">
    <p style="color:#64748b; text-align:center; margin:0; font-size:0.9rem;">This proposal is valid for <strong>30 days</strong> from the date above. To proceed, please sign and return.</p>
  </div>
</div>`;
}

function generateBudgetPlan(data: Record<string, string>): string {
  const lines = data.categories?.split('\n').filter(Boolean) || [];
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  return `
<div class="template-output" style="max-width:800px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="margin-bottom:32px;">
    <h1 style="font-size:2rem; font-weight:800; color:#0f172a; margin:0;">${data.name || 'Budget Plan'}</h1>
    <div style="display:flex; gap:16px; margin-top:8px; flex-wrap:wrap;">
      <span style="background:#f1f5f9; padding:4px 12px; border-radius:20px; font-size:0.85rem; color:#6366f1; font-weight:600;">${data.period || 'Monthly'} Budget</span>
      <span style="background:#f1f5f9; padding:4px 12px; border-radius:20px; font-size:0.85rem; color:#0f172a; font-weight:600;">Total: ${data.totalBudget || '$0'}</span>
    </div>
  </div>

  <div style="margin-bottom:28px;">
    <h2 style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6366f1; margin-bottom:16px;">Budget Breakdown</h2>
    ${lines.map((line, i) => {
      const parts = line.split('|').map(p => p.trim());
      const pct = Math.floor(Math.random() * 20) + 10;
      return `<div style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-weight:600; color:#0f172a;">${parts[0] || 'Category'}</span>
          <span style="font-weight:700; color:${colors[i % colors.length]};">${parts[1] || '$0'}</span>
        </div>
        <div style="height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;">
          <div style="height:100%; width:${pct + i * 5}%; background:${colors[i % colors.length]}; border-radius:4px;"></div>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div style="padding:20px; background:#f0fdf4; border-radius:10px; border-left:4px solid #10b981;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#10b981; margin-bottom:8px;">🎯 Budget Goals</h2>
    <p style="color:#475569; white-space:pre-line; margin:0;">${data.goals || 'Maximize ROI and manage costs effectively.'}</p>
  </div>
</div>`;
}

function generateMeetingAgenda(data: Record<string, string>): string {
  const agendaLines = data.agendaItems?.split('\n').filter(Boolean) || [];
  const attendeeLines = data.attendees?.split('\n').filter(Boolean) || [];
  return `
<div class="template-output" style="max-width:720px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="border-bottom:3px solid #6366f1; padding-bottom:20px; margin-bottom:28px;">
    <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a; margin:0 0 12px;">${data.meetingTitle || 'Meeting Agenda'}</h1>
    <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:0.875rem; color:#64748b;">
      <span>📅 ${data.date || today()}</span>
      <span>⏰ ${data.time || 'TBD'}</span>
      <span>📍 ${data.location || 'TBD'}</span>
    </div>
  </div>

  <div style="margin-bottom:24px; padding:16px; background:#f8fafc; border-radius:10px;">
    <h2 style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6366f1; margin-bottom:10px;">🎯 Objective</h2>
    <p style="color:#475569; margin:0;">${data.objective || 'Meeting objective'}</p>
  </div>

  <div style="margin-bottom:24px;">
    <h2 style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6366f1; margin-bottom:12px;">👥 Attendees</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      ${attendeeLines.map(a => `<span style="background:#f1f5f9; padding:4px 12px; border-radius:20px; font-size:0.85rem; color:#334155;">${a}</span>`).join('')}
    </div>
  </div>

  <div>
    <h2 style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6366f1; margin-bottom:12px;">📋 Agenda</h2>
    ${agendaLines.map((line, i) => {
      const parts = line.split('|').map(p => p.trim());
      return `<div style="display:flex; gap:16px; padding:12px 16px; border-left:3px solid #6366f1; margin-bottom:8px; background:#f8fafc; border-radius:0 8px 8px 0;">
        <span style="background:#6366f1; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0;">${i+1}</span>
        <div style="flex:1;">
          <p style="font-weight:600; color:#0f172a; margin:0;">${parts[0] || 'Agenda item'}</p>
          <div style="display:flex; gap:12px; margin-top:4px; font-size:0.8rem; color:#94a3b8;">
            ${parts[1] ? `<span>⏱ ${parts[1]}</span>` : ''}
            ${parts[2] ? `<span>👤 ${parts[2]}</span>` : ''}
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>
</div>`;
}

function generatePressRelease(data: Record<string, string>): string {
  return `
<div class="template-output" style="max-width:720px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #e2e8f0;">
    <p style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6366f1;">FOR IMMEDIATE RELEASE</p>
    <p style="color:#64748b; font-size:0.875rem; margin:4px 0 0;">${data.releaseDate || today()}</p>
  </div>

  <h1 style="font-size:1.75rem; font-weight:800; color:#0f172a; line-height:1.3; margin-bottom:20px;">${data.headline || 'Press Release Headline'}</h1>

  <p style="color:#475569; font-size:1rem; line-height:1.7; font-style:italic; margin-bottom:24px; padding:16px; background:#f8fafc; border-left:4px solid #6366f1; border-radius:0 8px 8px 0;">${data.summary || 'Summary of the announcement.'}</p>

  <p style="color:#475569; line-height:1.8; margin-bottom:20px; white-space:pre-line;">${data.details || 'Full announcement details here.'}</p>

  ${data.quote ? `
  <div style="margin:28px 0; padding:24px; background:#f0f0ff; border-radius:12px;">
    <p style="color:#334155; font-size:1.05rem; font-style:italic; line-height:1.7; margin-bottom:12px;">"${data.quote}"</p>
    <p style="color:#6366f1; font-weight:600; margin:0;">— CEO, ${data.company}</p>
  </div>` : ''}

  <div style="margin-top:32px; padding-top:24px; border-top:1px solid #e2e8f0;">
    <h2 style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6366f1; margin-bottom:8px;">Media Contact</h2>
    <p style="color:#475569; margin:0;">${data.contact || 'Press contact information'}</p>
    <p style="color:#475569; margin:4px 0 0;">Company: <strong>${data.company}</strong></p>
  </div>

  <div style="text-align:center; margin-top:28px; color:#94a3b8; font-size:0.875rem; letter-spacing:4px;">###</div>
</div>`;
}

function generateSocialMediaKit(data: Record<string, string>): string {
  const platformList = data.platforms?.split(',').map(p => p.trim()).filter(Boolean) || ['Instagram', 'LinkedIn'];
  return `
<div class="template-output" style="max-width:800px; margin:0 auto; background:#fff; padding:48px; font-family:'Inter',sans-serif;">
  <div style="background:linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4); padding:32px; border-radius:12px; margin-bottom:32px; color:white; text-align:center;">
    <h1 style="font-size:2rem; font-weight:800; margin:0 0 8px; color:white;">${data.brand || 'Brand'}</h1>
    <p style="opacity:0.9; margin:0;">Social Media Strategy Kit · ${today()}</p>
    <p style="opacity:0.7; margin:8px 0 0; font-size:0.9rem;">${data.industry || 'Industry'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #ec4899;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#ec4899; margin-bottom:8px;">🎨 Brand Voice & Tone</h2>
    <p style="color:#475569; margin:0; font-weight:600;">${data.voiceTone || 'Professional & authentic'}</p>
  </div>

  <div style="margin-bottom:28px; padding:20px; background:#f8fafc; border-radius:10px; border-left:4px solid #8b5cf6;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#8b5cf6; margin-bottom:8px;">👥 Target Audience</h2>
    <p style="color:#475569; white-space:pre-line; margin:0;">${data.audience || 'Your target audience profile.'}</p>
  </div>

  <div style="margin-bottom:28px;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#06b6d4; margin-bottom:12px;">📱 Platform Strategy</h2>
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px;">
      ${platformList.map(p => `<div style="padding:16px; background:#f8fafc; border-radius:10px; text-align:center; border:1px solid #e2e8f0;">
        <p style="font-weight:700; color:#0f172a; margin:0 0 4px;">${p}</p>
        <p style="font-size:0.75rem; color:#94a3b8; margin:0;">Active</p>
      </div>`).join('')}
    </div>
  </div>

  <div style="padding:20px; background:#f0fdf4; border-radius:10px; border-left:4px solid #10b981;">
    <h2 style="font-size:0.9rem; font-weight:700; color:#10b981; margin-bottom:8px;">🚀 3-Month Goals</h2>
    <p style="color:#475569; white-space:pre-line; margin:0;">${data.goals || 'Grow your social media presence.'}</p>
  </div>
</div>`;
}

// ── Main generator function ────────────────────────────────────────────────
// Phase 2: Calls real /api/generate (OpenRouter backend).
// Falls back to mock if API key is not configured (for local dev without keys).

export async function generateTemplate(
  type: TemplateType,
  formData: Record<string, string>
): Promise<GeneratedTemplate> {
  // ── Try real AI first ────────────────────────────────────────────────────
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, formData }),
    });

    if (res.ok) {
      const data = await res.json();
      return data as GeneratedTemplate;
    }

    // Surface meaningful errors from the API
    const errorBody = await res.json().catch(() => ({}));
    const apiError = errorBody?.error as string | undefined;

    // If API key is missing or rate limit is hit, fall through to mock silently
    if ((res.status === 503 && apiError?.includes('API key not configured')) || res.status === 429) {
      console.warn('[generate] OpenRouter key missing or rate limited — using mock fallback');
      return await mockGenerate(type, formData);
    }

    // All other API errors should be shown to the user
    throw new Error(apiError || 'Generation failed. Please try again.');
  } catch (err: unknown) {
    // Network errors (no server, fetch failed) — fall back to mock
    if (err instanceof TypeError && err.message.includes('fetch')) {
      console.warn('[generate] Fetch failed — using mock fallback');
      return await mockGenerate(type, formData);
    }
    // Re-throw real errors
    throw err;
  }
}

// ── Mock fallback (original Phase 1 logic) ────────────────────────────────
async function mockGenerate(
  type: TemplateType,
  formData: Record<string, string>
): Promise<GeneratedTemplate> {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

  const generators: Record<TemplateType, (data: Record<string, string>) => string> = {
    resume: generateResume,
    'cover-letter': generateCoverLetter,
    'business-plan': generateBusinessPlan,
    proposal: generateProposal,
    invoice: generateInvoice,
    'budget-plan': generateBudgetPlan,
    'content-calendar': generateContentCalendar,
    'social-media-kit': generateSocialMediaKit,
    'press-release': generatePressRelease,
    'meeting-agenda': generateMeetingAgenda,
    'ai-modification': generateResume, // fallback — AI Modification uses the /api/modify route directly
  };

  const generator = generators[type] || generators.resume;
  const html = generator(formData);

  const titles: Record<TemplateType, string> = {
    resume: `${formData.fullName || 'Professional'} — Resume`,
    'cover-letter': `Cover Letter — ${formData.position || 'Position'} at ${formData.company || 'Company'}`,
    'business-plan': `${formData.businessName || 'Business'} — Business Plan`,
    proposal: `Proposal — ${formData.projectTitle || 'Project'} for ${formData.clientName || 'Client'}`,
    invoice: `Invoice ${formData.invoiceNumber || 'INV-001'} — ${formData.clientName || 'Client'}`,
    'budget-plan': `${formData.name || 'Budget Plan'}`,
    'content-calendar': `${formData.brand || 'Brand'} — ${formData.month || 'Monthly'} Content Calendar`,
    'social-media-kit': `${formData.brand || 'Brand'} — Social Media Kit`,
    'press-release': `Press Release — ${formData.company || 'Company'}`,
    'meeting-agenda': `${formData.meetingTitle || 'Meeting Agenda'}`,
    'ai-modification': `AI Modified — ${new Date().toLocaleDateString()}`,
  };

  return {
    id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: titles[type],
    html,
    createdAt: new Date().toISOString(),
    formData,
  };
}
