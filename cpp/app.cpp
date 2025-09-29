#include <nats/nats.h>
#include <iostream>
#include <string>
#include <chrono>
#include <thread>

// Include protobuf headers
#include "proto/messages.pb.h"
#include <google/protobuf/util/time_util.h>

// Callback for handling incoming messages
static void onMsg(natsConnection *nc, natsSubscription *sub, natsMsg *msg, void *closure) {
    std::string data(natsMsg_GetData(msg), natsMsg_GetDataLength(msg));
    std::cout << "C++ received: " << data << std::endl;
    natsMsg_Destroy(msg);
}

// Callback for handling requests
static void onRequest(natsConnection *nc, natsSubscription *sub, natsMsg *msg, void *closure) {
    std::string data(natsMsg_GetData(msg), natsMsg_GetDataLength(msg));
    std::cout << "C++: Received request: " << data << std::endl;
    
    // Send reply
    const char* replySubject = natsMsg_GetReply(msg);
    if (replySubject != NULL) {
        std::string reply = "Greetings from C++!";
        natsConnection_PublishString(nc, replySubject, reply.c_str());
    }
    
    natsMsg_Destroy(msg);
}

// Callback for handling protobuf messages
static void onPbMsg(natsConnection *nc, natsSubscription *sub, natsMsg *msg, void *closure) {
    try {
        // Parse the protobuf message
        nats_study::TalkMessage talkMsg;
        std::string data(natsMsg_GetData(msg), natsMsg_GetDataLength(msg));
        if (!talkMsg.ParseFromString(data)) {
            std::cerr << "C++: Failed to parse protobuf message" << std::endl;
            natsMsg_Destroy(msg);
            return;
        }
        
        std::cout << "C++ received protobuf message: [" << talkMsg.sender_language() << "] " 
                  << talkMsg.message_text() << " (timestamp: " << talkMsg.timestamp() << ")" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "C++: Failed to parse protobuf message: " << e.what() << std::endl;
    }
    
    natsMsg_Destroy(msg);
}

// Callback for handling protobuf requests
static void onPbRequest(natsConnection *nc, natsSubscription *sub, natsMsg *msg, void *closure) {
    try {
        // Parse the request
        nats_study::GreetRequest request;
        std::string data(natsMsg_GetData(msg), natsMsg_GetDataLength(msg));
        if (!request.ParseFromString(data)) {
            std::cerr << "C++: Failed to parse protobuf request" << std::endl;
            natsMsg_Destroy(msg);
            return;
        }
        
        std::cout << "C++: Received protobuf request: [" << request.sender_language() << "] " 
                  << request.greeting_text() << std::endl;
        
        // Create and send response
        nats_study::GreetResponse response;
        response.set_response_text("Greetings from C++ using protobuf!");
        response.set_receiver_language("C++");
        
        std::string replyData;
        if (!response.SerializeToString(&replyData)) {
            std::cerr << "C++: Failed to serialize protobuf response" << std::endl;
            natsMsg_Destroy(msg);
            return;
        }
        
        // Send reply
        const char* replySubject = natsMsg_GetReply(msg);
        if (replySubject != NULL) {
            natsConnection_Publish(nc, replySubject, replyData.c_str(), replyData.length());
        }
    } catch (const std::exception& e) {
        std::cerr << "C++: Failed to handle protobuf request: " << e.what() << std::endl;
    }
    
    natsMsg_Destroy(msg);
}

int main() {
    natsConnection *conn = NULL;
    natsSubscription *sub = NULL;
    natsSubscription *requestSub = NULL;
    natsSubscription *pbSub = NULL;
    natsSubscription *pbRequestSub = NULL;
    natsStatus s;
    
    std::string language = "C++";
    
    // Connect to NATS server
    s = natsConnection_ConnectTo(&conn, "nats://localhost:4222");
    if (s == NATS_OK) {
        std::cout << "C++: Connected to NATS server" << std::endl;
    } else {
        std::cerr << "C++: Failed to connect to NATS server: " << natsStatus_GetText(s) << std::endl;
        return 1;
    }
    
    // 1. Publish message to "talk" topic with current time and language
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    std::string message = "Hello from " + language + " at " + std::ctime(&time_t);
    // Remove newline character from ctime
    message.pop_back();
    
    s = natsConnection_PublishString(conn, "talk", message.c_str());
    if (s == NATS_OK) {
        std::cout << "C++: Published message to 'talk' topic: " << message << std::endl;
    } else {
        std::cerr << "C++: Failed to publish message: " << natsStatus_GetText(s) << std::endl;
    }
    
    // 2. Subscribe to "talk" topic and print messages
    s = natsConnection_Subscribe(&sub, conn, "talk", onMsg, NULL);
    if (s == NATS_OK) {
        std::cout << "C++: Subscribed to 'talk' topic" << std::endl;
    } else {
        std::cerr << "C++: Failed to subscribe to 'talk' topic: " << natsStatus_GetText(s) << std::endl;
    }
    
    // 3. Provide request/reply interface
    s = natsConnection_Subscribe(&requestSub, conn, "greet.cpp", onRequest, NULL);
    if (s == NATS_OK) {
        std::cout << "C++: Started request/reply service on 'greet.cpp'" << std::endl;
    } else {
        std::cerr << "C++: Failed to start request/reply service: " << natsStatus_GetText(s) << std::endl;
    }
    
    // New: Publish protobuf message to "talk-pb" topic
    nats_study::TalkMessage talkMsg;
    talkMsg.set_sender_language(language);
    talkMsg.set_message_text("Hello from " + language + " using protobuf");
    talkMsg.set_timestamp(std::chrono::duration_cast<std::chrono::seconds>(std::chrono::system_clock::now().time_since_epoch()).count());
    
    std::string talkMsgData;
    if (talkMsg.SerializeToString(&talkMsgData)) {
        s = natsConnection_Publish(conn, "talk-pb", talkMsgData.c_str(), talkMsgData.length());
        if (s == NATS_OK) {
            std::cout << "C++: Published protobuf message to 'talk-pb' topic" << std::endl;
        } else {
            std::cerr << "C++: Failed to publish protobuf message: " << natsStatus_GetText(s) << std::endl;
        }
    } else {
        std::cerr << "C++: Failed to serialize protobuf message" << std::endl;
    }
    
    // New: Subscribe to "talk-pb" topic and print messages
    s = natsConnection_Subscribe(&pbSub, conn, "talk-pb", onPbMsg, NULL);
    if (s == NATS_OK) {
        std::cout << "C++: Subscribed to 'talk-pb' topic" << std::endl;
    } else {
        std::cerr << "C++: Failed to subscribe to 'talk-pb' topic: " << natsStatus_GetText(s) << std::endl;
    }
    
    // New: Provide protobuf request/reply interface
    s = natsConnection_Subscribe(&pbRequestSub, conn, "greet-pb.cpp", onPbRequest, NULL);
    if (s == NATS_OK) {
        std::cout << "C++: Started protobuf request/reply service on 'greet-pb.cpp'" << std::endl;
    } else {
        std::cerr << "C++: Failed to start protobuf request/reply service: " << natsStatus_GetText(s) << std::endl;
    }
    
    // Make a request to test the functionality
    std::this_thread::sleep_for(std::chrono::seconds(1)); // Give time for services to start
    
    natsMsg *replyMsg = NULL;
    s = natsConnection_RequestString(&replyMsg, conn, "greet.cpp", "Hello C++", 5000); // 5 second timeout
    if (s == NATS_OK) {
        std::string reply(natsMsg_GetData(replyMsg), natsMsg_GetDataLength(replyMsg));
        std::cout << "C++: Received response: " << reply << std::endl;
        natsMsg_Destroy(replyMsg);
        
        // New: Send a protobuf request and wait for a reply
        nats_study::GreetRequest pbRequest;
        pbRequest.set_sender_language(language);
        pbRequest.set_greeting_text("Hello C++ using protobuf");
        
        std::string pbRequestData;
        if (pbRequest.SerializeToString(&pbRequestData)) {
            natsMsg *pbReplyMsg = NULL;
            s = natsConnection_Request(&pbReplyMsg, conn, "greet-pb.cpp", pbRequestData.c_str(), pbRequestData.length(), 5000);
            if (s == NATS_OK) {
                // Parse the protobuf response
                nats_study::GreetResponse pbResponse;
                std::string pbReplyData(natsMsg_GetData(pbReplyMsg), natsMsg_GetDataLength(pbReplyMsg));
                if (pbResponse.ParseFromString(pbReplyData)) {
                    std::cout << "C++: Received protobuf response: [" << pbResponse.receiver_language() << "] " 
                              << pbResponse.response_text() << std::endl;
                } else {
                    std::cerr << "C++: Failed to parse protobuf response" << std::endl;
                }
                natsMsg_Destroy(pbReplyMsg);
            } else {
                std::cerr << "C++: Protobuf request failed: " << natsStatus_GetText(s) << std::endl;
            }
        } else {
            std::cerr << "C++: Failed to serialize protobuf request" << std::endl;
        }
    } else {
        std::cerr << "C++: Request failed: " << natsStatus_GetText(s) << std::endl;
    }
    
    // Keep the connection alive for a while to receive messages
    std::cout << "C++: Listening for messages..." << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(100));
    
    // Cleanup
    if (pbRequestSub != NULL) {
        natsSubscription_Destroy(pbRequestSub);
    }
    if (pbSub != NULL) {
        natsSubscription_Destroy(pbSub);
    }
    if (requestSub != NULL) {
        natsSubscription_Destroy(requestSub);
    }
    if (sub != NULL) {
        natsSubscription_Destroy(sub);
    }
    if (conn != NULL) {
        natsConnection_Destroy(conn);
    }
    
    // Destroy the library (in a real application, this would be done at application exit)
    nats_Close();
    
    std::cout << "C++: NATS connection closed" << std::endl;
    
    return 0;
}