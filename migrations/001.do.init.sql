create extension if not exists "uuid-ossp" with schema public;

create schema "api_public";
create schema "api_private";

grant usage on schema api_public to postgraphile;
alter default privileges in schema api_public grant usage, select on sequences to postgraphile;

create role api_anonymous;
create role api_connected_user;

grant api_anonymous to postgraphile;
grant api_connected_user to postgraphile;

CREATE FUNCTION api_public.current_user_id() RETURNS uuid AS $$
  select current_setting('api.user.id', true)::uuid
$$ LANGUAGE sql stable;

COMMENT ON FUNCTION api_public.current_user_id() is E'@omit execute';