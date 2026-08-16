import assert from "node:assert/strict";
import test from "node:test";
import { levels, totalChallengeCount } from "../app/challenge-data";

test("every mission is complete, uniquely addressable, and answerable", () => {
  assert.equal(levels.length, 6);
  assert.equal(totalChallengeCount, 52);

  const ids = new Set<string>();
  for (const [levelIndex, level] of levels.entries()) {
    assert.equal(level.id, levelIndex + 1);
    assert.ok(level.challenges.length >= 8);

    for (const [challengeIndex, challenge] of level.challenges.entries()) {
      assert.equal(challenge.number, challengeIndex + 1);
      assert.equal(challenge.id, `l${level.id}-c${challenge.number}`);
      assert.equal(ids.has(challenge.id), false, `duplicate ${challenge.id}`);
      ids.add(challenge.id);

      assert.ok(challenge.title.trim());
      assert.ok(challenge.objective.trim());
      assert.ok(challenge.briefing.trim());
      assert.ok(challenge.manual.length >= 2, `${challenge.id} needs a useful manual`);
      assert.ok(challenge.hints.length >= 2, `${challenge.id} needs staged hints`);
      assert.ok(challenge.evidence.length >= 1, `${challenge.id} needs evidence`);

      if (challenge.kind === "choice") {
        assert.equal(typeof challenge.answer, "string");
        assert.ok(challenge.options?.some((item) => item.id === challenge.answer), `${challenge.id} choice answer is not selectable`);
      }
      if (challenge.kind === "multi" || challenge.kind === "order") {
        assert.ok(Array.isArray(challenge.answer));
        const optionIds = new Set(challenge.options?.map((item) => item.id));
        for (const answer of challenge.answer as string[]) {
          assert.ok(optionIds.has(answer), `${challenge.id} answer ${answer} is not selectable`);
        }
      }
      if (challenge.kind === "text") assert.equal(typeof challenge.answer, "string");
      if (challenge.kind === "terminal") {
        assert.equal(typeof challenge.answer, "string");
        assert.ok(challenge.terminal && Object.keys(challenge.terminal).length >= 3);
      }
    }
  }
  assert.equal(ids.size, 52);
});

test("difficulty and research demands increase in the later stages", () => {
  const averages = levels.map(
    (level) =>
      level.challenges.reduce((total, challenge) => total + challenge.points, 0) /
      level.challenges.length,
  );
  for (let index = 1; index < averages.length; index += 1) {
    assert.ok(averages[index] > averages[index - 1]);
  }

  assert.ok(levels[4].challenges.filter((challenge) => challenge.research).length >= 2);
  assert.ok(levels[5].challenges.filter((challenge) => challenge.research).length >= 4);
  assert.ok(levels[5].challenges.some((challenge) => challenge.skill === "Incident leadership"));
});
