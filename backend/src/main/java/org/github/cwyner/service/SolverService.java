package org.github.cwyner.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.github.cwyner.dto.PuzzleDto;
import org.github.cwyner.dto.SolutionDto;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SolverService {
    private final WordlistService wordlistService;
    private boolean isRequiredLetterUsed;

    public SolverService(WordlistService wordlistService) {
        this.wordlistService = wordlistService;
    }

    public SolutionDto solve(PuzzleDto puzzle) {
        Set<String> words = wordlistService.getWords();

        char requiredLetter = puzzle.getRequiredLetter().charAt(0);

        // Initialize new HashMap for letter lookup
        HashMap<Character, Integer> letterMap = new HashMap<>();
        for (int i = 0; i < puzzle.getLetters().length; i++) {
            letterMap.put(puzzle.getLetters()[i].charAt(0), 1);
        }

        List<String> validWords = new ArrayList<>();

        /*
         * Main logic loop:
         * Iterate through every single word in the wordlist (outer loop).
         * Reset boolean flag to false at the beginning of outer loop.
         * Start to iterate through every character in the current word (inner loop).
         * If we see the required letter, set the boolean flag to true and continue.
         * If a character is not in the letterMap, set boolean flag to false and break.
         * If we finish the inner loop without setting the flag to false, add the word
         * to the solutions list.
         */
        for (String word : words) {
            isRequiredLetterUsed = false;
            for (int i = 0; i < word.length(); i++) {
                char currChar = word.charAt(i);
                if (currChar == requiredLetter) {
                    isRequiredLetterUsed = true;
                    continue;
                }
                if (!letterMap.containsKey(currChar)) {
                    // We set the boolean flag to false so the word can't pass the conditional below
                    isRequiredLetterUsed = false;
                    break;
                }
            }
            if (isRequiredLetterUsed == true) {
                validWords.add(word);
            }
        }
        // Create the SolutionDto with the updated list of valid words.
        SolutionDto solutions = new SolutionDto();
        solutions.setSolutions(validWords);
        return solutions;
    }
}
