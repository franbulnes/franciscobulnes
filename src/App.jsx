import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function getSantiagoTime() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
    .format(new Date())
    .toLowerCase();
}

function LocalClock() {
  const [time, setTime] = useState(getSantiagoTime);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getSantiagoTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="clock" aria-label={`Current time in Santiago, Chile: ${time}`}>
      <span className="clock-digits" aria-hidden="true">{time}</span>
      <span className="clock-location"> in Santiago, Chile</span>
      <span className="sparkle" aria-hidden="true"> ‧₊˚✧</span>
    </footer>
  );
}

function App() {
  return (
    <main className="page-shell">
      <section className="bio" aria-labelledby="site-title">
        <h1 id="site-title">Fran Bulnes</h1>
        <p className="updated">Updated July 8th, 2026</p>

        <p>
          I was born in Santiago de Chile, and have lived in Buenos Aires and China. Currently living in Santiago.
        </p>

        <p>
          I currently work at <a href="https://topsort.com" target="_blank" rel="noreferrer">Topsort</a>, where I lead design for Topsort&apos;s Products. Previously, I was Staff Product Designer at <a href="https://getjusto.com" target="_blank" rel="noreferrer">Get Justo</a> and <a href="https://www.uber.com/cl/es/about/cornershop/" target="_blank" rel="noreferrer">Cornershop</a> (acquired by Uber).
        </p>

        <p>
          I consider myself a strategic visual designer, passionate about building products from 0 to 1.
        </p>

        <p>
          You can find me on <a href="https://x.com/franentrenubes" target="_blank" rel="noreferrer">X</a>, <a href="http://instagram.com/franentrenubes" target="_blank" rel="noreferrer">Instagram</a>, or reach me via <a href="mailto:fran@entrenubes.cl">email</a>.
        </p>
      </section>

      <LocalClock />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
