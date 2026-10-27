        ["Paneer", "AED 340/kg", "+2%", T.accent],
      ].map(([name, price, delta, color]) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(8px, 2vw, 14px)",
            padding: "clamp(6px, 1.2vw, 10px) clamp(8px, 1.8vw, 12px)",
            borderRadius: "clamp(10px, 1.8vw, 14px)",
            border: `1px solid ${T.border}`,
            background: T.surface,
          }}
        >
          <span style={{ fontSize: "clamp(11px, 1.8vw, 14px)", fontWeight: 700, color: T.text }}>{name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 1.4vw, 10px)" }}>
            <span style={{ fontSize: "clamp(11px, 1.8vw, 14px)", fontWeight: 800, color: T.text, whiteSpace: "nowrap" }}>{price}</span>
            <span
              style={{
                fontSize: "clamp(9px, 1.4vw, 10px)",
                fontWeight: 800,
                padding: "clamp(1px, 0.4vw, 2px) clamp(6px, 1.4vw, 7px)",
                borderRadius: 999,
                whiteSpace: "nowrap",
                color,
                background: `${color}14`,
                border: `1px solid ${color}40`,
              }}
            >
              {delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsVisual() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(14px, 2.2vw, 20px)",
        background: `linear-gradient(160deg, ${T.surface} 0%, ${T.bg} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: "clamp(14px, 2vw, 18px)",
        boxShadow: "0 40px 120px -40px rgba(21,32,25,0.16)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <div style={{ fontSize: "clamp(16px, 2.6vw, 24px)", fontWeight: 800, color: T.text, lineHeight: 1 }}>Food Cost</div>
          <div style={{ fontSize: "clamp(10px, 1.6vw, 12px)", color: T.muted, marginTop: 4 }}>Last 7 days · Trending down</div>
        </div>
        <span
          style={{
            fontSize: "clamp(9px, 1.4vw, 10px)",
            fontWeight: 800,
            padding: "clamp(2px, 0.6vw, 3px) clamp(6px, 1.4vw, 8px)",
            borderRadius: 999,
            color: "#15803D",
            background: T.inset,
            border: `1px solid ${T.accentBorder}`,
            whiteSpace: "nowrap",
          }}
        >
          -2.1%
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "clamp(3px, 0.8vw, 5px)", height: "clamp(42%, 50%, 58%)" }}>
        {[68, 62, 58, 54, 51, 48, 46].map((h, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
            <div
              style={{
                width: "clamp(4px, 1vw, 6px)",
                height: `${h}%`,
                borderRadius: 999,
                background: i === 6 ? T.accent : T.accentBorder,
                boxShadow: i === 6 ? `0 10px 40px -20px ${T.accent}` : "none",
              }}
            />
            <span style={{ fontSize: "clamp(8px, 1.4vw, 9px)", color: T.faint }}>{["M","T","W","T","F","S","S"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visual({ type }: { type: VisualKey }) {
  switch (type) {
    case "overview":
      return <OverviewVisual />;
    case "pos":
      return <PosVisual />;
    case "tally":
      return <TallyVisual />;
    case "inventory":
      return <InventoryVisual />;
    case "ai":
      return <AiVisual />;
    case "prices":
      return <PricesVisual />;
    case "reports":
      return <ReportsVisual />;
    default:
      return <OverviewVisual />;
  }
}

export function FeaturesCarouselSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 3200,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ]
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<any>(null);

  const slides = useMemo(() => [...SLIDES, ...SLIDES], []);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    update();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const plugins = emblaApi.plugins();
    autoplayRef.current = (plugins.autoplay as any) || null;
  }, [emblaApi]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches && autoplayRef.current) {
      autoplayRef.current.stop();
    }
    const onChange = () => {
      if (!autoplayRef.current) return;
      if (reduce.matches) autoplayRef.current.stop();
      else if (!isPaused) autoplayRef.current.play();
    };
    reduce.addEventListener("change", onChange);
    return () => reduce.removeEventListener("change", onChange);
  }, [isPaused]);

  const onMouseEnter = () => {
    setIsPaused(true);
    autoplayRef.current?.stop();
  };
  const onMouseLeave = () => {
    setIsPaused(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduce.matches) autoplayRef.current?.play();
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section
      id="features-carousel"
      aria-labelledby="features-carousel-heading"
      style={{
        position: "relative",
        padding: "clamp(40px, 8vw, 96px) 0 clamp(24px, 6vw, 64px)",
        background: T.bg,
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans Variable','Plus Jakarta Sans',system-ui,sans-serif",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <style>{`
        @keyframes ppfc-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          #features-carousel *[style*="animation"] { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          width: "min(1200px, 92vw)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(20px, 5vw, 40px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "clamp(8px, 2vw, 14px)",
            padding: "0 clamp(4px, 2vw, 8px)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "clamp(3px, 0.8vw, 4px) clamp(8px, 2vw, 12px)",
              borderRadius: 999,
              fontSize: "clamp(10px, 1.8vw, 12px)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#15803D",
              background: T.inset,
              border: `1px solid ${T.accentBorder}`,
              boxShadow: `0 20px 80px -40px ${T.accent}`,
            }}
          >
            Built for Busy Kitchens
          </span>
          <h2
            id="features-carousel-heading"
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5.6vw, 56px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 800,
              color: T.text,
            }}
          >
            See{" "}
            <span style={{ color: T.accent }}>PlatePilot</span>{" "}
            in Action
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: "min(720px, 88vw)",
              fontSize: "clamp(14px, 2.2vw, 18px)",
              lineHeight: 1.7,
              color: T.muted,
            }}
          >
            From POS to Tally, inventory, AI insights and reports — watch your operations flow in one seamless carousel.
          </p>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(10px, 2vw, 14px)",
          }}
        >
          <div
            className="embla"
            ref={emblaRef}
            style={{
              overflow: "hidden",
              padding: "clamp(4px, 1vw, 8px) clamp(2px, 1vw, 6px) clamp(8px, 2vw, 16px)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
              maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div
              className="embla__container"
              style={{ display: "flex", alignItems: "stretch", gap: "clamp(14px, 2.2vw, 20px)" }}
            >
              {slides.map((slide, i) => (
                <div
                  key={`${slide.visual}-${i}`}
                  className="embla__slide"
                  style={{
                    flex: "0 0 auto",
                    minWidth: 0,
                    width: "clamp(280px, 78vw, 360px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(10px, 2vw, 14px)",
                    padding: "clamp(10px, 2vw, 14px)",
                    borderRadius: "clamp(18px, 2.4vw, 22px)",
                    background: `linear-gradient(180deg, ${T.surface} 0%, rgba(255,255,255,0.98) 100%)`,
                    border: `1px solid ${T.border}`,
                    boxShadow: "0 60px 160px -60px rgba(21,32,25,0.22)",
                    transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
                    willChange: "transform",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "clamp(6px, 1.4vw, 10px)",
                      padding: "clamp(4px, 1vw, 6px) clamp(4px, 1vw, 6px) 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "clamp(2px, 0.6vw, 3px) clamp(8px, 1.8vw, 10px)",
                        borderRadius: 999,
                        fontSize: "clamp(9px, 1.6vw, 11px)",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#15803D",
                        background: T.inset,
                        border: `1px solid ${T.accentBorder}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {slide.pill}
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "clamp(16px, 2.4vw, 20px)",
                        lineHeight: 1.12,
                        letterSpacing: "-0.01em",
                        fontWeight: 800,
                        color: T.text,
                      }}
                    >
                      {slide.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "clamp(12px, 1.9vw, 14px)",
                        lineHeight: 1.7,
                        color: T.muted,
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 10",
                      borderRadius: "clamp(14px, 2vw, 16px)",
                      overflow: "hidden",
                      border: `1px solid ${T.borderMid}`,
                      background: `radial-gradient(140% 140% at 50% 0%, ${T.bg} 0%, ${T.surface} 100%)`,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 30px 120px -50px rgba(21,32,25,0.28)",
                    }}
                  >
                    <Visual type={slide.visual} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(8px, 2vw, 10px)",
              flexWrap: "wrap",
              padding: "0 clamp(4px, 2vw, 8px)",
            }}
          >
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="Previous slide"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "clamp(38px, 4vw, 42px)",
                height: "clamp(38px, 4vw, 42px)",
                borderRadius: 999,
                border: `1px solid ${canPrev ? T.borderStrong : T.border}`,
                background: T.surface,
                color: canPrev ? T.text : T.faint,
                cursor: canPrev ? "pointer" : "not-allowed",
                transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, background 160ms ease",
                boxShadow: canPrev ? "0 20px 80px -40px rgba(21,32,25,0.24)" : "none",
              }}
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="Next slide"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "clamp(38px, 4vw, 42px)",
                height: "clamp(38px, 4vw, 42px)",
                borderRadius: 999,
                border: `1px solid ${canNext ? T.borderStrong : T.border}`,
                background: T.surface,
                color: canNext ? T.text : T.faint,
                cursor: canNext ? "pointer" : "not-allowed",
                transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, background 160ms ease",
                boxShadow: canNext ? "0 20px 80px -40px rgba(21,32,25,0.24)" : "none",
              }}
            >
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
