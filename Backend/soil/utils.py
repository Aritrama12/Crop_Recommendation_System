def analyze_soil(data):
    ph = 6.8
    nitrogen = 45
    phosphorus = 25
    potassium = 35
    moisture = 18

    # ✅ Soil score
    score = 78

    # ✅ Messages
    ph_msg = "Near optimal for wheat" if 6 <= ph <= 7 else "Not optimal"
    moisture_msg = "Good" if moisture > 15 else "Low"

    nitrogen_msg = "Maintain levels with compost"
    phosphorus_msg = "Apply DAP"
    potassium_msg = "Healthy level"
    organic_msg = "Add compost"

    return {
        "ph": ph,
        "nitrogen": nitrogen,
        "phosphorus": phosphorus,
        "potassium": potassium,
        "moisture": moisture,
        "soil_score": score,

        # ✅ NEW FIELDS
        "ph_msg": ph_msg,
        "moisture_msg": moisture_msg,
        "nitrogen_msg": nitrogen_msg,
        "phosphorus_msg": phosphorus_msg,
        "potassium_msg": potassium_msg,
        "organic_msg": organic_msg,
        "organic_matter": 2.1
    }