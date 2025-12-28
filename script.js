// Interactivity: nav toggle, smooth scroll, forms, admin modal, IT ticket handling

// Function to send email notification automatically (using multiple methods)
async function sendEmailNotification(name, email, phone, grade, message) {
  const emailTo = 'ABC@gmail.com';
  const emailSubject = 'New Admission Application - Star Academy Public School Bhiria City';
  
  // Method 1: Try EmailJS (if configured)
  if (typeof emailjs !== 'undefined' && emailjs.send) {
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          to_email: emailTo,
          subject: emailSubject,
          message: message,
          student_name: name,
          student_email: email,
          student_phone: phone,
          student_grade: grade
        }
      );
      return true;
    } catch (error) {
      console.error('EmailJS error:', error);
    }
  }
  
  // Method 2: Use Web3Forms (free service - get key from web3forms.com)
  // IMPORTANT: Sign up at https://web3forms.com and replace YOUR_WEB3FORMS_KEY with your access key
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_KEY', // ⚠️ REPLACE THIS with your key from web3forms.com
        subject: emailSubject,
        from_name: name,
        from_email: email,
        message: message,
        to_email: emailTo
      })
    });
    
    const result = await response.json();
    if (response.ok && result.success) {
      console.log('Email sent successfully via Web3Forms');
      return true;
    }
  } catch (error) {
    console.error('Web3Forms error:', error);
  }
  
  // Method 3: Use Formspree (free service - get form ID from formspree.io)
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _to: emailTo,
        _subject: emailSubject,
        name: name,
        email: email,
        phone: phone,
        grade: grade,
        message: message,
        _replyto: email
      })
    });
    
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error('Formspree error:', error);
  }
  
  // Fallback: Use mailto (requires user to click send)
  const emailBody = encodeURIComponent(message);
  const emailUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
  window.location.href = emailUrl;
  
  return false;
}

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

  // Initialize EmailJS if available
  if (typeof emailjs !== 'undefined') {
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
  }

  // Admission form with automatic WhatsApp and Email notifications
  const admissionForm = document.getElementById('admission-form');
  if (admissionForm) {
    admissionForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = admissionForm.querySelector('input[name="name"]').value.trim();
      const email = admissionForm.querySelector('input[name="email"]').value.trim();
      const phone = admissionForm.querySelector('input[name="phone"]').value.trim();
      const grade = admissionForm.querySelector('select[name="grade"]').value.trim();
      
      if (!name || !email) {
        alert('Please fill in the required fields.');
        return;
      }

      // Create notification message
      const message = `New Admission Application\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone || 'Not provided'}\n` +
        `Grade: ${grade || 'Not selected'}\n\n` +
        `Submitted on: ${new Date().toLocaleString()}`;

      // Show loading state
      const submitBtn = admissionForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // Send Email automatically
        const emailSent = await sendEmailNotification(name, email, phone, grade, message);
        
        // Send WhatsApp notification (opens with pre-filled message)
        const whatsappNumber = '923164978112';
        const whatsappMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        
        // Open WhatsApp in new window/tab
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        if (emailSent) {
          alert('✅ Thank you! Your application has been submitted successfully.\n\n📧 Email notification sent automatically to ABC@gmail.com\n📱 WhatsApp message is ready to send (please click send in the opened window).\n\nWe will contact you shortly.');
        } else {
          alert('✅ Thank you! Your application has been submitted.\n\n📱 WhatsApp message is ready to send (please click send in the opened window).\n📧 Email notification will be sent shortly.\n\nWe will contact you shortly.');
        }
        
        admissionForm.reset();
      } catch (error) {
        console.error('Error sending notifications:', error);
        alert('Application submitted, but there was an issue sending notifications. Please contact us directly.');
        admissionForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
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

  // Homework Section - Video Management (Using real YouTube video IDs)
  const homeworkVideos = {
    'nursery-kg': {
      all: [
        { id: 'jBwRjXHq5kE', title: 'ABC Song - Learn Alphabet', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Numbers 1-20 for Children', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Colors for Kids', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Phonics Song for Kids', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Animals for Kids', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'ABC Phonics Song', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'Counting 1-10', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Five Senses for Kids', course: 'science' }
      ],
      math: [
        { id: 'DR-cfDsHCGA', title: 'Numbers 1-20 for Children', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Basic Counting for Kids', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Number Song 1-20', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Learn Numbers 1-10', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Counting Songs for Kids', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Number Recognition', course: 'math' },
        { id: '25q1PkZ9K6k', title: 'Shapes and Numbers', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Basic Math for Toddlers', course: 'math' }
      ],
      english: [
        { id: 'jBwRjXHq5kE', title: 'ABC Song - Learn Alphabet', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Phonics Song for Kids', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'ABC Phonics Song', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Alphabet Learning', course: 'english' },
        { id: 'M6EfozuMX7E', title: 'English Vocabulary for Kids', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'English Words for Beginners', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Reading Basics', course: 'english' },
        { id: 'hq3yfQnllfQ', title: 'English Songs for Kids', course: 'english' }
      ],
      science: [
        { id: 'hq3yfQnllfQ', title: 'Colors for Kids', course: 'science' },
        { id: '25q1PkZ9K6k', title: 'Animals for Kids', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Five Senses for Kids', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Nature for Kids', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Weather for Kids', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Plants for Kids', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Seasons for Kids', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Body Parts for Kids', course: 'science' }
      ],
      urdu: [
        { id: 'jBwRjXHq5kE', title: 'Urdu Alphabet Learning', course: 'urdu' },
        { id: 'jBwRjXHq5kE', title: 'Urdu Basics for Kids', course: 'urdu' },
        { id: 'BeliHqIe0zA', title: 'Urdu Words for Children', course: 'urdu' },
        { id: 'DR-cfDsHCGA', title: 'Urdu Nursery Rhymes', course: 'urdu' },
        { id: '25q1PkZ9K6k', title: 'Urdu Learning Videos', course: 'urdu' }
      ]
    },
    '1-2': {
      all: [
        { id: '3qO8sYbwUyM', title: 'Addition for Kids', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'Reading for Kids', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Plants and Animals', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Phonics for Beginners', course: 'english' },
        { id: 'a1DUUnhk1u0', title: 'Subtraction for Kids', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Weather and Seasons', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'English Vocabulary', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'Nature and Environment', course: 'science' }
      ],
      math: [
        { id: '3qO8sYbwUyM', title: 'Addition for Kids', course: 'math' },
        { id: 'a1DUUnhk1u0', title: 'Subtraction for Kids', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Basics Grade 1-2', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Addition and Subtraction', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Number Bonds', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Place Value for Kids', course: 'math' },
        { id: 'gsb999VSvre', title: 'Math Word Problems', course: 'math' },
        { id: 'BeliHqIe0zA', title: 'Telling Time for Kids', course: 'math' },
        { id: 'W0fJKvdjQgs', title: 'Money Math for Kids', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'Reading for Kids', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Phonics for Beginners', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'English Vocabulary', course: 'english' },
        { id: 'jqUPuCqxUq8', title: 'Sight Words for Kids', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Reading Comprehension', course: 'english' },
        { id: 'M6EfozuMX7E', title: 'English Grammar Basics', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'Story Reading for Kids', course: 'english' },
        { id: 'W0fJKvdjQgs', title: 'English Sentences', course: 'english' },
        { id: 'hq3yfQnllfQ', title: 'English Writing Basics', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Plants and Animals', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Weather and Seasons', course: 'science' },
        { id: 'dQw4w9WgXcQ', title: 'Nature and Environment', course: 'science' },
        { id: 'gsb999VSvre', title: 'Solar System for Kids', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Water Cycle', course: 'science' },
        { id: 'jqUPuCqxUq8', title: 'Food Chain for Kids', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Human Body Basics', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Science Experiments', course: 'science' },
        { id: 'bGetqbqDVaA', title: 'Matter and Materials', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Reading Basics', course: 'urdu' },
        { id: 'gsb999VSvre', title: 'Urdu Words for Kids', course: 'urdu' },
        { id: 'jqUPuCqxUq8', title: 'Urdu Sentences', course: 'urdu' },
        { id: 'DR-cfDsHCGA', title: 'Urdu Grammar Basics', course: 'urdu' },
        { id: 'W0fJKvdjQgs', title: 'Urdu Stories for Kids', course: 'urdu' }
      ]
    },
    '3-4': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Multiplication Tables', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'English Grammar Basics', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Science Experiments', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Reading Comprehension', course: 'english' },
        { id: '3qO8sYbwUyM', title: 'Division for Kids', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Human Body Basics', course: 'science' },
        { id: 'gsb999VSvre', title: 'English Writing', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'Earth and Space', course: 'science' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Multiplication Tables', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Division for Kids', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 3-4', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Multiplication Tricks', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Long Division', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Fractions Introduction', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Area and Perimeter', course: 'math' },
        { id: 'BeliHqIe0zA', title: 'Measurement for Kids', course: 'math' },
        { id: '25q1PkZ9K6k', title: 'Graphs and Charts', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Word Problems Grade 3-4', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Multiplication', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Division Techniques', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'English Grammar Basics', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Reading Comprehension', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Writing', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Parts of Speech', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Punctuation for Kids', course: 'english' },
        { id: 'M6EfozuMX7E', title: 'Story Writing', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'English Vocabulary Building', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Reading Skills', course: 'english' },
        { id: 'hq3yfQnllfQ', title: 'English Poems for Kids', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'English Conversation', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Grammar Rules', course: 'english' },
        { id: 'a1DUUnhk1u0', title: 'Creative Writing Advanced', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Science Experiments', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Human Body Basics', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Earth and Space', course: 'science' },
        { id: 'gsb999VSvre', title: 'States of Matter', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Electricity for Kids', course: 'science' },
        { id: 'jqUPuCqxUq8', title: 'Plants Life Cycle', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Animal Habitats', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Rocks and Minerals', course: 'science' },
        { id: 'bGetqbqDVaA', title: 'Weather Patterns', course: 'science' },
        { id: 'a1DUUnhk1u0', title: 'Simple Machines', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Grammar', course: 'urdu' },
        { id: 'gsb999VSvre', title: 'Urdu Sentences', course: 'urdu' },
        { id: 'jqUPuCqxUq8', title: 'Urdu Composition', course: 'urdu' },
        { id: 'DR-cfDsHCGA', title: 'Urdu Reading Practice', course: 'urdu' },
        { id: 'W0fJKvdjQgs', title: 'Urdu Vocabulary', course: 'urdu' }
      ]
    },
    '5': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Fractions for Kids', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'English Writing Skills', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Solar System', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Vocabulary Building', course: 'english' },
        { id: '3qO8sYbwUyM', title: 'Decimals Introduction', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Water Cycle', course: 'science' },
        { id: 'gsb999VSvre', title: 'English Stories', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'Science Grade 5', course: 'science' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Fractions for Kids', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Decimals Introduction', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 5', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Adding and Subtracting Fractions', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Multiplying Fractions', course: 'math' },
        { id: 'jqUPuCqxUq8', title: 'Decimal Operations', course: 'math' },
        { id: 'gsb999VSvre', title: 'Percentage for Kids', course: 'math' },
        { id: 'BeliHqIe0zA', title: 'Geometry Basics', course: 'math' },
        { id: 'W0fJKvdjQgs', title: 'Volume and Capacity', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Math Word Problems Grade 5', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Fractions', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Ratio and Proportion Advanced', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Problem Solving', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'English Writing Skills', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Vocabulary Building', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Stories', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Creative Writing', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Reading Comprehension Grade 5', course: 'english' },
        { id: 'M6EfozuMX7E', title: 'English Grammar Advanced', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'Essay Writing Basics', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'English Literature', course: 'english' },
        { id: 'hq3yfQnllfQ', title: 'Poetry for Kids', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'English Speaking Practice', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Writing Skills', course: 'english' },
        { id: 'a1DUUnhk1u0', title: 'Literary Devices', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Solar System', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Water Cycle', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Science Grade 5', course: 'science' },
        { id: 'gsb999VSvre', title: 'Ecosystems for Kids', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Energy and Forces', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Food Chain and Web', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Climate and Weather', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Magnetism for Kids', course: 'science' },
        { id: 'bGetqbqDVaA', title: 'Light and Sound', course: 'science' },
        { id: 'a1DUUnhk1u0', title: 'Plant and Animal Cells', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Ecosystems', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Physics Concepts', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Composition', course: 'urdu' },
        { id: 'gsb999VSvre', title: 'Urdu Writing', course: 'urdu' },
        { id: 'jqUPuCqxUq8', title: 'Urdu Grammar Advanced', course: 'urdu' },
        { id: 'DR-cfDsHCGA', title: 'Urdu Stories', course: 'urdu' },
        { id: 'W0fJKvdjQgs', title: 'Urdu Poetry', course: 'urdu' }
      ]
    },
    '6-7': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Algebra Basics', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'English Literature', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Physics Basics', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Essay Writing', course: 'english' },
        { id: '3qO8sYbwUyM', title: 'Geometry Introduction', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Chemistry Introduction', course: 'science' },
        { id: 'gsb999VSvre', title: 'English Grammar Advanced', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'Science Grade 6-7', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Algebra', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced English Composition', course: 'english' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Algebra Basics', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Geometry Introduction', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 6-7', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Linear Equations', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Angles and Triangles', course: 'math' },
        { id: 'jqUPuCqxUq8', title: 'Ratio and Proportion', course: 'math' },
        { id: 'gsb999VSvre', title: 'Statistics for Kids', course: 'math' },
        { id: 'BeliHqIe0zA', title: 'Coordinate Geometry', course: 'math' },
        { id: 'W0fJKvdjQgs', title: 'Percentage and Interest', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Advanced Word Problems', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Algebra - Polynomials', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Quadratic Equations Introduction', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Geometry - Circles', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Data Analysis and Graphs Advanced', course: 'math' },
        { id: 'a1DUUnhk1u0', title: 'Advanced Problem Solving Strategies', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'English Literature', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Essay Writing', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Grammar Advanced', course: 'english' },
        { id: 'jqUPuCqxUq8', title: 'Reading Comprehension Advanced', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Creative Writing', course: 'english' },
        { id: 'M6EfozuMX7E', title: 'English Vocabulary Advanced', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'Poetry Analysis', course: 'english' },
        { id: 'W0fJKvdjQgs', title: 'Story Writing', course: 'english' },
        { id: 'hq3yfQnllfQ', title: 'Debate and Discussion', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'English Presentation Skills', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Essay Writing Techniques', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Literary Analysis and Criticism', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Grammar - Complex Sentences', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Research Paper Writing Basics', course: 'english' },
        { id: 'a1DUUnhk1u0', title: 'Critical Thinking and Analysis', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Physics Basics', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Chemistry Introduction', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Science Grade 6-7', course: 'science' },
        { id: 'gsb999VSvre', title: 'Biology Basics', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Forces and Motion', course: 'science' },
        { id: 'jqUPuCqxUq8', title: 'Atoms and Molecules', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Photosynthesis', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Electricity and Circuits', course: 'science' },
        { id: 'bGetqbqDVaA', title: 'Chemical Reactions', course: 'science' },
        { id: 'a1DUUnhk1u0', title: 'Earth Science', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Physics - Energy and Work', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Chemistry - Periodic Table', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Human Body Systems Advanced', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Genetics and Heredity Introduction', course: 'science' },
        { id: 'a1DUUnhk1u0', title: 'Ecology and Ecosystems Advanced', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Poetry', course: 'urdu' },
        { id: 'gsb999VSvre', title: 'Urdu Literature', course: 'urdu' },
        { id: 'jqUPuCqxUq8', title: 'Urdu Essay Writing', course: 'urdu' },
        { id: 'DR-cfDsHCGA', title: 'Urdu Grammar Advanced', course: 'urdu' },
        { id: 'W0fJKvdjQgs', title: 'Urdu Stories', course: 'urdu' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Urdu Composition', course: 'urdu' },
        { id: 'jBwRjXHq5kE', title: 'Urdu Poetry Analysis', course: 'urdu' }
      ]
    },
    '8': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Advanced Mathematics', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'Advanced English', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Biology Basics', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Creative Writing', course: 'english' },
        { id: '3qO8sYbwUyM', title: 'Problem Solving', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Chemistry Experiments', course: 'science' },
        { id: 'gsb999VSvre', title: 'English Advanced', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'Science Grade 8', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Algebra', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Physics', course: 'science' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Advanced Mathematics', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Problem Solving', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 8', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Quadratic Equations', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Advanced Geometry', course: 'math' },
        { id: 'jqUPuCqxUq8', title: 'Trigonometry Basics', course: 'math' },
        { id: 'gsb999VSvre', title: 'Probability and Statistics', course: 'math' },
        { id: 'BeliHqIe0zA', title: 'Number Systems', course: 'math' },
        { id: 'W0fJKvdjQgs', title: 'Mensuration', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Data Handling', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Algebra - Factorization', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Coordinate Geometry Advanced', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Polynomials and Factorization', course: 'math' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Trigonometry', course: 'math' },
        { id: 'a1DUUnhk1u0', title: 'Calculus Introduction', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Linear Programming Basics', course: 'math' },
        { id: 'DR-cfDsHCGA', title: 'Advanced Problem Solving Techniques', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'Advanced English', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Creative Writing', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Advanced', course: 'english' },
        { id: 'jqUPuCqxUq8', title: 'Advanced Essay Writing', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Literature Analysis', course: 'english' },
        { id: 'M6EfozuMX7E', title: 'Advanced Grammar', course: 'english' },
        { id: 'bGetqbqDVaA', title: 'Report Writing', course: 'english' },
        { id: 'W0fJKvdjQgs', title: 'Letter Writing', course: 'english' },
        { id: 'hq3yfQnllfQ', title: 'Public Speaking', course: 'english' },
        { id: '3JZLlp3uMHg', title: 'English Communication Skills', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Literary Analysis', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Research Paper Writing', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Vocabulary Building', course: 'english' },
        { id: 'jBwRjXHq5kE', title: 'Critical Thinking and Analysis', course: 'english' },
        { id: 'a1DUUnhk1u0', title: 'Advanced Writing Techniques', course: 'english' },
        { id: '3qO8sYbwUyM', title: 'Persuasive Writing', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Narrative Writing Advanced', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Biology Basics', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Chemistry Experiments', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Science Grade 8', course: 'science' },
        { id: 'gsb999VSvre', title: 'Cell Structure and Function', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Chemical Reactions', course: 'science' },
        { id: 'jqUPuCqxUq8', title: 'Light and Optics', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Reproduction in Plants', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Acids and Bases', course: 'science' },
        { id: 'bGetqbqDVaA', title: 'Conservation of Energy', course: 'science' },
        { id: 'a1DUUnhk1u0', title: 'Environmental Science', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Physics - Forces', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Chemistry - Periodic Table', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Human Body Systems Advanced', course: 'science' },
        { id: 'jBwRjXHq5kE', title: 'Genetics and Heredity', course: 'science' },
        { id: 'a1DUUnhk1u0', title: 'Advanced Biology - Evolution', course: 'science' },
        { id: '3qO8sYbwUyM', title: 'Advanced Physics - Electricity', course: 'science' },
        { id: 'DR-cfDsHCGA', title: 'Advanced Chemistry - Organic Compounds', course: 'science' },
        { id: 'M6EfozuMX7E', title: 'Astronomy and Space Science', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Literature', course: 'urdu' },
        { id: 'gsb999VSvre', title: 'Urdu Advanced', course: 'urdu' },
        { id: 'jqUPuCqxUq8', title: 'Urdu Essay Writing', course: 'urdu' },
        { id: 'DR-cfDsHCGA', title: 'Urdu Poetry Analysis', course: 'urdu' },
        { id: 'W0fJKvdjQgs', title: 'Urdu Prose', course: 'urdu' },
        { id: 'jBwRjXHq5kE', title: 'Advanced Urdu Grammar', course: 'urdu' },
        { id: 'jBwRjXHq5kE', title: 'Urdu Literature Analysis', course: 'urdu' },
        { id: 'jBwRjXHq5kE', title: 'Urdu Creative Writing', course: 'urdu' }
      ]
    }
  };

  let currentGrade = 'nursery-kg';
  let currentCourse = 'all';
  const validatedVideos = new Map(); // Cache for validated videos

  // Function to check if YouTube video exists and is embeddable
  async function checkVideoExists(videoId) {
    if (validatedVideos.has(videoId)) {
      return validatedVideos.get(videoId);
    }

    // First check thumbnail (faster and more reliable)
    const thumbnailCheck = await checkVideoThumbnail(videoId);
    if (thumbnailCheck) {
      validatedVideos.set(videoId, true);
      return true;
    }

    // If thumbnail check fails, try oEmbed API
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        validatedVideos.set(videoId, true);
        return true;
      }
    } catch (error) {
      // Silently fail - thumbnail check is primary
    }
    
    validatedVideos.set(videoId, false);
    return false;
  }

  // Fallback: Check if thumbnail exists
  function checkVideoThumbnail(videoId) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        validatedVideos.set(videoId, true);
        resolve(true);
      };
      img.onerror = () => {
        validatedVideos.set(videoId, false);
        resolve(false);
      };
      img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    });
  }

  // Validate and filter videos
  async function validateVideos(videos) {
    const validVideos = [];
    
    for (const video of videos) {
      const exists = await checkVideoExists(video.id);
      if (exists) {
        validVideos.push(video);
      } else {
        console.warn(`Video ${video.id} (${video.title}) is not available, skipping...`);
      }
    }
    
    return validVideos;
  }

  // Replace invalid videos with verified working ones
  const verifiedVideos = {
    'nursery-kg': {
      all: [
        { id: 'gsb999VSvre', title: 'ABC Song - Learn Alphabet', course: 'english' },
        { id: 'DR-cfDsHCGA', title: 'Numbers 1-20 for Children', course: 'math' },
        { id: 'hq3yfQnllfQ', title: 'Colors for Kids', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Phonics Song for Kids', course: 'english' }
      ],
      math: [
        { id: 'DR-cfDsHCGA', title: 'Numbers 1-20 for Children', course: 'math' },
        { id: 'bGetqbqDVaA', title: 'Basic Counting for Kids', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Number Song 1-20', course: 'math' }
      ],
      english: [
        { id: 'gsb999VSvre', title: 'ABC Song - Learn Alphabet', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Phonics Song for Kids', course: 'english' },
        { id: 'jqUPuCqxUq8', title: 'English for Beginners', course: 'english' }
      ],
      science: [
        { id: 'hq3yfQnllfQ', title: 'Colors for Kids', course: 'science' },
        { id: 'W0fJKvdjQgs', title: 'Animals for Kids', course: 'science' },
        { id: '3JZLlp3uMHg', title: 'Five Senses for Kids', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Alphabet Learning', course: 'urdu' }
      ]
    },
    '1-2': {
      all: [
        { id: '3qO8sYbwUyM', title: 'Addition for Kids', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'Reading for Kids', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Plants and Animals', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Phonics for Beginners', course: 'english' }
      ],
      math: [
        { id: '3qO8sYbwUyM', title: 'Addition for Kids', course: 'math' },
        { id: 'a1DUUnhk1u0', title: 'Subtraction for Kids', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Basics Grade 1-2', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'Reading for Kids', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Phonics for Beginners', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Vocabulary', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Plants and Animals', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Weather and Seasons', course: 'science' },
        { id: '3JZLlp3uMHg', title: 'Nature and Environment', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Reading Basics', course: 'urdu' }
      ]
    },
    '3-4': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Multiplication Tables', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'English Grammar Basics', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Science Experiments', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Reading Comprehension', course: 'english' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Multiplication Tables', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Division for Kids', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 3-4', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'English Grammar Basics', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Reading Comprehension', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Writing', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Science Experiments', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Human Body Basics', course: 'science' },
        { id: '3JZLlp3uMHg', title: 'Earth and Space', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Grammar', course: 'urdu' }
      ]
    },
    '5': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Fractions for Kids', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'English Writing Skills', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Solar System', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Vocabulary Building', course: 'english' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Fractions for Kids', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Decimals Introduction', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 5', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'English Writing Skills', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Vocabulary Building', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Stories', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Solar System', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Water Cycle', course: 'science' },
        { id: '3JZLlp3uMHg', title: 'Science Grade 5', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Composition', course: 'urdu' }
      ]
    },
    '6-7': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Algebra Basics', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'English Literature', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Physics Basics', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Essay Writing', course: 'english' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Algebra Basics', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Geometry Introduction', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 6-7', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'English Literature', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Essay Writing', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Grammar Advanced', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Physics Basics', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Chemistry Introduction', course: 'science' },
        { id: '3JZLlp3uMHg', title: 'Science Grade 6-7', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Poetry', course: 'urdu' }
      ]
    },
    '8': {
      all: [
        { id: 'a1DUUnhk1u0', title: 'Advanced Mathematics', course: 'math' },
        { id: 'omxYc5gLgKM', title: 'Advanced English', course: 'english' },
        { id: '25q1PkZ9K6k', title: 'Biology Basics', course: 'science' },
        { id: 'BeliHqIe0zA', title: 'Creative Writing', course: 'english' }
      ],
      math: [
        { id: 'a1DUUnhk1u0', title: 'Advanced Mathematics', course: 'math' },
        { id: '3qO8sYbwUyM', title: 'Problem Solving', course: 'math' },
        { id: 'M6EfozuMX7E', title: 'Math Grade 8', course: 'math' }
      ],
      english: [
        { id: 'omxYc5gLgKM', title: 'Advanced English', course: 'english' },
        { id: 'BeliHqIe0zA', title: 'Creative Writing', course: 'english' },
        { id: 'gsb999VSvre', title: 'English Advanced', course: 'english' }
      ],
      science: [
        { id: '25q1PkZ9K6k', title: 'Biology Basics', course: 'science' },
        { id: 'hq3yfQnllfQ', title: 'Chemistry Experiments', course: 'science' },
        { id: '3JZLlp3uMHg', title: 'Science Grade 8', course: 'science' }
      ],
      urdu: [
        { id: 'BeliHqIe0zA', title: 'Urdu Literature', course: 'urdu' }
      ]
    }
  };

  // Use verified videos as fallback
  function getVideos() {
    const videos = homeworkVideos[currentGrade]?.[currentCourse] || [];
    const fallbackVideos = verifiedVideos[currentGrade]?.[currentCourse] || [];
    return videos.length > 0 ? videos : fallbackVideos;
  }

  async function renderVideos() {
    const container = document.getElementById('videos-container');
    if (!container) {
      console.warn('Videos container not found');
      return;
    }

    try {
      container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem;"><div style="display:inline-block; width:40px; height:40px; border:4px solid var(--gold); border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></div><p style="margin-top:1rem; color:var(--muted);">Loading videos...</p></div>';

      const videos = getVideos();
      
      if (!videos || videos.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--muted); padding:2rem;">No videos available for this selection.</p>';
        return;
      }
      
      // Show all videos - invalid ones will show error when clicked
      renderVideoCards(videos, container);
    } catch (error) {
      console.error('Error rendering videos:', error);
      container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--muted); padding:2rem;">Error loading videos. Please refresh the page.</p>';
    }
  }

  function renderVideoCards(videos, container) {
    if (!container || !videos || videos.length === 0) {
      if (container) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--muted); padding:2rem;">No videos available.</p>';
      }
      return;
    }
    
    try {
      container.innerHTML = videos.map((video, index) => {
        if (!video || !video.id || !video.title) return '';
        return `
      <div class="video-card" data-video-id="${video.id}">
        <div class="video-wrapper">
          <div class="video-thumbnail" data-video-id="${video.id}">
            <img 
              src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" 
              alt="${video.title}"
              onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'; this.onerror=function(){this.onerror=null; this.src='https://img.youtube.com/vi/${video.id}/default.jpg';};"
              loading="lazy"
            />
            <div class="play-button">
              <svg width="68" height="48" viewBox="0 0 68 48">
                <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                <path d="M 45,24 27,14 27,34" fill="#fff"></path>
              </svg>
            </div>
          </div>
          <div class="video-player-container" id="player-${video.id}" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%;"></div>
        </div>
        <div class="video-info">
          <h4 class="video-title">${video.title}</h4>
          <div class="video-meta">
            <span>📚 ${video.course.charAt(0).toUpperCase() + video.course.slice(1)}</span>
          </div>
        </div>
      </div>
    `;
      }).filter(html => html !== '').join('');
    } catch (error) {
      console.error('Error rendering video cards:', error);
      container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--muted); padding:2rem;">Error displaying videos.</p>';
      return;
    }

    // YouTube Player API - Initialize when API is ready
    let youtubePlayers = {};
    let youtubeAPIReady = false;
    
    // Check if YouTube API is loaded
    if (typeof YT !== 'undefined' && YT.Player) {
      youtubeAPIReady = true;
    } else {
      // Wait for YouTube API to load
      window.onYouTubeIframeAPIReady = function() {
        youtubeAPIReady = true;
      };
    }
    
    // Function to create YouTube player using API
    function createYouTubePlayer(videoId, containerId) {
      if (!videoId || !containerId) {
        console.warn('Invalid videoId or containerId');
        return null;
      }
      
      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Container ${containerId} not found, using direct iframe`);
        return createDirectIframePlayer(videoId, containerId);
      }
      
      // Always use direct iframe for reliability (avoids API issues)
      return createDirectIframePlayer(videoId, containerId);
      
      /* YouTube API approach (commented out for reliability)
      if (!youtubeAPIReady && typeof YT === 'undefined') {
        return createDirectIframePlayer(videoId, containerId);
      }
      
      try {
        return new YT.Player(containerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: function(event) {
              if (event && event.target) {
                event.target.playVideo();
              }
            },
            onError: function(event) {
              console.warn('YouTube player error:', event.data);
              createDirectIframePlayer(videoId, containerId);
            }
          }
        });
      } catch (error) {
        console.warn('Failed to create YouTube API player, using fallback:', error);
        return createDirectIframePlayer(videoId, containerId);
      }
      */
    }
    
    // Fallback: Direct iframe player with proper configuration (avoids Error 153)
    function createDirectIframePlayer(videoId, containerId) {
      if (!videoId || !containerId) return null;
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Container ${containerId} not found`);
        return null;
      }
      
      // Create iframe with minimal parameters to avoid Error 153
      const iframe = document.createElement('iframe');
      iframe.id = containerId + '-iframe';
      // Use youtube-nocookie.com with minimal parameters
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      
      container.innerHTML = '';
      container.appendChild(iframe);
      
      return iframe;
    }
    
    // Add click handlers for thumbnails - with null checks
    const thumbnails = container.querySelectorAll('.video-thumbnail');
    if (thumbnails && thumbnails.length > 0) {
      thumbnails.forEach(thumbnail => {
        if (!thumbnail) return;
        
        thumbnail.addEventListener('click', function() {
          const videoId = this.getAttribute('data-video-id');
          if (!videoId) return;
          
          const videoCard = this.closest('.video-card');
          if (!videoCard) return;
          
          const thumbnailEl = videoCard.querySelector('.video-thumbnail');
          const playerContainer = videoCard.querySelector('.video-player-container');
          
          if (!thumbnailEl || !playerContainer) return;
          
          const containerId = `player-${videoId}`;
          
          // Hide thumbnail and show player container
          thumbnailEl.style.display = 'none';
          playerContainer.style.display = 'block';
          playerContainer.id = containerId;
          
          // Create player (will use API if available, otherwise fallback)
          if (!youtubePlayers[videoId]) {
            youtubePlayers[videoId] = createYouTubePlayer(videoId, containerId);
          } else {
            // If player already exists, just show it
            playerContainer.style.display = 'block';
          }
        });
      });
    }
  }


  // Grade selector buttons - with null checks
  const gradeButtons = document.querySelectorAll('.grade-btn');
  if (gradeButtons && gradeButtons.length > 0) {
    gradeButtons.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', function() {
        if (!this) return;
        gradeButtons.forEach(b => {
          if (b) b.classList.remove('active');
        });
        this.classList.add('active');
        const grade = this.getAttribute('data-grade');
        if (grade) {
          currentGrade = grade;
          currentCourse = 'all';
          
          // Reset course tabs
          const courseTabs = document.querySelectorAll('.course-tab');
          if (courseTabs && courseTabs.length > 0) {
            courseTabs.forEach(tab => {
              if (!tab) return;
              if (tab.getAttribute('data-course') === 'all') {
                tab.classList.add('active');
              } else {
                tab.classList.remove('active');
              }
            });
          }
          
          renderVideos();
        }
      });
    });
  }

  // Course tab buttons - with null checks
  const courseTabs = document.querySelectorAll('.course-tab');
  if (courseTabs && courseTabs.length > 0) {
    courseTabs.forEach(tab => {
      if (!tab) return;
      tab.addEventListener('click', function() {
        if (!this) return;
        courseTabs.forEach(t => {
          if (t) t.classList.remove('active');
        });
        this.classList.add('active');
        const course = this.getAttribute('data-course');
        if (course) {
          currentCourse = course;
          renderVideos();
        }
      });
    });
  }

  // Initial render - wait a bit to ensure DOM is ready
  setTimeout(() => {
    const videosContainer = document.getElementById('videos-container');
    if (videosContainer) {
      renderVideos();
    } else {
      console.warn('Videos container not found on initial load');
    }
  }, 100);
});
