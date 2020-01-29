@app
arc-hroe-example

@http
get /
post /

@tables
hroe
  PK *String
  SK **String

@indexes
hroe
  SK *String
  Data **String
hroe
  GSI-Bucket *Number
