document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/admin-login/index.html/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({loginId,password})
        });
        const data = await response.json();
        if (response.ok) {
            // If login successful, redirect or do something else
            window.location.href = 'https://www.youtube.com/watch?v=eFO3y_Q7i_Q&list=RDGMEM2j3yRsqu_nuzRLnHd2bMVAVMeFO3y_Q7i_Q&start_radio=1';
        } else {
            // Handle error
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again later.');
    }
});