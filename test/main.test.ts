import * as sinon from "sinon";
import * as assert from "assert";
import * as merge from "deepmerge";
import { events, robot } from "./util";

describe("Probot: Needs-Review", () => {
  describe("Issues", () => {
    it("add label on open", async () => {
      await checkLabelAddedToIssue(events["issue-opened"], true);
    });

    it("add label on reopen", async () => {
      await checkLabelAddedToIssue(events["issue-reopened"], true);
    });

    it("add label on edited", async () => {
      await checkLabelAddedToIssue(events["issue-edited"], true);
    });

    it("do nothing when label already exists", async () => {
      await checkLabelAddedToIssue(events["issue-edited-with-label"], false);
    });

    /**
     * Emits a fake github webhook and ensures that the needs-review label was added.
     */
    async function checkLabelAddedToIssue(event, expected) {
      const addLabels = sinon.spy();
      const github = { issues: { addLabels } };

      robot.use(github);
      await robot.receive(event);

      assert.equal(
        expected,
        addLabels.calledWith({
          owner: "framework-xyz",
          repo: "xyz-website",
          number: 1,
          labels: ["status:needs-review"]
        })
      );
    }
  });

  describe("Issue Comment", () => {
    it("add label on create", async () => {
      await checkLabelAddedToIssue(events["issue-comment-created"], true);
    });

    it("do nothing when label already exists", async () => {
      await checkLabelAddedToIssue(
        events["issue-comment-created-with-label"],
        false
      );
    });

    it("do nothing on contributor comments", async () => {
      await checkLabelAddedToIssue(
        events["issue-comment-created-from-contributor"],
        false
      );
    });

    async function checkLabelAddedToIssue(event, expected) {
      const addLabels = sinon.spy();
      const github = {
        repos: {
          checkCollaborator: ({ username }) => username === "DylanPiercey"
        },
        issues: { addLabels }
      };

      robot.use(github);
      await robot.receive(event);

      assert.equal(
        expected,
        addLabels.calledWith({
          owner: "framework-xyz",
          repo: "xyz-website",
          number: 1,
          labels: ["status:needs-review"]
        })
      );
    }
  });

  describe("PullRequests", () => {
    it("add label on open", async () => {
      await checkLabelAddedToPR(events["pr-opened"], true, {
        issues: {
          get: sinon.stub().returns({
            number: 3
          })
        }
      });
    });

    it("add label on reopen", async () => {
      await checkLabelAddedToPR(events["pr-reopened"], true, {
        issues: {
          get: sinon.stub().returns({
            number: 3
          })
        }
      });
    });

    it("add label on edited", async () => {
      await checkLabelAddedToPR(events["pr-edited"], true, {
        issues: {
          get: sinon.stub().returns({
            number: 3
          })
        }
      });
    });

    it("do nothing when label already exists", async () => {
      await checkLabelAddedToPR(events["pr-edited-with-label"], false, {
        issues: {
          get: sinon.stub().returns({
            number: 3,
            labels: [
              {
                name: "status:needs-review"
              }
            ]
          })
        }
      });
    });

    /**
     * Emits a fake github webhook and ensures that the needs-review label was added.
     */
    async function checkLabelAddedToPR(event, expected, stubs?) {
      const addLabels = sinon.spy();
      const github = merge({ issues: { addLabels } }, stubs);

      robot.use(github);
      await robot.receive(event);

      assert.equal(
        expected,
        addLabels.calledWith({
          owner: "framework-xyz",
          repo: "xyz-website",
          number: 3,
          labels: ["status:needs-review"]
        })
      );
    }
  });

  describe("PullRequest Comment", () => {
    it("add label on create", async () => {
      await checkLabelAddedToPR(events["pr-comment-created"], true);
    });

    it("do nothing when label already exists", async () => {
      await checkLabelAddedToPR(events["pr-comment-created-with-label"], false);
    });

    it("do nothing on contributor comments", async () => {
      await checkLabelAddedToPR(
        events["pr-comment-created-from-contributor"],
        false
      );
    });

    async function checkLabelAddedToPR(event, expected) {
      const addLabels = sinon.spy();
      const github = {
        repos: {
          checkCollaborator: ({ username }) => username === "DylanPiercey"
        },
        issues: { addLabels }
      };

      robot.use(github);
      await robot.receive(event);

      assert.equal(
        expected,
        addLabels.calledWith({
          owner: "framework-xyz",
          repo: "xyz-website",
          number: 3,
          labels: ["status:needs-review"]
        })
      );
    }
  });
});
