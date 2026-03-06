ALTER TABLE "players" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "emergency_contact_name" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "emergency_contact_phone" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "medical_notes" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "place_of_birth" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "mysafa_id" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "national_id" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "nationality" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "previous_club" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "position" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "season" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "registration_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "terms_accepted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "terms_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "parent_signature" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "player_signature" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "consent_photos" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "consent_videos" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "consent_travel" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;