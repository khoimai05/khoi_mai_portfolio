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
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        typedTextElement.style.borderRight = 'none';
      }, 500);
    }
  }
  
  typeText();
}

// Scroll animation for project cards (with disappear on scroll up)
const projectCards = document.querySelectorAll('.project-card');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, observerOptions);

projectCards.forEach(card => {
  observer.observe(card);
});