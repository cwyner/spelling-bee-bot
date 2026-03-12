package org.github.cwyner.service;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@ApplicationScoped
public class WordlistService {
    private static final String WORDLIST_RESOURCE = "wordlist.json";

    private Set<String> words = Set.of();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    void init() {
        words = loadWords();
    }

    private Set<String> loadWords() {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(WORDLIST_RESOURCE);
        if (inputStream == null) {
            throw new IllegalStateException("Could not find classpath resource: " + WORDLIST_RESOURCE);
        }

        try (inputStream) {
            List<String> rawWords = objectMapper.readValue(inputStream, new TypeReference<List<String>>() {
            });
            Set<String> normalized = new LinkedHashSet<>(rawWords.size());
            for (String word : rawWords) {
                if (word == null) {
                    continue;
                }
                String cleaned = word.trim().toLowerCase(Locale.ROOT);
                if (cleaned.isEmpty()) {
                    continue;
                }
                normalized.add(cleaned);
            }
            return Set.copyOf(normalized);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read " + WORDLIST_RESOURCE, e);
        }
    }

    public Set<String> getWords() {
        return words;
    }

}
