import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { content } from './content';
import { Agentation } from 'agentation';
import Sketch from './components/Sketch';
import ProgressiveImage from './components/ProgressiveImage';
import ProjectIndex, { useProjectIndex } from './components/ProjectIndex';
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription } from './components/ui/dialog';
import './styles.css';
import sleepingMaltese from './assets/photos/sleeping-maltese.webp';

const showAgentation = import.meta.env.DEV || import.meta.env.MODE === 'review';
const CLOCK_FLIP_STEPS = 4;
const CLOCK_FLIP_INTERVAL = 75;
const avatar = Object.values(import.meta.glob('./assets/photos/avatar.webp', { eager: true, query: '?progressive', import: 'default' }))[0];

function LocalClock({ locale }) {
  const [time, setTime] = useState(new Date());
  const [flipFrame, setFlipFrame] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? CLOCK_FLIP_STEPS : 0);
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => clearInterval(interval);
    let frame = 0;
    const flip = setInterval(() => {
      frame += 1;
      setFlipFrame(frame);
      if (frame >= CLOCK_FLIP_STEPS) clearInterval(flip);
    }, CLOCK_FLIP_INTERVAL);
    return () => { clearInterval(interval); clearInterval(flip); };
  }, []);
  const actualTime = new Intl.DateTimeFormat(locale === 'es' ? 'es-CL' : 'en-GB', { timeZone: content[locale].timeZone, hour: '2-digit', minute: '2-digit' }).format(time);
  const displayTime = actualTime.split('').map((character, index) => character === ':' || flipFrame >= CLOCK_FLIP_STEPS ? character : String((Number(character) + CLOCK_FLIP_STEPS - flipFrame + index * 2) % 10));
  return <span className="local-time"><span className="time-dot" /><time className="flip-clock" dateTime={time.toISOString()} aria-label={actualTime}>{displayTime.map((character, index) => character === ':' ? <span className="flip-separator" key="separator">:</span> : <span className="flip-digit" style={{ '--flip-delay': `${index * 8}ms` }} key={`${index}-${flipFrame}`}>{character}</span>)}</time><span>{content[locale].location}</span></span>;
}

function WeatherCloud() {
  return <span className="footer-weather" aria-hidden="true">☁︎</span>;
}

function EntryDialog({ entry, open, copy }) {
  const { scrollRef, sections, activeSection, navigate } = useProjectIndex(entry, open, copy);
  return (
    <DialogContent>
      <DialogClose asChild><button className="dialog-close" aria-label={copy.closeDialog}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10 M15 5 5 15" /></svg></button></DialogClose>
      <div className="dialog-scroll" ref={scrollRef}>
        <div className="dialog-inner">
          <ProjectIndex entry={entry} sections={sections} activeSection={activeSection} navigate={navigate} copy={copy} />
          <article className="dialog-article">
            <header id={sections[0].id} tabIndex={-1} className="dialog-anchor"><p className="eyebrow">{entry.category} · {entry.year}</p>
            <DialogTitle asChild><h2>{entry.title}</h2></DialogTitle></header>
            <figure className="project-hero-placeholder" role="img" aria-label={`${copy.projectHeroAria} ${entry.title}`}>
              <span>{copy.projectHero}</span>
            </figure>
            <div className="dialog-doodles" aria-hidden="true">
              {entry.doodles?.map((doodle, index) => <Sketch key={doodle.kind} kind={doodle.kind} className={`dialog-doodle doodle-slot-${index + 1} doodle-${doodle.tone}`} />)}
            </div>
            <DialogDescription asChild><p className="dialog-lead">{entry.body}</p></DialogDescription>
            <section className="dialog-section dialog-anchor" id={sections[1].id} tabIndex={-1}><h3>{copy.projectStartingPoint}</h3><p>{entry.details}</p></section>
            {entry.sections?.map((section, index) => <section className="dialog-section dialog-anchor" id={sections[index + 2].id} tabIndex={-1} key={section.title}><h3>{section.title}</h3>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
            <p className="draft-note">{copy.draftNote}</p>
          </article>
        </div>
      </div>
    </DialogContent>
  );
}

function App() {
  const [language, setLanguage] = useState(() => window.localStorage.getItem('site-language-choice') || 'en');
  const copy = content[language];
  const [active, setActive] = useState(null);
  useEffect(() => {
    const sync = () => setActive(content[language].projects.find(e => e.id === window.location.hash.slice(1).split('/')[0]) || null);
    sync(); window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('site-language-choice', language);
    document.title = 'Francisco Bulnes - Designer';
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'es'
      ? 'Un pequeño espacio para el diseño, los proyectos y las ideas de Fran Bulnes.'
      : 'A small space for Fran Bulnes’s design work, projects, and ideas.');
  }, [language]);
  const close = () => { setActive(null); window.history.replaceState(null, '', window.location.pathname + window.location.search); };
  return (
    <>
      <a className="skip-link" href="#contenido">{copy.skipLink}</a>
      <div className="site-wrap" id="inicio">
        <nav className="language-switch" aria-label={copy.languageLabel}>
          <button type="button" lang="es" aria-pressed={language === 'es'} onClick={() => setLanguage('es')}>ES</button>
          <span aria-hidden="true">/</span>
          <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
        </nav>
        <header className="site-header">
          {avatar && <div className="avatar-scene"><img src={sleepingMaltese} className="avatar-sleeping-dog" alt="" aria-hidden="true" /><ProgressiveImage image={avatar} alt={`${copy.avatarAlt} ${copy.name}`} className="site-avatar" loading="eager" fetchPriority="high" fallback="FB" /></div>}
          <h1>{copy.name}</h1>
          <p className="updated">{copy.updated}</p>
        </header>
        <main id="contenido">
          <section className="intro" aria-label={copy.sectionLabel}>
            <div className="intro-copy">
              <p className="intro-lead">{copy.introduction}</p>
              {copy.biography.map((paragraph, index) => <p key={index}>{paragraph.map((segment, part) => segment.href ? <a key={part} href={segment.href === 'mailto:' ? `${segment.href}${copy.email}` : segment.href} target={segment.href.startsWith('mailto:') ? undefined : '_blank'} rel={segment.href.startsWith('mailto:') ? undefined : 'noreferrer'}>{segment.text}</a> : <React.Fragment key={part}>{segment.text}</React.Fragment>)}</p>)}
            </div>
          </section>

          <section className="projects section" id="proyectos" aria-labelledby="projects-title">
            <div className="section-heading"><h2 id="projects-title">{copy.projectsTitle}</h2></div>
            {copy.projects.length === 0 ? <div className="projects-empty" aria-label={copy.projectsEmptyAria}>
              <div className="project-list project-list-blurred" aria-hidden="true">
                {[0, 1, 2].map((row) => <div className="project-row project-row-skeleton" key={row}><span className="skeleton-year" /><div className="project-text"><span className="skeleton-title" /><span className="skeleton-category" /></div><span className="skeleton-date" /></div>)}
              </div>
              <div className="projects-empty-label">{copy.projectsEmptyLabel}</div>
            </div> : <div className="project-list">{copy.projects.map((p) => <Dialog key={p.id} open={active?.id === p.id} onOpenChange={open => open ? setActive(p) : close()}>
              <DialogTrigger asChild><a className="project-row" href={`#${p.id}`}>
                <span className="project-number">{p.year}</span><div className="project-text"><h3>{p.title}</h3><p>{p.category}</p></div><time className="project-date" dateTime={p.dateISO}>({p.date})</time>
              </a></DialogTrigger>
              <EntryDialog entry={p} open={active?.id === p.id} copy={copy} />
            </Dialog>)}</div>}
          </section>
        </main>
        <footer className="site-footer"><LocalClock locale={language} /><WeatherCloud /></footer>
      </div>
      {showAgentation && <Agentation appName="Fran — revisión de diseño" />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
