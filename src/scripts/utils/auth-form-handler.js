import UIHelper from "./ui-helper.js";
import { navigateTo } from "../routes/routes.js";

export class AuthFormHandler {
  static async initForm(config) {
    const form = document.getElementById(config.formId);
    const submitBtn = document.getElementById(config.submitButtonId);
    const alertContainer = document.getElementById(config.alertContainerId);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      let hideLoading = null; 

      try {
        if (config.validate && !config.validate()) return;

        hideLoading = UIHelper.showButtonLoading(submitBtn, "Memproses..."); 

        const result = await config.onSubmit();

        if (result?.successMessage) {
          UIHelper.showAlert(result.successMessage, "success", alertContainer);
        }

        if (result?.redirect) {
          setTimeout(async () => {
            await navigateTo(result.redirect);
          }, 1500);
        }
      } catch (error) {
        UIHelper.showAlert(error.message, "error", alertContainer);
      } finally {
        if (hideLoading) hideLoading();
      }
    });
  }
}