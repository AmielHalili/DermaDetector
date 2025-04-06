import os
import xml.etree.ElementTree as ET
import pandas as pd

# 🔍 This is where all 80 folders are now located
DATA_DIR = "patient_data"
records = []

# XML namespaces
ns = {
    'admin': 'http://tcga.nci/bcr/xml/administration/2.7',
    'shared': 'http://tcga.nci/bcr/xml/shared/2.7',
    'ssf': 'http://tcga.nci/bcr/xml/ssf/2.7',
}

def extract_info_from_xml(xml_path):
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()

        barcode = root.find('.//shared:bcr_patient_barcode', ns).text
        histology = root.find('.//shared:histological_type', ns)
        site = root.find('.//ssf:site_of_disease', ns)
        method = root.find('.//shared:method_of_sample_procurement', ns)
        weight = root.find('.//ssf:tumor_weight', ns)

        summary = f"Patient {barcode} was diagnosed with {histology.text if histology is not None else 'unknown histology'}."
        if site is not None:
            summary += f" The tumor was located in the {site.text}."
        if method is not None:
            summary += f" It was obtained via {method.text}."
        if weight is not None:
            summary += f" It weighed {weight.text} milligrams."

        label = "malignant" if histology is not None and "melanoma" in histology.text.lower() else "benign"

        return {
            "barcode": barcode,
            "history": summary,
            "label": label,
            "source_file": xml_path
        }

    except Exception as e:
        print(f"[WARN] Failed to parse {xml_path}: {e}")
        return None

# 🔁 Walk all subfolders to find XMLs
for root, _, files in os.walk(DATA_DIR):
    for file in files:
        if file.endswith(".xml"):
            path = os.path.join(root, file)
            print(f"[DEBUG] Found XML file: {path}")
            info = extract_info_from_xml(path)
            if info:
                records.append(info)

# ✅ Save results
df = pd.DataFrame(records)
df.to_csv("extracted_histories.csv", index=False)
print(f"[INFO] Parsed {len(df)} patient histories.")
