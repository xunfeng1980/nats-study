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
    # Connect to NATS server
    try:
        nc = await nats.connect("nats://localhost:4222")
        print("Python: Connected to NATS server")
    except Exception as e:
        print(f"Python: Failed to connect to NATS server: {e}")
        return

    # Language identifier
    language = "Python"
    
    # 1. Publish message to "talk" topic with current time and language
    try:
        message = f"Hello from {language} at {datetime.now()}"
        await nc.publish("talk", message.encode())
        print(f"Python: Published message to 'talk' topic: {message}")
    except Exception as e:
        print(f"Python: Failed to publish message: {e}")

    # 2. Subscribe to "talk" topic and print messages
    async def message_handler(msg):
        data = msg.data.decode()
        print(f"Python received: {data}")
    
    try:
        sub = await nc.subscribe("talk", cb=message_handler)
        print("Python: Subscribed to 'talk' topic")
    except Exception as e:
        print(f"Python: Failed to subscribe to 'talk' topic: {e}")

    # 3. Provide request/reply interface and make a request
    async def reply_handler(msg):
        print(f"Python: Received request: {msg.data.decode()}")
        await nc.publish(msg.reply, f"Greetings from {language}!".encode())
    
    try:
        # Subscribe to handle requests
        reply_sub = await nc.subscribe("greet.python", cb=reply_handler)
        print("Python: Started request/reply service on 'greet.python'")
    except Exception as e:
        print(f"Python: Failed to start request/reply service: {e}")

    # New: Publish protobuf message to "talk-pb" topic
    try:
        # Create a protobuf talk message
        talk_msg = messages_pb2.TalkMessage()
        talk_msg.sender_language = language
        talk_msg.message_text = f"Hello from {language} using protobuf"
        talk_msg.timestamp = int(datetime.now().timestamp())
        
        # Serialize and publish
        await nc.publish("talk-pb", talk_msg.SerializeToString())
        print(f"Python: Published protobuf message to 'talk-pb' topic")
    except Exception as e:
        print(f"Python: Failed to publish protobuf message: {e}")

    # New: Subscribe to "talk-pb" topic and print messages
    async def pb_message_handler(msg):
        try:
            # Parse the protobuf message
            talk_msg = messages_pb2.TalkMessage()
            talk_msg.ParseFromString(msg.data)
            print(f"Python received protobuf message: [{talk_msg.sender_language}] {talk_msg.message_text} (timestamp: {talk_msg.timestamp})")
        except Exception as e:
            print(f"Python: Failed to parse protobuf message: {e}")
    
    try:
        pb_sub = await nc.subscribe("talk-pb", cb=pb_message_handler)
        print("Python: Subscribed to 'talk-pb' topic")
    except Exception as e:
        print(f"Python: Failed to subscribe to 'talk-pb' topic: {e}")

    # New: Provide protobuf request/reply interface
    async def pb_reply_handler(msg):
        try:
            # Parse the request
            request = messages_pb2.GreetRequest()
            request.ParseFromString(msg.data)
            print(f"Python: Received protobuf request: [{request.sender_language}] {request.greeting_text}")
            
            # Create and send response
            response = messages_pb2.GreetResponse()
            response.response_text = f"Greetings from {language} using protobuf!"
            response.receiver_language = language
            
            await nc.publish(msg.reply, response.SerializeToString())
        except Exception as e:
            print(f"Python: Failed to handle protobuf request: {e}")
    
    try:
        # Subscribe to handle protobuf requests
        pb_reply_sub = await nc.subscribe("greet-pb.python", cb=pb_reply_handler)
        print("Python: Started protobuf request/reply service on 'greet-pb.python'")
    except Exception as e:
        print(f"Python: Failed to start protobuf request/reply service: {e}")

    # Make a request to test the functionality
    try:
        # Give a moment for all services to start
        await asyncio.sleep(1)
        
        # Send a request and expect a response
        response = await nc.request("greet.python", f"Hello {language}".encode(), timeout=5)
        print(f"Python: Received response: {response.data.decode()}")
        
        # New: Send a protobuf request and expect a response
        pb_request = messages_pb2.GreetRequest()
        pb_request.sender_language = language
        pb_request.greeting_text = f"Hello {language} using protobuf"
        
        pb_response_msg = await nc.request("greet-pb.python", pb_request.SerializeToString(), timeout=5)
        
        # Parse the protobuf response
        pb_response = messages_pb2.GreetResponse()
        pb_response.ParseFromString(pb_response_msg.data)
        print(f"Python: Received protobuf response: [{pb_response.receiver_language}] {pb_response.response_text}")
    except Exception as e:
        print(f"Python: Request failed: {e}")

    # Keep the connection alive for a while to receive messages
    try:
        await asyncio.sleep(100)
    except KeyboardInterrupt:
        pass
    finally:
        await nc.close()
        print("Python: NATS connection closed")

if __name__ == '__main__':
    asyncio.run(main())