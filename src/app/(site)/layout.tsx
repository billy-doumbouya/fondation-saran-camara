import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Chatbot from "@/components/chat/Chatbot";
import ContactFab from "@/components/chat/ContactFab";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Chatbot />
      <ContactFab />
    </>
  );
}
