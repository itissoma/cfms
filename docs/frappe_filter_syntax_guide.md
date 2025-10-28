# Frappe Filter Syntax - Complete Guide

## Overview

Frappe uses a declarative filter syntax for querying data across all DocTypes. This syntax provides a clean, SQL-injection-safe way to filter records without writing raw SQL queries.

**Think of it as:** Frappe's standardized "WHERE clause" language that compiles to SQL behind the scenes.

---

## Basic Structure

### Single Filter
```python
[["DocType", "field", "operator", "value"]]
```

### Multiple Filters (AND logic)
```python
[
  ["DocType", "field1", "operator", "value1"],
  ["DocType", "field2", "operator", "value2"]
]
```

### OR Logic
```python
[
  ["DocType", "field1", "=", "value1"],
  "OR",
  ["DocType", "field2", "=", "value2"]
]
```

---

## Available Operators

| Operator | Meaning | Example Usage | SQL Equivalent |
|----------|---------|---------------|----------------|
| `=` | Equals | `["status", "=", "Active"]` | `WHERE status = 'Active'` |
| `!=` | Not equals | `["status", "!=", "Cancelled"]` | `WHERE status != 'Cancelled'` |
| `>` | Greater than | `["amount", ">", 1000]` | `WHERE amount > 1000` |
| `<` | Less than | `["amount", "<", 5000]` | `WHERE amount < 5000` |
| `>=` | Greater or equal | `["date", ">=", "2025-01-01"]` | `WHERE date >= '2025-01-01'` |
| `<=` | Less or equal | `["date", "<=", "2025-12-31"]` | `WHERE date <= '2025-12-31'` |
| `in` | In list | `["name", "in", ["A", "B", "C"]]` | `WHERE name IN ('A', 'B', 'C')` |
| `not in` | Not in list | `["status", "not in", ["Draft"]]` | `WHERE status NOT IN ('Draft')` |
| `like` | Pattern match | `["name", "like", "%Project%"]` | `WHERE name LIKE '%Project%'` |
| `not like` | Not pattern | `["name", "not like", "%Test%"]` | `WHERE name NOT LIKE '%Test%'` |
| `is` | Is null/set | `["parent", "is", "set"]` | `WHERE parent IS NOT NULL` |
| `is` | Is not set | `["parent", "is", "not set"]` | `WHERE parent IS NULL` |
| `between` | Range | `["date", "between", ["2025-01-01", "2025-12-31"]]` | `WHERE date BETWEEN '2025-01-01' AND '2025-12-31'` |

---

## Real-World Examples

### Example 1: Simple Equality Filter
```python
# Get all active departments
frappe.get_all('Department',
    filters=[['Department', 'disabled', '=', 0]],
    fields=['name', 'department_name'])
```

**SQL Equivalent:**
```sql
SELECT name, department_name 
FROM `tabDepartment` 
WHERE disabled = 0
```

---

### Example 2: IN Operator (Multiple Values)
```python
# Get specific cost centers
frappe.get_all('Cost Center',
    filters=[['Cost Center', 'name', 'in', ['Commercial - CHSPL', 'Overhead - CHSPL']]],
    fields=['name', 'cost_center_name'])
```

**SQL Equivalent:**
```sql
SELECT name, cost_center_name 
FROM `tabCost Center` 
WHERE name IN ('Commercial - CHSPL', 'Overhead - CHSPL')
```

---

### Example 3: Multiple AND Filters
```python
# Get overhead expenses over 5000
frappe.get_all('CFMS Expense',
    filters=[
        ['CFMS Expense', 'cfms_exp_expense_type', '=', 'Overhead'],
        ['CFMS Expense', 'cfms_exp_amount', '>', 5000]
    ],
    fields=['name', 'cfms_exp_amount', 'cfms_exp_category'])
```

**SQL Equivalent:**
```sql
SELECT name, cfms_exp_amount, cfms_exp_category 
FROM `tabCFMS Expense` 
WHERE cfms_exp_expense_type = 'Overhead' 
  AND cfms_exp_amount > 5000
```

---

### Example 4: OR Logic
```python
# Get Commercial or Non-Commercial cost centers
frappe.get_all('Cost Center',
    filters=[
        ['Cost Center', 'cost_center_name', '=', 'Commercial'],
        'OR',
        ['Cost Center', 'cost_center_name', '=', 'Non-Commercial']
    ],
    fields=['name', 'cost_center_name'])
```

**SQL Equivalent:**
```sql
SELECT name, cost_center_name 
FROM `tabCost Center` 
WHERE cost_center_name = 'Commercial' 
   OR cost_center_name = 'Non-Commercial'
```

---

### Example 5: LIKE Pattern Matching
```python
# Get all departments with "Admin" in the name
frappe.get_all('Department',
    filters=[['Department', 'name', 'like', '%Admin%']],
    fields=['name', 'department_name'])
```

**SQL Equivalent:**
```sql
SELECT name, department_name 
FROM `tabDepartment` 
WHERE name LIKE '%Admin%'
```

---

### Example 6: IS NULL / IS NOT NULL
```python
# Get item groups without a parent
frappe.get_all('Item Group',
    filters=[['Item Group', 'parent_item_group', 'is', 'not set']],
    fields=['name', 'item_group_name'])

# Get item groups WITH a parent
frappe.get_all('Item Group',
    filters=[['Item Group', 'parent_item_group', 'is', 'set']],
    fields=['name', 'parent_item_group'])
```

**SQL Equivalent:**
```sql
-- Not set
WHERE parent_item_group IS NULL

-- Is set  
WHERE parent_item_group IS NOT NULL
```

---

### Example 7: BETWEEN (Date Range)
```python
# Get expenses in October 2025
frappe.get_all('CFMS Expense',
    filters=[['CFMS Expense', 'cfms_exp_date', 'between', ['2025-10-01', '2025-10-31']]],
    fields=['name', 'cfms_exp_date', 'cfms_exp_amount'])
```

**SQL Equivalent:**
```sql
SELECT name, cfms_exp_date, cfms_exp_amount 
FROM `tabCFMS Expense` 
WHERE cfms_exp_date BETWEEN '2025-10-01' AND '2025-10-31'
```

---

## Shorthand Syntax

When querying the same DocType, you can omit the DocType name:

### Long Form (Explicit)
```python
frappe.get_all('Department',
    filters=[['Department', 'name', 'in', ['Sales', 'Operations']]],
    fields=['name'])
```

### Short Form (Implicit)
```python
frappe.get_all('Department',
    filters=[['name', 'in', ['Sales', 'Operations']]],
    fields=['name'])
```

**Both produce the same result!** Use long form for clarity, especially in Link Filters.

---

## Dict Syntax (Single Filter Only)

For a single filter on the target DocType, you can use dict syntax:

### Filter Syntax
```python
frappe.get_all('Department',
    filters=[['is_group', '=', 0]],
    fields=['name'])
```

### Dict Syntax (equivalent)
```python
frappe.get_all('Department',
    filters={'is_group': 0},
    fields=['name'])
```

**Note:** Dict syntax only works for simple equality on the queried DocType. Use filter syntax for complex queries.

---

## Using Filters in Link Fields (DocType Customization)

When adding Link fields to DocTypes, you can restrict the dropdown options using Link Filters.

### Example: CFMS Project - Product Line Filter

**Goal:** Show only Choco, Scylla, and Other (children of "CFMS Product Line")

**Link Filter:**
```json
[["Item Group", "parent_item_group", "=", "CFMS Product Line"]]
```

**Result:** Dropdown shows only:
- Choco
- Scylla  
- Other

---

### Example: CFMS Project - Department Filter

**Goal:** Show only 4 relevant departments (hide the 11 others)

**Link Filter:**
```json
[["Department", "name", "in", ["Administration - CHSPL", "Research & Development", "Operations", "Sales"]]]
```

**Result:** Dropdown shows only these 4 departments.

---

### Example: CFMS Project - Cost Center Filter

**Goal:** Show only leaf cost centers (not the parent group)

**Link Filter:**
```json
[["Cost Center", "name", "in", ["Commercial - CHSPL", "Non-Commercial - CHSPL", "Overhead - CHSPL"]]]
```

**Result:** Dropdown shows 3 cost centers, excludes root "Corporate Health Solutions Pvt Limited - CHSPL"

---

## Practice Exercises

Try these in the Frappe console (`bench --site <sitename> console`):

### Exercise 1: Get All Active Projects
```python
frappe.get_all('CFMS Project',
    filters=[['cfms_prj_status', '!=', 'Cancelled']],
    fields=['name', 'title', 'cfms_prj_status'])
```

---

### Exercise 2: Get High-Value Expenses
```python
frappe.get_all('CFMS Expense',
    filters=[['cfms_exp_amount', '>=', 10000]],
    fields=['name', 'cfms_exp_amount', 'cfms_exp_category'],
    order_by='cfms_exp_amount desc')
```

---

### Exercise 3: Get Expenses by Multiple Categories
```python
frappe.get_all('CFMS Expense',
    filters=[['cfms_exp_category', 'in', ['Payroll', 'Office', 'Travel']]],
    fields=['name', 'cfms_exp_category', 'cfms_exp_amount'])
```

---

### Exercise 4: Get Project Expenses (Exclude Overhead)
```python
frappe.get_all('CFMS Expense',
    filters=[['cfms_exp_expense_type', '!=', 'Overhead']],
    fields=['name', 'cfms_exp_expense_type', 'cfms_exp_project_name'])
```

---

### Exercise 5: Get Expenses in a Date Range
```python
frappe.get_all('CFMS Expense',
    filters=[['cfms_exp_date', 'between', ['2025-10-01', '2025-10-31']]],
    fields=['name', 'cfms_exp_date', 'cfms_exp_amount'])
```

---

## Advanced Patterns

### Nested OR with AND
```python
# Get Commercial OR Overhead expenses over 1000
frappe.get_all('CFMS Expense',
    filters=[
        [
            ['cfms_exp_cost_center', '=', 'Commercial - CHSPL'],
            'OR',
            ['cfms_exp_cost_center', '=', 'Overhead - CHSPL']
        ],
        ['cfms_exp_amount', '>', 1000]
    ],
    fields=['name', 'cfms_exp_amount', 'cfms_exp_cost_center'])
```

---

### Combining Multiple Conditions
```python
# Get Payroll expenses in October with specific department
frappe.get_all('CFMS Expense',
    filters=[
        ['cfms_exp_category', '=', 'Payroll'],
        ['cfms_exp_date', 'between', ['2025-10-01', '2025-10-31']],
        ['cfms_exp_department', '=', 'Research & Development']
    ],
    fields=['name', 'cfms_exp_amount', 'cfms_exp_date'])
```

---

## Common Use Cases in CFMS

### 1. Filter Expenses by Project
```python
frappe.get_all('CFMS Expense',
    filters=[['cfms_exp_project_name', '=', 'PRJ-001']],
    fields=['name', 'cfms_exp_amount', 'cfms_exp_category'])
```

---

### 2. Get All Unpaid Projects
```python
frappe.get_all('CFMS Project',
    filters=[['cfms_prj_is_paid', '=', 'No']],
    fields=['name', 'title', 'cfms_prj_total_estimated_revenues'])
```

---

### 3. Get Revenue by Source Type
```python
frappe.get_all('CFMS Revenue',
    filters=[['cfms_rev_revenue_source', '=', 'Project']],
    fields=['name', 'cfms_rev_amount', 'cfms_rev_project_name'])
```

---

### 4. Get Overdue Revenue (Payment Expected but Not Received)
```python
from frappe.utils import today

frappe.get_all('CFMS Revenue',
    filters=[
        ['cfms_rev_payment_receipt_status', '=', 'Overdue'],
        ['cfms_rev_receipt_date_expected', '<', today()]
    ],
    fields=['name', 'cfms_rev_amount', 'cfms_rev_receipt_date_expected'])
```

---

## How Frappe Compiles to SQL

Behind the scenes, Frappe's ORM translates filters to SQL:

### Filter Syntax:
```python
[["Item Group", "parent_item_group", "=", "CFMS Product Line"]]
```

### Compiled SQL:
```sql
SELECT * 
FROM `tabItem Group` 
WHERE `parent_item_group` = 'CFMS Product Line'
```

**Benefits:**
- ✅ SQL injection safe (parameterized queries)
- ✅ Cross-database compatible (MariaDB/PostgreSQL)
- ✅ Clean, readable syntax
- ✅ Works across all Frappe modules

---

## Official Documentation Links

### Frappe Framework
- **Database API:** https://frappeframework.com/docs/user/en/api/database
- **ORM Guide:** https://frappeframework.com/docs/user/en/basics/doctypes/orm
- **Query Builder:** https://frappeframework.com/docs/user/en/api/query-builder

### ERPNext Developer Docs
- **API Reference:** https://docs.erpnext.com/docs/user/manual/en/customize-erpnext/articles/developer-apis
- **Custom Scripts:** https://docs.erpnext.com/docs/user/manual/en/customize-erpnext/custom-scripts

### Community Resources
- **Frappe Forum:** https://discuss.frappe.io/
- **GitHub Examples:** https://github.com/frappe/frappe/tree/develop/frappe/tests

---

## Learning Path

### Level 1: Console Experiments (Beginner)
Start with simple queries in the console:
```python
# Get all records
frappe.get_all('Department', fields=['name'])

# Add one filter
frappe.get_all('Department', 
    filters={'is_group': 0},
    fields=['name'])
```

### Level 2: Complex Queries (Intermediate)
Combine multiple filters and operators:
```python
frappe.get_all('CFMS Expense',
    filters=[
        ['cfms_exp_expense_type', '=', 'Overhead'],
        ['cfms_exp_amount', '>', 1000],
        ['cfms_exp_category', 'in', ['Payroll', 'Office']]
    ],
    fields=['name', 'cfms_exp_amount'])
```

### Level 3: DocType Customization (Advanced)
Apply filters to Link fields in DocType definitions:
```json
[["Item Group", "parent_item_group", "=", "CFMS Product Line"]]
```

### Level 4: Custom APIs & Reports (Expert)
Build custom reports and APIs using Frappe Query Builder and advanced ORM features.

---

## Tips & Best Practices

### ✅ DO:
- Use explicit DocType names in filters for clarity
- Use `in` operator for multiple values instead of multiple OR conditions
- Leverage Link Filters in DocTypes to improve UX
- Test filters in console before applying to production
- Use `fields` parameter to fetch only needed columns (performance)

### ❌ DON'T:
- Don't use dict syntax for complex filters
- Don't write raw SQL queries (use ORM instead)
- Don't forget to handle None/null values in filters
- Don't over-filter in Link Fields (balance usability vs. restriction)

---

## Debugging Filters

### Check the Generated SQL
```python
# Enable SQL query logging
frappe.db.sql_list("SET GLOBAL general_log = 'ON'")

# Run your query
frappe.get_all('Department', filters=[['name', 'like', '%Admin%']])

# Check the log
frappe.db.sql("SELECT * FROM mysql.general_log ORDER BY event_time DESC LIMIT 10")
```

### Print Filter Results
```python
# Debug: Print the filter before using it
filters = [['CFMS Expense', 'cfms_exp_category', '=', 'Payroll']]
print(f"Applying filters: {filters}")

result = frappe.get_all('CFMS Expense', filters=filters, fields=['name'])
print(f"Found {len(result)} records")
```

---

## Conclusion

Frappe's filter syntax is a powerful, declarative way to query data across the framework. Master it to:
- Write cleaner, safer queries
- Build better user experiences with filtered Link fields  
- Create dynamic reports and APIs
- Understand ERPNext internals better

**It's like learning SQL WHERE clauses, but Frappe-style!** 🚀

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-28 | ET Group | Initial comprehensive guide created for CFMS v0.83 |

---

## Related Documentation

- [CFMS Setup Scripts README](../scripts/README.md)
- [CFMS Dimension Integration Guide](./dimension_integration.md) *(coming soon)*
- [CFMS API Reference](./api_reference.md) *(coming soon)*
