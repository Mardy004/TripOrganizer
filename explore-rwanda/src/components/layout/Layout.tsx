import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useI18n } from "../../context/I18nContext";
import { LoadingState } from "../common/StateViews";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { t } = useI18n();
  return (
    <>
      <a href="#main" className="skip-link">
        {t("nav.skip")}
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main" className="main">
        <Suspense
          fallback={
            <div className="container section">
              <LoadingState />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
