# My Life - Portfolio Personal de Ana Manzanares

Este es un repositorio personal que almacena contenido de portfolio profesional, CV y proyectos creativos.

## 🎯 Propósito del Proyecto

Repositorio profesional para mantener y gestionar:
- Portfolio de proyectos creativos y profesionales
- CV/Curriculum actualizado
- GitHub Pages site con diseño elegante y minimalista
- Documentación personal y profesional
- Scripts de optimización para recursos (PDFs, imágenes)

## 📁 Estructura del Proyecto

```
my-life/
├── index.html              # GitHub Pages - Página principal del portfolio
├── style.css               # Estilos del sitio web
├── README.md               # Descripción del repositorio
├── auto-commit.sh          # Script de auto-commit y push
├── PORTFOLIO/              # Directorio con proyectos y documentos
│   ├── BOM PROJECT.pdf
│   ├── CURRICULUM ANA.pdf
│   ├── MAS CREATION RED.pdf
│   ├── optimize_*.sh       # Scripts de optimización de PDFs
│   ├── optimize_images.sh  # Script de optimización de imágenes
│   └── optimized/          # Directorio para archivos optimizados
├── .claude/                # Configuración de Claude Code
└── .git/hooks/pre-push     # Hook automático para commits antes de push
```

## 🛠️ Tecnologías y Herramientas

- **Frontend**: HTML5, CSS3
- **Fuentes**: Google Fonts (Montserrat)
- **Hosting**: GitHub Pages
- **Optimización**: Shell scripts, Python, Ghostscript, ImageMagick
- **Control de versiones**: Git

## 🎨 Estilo y Diseño

- **Diseño**: Minimalista, elegante, profesional
- **Paleta**: Tonos neutros con acentos sutiles
- **Tipografía**: Montserrat (sans-serif moderna)
- **Responsive**: Adaptable a todos los dispositivos
- **Idioma**: Español

## 📝 Convenciones de Código

### HTML
- Usar HTML5 semántico
- Estructura clara con secciones bien definidas
- Accesibilidad: usar atributos alt, roles ARIA cuando sea necesario
- Indentación: 4 espacios

### CSS
- Usar clases descriptivas en español o inglés
- Mobile-first approach
- Variables CSS para colores y espaciado cuando sea posible
- Comentarios para secciones importantes
- Indentación: 4 espacios

### Scripts (Bash/Python)
- Siempre incluir shebang (#!/bin/bash, #!/usr/bin/env python3)
- Comentarios descriptivos
- Manejo de errores robusto
- Mensajes informativos para el usuario
- Permisos de ejecución (+x) para scripts bash

## 🔄 Flujos de Trabajo Comunes

### 🤖 Auto-Commit (NUEVO)
El repositorio incluye un sistema de automatización de commits:

**Script Manual** - `./auto-commit.sh`
```bash
# Commit automático con mensaje personalizado
./auto-commit.sh "Tu mensaje aquí"

# Commit automático con mensaje generado
./auto-commit.sh

# El script te preguntará si quieres hacer push a GitHub
```

**Git Hook Pre-Push** - `.git/hooks/pre-push`
- Se ejecuta automáticamente antes de cada `git push`
- Detecta cambios sin commitear (modificados, nuevos, eliminados)
- Crea un commit automático si hay cambios pendientes
- Permite que el push continúe normalmente

**Características:**
- ✅ Detecta archivos modificados, nuevos y eliminados
- ✅ Genera mensajes de commit descriptivos
- ✅ Incluye colores en la salida para mejor legibilidad
- ✅ Pregunta confirmación antes de hacer push (en script manual)
- ✅ Hook automático asegura que no se olviden cambios

### Optimización de PDFs
Los scripts en PORTFOLIO/ permiten optimizar PDFs de diferentes maneras:
- `optimize_pdfs.sh` - Optimización básica
- `optimize_with_gs.sh` - Usando Ghostscript
- `optimize_with_preview.sh` - Usando Preview de macOS
- `optimize_native.sh` - Métodos nativos de macOS
- `optimize_simple.sh` - Método simple y rápido
- `optimize_pdfs.py` - Script Python para optimización

### Optimización de Imágenes
- `optimize_images.sh` - Optimiza imágenes para web

### Actualizar Portfolio
1. Agregar nuevos PDFs a PORTFOLIO/
2. Optimizar si es necesario con los scripts disponibles
3. Actualizar index.html con referencias a nuevos proyectos
4. Usar `./auto-commit.sh` para commit y push automático
5. GitHub Pages se actualiza automáticamente

### Git Workflow
- Branch principal: `main`
- Commits descriptivos en español
- Push a GitHub actualiza automáticamente GitHub Pages
- **NUEVO**: Hook pre-push hace commit automático de cambios pendientes

## 🎯 Comandos Útiles

### Desarrollo Local
```bash
# Servidor local para probar el sitio
python3 -m http.server 8000
# o
open index.html
```

### Optimización
```bash
# Optimizar todos los PDFs
cd PORTFOLIO && ./optimize_pdfs.sh

# Optimizar imágenes
cd PORTFOLIO && ./optimize_images.sh
```

### Git
```bash
# Ver estado
git status

# Método RECOMENDADO: Auto-commit y push
./auto-commit.sh "Descripción del cambio"

# Método tradicional: Commit manual
git add .
git commit -m "Descripción del cambio"

# Publicar a GitHub Pages
git push origin main
# (El hook pre-push hará commit automático si hay cambios pendientes)
```

## 🚫 Archivos a Ignorar

- `.DS_Store` - Archivos de macOS
- `*.log` - Logs
- `node_modules/` - Si se agregan dependencias Node
- `.env*` - Variables de entorno (nunca commitear)
- Archivos temporales de optimización

## 🎓 Contexto del Negocio

Este es un portfolio profesional personal que debe:
- Proyectar imagen profesional y creativa
- Ser fácil de navegar
- Cargar rápidamente (optimización importante)
- Mostrar trabajos de calidad
- Ser fácil de mantener y actualizar

## 💡 Notas para Claude Code

- **Idioma preferido**: Español para documentación y commits
- **Estilo de código**: Limpio, comentado, profesional
- **Optimización**: Priorizar rendimiento web (PDFs e imágenes optimizados)
- **Git**: Commits descriptivos, evitar commits con archivos grandes sin optimizar
- **Seguridad**: Nunca commitear información personal sensible
- **Calidad**: Mantener diseño coherente y profesional en todo el sitio

## 🔗 Enlaces Importantes

- GitHub Pages: https://anamanzanares.github.io/my-life/
- Repositorio: https://github.com/anamanzanares/my-life

## 📋 TODOs Potenciales

- Considerar añadir meta tags para SEO
- Añadir favicon personalizado
- Considerar analytics (Google Analytics o similar)
- Backup automático de archivos importantes
- ✅ ~~Script de deployment automatizado~~ (Implementado: auto-commit.sh)
- Compresión automática de assets al hacer commit
