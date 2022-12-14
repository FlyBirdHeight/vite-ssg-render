import { createRoot } from 'react-dom/client';
import { React } from 'react';
import { App } from './App';

function renderInBrowser() {
  const containerEl = document.getElementById('app');
  if (!containerEl) {
    throw new Error('#app element is not exist!');
  }

  const root = createRoot(containerEl);
  root.render(<App />);
}

renderInBrowser();
