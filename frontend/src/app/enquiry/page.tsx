"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import FireworksCanvas from "@/components/FireworksCanvas";
import BreadcrumbCanvas from "@/components/BreadcrumbCanvas";

declare global {
  interface Window {
    Email: any;
  }
}

interface FileAttachment {
  name: string;
  path: string; // Base64 data URL
}

function EnquiryFormContent() {
  const searchParams = useSearchParams();

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiryType, setEnquiryType] = useState("General Info");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  // Conditional Fields State
  const [productName, setProductName] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pesoLicense, setPesoLicense] = useState("");

  // Attachment State
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [fileName, setFileName] = useState("");

  // Status State
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Pre-populate fields from query parameters
  useEffect(() => {
    const urlProduct = searchParams.get("product");
    const urlDealer = searchParams.get("dealer");

    if (urlProduct) {
      setEnquiryType("Product Related");
      setProductName(decodeURIComponent(urlProduct));
      setSubject(`Product Enquiry: ${decodeURIComponent(urlProduct)}`);
    }

    if (urlDealer) {
      setEnquiryType("Distributor / Dealership");
      setDealerName(decodeURIComponent(urlDealer));
      setSubject(`Depot Enquiry: ${decodeURIComponent(urlDealer)}`);
    }
  }, [searchParams]);

  // Load SMTP JS script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://smtpjs.com/v3/smtp.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle image upload and conversion to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit!");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setAttachment({
        name: file.name,
        path: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAttachment(null);
    setFileName("");
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setErrorMessage("");

    // Compile email body HTML
    const emailBody = `
      <h3>New Savitri Fireworks Enquiry</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Enquiry Type:</b> ${enquiryType}</p>
      <p><b>Subject:</b> ${subject}</p>
      ${productName ? `<p><b>Product Selection:</b> ${productName}</p>` : ""}
      ${dealerName ? `<p><b>Dealer Selection:</b> ${dealerName}</p>` : ""}
      ${companyName ? `<p><b>Company Name:</b> ${companyName}</p>` : ""}
      ${pesoLicense ? `<p><b>PESO License / GSTIN:</b> ${pesoLicense}</p>` : ""}
      <p><b>Message:</b></p>
      <p>${message}</p>
    `;

    // Retrieve button client coordinates for the firework explosion
    const buttonRect = (e.target as HTMLFormElement)
      .querySelector("button[type='submit']")
      ?.getBoundingClientRect();
    const blastX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
    const blastY = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight / 2;

    try {
      if (window.Email) {
        // Send email via SmtpJS
        const response = await window.Email.send({
          SecureToken: "a093b194-e0b3-4f92-9111-d039f9021b39", // Replace with your SmtpJS token
          To: "enquiry@savitrifireworks.com",
          From: "noreply@savitrifireworks.com",
          Subject: `[Enquiry - ${enquiryType}] ${subject}`,
          Body: emailBody,
          Attachments: attachment ? [attachment] : [],
        });

        console.log("SMTP Response:", response);
      } else {
        // Simulate network delay if SMTP JS fails to load
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Celebrate success!
      window.dispatchEvent(
        new CustomEvent("trigger-firework", {
          detail: {
            x: blastX,
            y: blastY,
            type: "crackle",
          },
        })
      );

      setSubmitStatus("success");
      // Reset form fields
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setAttachment(null);
      setFileName("");
    } catch (err: any) {
      console.error("Email send error:", err);
      setErrorMessage("Failed to send message. Please try again later.");
      setSubmitStatus("error");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative z-30">
      
      {/* COLUMN 1: LEFT ENQUIRY FORM PANEL (3/5 Width) */}
      <div className="w-full lg:w-3/5">
        {submitStatus === "success" ? (
          
          /* SUCCESS ANIMATION CONTAINER */
          <div className="bg-white/80 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl space-y-6 animate-scale-up h-full flex flex-col justify-center min-h-[500px]">
            <div className="flex justify-center">
              <span className="relative flex h-16 w-16">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-16 w-16 bg-emerald-500/20 border border-emerald-500/40 items-center justify-center text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                Enquiry Sent Successfully!
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold max-w-md mx-auto">
                Thank you for reaching out. We have received your request and will contact you via your registered email or phone within 24 hours.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => setSubmitStatus("idle")}
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Send Another
              </button>
              <Link
                href="/"
                className="px-8 py-2.5 rounded-full text-xs font-black uppercase text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>

        ) : (

          /* MAIN ENQUIRY FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6"
          >
            {/* Ambient ambient glow spheres inside container */}
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

            <div className="text-left space-y-1 relative z-10">
              <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                Enquiry Details
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
                Fill out the parameters below to connect with our official Sivakasi team.
              </p>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                />
              </div>

              {/* Enquiry Type Selector */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Enquiry Type
                </label>
                <div className="relative">
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="General Info">General Information</option>
                    <option value="Product Related">Product Related Enquiry</option>
                    <option value="Customer Support">Customer / Retail Support</option>
                    <option value="Distributor / Dealership">Distributor / Dealership</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC CONDITIONAL INPUTS */}
            <div className="relative z-10 space-y-5">
              {/* Product Specific Info */}
              {enquiryType === "Product Related" && (
                <div className="space-y-1.5 text-left animate-slide-up-fade">
                  <label className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
                    Product Name / Selected Code
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Sky Shell - 120 Shots"
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-orange-500/20 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                  />
                </div>
              )}

              {/* Dealership Info */}
              {enquiryType === "Distributor / Dealership" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up-fade">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Balaji Crackers Ltd."
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-orange-500/20 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
                      PESO License / GSTIN
                    </label>
                    <input
                      type="text"
                      required
                      value={pesoLicense}
                      onChange={(e) => setPesoLicense(e.target.value)}
                      placeholder="e.g., PESO-RET-AP-1029"
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-orange-500/20 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-1.5 text-left relative z-10">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Bulk Purchase Enquiry"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner"
              />
            </div>

            {/* Message Area */}
            <div className="space-y-1.5 text-left relative z-10">
              <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                Your Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your purchase requirements or support query here..."
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-black/30 border border-zinc-200/80 dark:border-white/5 text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500/50 shadow-inner resize-none"
              />
            </div>

            {/* FILE UPLOAD DRAG-DROP AREA - DISPLAYED FOR PRODUCT OR DEALERSHIP ENQUIRIES ONLY */}
            {(enquiryType === "Product Related" || enquiryType === "Distributor / Dealership") && (
              <div className="space-y-2 text-left relative z-10 animate-slide-up-fade">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  Upload Verification Image (Optional, Max 2MB)
                </label>
                
                <div className="relative group/drop rounded-2xl border border-dashed border-zinc-200 dark:border-white/10 hover:border-orange-500/40 bg-zinc-50/50 dark:bg-black/10 transition-colors p-4 flex flex-col justify-center items-center cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    aria-label="Upload Attachment Image"
                  />

                  {attachment ? (
                    <div className="flex items-center gap-4 relative z-30 animate-scale-up">
                      <div className="h-16 w-16 rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden relative shadow-inner">
                        <img
                          src={attachment.path}
                          alt="Upload Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left space-y-1 max-w-[200px]">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {fileName}
                        </p>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-widest leading-none">
                          Ready to Attach
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="h-7 w-7 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                        aria-label="Remove uploaded image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.842 8.14a2.75 2.75 0 002.722 2.47h5.116a2.75 2.75 0 002.722-2.47l.842-8.14.149.022a.75.75 0 00.23-1.482L14 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM8 3.75V4h4v-.25A1.25 1.25 0 0010.75 2.5h-1.5A1.25 1.25 0 008 3.75zM5.728 5.753l.796 7.7a1.25 1.25 0 001.237 1.122h5.116a1.25 1.25 0 001.237-1.122l.796-7.7a41.07 41.07 0 00-9.182 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 z-10 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-7 w-7 text-zinc-400 dark:text-zinc-600 group-hover/drop:text-orange-500 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                        Drag and drop file here, or <span className="text-orange-500">browse</span>
                      </p>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider leading-none">
                        JPG, PNG, WEBP ONLY
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="relative z-10 pt-4 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="w-full flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-black uppercase text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.005] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                {submitStatus === "submitting" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending Secure Request...
                  </>
                ) : (
                  "Send Secure Enquiry"
                )}
              </button>

              {errorMessage && (
                <p className="text-xs text-red-500 font-bold animate-pulse">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>
        )}
      </div>

      {/* COLUMN 2: RIGHT HEADQUARTERS MAP & DETAILS PANEL (2/5 Width) */}
      <div className="w-full lg:w-2/5 space-y-8 text-left animate-fade-in">
        
        {/* Contact details box */}
        <div className="bg-white/80 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
              Headquarters
            </span>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-wider">
              Savitri Fireworks
            </h2>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-medium relative z-10 leading-relaxed">
            
            {/* Address */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                Factory Address
              </h4>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                142/3, Sivakasi Main Road, Thiruthangal, Sivakasi, Tamil Nadu - 626130, India.
              </p>
            </div>

            {/* Direct Lines */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                Direct Contact Lines
              </h4>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                General Inquiry: +91 94431 82054
              </p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                Sales & Wholesale: +91 98430 52361
              </p>
            </div>

            {/* Emails */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                Email Accounts
              </h4>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                info@savitrifireworks.com
              </p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                sales@savitrifireworks.com
              </p>
            </div>

            {/* Hours */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
                Operating Schedule
              </h4>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300">
                Monday to Saturday: 9:00 AM - 6:00 PM (IST)
              </p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-300 text-orange-500">
                Closed on Sundays & National Festivals
              </p>
            </div>

          </div>
        </div>

        {/* Google Map Box */}
        <div className="bg-white/80 dark:bg-zinc-900/35 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] p-3 shadow-2xl relative overflow-hidden">
          <div className="relative rounded-[1.8rem] overflow-hidden border border-zinc-200/80 dark:border-white/10 h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3414969247653!2d77.808381!3d9.479679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee2ee4dcf7f%3A0x7d6a54cd9c06631b!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.1)" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Savitri Fireworks Factory Map"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

    </div>
  );
}

export default function EnquiryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background canvas signals */}
      <FireworksCanvas />

      {/* SECTION 1: BREADCRUMB HERO */}
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
            <nav className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/5 dark:bg-black/40 border border-white/10 dark:border-zinc-800 backdrop-blur-md rounded-full shadow-lg hover:shadow-orange-500/5 hover:border-orange-500/30 transition-all duration-500 select-none group">
              <Link href="/" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-orange-400 transition-colors group/home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover/home:scale-110 group-hover/home:rotate-12">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-3.5 w-3.5 text-zinc-600 transition-transform duration-300 group-hover:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span>Enquiry Now</span>
              </div>
            </nav>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-xl leading-none animate-slide-up-fade" style={{ animationDelay: "100ms" }}>
            Submit Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Enquiry
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-300 font-medium leading-relaxed select-none animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
            Contact our Sivakasi headquarters directly. Whether seeking dealership credentials, retail support, or product info, we are ready to assist.
          </p>
        </div>
      </section>

      {/* SECTION 2: ENQUIRY GRID (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-16 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <Suspense fallback={
            <div className="py-24 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 mx-auto" />
            </div>
          }>
            <EnquiryFormContent />
          </Suspense>

        </div>
      </section>

      <Footer />

    </div>
  );
}
