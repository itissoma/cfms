frappe.ui.form.on('CFMS Expense', {
    refresh: function(frm) {
        update_payment_status(frm);
        populate_subcategory_options(frm);
    },

    cfms_exp_expense_type: function(frm) {
        let is_project = frm.doc.cfms_exp_expense_type === 'Project';
        frm.toggle_reqd('cfms_exp_project_name', is_project);
    },

    cfms_exp_category: function(frm) {
        populate_subcategory_options(frm);
    },

    cfms_exp_payment_due_date: function(frm) {
        update_payment_status(frm);
    },

    cfms_exp_actual_payment_date: function(frm) {
        if (frm.doc.cfms_exp_actual_payment_date) {
            frappe.show_alert({
                message: __('Expense Status will be updated to "Paid" on save'),
                indicator: 'green'
            });
        }
    }
});

function populate_subcategory_options(frm) {
    if (frm.doc.cfms_exp_category) {
        frappe.call({
            method: 'frappe.client.get',
            args: {
                doctype: 'CFMS Expense Category',
                name: frm.doc.cfms_exp_category
            },
            callback: function(r) {
                if (r.message) {
                    let category = r.message;
                    let subcats = [];

                    if (category.cfms_expcat_subcategories) {
                        category.cfms_expcat_subcategories.forEach(function(row) {
                            subcats.push(row.cfms_expsubcat_subcategory_name);
                        });
                    }

                    if (subcats.length > 0) {
                        frm.set_df_property('cfms_exp_subcategory', 'options', subcats);

                        if (!subcats.includes(frm.doc.cfms_exp_subcategory)) {
                            frm.set_value('cfms_exp_subcategory', '');
                        }
                    }
                }
            }
        });
    } else {
        frm.set_value('cfms_exp_subcategory', '');
    }
}

function update_payment_status(frm) {
    if (frm.doc.cfms_exp_payment_due_date && !frm.doc.cfms_exp_actual_payment_date) {
        let due_date = frappe.datetime.str_to_obj(frm.doc.cfms_exp_payment_due_date);
        let today = frappe.datetime.now_date(true);

        if (due_date < today && frm.doc.cfms_exp_expense_status !== 'Paid') {
            frappe.show_alert({
                message: __('Payment is overdue. Status will be updated to "Overdue" on save.'),
                indicator: 'orange'
            });
        }
    }
}
