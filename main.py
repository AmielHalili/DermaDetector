import med_minds as minds
import os
import pandas as pd

# Set save path
PATH_TO_SAVE_DATA = "./minds_data"
MANIFEST_PATH = os.path.join(PATH_TO_SAVE_DATA, "manifest.json")
COHORT_TSV = "cohort_hackathon_cohort.2025-03-20 (1).tsv"

# Make sure the folder exists
if not os.path.exists(PATH_TO_SAVE_DATA):
    os.makedirs(PATH_TO_SAVE_DATA)

# Log available tables
print("[INFO] Fetching available tables in MINDS database...")
tables = minds.get_tables()
print(f"[INFO] Tables found: {tables}")

# Build cohort
print("[INFO] Building GDC cohort...")
gdc_cohort = minds.build_cohort(
    gdc_cohort=COHORT_TSV,
    output_dir=PATH_TO_SAVE_DATA,
    manifest=MANIFEST_PATH if os.path.exists(MANIFEST_PATH) else None,
)

# Cohort stats
print("[INFO] Cohort Stats:")
print(gdc_cohort.stats())

# Load IDs from TSV
ids = pd.read_csv(COHORT_TSV, sep="\t", dtype=str)
print(f"[INFO] Found {len(ids)} case IDs in the cohort TSV.")

# Query each table and export matching cases
for table in tables:
    print(f"[INFO] Querying table: {table}")
    id_list = ",".join([f"'{i}'" for i in ids["id"]])
    query = f"SELECT * FROM {table} WHERE cases_case_id IN ({id_list})"
    
    query_df = minds.query(query)
    
    output_path = os.path.join(PATH_TO_SAVE_DATA, f"{table}.csv")
    query_df.to_csv(output_path, index=False)
    print(f"[INFO] Saved {len(query_df)} rows to {output_path}")

# Download associated data
print("[INFO] Starting data download from cohort...")
gdc_cohort.download(threads=16)
print("[DONE] All data has been downloaded successfully.")
