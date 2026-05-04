import Echo from 'laravel-echo';

// Make sure to install 'pusher-js' for the Pusher client
import Pusher from 'pusher-js';

// Add this to the window object
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo?: Echo<"pusher">;
  }
}

window.Pusher = Pusher;

const token = localStorage.getItem('token');
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
let websocketConfig = {
  host: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
  port: parseInt(import.meta.env.VITE_PUSHER_PORT) || 6001,
  tls: import.meta.env.VITE_PUSHER_TLS === 'true',
};

if (websocketUrl) {
  const url = new URL(websocketUrl);
  websocketConfig = {
    host: url.hostname,
    port: url.port ? parseInt(url.port) : url.protocol === 'wss:' ? 443 : 80,
    tls: url.protocol === 'wss:',
  };
}

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'app-key',
  cluster: 'mt1', 
  wsHost: websocketConfig.host,
  wsPort: websocketConfig.port,
  wssPort: websocketConfig.port,
  forceTLS: websocketConfig.tls,
  disableStats: true, 
  enabledTransports: websocketConfig.tls ? ['wss'] : ['ws'],
  authEndpoint: import.meta.env.VITE_PUSHER_AUTH_ENDPOINT || 'http://localhost:8000/broadcasting/auth',
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  },
});

export default echo;
