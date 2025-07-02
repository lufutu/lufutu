export interface WindowContentConfig {
  title: string
  content: string
  defaultSize?: {
    width: number
    height: number
  }
}

export const WINDOW_CONTENT: Record<string, WindowContentConfig> = {
  home: {
    title: "Home",
    content: `
      <div class="retro-content">
        <h2>Welcome to My Digital Space</h2>
        <p>Hey there! I'm a passionate developer who loves creating digital experiences that bridge the gap between functionality and creativity.</p>
        <div class="stats-box">
          <h3>Quick Stats</h3>
          <ul>
            <li>• Years of Experience: 15+</li>
            <li>• Projects Completed: 50+</li>
            <li>• Coffee Consumed: 🤯</li>
            <li>• Lines of Code: 100,000+</li>
            <li>• Games made: 4+ <img src="/assets/icons/Controller_Blue.png" alt="Games" width="16" height="16" style="display: inline; vertical-align: middle;"></li>
          </ul>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  },

  blog: {
    title: "Blog",
    content: `
      <div class="retro-content">
        <h2>Latest Blog Posts</h2>
        <div class="blog-post">
          <h3>You're not a front-end developer until you've...</h3>
          <p class="date">10 JUNE 2025</p>
          <p>I've just passed the 10 year mark of my career in web development! A lot of things have happened in that time, so I thought I would celebrate this milestone with this list, which is mostly comprised of little anecdotes/observations that I put on various social media platforms over the years.</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  },

  work: {
    title: "Work",
    content: `
      <div class="retro-content">
        <h2>Work Experience</h2>
        <div class="job-entry">
          <h3>Senior Frontend Developer</h3>
          <p class="company">Tech Company • 2022 - Present</p>
          <p>Leading frontend development initiatives, mentoring junior developers, and architecting scalable web applications using React, TypeScript, and Next.js.</p>
        </div>
        <div class="job-entry">
          <h3>Frontend Developer</h3>
          <p class="company">Startup Inc • 2020 - 2022</p>
          <p>Developed responsive web applications, collaborated with design teams, and implemented modern frontend technologies to enhance user experience.</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  },

  about: {
    title: "About",
    content: `
      <div class="retro-content">
        <h2>About Me</h2>
        <p>I'm a passionate developer with a love for creating digital experiences. My journey in tech started with curiosity about how websites work, and it has evolved into a career focused on building meaningful applications.</p>
        <div class="skills-section">
          <h3>Skills</h3>
          <div class="skills-grid">
            <span class="skill-tag">React</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">Next.js</span>
            <span class="skill-tag">Node.js</span>
            <span class="skill-tag">Python</span>
            <span class="skill-tag">CSS</span>
            <span class="skill-tag">Game Dev</span>
          </div>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  },

  contact: {
    title: "Contact",
    content: `
      <div class="retro-content">
        <h2>Get In Touch</h2>
        <p>I'm always interested in new opportunities and collaborations!</p>
        <div class="contact-info">
          <p><img src="/assets/icons/Document_Blue.png" alt="Email" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> Email: your.email@example.com</p>
          <p><img src="/assets/icons/Document_Blue.png" alt="LinkedIn" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> LinkedIn: linkedin.com/in/lufutu</p>
          <p><img src="/assets/icons/Letter G Black_Blue.png" alt="GitHub" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> GitHub: github.com/yourusername</p>
          <p><img src="/assets/icons/Letter T Yellow_Blue.png" alt="Twitter" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> Twitter: @yourusername</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  },

  services: {
    title: "Services",
    content: `
      <div class="retro-content">
        <h2>Services</h2>
        <p>Content for services section.</p>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  },

  art: {
    title: "Art",
    content: `
      <div class="retro-content">
        <h2>Art</h2>
        <p>Content for art section.</p>
      </div>
    `,
    defaultSize: { width: 600, height: 400 }
  }
} as const

// Memoized content cache for better performance
const contentCache = new Map<string, string>()
const defaultFallbackSize = { width: 600, height: 400 }

// Helper functions for better performance and reusability
export const getWindowContent = (contentKey: string): string => {
  // Check cache first for performance
  if (contentCache.has(contentKey)) {
    return contentCache.get(contentKey)!
  }
  
  const config = WINDOW_CONTENT[contentKey]
  const content = config?.content || `<div class="retro-content"><h2>${contentKey}</h2><p>Content for ${contentKey} section.</p></div>`
  
  // Cache the content for future use
  contentCache.set(contentKey, content)
  return content
}

export const getWindowTitle = (contentKey: string): string => {
  const config = WINDOW_CONTENT[contentKey]
  return config?.title || contentKey.charAt(0).toUpperCase() + contentKey.slice(1)
}

export const getWindowDefaultSize = (contentKey: string): { width: number; height: number } => {
  const config = WINDOW_CONTENT[contentKey]
  return config?.defaultSize || defaultFallbackSize
}

// Batch function for when you need multiple properties at once
export const getWindowConfig = (contentKey: string) => {
  const config = WINDOW_CONTENT[contentKey]
  return {
    title: config?.title || contentKey.charAt(0).toUpperCase() + contentKey.slice(1),
    content: getWindowContent(contentKey),
    defaultSize: config?.defaultSize || defaultFallbackSize
  }
}

// Type-safe content keys
export const CONTENT_KEYS = Object.keys(WINDOW_CONTENT) as Array<keyof typeof WINDOW_CONTENT>

// Utility to check if a content key exists
export const hasWindowContent = (contentKey: string): contentKey is keyof typeof WINDOW_CONTENT => {
  return contentKey in WINDOW_CONTENT
} 