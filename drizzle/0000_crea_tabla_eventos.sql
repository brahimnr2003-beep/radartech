CREATE TYPE "public"."categoria" AS ENUM('ia', 'data', 'software', 'cloud', 'ciberseguridad', 'startups');--> statement-breakpoint
CREATE TYPE "public"."comunidad" AS ENUM('andalucia', 'aragon', 'asturias', 'baleares', 'canarias', 'cantabria', 'castilla-la-mancha', 'castilla-y-leon', 'cataluna', 'ceuta', 'extremadura', 'galicia', 'la-rioja', 'madrid', 'melilla', 'murcia', 'navarra', 'pais-vasco', 'valencia');--> statement-breakpoint
CREATE TYPE "public"."estado_evento" AS ENUM('pendiente', 'aprobado', 'rechazado');--> statement-breakpoint
CREATE TYPE "public"."modalidad" AS ENUM('presencial', 'online', 'hibrido');--> statement-breakpoint
CREATE TYPE "public"."origen_evento" AS ENUM('formulario', 'ia', 'admin');--> statement-breakpoint
CREATE TYPE "public"."tipo_evento" AS ENUM('conferencia', 'meetup', 'hackathon', 'taller', 'otro');--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "eventos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text NOT NULL,
	"fecha" date NOT NULL,
	"hora" time,
	"comunidad" "comunidad" NOT NULL,
	"provincia" text NOT NULL,
	"ciudad" text NOT NULL,
	"lugar" text,
	"categoria" "categoria" NOT NULL,
	"tipo" "tipo_evento" NOT NULL,
	"modalidad" "modalidad" NOT NULL,
	"precio_desde" integer DEFAULT 0 NOT NULL,
	"organizador" text NOT NULL,
	"url_oficial" text NOT NULL,
	"destacado" boolean DEFAULT false NOT NULL,
	"ponentes" jsonb,
	"estado" "estado_evento" DEFAULT 'pendiente' NOT NULL,
	"origen" "origen_evento" NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "eventos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "eventos_estado_fecha_idx" ON "eventos" USING btree ("estado","fecha");--> statement-breakpoint
CREATE INDEX "eventos_comunidad_idx" ON "eventos" USING btree ("comunidad");