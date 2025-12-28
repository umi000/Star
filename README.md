# Star Grammar High School — Static Site

This repository contains a responsive static website for Star Grammar High School (Bhiria City, Sindh).
Updates: principal and contact details updated; sample SVG images included for classroom, lab and admin office.

Files:
- `index.html` — main HTML file (must remain at the repo root)
- `style.css` — stylesheet
- `script.js` — JavaScript (navigation, forms, admin modal placeholder)
- `images/` — folder with sample SVG placeholders:
  - `images/classroom.svg`
  - `images/lab.svg`
  - `images/admin-office.svg`

Updated contact / admin info:
- Principal: Rao Asif
- Principal phone: 0302 3265987 (displayed as 03023265987)
- Admissions email: admissions.star@gmail.com
- Finance email: finance.star@gmail.com

Notes:
- Admin Portal is a placeholder modal only. Do NOT use for real credentials — implement a secure backend for authentication.
- IT Helpdesk form is a client-side mock. To collect tickets use Formspree, Netlify Forms or your server endpoint.
- Replace the SVG placeholders with real photos in `images/` (e.g. `images/school-building.jpg`) for a more polished look.

How to deploy on GitHub Pages:
1. Create a repository named `stargrammar` on your GitHub account (or use your existing repo).
2. Add `index.html`, `style.css`, `script.js` and the `images/` folder to the repository root.
3. Commit to the `main` branch.
4. Go to **Settings → Pages** in the repository.
   - Under "Build and deployment" choose Branch: `main` and folder: `/ (root)`.
   - Save.
5. After a minute, your site will be available at:
   `https://<your-username>.github.io/stargrammar/`

If you want, I can:
- Replace the SVG placeholders with sample JPG/PNG photos (I can provide data-URL images or direct download links),
- Connect the IT form to Formspree and show the exact HTML changes,
- Add a staff/teachers page or downloadable admission form PDF.
