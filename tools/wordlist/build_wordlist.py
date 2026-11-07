"""Build the backend's Spelling Bee word list from the raw source list.

Pipeline (see README.md for the reasoning behind each step):
  1. Structural filters: 4+ letters, a-z only, at most 7 distinct letters, no "s".
  2. Words in data/manual_keep.txt are always kept from here on.
  3. Frequency: drop words never seen in real English text (wordfreq Zipf score of 0).
  4. Dictionary classification (Webster's 1934, data/web2), checked in this order:
       - lowercase dictionary word                            -> keep
       - only ever capitalized there, or in data/propernames  -> drop (proper noun)
       - inflection of a lowercase dictionary word            -> keep
       - not in the dictionary at all                         -> "unknown"
  5. Unknown words: keep unless listed in data/llm_drops.tsv (LLM review decisions).

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


def main() -> None:
    raw = json.loads(SOURCE.read_text())
    words = sorted({w.strip().lower() for w in raw if w and w.strip()})

    web2 = (DATA / "web2").read_text().split()
    lowercase_dict = {w for w in web2 if w.islower()}
    capital_only = {w.lower() for w in web2 if w[0].isupper()} - lowercase_dict
    proper_names = {w.lower() for w in (DATA / "propernames").read_text().split()} - lowercase_dict

    manual_keep = set((DATA / "manual_keep.txt").read_text().split())

    llm_drops = {}
    for line in (DATA / "llm_drops.tsv").read_text().splitlines():
        if line.strip():
            word, code = line.split("\t")
            llm_drops[word] = code

    reasons = Counter()
    kept = []
    for word in words:
        if not passes_structure(word):
            reasons["structure"] += 1
        elif word in manual_keep:
            kept.append(word)
        elif zipf_frequency(word, "en") == 0:
            reasons["never seen"] += 1
        elif word in lowercase_dict:
            kept.append(word)
        elif word in capital_only or word in proper_names:
            reasons["proper noun (dictionary)"] += 1
        elif any(b in lowercase_dict for b in base_forms(word)):
            kept.append(word)
        elif word in llm_drops:
            reasons[f"llm review ({llm_drops[word]})"] += 1
        else:
            kept.append(word)

    OUTPUT.write_text(json.dumps(kept, indent=4) + "\n")

    print(f"source words: {len(words):,}")
    for reason, count in sorted(reasons.items(), key=lambda kv: -kv[1]):
        print(f"  dropped, {reason}: {count:,}")
    print(f"kept: {len(kept):,} -> {OUTPUT.relative_to(HERE.parents[1])}")


if __name__ == "__main__":
    main()
