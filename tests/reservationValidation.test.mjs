import test from "node:test";
import assert from "node:assert/strict";
import { canReserveBook } from "../lib/reservationValidation.mjs";

test("allows reservation when the book still has stock", () => {
  assert.equal(canReserveBook({ remaining: 3, active: true }), true);
});

test("blocks reservation when the book is out of stock", () => {
  assert.equal(canReserveBook({ remaining: 0, active: true }), false);
});
