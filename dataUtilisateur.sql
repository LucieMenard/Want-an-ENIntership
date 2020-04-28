-- Table: public."Utilisateur"

-- DROP TABLE public."Utilisateur";

CREATE TABLE public."Utilisateur"
(
    ident integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    fam_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    surname character varying(100) COLLATE pg_catalog."default",
    diploma boolean NOT NULL,
    mail character varying(100) COLLATE pg_catalog."default" NOT NULL,
    mdp character varying(100) COLLATE pg_catalog."default" NOT NULL,
    date_diplo date,
    phone_number character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY (ident)
)

TABLESPACE pg_default;

ALTER TABLE public."Utilisateur"
    OWNER to postgres;