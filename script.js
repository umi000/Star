// Interactivity: nav toggle, smooth scroll, forms, admin modal, IT ticket handling
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  navToggle && navToggle.addEventListener('click', function () {
    const visible = nav.getAttribute('data-visible') === 'true';
    nav.setAttribute('data-visible', String(!visible));
    navToggle.setAttribute('aria-expanded', String(!visible));
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('#primary-navigation a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 780) {
        nav.setAttribute('data-visible', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Admission form (client-side placeholder)
  const admissionForm = document.getElementById('admission-form');
  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = admissionForm.querySelector('input[name="name"]').value.trim();
      const email = admissionForm.querySelector('input[name="email"]').value.trim();
      if (!name || !email) {
        alert('Please fill in the required fields.');
        return;
      }
      alert('Thank you! Your application has been received. We will contact you shortly.');
      admissionForm.reset();
    });
  }

  // IT Helpdesk ticket form
  const itForm = document.getElementById('it-ticket-form');
  if (itForm) {
    itForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = itForm.querySelector('input[name="it-name"]').value.trim();
      const email = itForm.querySelector('input[name="it-email"]').value.trim();
      const issue = itForm.querySelector('textarea[name="it-issue"]').value.trim();
      if (!name || !email || !issue) {
        alert('Please provide name, email and a short description of the issue.');
        return;
      }
      // In production, POST to your service or mailer
      alert('IT Helpdesk: Your issue has been submitted. Our team will respond to ' + email + '.');
      itForm.reset();
    });
  }

  // Admin modal (placeholder)
  const adminModal = document.getElementById('admin-modal');
  const openAdminBtn = document.getElementById('open-admin-portal');
  const modalClose = adminModal ? adminModal.querySelector('.modal-close') : null;
  const adminForm = document.getElementById('admin-login');

  function showModal() {
    if (!adminModal) return;
    adminModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = adminModal.querySelector('input');
    if (firstInput) firstInput.focus();
  }
  function closeModal() {
    if (!adminModal) return;
    adminModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    openAdminBtn.focus();
  }

  openAdminBtn && openAdminBtn.addEventListener('click', showModal);
  modalClose && modalClose.addEventListener('click', closeModal);

  // Close modal on Esc or click outside dialog
  if (adminModal) {
    adminModal.addEventListener('click', function (e) {
      if (e.target === adminModal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && adminModal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // This is a mock — DO NOT use for real authentication
      const user = adminForm.querySelector('input[name="admin-user"]').value.trim();
      if (!user) {
        alert('Please enter a username.');
        return;
      }
      alert('Admin Portal (demo): Welcome, ' + user + '. For real admin access, implement secure server-side authentication.');
      adminForm.reset();
      closeModal();
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
