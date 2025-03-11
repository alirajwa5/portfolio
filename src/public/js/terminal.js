class PortfolioTerminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.setupEventListeners();
        this.commands = {
            help: this.showHelp.bind(this),
            clear: this.clearTerminal.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            experience: this.showExperience.bind(this),
            education: this.showEducation.bind(this),
            projects: this.showProjects.bind(this),
            contact: this.showContact.bind(this),
            view: this.viewProject.bind(this),
            achievements: this.showAchievements.bind(this),
            certifications: this.showCertifications.bind(this),
            languages: this.showLanguages.bind(this),
            resume: this.downloadResume.bind(this),
            social: this.showSocial.bind(this),
            whoami: this.showWhoami.bind(this),
            date: () => this.writeToTerminal(new Date().toLocaleString()),
            ls: this.listCommands.bind(this),
            matrix: this.toggleMatrixEffect.bind(this),
            cv: this.showCV.bind(this)
        };
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete();
            }
        });

        // Focus input when clicking anywhere in the terminal
        document.querySelector('.terminal-container').addEventListener('click', () => {
            this.input.focus();
        });
    }

    autocomplete() {
        const input = this.input.value.trim();
        if (!input) return;

        const availableCommands = Object.keys(this.commands);
        const matchingCommands = availableCommands.filter(cmd => cmd.startsWith(input));

        if (matchingCommands.length === 1) {
            this.input.value = matchingCommands[0];
        } else if (matchingCommands.length > 1) {
            this.writeToTerminal('\nAvailable commands:');
            matchingCommands.forEach(cmd => this.writeToTerminal(cmd));
            this.writeToTerminal('');
        }
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
        } else if (direction === 'down' && this.historyIndex >= 0) {
            this.historyIndex--;
            if (this.historyIndex === -1) {
                this.input.value = '';
            } else {
                this.input.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
            }
        }
    }

    writeToTerminal(text, className = 'command-output') {
        const line = document.createElement('div');
        line.className = `terminal-output-line ${className}`;
        
        // Make commands in output clickable
        if (text.startsWith('  ') && text.includes(' - ')) {
            const [cmd, desc] = text.trim().split(' - ');
            line.className += ' clickable-command';
            line.innerHTML = `<span class="command-name">${cmd}</span> - <span class="command-desc">${desc}</span>`;
            line.addEventListener('click', () => {
                this.input.value = cmd;
                this.executeCommand();
            });
        } else {
            line.textContent = text;
        }
        
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    executeCommand() {
        const commandText = this.input.value.trim();
        if (!commandText) return;

        this.commandHistory.push(commandText);
        this.historyIndex = -1;

        this.writeToTerminal(`visitor@portfolio:~$ ${commandText}`, 'command-history');

        const [command, ...args] = commandText.split(' ');
        
        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.writeToTerminal(`Command not found: ${command}. Type 'help' for available commands.`, 'error-output');
        }

        this.input.value = '';
    }

    showHelp() {
        const commands = [
            { cmd: 'about', desc: 'Learn about me' },
            { cmd: 'achievements', desc: 'View my achievements and awards' },
            { cmd: 'certifications', desc: 'List my professional certifications' },
            { cmd: 'clear', desc: 'Clear the terminal' },
            { cmd: 'contact', desc: 'Get my contact information' },
            { cmd: 'cv', desc: 'Display my full CV' },
            { cmd: 'date', desc: 'Show current date and time' },
            { cmd: 'education', desc: 'View my educational background' },
            { cmd: 'experience', desc: 'Show my work experience' },
            { cmd: 'help', desc: 'Show this help message' },
            { cmd: 'languages', desc: 'List programming languages I know' },
            { cmd: 'ls', desc: 'List all available commands' },
            { cmd: 'matrix', desc: 'Toggle matrix rain effect' },
            { cmd: 'projects', desc: 'List my projects' },
            { cmd: 'resume', desc: 'Download my resume' },
            { cmd: 'skills', desc: 'Show my technical skills' },
            { cmd: 'social', desc: 'Display my social media links' },
            { cmd: 'whoami', desc: 'Display current user information' }
        ];

        this.writeToTerminal('Available commands:', 'success-output');
        commands.forEach(({ cmd, desc }) => {
            const cmdElement = document.createElement('div');
            cmdElement.className = 'clickable-command';
            cmdElement.innerHTML = `<span class="command-name">${cmd}</span> - <span class="command-desc">${desc}</span>`;
            cmdElement.addEventListener('click', () => {
                this.input.value = cmd;
                this.executeCommand();
            });
            this.output.appendChild(cmdElement);
        });

        this.writeToTerminal('\nPro tips:', 'success-output');
        this.writeToTerminal('- Click on any command to execute it');
        this.writeToTerminal('- Use Tab for command autocompletion');
        this.writeToTerminal('- Use Up/Down arrows to navigate command history');
    }

    clearTerminal() {
        const output = document.getElementById('terminal-output');
        output.innerHTML = '';
        
        // Show loading animation
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Clearing terminal...';
        output.appendChild(loadingText);
        
        setTimeout(() => {
            output.innerHTML = '';
            
            // Show matrix effect briefly
            this.createMatrixEffect();
            
            setTimeout(() => {
                // Remove matrix effect
                const matrix = document.querySelector('.matrix-rain');
                if (matrix) matrix.remove();
                
                // Show ASCII art and welcome message
                const asciiArt = document.createElement('div');
                asciiArt.className = 'ascii-art';
                asciiArt.innerHTML = `<pre>
    _    _ _   __  __       _                                      _ 
   / \\  | (_) |  \\/  |_   _| |__   __ _ _ __ ___  _ __ ___   __ _| |
  / _ \\ | | | | |\\/| | | | | '_ \\ / _\` | '_ \` _ \\| '_ \` _ \\ / _\`| |
 / ___ \\| | | | |  | | |_| | | | | (_| | | | | | | | | | | | (_| | |
/_/   \\_\\_|_| |_|  |_|\\__,_|_| |_|\\__,_|_| |_| |_|_| |_| |_|\\__,_|_|
                                                                      </pre>`;
                output.appendChild(asciiArt);
                
                const welcomeText = document.createElement('div');
                welcomeText.className = 'welcome-text';
                welcomeText.textContent = 'Terminal cleared. Type \'help\' to see available commands.';
                output.appendChild(welcomeText);
            }, 1000);
        }, 1500);
    }

    showAbout() {
        const aboutText = [
            'Laravel Full Stack Developer',
            '',
            'I am a passionate developer specializing in Laravel, PHP, and full-stack web development.',
            'Date of Birth: May 22, 2001',
            'Location: Federal B. Area, Karachi, Pakistan',
            '',
            'My core strengths include:',
            '- Laravel & PHP Development',
            '- RESTful API Development',
            '- Real-time Applications with Socket.IO',
            '- Database Design & Optimization',
            '- UI/UX Design',
            '',
            'Research Interests:',
            '- Digital Image Processing',
            '- Deep Learning',
            '- Artificial Intelligence',
            '',
            'Currently working as Senior Executive Laravel Developer at SybexLab, Karachi'
        ];
        aboutText.forEach(line => this.writeToTerminal(line));
    }

    showSkills() {
        const skills = {
            'Backend Development': [
                'Laravel', 'PHP', 'RESTful APIs',
                'Node.js', 'Socket.IO', 'MVC Architecture',
                'Livewire', 'API Development'
            ],
            'Frontend Development': [
                'Vue.js', 'JavaScript', 'HTML5',
                'CSS3', 'Bootstrap', 'UI Design',
                'Responsive Design'
            ],
            'Database & Tools': [
                'MySQL', 'Database Design',
                'Git', 'GitHub', 'Linux',
                'Adobe Photoshop', 'Adobe Illustrator'
            ],
            'Additional Skills': [
                '.NET Framework', 'C#', 'Java',
                'C++', 'Python', 'Mobile App Development',
                'MS Office'
            ],
            'Payment Integration': [
                'Stripe Payment Gateway',
                'E-billing Systems',
                'Payment Processing'
            ]
        };

        Object.entries(skills).forEach(([category, skillList]) => {
            this.writeToTerminal(`\n${category}:`, 'success-output');
            this.writeToTerminal(skillList.join(', '), 'command-output');
        });
    }

    showExperience() {
        const experience = [
            {
                role: 'Senior Executive Laravel Developer',
                company: 'SybexLab',
                location: 'Karachi',
                period: 'Nov 2023 - Present',
                responsibilities: [
                    'Building robust APIs and comprehensive API testing frameworks',
                    'Developing real-time chat applications using Socket.IO with Node.js',
                    'Implementing secure payment gateways and e-commerce solutions'
                ]
            },
            {
                role: 'Project Manager',
                company: '3Beez Technologies Pvt. Ltd',
                location: 'Gilgit',
                period: 'Apr 2023 - Aug 2023',
                responsibilities: [
                    'Led Land Acquisition Management System for DC Office Gilgit',
                    'Managed Assets Management System for Water and Irrigation Department',
                    'Coordinated with stakeholders and cross-functional teams',
                    'Ensured timely delivery and stakeholder satisfaction'
                ]
            },
            {
                role: 'Senior Web Developer',
                company: 'Sata Technologies Pvt. Ltd',
                location: 'Gilgit',
                period: 'Jul 2021 - Aug 2023',
                responsibilities: [
                    'Developed E-Billing platform (billing.wpdgb.gov.pk)',
                    'Implemented Asset Management System for Water and Power Department',
                    'Created AGGB Web Portal for pay slips and funds management',
                    'Developed Point of Sale system used in 30+ stores',
                    'Created Smart Installment Management System for 5+ stores',
                    'Designed Restaurant Management System for 9+ restaurants'
                ]
            },
            {
                role: 'Student Assistant',
                company: 'Karakoram International University',
                location: 'Gilgit',
                period: 'Mar 2023 - Jul 2023',
                responsibilities: [
                    'Led LMS development and testing',
                    'Conducted training sessions for schools',
                    'Developed APIs for Flutter application integration',
                    'Created comprehensive software documentation'
                ]
            }
        ];

        experience.forEach(job => {
            this.writeToTerminal(`\n${job.role} at ${job.company}`, 'success-output');
            this.writeToTerminal(`Location: ${job.location}`, 'command-output');
            this.writeToTerminal(`Period: ${job.period}`, 'command-output');
            this.writeToTerminal('Key Responsibilities:', 'command-output');
            job.responsibilities.forEach(resp => this.writeToTerminal(`- ${resp}`));
        });
    }

    showEducation() {
        const education = [
            {
                degree: 'Bachelor of Science in Computer Science',
                institution: 'Karakuram International University',
                location: 'Gilgit',
                period: 'Oct 2018 - Jun 2023',
                achievements: [
                    'Final Year Project: "North Trip Cycle" - Perfect 4.0 CGPA',
                    'Comprehensive travel platform integrating multiple services',
                    'Received high praise for innovation and practicality'
                ]
            }
        ];

        education.forEach(edu => {
            this.writeToTerminal(`\n${edu.degree}`, 'success-output');
            this.writeToTerminal(`Institution: ${edu.institution}, ${edu.location}`, 'command-output');
            this.writeToTerminal(`Period: ${edu.period}`, 'command-output');
            this.writeToTerminal('Achievements:', 'command-output');
            edu.achievements.forEach(achievement => this.writeToTerminal(`- ${achievement}`));
        });
    }

    showProjects() {
        const projects = [
            {
                name: 'North Trip Cycle',
                tech: 'Laravel, Vue.js, MySQL',
                description: 'Comprehensive travel platform integrating travel, dining, tour guide services, and accommodation.',
                features: [
                    'Multi-vendor system',
                    'Real-time booking management',
                    'Payment integration',
                    'Tour guide services',
                    'Accommodation booking'
                ]
            },
            {
                name: 'Laravel PDF Barcode Integration',
                tech: 'Laravel, PDF Processing',
                description: 'Solution for integrating barcodes/QR codes on individual PDF pages.',
                features: [
                    'Dynamic barcode generation',
                    'PDF manipulation',
                    'Multiple barcode formats',
                    'Page-specific integration',
                    'Batch processing capability'
                ]
            },
            {
                name: 'Stripe Payment Integration',
                tech: 'Laravel, Stripe API',
                description: 'Beginner-friendly solution for seamless Stripe payment integration.',
                features: [
                    'Easy setup process',
                    'Secure payment handling',
                    'Multiple payment methods',
                    'Webhook integration',
                    'Transaction management'
                ]
            }
        ];

        this.writeToTerminal('Featured Projects:', 'success-output');
        projects.forEach(project => {
            this.writeToTerminal(`\n${project.name}`, 'command-output');
            this.writeToTerminal(`Technologies: ${project.tech}`, 'command-output');
            this.writeToTerminal(`Description: ${project.description}`);
            this.writeToTerminal('Features:', 'command-output');
            project.features.forEach(feature => this.writeToTerminal(`- ${feature}`));
        });
    }

    showContact() {
        const contactInfo = [
            'Email: alimohdrajwa2@gmail.com',
            'Phone: +923488816515',
            'Location: Federal B. Area, Karachi, Pakistan',
            'LinkedIn: linkedin.com/in/alimohdrajwa',
            'GitHub: github.com/AliMuhammadRajwa',
            '',
            'Content Creator: "Laravel Daily Bytes" series on LinkedIn',
            'Sharing daily lessons on Laravel updates and packages'
        ];
        
        this.writeToTerminal('Contact Information:', 'success-output');
        contactInfo.forEach(info => this.writeToTerminal(info));
    }

    viewProject(args) {
        if (!args.length) {
            this.writeToTerminal('Please specify a project name. Example: view "E-commerce Platform"', 'error-output');
            return;
        }

        const projectName = args.join(' ');
        const projects = {
            'E-commerce Platform': {
                description: 'A comprehensive e-commerce solution built with modern technologies.',
                features: [
                    'Real-time inventory management',
                    'Multi-vendor support',
                    'Advanced search with Elasticsearch',
                    'Payment gateway integration',
                    'Analytics dashboard'
                ],
                technologies: [
                    'Laravel 8.x for backend',
                    'Vue.js 3 for frontend',
                    'MySQL for primary database',
                    'Redis for caching',
                    'Docker for containerization'
                ],
                architecture: [
                    'Microservices architecture',
                    'Event-driven design',
                    'CQRS pattern implementation',
                    'RESTful API design'
                ],
                github: 'https://github.com/alirajwa/ecommerce',
                demo: 'https://demo-ecommerce.alirajwa.dev'
            }
            // Add more projects here
        };

        const project = projects[projectName];
        if (project) {
            this.writeToTerminal(`\nProject: ${projectName}`, 'success-output');
            this.writeToTerminal(`\nDescription:`, 'command-output');
            this.writeToTerminal(project.description);
            
            this.writeToTerminal(`\nFeatures:`, 'command-output');
            project.features.forEach(feature => this.writeToTerminal(`- ${feature}`));
            
            this.writeToTerminal(`\nTechnologies:`, 'command-output');
            project.technologies.forEach(tech => this.writeToTerminal(`- ${tech}`));
            
            this.writeToTerminal(`\nArchitecture:`, 'command-output');
            project.architecture.forEach(item => this.writeToTerminal(`- ${item}`));
            
            this.writeToTerminal(`\nLinks:`, 'command-output');
            this.writeToTerminal(`GitHub: ${project.github}`);
            this.writeToTerminal(`Demo: ${project.demo}`);
        } else {
            this.writeToTerminal(`Project not found: ${projectName}`, 'error-output');
            this.writeToTerminal('Use "projects" command to see available projects.', 'command-output');
        }
    }

    showAchievements() {
        const achievements = [
            'Best Developer Award - Tech Solutions Inc. (2022)',
            'First Place - Regional Hackathon (2021)',
            'Open Source Contributor - 500+ contributions',
            'Speaker at TechConf 2023',
            'Published multiple technical articles'
        ];

        this.writeToTerminal('Achievements & Awards:', 'success-output');
        achievements.forEach(achievement => this.writeToTerminal(`- ${achievement}`));
    }

    showCertifications() {
        const certifications = [
            {
                name: 'Java Programming',
                issuer: 'Professional Certification'
            },
            {
                name: 'Python Programming for Everybody',
                issuer: 'Online Certification'
            }
        ];

        this.writeToTerminal('Professional Certifications:', 'success-output');
        certifications.forEach(cert => {
            this.writeToTerminal(`\n${cert.name}`, 'command-output');
            this.writeToTerminal(`Issuer: ${cert.issuer}`, 'command-output');
        });
    }

    showLanguages() {
        const languages = {
            'Expert': ['PHP', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
            'Proficient': ['Python', 'Java', 'SQL'],
            'Familiar': ['Go', 'Rust', 'C++']
        };

        this.writeToTerminal('Programming Languages:', 'success-output');
        Object.entries(languages).forEach(([level, langs]) => {
            this.writeToTerminal(`\n${level}:`, 'command-output');
            this.writeToTerminal(langs.join(', '));
        });
    }

    downloadResume() {
        this.writeToTerminal('Initiating resume download...', 'command-output');
        window.open('/resume.pdf', '_blank');
        this.writeToTerminal('Resume download started!', 'success-output');
    }

    showSocial() {
        const social = [
            {
                platform: 'GitHub',
                url: 'https://github.com/alirajwa',
                description: 'Check out my open-source contributions and personal projects'
            },
            {
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/ali-muhammad-rajwa',
                description: 'Connect with me professionally'
            },
            {
                platform: 'Twitter',
                url: 'https://twitter.com/alirajwa',
                description: 'Follow me for tech insights and updates'
            }
        ];

        this.writeToTerminal('Social Media Links:', 'success-output');
        social.forEach(platform => {
            this.writeToTerminal(`\n${platform.platform}:`, 'command-output');
            this.writeToTerminal(`URL: ${platform.url}`);
            this.writeToTerminal(`Description: ${platform.description}`);
        });
    }

    showWhoami() {
        const info = [
            'visitor@portfolio',
            'Welcome to my interactive portfolio!',
            'Type "help" to see available commands.'
        ];
        info.forEach(line => this.writeToTerminal(line));
    }

    listCommands() {
        const commands = Object.keys(this.commands).sort();
        this.writeToTerminal('Available commands:', 'success-output');
        commands.forEach(cmd => this.writeToTerminal(cmd));
    }

    toggleMatrixEffect() {
        const matrix = document.querySelector('.matrix-rain');
        if (matrix) {
            matrix.remove();
            this.writeToTerminal('Matrix effect disabled', 'success-output');
        } else {
            this.createMatrixEffect();
            this.writeToTerminal('Matrix effect enabled', 'success-output');
        }
    }

    createMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-rain';
        document.body.appendChild(canvas);

        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            context.fillStyle = 'rgba(0, 0, 0, 0.05)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#0F0';
            context.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];
                context.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);
    }

    showCV() {
        const cv = {
            summary: [
                "Full Stack Developer with expertise in Node.js, Express.js, and Nuxt.js",
                "Specialized in building scalable RESTful APIs and web applications",
                "Strong advocate for clean code and test-driven development"
            ],
            skills: {
                languages: ["JavaScript", "TypeScript", "HTML5", "CSS3/SCSS"],
                frameworks: ["Node.js", "Express.js", "Nuxt.js", "Vue.js", "NestJS"],
                databases: ["MongoDB", "PostgreSQL", "Redis", "Elasticsearch"],
                tools: ["Docker", "Git", "AWS", "Nginx", "PM2", "GitHub Actions"]
            },
            experience: [
                {
                    role: "Senior Full Stack Developer",
                    company: "Freelance",
                    period: "2021 - Present",
                    highlights: [
                        "Developed multiple scalable Node.js/Express.js APIs",
                        "Built frontend applications with Nuxt.js and Vue.js",
                        "Implemented microservices and API gateways",
                        "Managed database optimization and scaling"
                    ]
                },
                {
                    role: "Full Stack Developer",
                    company: "Various Projects",
                    period: "2019 - 2021",
                    highlights: [
                        "Created RESTful APIs with Node.js and Express.js",
                        "Developed responsive web applications",
                        "Implemented real-time features with WebSocket",
                        "Integrated third-party services and APIs"
                    ]
                }
            ],
            certifications: [
                "Node.js Advanced Concepts",
                "AWS Certified Developer",
                "MongoDB Database Administrator"
            ]
        };

        // Animated CV display with colors
        this.writeToTerminal('\n📄 CURRICULUM VITAE', 'cv-header');
        
        // Summary
        this.writeToTerminal('\n🎯 Professional Summary', 'cv-section');
        cv.summary.forEach(item => this.writeToTerminal(`• ${item}`, 'cv-text'));

        // Skills
        this.writeToTerminal('\n💻 Technical Skills', 'cv-section');
        Object.entries(cv.skills).forEach(([category, items]) => {
            this.writeToTerminal(`\n${category.charAt(0).toUpperCase() + category.slice(1)}:`, 'cv-category');
            this.writeToTerminal(items.join(', '), 'cv-skills');
        });

        // Experience
        this.writeToTerminal('\n👨‍💻 Professional Experience', 'cv-section');
        cv.experience.forEach(exp => {
            this.writeToTerminal(`\n${exp.role}`, 'cv-role');
            this.writeToTerminal(`${exp.company} (${exp.period})`, 'cv-company');
            exp.highlights.forEach(highlight => 
                this.writeToTerminal(`• ${highlight}`, 'cv-highlight')
            );
        });

        // Certifications
        this.writeToTerminal('\n🏆 Certifications', 'cv-section');
        cv.certifications.forEach(cert => 
            this.writeToTerminal(`• ${cert}`, 'cv-certification')
        );
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioTerminal();
}); 