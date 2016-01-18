function submitAdminCredentials(e)
{
    if(e.preventDefault())
    {
        e.preventDefault();
    }

    var formElement = document.forms["adminLoginForm"];
    var request = new XMLHttpRequest();

    request.onreadystatechange = function(){
        if(request.readyState ===4){
            if(request.status===200){
                callback(request.responseText);
            }
        }
    };

    function callback(data){
        alert(data);
        var json = JSON.parse(data);
        if(json == "login success!"){
            authenticated = true;
            home();

        }
        alert(json);
    }

    request.open("POST", "/HHM/tangramsGame/adminLogin.php");
    request.send(new FormData(formElement));
}
