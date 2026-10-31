/**
 * Dev Narayan C. B. — Portfolio Interactivity Engine
 * Features:
 * - Neural constellation canvas background
 * - Typewriter text rotator
 * - Interactive architecture visualizer
 * - Project category filtering
 * - Case study modal reader (blog-style deep dive)
 * - Interactive developer terminal (CLI modal)
 * - BibTeX & email copy with toast alerts
 * - Mobile nav drawer & scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initTypewriter();
    initNavbar();
    initProjectFilters();
    initArchitectureViewer();
    initCaseStudyDrawer();
    initTerminal();
    initClipboardActions();
    initScrollReveal();
});

/* ==========================================================================
   1. NEURAL CONSTELLATION CANVAS
   ========================================================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 1.8 + 0.8;
            this.color = Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
            this.baseAlpha = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse proximity interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 1.5;
                    this.y -= Math.sin(angle) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.baseAlpha + ')';
            ctx.fill();
        }
    }

    let particles = [];
    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((width * height) / 14000), 85);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby nodes
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < 110) {
                    const alpha = (1 - dist / 110) * 0.22;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.35;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;

    const phrases = [
        "AI & Computer Vision Researcher",
        "Agentic RAG Platforms & Real-Time Voice",
        "Self-Supervised Learning (Barlow Twins)",
        "Multimodal Eldercare & mmWave Radar",
        "Scaled Legal AI to 200+ Paying Users"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function tick() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 75;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before typing new
        }

        setTimeout(tick, typingSpeed);
    }
    tick();
}

/* ==========================================================================
   3. NAVBAR & ACTIVE SPY
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link spy
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach((sec) => {
            const sectionHeight = sec.offsetHeight;
            const sectionTop = sec.offsetTop - 120;
            const sectionId = sec.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Close on nav link click
        navLinks.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }
}

/* ==========================================================================
   4. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter || category.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* ==========================================================================
   5. INTERACTIVE ARCHITECTURE VIEWER
   ========================================================================== */
const archData = {
    frontend: {
        title: "React + Vite + TypeScript Client",
        tech: "React 18 · Vite · TypeScript · WebRTC SDK",
        description: "Zero-latency audio-video streaming interface. Renders an interactive doctor calendar picker, live dual chat transcripts, audio waveform visualizers, and tool execution badges.",
        latency: "< 35ms render",
        protocol: "WebRTC / HTTPS",
        role: "Client UI & Audio-Visual Stream Negotiation"
    },
    tokenserver: {
        title: "Python Token & Auth Server",
        tech: "Python 3.11 · aiohttp · PyJWT · Cryptography",
        description: "Asynchronous microservice managing caller sessions and security. Issues signed LiveKit room JWT tokens, authenticates returning phone numbers, and seeds context from the SQLite database.",
        latency: "< 80ms handshake",
        protocol: "REST HTTPS (aiohttp :8080)",
        role: "Security, Room Token Issuance & Caller Handshake"
    },
    livekit: {
        title: "LiveKit Cloud WebRTC SFU Mesh",
        tech: "LiveKit Cloud · Selective Forwarding Unit (SFU)",
        description: "Global low-latency WebRTC routing layer. Handles bidirectional audio distribution, sub-second video avatar streaming, automatic packet loss concealment, and dynamic bitrate adaptation.",
        latency: "15 - 50ms worldwide",
        protocol: "WebRTC DataChannels & RTP/SRTP",
        role: "Real-time Media Routing & Pub/Sub SFU"
    },
    worker: {
        title: "Autonomous Python Agent Worker",
        tech: "LiveKit Agents 1.x · Deepgram STT · Cartesia TTS · GPT-4o · Tavus",
        description: "Core intelligence brain. Coordinates streaming STT (Deepgram Nova-2), multi-turn reasoning with function calling (GPT-4o), expressive streaming voice synthesis (Cartesia), and Tavus photorealistic video avatar sync.",
        latency: "< 650ms full conversational turn",
        protocol: "Bidirectional WebSockets / Async Streams",
        role: "LLM Orchestration, Voice VAD, Tool Calls & Video Avatar"
    },
    database: {
        title: "Relational Persistence Store",
        tech: "SQLite (voice_agent.db) · Async Engine",
        description: "Thread-safe local store holding patient demographic records, doctor schedules, booked appointments, and AI-generated call summaries with structured diagnostic tags.",
        latency: "< 5ms read / write",
        protocol: "Async Local I/O",
        role: "Session Memory, Calendar Slots & Audit Logs"
    }
};

function initArchitectureViewer() {
    const nodes = document.querySelectorAll('.arch-node');
    const titleEl = document.getElementById('arch-detail-title');
    const descEl = document.getElementById('arch-detail-desc');
    const techEl = document.getElementById('arch-detail-tech');
    const latEl = document.getElementById('arch-detail-latency');
    const protoEl = document.getElementById('arch-detail-protocol');
    const roleEl = document.getElementById('arch-detail-role');

    if (!nodes.length || !titleEl) return;

    nodes.forEach((node) => {
        node.addEventListener('click', () => {
            nodes.forEach((n) => n.classList.remove('active'));
            node.classList.add('active');

            const key = node.getAttribute('data-node');
            const data = archData[key];

            if (data) {
                titleEl.textContent = data.title;
                descEl.textContent = data.description;
                if (techEl) techEl.textContent = data.tech;
                if (latEl) latEl.textContent = data.latency;
                if (protoEl) protoEl.textContent = data.protocol;
                if (roleEl) roleEl.textContent = data.role;
            }
        });
    });
}

/* ==========================================================================
   6. CASE STUDY DRAWER (BLOG-STYLE MODAL)
   ========================================================================== */
const caseStudies = {
    carevoice: {
        category: "Voice AI & Multi-Agent Architecture",
        title: "CareVoice AI: Real-Time Voice Agent & Tavus Video Avatar",
        subtitle: "A production-grade voice-first clinical agent coordinating Deepgram STT, OpenAI GPT-4o, Cartesia TTS, Tavus photorealistic avatar, and automated calendar scheduling.",
        demoUrl: "https://vercel.com/devcb13ds-projects/carevoice-ai",
        codeUrl: "https://github.com/DeVcB13d/carevoice-ai",
        deepDivePage: "carevoice-ai.html",
        content: `
            <h3>Overview</h3>
            <p>Traditional voice assistants are hindered by awkward 2-3 second latencies and lack visual empathy. CareVoice AI was built to solve this by creating a voice-first clinical intake agent with a human-like response time (under 650ms) and an interactive photorealistic doctor avatar powered by Tavus.</p>
            
            <h3>Core Engineering Features</h3>
            <ul>
                <li><strong>Voice-First Pipeline:</strong> Deepgram Nova-2 streaming STT feeding tokens into GPT-4o, instantly synthesized via Cartesia Sonic ultra-fast TTS over WebRTC.</li>
                <li><strong>Photorealistic AI Video Avatar:</strong> Tavus video stream synchronized with conversational speech, providing natural head motion and visual feedback.</li>
                <li><strong>Interactive Calendar Booking:</strong> Visual calendar where callers can inspect open doctor slots, confirm appointments via voice or click.</li>
                <li><strong>Session Memory:</strong> Identifies returning patients by phone number, retrieving previous consultations and history seamlessly.</li>
                <li><strong>Auto Call Summary:</strong> Dynamically compiles structured clinical notes, booked time slots, and patient preferences into SQLite.</li>
                <li><strong>Live Tool Feedback:</strong> On-screen indicators showing agent tool calls in real time (e.g. <em>"Checking doctor availability..."</em>).</li>
            </ul>

            <h3>System Architecture</h3>
            <p>Built with LiveKit Agents 1.x in Python, with a TypeScript + Vite React frontend and an aiohttp token server.</p>
        `
    },
    crowd: {
        category: "Computer Vision & Spatial Intelligence",
        title: "Crowd Analytics & Zone Flow Engine",
        subtitle: "A high-performance multi-threaded computer vision pipeline for real-time person detection, persistent tracking, and zone-based behavioral analytics.",
        demoUrl: "https://github.com/DeVcB13d/crowd_analytics/blob/main/outputs/final_annotated.mp4",
        codeUrl: "https://github.com/DeVcB13d/crowd_analytics",
        deepDivePage: "crowd-analytics.html",
        content: `
            <h3>Overview</h3>
            <p>Designed for transit hubs, pedestrian crossings, and secure facilities, this pipeline processes high-resolution video streams in real time using YOLOv8 detection and ByteTrack multi-object tracking, computing spatial dwell times and dominant group vector flow.</p>
            
            <h3>Key Capabilities</h3>
            <ul>
                <li><strong>Real-Time Detection &amp; Tracking:</strong> Accelerated YOLOv8 + ByteTrack maintaining persistent person IDs through heavy occlusion.</li>
                <li><strong>Arbitrary Zone Polygons:</strong> Operators define custom polygon boundaries (entrances, queues, walkways) to calculate localized footfall.</li>
                <li><strong>Directional Flow Estimation:</strong> Vector analysis determining primary group heading (North, South-East, etc.) and flagging counter-flow anomalies.</li>
                <li><strong>Automated Alerting:</strong> Logs threshold breaches to <code>logs/run.log</code> and publishes structured JSON events.</li>
                <li><strong>Modern Gradio Web Console:</strong> Interactive operator dashboard with live feed monitoring, zone drafting, and alert thresholds.</li>
            </ul>
        `
    },
    eldesign: {
        category: "Luxury Web Architecture & Editorial",
        title: "The El Design House — Bespoke Architectural Studio",
        subtitle: "“We do not merely decorate square footage; we choreograph atmosphere, light, and architectural harmony to evoke emotional resonance.”",
        demoUrl: "https://the-el-design-house.vercel.app/",
        codeUrl: "https://the-el-design-house.vercel.app/",
        deepDivePage: "el-design-house.html",
        content: `
            <h3>Design Philosophy</h3>
            <p>Founded on the uncompromising pursuit of architectural distinction, The El Design House operates as a bespoke interior design studio catering to discerning homeowners, luxury hospitality operators, and forward-thinking commercial enterprises worldwide.</p>
            
            <p>Our practice is distinguished by taking on only comprehensive, end-to-end commissions. By maintaining absolute control from the initial structural blueprint through fabrication to bespoke joinery, we safeguard the purity of the design vision.</p>
            
            <h3>Digital Craftsmanship</h3>
            <ul>
                <li>Architectural typography and generous negative space reflecting high-end editorial publications.</li>
                <li>Subtle GPU-accelerated motion choreography with fluid page transitions.</li>
                <li>Production deployment on Vercel with optimized asset caching and instant responsive loading.</li>
            </ul>
        `
    },
    lejit: {
        category: "Agentic RAG & Enterprise AI",
        title: "Lejit AI: Legal Copilot & Multilingual Indic OCR",
        subtitle: "First AI hire; architected and scaled an agentic RAG platform for legal professionals from prototype to 200+ paying customers.",
        demoUrl: "https://app.lejit.ai",
        codeUrl: "https://github.com/DeVcB13d/",
        deepDivePage: "legal-gpt.html",
        content: `
            <h3>Role &amp; Scale</h3>
            <p>As the first AI engineer hire at Lejit AI, spearheaded the design and rollout of the entire AI backend, growing the platform from zero to over 200+ paying legal firms and corporate counsel teams.</p>
            
            <h3>Technical Contributions</h3>
            <ul>
                <li><strong>Domain-Specific RAG:</strong> Fine-tuned LLMs and built multi-hop retrieval agents over Indian Supreme Court and High Court judgments, acts, and statutory rules.</li>
                <li><strong>Multilingual Indic OCR:</strong> Engineered a robust document-understanding engine capable of digitizing degraded physical court filings across Indic scripts and auto-linking case citations.</li>
                <li><strong>High-Throughput Backend:</strong> Designed asynchronous services with FastAPI and Node.js for real-time SSE token streaming, background document ingestion, and collaborative case review.</li>
                <li><strong>Vector Database Optimization:</strong> Deployed Milvus clusters with semantic caching, reducing median response latency by 68%.</li>
            </ul>
        `
    },
    animal: {
        category: "Self-Supervised Learning & Vision",
        title: "Tracking-by-Self Detection: SSL Multiple Animal Tracking",
        subtitle: "Research project at NTNU Norway: Self-supervised representation learning using Barlow Twins and EfficientDet, published at AIAI 2023 and BMVC 2023.",
        demoUrl: "https://doi.org/10.1007/978-3-031-34111-3_47",
        codeUrl: "https://github.com/FayazRahman/barlow-effdet",
        deepDivePage: "animal-tracking.html",
        content: `
            <h3>Research Background</h3>
            <p>Manual bounding-box annotation for livestock in agricultural settings is prohibitively expensive. We formulated a self-supervised animal detection pipeline employing a modified version of Barlow Twins in its pre-training stage.</p>
            
            <h3>Key Scientific Outcomes</h3>
            <ul>
                <li>Achieved consistent mAP boost across all detection thresholds without compromising model efficiency.</li>
                <li>Maintained real-time FPS video output on consumer-grade GPUs, making online tracking on the edge practical.</li>
                <li>Constructed an automated pseudo-labelling system to leverage large unannotated video datasets.</li>
                <li>Published in <strong>Springer AIAI 2023</strong> and the <strong>BMVC 2023</strong> Video Understanding Workshop.</li>
            </ul>
        `
    }
};

function initCaseStudyDrawer() {
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close-btn');
    const catEl = document.getElementById('drawer-category');
    const titleEl = document.getElementById('drawer-title');
    const subEl = document.getElementById('drawer-subtitle');
    const bodyEl = document.getElementById('drawer-content-html');
    const demoLink = document.getElementById('drawer-demo-link');
    const codeLink = document.getElementById('drawer-code-link');
    const pageLink = document.getElementById('drawer-page-link');

    if (!overlay) return;

    // Open drawer on button click
    document.querySelectorAll('.open-case-study-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-study');
            const data = caseStudies[key];
            if (!data) return;

            catEl.textContent = data.category;
            titleEl.textContent = data.title;
            subEl.textContent = data.subtitle;
            bodyEl.innerHTML = data.content;

            if (demoLink) demoLink.href = data.demoUrl;
            if (codeLink) codeLink.href = data.codeUrl;
            if (pageLink) pageLink.href = data.deepDivePage;

            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeDrawer = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeDrawer();
        }
    });
}

/* ==========================================================================
   7. INTERACTIVE DEVELOPER TERMINAL (CLI)
   ========================================================================== */
function initTerminal() {
    const overlay = document.getElementById('terminal-overlay');
    const openBtns = document.querySelectorAll('.open-terminal-trigger');
    const closeBtn = document.getElementById('terminal-close-btn');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!overlay || !input || !output) return;

    const toggleTerminal = (show) => {
        if (show === undefined) show = !overlay.classList.contains('open');
        if (show) {
            overlay.classList.add('open');
            input.focus();
            document.body.style.overflow = 'hidden';
        } else {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    openBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTerminal(true);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', () => toggleTerminal(false));

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleTerminal(false);
    });

    // Keyboard shortcut (tilde `~` or backtick)
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleTerminal();
            }
        } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
            toggleTerminal(false);
        }
    });

    const commands = {
        help: `Available commands:
  about           - Short background summary
  projects        - List featured AI & web projects
  experience      - Detailed career timeline (Lejit AI, NTNU, OnFocus)
  skills          - Technical skills & framework proficiencies
  architecture    - System architecture breakdown (CareVoice & RAG)
  publications    - Peer-reviewed conference papers
  contact         - Reach out via email, LinkedIn, or GitHub
  clear           - Clear terminal window
  exit            - Close terminal modal
  matrix          - Trigger cyberpunk mode`,

        about: `Dev Narayan C. B.
AI & Computer Vision Researcher | Agentic Systems Engineer
Education:
  • MSc in AI & Data Science — Cochin University of Science & Technology (2024-2026)
  • BSc in AI & Data Science — CUSAT (2021-2024) [CGPA: 9.5 / 10.0]
Focus:
  Real-time Vision, Self-Supervised Learning (Barlow Twins), Multimodal Radar/Wearable Sensing, and Production Agentic Voice Systems.`,

        projects: `Featured Projects:
  1. CareVoice AI         - Voice-first clinical agent + Tavus photorealistic avatar
  2. Crowd Analytics      - Real-time YOLOv8 + ByteTrack zone behavioral analytics
  3. The El Design House  - Bespoke luxury interior studio experience (Next.js)
  4. Lejit AI Legal RAG   - Scaled to 200+ paid users, Indian case-law search & OCR
  5. Animal Tracking SSL  - Barlow Twins + EfficientDet (AIAI & BMVC 2023)
  6. Multimodal HAR       - mmWave radar + Sensfloor + SOMNOtouch eldercare monitoring`,

        experience: `Professional Experience:
  • Lejit AI (First AI Hire / Lead): Scaled RAG platform to 200+ paying customers. Multilingual Indic OCR & FastAPI microservices.
  • NTNU Norway (Project Engineer): Eldercare multimodal sensing (mmWave radar, Sensfloor, wearables, mocap). Real-time Barlow Twins inference.
  • OnFocus Software (AI Engineer Intern): Customs document IDP engine with Azure OCR, Gemini, and GPT.`,

        skills: `Technical Skills:
  • AI & ML: PyTorch, TensorFlow, Barlow Twins SSL, LangChain, RAG, OpenAI GPT-4o, Gemini
  • Computer Vision: OpenCV, MediaPipe, YOLOv8, ByteTrack, EfficientDet, COLMAP 3D
  • Realtime Voice: LiveKit WebRTC, Deepgram Nova-2, Cartesia Sonic, Tavus Video
  • Systems: Python, C++, TypeScript, FastAPI, Node.js, Milvus, SQLite, Docker`,

        architecture: `CareVoice AI Data Flow:
  [React/TS Client] ──WebRTC──> [LiveKit SFU] ──> [Python Agent Worker]
                                                    ├── Deepgram STT
                                                    ├── GPT-4o Reasoning
                                                    ├── Cartesia TTS
                                                    └── Tavus Video Avatar
                                                       └── SQLite DB`,

        publications: `Peer-Reviewed Publications:
  1. "Tracking-by-Self Detection: A Self-supervised Framework for Multiple Animal Tracking"
     AIAI 2023, Springer IFIP AICT (DOI: 10.1007/978-3-031-34111-3_47)
  2. "Self-supervised Animal Detection in Constrained Environment"
     BMVC 2023 Video Understanding Workshop`,

        contact: `Contact Information:
  Email:    devcb1313@gmail.com / devnc@ntnu.no
  GitHub:   https://github.com/DeVcB13d
  LinkedIn: https://www.linkedin.com/in/c-b-dev-narayan-79b332227/`
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = input.value.trim();
            const cmd = rawVal.toLowerCase();
            input.value = '';

            if (!rawVal) return;

            // Echo input
            const item = document.createElement('div');
            item.className = 'terminal-history-item';
            item.innerHTML = `<span class="terminal-cmd-echo">devcb@workstation:~$ ${escapeHtml(rawVal)}</span>`;

            if (cmd === 'clear') {
                output.innerHTML = '';
                return;
            } else if (cmd === 'exit') {
                toggleTerminal(false);
                return;
            } else if (cmd === 'matrix') {
                item.innerHTML += `<div class="terminal-response" style="color: #10b981;">Wake up, Neo... Follow the white rabbit. 🐇\n[Matrix visual background initiated]</div>`;
            } else if (commands[cmd]) {
                item.innerHTML += `<div class="terminal-response">${escapeHtml(commands[cmd])}</div>`;
            } else {
                item.innerHTML += `<div class="terminal-response" style="color: #f87171;">Command not found: "${escapeHtml(cmd)}". Type "help" for a list of commands.</div>`;
            }

            output.appendChild(item);
            output.scrollTop = output.scrollHeight;
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ==========================================================================
   8. CLIPBOARD & TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(msg) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notice';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function initClipboardActions() {
    // Copy Email
    document.querySelectorAll('.copy-email-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const email = "devcb1313@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email copied to clipboard: devcb1313@gmail.com");
            });
        });
    });

    // Copy BibTeX
    document.querySelectorAll('.bibtex-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const bib = `@inproceedings{rahman2023tracking,
  title={Tracking-by-Self Detection: A Self-supervised Framework for Multiple Animal Tracking},
  author={Rahman, Fayaz and Narayan, C B Dev and others},
  booktitle={IFIP International Conference on Artificial Intelligence Applications and Innovations},
  pages={559--571},
  year={2023},
  publisher={Springer}
}`;
            navigator.clipboard.writeText(bib).then(() => {
                showToast("BibTeX citation copied to clipboard!");
            });
        });
    });
}

/* ==========================================================================
   9. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach((el) => observer.observe(el));
}
