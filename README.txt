SIMULADOR PNP + LOGIN CON SUPABASE AUTH
========================================

ARCHIVOS IMPORTANTES
- index.html: página inicial de inicio de sesión.
- principal.html: simulador de preguntas protegido por sesión.
- js/supabase-config.js: configuración de Supabase.
- js/login.js: inicio de sesión.
- js/auth.js: verificación de sesión y cierre de sesión.
- js/app.js y js/bancos.js: lógica y bancos de preguntas originales.

PASO 1. CONFIGURAR SUPABASE
1. Abre Supabase Dashboard y selecciona tu proyecto.
2. Ve a Project Settings > API (la ubicación exacta puede variar según la versión del panel).
3. Copia el Project URL y la clave pública/publishable o anon.
4. Abre js/supabase-config.js y reemplaza:
   PEGA_AQUI_TU_PROJECT_URL
   PEGA_AQUI_TU_PUBLISHABLE_O_ANON_KEY
5. No uses nunca la clave service_role en el navegador.

PASO 2. CREAR USUARIOS
El código usa Supabase Auth con correo electrónico y contraseña.
En Supabase Dashboard, abre Authentication > Users y crea/invita a tus estudiantes.
Si los usuarios ya están registrados en una tabla personalizada y no en Supabase Auth,
este código no podrá validar esas contraseñas directamente; en ese caso hay que revisar
la estructura de esa tabla y diseñar una autenticación segura del lado del servidor.

PASO 3. PROBAR
Debes ejecutar el proyecto desde un servidor local o desde tu alojamiento web con HTTPS.
No se recomienda probar autenticación alojada abriendo el archivo file:// directamente.
Por ejemplo, en Visual Studio Code puedes usar la extensión Live Server.

PASO 4. PUBLICAR
Sube todos los archivos manteniendo las carpetas. La página de inicio es index.html.
La URL de redirección después de iniciar sesión es principal.html.
Configura también las URL de tu sitio en los ajustes de autenticación de Supabase.

SEGURIDAD
- Solo se utiliza la clave pública/publishable o anon en el navegador.
- No publiques claves service_role ni contraseñas.
- La comprobación de sesión en principal.html mejora el control de acceso de la interfaz,
  pero no sustituye las políticas RLS de Supabase para proteger datos.
- Los archivos HTML estáticos pueden inspeccionarse; los bancos incluidos en bancos.js
  no son privados. Si necesitas impedir que se descarguen las preguntas, deben servirse
  desde una fuente protegida con autorización del lado del servidor.
