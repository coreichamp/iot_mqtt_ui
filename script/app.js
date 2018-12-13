
function mqttConnect(host, port, client_id) {
    console.log(`Connecting to "${host}" port ${port}`)
    client = new Paho.MQTT.Client(host, port, client_id)

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({ onSuccess: onConnect });

    function onConnect() {
        console.log(`Connected`);
        // client.subscribe("World");
        // message = new Paho.MQTT.Message("Hello");
        // message.destinationName = "World";
        // client.send(message);
    }

    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }


    function onMessageArrived(message) {
        console.log("onMessageArrived:" + message.payloadString);
    }

}

