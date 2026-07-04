"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSiteContent } from "@/components/site/SiteContentProvider";

type GalleryImage = { src: string; alt: string; label: string };
type PatientGallery = {
  id: string;
  name: string;
  images: GalleryImage[];
};
type Procedure = {
  procedureName: string;
  description: string;
  previewImage: string;
  images?: GalleryImage[];
  patients?: PatientGallery[];
};

function isUnoptimized(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/uploads/");
}

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                  */
/* -------------------------------------------------------------------------- */

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const image = images[current];

  const goNext = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goNext, goPrev]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 border border-white/20 p-2.5 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 sm:left-6 z-10 rounded-full bg-white/10 border border-white/20 p-3 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 sm:right-6 z-10 rounded-full bg-white/10 border border-white/20 p-3 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div
        className="flex flex-col items-center gap-4 max-w-[90vw] max-h-[90vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex items-center justify-center" style={{ maxHeight: "80vh" }}>
          <Image
            src={image.src}
            alt={image.alt}
            width={1200}
            height={900}
            className="max-w-full max-h-[80vh] w-auto h-auto rounded-lg"
            style={{ objectFit: "contain" }}
            unoptimized={isUnoptimized(image.src)}
            priority
          />
        </div>
        <p className="text-sm text-white/70 text-center">
          <span className="text-white/90 font-medium">{image.label}</span>
          {images.length > 1 && (
            <span className="ml-3 text-white/40">{current + 1} / {images.length}</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Procedure Modal                                                           */
/* -------------------------------------------------------------------------- */

function ProcedureModal({
  procedure,
  onClose,
}: {
  procedure: Procedure;
  onClose: () => void;
}) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const patients = procedure.patients || [];
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null;

  useEffect(() => {
    if (lightboxIndex !== null) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPatientId) {
          setSelectedPatientId(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, lightboxIndex, selectedPatientId]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${procedure.procedureName} gallery`}
      >
        <div
          className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-(--background) shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-(--border) px-6 py-5 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                {selectedPatient && (
                  <button
                    type="button"
                    onClick={() => setSelectedPatientId(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-(--accent-gold) hover:text-(--accent-gold-light) transition-colors mr-2 px-2.5 py-1 rounded-lg border border-(--border) bg-(--bg-surface)/40"
                  >
                    <ChevronLeft size={14} /> Back to Patients
                  </button>
                )}
                <p className="text-xs uppercase tracking-[0.3em] text-(--accent-gold)">
                  Before &amp; After
                </p>
              </div>
              <h3 className="mt-2 text-2xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
                {procedure.procedureName} {selectedPatient ? `· ${selectedPatient.name}` : ""}
              </h3>
              {procedure.description && (
                <p className="mt-2 max-w-3xl text-sm text-(--foreground-muted)">
                  {procedure.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-(--border) p-2.5 text-(--foreground-muted) transition-colors hover:text-(--foreground) hover:bg-(--bg-surface) shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto p-6 flex-1">
            {!selectedPatient ? (
              // Step 1: Patient Grid View
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-(--foreground-muted) mb-4">
                  Select a patient case:
                </h4>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {patients.map((patient) => {
                    const firstImage = patient.images?.[0]?.src || "/images/img/about.jpeg";
                    return (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatientId(patient.id)}
                        className="group text-left glass-card overflow-hidden rounded-2xl border border-(--border) transition-all hover:border-(--accent-gold)/30 hover:shadow-xl hover:shadow-(--accent-gold)/5 flex flex-col"
                      >
                        <div
                          className="relative w-full flex items-center justify-center bg-[#0d1117]"
                          style={{ aspectRatio: "4/3" }}
                        >
                          <Image
                            src={firstImage}
                            alt={patient.name}
                            fill
                            style={{ objectFit: "contain" }}
                            className="transition-transform duration-500 group-hover:scale-[1.03]"
                            unoptimized={isUnoptimized(firstImage)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <span className="text-xs text-white/90 font-medium px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
                              View Case →
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-3.5 flex items-center justify-between border-t border-(--border)/30">
                          <p className="text-sm font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
                            {patient.name}
                          </p>
                          {patient.images?.length > 0 && (
                            <span className="text-[10px] uppercase tracking-wider text-(--accent-gold) bg-(--accent-gold)/10 px-2.5 py-0.5 rounded-full border border-(--accent-gold)/20">
                              {patient.images.length} photo{patient.images.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Step 2: Photo Grid View for Selected Patient
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setSelectedPatientId(null)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-(--foreground-muted) hover:text-(--foreground) transition-colors mb-4"
                >
                  ← Back to patient list
                </button>

                
                <div className={`grid gap-5 ${
                  selectedPatient.images.length === 1
                    ? "grid-cols-1 max-w-xl mx-auto"
                    : selectedPatient.images.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : selectedPatient.images.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}>
                  {selectedPatient.images.map((image, index) => (
                    <button
                      key={`${image.src}-${index}`}
                      type="button"
                      className="group text-left overflow-hidden rounded-xl border border-(--border) bg-(--bg-surface) flex flex-col transition-all hover:border-(--accent-gold)/30 hover:shadow-lg hover:shadow-(--accent-gold)/5"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`View ${image.label} full size`}
                    >
                      <div
                        className="relative w-full flex items-center justify-center bg-[#0d1117]"
                        style={{ aspectRatio: "4/3" }}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="transition-transform duration-500 group-hover:scale-[1.02]"
                          style={{ objectFit: "contain" }}
                          unoptimized={isUnoptimized(image.src)}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="px-4 py-3 border-t border-(--border)/30 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.2em] text-(--foreground-muted)">
                          {image.label}
                        </span>
                        <span className="text-[10px] text-(--foreground-subtle) opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to enlarge
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && selectedPatient && (
        <Lightbox
          images={selectedPatient.images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Procedure Card                                                            */
/* -------------------------------------------------------------------------- */

function ProcedureCard({
  procedure,
  onClick,
}: {
  procedure: Procedure;
  onClick: () => void;
}) {
  const src = procedure.previewImage.trim();
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left glass-card overflow-hidden rounded-2xl border border-(--border) transition-all hover:border-(--accent-gold)/30 hover:shadow-xl hover:shadow-(--accent-gold)/5"
      aria-label={`Open ${procedure.procedureName} gallery`}
    >
      <div
        className="relative w-full flex items-center justify-center bg-[#0d1117]"
        style={{ aspectRatio: "4/3" }}
      >
        {src ? (
          <Image
            src={src}
            alt={procedure.procedureName}
            fill
            style={{ objectFit: "contain" }}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized={isUnoptimized(src)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center">
            <span className="text-xs uppercase tracking-[0.24em] text-white/45">
              No preview image yet
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-xs text-white/90 font-medium px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
            View Gallery →
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5">
        <p className="text-sm font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
          {procedure.procedureName}
        </p>
        {procedure.patients && procedure.patients.length > 0 ? (
          <p className="text-[11px] text-(--foreground-subtle) mt-0.5">
            {procedure.patients.length} case{procedure.patients.length !== 1 ? "s" : ""}
          </p>
        ) : procedure.images && procedure.images.length > 0 ? (
          <p className="text-[11px] text-(--foreground-subtle) mt-0.5">
            {procedure.images.length} image{procedure.images.length !== 1 ? "s" : ""}
          </p>
        ) : null}
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Gallery                                                              */
/* -------------------------------------------------------------------------- */

export default function BeforeAfterGallery() {
  const { content } = useSiteContent();
  const gallery = content.home.beforeAfterGallery;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedProcedure = selectedIndex === null ? null : gallery.procedures[selectedIndex] ?? null;

  return (
    <section className="section-padding" aria-label="Before and after gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          subtitle={gallery.subtitle}
        />
        {gallery.description && (
          <p className="mt-3 max-w-3xl text-sm text-(--foreground-muted)">
            {gallery.description}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {gallery.procedures.map((procedure, index) => (
            <ProcedureCard
              key={`${procedure.procedureName}-${index}`}
              procedure={procedure}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </div>

      {selectedProcedure && (
        <ProcedureModal
          procedure={selectedProcedure}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
