// ===============================
// StudyHub Dashboard v1
// ===============================

const pages = {
  dashboard: {
    title: "Dashboard",
    html: `
      <section class="hero">
        <h3>Build your medical knowledge system.</h3>
        <p>
          StudyHub will organize textbooks, chapter notes, lecture slides, remediation,
          study maps, uploads, and search into one connected medical learning workspace.
        </p>
      </section>

      <section class="dashboard-grid">
        <article class="card">
          <h4>📚 Library</h4>
          <p>Textbooks, chapters, lecture slides, PDFs, and uploaded resources.</p>
        </article>
        <article class="card">
          <h4>📝 Notes</h4>
          <p>Chapter-based notes that can still be linked and found everywhere.</p>
        </article>
        <article class="card">
          <h4>🗺 Study Maps</h4>
          <p>Review checklists, concept maps, disease maps, and patient-care pathways.</p>
        </article>
        <article class="card">
          <h4>🩺 Remediation</h4>
          <p>Missed questions, rationales, weak topics, and review status.</p>
        </article>
      </section>

      <section class="panel-grid">
        <div class="panel">
          <h4>Continue Learning</h4>
          <div class="list">
            <div class="list-item">
              <div>
                <strong>Anatomy Chapter 19 — Blood</strong>
                <span>Current class focus</span>
                <div class="progress-bar"><div class="progress-fill" style="--value: 35%"></div></div>
              </div>
              <span class="badge">35%</span>
            </div>
            <div class="list-item">
              <div>
                <strong>Med-Surg — Fluid & Electrolytes</strong>
                <span>Linked to potassium and loop diuretics</span>
                <div class="progress-bar"><div class="progress-fill" style="--value: 18%"></div></div>
              </div>
              <span class="badge">18%</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4>Today’s Review</h4>
          <div class="list">
            <div class="list-item">
              <div>
                <strong>Potassium</strong>
                <span>Loop diuretics • Electrolytes</span>
              </div>
            </div>
            <div class="list-item">
              <div>
                <strong>Erythrocyte</strong>
                <span>Anatomy Ch. 19 • Blood</span>
              </div>
            </div>
            <div class="list-item">
              <div>
                <strong>Heart Failure</strong>
                <span>Study Map idea</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  },

  library: {
    title: "Library",
    html: `
      <section class="hero">
        <h3>📚 Library</h3>
        <p>Your source material will live here: textbooks, lecture slides, PDFs, Kaplan files, and professor notes.</p>
      </section>
      <section class="empty-state">Library builder coming next.</section>
    `
  },

  notes: {
    title: "Notes",
    html: `
      <section class="hero">
        <h3>📝 Notes</h3>
        <p>Notes will be created from chapters, slides, remediation, and study maps — then linked and searched everywhere.</p>
      </section>
      <section class="empty-state">Notes feature coming soon.</section>
    `
  },

  maps: {
    title: "Study Maps",
    html: `
      <section class="hero">
        <h3>🗺 Study Maps</h3>
        <p>Create review checklists or concept maps for diseases, disorders, body systems, and patient-care workflows.</p>
      </section>
      <section class="empty-state">Study Map builder coming soon.</section>
    `
  },

  remediation: {
    title: "Remediation",
    html: `
      <section class="hero">
        <h3>🩺 Remediation</h3>
        <p>Track missed Kaplan questions, rationales, weak areas, and review status.</p>
      </section>
      <section class="empty-state">Remediation tracker coming soon.</section>
    `
  },

  uploads: {
    title: "Uploads",
    html: `
      <section class="hero">
        <h3>📎 Uploads</h3>
        <p>Upload lecture slides, PDFs, diagrams, and personal documents, then link notes to exact files later.</p>
      </section>
      <section class="empty-state">Upload system coming soon.</section>
    `
  },

  search: {
    title: "Search",
    html: `
      <section class="hero">
        <h3>🔍 Search</h3>
        <p>Search chapters, notes, tags, study maps, remediation, lecture slides, and uploaded files.</p>
      </section>
      <section class="empty-state">Global search coming soon.</section>
    `
  },

  settings: {
    title: "Settings",
    html: `
      <section class="hero">
        <h3>⚙ Settings</h3>
        <p>Manage theme, Supabase connection, backups, and app preferences.</p>
      </section>
      <section class="empty-state">Settings coming soon.</section>
    `
  }
};

const appView = document.querySelector("#appView");
const pageTitle = document.querySelector("#pageTitle");
const navButtons = document.querySelectorAll(".nav-btn");
const sidebar = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menuBtn");
const globalSearch = document.querySelector("#globalSearch");

function renderPage(pageKey) {
  const page = pages[pageKey] || pages.dashboard;
  pageTitle.textContent = page.title;
  appView.innerHTML = page.html;

  navButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageKey);
  });

  if (window.innerWidth <= 980) {
    sidebar.classList.remove("open");
  }
}

navButtons.forEach(button => {
  button.addEventListener("click", () => {
    renderPage(button.dataset.page);
  });
});

menuBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

globalSearch?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    renderPage("search");
    const query = globalSearch.value.trim();
    if (query) {
      appView.innerHTML += `
        <section class="panel">
          <h4>Search query</h4>
          <p>You searched for: <strong>${query}</strong></p>
          <p class="badge">Search database will connect later.</p>
        </section>
      `;
    }
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(error => {
    console.warn("Service worker registration failed:", error);
  });
}

renderPage("dashboard");
