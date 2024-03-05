import {
  setupLayouts,
} from 'virtual:generated-layouts'
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHashHistory(
    import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})


router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !localStorage.getItem("accessToken") &&

    // ❗️ Avoid an infinite redirect
    to.name !== "login"
  ) {
    // redirect the user to the login page
    return {
      name: "login",
    }
  }
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
