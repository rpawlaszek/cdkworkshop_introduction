#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MySagaStack } from '../lib/mysaga-stack';
require('dotenv').config();

const app = new cdk.App();

new MySagaStack(app, 'MySagaStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
