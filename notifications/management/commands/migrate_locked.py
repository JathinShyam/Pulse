"""Run migrations behind a PostgreSQL advisory lock.

A Kubernetes Deployment may start several web pods at once. Each pod's init
container runs this command, but only one can hold the lock, so Django's
migration history cannot be updated concurrently. SQLite (local tests) has no
advisory lock and is used by a single process, so it runs directly.
"""

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection

# Stable application-specific lock id. Chosen once; changing it would only
# affect concurrent migrations during a rollout.
MIGRATION_LOCK_ID = 0x50554C53


class Command(BaseCommand):
    help = "Apply database migrations under a PostgreSQL advisory lock."

    def handle(self, *args, **options):
        if connection.vendor != "postgresql":
            call_command("migrate", interactive=False, verbosity=1)
            return

        connection.ensure_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_advisory_lock(%s)", [MIGRATION_LOCK_ID])
        try:
            call_command("migrate", interactive=False, verbosity=1)
        finally:
            with connection.cursor() as cursor:
                cursor.execute("SELECT pg_advisory_unlock(%s)", [MIGRATION_LOCK_ID])
