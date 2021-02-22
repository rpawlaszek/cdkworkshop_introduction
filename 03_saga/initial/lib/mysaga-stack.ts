import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';

export class MySagaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 01  create lambdas/tasks
    //     - create assignCase lambda/task
    //     - create closeCase lambda/task
    //     - create escalateCase lambda/task
    //     - create openCase lambda/task
    //     - create workOnCase lambda/task

    // 02  create auxiliary tasks
    //     - create jobFailed task
    //     - create isComplete task

    // 03  create the state machine chain


    // 04  create the state machine

    // 05 expose the SM via API
    //    - setup role for the API GW to initiate the SM
    //    - create the API GW
    //    - add GET method to the API Gateway

  }
}
