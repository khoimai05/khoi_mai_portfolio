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

// Constellation Background Effect
const canvas = document.createElement('canvas');
canvas.id = 'constellation-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle settings
const particles = [];
const particleCount = 80;
const maxDistance = 150;
const mouseDistance = 200;
let mouse = { x: null, y: null };

// Create particles
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Mouse interaction
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (mouseDistance - distance) / mouseDistance;
        this.vx -= Math.cos(angle) * force * 0.05;
        this.vy -= Math.sin(angle) * force * 0.05;
      }
    }

    // Speed limit
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 2) {
      this.vx = (this.vx / speed) * 2;
      this.vy = (this.vy / speed) * 2;
    }
  }

  draw() {
    ctx.fillStyle = 'rgba(207, 185, 145, 0.8)'; // Purdue gold
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Draw connections
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.3;
        ctx.strokeStyle = `rgba(207, 185, 145, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  drawConnections();
  requestAnimationFrame(animate);
}

animate();

// Mouse tracking (on document since canvas has pointer-events: none)
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

// Typing Animation
const typingTexts = ["CS and DS Student", "Boilermaker", "Max Verstappen Fan"]
let typingCount = 0;
let typingIndex = 0;
let currentTypingText = "";
let currentLetter = "";
const typingElement = document.querySelector('.typing-text');
let isDeleting = false;

function typeEffect() {
  if (!typingElement) return;

  if (typingCount === typingTexts.length) {
    typingCount = 0;
  }

  currentTypingText = typingTexts[typingCount];

  if (isDeleting) {
    currentLetter = currentTypingText.slice(0, --typingIndex);
  } else {
    currentLetter = currentTypingText.slice(0, ++typingIndex);
  }

  typingElement.textContent = currentLetter;

  let typeSpeed = isDeleting ? 40 : 100;

  if (!isDeleting && currentLetter.length === currentTypingText.length) {
    typeSpeed = 2000; // Pause at end of word
    isDeleting = true;
  } else if (isDeleting && currentLetter.length === 0) {
    isDeleting = false;
    typingCount++;
    typeSpeed = 500; // Pause before new word
  }

  setTimeout(typeEffect, typeSpeed);
}

if (typingElement) {
  typeEffect();
}

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const position = btn.getBoundingClientRect();
    const x = e.clientX - position.left - position.width / 2;
    const y = e.clientY - position.top - position.height / 2;

    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
  });

  btn.addEventListener('mouseout', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});
