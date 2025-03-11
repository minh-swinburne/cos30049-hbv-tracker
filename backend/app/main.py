from fastapi import FastAPI
from app.core.security import setup_cors
from app.core.database import setup_database
from app.core.graph import setup_graph_db
from app.api import router


app = FastAPI()
app.include_router(router)

setup_cors(app)
setup_database()
setup_graph_db()

@app.get("/")
def read_root():
    return {"Hello": "World"}