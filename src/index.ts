// Expose types.
import { onUpdate, onComment } from "./handlers";

const UPDATE_EVENTS = [
  "issues.opened",
  "issues.edited",
  "issues.reopened",
  "pull_request.opened",
  "pull_request.edited",
  "pull_request.reopened"
];

const COMMENT_EVENTS = [
  "issue_comment.created",
  "pull_request_review_comment.created"
];

/**
 * Starts "needs-review" probot task.
 */
export default async function(robot) {
  robot.on(UPDATE_EVENTS, onUpdate);
  robot.on(COMMENT_EVENTS, onComment);
}
