-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

DROP FUNCTION IF EXISTS graphql.build_update(ast jsonb, variable_definitions jsonb, variables jsonb, parent_type text, parent_block_name text);

DROP FUNCTION IF EXISTS graphql.cache_key(role regrole, ast jsonb, variables jsonb);

DROP FUNCTION IF EXISTS graphql.build_insert(ast jsonb, variable_definitions jsonb, variables jsonb, parent_type text);

DROP FUNCTION IF EXISTS graphql.build_delete(ast jsonb, variable_definitions jsonb, variables jsonb, parent_type text, parent_block_name text);

DROP TABLE IF EXISTS graphql._field CASCADE;

DROP TABLE IF EXISTS graphql._type CASCADE;

CREATE TABLE IF NOT EXISTS public.profiles
(
    "user" uuid NOT NULL,
    roles integer[],
    username character varying COLLATE pg_catalog."default",
    CONSTRAINT profiles_pkey PRIMARY KEY ("user"),
    CONSTRAINT profiles_username_key UNIQUE (username),
    CONSTRAINT profiles_user_fkey FOREIGN KEY ("user")
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.profiles TO supabase_admin;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO postgres;

GRANT ALL ON TABLE public.profiles TO service_role;

COMMENT ON TABLE public.profiles
    IS 'Données associées aux utilisateurs';

CREATE TABLE IF NOT EXISTS public.levels
(
    id smallint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
    school integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT levels_pkey PRIMARY KEY (id),
    CONSTRAINT levels_id_key UNIQUE (id),
    CONSTRAINT levels_school_fkey FOREIGN KEY (school)
        REFERENCES public.schools (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.levels
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.levels TO supabase_admin;

GRANT ALL ON TABLE public.levels TO authenticated;

GRANT ALL ON TABLE public.levels TO anon;

GRANT ALL ON TABLE public.levels TO postgres;

GRANT ALL ON TABLE public.levels TO service_role;

COMMENT ON TABLE public.levels
    IS 'Niveau';

CREATE TABLE IF NOT EXISTS public.deposits
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    publication_date timestamp with time zone NOT NULL DEFAULT now(),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    level smallint NOT NULL,
    description text COLLATE pg_catalog."default",
    content bigint[],
    owners uuid[],
    CONSTRAINT repositories_pkey PRIMARY KEY (id),
    CONSTRAINT deposits_level_fkey FOREIGN KEY (level)
        REFERENCES public.levels (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.deposits
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.deposits TO anon;

GRANT ALL ON TABLE public.deposits TO postgres;

GRANT ALL ON TABLE public.deposits TO supabase_admin;

GRANT ALL ON TABLE public.deposits TO authenticated;

GRANT ALL ON TABLE public.deposits TO service_role;

COMMENT ON TABLE public.deposits
    IS 'Dépots de ressources';

CREATE TABLE IF NOT EXISTS public.deposits_chat_messages
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    date timestamp with time zone DEFAULT now(),
    author uuid,
    content text COLLATE pg_catalog."default" DEFAULT '""'::text,
    "depoId" bigint NOT NULL,
    CONSTRAINT deposits_chat_messages_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.deposits_chat_messages
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.deposits_chat_messages TO anon;

GRANT ALL ON TABLE public.deposits_chat_messages TO postgres;

GRANT ALL ON TABLE public.deposits_chat_messages TO supabase_admin;

GRANT ALL ON TABLE public.deposits_chat_messages TO authenticated;

GRANT ALL ON TABLE public.deposits_chat_messages TO service_role;

COMMENT ON TABLE public.deposits_chat_messages
    IS 'Messages des dépots de cours';

CREATE TABLE IF NOT EXISTS public.themes
(
    level bigint NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    description text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT themes_pkey PRIMARY KEY (id),
    CONSTRAINT themes_level_fkey FOREIGN KEY (level)
        REFERENCES public.levels (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.themes
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.themes TO anon;

GRANT ALL ON TABLE public.themes TO postgres;

GRANT ALL ON TABLE public.themes TO supabase_admin;

GRANT ALL ON TABLE public.themes TO authenticated;

GRANT ALL ON TABLE public.themes TO service_role;

COMMENT ON TABLE public.themes
    IS 'Thèmes vu dans l''année pour chaque niveau';

CREATE TABLE IF NOT EXISTS public.blacklist
(
    id uuid NOT NULL,
    reason character varying COLLATE pg_catalog."default",
    date_of_ban date NOT NULL,
    end_of_ban date,
    banned_by uuid,
    CONSTRAINT blacklist_pkey PRIMARY KEY (id),
    CONSTRAINT blacklist_banned_by_fkey FOREIGN KEY (banned_by)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT blacklist_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.blacklist
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.blacklist TO supabase_admin;

GRANT ALL ON TABLE public.blacklist TO authenticated;

GRANT ALL ON TABLE public.blacklist TO anon;

GRANT ALL ON TABLE public.blacklist TO postgres;

GRANT ALL ON TABLE public.blacklist TO service_role;

CREATE TABLE IF NOT EXISTS public.news
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    date timestamp with time zone NOT NULL DEFAULT now(),
    title text COLLATE pg_catalog."default" NOT NULL,
    visible boolean NOT NULL DEFAULT false,
    concerned smallint[] NOT NULL DEFAULT '{}'::smallint[],
    content character varying COLLATE pg_catalog."default" NOT NULL DEFAULT ''::character varying,
    CONSTRAINT news_pkey PRIMARY KEY (id),
    CONSTRAINT news_id_key UNIQUE (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.news
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.news TO anon;

GRANT ALL ON TABLE public.news TO postgres;

GRANT ALL ON TABLE public.news TO supabase_admin;

GRANT ALL ON TABLE public.news TO authenticated;

GRANT ALL ON TABLE public.news TO service_role;

COMMENT ON TABLE public.news
    IS 'Actualités ';

CREATE TABLE IF NOT EXISTS public.history_points
(
    id smallint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    content text COLLATE pg_catalog."default",
    date date NOT NULL DEFAULT now(),
    visible boolean NOT NULL DEFAULT false,
    CONSTRAINT "History points_pkey" PRIMARY KEY (id),
    CONSTRAINT "History points_id_key" UNIQUE (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.history_points
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.history_points TO anon;

GRANT ALL ON TABLE public.history_points TO postgres;

GRANT ALL ON TABLE public.history_points TO supabase_admin;

GRANT ALL ON TABLE public.history_points TO authenticated;

GRANT ALL ON TABLE public.history_points TO service_role;

COMMENT ON TABLE public.history_points
    IS 'Données pour la page d''histoire';

CREATE TABLE IF NOT EXISTS public.permissions
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name text COLLATE pg_catalog."default",
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.permissions
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.permissions TO anon;

GRANT ALL ON TABLE public.permissions TO postgres;

GRANT ALL ON TABLE public.permissions TO supabase_admin;

GRANT ALL ON TABLE public.permissions TO authenticated;

GRANT ALL ON TABLE public.permissions TO service_role;

COMMENT ON TABLE public.permissions
    IS 'Permissions possibles des utilisateurs';

CREATE TABLE IF NOT EXISTS public.repository_file
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    icon character varying COLLATE pg_catalog."default" DEFAULT 'article'::character varying,
    date timestamp with time zone DEFAULT now(),
    last_commit_author character varying COLLATE pg_catalog."default",
    last_commit_text text COLLATE pg_catalog."default",
    name character varying COLLATE pg_catalog."default" DEFAULT 'Pas de titre :('::character varying,
    file_url character varying COLLATE pg_catalog."default",
    CONSTRAINT repository_file_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.repository_file
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.repository_file TO anon;

GRANT ALL ON TABLE public.repository_file TO postgres;

GRANT ALL ON TABLE public.repository_file TO supabase_admin;

GRANT ALL ON TABLE public.repository_file TO authenticated;

GRANT ALL ON TABLE public.repository_file TO service_role;

COMMENT ON TABLE public.repository_file
    IS 'fichier de cours';

COMMENT ON COLUMN public.repository_file.file_url
    IS 'The url of the file';

CREATE TABLE IF NOT EXISTS public.schools
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT schools_pkey PRIMARY KEY (id),
    CONSTRAINT schools_id_key UNIQUE (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.schools
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.schools TO anon;

GRANT ALL ON TABLE public.schools TO postgres;

GRANT ALL ON TABLE public.schools TO supabase_admin;

GRANT ALL ON TABLE public.schools TO authenticated;

GRANT ALL ON TABLE public.schools TO service_role;

COMMENT ON TABLE public.schools
    IS 'Collège / Lycée';
