import { registerRootComponent } from 'expo';
import App from './App';

console.log('Index: Application starting...');

if (typeof window !== 'undefined') {
  const debugText = document.createElement('div');
  debugText.innerHTML = '<h1>JS LOADING...</h1>';
  debugText.style.color = 'lime';
  debugText.style.position = 'absolute';
  debugText.style.top = '0';
  debugText.style.zIndex = '9999';
  document.body.appendChild(debugText);
  
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('GLOBAL ERROR:', message, error);
  };
}

registerRootComponent(App);
