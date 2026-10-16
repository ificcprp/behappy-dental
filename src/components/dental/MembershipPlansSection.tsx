"use client";

import React, { useState, useEffect } from "react";
import { getCMSData, CMSData, CMSMembershipPlan, DEFAULT_MEMBERSHIP_PLANS } from "@/lib/cmsStore";
import { CLINIC_INFO, createWhatsAppUrl } from "@/data/clinicInfo";
import { Check, ShieldCheck, Zap, Star, ArrowUpRight, HelpCircle, AlertCircle, HeartHandshake, X, CreditCard } from "lucide-react";

export function MembershipPlansSection() {
  const [plans, setPlans] = useState<CMSMembershipPlan[]>(DEFAULT_MEMBERSHIP_PLANS);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [checkoutPlan, setCheckoutPlan] = useState<CMSMembershipPlan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [subscriberData, setSubscriberData] = useState({
    fullName: "",
    rut: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const cms = getCMSData();
    if (cms?.membershipPlans && cms.membershipPlans.length > 0) {
      setPlans(cms.membershipPlans);
    }

    const handleUpdate = (e: Event) => {
      const custom = (e as CustomEvent<CMSData>).detail;
      if (custom?.membershipPlans && custom.membershipPlans.length > 0) {
        setPlans(custom.membershipPlans);
      } else {
        setPlans(getCMSData().membershipPlans || DEFAULT_MEMBERSHIP_PLANS);
      }
    };

    window.addEventListener("behappy_cms_updated", handleUpdate);
    return () => window.removeEventListener("behappy_cms_updated", handleUpdate);
  }, []);

  return (
    <section id="club-behappy" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#e5e0d5] bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e5e0d5] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5f2eb] border border-[#e5e0d5] text-[11px] font-mono tracking-[0.2em] text-[#78736a] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#141413]" />
              SISTEMA DE MEMBRESÍA & SUSCRIPCIÓN DENTAL
            </div>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#141413]">
              Club Familiar BeHappy
            </h2>
            <p className="text-sm sm:text-base text-[#66635d] font-light leading-relaxed">
              La alternativa honesta y predecible a los convenios corporativos con letra chica. Débito automático mensual con Flow.cl, limpiezas y radiografías con $0 copago y aranceles preferentes garantizados para ti y tu familia en Ñuñoa.
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center self-start md:self-auto bg-[#faf8f5] p-1 border border-[#e5e0d5]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#141413] text-white shadow"
                  : "text-[#78736a] hover:text-[#141413]"
              }`}
            >
              Mensual (PAC/PAT)
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[#141413] text-white shadow"
                  : "text-[#78736a] hover:text-[#141413]"
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#d4af37] text-white font-bold">2 MESES $0</span>
            </button>
          </div>
        </div>

        {/* Dynamic Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => {
            const isPopular = plan.popular;
            const price = billingCycle === "annual" && plan.annualPriceDisplay
              ? plan.annualPriceDisplay
              : `${plan.monthlyPriceDisplay} / ${plan.billingPeriod}`;

            return (
              <div
                key={plan.id || idx}
                className={`relative flex flex-col justify-between border transition-all duration-200 ${
                  isPopular
                    ? "border-[#141413] bg-[#faf8f5] shadow-xl ring-1 ring-[#141413]"
                    : "border-[#e5e0d5] bg-white hover:border-[#141413]"
                } p-7 sm:p-9`}
              >
                {/* Popular or Custom Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className={`px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase font-semibold ${
                      isPopular
                        ? "bg-[#141413] text-white"
                        : "bg-[#e5e0d5] text-[#141413]"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-6 pt-2">
                  {/* Tag and Title */}
                  <div className="space-y-2 border-b border-[#e5e0d5] pb-5">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#78736a] uppercase block">
                      {plan.tag}
                    </span>
                    <h3 className="text-2xl font-normal tracking-tight text-[#141413]">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#66635d] font-light leading-relaxed min-h-[44px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="py-2 border-b border-[#e5e0d5]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-light tracking-tight text-[#141413]">
                        {billingCycle === "annual" && plan.annualPriceDisplay ? plan.annualPriceDisplay.split(" ")[0] : plan.monthlyPriceDisplay}
                      </span>
                      <span className="text-xs font-mono text-[#78736a]">
                        {billingCycle === "annual" ? "/año" : `/${plan.billingPeriod}`}
                      </span>
                    </div>
                    {billingCycle === "annual" && plan.annualPriceDisplay && (
                      <p className="text-[11px] font-mono text-[#2e7d32] mt-1">
                        ✓ Incluye 2 meses de ahorro al pagar suscripción anual
                      </p>
                    )}
                    {billingCycle === "monthly" && (
                      <p className="text-[11px] font-mono text-[#78736a] mt-1">
                        Débito automático vía Flow.cl (Tarjetas, PAC o Redcompra)
                      </p>
                    )}
                  </div>

                  {/* Highlight pill */}
                  {plan.coverageHighlight && (
                    <div className="bg-[#f0ede6] px-3.5 py-2 border-l-2 border-[#141413] text-[11px] font-mono text-[#141413]">
                      ✦ {plan.coverageHighlight}
                    </div>
                  )}

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#78736a] block">
                      COBERTURA & BENEFICIOS INCLUIDOS:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#403e3a] leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Action */}
                <div className="pt-6 border-t border-[#e5e0d5] mt-6 space-y-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutPlan(plan)}
                    className={`w-full py-3 px-4 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPopular
                        ? "bg-[#141413] text-white hover:bg-neutral-800 shadow-md"
                        : "bg-[#141413] text-white hover:bg-neutral-800"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Suscribirme Online (Flow.cl)</span>
                  </button>

                  <a
                    href={
                      plan.ctaUrl && plan.ctaUrl.trim() !== ""
                        ? plan.ctaUrl.trim()
                        : createWhatsAppUrl(
                            plan.ctaWhatsappMessage ||
                              `Hola Centro Dental BeHappy, deseo activar el ${plan.name}.`
                          )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 font-mono text-[11px] uppercase tracking-wider text-center text-[#66635d] hover:text-[#141413] border border-dashed border-[#ded9cd] hover:border-[#141413] transition block"
                  >
                    <span>O consultar con recepción por WhatsApp →</span>
                  </a>

                  <p className="text-[10px] font-mono text-center text-[#78736a] pt-1">
                    Sin multas de salida · 1ª profilaxis, Rx y descuentos activos desde Día 1
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency Comparison Table (The Real Anti-Trap Factor) */}
        <div className="border border-[#e5e0d5] bg-[#faf8f5] p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.24em] text-[#78736a] uppercase block">
              COMPARATIVA DE HONESTIDAD MÉDICA
            </span>
            <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-[#141413]">
              Por qué el Club BeHappy es diferente a las grandes cadenas dentales
            </h3>
            <p className="text-xs sm:text-sm text-[#66635d] font-light max-w-3xl leading-relaxed">
              Muchas personas contratan convenios corporativos atraídos por promesas de “hasta 70% de descuento”, para luego descubrir precios base inflados, cargos sorpresa por guantes o anestesia y cláusulas de permanencia abusiva. En BeHappy diseñamos la suscripción que nosotros mismos querríamos para nuestra familia.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#e5e0d5] bg-white">
              <thead>
                <tr className="bg-[#f0ede6] border-b border-[#e5e0d5] font-mono text-[11px] text-[#141413] uppercase tracking-wider">
                  <th className="p-3.5 sm:p-4">Criterio Clínico y Comercial</th>
                  <th className="p-3.5 sm:p-4 text-red-700 bg-red-50/60">Grandes Cadenas Dentales</th>
                  <th className="p-3.5 sm:p-4 text-emerald-800 bg-emerald-50/80 font-bold">Club Familiar BeHappy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e0d5] text-[#403e3a]">
                <tr>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-[#141413]">Descuentos y Aranceles</td>
                  <td className="p-3.5 sm:p-4 bg-red-50/30 text-[#66635d]">
                    “Hasta 70%” sobre aranceles de lista inflados artificialmente.
                  </td>
                  <td className="p-3.5 sm:p-4 bg-emerald-50/40 text-[#141413] font-medium">
                    ✓ Aranceles preferentes netos y transparentes, sin inflar el precio base.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-[#141413]">Limpiezas y Prevención</td>
                  <td className="p-3.5 sm:p-4 bg-red-50/30 text-[#66635d]">
                    Limpiezas parciales (destartraje supragingival básico); cobran extra por pulido o bicarbonato.
                  </td>
                  <td className="p-3.5 sm:p-4 bg-emerald-50/40 text-[#141413] font-medium">
                    ✓ Profilaxis completa + destartraje + set de Rx Bite-wing con $0 copago real.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-[#141413]">Permanencia y Letra Chica</td>
                  <td className="p-3.5 sm:p-4 bg-red-50/30 text-[#66635d]">
                    Contratos forzosos de 12 a 24 meses con multas si intentas desvincularte.
                  </td>
                  <td className="p-3.5 sm:p-4 bg-emerald-50/40 text-[#141413] font-medium">
                    ✓ Sin multas de salida: suscripción mensual vía Flow.cl, pausable o cancelable avisando antes de tu siguiente ciclo.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-[#141413]">Cargas Familiares</td>
                  <td className="p-3.5 sm:p-4 bg-red-50/30 text-[#66635d]">
                    Exigen certificados de cargas Fonasa/Isapre y cobran planes individuales por cada hijo.
                  </td>
                  <td className="p-3.5 sm:p-4 bg-emerald-50/40 text-[#141413] font-medium">
                    ✓ Titular + 2 cargas incluidas libremente (hijos, pareja o padres mayores).
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-mono font-medium text-[#141413]">Equipo Odontológico</td>
                  <td className="p-3.5 sm:p-4 bg-red-50/30 text-[#66635d]">
                    Alta rotación de profesionales recién egresados; rara vez te atiende el mismo dentista.
                  </td>
                  <td className="p-3.5 sm:p-4 bg-emerald-50/40 text-[#141413] font-medium">
                    ✓ 8 especialistas acreditados en SIS Chile con seguimiento de tu historial en Suecia 3580.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick FAQ / Doubts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 border border-[#e5e0d5] bg-[#faf8f5] space-y-2">
            <h4 className="text-sm font-medium text-[#141413] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#d4af37]" />
              ¿Cómo se paga mensualmente?
            </h4>
            <p className="text-xs text-[#66635d] font-light leading-relaxed">
              Mediante suscripción mensual o link de pago procesado con Flow.cl (Webpay, Redcompra, tarjeta de crédito o débito de cualquier banco chileno).
            </p>
          </div>

          <div className="p-5 border border-[#e5e0d5] bg-[#faf8f5] space-y-2">
            <h4 className="text-sm font-medium text-[#141413] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#d4af37]" />
              ¿Cómo se activan mis limpiezas y descuentos?
            </h4>
            <p className="text-xs text-[#66635d] font-light leading-relaxed">
              Tu diagnóstico, set radiográfico, 1ª limpieza completa y todos los descuentos clínicos (40% a 55%) se activan desde el Día 1. Tu 2ª limpieza semestral se libera al 6º mes de membresía activa (o desde el primer día si eliges plan anual).
            </p>
          </div>

          <div className="p-5 border border-[#e5e0d5] bg-[#faf8f5] space-y-2">
            <h4 className="text-sm font-medium text-[#141413] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#d4af37]" />
              ¿Reembolsa en Isapres?
            </h4>
            <p className="text-xs text-[#66635d] font-light leading-relaxed">
              Totalmente. Por cada prestación clínica realizada emitimos boleta electrónica oficial de servicios médicos y formulario timbrado para que solicites el reintegro en tu Isapre o seguro complementario.
            </p>
          </div>
        </div>

        {/* Online Flow.cl Checkout Modal */}
        {checkoutPlan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#141413] rounded-lg max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
              <div className="flex items-start justify-between border-b border-[#e5e0d5] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-700 uppercase font-bold block">
                    ACTIVACIÓN SEGURA EN LÍNEA · FLOW.CL
                  </span>
                  <h3 className="text-xl font-normal text-[#141413]">
                    {checkoutPlan.name}
                  </h3>
                  <p className="text-xs font-mono text-[#78736a]">
                    Modalidad: {billingCycle === "annual" ? "Suscripción Anual (Ahorro 2 meses)" : "Débito Automático Mensual"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutPlan(null)}
                  className="p-1 text-[#78736a] hover:text-[#141413] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price summary badge */}
              <div className="bg-[#faf8f5] border border-[#e5e0d5] p-3 rounded flex items-center justify-between text-xs font-mono">
                <span className="text-[#66635d]">Monto a pagar:</span>
                <span className="text-base font-bold text-[#141413]">
                  ${(billingCycle === "annual"
                    ? Math.round((checkoutPlan.monthlyPrice || 14990) * 10)
                    : (checkoutPlan.monthlyPrice || 14990)
                  ).toLocaleString("es-CL")} CLP
                </span>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!checkoutPlan || !subscriberData.fullName || !subscriberData.email) return;
                  setCheckoutLoading(true);
                  try {
                    const amount = billingCycle === "annual"
                      ? Math.round((checkoutPlan.monthlyPrice || 14990) * 10)
                      : (checkoutPlan.monthlyPrice || 14990);
                    const res = await fetch("/api/pagos/flow/create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "membresia_club",
                        amount,
                        subject: `Suscripción Club BeHappy · ${checkoutPlan.name}`,
                        email: subscriberData.email,
                        patientName: subscriberData.fullName,
                        patientPhone: subscriberData.phone,
                        patientRut: subscriberData.rut,
                        planId: checkoutPlan.id,
                        billingCycle,
                      }),
                    });
                    const data = await res.json();
                    if (data.redirectUrl) {
                      window.location.href = data.redirectUrl;
                      return;
                    }
                  } catch (err) {
                    console.error("Error in checkout:", err);
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#141413] mb-1 font-medium">
                    Nombre Completo del Titular *
                  </label>
                  <input
                    type="text"
                    required
                    value={subscriberData.fullName}
                    onChange={(e) => setSubscriberData({ ...subscriberData, fullName: e.target.value })}
                    placeholder="Ej: Marcelo Vidal Ríos"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded9cd] rounded text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#141413] mb-1 font-medium">
                      RUT *
                    </label>
                    <input
                      type="text"
                      required
                      value={subscriberData.rut}
                      onChange={(e) => setSubscriberData({ ...subscriberData, rut: e.target.value })}
                      placeholder="12.345.678-9"
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded9cd] rounded text-[#141413] font-mono focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#141413] mb-1 font-medium">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={subscriberData.phone}
                      onChange={(e) => setSubscriberData({ ...subscriberData, phone: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded9cd] rounded text-[#141413] font-mono focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#141413] mb-1 font-medium">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={subscriberData.email}
                    onChange={(e) => setSubscriberData({ ...subscriberData, email: e.target.value })}
                    placeholder="titular@correo.cl"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ded9cd] rounded text-[#141413] font-mono focus:outline-none focus:border-[#141413]"
                  />
                  <p className="text-[10px] text-[#78736a] mt-1 font-mono">
                    Aquí enviaremos tu comprobante de suscripción y contrato de beneficios.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e5e0d5] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutPlan(null)}
                    className="px-4 py-2 border border-[#ded9cd] rounded text-xs font-mono uppercase text-[#66635d] hover:border-[#141413]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className="px-5 py-2.5 bg-[#141413] hover:bg-black text-white font-mono text-xs uppercase tracking-wider font-bold rounded flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {checkoutLoading ? (
                      <span>Conectando...</span>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Continuar a Flow.cl</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
