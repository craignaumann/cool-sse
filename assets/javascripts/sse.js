var es = new EventSource("/sse");
es.onmessage = function (event) {
    $('#event-table').append('<tr><td>'+event.data+'</td></tr>');
};