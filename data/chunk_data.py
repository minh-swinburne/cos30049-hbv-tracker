import pandas as pd

# Load the large CSV file
input_file = "data/cleaned_data.csv"  # Change this to your actual file path
chunk_size = 10_000  # Number of rows per chunk

# Read CSV in chunks
df = pd.read_csv(input_file)

# Split into chunks
for i, chunk in enumerate(range(0, len(df), chunk_size)):
    chunk_df = df.iloc[chunk : chunk + chunk_size]
    output_file = f"data/chunked_data_{i+1}.csv"
    chunk_df.to_csv(output_file, index=False)
    print(f"Saved: {output_file}")

print("✅ Chunked CSV file into smaller files!")
