/*
  CONFIGURACIÓN DE SUPABASE
  Reemplaza los dos valores por los de:
  Supabase Dashboard > Project Settings > API
  Usa Project URL y la clave publicable/anon (NUNCA service_role).
*/
const SUPABASE_URL = "grihgerwujhshpidnzrs";
const SUPABASE_ANON_KEY = "sb_secret_gomgU9c0GVn1KZyfRywU7A_AjrYp6Ub";

if (!window.supabase) {
  console.error("No se pudo cargar la biblioteca de Supabase.");
} else if (
  SUPABASE_URL === "grihgerwujhshpidnzrs" ||
  SUPABASE_ANON_KEY === "sb_secret_gomgU9c0GVn1KZyfRywU7A_AjrYp6Ub"
) {
  console.warn(
    "Falta configurar SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase-config.js.",
  );
}

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
