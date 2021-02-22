import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';

export class MySagaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 01  create lambdas/tasks
    //     - create assignCase lambda/task
    //     - create closeCase lambda/task
    //     - create escalateCase lambda/task
    //     - create openCase lambda/task
    //     - create workOnCase lambda/task

    const lambdaCode = new lambda.AssetCode('./lambda-fns');

    const createLambda = (id: string, handler: string) => {
      return new lambda.Function(this, id, {
        code: lambdaCode,
        handler: handler,
        runtime: lambda.Runtime.NODEJS_12_X
      });
    }

    const assignCase = new tasks.LambdaInvoke(this, 'AssignCase', {
      lambdaFunction: createLambda('AssignCaseLambda', 'assign-case.handler'),
      payloadResponseOnly: true
    });

    const closeCase = new tasks.LambdaInvoke(this, 'CloseCase', {
      lambdaFunction: createLambda('CloseCaseLambda', 'close-case.handler'),
      payloadResponseOnly: true
    });

    const escalateCase = new tasks.LambdaInvoke(this, 'EscalateCase', {
      lambdaFunction: createLambda('EscalateCaseLambda', 'escalate-case.handler'),
      payloadResponseOnly: true
    });

    const openCase = new tasks.LambdaInvoke(this, 'OpenCase', {
      lambdaFunction: createLambda('OpenCaseLambda', 'open-case.handler'),
      payloadResponseOnly: true
    });

    const workOnCase = new tasks.LambdaInvoke(this, 'WorkOnCase', {
      lambdaFunction: createLambda('WorkOnCaseLambda', 'work-on-case.handler'),
      payloadResponseOnly: true
    });

    // 02  create auxiliary tasks
    //     - create jobFailed task
    //     - create isComplete task

    const jobFailed = new sfn.Fail(this, 'Fail', {
      cause: 'Engage Tier 2 Support',
    });

    const isComplete = new sfn.Choice(this, 'Is Case Resolved');

    // 03  create the state machine chain

    const chain = sfn.Chain.start(openCase)
      .next(assignCase)
      .next(workOnCase)
      .next(
        isComplete
          .when(sfn.Condition.numberEquals('$.Status', 1), closeCase)
          .when(sfn.Condition.numberEquals('$.Status', 0), escalateCase.next(jobFailed))
      );

    // 04  create the state machine
    const sm = new sfn.StateMachine(this, 'CaseSagaOrchestrator', {
      definition: chain
    });

    // 05 expose the SM via API
    //    - setup role for the API GW to initiate the SM
    //    - create the API GW
    //    - add GET method to the API Gateway

    const role = new iam.Role(this, 'HttpGetRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com')
    });

    role.attachInlinePolicy(
      new iam.Policy(this, 'HttpGetPolicy', {
        statements: [
          new iam.PolicyStatement({
            actions: ["states:StartExecution"],
            effect: iam.Effect.ALLOW,
            resources: [sm.stateMachineArn]
          })
        ]
      })
    );

    const api = new apigateway.RestApi(this, "HttpRestApi");

    api.root.addMethod(
      "GET",
      new apigateway.AwsIntegration({
        service: "states",
        action: "StartExecution",
        integrationHttpMethod: "POST",
        options: {
          credentialsRole: role,
          integrationResponses: [{
            statusCode: "200",
            responseTemplates: {
              "application/json": `{"done": true }`
            }
          }],
          requestTemplates: {
            "application/json": `{
              "input": "{\\"httpIssued\\":\\"true\\"}",
              "stateMachineArn": "${sm.stateMachineArn}"
            }`
          }
        }
      }), {
      methodResponses: [{ statusCode: "200" }]
    });
  }
}
