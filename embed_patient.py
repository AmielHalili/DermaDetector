import os
import base64
import pandas as pd
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import HumanMessage
from dotenv import load_dotenv

load_dotenv()

# Initialize models
TLD = ChatOpenAI(
    model="gpt-4-vision-preview",
    openai_api_key=os.getenv("OPENAIKEY")
)

embedder = OpenAIEmbeddings(
    model="text-embedding-ada-002",
    openai_api_key=os.getenv("OPENAIKEY")
)

def embed_patient(image_path, history_text):
    with open(image_path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode("utf-8")

    prompt = (
        "You are a licensed dermatologist reviewing an image of a lesion. "
        "Describe what you see in clinical terms so another doctor could make a treatment decision."
    )

    message = HumanMessage(content=[
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
    ])

    print(f"[INFO] Sending image to GPT-4o...")
    response = TLD([message])
    image_description = response.content.strip()

    combined_text = image_description + "\n" + history_text
    print(f"[INFO] Generating embedding...")
    vector = embedder.embed_query(combined_text)

    return vector, image_description
