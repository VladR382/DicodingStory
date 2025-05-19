import BasePage from "./base-page.js";
import UIHelper from "../utils/ui-helper.js";
import { AuthFormHandler } from "../utils/auth-form-handler.js";
import LoginPresenter from "../presenters/login-presenter.js";

class LoginPage extends BasePage {
  constructor(options) {
    super(options);
    this.setTitle("Masuk");
    this.presenter = new LoginPresenter(this);
  }

  async render() {
    this.clearContainer();
    const pageContainer = this.createPageContainer("login-page");
    
    pageContainer.innerHTML = `
      <div class="form-container">
        <h2 class="form-title">Masuk ke Dicoding Story</h2>
        <div id="alert-container"></div>
        
        <form id="login-form">
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
              placeholder="Masukkan password Anda" 
              required
              autocomplete="current-password"
              minlength="8"
            >
          </div>
          
          <button type="submit" id="login-button" class="btn btn-primary btn-block">
            Masuk
          </button>
        </form>
        
        <p class="auth-alternative">
          Belum memiliki akun? 
          <a href="#/register" class="auth-link">Daftar sekarang</a>
        </p>
      </div>
    `;

    this.container.appendChild(pageContainer);
    this.addEventListeners();
  }

  addEventListeners() {
    AuthFormHandler.initForm({
      formId: "login-form",
      submitButtonId: "login-button",
      alertContainerId: "alert-container",
      
      validate: () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        
        const validation = this.presenter.validateForm(email, password);
        if (!validation.valid) {
          UIHelper.showAlert(validation.message, "error", "alert-container");
          return false;
        }
        return true;
      },

      onSubmit: async () => {
        const credentials = {
          email: document.getElementById("email").value.trim(),
          password: document.getElementById("password").value
        };

        const result = await this.presenter.login(credentials);
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        return { 
          successMessage: result.message,
          redirect: result.redirect 
        };
      }
    });
  }
}

export default LoginPage;