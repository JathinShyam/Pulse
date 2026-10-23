FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

# System dependencies are kept minimal: psycopg[binary] ships wheels and
# WhiteNoise serves static files from the application container.
RUN addgroup --system pulse \
    && adduser --system --ingroup pulse --no-create-home pulse

COPY requirements/ requirements/
RUN pip install --no-cache-dir -r requirements/production.txt

COPY . .

# Bake static assets into the image. collectstatic does not need database
# access, but Django requires a SECRET_KEY when DEBUG is off.
RUN SECRET_KEY=build-only-not-a-runtime-secret \
    DEBUG=False \
    python manage.py collectstatic --noinput \
    && chown -R pulse:pulse /app

USER pulse

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/', timeout=3)"

CMD ["gunicorn", "pulse.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "60", \
     "--no-control-socket", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
