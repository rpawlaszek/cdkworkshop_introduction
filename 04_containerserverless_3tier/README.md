# Container Serverless 3tier app

## Overview

This example shows how to set up a Fargate-based .NET Core application that connects to the PostgreSQL@Aurora:

- create an RDS Aurora Cluster
- prepare the Security Group for Aurora to enable incoming requests for PostgreSQL 
- create the Fargate Cluster with a single service
- create a task hosting a .NET Core application

#### References

- https://medium.com/@volmar.oliveira.jr/using-aws-cdk-to-deploy-sonarqube-service-to-ecs-and-rds-aurora-clusters-cfe8ad81d7a6