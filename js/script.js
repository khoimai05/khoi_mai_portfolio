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

const observer = new IntersectionObserver(function (entries) {
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
  return function () {
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
