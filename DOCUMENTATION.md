# Documentación de la Aplicación: FoodFast 🍔

## 1. Descripción de la App
**FoodFast** es una plataforma premium de entrega de comida a domicilio diseñada para ofrecer una experiencia rápida, fluida y visualmente atractiva. La aplicación permite a los usuarios explorar restaurantes locales, gestionar sus platillos favoritos y realizar pedidos con seguimiento en tiempo real, todo bajo una estética moderna de "Glassmorphism" y modo oscuro.

## 2. Tecnologías Usadas
La aplicación utiliza un stack tecnológico moderno y escalable:

*   **Frontend**: React Native (Expo SDK 51) con soporte para iOS, Android y Web.
*   **Lenguaje**: TypeScript para un desarrollo robusto y tipado.
*   **Backend**: Supabase (PostgreSQL, Auth, Realtime).
*   **Estilos**: Vanilla CSS / React Native StyleSheet con diseño enfocado en micro-interacciones.
*   **Navegación**: React Navigation (Stack y Bottom Tabs).
*   **Iconografía**: Lucide React Native.
*   **Animaciones**: React Native Reanimated y Animated API nativa.

## 3. Funcionamiento de la App
El flujo de la aplicación está diseñado para ser intuitivo:

1.  **Autenticación**: El usuario puede entrar mediante correo tradicional o de forma instantánea usando **Google Auth**, lo cual rellena automáticamente su perfil.
2.  **Exploración**: Pantalla de inicio con Hero animado, categorías de comida y una sección dedicada de "Mis Favoritos".
3.  **Gestión de Ubicación**: Un selector de direcciones premium que permite alternar entre ubicaciones guardadas o buscar nuevas.
4.  **Selección y Compra**: Detalle de restaurantes con menú interactivo y un carrito de compras dinámico que calcula costos de envío.
5.  **Seguimiento**: Tras realizar el pedido, el usuario accede a una pantalla de **Seguimiento en Tiempo Real** con un mapa simulado y estados de progreso.
6.  **Perfil**: Gestión de datos personales, edición de nombre/teléfono y visualización de estadísticas reales de pedidos.

## 4. Problemas Encontrados y Soluciones

### A. Conflicto de Dependencias (Reanimated)
*   **Problema**: Al desplegar en Vercel, el build fallaba debido a una incompatibilidad entre `react-native-reanimated` v4.x y Expo SDK 51.
*   **Solución**: Se identificaron las versiones compatibles exactas en el `package.json` y se bajó la versión de Reanimated a `~3.10.1` y Gesture Handler a `~2.16.1`, resolviendo el conflicto de peer-dependencies.

### B. Error de Intercambio de Código (Google Auth)
*   **Problema**: Supabase devolvía un error `Unable to exchange external code` tras intentar loguearse con Google.
*   **Solución**: Se verificaron los Authorized Redirect URIs en Google Cloud Console para que coincidieran exactamente con el callback de Supabase. También se configuró el usuario de prueba (Test User) en la pantalla de consentimiento de OAuth.

### C. Error de Conexión en Redirección (Localhost:3000)
*   **Problema**: Tras el login exitoso, la app redirigía a un puerto incorrecto (3000) mostrando `ERR_CONNECTION_REFUSED`.
*   **Solución**: Se actualizó la **Site URL** en la configuración de Autenticación de Supabase para que apuntara al puerto correcto de Expo (`8081`) o a la URL de producción en Vercel.

### D. Sincronización de Perfiles
*   **Problema**: Los datos de Google (nombre y foto) no se guardaban automáticamente en la base de datos local.
*   **Solución**: Se implementó un **Trigger SQL** y una función en Supabase que intercepta la creación de nuevos usuarios y sincroniza su metadata con la tabla `profiles`.

## 5. Capturas de Pantalla
*(Se recomienda incluir capturas de las siguientes secciones)*:
1.  **AuthScreen**: Login con Google.
2.  **HomeScreen**: Hero y sección de Favoritos.
3.  **AddressModal**: Selector de direcciones.
4.  **OrderTracking**: Seguimiento del repartidor.
5.  **ProfileScreen**: Perfil editado con estadísticas reales.

---
**Desarrollado por**: Antigravity AI & MarceloR1
**Versión**: 1.0.0
