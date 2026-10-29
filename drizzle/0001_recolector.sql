CREATE TABLE "ejecuciones_recolector" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ejecuciones_recolector_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"inicio" timestamp with time zone NOT NULL,
	"duracion_ms" integer NOT NULL,
	"leidos_por_fuente" jsonb NOT NULL,
	"errores" jsonb NOT NULL,
	"unicos" integer NOT NULL,
	"ya_conocidos" integer NOT NULL,
	"publicados" integer NOT NULL,
	"descartados" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "precio_desde" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "precio_desde" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "eventos" ALTER COLUMN "organizador" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "eventos" ADD COLUMN "fecha_fin" date;--> statement-breakpoint
ALTER TABLE "eventos" ADD COLUMN "fuente" text;--> statement-breakpoint
ALTER TABLE "eventos" ADD COLUMN "url_fuente" text;--> statement-breakpoint
ALTER TABLE "eventos" ADD COLUMN "id_externo" text;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idExterno_unique" UNIQUE("id_externo");