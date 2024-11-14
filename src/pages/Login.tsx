import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export default function Login() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        
        if (event === 'SIGNED_IN' && currentSession) {
          toast.success('Login realizado com sucesso!');
          navigate("/");
        }
        if (event === 'SIGNED_OUT') {
          navigate("/login");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (session) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Bem-vindo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para continuar
          </p>
        </div>
        <div className="mt-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6366f1',
                    brandAccent: '#4f46e5',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Entrar",
                  loading_button_label: "Entrando...",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Senha",
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}