# Step 1.2: Zero Amount Validation

## 🎯 Goal
Block expenses with zero amount.

## 🚀 Deployment
Modified: `cfms_expense.py`

Added validation in `validate()` method:
```python
if self.cfms_exp_amount == 0:
    frappe.throw('Expense Amount cannot be zero. Please enter a non-zero amount.')
```

## ✅ Verification
Try to save expense with amount = 0 → Should show error

**Version:** v0.81
