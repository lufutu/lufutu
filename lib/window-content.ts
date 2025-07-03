import type { DesktopIcon } from "@/types"

export interface WindowContentConfig {
  title: string
  icon: string
  content: string
  type: string
  windowId: string // Unique identifier for the window
  defaultSize: {
    width: number
    height: number
  }
  desktopIcon?: {
    label: string
    gridPosition: {
      row: number
      column: number
    }
  }
}

export const APP_CONTENT: Record<string, WindowContentConfig> = {
  home: {
    title: "Home",
    type: "program",
    icon: "/assets/icons/home.png",
    windowId: "home-window",
    content: `
      <div class="retro-content">
        <h2>Welcome to My Digital Space</h2>
        <p>Hey there! I'm Truong Vu Tu, a passionate full-stack developer with 15+ years of experience creating digital solutions that bridge functionality and innovation.</p>
        <div class="stats-box">
          <h3>Quick Stats</h3>
          <p>• 15+ Years Experience</p>
          <p>• 100+ Projects Delivered</p>
          <p>• Full-Stack Development</p>
          <p>• Technical Leadership</p>
          <p>• Startup Experience</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 },
    desktopIcon: {
      label: "Home",
      gridPosition: { row: 0, column: 0 }
    }
  },

  blog: {
    title: "Blog",
    type: "program",
    icon: "/assets/icons/blog.png",
    windowId: "blog-window",
    content: `
      <div class="retro-content">
        <h2>Latest Blog Posts</h2>
        <div class="blog-post">
          <h3>You're not a front-end developer until you've...</h3>
          <p class="date">10 JUNE 2025</p>
          <p>I've just passed the 15 year mark in my career as a developer...</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 400 },
    desktopIcon: {
      label: "Blog",
      gridPosition: { row: 1, column: 0 }
    }
  },

  work: {
    title: "Work",
    type: "program",
    icon: "/assets/icons/work.png",
    windowId: "work-window",
    content: `
      <div class="retro-content">
        <h2>Work Experience</h2>

        <div class="job-entry">
          <h3>Product Owner - Technical Leader</h3>
          <p class="company">Med247 (Startup) • 2018 - 2021</p>
          <p>Developed a Clinic Management System from scratch using React Native and NodeJS.</p>
        </div>

        <div class="job-entry">
          <h3>Senior Full Stack Developer</h3>
          <p class="company">Various Companies • 2010 - 2018</p>
          <p>Led development teams and delivered high-impact projects for multiple clients.</p>
        </div>

        <div class="job-entry">
          <h3>Web Developer</h3>
          <p class="company">Early Career • 2008 - 2010</p>
          <p>Started my journey building web applications and learning core technologies.</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 500 },
    desktopIcon: {
      label: "Work",
      gridPosition: { row: 2, column: 0 }
    }
  },

  about: {
    title: "About",
    type: "program",
    icon: "/assets/icons/about.png",
    windowId: "about-window",
    content: `
      <div class="retro-content">
        <h2>About Truong Vu Tu</h2>
        <p>I'm an experienced full-stack developer with 15+ years of expertise in web and mobile development. Born in Hanoi, Vietnam, I've worked with clients worldwide, from startups to established enterprises.</p>
        
        <div class="stats-box">
          <h3>Technical Skills</h3>
          <p>• Frontend: React, Vue, Angular</p>
          <p>• Backend: Node.js, Python, PHP</p>
          <p>• Mobile: React Native, Flutter</p>
          <p>• Database: MongoDB, PostgreSQL</p>
          <p>• DevOps: AWS, Docker, CI/CD</p>
        </div>

        <div class="stats-box">
          <h3>Soft Skills</h3>
          <p>• Technical Leadership</p>
          <p>• Project Management</p>
          <p>• Team Collaboration</p>
          <p>• Problem Solving</p>
          <p>• Communication</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 500 },
    desktopIcon: {
      label: "About",
      gridPosition: { row: 3, column: 0 }
    }
  },

  contact: {
    title: "Contact",
    type: "program",
    icon: "/assets/icons/contact.png",
    windowId: "contact-window",
    content: `
      <div class="retro-content">
        <h2>Get In Touch</h2>
        <p>I'm always interested in new opportunities and collaborations! Feel free to reach out for web development, mobile applications, or technical consulting.</p>
        <div class="contact-info">
          <p>📧 Email: truongvutu.dev@gmail.com</p>
          <p>🌐 Website: lufutu.com</p>
          <p>📱 Phone: On request</p>
          <p>📍 Location: Hanoi, Vietnam</p>
        </div>
        
        <div class="stats-box">
          <h3>Social Links</h3>
          <p>• GitHub: github.com/truongvutu</p>
          <p>• LinkedIn: linkedin.com/in/truongvutu</p>
          <p>• Twitter: twitter.com/truongvutu</p>
          <p>• Blog: blog.lufutu.com</p>
        </div>
      </div>
    `,
    defaultSize: { width: 500, height: 400 },
    desktopIcon: {
      label: "Contact",
      gridPosition: { row: 4, column: 0 }
    }
  },

  services: {
    title: "Services",
    type: "program",
    icon: "/assets/icons/service.png",
    windowId: "services-window",
    content: `
      <div class="retro-content">
        <h2>Professional Services</h2>
        <p>With 15+ years of experience, I offer comprehensive development solutions for businesses of all sizes.</p>
        
        <div class="job-entry">
          <h3>🌐 Full-Stack Development</h3>
          <p>End-to-end web application development using modern technologies.</p>
        </div>
        
        <div class="job-entry">
          <h3>📱 Mobile Development</h3>
          <p>Cross-platform mobile applications with React Native and Flutter.</p>
        </div>
        
        <div class="job-entry">
          <h3>💻 Technical Consulting</h3>
          <p>Expert advice on architecture, technology stack, and best practices.</p>
        </div>
        
        <div class="job-entry">
          <h3>🚀 MVP Development</h3>
          <p>Rapid prototyping and MVP development for startups.</p>
        </div>
        
        <div class="job-entry">
          <h3>🔧 System Integration</h3>
          <p>Seamless integration of third-party services and APIs.</p>
        </div>
        
        <div class="job-entry">
          <h3>📊 Technical Leadership</h3>
          <p>Team leadership, code reviews, and development process optimization.</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 600 },
    desktopIcon: {
      label: "Services",
      gridPosition: { row: 4, column: 1 }
    }
  },

  art: {
    title: "Art",
    type: "program",
    icon: "/assets/icons/art.png",
    windowId: "art-window",
    content: `
      <div class="retro-content">
        <h2>Digital Art & Design</h2>
        <p>Beyond coding, I enjoy creating digital art and exploring creative design solutions.</p>
        
        <div class="stats-box">
          <h3>Design Portfolio</h3>
          <p>• UI/UX Design</p>
          <p>• Digital Illustrations</p>
          <p>• Logo Design</p>
          <p>• Brand Identity</p>
          <p>• Motion Graphics</p>
        </div>
      </div>
    `,
    defaultSize: { width: 500, height: 400 },
    desktopIcon: {
      label: "Art",
      gridPosition: { row: 3, column: 1 }
    }
  },

  browser: {
    title: "Pixel Browser",
    type: "browser",
    icon: "/assets/icons/browser.png",
    windowId: "browser-window",
    content: `
      <div class="retro-content">
        <h2>🌐 Pixel Browser</h2>
        <p>A retro-style web browser for your nostalgic surfing needs.</p>
      </div>
    `,
    defaultSize: { width: 800, height: 600 },
    desktopIcon: {
      label: "Browser",
      gridPosition: { row: 2, column: 1 }
    }
  },

  habits: {
    title: "Habits",
    type: "program",
    icon: "/assets/icons/habit.png",
    windowId: "habits-window",
    content: "", // No HTML content needed as it uses a custom component
    defaultSize: { width: 400, height: 600 },
    desktopIcon: {
      label: "Habits",
      gridPosition: { row: 0, column: 1 }
    }
  },

  games: {
    title: "Games",
    type: "game",
    icon: "/assets/icons/game.png",
    windowId: "games-window",
    content: "", // No HTML content needed as it uses a custom component
    defaultSize: { width: 800, height: 600 },
    desktopIcon: {
      label: "Games",
      gridPosition: { row: 1, column: 1 }
    }
  },

  snake: {
    title: "Snake Game",
    type: "game",
    icon: "/assets/icons/Letter S Yellow_Blue.png",
    windowId: "snake-window",
    content: "", // Uses game component
    defaultSize: { width: 400, height: 700 }
  },

  pong: {
    title: "Pong Game",
    type: "game",
    icon: "/assets/icons/Circle_Blue.png",
    windowId: "pong-window",
    content: "", // Uses game component
    defaultSize: { width: 400, height: 400 }
  },

  memory: {
    title: "Memory Game",
    type: "game",
    icon: "/assets/icons/Letter M Yellow_Blue.png",
    windowId: "memory-window",
    content: "", // Uses game component
    defaultSize: { width: 400, height: 400 }
  },

  breakout: {
    title: "Breakout Game",
    type: "game",
    icon: "/assets/icons/Letter B Yellow_Blue.png",
    windowId: "breakout-window",
    content: "", // Uses game component
    defaultSize: { width: 400, height: 700 }
  },
}

// Memoized content cache for better performance
const contentCache = new Map<string, string>()
const defaultFallbackSize = { width: 600, height: 400 }

// Helper functions for better performance and reusability
export const getWindowContent = (contentKey: string): string => {
  // Check cache first for performance
  if (contentCache.has(contentKey)) {
    return contentCache.get(contentKey)!
  }
  
  const config = APP_CONTENT[contentKey]
  const content = config?.content || `<div class="retro-content"><h2>${contentKey}</h2><p>Content for ${contentKey} section.</p></div>`
  
  // Cache the content for future use
  contentCache.set(contentKey, content)
  return content
}

export const getWindowTitle = (contentKey: string): string => {
  const config = APP_CONTENT[contentKey]
  return config?.title || contentKey.charAt(0).toUpperCase() + contentKey.slice(1)
}

export const getWindowDefaultSize = (contentKey: string): { width: number; height: number } => {
  const config = APP_CONTENT[contentKey]
  return config?.defaultSize || defaultFallbackSize
}

// Helper function to get window configuration
export const getWindowConfig = (type: string): WindowContentConfig => {
  return APP_CONTENT[type] || {
    title: "Unknown Window",
    icon: "/assets/icons/Circle_Blue.png",
    content: "Content not found",
    defaultSize: { width: 400, height: 300 }
  }
}

// Helper function to get desktop icons configuration
export const getDesktopIcons = (): DesktopIcon[] => {
  return Object.entries(APP_CONTENT)
    .filter(([_, config]) => config.desktopIcon)
    .map(([id, config]) => {
      if (!config.desktopIcon?.gridPosition) {
        console.warn(`Icon ${id} is missing grid position, using default position`)
      }
      return {
        id,
        icon: config.icon,
        label: config.desktopIcon!.label,
        gridPosition: config.desktopIcon?.gridPosition || { row: 0, column: 0 }
      }
    })
}

// Type-safe content keys
export const CONTENT_KEYS = Object.keys(APP_CONTENT) as Array<keyof typeof APP_CONTENT>

// Utility to check if a content key exists
export const hasWindowContent = (contentKey: string): contentKey is keyof typeof APP_CONTENT => {
  return contentKey in APP_CONTENT
} 