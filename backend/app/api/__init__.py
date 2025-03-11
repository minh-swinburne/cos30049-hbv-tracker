from fastapi import APIRouter
from . import auth
from . import graph

router = APIRouter(prefix="/api")

router.include_router(auth.router)
router.include_router(graph.router)