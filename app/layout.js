import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



export const metadata = {
  title: "Pulse Price",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"    >
      <body>{children}
        <Toaster richColors/>
      </body>
    </html>
  );
}


