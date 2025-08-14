import { createRouter, createWebHistory } from 'vue-router'
import Home from "./frontend/view/home.vue"
import Lexicon from "./frontend/view/lexicon/lexicon.vue"
import FormLexicon from "./frontend/view/lexicon/formLexicon.vue"
import Module from "./frontend/view/module.vue"
import Country from './frontend/view/country/country.vue';
import User from './frontend/view/user/user.vue'
import Sector from './frontend/view/sector/sector.vue';
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
        path: '/lexicon/edit/:entryId/:language',
        name: 'LexiconEdit',
        component: FormLexicon
    },
    {
        path: '/lexicon/translate/:entryId',
        name: 'LexiconTranslate',
        component: FormLexicon
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
    {
      path: '/country',
      name: 'country',
      component: Country
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/sector',
      name: 'sector',
      component: Sector
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router