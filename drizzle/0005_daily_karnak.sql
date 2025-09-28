ALTER TABLE `account` RENAME COLUMN `account_subtype` TO `account_subtype_id`;--> statement-breakpoint
ALTER TABLE `account` DROP INDEX `account_businessId_accountSubtype_code_unique`;--> statement-breakpoint
ALTER TABLE `account_subtype` DROP INDEX `account_subtype_businessId_code_unique`;--> statement-breakpoint
ALTER TABLE `account` DROP FOREIGN KEY `account_account_subtype_account_subtype_id_fk`;
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_businessId_accountSubtypeId_code_unique` UNIQUE(`business_id`,`account_subtype_id`,`code`);--> statement-breakpoint
ALTER TABLE `account_subtype` ADD CONSTRAINT `account_subtype_businessId_accountType_code_unique` UNIQUE(`business_id`,`account_type`,`code`);--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_account_subtype_id_account_subtype_id_fk` FOREIGN KEY (`account_subtype_id`) REFERENCES `account_subtype`(`id`) ON DELETE cascade ON UPDATE no action;