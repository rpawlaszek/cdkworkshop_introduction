#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyContainerServerlessStack } from '../lib/mycontainerserverless-stack';
require('dotenv').config();

const app = new cdk.App();

new MyContainerServerlessStack(app, 'MyContainerServerlessStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
