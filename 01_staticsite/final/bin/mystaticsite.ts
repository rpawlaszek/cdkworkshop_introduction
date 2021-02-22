#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyStaticSiteStack } from '../lib/mystaticsite-stack';
require('dotenv').config();

const app = new cdk.App();
new MyStaticSiteStack(app, 'MyStaticSiteStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.BUCKET_REGION
    }
});
