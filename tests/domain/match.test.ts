import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareScores,
  createMatchState,
  matchReducer,
  type MatchState,
} from "../../src/domain/match/index.ts";

function match(): MatchState {
  return createMatchState({
    id: "11111111-1111-4111-8111-111111111111",
    tournament: "Torneo de prueba",
    mat: "Tatami 1",
    division: "Adultos · Azul · Medio",
    mode: "gi",
    rulesetId: "ibjjf-standard",
    rulesetVersion: "2024.1",
    durationSeconds: 360,
    blue: { name: "Azul", academy: "A", belt: "azul" },
    red: { name: "Rojo", academy: "B", belt: "azul" },
  });
}

describe("dominio del combate", () => {
  it("suma los valores oficiales de puntuación", () => {
    let state = match();
    state = matchReducer(state, {
      type: "ADD_SCORE",
      corner: "blue",
      kind: "takedown",
    });
    state = matchReducer(state, {
      type: "ADD_SCORE",
      corner: "blue",
      kind: "guard_pass",
    });
    state = matchReducer(state, {
      type: "ADD_SCORE",
      corner: "blue",
      kind: "mount",
    });

    assert.equal(state.blueScore.points, 9);
  });

  it("registra puntos directos y permite etiquetarlos sin alterar el marcador", () => {
    let state = matchReducer(match(), {
      type: "ADD_SCORE",
      corner: "blue",
      kind: "points_2",
      eventId: "22222222-2222-4222-8222-222222222222",
    });
    state = matchReducer(state, {
      type: "TAG_EVENT",
      eventId: "22222222-2222-4222-8222-222222222222",
      kind: "sweep",
    });

    assert.equal(state.blueScore.points, 2);
    assert.equal(state.events[0].label, "Barrido");
  });

  it("escala la segunda y tercera penalización según IBJJF", () => {
    let state = match();
    for (let count = 0; count < 3; count += 1) {
      state = matchReducer(state, {
        type: "ADD_SCORE",
        corner: "red",
        kind: "penalty",
      });
    }

    assert.deepEqual(state.redScore, {
      points: 0,
      advantages: 0,
      penalties: 3,
    });
    assert.deepEqual(state.blueScore, {
      points: 2,
      advantages: 1,
      penalties: 0,
    });
  });

  it("recalcula el marcador al deshacer", () => {
    let state = matchReducer(match(), {
      type: "ADD_SCORE",
      corner: "blue",
      kind: "mount",
    });
    state = matchReducer(state, { type: "UNDO_LAST" });

    assert.equal(state.events.length, 0);
    assert.equal(state.blueScore.points, 0);
  });

  it("desempata por puntos, ventajas y menor número de faltas", () => {
    assert.equal(
      compareScores(
        { points: 4, advantages: 0, penalties: 0 },
        { points: 2, advantages: 8, penalties: 0 },
      ),
      "blue",
    );
    assert.equal(
      compareScores(
        { points: 2, advantages: 1, penalties: 2 },
        { points: 2, advantages: 0, penalties: 0 },
      ),
      "blue",
    );
    assert.equal(
      compareScores(
        { points: 2, advantages: 1, penalties: 2 },
        { points: 2, advantages: 1, penalties: 1 },
      ),
      "red",
    );
    assert.equal(
      compareScores(
        { points: 2, advantages: 1, penalties: 1 },
        { points: 2, advantages: 1, penalties: 1 },
      ),
      null,
    );
  });
});
