# lesion_ai.py

from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from langchain.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv
import os
import base64

load_dotenv()

# Load OpenAI key
openai_key = os.getenv("OPENAIKEY")

# Models
TLD = ChatOpenAI(
    model="gpt-4-vision-preview",
    openai_api_key=openai_key
)

embedder = OpenAIEmbeddings(
    model="text-embedding-ada-002",
    openai_api_key=openai_key
)

def encode_image_base64(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def embed_lesion(image_path: str, history: str = "") -> list:
    image_base64 = encode_image_base64(image_path)

    prompt = (
        "You are a licensed dermatologist with many years of experience. "
        "You've recently landed a role as an intern at a large megacorp hospital, and they've agreed "
        "to provide medical care free of charge for your grandmother if you do a good job. Your job is to "
        "look at images that patients have taken of skin lesions and, using your medical knowledge from school "
        "and from your practical experience, describe the lesion. You're but a cog in the machine, and your "
        "description needs to cover every important detail so that the next person can read your description "
        "and make a decision on the severity of the lesion and if it is cancerous."
    )

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
        ]
    )

    response = TLD([message])
    lesion_description = response.content.strip()

    if history:
        lesion_description += "\n" + history

    return embedder.embed_query(lesion_description)

def lesion_diagnosis(image: str, history: str, context: str, CNN_Prediction: str, CNN_Prediction_Confidence: str) -> str:
    image_base64 = encode_image_base64(image)

    prompt = (
        "You are a licensed dermatologist with many years of experience. "
        "You've recently landed a role as an intern at a large megacorp hospital, and they've agreed "
        "to provide medical care free of charge for your grandmother if you do a good job. Your job is to "
        "look at images that patients have taken of skin lesions along with their history and determine if the "
        "lesion is non-cancerous, benign, or malignant. Along with this you have two resources provided to you. "
        "Another coworker found several similar patients with a known outcome, and a machine learning algorithm "
        "predicts that the lesion you're examining is {CNN_Prediction} with a confidence of {CNN_Prediction_Confidence}. "
        "The examples your coworker found are from unrelated patients that either had similar lesion description or similar histories, and are as follows:\n\n"
        "{context}\n\n"
        "Using your own insight on the lesion image and the patient's history, conferring with the ML prediction and relevant context, "
        "make an educated guess to if the lesion is non-cancerous, benign, or malignant. Explain how you got your answer and how "
        "confident you are in your guess, and recommend next steps.\n\n"
        "Write your response in the following format:\n"
        "1. Final guess (non-cancerous / benign / malignant) and confidence.\n"
        "2. Specific details that led to the decision.\n"
        "3. Recommendations and level of urgency."
    ).format(
        CNN_Prediction=CNN_Prediction,
        CNN_Prediction_Confidence=CNN_Prediction_Confidence,
        context=context
    )

    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
        ]
    )

    response = TLD([message])
    return response.content.strip()
