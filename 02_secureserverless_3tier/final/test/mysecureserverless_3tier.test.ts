import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Bonus from '../lib/mysecureserverless_3tier-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Bonus.MySecureServerless3TierStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});