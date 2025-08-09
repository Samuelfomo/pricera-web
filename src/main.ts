// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
//
// createApp(App).mount('#app')
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // ⚠️ Important : installer Pinia avant d’utiliser le store

// router.beforeEach((to, from, next) => {
//     const store = userLoginStore(); // ou userLoginStore()
//
//     if (to.matched.some(record => record.meta.requiresAuth) && !store.checkSession()) {
//         next('/'); // Redirection vers login
//     } else {
//         next(); // OK, on continue
//     }
// });

app.use(router)
app.mount('#app')





