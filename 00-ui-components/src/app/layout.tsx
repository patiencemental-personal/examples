import type { Metadata } from "next";
import "./globals.scss";
import Gnb from "./gnb";

export const metadata: Metadata = {
  title: "UI요소모음 | Sangwon",
  description: "Vanilla / React로 UI요소 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Gnb />
        <main>{children}</main>
      </body>
    </html>
  );
}
