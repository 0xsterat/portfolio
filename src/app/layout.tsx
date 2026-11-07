import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl, persona, site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${persona.name} — ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: {
    types: {
      "application/rss+xml": `${getSiteUrl()}/feed.xml`,
    },
  },
  openGraph: {
    title: persona.name,
    description: site.description,
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary",
    title: persona.name,
    description: site.description,
  },
};

// Inline flash-free theme script (next-themes anti-flicker pattern).
// It MUST run before first paint so light/dark is correct on load.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.classList.toggle('dark',t==='dark');if(t==='dark'){document.documentElement.style.colorScheme='dark'}else{document.documentElement.style.colorScheme='light'}}else{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}}catch(e){document.documentElement.classList.add('dark')}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
