#!/usr/bin/env python3
import asyncio
import nats
from datetime import datetime
import sys
import os

# Add the proto directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'proto'))

# Import the generated protobuf classes
import messages_pb2

async def main():
    # Connect to NATS server with JetStream enabled
    try:
        nc = await nats.connect("nats://localhost:4222")
        print("Python JetStream: Connected to NATS server")
        
        # Get JetStream context
        js = nc.jetstream()
        print("Python JetStream: JetStream context created")
    except Exception as e:
        print(f"Python JetStream: Failed to connect to NATS server: {e}")
        return

    # Language identifier
    language = "Python-JetStream"
    
    # Create streams for JetStream if they don't exist
    try:
        # Create a stream for talk messages
        await js.add_stream(name="TALK_STREAM", subjects=["talk-js"])
        print("Python JetStream: Created TALK_STREAM for 'talk-js' subject")
        
        # Create a stream for protobuf talk messages
        await js.add_stream(name="TALK_PB_STREAM", subjects=["talk-pb-js"])
        print("Python JetStream: Created TALK_PB_STREAM for 'talk-pb-js' subject")
        
        # Create a stream for greet requests
        await js.add_stream(name="GREET_STREAM", subjects=["greet-js.*"])
        print("Python JetStream: Created GREET_STREAM for 'greet-js.*' subjects")
        
        # Create a stream for protobuf greet requests
        await js.add_stream(name="GREET_PB_STREAM", subjects=["greet-pb-js.*"])
        print("Python JetStream: Created GREET_PB_STREAM for 'greet-pb-js.*' subjects")
    except Exception as e:
        print(f"Python JetStream: Failed to create streams: {e}")

    # 1. Publish message to "talk-js" topic with current time and language using JetStream
    try:
        message = f"Hello from {language} at {datetime.now()}"
        ack = await js.publish("talk-js", message.encode())
        print(f"Python JetStream: Published message to 'talk-js' topic: {message}")
        print(f"Python JetStream: Publish ack - stream: {ack.stream}, sequence: {ack.seq}")
    except Exception as e:
        print(f"Python JetStream: Failed to publish message: {e}")

    # 2. Subscribe to "talk-js" topic and print messages using JetStream
    async def message_handler(msg):
        data = msg.data.decode()
        print(f"Python JetStream received: {data}")
        # Acknowledge the message
        await msg.ack()
    
    try:
        # Create a durable consumer for talk messages
        sub = await js.subscribe("talk-js", durable="python-talk-durable", cb=message_handler)
        print("Python JetStream: Subscribed to 'talk-js' topic with durable consumer")
    except Exception as e:
        print(f"Python JetStream: Failed to subscribe to 'talk-js' topic: {e}")

    # 3. Provide request/reply interface and make a request using JetStream
    async def reply_handler(msg):
        print(f"Python JetStream: Received request: {msg.data.decode()}")
        await msg.respond(f"Greetings from {language}!".encode())
    
    try:
        # Subscribe to handle requests with JetStream
        reply_sub = await js.subscribe("greet-js.python", durable="python-greet-durable", cb=reply_handler)
        print("Python JetStream: Started request/reply service on 'greet-js.python' with durable consumer")
    except Exception as e:
        print(f"Python JetStream: Failed to start request/reply service: {e}")

    # New: Publish protobuf message to "talk-pb-js" topic using JetStream
    try:
        # Create a protobuf talk message
        talk_msg = messages_pb2.TalkMessage()
        talk_msg.sender_language = language
        talk_msg.message_text = f"Hello from {language} using protobuf and JetStream"
        talk_msg.timestamp = int(datetime.now().timestamp())
        
        # Serialize and publish
        ack = await js.publish("talk-pb-js", talk_msg.SerializeToString())
        print(f"Python JetStream: Published protobuf message to 'talk-pb-js' topic")
        print(f"Python JetStream: Publish ack - stream: {ack.stream}, sequence: {ack.seq}")
    except Exception as e:
        print(f"Python JetStream: Failed to publish protobuf message: {e}")

    # New: Subscribe to "talk-pb-js" topic and print messages using JetStream
    async def pb_message_handler(msg):
        try:
            # Parse the protobuf message
            talk_msg = messages_pb2.TalkMessage()
            talk_msg.ParseFromString(msg.data)
            print(f"Python JetStream received protobuf message: [{talk_msg.sender_language}] {talk_msg.message_text} (timestamp: {talk_msg.timestamp})")
            # Acknowledge the message
            await msg.ack()
        except Exception as e:
            print(f"Python JetStream: Failed to parse protobuf message: {e}")
    
    try:
        # Create a durable consumer for protobuf talk messages
        pb_sub = await js.subscribe("talk-pb-js", durable="python-talk-pb-durable", cb=pb_message_handler)
        print("Python JetStream: Subscribed to 'talk-pb-js' topic with durable consumer")
    except Exception as e:
        print(f"Python JetStream: Failed to subscribe to 'talk-pb-js' topic: {e}")

    # New: Provide protobuf request/reply interface using NATS core (not JetStream)
    async def pb_reply_handler(msg):
        try:
            # Parse the request
            request = messages_pb2.GreetRequest()
            request.ParseFromString(msg.data)
            print(f"Python JetStream: Received protobuf request: [{request.sender_language}] {request.greeting_text}")
            
            # Create and send response
            response = messages_pb2.GreetResponse()
            response.response_text = f"Greetings from {language} using protobuf and JetStream!"
            response.receiver_language = language
            
            await nc.publish(msg.reply, response.SerializeToString())
        except Exception as e:
            print(f"Python JetStream: Failed to handle protobuf request: {e}")
    
    try:
        # Subscribe to handle protobuf requests with NATS core (not JetStream)
        pb_reply_sub = await nc.subscribe("greet-pb-js.python", cb=pb_reply_handler)
        print("Python JetStream: Started protobuf request/reply service on 'greet-pb-js.python'")
    except Exception as e:
        print(f"Python JetStream: Failed to start protobuf request/reply service: {e}")

    # Make a request to test the functionality
    try:
        # Give a moment for all services to start
        await asyncio.sleep(1)
        
        # Send a request and expect a response
        response = await nc.request("greet-js.python", f"Hello {language}".encode(), timeout=5)
        print(f"Python JetStream: Received response: {response.data.decode()}")
        
        # New: Send a protobuf request and expect a response
        pb_request = messages_pb2.GreetRequest()
        pb_request.sender_language = language
        pb_request.greeting_text = f"Hello {language} using protobuf and JetStream"
        
        print(f"Python JetStream: Sending protobuf request...")
        pb_response_msg = await nc.request("greet-pb-js.python", pb_request.SerializeToString(), timeout=5)
        print(f"Python JetStream: Received protobuf response message")
        
        # Parse the protobuf response
        pb_response = messages_pb2.GreetResponse()
        pb_response.ParseFromString(pb_response_msg.data)
        print(f"Python JetStream: Received protobuf response: [{pb_response.receiver_language}] {pb_response.response_text}")
    except Exception as e:
        print(f"Python JetStream: Request failed: {e}")
        import traceback
        traceback.print_exc()

    # Keep the connection alive for a while to receive messages
    try:
        await asyncio.sleep(10)
    except KeyboardInterrupt:
        pass
    finally:
        # Unsubscribe from all subscriptions
        await sub.unsubscribe()
        await reply_sub.unsubscribe()
        await pb_sub.unsubscribe()
        await pb_reply_sub.unsubscribe()
        # Close NATS connection
        await nc.close()
        print("Python JetStream: NATS connection closed")

if __name__ == '__main__':
    asyncio.run(main())