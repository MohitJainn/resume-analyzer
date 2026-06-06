import "./globals.css";
import Providers from "./provider";

export default function RootLayout({
  children,
}){
  return(
    <html>
      <body>
        <Providers>
{children}
        </Providers>
      </body>
    </html>
  );
}