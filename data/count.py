import pandas as pd

# Load the cleaned CSV file
input_file = "data/cleaned_data.csv"  # Change this to your actual file path

# Read CSV
df = pd.read_csv(input_file)

# Find pid with the most vaccinations
pid_counts = df["pid"].value_counts()
most_vaccinations = pid_counts.idxmax()

print(f"Patient ID with the most vaccinations: {most_vaccinations}")