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
  SearchData **String
hroe
  SearchData *String
hroe
  GSIBucket *Number