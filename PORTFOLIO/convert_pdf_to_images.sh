#!/bin/bash
# Script para convertir páginas específicas del PDF BOM a JPG

PDF_FILE="BOM PROJECT.pdf"
OUTPUT_DIR="bom_planos"

# Crear directorio de salida
mkdir -p "$OUTPUT_DIR"

# Páginas importantes con planos técnicos (27-58 son los planos y renders)
# Páginas 27-50: Planos técnicos y de acabados
# Páginas 51-57: Renders 3D

echo "Convirtiendo planos del proyecto BOM a imágenes JPG..."

# Usar sips (nativo de macOS) para crear miniaturas de cada página
# Primero necesitamos separar el PDF en páginas individuales

# Método alternativo: usar python con pdf2image si está disponible
if command -v python3 &> /dev/null; then
    python3 << 'PYTHON_SCRIPT'
import subprocess
import os

pdf_file = "BOM PROJECT.pdf"
output_dir = "bom_planos"

# Páginas clave a extraer (índice base 1)
pages = {
    "01_portada": 1,
    "07_alzado_proyectado": 27,
    "08_planta_proyectada": 28,
    "09_secciones_longitudinales": 29,
    "10_seccion_transversal": 30,
    "11_planta_mobiliario": 31,
    "12_secciones_mobiliario_A_C": 32,
    "13_seccion_mobiliario_B": 33,
    "18_detalle_taller": 38,
    "19_detalle_constructivo": 39,
    "20_planta_mobiliario_color": 42,
    "23_pavimentos": 45,
    "27_planta_mobiliario_equipamiento": 49,
    "28_planta_iluminaria": 50,
    "render_01": 52,
    "render_02": 53,
    "render_03": 54,
    "render_04": 55,
    "render_05": 56,
    "render_06": 57,
}

# Intentar con diferentes métodos
print("Intentando conversión con herramientas disponibles...")

# Comprobar si existe pdftocairo (parte de poppler pero a veces está separado)
result = subprocess.run(['which', 'pdftocairo'], capture_output=True)
if result.returncode == 0:
    print("Usando pdftocairo...")
    for name, page in pages.items():
        output_file = f"{output_dir}/{name}.jpg"
        cmd = ['pdftocairo', '-jpeg', '-f', str(page), '-l', str(page), '-r', '150', pdf_file, f"{output_dir}/{name}"]
        subprocess.run(cmd)
    print("Conversión completada!")
else:
    print("pdftocairo no disponible")
    print("Necesitarás instalar poppler-utils o usar otro método")
    print("\nPáginas a extraer:")
    for name, page in pages.items():
        print(f"  - Página {page}: {name}")

PYTHON_SCRIPT
else
    echo "Python3 no disponible"
    echo "Por favor instala poppler: brew install poppler"
fi

echo "Script finalizado."
