from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
#from data import views as data_views

urlpatterns = [
    #url(r'^data-series/$', data_views.DataSeriesList.as_view(), name="data-series-list"),
    #url(r'^data-series/(?P<pk>[0-9]+)/$', data_views.DataSeriesDetail.as_view(), name="data-series-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
