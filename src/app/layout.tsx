import type { Metadata } from "next";
import { Montserrat, Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-titulos",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-subtitulos",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const openSans = Open_Sans({
  variable: "--font-texto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Test de Temperamentos",
  description: "Descubre tu temperamento dominante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${poppins.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-texto">{children}</body>
    </html>
  );
}
