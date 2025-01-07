import React, { useState, useEffect } from "react";

const CSRFToken = () => {
    const [csrftoken, setCsrfToken] = useState("")

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    useEffect(() => {
        const fetchData = async () =>{
            try {
                await fetch(`${process.env.REACT_APP_DJANGO_API}/accounts/csrf_cookie`)

            } catch (err) {

            }
        }
        fetchData()
        setCsrfToken(getCookie('csrftoken'))
    }, [])

    return (
        <input type='hidden' name='csrfmiddelwaretoken' value={csrftoken}/>
    )


}

export default CSRFToken
