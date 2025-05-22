import BasePage from "./base-page.js";
import UIHelper from "../utils/ui-helper.js";
import { AuthFormHandler } from "../utils/auth-form-handler.js";
import RegisterPresenter from "../presenters/register-presenter.js";

class RegisterPage extends BasePage {
  constructor(options) {
    super(options);
    this.setTitle("Daftar");
    this.presenter = new RegisterPresenter(this);
  }

  async render() {
    this.clearContainer();
    const pageContainer = this.createPageContainer("register-page");
    
    pageContainer.innerHTML = `
      <div class="form-container">
        <h2 class="form-title">Daftar Akun Baru</h2>
        <div id="alert-container"></div>
        
        <form id="register-form">
          <div class="form-group">
            <label for="name" class="form-label">Nama</label>
            <input 
              type="text" 
              id="name" 
              class="form-input" 
              placeholder="Masukkan nama Anda" 
              required
              autocomplete="name"
            >
          </div>
        
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-input" 
              placeholder="Masukkan email Anda" 
              required
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-input" 
              placeholder="Minimal 8 karakter" 
              required
              autocomplete="new-password"
              minlength="8"
            >
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Konfirmasi Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              class="form-input" 
              placeholder="Konfirmasi password Anda" 
              required
              autocomplete="new-password"
              minlength="8"
            >
          </div>
          
          <button type="submit" id="register-button" class="btn btn-primary btn-block">
            Daftar
          </button>
        </form>
        
        <p class="auth-alternative">
          Sudah memiliki akun? 
          <a href="#/login" class="auth-link">Masuk sekarang</a>
        </p>
      </div>
    `;

    this.container.appendChild(pageContainer);
    this.addEventListeners();
  }

  addEventListeners() {
    AuthFormHandler.initForm({
      formId: "register-form",
      submitButtonId: "register-button",
      alertContainerId: "alert-container",
      
      validate: () => {
        const formData = {
          name: document.getElementById("name").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("password").value,
          confirmPassword: document.getElementById("confirmPassword").value
        };

        const validationResult = this.presenter.validateForm(formData);
        
        if (!validationResult.isValid) {
          UIHelper.showAlert(validationResult.message, "error", document.getElementById("alert-container"));
          return false;
        }

        return true;
      },

      onSubmit: async () => {
        const userData = {
          name: document.getElementById("name").value.trim(),
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("password").value,
        };

        const result = await this.presenter.register(userData);
        
        if (!result.success) {
          UIHelper.showAlert(result.message, "error", document.getElementById("alert-container"));
          return {};
        }
        
        return { 
          successMessage: result.message,
          redirect: result.redirect
        };
      }
    });
  }
}

export default RegisterPage;