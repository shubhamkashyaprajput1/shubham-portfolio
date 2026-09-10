
// fade out the preloader once everything has loaded
window.addEventListener('load', () => {
	setTimeout(() => { document.getElementById('preloader').classList.add('hidden'); }, 700);
});

// portfolio tab filter (with a small loading spinner between filters)
const tabs = document.querySelectorAll('.tab-btn');
const cards = document.querySelectorAll('.portfolio-card');
const grid = document.getElementById('portfolioGrid');
const portfolioLoader = document.getElementById('portfolioLoader');

tabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		if (tab.classList.contains('active')) return;
		tabs.forEach((t) => t.classList.remove('active'));
		tab.classList.add('active');
		const filter = tab.dataset.filter;

		grid.classList.add('fading');
		setTimeout(() => {
			grid.style.display = 'none';
			portfolioLoader.classList.add('show');
		}, 200);

		setTimeout(() => {
			cards.forEach((card) => {
				const match = filter === 'all' || card.dataset.category === filter;
				card.classList.toggle('is-hidden', !match);
			});
			portfolioLoader.classList.remove('show');
			grid.style.display = 'grid';
			requestAnimationFrame(() => grid.classList.remove('fading'));
		}, 550);
	});
});

// scrollspy: highlight the nav link for whichever section is in view
const navAnchors = document.querySelectorAll('#navLinks a');
const sections = Array.from(navAnchors).map((a) => document.getElementById(a.dataset.section)).filter(Boolean);
const setActive = (id) => { navAnchors.forEach((a) => a.classList.toggle('active', a.dataset.section === id)); };
const spy = new IntersectionObserver((entries) => {
	entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach((sec) => spy.observe(sec));
navAnchors.forEach((a) => a.addEventListener('click', () => setActive(a.dataset.section)));

// hero role rotator — a small "live" touch, respects reduced-motion
const roles = ["Website Designer", "UI/UX Designer", "WordPress Specialist", "Figma Expert"];
const rotatorEl = document.getElementById('roleRotator');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (rotatorEl && !reduceMotion) {
	let ri = 0;
	setInterval(() => {
		rotatorEl.classList.add('fade');
		setTimeout(() => {
			ri = (ri + 1) % roles.length;
			rotatorEl.textContent = roles[ri];
			rotatorEl.classList.remove('fade');
		}, 350);
	}, 2400);
}

// services: click-to-flip too, for touch devices
document.querySelectorAll('.service-card').forEach((card) => {
	card.addEventListener('click', () => card.classList.toggle('is-flipped'));
});

// back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
	backToTop.classList.toggle('show', window.scrollY > 480);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
