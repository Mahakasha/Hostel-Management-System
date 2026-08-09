import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/loginPage.vue'
import HomePage from '@/components/homePage.vue'
import RoomAvailabilty from '@/components/roomAvailabilty.vue'
import bookingPage from '@/components/bookingPage.vue'
import studentNotifyPage from '@/components/studentNotify.vue'
import WardenNotifyPage from '@/components/wardenNotifyPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/room-availability',
      name: 'roomAvailability',
      component: RoomAvailabilty,
    },
    {
      path: '/book',
      name: 'bookingPage',
      component: bookingPage,
    },
     {
      path: '/studentNotify',
      name: 'studentNotifyPage',
      component: studentNotifyPage,
    },
    {
      path: '/wardenNotify',
      name: 'wardenNotifyPage',
      component: WardenNotifyPage,
    }
  ],
})
export default router
