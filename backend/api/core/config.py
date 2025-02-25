import os
from dotenv import load_dotenv

load_dotenv()


class Config(object):
    DATABASE_URL = os.getenv('DATABASE_URL')
