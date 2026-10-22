# Implement Cron Explainer tool

Implement the planned tool in `src/tools/cron/`.

- Parse standard 5-field cron expressions: `*`, lists, ranges, steps, and month/day names (`JAN`, `MON`)
- Explain in plain English, e.g. "At 09:00 on Monday through Friday"
- Show the next 5 run times in local time
- Invalid expressions show which field is wrong
- No dependencies, write the parser. Thorough tests; set status to `ready`
