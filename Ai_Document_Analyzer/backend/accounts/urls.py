from django.urls import path
from .views import register_view, login_view, upload_document,my_documents,system_check

urlpatterns = [
    path("register/", register_view),
    path("login/", login_view),
 



    path(
        "api/document-analyze/",
        upload_document,
        name="upload"
    ),
    path(
        "my-documents/",
        my_documents,
        name="my_documents"
    ),path("system-check/", system_check),
    
   
]
