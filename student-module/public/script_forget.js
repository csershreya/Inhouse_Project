document.getElementById('forgetForm').addEventListener('send', async function(event) {
    event.preventDefault();
    const loginId = document.getElementById('emailu').value;
    // const password = document.getElementById('password').value;

    try {
        const response = await fetch('/student-module/index_forgotp.html/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({emailu})
        });
        const data = await response.json();
        if (response.ok) { 
            // If login successful, redirect or do something else
            window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
        } else {
            // Handle error
            alert(data.message);
        }
    } 
    catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again later.');
    }
});