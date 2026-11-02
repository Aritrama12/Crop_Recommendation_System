# from urllib.parse import parse_qs

# from channels.db import database_sync_to_async
# from django.contrib.auth.models import AnonymousUser

# from rest_framework_simplejwt.tokens import AccessToken

# from django.contrib.auth import get_user_model

# User = get_user_model()


# @database_sync_to_async
# def get_user(user_id):
#     try:
#         return User.objects.get(id=user_id)
#     except User.DoesNotExist:
#         return AnonymousUser()


# class JWTAuthMiddleware:

#     def __init__(self, inner):
#         self.inner = inner


#     async def __call__(
        
#         self,
#         scope,
#         receive,
#         send
#     ):

#         query_string = (
#             scope["query_string"]
#             .decode()
#         )

#         query_params = parse_qs(
#             query_string
#         )

#         token = (
#             query_params.get(
#                 "token",
#                 [None]
#             )[0]
#         )

#         if token:

#             try:

#                 access_token = (
#                     AccessToken(token)
#                 )

#                 user = await get_user(
#                     access_token["user_id"]
#                 )

#                 scope["user"] = user

#             except Exception:

#                 scope["user"] = (
#                     AnonymousUser()
#                 )

#         else:

#             scope["user"] = (
#                 AnonymousUser()
#             )

#         return await self.inner(
#             scope,
#             receive,
#             send
#         )


import logging
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError

logger = logging.getLogger(__name__)
User = get_user_model()


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        scope["user"] = AnonymousUser()

        query_params = parse_qs(
            scope.get("query_string", b"").decode("utf-8")
        )
        token = query_params.get("token", [None])[0]

        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token["user_id"]
                user = await get_user(user_id)
                scope["user"] = user

                if user.is_anonymous:
                    logger.warning(
                        "WebSocket authentication failed: user not found."
                    )
                else:
                    logger.info(
                        "WebSocket authentication successful for user ID %s.",
                        user.pk,
                    )

            except (TokenError, KeyError, TypeError, ValueError) as exc:
                logger.warning(
                    "WebSocket JWT validation failed: %s",
                    type(exc).__name__,
                )
            except Exception:
                logger.exception(
                    "Unexpected error during WebSocket authentication."
                )
        else:
            logger.warning(
                "WebSocket connection received without a token."
            )

        return await self.inner(scope, receive, send)
