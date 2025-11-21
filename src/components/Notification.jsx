import { useEffect } from 'react';

export default function Notification({ message, type = 'success' }) {
  useEffect(() => {
    if (!message) return;

    const el = document.getElementById('notification');
    el.textContent = message;
    el.className = `notification ${type}`;

    window.gsap.fromTo(el, 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );

    setTimeout(() => {
      window.gsap.to(el, {
        opacity: 0, y: -20, duration: 0.5,
        onComplete: () => el.className = 'notification'
      });
    }, 3000);

  }, [message, type]);

  if (!message) return null;

  return <div id="notification" className="notification" />;
}