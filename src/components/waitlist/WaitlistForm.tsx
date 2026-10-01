"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/links";
import type { Lang } from "@/lib/scene-contract";
import {
  CITY_MAX,
  EMAIL_MAX,
  EMAIL_RE,
  INTERESTS,
  NAME_MAX,
  NAME_MIN,
  PHONE_MAX,
  PHONE_RE,
  joinWaitlist,
  type Interest,
} from "@/lib/waitlist";
import { currentSource } from "@/lib/waitlist-source";
import { WaitlistShare } from "./WaitlistShare";
import styles from "./Waitlist.module.css";

/** Fields of `POST /v1/public/waitlist` that the form shows, in display order. */
const FIELDS = ["fullName", "email", "phone", "city", "interest", "isAdult", "consent"] as const;
type Field = (typeof FIELDS)[number];
type Errors = Partial<Record<Field, string>>;

const COPY = {
  es: {
    title: "Apúntate",
    fullName: "Nombre y apellido",
    email: "Correo",
    phone: "WhatsApp",
    city: "Ciudad",
    optional: "opcional",
    phoneHint: "Con el código de tu país, por ejemplo +591 70000000.",
    interest: "¿Qué te interesa?",
    interests: { WINE: "Vino", SINGANI: "Singani", BOTH: "Ambos" } satisfies Record<Interest, string>,
    isAdult: "Soy mayor de 18 años.",
    consent: "Acepto que Drinks on Chain me escriba sobre la preventa.",
    privacy: "Usamos tus datos solo para eso: no los vendemos ni los usamos para publicidad, y puedes pedir que los borremos.",
    privacyLink: "Privacidad",
    newTab: "(se abre en otra pestaña)",
    submit: "Unirme a la lista",
    sending: "Enviando…",
    sendingStatus: "Enviando tu inscripción…",
    hint: "No es una compra ni un compromiso: solo te avisamos.",
    notReady: "Todavía no podemos recibir inscripciones desde este sitio. Escríbenos y te apuntamos nosotros:",
    errors: {
      required: "Este campo es obligatorio.",
      name: "Escribe tu nombre y apellido.",
      email: "Escribe un correo válido, por ejemplo nombre@correo.com.",
      phone: "Escribe un número válido (de 7 a 20 caracteres: dígitos, espacios, + - y paréntesis) o deja el campo vacío.",
      interest: "Elige una opción.",
      isAdult: "La lista es solo para mayores de 18 años.",
      consent: "Necesitamos tu conformidad para escribirte.",
      server: "Revisa este dato.",
      summary: "Revisa los campos marcados.",
      rateLimited: (wait: string | null) =>
        `Hay muchas inscripciones desde esta conexión. Vuelve a intentarlo ${wait ? `en ${wait}` : "en unos minutos"}; tus datos siguen en el formulario.`,
      network: "No pudimos conectar. Revisa tu conexión y vuelve a intentarlo; tus datos siguen en el formulario.",
      unavailable: "Ahora mismo no podemos recibir inscripciones. Vuelve a intentarlo en unos minutos o escríbenos a",
      generic: "No pudimos apuntarte. Vuelve a intentarlo en unos minutos o escríbenos a",
    },
    seconds: (n: number) => (n === 1 ? "1 segundo" : `${n} segundos`),
    minutes: (n: number) => (n === 1 ? "1 minuto" : `${n} minutos`),
    doneTitle: "Estás en la lista",
    doneNumber: "Tu número de orden",
    numberPrefix: "N.º",
    doneNext: "Qué pasa ahora",
    done: (phone: boolean) =>
      `Te escribiremos antes de abrir la preventa, al correo${phone ? " o al WhatsApp" : ""} que dejaste. No enviamos un correo de confirmación: esta pantalla es tu comprobante.`,
    again: "Apuntar a otra persona",
  },
  en: {
    title: "Sign up",
    fullName: "Full name",
    email: "Email",
    phone: "WhatsApp",
    city: "City",
    optional: "optional",
    phoneHint: "With your country code, for example +591 70000000.",
    interest: "What are you interested in?",
    interests: { WINE: "Wine", SINGANI: "Singani", BOTH: "Both" } satisfies Record<Interest, string>,
    isAdult: "I am over 18.",
    consent: "I agree that Drinks on Chain writes to me about the pre-sale.",
    privacy: "We use your data only for that: we do not sell it or use it for advertising, and you can ask us to delete it.",
    privacyLink: "Privacy",
    newTab: "(opens in a new tab)",
    submit: "Join the list",
    sending: "Sending…",
    sendingStatus: "Sending your sign-up…",
    hint: "It is not a purchase or a commitment: we just let you know.",
    notReady: "We cannot take sign-ups from this site yet. Write to us and we will add you ourselves:",
    errors: {
      required: "This field is required.",
      name: "Enter your full name.",
      email: "Enter a valid email, for example name@mail.com.",
      phone: "Enter a valid number (7 to 20 characters: digits, spaces, + - and brackets) or leave the field empty.",
      interest: "Choose an option.",
      isAdult: "The list is only for people over 18.",
      consent: "We need your consent to write to you.",
      server: "Check this field.",
      summary: "Check the highlighted fields.",
      rateLimited: (wait: string | null) =>
        `Too many sign-ups from this connection. Try again ${wait ? `in ${wait}` : "in a few minutes"}; your data is still in the form.`,
      network: "We could not connect. Check your connection and try again; your data is still in the form.",
      unavailable: "We cannot take sign-ups right now. Try again in a few minutes or write to us at",
      generic: "We could not add you. Try again in a few minutes or write to us at",
    },
    seconds: (n: number) => (n === 1 ? "1 second" : `${n} seconds`),
    minutes: (n: number) => (n === 1 ? "1 minute" : `${n} minutes`),
    doneTitle: "You are on the list",
    doneNumber: "Your place in line",
    numberPrefix: "No.",
    doneNext: "What happens next",
    done: (phone: boolean) =>
      `We will write to you before the pre-sale opens, at the email${phone ? " or the WhatsApp number" : ""} you gave us. We send no confirmation email: this screen is your receipt.`,
    again: "Sign up someone else",
  },
} as const;

type Copy = (typeof COPY)[Lang];

const waitText = (c: Copy, seconds: number | null) =>
  seconds === null ? null : seconds < 60 ? c.seconds(Math.max(1, seconds)) : c.minutes(Math.ceil(seconds / 60));

/** Field of a server detail (`details[].field`), or null when it is not one of the form's. */
const asField = (f: string | null): Field | null => (f && (FIELDS as readonly string[]).includes(f) ? (f as Field) : null);

const without = (errors: Errors, f: Field): Errors => {
  if (!errors[f]) return errors;
  const next = { ...errors };
  delete next[f];
  return next;
};

/** A message under the form: plain text, optionally closed by the contact address. */
type Status = { text: string; mail?: boolean } | null;

interface WaitlistFormProps {
  lang: Lang;
  /** False when the site has no API behind `/api/v1` (`API_ORIGIN` unset): the form says so instead of failing. */
  apiReady: boolean;
  /** id of the heading of the panel: "Apúntate", then "Estás en la lista". */
  titleId: string;
}

/**
 * Consumer waiting list (contract `o1b-lista-de-espera`). Sends `POST /api/v1/public/waitlist`
 * (rewritten to the API by `src/proxy.ts`) with `type: "CONSUMER"`, the active language, the origin
 * of the visit (`?src=`) and the `website` honeypot. Built for a phone held in one hand at an
 * event: one column, large targets, the right keyboards, and every error next to its field.
 */
export function WaitlistForm({ lang, apiReady, titleId }: WaitlistFormProps) {
  const c = COPY[lang];
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ position: number; phone: boolean } | null>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  useEffect(() => {
    if (sent) doneHeading.current?.focus();
  }, [sent]);

  const focusField = (f: Field) => formRef.current?.querySelector<HTMLElement>(`[name="${f}"]`)?.focus();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || !apiReady) return;
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const fullName = get("fullName");
    const email = get("email");
    const phone = get("phone");
    const city = get("city");
    const interest = INTERESTS.find((i) => i === get("interest"));

    const next: Errors = {};
    if (!fullName) next.fullName = c.errors.required;
    else if (fullName.length < NAME_MIN) next.fullName = c.errors.name;
    if (!email) next.email = c.errors.required;
    else if (!EMAIL_RE.test(email)) next.email = c.errors.email;
    if (phone && !PHONE_RE.test(phone)) next.phone = c.errors.phone;
    if (!interest) next.interest = c.errors.interest;
    if (!data.get("isAdult")) next.isAdult = c.errors.isAdult;
    if (!data.get("consent")) next.consent = c.errors.consent;
    setErrors(next);
    const first = FIELDS.find((f) => next[f]);
    if (first || !interest) {
      setStatus({ text: c.errors.summary });
      if (first) focusField(first);
      return;
    }

    setSending(true);
    setStatus({ text: c.sendingStatus });
    const res = await joinWaitlist({
      fullName,
      email,
      phone,
      city,
      interest,
      locale: lang,
      source: currentSource(),
      website: String(data.get("website") ?? ""),
    });
    setSending(false);

    if (res.ok) {
      const position = res.data?.position;
      if (typeof position === "number" && Number.isFinite(position)) {
        setStatus(null);
        setSent({ position, phone: phone !== "" });
        return;
      }
      // A 2xx that is not the API's answer: do not show a number that does not exist.
      setStatus({ text: c.errors.generic, mail: true });
      return;
    }
    switch (res.kind) {
      case "validation": {
        const fromServer: Errors = {};
        const loose: string[] = [];
        for (const d of res.details) {
          const f = asField(d.field);
          if (!f) {
            if (d.message) loose.push(d.message);
            continue;
          }
          if (fromServer[f]) continue;
          // The API writes its messages in Spanish.
          fromServer[f] = lang === "es" && d.message ? d.message : c.errors.server;
        }
        setErrors(fromServer);
        const firstServer = FIELDS.find((f) => fromServer[f]);
        setStatus({ text: [c.errors.summary, ...(lang === "es" ? loose : [])].join(" ") });
        if (firstServer) focusField(firstServer);
        return;
      }
      case "rate-limited":
        setStatus({ text: c.errors.rateLimited(waitText(c, res.retryAfter)) });
        return;
      case "network":
        setStatus({ text: c.errors.network });
        return;
      case "unavailable":
        setStatus({ text: c.errors.unavailable, mail: true });
        return;
      default:
        setStatus({ text: c.errors.generic, mail: true });
    }
  };

  const clearError = (target: EventTarget) => {
    const name = (target as HTMLInputElement).name as Field;
    if (name && errors[name]) setErrors((prev) => without(prev, name));
  };

  const mail = (
    <a href={`mailto:${CONTACT_EMAIL}`} className={styles.mail}>
      {CONTACT_EMAIL}
    </a>
  );

  if (sent) {
    return (
      <div className={styles.done}>
        {/* the heading takes focus, so the result is announced and the keyboard continues from here */}
        <h2 id={titleId} ref={doneHeading} tabIndex={-1} className={styles.doneTitle}>
          {c.doneTitle}
        </h2>
        <p className={styles.doneNumber}>
          <span className={styles.doneNumberLabel}>{c.doneNumber}</span>
          <strong data-testid="waitlist-position">
            <span className={styles.doneNumberPrefix}>{c.numberPrefix}</span> {sent.position.toLocaleString(lang === "es" ? "es-BO" : "en-US")}
          </strong>
        </p>
        <p className={styles.doneLabel}>{c.doneNext}</p>
        <p className={styles.doneText}>{c.done(sent.phone)}</p>
        <WaitlistShare lang={lang} />
        <p className={styles.doneAgain}>
          <button
            type="button"
            className={styles.quiet}
            onClick={() => {
              setSent(null);
              setErrors({});
            }}
          >
            {c.again}
          </button>
        </p>
      </div>
    );
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${id}-${f}-err`} className={styles.error}>
        {errors[f]}
      </p>
    ) : null;
  /** ids of the texts that describe a field: its hint (when it has one) and its error. */
  const describedBy = (f: Field, hint = false) => [hint ? `${id}-${f}-hint` : null, errors[f] ? `${id}-${f}-err` : null].filter(Boolean).join(" ") || undefined;
  const aria = (f: Field, hint = false) => ({ "aria-invalid": errors[f] ? true : undefined, "aria-describedby": describedBy(f, hint) });

  const input = (f: "fullName" | "email" | "phone" | "city", props: InputHTMLAttributes<HTMLInputElement>, hint?: string) => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`${id}-${f}`}>
        {c[f]}
        {props.required ? null : <span className={styles.optional}> ({c.optional})</span>}
      </label>
      <input id={`${id}-${f}`} name={f} className={styles.input} {...props} {...aria(f, !!hint)} />
      {hint ? (
        <p id={`${id}-${f}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {err(f)}
    </div>
  );

  const check = (f: "isAdult" | "consent", children: ReactNode) => (
    <div className={styles.field}>
      <label className={styles.check}>
        <input type="checkbox" name={f} required {...aria(f)} />
        <span>{children}</span>
      </label>
      {err(f)}
    </div>
  );

  return (
    <>
      <h2 id={titleId} className={styles.panelTitle}>
        {c.title}
      </h2>
      {!apiReady ? (
        <p className={styles.notice} id={`${id}-not-ready`}>
          {c.notReady} {mail}
        </p>
      ) : null}
      <form
        ref={formRef}
        className={styles.form}
        onSubmit={onSubmit}
        onInput={(e) => clearError(e.target)}
        onChange={(e) => clearError(e.target)}
        noValidate
        aria-describedby={!apiReady ? `${id}-not-ready` : undefined}
      >
        {input("fullName", { type: "text", autoComplete: "name", autoCapitalize: "words", required: true, maxLength: NAME_MAX, enterKeyHint: "next" })}
        {input("email", { type: "email", inputMode: "email", autoComplete: "email", autoCapitalize: "none", spellCheck: false, required: true, maxLength: EMAIL_MAX, enterKeyHint: "next" })}
        {input("phone", { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: PHONE_MAX, enterKeyHint: "next" }, c.phoneHint)}
        {input("city", { type: "text", autoComplete: "address-level2", autoCapitalize: "words", maxLength: CITY_MAX, enterKeyHint: "done" })}

        <fieldset
          className={styles.choice}
          role="radiogroup"
          aria-required="true"
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? `${id}-interest-err` : undefined}
        >
          <legend className={styles.label}>{c.interest}</legend>
          <div className={styles.options}>
            {INTERESTS.map((k) => (
              <label key={k} className={styles.option}>
                <input type="radio" name="interest" value={k} />
                <span>{c.interests[k]}</span>
              </label>
            ))}
          </div>
          {err("interest")}
        </fieldset>

        {check("isAdult", c.isAdult)}
        {check(
          "consent",
          <>
            {c.consent} <span className={styles.privacy}>{c.privacy}</span>{" "}
            {/* another tab: opening it must not throw away what is already typed */}
            <a href="/privacidad#lista-de-espera" target="_blank" rel="noopener" className={styles.privacyLink}>
              {c.privacyLink}
              <span className="sr-only"> {c.newTab}</span>
            </a>
          </>,
        )}

        {/* Honeypot: out of sight, out of the tab order and hidden from assistive tech. */}
        <div className={styles.trap} aria-hidden="true">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div className={styles.foot}>
          <button type="submit" className={styles.submit} disabled={!apiReady} aria-disabled={sending || undefined}>
            {sending ? c.sending : c.submit}
          </button>
          <p className={styles.hint}>{c.hint}</p>
        </div>
        <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
          {status ? (
            <>
              {status.text}
              {status.mail ? <> {mail}.</> : null}
            </>
          ) : null}
        </p>
      </form>
    </>
  );
}
