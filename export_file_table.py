import med_minds as minds
import pandas as pd

# Load file table from the MINDS database
query_df = minds.query("SELECT * FROM file")

# Save to CSV
query_df.to_csv("minds_data/file.tsv", sep="\t", index=False)
print(f"[INFO] Exported {len(query_df)} rows to minds_data/file.tsv")
