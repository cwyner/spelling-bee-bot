# Spelling Bee Bot

## Why I made this

Every morning I play the hit game **Spelling Bee** from the New York Times. What a great way to start my day! It's a unique sort of challenge and I love it when I manage to pull out a word that I didn't even know that I knew—isn't it amazing what the human mind can accomplish? And once I can't possibly think of any more words, I put the phone down and give myself a pat on the back for a job well done. Then, in the spirit of friendly competition, I click out of the game and compare my score with my sister's. Day ruined.

So I made this! A little passion project that could guarantee I never lose the **Spelling Bee** again.

## How it works

The Spelling Bee Bot is a Quarkus application that can solve any Spelling Bee puzzle. It exposes a single endpoint at https://whatever-the-URL-is/solver, which takes in a POST request. The expected JSON body of said request is of the following form:

```
{
    "letters": ["t", "l", "w", "e", "o", "d", "n"],
    "requiredLetter": "n"
}
```

In this example request, notice the required letter (the center letter of the Spelling Bee puzzle) is also included in the array of letters in this request. This is actually not required. Omitting the required letter from the array will still give the same results, as long as it is properly denoted in the JSON's `requiredLetter` field. The eventual goal for this project is for it to become a fully-fledged web-app, where the Quarkus `backend` service receives these requests automatically from a webpage, so you, the person reading this, does not have to worry about building such JSON requests.

But you can if you want to! Just clone this GitHub repo (or download it as a .zip file or whatever you wanna do to get the code on your computer), then from the root folder in a terminal, run:

```
cd backend
mvn quarkus:dev
```

Now you're running the backend in dev mode! This is entirely sufficient to use the solver, no web UI required. Just open another terminal and make a cURL request to the /solver endpoint. If you didn't touch `application.properties`, then your cURL request should look like this:

```
curl -X POST http://localhost:8080/solver \
  -H "Content-Type: application/json" \
  -d '{
    "letters": ["t", "l", "w", "e", "o", "d", "n"],
    "requiredLetter": "n"
  }'
```

Done! You've successfully solved the **Spelling Bee**!

## Current Release: Solver V1.1 (pushed on March 12th, 2026)

### Fixes from Previous Version

- Updated wordlist to contain all verb tenses. Solver will not miss words now but it heavily overestimates.

## Archived Releases: Solver V1 (pushed on March 12th, 2026)

### Summary

The Solver V1 solution implements a pretty naive solution to the Spelling Bee challenge, but it works! In fact, despite being naive, it works much faster than I initially thought it would. As such, I'm not sure if there is really any need to tweak the algorithm for speed since it did not even take a second to complete. I have been brainstorming some optimizations to reduce the average number of operations, but I have not convinced myself yet that they would even be better. I might consider taking a look at other kinds of optimizations though, like minimizing the amount of things or the size of the things Quarkus has to inject/resolve at startup.

### New Features

- Added PuzzleDto, SolutionDto, and WordlistDto to properly deserialize JSON request bodies into POJOs and vice versa.
- Added SolverResource to expose the endpoint that receives the information of the puzzle, and invokes the solve() method in SolverService.
- Added SolverService which contains the logic that "solves" the Spelling Bee puzzle, returning a List of valid Strings wrapped in a SolutionDto.
- Added WordlistService which loads wordlist.json once at startup and normalizes the words into a Java Set\<String>.

### Known Issues

- Solutions list contains many words which are unconventional/wacky (but still logically correct) and not accepted by the Spelling Bee. This is okay for now because I'd rather overestimate than underestimate, but it would be nice to clean this up in the future.
- Solutions list contains words with 3 or fewer characters, which are not accepted by the Spelling Bee.
- Wordlist does not contain words in different verb tenses (i.e. it contains endow but not endowed) since it is based off a dictionary. It would be nice to just be able to replace the wordlist with one that does contain all verb tenses, but if it does not exist, then I might have to find a way to programatically add these words to the current wordlist.
- Solver will still return solutions if the required letter sent in the request body is not in the array of other letters. This is not a valid puzzle format so it shouldn't return solutions. But it also doesn't really matter.

### Fixes from Previous Version

- N/A

### Still to Come

- Web UI
- Scoring
- Optimizations (?)
