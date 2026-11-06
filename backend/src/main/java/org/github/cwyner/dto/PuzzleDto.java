package org.github.cwyner.dto;

import java.util.List;
import java.util.Locale;

public record PuzzleDto(String requiredLetter, List<String> outerLetters) {
    public PuzzleDto {
        if (requiredLetter == null) {
            throw new IllegalArgumentException("requiredLetter is required");
        }
        if (outerLetters == null || outerLetters.size() != 6) {
            throw new IllegalArgumentException("Need exactly 6 outer letters");
        }

        requiredLetter = requiredLetter.toLowerCase(Locale.ROOT);
        outerLetters = outerLetters.stream().map(l -> l == null ? null : l.toLowerCase(Locale.ROOT)).toList();

        requireSingleLetter(requiredLetter);
        boolean[] seen = new boolean[26];
        seen[requiredLetter.charAt(0) - 'a'] = true;
        for (String letter : outerLetters) {
            requireSingleLetter(letter);
            int index = letter.charAt(0) - 'a';
            if (seen[index]) {
                throw new IllegalArgumentException("The letters of the puzzle cannot contain duplicates");
            }
            seen[index] = true;
        }
    }

    private static void requireSingleLetter(String s) {
        if (s == null || s.length() != 1 || s.charAt(0) < 'a' || s.charAt(0) > 'z') {
            throw new IllegalArgumentException("Each letter must be a single character a-z: " + s);
        }
    }

}
