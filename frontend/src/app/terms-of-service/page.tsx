"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";

const sections = [
  {
    id: "agreement",
    title: "Agreement to Terms",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    content: `These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and Savitri Fireworks Private Limited ("Savitri Fireworks", "Company", "we", "us", or "our"), governing your use of the website savitrifireworks.com and all associated services, content, and functionality.

By accessing, browsing, or submitting any enquiry through our website, you confirm that you are at least 18 years of age, have read these Terms, and agree to be legally bound by them. If you disagree with any part of these Terms, please refrain from using our website.

These Terms were last updated in July 2025 and supersede all prior agreements between you and Savitri Fireworks with respect to website usage.`,
  },
  {
    id: "products",
    title: "Products & Services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
    content: `**Product Information Accuracy:** All product descriptions, images, specifications, and safety ratings displayed on our website are provided for informational purposes only. While we endeavor to maintain accuracy, we reserve the right to update or correct product information at any time without prior notice.

**Pricing:** This website does not display retail pricing. Pricing is subject to market conditions, order volumes, and regional distributor agreements. Contact our sales team or your nearest authorized dealer for current pricing.

**Availability:** Product availability may vary by region, season, and applicable government regulations. We do not guarantee the availability of any specific product at any specific time.

**Minimum Age Requirement:** All fireworks products sold or distributed by Savitri Fireworks are intended for use by adults aged 18 and above. We strictly prohibit the sale, distribution, or provision of fireworks to minors.

**Safe Usage Obligation:** Purchasers are solely responsible for ensuring that fireworks are used in accordance with all applicable local laws, safety regulations, and manufacturer instructions. Savitri Fireworks is not liable for injuries, property damage, or legal penalties arising from unsafe or unlawful usage.`,
  },
  {
    id: "enquiries",
    title: "Enquiry Submissions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
      </svg>
    ),
    content: `**Accuracy of Information:** When submitting enquiries through our website, you agree to provide accurate, current, and complete information. Providing false or misleading information may result in the rejection of your enquiry and may constitute a breach of these Terms.

**No Contract Formation:** Submission of an enquiry form on our website does not constitute, nor create, a binding purchase contract or commercial agreement. A contract is formed only upon written confirmation from an authorized Savitri Fireworks representative.

**Response Timelines:** We aim to respond to all enquiries within 1-3 business days. Response times may be longer during peak festival seasons (Diwali, Dussehra, New Year) or public holidays.

**Dealership Applications:** Submissions for dealership or distribution agreements are subject to additional verification, including PESO license validation, GST registration verification, and credit assessments. Approval is at the sole discretion of Savitri Fireworks management.

**Spam and Abuse:** Automated, bulk, or abusive submissions to our enquiry forms are strictly prohibited and may result in permanent blocking of access to our website.`,
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.116-.463.315-.6a35.504 35.504 0 013.097-1.95A37.52 37.52 0 019.664 1.319zm-2.64 3.71c-0.94.485-1.89 1.08-2.832 1.672L4 6.81v.21a.75.75 0 01-.31.612 35.545 35.545 0 00-2.198 1.726.75.75 0 00-.007 1.095l5.82 5.82a.75.75 0 001.06 0l.04-.04.021.012a31.508 31.508 0 002.08-1.287.75.75 0 01.84 0 31.372 31.372 0 007.86 3.83.75.75 0 00.253-1.285A41.059 41.059 0 0110.336 11.1l-.672.336a.75.75 0 01-.672 0l-.336-.168a37.53 37.53 0 00-2.024-3.236z" clipRule="evenodd" />
      </svg>
    ),
    content: `**Ownership:** All content on this website — including but not limited to text, graphics, logos, product photographs, animations, page layouts, and software code — is the exclusive intellectual property of Savitri Fireworks Private Limited or its licensed content providers, and is protected by Indian copyright law and applicable international treaties.

**Permitted Use:** You may access and view website content for your personal, non-commercial use only. You may print or download individual pages for personal reference.

**Prohibited Activities:** You may not reproduce, distribute, modify, adapt, translate, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any website content without our express prior written permission.

**Trademarks:** "Savitri Fireworks", the Savitri Fireworks logo, and all associated brand marks are registered or common-law trademarks of Savitri Fireworks Private Limited. Unauthorized use of our trademarks is strictly prohibited.

**Reporting Infringement:** If you believe that your intellectual property rights have been violated on our website, please notify us at legal@savitrifireworks.com with full details of the alleged infringement.`,
  },
  {
    id: "prohibited",
    title: "Prohibited Conduct",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
    ),
    content: `You agree NOT to use our website for any of the following prohibited purposes:

**Illegal Activities:** Using our website or services to facilitate any activity that is illegal under Indian law or the laws of your jurisdiction, including but not limited to illegal arms procurement, smuggling of explosive materials, or tax evasion.

**Misrepresentation:** Impersonating any person or entity, or falsely claiming affiliation with Savitri Fireworks, government authorities, or regulatory bodies.

**System Interference:** Attempting to probe, scan, or test the vulnerability of our website systems, or circumventing any security or authentication measures.

**Harmful Content:** Uploading or transmitting viruses, malware, spyware, or any other malicious code through our contact forms or file upload mechanisms.

**Data Harvesting:** Using automated bots, scrapers, or crawlers to extract product data, dealer information, or any other content from our website without express written permission.

**Harassment:** Using our enquiry forms to submit threatening, offensive, or harassing communications to our staff.

Violation of any of these prohibitions may result in immediate termination of access and may be reported to law enforcement authorities.`,
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
    content: `**Website Disclaimer:** Our website is provided "as is" and "as available" without any warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.

**No Guarantee of Availability:** We do not warrant that our website will be available at all times or that it will be free of errors, viruses, or other harmful components. We reserve the right to suspend or discontinue the website at any time without notice.

**Third-Party Links:** Our website may contain links to third-party websites for your convenience. We have no control over the content, privacy policies, or practices of such websites and accept no liability for any loss or damage arising from your use of them.

**Maximum Liability:** To the fullest extent permitted by applicable law, our total liability for any claims arising out of or related to your use of our website shall not exceed INR 1,000 (Indian Rupees One Thousand), regardless of the form of action.

**Exclusion of Consequential Damages:** We shall not be liable for any indirect, incidental, special, exemplary, or consequential damages, including loss of profits, business, or data, even if we have been advised of the possibility of such damages.`,
  },
  {
    id: "safety",
    title: "Safety & Compliance",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.749zm4.196 5.954a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
    content: `Savitri Fireworks operates in full compliance with all applicable Indian regulatory frameworks governing the manufacture, storage, and distribution of pyrotechnic products:

**PESO Certification:** All manufacturing facilities and dealer depots authorized by Savitri Fireworks hold valid licenses issued by the Petroleum and Explosives Safety Organisation (PESO), Government of India.

**Explosives Act, 1884:** All products are manufactured, stored, and transported in accordance with the Explosives Act, 1884 and the Explosives Rules, 2008.

**CSIR-NEERI Green Standards:** Our green cracker product lines are formulated in accordance with guidelines issued by the Council of Scientific and Industrial Research - National Environmental Engineering Research Institute (CSIR-NEERI) to reduce PM 2.5 emissions.

**Child Labor Prohibition:** Savitri Fireworks maintains a strict zero-tolerance policy toward child labor across all manufacturing, packaging, and distribution operations, in compliance with the Child Labour (Prohibition and Regulation) Amendment Act, 2016.

**State-Specific Regulations:** Certain fireworks products may be subject to additional state-level restrictions. Buyers are responsible for ensuring compliance with local regulations in their jurisdiction.`,
  },
  {
    id: "governing",
    title: "Governing Law & Disputes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L5 9.44l-.47-.47a.75.75 0 00-1.06 1.06l1 1a.75.75 0 001.06 0l2.75-2.75zm0 4a.75.75 0 00-1.06-1.06L5 13.44l-.47-.47a.75.75 0 00-1.06 1.06l1 1a.75.75 0 001.06 0l2.75-2.75zm4.97-4.75a.75.75 0 010 1.5h-3.5a.75.75 0 010-1.5h3.5zm0 4a.75.75 0 010 1.5h-3.5a.75.75 0 010-1.5h3.5z" clipRule="evenodd" />
      </svg>
    ),
    content: `**Applicable Law:** These Terms of Service are governed by and construed in accordance with the laws of India, without regard to any conflict of law principles.

**Jurisdiction:** Any disputes arising from or relating to these Terms or your use of our website shall be subject to the exclusive jurisdiction of the courts located in Virudhunagar District, Tamil Nadu, India.

**Dispute Resolution:** Before initiating any formal legal proceedings, the parties agree to attempt in good faith to resolve any dispute through direct negotiation. Either party may send written notice of a dispute to legal@savitrifireworks.com, and both parties shall negotiate in good faith for a period of 30 days.

**Arbitration:** If direct negotiation fails, disputes shall be referred to binding arbitration under the Indian Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in Tamil Nadu in the English language.

**Severability:** If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.`,
  },
  {
    id: "modifications",
    title: "Modifications & Updates",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
      </svg>
    ),
    content: `**Right to Modify:** Savitri Fireworks reserves the right to modify, update, or replace any part of these Terms at any time at our sole discretion. The effective date of the most recent version is always indicated at the top of this document.

**Notification:** For material changes to these Terms, we will endeavor to provide prominent notice on our website or via email to users who have submitted enquiries in the past 12 months.

**Continued Use:** Your continued use of our website after any modifications to these Terms constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, please discontinue use of our website immediately.

**Version History:** Prior versions of our Terms of Service may be requested by emailing legal@savitrifireworks.com.

**Website Updates:** We reserve the right to modify, suspend, or discontinue any aspect of our website — including products, features, or dealer listings — at any time without prior notice or liability.`,
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.222a1.5 1.5 0 01-1.004 1.707l-1.9.633a12.045 12.045 0 005.653 5.653l.633-1.9a1.5 1.5 0 011.707-1.004l3.222.716A1.5 1.5 0 0118 13.852V15a1.5 1.5 0 01-1.5 1.5h-1.15a13.5 13.5 0 01-13-13z" clipRule="evenodd" />
      </svg>
    ),
    content: `For any questions or concerns regarding these Terms of Service, please contact us:

**Savitri Fireworks Private Limited**
Legal & Compliance Department
Amlner road.parola SH 48, Bodarde,
Maharashtra 425111, India.

**Email:** legal@savitrifireworks.com
**General Enquiries:** info@savitrifireworks.com
**Phone:** +91 2597 293 116
**Business Hours:** Monday to Sunday, 9:00 AM - 8:00 PM IST (Open Daily)

We aim to acknowledge all legal correspondence within 5 business days. For urgent legal matters, please mark your email "URGENT - LEGAL" in the subject line.`,
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

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("agreement");
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
      const yOffset = -100;
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
                <span>Terms of Service</span>
              </div>
            </nav>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Terms of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Service
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
                    href="/privacy-policy"
                    className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-orange-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    Privacy Policy →
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
