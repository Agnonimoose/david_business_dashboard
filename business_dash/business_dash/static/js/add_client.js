 $(window).on('load', function () {
      let path = (window.location.href).split('/');
      let endian = path.pop();
      if (endian != "dashboard"){
        $('[data-bs-target="'+ endian +'"]').click();
      }
      else {
        $('[data-bs-target="#Add"]').click();
      }
      $('#AC_UID').val(createUID());

 });

function createUID(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%
ADD TAB
%%%%%%%%%%%%%%%%%%%%%%%%%%
*/


function resetAddForm(){
    let element = document.getElementById("addNewForm");
    element.reset();
    $('#AC_UID').createUID();
}

function addNewClient(){
    var data = {};
    var inputs = document.forms["addNewForm"].getElementsByTagName("input");
    for (let i=0; i<inputs.length; i++){
        console.log(inputs[i] + inputs[i].value);
    }
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%
SEARCH TAB
%%%%%%%%%%%%%%%%%%%%%%%%%%
*/

function findClients(){
    var walletBar = document.getElementById("clientByIDBar");

    $('#tableBody').empty();
    $.ajax({
        url: "/dashboard/getClients?wallet=" + walletBar.value,
        type: "GET",
        dataType: "json",
        success: (data) => {
            var transactions = data['transactions'];
            var tableBody = document.getElementById('tableBody');
            for (let i=0; i < transactions.length; i ++){
                console.log(i);
                 $('#tableBody').append('<tr><th scope="row">'+i.toString() +'</th><td class="text-truncate">'+ transactions[i]["trans"] +'</td><td class="text-truncate"><img class="ticker_t_logo" src="'+ transactions[i]["icon"] +'"></td><td class="text-truncate">'+transactions[i]["ticker"]+'</td><td class="text-truncate">'+transactions[i]["time"]+'</td></tr>');
                }
            if (data['followed'] === true){
                $("#followCheck").prop("checked", true)
            }
            else {
                $("#followCheck").prop("checked", false)
            }
        },
        error: (error) => {
                alert(error.responseJSON.error)
                }
        });
}

/*
%%%%%%%%%%%%%%%%%%%%%%%%%%
EDIT TAB
%%%%%%%%%%%%%%%%%%%%%%%%%%
*/



function findClient(){
    var clientByIDBar = document.getElementById("clientByIDBar");
    $.ajax({
        url: "/dashboard/getClientByID?clientID=" + clientByIDBar.value,
        type: "GET",
        dataType: "json",
        success: (data) => {
            if (data["success"] === true){
                let details = Object.entries(data);
                for (let i=0; i<details.length; i++){
                    if (details[i][0]).val != "success"){
                        $("#EC_"+details[i][0]).val = details[i][1];
                        }
                }
            }
            else {
                resetEditForm();
            }
        },
        error: (error) => {
                alert(error.responseJSON.error)
                resetEditForm();
                }
        });
}


function resetEditForm(){
    let element = document.getElementById("editForm");
    element.reset();

}

function editClient(){
    var data = {};
    var inputs = document.forms["editForm"].getElementsByTagName("input");
    for (let i=0; i<inputs.length; i++){
        data[inputs[i].id.slice(3,)] = inputs.value;
        console.log(inputs[i].id.slice(3,));
    }
    var select = document.getElementById("EC_pf");
    console.log(select.value);
    data["pf"] = select.value;

    $.ajax({
        url: "/dashboard/editClient/",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(data),
        headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": getCookie("csrftoken"),  // don't forget to include the 'getCookie' function
            },
        success: (data) => {



        },
        error: (error) => {
                console.log("ERROR!!!!")
                console.log("error = " + error);
            }

        });
}
