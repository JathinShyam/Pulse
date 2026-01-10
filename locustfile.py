"""
Locust Load Testing for Pulse Notification System

This script simulates users sending notifications through the Pulse API
to stress test the system and measure throughput, latency, and reliability.

Usage:
    # Via Docker Compose
    docker-compose up -d locust
    # Open http://localhost:8089

    # Locally
    locust -f locustfile.py --host http://localhost:8000

Target: 10K-15K successful requests/min with <1% failure rate

Load Test Scenarios:
1. send_notification - Standard notification sends (weighted 10)
2. send_otp - High-priority OTP notifications (weighted 5)  
3. check_status - Status checks on sent notifications (weighted 2)
4. list_notifications - List recent notifications (weighted 1)
"""

import random
import uuid
from typing import Optional

from locust import HttpUser, between, task


class PulseNotificationUser(HttpUser):
    """
    Simulated user that sends notifications through Pulse API.
    
    Configurable wait time between requests to simulate realistic traffic patterns.
    Default: 0.5-2.0 seconds between requests per user.
    
    For aggressive load testing, reduce wait_time to between(0.1, 0.5)
    """
    
    wait_time = between(0.5, 2.0)
    
    # Store notification IDs for status checks
    sent_notification_ids: list = []
    
    # Test data
    CHANNELS = ["email", "sms", "push"]
    
    # Templates - should exist in your database
    STANDARD_TEMPLATES = [
        "welcome_email",
        "order_confirmation", 
        "newsletter",
        "password_reset",
        "account_update",
    ]
    
    OTP_TEMPLATES = [
        "otp_verification",
        "otp_sms",
        "login_otp",
    ]
    
    # Sample recipients
    EMAIL_DOMAINS = ["example.com", "test.com", "loadtest.dev", "pulse.test"]
    PHONE_PREFIXES = ["+1555", "+1666", "+1777", "+1888"]
    
    def on_start(self):
        """Initialize user session."""
        self.user_id = f"load_user_{uuid.uuid4().hex[:8]}"
        self.sent_notification_ids = []
    
    def _generate_email(self) -> str:
        """Generate random test email."""
        return f"user_{uuid.uuid4().hex[:8]}@{random.choice(self.EMAIL_DOMAINS)}"
    
    def _generate_phone(self) -> str:
        """Generate random test phone number."""
        return f"{random.choice(self.PHONE_PREFIXES)}{random.randint(1000000, 9999999)}"
    
    def _get_recipient(self, channel: str) -> str:
        """Get appropriate recipient based on channel."""
        if channel == "email":
            return self._generate_email()
        elif channel == "sms":
            return self._generate_phone()
        elif channel == "push":
            return f"device_token_{uuid.uuid4().hex[:16]}"
        else:
            return self._generate_email()
    
    @task(10)
    def send_notification(self):
        """
        Send a standard notification (most common operation).
        Weight: 10 - highest frequency task
        """
        channel = random.choice(self.CHANNELS)
        template = random.choice(self.STANDARD_TEMPLATES)
        
        payload = {
            "user_id": self.user_id,
            "template_name": template,
            "to": self._get_recipient(channel),
            "channel": channel,
            "context": {
                "subject": f"Load Test - {template}",
                "name": "LoadTest User",
                "message": f"Test notification at {uuid.uuid4().hex[:8]}",
            },
            "idempotency_key": str(uuid.uuid4()),
        }
        
        with self.client.post(
            "/api/notifications/send/",
            json=payload,
            name="/api/notifications/send/ [standard]",
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 202]:
                try:
                    data = response.json()
                    notification_id = data.get("notification_id")
                    if notification_id and len(self.sent_notification_ids) < 100:
                        self.sent_notification_ids.append(notification_id)
                    response.success()
                except Exception:
                    response.success()  # Still count as success if response is OK
            elif response.status_code == 429:
                # Rate limited - expected under heavy load
                response.failure("Rate limited (429)")
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(5)
    def send_otp(self):
        """
        Send high-priority OTP notification.
        Weight: 5 - less frequent but tests priority queue
        """
        channel = random.choice(["sms", "email"])
        template = random.choice(self.OTP_TEMPLATES)
        
        payload = {
            "user_id": self.user_id,
            "template_name": template,
            "to": self._get_recipient(channel),
            "channel": channel,
            "context": {
                "otp": f"{random.randint(100000, 999999)}",
                "code": f"{random.randint(100000, 999999)}",
                "expires_in": "5 minutes",
            },
            "idempotency_key": str(uuid.uuid4()),
        }
        
        with self.client.post(
            "/api/notifications/send/",
            json=payload,
            name="/api/notifications/send/ [otp]",
            catch_response=True
        ) as response:
            if response.status_code in [200, 201, 202]:
                response.success()
            elif response.status_code == 429:
                response.failure("Rate limited (429)")
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(2)
    def check_status(self):
        """
        Check status of a previously sent notification.
        Weight: 2 - occasional status checks
        """
        if not self.sent_notification_ids:
            return  # No notifications to check yet
        
        notification_id = random.choice(self.sent_notification_ids)
        
        with self.client.get(
            f"/api/notifications/status/{notification_id}/",
            name="/api/notifications/status/[id]/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            elif response.status_code == 404:
                # Might be cleaned up - remove from list
                if notification_id in self.sent_notification_ids:
                    self.sent_notification_ids.remove(notification_id)
                response.success()  # Expected behavior
            else:
                response.failure(f"Unexpected status: {response.status_code}")
    
    @task(1)
    def list_notifications(self):
        """
        List recent notifications for user.
        Weight: 1 - least frequent
        """
        with self.client.get(
            f"/api/notifications/list/?user_id={self.user_id}&limit=10",
            name="/api/notifications/list/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Unexpected status: {response.status_code}")


class AggressiveLoadUser(PulseNotificationUser):
    """
    Aggressive load tester with minimal wait time.
    Use for stress testing to find breaking points.
    
    WARNING: This will generate very high load!
    """
    wait_time = between(0.1, 0.3)


class BurstLoadUser(PulseNotificationUser):
    """
    Burst traffic simulator - alternates between high and low activity.
    Useful for testing auto-scaling behavior.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.burst_mode = False
        self.request_count = 0
    
    @property
    def wait_time(self):
        """Dynamic wait time - fast during bursts, slow otherwise."""
        self.request_count += 1
        
        # Toggle burst mode every 50 requests
        if self.request_count % 50 == 0:
            self.burst_mode = not self.burst_mode
        
        if self.burst_mode:
            return between(0.1, 0.3)
        return between(1.0, 3.0)


# Convenience classes for specific test scenarios

class EmailOnlyUser(PulseNotificationUser):
    """Test email channel exclusively."""
    CHANNELS = ["email"]


class SMSOnlyUser(PulseNotificationUser):
    """Test SMS channel exclusively."""
    CHANNELS = ["sms"]


class HighPriorityOnlyUser(PulseNotificationUser):
    """Test only high-priority (OTP) notifications."""
    
    @task(1)
    def send_notification(self):
        """Override to only send OTP."""
        self.send_otp()
    
    @task(0)
    def send_otp(self):
        """Disabled - merged into send_notification."""
        pass
