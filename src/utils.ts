import { Types as T } from "./_types";

const DEFAULT_CONFIG: T.Config = {
  label: "status:needs-review"
};

/**
 * Gets the current config for a repo and assigns defaults.
 */
export async function loadConfig(ctx: T.Context): Promise<T.Config> {
  try {
    const config: T.Config = await ctx.config("needs-review.yml");
    // istanbul ignore next
    return { ...DEFAULT_CONFIG, ...config };
  } catch (err) {
    return DEFAULT_CONFIG;
  }
}

/**
 * Finds the issue data based on a PR number.
 * This is needed because label data is not stored on the PR object.
 */
export async function findIssueForPR(
  ctx: T.Context,
  { number }: T.PullRequest
): Promise<T.Issue> {
  return await ctx.github.issues.get({ ...ctx.repo(), number });
}

/**
 * Check if an issue or pullrequest contains a label.
 */
export function includesLabel(
  { labels = [] }: T.Issue | T.PullRequest,
  label
): boolean {
  return labels.some(({ name }) => name === label);
}

/**
 * Adds a label to an issue or pr.
 */
export async function addLabel(
  ctx: T.Context,
  number: number,
  label: string
): Promise<void> {
  await ctx.github.issues.addLabels({
    ...ctx.repo(),
    number,
    labels: [label]
  });
}
