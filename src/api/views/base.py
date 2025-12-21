from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser,  AllowAny, IsAuthenticated

from src.core.models import *
from src.api.serializers import *


class BaseViewSet(ReadOnlyModelViewSet):
    """
    A base view set that provides default `list()`, `create()`, `retrieve()`,
    `update()`, and `destroy()` actions.
    """
