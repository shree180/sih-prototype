import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const report = body["csp-report"];

    if (report) {
      console.warn("CSP Violation:", {
        "document-uri": report["document-uri"],
        referrer: report.referrer,
        "violated-directive": report["violated-directive"],
        "effective-directive": report["effective-directive"],
        "original-policy": report["original-policy"],
        "blocked-uri": report["blocked-uri"],
        "line-number": report["line-number"],
        "column-number": report["column-number"],
        "source-file": report["source-file"],
        "script-sample": report["script-sample"],
        "disposition": report.disposition,
      });
    }
  } catch (error) {
    console.error("Error parsing CSP report:", error);
  }

  // Always return 204 No Content for CSP reports
  return new NextResponse(null, { status: 204 });
}