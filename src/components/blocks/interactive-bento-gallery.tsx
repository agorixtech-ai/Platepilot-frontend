import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type BentoMediaItem = {
  id: number;
  type: "image" | "video" | "ui";
  title: string;
  desc: string;
  /** image/video source; unused for type "ui" */
  url?: string;
  /** rendered UI mockup for type "ui" */
  node?: ReactNode;
  span: string;
};

type MediaItemProps = {
  item: BentoMediaItem;
  className?: string;
  onClick?: () => void;
};

function MediaItem({ item, className, onClick }: MediaItemProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { root: null, rootMargin: "50px", threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    const handleVideoPlay = async () => {
      if (!mounted) return;
      try {
        if (video.readyState >= 3) {
          setIsBuffering(false);
          await video.play();
        } else {
          setIsBuffering(true);
          await new Promise<void>((resolve) => {
            video.oncanplay = () => resolve();
          });
          if (mounted) {
            setIsBuffering(false);
            await video.play();
          }
        }
      } catch (error) {
        console.warn("Video playback failed:", error);
      }
    };

    if (isInView) {
      void handleVideoPlay();
    } else {
      video.pause();
    }

    return () => {
      mounted = false;
    };
  }, [isInView]);

  if (item.type === "ui") {
    return (
      <div
        className={cn("h-full w-full cursor-pointer overflow-hidden bg-white", className)}
        onClick={onClick}
      >
        {item.node}
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.8 : 1,
            transition: "opacity 0.2s",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      className={cn("h-full w-full cursor-pointer object-cover", className)}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
}

type GalleryModalProps = {
  selectedItem: BentoMediaItem;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: BentoMediaItem) => void;
  mediaItems: BentoMediaItem[];
};

function GalleryModal({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#F6FAF7]/95 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          className="pointer-events-auto relative w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.id}
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#DDE7E1] shadow-2xl"
              initial={{ y: 20, scale: 0.97 }}
              animate={{
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 },
              }}
              exit={{ y: 20, scale: 0.97, transition: { duration: 0.15 } }}
            >
              {selectedItem.type === "ui" ? (
                /* UI tiles are designed at bento-cell size — render at half the
                   modal box and scale ×2 so the mockup fills the frame legibly */
                <div className="absolute inset-0 cursor-pointer bg-white" onClick={onClose}>
                  <div className="absolute top-1/4 left-1/4 h-1/2 w-1/2 scale-[2]">
                    {selectedItem.node}
                  </div>
                </div>
              ) : (
                <MediaItem item={selectedItem} className="bg-[#E8F7ED]" onClick={onClose} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#152019]/80 to-transparent p-5 sm:p-6">
                <h3 className="text-xl font-medium text-white md:text-2xl">{selectedItem.title}</h3>
                <p className="mt-2 text-sm text-white/80 md:text-base">{selectedItem.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="button"
            aria-label="Close gallery"
            className="absolute -top-3 -right-3 z-50 rounded-full border border-[#DDE7E1] bg-white p-2.5 text-[#152019] shadow-lg hover:border-[#16A34A]/40 hover:text-[#16A34A] sm:top-3 sm:right-3"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info: PanInfo) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 touch-none"
      >
        <motion.div className="relative cursor-grab rounded-2xl border border-[#DDE7E1] bg-[#16A34A]/85 p-2 shadow-lg backdrop-blur-xl active:cursor-grabbing">
          <div className="flex items-center -space-x-2 px-1 py-1">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                style={{
                  zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={cn(
                  "relative h-11 w-11 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/25 md:h-12 md:w-12",
                  selectedItem.id === item.id
                    ? "shadow-lg ring-2 ring-white"
                    : "hover:ring-2 hover:ring-white/50",
                )}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.2 : 1,
                  rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                  y: selectedItem.id === item.id ? -8 : 0,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
              >
                {item.type === "ui" ? (
                  <div className="pointer-events-none absolute inset-0 bg-white">
                    <div className="absolute top-1/2 left-1/2 h-[144px] w-[144px] -translate-x-1/2 -translate-y-1/2 scale-[0.34]">
                      {item.node}
                    </div>
                  </div>
                ) : (
                  <MediaItem
                    item={item}
                    className="h-full w-full"
                    onClick={() => setSelectedItem(item)}
                  />
                )}
                {selectedItem.id === item.id && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute -inset-2 bg-white/40 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export type InteractiveBentoGalleryProps = {
  mediaItems: BentoMediaItem[];
  title?: string;
  description?: string;
  className?: string;
  /** When false, skip internal heading (use page section headers instead). */
  showHeader?: boolean;
};

export default function InteractiveBentoGallery({
  mediaItems,
  title,
  description,
  className,
  showHeader = true,
}: InteractiveBentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<BentoMediaItem | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setItems(mediaItems);
  }, [mediaItems]);

  const titleWords = title?.split(" ") ?? [];

  return (
    <div className={cn("ig-root relative w-full", className)}>
      {showHeader && title && (
        <div className="mb-10 max-w-3xl md:mb-12">
          <motion.h2
            className="mb-3 text-4xl font-semibold tracking-tight text-[#152019] md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {titleWords.map((word, i) =>
              i === titleWords.length - 1 ? (
                <span key={i} className="italic text-primary">
                  {word}
                </span>
              ) : (
                <span key={i}>{word} </span>
              ),
            )}
          </motion.h2>
          {description && (
            <motion.p
              className="text-base leading-relaxed text-[#66736B] md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="bento-gallery-grid"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                layoutId={`media-${item.id}`}
                className={cn(
                  "group relative min-h-0 min-w-0 cursor-move overflow-hidden rounded-xl border border-[#DDE7E1] bg-[#E8F7ED] shadow-sm transition-[border-color,box-shadow] sm:rounded-2xl",
                  "hover:border-[#16A34A]/35 hover:shadow-[0_8px_24px_rgba(22,163,74,0.12)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A]",
                  item.span,
                )}
                role="button"
                tabIndex={0}
                aria-label={`${item.title} — ${item.desc}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedItem(item);
                  }
                }}
                onClick={() => !isDragging && setSelectedItem(item)}
                style={{ touchAction: "pan-y" }}
                variants={{
                  hidden: { y: 40, scale: 0.96, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.015, zIndex: 10, transition: { duration: 0.2 } }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.85}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info: PanInfo) => {
                  setIsDragging(false);
                  const moveDistance = info.offset.x + info.offset.y;
                  if (Math.abs(moveDistance) <= 50) return;
                  const targetIndex =
                    moveDistance > 0
                      ? Math.min(index + 1, items.length - 1)
                      : Math.max(index - 1, 0);
                  if (targetIndex === index) return;
                  // Reorder content but keep span slots fixed so the bento stays packed
                  const spans = items.map((it) => it.span);
                  const reordered = [...items];
                  const [removed] = reordered.splice(index, 1);
                  reordered.splice(targetIndex, 0, removed);
                  setItems(reordered.map((it, i) => ({ ...it, span: spans[i] })));
                }}
              >
                <MediaItem
                  item={item}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-in-out group-hover:scale-105"
                  onClick={() => !isDragging && setSelectedItem(item)}
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-2 sm:p-2.5">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152019]/80 via-[#152019]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100" />
                  <div className="relative z-10 translate-y-2 opacity-0 transition-all delay-75 duration-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    <div className="mb-1 inline-block rounded-full border border-white/20 bg-[#16A34A]/50 px-2 py-0.5 backdrop-blur-md">
                      <span className="text-[9px] font-semibold tracking-wider text-white uppercase">
                        {item.type === "video" ? "Video" : item.type === "ui" ? "Live UI" : "Photo"}
                      </span>
                    </div>
                    <h3 className="line-clamp-1 text-xs font-medium text-white sm:text-sm">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-white/90 sm:text-xs">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
