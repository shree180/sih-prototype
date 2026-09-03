import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DisasterDamage.AI",
  description: "Privacy-conscious, AI-assisted disaster damage assessment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
