CREATE TABLE `Product` (
  `Product_ID` INT PRIMARY KEY,
  `Product_Name` VARCHAR(45),
  `Description` TINYTEXT,
  `Category` INT
);

CREATE TABLE `Customer_Company` (
  `Company_ID` INT PRIMARY KEY,
  `Company_Name` VARCHAR(45),
  `Company_Credit_Limit` INT,
  `Credit_Limit_Currency` VARCHAR(5)
);

CREATE TABLE `Customer_Employee` (
  `Customer_Employee_ID` INT PRIMARY KEY,
  `Company_ID` INT,
  `Badge_Number` VARCHAR(20),
  `Job_Title` VARCHAR(45),
  `Department` VARCHAR(45),
  `Credit_Limit` INT,
  `Credit_Limit_Currency` VARCHAR(5)
);

CREATE TABLE `Customer` (
  `Customer_ID` INT PRIMARY KEY,
  `Person_ID` INT,
  `Customer_Employee_ID` INT,
  `AccountMgr_ID` INT,
  `Income_level` INT
);

CREATE TABLE `Inventory` (
  `Inventory_ID` INT PRIMARY KEY,
  `Product_ID` INT,
  `Warehouse_ID` INT,
  `Quantity_on_Hand` INT,
  `Quantity_Available` INT
);

CREATE TABLE `Order_Item` (
  `Order_ID` INT PRIMARY KEY,
  `Customer_ID` INT,
  `Product_ID` INT,
  `Unit_Price` DECIMAL,
  `Quantity` DOUBLE
);

CREATE TABLE `Orders` (
  `Order_ID` INT PRIMARY KEY,
  `Customer_ID` INT,
  `Sales_Rep_ID` IN,
  `Order_Date` DATE,
  `Order_Code` INT,
  `Order_Status` VARCHAR(15),
  `Order_Total` INT,
  `Order_Currency` VARCHAR(5),
  `Promotion_Code` VARCHAR(45)
);

CREATE TABLE `Employment` (
  `Employee_ID` INT PRIMARY KEY,
  `Person_ID` INT,
  `HR_Job_ID` INT,
  `Manager_Employee_ID` INT,
  `Start_Date` DATE,
  `End_Date` Date,
  `Salary` INT,
  `Commision_Percent` DECIMAL,
  `Employmentcol` VARCHAR
);

CREATE TABLE `Warehouse` (
  `Warehouse_ID` INT PRIMARY KEY,
  `Location_ID` INT,
  `Warehouse_Name` VARCHAR(45)
);

CREATE TABLE `Phone_Number` (
  `Phone_Number_ID` INT PRIMARY KEY,
  `Persons_Person_ID` INT,
  `Locations_Location_ID` INT,
  `Country_code` INT,
  `Phone_number` INT,
  `Phone_Type_ID` INT
);

CREATE TABLE `Person` (
  `Person_ID` INT PRIMARY KEY,
  `First_name` VARCHAR(20),
  `Last_name` VARCHAR(20),
  `Middle_names` VARCHAR(45),
  `Nickname` VARCHAR(20),
  `Nat_long_code` INT,
  `Culture_code` INT,
  `Gender` VARCHAR(12)
);

CREATE TABLE `Restricted_info` (
  `Person_ID` INT PRIMARY KEY,
  `Date_of_Birth` DATE,
  `Date_of_Death` DATE,
  `Government_ID` VARCHAR(24),
  `Passport_ID` VARCHAR(24),
  `Hire_Date` DATE,
  `Seniority_Code` INT
);

CREATE TABLE `Location` (
  `Location_ID` INT PRIMARY KEY,
  `Country_ID` INT,
  `Address_Line_1` VARCHAR(45),
  `Address_Line_2` VARCHAR(45),
  `City` VARCHAR(45),
  `State` VARCHAR(24),
  `District` VARCHAR(24),
  `Postal_code` VARCHAR(20),
  `Location_type_code` INT,
  `Description` VARCHAR(128),
  `Shipping_notes` VARCHAR(256)
);

CREATE TABLE `Person_Location` (
  `Persons_Person_ID` INT,
  `Locations_Location_ID` INT,
  `Sub_Address` VARCHAR(45),
  `Location_Usage` VARCHAR(45),
  `Notes` TINYTEXT,
  PRIMARY KEY (`Persons_Person_ID`, `Locations_Location_ID`)
);

CREATE TABLE `Country` (
  `Country_ID` INT PRIMARY KEY,
  `Country_Name` VARCHAR(24),
  `Country_Code` VARCHAR(3),
  `Nat_Lang_Code` INT,
  `Currency_Code` VARCHAR(10)
);

CREATE TABLE `Employment_Jobs` (
  `HR_Job_ID` INT PRIMARY KEY,
  `Countries_Country_ID` INT,
  `Job_Title` VARCHAR(45),
  `Min_Salary` INT,
  `Max_Salary` INT
);

ALTER TABLE `Customer_Employee` ADD FOREIGN KEY (`Company_ID`) REFERENCES `Customer_Company` (`Company_ID`);

ALTER TABLE `Product` ADD FOREIGN KEY (`Product_ID`) REFERENCES `Inventory` (`Product_ID`);

ALTER TABLE `Orders` ADD FOREIGN KEY (`Order_ID`) REFERENCES `Order_Item` (`Order_ID`);

ALTER TABLE `Customer` ADD FOREIGN KEY (`Customer_ID`) REFERENCES `Order_Item` (`Customer_ID`);

ALTER TABLE `Customer` ADD FOREIGN KEY (`Customer_ID`) REFERENCES `Orders` (`Customer_ID`);

ALTER TABLE `Person` ADD FOREIGN KEY (`Person_ID`) REFERENCES `Restricted_info` (`Person_ID`);

ALTER TABLE `Person` ADD FOREIGN KEY (`Person_ID`) REFERENCES `Employment` (`Person_ID`);

ALTER TABLE `Employment` ADD FOREIGN KEY (`HR_Job_ID`) REFERENCES `Employment_Jobs` (`HR_Job_ID`);

ALTER TABLE `Country` ADD FOREIGN KEY (`Country_ID`) REFERENCES `Employment_Jobs` (`Countries_Country_ID`);

ALTER TABLE `Location` ADD FOREIGN KEY (`Location_ID`) REFERENCES `Person_Location` (`Locations_Location_ID`);

ALTER TABLE `Employment` ADD FOREIGN KEY (`Employee_ID`) REFERENCES `Orders` (`Sales_Rep_ID`);

ALTER TABLE `Person` ADD FOREIGN KEY (`Person_ID`) REFERENCES `Phone_Number` (`Persons_Person_ID`);

ALTER TABLE `Order_Item` ADD FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`);

ALTER TABLE `Employment` ADD FOREIGN KEY (`Employee_ID`) REFERENCES `Employment` (`Manager_Employee_ID`);

ALTER TABLE `Warehouse` ADD FOREIGN KEY (`Location_ID`) REFERENCES `Location` (`Location_ID`);

ALTER TABLE `Location` ADD FOREIGN KEY (`Country_ID`) REFERENCES `Country` (`Country_ID`);

ALTER TABLE `Person_Location` ADD FOREIGN KEY (`Persons_Person_ID`) REFERENCES `Person` (`Person_ID`);

ALTER TABLE `Phone_Number` ADD FOREIGN KEY (`Locations_Location_ID`) REFERENCES `Location` (`Location_ID`);

ALTER TABLE `Customer` ADD FOREIGN KEY (`Person_ID`) REFERENCES `Person` (`Person_ID`);
