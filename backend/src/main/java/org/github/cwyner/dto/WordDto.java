package org.github.cwyner.dto;

/**
 * One solution word.
 *
 * @param common whether the word is common enough to be a likely NYT answer; the UI shows
 *               uncommon words in a separate "less common" section
 */
public record WordDto(String word, boolean pangram, int points, boolean common) {
}
