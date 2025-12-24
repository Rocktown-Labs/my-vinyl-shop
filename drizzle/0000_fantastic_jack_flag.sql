CREATE TABLE `bids` (
	`id` text PRIMARY KEY NOT NULL,
	`vinyl_id` text NOT NULL,
	`bidder_id` text NOT NULL,
	`amount` real NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`vinyl_id`) REFERENCES `vinyls`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bidder_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`participant1_id` text NOT NULL,
	`participant2_id` text NOT NULL,
	`order_id` text,
	`vinyl_id` text,
	`last_message_at` integer,
	`created_at` integer,
	FOREIGN KEY (`participant1_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`participant2_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vinyl_id`) REFERENCES `vinyls`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` text PRIMARY KEY NOT NULL,
	`follower_id` text NOT NULL,
	`following_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`content` text NOT NULL,
	`is_read` integer DEFAULT false,
	`created_at` integer,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`link_url` text,
	`is_read` integer DEFAULT false,
	`metadata` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`buyer_id` text NOT NULL,
	`seller_id` text NOT NULL,
	`vinyl_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`total_amount` real NOT NULL,
	`shipping_amount` real DEFAULT 0,
	`status` text DEFAULT 'pending' NOT NULL,
	`shipping_address` text,
	`tracking_number` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vinyl_id`) REFERENCES `vinyls`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text,
	`display_name` text,
	`bio` text,
	`avatar_url` text,
	`cover_image_url` text,
	`location` text,
	`country` text,
	`website` text,
	`instagram_handle` text,
	`discogs_username` text,
	`is_verified` integer DEFAULT false,
	`is_seller` integer DEFAULT false,
	`subscription_tier` text DEFAULT 'free',
	`ships_worldwide` integer DEFAULT false,
	`specialized_genres` text,
	`onboarding_completed` integer DEFAULT false,
	`stripe_connect_account_id` text,
	`stripe_connect_onboarding_status` text,
	`stripe_connect_onboarding_link` text,
	`last_username_change_at` integer,
	`embedding` F32_BLOB(768),
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE TABLE `vinyls` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`genre` text NOT NULL,
	`year` integer,
	`label` text,
	`catalog_number` text,
	`description` text,
	`condition` text NOT NULL,
	`sleeve_condition` text,
	`vinyl_condition` text,
	`type` text DEFAULT 'used' NOT NULL,
	`images` text,
	`is_listed` integer DEFAULT false,
	`is_in_collection` integer DEFAULT true,
	`price` real,
	`listing_type` text DEFAULT 'fixed',
	`starting_bid` real,
	`reserve_price` real,
	`buy_now_price` real,
	`auction_end_date` integer,
	`quantity` integer DEFAULT 1,
	`ai_suggested_price` real,
	`ai_condition_notes` text,
	`embedding` F32_BLOB(768),
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
