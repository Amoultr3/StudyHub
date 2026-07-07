// ===============================
// StudyHub v0.3 OneDrive Resources
// Local storage version
// ===============================

const STORAGE_KEY = "studyhub.resources.v03";
let activeResourceId = null;
let editingResourceId = null;
let notesEditorOpen = false;

const seedResources = [
  {
    id: crypto.randomUUID(),
    title: "Anatomy Textbook",
    type: "Textbook",
    subject: "Anatomy",
    author: "",
    edition: "",
    fileName: "",
    fileSize: "",
    localLocation: "OneDrive / StudyHub Resources / 01 Textbooks",
    driveLink: "",
    status: "Not linked",
    indexStatus: "Not indexed",
    tags: ["blood", "body systems", "chapter 19"],
    notes: "Current class focus: Chapter 19 — Blood. Add your OneDrive link when the PDF is uploaded.",
    chapters: [
      "Chapter 19 — Blood",
      "Chapter 20 — The Heart",
      "Chapter 21 — Blood Vessels and Circulation"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Medical-Surgical Nursing",
    type: "Textbook",
    subject: "Med-Surg",
    author: "Hinkle and Cheever",
    edition: "",
    fileName: "",
    fileSize: "",
    localLocation: "OneDrive / StudyHub Resources / 01 Textbooks",
    driveLink: "",
    status: "Not linked",
    indexStatus: "Not indexed",
    tags: ["nursing", "med-surg", "textbook"],
    notes: "Main nursing textbook. Later: add units, chapters, and chapter notes.",
    chapters: [
      "Unit 1 — Concepts in Nursing Practice",
      "Unit 2 — Alterations in Patterns of Health",
      "Unit 3 — Pathophysiologic Mechanisms of Disease"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Pharmacology Lecture — Diuretics",
    type: "Lecture Slides",
    subject: "Pharmacology",
    author: "Professor lecture",
    edition: "Week 4",
    fileName: "",
    fileSize: "",
    localLocation: "OneDrive / StudyHub Resources / 02 Lecture Slides",
    driveLink: "",
    status: "Not linked",
    indexStatus: "Not indexed",
    tags: ["potassium", "loop diuretics", "electrolytes"],
    notes: "Example note link: Potassium is monitored closely when giving loop diuretics.",
    chapters: [],
    createdAt: new Date().toISOString()
  }
];

function getResources() {
  const savedV03 = localStorage.getItem(STORAGE_KEY);

  if (savedV03) {
    try {
      return JSON.parse(savedV03);
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedResources));
      return seedResources;
    }
  }

  // Migrate v0.2 resources if present
  const savedV02 = localStorage.getItem("studyhub.resources.v02");
  if (savedV02) {
    try {
      const migrated = JSON.parse(savedV02).map(resource => ({
        ...resource,
        fileSize: resource.fileSize || "",
        localLocation: resource.localLocation || "",
        driveLink: resource.driveLink || "",
        indexStatus: resource.indexStatus || "Not indexed",
        chapters: resource.chapters || []
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedResources));
      return seedResources;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedResources));
  return seedResources;
}

function saveResources(resources) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

function getResourceIcon(type) {
  const icons = {
    "Textbook": "📚",
    "Lecture Slides": "🖥️",
    "PDF": "📄",
    "Kaplan / NCLEX": "🩺",
    "Professor Notes": "📝",
    "Image / Diagram": "🖼️",
    "Other": "📎"
  };

  return icons[type] || "📎";
}

function getStatusBadgeClass(status) {
  if (status === "Linked") return "green";
  if (status === "Ready to index" || status === "Indexed") return "gold";
  return "";
}

const pages = {
  dashboard: {
    title: "Dashboard",
    render() {
      const resources = getResources();
      const linked = resources.filter(r => r.driveLink).length;
      const readyToIndex = resources.filter(r => r.indexStatus === "Ready to index").length;
      const indexed = resources.filter(r => r.indexStatus === "Indexed").length;

      return `
        <section class="hero">
          <h3>What are you studying today?</h3>
          <p>
            StudyHub now has OneDrive-linked resources. Keep your giant textbook PDFs
            in OneDrive, then store the link, tags, chapter notes, and indexing status here.
          </p>
        </section>

        <section class="quick-actions">
          <button class="action" data-action="new-note">📝<br><strong>New Note</strong><br><span>Capture an idea quickly</span></button>
          <button class="action" data-nav="library">📎<br><strong>Add Resource</strong><br><span>Textbook, slides, PDF</span></button>
          <button class="action" data-nav="maps">🗺<br><strong>Create Study Map</strong><br><span>Checklist or concept map</span></button>
          <button class="action" data-nav="remediation">🩺<br><strong>Start Remediation</strong><br><span>Review missed questions</span></button>
        </section>

        <section class="grid-4">
          <article class="card">
            <h4>📚 Resources</h4>
            <p>${resources.length} items in your library</p>
          </article>
          <article class="card">
            <h4>🔗 OneDrive Links</h4>
            <p>${linked} resources linked</p>
          </article>
          <article class="card">
            <h4>🧠 Ready to Index</h4>
            <p>${readyToIndex} waiting for AI indexing</p>
          </article>
          <article class="card">
            <h4>✅ Indexed</h4>
            <p>${indexed} searchable by AI later</p>
          </article>
        </section>

        <section class="dashboard-layout">
          <div class="panel">
            <h4>Continue Learning</h4>
            <div class="list">
              <div class="item">
                <div>
                  <strong>🩸 Anatomy Ch. 19 — Blood</strong>
                  <span>Current class focus</span>
                  <div class="progress"><div style="--progress: 42%"></div></div>
                </div>
                <span class="badge">42%</span>
              </div>
              <div class="item">
                <div>
                  <strong>⚡ Fluid & Electrolytes</strong>
                  <span>Potassium • Loop diuretics • Safety</span>
                  <div class="progress"><div style="--progress: 18%"></div></div>
                </div>
                <span class="badge">18%</span>
              </div>
            </div>
          </div>

          <div class="panel">
            <h4>Recent Resources</h4>
            <div class="list">
              ${resources.slice(0, 4).map(resource => `
                <div class="item">
                  <div>
                    <strong>${getResourceIcon(resource.type)} ${escapeHTML(resource.title)}</strong>
                    <span>${escapeHTML(resource.subject || "No subject")} • ${escapeHTML(resource.type)}</span>
                  </div>
                  <span class="badge ${getStatusBadgeClass(resource.status)}">${escapeHTML(resource.status)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
      `;
    }
  },

  library: {
    title: "Library",
    render() {
      return `
        <section class="hero">
          <h3>📚 Resource Library</h3>
          <p>
            Add textbooks, lecture slides, PDFs, Kaplan documents, professor notes,
            and diagrams. Store the big files in OneDrive, then paste the OneDrive link here.
          </p>
        </section>

        <section class="panel">
          <div class="library-toolbar">
            <input id="resourceSearch" type="search" placeholder="Search library..." />
            <select id="resourceTypeFilter">
              <option value="All">All types</option>
              <option>Textbook</option>
              <option>Lecture Slides</option>
              <option>PDF</option>
              <option>Kaplan / NCLEX</option>
              <option>Professor Notes</option>
              <option>Image / Diagram</option>
              <option>Other</option>
            </select>
            <button class="primary-btn" id="toggleResourceForm">+ Add Resource</button>
          </div>

          <form class="resource-form" id="resourceForm">
            <div class="form-row full" id="editingNotice" style="display:none;"><div class="warning-box">Editing existing resource. Save to update it.</div></div>
            <div class="form-row">
              <label for="resourceTitle">Title</label>
              <input id="resourceTitle" required placeholder="Example: Anatomy Textbook" />
            </div>

            <div class="form-row">
              <label for="resourceType">Type</label>
              <select id="resourceType">
                <option>Textbook</option>
                <option>Lecture Slides</option>
                <option>PDF</option>
                <option>Kaplan / NCLEX</option>
                <option>Professor Notes</option>
                <option>Image / Diagram</option>
                <option>Other</option>
              </select>
            </div>

            <div class="form-row">
              <label for="resourceSubject">Subject / Course</label>
              <input id="resourceSubject" placeholder="Example: Anatomy, Med-Surg, Pharm" />
            </div>

            <div class="form-row">
              <label for="resourceEdition">Edition / Week / Unit</label>
              <input id="resourceEdition" placeholder="Example: 15th edition, Week 4, Unit 2" />
            </div>

            <div class="form-row">
              <label for="resourceAuthor">Author / Instructor</label>
              <input id="resourceAuthor" placeholder="Example: Hinkle and Cheever, Professor Smith" />
            </div>

            <div class="form-row">
              <label for="resourceFile">File name</label>
              <input id="resourceFile" placeholder="Example: blood-chapter.pdf" />
            </div>

            <div class="form-row">
              <label for="resourceSize">File size <span class="help-text">(optional)</span></label>
              <input id="resourceSize" placeholder="Optional: 246 MB, 1.2 GB" />
            </div>

            <div class="form-row">
              <label for="resourceIndexStatus">Index status <span class="help-text">(AI search status)</span></label>
              <select id="resourceIndexStatus">
                <option>Not indexed</option>
                <option>Ready to index</option>
                <option>Indexed</option>
              </select>
            </div>

            <div class="form-row full">
              <label for="resourceDriveLink">OneDrive link</label>
              <input id="resourceDriveLink" type="url" placeholder="Paste OneDrive share link here" />
            </div>

            <div class="form-row full">
              <label for="resourceLocalLocation">OneDrive / local folder location <span class="help-text">(optional)</span></label>
              <input id="resourceLocalLocation" placeholder="Optional backup note: OneDrive / StudyHub Resources / 01 Textbooks" />
            </div>

            <div class="form-row full">
              <label for="resourceTags">Tags</label>
              <input id="resourceTags" placeholder="Example: potassium, blood, electrolytes" />
            </div>

            <div class="form-row full">
              <label for="resourceChapters">Chapters / sections</label>
              <textarea id="resourceChapters" placeholder="One per line. Example: Chapter 19 — Blood"></textarea>
            </div>

            <div class="form-row full">
              <label for="resourceNotes">Notes</label>
              <textarea id="resourceNotes" placeholder="What is this resource for? What chapters/topics matter?"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="secondary-btn" id="cancelResourceForm">Cancel</button>
              <button type="submit" class="primary-btn">Save Resource</button>
            </div>
          </form>
        </section>

        <section id="resourceList" class="resource-grid"></section>
      `;
    }
  },

  resourceDetail: {
    title: "Resource Detail",
    render() {
      const resource = getResources().find(item => item.id === activeResourceId);

      if (!resource) {
        return `
          <section class="empty">
            Resource not found.
            <br><br>
            <button class="primary-btn" data-nav="library">Back to Library</button>
          </section>
        `;
      }

      return `
        <section class="detail-grid">
          <article class="panel">
            <div class="detail-title">
              <div>
                <h3>${getResourceIcon(resource.type)} ${escapeHTML(resource.title)}</h3>
                <p>${escapeHTML(resource.subject || "No subject")} • ${escapeHTML(resource.type)}</p>
              </div>
              <span class="badge ${getStatusBadgeClass(resource.status)}">${escapeHTML(resource.status)}</span>
            </div>

            <div class="detail-field">
              <span>OneDrive Link</span>
              ${
                resource.driveLink
                  ? `<a href="${escapeAttribute(resource.driveLink)}" target="_blank" rel="noopener">Open in OneDrive</a>`
                  : `<strong>No OneDrive link added yet</strong>`
              }
            </div>

            <div class="detail-field">
              <span>Index Status</span>
              <strong>${escapeHTML(resource.indexStatus || "Not indexed")}</strong>
              <p class="small-muted">Index means whether StudyHub/AI has processed this file's text for searching. It does not mean uploaded.</p>
            </div>

            <div class="detail-field">
              <span>File Name</span>
              <strong>${escapeHTML(resource.fileName || "Not added")}</strong>
            </div>

            <div class="detail-field">
              <span>File Size</span>
              <strong>${escapeHTML(resource.fileSize || "Not added")}</strong>
            </div>

            <div class="detail-field">
              <span>Location</span>
              <strong>${escapeHTML(resource.localLocation || "Not added")}</strong>
            </div>

            <div class="detail-field">
              <span>Author / Instructor</span>
              <strong>${escapeHTML(resource.author || "Not added")}</strong>
            </div>

            <div class="detail-field">
              <span>Edition / Week / Unit</span>
              <strong>${escapeHTML(resource.edition || "Not added")}</strong>
            </div>

            <div class="detail-field">
              <span>Tags</span>
              <div class="resource-meta">
                ${(resource.tags || []).map(tag => `<span class="tag-pill">${escapeHTML(tag)}</span>`).join("") || "<strong>No tags yet</strong>"}
              </div>
            </div>

            <div class="detail-field">
              <span>Notes</span>
              ${
                notesEditorOpen
                  ? `<div class="inline-editor">
                      <textarea id="detailNotesEdit">${escapeHTML(resource.notes || "")}</textarea>
                      <div class="inline-editor-actions">
                        <button class="secondary-btn" onclick="closeNotesEditor('${resource.id}')">Cancel</button>
                        <button class="primary-btn" onclick="saveResourceNotes('${resource.id}')">Save Notes</button>
                      </div>
                    </div>`
                  : `<p>${escapeHTML(resource.notes || "No notes yet")}</p>`
              }
            </div>

            <div class="resource-actions">
              <button class="secondary-btn" data-nav="library">Back</button>
              <button class="secondary-btn" onclick="editResource('${resource.id}')">Edit Resource</button>
              <button class="secondary-btn" onclick="openNotesEditor('${resource.id}')">Edit Notes</button>
              ${resource.driveLink ? `<a class="primary-btn" href="${escapeAttribute(resource.driveLink)}" target="_blank" rel="noopener">Open File</a>` : ""}
              <button class="secondary-btn" onclick="markReadyToIndex('${resource.id}')">Mark Ready to Index</button>
            </div>
          </article>

          <article class="panel">
            <h4>Chapters / Sections</h4>
            <div class="chapter-list">
              ${
                (resource.chapters || []).length
                  ? resource.chapters.map(chapter => `
                    <div class="chapter-item">
                      <strong>${escapeHTML(chapter)}</strong>
                      <p class="resource-notes">Chapter notes and linked study maps coming in v0.4.</p>
                    </div>
                  `).join("")
                  : `<div class="empty">No chapters added yet.</div>`
              }
            </div>
          </article>
        </section>

        <section class="warning-box">
          Keep textbooks and lecture files in OneDrive, not GitHub. StudyHub stores links,
          metadata, notes, tags, and later AI indexing information.
        </section>
      `;
    }
  },

  notes: {
    title: "Notes",
    render() {
      return `<section class="hero"><h3>📝 Notes</h3><p>Chapter notes will live with chapters, but every note can be tagged, linked, and searched everywhere.</p></section><section class="empty">Notes builder coming soon.</section>`;
    }
  },

  maps: {
    title: "Study Maps",
    render() {
      return `<section class="hero"><h3>🗺 Study Maps</h3><p>Create review checklists or concept maps for diseases, disorders, systems, and patient-care workflows.</p></section><section class="empty">Study Map builder coming soon.</section>`;
    }
  },

  remediation: {
    title: "Remediation",
    render() {
      return `<section class="hero"><h3>🩺 Remediation</h3><p>Track missed Kaplan, ATI, lecture, and PDF questions with rationales and weak-topic links.</p></section><section class="empty">Remediation tracker coming soon.</section>`;
    }
  },

  uploads: {
    title: "Uploads",
    render() {
      return `<section class="hero"><h3>📎 Uploads</h3><p>For now, upload files directly to OneDrive and paste the share link in Library. Full OneDrive picker/API connection comes later.</p></section><section class="empty">OneDrive direct connection coming later.</section>`;
    }
  },

  search: {
    title: "Search",
    render() {
      return `<section class="hero"><h3>🔍 Search</h3><p>Search resources, chapters, notes, tags, study maps, remediation, and uploaded file metadata.</p></section><section class="empty" id="searchResults">Type in the search bar and press Enter.</section>`;
    }
  }
};

const view = document.querySelector("#view");
const title = document.querySelector("#viewTitle");
const buttons = document.querySelectorAll(".nav-btn");
const sidebar = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menuBtn");
const searchInput = document.querySelector("#globalSearch");
const captureBtn = document.querySelector("#captureBtn");

let currentView = "dashboard";

function render(viewName) {
  currentView = viewName;
  const page = pages[viewName] || pages.dashboard;

  title.textContent = page.title;
  view.innerHTML = page.render();

  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  sidebar.classList.remove("open");

  if (viewName === "library") {
    setupLibrary();
  }

  setupInlineNavigation();
}

function setupInlineNavigation() {
  document.querySelectorAll("[data-nav]").forEach(element => {
    element.addEventListener("click", () => render(element.dataset.nav));
  });
}

function setupLibrary() {
  const form = document.querySelector("#resourceForm");
  const toggleButton = document.querySelector("#toggleResourceForm");
  const cancelButton = document.querySelector("#cancelResourceForm");
  const search = document.querySelector("#resourceSearch");
  const typeFilter = document.querySelector("#resourceTypeFilter");

  function refreshList() {
    renderResources(search.value, typeFilter.value);
  }

  const editingNotice = document.querySelector("#editingNotice");

  if (editingResourceId) {
    const resourceToEdit = getResources().find(resource => resource.id === editingResourceId);

    if (resourceToEdit) {
      toggleButton.textContent = "Cancel Editing";
      editingNotice.style.display = "block";
      form.classList.add("open");

      document.querySelector("#resourceTitle").value = resourceToEdit.title || "";
      document.querySelector("#resourceType").value = resourceToEdit.type || "Textbook";
      document.querySelector("#resourceSubject").value = resourceToEdit.subject || "";
      document.querySelector("#resourceEdition").value = resourceToEdit.edition || "";
      document.querySelector("#resourceAuthor").value = resourceToEdit.author || "";
      document.querySelector("#resourceFile").value = resourceToEdit.fileName || "";
      document.querySelector("#resourceSize").value = resourceToEdit.fileSize || "";
      document.querySelector("#resourceIndexStatus").value = resourceToEdit.indexStatus || "Not indexed";
      document.querySelector("#resourceDriveLink").value = resourceToEdit.driveLink || "";
      document.querySelector("#resourceLocalLocation").value = resourceToEdit.localLocation || "";
      document.querySelector("#resourceTags").value = (resourceToEdit.tags || []).join(", ");
      document.querySelector("#resourceChapters").value = (resourceToEdit.chapters || []).join("\n");
      document.querySelector("#resourceNotes").value = resourceToEdit.notes || "";
    }
  }

  toggleButton.addEventListener("click", () => {
    if (editingResourceId) {
      editingResourceId = null;
      render("library");
      return;
    }

    form.classList.toggle("open");
  });

  cancelButton.addEventListener("click", () => {
    editingResourceId = null;
    form.classList.remove("open");
    form.reset();
    render("library");
  });

  search.addEventListener("input", refreshList);
  typeFilter.addEventListener("change", refreshList);

  form.addEventListener("submit", event => {
    event.preventDefault();

    const resources = getResources();
    const driveLink = document.querySelector("#resourceDriveLink").value.trim();

    const resource = {
      id: crypto.randomUUID(),
      title: document.querySelector("#resourceTitle").value.trim(),
      type: document.querySelector("#resourceType").value,
      subject: document.querySelector("#resourceSubject").value.trim(),
      author: document.querySelector("#resourceAuthor").value.trim(),
      edition: document.querySelector("#resourceEdition").value.trim(),
      fileName: document.querySelector("#resourceFile").value.trim(),
      fileSize: document.querySelector("#resourceSize").value.trim(),
      localLocation: document.querySelector("#resourceLocalLocation").value.trim(),
      driveLink,
      status: driveLink ? "Linked" : "Not linked",
      indexStatus: document.querySelector("#resourceIndexStatus").value,
      tags: document.querySelector("#resourceTags").value
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean),
      chapters: document.querySelector("#resourceChapters").value
        .split("\n")
        .map(chapter => chapter.trim())
        .filter(Boolean),
      notes: document.querySelector("#resourceNotes").value.trim(),
      createdAt: new Date().toISOString()
    };

    if (editingResourceId) {
      const updatedResources = resources.map(existingResource => {
        if (existingResource.id !== editingResourceId) return existingResource;
        return {
          ...existingResource,
          ...resource,
          id: editingResourceId,
          createdAt: existingResource.createdAt,
          updatedAt: new Date().toISOString()
        };
      });
      saveResources(updatedResources);
      editingResourceId = null;
    } else {
      resources.unshift(resource);
      saveResources(resources);
    }

    form.reset();
    form.classList.remove("open");
    refreshList();
  });

  refreshList();
}

function renderResources(searchTerm = "", type = "All") {
  const list = document.querySelector("#resourceList");
  let resources = getResources();

  const query = searchTerm.toLowerCase().trim();

  if (type !== "All") {
    resources = resources.filter(resource => resource.type === type);
  }

  if (query) {
    resources = resources.filter(resource => {
      const text = [
        resource.title,
        resource.type,
        resource.subject,
        resource.author,
        resource.edition,
        resource.fileName,
        resource.fileSize,
        resource.localLocation,
        resource.driveLink,
        resource.indexStatus,
        resource.notes,
        ...(resource.tags || []),
        ...(resource.chapters || [])
      ].join(" ").toLowerCase();

      return text.includes(query);
    });
  }

  if (!resources.length) {
    list.innerHTML = `<section class="empty">No resources found. Add your first textbook, lecture slide, or PDF.</section>`;
    return;
  }

  list.innerHTML = resources.map(resource => `
    <article class="resource-card">
      <div class="resource-head">
        <div class="resource-icon">${getResourceIcon(resource.type)}</div>
        <span class="badge ${getStatusBadgeClass(resource.status)}">${escapeHTML(resource.status)}</span>
      </div>

      <div>
        <h4>${escapeHTML(resource.title)}</h4>
        <p class="resource-notes">${escapeHTML(resource.subject || "No subject added")} • ${escapeHTML(resource.type)}</p>
      </div>

      <div class="resource-meta">
        <span class="tag-pill">${escapeHTML(resource.indexStatus || "Not indexed")}</span>
        ${resource.fileSize ? `<span class="tag-pill">${escapeHTML(resource.fileSize)}</span>` : ""}
        ${(resource.tags || []).slice(0, 4).map(tag => `<span class="tag-pill">${escapeHTML(tag)}</span>`).join("")}
      </div>

      ${resource.notes ? `<p class="resource-notes">${escapeHTML(resource.notes)}</p>` : ""}

      <div class="resource-actions">
        <button class="secondary-btn" onclick="openResource('${resource.id}')">Details</button>
        <button class="secondary-btn" onclick="editResource('${resource.id}')">Edit</button>
        ${resource.driveLink ? `<a class="primary-btn" href="${escapeAttribute(resource.driveLink)}" target="_blank" rel="noopener">Open File</a>` : ""}
        <button class="danger-btn" onclick="deleteResource('${resource.id}')">Delete</button>
      </div>
    </article>
  `).join("");
}

function openResource(id) {
  activeResourceId = id;
  notesEditorOpen = false;
  render("resourceDetail");
}

function markReadyToIndex(id) {
  const resources = getResources().map(resource => {
    if (resource.id !== id) return resource;
    return { ...resource, indexStatus: "Ready to index" };
  });

  saveResources(resources);
  activeResourceId = id;
  render("resourceDetail");
}


function editResource(id) {
  editingResourceId = id;
  notesEditorOpen = false;
  activeResourceId = null;
  render("library");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openNotesEditor(id) {
  activeResourceId = id;
  notesEditorOpen = true;
  render("resourceDetail");
}

function closeNotesEditor(id) {
  activeResourceId = id;
  notesEditorOpen = false;
  render("resourceDetail");
}

function saveResourceNotes(id) {
  const textarea = document.querySelector("#detailNotesEdit");
  const updatedNotes = textarea ? textarea.value : "";

  const resources = getResources().map(resource => {
    if (resource.id !== id) return resource;
    return {
      ...resource,
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    };
  });

  saveResources(resources);
  activeResourceId = id;
  notesEditorOpen = false;
  render("resourceDetail");
}

function deleteResource(id) {
  const confirmed = confirm("Delete this resource from your local StudyHub library?");
  if (!confirmed) return;

  const resources = getResources().filter(resource => resource.id !== id);
  saveResources(resources);
  renderResources(
    document.querySelector("#resourceSearch")?.value || "",
    document.querySelector("#resourceTypeFilter")?.value || "All"
  );
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHTML(value).replaceAll("`", "&#096;");
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => render(btn.dataset.view));
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    render("search");

    if (query) {
      const resources = getResources().filter(resource => {
        const text = [
          resource.title,
          resource.type,
          resource.subject,
          resource.notes,
          resource.localLocation,
          resource.fileName,
          resource.indexStatus,
          ...(resource.tags || []),
          ...(resource.chapters || [])
        ].join(" ").toLowerCase();

        return text.includes(query.toLowerCase());
      });

      document.querySelector("#searchResults").innerHTML = `
        <strong>Search preview:</strong><br><br>
        You searched for <strong>${escapeHTML(query)}</strong>.<br>
        Matching resources: <strong>${resources.length}</strong><br><br>
        ${resources.map(resource => `• ${getResourceIcon(resource.type)} ${escapeHTML(resource.title)}`).join("<br>") || "No matching resources yet."}
      `;
    }
  }
});

window.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

captureBtn.addEventListener("click", () => {
  alert("Capture menu coming soon: Note, Upload, Remediation, Study Map idea.");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(error => {
    console.warn("Service worker failed:", error);
  });
}

render("dashboard");
