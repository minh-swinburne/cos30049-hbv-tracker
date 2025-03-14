import pandas as pd
from sqlalchemy import create_engine

DB_HOST = "swinburne-db.cr8e2ca2ig9i.ap-southeast-2.rds.amazonaws.com"
DB_USER = "cos30049_user"
DB_PASS = "cos30049-swb"
DB_NAME = "cos30049"
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
FILENAME = "hepb_data_long.parquet"

def read_parquet_file(filename):
    return pd.read_parquet(f"data/{filename}")

def read_csv_file(filename):
    return pd.read_csv(f"data/{filename}")

# Read parquet file
df = (
    read_parquet_file(FILENAME)
    if FILENAME.endswith(".parquet")
    else read_csv_file(FILENAME)
)

# Create a connection to the database
engine = create_engine(DB_URL)

# Write the data to the database
df.to_sql("hepb_data", con=engine, if_exists="replace", index=False, chunksize=5000)
