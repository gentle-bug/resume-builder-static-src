import { create } from 'zustand'

export interface ResumeBasics {
  name: string
  label: string
  email: string
  phone: string
  summary: string
  location: string
  avatarUrl?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
}

export interface Education {
  institution: string
  area: string
  studyType: string
  startDate: string
  endDate: string
}

export interface Skill {
  name: string
  level: string
  keywords: string[]
}

export interface Project {
  name: string
  description: string
  url: string
  highlights: string[]
}

export interface Certification {
  name: string
  issuer: string
  date: string
}

export interface Language {
  language: string
  fluency: string
}

export interface ResumeData {
  basics: ResumeBasics
  work: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
}

export interface ResumeItem {
  id: string
  title: string
  templateName: string
  data: ResumeData
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'rb_resumes'

function loadResumes(): ResumeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveResumes(resumes: ResumeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

interface ResumeStore {
  resumes: ResumeItem[]
  getById: (id: string) => ResumeItem | undefined
  create: (title: string, templateName: string, data?: ResumeData) => ResumeItem
  update: (id: string, patch: Partial<Pick<ResumeItem, 'title' | 'templateName' | 'data'>>) => void
  remove: (id: string) => void
  importJson: (json: unknown) => ResumeItem
}

const emptyData: ResumeData = {
  basics: { name: '', label: '', email: '', phone: '', summary: '', location: '' },
  work: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
}

const demoResume: ResumeItem = {
  id: 'demo',
  title: 'Alex Johnson - Full Stack Developer',
  templateName: 'cabernet',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  data: {
    basics: {
      name: 'Alex Johnson',
      label: 'Senior Full Stack Developer',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 987-6543',
      summary: 'Passionate full-stack developer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Led teams of up to 8 engineers and delivered products serving 500K+ users. Strong advocate for clean code, test-driven development, and continuous learning.',
      location: 'San Francisco, CA',
      avatarUrl: './assets/avatar.jpg',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexjohnson',
      website: 'https://alexjohnson.dev',
    },
    work: [
      {
        company: 'TechVision Inc.',
        position: 'Senior Full Stack Developer',
        startDate: '2022-03',
        endDate: 'Present',
        summary: 'Lead developer for the core platform team, architecting and building customer-facing SaaS products.',
        highlights: [
          'Architected microservices migration reducing API response times by 40%',
          'Led a team of 8 engineers delivering a real-time analytics dashboard used by 200K+ users',
          'Implemented CI/CD pipelines cutting deployment time from 2 hours to 15 minutes',
          'Mentored 4 junior developers, 2 of whom were promoted within a year',
        ],
      },
      {
        company: 'CloudBase Solutions',
        position: 'Full Stack Developer',
        startDate: '2019-06',
        endDate: '2022-02',
        summary: 'Built and maintained cloud-native applications for enterprise clients in the fintech space.',
        highlights: [
          'Developed a payment processing module handling $2M+ daily transactions',
          'Reduced infrastructure costs by 35% through AWS optimization and serverless migration',
          'Built a real-time notification system serving 50K concurrent users with WebSocket',
        ],
      },
      {
        company: 'StartupHub',
        position: 'Junior Developer',
        startDate: '2018-01',
        endDate: '2019-05',
        summary: 'Full-stack development for an early-stage SaaS startup focused on project management tools.',
        highlights: [
          'Built the MVP from scratch using React and Express, launching in 3 months',
          'Implemented OAuth 2.0 authentication supporting Google, GitHub, and Microsoft SSO',
        ],
      },
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        area: 'Computer Science',
        studyType: 'Bachelor of Science',
        startDate: '2014-09',
        endDate: '2018-05',
      },
    ],
    skills: [
      { name: 'Frontend', level: 'Expert', keywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js'] },
      { name: 'Backend', level: 'Expert', keywords: ['Node.js', 'Python', 'Express', 'FastAPI', 'GraphQL'] },
      { name: 'Database', level: 'Advanced', keywords: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
      { name: 'DevOps & Cloud', level: 'Advanced', keywords: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
    ],
    projects: [
      {
        name: 'DevFlow',
        description: 'An open-source developer productivity tool that integrates with GitHub, Jira, and Slack to streamline workflow management.',
        url: 'https://github.com/alexjohnson/devflow',
        highlights: [
          '2.5K+ GitHub stars with active community of 40+ contributors',
          'Featured in JavaScript Weekly and Hacker News front page',
        ],
      },
      {
        name: 'CloudDeploy CLI',
        description: 'A CLI tool for simplified multi-cloud deployments supporting AWS, GCP, and Azure with a unified configuration.',
        url: 'https://github.com/alexjohnson/clouddeploy',
        highlights: [
          'Used by 500+ developers across 30+ companies',
          'Reduced average deployment configuration time by 60%',
        ],
      },
    ],
    certifications: [
      { name: 'AWS Solutions Architect - Professional', issuer: 'Amazon Web Services', date: '2023-06' },
      { name: 'Google Cloud Professional Developer', issuer: 'Google Cloud', date: '2022-11' },
    ],
    languages: [
      { language: 'English', fluency: 'Native' },
      { language: 'Spanish', fluency: 'Intermediate' },
    ],
  },
}

function initResumes(): ResumeItem[] {
  const existing = loadResumes()
  if (existing.length > 0) return existing
  saveResumes([demoResume])
  return [demoResume]
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumes: initResumes(),

  getById: (id) => get().resumes.find((r) => r.id === id),

  create: (title, templateName, data) => {
    const now = new Date().toISOString()
    const item: ResumeItem = {
      id: generateId(),
      title,
      templateName,
      data: data ?? { ...emptyData, basics: { ...emptyData.basics } },
      createdAt: now,
      updatedAt: now,
    }
    const next = [...get().resumes, item]
    saveResumes(next)
    set({ resumes: next })
    return item
  },

  update: (id, patch) => {
    const next = get().resumes.map((r) =>
      r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r,
    )
    saveResumes(next)
    set({ resumes: next })
  },

  remove: (id) => {
    const next = get().resumes.filter((r) => r.id !== id)
    saveResumes(next)
    set({ resumes: next })
  },

  importJson: (json: unknown) => {
    const parsed = json as Record<string, unknown>
    let data: ResumeData
    if (parsed.data) {
      data = typeof parsed.data === 'string' ? JSON.parse(parsed.data as string) : parsed.data as ResumeData
    } else if (parsed.basics) {
      data = parsed as unknown as ResumeData
    } else {
      data = { ...emptyData }
    }
    const now = new Date().toISOString()
    const item: ResumeItem = {
      id: generateId(),
      title: (parsed.title as string) || 'Imported Resume',
      templateName: (parsed.templateName as string) || 'cabernet',
      data,
      createdAt: now,
      updatedAt: now,
    }
    const next = [...get().resumes, item]
    saveResumes(next)
    set({ resumes: next })
    return item
  },
}))
