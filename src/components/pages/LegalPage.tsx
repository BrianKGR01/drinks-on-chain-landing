"use client";

import Link from "next/link";
import { PageShell } from "@/components/pages/PageShell";
import { UI } from "@/content/i18n";
import { CONTACT_EMAIL } from "@/lib/links";
import { useExperience } from "@/store/experience";
import styles from "./Editorial.module.css";

export function LegalPage() {
  const lang = useExperience((s) => s.lang);
  const t = UI[lang];
  const es = lang === "es";
  return (
    <PageShell eyebrow={t.legalNotice}>
      <header className={styles.contactHeader}>
        <span className="small-heading">Drinks on Chain</span>
        <span className="heading-separator" aria-hidden="true" />
        <h2 className={styles.contactTitle}>{t.legalNotice}</h2>
      </header>
      <div className={styles.legal}>
        <h3>{es ? "Editor" : "Publisher"}</h3>
        <p>Drinks on Chain. Tarija, Bolivia. {CONTACT_EMAIL}</p>
        <h3>{es ? "Alojamiento" : "Hosting"}</h3>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos.</p>
        <h3>{es ? "Propiedad intelectual" : "Intellectual property"}</h3>
        <p>
          {es
            ? "Los textos, dibujos, mapas y el código de este sitio son propiedad de Drinks on Chain o de las bodegas asociadas. Queda prohibida su reproducción sin autorización escrita."
            : "The texts, drawings, maps and code of this site belong to Drinks on Chain or to the partner wineries. Reproduction without written permission is prohibited."}
        </p>
        <h3>{es ? "Datos personales" : "Personal data"}</h3>
        <p>
          {es
            ? "Este sitio no utiliza cookies de seguimiento. Solo recoge datos personales en el formulario de la lista de espera, con tu consentimiento y para escribirte sobre la preventa. Los formularios de las plataformas de Drinks on Chain informan de su tratamiento en cada caso."
            : "This site does not use tracking cookies. It collects personal data only in the waiting-list form, with your consent and to write to you about the pre-sale. Forms on the Drinks on Chain platforms disclose their processing case by case."}{" "}
          <Link href="/privacidad#lista-de-espera" className={styles.inlineLink}>
            {es ? "Privacidad" : "Privacy"}
          </Link>
        </p>
        <h3>{es ? "Consumo responsable" : "Responsible drinking"}</h3>
        <p>
          {es
            ? "El consumo excesivo de alcohol es perjudicial para la salud. Venta prohibida a menores de 18 años (Ley 259, Bolivia)."
            : "Excessive alcohol consumption is harmful to health. Not for sale to persons under 18 (Law 259, Bolivia)."}
        </p>
      </div>
    </PageShell>
  );
}
