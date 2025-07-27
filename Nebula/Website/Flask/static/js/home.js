document.addEventListener('DOMContentLoaded', () => {

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        },
        { threshold: 0.2 }
    );
    document.querySelectorAll('.card').forEach((c) => observer.observe(c));

    const engineeringCard = document.getElementById('engineering-card');
    const engineeringContent = document.getElementById('engineering-content');

    engineeringCard.addEventListener('click', () => {
        const isVisible = engineeringContent.style.display === 'block';
        if (isVisible) {
            engineeringContent.style.display = 'none';
            engineeringCard.setAttribute('aria-expanded', 'false');
            engineeringContent.setAttribute('aria-hidden', 'true');
        } else {
            engineeringContent.style.display = 'block';
            engineeringCard.setAttribute('aria-expanded', 'true');
            engineeringContent.setAttribute('aria-hidden', 'false');
            engineeringContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });


    engineeringCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            engineeringCard.click();
        }
    });
});
