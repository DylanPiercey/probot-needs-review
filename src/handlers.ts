import { Types as T } from "./_types";
import { addLabel, findIssueForPR, includesLabel, loadConfig } from "./utils";

/**
 * Adds the "needs-review" label when an issue or pr is opened, edited, or reopened.
 */
export async function onUpdate(ctx: T.Context) {
  // istanbul ignore next
  if (ctx.isBot) {
    return;
  }

  const { label } = await loadConfig(ctx);
  const {
    pull_request,
    issue = await findIssueForPR(ctx, pull_request)
  } = ctx.payload;

  if (!includesLabel(issue, label)) {
    await addLabel(ctx, issue.number, label);
  }
}

/**
 * Adds the "needs-review" label when a new comment is added.
 * (This is skipped if the comment was from a contributor.)
 */
export async function onComment(ctx: T.Context) {
  // istanbul ignore next
  if (ctx.isBot) {
    return;
  }

  const { label } = await loadConfig(ctx);
  const { comment, issue } = ctx.payload;

  const hasExistingLabel = includesLabel(issue, label);
  const isCollaborator = await ctx.github.repos.checkCollaborator({
    ...ctx.repo(),
    username: comment.user.login
  });

  if (!hasExistingLabel && !isCollaborator) {
    await addLabel(ctx, issue.number, label);
  }
}
