#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MySecureServerless3TierStack } from '../lib/mysecureserverless_3tier-stack';
require('dotenv').config();

const app = new cdk.App();

new MySecureServerless3TierStack(app, 'MySecureServerless3TierStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
