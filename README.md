# Page Pulse

Page Pulse is a full-stack website audit tool built for the Digital Heroes Software Development internship task.

Instead of trying to be a large SEO platform, Page Pulse focuses on one simple workflow: enter a URL, run a quick audit, and get the most important page health signals in a clean report.

## Live Links

Frontend: Add Vercel link here  
Backend: Add Render link here  
GitHub Repository: Add GitHub link here  
Loom Walkthrough: Add Loom link here  

## What It Checks

Page Pulse audits a public HTML page and returns:

| Signal | Why It Matters |
|---|---|
| HTTP Status | Shows whether the page is reachable and responding correctly |
| Response Time | Gives a quick sense of page speed |
| Page Title | Important for SEO, browser tabs, and search snippets |
| Meta Description | Helps understand how the page may appear in search results |
| H1 Count | Checks basic page structure and content hierarchy |
| Images Missing Alt | Highlights accessibility and SEO improvement areas |
| Word Count | Gives a basic content-depth signal |

## Tech Stack

### Frontend

- React
- Vite
- CSS
- Lucide React icons

### Backend

- Node.js
- Express
- Axios
- Cheerio

### Testing

- Jest
- Supertest
- Nock

## Project Structure

```text
page-pulse/
  client/
    src/
      App.jsx
      styles.css
  server/
    src/
      index.js
      app.js
      services/
        auditService.js
      utils/
        errors.js
    tests/
      audit.test.js