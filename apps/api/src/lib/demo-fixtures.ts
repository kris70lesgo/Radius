/**
 * Pre-cached demo responses for all pipeline agent nodes.
 * Used when demoMode === true to skip external API calls entirely.
 * Concept: "Client portal for a law firm"
 */

export const DEMO_CONCEPT = 'Client portal for a law firm'

export const DEMO_TIMING = {
    node1ProcessingMs: 3000,
    node2ProcessingMs: 2500,
    node3ProcessingMs: 3500,
    shipyardStepMs: 1200,
}

export const DEMO_CLARIFY_QUESTIONS = [
    {
        id: 'target_audience',
        question: 'Who is your primary target audience for this portal?',
        type: 'select' as const,
        options: [
            'Solo practitioners (1-2 attorneys)',
            'Small law firms (3-15 attorneys)',
            'Mid-size firms (15-50 attorneys)',
            'Large firms (50+ attorneys)',
            'In-house corporate legal teams',
        ],
    },
    {
        id: 'core_problem',
        question: 'What is the #1 pain point you want to solve for your clients?',
        type: 'text' as const,
        placeholder: 'e.g., Clients constantly call to ask about case status updates',
    },
    {
        id: 'existing_tools',
        question: 'What tools are you currently using for client communication?',
        type: 'multiselect' as const,
        options: [
            'Email only',
            'Phone calls',
            'Clio',
            'MyCase',
            'PracticePanther',
            'Custom spreadsheets',
            'No system in place',
        ],
    },
    {
        id: 'must_have_features',
        question: 'Which features are absolute must-haves for your MVP?',
        type: 'multiselect' as const,
        options: [
            'Secure document sharing',
            'Case status tracking',
            'Encrypted messaging',
            'Invoice/billing viewer',
            'Appointment scheduling',
            'Multi-language support',
        ],
    },
    {
        id: 'monetization',
        question: 'How do you plan to monetize this product?',
        type: 'select' as const,
        options: [
            'Per-seat SaaS subscription',
            'Freemium with premium tiers',
            'Flat monthly fee per firm',
            'Usage-based pricing',
            'Not sure yet',
        ],
    },
]

// Node 1: Strategist
export const DEMO_STRATEGIST = {
    targetAudience:
        'Small to mid-size law firms (5-50 attorneys) seeking to modernize client communication and document sharing.',
    audienceSegments: [
        'Solo practitioners and small partnerships',
        'Mid-size litigation firms',
        'Corporate law departments',
        'Immigration and family law practices',
    ],
    mvpFeatures: [
        {
            name: 'Secure Document Vault',
            priority: 'MUST' as const,
            rationale:
                'Clients need a secure, encrypted space to upload and access legal documents 24/7.',
        },
        {
            name: 'Case Status Dashboard',
            priority: 'MUST' as const,
            rationale:
                'Reduces inbound calls by 40% — clients can self-serve on case progress updates.',
        },
        {
            name: 'Encrypted Messaging',
            priority: 'MUST' as const,
            rationale:
                'Attorney-client privilege requires end-to-end encrypted communication channels.',
        },
        {
            name: 'Billing & Invoice Viewer',
            priority: 'SHOULD' as const,
            rationale:
                'Transparency in billing reduces disputes and improves collection rates.',
        },
        {
            name: 'Appointment Scheduling',
            priority: 'SHOULD' as const,
            rationale:
                'Eliminates back-and-forth emails for scheduling consultations.',
        },
        {
            name: 'Multi-language Support',
            priority: 'COULD' as const,
            rationale:
                'Expands addressable market for immigration law firms serving non-English speakers.',
        },
    ],
    monetizationStrategy:
        'Per-seat SaaS pricing at $49/attorney/month with a free tier for solo practitioners (1 attorney, 10 clients). Enterprise tier at $99/seat adds SSO, audit logs, and priority support.',
    pricingTiers: [
        {
            name: 'Solo',
            price: 'Free',
            description: 'For solo practitioners with one attorney and up to 10 clients.',
        },
        {
            name: 'Professional',
            price: '$49/attorney/month',
            description: 'For growing firms that need unlimited clients and core portal features.',
        },
        {
            name: 'Enterprise',
            price: '$99/attorney/month',
            description: 'For larger firms that need SSO, audit logs, and priority support.',
        },
    ],
    marketDifferentiators: [
        'Built specifically for legal compliance (HIPAA-adjacent security, audit trails)',
        'White-label option so firms can brand the portal as their own',
        'AI-powered document summarization for client-friendly case updates',
    ],
    competitorLandscape:
        'Clio and MyCase offer broad practice-management suites, but their client portals are secondary to back-office workflows. This product focuses on a secure, white-label client experience that reduces status calls and makes legal communication easier to understand.',
    riskFactors: [
        'Legal industry is slow to adopt new technology — requires trust-building sales cycle',
        'Must achieve SOC 2 Type II compliance before enterprise deals close',
        'Competing with established players like Clio and MyCase who may add portal features',
        'Attorney-client privilege regulations vary by jurisdiction',
    ],
    successMetrics: [
        'Sign 25 paying law firms within 6 months of launch',
        'Reduce client status inquiry calls by at least 40% within 90 days',
        'Achieve 70% weekly active usage among invited clients within 3 months',
    ],
    confidence: 82,
}

// Node 2: Business Analyst
export const DEMO_ANALYST = {
    userPersonas: [
        {
            name: 'Sarah, Managing Partner',
            role: 'Managing partner at a 15-attorney law firm',
            painPoints: ['High administrative overhead', 'Frequent client status calls'],
            goals: ['Improve client satisfaction', 'Verify security and ROI before adopting new tools'],
        },
        {
            name: 'Marcus, Associate Attorney',
            role: 'Associate attorney handling more than 30 active cases',
            painPoints: ['Spends two hours daily answering status emails', 'Loses time available for billable work'],
            goals: ['Give clients self-service case updates', 'Reclaim billable hours'],
        },
        {
            name: 'Elena, Legal Client',
            role: 'Client navigating a complex immigration case',
            painPoints: ['Has little visibility into case progress', 'Must call the office for updates'],
            goals: ['Receive timely case updates', 'Access case information without calling the firm'],
        },
    ],
    coreUserStories: [
        {
            asA: 'client',
            iWantTo: 'view my case status and recent activity',
            soThat: 'I can stay informed without calling my attorney',
            acceptanceCriteria: ['The current case status is visible', 'Recent case activity is shown chronologically'],
        },
        {
            asA: 'attorney',
            iWantTo: 'upload documents to a secure vault',
            soThat: 'my clients can access them at any time',
            acceptanceCriteria: ['Only authorized case participants can access a document', 'Clients can download uploaded documents'],
        },
        {
            asA: 'client',
            iWantTo: 'message my attorney through encrypted chat',
            soThat: 'our communication stays privileged',
            acceptanceCriteria: ['Messages are encrypted', 'Messages are only visible to authorized case participants'],
        },
        {
            asA: 'managing partner',
            iWantTo: 'see all active cases and client engagement metrics in one dashboard',
            soThat: 'I can monitor firm workload and client service',
            acceptanceCriteria: ['Active cases can be filtered by attorney', 'Client engagement metrics are summarized'],
        },
        {
            asA: 'client',
            iWantTo: 'view and pay invoices online',
            soThat: 'I can manage my legal expenses easily',
            acceptanceCriteria: ['Outstanding invoices show amount and due date', 'A successful payment updates the invoice status'],
        },
        {
            asA: 'attorney',
            iWantTo: 'let clients self-schedule consultations',
            soThat: 'I can reduce scheduling overhead',
            acceptanceCriteria: ['Clients can see available appointment slots', 'Confirmed appointments appear on the attorney calendar'],
        },
    ],
    dataEntities: [
        {
            name: 'Firm',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'name', type: 'String' },
                { name: 'plan', type: 'String' },
                { name: 'settings', type: 'Json' },
                { name: 'createdAt', type: 'DateTime' },
            ],
            relations: ['Firm has many Attorney', 'Firm has many Client', 'Firm has many Case'],
        },
        {
            name: 'Attorney',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'firmId', type: 'String' },
                { name: 'email', type: 'String' },
                { name: 'name', type: 'String' },
                { name: 'role', type: 'String' },
                { name: 'barNumber', type: 'String' },
            ],
            relations: ['Attorney belongs to Firm', 'Attorney has many Case'],
        },
        {
            name: 'Client',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'firmId', type: 'String' },
                { name: 'email', type: 'String' },
                { name: 'name', type: 'String' },
                { name: 'phone', type: 'String' },
                { name: 'preferredLanguage', type: 'String' },
            ],
            relations: ['Client belongs to Firm', 'Client has many Case'],
        },
        {
            name: 'Case',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'firmId', type: 'String' },
                { name: 'clientId', type: 'String' },
                { name: 'attorneyId', type: 'String' },
                { name: 'title', type: 'String' },
                { name: 'status', type: 'String' },
                { name: 'type', type: 'String' },
                { name: 'filedDate', type: 'DateTime' },
            ],
            relations: ['Case belongs to Firm', 'Case belongs to Client', 'Case belongs to Attorney', 'Case has many Document', 'Case has many Message', 'Case has many Invoice'],
        },
        {
            name: 'Document',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'caseId', type: 'String' },
                { name: 'uploadedBy', type: 'String' },
                { name: 'fileName', type: 'String' },
                { name: 'mimeType', type: 'String' },
                { name: 'encryptedUrl', type: 'String' },
                { name: 'createdAt', type: 'DateTime' },
            ],
            relations: ['Document belongs to Case'],
        },
        {
            name: 'Message',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'caseId', type: 'String' },
                { name: 'senderId', type: 'String' },
                { name: 'body', type: 'String' },
                { name: 'encrypted', type: 'Boolean' },
                { name: 'readAt', type: 'DateTime' },
                { name: 'createdAt', type: 'DateTime' },
            ],
            relations: ['Message belongs to Case'],
        },
        {
            name: 'Invoice',
            fields: [
                { name: 'id', type: 'String' },
                { name: 'caseId', type: 'String' },
                { name: 'amount', type: 'Float' },
                { name: 'status', type: 'String' },
                { name: 'dueDate', type: 'DateTime' },
                { name: 'paidAt', type: 'DateTime' },
            ],
            relations: ['Invoice belongs to Case'],
        },
    ],
    integrations: ['Stripe (payments)', 'SendGrid (email)', 'Calendly (scheduling)', 'AWS S3 (document storage)'],
    confidence: 78,
}

// Node 3: Tech Lead
export const DEMO_TECHLEAD = {
    techStack: {
        frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
        backend: ['Node.js', 'Express', 'Prisma ORM', 'PostgreSQL'],
        database: ['PostgreSQL', 'Valkey'],
        infrastructure: ['Zerops runtime service', 'Zerops PostgreSQL', 'Zerops Valkey', 'Zerops Object Storage'],
    },
    prismaSchemaDelta: `model Firm {
  id        String   @id @default(cuid())
  name      String
  plan      String   @default("free")
  createdAt DateTime @default(now())
  attorneys Attorney[]
  clients   Client[]
  cases     Case[]
}

model Attorney {
  id        String   @id @default(cuid())
  firmId    String
  firm      Firm     @relation(fields: [firmId], references: [id])
  email     String   @unique
  name      String
  role      String   @default("associate")
  cases     Case[]
  createdAt DateTime @default(now())
}

model Client {
  id                String   @id @default(cuid())
  firmId            String
  firm              Firm     @relation(fields: [firmId], references: [id])
  email             String
  name              String
  phone             String?
  preferredLanguage String   @default("en")
  cases             Case[]
  createdAt         DateTime @default(now())
}

model Case {
  id         String     @id @default(cuid())
  firmId     String
  firm       Firm       @relation(fields: [firmId], references: [id])
  clientId   String
  client     Client     @relation(fields: [clientId], references: [id])
  attorneyId String
  attorney   Attorney   @relation(fields: [attorneyId], references: [id])
  title      String
  status     String     @default("active")
  type       String
  documents  Document[]
  messages   Message[]
  invoices   Invoice[]
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}

model Document {
  id           String   @id @default(cuid())
  caseId       String
  case         Case     @relation(fields: [caseId], references: [id])
  uploadedBy   String
  fileName     String
  mimeType     String
  encryptedUrl String
  createdAt    DateTime @default(now())
}

model Message {
  id        String    @id @default(cuid())
  caseId    String
  case      Case      @relation(fields: [caseId], references: [id])
  senderId  String
  body      String
  encrypted Boolean   @default(true)
  readAt    DateTime?
  createdAt DateTime  @default(now())
}

model Invoice {
  id        String    @id @default(cuid())
  caseId    String
  case      Case      @relation(fields: [caseId], references: [id])
  amount    Float
  status    String    @default("pending")
  dueDate   DateTime
  paidAt    DateTime?
  createdAt DateTime  @default(now())
}`,
    phase1Features: [
        {
            feature: 'Secure Document Vault',
            estimatedDays: 5,
        },
        {
            feature: 'Case Status Dashboard',
            estimatedDays: 4,
        },
        {
            feature: 'Encrypted Messaging',
            estimatedDays: 5,
        },
    ],
    phase2Features: [
        {
            feature: 'Billing & Invoice Portal',
            estimatedDays: 4,
        },
        {
            feature: 'Appointment Scheduling',
            estimatedDays: 3,
        },
        {
            feature: 'White-label Branding',
            estimatedDays: 5,
        },
    ],
    apiEndpoints: [
        { method: 'POST', path: '/api/auth/login', description: 'Authenticate an existing user.' },
        { method: 'POST', path: '/api/auth/register', description: 'Create a new user account.' },
        { method: 'GET', path: '/api/cases', description: 'List the cases visible to the current user.' },
        { method: 'GET', path: '/api/cases/:id', description: 'Get details and status for one case.' },
        { method: 'POST', path: '/api/cases/:id/documents', description: 'Upload a document to a case.' },
        { method: 'GET', path: '/api/cases/:id/documents', description: 'List documents attached to a case.' },
        { method: 'POST', path: '/api/cases/:id/messages', description: 'Send an encrypted message in a case.' },
        { method: 'GET', path: '/api/cases/:id/messages', description: 'List messages for a case.' },
        { method: 'GET', path: '/api/invoices', description: 'List invoices visible to the current user.' },
        { method: 'POST', path: '/api/invoices/:id/pay', description: 'Pay an outstanding invoice.' },
    ],
    envVarsRequired: [
        'DATABASE_URL',
        'STRIPE_SECRET_KEY',
        'SENDGRID_API_KEY',
        'S3_BUCKET',
        'S3_REGION',
        'JWT_SECRET',
        'ENCRYPTION_KEY',
    ],
    confidence: 85,
}

// Node 4: Shipyard (deployment result)
export const DEMO_SHIPYARD = {
    githubRepoUrl: 'https://github.com/kris70lesgo/client-portal-law-firm',
    zeropsAppUrl: 'https://client-portal-law-firm.zerops.app',
    buildStatus: 'ACTIVE' as const,
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
