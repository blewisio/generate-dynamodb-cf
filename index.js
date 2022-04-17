#!/usr/bin/env node
const inquirer = require('inquirer');

(async () => {
  const questions = [{
    name: 'baseTableName',
    message: 'What is the table name?',
    type: 'input',
    validate: (x) => !!x,
  }, {
    name: 'isStageAppended',
    message: 'Append stage to name?',
    type: 'confirm',
    default: true,
  }, {
    name: 'primaryKey',
    message: 'What is the primary key?',
    type: 'input',
    validate: (x) => !!x,
  }, {
    name: 'billingMode',
    message: 'Billing mode?',
    type: 'list',
    choices: [{
      name: 'Pay per request (for infrequent workloads)',
      value: 'PAY_PER_REQUEST',
    }, {
      name: 'Provisioned (for high utilization workloads)',
      value: 'PROVISIONED',
    }],
    default: 'PAY_PER_REQUEST',
  }];

  const {
    baseTableName,
    billingMode,
    isStageAppended,
    primaryKey,
  } = await inquirer.prompt(questions);

  const tableName = isStageAppended
    ? `${baseTableName}-$\{self:provider.stage}`
    : baseTableName;

  console.log();
  console.log('Copy and paste this in the Resources section:');
  console.log(`
  ${baseTableName}Table:
    Type: AWS::DynamoDB::Table
    DeletionPolicy: Retain
    Properties:
      TableName: ${tableName}
      BillingMode: ${billingMode}
      AttributeDefinitions:
        - AttributeName: ${primaryKey}
          AttributeType: S
      KeySchema:
        - AttributeName: ${primaryKey}
          KeyType: HASH
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
`);
})();
