from sqlalchemy import  Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_mixin

from core.dbutils import Base

@declarative_mixin
class Timestamp:
    created_at = Column(DateTime, default=func.now(), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)


class File(Timestamp, Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)
    content_type = Column(String, nullable=True)

