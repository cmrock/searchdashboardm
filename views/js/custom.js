/**
 * Created by Hitesh on 22-10-2016.
 */

jQuery(document).ready(function(){
    alert();
    var date_input=jQuery('input[name="date"]'); //our date input has the name "date"
    var container=jQuery('.bootstrap-iso form').length>0 ? jQuery('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    })
})
