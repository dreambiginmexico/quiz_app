import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  timeline?: string;
  match?: string;
  answers?: number[];
  message?: string;
  source?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAnswers(answers?: number[]) {
  if (!answers?.length) return "No quiz answers included.";

  return answers.map((answer, index) => `Question ${index + 1}: option ${answer + 1}`).join("\n");
}

function buildLeadEmail(lead: LeadPayload & { submittedAt: string }) {
  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "Not provided"],
    ["Country", lead.country],
    ["Timeline", lead.timeline],
    ["Matched area", lead.match],
    ["Source", lead.source || "Not provided"],
    ["Submitted", lead.submittedAt]
  ];

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #ddd;font-weight:700;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  const messageBlock = lead.message
    ? `<h2 style="font-size:18px;margin-top:24px;">Message</h2><p style="white-space:pre-wrap;">${escapeHtml(lead.message)}</p>`
    : "";

  return {
    subject: `New Riviera Nayarit lead: ${lead.name} - ${lead.match}`,
    text: [
      "New Riviera Nayarit lead",
      "",
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || "Not provided"}`,
      `Country: ${lead.country}`,
      `Timeline: ${lead.timeline}`,
      `Matched area: ${lead.match}`,
      `Source: ${lead.source || "Not provided"}`,
      `Submitted: ${lead.submittedAt}`,
      lead.message ? `Message: ${lead.message}` : "",
      "",
      "Quiz answers:",
      formatAnswers(lead.answers)
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#17201c;">
        <h1 style="font-size:22px;">New Riviera Nayarit lead</h1>
        <table style="border-collapse:collapse;width:100%;max-width:680px;">${htmlRows}</table>
        ${messageBlock}
        <h2 style="font-size:18px;margin-top:24px;">Quiz answers</h2>
        <pre style="background:#f7f4ee;padding:14px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(formatAnswers(lead.answers))}</pre>
      </div>
    `
  };
}

async function sendLeadEmail(lead: LeadPayload & { submittedAt: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL || "jim@dreambiginmexico.com";
  const from = process.env.RESEND_FROM_EMAIL || "Riviera Nayarit Quiz <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("Lead email not sent because RESEND_API_KEY is missing.");
    return;
  }

  const email = buildLeadEmail(lead);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email,
      subject: email.subject,
      text: email.text,
      html: email.html
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${body}`);
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  if (!payload.name || !payload.email || !payload.country || !payload.timeline || !payload.match) {
    return NextResponse.json({ error: "Missing required lead fields" }, { status: 400 });
  }

  const lead = {
    ...payload,
    submittedAt: new Date().toISOString()
  };

  if (process.env.LEAD_WEBHOOK_URL) {
    const response = await fetch(process.env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` } : {})
      },
      body: JSON.stringify(lead)
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Lead webhook failed" }, { status: 502 });
    }
  } else {
    console.info("Lead captured without LEAD_WEBHOOK_URL", lead);
  }

  try {
    await sendLeadEmail(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lead email failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
