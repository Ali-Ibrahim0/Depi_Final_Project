import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'   // ← هنا الـ Bootstrap CSS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
window.showNotification = (message, type = "success") => {

  const old = document.getElementById("global-notification");
  if (old) old.remove();

  const div = document.createElement("div");
  div.id = "global-notification";
  div.textContent = message;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    padding: 1rem 2rem;
    border-radius: 12px;
    color: ${type === "success" ? "#000" : "#fff"};
    background: ${type === "success" ? "#D4A017" : "#EF4444"};
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: slideIn 0.5s ease-out;
  `;

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.animation = "slideOut 0.5s ease-in forwards";
    setTimeout(() => div.remove(), 500);
  }, 3000);
};


const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);