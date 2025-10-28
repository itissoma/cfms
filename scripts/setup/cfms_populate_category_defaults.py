#!/usr/bin/env python3
"""
CFMS v0.83 - Phase 2: Populate Default Dimensions for Expense Categories

Run this in Frappe bench console:
    bench --site chs-stg.cfms.hub.etadvisory.com console
    >>> exec(open('apps/cfms/cfms_populate_category_defaults.py').read())

Author: ET Group
Date: 2025-10-28
"""

import frappe

def populate_category_defaults():
    """
    Populate default dimensions for all 9 CFMS Expense Categories
    Based on business logic and real-world operations analysis
    """

    print("\n" + "="*70)
    print("POPULATING DEFAULT DIMENSIONS FOR EXPENSE CATEGORIES")
    print("="*70)

    # Define defaults for each category
    # Format: {category_name: {field: value}}
    category_defaults = {
        'Payroll': {
            'cfms_expcat_default_department': 'Research & Development',
            'cfms_expcat_default_cost_center': 'Commercial - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Office': {
            'cfms_expcat_default_department': 'Administration - CHSPL',
            'cfms_expcat_default_cost_center': 'Overhead - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Travel': {
            'cfms_expcat_default_department': None,
            'cfms_expcat_default_cost_center': 'Overhead - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Marketing': {
            'cfms_expcat_default_department': None,
            'cfms_expcat_default_cost_center': 'Commercial - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'GRC': {
            'cfms_expcat_default_department': 'Administration - CHSPL',
            'cfms_expcat_default_cost_center': 'Overhead - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Professional Services': {
            'cfms_expcat_default_department': None,
            'cfms_expcat_default_cost_center': 'Overhead - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Financial': {
            'cfms_expcat_default_department': 'Operations',
            'cfms_expcat_default_cost_center': 'Commercial - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Taxes': {
            'cfms_expcat_default_department': 'Administration - CHSPL',
            'cfms_expcat_default_cost_center': 'Overhead - CHSPL',
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        },
        'Other': {
            'cfms_expcat_default_department': None,
            'cfms_expcat_default_cost_center': None,
            'cfms_expcat_default_location': None,
            'cfms_expcat_product_line': None
        }
    }

    # Update each category
    updated_count = 0
    for category_name, defaults in category_defaults.items():
        try:
            # Check if category exists
            if not frappe.db.exists('CFMS Expense Category', category_name):
                print(f"⚠️  Category not found: {category_name}")
                continue

            # Get category document
            category = frappe.get_doc('CFMS Expense Category', category_name)

            # Update fields
            for field, value in defaults.items():
                setattr(category, field, value)

            # Save
            category.save()

            # Display summary
            dept = defaults['cfms_expcat_default_department'] or '(blank)'
            cc = defaults['cfms_expcat_default_cost_center'] or '(blank)'
            loc = defaults['cfms_expcat_default_location'] or '(blank)'
            pl = defaults['cfms_expcat_product_line'] or '(blank)'

            print(f"\n✅ Updated: {category_name}")
            print(f"   └─ Department: {dept}")
            print(f"   └─ Cost Center: {cc}")
            print(f"   └─ Location: {loc}")
            print(f"   └─ Product Line: {pl}")

            updated_count += 1

        except Exception as e:
            print(f"\n❌ Error updating {category_name}: {str(e)}")

    # Commit changes
    frappe.db.commit()

    print("\n" + "="*70)
    print(f"COMPLETED: {updated_count}/9 categories updated successfully!")
    print("="*70)
    print("\n💡 Tip: Verify defaults in CFMS Expense Category list view")
    print("🚀 Ready for Phase 3: Add dimensions to CFMS Project\n")


if __name__ == '__main__':
    populate_category_defaults()
