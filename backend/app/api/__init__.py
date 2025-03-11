from fastapi import APIRouter
from . import graph

router = APIRouter(prefix="/api")

router.include_router(graph.router)