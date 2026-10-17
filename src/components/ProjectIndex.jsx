import { useEffect, useMemo, useRef, useState } from 'react';
import { DialogClose } from './ui/dialog';

function scrollToSection(container, id, behavior = 'smooth', focus = false) {
  const target = document.getElementById(id);
  if (!container || !target) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sidebar = container.querySelector('.dialog-sidebar');
  const offset = window.matchMedia('(max-width: 760px)').matches ? (sidebar?.offsetHeight || 84) + 18 : 40;
  container.scrollTo({ top: target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - offset, behavior: reduced ? 'instant' : behavior });
  if (focus) target.focus({ preventScroll: true });
}

export function useProjectIndex(entry, open, copy) {
  const scrollRef = useRef(null);
  const selectedByNavigation = useRef(null);
  const sections = useMemo(() => [
    { id: `${entry.id}-introduccion`, title: copy.projectIntroduction },
    { id: `${entry.id}-punto-de-partida`, title: copy.projectStartingPoint },
    ...(entry.sections || []).map((section, index) => ({ id: `${entry.id}-seccion-${index + 1}`, title: section.title })),
  ], [entry, copy]);
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    if (!open) return;
    let cleanup = () => {};
    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current;
      if (!container) return;
      const update = () => {
        if (selectedByNavigation.current) { setActiveSection(selectedByNavigation.current); return; }
        const sidebar = container.querySelector('.dialog-sidebar');
        const markerOffset = window.matchMedia('(max-width: 760px)').matches ? (sidebar?.offsetHeight || 84) + 20 : 100;
        const marker = container.getBoundingClientRect().top + markerOffset;
        let current = sections[0].id;
        for (const section of sections) {
          if (document.getElementById(section.id)?.getBoundingClientRect().top <= marker) current = section.id;
        }
        if (container.scrollTop > 0 && container.scrollHeight - container.scrollTop - container.clientHeight < 2) current = sections.at(-1).id;
        setActiveSection(current);
      };
      const readHash = () => {
        const id = window.location.hash.slice(1).split('/')[1];
        selectedByNavigation.current = sections.some(section => section.id === id) ? id : sections[0].id;
        scrollToSection(container, selectedByNavigation.current, 'instant');
        update();
      };
      readHash();
      const manualScroll = () => { selectedByNavigation.current = null; update(); };
      container.addEventListener('scroll', update, { passive: true });
      container.addEventListener('wheel', manualScroll, { passive: true });
      container.addEventListener('touchstart', manualScroll, { passive: true });
      container.addEventListener('pointerdown', manualScroll);
      container.addEventListener('keydown', manualScroll);
      window.addEventListener('hashchange', readHash);
      cleanup = () => { container.removeEventListener('scroll', update); container.removeEventListener('wheel', manualScroll); container.removeEventListener('touchstart', manualScroll); container.removeEventListener('pointerdown', manualScroll); container.removeEventListener('keydown', manualScroll); window.removeEventListener('hashchange', readHash); };
    });
    return () => { cancelAnimationFrame(frame); cleanup(); };
  }, [entry.id, open, sections]);

  function navigate(event, id) {
    event.preventDefault();
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${entry.id}/${id}`);
    selectedByNavigation.current = id;
    scrollToSection(scrollRef.current, id, 'smooth', true);
    setActiveSection(id);
  }

  return { scrollRef, sections, activeSection, navigate };
}

export default function ProjectIndex({ entry, sections, activeSection, navigate, copy }) {
  const tocRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const toc = tocRef.current;
    if (!toc) return;
    const update = () => setShowScrollHint(toc.scrollWidth - toc.scrollLeft - toc.clientWidth > 2);
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(toc);
    toc.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); toc.removeEventListener('scroll', update); };
  }, [sections]);

  return (
    <aside className="dialog-sidebar">
      <DialogClose asChild><button type="button" className="dialog-index-back"><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m6 4-4 4 4 4 M2 8h9a4 4 0 0 0 0-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 2)" /></svg>{copy.home}</button></DialogClose>
      <div className="dialog-toc-frame" data-scroll-hint={showScrollHint ? 'true' : undefined}>
        <nav ref={tocRef} className="dialog-toc" aria-label={`${copy.projectSections} ${entry.title}`}>
          {sections.map(section => <a key={section.id} href={`#${entry.id}/${section.id}`} aria-current={activeSection === section.id ? 'location' : undefined} onClick={event => navigate(event, section.id)}>{section.title}</a>)}
        </nav>
      </div>
    </aside>
  );
}
