CREATE TABLE `businesses` (
	`id` binary(16) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories_items` (
	`category_id` bigint unsigned NOT NULL,
	`item_id` bigint unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `categories_items_category_id_item_id_pk` PRIMARY KEY(`category_id`,`item_id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(255),
	`address` varchar(255),
	`type` enum('customer','provider') NOT NULL DEFAULT 'customer',
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('product','supply') NOT NULL DEFAULT 'product',
	`cost` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
	`selling_price` decimal(10,2) unsigned,
	`stock` decimal(10,3) unsigned NOT NULL DEFAULT '0.000',
	`min_stock` decimal(10,3) unsigned NOT NULL DEFAULT '0.000',
	`measure_unit_id` bigint unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `measure_units` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`symbol` varchar(50) NOT NULL,
	`type` enum('weight','volume','length','area','time','unit','currency') NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `measure_units_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`transaction_id` bigint unsigned NOT NULL,
	`payment_method` enum('cash','card','transfer') NOT NULL,
	`amount` decimal(10,2) unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`output_type` enum('item','service') NOT NULL,
	`output_id` bigint unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipe_components` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`recipe_id` bigint unsigned NOT NULL,
	`input_type` enum('item','service') NOT NULL,
	`input_id` bigint unsigned NOT NULL,
	`quantity` decimal(10,3) unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `recipe_components_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaction_details` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`transaction_id` bigint unsigned NOT NULL,
	`item_id` bigint unsigned NOT NULL,
	`item_name` varchar(255) NOT NULL,
	`measure_unit_name` varchar(50) NOT NULL,
	`measure_unit_symbol` varchar(10) NOT NULL,
	`quantity` decimal(10,3) unsigned NOT NULL,
	`unit_price` decimal(12,2) unsigned NOT NULL,
	`total` decimal(14,2) unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `transaction_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('income','expense') NOT NULL DEFAULT 'expense',
	`cost` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
	`selling_price` decimal(10,2) unsigned,
	`measure_unit_id` bigint unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`number` varchar(50) NOT NULL,
	`contact_id` bigint unsigned,
	`payment_status` enum('paid','pending','overdue','cancelled') NOT NULL DEFAULT 'paid',
	`description` varchar(255),
	`type` enum('purchase_supply','purchase_service','sale_product','sale_service','production') NOT NULL,
	`due_date` datetime NOT NULL,
	`total` decimal(10,2) unsigned NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` binary(16) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` char(60) NOT NULL,
	`role` enum('admin','businessman') NOT NULL DEFAULT 'businessman',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_items` ADD CONSTRAINT `categories_items_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_items` ADD CONSTRAINT `categories_items_item_id_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_items` ADD CONSTRAINT `categories_items_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_measure_unit_id_measure_units_id_fk` FOREIGN KEY (`measure_unit_id`) REFERENCES `measure_units`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `measure_units` ADD CONSTRAINT `measure_units_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipe_components` ADD CONSTRAINT `recipe_components_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recipe_components` ADD CONSTRAINT `recipe_components_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_measure_unit_id_measure_units_id_fk` FOREIGN KEY (`measure_unit_id`) REFERENCES `measure_units`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_contact_id_contacts_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;