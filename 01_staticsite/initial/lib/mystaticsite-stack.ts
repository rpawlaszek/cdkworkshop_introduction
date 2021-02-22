import * as cdk from '@aws-cdk/core';
// import * as s3 from '@aws-cdk/aws-s3';
// import * as s3deploy from '@aws-cdk/aws-s3-deployment';
// import * as route53 from '@aws-cdk/aws-route53';
// import * as alias from '@aws-cdk/aws-route53-targets';

export class MyStaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 01  create a bucket
    //     - use process.env.SUBDOMAIN and process.env.DOMAIN
    //     - create a bucket
    //     - set removal policy


    // 02  deploy the contents


    // 03* use specific domain and route to our bucket


    // 04** create a distribution
  }
}
