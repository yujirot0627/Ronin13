# Ronin13

A Claude Code plugin that gets Claude to write less code that people can read and change later. YAGNI, KISS, and DRY come first. SOLID-style structure is added only when it is actually needed.

## Status

Early experimental version. No evaluation showing its effect has been published yet.

## Install

```
/plugin marketplace add yujirot0627/Ronin13
/plugin install ronin13@ronin13
```

## How it works

A hook injects the Ronin13 rules into Claude's context when a session starts and when a subagent starts. The hook needs Node.js. To stop it, disable the plugin in `/plugin`.

Don't enable Ronin13 together with a plugin of the same kind, such as Ponytail.

## Try it locally

From the repository root:

```bash
claude --plugin-dir .
```

## Roadmap

- Write the rules
- Evals, with results published

## License

MIT

## Development

Keep the SKILL.md body under about 9,000 characters. Claude Code truncates hook output over 10,000 characters without a warning, so the rest of the rules would not reach Claude.
