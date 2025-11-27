from httpx import AsyncClient
from fastapi import status
from app.main import app
import pytest


@pytest.mark.asyncio
async def test_healthz():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get("/healthz")
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json() == {"ok": True}


