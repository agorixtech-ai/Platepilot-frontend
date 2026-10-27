import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";

const PHOTOS = [
  { src: "/gallery/real-world-01.jpeg", alt: "Restaurant owner reviewing service and sales information with PlatePielet", title: "A clearer view of every service", detail: "Sales, stock and costs come together while the restaurant keeps moving.", tag: "One live view" },
  { src: "/gallery/real-world-02.jpeg", alt: "Restaurant team using operational insights during a busy shift", title: "Know what is happening now", detail: "Spot the changes that matter before they become end-of-week surprises.", tag: "Daily operations" },
  { src: "/gallery/real-world-03.jpeg", alt: "Restaurant operator checking food costs and performance", title: "Keep food costs in focus", detail: "Connect what you buy with what your guests order.", tag: "Food cost" },
  { src: "/gallery/real-world-04.jpeg", alt: "Kitchen and restaurant data brought together in a shared view", title: "Bring every outlet into view", detail: "Compare locations with the same clear picture of performance.", tag: "Multi outlet" },
  { src: "/gallery/real-world-05.jpeg", alt: "Restaurant owner reviewing menu and sales performance", title: "Make the menu work harder", detail: "See which dishes bring in demand and contribution.", tag: "Menu insights" },
  { src: "/gallery/real-world-06.jpeg", alt: "Restaurant team checking inventory and purchasing signals", title: "Stay ahead of stock decisions", detail: "Turn purchasing and inventory signals into a more confident next step.", tag: "Inventory" },
  { src: "/gallery/real-world-07.jpeg", alt: "Restaurant operator exploring business performance with PlatePielet", title: "Ask your numbers a better question", detail: "Get operational answers from the data your team already works with.", tag: "PlatePielet AI" },
  { src: "/gallery/real-world-08.jpeg", alt: "Restaurant owner bringing sales, stock and accounting into one view", title: "Run the business from one place", detail: "A connected view of sales, purchasing, stock and performance.", tag: "Connected operations" },
];

const AUTOPLAY_MS = 3600;
const SWIPE_PX = 44;

export function PhotoCarouselSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  /* Lightbox state. openRef mirrors the state so the autoplay interval and
     keyboard handler read the current value without re-running every render. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openRef = useRef<number | null>(null);
  openRef.current = openIndex;
  const lightboxOpen = openIndex !== null;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const step = useCallback((dir: 1 | -1) => {
    const i = openRef.current;
    if (i === null) return;
    setOpenIndex((i + dir + PHOTOS.length) % PHOTOS.length);
  }, []);

  /* Autoplay is hand-rolled (setInterval + scrollNext) rather than pulling in
     embla-carousel-autoplay, so the only opt-out is prefers-reduced-motion —
     the same guard every other animation on this page uses. */
  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || openRef.current !== null || document.hidden) return;
      emblaApi.scrollNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  /* Lightbox open/close lifecycle: keyboard shortcuts, background scroll lock,
     focus capture + restore. Only runs on open↔close, so arrow navigation
     doesn't yank focus. */
  useEffect(() => {
    if (!lightboxOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const scroller = document.querySelector<HTMLElement>(".app-page-scroll");
    const prevOverflow = scroller?.style.overflow ?? "";
    if (scroller) scroller.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        // Minimal focus trap: cycle through the dialog's own buttons only.
        const dialog = document.getElementById("pp-lightbox");
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll("button"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialog.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      if (scroller) scroller.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [lightboxOpen, step]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(delta) >= SWIPE_PX) step(delta < 0 ? 1 : -1);
  };

  const current = openIndex !== null ? PHOTOS[openIndex] : null;

  return (
    <section
      id="photo-gallery"
      aria-labelledby="photo-gallery-heading"
      className="pp-photo-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <style>{`
        .pp-photo-carousel {
          position: relative;
          isolation: isolate;
          width: 100%;
          max-width: 100%;
          padding: clamp(2.5rem, 4vw, 3.75rem) 0;
        }
        .pp-photo-carousel::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 100vw;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at 78% 0%, rgba(218,238,224,.78) 0%, rgba(242,247,243,0) 42%), linear-gradient(180deg, #F1F6F2 0%, #FAFCFA 100%);
          pointer-events: none;
        }
        .pp-photo-carousel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(1.25rem, 3vw, 2.5rem);
          margin-bottom: clamp(1.25rem, 2.5vw, 2rem);
        }
        .pp-photo-carousel-head > div:first-child { min-width: 0; flex: 1 1 auto; }
        .pp-photo-carousel-head .sw-section-h2 { margin-bottom: 12px; }
        .pp-photo-carousel-head .sw-section-body { max-width: 560px; margin-bottom: 0; color: #4B5B50; }
        .pp-photo-carousel-viewport {
          position: relative;
          width: 100%;
          max-width: 100%;
          padding-right: clamp(12px, 1.5vw, 20px);
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
        }
        .pp-photo-carousel-viewport:active { cursor: grabbing; }
        .pp-photo-carousel-track {
          display: flex;
          gap: clamp(24px, 2.4vw, 36px);
          min-width: 0;
        }
        .pp-photo-carousel-slide {
          position: relative;
          flex: 0 0 calc(50% - clamp(12px, 1.2vw, 18px));
          width: calc(50% - clamp(12px, 1.2vw, 18px));
          min-width: 0;
          aspect-ratio: 16 / 9;
          border-radius: clamp(18px, 2.5vw, 30px);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.6);
          background: #14241B;
          box-shadow: 0 28px 70px -36px rgba(21,32,25,0.55);
          margin: 0;
        }
        .pp-photo-carousel-hit {
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
          padding: 0;
          background: none;
          cursor: zoom-in;
          position: relative;
        }
        .pp-photo-carousel-hit:focus-visible {
          outline: 2px solid #15803D;
          outline-offset: -3px;
        }
        .pp-photo-carousel-hit img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .pp-photo-carousel-slide:hover img { transform: scale(1.04); }
        .pp-photo-carousel-shade {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          gap: clamp(5px, .8vw, 9px);
          padding: clamp(18px, 2.2vw, 30px);
          color: #fff;
          text-align: left;
          background: linear-gradient(0deg, rgba(8,20,13,.92) 0%, rgba(8,20,13,.72) 34%, rgba(8,20,13,0) 82%), linear-gradient(90deg, rgba(8,20,13,.42), transparent 82%);
          pointer-events: none;
        }
        .pp-photo-carousel-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.26);
          border-radius: 999px;
          background: rgba(13,31,20,.46);
          backdrop-filter: blur(10px);
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .04em;
        }
        .pp-photo-carousel-brand-mark { width: 8px; height: 8px; border-radius: 50%; background: #8DE0A8; box-shadow: 0 0 0 4px rgba(141,224,168,.15); }
        .pp-photo-carousel-tag { margin-top: 3px; color: #B6F0C7; font-size: clamp(9px, .75vw, 10px); font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        .pp-photo-carousel-title { max-width: min(88%, 420px); margin: 0; font-size: clamp(1.15rem, 1.8vw, 1.7rem); line-height: 1.12; letter-spacing: -.035em; font-weight: 750; text-wrap: balance; }
        .pp-photo-carousel-detail { max-width: min(88%, 380px); margin: 0; color: rgba(255,255,255,.9); font-size: clamp(.75rem, .95vw, .9rem); line-height: 1.45; }
        .pp-photo-carousel-zoom {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: rgba(255,255,255,0.94);
          color: #152019;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          box-shadow: 0 10px 30px -12px rgba(21,32,25,0.6);
          pointer-events: none;
        }
        .pp-photo-carousel-slide:hover .pp-photo-carousel-zoom,
        .pp-photo-carousel-hit:focus-visible .pp-photo-carousel-zoom {
          opacity: 1;
          transform: none;
        }
        .pp-photo-carousel-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          margin-right: clamp(12px, 1.5vw, 20px);
        }
        .pp-photo-carousel-btn {
          width: clamp(38px, 4vw, 44px);
          height: clamp(38px, 4vw, 44px);
          border-radius: 999px;
          border: 1px solid #0F7A4C;
          background: #0F7A4C;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
          box-shadow: 0 14px 40px -26px rgba(21,32,25,0.5);
        }
        .pp-photo-carousel-btn:hover {
          border-color: #075C38;
          background: #075C38;
          color: #FFFFFF;
          transform: translateY(-1px);
        }
        .pp-photo-carousel-btn:focus-visible {
          outline: 2px solid #15803D;
          outline-offset: 2px;
        }
        .pp-photo-carousel-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 1.25rem 0 0;
        }
        .pp-photo-carousel-dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: #DDE7E1;
          cursor: pointer;
          transition: width 0.25s ease, background 0.25s ease;
        }
        .pp-photo-carousel-dot[aria-current="true"] {
          width: 26px;
          background: #15803D;
        }

        /* ── Lightbox ── */
        .pp-lb {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          background: rgba(8, 16, 11, 0.94);
          backdrop-filter: blur(6px);
          animation: pp-lb-in 0.22s ease;
        }
        @keyframes pp-lb-in { from { opacity: 0; } to { opacity: 1; } }
        .pp-lb-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: clamp(14px, 2vw, 20px) clamp(16px, 3vw, 28px);
          flex-shrink: 0;
        }
        .pp-lb-count {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }
        .pp-lb-btn {
          width: clamp(40px, 4vw, 46px);
          height: clamp(40px, 4vw, 46px);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.24);
          background: rgba(255,255,255,0.08);
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .pp-lb-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.5);
          transform: translateY(-1px);
        }
        .pp-lb-btn:focus-visible { outline: 2px solid #4ADE80; outline-offset: 2px; }
        .pp-lb-body {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2vw, 24px);
          padding: 0 clamp(10px, 3vw, 28px) clamp(24px, 4vw, 40px);
        }
        .pp-lb-stage {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          min-height: 0;
          max-width: min(1100px, 88vw);
        }
        .pp-lb-stage img {
          max-width: 100%;
          max-height: calc(100vh - 200px);
          max-height: calc(100dvh - 200px);
          object-fit: contain;
          border-radius: clamp(10px, 1.6vw, 16px);
          background: #0B130E;
          box-shadow: 0 50px 130px -50px rgba(0,0,0,0.9);
          animation: pp-lb-img 0.28s ease;
        }
        @keyframes pp-lb-img {
          from { opacity: 0; transform: scale(0.985); }
          to { opacity: 1; transform: none; }
        }
        .pp-lb-caption {
          font-size: 0.82rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.66);
          text-align: center;
        }
        @media (max-width: 600px) {
          .pp-photo-carousel { padding: 2.5rem 0; }
          .pp-photo-carousel-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.1rem;
            margin-bottom: 1.25rem;
          }
          .pp-photo-carousel-viewport { padding-right: 12px; }
          .pp-photo-carousel-slide { flex-basis: 100%; width: 100%; aspect-ratio: 4 / 3; }
          .pp-photo-carousel-shade { padding: 18px; gap: 5px; }
          .pp-photo-carousel-title { max-width: 94%; font-size: clamp(1.2rem, 5vw, 1.5rem); }
          .pp-photo-carousel-detail { max-width: 94%; font-size: .8rem; }
          .pp-photo-carousel-nav { align-self: flex-end; margin-right: 0; }
          .pp-photo-carousel-dots { margin-right: 0; }
          .pp-lb-nav { display: none; }
        }
        @media (max-width: 900px) {
          .pp-photo-carousel-slide { flex-basis: 100%; width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pp-photo-carousel-slide img,
          .pp-photo-carousel-btn,
          .pp-photo-carousel-dot,
          .pp-photo-carousel-zoom,
          .pp-lb,
          .pp-lb-stage img,
          .pp-lb-btn { transition: none; animation: none; }
          .pp-photo-carousel-slide:hover img { transform: none; }
          .pp-photo-carousel-slide:hover .pp-photo-carousel-zoom { transform: none; }
        }
      `}</style>

      <div className="pp-photo-carousel-head">
        <div>
          <div className="sw-section-tag">Inside the restaurant</div>
          <h2 id="photo-gallery-heading" className="sw-section-h2">
            PlatePielet in the <em>real world.</em>
          </h2>
          <p className="sw-section-body">
            A closer look at how one connected view can make the work behind every service clearer.
          </p>
        </div>
        <div className="pp-photo-carousel-nav">
          <button
            type="button"
            className="pp-photo-carousel-btn"
            onClick={scrollPrev}
            aria-label="Previous photo"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="pp-photo-carousel-btn"
            onClick={scrollNext}
            aria-label="Next photo"
          >
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="pp-photo-carousel-viewport" ref={emblaRef}>
        <div className="pp-photo-carousel-track">
          {PHOTOS.map((photo, i) => (
            <figure className="pp-photo-carousel-slide" key={photo.src}>
              <button
                type="button"
                className="pp-photo-carousel-hit"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open ${photo.title} photo fullscreen`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <span className="pp-photo-carousel-shade">
                  <span className="pp-photo-carousel-brand">
                    <span className="pp-photo-carousel-brand-mark" />
                    PlatePielet
                  </span>
                  <span className="pp-photo-carousel-tag">{photo.tag}</span>
                  <span className="pp-photo-carousel-title">{photo.title}</span>
                  <span className="pp-photo-carousel-detail">{photo.detail}</span>
                </span>
                <span className="pp-photo-carousel-zoom" aria-hidden="true">
                  <Maximize2 size={16} strokeWidth={2.2} />
                </span>
              </button>
            </figure>
          ))}
        </div>
      </div>

      <div className="pp-photo-carousel-dots">
        {PHOTOS.map((photo, i) => (
          <button
            type="button"
            key={photo.src}
            className="pp-photo-carousel-dot"
            aria-label={`Go to slide ${i + 1}: ${photo.title}`}
            aria-current={selected === i}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>

      {/* Portalled to <body>: `main` on this page creates a z-index:1 stacking
          context, so an in-place fixed overlay would sit under the sticky nav
          and the back-to-top button. */}
      {current &&
        openIndex !== null &&
        createPortal(
          <div
            id="pp-lightbox"
            className="pp-lb"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={(e) => {
              // Backdrop only — clicks on the photo/swipe gestures must not close.
              if (e.target === e.currentTarget) setOpenIndex(null);
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="pp-lb-bar" onClick={(e) => e.stopPropagation()}>
              <span className="pp-lb-count">
                {String(openIndex + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                ref={closeBtnRef}
                className="pp-lb-btn"
                onClick={() => setOpenIndex(null)}
                aria-label="Close viewer"
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            <div
              className="pp-lb-body"
              onClick={(e) => {
                if (e.target === e.currentTarget) setOpenIndex(null);
              }}
            >
              <button
                type="button"
                className="pp-lb-btn pp-lb-nav"
                onClick={() => step(-1)}
                aria-label="Previous photo"
              >
                <ArrowLeft size={20} strokeWidth={2.2} />
              </button>
              <figure className="pp-lb-stage">
                <img src={current.src} alt={current.alt} />
                <figcaption className="pp-lb-caption">
                  <strong>{current.title}</strong> · {openIndex + 1} of {PHOTOS.length}
                </figcaption>
              </figure>
              <button
                type="button"
                className="pp-lb-btn pp-lb-nav"
                onClick={() => step(1)}
                aria-label="Next photo"
              >
                <ArrowRight size={20} strokeWidth={2.2} />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
