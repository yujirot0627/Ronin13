// Injects the Ronin13 rules (the SKILL.md body) at SessionStart and SubagentStart.
// On any failure it injects nothing, prints one short line to stderr, and exits 0.
const fs = require('fs');
const path = require('path');

try {
  const event = JSON.parse(fs.readFileSync(0, 'utf8')).hook_event_name;
  if (event !== 'SessionStart' && event !== 'SubagentStart') throw new Error(`unexpected event ${event}`);
  const root = process.env.CLAUDE_PLUGIN_ROOT;
  if (!root) throw new Error('CLAUDE_PLUGIN_ROOT is not set');
  const { version } = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
  const skill = fs.readFileSync(path.join(root, 'skills', 'ronin13', 'SKILL.md'), 'utf8');
  const body = skill.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
  if (!version || !body) throw new Error('missing version or rules');
  const rules = `RONIN13 RULES ACTIVE (v${version})\n\n${body}\n\nRONIN13 RULES END`;
  // Claude Code silently truncates hook output over 10,000 characters (UTF-16 units, as JS counts them).
  if (rules.length > 9500) process.stderr.write(`ronin13: rules are ${rules.length} chars; Claude Code truncates over 10,000\n`);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: event, additionalContext: rules },
  }));
} catch (err) {
  process.stderr.write(`ronin13: rules not injected (${String(err.message).split('\n')[0]})\n`);
}
