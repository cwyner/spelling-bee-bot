"""Build the backend's Spelling Bee word list from the raw source list.

Pipeline (see README.md for the reasoning behind each step):
  1. Structural filters: 4+ letters, a-z only, at most 7 distinct letters, no "s".
  2. Words in data/manual_keep.txt are always kept, and added even if the source lacks them.
  3. Frequency: drop words never seen in real English text (wordfreq Zipf score of 0).
  4. Dictionary classification (Webster's 1934, data/web2), checked in this order:
       - lowercase dictionary word                            -> keep, unless in data/archaic_drops.tsv
       - only ever capitalized there, or in data/propernames  -> drop as a proper noun,
                                                                 unless listed in data/name_rescues.txt
       - inflection of a lowercase dictionary word            -> keep, unless in data/archaic_drops.tsv
       - not in the dictionary at all                         -> "unknown"
  5. Unknown words: keep unless listed in data/llm_drops.tsv (LLM review decisions).

Each kept word is written as {"word": ..., "common": ...}. A word is "common" when its frequency, or
the frequency of its base word (optioning -> option), is at least COMMON_THRESHOLD. The UI shows
uncommon words in a separate, grayed-out section.

Usage (from the repo root):
  pip install -r tools/wordlist/requirements.txt
  python tools/wordlist/build_wordlist.py
"""

import json
import re
from collections import Counter
from pathlib import Path

from wordfreq import zipf_frequency

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
SOURCE = DATA / "source_wordlist.json"
OUTPUT = HERE.parents[1] / "backend" / "src" / "main" / "resources" / "wordlist.json"

# Zipf score below which a word is shown as "less common". Measured on three NYT puzzles (see README):
# 2.0 moves about 57% of extra words into the less-common section, along with about 14% of real answers.
COMMON_THRESHOLD = 2.0

INFLECTIONS = [
    ("ied", "y"), ("ier", "y"), ("iest", "y"), ("ily", "y"), ("ies", "y"),
    ("ing", ""), ("ing", "e"), ("ed", ""), ("ed", "e"), ("d", ""),
    ("er", ""), ("er", "e"), ("est", ""), ("est", "e"), ("ly", ""),
    ("ness", ""), ("ment", ""), ("able", ""), ("able", "e"),
]


def passes_structure(word: str) -> bool:
    return (
        len(word) >= 4                       # NYT minimum word length
        and re.fullmatch(r"[a-z]+", word) is not None
        and len(set(word)) <= 7              # must fit in a 7-letter puzzle
        and "s" not in word                  # NYT puzzles never include S
    )


def base_forms(word: str) -> list[str]:
    """Candidate base words for common English inflections (tapped -> tap, tried -> try)."""
    out = []
    for suffix, replacement in INFLECTIONS:
        if word.endswith(suffix) and len(word) - len(suffix) >= 3:
            base = word[: -len(suffix)] + replacement
            out.append(base)
            if len(base) > 3 and base[-1] == base[-2]:
                out.append(base[:-1])
    return out


def commonness(word: str) -> float:
    """Frequency of the word, or of its most frequent base form, so rare inflections of common words count as common."""
    return max([zipf_frequency(word, "en")] + [zipf_frequency(b, "en") for b in base_forms(word)])


def read_drops(path: Path) -> dict[str, str]:
    """Read a word<TAB>code file of LLM review decisions."""
    drops = {}
    for line in path.read_text().splitlines():
        if line.strip():
            word, code = line.split("\t")
            drops[word] = code
    return drops


def main() -> None:
    raw = json.loads(SOURCE.read_text())
    words = sorted({w.strip().lower() for w in raw if w and w.strip()})

    web2 = (DATA / "web2").read_text().split()
    lowercase_dict = {w for w in web2 if w.islower()}
    capital_only = {w.lower() for w in web2 if w[0].isupper()} - lowercase_dict
    proper_names = {w.lower() for w in (DATA / "propernames").read_text().split()} - lowercase_dict

    manual_keep = set((DATA / "manual_keep.txt").read_text().split())
    name_rescues = set((DATA / "name_rescues.txt").read_text().split())

    llm_drops = read_drops(DATA / "llm_drops.tsv")
    archaic_drops = read_drops(DATA / "archaic_drops.tsv")

    reasons = Counter()
    kept = []
    for word in words:
        if not passes_structure(word):
            reasons["structure"] += 1
        elif word in manual_keep:
            kept.append(word)
        elif zipf_frequency(word, "en") == 0:
            reasons["never seen"] += 1
        elif word in capital_only or word in proper_names:
            if word in name_rescues:
                kept.append(word)
            else:
                reasons["proper noun (dictionary)"] += 1
        elif word in lowercase_dict or any(b in lowercase_dict for b in base_forms(word)):
            if word in archaic_drops:
                reasons[f"archaic review ({archaic_drops[word]})"] += 1
            else:
                kept.append(word)
        elif word in llm_drops:
            reasons[f"llm review ({llm_drops[word]})"] += 1
        else:
            kept.append(word)

    # Manual keeps are added even when the source list lacks them (e.g. modern words like "clickbait").
    source_set = set(words)
    added = sorted(w for w in manual_keep if w not in source_set and passes_structure(w))
    kept = sorted(set(kept) | set(added))

    entries = [{"word": w, "common": commonness(w) >= COMMON_THRESHOLD} for w in kept]
    OUTPUT.write_text("[\n" + ",\n".join(json.dumps(e) for e in entries) + "\n]\n")

    print(f"source words: {len(words):,}")
    for reason, count in sorted(reasons.items(), key=lambda kv: -kv[1]):
        print(f"  dropped, {reason}: {count:,}")
    print(f"  added from manual_keep.txt (not in source): {len(added):,}")
    uncommon = sum(1 for e in entries if not e["common"])
    print(f"kept: {len(kept):,} ({uncommon:,} less common, below {COMMON_THRESHOLD}) "
          f"-> {OUTPUT.relative_to(HERE.parents[1])}")


if __name__ == "__main__":
    main()
