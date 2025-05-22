import apiService from "../data/api-service.js";
import { saveAuthData, updateAuthUI } from "../utils/auth-helper.js";

class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      
      saveAuthData({
        userId: response.loginResult.userId,
        name: response.loginResult.name,
        token: response.loginResult.token,
      });

      updateAuthUI();
      
      return { 
        success: true,
        message: "Login berhasil! Mengalihkan ke beranda...",
        redirect: "/" 
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login gagal. Silakan coba lagi."
      };
    }
  }

  validateForm(email, password) {
    if (!email || !password) {
      return {
        valid: false,
        message: "Email dan password harus diisi"
      };
    }
    return { valid: true };
  }
}

export default LoginPresenter;