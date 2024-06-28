document.getElementById('pwd').addEventListener('input', checkPassword);

function checkPassword() {
  const password = document.getElementById('pwd').value;
  const passwordHelp = document.getElementById('passwordHelp');

  if (password.length < 8) {
    passwordHelp.textContent = "Password must be at least 8 characters long.";
  } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    passwordHelp.textContent = "Password must contain at least one lowercase letter, one uppercase letter, and one number.";
  } else {
    passwordHelp.textContent = "";
  }
}

function isValidPassword(password) {
  return password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password);
}
