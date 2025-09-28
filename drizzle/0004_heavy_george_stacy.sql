CREATE TABLE `account` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` smallint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`account_subtype` bigint unsigned NOT NULL,
	`business_id` binary(16),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	CONSTRAINT `account_id` PRIMARY KEY(`id`),
	CONSTRAINT `account_businessId_accountSubtype_code_unique` UNIQUE(`business_id`,`account_subtype`,`code`)
);
--> statement-breakpoint
CREATE TABLE `account_subtype` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` smallint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`account_type` enum('assets','liabilities','equity','income','expense','cost') NOT NULL,
	`business_id` binary(16),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	CONSTRAINT `account_subtype_id` PRIMARY KEY(`id`),
	CONSTRAINT `account_subtype_businessId_code_unique` UNIQUE(`business_id`,`code`)
);
--> statement-breakpoint
CREATE TABLE `journal_entry` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`code` smallint unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`concept` varchar(700) NOT NULL,
	`date` datetime NOT NULL,
	`year` smallint unsigned GENERATED ALWAYS AS (YEAR(`journal_entry`.`date`)) STORED,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `journal_entry_id` PRIMARY KEY(`id`),
	CONSTRAINT `journal_entry_businessId_year_code_unique` UNIQUE(`business_id`,`year`,`code`)
);
--> statement-breakpoint
CREATE TABLE `ledger_record` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`voucher` varchar(255) NOT NULL,
	`reference` varchar(255) NOT NULL,
	`account` bigint unsigned NOT NULL,
	`journal_entry_id` bigint unsigned NOT NULL,
	`debit` decimal(10,2) unsigned,
	`credit` decimal(10,2) unsigned,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`business_id` binary(16) NOT NULL,
	CONSTRAINT `ledger_record_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transaction_details` MODIFY COLUMN `cost` decimal(10,2) unsigned;--> statement-breakpoint
ALTER TABLE `categories` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `categories` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `categories_items` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `categories_items` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `contacts` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `contacts` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `items` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `items` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `payments` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `recipes` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `recipes` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `recipe_components` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `recipe_components` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `transaction_details` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `transaction_details` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `services` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `services` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `transactions` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `transactions` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `created_by` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `updated_by` varchar(255);--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_account_subtype_account_subtype_id_fk` FOREIGN KEY (`account_subtype`) REFERENCES `account_subtype`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `account_subtype` ADD CONSTRAINT `account_subtype_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journal_entry` ADD CONSTRAINT `journal_entry_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ledger_record` ADD CONSTRAINT `ledger_record_account_account_id_fk` FOREIGN KEY (`account`) REFERENCES `account`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ledger_record` ADD CONSTRAINT `ledger_record_journal_entry_id_journal_entry_id_fk` FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entry`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ledger_record` ADD CONSTRAINT `ledger_record_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE cascade ON UPDATE no action;