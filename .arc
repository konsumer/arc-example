@app
DynamoExample

@http
get /graphql
post /graphql

@tables
hroe
  pk *String
  sk: **String

@indexes
hroe
  gsi1-pk *String
  gsi1-sk **String
hroe
  gsi2-pk *String
  gsi2-sk **String
