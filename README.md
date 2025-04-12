# 🧠 DermaDetect: AI-Powered Skin Cancer Detection & Support

DermaDetect is a web-based AI application designed to assist in the **early detection of skin cancer** and guide users with **personalized health insights**. Built during a healthcare-focused hackathon, this project integrates **computer vision**, **large language models**, and **location intelligence** to provide users with an accessible, real-time diagnostic experience.

---

## 🚀 Features

- 📷 **Image-Based Diagnosis**: Upload an image of a skin lesion and receive an instant prediction using a CNN trained on dermatological data from the **ISIC Archive**.
- 💬 **Conversational AI Assistant**: Get personalized insights based on your medical history and model output, powered by **OpenAI's GPT API**.
- 🗺️ **Find Nearby Care**: Integrated **Google Maps API** suggests nearby dermatologists or hospitals based on your location.
- 🌐 **Clean Web Interface**: User-friendly front end built in **React**, seamlessly integrated with a **Flask** backend.

---

## 🧰 Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React |
| Backend | Flask, Python |
| AI/ML | TensorFlow, CNN (trained on ISIC dataset) |
| Language Model | OpenAI GPT API |
| Location Services | Google Maps API |
| Containerization | Docker |

---

## 🧪 Model Training

The convolutional neural network (CNN) was trained on a curated subset of the [ISIC Archive](https://www.isic-archive.com/) to classify lesions as **benign** or **malignant**. The training pipeline includes:

- Preprocessing and augmentation
- Custom CNN architecture for improved accuracy
- Evaluation on a holdout validation set
