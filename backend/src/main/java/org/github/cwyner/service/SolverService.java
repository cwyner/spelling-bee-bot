package org.github.cwyner.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.github.cwyner.dto.PuzzleDto;
import org.github.cwyner.dto.SolutionsDto;
import org.github.cwyner.dto.WordDto;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SolverService {
    private final WordlistService wordlistService;

    public SolverService(WordlistService wordlistService) {
        this.wordlistService = wordlistService;
    }

    public SolutionsDto solve(PuzzleDto puzzle) {
        Set<String> words = wordlistService.getWords();

        char requiredLetter = puzzle.requiredLetter().charAt(0);

        Map<Character, Integer> letterMap = new HashMap<>();
        for (int i = 0; i < puzzle.outerLetters().size(); i++) {
            letterMap.put(puzzle.outerLetters().get(i).charAt(0), 1);
        }

        List<WordDto> validWords = new ArrayList<>();
        boolean isRequiredLetterUsed;
        for (String word : words) {
            if (word.length() <= 3) {
                continue;
            }
            Map<Character, Integer> seen = new HashMap<>();
            isRequiredLetterUsed = false;
            for (int i = 0; i < word.length(); i++) {
                char currChar = word.charAt(i);
                if (currChar == requiredLetter) {
                    seen.put(currChar, 1);
                    isRequiredLetterUsed = true;
                    continue;
                }
                if (!letterMap.containsKey(currChar)) {
                    isRequiredLetterUsed = false;
                    break;
                }
                seen.put(currChar, 1);
            }
            if (isRequiredLetterUsed == true) {
                if (seen.size() == 7) {
                    WordDto validWord = new WordDto(word, true);
                    validWords.add(validWord);
                } else {
                    WordDto validWord = new WordDto(word, false);
                    validWords.add(validWord);
                }
            }
        }
        SolutionsDto solutions = new SolutionsDto(validWords);
        return solutions;
    }
}
