# Copyright (c) 2025, ETGroup
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate
from frappe.model.naming import make_autoname


class CFMSExpense(Document):
	def validate(self):
		"""Validate expense data"""
		# Validate amount is not zero
		if self.cfms_exp_amount == 0:
			frappe.throw('Expense Amount cannot be zero. Please enter a positive or negative amount.')

		# Validate project is selected for Project expenses
		if self.cfms_exp_expense_type == 'Project' and not self.cfms_exp_project_name:
			frappe.throw('Project Name is required when Expense Type is "Project".')

	def autoname(self):
		"""Generate short human-readable name: EXP-YYMM-XXX-####"""
		if self.cfms_exp_expense_date and self.cfms_exp_expense_type:
			# Extract YY-MM from date (short format)
			date_obj = getdate(self.cfms_exp_expense_date)
			month_str = date_obj.strftime('%y%m')

			# Map expense type to 3-letter abbreviation
			type_map = {
				'Project': 'PRJ',
				'Overhead': 'OVH',
				'Financial': 'FIN',
				'Other': 'OTH'
			}
			exp_abbr = type_map.get(self.cfms_exp_expense_type, 'OTH')

			# Set name with auto counter (4 digits)
			self.name = make_autoname(f"EXP-{month_str}-{exp_abbr}-.####")

	def before_save(self):
		"""Auto-populate dimensions and set title"""
		# Set title (for old records or new ones)
		if self.name:
			# For new records with proper naming (starting with EXP-)
			if self.name.startswith('EXP-'):
				self.title = self.name
			# For old records with ugly IDs
			elif not self.name.startswith('new-'):
				if self.cfms_exp_expense_date and self.cfms_exp_expense_type:
					date_obj = getdate(self.cfms_exp_expense_date)
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

		# Auto-populate dimensions (PRIORITY ORDER)
		# Priority 1: From Project (if Project expense)
		self.populate_dimensions_from_project()

		# Priority 2: From Category defaults (if Overhead expense)
		self.populate_dimensions_from_category()

	def populate_dimensions_from_project(self):
		"""
		Auto-populate dimensions from linked Project
		Only for Project expenses
		Only if dimension field is empty (user can override)
		"""
		# Only for Project expenses with a project selected
		if self.cfms_exp_expense_type != 'Project' or not self.cfms_exp_project_name:
			return

		try:
			# Fetch project document
			project = frappe.get_doc('CFMS Project', self.cfms_exp_project_name)

			# Auto-populate Department (if empty)
			if not self.cfms_exp_department and project.cfms_prj_department:
				self.cfms_exp_department = project.cfms_prj_department

			# Auto-populate Location (if empty)
			if not self.cfms_exp_location and project.cfms_prj_location:
				self.cfms_exp_location = project.cfms_prj_location

			# Auto-populate Cost Center (if empty)
			if not self.cfms_exp_cost_center and project.cfms_prj_cost_center:
				self.cfms_exp_cost_center = project.cfms_prj_cost_center

			# Auto-populate Product Line (if empty)
			if not self.cfms_exp_product_line and project.cfms_prj_product_line:
				self.cfms_exp_product_line = project.cfms_prj_product_line

		except Exception as e:
			# Log error but don't block save
			frappe.log_error(
				message=f"Error populating dimensions from project {self.cfms_exp_project_name}: {str(e)}",
				title="CFMS Expense - Project Dimension Population Failed"
			)

	def populate_dimensions_from_category(self):
		"""
		Auto-populate dimensions from Category defaults
		For Overhead expenses (or any expense with a category)
		Only if dimension field is empty (user can override)
		"""
		# Only if category is selected
		if not self.cfms_exp_category:
			return

		try:
			# Fetch category document
			category = frappe.get_doc('CFMS Expense Category', self.cfms_exp_category)

			# Auto-populate Department (if empty and category has default)
			if not self.cfms_exp_department and category.cfms_expcat_default_department:
				self.cfms_exp_department = category.cfms_expcat_default_department

			# Auto-populate Location (if empty and category has default)
			if not self.cfms_exp_location and category.cfms_expcat_default_location:
				self.cfms_exp_location = category.cfms_expcat_default_location

			# Auto-populate Cost Center (if empty and category has default)
			if not self.cfms_exp_cost_center and category.cfms_expcat_default_cost_center:
				self.cfms_exp_cost_center = category.cfms_expcat_default_cost_center

			# Auto-populate Product Line (if empty and category has default)
			if not self.cfms_exp_product_line and category.cfms_expcat_product_line:
				self.cfms_exp_product_line = category.cfms_expcat_product_line

		except Exception as e:
			# Log error but don't block save
			frappe.log_error(
				message=f"Error populating dimensions from category {self.cfms_exp_category}: {str(e)}",
				title="CFMS Expense - Category Dimension Population Failed"
			)
