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
  key: 'app-key',               // Must match SOKETI_DEFAULT_KEY from docker-compose
  cluster: 'mt1',               // Can be any string; soketi ignores this
  wsHost: window.location.hostname, // Use the browser's hostname
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,           // Disable Pusher stats which can cause connection issues
  enabledTransports: ['ws', 'wss'], // Use websocket transport only
  authEndpoint: 'http://10.147.19.68:8000/broadcasting/auth',
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  },
});

export default echo;
