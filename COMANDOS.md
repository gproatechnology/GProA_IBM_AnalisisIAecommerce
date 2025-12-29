# Comandos Principales del Proyecto GProA IBM Análisis IA eCommerce

Este documento contiene los comandos esenciales para trabajar con el proyecto, incluyendo desarrollo local, construcción, commit y despliegue.

## 1. Configuración Inicial
Antes de empezar, asegúrate de tener Node.js instalado (versión 16 o superior).

```bash
# Instalar dependencias
npm install
```

## 2. Desarrollo Local
Para ejecutar el proyecto en un servidor local con hot reload:

```bash
# Iniciar servidor de desarrollo
npm run dev
```

- Abre `http://localhost:5173` en tu navegador.
- Los cambios en archivos HTML, CSS, JS se reflejan automáticamente.
- Presiona `Ctrl+C` para detener el servidor.

## 3. Construcción para Producción
Para generar los archivos optimizados para despliegue:

```bash
# Construir el proyecto
npm run build
```

- Los archivos se generan en la carpeta `dist/`.
- Esta carpeta contiene todo lo necesario para el despliegue web.

## 4. Probar las Demos Antes de Commit
Antes de hacer commit, verifica que todo funcione:

```bash
# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Ejecutar en desarrollo
npm run dev
# Abrir http://localhost:5173 para ver la landing page
# Abrir http://localhost:5173/analytics.html para ver el dashboard

# 3. Probar funcionalidades:
# - Navegar por secciones
# - Ver animaciones de scroll
# - Probar botones CTA
# - En analytics.html: Ver gráficos, resetear métricas

# 4. Construir y probar build
npm run build
# Abrir dist/index.html en navegador para verificar producción
```

## 5. Control de Versiones (Git)
Para hacer commit y push al repositorio remoto:

```bash
# Ver estado de archivos
git status

# Agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Descripción de los cambios realizados"

# Si es el primer push, agregar remote
git remote add origin https://github.com/gproatechnology/GProA_IBM_AnalisisIAecommerce.git

# Push a la rama main
git push -u origin main
```

## 6. Despliegue en GitHub Pages
Después de hacer push:

1. Ve al repositorio en GitHub.
2. Ve a Settings > Pages.
3. Selecciona la rama `main` como source.
4. Elige la carpeta `/dist` como directorio.
5. Guarda los cambios.
6. El sitio estará disponible en: `https://gproatechnology.github.io/GProA_IBM_AnalisisIAecommerce/`

## 7. Comandos Adicionales Útiles

```bash
# Ver logs de Git
git log --oneline

# Crear nueva rama
git checkout -b nueva-rama

# Ver diferencias
git diff

# Resetear cambios no commited
git checkout -- .

# Ver remotes
git remote -v
```

## 8. Solución de Problemas Comunes

- **Error de dependencias**: Ejecuta `npm install` nuevamente.
- **Puerto ocupado**: El servidor usa el puerto 5173 por defecto. Si está ocupado, Vite asignará otro automáticamente.
- **Build falla**: Verifica que todos los archivos estén en sus ubicaciones correctas y que no haya errores de sintaxis.
- **GitHub Pages no actualiza**: Espera 1-2 minutos después del push, o verifica que la carpeta `dist/` esté incluida en el commit.

## Notas Importantes
- Siempre ejecuta `npm run build` antes de desplegar para asegurar que los archivos estén optimizados.
- Las métricas de analytics se almacenan localmente en el navegador; para demo, usa el botón "Resetear Métricas" en analytics.html.
- El proyecto usa TensorFlow.js para análisis IA; requiere conexión a internet para cargar las librerías.