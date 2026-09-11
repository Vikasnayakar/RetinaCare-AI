import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "../context/theme-context";

export const metadata: Metadata = {
  title:
    "RetinaScreen | AI-Assisted Diabetic Retinopathy Screening",

  description:
    "AI-assisted diabetic retinopathy screening platform for accessible retinal screening and specialist referral.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}