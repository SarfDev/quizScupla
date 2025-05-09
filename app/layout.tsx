import { QuizProvider } from "../context/QuizContext";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Applicazione quiz con Next.js e TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <QuizProvider>
          <main className="min-h-screen bg-gray-100">{children}</main>
        </QuizProvider>
      </body>
    </html>
  );
}
