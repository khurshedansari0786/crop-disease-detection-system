from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import json
import os
import cv2
from PIL import Image
import io
import requests
import base64

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

app = Flask(__name__)
CORS(app)

# ==================== CONFIGURATION ====================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'm1_model', 'plant_model.h5')
CLASSES_PATH = os.path.join(BASE_DIR, 'm1_model', 'classes.json')

# ✅ OpenRouter API Key
OPENROUTER_API_KEY = "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"

# Supported crops
SUPPORTED_CROPS = ['tomato', 'potato', 'bell pepper', 'pepper']

print("=" * 60)
print("🌾 PROFESSIONAL PLANT DISEASE DETECTION API")
print("=" * 60)
print(f"📁 Model Path: {MODEL_PATH}")
print(f"📁 Classes Path: {CLASSES_PATH}")
print(f"🔑 OpenRouter API Key: {'✅ Loaded' if OPENROUTER_API_KEY else '❌ Not Found'}")
print("=" * 60)

# Check if files exist
if not os.path.exists(MODEL_PATH):
    print(f"❌ ERROR: Model not found at {MODEL_PATH}")
    exit(1)

if not os.path.exists(CLASSES_PATH):
    print(f"❌ ERROR: Classes not found at {CLASSES_PATH}")
    exit(1)

# Load model
print("🔄 Loading your disease detection model...")
model = load_model(MODEL_PATH)
print("✅ Your model loaded successfully!")

# Load classes
with open(CLASSES_PATH, 'r') as f:
    classes = json.load(f)
print(f"✅ Loaded {len(classes)} disease classes")
print("=" * 60)

# ==================== OPENROUTER CROP CLASSIFICATION ====================

def classify_crop_with_openrouter(image_bytes):
    """
    Use OpenRouter API to identify the crop in the image
    Returns: crop name or None if not identified
    """
    if not OPENROUTER_API_KEY:
        print("   ⚠️ OpenRouter API Key missing")
        return None
    
    try:
        # Encode image to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        # OpenRouter API endpoint
        url = "https://openrouter.ai/api/v1/chat/completions"
        
        # Prepare request headers
        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Prepare request payload
        payload = {
            "model": "google/gemini-2.5-flash",  # Using Gemini via OpenRouter
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "What crop is shown in this image? Answer with ONLY ONE WORD: 'tomato', 'potato', 'bell pepper', or 'other'. Do not add any other text."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 10,
            "temperature": 0
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        
        if response.status_code == 200:
            result = response.json()
            crop = result['choices'][0]['message']['content'].strip().lower()
            
            # Clean the response
            crop = crop.replace('.', '').strip()
            
            print(f"   🤖 OpenRouter says: '{crop}'")
            
            # Check if crop is supported
            if crop in SUPPORTED_CROPS:
                return crop
            elif 'pepper' in crop:
                return 'bell pepper'
            else:
                return None
        else:
            print(f"   ⚠️ OpenRouter API error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return None
            
    except Exception as e:
        print(f"   ⚠️ OpenRouter error: {e}")
        return None

# ==================== YOUR MODEL PREDICTION ====================

def preprocess_image(image_bytes, target_size=(224, 224)):
    """Preprocess image for your model using OpenCV"""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_resized = cv2.resize(img_rgb, target_size)
    img_array = np.expand_dims(img_resized, axis=0) / 255.0
    return img_array

def get_disease_prediction(image_bytes):
    """Get disease prediction from your model"""
    processed_image = preprocess_image(image_bytes)
    if processed_image is None:
        return None
    
    predictions = model.predict(processed_image, verbose=0)
    
    predicted_idx = np.argmax(predictions[0])
    confidence = float(np.max(predictions[0]) * 100)
    predicted_class = classes[predicted_idx]
    
    # Get top 3 predictions
    top_3_indices = np.argsort(predictions[0])[-3:][::-1]
    top_3 = [
        {
            'class': classes[idx],
            'confidence': float(predictions[0][idx] * 100)
        }
        for idx in top_3_indices
    ]
    
    return {
        'className': predicted_class,
        'confidence': round(confidence, 2),
        'top3': top_3,
        'isHealthy': 'healthy' in predicted_class.lower()
    }

# ==================== API ENDPOINTS ====================

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("\n" + "="*60)
        print("🔵 NEW PREDICTION REQUEST")
        print("="*60)
        
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'NO_IMAGE',
                'message': 'Please upload an image of a crop leaf'
            }), 400
        
        file = request.files['image']
        print(f"📁 File: {file.filename}")
        
        image_bytes = file.read()
        
        # ========== STEP 1: OpenRouter Crop Classification ==========
        print("\n📷 Step 1: Identifying crop with OpenRouter AI...")
        
        crop_type = classify_crop_with_openrouter(image_bytes)
        
        if crop_type is None:
            return jsonify({
                'success': False,
                'error': 'UNSUPPORTED_CROP',
                'message': f'This image does not show a supported crop.',
                'detected_by': 'OpenRouter AI',
                'supported_crops': ['🍅 Tomato', '🥔 Potato', '🫑 Bell Pepper'],
                'solution': 'Please upload a clear photo of Tomato, Potato, or Bell Pepper leaf'
            }), 400
        
        print(f"   ✅ Crop identified: {crop_type}")
        crop_display = {
            'tomato': '🍅 Tomato',
            'potato': '🥔 Potato',
            'bell pepper': '🫑 Bell Pepper'
        }.get(crop_type, crop_type)
        
        # ========== STEP 2: Your Model Disease Detection ==========
        print("\n🔬 Step 2: Detecting disease with your model...")
        result = get_disease_prediction(image_bytes)
        
        if result is None:
            return jsonify({
                'success': False,
                'error': 'INVALID_IMAGE',
                'message': 'Could not process the image. Please try again.'
            }), 400
        
        print(f"   🎯 Disease: {result['className']}")
        print(f"   📊 Confidence: {result['confidence']}%")
        
        # ========== STEP 3: Return Result ==========
        print("\n✅ SUCCESS - Valid crop detected")
        print("="*60 + "\n")
        
        return jsonify({
            'success': True,
            'cropClassifiedBy': 'OpenRouter AI',
            'cropType': crop_display,
            'className': result['className'],
            'confidence': result['confidence'],
            'isHealthy': result['isHealthy'],
            'top3': result['top3'],
            'message': f'✅ {crop_display} detected. {result["className"]} with {result["confidence"]}% confidence'
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'SERVER_ERROR',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': True,
        'openrouter_available': bool(OPENROUTER_API_KEY),
        'supported_crops': ['Tomato', 'Potato', 'Bell Pepper'],
        'total_disease_classes': len(classes),
        'architecture': 'OpenRouter Classifier → Your Model → Disease Detection'
    })

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 STARTING PROFESSIONAL API SERVER")
    print("=" * 60)
    print(f"✅ Your Model: {len(classes)} disease classes")
    print(f"✅ OpenRouter API: {'ENABLED ✅' if OPENROUTER_API_KEY else 'DISABLED ❌'}")
    print(f"✅ Architecture: OpenRouter Classifier → Your Model → Disease Detection")
    print(f"✅ OpenCV Version: {cv2.__version__}")
    print("🚀 Server running on http://0.0.0.0:5001")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=False)