import fastparquet

try:
    df = fastparquet.ParquetFile("data/hepb_data_long.parquet").to_pandas()
    print(df.head())
except Exception as e:
    print(f"Error: {e}")
