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

    const vpc = new ec2.Vpc(this, "MyContainerServerlessVpc", {
      maxAzs: 3 // Default is all AZs in region
    });

    // 02  create the Aurora cluster with PostgreSQL engine
    //     - set up the security group allowing PostgreSQL clients' connection
    //     - create the cluster with the security group
    
    const sg = new ec2.SecurityGroup(this, 'MyContainerServerlessAuroraSecurityGroup', {
      vpc,
      allowAllOutbound: true,
      description: "Aurora Security Group"
    });

    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), "MyContainerServerlessAuroraIngresPort");

    const database = process.env.DATABASE!;

    const auroraCluster = new rds.ServerlessCluster(this, 'MyContainerServerlessAuroraCluster', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'MyContainerServerlessAuroraParameterGroup', 'default.aurora-postgresql10'),
      defaultDatabaseName: database,
      vpc,
      scaling: { autoPause: cdk.Duration.seconds(0) },
      securityGroups: [sg]
    });

    // 03  create the ECS Fargate service
    //     - create the ECS Fargate cluster
    //     - create the role for the task to run as
    //     - grant the role access to reading the cluster secret
    //     - create the actual service (pass the connection info)

    const ecsServiceCluster = new ecs.Cluster(this, "MyContainerServerlessCluster", {
      vpc: vpc
    });

    const role = new iam.Role(
      this, 'MyContainerServerlessTaskImageRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });

    auroraCluster.secret?.grantRead(role);

    // Create a load-balanced Fargate service and make it public
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyContainerServerlessService", {
      cluster: ecsServiceCluster, // Required
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("./app"),
        secrets: {
          Aurora__Username: ecs.Secret.fromSecretsManager(auroraCluster.secret!, 'username'),
          Aurora__Password: ecs.Secret.fromSecretsManager(auroraCluster.secret!, 'password')
        },
        environment: {
          Aurora__Database: database,
          Aurora__Host: auroraCluster.clusterEndpoint.hostname,
        },
        taskRole: role
      },
      memoryLimitMiB: 512,
      publicLoadBalancer: true // Default is false
    });

  }
}
