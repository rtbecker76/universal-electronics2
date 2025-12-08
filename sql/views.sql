CREATE VIEW public.vw_order_details WITH (SECURITY_INVOKER) AS
SELECT
  o.order_id,
  o.order_date,
  o.user_id,
  d.order_detail_id,
  d.quantity,
  d.cost,
  p.product_id,
  p.product_name,
  p.price,
  p.vendor_id,
  p.in_stock
FROM
  orders o
  JOIN order_details d ON o.order_id = d.order_id
  JOIN products p ON p.product_id = d.product_id;

CREATE VIEW public.vw_orders WITH (SECURITY_INVOKER) AS
select
  o.order_id,
  o.order_date,
  o.user_id,
  sum(d.cost) AS total_cost
FROM
  orders o
  JOIN order_details d on o.order_id = d.order_id
GROUP BY
  o.order_id,
  o.order_date,
  o.user_id;

CREATE VIEW public.vw_revenue_by_product WITH (SECURITY_INVOKER) AS
select
  product_id,
  product_name,
  round(sum(cost)) AS total_cost,
  count(order_id) AS record_count
FROM
  vw_order_details
GROUP BY
  product_id,
  product_name
order by
  product_id;

CREATE VIEW public.vw_revenue_by_month WITH (SECURITY_INVOKER) AS
select
  to_char(
    date_trunc('year'::text, order_date),
    'YYYY'::text
  ) AS year,
  to_char(
    date_trunc('month'::text, order_date),
    'Mon YYYY'::text
  ) AS label,
  date_trunc('month'::text, order_date) AS month,
  round(sum(cost)) AS total_cost,
  count(order_id) AS record_count
FROM
  vw_order_details
GROUP BY
  (
    to_char(
      date_trunc('year'::text, order_date),
      'YYYY'::text
    )
  ),
  (date_trunc('month'::text, order_date)),
  (
    to_char(
      date_trunc('month'::text, order_date),
      'Mon YYYY'::text
    )
  )
order by
  (date_trunc('month'::text, order_date));

