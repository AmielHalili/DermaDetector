print("[BOOT] Starting script...")

import os
import pandas as pd
from insert_to_pgvector import insert_embedding
from langchain.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv

# Phase 2: GPT-4o vision model for image-to-text description (future use)
# from embed_patient import describe_image

load_dotenv()

# Load embedder
embedder = OpenAIEmbeddings(
    model="text-embedding-ada-002",
    openai_api_key=os.getenv("OPENAIKEY")
)

# Correct file name
HISTORIES_CSV = "extracted_histories.csv"

# Phase 2: Image search paths (not used currently)
# IMAGE_DIR = "images"
# IMAGE_EXTS = [".svs", ".tiff", ".tif", ".jpg", ".png"]

# Load patient data
print(f"[INFO] Loading {HISTORIES_CSV}...")
df = pd.read_csv(HISTORIES_CSV)

# Debugging check
print(f"[DEBUG] Loaded {len(df)} rows.")
if len(df) > 0:
    print(f"[DEBUG] Sample row:\n{df.iloc[0]}")

# Phase 2: Image matching (if image descriptions are added later)
# def find_image(barcode):
#     for root, _, files in os.walk(IMAGE_DIR):
#         for file in files:
#             if barcode in file and any(file.lower().endswith(ext) for ext in IMAGE_EXTS):
#                 return os.path.join(root, file)
#     return None

print(f"[INFO] Embedding patient histories (text only)...")

for i, row in df.iterrows():
    barcode = row["barcode"]
    history = row["history"]
    label = row["label"]

    print(f"[{i+1}/{len(df)}] Embedding history for {barcode} ({label})")

    try:
        # === Phase 2: Use image description if available
        # image_path = find_image(barcode)
        # if image_path:
        #     description = describe_image(image_path)
        #     full_text = description + "\n" + history
        # else:
        #     full_text = history

        # Phase 1: Use only history
        full_text = history

        vector = embedder.embed_query(full_text)
        insert_embedding(vector, full_text, label)

    except Exception as e:
        print(f"[ERROR] Skipped {barcode} due to: {e}")
