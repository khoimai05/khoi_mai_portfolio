// ─── Theme Toggle ─────────────────────────────────────────────────────────────

(function () {
    const STORAGE_KEY = 'theme';
    const saved = localStorage.getItem(STORAGE_KEY);

    function applyTheme(isLight) {
        document.body.classList.toggle('light-mode', isLight);
        const sun = document.querySelector('#theme-toggle .icon-sun');
        const moon = document.querySelector('#theme-toggle .icon-moon');
        if (sun) sun.style.display = isLight ? 'none' : 'block';
        if (moon) moon.style.display = isLight ? 'block' : 'none';
    }

    // Apply immediately on load (before paint) to avoid flicker
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        // Sync icons once DOM is ready
        applyTheme(document.body.classList.contains('light-mode'));

        btn.addEventListener('click', () => {
            const willBeLight = !document.body.classList.contains('light-mode');
            applyTheme(willBeLight);
            localStorage.setItem(STORAGE_KEY, willBeLight ? 'light' : 'dark');
        });
    });
})();

// ─────────────────────────────────────────────────────────────────────────────

// ─── Boot Sequence ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    if (!bootScreen || !bootText) {
        // If no boot screen, make sure scrolling is enabled
        document.body.style.overflow = '';
        return;
    }

    // Prevents scroll while booting
    document.body.style.overflow = 'hidden';

    // Scroll to top on load so the boot screen covers everything properly
    window.scrollTo(0, 0);

    const lines = [
        { text: "> Loading weights...", speed: 10, delay: 150 },
        { text: "> Establishing DB connection... [OK]", speed: 12, delay: 100 },
        { text: "> Initializing Khoi_Mai_Portfolio... [READY]", speed: 15, delay: 150 }
    ];

    let currentLineIndex = 0;

    function processLine() {
        if (currentLineIndex >= lines.length) {
            // Finish booting
            setTimeout(() => {
                bootScreen.classList.add('hidden');
                document.body.style.overflow = '';
            }, 500);
            
            // Remove DOM element after transition completes
            setTimeout(() => {
                bootScreen.remove();
            }, 1200);
            return;
        }

        const lineData = lines[currentLineIndex];
        const lineDiv = document.createElement('div');
        lineDiv.style.marginBottom = '6px';
        bootText.appendChild(lineDiv);

        let charIndex = 0;

        function typeChar() {
            if (charIndex < lineData.text.length) {
                lineDiv.textContent += lineData.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, lineData.speed + Math.random() * 10);
            } else {
                currentLineIndex++;
                setTimeout(processLine, lineData.delay);
            }
        }
        
        typeChar();
    }

    // Start boot sequence delay
    setTimeout(processLine, 50);
});

// ─────────────────────────────────────────────────────────────────────────────

if (document.getElementById('my-work-link')) {
    document.getElementById('my-work-link').addEventListener('click', () => {
        document.getElementById('work-experience-section').scrollIntoView({ behavior: "smooth" })
    })
}

// Scroll animation for project cards (all appear together per section)
const projectsContainers = document.querySelectorAll('.projects-container');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.project-card');
            cards.forEach(card => card.classList.add('visible'));
        }
    });
}, observerOptions);

projectsContainers.forEach(container => observer.observe(container));

// Data Grid Background Effect
const canvas = document.createElement('canvas');
canvas.id = 'constellation-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridSpacing = 60;
const dotRadius = 1.5;
const mouseRadius = 180;
const tickLen = 4;
let mouse = { x: null, y: null };

// Scatter data points that drift slowly
const scatterPoints = [];
const scatterCount = 25;

function seedRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 16807 + 0) % 2147483647;
        return s / 2147483647;
    };
}

function initScatterPoints() {
    scatterPoints.length = 0;
    const rng = seedRandom(42);
    for (let i = 0; i < scatterCount; i++) {
        scatterPoints.push({
            x: rng() * canvas.width,
            y: rng() * canvas.height,
            baseRadius: 2 + rng() * 2.5,
            vx: (rng() - 0.5) * 0.15,
            vy: (rng() - 0.5) * 0.15,
            opacity: 0.08 + rng() * 0.12,
        });
    }
}

initScatterPoints();

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width / gridSpacing) + 1;
    const rows = Math.ceil(canvas.height / gridSpacing) + 1;

    // Grid lines
    for (let i = 0; i < cols; i++) {
        const x = i * gridSpacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = 'rgba(207, 185, 145, 0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    for (let j = 0; j < rows; j++) {
        const y = j * gridSpacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = 'rgba(207, 185, 145, 0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Axis ticks along left edge and top edge
    ctx.strokeStyle = 'rgba(207, 185, 145, 0.12)';
    ctx.lineWidth = 1;
    for (let j = 0; j < rows; j++) {
        const y = j * gridSpacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(tickLen, y);
        ctx.stroke();
    }
    for (let i = 0; i < cols; i++) {
        const x = i * gridSpacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tickLen);
        ctx.stroke();
    }

    // Grid intersection dots with mouse proximity glow
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * gridSpacing;
            const y = j * gridSpacing;

            let radius = dotRadius;
            let opacity = 0.15;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - x;
                const dy = mouse.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseRadius) {
                    const proximity = 1 - dist / mouseRadius;
                    radius = dotRadius + proximity * 3;
                    opacity = 0.15 + proximity * 0.6;
                }
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(207, 185, 145, ${opacity})`;
            ctx.fill();
        }
    }

    // Floating scatter data points
    for (const pt of scatterPoints) {
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < 0 || pt.x > canvas.width) pt.vx *= -1;
        if (pt.y < 0 || pt.y > canvas.height) pt.vy *= -1;

        let r = pt.baseRadius;
        let o = pt.opacity;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - pt.x;
            const dy = mouse.y - pt.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius) {
                const proximity = 1 - dist / mouseRadius;
                r += proximity * 3;
                o += proximity * 0.35;

                // Crosshair on nearby scatter points
                ctx.strokeStyle = `rgba(207, 185, 145, ${proximity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pt.x - 8, pt.y);
                ctx.lineTo(pt.x + 8, pt.y);
                ctx.moveTo(pt.x, pt.y - 8);
                ctx.lineTo(pt.x, pt.y + 8);
                ctx.stroke();
            }
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(207, 185, 145, ${o})`;
        ctx.fill();
    }

    // Coordinate readout near cursor
    if (mouse.x !== null && mouse.y !== null) {
        const gridX = (mouse.x / gridSpacing).toFixed(1);
        const gridY = (mouse.y / gridSpacing).toFixed(1);
        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillStyle = 'rgba(207, 185, 145, 0.25)';
        ctx.fillText(`(${gridX}, ${gridY})`, mouse.x + 14, mouse.y - 10);
    }

    requestAnimationFrame(drawGrid);
}

drawGrid();

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initScatterPoints();
});


// Scroll Reveal for Sections
const aboutSection = document.getElementById('about-section');
const skillsSection = document.getElementById('skills-section');
const sqlSection = document.getElementById('sql-section');
const workExperienceSection = document.getElementById('work-experience-section');
const projectsHackathonSection = document.getElementById('projects-hackathon-section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

if (aboutSection) {
    sectionObserver.observe(aboutSection);
}

if (skillsSection) {
    sectionObserver.observe(skillsSection);
}

if (sqlSection) {
    sectionObserver.observe(sqlSection);
}

if (workExperienceSection) {
    sectionObserver.observe(workExperienceSection);
}

if (projectsHackathonSection) {
    sectionObserver.observe(projectsHackathonSection);
}

// Progress Bar
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// --- New Visual Polish Interactions ---

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
    // Only execute custom cursor logic on devices with a fine pointer (mouse/trackpad)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover state for the viewfinder rotation
        const interactables = document.querySelectorAll('a, button, .magnetic-btn, .magnetic-card, .project-card');

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }
}

// Smart Navbar
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
    });
}

// ─── SQL Terminal ────────────────────────────────────────────────────────────

const SQL_DB = {
    experience: [
        {
            company: 'Discovery Park',
            role: 'Data Science Researcher',
            period: 'Dec 2025 – Now',
            location: 'West Lafayette, IN',
            highlight: 'Regression models on 200K+ EV permits & 1M+ POI records across 150+ neighborhoods'
        },
        {
            company: 'Antsomi',
            role: 'Data Scientist Intern',
            period: 'Jun 2025 – Aug 2025',
            location: 'Ho Chi Minh City, VN',
            highlight: '89% accuracy model identifying 25K+ high-value prospects from 300K+ users monthly'
        },
        {
            company: 'VRAI Lab',
            role: 'NLP Research Assistant',
            period: 'Sep 2024 – Now',
            location: 'West Lafayette, IN',
            highlight: 'Pipelines ingesting 10K+ papers at 450+ papers/hour; LDA topic modeling for Purdue faculty'
        },
        {
            company: 'OCB',
            role: 'Analytics Engineer Intern',
            period: 'May 2024 – Aug 2024',
            location: 'Ho Chi Minh City, VN',
            highlight: '30% faster SQL queries via 3NF optimization; Power BI dashboards across 30+ provinces'
        },
    ],
    skills: [
        { name: 'Python', category: 'language' },
        { name: 'SQL', category: 'language' },
        { name: 'R', category: 'language' },
        { name: 'Scikit-learn', category: 'library' },
        { name: 'XGBoost', category: 'library' },
        { name: 'TensorFlow', category: 'library' },
        { name: 'PyTorch', category: 'library' },
        { name: 'PySpark', category: 'library' },
        { name: 'Pandas', category: 'library' },
        { name: 'NumPy', category: 'library' },
        { name: 'Git', category: 'technology' },
        { name: 'Docker', category: 'technology' },
        { name: 'AWS', category: 'technology' },
        { name: 'Power BI', category: 'technology' },
        { name: 'dbt', category: 'technology' },
    ],
    projects: [
        { name: 'Elite Edge', type: 'analytics platform', status: 'Running', link: 'https://www.eliteedge.one/' },
        { name: 'Microsoft Hackathon', type: 'hackathon', status: '2nd / 10 teams', link: 'https://www.linkedin.com/in/khoi-maix/' },
        { name: 'DS Playground', type: 'education', status: 'live', link: 'https://khoimai05.github.io/Data-Science-Playground/' },
    ],
};

function sqlParse(raw) {
    const q = raw.trim().replace(/\s+/g, ' ');

    // Supported: SELECT [DISTINCT] cols|COUNT(*) FROM table [WHERE col = 'val'] [ORDER BY col [ASC|DESC]] [LIMIT n]
    const m = q.match(
        /^SELECT\s+(DISTINCT\s+)?(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(\w+)\s*=\s*'([^']*)')?(?:\s+ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?)?(?:\s+LIMIT\s+(\d+))?$/i
    );
    if (!m) return { error: `-- syntax error. Supported: SELECT [DISTINCT] cols FROM table [WHERE col = 'val'] [ORDER BY col [ASC|DESC]] [LIMIT n]` };

    const [, distinctFlag, colsRaw, table, whereCol, whereVal, orderCol, orderDir, limitStr] = m;
    const tableName = table.toLowerCase();
    if (!SQL_DB[tableName]) return { error: `-- unknown table "${table}". Available: ${Object.keys(SQL_DB).join(', ')}` };

    const allCols = Object.keys(SQL_DB[tableName][0]);

    // COUNT(*)
    const isCount = /^COUNT\s*\(\s*\*\s*\)$/i.test(colsRaw.trim());

    let rows = [...SQL_DB[tableName]];

    // WHERE
    if (whereCol) {
        const col = whereCol.toLowerCase();
        if (!allCols.includes(col)) return { error: `-- unknown column "${whereCol}". Available: ${allCols.join(', ')}` };
        rows = rows.filter(r => {
            const v = r[col];
            return v !== undefined && String(v).toLowerCase().includes(whereVal.toLowerCase());
        });
    }

    // ORDER BY
    if (orderCol) {
        const col = orderCol.toLowerCase();
        if (!allCols.includes(col)) return { error: `-- unknown ORDER BY column "${orderCol}". Available: ${allCols.join(', ')}` };
        const dir = (orderDir || 'ASC').toUpperCase();
        rows.sort((a, b) => {
            const av = String(a[col] ?? '');
            const bv = String(b[col] ?? '');
            return dir === 'DESC' ? bv.localeCompare(av) : av.localeCompare(bv);
        });
    }

    // LIMIT
    if (limitStr) {
        rows = rows.slice(0, parseInt(limitStr, 10));
    }

    // COUNT(*) shortcut
    if (isCount) {
        return { cols: ['count(*)'], rows: [{ 'count(*)': rows.length }] };
    }

    const cols = colsRaw.trim() === '*' ? allCols : colsRaw.split(',').map(c => c.trim().toLowerCase());
    const invalidCols = cols.filter(c => !allCols.includes(c));
    if (invalidCols.length) return { error: `-- unknown column(s): ${invalidCols.join(', ')}. Available: ${allCols.join(', ')}` };

    // DISTINCT
    if (distinctFlag) {
        const seen = new Set();
        rows = rows.filter(r => {
            const key = cols.map(c => r[c]).join('||');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    return { cols, rows };
}

function sqlRender(result) {
    if (result.error) return `<div class="sql-error">${result.error}</div>`;
    if (result.rows.length === 0) return `<div class="sql-empty">-- 0 rows returned</div>`;

    const { cols, rows } = result;
    const widths = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length)));

    const pad = (s, w) => String(s ?? '').padEnd(w);
    const topBorder = '┌' + widths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
    const header = '│' + cols.map((c, i) => ` ${pad(c, widths[i])} `).join('│') + '│';
    const divider = '├' + widths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
    const dataRows = rows.map(r => '│' + cols.map((c, i) => ` ${pad(r[c], widths[i])} `).join('│') + '│');
    const bottomBorder = '└' + widths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';

    const lines = [topBorder, header, divider, ...dataRows, bottomBorder];
    const tableText = lines.join('\n');

    return `<pre class="sql-result-table">${tableText}</pre><div class="sql-rowcount">${rows.length} row${rows.length !== 1 ? 's' : ''}</div>`;
}

function sqlInit() {
    const terminal = document.getElementById('sql-terminal');
    if (!terminal) return;

    const output = terminal.querySelector('.sql-output');
    const chips = terminal.querySelectorAll('.sql-chip');

    function run(query) {
        if (!query.trim()) return;
        chips.forEach(c => c.classList.toggle('sql-chip-active', c.dataset.query === query));
        const result = sqlParse(query);
        const html = sqlRender(result);
        output.innerHTML = `<div class="sql-echo">› ${query}</div>${html}`;
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => run(chip.dataset.query));
    });
}

document.addEventListener('DOMContentLoaded', sqlInit);

// ─────────────────────────────────────────────────────────────────────────────

// Portrait Tilt Effect
const blobTilt = document.querySelector('.blob-tilt');

if (blobTilt && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const container = blobTilt.closest('#portfolio-header-image-container') || blobTilt.parentElement;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (centerY - y) / 12;
        const rotateY = (x - centerX) / 12;

        blobTilt.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    container.addEventListener('mouseleave', () => {
        blobTilt.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
}

// ─── GitHub Commit Graph ─────────────────────────────────────────────────────

function getGitHubTileClass(count) {
    return count >= 20
        ? 'github-level-4'
        : count >= 10
            ? 'github-level-3'
            : count >= 5
                ? 'github-level-2'
                : count >= 1
                    ? 'github-level-1'
                    : 'github-level-0';
}

function pinGitHubGraphRight() {
    const container = document.getElementById('github-commit-graph');
    if (!container) return;

    requestAnimationFrame(() => {
        container.scrollLeft = container.scrollWidth;
    });
}

function formatGitHubDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

function formatGitHubLabel(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    });
}

function buildGitHubWeeks(days) {
    if (!days || !days.length) return [];

    const normalized = [...days]
        .map(day => ({
            date: day.date,
            contributionCount: day.count ?? day.contributionCount ?? 0,
            weekday: new Date(`${day.date}T00:00:00Z`).getUTCDay(),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const weeks = [];
    let currentWeek = new Array(7).fill(null);

    for (let i = 0; i < normalized.length; i++) {
        const day = normalized[i];
        currentWeek[day.weekday] = day;

        const isLastDayOfWeek = day.weekday === 6;
        const isLastItem = i === normalized.length - 1;

        if (isLastDayOfWeek || isLastItem) {
            weeks.push(currentWeek);
            currentWeek = new Array(7).fill(null);
        }
    }

    return weeks;
}

async function initGitHubGraph() {
    const container = document.getElementById('github-commit-graph');
    if (!container) return;

    const username = 'khoimai05';
    const year = 'last';

    try {
        container.innerHTML = `<div class="github-graph-status">Loading contributions...</div>`;

        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);

        if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        const contributions = data.contributions || [];
        const weeks = buildGitHubWeeks(contributions);

        if (!weeks.length) {
            container.innerHTML = `<div class="github-graph-status">No contributions found.</div>`;
            return;
        }

        const firstDay = contributions[0];
        const lastDay = contributions[contributions.length - 1];

        const weeksHtml = weeks.map((week, weekIndex) => {
            const daysHtml = week.map((day, dayIndex) => {
                if (!day) {
                    return `<div class="github-tile-empty"></div>`;
                }

                const count = day.contributionCount;
                const label = `${count} commit${count === 1 ? '' : 's'} on ${formatGitHubDate(day.date)}`;

                return `
          <a
            class="github-tile ${getGitHubTileClass(count)}"
            href="https://github.com/${username}"
            target="_blank"
            rel="noreferrer"
            aria-label="${label}"
            title="${label}"
          ></a>
        `;
            }).join('');

            return `<div class="github-graph-week" data-week="${weekIndex}">${daysHtml}</div>`;
        }).join('');

        container.innerHTML = `
      <div class="github-graph-wrap">
        ${firstDay ? `<div class="github-graph-label">${formatGitHubLabel(firstDay.date)}</div>` : ''}
        <div class="github-graph-grid">${weeksHtml}</div>
        ${lastDay ? `<div class="github-graph-label" style="transform:none; writing-mode:vertical-rl;">${formatGitHubLabel(lastDay.date)}</div>` : ''}
      </div>
    `;
        pinGitHubGraphRight();
    } catch (error) {
        container.innerHTML = `<div class="github-graph-status">Failed to load GitHub contributions.</div>`;
    }
}

window.addEventListener('resize', pinGitHubGraphRight);
document.addEventListener('DOMContentLoaded', initGitHubGraph);
