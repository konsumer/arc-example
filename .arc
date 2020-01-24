@app
arc-hroe-example

@http
get /
post /

@tables
hroe
  p *String
  s **String

@indexes
hroe
  gs1p *String
  gs1s **String
hroe
  gs2p *String
  gs2s **String
