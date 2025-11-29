import type { ReactNode } from "react";
import "../src/index.css";
import "../src/styles/animations.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
