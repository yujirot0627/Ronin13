---
name: ronin13
description: Reduces how much code gets written while keeping it readable and easy for someone else to change later. Use whenever writing, adding, fixing, refactoring, or reviewing code in any language, even when the request does not say "keep it simple" or mention code size.
---

## Before you write

1. Read the request and the code it touches, including the code that calls it. Look for an existing function, standard-library feature, or installed dependency that already does the job.
2. Before editing, enumerate where the change has to land: callers, tests, fixtures, configuration, and public interfaces.
3. Ask who the change could hurt: a caller that would break, data that would be lost, data that would leak.

"Smallest" in priority 3 below means the least change that lands in all of those places, never one that drops some of them. A dependent that breaks without an update belongs to the request; nearby code that is merely imperfect does not.

## Priorities

YAGNI, KISS, DRY, SOLID, and object-oriented design all serve one goal: code that is easy to change. They differ in when they add structure. YAGNI, KISS, and DRY remove code; SOLID and OOP, pushed hard, add classes and files. Structure built for a predicted future is the over-design YAGNI forbids, so add structure only when a need is real, and apply these principles through the order and triggers below rather than as slogans.

When principles conflict, decide in this order:

1. **Follow the project's existing conventions and the language's idioms.** Readers expect the patterns they already know. If every service in the codebase has an interface, give the new one an interface too, even where the triggers below would not.
2. **Make it readable by someone else and fixable in one place.** Give each function one job and keep its steps at one level of abstraction. The next person should find each piece of logic once and change it once.
3. **Make the smallest change that fully covers the request.** Every extra line is one more line to review and maintain.

Less code should be a result of these priorities, not a goal of its own. Don't compress code until it becomes hard to read.

## When to add structure

Structure means a shared helper, interface, base class, wrapper, new file, or new layer. Add it only when one of these triggers is met; otherwise write the code directly.

- **Third copy of the same knowledge: extract.** Code that looks alike is not always the same knowledge; the test is whether the copies change for the same reason. Extract only when a third copy appears and all three pass that test, so the next fix lands in one place. If unsure, keep the duplication, because a wrong abstraction is harder to undo than a copy. When you extract, replace the two existing copies with the minimal edit, unless tests don't cover them well enough to replace safely; then write only the new code as the shared helper and leave the copies.
- **Second reason to change: split by responsibility.** When a function or file would change for two unrelated reasons, separate them. Split by responsibility, not line count: a long file with one job stays whole, and a short file with two jobs gets split. When your change would add a second responsibility to a file, put it in its own file. Leave existing mixed files alone unless the task requires touching them.
- **Real need to swap implementations: add an interface.** Introduce an interface or inheritance only when swapping implementations is an actual requirement. While there is one implementation, call it directly.

Apply object-oriented principles only where the language and the project are written in an object-oriented style. There, compose small parts instead of inheriting, and keep inheritance to one level unless the codebase's conventions call for more, because deep hierarchies spread one change across many classes. In a function-oriented codebase, follow its style: plain functions and modules instead of classes.

Examples:

- Third copy: price formatting is written inline in the cart and the invoice. Leave both. When the receipt needs it too, extract `formatPrice()` and use it in all three places.
- One implementation: asked to save reports to disk, write `saveReport(path, report)`. Don't add a `ReportStorage` interface with a single `FileReportStorage`; add it when a second target, such as S3, is actually requested.
- Responsibility: `invoice.py` calculates totals. Asked to add PDF export, put it in `invoice_pdf.py`, because tax rules and page layout change for different reasons.

## Things to avoid

Each habit below adds code someone has to read and maintain. Do the alternative instead.

- **Adding features or options nobody asked for** → implement only the request.
- **Abstractions or wrappers with one implementation** → write the code directly.
- **Defensive code for cases that cannot happen** → validate only at boundaries, such as user input, files, and external APIs.
- **Optimizing without evidence** → write it correct and readable first. Optimize only when a measurement shows the need or the request asks for it.
- **Comments and docstrings that restate the code** → let names say what the code does, and comment only where the reason behind it isn't obvious.
- **Removing or rewriting code whose purpose you don't know** → first find out why it exists from git log, its callers, and its tests. If it's still unclear, leave it.
- **Fixing a bug only on the path it was reported from** → before editing a function, find all of its callers. Correct the root cause once in the shared code: that diff is smaller than a guard in each caller, and it leaves no sibling caller with the same fault. When other callers might depend on the current behavior and you can't rule that out, for example because there are many callers or no tests, fix only the reported path.
- **Mixing concerns or rewriting nearby code** → put one concern in each change and touch only what the request needs, so the diff is easy to review and to revert.
- **Hard-coding values to pass tests, or deleting or weakening tests** → write an implementation that is correct in general. Keep every existing test; a failing test is telling you something about the code.

Keep these even when trimming, because the harm from cutting them outweighs any saving in size:

- Input validation at boundaries
- Error handling that prevents data loss
- Security
- Accessibility
- Anything the request explicitly asks for
- A minimal test that checks the behavior you changed

## Final checklist

Before reporting the work as done, check each item. When reviewing someone else's change, use the same list as review criteria.

- [ ] It follows the project's conventions and the language's idioms.
- [ ] Every new helper, interface, base class, file, or layer meets a trigger in "When to add structure".
- [ ] The change reaches every place listed in "Before you write" and nothing beyond the request: one concern, no optimization without evidence, and nearby code untouched unless the request needed it.
- [ ] Existing code, the standard library, and installed dependencies were checked before writing new code, and no code of unknown purpose was removed or rewritten.
- [ ] Boundary validation, data-loss error handling, security, and accessibility are intact.
- [ ] A test covers the changed behavior, and no test was deleted or weakened.
- [ ] Each function does one job, and each piece of logic lives in one place where a reader can find and fix it.

## Report

After a reply that changes code, close with one or two lines on what you left out, what you didn't verify, and what risk the code's users should know about. Include whichever apply: ideas you didn't build, copies you merged into a shared helper or duplication you kept, mixed-responsibility files you left alone, code of unknown purpose you kept, and sibling callers still exposed to a bug you fixed on one path. State only facts about this change; when there is nothing to flag, say that plainly rather than adding boilerplate caveats. Replies that don't change code need no report.
