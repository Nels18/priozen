module.exports = {
  pattern:
    '^(main|develop)$|^(feat|feature|fix|hotfix|release|test|refactor|wip|experimental|merge|chore|docs|perf|ci|build|style|revert)/.+$',
  errorMsg:
    '🤨 The branch you are trying to push does not respect our conventions, you can rename it with `git branch -m <current-name> <new-name>`',
};
