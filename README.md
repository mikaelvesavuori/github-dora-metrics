# DORA metrics for GitHub repositories

This repository contains a ready-to-use solution for setting up an API-based service on AWS that will calculate the four (well, [there are 5 these days](https://www.getunleash.io/blog/dora-metrics-in-2023-5-ways-to-measure-devops-performance), but who's counting?) DORA metrics completely from processing data that GitHub holds on a given repository:

- [Change failure rate (CFR)](#change-failure-rate)
- [Deployment frequency (DF)](#deployment-frequency)
- [Lead time to change (LTC)](#lead-time-for-changes)
- [Mean time to repair (MTTR)](#mean-time-to-repair)

This solution also supports returning the response in a format that works for those sweet [shields.io](https://shields.io/endpoint) badges.

_Please note that it's kind of messy to sometimes calculate these values strictly to their intended use. Read more about the details of these in the [Calculations](#calculations) section and how this solution adapts some shortcomings in the available data._

## Prerequisites

- Creating deployments in GitHub and using GitHub issues with `bug` or `incident` labels
- Recent [Node.js](https://nodejs.org/en/) (ideally 18+) installed.
- Amazon Web Services (AWS) account with sufficient permissions so that you can deploy infrastructure. A naive but simple policy would be full rights for CloudWatch, Lambda, API Gateway, and S3.
- Ideally some experience with [Serverless Framework](https://www.serverless.com) as that's what we will use to deploy the service and infrastructure.

## Configuration

### GitHub personal access tokens

To make use of this project, you'll need a GitHub personal access token with `repo` and `issues` access and use this in any calls to GitHub.

You need to use one of these options to actually use such a token:

- Let the caller pass in their token.
- Pre-bake a token:
  - Passing it in as an option during CI `npx sls deploy --pat YOUR_PAT`
  - Hardcode the value in `serverless.yml`
  - Get the value from AWS Secrets Manager when building/compiling

_See [this guide for how to create a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)._

The statement at the top—that this is a ready-to-use solution—is therefore technically true since consumers of the API _may_ pass in their own GitHub personal access token (PAT) to make calls, for example to private/internal repositories. However, you'll probably want to set up and bake in a public access PAT to make the requests towards GitHub for any case in which no token is directly passed in.

#### Setting the PAT value

You can simply pass it in as an option during CI; for example with `npx sls deploy --pat YOUR_PAT`.

For hardcoding it, you'll set the PAT value in `serverless.yml` under `custom.config.gitHubPersonalAccessToken`. The recommended way, however, would be to use [AWS Secrets Manager or similar](https://www.serverless.com/blog/aws-secrets-management/). Both ways are present in `serverless.yml` but the Secrets Manager solution is commented out. Please refer to the comments there for more information.

### GitHub behaviors that drive the calculations

- Use GitHub Issues with `bug` or `incident` labels
  - Open and close times are used
- Use GitHub deployments, deploying to one of the named environments `prd`, `prod`, `production`, or `live`
  - The commit time (prompting the deployment) and start-of-deployment times are used

## Installation

Clone, fork, or download the repo as you normally would. Run `npm install`.

## Commands

- `npm start`: Run application locally
- `npm test`: Test the business/application logic with AVA
- `npm run build`: Package application with Serverless Framework
- `npm run deploy`: Deploy application to AWS with Serverless Framework
- `npm run teardown`: Remove stack from AWS

## Running locally

Using `npm start` you can start using the local endpoint `http://localhost:3000/metrics` to call the service. See example calls further down.

## Calculations

_Quotes from [a blog post on Google Cloud](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)._

The period that is taken into account is the one provided in the `serverless.yml` configuration, under `custom.config.maxPeriodInDays`. It's set to 30 (days) by default.

### Deployment frequency

> How **often** an organization **successfully** releases to **production**.

#### Calculation

This is really straight-forward but assumes/requires you to use [GitHub "deployments"](https://docs.github.com/en/actions/deployment/about-deployments/about-continuous-deployment) to express these deployments.

`{number of deployments in period}` which use an [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) named one of the following:

- `prd`
- `prod`
- `production`
- `live`

### Lead Time for Changes

> The amount of **time** it takes a **commit** to get into **production**.

#### Calculation

This reflects the time from a commit being made to a deployment being started.

There is no crystal-clear way to get the _time of deployment_ as the `updatedAt` value of the deployment may express other changes as well – this is why the start of the deployment will have to be the best proxy value I could come up with.

`{time of deploy - time committed}` as full seconds, using the median of all processed values.

### Change Failure Rate

> The **percentage** of **deployments** causing a **failure** in production.

#### Calculation

This one is hard as doing it orthodoxly would mean mapping _each_ deployment to a _specific_ failure, which is obviously very hard, sometimes not even possible, and is definitely something that would explode the scope far out from just having to do with GitHub. While it's indeed possible to check for _strictly failed_ deployments, I don't find that to be a true indicator of real issues as they can be (given you don't do canary releases etc.) attributed to things happening before the code even reaches actual users.

The solution used here is to accept a somewhat wider perspective by simply dividing the number of closed issues tagged `bug` or `incident` with the number of deployments.

`{number of issues / number of deployments} * 100` as a rounded percentage.

_If there are no deployments in the period, this will be represented as zero percent._

### Mean Time To Repair

> How **long** it takes an organization to **recover** from a **failure** in production.

#### Calculation

Same as above, this can be tricky to have an opinion on and getting it working completely inside of GitHub.

The solution is to calculate the median time to close issues marked `bug` or `incident` within the period. While it won't _only_ reflect handling production failures, it will at least give a bug resolution time.

`{issue close time - issue open time}`.

## Example API calls

### Get metrics

#### Request

```bash
curl {ENDPOINT}/metrics?repo={OWNER}/{REPO}
```

#### Response example

```json
{
  "changeFailureRate": "66.67%",
  "deploymentFrequency": "0.10/day",
  "leadTimeForChange": "00:00:00:20",
  "meanTimeToRepair": "00:06:21:15"
}
```

### Get metrics for a shields.io badge

```bash
curl {ENDPOINT}/metrics?repo={OWNER}/{REPO}&badge=true
```

#### Response example

```json
{
  "schemaVersion": 1,
  "label": "DORA metrics",
  "message": "CFR: 66.67% | DF: 0.10/day | LTC: 00:00:00:20 | MTTR: 00:06:21:15",
  "color": "black",
  "labelColor": "blue",
  "style": "for-the-badge"
}
```

### Get metrics and pass in custom GitHub PAT

Either pass it in your request:

```bash
curl {ENDPOINT}/metrics?repo={OWNER}/{REPO}&token={YOUR_GH_PAT}
```

Or use a header for this:

`Authorization: {YOUR_GH_PAT}`

## Known issues

- There doesn't seem to be a (reliable) way to get pagination for GitHub deployments, meaning only the last 100 deployments (maximum) will be used to calculate deployment-related metrics.
