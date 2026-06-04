"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/components/site/SiteContentProvider";
import RichTextEditor from "@/components/ui/RichTextEditor";
import type { SiteContent } from "@/lib/site-content";

type Section = "navigation" | "footer" | "siteSeo" | "pageSeo" | "home" | "aboutPage" | "experiencePage" | "testimonialsPage" | "blogPage" | "servicesPage" | "doctorTalkPage" | "contactPage" | "banjaraHillsPage" | "about" | "experience" | "doctorTalk" | "testimonials" | "blog" | "services" | "contact";

type DoctorTalkItem = SiteContent["doctorTalk"][number];
type TestimonialItem = { id: string; patient_name: string; procedure: string; quote: string; rating: number };
type BlogItem = SiteContent["blog"][number];
type ServiceItem = SiteContent["services"][number];
type ExperienceItem = SiteContent["experience"]["experience"][number];
type NavLink = { label: string; href: string };
type GalleryProcedure = SiteContent["home"]["beforeAfterGallery"]["procedures"][number];
type PageSeoKey = keyof SiteContent["pageSeo"];
type BanjaraHillsServiceCard = SiteContent["banjaraHillsPage"]["cosmeticServices"][number];
type BanjaraHillsBenefitCard = SiteContent["banjaraHillsPage"]["aigBenefits"][number];
type BanjaraHillsFaqItem = SiteContent["banjaraHillsPage"]["faqItems"][number];

const navItems: Array<{ key: Section; label: string }> = [
  { key: "navigation", label: "Navigation" },
  { key: "footer", label: "Footer" },
  { key: "siteSeo", label: "Site SEO" },
  { key: "pageSeo", label: "Page SEO" },
  { key: "home", label: "Home Content" },
  { key: "aboutPage", label: "About Page" },
  { key: "experiencePage", label: "Experience Page" },
  { key: "testimonialsPage", label: "Testimonials Page" },
  { key: "blogPage", label: "Blog Page" },
  { key: "servicesPage", label: "Services Page" },
  { key: "doctorTalkPage", label: "Doctor's Talk Page" },
  { key: "contactPage", label: "Contact Page" },
  { key: "banjaraHillsPage", label: "Banjara Hills Page" },
  { key: "about", label: "About Data" },
  { key: "experience", label: "Experience Data" },
  { key: "doctorTalk", label: "Doctor's Talk Data" },
  { key: "testimonials", label: "Testimonials Data" },
  { key: "blog", label: "Blog Data" },
  { key: "services", label: "Services Data" },
  { key: "contact", label: "Contact Info" },
];

const pageSeoItems: Array<{ key: PageSeoKey; label: string }> = [
  { key: "home", label: "Home (/)" },
  { key: "about", label: "About (/about)" },
  { key: "aboutUs", label: "About Us (/aboutus)" },
  { key: "experience", label: "Experience (/experience)" },
  { key: "doctorsTalk", label: "Doctor's Talk (/doctors-talk)" },
  { key: "drVideo", label: "Doctor Videos (/drvideo)" },
  { key: "testimonials", label: "Testimonials (/testimonials)" },
  { key: "reviews", label: "Reviews (/reviews)" },
  { key: "blog", label: "Blog (/blog)" },
  { key: "services", label: "Services (/services)" },
  { key: "contact", label: "Contact (/contact)" },
  { key: "contactUs", label: "Contact Us (/contactus)" },
  { key: "banjaraHills", label: "Banjara Hills (/plastic-surgeon-banjarahills)" },
];

type SessionResponse = { authenticated?: boolean };

function sortBlogsByPublishedDate(items: BlogItem[], direction: "asc" | "desc") {
  return [...items].sort((first, second) => {
    const firstTime = Date.parse(first.published_at || "");
    const secondTime = Date.parse(second.published_at || "");
    const safeFirstTime = Number.isNaN(firstTime) ? 0 : firstTime;
    const safeSecondTime = Number.isNaN(secondTime) ? 0 : secondTime;

    return direction === "asc"
      ? safeFirstTime - safeSecondTime
      : safeSecondTime - safeFirstTime;
  });
}

export default function AdminPanel() {
  const router = useRouter();
  const {
    content,
    setContent,
    saveContent,
    refreshContent,
    resetContent,
    saving,
    lastSyncedAt,
  } = useSiteContent();
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [message, setMessage] = useState("");
  const skipAutosaveRef = useRef(true);
  const previousSavedSnapshotRef = useRef("");

  const sectionTitle = useMemo(() => navItems.find((item) => item.key === activeSection)?.label ?? activeSection, [activeSection]);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        if (!response.ok) {
          return false;
        }
        const data = (await response.json()) as SessionResponse;
        return Boolean(data.authenticated);
      } catch {
        return false;
      }
    };

    const runCheck = async () => {
      setCheckingSession(true);
      const ok = await checkSession();
      if (!active) {
        return;
      }
      if (ok) {
        skipAutosaveRef.current = true;
        await refreshContent();
      }
      setAuthenticated(ok);
      setCheckingSession(false);
    };

    runCheck();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void runCheck();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      active = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [refreshContent]);

  useEffect(() => {
    if (!authenticated) {
      skipAutosaveRef.current = true;
      previousSavedSnapshotRef.current = "";
      return;
    }

    const snapshot = JSON.stringify(content);

    if (skipAutosaveRef.current) {
      previousSavedSnapshotRef.current = snapshot;
      skipAutosaveRef.current = false;
      return;
    }

    if (snapshot === previousSavedSnapshotRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const result = await saveContent(content);
      if (result.ok) {
        previousSavedSnapshotRef.current = snapshot;
        setMessage("Changes synced across the site.");
        return;
      }

      setMessage(result.message ?? "Unable to save changes.");
    }, 800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [authenticated, content, saveContent]);

  async function login() {
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setMessage("Invalid credentials");
        return;
      }

      skipAutosaveRef.current = true;
      await refreshContent();
      setAuthenticated(true);
      setMessage("Logged in");
    } catch {
      setMessage("Unable to login");
    }
  }

  async function logout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // No-op
    }

    setAuthenticated(false);
    setMessage("");
    setPassword("");
    setUsername("");
    router.replace("/");
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
        return {
          ...previous,
          doctorTalk: [
            ...previous.doctorTalk,
            {
              id: `talk-${Date.now()}`,
              type: "article",
              title: "",
              description: "",
              content: "",
              category: "Reconstructive",
              date: "",
              readTime: "",
              youtubeUrl: "",
            },
          ],
        };
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

  if (checkingSession) {
    return (
      <div className="max-w-md mx-auto mt-24 p-6 glass-card rounded-2xl border border-(--border)">
        <h1 className="text-2xl font-medium text-(--foreground) mb-2" style={{ fontFamily: "var(--font-serif)" }}>
          Checking session
        </h1>
        <p className="text-sm text-(--foreground-muted)">Verifying access to the admin dashboard.</p>
      </div>
    );
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
              setMessage("Reset queued. Saving to shared storage...");
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
            <p className="text-sm text-(--foreground-subtle)">
              {saving
                ? "Saving to Vercel storage..."
                : lastSyncedAt
                  ? `Synced ${new Date(lastSyncedAt).toLocaleString()}`
                  : "Changes auto-save to shared storage"}
            </p>
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
                  <Field label="Gallery description" value={content.home.beforeAfterGallery.description} onChange={(value) => update("home", { ...content.home, beforeAfterGallery: { ...content.home.beforeAfterGallery, description: value } })} multiline className="md:col-span-2" />
                </div>

                <ListEditor<GalleryProcedure>
                  items={content.home.beforeAfterGallery.procedures}
                  onAdd={() =>
                    update("home", {
                      ...content.home,
                      beforeAfterGallery: {
                        ...content.home.beforeAfterGallery,
                        procedures: [
                          ...content.home.beforeAfterGallery.procedures,
                          createDefaultGalleryProcedure(content.home.beforeAfterGallery.procedures.length + 1),
                        ],
                      },
                    })
                  }
                  onRemove={(index) =>
                    update("home", {
                      ...content.home,
                      beforeAfterGallery: {
                        ...content.home.beforeAfterGallery,
                        procedures: content.home.beforeAfterGallery.procedures.filter((_, itemIndex) => itemIndex !== index),
                      },
                    })
                  }
                  onChange={(items) =>
                    update("home", {
                      ...content.home,
                      beforeAfterGallery: {
                        ...content.home.beforeAfterGallery,
                        procedures: items,
                      },
                    })
                  }
                  renderItem={(item, _index, updateItem) => (
                    <GalleryProcedureEditor item={item} onChange={updateItem} />
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
              renderItem={(item, index, updateItem) => {
                const itemType = item.type ?? "article";

                return (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={item.title ?? ""} onChange={(value) => updateItem({ ...item, title: value })} />
                    <SelectField
                      label="Type"
                      value={itemType}
                      options={[
                        { label: "Article", value: "article" },
                        { label: "Video", value: "video" },
                      ]}
                      onChange={(value) => updateItem({ ...item, type: value as DoctorTalkItem["type"] })}
                    />
                    {itemType === "article" ? (
                      <>
                        <Field label="Category" value={item.category ?? ""} onChange={(value) => updateItem({ ...item, category: value })} />
                        <Field label="Date" value={item.date ?? ""} onChange={(value) => updateItem({ ...item, date: value })} />
                        <Field label="Read time" value={item.readTime ?? ""} onChange={(value) => updateItem({ ...item, readTime: value })} />
                      </>
                    ) : null}
                    <Field label="Description" value={item.description ?? ""} onChange={(value) => updateItem({ ...item, description: value })} multiline className="md:col-span-2" />
                    {itemType === "article" ? (
                      <RichTextField label="Content" value={item.content ?? ""} onChange={(value) => updateItem({ ...item, content: value })} className="md:col-span-2" height={240} />
                    ) : null}
                    {itemType === "video" ? (
                      <Field label="Video URL (YouTube or Instagram Reel)" value={item.youtubeUrl ?? ""} onChange={(value) => updateItem({ ...item, youtubeUrl: value })} className="md:col-span-2" />
                    ) : null}
                  </div>
                );
              }}
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
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => update("blog", sortBlogsByPublishedDate(content.blog, "desc"))}
                  className="rounded-lg border border-(--border) px-4 py-2 text-sm text-(--foreground-muted) hover:text-(--foreground)"
                >
                  Sort newest first
                </button>
                <button
                  onClick={() => update("blog", sortBlogsByPublishedDate(content.blog, "asc"))}
                  className="rounded-lg border border-(--border) px-4 py-2 text-sm text-(--foreground-muted) hover:text-(--foreground)"
                >
                  Sort oldest first
                </button>
              </div>
              <ListEditor<BlogItem>
                items={content.blog}
                onAdd={() => addItem("blog")}
                onRemove={(index) => removeItem("blog", index)}
                onChange={(items) => update("blog", items)}
                renderItem={(item, _index, updateItem) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={item.title} onChange={(value) => updateItem({ ...item, title: value })} />
                    <Field label="Slug" value={item.slug} onChange={(value) => updateItem({ ...item, slug: value })} />
                    <Field label="Published date" value={item.published_at ?? ""} onChange={(value) => updateItem({ ...item, published_at: value })} />
                    <ImageField label="Image" value={item.image} onChange={(value) => updateItem({ ...item, image: value })} className="md:col-span-2" />
                    <Field label="Excerpt" value={item.excerpt} onChange={(value) => updateItem({ ...item, excerpt: value })} multiline />
                    <RichTextField label="Content" value={item.content} onChange={(value) => updateItem({ ...item, content: value })} height={320} />
                  </div>
                )}
              />
            </div>
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

          {activeSection === "siteSeo" ? (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Field
                  label="Default Title"
                  value={content.siteSeo.titleDefault}
                  onChange={(value) =>
                    update("siteSeo", { ...content.siteSeo, titleDefault: value })
                  }
                />
                <Field
                  label="Title Template"
                  value={content.siteSeo.titleTemplate}
                  onChange={(value) =>
                    update("siteSeo", { ...content.siteSeo, titleTemplate: value })
                  }
                />
                <Field
                  label="Meta Description"
                  value={content.siteSeo.description}
                  onChange={(value) =>
                    update("siteSeo", { ...content.siteSeo, description: value })
                  }
                  multiline
                  className="md:col-span-2"
                />
              </div>

              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Keywords</h3>
                <KeywordField
                  label="One keyword per line"
                  values={content.siteSeo.keywords}
                  onChange={(value) =>
                    update("siteSeo", { ...content.siteSeo, keywords: value })
                  }
                />
              </div>

              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Open Graph</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Site Name"
                    value={content.siteSeo.openGraph.siteName}
                    onChange={(value) =>
                      update("siteSeo", {
                        ...content.siteSeo,
                        openGraph: { ...content.siteSeo.openGraph, siteName: value },
                      })
                    }
                  />
                  <Field
                    label="Locale"
                    value={content.siteSeo.openGraph.locale}
                    onChange={(value) =>
                      update("siteSeo", {
                        ...content.siteSeo,
                        openGraph: { ...content.siteSeo.openGraph, locale: value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === "pageSeo" ? (
            <div className="space-y-8">
              {pageSeoItems.map((pageItem) => {
                const pageSeo = content.pageSeo[pageItem.key];

                return (
                  <div key={pageItem.key} className="rounded-xl border border-(--border) p-5 space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold text-(--foreground)">{pageItem.label}</h3>
                      <p className="text-xs text-(--foreground-subtle) mt-1">
                        Edit the SEO fields for this static page.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Field
                        label="Title"
                        value={pageSeo.title}
                        onChange={(value) =>
                          update("pageSeo", {
                            ...content.pageSeo,
                            [pageItem.key]: { ...pageSeo, title: value },
                          })
                        }
                      />
                      <Field
                        label="Canonical Path"
                        value={pageSeo.canonicalPath}
                        onChange={(value) =>
                          update("pageSeo", {
                            ...content.pageSeo,
                            [pageItem.key]: { ...pageSeo, canonicalPath: value },
                          })
                        }
                      />
                      <Field
                        label="Meta Description"
                        value={pageSeo.description}
                        onChange={(value) =>
                          update("pageSeo", {
                            ...content.pageSeo,
                            [pageItem.key]: { ...pageSeo, description: value },
                          })
                        }
                        multiline
                        className="md:col-span-2"
                      />
                    </div>

                    <KeywordField
                      label="Keywords (one per line)"
                      values={pageSeo.keywords}
                      onChange={(value) =>
                        update("pageSeo", {
                          ...content.pageSeo,
                          [pageItem.key]: { ...pageSeo, keywords: value },
                        })
                      }
                    />
                  </div>
                );
              })}
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
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Page heading" value={content.testimonialsPage.heading} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, heading: value })} />
                <Field label="Page subheading" value={content.testimonialsPage.subheading} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, subheading: value })} />
              </div>

              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Video Testimonial Section</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Eyebrow" value={content.testimonialsPage.video.eyebrow} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, video: { ...content.testimonialsPage.video, eyebrow: value } })} />
                  <Field label="Title" value={content.testimonialsPage.video.title} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, video: { ...content.testimonialsPage.video, title: value } })} />
                  <Field label="Subtitle" value={content.testimonialsPage.video.subtitle} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, video: { ...content.testimonialsPage.video, subtitle: value } })} multiline className="md:col-span-2" />
                  <Field label="YouTube URL" value={content.testimonialsPage.video.youtubeUrl} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, video: { ...content.testimonialsPage.video, youtubeUrl: value } })} className="md:col-span-2" />
                  <Field label="Video title" value={content.testimonialsPage.video.videoTitle} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, video: { ...content.testimonialsPage.video, videoTitle: value } })} />
                  <Field label="Video note" value={content.testimonialsPage.video.videoNote} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, video: { ...content.testimonialsPage.video, videoNote: value } })} multiline className="md:col-span-2" />
                </div>
              </div>

              <div className="border-t border-(--border) pt-6">
                <h3 className="text-sm font-semibold text-(--foreground) mb-4">Written Testimonials Section</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Eyebrow" value={content.testimonialsPage.written.eyebrow} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, written: { ...content.testimonialsPage.written, eyebrow: value } })} />
                  <Field label="Title" value={content.testimonialsPage.written.title} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, written: { ...content.testimonialsPage.written, title: value } })} />
                  <Field label="Subtitle" value={content.testimonialsPage.written.subtitle} onChange={(value) => update("testimonialsPage", { ...content.testimonialsPage, written: { ...content.testimonialsPage.written, subtitle: value } })} multiline className="md:col-span-2" />
                </div>
              </div>
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
              <Field label="Location Address" value={content.contactPage.locationAddress} onChange={(value) => update("contactPage", { ...content.contactPage, locationAddress: value })} multiline />
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

          {activeSection === "banjaraHillsPage" ? (
            <BanjaraHillsPageForm
              value={content.banjaraHillsPage}
              onChange={(value) => update("banjaraHillsPage", value)}
            />
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

function RichTextField({ label, value, onChange, className = "", height = 260 }: { label: string; value: string; onChange: (value: string) => void; className?: string; height?: number; }) {
  return (
    <div className={`block text-sm text-(--foreground-muted) ${className}`}>
      <span className="mb-1 block">{label}</span>
      <RichTextEditor value={value} onChange={onChange} height={height} />
    </div>
  );
}

function SelectField({ label, value, options, onChange, className = "" }: { label: string; value: string; options: Array<{ label: string; value: string }>; onChange: (value: string) => void; className?: string; }) {
  return (
    <label className={`block text-sm text-(--foreground-muted) ${className}`}>
      <span className="mb-1 block">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)">
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-(--foreground)">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function KeywordField({
  label,
  values,
  onChange,
  className = "",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}) {
  return (
    <label className={`block text-sm text-(--foreground-muted) ${className}`}>
      <span className="mb-1 block">{label}</span>
      <textarea
        value={values.join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          )
        }
        className="min-h-32 w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)"
      />
    </label>
  );
}

function ListEditor<T>({
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
  function moveItem(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    onChange(nextItems);
  }

  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="rounded-lg bg-(--accent-gold) px-4 py-2 text-sm font-medium text-(--background)">
        Add item
      </button>
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-(--border) p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-(--foreground)">Item {index + 1}</p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => moveItem(index, index - 1)}
                disabled={index === 0}
                className="rounded-md border border-(--border) px-3 py-1 text-xs text-(--foreground-muted) disabled:cursor-not-allowed disabled:opacity-40"
              >
                Up
              </button>
              <button
                onClick={() => moveItem(index, index + 1)}
                disabled={index === items.length - 1}
                className="rounded-md border border-(--border) px-3 py-1 text-xs text-(--foreground-muted) disabled:cursor-not-allowed disabled:opacity-40"
              >
                Down
              </button>
              <button onClick={() => onRemove(index)} className="text-sm text-red-400">
                Remove
              </button>
            </div>
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

const GALLERY_PROCEDURE_PRESETS: Array<GalleryProcedure> = [
  {
    procedureName: "Breast reconstruction",
    description: "Procedure-specific comparison set for breast reconstruction.",
    before: {
      front: {
        src: "/images/img/Dr Divya Plastic Surgeon - Home Banner.jpg",
        alt: "Before front view for breast reconstruction",
        label: "Before front",
      },
      back: {
        src: "/images/img/gallery-2.jpg",
        alt: "Before back view for breast reconstruction",
        label: "Before back",
      },
    },
    after: {
      front: {
        src: "/images/img/Dr Divya Plastic Surgeon home.jpg",
        alt: "After front view for breast reconstruction",
        label: "After front",
      },
      back: {
        src: "/images/img/hero-bg.jpg",
        alt: "After back view for breast reconstruction",
        label: "After back",
      },
    },
  },
  {
    procedureName: "Breast lift",
    description: "Procedure-specific comparison set for breast lift.",
    before: {
      front: {
        src: "/images/img/Dr Divya Plastic Surgeon - Home Banner (1).jpg",
        alt: "Before front view for breast lift",
        label: "Before front",
      },
      back: {
        src: "/images/img/slider.jpeg",
        alt: "Before back view for breast lift",
        label: "Before back",
      },
    },
    after: {
      front: {
        src: "/images/img/testimonials-4.jpg",
        alt: "After front view for breast lift",
        label: "After front",
      },
      back: {
        src: "/images/img/DR Divya.jpeg",
        alt: "After back view for breast lift",
        label: "After back",
      },
    },
  },
  {
    procedureName: "Rhinoplasty",
    description: "Procedure-specific comparison set for rhinoplasty.",
    before: {
      front: {
        src: "/images/img/about.jpeg",
        alt: "Before front view for rhinoplasty",
        label: "Before front",
      },
      back: {
        src: "/images/img/logo.jpeg",
        alt: "Before back view for rhinoplasty",
        label: "Before back",
      },
    },
    after: {
      front: {
        src: "/images/img/logo1.jpeg",
        alt: "After front view for rhinoplasty",
        label: "After front",
      },
      back: {
        src: "/images/img/Dr Divya Logo Circle.png",
        alt: "After back view for rhinoplasty",
        label: "After back",
      },
    },
  },
  {
    procedureName: "Body contouring",
    description: "Procedure-specific comparison set for body contouring.",
    before: {
      front: {
        src: "/images/img/Dr Divya Plastic Surgeon.png",
        alt: "Before front view for body contouring",
        label: "Before front",
      },
      back: {
        src: "/images/img/Dr Divya Plastic Surgeon - Home Banner.jpg",
        alt: "Before back view for body contouring",
        label: "Before back",
      },
    },
    after: {
      front: {
        src: "/images/img/gallery-2.jpg",
        alt: "After front view for body contouring",
        label: "After front",
      },
      back: {
        src: "/images/img/hero-bg.jpg",
        alt: "After back view for body contouring",
        label: "After back",
      },
    },
  },
];

function createDefaultGalleryProcedure(index = 0): GalleryProcedure {
  return GALLERY_PROCEDURE_PRESETS[index % GALLERY_PROCEDURE_PRESETS.length];
}

function GalleryProcedureEditor({
  item,
  onChange,
}: {
  item: GalleryProcedure;
  onChange: (value: GalleryProcedure) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Procedure name" value={item.procedureName} onChange={(value) => onChange({ ...item, procedureName: value })} />
        <Field label="Procedure description" value={item.description} onChange={(value) => onChange({ ...item, description: value })} multiline className="md:col-span-2" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GallerySlotEditor
          title="Before front"
          value={item.before.front}
          onChange={(value) => onChange({ ...item, before: { ...item.before, front: value } })}
        />
        <GallerySlotEditor
          title="Before back"
          value={item.before.back}
          onChange={(value) => onChange({ ...item, before: { ...item.before, back: value } })}
        />
        <GallerySlotEditor
          title="After front"
          value={item.after.front}
          onChange={(value) => onChange({ ...item, after: { ...item.after, front: value } })}
        />
        <GallerySlotEditor
          title="After back"
          value={item.after.back}
          onChange={(value) => onChange({ ...item, after: { ...item.after, back: value } })}
        />
      </div>
    </div>
  );
}

function GallerySlotEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: { src: string; alt: string; label: string };
  onChange: (value: { src: string; alt: string; label: string }) => void;
}) {
  return (
    <div className="rounded-xl border border-(--border) p-4 space-y-4">
      <p className="text-sm font-semibold text-(--foreground)">{title}</p>
      <ImageField label={`${title} image`} value={value.src} onChange={(src) => onChange({ ...value, src })} />
      <Field label={`${title} alt text`} value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
      <Field label={`${title} label`} value={value.label} onChange={(label) => onChange({ ...value, label })} />
    </div>
  );
}

function BanjaraHillsPageForm({
  value,
  onChange,
}: {
  value: SiteContent["banjaraHillsPage"];
  onChange: (value: SiteContent["banjaraHillsPage"]) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Hero Eyebrow" value={value.heroEyebrow} onChange={(next) => onChange({ ...value, heroEyebrow: next })} />
        <Field label="Hero Title" value={value.heroTitle} onChange={(next) => onChange({ ...value, heroTitle: next })} />
        <Field label="Hero Summary" value={value.heroSummary} onChange={(next) => onChange({ ...value, heroSummary: next })} multiline className="md:col-span-2" />
        <Field label="Contact Card Title" value={value.contactCardTitle} onChange={(next) => onChange({ ...value, contactCardTitle: next })} />
        <KeywordField label="Contact Card Items (one per line)" values={value.contactCardItems} onChange={(next) => onChange({ ...value, contactCardItems: next })} className="md:col-span-2" />
      </div>

      <div className="border-t border-(--border) pt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Qualifications Eyebrow" value={value.qualificationsEyebrow} onChange={(next) => onChange({ ...value, qualificationsEyebrow: next })} />
          <Field label="Qualifications Title" value={value.qualificationsTitle} onChange={(next) => onChange({ ...value, qualificationsTitle: next })} />
          <Field label="Qualifications Subtitle" value={value.qualificationsSubtitle} onChange={(next) => onChange({ ...value, qualificationsSubtitle: next })} multiline className="md:col-span-2" />
          <KeywordField label="Qualification Points (one per line)" values={value.qualificationPoints} onChange={(next) => onChange({ ...value, qualificationPoints: next })} className="md:col-span-2" />
        </div>
      </div>

      <div className="border-t border-(--border) pt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Cosmetic Eyebrow" value={value.cosmeticEyebrow} onChange={(next) => onChange({ ...value, cosmeticEyebrow: next })} />
          <Field label="Cosmetic Title" value={value.cosmeticTitle} onChange={(next) => onChange({ ...value, cosmeticTitle: next })} />
          <Field label="Cosmetic Subtitle" value={value.cosmeticSubtitle} onChange={(next) => onChange({ ...value, cosmeticSubtitle: next })} multiline className="md:col-span-2" />
        </div>

        <ListEditor<BanjaraHillsServiceCard>
          items={value.cosmeticServices}
          onAdd={() =>
            onChange({
              ...value,
              cosmeticServices: [...value.cosmeticServices, { title: "", description: "", href: "", cta: "" }],
            })
          }
          onRemove={(index) =>
            onChange({
              ...value,
              cosmeticServices: value.cosmeticServices.filter((_, itemIndex) => itemIndex !== index),
            })
          }
          onChange={(items) => onChange({ ...value, cosmeticServices: items })}
          renderItem={(item, _index, updateItem) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={item.title} onChange={(next) => updateItem({ ...item, title: next })} />
              <Field label="Link" value={item.href} onChange={(next) => updateItem({ ...item, href: next })} />
              <Field label="CTA Label" value={item.cta} onChange={(next) => updateItem({ ...item, cta: next })} />
              <Field label="Description" value={item.description} onChange={(next) => updateItem({ ...item, description: next })} multiline className="md:col-span-2" />
            </div>
          )}
        />
      </div>

      <div className="border-t border-(--border) pt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Reconstructive Eyebrow" value={value.reconstructiveEyebrow} onChange={(next) => onChange({ ...value, reconstructiveEyebrow: next })} />
          <Field label="Reconstructive Title" value={value.reconstructiveTitle} onChange={(next) => onChange({ ...value, reconstructiveTitle: next })} />
          <Field label="Reconstructive Subtitle" value={value.reconstructiveSubtitle} onChange={(next) => onChange({ ...value, reconstructiveSubtitle: next })} multiline className="md:col-span-2" />
        </div>

        <ListEditor<BanjaraHillsServiceCard>
          items={value.reconstructiveServices}
          onAdd={() =>
            onChange({
              ...value,
              reconstructiveServices: [...value.reconstructiveServices, { title: "", description: "", href: "", cta: "" }],
            })
          }
          onRemove={(index) =>
            onChange({
              ...value,
              reconstructiveServices: value.reconstructiveServices.filter((_, itemIndex) => itemIndex !== index),
            })
          }
          onChange={(items) => onChange({ ...value, reconstructiveServices: items })}
          renderItem={(item, _index, updateItem) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={item.title} onChange={(next) => updateItem({ ...item, title: next })} />
              <Field label="Link" value={item.href} onChange={(next) => updateItem({ ...item, href: next })} />
              <Field label="CTA Label" value={item.cta} onChange={(next) => updateItem({ ...item, cta: next })} />
              <Field label="Description" value={item.description} onChange={(next) => updateItem({ ...item, description: next })} multiline className="md:col-span-2" />
            </div>
          )}
        />
      </div>

      <div className="border-t border-(--border) pt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="AIG Eyebrow" value={value.aigEyebrow} onChange={(next) => onChange({ ...value, aigEyebrow: next })} />
          <Field label="AIG Title" value={value.aigTitle} onChange={(next) => onChange({ ...value, aigTitle: next })} />
          <Field label="AIG Subtitle" value={value.aigSubtitle} onChange={(next) => onChange({ ...value, aigSubtitle: next })} multiline className="md:col-span-2" />
        </div>

        <ListEditor<BanjaraHillsBenefitCard>
          items={value.aigBenefits}
          onAdd={() =>
            onChange({
              ...value,
              aigBenefits: [...value.aigBenefits, { title: "", description: "" }],
            })
          }
          onRemove={(index) =>
            onChange({
              ...value,
              aigBenefits: value.aigBenefits.filter((_, itemIndex) => itemIndex !== index),
            })
          }
          onChange={(items) => onChange({ ...value, aigBenefits: items })}
          renderItem={(item, _index, updateItem) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title" value={item.title} onChange={(next) => updateItem({ ...item, title: next })} />
              <Field label="Description" value={item.description} onChange={(next) => updateItem({ ...item, description: next })} multiline className="md:col-span-2" />
            </div>
          )}
        />
      </div>

      <div className="border-t border-(--border) pt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="FAQ Eyebrow" value={value.faqEyebrow} onChange={(next) => onChange({ ...value, faqEyebrow: next })} />
          <Field label="FAQ Title" value={value.faqTitle} onChange={(next) => onChange({ ...value, faqTitle: next })} />
        </div>

        <ListEditor<BanjaraHillsFaqItem>
          items={value.faqItems}
          onAdd={() =>
            onChange({
              ...value,
              faqItems: [...value.faqItems, { question: "", answer: "" }],
            })
          }
          onRemove={(index) =>
            onChange({
              ...value,
              faqItems: value.faqItems.filter((_, itemIndex) => itemIndex !== index),
            })
          }
          onChange={(items) => onChange({ ...value, faqItems: items })}
          renderItem={(item, _index, updateItem) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Question" value={item.question} onChange={(next) => updateItem({ ...item, question: next })} className="md:col-span-2" />
              <Field label="Answer" value={item.answer} onChange={(next) => updateItem({ ...item, answer: next })} multiline className="md:col-span-2" />
            </div>
          )}
        />
      </div>

      <div className="border-t border-(--border) pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="CTA Eyebrow" value={value.ctaEyebrow} onChange={(next) => onChange({ ...value, ctaEyebrow: next })} />
          <Field label="CTA Title" value={value.ctaTitle} onChange={(next) => onChange({ ...value, ctaTitle: next })} />
          <Field label="CTA Summary" value={value.ctaSummary} onChange={(next) => onChange({ ...value, ctaSummary: next })} multiline className="md:col-span-2" />
        </div>
      </div>
    </div>
  );
}

function ServiceForm({ item, onChange }: { item: ServiceItem; onChange: (value: ServiceItem) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" value={item.name} onChange={(value) => onChange({ ...item, name: value })} />
        <Field label="Slug" value={item.slug} onChange={(value) => onChange({ ...item, slug: value })} />
        <SelectField
          label="Category"
          value={item.category}
          options={[
            { label: "Reconstructive", value: "reconstructive" },
            { label: "Cosmetic", value: "cosmetic" },
          ]}
          onChange={(value) => onChange({ ...item, category: value as ServiceItem["category"] })}
        />
        <ImageField label="Image" value={item.image} onChange={(value) => onChange({ ...item, image: value })} />
        <Field label="Summary" value={item.summary} onChange={(value) => onChange({ ...item, summary: value })} multiline className="md:col-span-2" />
        <RichTextField label="Content" value={item.content} onChange={(value) => onChange({ ...item, content: value })} className="md:col-span-2" height={280} />
        <Field label="Meta title" value={item.meta_title} onChange={(value) => onChange({ ...item, meta_title: value })} />
        <Field label="Meta description" value={item.meta_description} onChange={(value) => onChange({ ...item, meta_description: value })} multiline className="md:col-span-2" />
      </div>

      <div className="border-t border-(--border) pt-6">
        <h3 className="text-sm font-semibold text-(--foreground) mb-4">Key points</h3>
        <ListEditor<string>
          items={item.key_points ?? []}
          onAdd={() => onChange({ ...item, key_points: [...(item.key_points ?? []), ""] })}
          onRemove={(index) => onChange({ ...item, key_points: (item.key_points ?? []).filter((_, i) => i !== index) })}
          onChange={(items) => onChange({ ...item, key_points: items })}
          renderItem={(point, index, updateItem) => (
            <Field label={`Point ${index + 1}`} value={point} onChange={updateItem} className="md:col-span-2" />
          )}
        />
      </div>

      <div className="border-t border-(--border) pt-6">
        <h3 className="text-sm font-semibold text-(--foreground) mb-4">FAQ</h3>
        <ListEditor<{ question: string; answer: string }>
          items={item.faq ?? []}
          onAdd={() => onChange({ ...item, faq: [...(item.faq ?? []), { question: "", answer: "" }] })}
          onRemove={(index) => onChange({ ...item, faq: (item.faq ?? []).filter((_, i) => i !== index) })}
          onChange={(items) => onChange({ ...item, faq: items })}
          renderItem={(faqItem, _index, updateItem) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Question" value={faqItem.question} onChange={(value) => updateItem({ ...faqItem, question: value })} className="md:col-span-2" />
              <Field label="Answer" value={faqItem.answer} onChange={(value) => updateItem({ ...faqItem, answer: value })} multiline className="md:col-span-2" />
            </div>
          )}
        />
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function ImageField({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (value: string) => void; className?: string; }) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      return;
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className={`block text-sm text-(--foreground-muted) ${className}`}>
      <span className="mb-1 block">{label}</span>
      <div className="space-y-2">
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)" />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-(--foreground)" />
        {value ? (
          <div className="relative h-24 overflow-hidden rounded-md border border-(--border)">
            <Image
              src={value}
              alt={`${label} preview`}
              fill
              className="object-cover"
              unoptimized={value.startsWith("data:") || value.startsWith("blob:")}
              sizes="96px"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
