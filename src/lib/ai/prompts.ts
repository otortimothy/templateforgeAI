import { TemplateType } from '../templates';

// ── System prompt shared across all template types ─────────────────────────
export const SYSTEM_PROMPT = `You are an expert professional document writer and UI/UX designer. 
Your job is to generate visually stunning, highly structured HTML documents based on user-provided information.

- Use aesthetic elements: subtle gradients and shadows for modern web templates, OR clean solid colors for classic print layouts.
- The root element must be a <div class="template-output" style="max-width:850px; margin:0 auto; overflow:hidden; ...">. 
- EXTREMELY IMPORTANT: You MUST randomize the layout structure, aesthetic style, typography, and color palette for EVERY generation. Do not use the exact same layout twice. 
- Sometimes use a 1-column layout, sometimes 2-column, sometimes split-headers, sometimes sidebar on the left, sometimes on the right. 
- Ensure all sections are clearly separated using generous spacing and visual dividers.
- Make use of colored badges and highlighted background panels for important information where appropriate.
- Use typography effectively: strong font weights for headings, subtle colors for secondary text.
- Fill in all sections with realistic, high-quality content based on the user's inputs. Never leave blank sections.
- Documents MUST look like a professional, polished final product. DO NOT return plain, unstyled HTML.`;

// ── Per-template prompt builders ───────────────────────────────────────────

function resumePrompt(data: Record<string, string>): string {
  return `Generate a highly professional Resume in HTML.
  
CRITICAL INSTRUCTION: You MUST randomize the layout and style of this resume! Do NOT use the exact same template every time.
You must randomly choose one of the following layout styles for this generation:
1. Classic 2-Column: Dark colored left sidebar (30%) with white text for skills, and white right content area (70%) for experience.
2. Modern Header: A massive, bold, dark-colored top header with the name and summary, followed by a clean 1-column grid below.
3. Minimalist 1-Column: A very clean, wide 1-column layout with elegant serif typography, subtle gray borders between sections, and centered headers.
4. Split Top: A 50/50 split at the very top (Name on left, contact on right), followed by a 2-column masonry layout for skills and experience.

User Data:
- Full Name: ${data.fullName || 'Not provided'}
- Job Title: ${data.jobTitle || 'Not provided'}
- Email: ${data.email || ''}
- Phone: ${data.phone || ''}
- Location: ${data.location || ''}
- LinkedIn: ${data.linkedin || ''}
- Professional Summary: ${data.summary || 'Not provided'}
- Skills: ${data.skills || 'Not provided'}
- Work History: ${data.workHistory || 'Not provided'}
- Education: ${data.education || 'Not provided'}

Design Requirements:
- Use a root <div class="template-output"> with a max-width of 850px and a clean box-shadow.
- Randomize the color palette: choose from Navy Blue, Slate, Charcoal, Forest Green, Burgundy, or Classic Black/White.
- Ensure 'Experience' sections emphasize the Job Title and Company, followed by bulleted responsibilities.
- Make it look like a premium, ATS-friendly print document.`;
}

function coverLetterPrompt(data: Record<string, string>): string {
  return `Generate a compelling, professional cover letter in HTML.

User Data:
- Applicant Name: ${data.applicantName || 'Not provided'}
- Position Applying For: ${data.position || 'Not provided'}
- Company: ${data.company || 'Not provided'}
- Hiring Manager: ${data.hiringManager || 'Hiring Manager'}
- Relevant Experience: ${data.experience || 'Not provided'}
- Key Achievement: ${data.achievement || 'Not provided'}
- Motivation for applying: ${data.motivation || 'Not provided'}

Design requirements:
- Date and recipient block at top
- Applicant name and "Applying for: [position]" styled in indigo below
- 4 paragraphs: opening hook, relevant experience, key achievement, strong closing
- Professional sign-off
- Paragraphs should be genuinely tailored, persuasive, and specific — not generic
- Line height 1.8 for readability`;
}

function businessPlanPrompt(data: Record<string, string>): string {
  return `Generate a comprehensive business plan document in HTML.

User Data:
- Business Name: ${data.businessName || 'Not provided'}
- Industry: ${data.industry || 'Not provided'}
- Target Audience: ${data.targetAudience || 'Not provided'}
- Problem Being Solved: ${data.problem || 'Not provided'}
- Solution: ${data.solution || 'Not provided'}
- Revenue Model: ${data.revenue || 'Not provided'}
- Starting Budget: ${data.budget || 'Not provided'}
- Year 1 Goals: ${data.goals || 'Not provided'}
- Team Size: ${data.teamSize || 'Not provided'}
- Location: ${data.location || ''}

Design requirements:
- Gradient header banner (indigo to purple) with business name and date
- Sections with coloured left-border cards: Executive Summary, Problem & Solution, Target Market, Revenue Model, Financial Projections, Year 1 Goals, Team & Operations
- Each section should be thoughtful and specific — expand on the user's inputs with professional insight
- Include a simple financial projection table (Year 1, Year 2, Year 3 rows)`;
}

function invoicePrompt(data: Record<string, string>): string {
  return `Generate a professional invoice document in HTML.

User Data:
- Business Name: ${data.businessName || 'Not provided'}
- Business Email: ${data.businessEmail || ''}
- Client Name: ${data.clientName || 'Not provided'}
- Client Email: ${data.clientEmail || ''}
- Invoice Number: ${data.invoiceNumber || 'INV-001'}
- Issue Date: ${data.issueDate || new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}
- Due Date: ${data.dueDate || 'Net 30'}
- Services/Items: ${data.services || 'Not provided'}
- Notes: ${data.notes || ''}

Services format: "Service Name | Quantity | Unit Price" per line.

Design requirements:
- Header: business logo icon + name on left, "INVOICE" + number on right
- Bill-to and date info in a grey card
- Full itemised table with Qty, Rate, Amount columns and calculated totals (Subtotal, Tax 10%, Total)
- Total in an indigo gradient box
- If notes provided, show in a styled note block
- Make it pixel-perfect and print-ready`;
}

function contentCalendarPrompt(data: Record<string, string>): string {
  return `Generate a detailed 4-week social media content calendar in HTML.

User Data:
- Brand Name: ${data.brand || 'Not provided'}
- Month/Period: ${data.month || 'This Month'}
- Niche/Industry: ${data.niche || 'Not provided'}
- Target Audience: ${data.audience || 'Not provided'}
- Platforms: ${data.platforms || 'Instagram, LinkedIn'}
- Content Pillars: ${data.contentPillars || 'Not provided'}
- Posting Frequency: ${data.frequency || '5 days per week'}
- Monthly Goals: ${data.goals || 'Not provided'}

Design requirements:
- Header with brand name, month, platform badges
- Content pillars displayed as coloured indicator cards
- 4-week grid: Monday-Friday columns, each cell has day label + specific content idea
- Content ideas MUST be specific and tailored to the brand's niche — not generic placeholders
- Footer with monthly goals section
- Include posting times and content types (Reel, Carousel, Story, etc.)`;
}

function proposalPrompt(data: Record<string, string>): string {
  return `Generate a professional project proposal document in HTML.

User Data:
- Project Title: ${data.projectTitle || 'Not provided'}
- Prepared By: ${data.yourName || 'Not provided'}
- Client: ${data.clientName || 'Not provided'}
- Project Scope: ${data.scope || 'Not provided'}
- Deliverables: ${data.deliverables || 'Not provided'}
- Timeline: ${data.timeline || 'Not provided'}
- Budget: ${data.budget || 'Not provided'}
- Payment Terms: ${data.terms || 'Net 30'}

Design requirements:
- Gradient header with project title, "Prepared By", "Prepared For", date
- Sections: Project Overview, Scope of Work, Deliverables (as numbered list), Timeline, Investment, Payment Terms
- Summary of next steps at the end
- Professional, persuasive tone`;
}

function budgetPlanPrompt(data: Record<string, string>): string {
  return `Generate a comprehensive budget plan document in HTML.

User Data:
- Budget Name: ${data.name || 'Personal/Business Budget'}
- Period: ${data.period || 'Monthly'}
- Total Budget: ${data.totalBudget || 'Not provided'}
- Categories: ${data.categories || 'Not provided'}
- Income Sources: ${data.income || 'Not provided'}
- Goals: ${data.goals || 'Not provided'}

Categories format: "Category Name | Amount" per line.

Design requirements:
- Header with budget name, period badge, total amount
- Income vs Expenses summary cards
- Per-category breakdown with styled progress bars and amounts
- Savings/surplus calculation
- Goals section at the bottom`;
}

function meetingAgendaPrompt(data: Record<string, string>): string {
  return `Generate a professional meeting agenda document in HTML.

User Data:
- Meeting Title: ${data.meetingTitle || 'Team Meeting'}
- Date: ${data.date || 'Not provided'}
- Time: ${data.time || 'Not provided'}
- Location/Platform: ${data.location || 'Not provided'}
- Meeting Objective: ${data.objective || 'Not provided'}
- Attendees: ${data.attendees || 'Not provided'}
- Agenda Items: ${data.agendaItems || 'Not provided'}

Agenda format: "Item Name | Duration | Owner" per line.

Design requirements:
- Header with meeting title, date/time/location badges
- Objective box in a highlighted card
- Attendees as styled chips
- Numbered agenda items with indigo left-border, duration and owner badges
- Action items section at the bottom`;
}

function pressReleasePrompt(data: Record<string, string>): string {
  return `Generate a professional press release document in HTML.

User Data:
- Headline: ${data.headline || 'Not provided'}
- Company: ${data.company || 'Not provided'}
- Release Date: ${data.releaseDate || new Date().toLocaleDateString()}
- Summary: ${data.summary || 'Not provided'}
- Full Details: ${data.details || 'Not provided'}
- Executive Quote: ${data.quote || 'Not provided'}
- Media Contact: ${data.contact || 'Not provided'}

Design requirements:
- "FOR IMMEDIATE RELEASE" badge and date at top
- Bold headline
- Lead paragraph (italicised) in a styled card
- 2-3 body paragraphs expanding on the details
- Executive quote in a styled pull-quote box
- About Company boilerplate section
- Media contact information
- "###" centered at the bottom`;
}

function socialMediaKitPrompt(data: Record<string, string>): string {
  return `Generate a complete social media strategy kit document in HTML.

User Data:
- Brand Name: ${data.brand || 'Not provided'}
- Industry: ${data.industry || 'Not provided'}
- Brand Voice/Tone: ${data.voiceTone || 'Not provided'}
- Target Audience: ${data.audience || 'Not provided'}
- Platforms: ${data.platforms || 'Not provided'}
- Competitors: ${data.competitors || 'Not provided'}
- 3-Month Goals: ${data.goals || 'Not provided'}

Design requirements:
- Gradient header with brand name
- Brand Voice section with do's and don'ts
- Target audience persona card
- Per-platform strategy grid (content types, best times, posting frequency)
- Content pillar suggestions (3-5 pillars with descriptions)
- KPI targets table
- 30-day quick-start action plan`;
}

// ── Main Prompt Selector ───────────────────────────────────────────────────

export function buildPrompt(type: TemplateType, formData: Record<string, string>): string {
  const builders: Record<string, (data: Record<string, string>) => string> = {
    'resume': resumePrompt,
    'cover-letter': coverLetterPrompt,
    'business-plan': businessPlanPrompt,
    'invoice': invoicePrompt,
    'content-calendar': contentCalendarPrompt,
    'proposal': proposalPrompt,
    'budget-plan': budgetPlanPrompt,
    'meeting-agenda': meetingAgendaPrompt,
    'press-release': pressReleasePrompt,
    'social-media-kit': socialMediaKitPrompt,
  };

  const builder = builders[type] || builders['resume'];
  return builder(formData);
}

// ── Title generator (kept in sync with generate.ts) ─────────────────────────
export function buildTitle(type: TemplateType, formData: Record<string, string>): string {
  const titles: Record<string, string> = {
    'resume': `${formData.fullName || 'Professional'} — Resume`,
    'cover-letter': `Cover Letter — ${formData.position || 'Position'} at ${formData.company || 'Company'}`,
    'business-plan': `${formData.businessName || 'Business'} — Business Plan`,
    'proposal': `Proposal — ${formData.projectTitle || 'Project'} for ${formData.clientName || 'Client'}`,
    'invoice': `Invoice ${formData.invoiceNumber || 'INV-001'} — ${formData.clientName || 'Client'}`,
    'budget-plan': `${formData.name || 'Budget Plan'}`,
    'content-calendar': `${formData.brand || 'Brand'} — ${formData.month || 'Monthly'} Content Calendar`,
    'social-media-kit': `${formData.brand || 'Brand'} — Social Media Kit`,
    'press-release': `Press Release — ${formData.company || 'Company'}`,
    'meeting-agenda': `${formData.meetingTitle || 'Meeting Agenda'}`,
  };
  return titles[type] || 'Generated Document';
}
