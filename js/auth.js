// Protección básica de la página: requiere una sesión de Supabase Auth.
(async () => {
  const client = window.supabaseClient;
  if (!client) {
    window.location.replace("index.html");
    return;
  }

  const { data, error } = await client.auth.getSession();
  if (error || !data.session) {
    window.location.replace("index.html");
    return;
  }

  const usuario = document.getElementById("usuarioSesion");
  if (usuario) usuario.textContent = data.session.user.email || "Sesión iniciada";

  const boton = document.getElementById("btnCerrarSesion");
  if (boton) {
    boton.addEventListener("click", async () => {
      boton.disabled = true;
      const { error: errorSalida } = await client.auth.signOut();
      if (errorSalida) {
        console.error("No se pudo cerrar sesión:", errorSalida);
        boton.disabled = false;
        alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        return;
      }
      window.location.replace("index.html");
    });
  }

  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      window.location.replace("index.html");
    }
  });
})();
