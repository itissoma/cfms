# Step 1.5: Expense Category & Subcategory Setup

## 🎯 Goal

Create master data structure for expense categorization with:
- CFMS Expense Category (master DocType)
- CFMS Expense Subcategory (child table)
- Pre-populated categories with subcategories

---

## 📋 Part A: Create DocTypes via UI

### Step A1: Create CFMS Expense Subcategory (Child Table First)

1. **Go to:** DocType List
2. **Click:** New
3. **Fill:**
   - **Name:** CFMS Expense Subcategory
   - **Module:** CFMS
   - **Is Child Table:** ✅ Check this!
   
4. **Add Fields:**

| Field Name | Type | Label | Required | In List View | Bold |
|------------|------|-------|----------|--------------|------|
| subcategory_name | Data | Subcategory Name | ✅ Yes | ✅ Yes | ✅ Yes |
| description | Small Text | Description | ❌ No | ✅ Yes | ❌ No |
| expense_account_override | Link | Expense Account (Override) | ❌ No | ❌ No | ❌ No |

   - For expense_account_override: Options = "Account"
   - Description: "Leave blank to use category default"

5. **Click:** Save

---

### Step A2: Create CFMS Expense Category (Parent DocType)

1. **Go to:** DocType List
2. **Click:** New
3. **Fill:**
   - **Name:** CFMS Expense Category
   - **Module:** CFMS
   - **Naming Rule:** By fieldname
   - **Autoname:** field:category_name
   - **Track Changes:** ✅ Yes

4. **Add Fields:**

#### Basic Info:
- **category_name** (Data) - Required, Unique, Bold, In List View
- **description** (Small Text)

#### Section Break: "Default Cost Allocation"
- **default_department** (Link → Department)
- **default_location** (Link → Location)
- **default_cost_center** (Link → Cost Center)

#### Section Break: "Accounting Settings"
- **default_expense_account** (Link → Account)

#### Section Break: "Subcategories"
- **subcategories** (Table → CFMS Expense Subcategory)

#### Section Break: "Settings"
- **is_active** (Check) - Default: 1

5. **Permissions:**
   - System Manager: Full access
   - CFMS Accountant: Read only

6. **Click:** Save

---

## 📋 Part B: Populate Sample Categories

### Option 1: Via Console Script
```bash
cd /home/frappe/frappe-bench
bench --site chs-stg.cfms.hub.etadvisory.com console
```

Paste this:
```python
import frappe

categories = [
    {
        'category_name': 'Payroll',
        'description': 'Employee compensation and benefits',
        'subcategories': [
            {'subcategory_name': 'Base', 'description': 'Base salary'},
            {'subcategory_name': 'Variable Pay', 'description': 'Variable compensation'},
            {'subcategory_name': 'Bonus', 'description': 'Performance bonuses'},
            {'subcategory_name': 'Benefits', 'description': 'Health insurance, PF'},
            {'subcategory_name': 'Other', 'description': 'Other payroll'}
        ]
    },
    {
        'category_name': 'Office',
        'description': 'Office and facilities',
        'subcategories': [
            {'subcategory_name': 'Rent', 'description': 'Office rent'},
            {'subcategory_name': 'Utilities', 'description': 'Electricity, water, internet'},
            {'subcategory_name': 'Maintenance', 'description': 'Office maintenance'},
            {'subcategory_name': 'Supplies', 'description': 'Office supplies'}
        ]
    },
    {
        'category_name': 'Travel',
        'description': 'Business travel',
        'subcategories': [
            {'subcategory_name': 'Domestic', 'description': 'Domestic travel'},
            {'subcategory_name': 'International', 'description': 'International travel'},
            {'subcategory_name': 'Accommodation', 'description': 'Hotels'},
            {'subcategory_name': 'Local Transport', 'description': 'Taxi, metro'}
        ]
    },
    {
        'category_name': 'Professional Services',
        'description': 'External services',
        'subcategories': [
            {'subcategory_name': 'Consulting', 'description': 'Consulting fees'},
            {'subcategory_name': 'Legal', 'description': 'Legal services'},
            {'subcategory_name': 'Audit', 'description': 'Audit services'},
            {'subcategory_name': 'IT Services', 'description': 'IT services'}
        ]
    },
    {
        'category_name': 'Marketing',
        'description': 'Sales and marketing',
        'subcategories': [
            {'subcategory_name': 'Advertising', 'description': 'Advertising'},
            {'subcategory_name': 'Events', 'description': 'Events'},
            {'subcategory_name': 'Content', 'description': 'Content creation'},
            {'subcategory_name': 'Sponsorships', 'description': 'Sponsorships'}
        ]
    },
    {
        'category_name': 'Taxes',
        'description': 'Tax payments',
        'subcategories': [
            {'subcategory_name': 'GST', 'description': 'GST'},
            {'subcategory_name': 'Income Tax', 'description': 'Corporate tax'},
            {'subcategory_name': 'Other', 'description': 'Other taxes'}
        ]
    },
    {
        'category_name': 'GRC',
        'description': 'Governance, Risk, Compliance',
        'subcategories': [
            {'subcategory_name': 'Govt Fees', 'description': 'Government fees'},
            {'subcategory_name': 'Penalties', 'description': 'Fines'},
            {'subcategory_name': 'Insurance', 'description': 'Insurance'}
        ]
    },
    {
        'category_name': 'Financial',
        'description': 'Financial expenses',
        'subcategories': [
            {'subcategory_name': 'Bank Charges', 'description': 'Bank fees'},
            {'subcategory_name': 'Interest', 'description': 'Loan interest'},
            {'subcategory_name': 'Payment Gateway', 'description': 'Gateway charges'}
        ]
    },
    {
        'category_name': 'Other',
        'description': 'Miscellaneous',
        'subcategories': [
            {'subcategory_name': 'Miscellaneous', 'description': 'Other expenses'}
        ]
    }
]

for cat_data in categories:
    try:
        if frappe.db.exists('CFMS Expense Category', cat_data['category_name']):
            print(f"⏭️  Skipping {cat_data['category_name']}")
            continue
        
        cat = frappe.get_doc({
            'doctype': 'CFMS Expense Category',
            'category_name': cat_data['category_name'],
            'description': cat_data['description'],
            'is_active': 1,
            'subcategories': cat_data.get('subcategories', [])
        })
        cat.insert()
        print(f"✅ Created: {cat_data['category_name']}")
    except Exception as e:
        print(f"❌ Error: {cat_data['category_name']}: {str(e)}")

frappe.db.commit()
print("\n🎉 Done!")
```

Press Ctrl+D to exit.

---

## ✅ Verify
```bash
bench --site chs-stg.cfms.hub.etadvisory.com console
```
```python
import frappe
cats = frappe.get_all('CFMS Expense Category', fields=['name'])
print(f"Categories: {len(cats)}")
for c in cats:
    print(f"  - {c.name}")
```

---

## 📊 Categories Created

1. Payroll (5 subcategories)
2. Office (4 subcategories)
3. Travel (4 subcategories)
4. Professional Services (4 subcategories)
5. Marketing (4 subcategories)
6. Taxes (3 subcategories)
7. GRC (3 subcategories)
8. Financial (3 subcategories)
9. Other (1 subcategory)

**Total:** 9 categories, 33 subcategories

---

**Version:** v0.82  
**Created:** October 26, 2025
