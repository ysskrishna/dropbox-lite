import boto3
from core.config import Config
from botocore.exceptions import ClientError
from typing import BinaryIO
import asyncio
from functools import partial

class S3Client:
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=Config.AWS_S3_ENDPOINT_URL,
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
            region_name=Config.AWS_REGION
        )
        self.bucket_name = Config.AWS_S3_BUCKET_NAME
        self._ensure_bucket_exists()

    
    def _ensure_bucket_exists(self) -> None:
        try:
            self.client.head_bucket(Bucket=self.bucket_name)
        except ClientError:
            self.client.create_bucket(Bucket=self.bucket_name)


    async def upload_fileobj(self, file_obj: BinaryIO, object_name: str, extra_args: dict = {}) -> str:
        # Run the blocking S3 upload in a thread pool
        # Ref: https://joelmccoy.medium.com/python-and-boto3-performance-adventures-synchronous-vs-asynchronous-aws-api-interaction-22f625ec6909
        await asyncio.get_event_loop().run_in_executor(
            None,
            partial(
                self.client.upload_fileobj,
                file_obj,
                self.bucket_name,
                object_name,
                ExtraArgs=extra_args
            )
        )
        
        return object_name

