# Stage 1: Build the application using uv
FROM ghcr.io/astral-sh/uv:python3.11-alpine AS builder

# Environment variables for uv
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Set the working directory
WORKDIR /app

# Cache uv dependencies and bind pyproject.toml & uv.lock for reproducibility
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync --frozen --no-install-project --no-dev

# Copy the application code
ADD . /app

# Final dependency synchronization
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Stage 2: Create a minimal runtime image
FROM python:3.11-alpine

# Set a non-root user for better security
RUN addgroup -S app && adduser -S app -G app

# Set the working directory
WORKDIR /app

# Install necessary dependencies for FastAPI
RUN apk add --no-cache libstdc++ libffi

# Copy application from builder stage with correct ownership
COPY --from=builder --chown=app:app /app /app

# Set environment variables
ENV PYTHONPATH=/app
ENV PATH="/app/.venv/bin:$PATH"
ENV TEMPLATES_PATH=/app/apiv1/prompts

# Expose the application port
EXPOSE 8000

# Set user to avoid running as root
USER app

# Command to run the FastAPI application
CMD ["uvicorn", "apiv1.main:app", "--host", "0.0.0.0", "--port", "8000"]
