# Evals

Plan:

- `tasks/` holds real requests, one task per file.
- Run each task with and without the skill, using `claude -p` from a clean branch or git worktree every time, and compare.
- Metrics: lines written, files touched, and diff size on follow-up spec changes.
- On the "without" side, disable other style plugins such as Ponytail. Mixing them pollutes the comparison.
- Don't draw conclusions from a few results. Increase the run count to confirm.
