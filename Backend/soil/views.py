from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SoilTest
from .utils import analyze_soil

import pandas as pd   # ✅ NEW


class UploadSoil(APIView):
    def post(self, request):
        try:
            image = request.FILES.get('image')
            data_file = request.FILES.get('data_file')
            notes = request.data.get('notes')

            # ✅ REAL ANALYSIS (CSV or default)
            if data_file:
                df = pd.read_csv(data_file)
                row = df.iloc[0].to_dict()   # first row
                result = analyze_soil(row)
            else:
                result = analyze_soil({})

            # ✅ SAVE TO DATABASE
            SoilTest.objects.create(
                image=image,
                data_file=data_file,
                notes=notes,
                ph=result["ph"],
                nitrogen=result["nitrogen"],
                phosphorus=result["phosphorus"],
                potassium=result["potassium"],
                moisture=result["moisture"],
                soil_score=result["soil_score"],
                organic_matter=result["organic_matter"]
            )

            return Response({
                "message": "Uploaded",
                "data": result
            })

        except Exception as e:
            print("ERROR:", e)
            return Response({"error": str(e)}, status=500)


class LatestSoil(APIView):
    def get(self, request):
        soil = SoilTest.objects.last()

        # ✅ IF NO DATA
        if not soil:
            return Response({
                "soil_score": 0,
                "ph": 0,
                "moisture": 0,
                "nitrogen": 0,
                "phosphorus": 0,
                "potassium": 0,
                "organic_matter": 0
            })

        # ✅ RETURN FULL DATA
        return Response({
            "soil_score": soil.soil_score,
            "ph": soil.ph,
            "moisture": soil.moisture,
            "nitrogen": soil.nitrogen,
            "phosphorus": soil.phosphorus,
            "potassium": soil.potassium,
            "organic_matter": soil.organic_matter
        })


class History(APIView):
    def get(self, request):
        data = SoilTest.objects.all().order_by('-created_at')

        result = []
        for d in data:
            result.append({
                "date": d.created_at.strftime("%d %b %Y"),
                "ph": d.ph,
                "nitrogen": d.nitrogen,
                "phosphorus": d.phosphorus,
                "potassium": d.potassium,
                "soil_score": d.soil_score
            })

        return Response(result)