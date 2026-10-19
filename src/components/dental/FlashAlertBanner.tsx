"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCMSData, CMSFlashAlert, DEFAULT_FLASH_ALERT } from "@/lib/cmsStore";
import { AlertTriangle, Sparkles, Info, ArrowRight, X } from "lucide-react";

export function FlashAlertBanner() {
  const [alert, setAlert] = useState<CMSFlashAlert | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const updateAlert = () => {
      try {
        const data = getCMSData();
        const flash = data.flashAlert || DEFAULT_FLASH_ALERT;

        // Check expiration if specified
        if (flash.expiresAt) {
          const expTime = new Date(flash.expiresAt).getTime();
          if (!isNaN(expTime) && expTime < Date.now()) {
            setAlert({ ...flash, enabled: false });
            return;
          }
        }

        // Check if user dismissed this specific alert message in session
        const sessionDismissed = sessionStorage.getItem(`behappy_flash_dismissed_${flash.message}`);
        if (sessionDismissed === "true") {
          setDismissed(true);
        } else {
          setDismissed(false);
        }

        setAlert(flash);
      } catch {
        setAlert(null);
      }
    };

    updateAlert();

    const handleCmsUpdate = () => {
      updateAlert();
    };

    window.addEventListener("behappy_cms_updated", handleCmsUpdate);
    return () => {
      window.removeEventListener("behappy_cms_updated", handleCmsUpdate);
    };
  }, []);

  if (!alert || !alert.enabled || dismissed || !alert.message) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(`behappy_flash_dismissed_${alert.message}`, "true");
    } catch {
      // ignore storage failure
    }
  };

  const getThemeClasses = () => {
    switch (alert.type) {
      case "urgency":
        return {
          container: "bg-[#180d0d] border-b border-red-500/30 text-red-100",
          badge: "bg-red-500/20 text-red-400 border border-red-500/40",
          button: "bg-red-500 hover:bg-red-400 text-white shadow-sm",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
        };
      case "promo":
        return {
          container: "bg-[#0b1612] border-b border-emerald-500/30 text-emerald-100",
          badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
          button: "bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm font-semibold",
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        };
      case "info":
      default:
        return {
          container: "bg-[#0c1424] border-b border-blue-500/30 text-blue-100",
          badge: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
          button: "bg-blue-500 hover:bg-blue-400 text-white shadow-sm",
          icon: <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <aside
      aria-label="Aviso de contingencia o comunicado especial"
      className={`relative z-40 w-full py-2.5 px-4 text-xs font-mono transition-all duration-300 ${theme.container}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Message and badge */}
        <div className="flex items-center gap-2.5 min-w-0 text-center sm:text-left flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 shrink-0">
            {theme.icon}
            {alert.badge && (
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${theme.badge}`}>
                {alert.badge}
              </span>
            )}
          </div>
          <p className="text-xs font-normal leading-tight text-white/95 truncate sm:text-clip">
            {alert.message}
          </p>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {alert.buttonText && alert.buttonUrl && (
            <Link
              href={alert.buttonUrl}
              className={`inline-flex items-center gap-1 px-3 py-1 text-[11px] uppercase tracking-wider transition-colors ${theme.button}`}
            >
              <span>{alert.buttonText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Cerrar aviso"
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
