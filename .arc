@app
hroe-example

@http
get /
post /

@tables
hroe
  PK *String        # Primary Identifier
  SK **String       # ParamIndex1

@indexes
hroe
  SK *String        # GSI1_PK
  GSI1_SK **String  # ParamIndex2
hroe
  GSI2_PK *Number   # GSIBucket
  GSI1_SK **String  # copy for searches
hroe
  GSI1_SK *String   # GSI3_PK

