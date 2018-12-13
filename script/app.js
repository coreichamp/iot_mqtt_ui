const host = "broker.mqttdashboard.com"
const port = 8000
const client_id = "champ_test"
let arrived_message_list = []
let subscribe_list = []

function connectMQTT() {
    console.log(`Connecting to host: "${host}", port ${port}, client_id: ${client_id}`)
    client = new Paho.MQTT.Client(host, port, client_id)
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
    arrived_message_list = []
    subscribe_list = []
    updateMessageBox()
    updateSubscribeBox()
}


function onConnect() {
    console.log(`Connected`);
    alert(`Connected`);
    client.subscribe("coreichamp01");
    client.subscribe("coreichamp02");

}

function addSubscription() {
    const subscribe_topic = $('#subscribe_topic').val()
    if (subscribe_topic && !subscribe_list.includes(subscribe_topic)) {
        client.subscribe(subscribe_topic);
        console.log(`addSubscription topic: ${subscribe_topic}`)

        subscribe_list.push(`${subscribe_topic}`)
        if (subscribe_list.length > 0) {
            updateSubscribeBox();
        }
    }
}

function deleteSubscription(topic) {
    console.log(`deleteSubscription topic: ${topic}`)
    client.unsubscribe(topic)
    for (let i = 0; i < subscribe_list.length; i++) {
        if (subscribe_list[i] == topic) {
            subscribe_list.splice(i, 1)
        }

    }
    //console.log(`topic: ${topic}, arrived_message_list[0]: ${arrived_message_list[0].topic}`)
    let count = 0
    let len = arrived_message_list.length
    for (let j = 0; j < len; j++) {
        //console.log(`arrived_message_list[i].topic: ${arrived_message_list[i].topic}`)
        if (arrived_message_list[j - count].topic == topic) {
            arrived_message_list.splice(j - count, 1)
            count++
        }
    }
    updateMessageBox()
    updateSubscribeBox();


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

    let currentdate = new Date();
    let date_time = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    let message = {
        topic: arrived_message.destinationName,
        message: arrived_message.payloadString,
        date_time: date_time
    }
    arrived_message_list.push(message)

    if (arrived_message_list.length > 0) {
        updateMessageBox()
    }


}

function updateMessageBox() {
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

function updateSubscribeBox() {
    let process_html = ``
    for (let i = subscribe_list.length - 1; i >= 0; i--) {
        process_html += `<div class="card" id="mess-card">
                <span onclick="deleteSubscription('${subscribe_list[i]}')">X</span> 
                <span>  ${subscribe_list[i]}</span>
                </div>`
    }
    document.getElementById('subscribe_box').innerHTML = process_html
}





