import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const title = "Secret Sauce — find the thing that makes you valuable";
const description =
  "Eleven questions, under five minutes, no signup. Find the specific thing that makes you not just unique but valuable — and what to do with it this week.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Secret Sauce",
  authors: [{ name: "Secret Sauce" }],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Secret Sauce",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09080e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable}`}>
      <body>
        <div className="atmosphere" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
