"use client";

export type ToastType = "success" | "error";

export interface ToastEventDetail {
  type: ToastType;
  title: string;
  message: string;
}

export const showSuccessToast = (title: string, message: string) => {
  if (typeof window === "undefined") return;
  const event = new CustomEvent("show-admin-notification", {
    detail: { type: "success", title, message } as ToastEventDetail,
  });
  window.dispatchEvent(event);
};

export const showErrorToast = (title: string, message: string) => {
  if (typeof window === "undefined") return;
  const event = new CustomEvent("show-admin-notification", {
    detail: { type: "error", title, message } as ToastEventDetail,
  });
  window.dispatchEvent(event);
};
