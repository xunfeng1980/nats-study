#!/usr/bin/env node

const { connect } = require('nats');
const protobuf = require('protobufjs');

async function main() {
    // Connect to NATS server
    let nc;
    try {
        nc = await connect({ servers: 'localhost:4222' });
        console.log('JavaScript: Connected to NATS server');
    } catch (err) {
        console.error(`JavaScript: Failed to connect to NATS server: ${err.message}`);
        return;
    }

    // Language identifier
    const language = 'JavaScript';

    // Load protobuf schema
    const root = await protobuf.load('../proto/messages.proto');
    const TalkMessage = root.lookupType('nats_study.TalkMessage');
    const GreetRequest = root.lookupType('nats_study.GreetRequest');
    const GreetResponse = root.lookupType('nats_study.GreetResponse');

    // 1. Publish message to "talk" topic with current time and language
    try {
        const message = `Hello from ${language} at ${new Date().toString()}`;
        nc.publish('talk', message);
        console.log(`JavaScript: Published message to 'talk' topic: ${message}`);
    } catch (err) {
        console.error(`JavaScript: Failed to publish message: ${err.message}`);
    }

    // 2. Subscribe to "talk" topic and print messages
    try {
        const sub = nc.subscribe('talk');
        (async () => {
            for await (const m of sub) {
                console.log(`JavaScript received: ${m.string()}`);
            }
        })();
        console.log('JavaScript: Subscribed to \'talk\' topic');
    } catch (err) {
        console.error(`JavaScript: Failed to subscribe to 'talk' topic: ${err.message}`);
    }

    // 3. Provide request/reply interface and make a request
    try {
        // Subscribe to handle requests
        const replySub = nc.subscribe('greet.javascript');
        (async () => {
            for await (const m of replySub) {
                console.log(`JavaScript: Received request: ${m.string()}`);
                m.respond(`Greetings from ${language}!`);
            }
        })();
        console.log('JavaScript: Started request/reply service on \'greet.javascript\'');
    } catch (err) {
        console.error(`JavaScript: Failed to start request/reply service: ${err.message}`);
    }

    // New: Publish protobuf message to "talk-pb" topic
    try {
        // Create a protobuf talk message
        const talkMsg = TalkMessage.create({
            senderLanguage: language,
            messageText: `Hello from ${language} using protobuf`,
            timestamp: Math.floor(Date.now() / 1000)
        });
        
        // Serialize and publish
        const buffer = TalkMessage.encode(talkMsg).finish();
        nc.publish('talk-pb', buffer);
        console.log('JavaScript: Published protobuf message to \'talk-pb\' topic');
    } catch (err) {
        console.error(`JavaScript: Failed to publish protobuf message: ${err.message}`);
    }

    // New: Subscribe to "talk-pb" topic and print messages
    try {
        const pbSub = nc.subscribe('talk-pb');
        (async () => {
            for await (const m of pbSub) {
                try {
                    // Parse the protobuf message
                    const talkMsg = TalkMessage.decode(m.data);
                    console.log(`JavaScript received protobuf message: [${talkMsg.senderLanguage}] ${talkMsg.messageText} (timestamp: ${talkMsg.timestamp})`);
                } catch (err) {
                    console.error(`JavaScript: Failed to parse protobuf message: ${err.message}`);
                }
            }
        })();
        console.log('JavaScript: Subscribed to \'talk-pb\' topic');
    } catch (err) {
        console.error(`JavaScript: Failed to subscribe to 'talk-pb' topic: ${err.message}`);
    }

    // New: Provide protobuf request/reply interface
    try {
        const pbReplySub = nc.subscribe('greet-pb.javascript');
        (async () => {
            for await (const m of pbReplySub) {
                try {
                    // Parse the request
                    const request = GreetRequest.decode(m.data);
                    console.log(`JavaScript: Received protobuf request: [${request.senderLanguage}] ${request.greetingText}`);
                    
                    // Create and send response
                    const response = GreetResponse.create({
                        responseText: `Greetings from ${language} using protobuf!`,
                        receiverLanguage: language
                    });
                    
                    const buffer = GreetResponse.encode(response).finish();
                    m.respond(buffer);
                } catch (err) {
                    console.error(`JavaScript: Failed to handle protobuf request: ${err.message}`);
                }
            }
        })();
        console.log('JavaScript: Started protobuf request/reply service on \'greet-pb.javascript\'');
    } catch (err) {
        console.error(`JavaScript: Failed to start protobuf request/reply service: ${err.message}`);
    }

    // Make a request to test the functionality
    try {
        // Give a moment for all services to start
        await new Promise(r => setTimeout(r, 1000));
        
        // Send a request and expect a response
        const response = await nc.request('greet.javascript', `Hello ${language}`, { timeout: 5000 });
        console.log(`JavaScript: Received response: ${response.string()}`);
        
        // New: Send a protobuf request and expect a response
        const pbRequest = GreetRequest.create({
            senderLanguage: language,
            greetingText: `Hello ${language} using protobuf`
        });
        
        const pbBuffer = GreetRequest.encode(pbRequest).finish();
        const pbResponseMsg = await nc.request('greet-pb.javascript', pbBuffer, { timeout: 5000 });
        
        // Parse the protobuf response
        const pbResponse = GreetResponse.decode(pbResponseMsg.data);
        console.log(`JavaScript: Received protobuf response: [${pbResponse.receiverLanguage}] ${pbResponse.responseText}`);
    } catch (err) {
        console.error(`JavaScript: Request failed: ${err.message}`);
    }

    // Keep the connection alive for a while to receive messages
    try {
        await new Promise(r => setTimeout(r, 100000));
    } catch (err) {
        // Handle interruption
    } finally {
        await nc.close();
        console.log('JavaScript: NATS connection closed');
    }
}

// Run the main function
main().catch(console.error);