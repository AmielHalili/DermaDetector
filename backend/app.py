from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/skin_lesion_transfer.h5')
model = load_model(MODEL_PATH)

IMG_SIZE = (224, 224)

def prepare_image(img) -> np.ndarray:
    img = img.convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    try:
        img = Image.open(file.stream)
        img_tensor = prepare_image(img)

        prediction = model.predict(img_tensor)[0][0]
        label = "Malignant" if prediction > 0.5 else "Benign"
        confidence = float(prediction) if prediction > 0.5 else 1 - float(prediction)

        return jsonify({
            'result': label,
            'confidence': round(confidence * 100, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
