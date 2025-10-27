# Step 1.5: Expense Category & Subcategory Setup

## 🎯 Goal

Create master data structure for expense categorization with:
- CFMS Expense Category (master DocType)
- CFMS Expense Subcategory (child table DocType)
- Pre-populated 9 categories with 34 subcategories

**Naming Convention:** All custom fields use prefixes:
- Category fields: `cfms_expcat_*`
- Subcategory fields: `cfms_expsubcat_*`

---

## ✅ Completed via UI

### DocTypes Created:

**1. CFMS Expense Subcategory** (Child Table)
- `cfms_expsubcat_subcategory_name` (Data, Required)
- `cfms_expsubcat_description` (Small Text)
- `cfms_expsubcat_expense_account_override` (Link → Account)

**2. CFMS Expense Category** (Master)
- `cfms_expcat_category_name` (Data, Required, Unique)
- `cfms_expcat_description` (Small Text)
- `cfms_expcat_default_department` (Link → Department)
- `cfms_expcat_default_location` (Link → Location)
- `cfms_expcat_default_cost_center` (Link → Cost Center)
- `cfms_expcat_default_expense_account` (Link → Account)
- `cfms_expcat_subcategories` (Table → CFMS Expense Subcategory)
- `cfms_expcat_is_active` (Check, Default: 1)

---

## 📊 Categories Populated

### 1. Payroll (5 subcategories)
- Base
- Variable Pay
- Bonus
- Benefits
- Other

### 2. Office (5 subcategories)
- Rent
- Utilities
- Maintenance
- Supplies
- Miscellaneous

### 3. Travel (4 subcategories)
- Domestic
- International
- Accommodation
- Local Transport

### 4. Professional Services (5 subcategories)
- Consulting
- Legal
- Audit
- IT Services
- Company Secretary

### 5. Marketing (4 subcategories)
- Advertising
- Events
- Content
- Sponsorships

### 6. Taxes (3 subcategories)
- GST
- Income Tax
- Other

### 7. GRC (3 subcategories)
- Govt Fees
- Penalties
- Insurance

### 8. Financial (4 subcategories)
- Bank Charges
- Interest
- Payment Gateway
- Liabilities (loan principal, royalties, lease payments)

### 9. Other (1 subcategory)
- Miscellaneous

**Total:** 9 categories, 34 subcategories

---

## ✅ Testing Completed

All tests passed:
- DocTypes created successfully
- All 9 categories present
- All 34 subcategories verified
- UI navigation working
- Field naming convention followed

---

## 📁 Files Created
```
cfms/cfms/doctype/
├── cfms_expense_category/
│   ├── __init__.py
│   ├── cfms_expense_category.json
│   └── cfms_expense_category.py (auto-generated)
└── cfms_expense_subcategory/
    ├── __init__.py
    ├── cfms_expense_subcategory.json
    └── cfms_expense_subcategory.py (auto-generated)
```

---

## 🎯 Philosophy

Kept the system lean:
- ✅ Covers all common expense types
- ✅ Flexible with "Miscellaneous" and "Other" options
- ✅ Clear separation between P&L expenses and cash flow items
- ✅ Ready for future enhancements without over-engineering

**From mouse to... still a mouse!** 🐭

---

**Version:** v0.82  
**Created:** October 27, 2025  
**Status:** ✅ Complete and Tested
