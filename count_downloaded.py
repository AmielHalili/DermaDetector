import os
import pandas as pd

# Folder where data was downloaded
DATA_DIR = "./minds_data"
GDC_DATA_DIR = os.path.join(DATA_DIR, "gdc_data")
COHORT_FILE = "cohort_hackathon_cohort.2025-03-20 (1).tsv"  # Updated to your actual file name

# Load cohort IDs
try:
    df = pd.read_csv(COHORT_FILE, sep="\t", dtype=str)
    cohort_ids = df["id"].tolist()
    print(f"[INFO] Loaded {len(cohort_ids)} case IDs from cohort TSV.")
except Exception as e:
    print("[ERROR] Could not load the cohort TSV file.")
    print(e)
    exit(1)

# Check completed downloads
completed = 0
incomplete = 0
case_file_counts = []

for case_id in cohort_ids:
    case_dir = os.path.join(GDC_DATA_DIR, case_id)
    if os.path.isdir(case_dir):
        files = os.listdir(case_dir)
        if files:
            completed += 1
            case_file_counts.append((case_id, len(files)))
        else:
            incomplete += 1
    else:
        incomplete += 1

print(f"\n✅ Completed downloads: {completed}")
print(f"❌ Incomplete or missing: {incomplete}")

# Show a few sample completed cases
print("\n📂 Sample completed cases:")
for case_id, count in case_file_counts[:5]:
    print(f"- {case_id}: {count} files")
