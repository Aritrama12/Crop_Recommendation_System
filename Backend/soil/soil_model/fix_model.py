import json
import zipfile
import shutil
import os

OLD_MODEL = "best_clean.keras"
TEMP_DIR = "temp_model"
NEW_MODEL = "best_fixed.keras"



# delete old temp folder
if os.path.exists(TEMP_DIR):
    shutil.rmtree(TEMP_DIR)

os.makedirs(TEMP_DIR)

# unzip .keras file
with zipfile.ZipFile(OLD_MODEL, 'r') as zip_ref:
    zip_ref.extractall(TEMP_DIR)

print("Extracted model")

# open config
config_path = os.path.join(TEMP_DIR, "config.json")

with open(config_path, "r", encoding="utf-8") as f:
    config = json.load(f)


def remove_quantization(obj):
    if isinstance(obj, dict):
        obj.pop("quantization_config", None)
        for v in obj.values():
            remove_quantization(v)
    elif isinstance(obj, list):
        for item in obj:
            remove_quantization(item)


remove_quantization(config)

with open(config_path, "w", encoding="utf-8") as f:
    json.dump(config, f)

print("Removed quantization_config")

# zip again
shutil.make_archive("best_fixed", "zip", TEMP_DIR)
os.rename("best_fixed.zip", NEW_MODEL)

print("DONE -> best_fixed.keras")