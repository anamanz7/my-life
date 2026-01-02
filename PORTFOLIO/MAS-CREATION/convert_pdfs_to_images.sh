#!/bin/bash

# Script para convertir PDFs a imágenes JPG optimizadas para web
# Autor: Ana Manzanares
# Fecha: 2026-01-02

echo "🎨 Convirtiendo PDFs de MAS CREATION a imágenes..."

# Directorio de salida
OUTPUT_DIR="images"
mkdir -p "$OUTPUT_DIR"

# Contador
count=0

# Convertir cada PDF a JPG
for pdf in *.pdf; do
    if [ -f "$pdf" ]; then
        echo "📄 Procesando: $pdf"

        # Nombre base sin extensión
        basename="${pdf%.pdf}"

        # Convertir PDF a JPG con alta calidad (300 DPI)
        # -density 300: Alta resolución
        # -quality 85: Buena calidad con compresión razonable
        # -flatten: Combina capas y fondo blanco
        sips -s format jpeg "$pdf" --out "$OUTPUT_DIR/${basename}.jpg" 2>/dev/null

        # Si sips falla, intentar con el método alternativo (magick/convert)
        if [ $? -ne 0 ]; then
            echo "  ⚠️  sips falló, intentando con ImageMagick..."
            convert -density 300 -quality 85 -flatten "$pdf" "$OUTPUT_DIR/${basename}.jpg" 2>/dev/null
        fi

        # Si tiene múltiples páginas, convert generará archivos numerados
        # Renombrarlos apropiadamente
        if [ -f "$OUTPUT_DIR/${basename}-0.jpg" ]; then
            echo "  📑 PDF multipágina detectado"
            page=0
            while [ -f "$OUTPUT_DIR/${basename}-${page}.jpg" ]; do
                mv "$OUTPUT_DIR/${basename}-${page}.jpg" "$OUTPUT_DIR/${basename}-pagina-$((page+1)).jpg"
                echo "    ✓ Página $((page+1)) convertida"
                ((page++))
            done
        else
            echo "    ✓ Convertido a $OUTPUT_DIR/${basename}.jpg"
        fi

        ((count++))
    fi
done

echo ""
echo "✨ Conversión completada: $count archivos procesados"
echo "📁 Imágenes guardadas en: $OUTPUT_DIR/"

# Optimizar imágenes con ImageMagick si está disponible
if command -v mogrify &> /dev/null; then
    echo ""
    echo "🔧 Optimizando imágenes para web..."
    mogrify -resize '2000x2000>' -quality 85 "$OUTPUT_DIR"/*.jpg
    echo "✓ Optimización completada"
fi

echo ""
echo "📊 Resumen de archivos generados:"
ls -lh "$OUTPUT_DIR"/*.jpg | awk '{print "  ", $9, "-", $5}'
