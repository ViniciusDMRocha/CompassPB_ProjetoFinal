Carregar as variáveis de ambiente:

```bash
set STAGE=dev
set REGION=us-east-1
set APP_NAME=VotingSystem
set DEPLOYMENT_BUCKET_NAME=votingsystem-deployment
```

```bash
mkdir -p .serverless
sam package --template-file lambda-functions.yml --output-template-file .serverless/lambda-functions.yml --s3-bucket ${DEPLOYMENT_BUCKET_NAME} --s3-prefix sam/${APP_NAME}/${STAGE}/lambda-functions --region ${REGION}
```

```bash
npm i --omit=dev
sam deploy --template-file lambda-functions.yml --stack-name ${APP_NAME}-Lambdas-${STAGE} --s3-bucket ${DEPLOYMENT_BUCKET_NAME} --s3-prefix sam/${APP_NAME}/${STAGE}/lambda-functions --capabilities CAPABILITY_IAM --parameter-overrides AppName=${APP_NAME} StageName=${STAGE} --region ${REGION}
```
