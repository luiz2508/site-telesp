const header = document.querySelector("#header");
const menu = document.querySelector("#nav-menu");
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section[id]");

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

navLinks.forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 6, 3) * 70}ms`;
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

const moreButton = document.querySelector("#more-plans");
const extraPlans = document.querySelector("#extra-plans");

moreButton.addEventListener("click", () => {
  const open = extraPlans.classList.toggle("open");
  extraPlans.setAttribute("aria-hidden", String(!open));
  moreButton.innerHTML = open ? "Ver menos planos <span>−</span>" : "Ver mais planos <span>＋</span>";
});

document.querySelectorAll(".plan-switch button").forEach(button => {
  button.addEventListener("click", event => {
    document.querySelectorAll(".plan-switch button").forEach(item => item.classList.remove("active"));
    event.currentTarget.classList.add("active");
  });
});

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const decimals = String(target).includes(".") ? 1 : 0;
    const duration = 1300;
    const start = performance.now();

    const animate = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = (target * eased).toFixed(decimals).replace(".", ",");
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.6 });

document.querySelectorAll(".counter").forEach(counter => counterObserver.observe(counter));

const speedNumber = document.querySelector(".speed-number");
let speedAnimated = false;

const speedObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || speedAnimated) return;
  speedAnimated = true;
  let value = 0;
  const timer = setInterval(() => {
    value += Math.ceil((550 - value) / 8);
    speedNumber.textContent = value;
    if (value >= 550) {
      speedNumber.textContent = "550";
      clearInterval(timer);
    }
  }, 40);
}, { threshold: 0.4 });

speedObserver.observe(document.querySelector(".speed-card"));
