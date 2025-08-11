import { createRouter, createWebHistory } from 'vue-router'
import Home from "../src/frontend/home.vue"
import Lexicon from "../src/frontend/lexicon.vue"
import FormLexicon from "../src/frontend/formLexicon.vue"
import moment from "../src/frontend/module.vue"

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/lexicon',
        name: 'lexicon',
        component: Lexicon
    },
    {
        path: '/lexicon/create',
        name: 'formLexicon',
        component: FormLexicon
    },
  {
    path: '/module',
    name: 'module',
    component: Module
  },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router