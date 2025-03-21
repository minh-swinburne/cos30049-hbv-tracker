from fastapi import APIRouter
# from . import auth
from . import graph
from . import blockchain

router = APIRouter(prefix="/api")

# router.include_router(auth.router)
router.include_router(graph.router)
router.include_router(blockchain.router)