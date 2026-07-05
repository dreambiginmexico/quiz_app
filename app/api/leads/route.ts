import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  timeline?: string;
  match?: string;
  answers?: number[];
  source?: string;
};

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

  return NextResponse.json({ ok: true });
}
