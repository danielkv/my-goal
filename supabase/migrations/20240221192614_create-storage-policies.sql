create policy "Admin users can create new bucket"
  on storage.buckets for insert
  with check ( is_claims_admin() );

create policy "Admin users can upload new images"
  on storage.objects for insert
  with check ( is_claims_admin() );