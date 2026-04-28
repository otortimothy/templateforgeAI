// ── Template Categories & Types ────────────────────────────────────────────

export type TemplateCategory = 'business' | 'career' | 'content' | 'finance';

export const CATEGORIES: {
  id: TemplateCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
  count: number;
}[] = [
  {
    id: 'business',
    label: 'Business',
    icon: '🏢',
    description: 'Business plans, proposals, strategies',
    color: 'from-indigo-500 to-purple-600',
    count: 12,
  },
  {
    id: 'career',
    label: 'Career',
    icon: '💼',
    description: 'Resumes, cover letters, portfolios',
    color: 'from-cyan-500 to-blue-600',
    count: 10,
  },
  {
    id: 'content',
    label: 'Content',
    icon: '✍️',
    description: 'Content calendars, scripts, blogs',
    color: 'from-pink-500 to-rose-600',
    count: 9,
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: '💰',
    description: 'Invoices, budgets, financial plans',
    color: 'from-amber-500 to-orange-600',
    count: 8,
  },
];

// ── Template Types per Category ────────────────────────────────────────────

export type TemplateType =
  | 'resume'
  | 'cover-letter'
  | 'business-plan'
  | 'proposal'
  | 'invoice'
  | 'budget-plan'
  | 'content-calendar'
  | 'social-media-kit'
  | 'press-release'
  | 'meeting-agenda';

export const TEMPLATE_TYPES: Record<TemplateCategory, {
  id: TemplateType;
  label: string;
  icon: string;
  description: string;
  credits: number;
}[]> = {
  business: [
    { id: 'business-plan', label: 'Business Plan', icon: '📊', description: 'Full business plan with market analysis', credits: 8 },
    { id: 'proposal', label: 'Business Proposal', icon: '📝', description: 'Professional project or service proposal', credits: 8 },
    { id: 'meeting-agenda', label: 'Meeting Agenda', icon: '📅', description: 'Structured meeting agenda template', credits: 4 },
    { id: 'press-release', label: 'Press Release', icon: '📰', description: 'Professional press release for announcements', credits: 6 },
  ],
  career: [
    { id: 'resume', label: 'Resume / CV', icon: '📄', description: 'ATS-optimized professional resume', credits: 3 },
    { id: 'cover-letter', label: 'Cover Letter', icon: '✉️', description: 'Tailored cover letter for job applications', credits: 3 },
  ],
  content: [
    { id: 'content-calendar', label: 'Content Calendar', icon: '📆', description: 'Monthly content planning calendar', credits: 7 },
    { id: 'social-media-kit', label: 'Social Media Kit', icon: '📱', description: 'Complete social media strategy kit', credits: 9 },
    { id: 'press-release', label: 'Press Release', icon: '📰', description: 'Media-ready press release', credits: 6 },
  ],
  finance: [
    { id: 'invoice', label: 'Invoice', icon: '🧾', description: 'Professional invoice template', credits: 5 },
    { id: 'budget-plan', label: 'Budget Plan', icon: '📉', description: 'Monthly or annual budget planning', credits: 7 },
    { id: 'business-plan', label: 'Financial Plan', icon: '💹', description: 'Business financial projection plan', credits: 8 },
  ],
};

// ── Form Field Schemas ─────────────────────────────────────────────────────

export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'email' | 'tel' | 'date' | 'multi-select';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  hint?: string;
}

export const TEMPLATE_FORMS: Record<TemplateType, {
  title: string;
  description: string;
  fields: FormField[];
}> = {
  resume: {
    title: 'Build Your Professional Resume',
    description: 'Provide your details and we\'ll generate a polished, ATS-friendly resume.',
    fields: [
      { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g., Alexandra Johnson', required: true },
      { id: 'jobTitle', label: 'Target Job Title', type: 'text', placeholder: 'e.g., Senior Product Manager', required: true },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'alex@example.com', required: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', required: false },
      { id: 'location', label: 'Location', type: 'text', placeholder: 'New York, NY', required: false },
      { id: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'linkedin.com/in/alexjohnson', required: false },
      { id: 'summary', label: 'Professional Summary', type: 'textarea', placeholder: 'Brief 2-3 sentence summary of your expertise and goals...', required: true, hint: 'Write 2-3 sentences about your expertise, background, and career goals.' },
      { id: 'experience', label: 'Years of Experience', type: 'select', options: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'], required: true },
      { id: 'skills', label: 'Key Skills', type: 'textarea', placeholder: 'e.g., Project Management, Agile, SQL, Stakeholder Communication', required: true, hint: 'List your top 8-10 skills separated by commas.' },
      { id: 'education', label: 'Highest Education / Acquired Certificates', type: 'text', placeholder: 'e.g., B.Sc. Computer Science, MIT, 2019', required: false },
      { id: 'workHistory', label: 'Recent Work Experience', type: 'textarea', placeholder: 'e.g., Google | Frontend Developer | Built the new UI...\n(one role per line)', required: true, hint: 'List up to 3 roles: Company | Role | Achievement bullet points' },
    ],
  },
  'cover-letter': {
    title: 'Write a Standout Cover Letter',
    description: 'Tell us about the role and your background — we\'ll craft a compelling letter.',
    fields: [
      { id: 'applicantName', label: 'Your Full Name', type: 'text', placeholder: 'e.g., Marcus Williams', required: true },
      { id: 'position', label: 'Position Applying For', type: 'text', placeholder: 'e.g., Senior Software Engineer', required: true },
      { id: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g., Google LLC', required: true },
      { id: 'hiringManager', label: 'Hiring Manager Name', type: 'text', placeholder: 'e.g., Sarah Chen (or "Hiring Manager")', required: false },
      { id: 'experience', label: 'Relevant Experience', type: 'textarea', placeholder: 'Describe your most relevant experience for this role...', required: true },
      { id: 'motivation', label: 'Why This Company?', type: 'textarea', placeholder: 'What excites you about this company and role?', required: true },
      { id: 'achievement', label: 'Top Achievement', type: 'textarea', placeholder: 'Share one key achievement relevant to this position...', required: true },
      { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Enthusiastic', 'Formal', 'Conversational'], required: true },
    ],
  },
  'business-plan': {
    title: 'Generate a Professional Business Plan',
    description: 'Answer a few questions and get a structured plan ready for investors.',
    fields: [
      { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'e.g., EcoTech Solutions', required: true },
      { id: 'industry', label: 'Industry / Sector', type: 'text', placeholder: 'e.g., Clean Technology, SaaS, Retail', required: true },
      { id: 'targetAudience', label: 'Target Audience', type: 'textarea', placeholder: 'Who are your primary customers?', required: true },
      { id: 'problem', label: 'Problem You Solve', type: 'textarea', placeholder: 'What problem does your business solve?', required: true },
      { id: 'solution', label: 'Your Solution', type: 'textarea', placeholder: 'How does your product/service solve this problem?', required: true },
      { id: 'revenue', label: 'Revenue Model', type: 'select', options: ['Subscription', 'One-time purchase', 'Freemium', 'Services/Consulting', 'Marketplace commission', 'Advertising'], required: true },
      { id: 'budget', label: 'Starting Budget (USD)', type: 'select', options: ['Under $10,000', '$10,000 - $50,000', '$50,000 - $200,000', '$200,000 - $1M', '$1M+'], required: true },
      { id: 'goals', label: 'Year 1 Goals', type: 'textarea', placeholder: 'What do you aim to achieve in the first year?', required: true },
      { id: 'teamSize', label: 'Team Size', type: 'select', options: ['Solo founder', '2-5 people', '6-15 people', '15-50 people', '50+ people'], required: true },
      { id: 'location', label: 'Business Location / Market', type: 'text', placeholder: 'e.g., San Francisco, CA / Global SaaS', required: true },
    ],
  },
  proposal: {
    title: 'Create a Business Proposal',
    description: 'Generate a professional proposal to win clients and projects.',
    fields: [
      { id: 'yourName', label: 'Your / Company Name', type: 'text', placeholder: 'e.g., Apex Creative Studio', required: true },
      { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'e.g., Horizon Brands Inc.', required: true },
      { id: 'projectTitle', label: 'Project Title', type: 'text', placeholder: 'e.g., Website Redesign & Branding', required: true },
      { id: 'scope', label: 'Project Scope', type: 'textarea', placeholder: 'Describe the work that needs to be done...', required: true },
      { id: 'deliverables', label: 'Deliverables', type: 'textarea', placeholder: 'List specific deliverables (one per line)...', required: true },
      { id: 'timeline', label: 'Project Timeline', type: 'text', placeholder: 'e.g., 8 weeks, starting June 1', required: true },
      { id: 'budget', label: 'Proposed Budget', type: 'text', placeholder: 'e.g., $5,500', required: true },
      { id: 'terms', label: 'Payment Terms', type: 'select', options: ['50% upfront, 50% on delivery', '100% upfront', 'Monthly installments', 'Net 30', 'Milestone-based'], required: true },
    ],
  },
  invoice: {
    title: 'Generate a Professional Invoice',
    description: 'Create a clean, professional invoice ready to send to your clients.',
    fields: [
      { id: 'businessName', label: 'Your Business Name', type: 'text', placeholder: 'e.g., Freelance Studio', required: true },
      { id: 'businessEmail', label: 'Your Email', type: 'email', placeholder: 'you@yourcompany.com', required: true },
      { id: 'clientName', label: 'Client Name / Company', type: 'text', placeholder: 'e.g., Sunrise Marketing Co.', required: true },
      { id: 'clientEmail', label: 'Client Email', type: 'email', placeholder: 'client@company.com', required: false },
      { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'e.g., INV-2024-001', required: true },
      { id: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { id: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { id: 'services', label: 'Services / Items', type: 'textarea', placeholder: 'Service name | Qty | Unit price (one per line)\ne.g., Logo Design | 1 | $800', required: true },
      { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 15', 'Net 30', 'Net 45', 'Due on receipt', 'Custom'], required: true },
      { id: 'notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Bank details, late payment policy, thank you note...', required: false },
    ],
  },
  'budget-plan': {
    title: 'Build a Budget Plan',
    description: 'Create a structured budget plan for personal or business use.',
    fields: [
      { id: 'name', label: 'Budget Plan Name', type: 'text', placeholder: 'e.g., Q3 2024 Marketing Budget', required: true },
      { id: 'period', label: 'Budget Period', type: 'select', options: ['Monthly', 'Quarterly', 'Annual', 'Project-based'], required: true },
      { id: 'totalBudget', label: 'Total Budget (USD)', type: 'text', placeholder: 'e.g., $50,000', required: true },
      { id: 'categories', label: 'Spending Categories', type: 'textarea', placeholder: 'Category | Allocated amount (one per line)\ne.g., Marketing | $15,000', required: true },
      { id: 'goals', label: 'Budget Goals', type: 'textarea', placeholder: 'What do you want to achieve with this budget?', required: true },
      { id: 'contingency', label: 'Contingency %', type: 'select', options: ['5%', '10%', '15%', '20%'], required: false },
    ],
  },
  'content-calendar': {
    title: 'Build a Content Calendar',
    description: 'Plan your content strategy with a structured monthly calendar.',
    fields: [
      { id: 'brand', label: 'Brand / Creator Name', type: 'text', placeholder: 'e.g., The Wellness Hub', required: true },
      { id: 'platforms', label: 'Platforms', type: 'multi-select', options: ['Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'Twitter/X', 'Facebook', 'Blog', 'Newsletter'], required: true },
      { id: 'niche', label: 'Niche / Topic Area', type: 'text', placeholder: 'e.g., Personal Finance, Fitness, Tech Reviews', required: true },
      { id: 'frequency', label: 'Posting Frequency', type: 'select', options: ['Daily', '3-4x per week', '2x per week', 'Weekly', 'Bi-weekly'], required: true },
      { id: 'contentPillars', label: 'Content Pillars (themes)', type: 'textarea', placeholder: 'e.g., Education, Inspiration, Behind the scenes, Promotions', required: true, hint: 'List 3-5 themes that your content will revolve around.' },
      { id: 'goals', label: 'Content Goals', type: 'textarea', placeholder: 'e.g., Grow to 10K followers, Launch product, Build email list', required: true },
      { id: 'targetAudience', label: 'Target Audience', type: 'text', placeholder: 'e.g., Women 25-40 interested in sustainable living', required: true },
      { id: 'month', label: 'Planning Month', type: 'select', options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], required: true },
    ],
  },
  'social-media-kit': {
    title: 'Create a Social Media Kit',
    description: 'Build a complete social media strategy document for your brand.',
    fields: [
      { id: 'brand', label: 'Brand Name', type: 'text', placeholder: 'e.g., Luminary Brand Co.', required: true },
      { id: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., Beauty & Wellness', required: true },
      { id: 'platforms', label: 'Primary Platforms', type: 'multi-select', options: ['Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'Twitter/X', 'Facebook', 'Pinterest'], required: true },
      { id: 'voiceTone', label: 'Brand Voice & Tone', type: 'select', options: ['Professional & authoritative', 'Friendly & relatable', 'Playful & fun', 'Inspirational', 'Educational'], required: true },
      { id: 'audience', label: 'Target Audience', type: 'textarea', placeholder: 'Demographics, interests, pain points...', required: true },
      { id: 'goals', label: 'Social Media Goals', type: 'textarea', placeholder: '3-month goals for your social media presence...', required: true },
    ],
  },
  'press-release': {
    title: 'Write a Press Release',
    description: 'Generate a professional press release ready for media distribution.',
    fields: [
      { id: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g., Nexus Technologies', required: true },
      { id: 'headline', label: 'Announcement Headline', type: 'text', placeholder: 'e.g., Nexus Technologies Raises $10M Series A', required: true },
      { id: 'summary', label: 'Summary (1-2 sentences)', type: 'textarea', placeholder: 'Brief summary of the announcement...', required: true },
      { id: 'details', label: 'Full Details', type: 'textarea', placeholder: 'Expand on the announcement with all relevant details...', required: true },
      { id: 'quote', label: 'Executive Quote', type: 'textarea', placeholder: 'Quote from CEO/founder for the release...', required: false },
      { id: 'contact', label: 'Press Contact Info', type: 'text', placeholder: 'Name, email, phone', required: true },
      { id: 'releaseDate', label: 'Release Date', type: 'date', required: true },
    ],
  },
  'meeting-agenda': {
    title: 'Create a Meeting Agenda',
    description: 'Structure your meetings with a clear, professional agenda.',
    fields: [
      { id: 'meetingTitle', label: 'Meeting Title', type: 'text', placeholder: 'e.g., Q3 Product Roadmap Review', required: true },
      { id: 'date', label: 'Meeting Date', type: 'date', required: true },
      { id: 'time', label: 'Meeting Time', type: 'text', placeholder: 'e.g., 2:00 PM – 3:30 PM EST', required: true },
      { id: 'location', label: 'Location / Platform', type: 'text', placeholder: 'e.g., Zoom, Conference Room B', required: true },
      { id: 'attendees', label: 'Attendees', type: 'textarea', placeholder: 'List names/roles (one per line)...', required: true },
      { id: 'objective', label: 'Meeting Objective', type: 'textarea', placeholder: 'What should be accomplished by the end?', required: true },
      { id: 'agendaItems', label: 'Agenda Items', type: 'textarea', placeholder: 'Item | Duration | Owner (one per line)\ne.g., Q2 Review | 15 min | Sarah', required: true },
    ],
  },
};
