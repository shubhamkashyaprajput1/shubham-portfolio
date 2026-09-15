/* ======================================================
   1. PRELOADER — fades out once the page has fully loaded
   ====================================================== */
window.addEventListener('load', () => {
	setTimeout(() => {
		document.getElementById('preloader').classList.add('hidden');
	}, 700);
});


/* ======================================================
   2. SCROLLSPY — highlights the active nav link on scroll
   ====================================================== */
const navAnchors = document.querySelectorAll('#navLinks a');
const sections = Array.from(navAnchors)
	.map((a) => document.getElementById(a.dataset.section))
	.filter(Boolean);

function setActiveNav(id) {
	navAnchors.forEach((a) => {
		a.classList.toggle('active', a.dataset.section === id);
	});
}

const spy = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) setActiveNav(entry.target.id);
		});
	},
	{ rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((sec) => spy.observe(sec));
navAnchors.forEach((a) => a.addEventListener('click', () => setActiveNav(a.dataset.section)));


/* ======================================================
   3. HERO ROLE ROTATOR — cycles the eyebrow text
   ====================================================== */
const roles = ["Website Designer", "UI/UX Designer", "WordPress Specialist", "Figma Expert"];
const rotatorEl = document.getElementById('roleRotator');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (rotatorEl && !reduceMotion) {
	let roleIndex = 0;
	setInterval(() => {
		rotatorEl.classList.add('fade');
		setTimeout(() => {
			roleIndex = (roleIndex + 1) % roles.length;
			rotatorEl.textContent = roles[roleIndex];
			rotatorEl.classList.remove('fade');
		}, 350);
	}, 2400);
}


/* ======================================================
   4. SERVICES — click-to-flip (for touch devices)
   ====================================================== */
document.querySelectorAll('.service-card').forEach((card) => {
	card.addEventListener('click', () => card.classList.toggle('is-flipped'));
});


/* ======================================================
   5. BACK TO TOP button
   ====================================================== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
	backToTop.classList.toggle('show', window.scrollY > 480);
});
backToTop.addEventListener('click', () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ======================================================
   6. PORTFOLIO LIGHTBOX — reads image/text straight from
      the HTML cards, no separate data list to keep in sync
   ====================================================== */
const grid = document.getElementById('portfolioGrid');
const overlay = document.getElementById('modalOverlay');
const box = document.getElementById('modalBox');
let currentIndex = 0;

function getCards() {
	// always all cards, regardless of active filter, so prev/next never gets stuck
	return Array.from(grid.querySelectorAll('.portfolio-card'));
}

function renderModal(index) {
	const cards = getCards();
	currentIndex = (index + cards.length) % cards.length;
	const card = cards[currentIndex];

	const img = card.querySelector('.portfolio-thumb img');
	const tag = card.querySelector('.portfolio-tag').textContent;
	const title = card.querySelector('h3').textContent;
	const extraHTML = card.querySelector('.modal-extra').innerHTML;

	box.innerHTML = `
		<div class="modal-img-wrap">
			<img class="modal-img" src="${img.getAttribute('src')}" alt="${img.getAttribute('alt')}">
			<div class="modal-nav prev" id="modalPrev" aria-label="Previous project">
				<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
			</div>
			<div class="modal-nav next" id="modalNext" aria-label="Next project">
				<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
			</div>
			<div class="modal-counter">${currentIndex + 1} / ${cards.length}</div>
		</div>
		<div class="modal-content">
			<button class="modal-close" id="modalClose" aria-label="Close">
				<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
			</button>
			<span class="modal-tag">${tag}</span>
			<h3>${title}</h3>
			${extraHTML}
		</div>
	`;

	document.getElementById('modalClose').addEventListener('click', closeModal);
	document.getElementById('modalPrev').addEventListener('click', () => renderModal(currentIndex - 1));
	document.getElementById('modalNext').addEventListener('click', () => renderModal(currentIndex + 1));
}

function openModal(index) {
	renderModal(index);
	overlay.classList.add('open');
	document.body.style.overflow = 'hidden';
}

function closeModal() {
	overlay.classList.remove('open');
	document.body.style.overflow = '';
}

grid.addEventListener('click', (e) => {
	const card = e.target.closest('.portfolio-card');
	if (!card) return;
	const index = getCards().indexOf(card);
	openModal(index);
});

overlay.addEventListener('click', (e) => {
	if (e.target.id === 'modalOverlay') closeModal();
});

document.addEventListener('keydown', (e) => {
	if (!overlay.classList.contains('open')) return;
	if (e.key === 'Escape') closeModal();
	if (e.key === 'ArrowRight') renderModal(currentIndex + 1);
	if (e.key === 'ArrowLeft') renderModal(currentIndex - 1);
});


/* ======================================================
   7. PORTFOLIO CATEGORY FILTER TABS
   ====================================================== */
const tabs = document.querySelectorAll('.tab-btn');
tabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		tabs.forEach((t) => t.classList.remove('active'));
		tab.classList.add('active');
		const filter = tab.dataset.filter;
		document.querySelectorAll('.portfolio-card').forEach((card) => {
			const match = filter === 'all' || card.dataset.category === filter;
			card.classList.toggle('is-hidden', !match);
		});
	});
});
