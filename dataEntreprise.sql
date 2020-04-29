-- Table: public."Entreprise"

-- DROP TABLE public."Entreprise";

CREATE TABLE public."Entreprise"
(
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id_entreprise integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    address character varying(100) COLLATE pg_catalog."default" NOT NULL,
    postal_code integer NOT NULL,
    city character varying(100) COLLATE pg_catalog."default" NOT NULL,
    country character varying(100) COLLATE pg_catalog."default" NOT NULL,
    grade integer NOT NULL,
    CONSTRAINT "Entreprise_pkey" PRIMARY KEY (id_entreprise)
)

TABLESPACE pg_default;

ALTER TABLE public."Entreprise"
    OWNER to u4kq3mqz3af6qaixesbk;