---
name: ronin13
description: Writes the minimum code that satisfies the request, in a form that is readable and easy for someone else to change later. Use whenever writing, adding, fixing, refactoring, or reviewing code in any language, even when the request does not say "keep it simple" or mention code size.
---

Write only the minimum code that satisfies the request. Don't add features or abstractions nobody asked for.
Before writing anything new, check whether something that already exists does the job: the project's own code, built-in features of the language or platform, or an installed dependency.
When reviewing code, apply these same rules.

## Before you write

1. Read the request and the code it touches, including the code that calls it.
2. Before editing, enumerate where the change has to land: callers, tests, fixtures, configuration, and public interfaces.
3. Ask who the change could hurt: a caller that would break, data that would be lost, data that would leak.

"Minimum" means the least change that lands in all of those places, not one that drops some of them. A dependent that breaks without an update belongs to the request.

## Priorities

YAGNI, KISS, DRY, and SOLID all serve one goal: code that is easy to change. YAGNI, KISS, and DRY remove code; SOLID, pushed hard, adds classes and files. Structure built for a predicted future is the over-design YAGNI forbids, so apply these principles through the order and triggers below rather than as slogans.

When principles conflict, decide in this order:

1. **Follow the project's existing conventions and the language's idioms.** Readers expect the patterns they already know. If every service in the codebase has an interface, give the new one an interface too, even where the triggers below would not.
2. **Write the minimum code that fully covers the request.**

## Constraints

Readability and ease of change are constraints on every change, not priorities to trade against size. Don't compress code until it becomes hard to read.

To keep code readable:

- Name things for what they hold or do.
- Return early to keep nesting shallow.
- Avoid tricks a reader has to decode.
- Declare each variable close to where it is first used.

To keep code easy to change, write each piece of knowledge in one place, so one change to the spec takes one edit.

Make each function a unit a reader can understand from top to bottom. If understanding it means going back and forth between two functions, merge them. One job is a reason to separate code, not a reason to cut it into small pieces.

## When to add structure

Structure means a shared helper, interface, base class, wrapper, new file, or new layer. Add it only when one of these triggers is met; otherwise write the code directly.

- **Third copy of the same knowledge: extract.** Code that looks alike is not always the same knowledge; the test is whether the copies change for the same reason. Extract only when a third copy appears and all three pass that test, so the next fix lands in one place. If unsure, keep the duplication, because a wrong abstraction is harder to undo than a copy. When you extract, replace the two existing copies with the minimal edit: a helper only some copies use hides the rest from the next fix. If you can't do that safely (a large edit, or behavior you can't confirm unchanged), don't extract; write the third copy.
- **Second reason to change: split by responsibility.** When a function or file would change for two unrelated reasons, separate them. Split by responsibility, not line count: a long file with one job stays whole, and a short file with two jobs gets split. When your change would add a second responsibility to a file, put it in its own file. Leave existing mixed files alone unless the task requires touching them.
- **Real need to swap implementations: add an interface.** Introduce an interface or inheritance only when swapping implementations is an actual requirement. While there is one implementation, call it directly.

Examples:

- Third copy: price formatting is written inline in the cart and the invoice. Leave both. When the receipt needs it too, extract `formatPrice()` and use it in all three places.
- One implementation: asked to save reports to disk, write `saveReport(path, report)`. Don't add a `ReportStorage` interface with a single `FileReportStorage`; add it when a second target, such as S3, is actually requested.
- Responsibility: `invoice.py` calculates totals. Asked to add PDF export, put it in `invoice_pdf.py`, because tax rules and page layout change for different reasons.

## Things to avoid

Each habit below adds code someone has to read and maintain. Do the alternative instead.

- **Defensive code for cases that cannot happen** → validate only at boundaries, such as user input, files, and external APIs.
- **Optimizing without evidence** → write it correct and readable first. Optimize only when a measurement shows the need or the request asks for it.
- **Comments and docstrings that restate the code** → let names say what the code does, and comment only where the reason behind it isn't obvious.
- **Removing or rewriting code whose purpose you don't know** → first find out why it exists from git log, its callers, and its tests. If it's still unclear, leave it.
- **Fixing a bug only on the path it was reported from** → before editing a function, find all of its callers. Correct the root cause once in the shared code: that diff is smaller than a guard in each caller, and it leaves no sibling caller with the same fault. Fix only the reported path when another caller's code or tests show it relies on current behavior. Missing tests are not that evidence: otherwise untested code would never get the root-cause fix. Read every caller closely.
- **Mixing concerns or rewriting nearby code** → put one concern in each change and touch only what the request needs, so the diff is easy to review and to revert. Tidy only the lines you wrote or changed; leave unrelated lines alone.
- **Hard-coding values to pass tests, or deleting or weakening tests** → write an implementation that is correct in general. Keep every existing test; a failing test is telling you something about the code.

Keep these even when trimming, because the harm from cutting them outweighs any saving in size:

- Input validation at boundaries
- Error handling that prevents data loss
- Security
- Accessibility
- Anything the request explicitly asks for
- Tests for new or changed non-trivial logic, written the way the existing tests are. Trivial changes need no new test.
