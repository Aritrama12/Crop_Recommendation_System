# """
# Soil Analysis Service for generating recommendations and image analysis.
# """

# from typing import Dict, List, Optional
# from datetime import datetime
# import os

# import numpy as np
# import cv2
# from tensorflow.keras.models import load_model


# # ============================================================
# # 🌱 SOIL TEST ANALYSIS (NUMERICAL DATA)
# # ============================================================



# class SoilAnalysisService:
#     """Service for analyzing soil data and generating recommendations."""
    
#     # Optimal ranges for nutrients (kg/ha)
#     OPTIMAL_RANGES = {
#         'nitrogen': {'low': 140, 'medium': 280, 'high': 560},
#         'phosphorus': {'low': 10, 'medium': 25, 'high': 50},
#         'potassium': {'low': 110, 'medium': 280, 'high': 560},
#         'ph': {'low': 5.5, 'optimal_min': 6.0, 'optimal_max': 7.5, 'high': 8.5},
#         'organic_carbon': {'low': 0.4, 'medium': 0.75, 'high': 1.0},
#     }
    
#     def analyze_soil_test(self, soil_test) -> List[Dict]:
#         """
#         Generate recommendations based on soil test results.
        
#         Args:
#             soil_test: SoilTest model instance
            
#         Returns:
#             List of recommendation dictionaries
#         """
#         recommendations = []
        
#         # Nitrogen analysis
#         n_rec = self._analyze_nutrient(
#             'Nitrogen', 
#             soil_test.nitrogen, 
#             self.OPTIMAL_RANGES['nitrogen']
#         )
#         if n_rec:
#             recommendations.append(n_rec)
        
#         # Phosphorus analysis
#         p_rec = self._analyze_nutrient(
#             'Phosphorus',
#             soil_test.phosphorus,
#             self.OPTIMAL_RANGES['phosphorus']
#         )
#         if p_rec:
#             recommendations.append(p_rec)
        
#         # Potassium analysis
#         k_rec = self._analyze_nutrient(
#             'Potassium',
#             soil_test.potassium,
#             self.OPTIMAL_RANGES['potassium']
#         )
#         if k_rec:
#             recommendations.append(k_rec)
        
#         # pH analysis
#         ph_rec = self._analyze_ph(soil_test.ph)
#         if ph_rec:
#             recommendations.append(ph_rec)
        
#         # Organic carbon analysis
#         if soil_test.organic_carbon:
#             oc_rec = self._analyze_organic_carbon(soil_test.organic_carbon)
#             if oc_rec:
#                 recommendations.append(oc_rec)
        
#         # Generate crop recommendations
#         crop_rec = self._generate_crop_recommendation(soil_test)
#         if crop_rec:
#             recommendations.append(crop_rec)
        
#         return recommendations
    
#     def _analyze_nutrient(self, name: str, value: float, ranges: Dict) -> Optional[Dict]:
#         """Analyze a single nutrient level."""
#         if value < ranges['low']:
#             return {
#                 'category': 'fertilizer',
#                 'priority': 'high',
#                 'title': f'Low {name} Level',
#                 'description': f'{name} levels ({value} kg/ha) are below optimal range. This may significantly affect crop growth and yield.',
#                 'action_required': f'Apply {name}-rich fertilizer to increase soil {name.lower()} content.',
#                 'product_name': self._get_fertilizer_recommendation(name.lower()),
#                 'quantity': self._calculate_fertilizer_quantity(name.lower(), value, ranges['medium']),
#             }
#         elif value > ranges['high']:
#             return {
#                 'category': 'fertilizer',
#                 'priority': 'medium',
#                 'title': f'High {name} Level',
#                 'description': f'{name} levels ({value} kg/ha) are above optimal. Reduce {name.lower()} application.',
#                 'action_required': f'Reduce or skip {name.lower()} fertilizer application for next season.',
#             }
#         return None
    
#     def _analyze_ph(self, ph: float) -> Optional[Dict]:
#         """Analyze soil pH."""
#         ranges = self.OPTIMAL_RANGES['ph']
        
#         if ph < ranges['low']:
#             return {
#                 'category': 'amendment',
#                 'priority': 'high',
#                 'title': 'Soil is Too Acidic',
#                 'description': f'Soil pH ({ph}) is too low. Most crops prefer pH between 6.0-7.5.',
#                 'action_required': 'Apply agricultural lime to raise pH.',
#                 'product_name': 'Agricultural Lime (CaCO3)',
#                 'quantity': f'{(6.5 - ph) * 500:.0f} kg/ha',
#             }
#         elif ph > ranges['high']:
#             return {
#                 'category': 'amendment',
#                 'priority': 'high',
#                 'title': 'Soil is Too Alkaline',
#                 'description': f'Soil pH ({ph}) is too high. This can cause nutrient lockout.',
#                 'action_required': 'Apply sulfur or acidifying amendments.',
#                 'product_name': 'Elemental Sulfur',
#                 'quantity': f'{(ph - 7.5) * 200:.0f} kg/ha',
#             }
#         elif ph < ranges['optimal_min']:
#             return {
#                 'category': 'amendment',
#                 'priority': 'low',
#                 'title': 'Slightly Acidic Soil',
#                 'description': f'Soil pH ({ph}) is slightly below optimal but acceptable for most crops.',
#                 'action_required': 'Consider light liming if growing pH-sensitive crops.',
#             }
#         return None
    
#     def _analyze_organic_carbon(self, oc: float) -> Optional[Dict]:
#         """Analyze organic carbon content."""
#         ranges = self.OPTIMAL_RANGES['organic_carbon']
        
#         if oc < ranges['low']:
#             return {
#                 'category': 'amendment',
#                 'priority': 'high',
#                 'title': 'Low Organic Matter',
#                 'description': f'Organic carbon ({oc}%) is very low. Soil structure and water retention may be poor.',
#                 'action_required': 'Add organic matter through compost, manure, or cover crops.',
#                 'product_name': 'Well-rotted Compost or FYM',
#                 'quantity': '5-10 tonnes/ha',
#             }
#         elif oc < ranges['medium']:
#             return {
#                 'category': 'amendment',
#                 'priority': 'medium',
#                 'title': 'Moderate Organic Matter',
#                 'description': f'Organic carbon ({oc}%) could be improved for better soil health.',
#                 'action_required': 'Consider adding organic amendments or practicing crop rotation with legumes.',
#             }
#         return None
    
#     def _generate_crop_recommendation(self, soil_test) -> Dict:
#         """Generate crop suitability based on soil conditions."""
#         suitable_crops = []
        
#         n, p, k = soil_test.nitrogen, soil_test.phosphorus, soil_test.potassium
#         ph = soil_test.ph
        
#         # Rice - prefers acidic to neutral, high N
#         if 5.5 <= ph <= 7.0 and n >= 100:
#             suitable_crops.append('Rice')
        
#         # Wheat - neutral pH, balanced NPK
#         if 6.0 <= ph <= 7.5 and n >= 80 and p >= 15:
#             suitable_crops.append('Wheat')
        
#         # Maize - slightly acidic to neutral, high N
#         if 5.5 <= ph <= 7.0 and n >= 120:
#             suitable_crops.append('Maize')
        
#         # Cotton - neutral to slightly alkaline
#         if 6.5 <= ph <= 8.0 and k >= 150:
#             suitable_crops.append('Cotton')
        
#         # Pulses - tolerant of lower N
#         if 6.0 <= ph <= 7.5:
#             suitable_crops.append('Chickpea')
#             suitable_crops.append('Lentil')
        
#         # Vegetables
#         if 6.0 <= ph <= 7.0 and n >= 100 and p >= 20:
#             suitable_crops.append('Tomato')
#             suitable_crops.append('Potato')
        
#         if not suitable_crops:
#             suitable_crops = ['Consult local agriculture officer']
        
#         return {
#             'category': 'crop',
#             'priority': 'medium',
#             'title': 'Suitable Crops for Your Soil',
#             'description': f'Based on your soil analysis, the following crops are recommended: {", ".join(suitable_crops[:5])}',
#             'action_required': 'Consider these crops for optimal yield based on your soil conditions.',
#         }
    
#     def _get_fertilizer_recommendation(self, nutrient: str) -> str:
#         """Get fertilizer name for a nutrient."""
#         fertilizers = {
#             'nitrogen': 'Urea (46-0-0) or Ammonium Sulfate',
#             'phosphorus': 'Single Super Phosphate (SSP) or DAP',
#             'potassium': 'Muriate of Potash (MOP)',
#         }
#         return fertilizers.get(nutrient, 'NPK Complex Fertilizer')
    
#     def _calculate_fertilizer_quantity(self, nutrient: str, current: float, target: float) -> str:
#         """Calculate approximate fertilizer quantity needed."""
#         deficit = target - current
        
#         # Approximate conversion factors
#         factors = {
#             'nitrogen': 2.2,  # kg urea per kg N
#             'phosphorus': 6.25,  # kg SSP per kg P
#             'potassium': 2.0,  # kg MOP per kg K
#         }
        
#         factor = factors.get(nutrient, 2.0)
#         quantity = deficit * factor
        
#         return f'{quantity:.0f} kg/ha'



# # ============================================================
# # 🧠 CNN SOIL IMAGE ANALYSIS (UPDATED)
# # ============================================================

# import os
# import cv2
# import numpy as np
# from datetime import datetime
# from typing import Dict
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image

# # global model cache
# _model_instance = None


# class SoilImageAnalyzer:
#     """
#     CNN-based Soil Image Analyzer
#     """

#     SOIL_TYPES = [
#         "alluvial",
#         "arid",
#         "black",
#         "laterite",
#         "mountain",
#         "red",
#         "yellow"
#     ]

#     MOISTURE_LEVELS = ['dry', 'moderate', 'moist', 'wet']
#     FERTILITY_LEVELS = ['low', 'medium', 'high']

#     def __init__(self):
#         global _model_instance

#         self.model_path = os.path.join(
#             os.path.dirname(__file__),
#             "soil_model",
#             "best_fixed.keras"
#         )

#         if _model_instance is None:
#             print(f"Loading model: {self.model_path}")

#             _model_instance = load_model(
#                 self.model_path,
#                 compile=False
#             )

#         self.model = _model_instance

#     # =====================================================
#     # IMAGE PREPROCESS FOR CNN
#     # =====================================================
#     def preprocess_image(self, image_path):
#         img = image.load_img(
#             image_path,
#             target_size=(224, 224)
#         )

#         img_array = image.img_to_array(img)
#         img_array = img_array.astype("float32") / 255.0
#         img_array = np.expand_dims(img_array, axis=0)

#         return img_array

#     # =====================================================
#     # COLOR ANALYSIS
#     # =====================================================
#     def analyze_color(self, image_path):
#         img = cv2.imread(image_path)
#         img = cv2.resize(img, (224, 224))

#         hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

#         brightness = np.mean(hsv[:, :, 2]) / 255
#         saturation = np.mean(hsv[:, :, 1]) / 255

#         avg_bgr = np.mean(img, axis=(0, 1))

#         if avg_bgr[2] > avg_bgr[1] and avg_bgr[2] > avg_bgr[0]:
#             dominant = "reddish"
#         elif avg_bgr[1] > avg_bgr[2]:
#             dominant = "greenish"
#         else:
#             dominant = "brown"

#         return {
#             "dominant_color": dominant,
#             "saturation": round(float(saturation), 2),
#             "brightness": round(float(brightness), 2),
#         }

#     # =====================================================
#     # TEXTURE ANALYSIS
#     # =====================================================
#     def analyze_texture(self, image_path):
#         img = cv2.imread(image_path, 0)
#         img = cv2.resize(img, (224, 224))

#         laplacian_var = cv2.Laplacian(
#             img,
#             cv2.CV_64F
#         ).var()

#         coarseness = min(laplacian_var / 1000, 1)

#         uniformity = 1 - np.std(img) / 255

#         return {
#             "coarseness": round(float(coarseness), 2),
#             "uniformity": round(float(uniformity), 2)
#         }

#     # =====================================================
#     # MOISTURE ESTIMATION
#     # =====================================================
#     def estimate_moisture(self, brightness):
#         if brightness < 0.25:
#             return "wet"
#         elif brightness < 0.40:
#             return "moist"
#         elif brightness < 0.60:
#             return "moderate"
#         return "dry"

#     # =====================================================
#     # FERTILITY ESTIMATION
#     # =====================================================
#     def estimate_fertility(self, confidence):
#         if confidence > 0.85:
#             return "high"
#         elif confidence > 0.65:
#             return "medium"
#         return "low"

#     # =====================================================
#     # MAIN FUNCTION
#     # =====================================================
#     def analyze_image(self, image_path: str) -> Dict:
#         try:
#             processed_img = self.preprocess_image(image_path)

#             prediction = self.model.predict(
#                 processed_img,
#                 verbose=0
#             )[0]

#             predicted_idx = np.argmax(prediction)
#             confidence = float(prediction[predicted_idx])

#             color_data = self.analyze_color(image_path)
#             texture_data = self.analyze_texture(image_path)

#             moisture = self.estimate_moisture(
#                 color_data["brightness"]
#             )

#             fertility = self.estimate_fertility(
#                 confidence
#             )

#             return {
#                 "soil_type": self.SOIL_TYPES[predicted_idx],
#                 "moisture": moisture,
#                 "fertility": fertility,
#                 "confidence": round(confidence, 4),

#                 "analysis_data": {
#                     "color_analysis": color_data,
#                     "texture_analysis": texture_data
#                 },

#                 "all_probabilities": {
#                     self.SOIL_TYPES[i]: round(
#                         float(prediction[i]), 4
#                     )
#                     for i in range(len(self.SOIL_TYPES))
#                 },

#                 "analyzed_at": datetime.now().isoformat()
#             }

#         except Exception as e:
#             return {
#                 "error": str(e),
#                 "soil_type": None,
#                 "confidence": 0
#             }

"""
Hybrid Soil Analysis Service (Image + Soil Test)
"""

from typing import Dict, List, Optional
from datetime import datetime
import os

import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


# ============================================================
# 🌱 SOIL TEST ANALYSIS SERVICE
# ============================================================

class SoilAnalysisService:
    """Soil test based nutrient + crop recommendation engine"""

    OPTIMAL_RANGES = {
        'nitrogen': {'low': 140, 'medium': 280, 'high': 560},
        'phosphorus': {'low': 10, 'medium': 25, 'high': 50},
        'potassium': {'low': 110, 'medium': 280, 'high': 560},
        'ph': {'low': 5.5, 'optimal_min': 6.0, 'optimal_max': 7.5, 'high': 8.5},
        'organic_carbon': {'low': 0.4, 'medium': 0.75, 'high': 1.0},
    }

    # =====================================================
    # MAIN SOIL ANALYSIS
    # =====================================================

    def analyze_soil_test(self, soil_test) -> List[Dict]:
        recommendations = []

        for nutrient in ['nitrogen', 'phosphorus', 'potassium']:
            rec = self._analyze_nutrient(
                nutrient.capitalize(),
                getattr(soil_test, nutrient),
                self.OPTIMAL_RANGES[nutrient]
            )
            if rec:
                recommendations.append(rec)

        ph_rec = self._analyze_ph(soil_test.ph)
        if ph_rec:
            recommendations.append(ph_rec)

        if soil_test.organic_carbon:
            oc_rec = self._analyze_organic_carbon(soil_test.organic_carbon)
            if oc_rec:
                recommendations.append(oc_rec)

        crop_rec = self._generate_crop_recommendation(soil_test)
        recommendations.append(crop_rec)

        return recommendations

    # =====================================================
    # NUTRIENT ANALYSIS
    # =====================================================

    def _analyze_nutrient(self, name, value, ranges):
        if value < ranges['low']:
            return {
                "category": "fertilizer",
                "priority": "high",
                "title": f"Low {name}",
                "description": f"{name} deficiency detected ({value}).",
                "action_required": f"Apply {name}-rich fertilizer."
            }

        elif value > ranges['high']:
            return {
                "category": "fertilizer",
                "priority": "medium",
                "title": f"High {name}",
                "description": f"Excess {name} detected ({value}).",
                "action_required": f"Reduce {name} application."
            }

        return None

    # =====================================================
    # pH ANALYSIS
    # =====================================================

    def _analyze_ph(self, ph):
        if ph < 5.5:
            return {
                "category": "amendment",
                "priority": "high",
                "title": "Acidic Soil",
                "action_required": "Apply lime (CaCO3)"
            }

        elif ph > 8.5:
            return {
                "category": "amendment",
                "priority": "high",
                "title": "Alkaline Soil",
                "action_required": "Apply sulfur"
            }

        return None

    # =====================================================
    # ORGANIC CARBON
    # =====================================================

    def _analyze_organic_carbon(self, oc):
        if oc < 0.4:
            return {
                "category": "amendment",
                "priority": "high",
                "title": "Low Organic Carbon",
                "action_required": "Add compost or FYM"
            }
        return None

    # =====================================================
    # HYBRID CROP RECOMMENDATION (IMPORTANT)
    # =====================================================

    def _generate_crop_recommendation(self, soil_test):
        crops = []

        n, p, k = soil_test.nitrogen, soil_test.phosphorus, soil_test.potassium
        ph = soil_test.ph

        if 5.5 <= ph <= 7.5:
            if n >= 120:
                crops.append("Rice")
                crops.append("Maize")

            if p >= 20:
                crops.append("Wheat")

        if k >= 200:
            crops.append("Cotton")

        if ph >= 6.0:
            crops.extend(["Pulses", "Chickpea"])

        if not crops:
            crops = ["Millets", "Sorghum"]

        return {
            "category": "crop",
            "priority": "medium",
            "title": "Recommended Crops (Hybrid Model)",
            "description": f"Suggested crops: {', '.join(set(crops))}",
            "action_required": "Based on NPK + pH analysis"
        }


# ============================================================
# 🧠 CNN SOIL IMAGE ANALYZER (HYBRID VERSION)
# ============================================================

_model_instance = None


class SoilImageAnalyzer:

    SOIL_TYPES = [
        "alluvial",
        "arid",
        "black",
        "laterite",
        "mountain",
        "red",
        "yellow"
    ]

    def __init__(self):
        global _model_instance

        self.model_path = os.path.join(
            os.path.dirname(__file__),
            "soil_model",
            "best_fixed.keras"
        )

        if _model_instance is None:
            _model_instance = load_model(self.model_path, compile=False)

        self.model = _model_instance

    # =====================================================
    # PREPROCESS
    # =====================================================

    def preprocess_image(self, image_path):
        img = image.load_img(image_path, target_size=(224, 224))
        img = image.img_to_array(img)
        img = img / 255.0
        return np.expand_dims(img, axis=0)

    # =====================================================
    # COLOR ANALYSIS
    # =====================================================

    def analyze_color(self, image_path):
        img = cv2.imread(image_path)
        img = cv2.resize(img, (224, 224))

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

        brightness = np.mean(hsv[:, :, 2]) / 255
        saturation = np.mean(hsv[:, :, 1]) / 255

        return {
            "brightness": float(brightness),
            "saturation": float(saturation)
        }

    # =====================================================
    # TEXTURE ANALYSIS
    # =====================================================

    def analyze_texture(self, image_path):
        img = cv2.imread(image_path, 0)
        img = cv2.resize(img, (224, 224))

        lap_var = cv2.Laplacian(img, cv2.CV_64F).var()

        return {
            "coarseness": float(min(lap_var / 1000, 1)),
            "uniformity": float(1 - np.std(img) / 255)
        }

    # =====================================================
    # MOISTURE
    # =====================================================

    def estimate_moisture(self, brightness):
        if brightness < 0.25:
            return "wet"
        elif brightness < 0.40:
            return "moist"
        elif brightness < 0.60:
            return "moderate"
        return "dry"

    # =====================================================
    # FERTILITY (IMPROVED - NOT CONFIDENCE BASED)
    # =====================================================

    def estimate_fertility(self, soil_type, saturation, coarseness, uniformity):
        score = 0

        if soil_type in ["alluvial", "black"]:
            score += 40
        elif soil_type in ["red", "yellow"]:
            score += 25
        else:
            score += 15

        if saturation > 0.5:
            score += 25

        if uniformity > 0.7:
            score += 20

        if coarseness > 0.4:
            score += 15

        if score >= 75:
            return "high"
        elif score >= 50:
            return "medium"
        return "low"

    # =====================================================
    # CROP RULES
    # =====================================================

    CROP_RULES = {
        "alluvial": ["Rice", "Wheat", "Sugarcane", "Maize"],
        "black": ["Cotton", "Soybean", "Groundnut"],
        "red": ["Millets", "Groundnut", "Pulses"],
        "laterite": ["Tea", "Coffee", "Rubber"],
        "yellow": ["Mustard", "Maize"],
        "arid": ["Bajra", "Guar"],
        "mountain": ["Apple", "Tea", "Barley"]
    }

    def get_recommended_crops(self, soil_type, moisture, fertility):
        crops = self.CROP_RULES.get(soil_type, [])

        if moisture == "dry":
            crops = [c for c in crops if c not in ["Rice"]]

        if fertility == "high":
            return crops[:5]
        elif fertility == "medium":
            return crops[:4]
        return crops[:3]

    # =====================================================
    # MAIN FUNCTION
    # =====================================================

    def analyze_image(self, image_path: str) -> Dict:
        try:
            processed = self.preprocess_image(image_path)

            prediction = self.model.predict(processed, verbose=0)[0]

            idx = np.argmax(prediction)
            confidence = float(prediction[idx])

            soil_type = self.SOIL_TYPES[idx]

            color = self.analyze_color(image_path)
            texture = self.analyze_texture(image_path)

            moisture = self.estimate_moisture(color["brightness"])

            fertility = self.estimate_fertility(
                soil_type,
                color["saturation"],
                texture["coarseness"],
                texture["uniformity"]
            )

            crops = self.get_recommended_crops(
                soil_type,
                moisture,
                fertility
            )

            return {
                "soil_type": soil_type,
                "moisture": moisture,
                "fertility": fertility,
                "recommended_crops": crops,
                "confidence": round(confidence, 4),
                "analysis_data": {
                    "color": color,
                    "texture": texture
                },
                "all_probabilities": {
                    self.SOIL_TYPES[i]: float(prediction[i])
                    for i in range(len(self.SOIL_TYPES))
                },
                "analyzed_at": datetime.now().isoformat()
            }

        except Exception as e:
            return {
                "error": str(e),
                "soil_type": None,
                "confidence": 0
            }