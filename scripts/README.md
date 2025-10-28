# CFMS Utility Scripts

## Purpose
Collection of one-time setup and maintenance scripts for CFMS module.

## Directory Structure
- `setup/` - One-time setup scripts (run once per environment)
- `maintenance/` - Recurring maintenance/data cleanup scripts

## Usage
All scripts should be run from Frappe console:
```bash
cd /home/frappe/frappe-bench
bench --site <sitename> console
>>> exec(open('apps/cfms/scripts/setup/script_name.py').read())
```

## Scripts Inventory

### Setup Scripts
- `cfms_populate_category_defaults.py` - Populates default dimensions for all 9 expense categories (v0.83 Phase 2)

### Maintenance Scripts
(None yet)

## Author
ET Group

## Notes
- All scripts are idempotent (safe to re-run)
- Scripts use absolute paths for console execution
- Test scripts go in `sandbox/` directory (NOT gitignored)
