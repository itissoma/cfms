# Copyright (c) 2025, ETGroup
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today
from frappe.model.naming import make_autoname


class CFMSExpense(Document):
	def validate(self):
		"""Validate conditional required fields and auto-update status"""
		# If Expense Type is Project, then Project Name is required
		if self.cfms_exp_expense_type == 'Project':
			if not self.cfms_exp_project_name:
				frappe.throw('Project Name is required for Project expenses')
		
		# Amount must not be zero (Step 1.2 - CORRECTED MESSAGE)
		if self.cfms_exp_amount == 0:
			frappe.throw('Expense Amount cannot be zero. Please enter a non-zero amount.')
		
		# Auto-update Expense Status based on dates (Step 1.3 - NEW)
		self.update_payment_status()

	def autoname(self):
		"""Generate short human-readable name: EXP-YYMM-XXX-####"""
		if self.cfms_exp_month_incurred and self.cfms_exp_expense_type:
			# Extract YY-MM from date (short format)
			date_obj = getdate(self.cfms_exp_month_incurred)
			month_str = date_obj.strftime('%y%m')

			# Map expense type to 3-letter abbreviation
			type_map = {
				'Project': 'PRJ',
				'Overhead': 'OVH',
				'Financial': 'FIN',
				'Other': 'OTH'
			}
			exp_abbr = type_map.get(self.cfms_exp_expense_type, 'OTH')

			# Set name with auto counter
			self.name = make_autoname(f"EXP-{month_str}-{exp_abbr}-.####")

	def before_save(self):
		"""Set title for display"""
		if self.name:
			# For new records with proper naming (starting with EXP-)
			if self.name.startswith('EXP-'):
				# Title = Name for new records (simple and clean)
				self.title = self.name

			# For old records with ugly IDs (not starting with EXP-)
			elif not self.name.startswith('new-'):
				# Generate descriptive title for old records
				if self.cfms_exp_month_incurred and self.cfms_exp_expense_type:
					date_obj = getdate(self.cfms_exp_month_incurred)
					month_str = date_obj.strftime('%y%m')
					type_map = {
						'Project': 'PRJ',
						'Overhead': 'OVH',
						'Financial': 'FIN',
						'Other': 'OTH'
					}
					exp_abbr = type_map.get(self.cfms_exp_expense_type, 'OTH')
					amt = self.cfms_exp_amount or 0
					self.title = f"{month_str}-{exp_abbr}-{amt:,.0f}"
	
	def update_payment_status(self):
		"""Auto-update Expense Status based on dates (Step 1.3 - NEW)"""
		# If Actual Payment Date is set → Status = "Paid"
		if self.cfms_exp_actual_payment_date:
			if self.cfms_exp_expense_status != 'Paid':
				old_status = self.cfms_exp_expense_status
				self.cfms_exp_expense_status = 'Paid'
				# Log the change for user visibility
				frappe.msgprint(
					f'Expense Status auto-updated from "{old_status}" to "Paid" because Actual Payment Date is set.',
					indicator='green',
					alert=True
				)
		
		# If Payment Due Date has passed and not paid → Status = "Overdue"
		elif self.cfms_exp_payment_due_date:
			due_date = getdate(self.cfms_exp_payment_due_date)
			today_date = getdate(today())
			
			if today_date > due_date and self.cfms_exp_expense_status not in ['Paid', 'Overdue', 'On Hold', 'Cancelled']:
				old_status = self.cfms_exp_expense_status
				self.cfms_exp_expense_status = 'Overdue'
				# Log the change for user visibility
				frappe.msgprint(
					f'Expense Status auto-updated from "{old_status}" to "Overdue" because Payment Due Date has passed.',
					indicator='orange',
					alert=True
				)
