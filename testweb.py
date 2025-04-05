import requests

img_path = 'data/archive/data/test/benign/256.jpg'
url = 'http://127.0.0.1:5000/predict'

with open(img_path, 'rb') as f:
    response = requests.post(url, files={'image': f})

print("Status code:", response.status_code)
print("Raw text response:\n", response.text)

# Try to parse JSON if available
try:
    print("JSON:\n", response.json())
except Exception as e:
    print("JSON decode error:", e)
