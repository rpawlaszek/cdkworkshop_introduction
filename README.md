# AWS CDK Workshop

## Overview 
[AWS Cloud Development Kit](https://aws.amazon.com/cdk/) is a new approach to define AWS-cloud infrastructure using programming languages. It allows developer teams reuse their programming skills and quickly create reusable resource stacks.

In this talk you will be shown how easy it is to set up and build elastic, pluggable infrastructure. This is meant to be a code-along workshop rather than a talk.

This is intended as a code-along presentation so please set up your environments:

- AWS Account (I highly recommend setting up a personal [AWS account for this](https://aws.amazon.com/free/)
- AWS CLI v2 - configured for the AWS Account (see [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for details or [this YT video-tutorial](https://www.youtube.com/watch?v=FOK5BPy30HQ))
- [Node.js & npm](https://nodejs.org/en/). 
- Node [TypeScript package](https://www.npmjs.com/package/typescript)
- IDE: I will be using [VSCode](https://code.visualstudio.com/)
- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [GIT](https://git-scm.com/) (to download this repo)

## Working setup

- Node.js - v14.15.5
- npm - 6.14.11
- CDK - 1.90.1 (build 0aee440)
- VSCode - 1.53.2
  - [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension

In order to install CDK Node.js and npm are required. Then type:

```bash
npm i -g aws-cdk@1.90.1
```

## Structure

The workshop will present three mini-projects that are meant as project snippets showing small area of how to setup infrastructure via AWS CDK.  

Each of the mini-projects has its `initial` and `final` directories. The first one is a starting point that along the way should end up looking like the final one. Mind, that neither is configured, that is why it is requested to pay attention to `.env` and `requests.rest` files for filling in missing information.