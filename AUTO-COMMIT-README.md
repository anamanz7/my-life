# 🤖 Sistema de Auto-Commit

Sistema de automatización para commits y deployment del portfolio.

## 📦 Componentes

### 1. Script Manual: `auto-commit.sh`

Script interactivo para hacer commit y push de manera rápida y sencilla.

#### Uso:

```bash
# Con mensaje personalizado
./auto-commit.sh "Actualizar proyecto X"

# Sin mensaje (generará uno automáticamente)
./auto-commit.sh
```

#### Características:
- ✅ Detecta automáticamente archivos modificados, nuevos y eliminados
- ✅ Genera mensajes de commit inteligentes
- ✅ Salida con colores para mejor legibilidad
- ✅ Pregunta confirmación antes de hacer push
- ✅ Muestra resumen de cambios antes de commitear

#### Ejemplo de uso:

```bash
$ ./auto-commit.sh "Añadir nuevo proyecto"

════════════════════════════════════════
  Auto-Commit Portfolio - My Life
════════════════════════════════════════

📋 Cambios detectados:
M  index.html
A  PORTFOLIO/nuevo-proyecto.pdf

📦 Añadiendo cambios...
💾 Creando commit...
✅ Commit creado exitosamente

¿Hacer push a GitHub? (y/n)
y
🚀 Haciendo push a origin/main...

════════════════════════════════════════
✅ ¡Portfolio actualizado exitosamente!
🌐 GitHub Pages se actualizará en breve
════════════════════════════════════════
```

### 2. Git Hook: `.git/hooks/pre-push`

Hook que se ejecuta automáticamente **antes** de cada `git push`.

#### Funcionamiento:
1. Se activa al ejecutar `git push`
2. Verifica si hay cambios sin commitear
3. Si hay cambios, crea un commit automático
4. Permite que el push continúe normalmente

#### Características:
- ✅ Totalmente automático
- ✅ No requiere intervención manual
- ✅ Previene olvidar cambios sin commitear
- ✅ Genera mensajes de commit descriptivos
- ✅ Incluye lista de archivos modificados

#### Ejemplo:

```bash
$ git push origin main

🔍 Verificando cambios pendientes...
📝 Cambios detectados. Creando commit automático...
✅ Commit automático creado exitosamente

[Continúa con el push normalmente...]
```

## 🎯 ¿Cuándo usar cada uno?

### Usa `auto-commit.sh` cuando:
- Quieras tener control sobre el mensaje de commit
- Necesites revisar los cambios antes de publicar
- Prefieras confirmar antes de hacer push
- Estés haciendo cambios importantes que requieren descripción detallada

### El hook `pre-push` se usa automáticamente:
- Cada vez que hagas `git push`
- Para capturar cambios que olvidaste commitear
- Como red de seguridad para no perder cambios
- Sin necesidad de ejecutar nada manualmente

## 🔧 Instalación

El sistema ya está instalado y configurado. Los archivos son:

```
my-life/
├── auto-commit.sh              # Script manual (ejecutable)
└── .git/hooks/pre-push         # Hook automático (ejecutable)
```

Ambos tienen permisos de ejecución (+x) configurados.

## ⚙️ Configuración

### Configurar Git User (Opcional)

Para evitar mensajes de advertencia sobre identidad:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Desactivar el Hook (Si es necesario)

Si temporalmente no quieres que el hook se ejecute:

```bash
# Renombrar el hook
mv .git/hooks/pre-push .git/hooks/pre-push.disabled

# Para reactivarlo
mv .git/hooks/pre-push.disabled .git/hooks/pre-push
```

### Personalizar Mensajes de Commit

Puedes editar los archivos para personalizar los mensajes:

- `auto-commit.sh`: Línea ~35 (variable COMMIT_MSG)
- `.git/hooks/pre-push`: Línea ~22 (variable COMMIT_MSG)

## 🚀 Workflow Recomendado

### Flujo Normal de Trabajo:

```bash
# 1. Hacer cambios en archivos
# 2. Usar el script de auto-commit
./auto-commit.sh "Descripción de tus cambios"
# 3. ¡Listo! GitHub Pages se actualiza automáticamente
```

### Flujo Alternativo (Git tradicional):

```bash
# 1. Hacer cambios en archivos
# 2. Hacer push directamente
git push origin main
# 3. El hook pre-push hará commit automático si hay cambios
```

## 📝 Ejemplos de Mensajes de Commit

El sistema genera mensajes descriptivos automáticamente:

```
Auto-commit: Actualización automática del portfolio

Cambios detectados:
M  index.html
A  PORTFOLIO/nuevo-proyecto.pdf
D  PORTFOLIO/proyecto-viejo.pdf

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## ⚠️ Notas Importantes

1. **El hook NO se sincroniza con git**: Los hooks están en `.git/hooks/` que no se sube al repositorio. Si clonas el repo en otro lugar, necesitas copiar el hook manualmente.

2. **Backup del hook**: El archivo se encuentra en `.git/hooks/pre-push`. Considera hacer backup si es importante.

3. **Archivos sensibles**: El sistema NO commitea automáticamente archivos en `.gitignore`.

4. **Conflictos**: Si hay conflictos al hacer push, resuélvelos manualmente antes de continuar.

## 🐛 Troubleshooting

### El script no se ejecuta
```bash
# Verificar permisos
ls -l auto-commit.sh
# Debería mostrar: -rwxr-xr-x

# Dar permisos si es necesario
chmod +x auto-commit.sh
```

### El hook no funciona
```bash
# Verificar que existe
ls -l .git/hooks/pre-push

# Verificar permisos
chmod +x .git/hooks/pre-push
```

### Colores no se ven
Los colores requieren un terminal compatible con ANSI. Si no se ven, el script funciona igual, solo sin colores.

## 📚 Referencias

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- Documentación completa del proyecto: [CLAUDE.md](CLAUDE.md)

---

**Creado con** 🤖 [Claude Code](https://claude.com/claude-code)
