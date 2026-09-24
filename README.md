# Durgesh Yadav — Portfolio (NOC / Server-Room Theme)

Second site in the same NOC style — content sourced from
[yadavdurgesh01.github.io/My-Portfolio](https://yadavdurgesh01.github.io/My-Portfolio/).

## Files

| File | Purpose |
|------|---------|
| `index.html` | Public portfolio site |
| `admin/index.html` | Super Admin — open at **`/admin/`** (no button on the site) |
| `content.js` | All site content (export from Admin to deploy) |
| `style.css` / `script.js` | Site theme & engine |
| `admin.css` / `admin.js` | Admin panel theme & logic |
| `assets/` | Photos (`profile.jpg`, `about.jpg`) + `resume.pdf` |

## Super Admin

1. Open **`/admin/`** directly (e.g. `https://yoursite.com/admin/`) — there is
   intentionally **no admin button** on the website.
2. Login: **`admin` / `Admin@123`** ← change this in **Settings** after first login.
3. Edit Hero & Stats, About, Skills, Experience, Education, Contact, **Photos**, **Resume**.
4. Contact-form messages land in **Admin → Messages**.
5. **Publish Changes** → updates show immediately in this browser.
6. For the live site: **Settings → Export content.js** → replace the file on your host.

## Resume section

- Visitors see a **Resume** section with a *Download Resume* button.
- Owner uploads the file in **Admin → Resume** (PDF/DOC, auto-embedded) **or**
  points it at a hosted path such as `assets/resume.pdf`.
- Until a file is set, the site shows "available on request".

## Photos

The original site's images were missing (404 on GitHub Pages), so initials **DY**
are shown until you upload photos in **Admin → Photos**.

## Run locally

```bash
python3 -m http.server 8081
# http://localhost:8081/          → site
# http://localhost:8081/admin/    → admin
```

## Notes

- No external libraries or CDNs — works offline and on any static host.
- Data reference: services, skills, experience, education, and contact details
  were taken from the reference portfolio; placeholder images/resume were not
  available there.
