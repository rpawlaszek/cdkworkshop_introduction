import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cognito from '@aws-cdk/aws-cognito';

export class MySecureServerless3TierStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 01 create the DynamoDB table
    //    - primaryKey

    // 02  create the service
    //     - create getAllLambda and add necessary permissions
    //     - create createLambda and add necessary permissions
    //     - create getOneLambda and add necessary permissions
    //     - create udpateLambda and add necessary permissions
    //     - create deleteLambda and add necessary permissions 


    // 03 create API Gateway
    //    - create getAll method
    //    - create post method
    //    - create get method
    //    - create update method
    //    - create delete method

    // 04 secure the API with Cognito
    //    - create the userPool
    //    - create the resource server
    //      + create the scope for full access 
    //      + assign the resource server to the user pool
    //    - create the domain
    //    - create the client
    //    - create the authorizer and attach it to the integrations
    
  }
}
