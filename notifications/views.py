from rest_framework import mixins, status, viewsets
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationRequestSerializer, NotificationResponseSerializer
from .tasks import dispatch_notification


class NotificationViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationRequestSerializer
    lookup_field = 'id'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        dispatch_notification.delay(str(notification.id))
        response_serializer = NotificationResponseSerializer(notification)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_202_ACCEPTED, headers=headers)
