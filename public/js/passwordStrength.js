function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('password-strength');
    let strength = 0;
  
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[$@#&!]/)) strength++;
  
    let strengthText;
    let strengthColor;
  
    switch (strength) {
      case 1:
        strengthText = 'Very Weak';
        strengthColor = 'red';
        break;
      case 2:
        strengthText = 'Weak';
        strengthColor = 'orange';
        break;
      case 3:
        strengthText = 'Moderate';
        strengthColor = 'yellow';
        break;
      case 4:
        strengthText = 'Strong';
        strengthColor = 'lightgreen';
        break;
      case 5:
        strengthText = 'Very Strong';
        strengthColor = 'green';
        break;
      default:
        strengthText = '';
        strengthColor = 'transparent';
    }
  
    strengthBar.textContent = strengthText;
    strengthBar.style.color = strengthColor;
  }
  
  document.getElementById('pwd').addEventListener('input', function() {
    updatePasswordStrength(this.value);
  });
  