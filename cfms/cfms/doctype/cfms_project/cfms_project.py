# Copyright (c) 2025, ETGroup
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CFMSProject(Document):
	def before_save(self):
		"""Set title to project name for better display in lists and links"""
		if self.cfms_prj_project_name:
			self.title = self.cfms_prj_project_name
