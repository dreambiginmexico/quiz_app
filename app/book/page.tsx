"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  country: string;
  timeline: string;
  maxBudget: string;
  message: string;
};

export default function BookPage() {
  const [form, setForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    country: "",
    timeline: "",
    maxBudget: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");
  const [requestType, setRequestType] = useState("");
  const isPropertyRequest = requestType === "properties";

  useEffect(() => {
    setRequestType(new URLSearchParams(window.location.search).get("request") ?? "");
  }, []);

  const updateField = (field: keyof BookingForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          match: isPropertyRequest ? "property-request" : "booking-request",
          source: isPropertyRequest ? "best-properties-request-page" : "book-fit-call-page"
        })
      });

      if (!response.ok) {
        throw new Error("Booking request failed");
      }

      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="contentPage">
      <section className="contentHero">
        <p className="eyebrow">Riviera Nayarit fit call</p>
        <h1>
          {isPropertyRequest
            ? "Receive 10 properties by email that are currently for sale that best match your criteria"
            : "Book a quick call about your best-fit area."}
        </h1>
        <p>
          Share where you are in the buying process and what you are trying to figure out.
          {isPropertyRequest ? " Include your maximum budget so the property shortlist fits your range." : ""}
        </p>
      </section>

      {status === "sent" ? (
        <section className="leadForm">
          <h2>Request sent</h2>
          <p>Thanks. Your fit-call request was submitted.</p>
          <Link className="primaryLink" href="/">
            Back to the quiz
          </Link>
        </section>
      ) : (
        <form className="leadForm" onSubmit={submitBooking}>
          <div className="formGrid">
            <label>
              Name
              <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} />
            </label>
            <label>
              Email
              <input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
            </label>
            <label>
              Country
              <select required value={form.country} onChange={(event) => updateField("country", event.target.value)}>
                <option value="">Select one</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="wideField">
              Buying timeline
              <select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value)}>
                <option value="">Select one</option>
                <option value="0-3 months">0-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="Just researching">Just researching</option>
              </select>
            </label>
            {isPropertyRequest ? (
              <label className="wideField">
                Maximum Budget (USD)
                <input
                  inputMode="numeric"
                  min="0"
                  required
                  type="number"
                  value={form.maxBudget}
                  onChange={(event) => updateField("maxBudget", event.target.value)}
                />
              </label>
            ) : null}
            <label className="wideField">
              What do you want help with?
              <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} />
            </label>
          </div>

          <div className="buttonRow leadActions">
            <Link className="secondaryLink" href="/">
              Back to quiz
            </Link>
            <button className="primaryButton" disabled={status === "saving"} type="submit">
              {status === "saving" ? "Sending..." : isPropertyRequest ? "Request properties" : "Request fit call"}
            </button>
          </div>
          {status === "error" ? <p className="errorText">Something did not save. Try once more.</p> : null}
        </form>
      )}
    </main>
  );
}
