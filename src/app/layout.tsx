import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{":root { --eq-body-width: 1152px; }"}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
