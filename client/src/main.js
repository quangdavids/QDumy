import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import PrimeVue from 'primevue/config';
import '@fortawesome/fontawesome-free/css/all.css'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ProgressBar from 'primevue/progressbar';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';



// Configure axios to send credentials (cookies) with all requests
axios.defaults.withCredentials = true;

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Load Stripe
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

// Make Stripe available globally
window.getStripe = getStripe;

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(PrimeVue)
app.component('ProgressBar', ProgressBar)
app.use(router)
app.component('QuillEditor', QuillEditor)
app.mount('#app')
