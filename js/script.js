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
      setTimeout(typeText, 100); // Adjust speed here (lower = faster)
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