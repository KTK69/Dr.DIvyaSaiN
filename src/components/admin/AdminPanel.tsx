"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import type { SiteContent } from "@/lib/site-content";

const AUTH_KEY = "emmi-admin-auth";
const AUTH_EVENT = "emmi-admin-auth-changed";
const USERNAME = "admin";
const PASSWORD = "admin123";
const SESSION_DURATION_MS = 30 * 60 * 1000;
const SESSION_REFRESH_MS = 60 * 1000;

type Section = "navigation" | "footer" | "home" | "aboutPage" | "experiencePage" | "testimonialsPage" | "blogPage" | "servicesPage" | "doctorTalkPage" | "contactPage" | "about" | "experience" | "doctorTalk" | "testimonials" | "blog" | "services" | "contact";

type DoctorTalkItem = { title: string; description: string; href: string };
type TestimonialItem = { id: string; patient_name: string; procedure: string; quote: string; rating: number };
type BlogItem = SiteContent["blog"][number];
type ServiceItem = SiteContent["services"][number];
type ExperienceItem = SiteContent["experience"]["experience"][number];
type NavLink = { label: string; href: string };
type GalleryImage = { src: string; alt: string; label: string };
type AuthSession = { expiresAt: number };

const navItems: Array<{ key: Section; label: string }> = [
  { key: "navigation", label: "Navigation" },
  { key: "footer", label: "Footer" },
  { key: "home", label: "Home Content" },
  { key: "aboutPage", label: "About Page" },
  { key: "experiencePage", label: "Experience Page" },
  { key: "testimonialsPage", label: "Testimonials Page" },
  { key: "blogPage", label: "Blog Page" },
  { key: "servicesPage", label: "Services Page" },
  { key: "doctorTalkPage", label: "Doctor's Talk Page" },
  { key: "contactPage", label: "Contact Page" },
  { key: "about", label: "About Data" },
  { key: "experience", label: "Experience Data" },
  { key: "doctorTalk", label: "Doctor's Talk Data" },
  { key: "testimonials", label: "Testimonials Data" },
  { key: "blog", label: "Blog Data" },
  { key: "services", label: "Services Data" },
  { key: "contact", label: "Contact Info" },
];

function getAuthState() {
  if (typeof window === "undefined") {
    return false;
  }

  const session = readAuthSession();
  if (!isSessionValid(session)) {
    window.localStorage.removeItem(AUTH_KEY);
    return false;
  }

  return true;
}

function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed || typeof parsed.expiresAt !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function isSessionValid(session: AuthSession | null) {
  return Boolean(session && session.expiresAt > Date.now());
}

function setAuthSession() {
  const next = { expiresAt: Date.now() + SESSION_DURATION_MS };
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(AUTH_EVENT));
  return next;
}

function clearAuthSession() {
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribeAuth(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_EVENT, listener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_EVENT, listener);
  };
}

export default function AdminPanel() {
  const { content, setContent, resetContent } = useSiteContent();
  const authenticated = useSyncExternalStore(subscribeAuth, getAuthState, () => false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [message, setMessage] = useState("");
  const sessionTimeoutRef = useRef<number | null>(null);
  const lastRefreshRef = useRef(0);

  const sectionTitle = useMemo(() => navItems.find((item) => item.key === activeSection)?.label ?? activeSection, [activeSection]);

  useEffect(() => {
    if (!authenticated) {
      return undefined;
    }

    const session = readAuthSession();
    if (!session) {
      return undefined;
    }

    const scheduleTimeout = (expiresAt: number) => {
      if (sessionTimeoutRef.current) {
        window.clearTimeout(sessionTimeoutRef.current);
      }
      const delay = Math.max(0, expiresAt - Date.now());
      sessionTimeoutRef.current = window.setTimeout(() => {
        clearAuthSession();
        setMessage("Session expired");
      }, delay);
    };

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < SESSION_REFRESH_MS) {
        return;
      }
      lastRefreshRef.current = now;

      const currentSession = readAuthSession();
      if (!isSessionValid(currentSession)) {
        clearAuthSession();
        setMessage("Session expired");
        return;
      }

      const nextSession = setAuthSession();
      scheduleTimeout(nextSession.expiresAt);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"] as const;
    events.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }));
    scheduleTimeout(session.expiresAt);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      if (sessionTimeoutRef.current) {
        window.clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [authenticated]);

  function login() {
    if (username === USERNAME && password === PASSWORD) {
      setAuthSession();
      setMessage("Logged in");
      return;
    }

    setMessage("Invalid credentials");
  }

  function logout() {
    clearAuthSession();
    setMessage("");
  }

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((previous) => ({ ...previous, [key]: value }));
  }

  function updateHome(path: Array<string>, value: string) {
    setContent((previous) => ({
      ...previous,
      home: updateNested(previous.home, path, value) as SiteContent["home"],
    }));
  }

  function updateNested(value: unknown, path: Array<string>, nextValue: string): unknown {
    if (path.length === 0) {
      return nextValue;
    }

    const [head, ...tail] = path;
    const objectValue: Record<string, unknown> = Array.isArray(value)
      ? { ...value }
      : { ...(value as Record<string, unknown>) };

    if (tail.length === 0) {
      objectValue[head] = nextValue;
      return objectValue;
    }

    objectValue[head] = updateNested(objectValue[head], tail, nextValue);
    return objectValue;
  }

  function addItem(section: Exclude<Section, "home" | "about" | "contact">) {
    setContent((previous) => {
      if (section === "experience") {
        return {
          ...previous,
          experience: {
            ...previous.experience,
            experience: [...previous.experience.experience, { role: "", institution: "", period: "", current: false }],
          },
        };
      }

      if (section === "doctorTalk") {
        return { ...previous, doctorTalk: [...previous.doctorTalk, { title: "", description: "", href: "/contact" }] };
      }

      if (section === "testimonials") {
        return {
          ...previous,
          testimonials: [...previous.testimonials, { id: `review-${Date.now()}`, patient_name: "", procedure: "", quote: "", rating: 5 }],
        };
      }

      if (section === "blog") {
        return {
          ...previous,
          blog: [
            ...previous.blog,
            {
              id: `blog-${Date.now()}`,
              slug: "",
              title: "",
              excerpt: "",
              content: "",
              image: "/images/img/about.jpeg",
              published_at: new Date().toISOString().slice(0, 10),
              meta_title: "",
              meta_description: "",
            },
          ],
        };
      }

      return {
        ...previous,
        services: [
          ...previous.services,
          {
            id: `service-${Date.now()}`,
            slug: "",
            name: "",
            summary: "",
            content: "",
            image: "/images/img/about.jpeg",
            category: "cosmetic",
            key_points: [],
            faq: [],
            meta_title: "",
            meta_description: "",
          },
        ],
      };
    });
  }

  function removeItem(section: Exclude<Section, "home" | "about" | "contact">, index: number) {
    setContent((previous) => {
      if (section === "experience") {
        return { ...previous, experience: { ...previous.experience, experience: previous.experience.experience.filter((_, itemIndex) => itemIndex !== index) } };
      }

      if (section === "doctorTalk") {
        return { ...previous, doctorTalk: previous.doctorTalk.filter((_, itemIndex) => itemIndex !== index) };
      }

      if (section === "testimonials") {
        return { ...previous, testimonials: previous.testimonials.filter((_, itemIndex) => itemIndex !== index) };
      }

      if (section === "blog") {
        return { ...previous, blog: previous.blog.filter((_, itemIndex) => itemIndex !== index) };
      }

      return { ...previous, services: previous.services.filter((_, itemIndex) => itemIndex !== index) };
    });
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto mt-24 p-6 glass-card rounded-2xl border border-(--border)">
        <h1 className="text-2xl font-medium text-(--foreground) mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          Admin Login
        </h1>
        <p className="text-sm text-(--foreground-muted) mb-6">Enter your admin credentials to continue.</p>

        <div className="space-y-4">
          <label className="block text-sm text-(--foreground-muted)">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1 w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)"
            />
          </label>
          <label className="block text-sm text-(--foreground-muted)">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)"
            />
          </label>
          <button className="w-full rounded-lg bg-(--accent-gold) px-4 py-2 text-sm font-medium text-(--background)" onClick={login}>
            Login
          </button>
          {message ? <p className="text-sm text-(--foreground-muted)">{message}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-(--accent-gold)">Testing only</p>
          <h1 className="text-3xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
            Admin Dashboard
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-(--border) px-4 py-2 text-sm"
            onClick={() => {
              resetContent();
              setMessage("Reset to defaults");
            }}
          >
            Reset
          </button>
          <button className="rounded-lg border border-(--border) px-4 py-2 text-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="glass-card rounded-2xl border border-(--border) p-4 h-fit">
          <p className="text-xs uppercase tracking-widest text-(--foreground-subtle) mb-3">Sections</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeSection === item.key ? "bg-(--bg-surface) text-(--foreground)" : "text-(--foreground-muted) hover:text-(--foreground)"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="glass-card rounded-2xl border border-(--border) p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-(--foreground)" style={{ fontFamily: "var(--font-serif)" }}>
              {sectionTitle}
            </h2>
            <p className="text-sm text-(--foreground-subtle)">Changes save instantly to localStorage</p>
          </div>

          {message ? <p className="mb-4 text-sm text-(--accent-gold-light)">{message}</p> : null}

          {activeSection === "home" ? (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Hero eyebrow" value={content.home.hero.eyebrow} onChange={(value) => updateHome(["hero", "eyebrow"], value)} />
                <Field label="Hero title" value={content.home.hero.title} onChange={(value) => updateHome(["hero", "title"], value)} />
                <Field label="Hero emphasis" value={content.home.hero.emphasis} onChange={(value) => updateHome(["hero", "emphasis"], value)} />
                <Field label="Hero summary" value={content.home.hero.summary} onChange={(value) => updateHome(["hero", "summary"], value)} multiline />
                <Field label="Primary CTA label" value={content.home.hero.ctaPrimary.label} onChange={(value) => updateHome(["hero", "ctaPrimary", "label"], value)} />
                <Field label="Primary CTA href" value={content.home.hero.ctaPrimary.href} onChange={(value) => updateHome(["hero", "ctaPrimary", "href"], value)} />
                <Field label="Secondary CTA label" value={content.home.hero.ctaSecondary.label} onChange={(value) => updateHome(["hero", "ctaSecondary", "label"], value)} />
                <Field label="Secondary CTA href" value={content.home.hero.ctaSecondary.href} onChange={(value) => updateHome(["hero", "ctaSecondary", "href"], value)} />
              </div>

              <div className="border-t border-(--border) pt-6 space-y-6">
                <h3 className="text-sm font-semibold text-(--foreground)">Before & After Gallery</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Gallery eyebrow" value={content.home.beforeAfterGallery.eyebrow} onChange={(value) => update("home", { ...content.home, beforeAfterGallery: { ...content.home.beforeAfterGallery, eyebrow: value } })} />
                  <Field label="Gallery title" value={content.home.beforeAfterGallery.title} onChange={(value) => update("home", { ...content.home, beforeAfterGallery: { ...content.home.beforeAfterGallery, title: value } })} />
                  <Field label="Gallery subtitle" value={content.home.beforeAfterGallery.subtitle} onChange={(value) => update("home", { ...content.home, beforeAfterGallery: { ...content.home.beforeAfterGallery, subtitle: value } })} multiline className="md:col-span-2" />
                </div>

                <ListEditor<GalleryImage>
                  items={content.home.beforeAfterGallery.images}
                  onAdd={() => {
                    const nextImage = {
                      src: "/images/img/about.jpeg",
                      alt: "Before and after gallery placeholder",
                      label: "Before & After",
                    };
                    update("home", {
                      ...content.home,
                      beforeAfterGallery: {
                        ...content.home.beforeAfterGallery,
                        images: [...content.home.beforeAfterGallery.images, nextImage],
                      },
                    });
                  }}
                  onRemove={(index) => {
                    const updated = content.home.beforeAfterGallery.images.filter((_, itemIndex) => itemIndex !== index);
                    update("home", {
                      ...content.home,
                      beforeAfterGallery: { ...content.home.beforeAfterGallery, images: updated },
                    });
                  }}
                  onChange={(images) => update("home", { ...content.home, beforeAfterGallery: { ...content.home.beforeAfterGallery, images } })}
                  renderItem={(item, _index, updateItem) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Label" value={item.label} onChange={(value) => updateItem({ ...item, label: value })} />
                      <Field label="Image URL" value={item.src} onChange={(value) => updateItem({ ...item, src: value })} />
                      <Field label="Alt text" value={item.alt} onChange={(value) => updateItem({ ...item, alt: value })} className="md:col-span-2" />
                    </div>
                  )}
                />
              </div>
            </div>
          ) : null}

          {activeSection === "about" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Bio" value={content.about.bio} onChange={(value) => update("about", { ...content.about, bio: value })} multiline />
              <Field label="Qualifications" value={content.about.qualifications} onChange={(value) => update("about", { ...content.about, qualifications: value })} />
              <Field label="Current position" value={content.about.currentPosition} onChange={(value) => update("about", { ...content.about, currentPosition: value })} />
              <Field label="Philosophy" value={content.about.philosophy} onChange={(value) => update("about", { ...content.about, philosophy: value })} multiline />
            </div>
          ) : null}

          {activeSection === "experience" ? (
            <ListEditor<ExperienceItem>
              items={content.experience.experience}
              onAdd={() => addItem("experience")}
              onRemove={(index) => removeItem("experience", index)}
              onChange={(items) => update("experience", { ...content.experience, experience: items })}
              renderItem={(item, index, updateItem) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Role" value={item.role} onChange={(value) => updateItem({ ...item, role: value })} />
                  <Field label="Institution" value={item.institution} onChange={(value) => updateItem({ ...item, institution: value })} />
                  <Field label="Period" value={item.period} onChange={(value) => updateItem({ ...item, period: value })} />
                  <label className="flex items-center gap-2 text-sm text-(--foreground-muted)">
                    <input type="checkbox" checked={Boolean(item.current)} onChange={(event) => updateItem({ ...item, current: event.target.checked })} /> Current
                  </label>
                </div>
              )}
            />
          ) : null}

          {activeSection === "doctorTalk" ? (
            <ListEditor<DoctorTalkItem>
              items={content.doctorTalk}
              onAdd={() => addItem("doctorTalk")}
              onRemove={(index) => removeItem("doctorTalk", index)}
              onChange={(items) => update("doctorTalk", items)}
              renderItem={(item, index, updateItem) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title" value={item.title} onChange={(value) => updateItem({ ...item, title: value })} />
                  <Field label="Link" value={item.href} onChange={(value) => updateItem({ ...item, href: value })} />
                  <Field label="Description" value={item.description} onChange={(value) => updateItem({ ...item, description: value })} multiline />
                </div>
              )}
            />
          ) : null}

          {activeSection === "testimonials" ? (
            <ListEditor<TestimonialItem>
              items={content.testimonials}
              onAdd={() => addItem("testimonials")}
              onRemove={(index) => removeItem("testimonials", index)}
              onChange={(items) => update("testimonials", items)}
              renderItem={(item, index, updateItem) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Patient name" value={item.patient_name} onChange={(value) => updateItem({ ...item, patient_name: value })} />
                  <Field label="Procedure" value={item.procedure} onChange={(value) => updateItem({ ...item, procedure: value })} />
                  <Field label="Quote" value={item.quote} onChange={(value) => updateItem({ ...item, quote: value })} multiline />
                  <Field label="Rating" value={String(item.rating)} onChange={(value) => updateItem({ ...item, rating: Number(value) || 0 })} />
                </div>
              )}
            />
          ) : null}

          {activeSection === "blog" ? (
            <ListEditor<BlogItem>
              items={content.blog}
              onAdd={() => addItem("blog")}
              onRemove={(index) => removeItem("blog", index)}
              onChange={(items) => update("blog", items)}
              renderItem={(item, index, updateItem) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title" value={item.title} onChange={(value) => updateItem({ ...item, title: value })} />
                  <Field label="Slug" value={item.slug} onChange={(value) => updateItem({ ...item, slug: value })} />
                  <Field label="Excerpt" value={item.excerpt} onChange={(value) => updateItem({ ...item, excerpt: value })} multiline />
                  <Field label="Content" value={item.content} onChange={(value) => updateItem({ ...item, content: value })} multiline />
                </div>
              )}
            />
          ) : null}

          {activeSection === "services" ? (
            <ListEditor<ServiceItem>
              items={content.services}
              onAdd={() => addItem("services")}
              onRemove={(index) => removeItem("services", index)}
              onChange={(items) => update("services", items)}
              renderItem={(item, index, updateItem) => <ServiceForm item={item} onChange={updateItem} />}
            />
          ) : null}

          {activeSection === "contact" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Phone" value={content.contact.phone} onChange={(value) => update("contact", { ...content.contact, phone: value })} />
              <Field label="Email" value={content.contact.email} onChange={(value) => update("contact", { ...content.contact, email: value })} />
              <Field label="Hospital" value={content.contact.hospital} onChange={(value) => update("contact", { ...content.contact, hospital: value })} />
              <Field label="Address" value={content.contact.address} onChange={(value) => update("contact", { ...content.contact, address: value })} multiline />
            </div>
          ) : null}

          {/* Page Headers & Descriptions */}
          {activeSection === "navigation" ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Main Navigation Links</h3>
                <ListEditor<NavLink>
                  items={content.navigation.links}
                  onAdd={() => {
                    const newLink = { label: "New Page", href: "/" };
                    update("navigation", { ...content.navigation, links: [...content.navigation.links, newLink] });
                  }}
                  onRemove={(index) => {
                    const updated = content.navigation.links.filter((_, i) => i !== index);
                    update("navigation", { ...content.navigation, links: updated });
                  }}
                  onChange={(links) =>
                    update("navigation", { ...content.navigation, links })
                  }
                  renderItem={(item, _index, updateItem) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Label" value={item.label} onChange={(value) => updateItem({ ...item, label: value })} />
                      <Field label="URL" value={item.href} onChange={(value) => updateItem({ ...item, href: value })} />
                    </div>
                  )}
                />
              </div>
              <div className="border-t border-(--border) pt-8">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Reconstructive Services (Dropdown)</h3>
                <ListEditor<NavLink>
                  items={content.navigation.services.reconstructive}
                  onAdd={() => {
                    const newLink = { label: "New Service", href: "/" };
                    update("navigation", {
                      ...content.navigation,
                      services: { ...content.navigation.services, reconstructive: [...content.navigation.services.reconstructive, newLink] },
                    });
                  }}
                  onRemove={(index) => {
                    const updated = content.navigation.services.reconstructive.filter((_, i) => i !== index);
                    update("navigation", { ...content.navigation, services: { ...content.navigation.services, reconstructive: updated } });
                  }}
                  onChange={(reconstructive) =>
                    update("navigation", {
                      ...content.navigation,
                      services: { ...content.navigation.services, reconstructive },
                    })
                  }
                  renderItem={(item, _index, updateItem) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Label" value={item.label} onChange={(value) => updateItem({ ...item, label: value })} />
                      <Field label="URL" value={item.href} onChange={(value) => updateItem({ ...item, href: value })} />
                    </div>
                  )}
                />
              </div>
              <div className="border-t border-(--border) pt-8">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Cosmetic Services (Dropdown)</h3>
                <ListEditor<NavLink>
                  items={content.navigation.services.cosmetic}
                  onAdd={() => {
                    const newLink = { label: "New Service", href: "/" };
                    update("navigation", {
                      ...content.navigation,
                      services: { ...content.navigation.services, cosmetic: [...content.navigation.services.cosmetic, newLink] },
                    });
                  }}
                  onRemove={(index) => {
                    const updated = content.navigation.services.cosmetic.filter((_, i) => i !== index);
                    update("navigation", { ...content.navigation, services: { ...content.navigation.services, cosmetic: updated } });
                  }}
                  onChange={(cosmetic) =>
                    update("navigation", {
                      ...content.navigation,
                      services: { ...content.navigation.services, cosmetic },
                    })
                  }
                  renderItem={(item, _index, updateItem) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Label" value={item.label} onChange={(value) => updateItem({ ...item, label: value })} />
                      <Field label="URL" value={item.href} onChange={(value) => updateItem({ ...item, href: value })} />
                    </div>
                  )}
                />
              </div>
            </div>
          ) : null}

          {activeSection === "footer" ? (
            <div className="space-y-6">
              <Field label="Bio" value={content.footer.bio} onChange={(value) => update("footer", { ...content.footer, bio: value })} multiline />
              <Field label="Qualifications" value={content.footer.qualifications} onChange={(value) => update("footer", { ...content.footer, qualifications: value })} />
              <Field label="Services Title" value={content.footer.servicesTitle} onChange={(value) => update("footer", { ...content.footer, servicesTitle: value })} />
              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Featured Services</h3>
                <ListEditor<NavLink>
                  items={content.footer.services}
                  onAdd={() => {
                    const newLink = { label: "Service", href: "/" };
                    update("footer", { ...content.footer, services: [...content.footer.services, newLink] });
                  }}
                  onRemove={(index) => {
                    const updated = content.footer.services.filter((_, i) => i !== index);
                    update("footer", { ...content.footer, services: updated });
                  }}
                  onChange={(services) => update("footer", { ...content.footer, services })}
                  renderItem={(item, _index, updateItem) => (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Label" value={item.label} onChange={(value) => updateItem({ ...item, label: value })} />
                      <Field label="URL" value={item.href} onChange={(value) => updateItem({ ...item, href: value })} />
                    </div>
                  )}
                />
              </div>
              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Contact Info</h3>
                <Field label="Contact Title" value={content.footer.contactTitle} onChange={(value) => update("footer", { ...content.footer, contactTitle: value })} />
                <Field label="Location" value={content.footer.contactLocation} onChange={(value) => update("footer", { ...content.footer, contactLocation: value })} multiline className="mt-4" />
                <Field label="Email" value={content.footer.contactEmail} onChange={(value) => update("footer", { ...content.footer, contactEmail: value })} className="mt-4" />
              </div>
              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Footer Links</h3>
                <Field label="Links Title" value={content.footer.linksTitle} onChange={(value) => update("footer", { ...content.footer, linksTitle: value })} />
                <div className="mt-4">
                  <ListEditor<NavLink>
                    items={content.footer.links}
                    onAdd={() => {
                      const newLink = { label: "Link", href: "/" };
                      update("footer", { ...content.footer, links: [...content.footer.links, newLink] });
                    }}
                    onRemove={(index) => {
                      const updated = content.footer.links.filter((_, i) => i !== index);
                      update("footer", { ...content.footer, links: updated });
                    }}
                    onChange={(links) => update("footer", { ...content.footer, links })}
                    renderItem={(item, _index, updateItem) => (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Label" value={item.label} onChange={(value) => updateItem({ ...item, label: value })} />
                        <Field label="URL" value={item.href} onChange={(value) => updateItem({ ...item, href: value })} />
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="border-t border-(--border) pt-6">
                <Field label="Copyright" value={content.footer.copyright} onChange={(value) => update("footer", { ...content.footer, copyright: value })} />
              </div>
            </div>
          ) : null}

          {activeSection === "aboutPage" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Page Heading" value={content.aboutPage.heading} onChange={(value) => update("aboutPage", { ...content.aboutPage, heading: value })} />
              <Field label="Qualifications" value={content.aboutPage.qualifications} onChange={(value) => update("aboutPage", { ...content.aboutPage, qualifications: value })} />
              <Field label="Page Description" value={content.aboutPage.pageDescription} onChange={(value) => update("aboutPage", { ...content.aboutPage, pageDescription: value })} />
            </div>
          ) : null}

          {activeSection === "experiencePage" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Heading" value={content.experiencePage.heading} onChange={(value) => update("experiencePage", { ...content.experiencePage, heading: value })} />
              <Field label="Summary" value={content.experiencePage.summary} onChange={(value) => update("experiencePage", { ...content.experiencePage, summary: value })} multiline />
            </div>
          ) : null}

          {activeSection === "testimonialsPage" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Heading" value={content.testimonialsPage.heading} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, heading: value })} />
              <Field label="Subheading" value={content.testimonialsPage.subheading} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, subheading: value })} />
            </div>
          ) : null}

          {activeSection === "blogPage" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Heading" value={content.blogPage.heading} onChange={(value) => update("blogPage", { ...content.blogPage, heading: value })} />
              <Field label="Subheading" value={content.blogPage.subheading} onChange={(value) => update("blogPage", { ...content.blogPage, subheading: value })} />
            </div>
          ) : null}

          {activeSection === "servicesPage" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Heading" value={content.servicesPage.heading} onChange={(value) => update("servicesPage", { ...content.servicesPage, heading: value })} />
              <Field label="Subheading" value={content.servicesPage.subheading} onChange={(value) => update("servicesPage", { ...content.servicesPage, subheading: value })} />
              <Field label="Cosmetic Category Title" value={content.servicesPage.categoryCosmeticTitle} onChange={(value) => update("servicesPage", { ...content.servicesPage, categoryCosmeticTitle: value })} />
              <Field label="Reconstructive Category Title" value={content.servicesPage.categoryReconstructiveTitle} onChange={(value) => update("servicesPage", { ...content.servicesPage, categoryReconstructiveTitle: value })} />
            </div>
          ) : null}

          {activeSection === "doctorTalkPage" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Heading" value={content.doctorTalkPage.heading} onChange={(value) => update("doctorTalkPage", { ...content.doctorTalkPage, heading: value })} />
              <Field label="Subheading" value={content.doctorTalkPage.subheading} onChange={(value) => update("doctorTalkPage", { ...content.doctorTalkPage, subheading: value })} />
            </div>
          ) : null}

          {activeSection === "contactPage" ? (
            <div className="space-y-6">
              <Field label="Heading" value={content.contactPage.heading} onChange={(value) => update("contactPage", { ...content.contactPage, heading: value })} />
              <Field label="Subheading" value={content.contactPage.subheading} onChange={(value) => update("contactPage", { ...content.contactPage, subheading: value })} multiline />
              <Field label="Calendar Heading" value={content.contactPage.calendarHeading} onChange={(value) => update("contactPage", { ...content.contactPage, calendarHeading: value })} />
              <Field label="Calendar Subheading" value={content.contactPage.calendarSubheading} onChange={(value) => update("contactPage", { ...content.contactPage, calendarSubheading: value })} />
              <Field label="Form Heading" value={content.contactPage.formHeading} onChange={(value) => update("contactPage", { ...content.contactPage, formHeading: value })} />
              <Field label="Location Heading" value={content.contactPage.locationHeading} onChange={(value) => update("contactPage", { ...content.contactPage, locationHeading: value })} />
              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Form Field Labels</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Full Name" value={content.contactPage.formLabels.fullName} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, fullName: value } })} />
                  <Field label="Phone" value={content.contactPage.formLabels.phone} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, phone: value } })} />
                  <Field label="Email" value={content.contactPage.formLabels.email} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, email: value } })} />
                  <Field label="Concern" value={content.contactPage.formLabels.concern} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, concern: value } })} />
                  <Field label="Preferred Time" value={content.contactPage.formLabels.preferredTime} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, preferredTime: value } })} />
                  <Field label="How Did You Hear" value={content.contactPage.formLabels.howDidYouHear} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, howDidYouHear: value } })} />
                  <Field label="Submit Button" value={content.contactPage.formLabels.submit} onChange={(value) => update("contactPage", { ...content.contactPage, formLabels: { ...content.contactPage.formLabels, submit: value } })} />
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline = false, className = "" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; className?: string; }) {
  return (
    <label className={`block text-sm text-(--foreground-muted) ${className}`}>
      <span className="mb-1 block">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-28 w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)" />
      )}
    </label>
  );
}

function ListEditor<T extends object>({
  items,
  renderItem,
  onAdd,
  onRemove,
  onChange,
}: {
  items: T[];
  renderItem: (item: T, index: number, updateItem: (item: T) => void) => React.ReactNode;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (items: T[]) => void;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="rounded-lg bg-(--accent-gold) px-4 py-2 text-sm font-medium text-(--background)">
        Add item
      </button>
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-(--border) p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-(--foreground)">Item {index + 1}</p>
            <button onClick={() => onRemove(index)} className="text-sm text-red-400">
              Remove
            </button>
          </div>
          {renderItem(item, index, (nextItem) => {
            const nextItems = [...items];
            nextItems[index] = nextItem;
            onChange(nextItems);
          })}
        </div>
      ))}
    </div>
  );
}

function ServiceForm({ item, onChange }: { item: ServiceItem; onChange: (value: ServiceItem) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Name" value={item.name} onChange={(value) => onChange({ ...item, name: value })} />
      <Field label="Slug" value={item.slug} onChange={(value) => onChange({ ...item, slug: value })} />
      <Field label="Summary" value={item.summary} onChange={(value) => onChange({ ...item, summary: value })} multiline />
      <Field label="Content" value={item.content} onChange={(value) => onChange({ ...item, content: value })} multiline />
      <Field label="Image" value={item.image} onChange={(value) => onChange({ ...item, image: value })} />
      <Field label="Meta title" value={item.meta_title} onChange={(value) => onChange({ ...item, meta_title: value })} />
      <Field label="Meta description" value={item.meta_description} onChange={(value) => onChange({ ...item, meta_description: value })} multiline />
    </div>
  );
}
