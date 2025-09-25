import CrudPage from '../views/CrudPage.vue'
import AboutPage from '../views/AboutPage.vue'
import ListCardPage from '../views/ListCardPage.vue'

const routes = [
  { path: '/crud', component: CrudPage },
  { path: '/sobre', component: AboutPage },
  { path: '/', component: ListCardPage }
]

export default routes