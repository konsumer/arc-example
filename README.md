# Example of Modeling Relational Data in DynamoDB

> This is based on the [AWS example](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html). In this tutorial, I will explain the data structure we start with, and how to map that from their example to [arc](https://arc.codes) using best practices and get the most efficiency out of DynamoDB.

## how to design a DynamoDB model

This example describes how to model relational data in Amazon DynamoDB. A DynamoDB table design corresponds to the relational order entry schema that is shown in [Relational Modeling](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-relational-modeling.html). It follows the [Adjacency List Design Pattern](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-adjacency-graphs.html#bp-adjacency-lists), which is a common way to represent relational data structures in DynamoDB.

The design pattern requires you to define a set of entity types that usually correlate to the various tables in the relational schema. Entity items are then added to the table using a compound (partition and sort) primary key. The partition key of these entity items is the attribute that uniquely identifies the item and is referred to generically on all items as PK. The sort key attribute contains an attribute value that you can use for an inverted index or global secondary index. It is generically referred to as SK.

You define the following entities, which support the relational order entry schema:

1. `HR-Employee` - *PK*: `EmployeeID`, *SK*: `Employee Name`
1. `HR-Region` - *PK*: `RegionID`, *SK*: `Region Name`
1. `HR-Country` - *PK*: `CountryId`, *SK*: `Country Name`
1. `HR-Location` - *PK*: `LocationID`, *SK*: `Country Name`
1. `HR-Job` - *PK*: `JobID`, *SK*: `Job Title`
1. `HR-Department` - *PK*: `DepartmentID`, *SK*: `DepartmentID`
1. `OE-Customer` - *PK*: `CustomerID`, *SK*: `AccountRepID`
1. `OE-Order` - *PK*: `OrderID`, *SK*: `CustomerID`
1. `OE-Product` - *PK*: `ProductID`, *SK*: `Product Name`
1. `OE-Warehouse` - *PK*: `WarehouseID`, *SK*: `Region Name`

After adding these entity items to the table, you can define the relationships between them by adding edge items to the entity item partitions. The following table demonstrates this step:

<!-- TODO: turn this into a markdown table? -->
![table - model design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/images/tabledesign.png)

> We put them all in one table, and partition using *PK* in order to improve partition-efficiency (help with scaling) as data that goes together will stay together, on-disk.

In this example, the Employee, Order, and Product Entity partitions on the table have additional edge items that contain pointers to other entity items on the table. Next, define a few global secondary indexes (GSIs) to support all the access patterns defined previously. The entity items don't all use the same type of value for the primary key or the sort key attribute. All that is required is to have the primary key and sort key attributes present to be inserted on the table.

The fact that some of these entities use proper names and others use other entity IDs as sort key values allows the same global secondary index to support multiple types of queries. This technique is called GSI overloading. It effectively eliminates the default limit of 20 global secondary indexes for tables that contain multiple item types. This is shown in the following diagram as GSI 1:

<!-- TODO: turn this into a markdown table? -->
![table - GSI](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/images/tablegsi.png)


GSI 2 is designed to support a fairly common application access pattern, which is to get all the items on the table that have a certain state. For a large table with an uneven distribution of items across available states, this access pattern can result in a hot key, unless the items are distributed across more than one logical partition that can be queried in parallel. This design pattern is called `write sharding`.

To accomplish this for GSI 2, the application adds the GSI 2 primary key attribute to every Order item. It populates that with a random number in a range of 0–N, where N can generically be calculated using the following formula, unless there is a specific reason to do otherwise:

```
ItemsPerRCU = 4KB / AvgItemSize
PartitionMaxReadRate = 3K * ItemsPerRCU
N = MaxRequiredIO / PartitionMaxReadRate
```

For example, assume that you expect the following:

* Up to 2 million orders will be in the system, growing to 3 million in 5 years.
* Up to 20 percent of these orders will be in an OPEN state at any given time.
* The average order record is around 100 bytes, with three OrderItem records in the order partition that are around 50 bytes each, giving you an average order entity size of 250 bytes.

For that table, the N factor calculation would look like the following:

```
ItemsPerRCU = 4KB / 250B = 16
PartitionMaxReadRate = 3K * 16 = 48K
N = (0.2 * 3M) / 48K = 13
```

In this case, you need to distribute all the orders across at least 13 logical partitions on GSI 2 to ensure that a read of all Order items with an OPEN status doesn't cause a hot partition on the physical storage layer. It is a good practice to pad this number to allow for anomalies in the dataset. So a model using `N = 15` is probably fine. As mentioned earlier, you do this by adding the random 0–N value to the GSI 2 PK attribute of each Order and OrderItem record that is inserted on the table.

This breakdown assumes that the access pattern that requires gathering all `OPEN` invoices occurs relatively infrequently so that you can use burst capacity to fulfill the request. You can query the following global secondary index using a State and Date Range Sort Key condition to produce a subset or all Orders in a given state as needed.

<!-- TODO: turn this into a markdown table? -->
![table - GSI2](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/images/gsi2.png)

In this example, the items are randomly distributed across the 15 logical partitions. This structure works because the access pattern requires a large number of items to be retrieved. Therefore, it's unlikely that any of the 15 threads will return empty result sets that could potentially represent wasted capacity. A query always uses 1 read capacity unit (RCU) or 1 write capacity unit (WCU), even if nothing is returned or no data is written.

If the access pattern requires a high velocity query on this global secondary index that returns a sparse result set, it's probably better to use a hash algorithm to distribute the items rather than a random pattern. In this case, you might select an attribute that is known when the query is executed at run time and hash that attribute into a 0–14 key space when the items are inserted. Then they can be efficiently read from the global secondary index.

## implementation

Finally, you can revisit the access patterns that were defined earlier. Following is the list of access patterns and the query conditions that you will use with the new DynamoDB version of the application to accommodate them:

| Access Patterns                                                           | Query Conditions                                                            |
| ------------------------------------------------------------------------- |:---------------------------------------------------------------------------:|
| Look up Employee Details by Employee ID                                   | Primary Key on table, ID="HR-EMPLOYEE1"                                     |
| Query Employee Details by Employee Name                                   | Use GSI-1, PK="Employee Name"                                               |
| Get an employee's current job details only                                | Primary Key on table, PK="HR-EMPLOYEE1", SK starts-with "vo"                 |
| Get Orders for a customer for a date range                                | Use GSI-1, PK=CUSTOMERI1, SK="STATUS-DATE", for each StatusCode             |
| Show all Orders in OPEN status for a date range across all customers      | Use GSI-2, PK=query in parallel for the range [0..N], SK between OPEN-Datel |
| All Employees Hired recently                                              | Use GSI-1, PK="HR-CONFIDENTIAL", SK > datel                                 |
| Find all employees in specific Warehouse                                  | Use GSI-1, PKR=WAREHOUSE1                                                   |
| Get all Orderitems for a Product including warehouse location inventories | Use GSI-1, PKR=PRODUCT1                                                     |
| Get customers by Account Rep                                              | Use GSI-1, PKR=ACCOUNT-REP                                                  |
| Get orders by Account Rep and date                                        | Use GSI-1, PK=ACCOUNT-REP, SK="STATUS-DATE", for each StatusCode            |
| Get all employees with specific Job Title                                 | Use GSI-1, PK=v0O-JOBTITLE                                                  |
| Get inventory by Product and Warehouse                                    | Primary Key on table, PK=OE-PRODUCT1, SK=PRODUCT1                           |
| Get total product inventory                                               | Primary Key on table, PK=OE-PRODUCT1, SK=PRODUCT1                           |
| Get Account Reps ranked by Order Total and Sales Period                   | Use GSI-1, PK=YYYY-Q1, scanindexForward=False                               |

> Normally, you should probably do this as a first step. It's much easier to map access patterns to schema, rather than the other way around. Even though DynamoDB is "schemaless" once you have an access strategy for your keys, it's much harder to make a change to how it works, so it really pays to work out all these details up-front. If you know that you will always have a certain number of arguments for all your access patterns, you can work out how many GSI you will need, even if you aren't sure what the schema of the records will be. Following this pattern will help you scale really wall and stay flexible, since you only need to add more GSI if you run out of keys to handle your arguments.

## mapping this to arc

Here we start where [AWS example](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html) leaves off, and turn this into a sweet arc-app. Now that we have a model setup, and know what our access patterns will be, let's turn this all into arc definitions & code:

**[.arc](.arc)**:
```
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

```

As you can see, all the complication is in the access patterns, not the dynamo setup. We have a table called `hroe` with a *PK* called `pk` and *SK* called `sk`. We also make 2 GSIs, one with *PK* called `gsi1` and another with a *PK* called `gsi2`. We do this, because they have multiple duties (they aren't just indexes for a particular field, they are used in multiple ways to index the data), and it will make them match the access pattern text a bit better. You may notice I am using `hroe` twice, in `@indexes` (GSI) as they will both be on that table.

### make an api

It will make your life easier if you create a central file that maps all your access patterns to dynamo, so you don't have to worry about it's details while you are working on your app. You can even use this to centralize your single source of truth about how everything maps together (like the table above describes.)

Have a look at [this file](src/api.js) to see how I have mapped these to a dynamo client. I also added a some methods to CRUD `Employees`, `Regions`, `Countries`, `Locations`, `Jobs`, `Departments`, `Customers`, `Orders`, `Products`, and `Wharehouses`.

### make a service

I want to expose all of this as a [GraphQL](https://graphql.org/) service. This will make it easy to explore your data, and shows a typical use-case that you might have for serving things to your frontend.

Add a HTTP service definition to your arc file to make graphql work:

**[.arc](.arc)**:
```
@http
get /graphql
post /graphql
```

Have a look in [http](src/http) for how I did this. You can modify your [.arc](.arc) and run `npx @architect/architect init` to generate nice stub files for everything that's defined.

You could skip right to this step and just define [all your api functions](src/api.js) directly in your GraphQL resolvers, but I am keeping it seperate here, so it's easier to follow, and can be dropped into a non-graphql project.


## finishing up

Now you've got a whole arc app. Here are some tools:

```
# run a local development server
arc sandbox

# deploy your app on AWS
arc deploy
```

I like to put these commands in [package.json](package.json) `script` definitions, so other devs (who may be less familiar with arc) can quickly do stuff with the project, and it also helps remind me, if I get rusty with arc-commands:

```
# install tools & dependencies
npm i

# generate whatever is defined in .arc
npm run init

# start a local dev-server
npm start

# deploy on AWS
npm run deploy
```