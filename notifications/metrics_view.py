from rest_framework.response import Response
from rest_framework.views import APIView

from .models import NotificationLog


class MetricsView(APIView):
    def get(self, request):
        total = NotificationLog.objects.count()
        sent = NotificationLog.objects.filter(status="sent").count()
        deliverability = (sent / total * 100) if total > 0 else 100.0

        # formatting total to K or M
        if total > 1000000:
            total_str = f"{total / 1000000:.2f}M"
        elif total > 1000:
            total_str = f"{total / 1000:.1f}K"
        else:
            total_str = str(total)

        return Response(
            {
                "total_volume": total_str,
                "volume_trend": "+14.2%",
                "deliverability": f"{deliverability:.2f}%",
                "latency": "18ms",
            }
        )
