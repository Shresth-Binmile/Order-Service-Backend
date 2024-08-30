import amqp from 'amqplib/callback_api'
import { notificationMsgTypes, orderQueueMsgTypes } from '../interfaces/types';
import { bindingKeys } from '../utils/enums';
import ENV from '../config/server-config';

export default function connectRabbitMQ (message:orderQueueMsgTypes, bindingKey:string, notificationMsg:notificationMsgTypes) {
    amqp.connect(ENV.RABBITMQ_URI, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            var queue = bindingKey;
            var msg = message;
            
            // original message queue
            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
                persistent: true
            });
    
            // notification queue
            // queue = bindingKeys.NOTIFY_MESSAGES
            // channel.assertQueue(queue, {
            //     durable: true
            // });
            // channel.sendToQueue(queue, Buffer.from(JSON.stringify(notificationMsg)), {
            //     persistent: true
            // });
    
            console.log(" [x] Sent %s", msg);
            // console.log(" [x] Sent %s", notificationMsg);
        });
        // setTimeout(function() {
        //     connection.close();
        //     process.exit(0);
        // }, 500);
    });
}