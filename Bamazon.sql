CREATE DATABASE bamazon;

USE bamazon;


CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL, 
    department_name VARCHAR(45),
    price DECIMAL(10,2) default 0,
    stock_quantity INT (10) default 0,
    product_sales INT (10) default 0,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Weller Bourbon","Food and Beverage", 20, 10),
("Weller Antique", "Food and Beverage", 35, 3),
("Weller 12 Year Old", "Food and Beverage", 60, 0),
("Dog Collar", "Pets", 20, 100),
("Lampshade", "Household", 2, 999),
("Nair", "Beauty", 15, 3),
("Dog Bed", "Pets", 25, 20),
("Tiny Home", "Household", 20000, 5),
("Cajun Shrimp OPI Nail Polish", "Beauty", 60, 8),
("Blender", "Household", 100, 50);

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL, 
    overhead_costs INT (12) default 0,
    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, overhead_costs)
VALUES ("Food and Beverage", 20000),
("Pets", 10000),
("Household", 60000),
("Beauty", 100000);
