#!/usr/bin/env python3
"""
Script para convertir páginas específicas del PDF del proyecto BOM a imágenes JPG
Usa PyMuPDF (fitz) que no requiere dependencias externas
"""

import fitz  # PyMuPDF
import os

def convert_pdf_pages_to_jpg():
    pdf_file = "BOM PROJECT.pdf"
    output_dir = "bom_planos"

    # Crear directorio de salida si no existe
    os.makedirs(output_dir, exist_ok=True)

    # Páginas clave a extraer (índice base 0 para PyMuPDF)
    # Ajustamos restando 1 al número de página real
    pages_to_extract = {
        "01_portada": 0,  # Página 1
        "07_alzado_proyectado": 26,  # Página 27
        "08_planta_proyectada": 27,  # Página 28
        "09_secciones_longitudinales": 28,  # Página 29
        "10_seccion_transversal": 29,  # Página 30
        "11_planta_mobiliario": 30,  # Página 31
        "12_secciones_mobiliario_A_C": 31,  # Página 32
        "13_seccion_mobiliario_B": 32,  # Página 33
        "18_detalle_taller": 37,  # Página 38
        "19_detalle_constructivo": 38,  # Página 39
        "20_planta_mobiliario_color": 41,  # Página 42
        "23_pavimentos": 44,  # Página 45
        "27_planta_mobiliario_equipamiento": 48,  # Página 49
        "28_planta_iluminaria": 49,  # Página 50
        "render_01": 51,  # Página 52
        "render_02": 52,  # Página 53
        "render_03": 53,  # Página 54
        "render_04": 54,  # Página 55
        "render_05": 55,  # Página 56
        "render_06": 56,  # Página 57
    }

    print(f"Abriendo PDF: {pdf_file}")
    pdf_document = fitz.open(pdf_file)

    print(f"Total de páginas en el PDF: {pdf_document.page_count}")
    print(f"\nConvirtiendo {len(pages_to_extract)} páginas a JPG...")

    # Resolución para las imágenes (150 DPI es bueno para web)
    zoom = 2  # Factor de zoom (2 = 144 DPI aprox)
    mat = fitz.Matrix(zoom, zoom)

    for name, page_num in pages_to_extract.items():
        if page_num < pdf_document.page_count:
            print(f"  Procesando página {page_num + 1}: {name}...")

            # Obtener la página
            page = pdf_document[page_num]

            # Convertir a imagen
            pix = page.get_pixmap(matrix=mat)

            # Guardar como JPG
            output_path = os.path.join(output_dir, f"{name}.jpg")
            pix.save(output_path)

            print(f"    ✓ Guardado: {output_path} ({pix.width}x{pix.height} px)")
        else:
            print(f"  ⚠ Página {page_num + 1} no existe en el PDF")

    pdf_document.close()
    print(f"\n✅ Conversión completada! Imágenes guardadas en: {output_dir}/")
    print(f"📁 Total de archivos generados: {len(os.listdir(output_dir))}")

if __name__ == "__main__":
    convert_pdf_pages_to_jpg()
