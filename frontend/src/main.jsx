import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Readable, Writable, Duplex } from 'readable-stream';


// Global polyfills for mobile compatibility
window.global = window;
window.process = window.process || {};
window.process.nextTick = window.process.nextTick || function (cb) { setTimeout(cb, 0); };

// Polyfill for simple-peer/stream-browserify
window.ReadableStream = window.ReadableStream || Readable;
window.WritableStream = window.WritableStream || Writable;
window.DuplexStream = window.DuplexStream || Duplex;

// Mobile-specific viewport handling
const setViewportHeight = () => {
  // Set CSS custom property for mobile viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set initial viewport height
setViewportHeight();

// Update viewport height on resize (mobile orientation changes)
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100);
});

// Mobile-specific touch event handling
document.addEventListener('touchstart', function() {}, { passive: true });
document.addEventListener('touchmove', function() {}, { passive: true });

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
