frappe.ui.form.on("Payment Entry", {
    refresh(frm) {
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" && cur_frm.doc.cheque_status == "حافظة شيكات برسم التحصيل"){
            set_field_options("cheque_action", ["تظهير شيك","إيداع شيك تحت التحصيل","تحصيل فوري للشيك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" &&  cur_frm.doc.cheque_status == "تحت التحصيل"){
            set_field_options("cheque_action", ["رفض شيك تحت التحصيل","صرف شيك تحت التحصيل"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" && cur_frm.doc.cheque_status == "مرفوض بالبنك"){
            set_field_options("cheque_action", ["إيداع شيك تحت التحصيل","سحب شيك مرفوض بالبنك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" && cur_frm.doc.paid_amount != cur_frm.doc.encashed_amount && cur_frm.doc.cheque_status == "مرفوض بالبنك"){
            set_field_options("cheque_action", ["إيداع شيك تحت التحصيل","سحب شيك مرفوض بالبنك","تسييل الشيك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" && cur_frm.doc.encashed_amount == 0 && cur_frm.doc.cheque_status == "حافظة شيكات مرجعة"){
                set_field_options("cheque_action", ["إيداع شيك تحت التحصيل","رد شيك","تسييل الشيك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" && cur_frm.doc.encashed_amount > 0 && cur_frm.doc.paid_amount > cur_frm.doc.encashed_amount && cur_frm.doc.cheque_status == "حافظة شيكات مرجعة"){
                set_field_options("cheque_action", ["رد شيك","تسييل الشيك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Receive" && cur_frm.doc.paid_amount == cur_frm.doc.encashed_amount && cur_frm.doc.cheque_status == "حافظة شيكات مرجعة"){
                set_field_options("cheque_action", ["رد شيك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && cur_frm.doc.payment_type == "Pay" && cur_frm.doc.party_type == "Supplier" && cur_frm.doc.cheque_status_pay == "حافظة شيكات برسم الدفع"){
            set_field_options("cheque_action", ["صرف الشيك"]);
        }
        if (cur_frm.doc.docstatus == "1" && cur_frm.doc.mode_of_payment == "شيك" && (cur_frm.doc.cheque_status == "مظهر" || cur_frm.doc.cheque_status == "محصل فوري" || cur_frm.doc.cheque_status == "مردود" || cur_frm.doc.cheque_status == "محصل" || cur_frm.doc.cheque_status_pay == "مدفوع")){
            set_field_options("cheque_action", [" "]);
        }
    }
});

frappe.ui.form.on("Payment Entry", {
	setup: function(frm) {
		frm.set_query("bank_acc", function() {
			return {
				filters: [
					["Bank Account","bank", "in", frm.doc.cheque_bank]
				]
			};
		});
	}
});

//frappe.ui.form.on("Payment Entry","bank_acc", function(frm){
//    if(cur_frm.doc.payment_type == "Pay" && cur_frm.doc.mode_of_payment == "شيك"){
//        cur_frm.set_value("paid_from",cur_frm.doc.collection_fee_account);
//    }
//});

//frappe.ui.form.on("Payment Entry","payment_type", function(frm){
//    if(cur_frm.doc.payment_type == "Receive" && cur_frm.doc.mode_of_payment == "شيك"){
//        cur_frm.set_value("paid_to",cur_frm.doc.default_incoming_cheque_wallet_account);
//    }
//});

//frappe.ui.form.on("Payment Entry","mode_of_payment", function(frm){
//    if(cur_frm.doc.payment_type == "Receive" && cur_frm.doc.mode_of_payment == "شيك"){
//        cur_frm.set_value("paid_to",cur_frm.doc.default_incoming_cheque_wallet_account);
//    }
//});

frappe.ui.form.on("Payment Entry", "encashment_amount", function(frm) {
    cur_frm.doc.encashed_amount = cur_frm.doc.encashed_amount + cur_frm.doc.encashment_amount;
    cur_frm.doc.remaining_amount = cur_frm.doc.paid_amount - cur_frm.doc.encashed_amount;

});

frappe.ui.form.on("Payment Entry", "validate", function(frm) {
    cur_frm.doc.encashment_amount = 0;
});

frappe.ui.form.on("Payment Entry", {
setup: function(frm) {
frm.set_query("party_type", function() {
return {
filters: [
["DocType","name", "in", ["Customer","Supplier","Employee","Member","Student","Shareholder","Bank"]]
]
};
});
}
});

frappe.ui.form.on("Payment Entry", {
setup: function(frm) {
frm.set_query("party_type_", function() {
return {
filters: [
["DocType","name", "in", ["Supplier", "Customer", "Employee"]]
]
};
});
}
});

frappe.ui.form.on("Payment Entry", {
setup: function(frm) {
frm.set_query("account_1", function() {
return {
filters: [
["Account","account_type", "in", ["Payable", "Receivable"]]
]
};
});
}
});

frappe.ui.form.on("Payment Entry", "on_submit", function(frm) {
    if (frm.doc.mode_of_payment == "شيك" && frm.doc.payment_type == "Receive" && frm.doc.cheque_){
    frappe.db.set_value("Cheque Table",  frm.doc.cheque_table_no, "payment_entry", frm.doc.name)
    }
    if (frm.doc.mode_of_payment == "شيك" && frm.doc.payment_type == "Pay" && frm.doc.cheque_){
    frappe.db.set_value("Cheque Table Pay",  frm.doc.cheque_table_no2, "payment_entry", frm.doc.name)
    }
});

frappe.ui.form.on('Payment Entry', 'party_type_',  function(frm) {

    if (cur_frm.doc.party_type_ =="Customer"){

    frappe.call({ method: "frappe.client.get_value",
args: { doctype: "Company",
fieldname: "default_receivable_account",
filters: { 'name': cur_frm.doc.company},
}, callback: function(r)
{cur_frm.set_value("account_1", r.message.default_receivable_account);
  } });
    }
  if (cur_frm.doc.party_type_ =="Employee"){

    frappe.call({ method: "frappe.client.get_value",
args: { doctype: "Company",
fieldname: "default_employee_advance_account",
filters: { 'name': cur_frm.doc.company},
}, callback: function(r)
{cur_frm.set_value("account_1", r.message.default_employee_advance_account);
  } });
  }


   if (cur_frm.doc.party_type_ =="Supplier"){
       frappe.call({ method: "frappe.client.get_value",
args: { doctype: "Company",
fieldname: "default_payable_account",
filters: { 'name': cur_frm.doc.company},
}, callback: function(r)
{cur_frm.set_value("account_1", r.message.default_payable_account);
  } });
   }

});

//frappe.ui.form.on("Payment Entry", "onload", function(frm) {
  //  if(frm.doc.paid_amount == frm.doc.encashment_amount){
 //   cur_frm.set_value("cheque_status", "مدفوع");
//    }
//});