# Reredd CLI
The professional engine for Reddit market research and customer pain point validation.

Reredd CLI is a CLI tool for researchers to validate product-market fit. It automates the process of discovering signals, monitoring community discussions, and engaging with potential customers through AI-synthesized context.

---

## Installation

Install the global command via the NPM registry. This package includes pre-compiled binaries for macOS, Linux, and Windows.

```bash
npm install -g reredd-cli
```

---

## Authentication

Reredd CLI operates using your existing browser session. This avoids traditional API limitations and ensures authentic community interaction.

### 1. Install Extension
Install the "Copy Cookies" extension to export your session data:
[Download Copy Cookies](https://chromewebstore.google.com/detail/copy-cookies/jcbpglbplpblnagieibnemmkiamekcdg?hl=en-US)

### 2. Export Cookies
1. Log in to your Reddit account in your browser.
2. Open the "Copy Cookies" extension and click the export button to copy your session to the clipboard.

### 3. Create an Account Alias
```bash
reredd account create my-account-alias
```

### 4. Attach a Channel
Paste your cookies into the channel command:
```bash
reredd channels create my-account-alias --channel reddit
```

---

## Setup and Configuration

Before running research campaigns, you must configure your LLM provider.

### `reredd configure`
The interactive setup wizard for your AI agents.
- **Provider**: Choose between Google (Gemini) or OpenAI.
- **API Key**: Securely store your provider key locally.
- **Model**: Set a universal fallback model (e.g., gpt-4o or gemini-1.5-pro).

### `reredd config llm`
Fast-access command to update specific LLM settings.
- `-p, --provider`: Set provider.
- `-m, --model`: Set fallback model.
- `-k, --apiKey`: Update API key.
- `-b, --baseURL`: Set custom base URL for OpenAI-compatible proxies.

---

## Quick Start: A 5-Minute Workflow

This example shows how to launch a research campaign to find customer pain points related to "user onboarding" in the `r/saas` subreddit.

**Assumes you have already configured authentication and your LLM provider.**

### Step 1: Explore a Subreddit
Use `reredd feed` to get a feel for the discussions in `r/saas`. This helps confirm it's the right place for your research.

```bash
# See the latest 'hot' posts in r/saas
reredd feed --platform reddit --subreddit saas
```

Looks promising. Now, let's create a campaign.

### Step 2: Create a Research Campaign
Define a campaign to analyze `r/saas` for one week, looking for pain points, desired features, and mentions of competitors.

```bash
reredd research create \
  --name "SaaS Onboarding Research" \
  --subreddits saas \
  --intent "Identify pain points and desired features related to user onboarding in SaaS products." \
  --duration 7 --unit days \
  --metrics "pain points,feature requests,competitor mentions" \
  --account-alias my-account-alias
```

### Step 3: Run the Campaign
Start the agent. It will begin monitoring the subreddit, analyzing discussions, and synthesizing findings.

```bash
reredd research resume --name "SaaS Onboarding Research" --verbose
```
The agent will run in the background. You can close the terminal.

### Step 4: Check Campaign Status
After a day, see how the run is progressing.

```bash
reredd research runs --name "SaaS Onboarding Research"
```
This will show you the `runId` for your campaign.

### Step 5: Generate a Report
Once the campaign has gathered enough data (or has completed), generate a report to see the synthesized insights.

```bash
# Use the runId from the previous step
reredd research report --campaign-name "SaaS Onboarding Research" --runId YOUR_RUN_ID
```

This command generates an HTML report in `~/.reredd/campaigns/` with clustered themes, key quotes, and actionable insights.

---

## Market Research and Validation

### `reredd research`
The primary module for market research and pain point analysis. Scans subreddits for community signals and synthesizes insights into reports.

#### `research create`
Creates a research campaign definition with name, subreddits, intent, duration, metrics, and the Reddit account alias used for the run.

Arguments:
- `optional`: `--name <name>`
- `optional`: `--subreddits <comma,separated,list>`
- `optional`: `--intent <intent>`
- `optional`: `--duration <number>`
- `optional`: `--unit <hours|days|weeks>`
- `optional`: `--account-alias <alias>`
- `optional`: `--metrics <comma,separated,list>`

Example:
```bash
reredd research create --name onboarding-research --subreddits startups,saas --intent "Find user onboarding pain points" --duration 7 --unit days --account-alias my-brand --metrics pain-points,alternatives,urgency
```

#### `research resume`
Starts a new run or resumes an interrupted run.

Arguments:
- `optional`: `--name <name>`
- `optional`: `--account-alias <alias>` overrides the campaign account alias before running
- `optional`: `--runId <runId>` resume a specific run
- `optional`: `-v, --verbose`

Examples:
```bash
reredd research resume --name onboarding-research
reredd research resume --name onboarding-research --runId abc123
reredd research resume --name onboarding-research --account-alias my-brand --verbose
```

#### `research configure`
Updates an existing research campaign definition.

Arguments:
- `optional`: `--name <name>`
- `optional`: `--subreddits <comma,separated,list>`
- `optional`: `--intent <intent>`
- `optional`: `--duration <number>`
- `optional`: `--unit <hours|days|weeks>`
- `optional`: `--account-alias <alias>`
- `optional`: `--metrics <comma,separated,list>`

Example:
```bash
reredd research configure --name onboarding-research --subreddits startups,saas,entrepreneur --metrics pain-points,alternatives,budget
```

#### `research report`
Generates a report for a specific run.

Arguments:
- `required`: `--campaign-name <name>`
- `required`: `--runId <runId>`
- `optional`: `--account-alias <alias>`
- `optional`: `--final`

Examples:
```bash
reredd research report --campaign-name onboarding-research --runId abc123
reredd research report --campaign-name onboarding-research --runId abc123 --final
```

#### `research runs`
Lists runs across research campaigns.

Arguments:
- `optional`: `--account-alias <alias>`
- `optional`: `--name <campaign-name>`

Examples:
```bash
reredd research runs
reredd research runs --name onboarding-research
```

---

## Marketing Automation

### `reredd marketing`
Automated engagement engine for monitoring subreddits, identifying relevant discussions, and orchestrating contextual replies with LLM-powered authenticity checks. Replies are queued for manual review or posted directly based on account settings.

#### Campaign Management

##### `marketing create`
Creates a new marketing campaign with business description, intent, subreddit targets, and scheduling.

Interactive prompts:
1. Campaign name
2. Business description (what your product/service is)
3. Campaign intent (goal for this campaign)
4. Subreddits (comma-separated list)
5. Duration (days)
6. Feed scan interval (minutes)
7. Comment check interval (minutes)

After creation, edit `~/.reredd/market/<campaign-id>/config.json` directly to tune:
- `subreddits[].posting_allowed`: Enable/disable posting to specific subreddits
- `subreddits[].relevance_threshold`: Score threshold for tracking posts (0-10)
- `subreddits[].min_reply_gap_minutes`: Cooldown between replies to same subreddit
- `subreddits[].max_tracked_posts`: Max posts to actively monitor per subreddit
- `llm_config.models.*`: Swap LLM models for relevance scoring, reply writing, etc.
- `behavior.*`: Adjust inactivity timeouts, creation cooldowns, tracking thresholds

Example:
```bash
reredd marketing create
```

##### `marketing list`
Lists all marketing campaigns with summary info.

Arguments:
- none

Example:
```bash
reredd marketing list
```

Output shows campaign ID, name, target subreddits, and end date.

##### `marketing remove <campaign-id>`
Removes a marketing campaign and all its data (posts, comments, state).

Arguments:
- `required`: `<campaign-id>`

Example:
```bash
reredd marketing remove my-campaign
```

Requires confirmation.

##### `marketing update [campaign-id]`
Updates a marketing campaign configuration interactively.

Arguments:
- `optional`: `<campaign-id>` (prompts to select if omitted)

Updates:
- Campaign name
- Business description
- Campaign intent
- Subreddits (preserves existing subreddit configs if unchanged)
- Feed scan interval
- Comment check interval

Example:
```bash
reredd marketing update my-campaign
```

##### `marketing start [campaign-id]`
Starts the marketing campaign scheduler. Continuously monitors subreddits and replies to relevant comments based on authenticity checks.

Arguments:
- `optional`: `<campaign-id>` (prompts to select if omitted)
- `optional`: `--dryrun` runs without posting to Reddit (useful for testing)
- `optional`: `-v, --verbose` shows detailed debug logs including LLM prompts, authenticity scores, and red flags

How it works:
1. Scans target subreddits at `feed_interval_minutes` to find new posts
2. Checks tracked posts for new comments at `comment_interval_minutes`
3. For each comment, evaluates relevance and decides whether to reply
4. Generates draft reply with LLM, checks authenticity (scores 0–10)
5. If authenticity ≥ 7, replies are queued or posted
6. If < 7, retries up to 2 times; if still fails, skips reply
7. Continues indefinitely with idle countdown to next scheduled check

Examples:
```bash
reredd marketing start my-campaign --verbose
reredd marketing start my-campaign --dryrun
reredd marketing start
```

#### Queue and Monitoring

##### `marketing queue:process <campaign-id>`
Processes queued replies and posts (moves them from queue to live Reddit or marks as posted).

Arguments:
- `required`: `<campaign-id>`
- `optional`: `--dryrun` validate without posting

Example:
```bash
reredd marketing queue:process my-campaign
```

##### `marketing queue:status <campaign-id>`
Shows queue stats: total, pending, processing, success, failed.

Arguments:
- `required`: `<campaign-id>`

Example:
```bash
reredd marketing queue:status my-campaign
```

##### `marketing feed <campaign-id>`
Shows tracked posts for a campaign — title, relevance score, status, and tracking date.

Arguments:
- `required`: `<campaign-id>`

Example:
```bash
reredd marketing feed my-campaign
```

##### `marketing comment <campaign-id>`
Shows all queued and posted agent comments for a campaign with timestamps.

Arguments:
- `required`: `<campaign-id>`

Example:
```bash
reredd marketing comment my-campaign
```

##### `marketing test:dedup <campaign-id> <reddit-url>`
Tests comment deduplication by fetching the same thread multiple times and checking which comments are new vs. already seen.

Arguments:
- `required`: `<campaign-id>`
- `required`: `<reddit-url>` full Reddit URL or post ID

Example:
```bash
reredd marketing test:dedup my-campaign https://www.reddit.com/r/startups/comments/abc123/example_post/
```

Output shows total comments fetched, already-seen count, and new comments.

### `reredd feed`
Discovery tool for manual signal extraction and community monitoring.

#### `feed --platform twitter`
Fetches your authenticated home timeline. Useful for monitoring industry influencers or specific niches you follow.

#### `feed --platform reddit`
Fetches a specific subreddit feed (Hot, Best, New, Top, Rising). Ideal for deep-diving into community trends or identifying recurring pain points.

---

## CLI Structure

This section is the direct non-interactive command reference from [src/cli.ts](/Users/electron/Downloads/r-automation/src/cli.ts).

Conventions:
- `required`: must be passed on the command line.
- `optional`: can be omitted.
- If a required value is omitted for some commands, the CLI falls back to an interactive prompt. The examples below show the fully non-interactive form.

### `reredd account`

#### `reredd account list`
Lists all account aliases.

Arguments:
- none

Example:
```bash
reredd account list
```

#### `reredd account create <alias>`
Creates a local account alias.

Arguments:
- `required`: `<alias>` account name, for example `my-brand`

Example:
```bash
reredd account create my-brand
```

#### `reredd account remove <alias>`
Removes an account alias.

Arguments:
- `required`: `<alias>`

Example:
```bash
reredd account remove my-brand
```

#### `reredd account activate <alias>`
Sets the active global account alias.

Arguments:
- `required`: `<alias>`

Example:
```bash
reredd account activate my-brand
```

#### `reredd account configure <alias>`
Touches or refreshes account-level configuration.

Arguments:
- `required`: `<alias>`
- `optional`: `--activate` also marks the alias as active

Example:
```bash
reredd account configure my-brand --activate
```

### `reredd channels`

Each account alias can have one Reddit channel and one Twitter channel attached.

#### `reredd channels list`
Lists configured channels across aliases.

Arguments:
- `optional`: `--account-alias <alias>` filter to a single alias

Examples:
```bash
reredd channels list
reredd channels list --account-alias my-brand
```

#### `reredd channels create <accountAlias> --channel <reddit|twitter>`
Creates and attaches a channel to an account alias.

Arguments:
- `required`: `<accountAlias>`
- `required`: `--channel <reddit|twitter>`
- `optional`: `--cookies <jsonOrPath>`

Notes:
- If `--cookies` is omitted, the CLI asks you to paste cookies interactively.
- `--cookies` can be either a JSON string or a file path containing exported cookies.

Examples:
```bash
reredd channels create my-brand --channel reddit --cookies ./reddit-cookies.json
reredd channels create my-brand --channel twitter --cookies ./twitter-cookies.json
```

#### `reredd channels remove <accountAlias> --channel <reddit|twitter>`
Removes a configured channel from an alias.

Arguments:
- `required`: `<accountAlias>`
- `required`: `--channel <reddit|twitter>`

Example:
```bash
reredd channels remove my-brand --channel twitter
```

#### `reredd channels activate <accountAlias> --channel <reddit|twitter>`
Sets the active alias for one channel.

Arguments:
- `required`: `<accountAlias>`
- `required`: `--channel <reddit|twitter>`

Examples:
```bash
reredd channels activate my-brand --channel reddit
reredd channels activate my-brand --channel twitter
```

#### `reredd channels configure <accountAlias> --channel <reddit|twitter>`
Replaces cookies for an existing channel.

Arguments:
- `required`: `<accountAlias>`
- `required`: `--channel <reddit|twitter>`
- `optional`: `--cookies <jsonOrPath>`

Examples:
```bash
reredd channels configure my-brand --channel reddit --cookies ./reddit-cookies.json
reredd channels configure my-brand --channel twitter --cookies ./twitter-cookies.json
```

### `reredd post`

#### `reredd post create`
Creates a Reddit post or a Twitter post.

Arguments:
- `required`: `--channel <reddit|twitter>`
- `optional`: `--title <title>`
- `optional`: `--content <content>`
- `optional`: `--account-alias <alias>`
- `optional`: `--subreddit <subreddit>` for Reddit only

Behavior:
- Reddit expects `--title`, `--content`, and `--subreddit` for a fully non-interactive run.
- Twitter only really uses `--content`. `--title` is optional and not required by the current implementation.
- If `--content` is omitted, the CLI prompts.

Examples:
```bash
reredd post create --channel reddit --account-alias my-brand --subreddit startups --title "Looking for feedback" --content "What is the hardest part of onboarding users?"
reredd post create --channel twitter --account-alias my-brand --content "Shipping something small every day compounds fast."
```

#### `reredd post comments`
Fetches Reddit comments or inspects a Twitter thread.

Arguments:
- `required`: `--id-or-url <value>`
- `required`: `--channel <reddit|twitter>`
- `optional`: `--account-alias <alias>`
- `optional`: `--subreddit <subreddit>` for Reddit raw post IDs
- `optional`: `--cursor <cursor>` for pagination

Examples:
```bash
reredd post comments --channel reddit --account-alias my-brand --id-or-url t3_abc123 --subreddit startups
reredd post comments --channel reddit --account-alias my-brand --id-or-url t3_abc123 --subreddit startups --cursor CURSOR_VALUE
reredd post comments --channel twitter --account-alias my-brand --id-or-url https://x.com/FasterVikhram/status/2043619028803948653
```

#### `reredd post info`
Fetches details about a Reddit post or tweet.

Arguments:
- `required`: `--id-or-url <value>`
- `required`: `--channel <reddit|twitter>`
- `optional`: `--account-alias <alias>`
- `optional`: `--subreddit <subreddit>` for Reddit raw post IDs

Examples:
```bash
reredd post info --channel reddit --account-alias my-brand --id-or-url t3_abc123 --subreddit startups
reredd post info --channel twitter --account-alias my-brand --id-or-url https://x.com/FasterVikhram/status/2043619028803948653
```

### `reredd feed`

#### `reredd feed`
Fetches a platform feed with cursor-based pagination.

Arguments:
- `required`: `--platform <platform>`
- `optional`: `--account-alias <alias>`
- `optional`: `--count <number>` default `20`
- `optional`: `--cursor <cursor>`
- `optional`: `--subreddit <subreddit>` for Reddit feeds
- `optional`: `--type <hot|best|new|top|rising>` for Reddit feeds, default `hot`
- `optional`: `--time-range <hour|day|week|month|year|all>` for Reddit `top` feeds, default `day`
- `optional`: `--after <after>` Reddit pagination cursor

Current support:
- `twitter`: supported
- `reddit`: supported for subreddit feeds

Examples:
```bash
reredd feed --platform twitter --account-alias my-brand
reredd feed --platform twitter --account-alias my-brand --count 50
reredd feed --platform twitter --account-alias my-brand --cursor CURSOR_VALUE
reredd feed --platform reddit --account-alias my-brand --subreddit startups
reredd feed --platform reddit --account-alias my-brand --subreddit startups --type top --time-range week
reredd feed --platform reddit --account-alias my-brand --subreddit startups --type new --after AFTER_CURSOR
```

### `reredd followup`

#### `reredd followup create`
Creates a Reddit follow-up comment or a Twitter reply.

Arguments:
- `required`: `--id-or-url <value>`
- `required`: `--channel <reddit|twitter>`
- `optional`: `--content <content>`
- `optional`: `--account-alias <alias>`
- `optional`: `--parent-id <parentId>` for Reddit reply targets

Behavior:
- For Reddit, `--parent-id` points to the comment being replied to. If omitted, the CLI can still post a top-level comment.
- For Twitter, the post ID is the tweet being replied to.

Examples:
```bash
reredd followup create --channel reddit --account-alias my-brand --id-or-url t3_abc123 --parent-id t1_def456 --content "Can you say more about what broke in your workflow?"
reredd followup create --channel twitter --account-alias my-brand --id-or-url https://x.com/FasterVikhram/status/2043619028803948653 --content "What specifically made it click for you?"
```

### `reredd subreddit`

#### `reredd subreddit info <name>`
Fetches subreddit metadata, metrics, and rules.

Arguments:
- `required`: `<name>` subreddit name without `r/`
- `optional`: `--account-alias <alias>`
- `optional`: `--debug`

Example:
```bash
reredd subreddit info startups --account-alias my-brand
```

### `reredd research`

Research campaigns for market analysis and pain point discovery. Reddit-only.

#### `reredd research create`
Creates a research campaign definition.

Arguments:
- `optional but needed for non-interactive use`: `--name <name>`
- `optional but needed for non-interactive use`: `--subreddits <comma,separated,list>`
- `optional but needed for non-interactive use`: `--intent <intent>`
- `optional but needed for non-interactive use`: `--duration <number>`
- `optional but needed for non-interactive use`: `--unit <hours|days|weeks>`
- `optional`: `--account-alias <alias>`
- `optional but needed for non-interactive use`: `--metrics <comma,separated,list>`

Example:
```bash
reredd research create --name onboarding-research --subreddits startups,saas --intent "Find user onboarding pain points" --duration 7 --unit days --account-alias my-brand --metrics pain-points,alternatives,urgency
```

#### `reredd research resume`
Starts a new run or resumes an existing run.

Arguments:
- `optional`: `--name <name>`
- `optional`: `--account-alias <alias>` overrides the campaign account alias before running
- `optional`: `--runId <runId>` resume a specific run
- `optional`: `-v, --verbose`

Examples:
```bash
reredd research resume --name onboarding-research
reredd research resume --name onboarding-research --runId abc123
reredd research resume --name onboarding-research --account-alias my-brand --verbose
```

#### `reredd research configure`
Updates an existing research campaign definition.

Arguments:
- `optional`: `--name <name>`
- `optional`: `--subreddits <comma,separated,list>`
- `optional`: `--intent <intent>`
- `optional`: `--duration <number>`
- `optional`: `--unit <hours|days|weeks>`
- `optional`: `--account-alias <alias>`
- `optional`: `--metrics <comma,separated,list>`

Example:
```bash
reredd research configure --name onboarding-research --subreddits startups,saas,entrepreneur --metrics pain-points,alternatives,budget
```

#### `reredd research report`
Generates a synthesis report for a specific run.

Arguments:
- `required`: `--campaign-name <name>`
- `required`: `--runId <runId>`
- `optional`: `--account-alias <alias>`
- `optional`: `--final`

Examples:
```bash
reredd research report --campaign-name onboarding-research --runId abc123
reredd research report --campaign-name onboarding-research --runId abc123 --final
```

#### `reredd research runs`
Lists runs across research campaigns.

Arguments:
- `optional`: `--account-alias <alias>`
- `optional`: `--name <campaign-name>`

Examples:
```bash
reredd research runs
reredd research runs --name onboarding-research
```

### `reredd marketing`

Marketing automation and engagement orchestration. Monitors subreddits, evaluates comments, generates contextual replies with authenticity checks, and queues responses.

#### Campaign Management

##### `reredd marketing create`
Creates a new marketing campaign interactively.

Arguments:
- none (all values collected via prompts)

Interactive prompts:
1. **Campaign name** → slugified to campaign ID
2. **Business description** → what your product/service is
3. **Campaign intent** → goal for this campaign
4. **Subreddits** → comma-separated list
5. **Duration** → campaign days
6. **Feed scan interval** → minutes
7. **Comment check interval** → minutes

Config file created at `~/.reredd/market/<campaign-id>/config.json`. Edit directly to tune:
- Relevance thresholds
- LLM models (relevance scorer, reply writer, etc.)
- Posting behavior per subreddit
- Inactivity and cooldown settings

Example:
```bash
reredd marketing create
```

##### `reredd marketing list`
Lists all marketing campaigns.

Arguments:
- none

Example:
```bash
reredd marketing list
```

Output shows campaign ID, name, target subreddits, and end date.

##### `reredd marketing remove <campaign-id>`
Removes a marketing campaign and all associated data.

Arguments:
- `required`: `<campaign-id>`

Example:
```bash
reredd marketing remove my-campaign
```

Requires confirmation.

##### `reredd marketing update [campaign-id]`
Updates marketing campaign configuration interactively.

Arguments:
- `optional`: `<campaign-id>` (prompts to select if omitted)

Updates:
- Campaign name
- Business description
- Campaign intent
- Subreddits (preserves existing subreddit-level config if unchanged)
- Feed scan interval
- Comment check interval

Example:
```bash
reredd marketing update my-campaign
```

##### `reredd marketing start [campaign-id]`
Starts the marketing campaign scheduler with continuous monitoring and reply generation.

Arguments:
- `optional`: `<campaign-id>` (prompts to select if omitted)
- `optional`: `--dryrun` runs without posting to Reddit (testing/validation)
- `optional`: `-v, --verbose` shows debug logs, LLM scores, red flags

How it works:
1. Scans target subreddits every `feed_interval_minutes` for new posts
2. Checks tracked posts every `comment_interval_minutes` for new comments
3. Scores each comment for relevance using LLM
4. For relevant comments, generates draft reply with LLM
5. Authenticates draft (0–10 score) — penalizes promotional patterns
6. If score ≥ 7: queues or posts reply
7. If score < 7: retries up to 2 times; skips if still fails
8. Runs indefinitely with idle countdown timer

Examples:
```bash
reredd marketing start my-campaign --verbose
reredd marketing start my-campaign --dryrun
reredd marketing start
```

#### Queue and Status

##### `reredd marketing queue:process <campaign-id>`
Processes queued replies (moves from queue to live Reddit or marks posted).

Arguments:
- `required`: `<campaign-id>`
- `optional`: `--dryrun` validate without posting

Example:
```bash
reredd marketing queue:process my-campaign
```

##### `reredd marketing queue:status <campaign-id>`
Shows queue stats for a campaign.

Arguments:
- `required`: `<campaign-id>`

Displays:
- Total items in queue
- Pending (not yet processed)
- Processing (in progress)
- Success (posted)
- Failed (errors)

Example:
```bash
reredd marketing queue:status my-campaign
```

##### `reredd marketing feed <campaign-id>`
Shows all tracked posts for a campaign with scores and status.

Arguments:
- `required`: `<campaign-id>`

Displays per post:
- Subreddit
- Status (active, inactive, etc.)
- Title (truncated)
- Relevance score
- Tracking date

Example:
```bash
reredd marketing feed my-campaign
```

##### `reredd marketing comment <campaign-id>`
Shows all queued and posted agent comments for a campaign.

Arguments:
- `required`: `<campaign-id>`

Displays per comment:
- Subreddit
- Status (queued or posted)
- Queue ID (if queued, first 8 chars)
- Body preview
- Posted timestamp

Example:
```bash
reredd marketing comment my-campaign
```

##### `reredd marketing test:dedup <campaign-id> <reddit-url>`
Tests comment deduplication logic by fetching a thread multiple times.

Arguments:
- `required`: `<campaign-id>`
- `required`: `<reddit-url>` full URL or post ID

Shows:
- Total comments fetched
- Already seen (deduped)
- New comments
- Dedup status (working or no history yet)

Example:
```bash
reredd marketing test:dedup my-campaign https://www.reddit.com/r/startups/comments/abc123/example_post/
```

### `reredd mcp http`
Starts the MCP server over streamable HTTP so an LLM can call account, channel, post, follow-up, subreddit, and campaign tools.

Arguments:
- `optional`: `--host <host>` default `127.0.0.1`
- `optional`: `--port <port>` default `3001`
- `optional`: `--path <path>` default `/mcp`

Configuration:
- **Port**: Can be configured via `MCP_PORT` or `PORT` environment variables.

Example:
```bash
reredd mcp http --host 127.0.0.1 --port 3001 --path /mcp
```

### `reredd mcp stdio`
Starts the MCP server over standard input/output. This is the preferred transport for local IDE integrations.

Example:
```bash
reredd mcp stdio
```

---

## Local Storage and Security

Reredd is **local-first**. All data is stored in your home directory at `~/.reredd/`:
- `agent.config.json`: LLM provider settings, API keys, model configurations.
- `sessions.json`: Account aliases and per-channel session data for Reddit and Twitter.
- `campaigns/`: Research campaign logs and synthesis reports.
- `market/`: Marketing campaign configurations, tracked posts, queued replies, and analytics.
  - `<campaign-id>/config.json`: Campaign configuration (subreddits, intent, schedules, LLM models).
  - `<campaign-id>/state.json`: Live state (tracked posts, reply history, timestamps).
  - `<campaign-id>/snapshots/`: Cached Reddit data (posts, comments) per subreddit.
  - `<campaign-id>/analytics.json`: Reply metrics and engagement logs.

No data is ever sent to a central server; all API calls are made directly from your machine to Reddit and your chosen LLM provider.

---

## License
MIT
