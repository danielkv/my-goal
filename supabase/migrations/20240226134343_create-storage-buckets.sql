insert into storage.buckets
  (id, name, public, allowed_mime_types)
values
  ('programs', 'programs', true, '{image/*}');