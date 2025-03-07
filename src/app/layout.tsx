"use client";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19'; 

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
