$( document ).ready(() => {
    //Ask for a new password
    document.getElementById("newPsswrdBtn").addEventListener("click",()=>{
        document.getElementById("newPsswrdAlertSucces").innerHTML = ""
        document.getElementById("newPsswrdBtn").value = ""
        document.getElementById("newPsswrdAlertSucces").style.display = "none"
        document.getElementById("newPsswrdAlertError").style.display = "none"
        $.post("/sendMailForgotPasswrd",
            {
                email: document.getElementById('newPsswrdEmail').value
            },
            (data, status) => {
                if(status =="success"){
                    if(data == "OK"){
                        document.getElementById("newPsswrdAlertSucces").innerHTML = "A email as been sent."
                        document.getElementById("newPsswrdAlertSucces").style.display = "block"
                        sleep(5000).then(() => {
                            $('#Modal').modal('hide')
                            document.getElementById("newPsswrdAlertSucces").innerHTML = ""
                            document.getElementById("newPsswrdAlertSucces").style.display = "none"
                            document.getElementById("newPsswrdBtn").value = ""
                        });
                    }else if(data == "NO_MATCH"){
                        document.getElementById("newPsswrdAlertError").innerHTML = "No account linked to this email."
                        document.getElementById("newPsswrdAlertError").style.display = "block"
                    }else if(data == "NOT_ACTIVATED"){
                        document.getElementById("newPsswrdAlertError").innerHTML = "This account is not activated."
                        document.getElementById("newPsswrdAlertError").style.display = "block"
                    }else if(data == "MIN_FIVE_MIN"){
                        document.getElementById("newPsswrdAlertError").innerHTML = "Please wait at least 5 minutes between two password change requests."
                        document.getElementById("newPsswrdAlertError").style.display = "block"
                    }else{
                        document.getElementById("newPsswrdAlertError").innerHTML = "Internal Error."
                        document.getElementById("newPsswrdAlertError").style.display = "block"
                    }
                }else{
                    document.getElementById("newPsswrdAlertError").innerHTML = "connection error, check your internet connection."
                    document.getElementById("newPsswrdAlertError").style.display = "block"
                }
            });
    })
})

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
