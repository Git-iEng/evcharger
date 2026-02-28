# In iEngApp/urls.py
from django.urls import path
from . import views
from .views import contact_section
app_name = 'cmmsApp'
from .views import request_demo_view

urlpatterns = [
    path("contact/", views.contact, name="contact"),
    # path('contacts/', views.contact_section, name='contact_section'),
    path('contact/thanks/', views.contact_thanks, name='contact_thanks'),
    path("sitemap.xml", views.sitemap, name="sitemap"),
    path("request-demo/", views.request_demo_view, name="request_demo"),
    # path("contact-thanks/", views.thanks_view, name="contact_thanks"),  # if you add a separate thanks view for demo
    path('', views.home, name='home'),

    path('', views.home, name='home'),
    path('products/', views.products, name='products'),
    path('about/', views.about, name='about'),
    path("contact/submit/", views.contact_block_submit, name="contact_submit"),
    path("contact/phone-info/", views.phone_info, name="phone_info"),
    path('dc-charging-station/', views.dc_charging_station, name='dc-charging-station'),
    path('ac-charging-station/', views.ac_charging_station, name='ac-charging-station'),
    path('emr-charging-station/', views.emr_charging_station, name='emr-charging-station'),
    path('product/ac-charging-station/', views.ac_charging_station, name='ac-charging-station'),
    path('product/dc-charging-station/', views.dc_charging_station, name='dc-charging-station'),
    path('product/emr-charging-station/', views.emr_charging_station, name='emr-charging-station'),
    path("contact/country-list/", views.country_list, name="country_list"),
    path('portable-charging-station/', views.portable_charging_station, name='portable_charging_station'),
   
    path('pantograph-system/', views.pantograph_system, name='pantograph_system'),
    path('product/portable-charging-station/', views.portable_charging_station, name='portable_charging_station'),
    path('product/pantograph-system/', views.pantograph_system, name='pantograph_system'),
    # contact section
    path('contact/', views.contact, name='contact'),
    path('emr-charging-station/contact/', views.contact, name='contact'),
    path('portable-charging-station/contact/', views.contact, name='contact'),
    path('pantograph-system/contact/', views.contact, name='contact'),
]
