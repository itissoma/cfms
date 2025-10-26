// Copyright (c) 2025, ETGroup
// For license information, please see license.txt

frappe.ui.form.on('CFMS Expense', {
	// When form loads, check status alerts
	refresh: function(frm) {
		update_payment_status(frm);
	},

	// When Expense Type changes to Project, make Project Name mandatory
	cfms_exp_expense_type: function(frm) {
		let is_project = frm.doc.cfms_exp_expense_type === 'Project';
		frm.toggle_reqd('cfms_exp_project_name', is_project);
	},

	// When Payment Due Date changes, check if overdue
	cfms_exp_payment_due_date: function(frm) {
		update_payment_status(frm);
	},

	// When Actual Payment Date is set, show Paid alert
	cfms_exp_actual_payment_date: function(frm) {
		if (frm.doc.cfms_exp_actual_payment_date) {
			if (frm.doc.cfms_exp_expense_status !== 'Paid') {
				frappe.show_alert({
					message: __('Expense Status will be updated to "Paid" on save'),
					indicator: 'green'
				});
			}
		} else {
			update_payment_status(frm);
		}
	}
});

// Helper function to check payment status and show alerts
function update_payment_status(frm) {
	// Only check if no actual payment date and there's a due date
	if (!frm.doc.cfms_exp_actual_payment_date && frm.doc.cfms_exp_payment_due_date) {
		let due_date = frappe.datetime.str_to_obj(frm.doc.cfms_exp_payment_due_date);
		let today = frappe.datetime.now_date(true);

		// If due date has passed and status is not Paid/Overdue/On Hold/Cancelled
		if (due_date < today && !['Paid', 'Overdue', 'On Hold', 'Cancelled'].includes(frm.doc.cfms_exp_expense_status)) {
			frappe.show_alert({
				message: __('Expense Status will be updated to "Overdue" on save'),
				indicator: 'orange'
			});
		}
	}
}
