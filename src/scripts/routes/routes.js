import AddStoryPage from "../pages/add-story-page.js";
import LoginPage from "../pages/login-page.js";
import RegisterPage from "../pages/register-page.js";
import DetailPage from "../pages/detail-page.js";
import ExplorePage from "../pages/explore-page.js";
import HomeView from "../pages/home-page.js";
import MapPage from "../pages/map-page.js";
import NotFoundPage from "../pages/not-found-page.js";
import { getActiveRoute, parseActivePathname } from "./url-parser.js";
import SavedStoriesPage from "../pages/saved-stories-page.js";


const routes = {
  "/": {
    component: HomeView, 
  },
  "/home": {
    component: HomeView, 
  },
  "/add": {
    component: AddStoryPage,
  },
  "/login": {
    component: LoginPage,
  },
  "/register": {
    component: RegisterPage,
  },
  "/detail/:id": {
    component: DetailPage,
  },
  "/explore": {
    component: ExplorePage,
  },
  "/saved": {
    component: SavedStoriesPage,
  },
  "/map": {
    component: MapPage,
  },
};

/**
 * Navigate to a specific URL
 * @param {string} url - The URL to navigate to
 */
export function navigateTo(url) {
  window.history.pushState(
    null,
    null,
    url.startsWith("/") ? `#${url}` : `#/${url}`
  );
  window.dispatchEvent(new Event("hashchange"));
}

/**
 * Handle navigation and return matched route info
 * @return {Object|null} Matched route info or null if no match
 */
export function handleNavigation() {
  const route = getActiveRoute();
  const pathParams = parseActivePathname();

  if (route === "/detail/:id" && pathParams.id) {
    return {
      component: routes[route].component,
      params: { id: pathParams.id },
    };
  }

  const matchedRoute = routes[route];

  if (!matchedRoute) {
    return {
      component: NotFoundPage,
      params: {},
    };
  }

  return {
    component: matchedRoute.component,
    params: {},
  };
}

const router = {
  routes,
};

export default router;