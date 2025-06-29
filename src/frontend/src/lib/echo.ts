import Echo from 'laravel-echo';

// Make sure to install 'pusher-js' for the Pusher client
import Pusher from 'pusher-js';

// Add this to the window object
declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

window.Pusher = Pusher;

const token = localStorage.getItem('token');

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'app-key',
  cluster: 'mt1', 
  wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
  wsPort: parseInt(import.meta.env.VITE_PUSHER_PORT) || 6001,
  forceTLS: import.meta.env.VITE_PUSHER_TLS === 'true',
  disableStats: true, 
  enabledTransports: ['ws', 'wss'], 
  authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT || 'http://localhost:8000/broadcasting/auth',
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  },
});

export default echo;