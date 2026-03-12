# NOTE: This script will save a new wordlist.json into assets/ in the root folder.
# You must manually move this newly generated wordlist into backend's resources folder.

import json

data = {}

# This block attempts to open the dictionary.json file and turn it into a Python JSON object
try:
    with open("../assets/dictionary.json", "r") as file:
        data = json.load(file)
except FileNotFoundError:
    print("Error: Could not find 'dictionary.json'.")
except json.JSONDecodeError:
    print("Error: Could not decode JSON from the file.")

# Save the keys (the words minus their definitions) into a dict keys object, then drop all the words with spaces or hyphens
word_list = data.keys()
filtered_word_list = [w for w in word_list if " " not in w and "-" not in w]

# Save the filtered word list to a JSON array
try:
    with open("../assets/wordlist.json", "w", encoding="utf-8") as file:
        json.dump(filtered_word_list, file, ensure_ascii=False, indent=4)
except FileNotFoundError:
    print("Error: Could not find 'wordlist.json'.")
