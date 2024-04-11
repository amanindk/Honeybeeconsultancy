 function GetPrint(data)
 {

 fetch('invoice.css')
 .then(response => response.text())
 .then(cssContent => {
  // Update the target elements in the print page with the received data
  $("#invoice-page .targetElement1").text(data.companyInfo.companyName);
  $("#invoice-page .targetElement2").text(data.companyInfo.address);
  $("#invoice-page .targetElement3").text(data.companyInfo.mobileNumber);
  $("#invoice-page .targetElement4").text(data.companyInfo.email);
  $("#invoice-page .targetElement5").text(data.invoiceInfo.invoiceNo);
  $("#invoice-page .targetElement6").text(data.invoiceInfo.billDate);
  $("#invoice-page .targetElement7").text(data.invoiceInfo.dueDate);
  // $("#invoice-page .targetElement8").text(data.items[i].particular);
  $("#invoice-page .targetElement8").text(data.items[0].particular);
  $("#invoice-page .targetElement9").text(data.items[0].qty);
  $("#invoice-page .targetElement10").text(data.items[0].rate);
  $("#invoice-page .targetElement11").text(data.items[0].amount);
  // Calculate and populate total values
  $("#invoice-page .targetElement12").text(data.total);
  $("#invoice-page .targetElement13").text(data.gstPercentage);
  $("#invoice-page .targetElement14").text(data.gstAmount);
  $("#invoice-page .targetElement15").text(data.netAmount);

  $("#invoice-page .targetElement2").html('<span class="fas fa-location-dot"></span> ' + data.companyInfo.address);
  $("#invoice-page .targetElement3").html('<span class="fas fa-phone"></span> ' + data.companyInfo.mobileNumber);
  $("#invoice-page .targetElement4").html('<span class="fas fa-envelope"></span> ' + data.companyInfo.email);


    // Get the content of the textarea
    var textareaContent = document.getElementById('text-area').value;
  
    // Set the content in the <p> tag inside the #invoice-page
    document.getElementById('invoice-text').textContent = textareaContent;
  updateInvoiceTable(data);
  // Append the CSS content to the style property of the printJS configuration object
  printJS({
    printable: 'invoice-page', // ID or class of the element to print
    type: 'html', // 'html', 'image', 'pdf' (default: 'pdf')
    style: cssContent, // Add the CSS content from the invoice.css file
  });
})
.catch(error => {
  
  console.error('Failed to fetch or apply CSS:', error);
});

 }

 function updateInvoiceTable(data){
  var table = $("#invoice-page .caculate-table table tbody");
  table.empty();

  for(var i = 1; i < data.items.length; i++){
      var row = $("<tr></tr>");
      row.append("<td>" + (i + 0) + "</td>");
      row.append("<td>" + data.items[i].particular + "</td>");
      row.append("<td>" + data.items[i].qty + "</td>");
      row.append("<td>" + data.items[i].rate + "</td>");
      row.append("<td>" + data.items[i].amount + "</td>");
      table.append(row);
  }
}

function BtnAdd()
 { /*Add Button*/
    var v = $("#TRow").clone().appendTo("#TBody");
    $(v).find("input").val('');
    $(v).removeClass("d-none");
    $(v).find("th").first().html($('#TBody tr').length - 1);
 }

 function BtnDel(v)
 {
    /*Delete Button*/
       $(v).parent().parent().remove(); 
       GetTotal();

        $("#TBody").find("tr").each(
        function(index)
        {
           $(this).find("th").first().html(index);
        }
 );
 }

function Calc(v)
{
    /*Detail Calculation Each Row*/
    var index = $(v).parent().parent().index();
    var qty = document.getElementsByName("qty")[index].value;
    var rate = document.getElementsByName("rate")[index].value;
   
    var amt = qty * rate;
    document.getElementsByName("amt")[index].value = amt;

    GetTotal();
}



    function GetTotal() {
    /* Footer Calculation */
    var sum = 0;
    var amts = document.getElementsByName("amt");

    for (let index = 0; index < amts.length; index++) {
        var amt = parseFloat(amts[index].value);
        sum += amt;
    }

    document.getElementById("FTotal").value = sum;
    var gstPercentage = parseFloat(document.getElementById("GSTPercentage").textContent);
    // var gstPercentage = 18; // GST percentage (18%)

    var gst = (sum * gstPercentage) / 100;
    document.getElementById("FGST").value = gst.toFixed(2);

    var net = sum + gst;
    
    document.getElementById("FNet").value = net.toFixed(2);
}



function transferInput(){
  var companyInfo = {
    companyName: $("#container input#inputToTransfer[placeholder='Company Name']").val(),
    email: $("#container input#inputToTransfer[placeholder='name@example.com']").val(),
    mobileNumber: $("#container input#inputToTransfer[placeholder='+91-']").val(),
    address: $("#container input#inputToTransfer[placeholder='Address...']").val(),
   
  };

  var invoiceInfo = {
    invoiceNo: $("#container input#inputToTransfer[placeholder='Inv. No']").val(),
    billDate: $("#container input#inputToTransfer[placeholder='Inv. Date']").val(),
    dueDate: $("#container input#inputToTransfer[placeholder='Inv. Date']").val(),
  };

  var notes ={
    notes:  $("#container textarea#inputToTransfer[placeholder='Notes...']").val(),
    } 
    console.log("notes:", notes);


  var items = [];
  $("#TBody tr").each(function(index, element) {
      var particular = $(element).find("input[name='particular']").val();
      var qty = parseFloat($(element).find("input[name='qty']").val());
      var rate = parseFloat($(element).find("input[name='rate']").val());
      var amount = parseFloat($(element).find("input[name='amt']").val());

      items.push({
          particular: particular,
          qty: qty,
          rate: rate,
          amount: amount,
      });
  });

  
  var total = parseFloat($("#FTotal").val());
  var gstPercentage = parseFloat($("#GSTPercentage").text());
  var gstAmount = parseFloat($("#FGST").val());
  var netAmount = parseFloat($("#FNet").val());
 
  var data = {
    companyInfo: companyInfo,
    invoiceInfo: invoiceInfo,
    items: items,
    total: total,
    gstPercentage: gstPercentage,
    gstAmount: gstAmount,
    netAmount: netAmount,
    notes: notes.notes, 
  };

  return data;
 
}






