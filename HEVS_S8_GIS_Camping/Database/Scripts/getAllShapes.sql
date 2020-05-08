SELECT * FROM public.camping_area 
union 
select * from public.areas
union 
select * from public.buildings
union 
select * from public.camping_area
union
select * from public.pools
union
select * from public.trees;