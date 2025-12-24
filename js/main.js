// Animaciones suaves: fade-in on scroll
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in', 'visible');
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Animaciones hover adicionales si es necesario
  // Los hover están manejados por CSS para mejor performance
});