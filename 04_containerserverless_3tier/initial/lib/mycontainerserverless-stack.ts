import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as rds from '@aws-cdk/aws-rds';
import * as iam from '@aws-cdk/aws-iam';

export class MyContainerServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 01  create a dedicated VPC for the stack

    // 02  create the Aurora cluster with PostgreSQL engine
    //     - set up the security group allowing PostgreSQL clients' connection
    //     - create the cluster with the security group
    
    // 03  create the ECS Fargate service
    //     - create the ECS Fargate cluster
    //     - create the role for the task to run as
    //     - grant the role access to reading the cluster secret
    //     - create the actual service (pass the connection info)

  }
}
