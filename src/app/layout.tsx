import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Кроссворд по ИТ-аутсорсингу",
  description:
    "Интерактивный кроссворд по темам лабораторных работ по ИТ-аутсорсингу и системной интеграции.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
