export type WorkItem = {
  title: string
  category: string
  year: string
  href?: string
  // Internet-hosted preview image (no download needed)
  previewImage: string
  details: string
  techStack: string[]
}

export const profile = {
  name: 'Biswarup Goswami',
  role: 'Data analyst & AI/ML enthusiast',
  location: 'Azara, Guwahati, Assam',
  email: 'goswamibiswarup77@gmail.com',
  phone: '9101996779',
  summary:
    'Motivated 2nd year B.Tech student with a keen interest in Data Analysis and AI/ML. Passionate about building practical, data-driven solutions and continuously improving technical and problem-solving skills through real-world projects.',
  availability: "Availability from late May '26",
} as const

export const works: WorkItem[] = [
  {
    title: 'Folium AI',
    category: 'AI • Computer Vision',
    year: '2026',
    href: 'https://folium-ai.vercel.app',
    previewImage: `${import.meta.env.BASE_URL}folium.png`,
    details: 'A cutting-edge tea leaf disease detection platform powered by computer vision. It scans leaves and accurately identifies potential diseases, helping farmers mitigate crop damage.',
    techStack: ['React', 'TensorFlow', 'Computer Vision'],
  },
  {
    title: 'Assamese AI',
    category: 'AI • NLP • Education',
    year: '2026',
    previewImage: `${import.meta.env.BASE_URL}assamese.png`,
    details: 'An advanced NLP-powered educational tool designed to assist with academic problem solving with a special focus on Indian scripts and the Assamese language.',
    techStack: ['Python', 'NLP', 'React'],
  },
]

export type JourneyItem = {
  year: string
  title: string
  description: string
}

export const journey: JourneyItem[] = [
  {
    year: '2025',
    title: 'NPTEL Certification in Data Science',
    description: 'Completed a comprehensive NPTEL certification course, deeply expanding my core understanding of data science principles and methodologies.',
  },
  {
    year: '2025',
    title: 'Hackathons & Technical Experience',
    description: 'Participated in various hackathons, gaining hands-on technical experience and collaborating with peers on real-world problems.',
  },
  {
    year: '2024',
    title: 'Embedded Systems Workshop',
    description: 'Attended a 1-week workshop on STM32 microcontrollers and embedded systems, expanding my knowledge of hardware-software integration.',
  },
  {
    year: '2024',
    title: 'Student Coordinator',
    description: 'Volunteered as a student coordinator in Swasthayam (NSS), developing leadership and organizational skills.',
  },
]

export type SkillBadge = {
  name: string
  // internet-hosted SVG logo
  logo: string
}

export type SkillGroup = {
  title: string
  subtitle: string
  accent: 'violet' | 'blue' | 'teal'
  icon: SkillBadge
  badges: SkillBadge[]
  bullets: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    subtitle: 'Core languages I use for problem-solving and building.',
    accent: 'blue',
    icon: { name: 'Code', logo: 'https://cdn.simpleicons.org/codeforces/ffffff' },
    badges: [
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/ffffff' },
      { name: 'C', logo: 'https://cdn.simpleicons.org/c/ffffff' },
      { name: 'C++', logo: 'https://cdn.simpleicons.org/cplusplus/ffffff' },
    ],
    bullets: ['Problem solving', 'Data structures basics', 'Competitive programming'],
  },
  {
    title: 'Fullstack',
    subtitle: 'Frontend + backend tools to ship complete web apps.',
    accent: 'violet',
    icon: { name: 'React', logo: 'https://cdn.simpleicons.org/react/ffffff' },
    badges: [
      { name: 'React', logo: 'https://cdn.simpleicons.org/react/ffffff' },
      { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/ffffff' },
      { name: 'Flask', logo: 'https://cdn.simpleicons.org/flask/ffffff' },
    ],
    bullets: ['Responsive UI', 'APIs & deployment', 'Clean component systems'],
  },
  {
    title: 'AI/ML',
    subtitle: 'Tools I use to prototype ML and computer vision projects.',
    accent: 'teal',
    icon: { name: 'TensorFlow', logo: 'https://cdn.simpleicons.org/tensorflow/ffffff' },
    badges: [
      { name: 'TensorFlow', logo: 'https://cdn.simpleicons.org/tensorflow/ffffff' },
      { name: 'NumPy', logo: 'https://cdn.simpleicons.org/numpy/ffffff' },
      { name: 'Pandas', logo: 'https://cdn.simpleicons.org/pandas/ffffff' },
      { name: 'OpenCV', logo: 'https://cdn.simpleicons.org/opencv/ffffff' },
    ],
    bullets: ['Image classification', 'NLP basics', 'Model evaluation & iteration'],
  },
]

