package org.github.cwyner.service;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Loads wordlist.json (built by tools/wordlist/build_wordlist.py) once at startup.
 * Each entry is a word plus whether it is common enough to be a likely NYT answer.
 */
@ApplicationScoped
public class WordlistService {
    private static final String WORDLIST_RESOURCE = "wordlist.json";

    /** One entry of wordlist.json. */
    record WordlistEntry(String word, boolean common) {
    }

    private Map<String, Boolean> commonByWord = Map.of();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    void init() {
        commonByWord = loadWords();
    }

    private Map<String, Boolean> loadWords() {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(WORDLIST_RESOURCE);
        if (inputStream == null) {
            throw new IllegalStateException("Could not find classpath resource: " + WORDLIST_RESOURCE);
        }

        try (inputStream) {
            List<WordlistEntry> entries = objectMapper.readValue(inputStream, new TypeReference<List<WordlistEntry>>() {
            });
            Map<String, Boolean> normalized = new HashMap<>(entries.size());
            for (WordlistEntry entry : entries) {
                if (entry == null || entry.word() == null) {
                    continue;
                }
                String cleaned = entry.word().trim().toLowerCase(Locale.ROOT);
                if (cleaned.isEmpty()) {
                    continue;
                }
                normalized.put(cleaned, entry.common());
            }
            return Map.copyOf(normalized);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read " + WORDLIST_RESOURCE, e);
        }
    }

    public Set<String> getWords() {
        return commonByWord.keySet();
    }

    /** Whether a word from {@link #getWords()} is common; unknown words count as not common. */
    public boolean isCommon(String word) {
        return commonByWord.getOrDefault(word, false);
    }

}
