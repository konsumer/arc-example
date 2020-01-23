@app
DynamoExample

@tables
hroe
  pk *String
  sk: **String

@indexes
hroe
  gsi1 *String
hroe
  gsi2 *String

@http
get /graphql
post /graphql