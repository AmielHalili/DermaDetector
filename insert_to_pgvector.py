import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to PGVector DB using the correct vector-specific env variables
conn = psycopg2.connect(
    host=os.getenv("HOST"),
    port=os.getenv("PORT_VEC"),
    dbname=os.getenv("DATABASE_VEC"),
    user=os.getenv("DB_USER_VEC"),
    password=os.getenv("PASSWORD_VEC")
)

def insert_embedding(vector, description, label):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO lesion_embeddings (embedding, description, label)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (vector, description, label))
        conn.commit()
        print(f"[DB] ✅ Inserted embedding for label: {label}")
