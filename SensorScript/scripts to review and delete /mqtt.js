<script src= '/home/s7/_webserver/paho-mqtt.js'> </script>
<script>
var client = new Paho.Client('localhost', 1883, 'html_sub');
client.connect({
    reconnect:true, 
    onSucsess: function(){
    mqtt.subscribe('sensordata');
     // mqtt.subscribe('SET09603');
   }
});
</script>

<ul id= 'message-list'>
</ul>