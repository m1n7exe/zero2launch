# Zero to Launch — Cash Edition

Extract the ZIP and open index.html with style.css and script.js beside it. Or open play.html for a standalone version. No internet or server needed.

Start with $20,000. Play seven short story rounds, each with three choices. Cash is the only score. Each choice shows its cash gain, chance of success and loss if unsuccessful. All amounts are NET changes: no separate costs or hidden stats. Outcomes include luck. Cash cannot go below zero, and displayed losses are capped at current cash.

After round 7 everyone gets a bonus rescue round, including players with $0. Choose a guaranteed $3,000 grant, a 60% chance of +$12,000 (otherwise lose up to $3,000), or a 35% chance of +$25,000 (otherwise lose up to $5,000). Final score is cash after the rescue round.

The local top-ten leaderboard uses a new cash-edition key so scores from the previous rules are kept separate. Same-browser storage only. No signup data is collected. Set SIGNUP_URL at the top of script.js to your actual registration URL. In play.html, change its embedded SIGNUP_URL instead. Edit ROUNDS in script.js to change stories and odds.

Validation: JavaScript syntax, all decision/outcome paths across eight rounds, a full interface-handler run, rescue from zero, no negative cash, duplicate-click guards and leaderboard submission. No visual browser inspection performed.

Decision results open in a native modal dialog with a dimmed backdrop. The Continue button advances the round. Escape and backdrop clicks do not dismiss a decision result; keyboard focus stays inside until continuing.
# zero2launch
