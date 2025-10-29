# Copyright (c) 2025, ETGroup
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today
from frappe.model.naming import make_autoname


class CFMSRevenue(Document):
	def validate(self):
		"""Validate conditional required fields and auto-update status"""
		# Amount must not be zero
		if self.cfms_rev_amount == 0:
			frappe.throw('Revenue Amount cannot be zero. Please enter a positive or negative amount.')

		# Auto-update Receipt Status based on dates
		self.update_receipt_status()

	def autoname(self):
		"""Generate short human-readable name: REV-YYMM-XXX-####"""
		if self.cfms_rev_work_period_month and self.cfms_rev_revenue_source:
			# Extract YY-MM from date (short format)
			date_obj = getdate(self.cfms_rev_work_period_month)
			month_str = date_obj.strftime('%y%m')

			# Map revenue source to 3-letter abbreviation
			source_map = {
				'Project': 'PRJ',
				'Financial': 'FIN',
				'Other': 'OTH'
			}
			rev_abbr = source_map.get(self.cfms_rev_revenue_source, 'OTH')

			# Set name with auto counter (4 digits to match expense)
			self.name = make_autoname(f"REV-{month_str}-{rev_abbr}-.####")

	def before_save(self):
		"""Set title, populate from project, and validate customers"""
		if self.name:
			# For new records with proper naming (starting with REV-)
			if self.name.startswith('REV-'):
				# Title = Name for new records (simple and clean)
				self.title = self.name

			# For old records with ugly IDs (not starting with REV-)
			elif not self.name.startswith('new-'):
				# Generate descriptive title for old records
				if self.cfms_rev_work_period_month and self.cfms_rev_revenue_source:
					date_obj = getdate(self.cfms_rev_work_period_month)
					month_str = date_obj.strftime('%y%m')
					source_map = {
						'Project': 'PRJ',
						'Financial': 'FIN',
						'Other': 'OTH'
					}
					rev_abbr = source_map.get(self.cfms_rev_revenue_source, 'OTH')
					amt = self.cfms_rev_amount or 0
					self.title = f"{month_str}-{rev_abbr}-{amt:,.0f}"

		# Auto-populate customers from project (runs FIRST)
		self.populate_from_project()

		# Auto-populate dimensions from project (runs SECOND)
		self.populate_dimensions_from_project()

		# Validate customers AFTER population (runs THIRD)
		if self.cfms_rev_revenue_source == 'Project':
			if not self.cfms_rev_project_customer:
				frappe.throw('Project Customer is required for Project revenue. Please ensure the project has a customer assigned.')
			if not self.cfms_rev_invoice_customer:
				frappe.throw('Invoice Customer is required for Project revenue. Please ensure the project has an invoice customer assigned.')

	def populate_from_project(self):
		"""Auto-populate Project Customer and Invoice Customer from linked project"""
		# Only populate if Revenue Source is Project and project is selected
		if self.cfms_rev_revenue_source == 'Project' and self.cfms_rev_project_name:
			# Fetch project details
			project = frappe.get_doc('CFMS Project', self.cfms_rev_project_name)

			# Auto-populate Project Customer if empty
			if not self.cfms_rev_project_customer and hasattr(project, 'cfms_prj_project_customer'):
				self.cfms_rev_project_customer = project.cfms_prj_project_customer

			# Auto-populate Invoice Customer if empty
			if not self.cfms_rev_invoice_customer and hasattr(project, 'cfms_prj_invoice_customer'):
				self.cfms_rev_invoice_customer = project.cfms_prj_invoice_customer

			# Auto-populate Currency from project or customer
			if not self.cfms_rev_currency:
				# First try: Get from project currency (if field exists)
				if hasattr(project, 'cfms_prj_currency') and project.cfms_prj_currency:
					self.cfms_rev_currency = project.cfms_prj_currency
				# Second try: Get from project customer's default currency
				elif self.cfms_rev_project_customer:
					customer = frappe.get_doc('Customer', self.cfms_rev_project_customer)
					if hasattr(customer, 'default_currency') and customer.default_currency:
						self.cfms_rev_currency = customer.default_currency
					else:
						# Fallback: Use company's default currency (INR)
						self.cfms_rev_currency = frappe.db.get_single_value('System Settings', 'currency') or 'INR'

	def populate_dimensions_from_project(self):
		"""
		Auto-populate dimensions from linked Project
		Only for Project revenue
		Only if dimension field is empty (user can override)
		"""
		# Only for Project revenue with a project selected
		if self.cfms_rev_revenue_source != 'Project' or not self.cfms_rev_project_name:
			return

		try:
			# Fetch project document
			project = frappe.get_doc('CFMS Project', self.cfms_rev_project_name)

			# Auto-populate Department (if empty)
			if not self.cfms_rev_department and project.cfms_prj_department:
				self.cfms_rev_department = project.cfms_prj_department

			# Auto-populate Location (if empty)
			if not self.cfms_rev_location and project.cfms_prj_location:
				self.cfms_rev_location = project.cfms_prj_location

			# Auto-populate Cost Center (if empty)
			if not self.cfms_rev_cost_center and project.cfms_prj_cost_center:
				self.cfms_rev_cost_center = project.cfms_prj_cost_center

			# Auto-populate Product Line (if empty)
			if not self.cfms_rev_product_line and project.cfms_prj_product_line:
				self.cfms_rev_product_line = project.cfms_prj_product_line

		except Exception as e:
			# Log error but don't block save
			frappe.log_error(
				message=f"Error populating dimensions from project {self.cfms_rev_project_name}: {str(e)}",
				title="CFMS Revenue - Dimension Population Failed"
			)

	def update_receipt_status(self):
		"""Auto-update Receipt Status based on dates"""
		# If Actual Receipt Date is set -> Status = "Paid"
		if self.cfms_rev_receipt_date_actual:
			if self.cfms_rev_payment_receipt_status != 'Paid':
				old_status = self.cfms_rev_payment_receipt_status
				self.cfms_rev_payment_receipt_status = 'Paid'
				# Log the change for user visibility
				frappe.msgprint(
					f'Receipt Status auto-updated from "{old_status}" to "Paid" because Receipt Date (Actual) is set.',
					indicator='green',
					alert=True
				)

		# If Expected Receipt Date has passed and not paid -> Status = "Overdue"
		elif self.cfms_rev_receipt_date_expected:
			expected_date = getdate(self.cfms_rev_receipt_date_expected)
			today_date = getdate(today())

			if today_date > expected_date and self.cfms_rev_payment_receipt_status not in ['Paid', 'Overdue']:
				old_status = self.cfms_rev_payment_receipt_status
				self.cfms_rev_payment_receipt_status = 'Overdue'
				# Log the change for user visibility
				frappe.msgprint(
					f'Receipt Status auto-updated from "{old_status}" to "Overdue" because Expected Receipt Date has passed.',
					indicator='orange',
					alert=True
				)


# Scheduled task to update overdue revenues (runs daily)
def update_overdue_revenues():
	"""
	Daily cron job to update Receipt Status to "Overdue" for revenues past their expected date.
	Add this to hooks.py:

	scheduler_events = {
		"daily": [
			"cfms.cfms.doctype.cfms_revenue.cfms_revenue.update_overdue_revenues"
		]
	}
	"""
	today_date = getdate(today())

	# Find all revenues with:
	# - Expected date in the past
	# - Status not yet "Paid" or "Overdue"
	# - No actual receipt date
	revenues = frappe.get_all(
		'CFMS Revenue',
		filters={
			'cfms_rev_receipt_date_expected': ['<', today_date],
			'cfms_rev_payment_receipt_status': ['not in', ['Paid', 'Overdue']],
			'cfms_rev_receipt_date_actual': ['is', 'not set']
		},
		fields=['name', 'cfms_rev_payment_receipt_status']
	)

	updated_count = 0
	for rev in revenues:
		doc = frappe.get_doc('CFMS Revenue', rev.name)
		doc.cfms_rev_payment_receipt_status = 'Overdue'
		doc.save(ignore_permissions=True)
		updated_count += 1

	if updated_count > 0:
		frappe.log_error(
			f'Updated {updated_count} revenue records to "Overdue" status',
			'CFMS Revenue Status Update'
		)

	return updated_count
