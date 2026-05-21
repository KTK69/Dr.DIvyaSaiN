"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Calendar, Play, X } from "lucide-react";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import RichText from "@/components/ui/RichText";
import type { DoctorTalkItem } from "@/lib/site-content";

function resolveType(item: DoctorTalkItem) {
  if (item.type) {
    return item.type;
  }

  return item.youtubeUrl ? "video" : "article";
}

function categoryTone(category?: string) {
  const value = (category || "").toLowerCase();
  if (value.includes("reconstructive")) {
    return "text-(--accent-gold)";
  }
  if (value.includes("cosmetic")) {
    return "text-(--accent-blue)";
  }
  return "text-(--foreground-subtle)";
}

function extractYouTubeId(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function getYouTubeEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  const id = extractYouTubeId(url);
  if (!id) {
    return null;
  }

  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process?: () => void;
    };
  };
};

function runInstagramEmbeds() {
  if (typeof window === "undefined") {
    return;
  }

  const instgrm = (window as InstagramWindow).instgrm;
  instgrm?.Embeds?.process?.();
}

function extractInstagramReelId(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]{5,})/i);
  if (match?.[1]) {
    return match[1];
  }

  if (/^[A-Za-z0-9_-]{5,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function getInstagramPermalink(url?: string) {
  if (!url) {
    return null;
  }

  const id = extractInstagramReelId(url);
  if (!id) {
    return null;
  }

  return `https://www.instagram.com/reel/${id}/`;
}

function getVideoEmbed(url?: string) {
  const youtube = getYouTubeEmbedUrl(url);
  if (youtube) {
    return { type: "youtube" as const, url: youtube };
  }

  const instagram = getInstagramPermalink(url);
  if (instagram) {
    return { type: "instagram" as const, url: instagram };
  }

  return null;
}

function InstagramEmbed({ permalink, title }: { permalink: string; title: string }) {
  useEffect(() => {
    runInstagramEmbeds();
  }, [permalink]);

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={runInstagramEmbeds}
      />
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{ width: "100%", margin: 0 }}
      >
        <a href={permalink}>{title}</a>
      </blockquote>
    </>
  );
}

export default function DoctorsTalkContent() {
  const { content } = useSiteContent();
  const [activeArticle, setActiveArticle] = useState<DoctorTalkItem | null>(null);

  const { articles, videos } = useMemo(() => {
    const items = content.doctorTalk || [];
    const articleItems = items.filter((item) => resolveType(item) === "article");
    const videoItems = items.filter((item) => resolveType(item) === "video");
    return { articles: articleItems, videos: videoItems };
  }, [content.doctorTalk]);

  useEffect(() => {
    if (!activeArticle) {
      return undefined;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveArticle(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeArticle]);

  const hasArticleContent = Boolean(activeArticle?.content?.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
      {/* Articles */}
      <section className="mb-20" aria-labelledby="articles-heading">
        <h2
          id="articles-heading"
          className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-8"
        >
          Articles
        </h2>
        {articles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post, index) => (
              <button
                key={post.id || `${post.title}-${index}`}
                type="button"
                onClick={() => setActiveArticle(post)}
                className="glass-card rounded-xl p-6 flex flex-col group hover:border-(--accent-gold) transition-colors duration-200 text-left"
              >
                {post.category ? (
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${categoryTone(post.category)}`}
                    >
                      {post.category}
                    </span>
                  </div>
                ) : null}
                <h3
                  className="text-base font-medium text-(--foreground) mb-3 group-hover:text-(--accent-gold-light) transition-colors"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-(--foreground-muted) leading-relaxed flex-1 mb-5">
                  {post.description}
                </p>
                {(post.date || post.readTime) ? (
                  <div className="flex items-center justify-between text-xs text-(--foreground-subtle)">
                    {post.date ? (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {post.date}
                      </span>
                    ) : (
                      <span />
                    )}
                    {post.readTime ? <span>{post.readTime}</span> : null}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--foreground-muted)">No articles added yet.</p>
        )}
      </section>

      {/* Videos */}
      <section aria-labelledby="videos-heading">
        <h2
          id="videos-heading"
          className="text-xs font-semibold uppercase tracking-widest text-(--foreground-muted) mb-8"
        >
          Video Content
        </h2>
        {videos.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, index) => {
              const embed = getVideoEmbed(video.youtubeUrl);
              const embedClass =
                embed?.type === "instagram"
                  ? "min-h-[360px] md:min-h-[480px]"
                  : "aspect-video";

              return (
                <div
                  key={video.id || `${video.title}-${index}`}
                  className="glass-card rounded-xl overflow-hidden group"
                >
                  <div className={`${embedClass} border-b border-(--border) bg-linear-to-br from-(--bg-card) to-(--bg-surface)`}>
                    {embed ? (
                      embed.type === "instagram" ? (
                        <InstagramEmbed permalink={embed.url} title={video.title} />
                      ) : (
                      <iframe
                        title={video.title}
                        src={embed.url}
                        className="w-full h-full"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen={embed.type === "youtube"}
                        loading="lazy"
                      />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-(--border) flex items-center justify-center group-hover:border-(--accent-gold) transition-colors">
                          <Play
                            size={18}
                            className="text-(--foreground-muted) group-hover:text-(--accent-gold-light) transition-colors ml-0.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-(--foreground-subtle) mb-2 block">
                      Episode {String(index + 1).padStart(2, "0")}
                    </span>
                    <p
                      className="text-sm font-medium text-(--foreground)"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {video.title}
                    </p>
                    {video.description ? (
                      <p className="text-xs text-(--foreground-muted) mt-2">
                        {video.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-(--foreground-muted)">No videos added yet.</p>
        )}
      </section>

      {/* CTA */}
      <div className="mt-16 pt-10 border-t border-(--border) text-center">
        <p className="text-base text-(--foreground-muted) mb-5">
          Have a specific question? The best place to start is a direct
          consultation.
        </p>
        <Link
          href="/contactus"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--accent-gold) text-(--background) text-sm font-medium hover:bg-(--accent-gold-light) transition-colors"
        >
          Book Video Consultation <ArrowRight size={15} />
        </Link>
      </div>

      {activeArticle ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-title"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="glass-card rounded-2xl border border-(--border) max-w-3xl w-full p-8 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 text-(--foreground-muted) hover:text-(--foreground) transition-colors"
              aria-label="Close article"
            >
              <X size={18} />
            </button>
            {activeArticle.category ? (
              <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${categoryTone(activeArticle.category)}`}>
                {activeArticle.category}
              </p>
            ) : null}
            <h3
              id="article-title"
              className="text-2xl md:text-3xl font-medium text-(--foreground) mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {activeArticle.title}
            </h3>
            {activeArticle.description ? (
              <p className="text-sm text-(--foreground-muted) leading-relaxed mb-6">
                {activeArticle.description}
              </p>
            ) : null}
            {hasArticleContent ? (
              <RichText
                value={activeArticle?.content}
                className="text-sm text-(--foreground-muted) leading-relaxed"
              />
            ) : (
              <p className="text-sm text-(--foreground-muted) leading-relaxed">
                Full article content will be published soon.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
