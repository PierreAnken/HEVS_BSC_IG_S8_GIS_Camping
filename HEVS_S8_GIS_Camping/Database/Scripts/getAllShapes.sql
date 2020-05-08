SELECT * FROM public.camping_areas
union 
select * from public.places
union 
select * from public.buildings
union
select * from public.pools
union
select * from public.trees;