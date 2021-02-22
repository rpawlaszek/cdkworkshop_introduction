import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as route53 from '@aws-cdk/aws-route53';
import * as alias from '@aws-cdk/aws-route53-targets';

export class MyStaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 01  create a bucket
    //     - use process.env.DOMAIN
    //     - set removal policy

    const siteDomain = `${process.env.SUBDOMAIN!}.${process.env.DOMAIN!}`;

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    // 02  deploy the contents

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./contents')],
      destinationBucket: bucket
    });

    // 03* use specific domain and route to our bucket

    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: process.env.DOMAIN! });

    new route53.ARecord(this, 'AliasRecord', {
      zone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new alias.BucketWebsiteTarget(bucket))
    });

    new cdk.CfnOutput(this, 'Site', { value: 'https://' + siteDomain });

  }
}
