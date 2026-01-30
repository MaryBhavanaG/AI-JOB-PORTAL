const API = "http://localhost:8080";

let token = "";
let userRole = "";
let currentUser = "";

/* ================= PAGE NAVIGATION ================= */

function show(id) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
}

function showLogin() {
  show("loginPage");
}

function showRegister() {
  show("registerPage");
}

/* ================= REGISTER ================= */

function register() {
  const username = regUser.value.trim();
  const password = regPass.value.trim();
  const role = regRole.value;

  if (!username || !password) {
    alert("Username and password required");
    return;
  }

  if (!role) {
    alert("Please select a role");
    return;
  }

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
      role: role
    })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      localStorage.setItem(`role_${username}`, role);
      alert("Registered successfully");
      showLogin();
    })
    .catch(() => alert("Registration failed"));
}

/* ================= LOGIN ================= */

function login() {
  const username = loginUser.value.trim();
  const password = loginPass.value.trim();

  if (!username || !password) {
    alert("Username and password required");
    return;
  }

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.text();
    })
    .then(jwt => {
      token = jwt;
      currentUser = username;
      userRole = localStorage.getItem(`role_${username}`);

      if (!userRole) {
        alert("User role not found. Please register first.");
        logout();
        return;
      }

      show("rolePage");
    })
    .catch(() => alert("Invalid username or password"));
}

/* ================= DASHBOARDS ================= */

function openSeeker() {
  show("seekerPage");
  loadLatestJobs();
}

function openPoster() {
  if (userRole !== "ADMIN") {
    alert("Access denied. Admin only.");
    return;
  }

  show("posterPage");
  loadPosterJobs();
}

/* ================= JOBS ================= */

function loadLatestJobs() {
  fetch(`${API}/jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(jobs => renderJobs("latestJobs", jobs));
}

function loadPosterJobs() {
  fetch(`${API}/jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(jobs => renderJobs("posterJobs", jobs));
}

function searchJobs() {
  const skill = searchSkill.value.toLowerCase();

  fetch(`${API}/jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(jobs => {
      const filtered = jobs.filter(j =>
        j.skills.toLowerCase().includes(skill)
      );
      renderJobs("searchResults", filtered, "No jobs found");
    });
}

/* ================= RESUME UPLOAD ================= */

function uploadResume() {
  if (!resumeFile.files.length) {
    alert("Please select a resume");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile.files[0]);

  fetch(`${API}/recommendations/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
    .then(res => res.json())
    .then(jobs =>
      renderJobs("recommendedJobs", jobs, "No recommendations found")
    )
    .catch(() => alert("Resume upload failed"));
}

/* ================= RENDER JOB CARDS ================= */

function renderJobs(containerId, jobs, emptyMsg = "No jobs") {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!jobs || jobs.length === 0) {
    container.innerHTML = `<p>${emptyMsg}</p>`;
    return;
  }

  jobs.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";
    div.innerHTML = `<b>${job.title}</b><br>${job.company}`;
    div.onclick = () => openModal(job);
    container.appendChild(div);
  });
}

/* ================= MODAL ================= */

function openModal(job) {
  modalTitle.innerText = job.title;
  modalCompany.innerText = job.company;
  modalSkills.innerText = job.skills;
  modalExp.innerText = job.experience || "N/A";
  modalDesc.innerText = job.description || "N/A";
  jobModal.style.display = "block";
}

function closeModal() {
  jobModal.style.display = "none";
}

window.onclick = function (e) {
  if (e.target === jobModal) closeModal();
};

/* ================= POST JOB (ADMIN ONLY) ================= */

function postJob() {
  if (userRole !== "ADMIN") {
    alert("Only admin can post jobs");
    return;
  }

  fetch(`${API}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: jobTitle.value,
      company: jobCompany.value,
      location: jobLocation.value,   // ✅ ADDED
      jobType: jobType.value,         // ✅ ADDED
      skills: jobSkills.value,
      experience: jobExp.value,
      description: jobDesc.value
    })
  })
    .then(() => {
      alert("Job posted successfully");
      loadPosterJobs();
    })
    .catch(() => alert("Failed to post job"));
}

/* ================= LOGOUT ================= */

function logout() {
  token = "";
  userRole = "";
  currentUser = "";
  showLogin();
}

/* ================= DEFAULT ================= */

showLogin();