"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    ),
    content: `Savitri Fireworks Private Limited ("Savitri Fireworks", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website savitrifireworks.com, including when you enquire about our products or services.

By accessing or using our website, you acknowledge that you have read, understood, and agree to be bound by all terms of this Privacy Policy. If you do not agree, please discontinue access immediately.`,
  },
  {
    id: "collection",
    title: "Information We Collect",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M10 2a.75.75 0 01.75.75v5.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 7.26a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" />
        <path d="M5.273 4.5a1.25 1.25 0 00-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 01.894.553l.448.894a1 1 0 00.894.553h3.438a1 1 0 00.86-.49l.606-1.02A1 1 0 0114 11h3.47a1.318 1.318 0 00-.015-.062l-1.523-5.52a1.25 1.25 0 00-1.205-.918h-9.454z" />
      </svg>
    ),
    content: `We collect information that you provide directly to us when using our contact forms, enquiry submissions, or newsletter sign-ups:

**Personal Identification Information:** Full name, email address, phone number, postal address, and company name (if applicable).

**Enquiry Details:** Product enquiry details, dealership application information, PESO license numbers, GSTIN numbers, and uploaded verification documents.

**Technical Data:** IP addresses, browser type and version, time zone, browser plug-in types, operating system, and how you arrived at our website.

**Usage Data:** Pages you visit, links you click, time spent on pages, and referring URLs — collected through analytics cookies.

We never collect sensitive personal information such as government ID numbers, financial account numbers, or biometric data unless explicitly required for regulatory compliance.`,
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0-9a.75.75 0 01.75-.75H10a.75.75 0 010 1.5H7.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
      </svg>
    ),
    content: `We use the information we collect for the following purposes:

**To Process Enquiries:** Responding to your product enquiries, dealership applications, and customer support requests.

**To Operate Our Website:** Ensuring our website functions correctly, debugging technical issues, and maintaining security.

**To Improve Our Services:** Analyzing how visitors interact with our website to improve product listings, dealer locator accuracy, and navigation flows.

**To Communicate:** Sending transactional emails related to your enquiries, order confirmations, and occasional product update newsletters (with consent).

**Legal Compliance:** Fulfilling obligations under Indian law, including the IT Act 2000, GST Act, and PESO regulations.

**Fraud Prevention:** Detecting and preventing fraudulent activities, unauthorized access, and misuse of our services.`,
  },
  {
    id: "sharing",
    title: "Data Sharing & Disclosure",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.474l6.733-3.366A2.52 2.52 0 0113 4.5z" />
      </svg>
    ),
    content: `We do not sell, trade, or rent your personal information to third parties. We may share information only in the following limited circumstances:

**Authorized Distributors:** When you enquire about a regional depot or dealership, your contact details may be shared with the relevant authorized Savitri Fireworks dealer for fulfilment purposes only.

**Service Providers:** We use trusted third-party vendors for email delivery (SMTP providers), website analytics (anonymized), and cloud hosting — all under strict data processing agreements.

**Legal Requirements:** We may disclose information when required by law, court order, or government authority under the Indian Information Technology Act, 2000.

**Business Transfers:** In the event of a merger, acquisition, or sale of company assets, user data may be transferred as part of that transaction, subject to continued privacy protections.

Under no circumstances do we share data with advertising networks, data brokers, or any entities outside these categories.`,
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm-.75 4.25a.75.75 0 111.5 0v5.5a.75.75 0 01-1.5 0v-5.5zm.75 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    content: `Our website uses cookies and similar tracking technologies to enhance your browsing experience:

**Essential Cookies:** Required for basic website functionality such as navigation, form submissions, and security tokens. These cannot be disabled.

**Analytics Cookies:** We use Google Analytics to understand traffic patterns and improve content relevance. This data is fully anonymized and does not identify individual users.

**Preference Cookies:** Used to remember your display preferences such as dark mode settings and language selections.

You may control cookie preferences through your browser settings. Disabling non-essential cookies will not affect your ability to browse or submit enquiries, but may slightly impact website performance. Our site does not use third-party advertising cookies.`,
  },
  {
    id: "security",
    title: "Data Security",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
    content: `We take the security of your personal data seriously and implement industry-standard technical and organizational measures:

**Encryption in Transit:** All data transmitted between your browser and our servers is encrypted using TLS 1.3 (HTTPS).

**Access Controls:** Internal access to personal data is strictly limited to authorized personnel on a need-to-know basis.

**Data Minimization:** We collect only the minimum data required to fulfill the stated purposes and delete it when no longer needed.

**Incident Response:** We maintain a data breach response procedure. In the event of a breach affecting your rights, we will notify you within 72 hours as per applicable Indian data protection regulations.

While we implement strong security measures, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and avoid sharing personal information over unsecured networks.`,
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
      </svg>
    ),
    content: `We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:

**Enquiry Data:** Retained for up to 2 years from the date of submission or until your enquiry has been fully resolved.

**Dealership Application Data:** Retained for the duration of the dealership relationship plus 5 years for regulatory compliance.

**Analytics Data:** Anonymized usage data is retained for up to 26 months.

**Legal Obligations:** Certain records may be retained for up to 7 years to comply with Indian tax and commercial laws.

After the applicable retention period, your personal data is securely deleted or anonymized so it can no longer be associated with you.`,
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    content: `Under applicable Indian data protection laws and global best practices, you have the following rights regarding your personal data:

**Right to Access:** Request a copy of the personal data we hold about you.

**Right to Rectification:** Request correction of any inaccurate or incomplete personal data.

**Right to Erasure:** Request deletion of your personal data where it is no longer required for the original purpose or where consent has been withdrawn.

**Right to Portability:** Request your data in a structured, commonly-used machine-readable format.

**Right to Object:** Object to the processing of your personal data for direct marketing purposes.

**Right to Withdraw Consent:** Where processing is based on consent, withdraw that consent at any time without affecting the lawfulness of prior processing.

To exercise any of these rights, please contact us at privacy@savitrifireworks.com. We will respond within 30 days.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
      </svg>
    ),
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:

**Savitri Fireworks Private Limited**
142/3, Sivakasi Main Road, Thiruthangal,
Sivakasi, Tamil Nadu - 626130, India.

**Email:** privacy@savitrifireworks.com
**Phone:** +91 94431 82054
**Operating Hours:** Monday to Saturday, 9:00 AM - 6:00 PM IST

We aim to resolve all privacy-related queries within 30 business days. For unresolved complaints, you may escalate to the relevant data protection authority under applicable Indian law.`,
  },
];

function renderContent(text: string) {
  return text.split("\n\n").map((para, i) => {
    const lines = para.split("\n");
    return (
      <div key={i} className="space-y-1.5">
        {lines.map((line, j) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={j} className="text-sm font-black text-zinc-900 dark:text-white mt-4 first:mt-0">
                {line.replace(/\*\*/g, "")}
              </p>
            );
          }
          if (line.startsWith("**")) {
            const parts = line.split("**");
            return (
              <p key={j} className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <strong className="font-black text-zinc-900 dark:text-white">{parts[1]}</strong>
                {parts[2]}
              </p>
            );
          }
          return (
            <p key={j} className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
              {line}
            </p>
          );
        })}
      </div>
    );
  });
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id") || "";
            setVisibleSections((prev) => new Set([...prev, id]));
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-120px 0px -40% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -100; // Offset for sticky navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative">
      <FireworksCanvas />

      {/* HERO */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden z-20 bg-zinc-950">
        <BreadcrumbCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-0" />
        <div className="absolute inset-0 overflow-hidden z-0 opacity-40 pointer-events-none">
          <div className="absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-orange-500 animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute top-1/4 right-1/3 h-3 w-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDuration: "2s" }} />
          <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" style={{ animationDuration: "4s" }} />
        </div>

        <div className="max-w-[1600px] mx-auto w-full text-center px-4 sm:px-6 lg:px-8 space-y-6 z-10 relative">
          <div className="flex justify-center animate-slide-up-fade">
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:border-orange-500/30 transition-all duration-500 select-none group">
              <Link href="/" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-orange-400 transition-colors group/home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5 text-zinc-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span>Privacy Policy</span>
              </div>
            </nav>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Policy
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
            Last updated: July 2025 · Effective from: January 1, 2024
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="relative w-full py-16 z-20 border-t border-zinc-200/50 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT TOC SIDEBAR (Sticky) */}
            <div className="w-full lg:w-[280px] flex-shrink-0 lg:sticky lg:top-28 h-fit self-start">
              <div className="bg-white/70 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-3xl p-6 space-y-2 shadow-lg animate-fade-in text-left">
                <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest pb-2 border-b border-zinc-100 dark:border-white/5">
                  Contents
                </h4>
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      activeSection === s.id
                        ? "bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-orange-500 border border-orange-500/20"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className={`flex-shrink-0 transition-colors ${activeSection === s.id ? "text-orange-500" : "text-zinc-400"}`}>
                      {s.icon}
                    </span>
                    {s.title}
                  </button>
                ))}
                <div className="pt-3 border-t border-zinc-100 dark:border-white/5">
                  <Link
                    href="/terms-of-service"
                    className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-orange-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Terms of Service →
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  data-id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className={`bg-white/80 dark:bg-zinc-900/35 backdrop-blur-md border rounded-3xl p-8 shadow-md transition-all duration-700 ${
                    visibleSections.has(section.id)
                      ? "opacity-100 translate-y-0 border-zinc-200/80 dark:border-white/10"
                      : "opacity-0 translate-y-8 border-transparent"
                  } ${activeSection === section.id ? "border-orange-500/20 shadow-orange-500/5 shadow-xl" : ""}`}
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors duration-300 flex-shrink-0 ${
                      activeSection === section.id
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 border-orange-500/30 text-white shadow-md shadow-orange-500/20"
                        : "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400"
                    }`}>
                      {section.icon}
                    </div>
                    <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-wide">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4 text-left">
                    {renderContent(section.content)}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
