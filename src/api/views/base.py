from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser,  AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.contrib.auth.models import AnonymousUser

from src.core.models import *
from src.api.serializers import *
from src.api.views.utils import can_user_open_lesson


class BaseViewSet(ReadOnlyModelViewSet):
    """
    A base view set that provides default `list()`, `create()`, `retrieve()`,
    `update()`, and `destroy()` actions.
    """
