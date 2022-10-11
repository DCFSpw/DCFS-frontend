
const routes = [
  /**
   * AUTH.
   */
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: {
      guest: true
    },
    children: [
      { path: 'login', name: 'login', component: () => import('pages/Auth/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Auth/RegisterPage.vue') },
    ]
  },

  /**
   * MAIN VIEW.
   */
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      auth: true
    },
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/IndexPage.vue') },
      { path: 'profile', name: 'profile', component: () => import('pages/UserProfile.vue') },
    ]
  },

  /**
   * ERROR 404.
   */
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
