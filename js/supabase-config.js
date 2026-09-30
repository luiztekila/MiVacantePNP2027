/*
  CONFIGURACIÓN DE SUPABASE
  Reemplaza los dos valores por los de:
  Supabase Dashboard > Project Settings > API
  Usa Project URL y la clave publicable/anon (NUNCA service_role).
*/
const SUPABASE_URL = "https://grihgerwujhshpidnzrs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ffzwIQAO7hdJJCfiMyw8HA_5bkUi29y";

if (!window.supabase) {
  console.error("No se pudo cargar la biblioteca de Supabase.");
} else if (
  SUPABASE_URL === "https://grihgerwujhshpidnzrs.supabase.co" ||
  SUPABASE_ANON_KEY === "sb_publishable_ffzwIQAO7hdJJCfiMyw8HA_5bkUi29yY"
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
