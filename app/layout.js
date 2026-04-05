import "./globals.css";



export const metadata = {
  title: "Pulse Price",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"    >
      <body>{children}</body>
    </html>
  );
}


