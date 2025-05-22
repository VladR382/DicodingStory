import apiService from "../data/api-service.js"; 

class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async register(userData) {
    try {
      const result = await apiService.register(userData);
      
      return { 
        success: true,
        message: "Pendaftaran berhasil! Mengalihkan ke halaman login...",
        redirect: "/login",
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Terjadi kesalahan saat mendaftar",
        data: null
      };
    }
  }

  validateForm(formData) {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      return {
        isValid: false,
        message: "Semua kolom harus diisi"
      };
    }

    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password harus minimal 8 karakter"
      };
    }

    if (password !== confirmPassword) {
      return {
        isValid: false,
        message: "Password tidak cocok"
      };
    }

    return {
      isValid: true,
      message: ""
    };
  }
}

export default RegisterPresenter;