-- Table: public."Experience"

-- DROP TABLE public."Experience";

CREATE TABLE public."Experience"
(
    ident_exp integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    ident integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    duration character varying(10) COLLATE pg_catalog."default" NOT NULL,
    money boolean NOT NULL,
    domain character varying(100) COLLATE pg_catalog."default" NOT NULL,
    type character varying(100) COLLATE pg_catalog."default" NOT NULL,
    contact integer,
    company integer NOT NULL,
    feel_grade integer NOT NULL,
    description character varying(10000) COLLATE pg_catalog."default",
    env_grade integer NOT NULL,
    CONSTRAINT experience PRIMARY KEY (ident_exp),
    CONSTRAINT contact FOREIGN KEY (contact)
        REFERENCES public."Contact" (id_contact) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT entreprise FOREIGN KEY (company)
        REFERENCES public."Entreprise" (id_entreprise) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT id_user FOREIGN KEY (ident)
        REFERENCES public."Utilisateur" (ident) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."Experience"
    OWNER to postgres;