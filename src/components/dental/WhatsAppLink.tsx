"use client";

import React, { useEffect, useState } from "react";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { buildWhatsAppUrl, getWhatsAppNumber, getFloatingWhatsAppMessage } from "@/lib/whatsapp";

export function useWhatsAppNumber(): string {
  const [number, setNumber] = useState(CLINIC_INFO.contact.whatsappNumber);

  useEffect(() => {
    setNumber(getWhatsAppNumber());
    const handleUpdate = () => setNumber(getWhatsAppNumber());
    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  return number;
}

export function useFloatingWhatsAppMessage(): string {
  const [msg, setMsg] = useState(getFloatingWhatsAppMessage());

  useEffect(() => {
    setMsg(getFloatingWhatsAppMessage());
    const handleUpdate = () => setMsg(getFloatingWhatsAppMessage());
    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  return msg;
}

export function useWhatsAppUrl(message: string): string {
  const number = useWhatsAppNumber();
  return buildWhatsAppUrl(message, number);
}

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  message: string;
}

export function WhatsAppLink({ message, children, ...anchorProps }: WhatsAppLinkProps) {
  const href = useWhatsAppUrl(message);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...anchorProps}>
      {children}
    </a>
  );
}
