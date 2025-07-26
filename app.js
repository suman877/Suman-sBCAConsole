const PASS = "sem4succeeded";
const adminBtn = document.getElementById("adminBtn");
const subjectNav = document.getElementById("subjectNav");
const searchInput = document.getElementById("searchInput");
const passwordInput = document.getElementById("passwordInput");
const themeBtns = document.querySelectorAll(".theme-btn");

adminBtn.onclick = () => document.getElementById("passwordModal").style.display = "block";
document.querySelector(".cancel-btn").onclick = () => {
  document.getElementById("passwordModal").style.display = "none";
  passwordInput.value = "";
};
document.querySelector(".submit-btn").onclick = () => {
  if (passwordInput.value === PASS) {
    document.body.classList.add("admin-mode");
    document.getElementById("passwordModal").style.display = "none";
    buildCards();
  } else alert("Incorrect password ❌");
};

subjectNav.addEventListener("click", e => {
  if (e.target.matches("button")) selectSubject(e.target);
});
searchInput.oninput = searchAll;

themeBtns.forEach(btn => {
  btn.onclick = () => {
    document.body.style.setProperty('--bg', btn.dataset.color);
    themeBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };
});

function selectSubject(btn) {
  subjectNav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const subj = btn.dataset.subj;
  document.querySelectorAll(".syllabus").forEach(s => {
    s.style.display =
      (document.body.classList.contains("admin-mode") && (subj === "all" || s.id === "syllabus-" + subj))
        ? "block"
        : "none";
  });
  document.querySelectorAll("#topicTable tbody tr").forEach(r => {
    r.style.display = (subj === "all" || r.dataset.subj === subj) ? "" : "none";
  });
  buildCards();
}

function searchAll() {
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll("#topicTable tbody tr").forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(q) ? "" : "none";
  });
  buildCards();
}

document.getElementById("topicTable").addEventListener("click", e => {
  if (e.target.matches(".btn-edit")) {
    Array.from(e.target.closest("tr").cells).forEach(td => {
      if (!td.querySelector("button")) td.contentEditable = "true";
    });
  } else if (e.target.matches(".btn-save")) {
    Array.from(e.target.closest("tr").cells).forEach(td => {
      if (!td.querySelector("button")) td.contentEditable = "false";
    });
  }
});

function buildCards() {
  const list = document.getElementById("cardList");
  list.innerHTML = "";
  document.querySelectorAll("#topicTable tbody tr").forEach(r => {
    if (r.style.display === "none") return;
    const cols = Array.from(r.cells).map(td => td.innerText);
    const div = document.createElement("div");
    div.className = "card-item";
    let html = `<div class="card-header">${cols[0]} – ${cols[1]}</div><div class="card-content">
      <p><strong>Subtopics:</strong> ${cols[2]}</p>
      <p><strong>Date:</strong> ${cols[3]}</p>
      <p><strong>Page No.:</strong> ${cols[4]}</p>`;
    if (document.body.classList.contains("admin-mode")) {
      html += `<p><strong>Remarks:</strong> ${cols[5]}</p><p><strong>URL:</strong> ${cols[6]}</p>`;
    }
    html += "</div>";
    div.innerHTML = html;
    div.onclick = () => div.classList.toggle("expanded");
    list.appendChild(div);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  selectSubject(subjectNav.querySelector("button.active"));
  window.addEventListener("resize", buildCards);
});
