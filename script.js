function clearMessages() {
  document.getElementById('reg-msg').innerText = '';
  document.getElementById('reg-msg').classList.remove('success');

  document.getElementById('login-msg').innerText = '';
  document.getElementById('login-msg').classList.remove('success');

  document.getElementById('profile-msg').innerText = '';
  document.getElementById('profile-msg').classList.remove('success');
}

function showRegister() {
  clearMessages();
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('profile').style.display = 'none';
}

function showLogin() {
  clearMessages();
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('profile').style.display = 'none';
}

function showProfile() {
  clearMessages();
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('profile').style.display = 'block';
  loadProfile();
}

// Register user in localStorage
function register() {
  clearMessages();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;

  if (!name || !email || !password) {
    const msg = document.getElementById('reg-msg');
    msg.innerText = 'Please fill in all fields.';
    return;
  }

  if (localStorage.getItem(email)) {
    const msg = document.getElementById('reg-msg');
    msg.innerText = 'User already exists.';
    return;
  }

  // Default empty skills/projects on register
  const user = { name, email, password, skills: '', projects: '' };
  localStorage.setItem(email, JSON.stringify(user));

  const msg = document.getElementById('reg-msg');
  msg.innerText = 'Registered successfully! Please login.';
  msg.classList.add('success');

  document.getElementById('reg-name').value = '';
  document.getElementById('reg-email').value = '';
  document.getElementById('reg-password').value = '';
}

// Login user from localStorage
function login() {
  clearMessages();

  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    const msg = document.getElementById('login-msg');
    msg.innerText = 'Please fill in all fields.';
    return;
  }

  const userStr = localStorage.getItem(email);
  if (!userStr) {
    const msg = document.getElementById('login-msg');
    msg.innerText = 'User not found.';
    return;
  }

  const user = JSON.parse(userStr);

  if (user.password !== password) {
    const msg = document.getElementById('login-msg');
    msg.innerText = 'Incorrect password.';
    return;
  }

  sessionStorage.setItem('loggedInUser', email);
  showProfile();
}

// Load profile details in profile section
function loadProfile() {
  const email = sessionStorage.getItem('loggedInUser');
  if (!email) {
    showLogin();
    return;
  }

  const userStr = localStorage.getItem(email);
  if (!userStr) {
    showLogin();
    return;
  }

  const user = JSON.parse(userStr);

  document.getElementById('profile-name').innerText = user.name;
  document.getElementById('profile-email').innerText = user.email;
  document.getElementById('profile-name-input').value = user.name;
  document.getElementById('profile-skills-input').value = user.skills || '';
  document.getElementById('profile-projects-input').value = user.projects || '';
}

// Update user profile in localStorage
function updateProfile() {
  clearMessages();

  const email = sessionStorage.getItem('loggedInUser');
  if (!email) return;

  let user = JSON.parse(localStorage.getItem(email));
  if (!user) return;

  const newName = document.getElementById('profile-name-input').value.trim();
  const newSkills = document.getElementById('profile-skills-input').value.trim();
  const newProjects = document.getElementById('profile-projects-input').value.trim();

  if (!newName) {
    const msg = document.getElementById('profile-msg');
    msg.innerText = 'Name cannot be empty.';
    return;
  }

  user.name = newName;
  user.skills = newSkills;
  user.projects = newProjects;

  localStorage.setItem(email, JSON.stringify(user));

  const msg = document.getElementById('profile-msg');
  msg.innerText = 'Profile updated successfully.';
  msg.classList.add('success');

  document.getElementById('profile-name').innerText = newName;
}

// Delete profile and logout
function deleteProfile() {
  clearMessages();

  const email = sessionStorage.getItem('loggedInUser');
  if (!email) return;

  if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
    localStorage.removeItem(email);
    sessionStorage.removeItem('loggedInUser');
    showRegister();
  }
}

// Logout user
function logout() {
  sessionStorage.removeItem('loggedInUser');
  showLogin();
}

// On page load, show login or profile based on session
window.onload = function () {
  if (sessionStorage.getItem('loggedInUser')) {
    showProfile();
  } else {
    showLogin();
  }
};
