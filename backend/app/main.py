from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging
from app.core.security import setup_cors

# from app.core.database import setup_database
from app.core.graph import setup_graph_db
from app.core.blockchain import setup_blockchain
from app.api import router

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.include_router(router)

setup_cors(app)
# setup_database()
setup_graph_db()
setup_blockchain()


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Hello": "World"}
