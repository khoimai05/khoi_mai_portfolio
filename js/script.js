if (document.getElementById('my-work-link')) {
  document.getElementById('my-work-link').addEventListener('click', () => {
    document.getElementById('my-work-section').scrollIntoView({behavior: "smooth"})
  })
}

// Typing effect
const typedTextElement = document.getElementById('typed-text');
if (typedTextElement) {
  const textToType = "Hey, I'm Khoi!";
  let charIndex = 0;
  
  function typeText() {
    if (charIndex < textToType.length) {
      typedTextElement.textContent += textToType.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 250); // Adjust speed here (lower = faster)
    }
    // Removed the code that was removing the cursor
  }
  
  typeText();
}
// Scroll animation for project cards (all appear together)
const projectsContainer = document.querySelector('.projects-container');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add visible class to all project cards at once
      const cards = entry.target.querySelectorAll('.project-card');
      cards.forEach(card => card.classList.add('visible'));
    } else {
      // Remove visible class from all project cards
      const cards = entry.target.querySelectorAll('.project-card');
      cards.forEach(card => card.classList.remove('visible'));
    }
  });
}, observerOptions);

if (projectsContainer) {
  observer.observe(projectsContainer);
}

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

// Mouse tracking
canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
