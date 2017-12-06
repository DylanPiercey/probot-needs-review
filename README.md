# Probot: Needs-Review

> a GitHub App built with [Probot](https://github.com/probot/probot) that automatically add's a "Needs Review" label.

## Usage

1. **[Configure the GitHub App](https://github.com/apps/needs-review)**
2. Optionally create a `.github/needs-review.yml` to configure the "needs-review" label.

```yml
# Configuration for probot-needs-review

label: "status:needs-review" # The label to use.
```

## When is the label added?

* New comments added to an issue or PR.
* An issue or PR is opened, reopened or edited.

## Deployment

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this plugin.
