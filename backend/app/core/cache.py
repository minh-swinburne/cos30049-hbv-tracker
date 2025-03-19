import redis.asyncio as redis
import json
from app.core.settings import settings

redis_client = redis.Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    db=settings.redis_db,
    decode_responses=True,
)

async def get_cache(key: str) -> dict:
    value = await redis_client.get(key)
    return json.loads(value) if value else None

async def set_cache(key: str, value: dict) -> None:
    json_value = json.dumps(value)
    await redis_client.set(key, json_value)