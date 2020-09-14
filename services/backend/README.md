# logan-backend

The server backend for Logan, consisting of an AWS API Gateway and several AWS Lambda Functions.

## Structure
- Each API endpoint will have its own Lambda function assigned to it, which wakes up to process the request, and can execute for a maximum of 15 minutes.
This model is much more cost-effective than having an always-on server that handles our requests.
- Each Lambda executes a _handler_ function when it wakes up, which are defined in the `src` folder.
- The full list of Lambda functions and their configurations can be found in `template.yml`,
which the SAM CLI uses to create/update these functions upon deployment.

## Deploying the Backend

Before deploying, you need to install the following:
1. AWS CLI - [Install](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
2. AWS SAM CLI - [Install](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Then to deploy, do the following:
```bash
cd services/backend
./scripts/build-and-deploy.sh

# If you get a permissions error, you need to grant yourself execution rights on the script.
# You can do so as follows:
chmod u+x scripts/build-and-deploy.sh
```

## Adding a New Route Handler
1. Add the code somewhere in the `src` folder. Make sure you export the handler method.
2. Add a new resource entry in `template.yml` in the following format:
   ```
   Resources:
     ...
     <LambdaName>:
       Type: AWS::Serverless::Function
       Properties:
         Handler: src/<file-name>.<method-name> (ex: src/hello-world.handler)
         Runtime: nodejs12.x
         MemorySize: 128
         Timeout: 100
         Description: <A description of your lambda>
         Events:
           Api:
             Type: Api
             Properties:
               Path: <API route>
               Method: <HTTP method>
   ```
3. Deploy the backend

## Helpful Documentation
- [What is Amazon API Gateway?](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Getting started with AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html)
- [AWS Serverless Application Model Overview](https://aws.amazon.com/serverless/sam/)
