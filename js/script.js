"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("main section[id]");

  /* ---------- Header shadow on scroll ---------- */
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    navMenu.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "მენიუს დახურვა" : "მენიუს გახსნა");
  };

  navToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("is-open"));
  });

  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setMenu(false);
  });

  /* ---------- Active nav link ---------- */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validators = {
    name: (value) => (value.length >= 2 ? "" : "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს"),
    email: (value) => (emailPattern.test(value) ? "" : "შეიყვანე სწორი ელ-ფოსტა"),
    message: (value) => (value.length >= 10 ? "" : "შეტყობინება უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს"),
  };

  const validateField = (field) => {
    const error = validators[field.name](field.value.trim());
    const group = field.closest(".form__group");
    group.classList.toggle("has-error", Boolean(error));
    group.querySelector(".form__error").textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  };

  const fields = Array.from(form.querySelectorAll("input, textarea"));

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form__group").classList.contains("has-error")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successMsg.textContent = "";

    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }

    const name = document.getElementById("name").value.trim();
    successMsg.textContent = `მადლობა, ${name}! შენი შეტყობინება წარმატებით გაიგზავნა 🎉`;
    form.reset();
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
