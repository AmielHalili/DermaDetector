import os
import base64
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import psycopg2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from langchain.schema import HumanMessage
from langchain.chat_models import ChatOpenAI
from pgvector.psycopg2 import register_vector

# === ENV SETUP ===
load_dotenv()

# === CONSTANTS ===
IMAGE_PATH = os.path.expanduser("~/Downloads/test1096.jpg")
HISTORY_TEXT = (
    "No history of cancer. No treatment prior to biopsy. Located in Tampa, Florida. "
    "Histological type unknown. Tumor appears dark, irregular, and slightly raised."
)
K = 3
IMG_SIZE = (224, 224)

# === Load GPT-4o ===
GPT = ChatOpenAI(
    model="gpt-4o",
    openai_api_key=os.getenv("OPENAIKEY")
)

# === Load CNN model ===
cnn_model = load_model("model/skin_lesion_transfer.h5")

# === PGVector Setup ===
conn = psycopg2.connect(
    host=os.getenv("HOST"),
    port=os.getenv("PORT_VEC"),
    dbname=os.getenv("DATABASE_VEC"),
    user=os.getenv("DB_USER_VEC"),
    password=os.getenv("PASSWORD_VEC")
)
register_vector(conn)

# === Functions ===
def get_cnn_prediction(img_path: str):
    img = image.load_img(img_path, target_size=IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    prediction = cnn_model.predict(img_array)[0][0]
    label = "Malignant" if prediction > 0.5 else "Benign"
    confidence = float(prediction) if prediction > 0.5 else 1 - float(prediction)
    return label, confidence

def get_knn_context(history: str, k: int = 3):
    from langchain_community.embeddings import OpenAIEmbeddings
    embedder = OpenAIEmbeddings(model="text-embedding-ada-002", openai_api_key=os.getenv("OPENAIKEY"))
    vector = embedder.embed_query(history)

    with conn.cursor() as cur:
        cur.execute("""
            SELECT description, label
            FROM lesion_embeddings
            ORDER BY embedding <-> %s::vector
            LIMIT %s
        """, (vector, k))
        rows = cur.fetchall()

    formatted = "\n".join([
        f"Case {i+1}: {desc.strip()} Result: {label}" for i, (desc, label) in enumerate(rows)
    ])
    return formatted


def encode_image_base64(image_path: str) -> str:
    img = Image.open(image_path).convert("RGB").resize(IMG_SIZE)
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# === Main Logic ===
def main():
    print("[BOOT] Starting diagnosis...")
    print(f"[IMAGE] Using: {IMAGE_PATH}")
    print("[CNN] Running CNN prediction...")
    cnn_label, cnn_conf = get_cnn_prediction(IMAGE_PATH)
    print(f"[CNN] {cnn_label} ({cnn_conf:.2%} confidence)")

    print("[kNN] Querying PGVector DB...")
    knn_context = get_knn_context(HISTORY_TEXT, K)
    print("[kNN] Retrieved similar cases.")

    base64_img = encode_image_base64(IMAGE_PATH)

    gpt_prompt = (
        f"You are a licensed dermatologist in an AI-powered diagnostic assistant.\n"
        f"A machine learning model predicts this lesion is **{cnn_label}** "
        f"with **{cnn_conf:.2%} confidence**.\n\n"
        f"The patient provided the following history:\n{HISTORY_TEXT}\n\n"
        f"The following similar past patient cases were found using a nearest-neighbor search:\n{knn_context}\n\n"
        f"Please evaluate the uploaded image and provide:\n"
        f"- Whether it looks benign or malignant, and how that compares to the evaluation of the machine learning model\n"
        f"- How confident you are in this opinion\n"
        f"- Visual indicators or textual context that led to your conclusion\n"
        f"- Clear recommendations for what the patient should do next"
    )

    message = HumanMessage(content=[
        {"type": "text", "text": gpt_prompt},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}}
    ])

    print("[OPENAI] Sending to GPT-4o...")
    response = GPT.invoke([message])
    diagnosis = response.content.strip()

    print("\n================ GPT-4o DIAGNOSIS ================\n")
    print(diagnosis)
    print("\n==================================================\n")

if __name__ == "__main__":
    main()
