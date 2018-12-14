const host = "broker.mqttdashboard.com"
const port = 8000

let arrived_message_list = []
let subscribe_list = []

initPage()

function connectMQTT() {
    let mqtt_host = $('#host').val()
    let mqtt_port = parseInt($('#port').val())
    let client_id = $('#client_id').val()

    console.log(`Connecting to host: "${mqtt_host}", port ${mqtt_port}, client_id: ${client_id}`)
    client = new Paho.MQTT.Client(mqtt_host, mqtt_port, client_id)
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
    M.toast({ html: 'Connected' })
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
    let count = 0
    let len = arrived_message_list.length
    for (let j = 0; j < len; j++) {
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
        M.toast({ html: 'Publish DONE !' })


    }
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage)
    }
}


function onMessageArrived(arrived_message) {
    console.log(`messageArrived topic:${arrived_message.destinationName}, message: "${arrived_message.payloadString}"`)

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
            <h6>topic: ${arrived_message_list[i].topic}</h6>
            <h4>message: ${arrived_message_list[i].message}</h4>
            <p>date: ${arrived_message_list[i].date_time}</p>
            </div>`
    }
    document.getElementById('messages_box').innerHTML = process_html
}

function updateSubscribeBox() {
    let process_html = ``
    for (let i = subscribe_list.length - 1; i >= 0; i--) {
        process_html += `<div class="card" id="mess-card">
                <span onclick="deleteSubscription('${subscribe_list[i]}')"><b>X</b></span> 
                <span>  ${subscribe_list[i]}</span>
                </div>`
    }
    document.getElementById('subscribe_box').innerHTML = process_html
}

function randomClientID() {
    let client_id = "client-"
    let seed = "abcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 5; i++) {
        client_id += seed.charAt(Math.floor(Math.random() * seed.length))
    }
    return client_id;
}

function initPage() {
    const client_id = randomClientID()
    document.getElementById('host').value = host
    document.getElementById('port').value = port
    document.getElementById('client_id').value = client_id
}