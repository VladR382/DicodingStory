const TOKEN_KEY = "dicoding_story_token";
const USER_KEY = "dicoding_story_user";

/**
 * Save authentication data to local storage
 * @param {Object} userData - User data to be saved
 */
export const saveAuthData = (userData) => {
  localStorage.setItem(TOKEN_KEY, userData.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: userData.userId,
      name: userData.name,
    })
  );
};

/**
 * Get authentication token from local storage
 * @returns {string|null} - Authentication token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get user data from local storage
 * @returns {Object|null} - User data or null if not found
 */
export const getUser = () => {
  const userString = localStorage.getItem(USER_KEY);
  if (!userString) {
    return null;
  }

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} - True if user is logged in, false otherwise
 */
export const isLoggedIn = () => {
  return !!getToken();
};

/**
 * Logout user by removing authentication data from local storage
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.hash = "#/";
  window.location.reload();
};

/**
 * Update UI elements based on authentication status
 */
export const updateAuthUI = () => {
    const loggedIn = isLoggedIn();
    const authMenuItem = document.getElementById("auth-menu-item");

    if (authMenuItem) {
        if (loggedIn) {
            const user = getUser();
            authMenuItem.innerHTML = `
                <div class="user-menu">
                    <span class="user-name">${user?.name || "User"}</span>
                    <button id="logout-button" class="nav-link logout-button">Keluar</button>
                </div>
            `;

            const logoutButton = document.getElementById("logout-button");
            if (logoutButton) {
                const newLogoutButton = logoutButton.cloneNode(true);
                logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
                newLogoutButton.addEventListener("click", logout);
            }
        } else {
            authMenuItem.innerHTML = `
                <a href="#/login" class="nav-link login-button">Masuk</a>
            `;
        }
    }
};

export default {
  saveAuthData,
  getToken,
  getUser,
  isLoggedIn,
  logout,
  updateAuthUI,
};