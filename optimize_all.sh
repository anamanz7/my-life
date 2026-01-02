#!/bin/bash

# Script de optimización completa del repositorio
# Optimiza PDFs, imágenes y reporta resultados

echo "🚀 Iniciando optimización completa del repositorio..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Crear directorio temporal para backups
BACKUP_DIR="/tmp/my-life-backup-$(date +%s)"
mkdir -p "$BACKUP_DIR"

total_saved=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  OPTIMIZACIÓN DE PDFs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Función para optimizar PDF
optimize_pdf() {
    local input_file="$1"
    local output_file="${input_file%.pdf}_optimized.pdf"
    local temp_file="${input_file}.tmp.pdf"

    echo -e "${YELLOW}Procesando:${NC} $(basename "$input_file")"

    # Obtener tamaño original
    local size_before=$(stat -c%s "$input_file")
    local size_before_mb=$(awk "BEGIN {printf \"%.2f\", $size_before / 1024 / 1024}")

    # Backup
    cp "$input_file" "$BACKUP_DIR/"

    # Optimizar con ghostscript
    gs -sDEVICE=pdfwrite \
       -dCompatibilityLevel=1.4 \
       -dPDFSETTINGS=/ebook \
       -dNOPAUSE -dQUIET -dBATCH \
       -dCompressFonts=true \
       -dSubsetFonts=true \
       -dEmbedAllFonts=true \
       -dDetectDuplicateImages=true \
       -dDownsampleColorImages=true \
       -dColorImageResolution=150 \
       -dDownsampleGrayImages=true \
       -dGrayImageResolution=150 \
       -dDownsampleMonoImages=true \
       -dMonoImageResolution=150 \
       -sOutputFile="$temp_file" \
       "$input_file" 2>/dev/null

    if [ -f "$temp_file" ]; then
        local size_after=$(stat -c%s "$temp_file")
        local size_after_mb=$(awk "BEGIN {printf \"%.2f\", $size_after / 1024 / 1024}")
        local saved=$((size_before - size_after))
        local saved_mb=$(awk "BEGIN {printf \"%.2f\", $saved / 1024 / 1024}")
        local percent=$(awk "BEGIN {printf \"%.1f\", ($saved * 100) / $size_before}")

        # Solo reemplazar si es más pequeño
        if [ $size_after -lt $size_before ]; then
            mv "$temp_file" "$input_file"
            echo -e "${GREEN}✓ Optimizado:${NC} $size_before_mb MB → $size_after_mb MB (${GREEN}-$saved_mb MB, -$percent%${NC})"
            total_saved=$((total_saved + saved))
        else
            rm "$temp_file"
            echo -e "${YELLOW}⊘ No se redujo${NC} (ya está optimizado)"
        fi
    else
        echo -e "${YELLOW}⚠ Error al optimizar${NC}"
    fi
    echo ""
}

# Optimizar todos los PDFs
find /home/user/my-life/PORTFOLIO -name "*.pdf" -type f | while read pdf; do
    optimize_pdf "$pdf"
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  OPTIMIZACIÓN DE IMÁGENES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Función para optimizar JPG
optimize_jpg() {
    local input_file="$1"

    echo -e "${YELLOW}Procesando:${NC} $(basename "$input_file")"

    local size_before=$(stat -c%s "$input_file")
    local size_before_kb=$(awk "BEGIN {printf \"%.2f\", $size_before / 1024}")

    cp "$input_file" "$BACKUP_DIR/"

    jpegoptim --max=85 --strip-all --preserve "$input_file" 2>/dev/null

    local size_after=$(stat -c%s "$input_file")
    local size_after_kb=$(awk "BEGIN {printf \"%.2f\", $size_after / 1024}")
    local saved=$((size_before - size_after))
    local saved_kb=$(awk "BEGIN {printf \"%.2f\", $saved / 1024}")

    if [ $saved -gt 0 ]; then
        local percent=$(awk "BEGIN {printf \"%.1f\", ($saved * 100) / $size_before}")
        echo -e "${GREEN}✓ Optimizado:${NC} $size_before_kb KB → $size_after_kb KB (${GREEN}-$saved_kb KB, -$percent%${NC})"
        total_saved=$((total_saved + saved))
    else
        echo -e "${YELLOW}⊘ Ya está optimizado${NC}"
    fi
    echo ""
}

# Función para optimizar PNG
optimize_png() {
    local input_file="$1"

    echo -e "${YELLOW}Procesando:${NC} $(basename "$input_file")"

    local size_before=$(stat -c%s "$input_file")
    local size_before_kb=$(awk "BEGIN {printf \"%.2f\", $size_before / 1024}")

    cp "$input_file" "$BACKUP_DIR/"

    optipng -o7 -strip all -quiet "$input_file" 2>/dev/null

    local size_after=$(stat -c%s "$input_file")
    local size_after_kb=$(awk "BEGIN {printf \"%.2f\", $size_after / 1024}")
    local saved=$((size_before - size_after))
    local saved_kb=$(awk "BEGIN {printf \"%.2f\", $saved / 1024}")

    if [ $saved -gt 0 ]; then
        local percent=$(awk "BEGIN {printf \"%.1f\", ($saved * 100) / $size_before}")
        echo -e "${GREEN}✓ Optimizado:${NC} $size_before_kb KB → $size_after_kb KB (${GREEN}-$saved_kb KB, -$percent%${NC})"
        total_saved=$((total_saved + saved))
    else
        echo -e "${YELLOW}⊘ Ya está optimizado${NC}"
    fi
    echo ""
}

# Optimizar todas las imágenes JPG
find /home/user/my-life -name "*.jpg" -o -name "*.jpeg" | while read img; do
    optimize_jpg "$img"
done

# Optimizar todas las imágenes PNG
find /home/user/my-life/emojis -name "*.png" -type f | while read img; do
    optimize_png "$img"
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  RESUMEN${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

total_saved_mb=$(awk "BEGIN {printf \"%.2f\", $total_saved / 1024 / 1024}")
echo -e "${GREEN}✓ Optimización completada${NC}"
echo -e "${GREEN}  Total ahorrado: ${total_saved_mb} MB${NC}"
echo ""
echo -e "Backups guardados en: $BACKUP_DIR"
echo ""
