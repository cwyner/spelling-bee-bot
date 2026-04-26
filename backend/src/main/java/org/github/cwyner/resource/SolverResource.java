package org.github.cwyner.resource;

import org.github.cwyner.dto.PuzzleDto;
import org.github.cwyner.dto.SolutionsDto;
import org.github.cwyner.service.SolverService;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/solver")
public class SolverResource {
    private final SolverService solverService;

    public SolverResource(SolverService solverService) {
        this.solverService = solverService;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public SolutionsDto solve(PuzzleDto puzzle) {
        return solverService.solve(puzzle);
    }
}
