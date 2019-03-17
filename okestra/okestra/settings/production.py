from .base import *
import os

ALLOWED_HOSTS = ["okestra.io"]

DEBUG = False

SECRET_KEY = os.getenv("SECRET_KEY")
