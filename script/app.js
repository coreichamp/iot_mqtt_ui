const host = "broker.mqttdashboard.com"
const port = 8000
const client_id = "champ_test"
const arrived_message_list = []
const subscribe_list = []

function connectMQTT() {
    console.log(`Connecting to host: "${host}", port ${port}, client_id: ${client_id}`)
    client = new Paho.MQTT.Client(host, port, client_id)
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
}


function onConnect() {
    console.log(`Connected`);
    alert(`Connected`);
    client.subscribe("coreichamp01");
    client.subscribe("coreichamp02");

}

function addSubscribe() {
    const subscribe_topic = $('#subscribe_topic').val()
    if (subscribe_topic && !subscribe_list.includes(subscribe_topic)) {
        client.subscribe(subscribe_topic);
        console.log(`addSubscribe topic: ${subscribe_topic}`)

        subscribe_list.push(`${subscribe_topic}`)
        if (subscribe_list.length > 0) {
            let process_html = ``
            for (let i = subscribe_list.length - 1; i >= 0; i--) {
                process_html += `<div class="card" id="mess-card">
            <p>${subscribe_list[i]}</p>
            </div>`
            }
            document.getElementById('subscribe_box').innerHTML = process_html
        }
    }
}

function clientPublish() {
    const publish_topic = $('#publish_topic').val()
    const publish_message = $('#publish_message').val()
    if (publish_topic && publish_message) {
        message = new Paho.MQTT.Message(publish_message);
        message.destinationName = publish_topic;
        client.send(message);
        console.log(`clientPublish topic: ${publish_topic}, message: ${publish_message}`)
    }
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage)
    }
}


function onMessageArrived(arrived_message) {
    console.log(`messageArrived topic:${arrived_message.destinationName}, message: "${arrived_message.payloadString}"`)
    //console.log(messages_box.innerHTML)

    var currentdate = new Date();
    var date_time = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    const message = {
        topic: arrived_message.destinationName,
        message: arrived_message.payloadString,
        date_time: date_time
    }
    arrived_message_list.push(message)

    if (arrived_message_list.length > 0) {
        let process_html = ``
        for (let i = arrived_message_list.length - 1; i >= 0; i--) {
            process_html += `<div class="card" id="mess-card">
            <p>topic: ${arrived_message_list[i].topic}</p>
            <p>message: ${arrived_message_list[i].message}</p>
            <p>date: ${arrived_message_list[i].date_time}</p>
            </div>`
        }
        document.getElementById('messages_box').innerHTML = process_html


    }


}





