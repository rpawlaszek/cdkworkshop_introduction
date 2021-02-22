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

    const primaryKey = 'itemId';

    const table = new dynamodb.Table(this, 'ThreeTierStorage', {
      partitionKey: {
        name: primaryKey,
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'items',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // 02  create the service
    //     - create getAllLambda and add necessary permissions
    //     - create createLambda and add necessary permissions
    //     - create getOneLambda and add necessary permissions
    //     - create udpateLambda and add necessary permissions
    //     - create deleteLambda and add necessary permissions 

    const lambdaCode = new lambda.AssetCode('./lambda-fns');

    const getAllLambda = new lambda.Function(this, 'ThreeTierGetAllLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambdaCode,
      handler: 'get-all.handler',
      environment: {
        TABLE_NAME: table.tableName,
        PRIMARY_KEY: primaryKey
      }
    });
    table.grantReadData(getAllLambda);

    const createLambda = new lambda.Function(this, 'ThreeTierCreateLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambdaCode,
      handler: 'create.handler',
      environment: {
        TABLE_NAME: table.tableName,
        PRIMARY_KEY: primaryKey
      }
    });
    table.grantWriteData(createLambda);

    const getOneLambda = new lambda.Function(this, 'ThreeTierGetOneLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambdaCode,
      handler: 'get-one.handler',
      environment: {
        TABLE_NAME: table.tableName,
        PRIMARY_KEY: primaryKey
      }
    });
    table.grantReadData(getOneLambda);

    const updateOneLambda = new lambda.Function(this, 'ThreeTierUpdateOneLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambdaCode,
      handler: 'update-one.handler',
      environment: {
        TABLE_NAME: table.tableName,
        PRIMARY_KEY: primaryKey
      }
    });
    table.grantReadWriteData(updateOneLambda);

    const deleteOneLambda = new lambda.Function(this, 'ThreeTierDeleteOneLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambdaCode,
      handler: 'delete-one.handler',
      environment: {
        TABLE_NAME: table.tableName,
        PRIMARY_KEY: primaryKey
      }
    });
    table.grantReadWriteData(deleteOneLambda);

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

    const userPool = new cognito.UserPool(this, 'ThreeTierUserPool');

    const scopes = [
      {
        scopeDescription: "Full Access",
        scopeName: "read"
      },
      {
        scopeDescription: "Full Access",
        scopeName: "write"
      }];

    const resourceServer = new cognito.UserPoolResourceServer(this, "ThreeTierItemsResourceServer", {
      identifier: "items",
      userPool: userPool,
      scopes: scopes
    });

    userPool.addDomain("ThreeTierDomain", {
      cognitoDomain: {
        domainPrefix: process.env.COGNITO_DOMAIN!
      }
    });

    userPool.addClient('ThreeTierConsoleClient', {
      generateSecret: true,
      oAuth: {
        flows: {
          clientCredentials: true
        },
        scopes: scopes.map(s => cognito.OAuthScope.resourceServer(resourceServer, s))
      }
    });

    const auth = new apigateway.CognitoUserPoolsAuthorizer(this, 'ThreeTierItemsAuthorier', {
      cognitoUserPools: [userPool]
    });

    const api = new apigateway.RestApi(this, 'ThreeTierApi', {
      restApiName: 'ThreeTierApi'
    });

    const authOptionsFor = (scope: string) => ({
      authorizationScopes: [scope],
      authorizer: auth,
      authorizationType: apigateway.AuthorizationType.COGNITO
    });

    const items = api.root.addResource('items');
    const getAllIntegration = new apigateway.LambdaIntegration(getAllLambda);
    items.addMethod('GET', getAllIntegration, authOptionsFor('items/read'));

    const createIntegration = new apigateway.LambdaIntegration(createLambda);
    items.addMethod('POST', createIntegration, authOptionsFor('items/write'));

    const getOneIntegration = new apigateway.LambdaIntegration(getOneLambda);
    const singleItem = items.addResource('{id}');

    singleItem.addMethod('GET', getOneIntegration, authOptionsFor('items/read'));

    const updateIntegration = new apigateway.LambdaIntegration(updateOneLambda);
    singleItem.addMethod('PATCH', updateIntegration, authOptionsFor('items/write'));

    const deleteIntegration = new apigateway.LambdaIntegration(deleteOneLambda);
    singleItem.addMethod('DELETE', deleteIntegration, authOptionsFor('items/write'));
  }

  addCorsOptions(apiResource: apigateway.IResource) {
    apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Credentials': "'false'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
        },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      },
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    })
  }
}
