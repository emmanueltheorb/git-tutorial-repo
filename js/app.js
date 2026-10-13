console.log("App.js init");

let reports = [];

let currentReportId;

const mainHeader = document.getElementById("main-header");
const viewReportsButton = document.getElementById("view-reports-button");
const reportCountText = document.getElementById("report-count");
const reportSection = document.getElementById("report-section");
const categoryRow = document.getElementById("category-row");
const reportList = document.getElementById("report-list");
const goBackButton = document.getElementById("go-back-button");
const addReportButton = document.getElementById("add-report-button");
const reportFormSection = document.getElementById("report-form-section");
const reportForm = document.getElementById("add-report-form");
const reportTitle = document.getElementById("title");
const reportDescription = document.getElementById("description");
const reportCategory = document.getElementById("category");
const reportLocation = document.getElementById("location");
const urgencyLevel = document.getElementById("urgency-level");
const submitReportButton = document.getElementById("submit-report-button");
const cancelButton = document.getElementById("cancel-button");
const singleReportSection = document.getElementById("single-report-section");
const singleReportCard = document.getElementById("single-report-card");
const backToListButton = document.getElementById("back-to-list-button");
const deleteButton = document.getElementById("delete-button");

loadReports();

function loadReports() {
  reports = JSON.parse(localStorage.getItem("reports")) ?? [];
  updateReportCount();
  renderReports(0);
}

function renderReports(categoryIndex) {
  let incidents;

  switch (categoryIndex) {
    case 0:
      incidents = reports
      break;
    case 1:
      incidents = reports.filter((item) => {
        return item.category === "accident"
      })
      break;
    case 2:
      incidents = reports.filter((item) => {
        return item.category === "fighting"
      })
      break;
    case 3:
      incidents = reports.filter((item) => {
        return item.category === "rioting"
      })
      break;
    case 4:
      incidents = reports.filter((item) => {
        return item.category === "environment"
      })
      break;
    default:
      incidents = reports;
  }

  if (incidents.length === 0) {
    reportList.innerHTML = "<p>No Reports Added.</p>";

    return;
  }

  reportList.innerHTML = "";

  try {
    incidents.forEach((incident) => {
      const { title, description, location, urgency } = incident;

      const reportCard = document.createElement("div"); // not sure if passing div here is supported

      reportCard.className = "report-card";

      reportCard.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <span>${location}</span>
        <span>${urgency}</span>
        `;

      reportCard.addEventListener("click", () => {
        currentReportId = incident.id;
        viewReport(incident);
      });

      reportList.appendChild(reportCard);
    });
  } catch (error) {
    alert(`Error rendering report: ${error}`);
  }
}

function viewReport(report) {
  if (!report) {
    alert("Report Not Found");

    return;
  }

  console.log(report);

  try {
    singleReportCard.innerHTML = "";

    singleReportCard.innerHTML = `
    <h3>${report.title}</h3>
    <p>${report.description}</p>
    <div class="card-footer">
        <span class="location-span">${report.location}</span>
        <select id="status-select" class="mini-select" data-id="${report.id}">
          <option value="Pending" ${report.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Under Review" ${report.status === "Under Review" ? "selected" : ""}>Under review</option>
          <option value="Resolved" ${report.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
      </div>
    `;

    const statusSelect = singleReportCard.querySelector("#status-select");
    statusSelect.addEventListener("change", (event) => {
      updateReportStatus(report.id, event.target.value);
    });

    reportSection.classList.add("hidden");

    singleReportSection.classList.remove("hidden");
  } catch (error) {
    alert(`Error viewing report: ${error}`);
  }
}

function saveReport(report) {
  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));
  loadReports();
}

function updateReportCount() {
  const count = reports.length;

  reportCountText.textContent = `${count} incidents reported`;
}

function updateReportStatus(id, status) {
  const report = reports.find((item) => item.id === id);

  if (report) {
    report.status = status;
    localStorage.setItem("reports", JSON.stringify(reports));
    loadReports();
  }
}

function deleteReport(id) {
  console.log(id);

  reports = reports.filter((item) => item.id !== id);

  localStorage.setItem("reports", JSON.stringify(reports));

  loadReports();

  singleReportSection.classList.add("hidden");

  reportSection.classList.remove("hidden");
}

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = reportTitle.value.trim();
  const description = reportDescription.value.trim();
  const category = reportCategory.value;
  const location = reportLocation.value;
  const urgency = urgencyLevel.value;
  const status = "Pending";

  if (!title || !description || !category || !location || !urgency || !status) {
    alert("Please fill in all fields.");

    return;
  }

  submitReportButton.disabled = true;

  try {
    const report = {
      id: crypto.randomUUID(),
      title: title,
      description: description,
      category: category,
      location: location,
      urgency: urgency,
      status: status,
      createdAt: new Date().toISOString(),
    };

    saveReport(report);

    reportForm.reset();

    reportFormSection.classList.add("hidden");

    mainHeader.classList.remove("hidden");

    viewReportsButton.classList.remove("hidden");

    addReportButton.classList.remove("hidden");

    alert("Report Created Successfully.");
  } catch (error) {
    alert(`An Error Occurred: ${error}`);
  } finally {
    submitReportButton.disabled = false;
    updateReportCount();
  }
});

addReportButton.addEventListener("click", () => {
  mainHeader.classList.add("hidden");

  viewReportsButton.classList.add("hidden");

  reportSection.classList.add("hidden");

  addReportButton.classList.add("hidden");

  reportFormSection.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
  reportForm.reset();

  reportFormSection.classList.add("hidden");

  mainHeader.classList.remove("hidden");

  viewReportsButton.classList.remove("hidden");

  addReportButton.classList.remove("hidden");
});

viewReportsButton.addEventListener("click", () => {
  reportSection.classList.remove("hidden");

  addReportButton.classList.add("hidden");

  viewReportsButton.classList.add("hidden");
});

goBackButton.addEventListener("click", () => {
  reportSection.classList.add("hidden");

  viewReportsButton.classList.remove("hidden");

  addReportButton.classList.remove("hidden");
});

backToListButton.addEventListener("click", () => {
  singleReportSection.classList.add("hidden");

  reportSection.classList.remove("hidden");
});

deleteButton.addEventListener("click", () => {
  deleteReport(currentReportId);
});

categoryRow.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip")
  if (!chip) {
    console.error("No chip found");
    return;
  }

  document
  .querySelectorAll("#category-row .chip")
  .forEach((c) => c.classList.remove("active"));

  chip.classList.add("active");

  const categoryIndex = parseInt(chip.dataset.category, 10);

  renderReports(categoryIndex)
})
