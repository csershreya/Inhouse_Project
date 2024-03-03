 // Add event listener to the "View Requests" button
 document.getElementById('viewRequests').addEventListener('click', function() {
    // Make an AJAX request to the Node.js server to fetch data
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Display the fetched data in console for demonstration
                console.log(xhr.responseText);
                // You can further process the fetched data here as per your requirement
            } else {
                console.error('Failed to fetch data');
            }
        }
    };
    xhr.send();
});