-- Table: public."Contact"

-- DROP TABLE public."Contact";

CREATE TABLE public."Contact"
(
    "last_Name" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "first_Name" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id_contact integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    phone_number character varying(20) COLLATE pg_catalog."default",
    "mail_Contact" character varying(100) COLLATE pg_catalog."default",
    enibien boolean NOT NULL,
    CONSTRAINT "Contact_pkey" PRIMARY KEY (id_contact)
)

TABLESPACE pg_default;

ALTER TABLE public."Contact"
    OWNER to postgres;