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
        <p>Hey there! I'm Truong Vu Tu, a passionate full-stack developer with 15+ years of experience creating digital solutions that bridge functionality and innovation.</p>
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
          <p>I've just passed the 15 year mark of my career in web development! A lot of things have happened in that time, so I thought I would celebrate this milestone with this list, which is mostly comprised of little anecdotes/observations that I put on various social media platforms over the years.</p>
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
          <h3>Full-stack Developer</h3>
          <p class="company">Remitano (Remote) • 2021 - 2024</p>
          <p>Developed and enhanced features for crypto transaction platform using Ruby on Rails and React. Collaborated with cross-functional teams to ensure smooth transaction processing and platform scalability. Integrated new functionalities to improve user experience and platform security.</p>
        </div>
        
        <div class="job-entry">
          <h3>Product Owner - Technical Leader</h3>
          <p class="company">Med247 (Startup) • 2018 - 2021</p>
          <p>Developed a Clinic Management System using Ruby on Rails for small clinics. Deployed mobile applications on AppStore and Google Play with online/offline functionality. Integrated patient records, appointment scheduling, and billing management features.</p>
        </div>
        
        <div class="job-entry">
          <h3>Software Developer - Technical Leader</h3>
          <p class="company">BackVietnam – Asterix • 2011 - 2018</p>
          <p>Delivered custom solutions for UK and France-based clients. Developed a Headless CMS based on Ruby on Rails. Designed scalable backend architectures and managed complete project lifecycles from concept to completion.</p>
        </div>
        
        <div class="job-entry">
          <h3>Software Developer</h3>
          <p class="company">SmartOCS, Hanoi • 2010</p>
          <p>Developed high-performance eCommerce solutions using Magento for European clients. Enhanced Magento extensions and optimized website performance, security, and functionality.</p>
        </div>
        
        <div class="job-entry">
          <h3>Software Developer</h3>
          <p class="company">PTT Ltd, Hanoi • 2009 - 2010</p>
          <p>Developed PHP-based e-commerce solutions for American clients. Designed content management sites based on Joomla and developed iPhone applications for Sugar CRM.</p>
        </div>
      </div>
    `,
    defaultSize: { width: 650, height: 500 }
  },

  about: {
    title: "About",
    content: `
      <div class="retro-content">
        <h2>About Truong Vu Tu</h2>
        <p>I'm an experienced full-stack developer with 15+ years of expertise in web and mobile development. Born in Hanoi, Vietnam, I've worked with clients worldwide, from startups to established companies.</p>
        
        <div class="stats-box">
          <h3>Education</h3>
          <p>• Bachelor of Applied Science (B.A.SC.) - Northumbria University, UK (2011-2012)</p>
          <p>• Software Developer - NITT University, Hanoi (2007-2009)</p>
        </div>
        
        <div class="skills-section">
          <h3>Core Skills & Technologies</h3>
          <div class="skills-grid">
            <span class="skill-tag">Ruby on Rails</span>
            <span class="skill-tag">React</span>
            <span class="skill-tag">React Native</span>
            <span class="skill-tag">JavaScript</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">PHP</span>
            <span class="skill-tag">Python</span>
            <span class="skill-tag">Go</span>
            <span class="skill-tag">Swift</span>
            <span class="skill-tag">Java</span>
            <span class="skill-tag">GraphQL</span>
            <span class="skill-tag">MongoDB</span>
            <span class="skill-tag">MySQL</span>
            <span class="skill-tag">AWS</span>
            <span class="skill-tag">Azure</span>
            <span class="skill-tag">Google Cloud</span>
            <span class="skill-tag">Firebase</span>
            <span class="skill-tag">Supabase</span>
          </div>
        </div>
        
        <div class="stats-box">
          <h3>Interests & Hobbies</h3>
          <p>• Soccer and outdoor sports</p>
          <p>• Reading books and practicing mindfulness</p>
          <p>• Learning new technologies and AI tools</p>
        </div>
        
        <div class="stats-box">
          <h3>Professional Strengths</h3>
          <p>• Full product cycle experience</p>
          <p>• Strong team collaboration skills</p>
          <p>• Quick learning ability for new technologies</p>
          <p>• Excellent communication skills</p>
          <p>• Adaptability in competitive environments</p>
          <p>• Works well under pressure with tight deadlines</p>
        </div>
      </div>
    `,
    defaultSize: { width: 650, height: 600 }
  },

  contact: {
    title: "Contact",
    content: `
      <div class="retro-content">
        <h2>Get In Touch</h2>
        <p>I'm always interested in new opportunities and collaborations! Feel free to reach out for web development, mobile applications, or technical consulting.</p>
        <div class="contact-info">
          <p><img src="/assets/icons/Document_Blue.png" alt="Email" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> Email: truongvutu@gmail.com</p>
          <p><img src="/assets/icons/Document_Blue.png" alt="LinkedIn" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> LinkedIn: linkedin.com/in/lufutu</p>
          <p><img src="/assets/icons/Letter G Black_Blue.png" alt="GitHub" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> GitHub: github.com/lufutu</p>
          <p><img src="/assets/icons/Letter T Yellow_Blue.png" alt="Phone" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> Phone: +84 989 068 080</p>
          <p><img src="/assets/icons/Circle_Blue.png" alt="Location" width="16" height="16" style="display: inline; vertical-align: middle; margin-right: 8px;"> Location: Hanoi, Vietnam</p>
        </div>
        
        <div class="stats-box">
          <h3>Availability</h3>
          <p>• Open to remote and on-site opportunities</p>
          <p>• Available for freelance projects</p>
          <p>• Consulting and technical advisory services</p>
          <p>• Response time: Usually within 24 hours</p>
        </div>
      </div>
    `,
    defaultSize: { width: 600, height: 450 }
  },

  browser: {
    title: "Browser",
    content: `
      <div class="retro-content">
        <h2>🌐 Pixel Web Browser</h2>
        <p>Welcome to the Pixel Web Browser! Experience the internet in beautiful retro style.</p>
        <div class="stats-box">
          <h3>Features</h3>
          <p>• Visit pixel-themed websites</p>
          <p>• Retro terminal-style interface</p>
          <p>• Navigate with back/forward buttons</p>
          <p>• Address bar with URL navigation</p>
          <p>• Authentic Windows 95 browser chrome</p>
        </div>
      </div>
    `,
    defaultSize: { width: 800, height: 600 }
  },

  services: {
    title: "Services",
    content: `
      <div class="retro-content">
        <h2>Professional Services</h2>
        <p>With 15+ years of experience, I offer comprehensive development solutions for businesses of all sizes.</p>
        
        <div class="job-entry">
          <h3>🌐 Full-Stack Web Development</h3>
          <p>Custom web applications using modern frameworks like Ruby on Rails, React, and Node.js. From concept to deployment with scalable architecture.</p>
        </div>
        
        <div class="job-entry">
          <h3>📱 Mobile App Development</h3>
          <p>Native iOS (Swift) and Android (Java) applications, as well as cross-platform solutions using React Native. AppStore and Google Play deployment included.</p>
        </div>
        
        <div class="job-entry">
          <h3>🏥 Healthcare System Development</h3>
          <p>Specialized in clinic management systems, patient records, appointment scheduling, and HIPAA-compliant solutions with online/offline capabilities.</p>
        </div>
        
        <div class="job-entry">
          <h3>💰 Fintech & Crypto Solutions</h3>
          <p>Experience in building secure financial platforms, crypto exchanges, and payment processing systems with robust security measures.</p>
        </div>
        
        <div class="job-entry">
          <h3>🔧 Custom CMS Development</h3>
          <p>Headless CMS solutions that adapt to your specific business needs. Rapid deployment across multiple projects with flexible database structures.</p>
        </div>
        
        <div class="job-entry">
          <h3>☁️ Cloud Architecture & DevOps</h3>
          <p>AWS, Azure, Google Cloud deployment and optimization. Server security, vulnerability management, and performance optimization.</p>
        </div>
        
        <div class="job-entry">
          <h3>🎨 UI/UX Design & Prototyping</h3>
          <p>Modern interface design using Figma, Sketch, and Photoshop. User experience optimization and responsive design implementation.</p>
        </div>
        
        <div class="job-entry">
          <h3>🤖 AI Integration Services</h3>
          <p>Integration of AI services like OpenAI, Claude, and Llama3 for conversational AI, text processing, and automation solutions.</p>
        </div>
        
        <div class="stats-box">
          <h3>Technologies I Work With</h3>
          <p><strong>Backend:</strong> Ruby on Rails, PHP, Python, Go, Node.js</p>
          <p><strong>Frontend:</strong> React, JavaScript, TypeScript, HTML5, CSS3</p>
          <p><strong>Mobile:</strong> React Native, Swift (iOS), Java (Android)</p>
          <p><strong>Databases:</strong> MongoDB, MySQL, PostgreSQL</p>
          <p><strong>APIs:</strong> REST, GraphQL, Firebase, Supabase</p>
          <p><strong>Cloud:</strong> AWS, Azure, Google Cloud, Heroku, Vercel</p>
        </div>
      </div>
    `,
    defaultSize: { width: 700, height: 600 }
  },

  art: {
    title: "Art",
    content: `
      <div class="retro-content">
        <h2>Digital Art & Design</h2>
        <p>Beyond coding, I enjoy creating digital art and exploring creative design solutions.</p>
        
        <div class="stats-box">
          <h3>Design Portfolio</h3>
          <p>• UI/UX mockups and prototypes</p>
          <p>• Retro pixel art and graphics</p>
          <p>• Brand identity and logo design</p>
          <p>• Web graphics and illustrations</p>
        </div>
        
        <div class="stats-box">
          <h3>Tools & Software</h3>
          <p>• Figma - Interface design and prototyping</p>
          <p>• Sketch - UI design and wireframing</p>
          <p>• Photoshop - Digital art and photo editing</p>
          <p>• Aseprite - Pixel art creation</p>
        </div>
        
        <p>This portfolio website itself is an example of my design work, featuring a nostalgic Windows 95 aesthetic with modern functionality.</p>
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