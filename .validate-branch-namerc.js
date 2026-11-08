// Branch naming rule, checked locally by the Husky pre-push hook and on every
// pull request by .github/workflows/branch-name.yml (single source of truth).
//
// <type>/<Jira key>[-description], e.g. feat/PRIO-19-dash-02-liste-quadrants.
// The Jira key (uppercase) lets Jira link the branch, its commits and the PR.
// PRIO-XX is accepted for work without a ticket.
module.exports = {
  pattern:
    '^(main|develop)$|^(feat|feature|fix|hotfix|release|test|refactor|wip|experimental|merge|chore|docs|perf|ci|build|style|revert)/PRIO-(\\d+|XX)(-[a-z0-9]+)*$',
  errorMsg:
    '🤨 Branch names follow <type>/PRIO-<number>[-description] (e.g. feat/PRIO-19-dash-02-liste-quadrants, or PRIO-XX without a ticket). Rename it with `git branch -m <current-name> <new-name>`',
};
