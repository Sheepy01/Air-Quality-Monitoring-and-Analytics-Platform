from django.urls import path
from .views import (
    dashboard_summary,
    district_comparison,
    yearly_trend,
    monthly_trend,
    aqi_summary,
    dashboard_overview,
    district_dashboard,
    filter_options,
    pollution_days,
    chat_ai  
)

urlpatterns = [
    path("dashboard/", dashboard_summary),
    path("district-comparison/", district_comparison),
    path("yearly-trend/", yearly_trend),
    path("monthly-trend/", monthly_trend),
    path("aqi-summary/", aqi_summary),
    path("dashboard-overview/", dashboard_overview),
    path("district-dashboard/", district_dashboard),
    path("filters/", filter_options),
    path("pollution-days/", pollution_days),
    path("chat/", chat_ai),
]