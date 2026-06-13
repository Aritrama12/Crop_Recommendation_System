"""
ASGI config for crop_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""
# print("ASGI FILE STARTED")
import os
# from channels.auth import AuthMiddlewareStack
from settings.jwt_middleware import (
    JWTAuthMiddleware
)
from channels.routing import (
    ProtocolTypeRouter,
    URLRouter,
)

from django.core.asgi import get_asgi_application

from settings.routing import (
    websocket_urlpatterns,
)

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "crop_backend.settings"
)

django_asgi_app = get_asgi_application()

# print("ASGI FILE LOADED")

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,

        "websocket": JWTAuthMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        ),
    }
)
