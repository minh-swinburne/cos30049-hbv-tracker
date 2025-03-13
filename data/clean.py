import pandas as pd

# Load CSV from GitHub (or change to local file path)
url = "https://raw.githubusercontent.com/minh-swinburne/cos30049-hbv-tracker/refs/heads/full/data/data/sampled_data.csv"
df = pd.read_csv(url)

# Fill missing 'vacplace' with "Other"
df["vacplace"] = df["vacplace"].fillna("-", inplace=True)
# Replace missing or incorrect 'vacplace_type' with "Other"
df["vacplace_type"] = df["vacplace_type"].replace(
    ["Dia diem khac", None, "nan"], "Khác", inplace=True
)

# Save cleaned data
cleaned_file_path = "data/cleaned_data.csv"
df.to_csv(cleaned_file_path, index=False)

print(f"✅ Cleaned CSV saved as: {cleaned_file_path}")
