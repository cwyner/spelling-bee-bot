# Spelling Bee Bot

## Why I made this

Every morning I play the hit game **Spelling Bee** from the New York Times. What a great way to start my day! It's a unique sort of challenge and I love it when I manage to pull out a word that I didn't even know that I knew—isn't it amazing what the human mind can accomplish? And once I can't possibly think of any more words, I put the phone down and give myself a pat on the back for a job well done. Then, in the spirit of friendly competition, I click out of the game and compare my score with my sister's. Day ruined.

So I made this! A little passion project that could guarantee I never lose the **Spelling Bee** again.

## How it works

The Spelling Bee Bot is comprised of 2 microservices: a Quarkus backend and an Angular web UI. The backend exposes a single endpoint at https://whatever-the-URL-is/solver, which takes in a POST request whenever a user clicks "Solve Puzzle" in the web UI. The expected JSON body of said request is of the following form:

If you want to run this application locally, first clone the repo. Then, open two separate terminals. From the root folder of this project, run the following commands in the first terminal:

```
cd backend
mvn quarkus:dev
```

And then run these commands in the second terminal:

```
cd web-ui
npm install
npm start
```

Once the web UI is up and running, navigate to http://localhost:4200/ in your browser. Click the "Customize" button beneath the empty honeycomb, then click on a hex to input a character. Once all the hexes are filled, click "Done", and then "Solve Puzzle". Great! You've successfully solved the **Spelling Bee**!

## Current Release:

### Solver V2.0 (pushed on April 26th, 2026)

### Features

- Added Web UI :)

## Archived Releases: 

### Solver V1.1 (pushed on March 12th, 2026)

### Fixes from Previous Version

- Updated wordlist to contain all verb tenses. Solver will not miss words now but it heavily overestimates.

### Solver V1 (pushed on March 12th, 2026)

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
