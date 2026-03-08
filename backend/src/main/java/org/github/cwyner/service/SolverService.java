package org.github.cwyner.service;

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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'solve'");
    }

}
