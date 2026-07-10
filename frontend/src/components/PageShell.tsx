import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

type PageShellProps = {
  title: string;
  content: string;
};

export default function PageShell({ title, content }: PageShellProps) {
  useEffect(() => {
    document.title = title;
    window.scrollTo(0, 0);

    // The original template script must run after React has rendered
    // the page markup. Otherwise sliders/background images are not found.
    const oldScript = document.querySelector<HTMLScriptElement>(
      'script[data-learts-main="true"]',
    );
    oldScript?.remove();

    const script = document.createElement("script");
    script.src = `/assets/js/main.js?v=${Date.now()}`;
    script.async = false;
    script.dataset.leartsMain = "true";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [title, content]);

  return (
    <>
      <Header />
      <main dangerouslySetInnerHTML={{ __html: content }} />
      <Footer />
    </>
  );
}
