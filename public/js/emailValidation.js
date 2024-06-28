document.getElementById('email').addEventListener('input', checkEmail);

function checkEmail() {
  const email = document.getElementById('email').value;
  const emailHelp = document.getElementById('emailHelp');

  // Email format validation
  const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    emailHelp.textContent = "Please enter a valid email address.";
    return;
  } else {
    emailHelp.textContent = "";
  }

  // Firebase check for existing email
  firebase.auth().fetchSignInMethodsForEmail(email)
    .then(signInMethods => {
      if (signInMethods.length > 0) {
        emailHelp.textContent = "Email already in use. Please use a different email.";
      } else {
        emailHelp.textContent = "";
      }
    })
    .catch(error => {
      console.error('Error checking email:', error);
    });
}

function isValidEmail(email) {
  const emailPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}
