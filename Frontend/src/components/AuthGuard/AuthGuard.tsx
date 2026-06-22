import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import { me, type AuthUser } from "../../services/auth";
import { getSettings } from "../../services/settings";
import { applyTheme } from "../../lib/theme";
import { useLanguage } from "../../lib/LanguageContext";

type AuthGuardProps = {
  children: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { t, setLanguage } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await me();
        setUser(response.user);

        try {
          const settings = await getSettings();
          applyTheme(settings?.settings.theme ?? "light");
          if (settings?.settings.language) {
            setLanguage(settings.settings.language);
          }
        } catch (_settingsError) {
          // Keep current theme and language if settings cannot be loaded.
        }
      } catch (_error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLanguage]);

  if (isLoading) {
    return <div>{t("auth.checkingSession")}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
