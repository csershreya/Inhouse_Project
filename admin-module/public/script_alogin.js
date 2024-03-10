document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/admin-module/index_alogin.html/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({loginId,password})
        });
        const data = await response.json();
        if (response.ok) {
            // If login successful, redirect or do something else
            window.location.href = 'http://localhost:3041/adminp';
        } else {
            // Handle error
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again later.');
    }
});