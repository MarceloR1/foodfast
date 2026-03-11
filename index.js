import { registerRootComponent } from 'expo';
import App from './DebugApp';

console.log('Index: Application starting...');

if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('GLOBAL ERROR:', message, error);
  };
}

registerRootComponent(App);
