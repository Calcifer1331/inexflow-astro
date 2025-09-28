ALTER TABLE `transaction_details` RENAME COLUMN `item_name` TO `name`;--> statement-breakpoint
ALTER TABLE `transaction_details` RENAME COLUMN `item_id` TO `entity_id`;--> statement-breakpoint
ALTER TABLE `items` MODIFY COLUMN `stock` decimal(10,2) unsigned NOT NULL DEFAULT '0';--> statement-breakpoint
ALTER TABLE `items` MODIFY COLUMN `min_stock` decimal(10,2) unsigned NOT NULL DEFAULT '0';--> statement-breakpoint
ALTER TABLE `measure_units` MODIFY COLUMN `business_id` binary(16);--> statement-breakpoint
ALTER TABLE `recipe_components` MODIFY COLUMN `quantity` decimal(10,2) unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `transaction_details` MODIFY COLUMN `quantity` decimal(10,2) unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `transaction_details` ADD `entity_type` enum('item','service') NOT NULL;--> statement-breakpoint
ALTER TABLE `transaction_details` DROP COLUMN `measure_unit_name`;