package org.github.cwyner.dto;

import lombok.Data;

@Data
public class PuzzleDto {
    public String[] letters;
    public String requiredLetter;
}
