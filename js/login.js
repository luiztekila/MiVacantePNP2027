const formLogin = document.getElementById("formLogin");
const inputCorreo = document.getElementById("correo");
const inputContrasena = document.getElementById("contrasena");
const mensajeLogin = document.getElementById("mensajeLogin");
const btnIngresar = document.getElementById("btnIngresar");
const textoIngresar = document.getElementById("textoIngresar");
const btnMostrar = document.getElementById("btnMostrar");

function mostrarMensaje(texto, tipo = "error") {
  mensajeLogin.textContent = texto;
  mensajeLogin.className = `login-message ${tipo}`;
}

function limpiarMensaje() {
  mensajeLogin.textContent = "";
  mensajeLogin.className = "login-message oculto";
}

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limpiarMensaje();

  if (
    !window.supabaseClient ||
    SUPABASE_URL === "grihgerwujhshpidnzrs" ||
    SUPABASE_ANON_KEY === "sb_secret_gomgU9c0GVn1KZyfRywU7A_AjrYp6Ub"
  ) {
    mostrarMensaje(
      "Primero configura la URL y la clave pública de Supabase en js/supabase-config.js.",
    );
    return;
  }

  const email = inputCorreo.value.trim();
  const password = inputContrasena.value;

  btnIngresar.disabled = true;
  textoIngresar.textContent = "VALIDANDO...";

  try {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (error) throw error;
    if (!data.session)
      throw new Error("No se pudo iniciar la sesión. Inténtalo nuevamente.");

    window.location.replace("principal.html");
  } catch (error) {
    console.error("Error de autenticación:", error);
    mostrarMensaje(
      "No se pudo iniciar sesión. Verifica tu correo y contraseña.",
    );
    btnIngresar.disabled = false;
    textoIngresar.textContent = "INGRESAR";
  }
});

btnMostrar.addEventListener("click", () => {
  const visible = inputContrasena.type === "text";
  inputContrasena.type = visible ? "password" : "text";
  btnMostrar.textContent = visible ? "Mostrar" : "Ocultar";
  btnMostrar.setAttribute(
    "aria-label",
    visible ? "Mostrar contraseña" : "Ocultar contraseña",
  );
});

// Si ya existe una sesión válida, ir directamente al simulador.
(async () => {
  if (
    !window.supabaseClient ||
    SUPABASE_URL === "PEGA_AQUI_TU_PROJECT_URL" ||
    SUPABASE_ANON_KEY === "PEGA_AQUI_TU_PUBLISHABLE_O_ANON_KEY"
  )
    return;

  const { data } = await window.supabaseClient.auth.getSession();
  if (data.session) window.location.replace("principal.html");
})();
