import re

# Validation constants
USERNAME_MIN_LENGTH = 8
PASSWORD_PATTERN = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).*$"
)


def validate_username(username: str) -> bool:
    """
    Validate username is at least 8 characters long
    """
    return len(username) >= USERNAME_MIN_LENGTH


def validate_password(password: str) -> bool:
    """
    Validate password has at least:
    - 1 lowercase character
    - 1 uppercase character
    - 1 special character
    """
    return bool(PASSWORD_PATTERN.match(password))
