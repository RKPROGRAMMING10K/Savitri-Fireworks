"use client";

import React, { useState, useEffect } from "react";
import { ToastType, ToastEventDetail } from "@/utils/notifications";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

const AdminToastCard = ({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) => {
  // Generate 12 radial spark directions
  const sparks = Array.from({ length: 12 }).map((_, idx) => {
    const angle = (idx * 360) / 12;
    const distance = 25 + Math.random() * 20; // firecracker blast radius
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance;
    
    // Choose particle colors
    const colors =
      toast.type === "success"
        ? ["#f59e0b", "#f97316", "#fbbf24", "#ffffff"]
        : ["#ef4444", "#dc2626", "#f43f5e", "#ffffff"];
    const color = colors[idx % colors.length];

    return {
      tx: `${tx.toFixed(1)}px`,
      ty: `${ty.toFixed(1)}px`,
      color,
      delay: `${(Math.random() * 0.1).toFixed(2)}s`,
      size: `${(1.5 + Math.random() * 2).toFixed(1)}px`,
    };
  });

  // Auto-dismiss timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`relative pointer-events-auto w-full rounded-2xl bg-zinc-900/90 border backdrop-blur-md p-4 flex gap-3.5 shadow-2xl select-none animate-toast-in overflow-hidden
        ${
          toast.type === "success"
            ? "border-amber-500/20 shadow-orange-500/5"
            : "border-red-500/20 shadow-red-500/5"
        }
      `}
    >
      {/* Dynamic Keyframe Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(45px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes shrinkProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes sparkOut {
          0% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }
        .animate-toast-in {
          animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-progress-shrink {
          animation: shrinkProgress 4s linear forwards;
        }
        .animate-spark-particle {
          animation: sparkOut 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Left Icon with radial spark canvas details */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Glow effect back */}
        <div
          className={`absolute -inset-1.5 rounded-full opacity-20 blur-md
            ${toast.type === "success" ? "bg-orange-500" : "bg-red-500"}
          `}
        />

        {/* Circular Icon Wrapper */}
        <div
          className={`relative z-10 h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-md
            ${
              toast.type === "success"
                ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-orange-500/10"
                : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/10"
            }
          `}
        >
          {toast.type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.515 2.63H3.72c-1.345 0-2.188-1.463-1.515-2.63L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Localized Firecracker Sparks Burst */}
        {sparks.map((spark, idx) => (
          <span
            key={idx}
            className="absolute rounded-full animate-spark-particle pointer-events-none z-0"
            style={{
              "--tx": spark.tx,
              "--ty": spark.ty,
              backgroundColor: spark.color,
              width: spark.size,
              height: spark.size,
              animationDelay: spark.delay,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 4px ${spark.color}`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-[11px] font-black uppercase text-white tracking-wider truncate">
          {toast.title}
        </h4>
        <p className="text-[10px] text-zinc-400 font-semibold leading-normal mt-0.5">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="shrink-0 text-zinc-600 hover:text-white transition-colors cursor-pointer self-start"
        title="Dismiss Notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4.5 w-4.5"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      {/* Timeline Progress Bar indicator */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] animate-progress-shrink
          ${
            toast.type === "success"
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          }
        `}
      />
    </div>
  );
};

export default function AdminToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Listen to custom dispatch notifications event
  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      const { type, title, message } = customEvent.detail;
      
      const newToast: ToastItem = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        title,
        message,
      };

      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener("show-admin-notification", handleNotification);
    return () =>
      window.removeEventListener("show-admin-notification", handleNotification);
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 w-full max-w-[360px] pointer-events-none select-none">
      {toasts.map((t) => (
        <AdminToastCard
          key={t.id}
          toast={t}
          onClose={() => handleDismiss(t.id)}
        />
      ))}
    </div>
  );
}
