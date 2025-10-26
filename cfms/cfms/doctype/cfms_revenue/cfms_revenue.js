// Copyright (c) 2025, ETGroup
// For license information, please see license.txt

frappe.ui.form.on('CFMS Revenue', {
	// When form loads, check if project already selected and populate
	onload: function(frm) {
		populate_from_project(frm);
	},

	// When form refreshes, check if project already selected and populate
	refresh: function(frm) {
		populate_from_project(frm);
	},

	// When Project Name changes, auto-populate customers and currency
	cfms_rev_project_name: function(frm) {
		populate_from_project(frm);
	},

	// When Revenue Source changes to Project, make customers mandatory
	cfms_rev_revenue_source: function(frm) {
		let is_project = frm.doc.cfms_rev_revenue_source === 'Project';
		frm.toggle_reqd('cfms_rev_project_customer', is_project);
		frm.toggle_reqd('cfms_rev_invoice_customer', is_project);
	},

	// When Expected Date changes, update status if needed
	cfms_rev_receipt_date_expected: function(frm) {
		update_receipt_status(frm);
	},

	// When Actual Date changes, update status to Paid
	cfms_rev_receipt_date_actual: function(frm) {
		if (frm.doc.cfms_rev_receipt_date_actual) {
			if (frm.doc.cfms_rev_payment_receipt_status !== 'Paid') {
				frappe.show_alert({
					message: __('Receipt Status will be updated to "Paid" on save'),
					indicator: 'green'
				});
			}
		} else {
			update_receipt_status(frm);
		}
	}
});

// Helper function to populate from project (called by onload, refresh, and field change)
function populate_from_project(frm) {
	if (frm.doc.cfms_rev_project_name && frm.doc.cfms_rev_revenue_source === 'Project') {
		// Fetch project details
		frappe.db.get_doc('CFMS Project', frm.doc.cfms_rev_project_name).then(project => {
			// Auto-populate Project Customer if empty
			if (!frm.doc.cfms_rev_project_customer && project.cfms_prj_project_customer) {
				frm.set_value('cfms_rev_project_customer', project.cfms_prj_project_customer);
			}

			// Auto-populate Invoice Customer if empty
			if (!frm.doc.cfms_rev_invoice_customer && project.cfms_prj_invoice_customer) {
				frm.set_value('cfms_rev_invoice_customer', project.cfms_prj_invoice_customer);
			}

			// Auto-populate Currency if empty
			if (!frm.doc.cfms_rev_currency) {
				// First try: Project currency
				if (project.cfms_prj_currency) {
					frm.set_value('cfms_rev_currency', project.cfms_prj_currency);
				}
				// Second try: Customer default currency
				else if (project.cfms_prj_project_customer) {
					frappe.db.get_value('Customer', project.cfms_prj_project_customer, 'default_currency', (r) => {
						if (r && r.default_currency) {
							frm.set_value('cfms_rev_currency', r.default_currency);
						} else {
							// Fallback to INR
							frm.set_value('cfms_rev_currency', 'INR');
						}
					});
				} else {
					// Fallback to INR
					frm.set_value('cfms_rev_currency', 'INR');
				}
			}
		});
	}
}

// Helper function to update receipt status based on dates
function update_receipt_status(frm) {
	if (!frm.doc.cfms_rev_receipt_date_actual && frm.doc.cfms_rev_receipt_date_expected) {
		let expected_date = frappe.datetime.str_to_obj(frm.doc.cfms_rev_receipt_date_expected);
		let today = frappe.datetime.now_date(true);

		if (expected_date < today && !['Paid', 'Overdue'].includes(frm.doc.cfms_rev_payment_receipt_status)) {
			frappe.show_alert({
				message: __('Receipt Status will be updated to "Overdue" on save'),
				indicator: 'orange'
			});
		}
	}
}
