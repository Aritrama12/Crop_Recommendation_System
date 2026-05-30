from django.contrib import admin

from .models import (
    PlantingRecord,
    HarvestRecord,
    SaleRecord,
    ExpenseRecord,
    ResourceUsage
)

admin.site.register(PlantingRecord)
admin.site.register(HarvestRecord)
admin.site.register(SaleRecord)
admin.site.register(ExpenseRecord)
admin.site.register(ResourceUsage)