package org.github.cwyner;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;

@QuarkusTest
class SolverResourceTest {
    // NYT puzzle with required letter P and outer letters G I N O T V; its only pangram is "pivoting".
    private static final String PUZZLE = """
            {"requiredLetter": "P", "outerLetters": ["G", "I", "N", "O", "T", "V"]}
            """;

    @Test
    void solvesPuzzleWithPangramAndPoints() {
        given().contentType(ContentType.JSON).body(PUZZLE)
                .when().post("/solver")
                .then()
                .statusCode(200)
                .body("solutions.size()", greaterThan(0))
                .body("solutions.word", hasItem("point"))
                .body("solutions.word", everyItem(org.hamcrest.Matchers.containsString("p")))
                .body("solutions.find { it.word == 'pivoting' }.pangram", is(true))
                .body("solutions.find { it.word == 'pivoting' }.points", is(15))
                .body("solutions.find { it.word == 'ping' }.points", is(1))
                .body("solutions.find { it.word == 'potion' }.points", is(6));
    }

    @Test
    void marksWordsAsCommonOrLessCommon() {
        given().contentType(ContentType.JSON).body(PUZZLE)
                .when().post("/solver")
                .then()
                .statusCode(200)
                .body("solutions.find { it.word == 'point' }.common", is(true))
                .body("solutions.find { it.word == 'pipit' }.common", is(false));
    }

    @Test
    void excludesWordsMissingTheRequiredLetter() {
        given().contentType(ContentType.JSON).body(PUZZLE)
                .when().post("/solver")
                .then()
                .statusCode(200)
                .body("solutions.word", not(hasItem("tint")));
    }

    @Test
    void rejectsPuzzleWithDuplicateLetters() {
        given().contentType(ContentType.JSON)
                .body("""
                        {"requiredLetter": "P", "outerLetters": ["G", "I", "N", "O", "T", "P"]}
                        """)
                .when().post("/solver")
                .then()
                .statusCode(400);
    }

    @Test
    void rejectsPuzzleWithWrongNumberOfLetters() {
        given().contentType(ContentType.JSON)
                .body("""
                        {"requiredLetter": "P", "outerLetters": ["G", "I", "N", "O", "T"]}
                        """)
                .when().post("/solver")
                .then()
                .statusCode(400);
    }
}
