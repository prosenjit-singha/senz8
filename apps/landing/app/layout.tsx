import localFont from "next/font/local";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";
import "@/styles/web.styles.css";

const futuraLTProBook = localFont({
  src: "../public/assets/fonts/FuturaLTProBook.otf",
  variable: "--font-futura-lt-pro-book",
});

const futuraLTProLight = localFont({
  src: "../public/assets/fonts/FuturaLTProLight.otf",
  variable: "--font-futura-lt-pro-light",
});

const walbaumPro = localFont({
  src: "../public/assets/fonts/Walbaum10Pro.woff2",
  variable: "--font-walbaum-pro",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${futuraLTProBook.variable} ${walbaumPro.variable} ${futuraLTProLight.variable} font-sans antialiased flex flex-col`}
      >
        <SmoothScrollProvider>
          <Providers>{children}</Providers>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
