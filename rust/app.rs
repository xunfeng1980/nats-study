#!/usr/bin/env rust

// Rust NATS Client Implementation
// This implementation follows the same pattern as the Python and JavaScript versions

use futures_util::StreamExt;
use std::time::{SystemTime, UNIX_EPOCH};

// Include the generated protobuf code
pub mod nats_study {
    include!(concat!(env!("OUT_DIR"), "/nats_study.rs"));
}

use nats_study::{TalkMessage, GreetRequest, GreetResponse};
use prost::Message;

#[tokio::main]
async fn main() -> Result<(), async_nats::Error> {
    // Connect to NATS server
    let client = async_nats::connect("nats://localhost:4222").await;
    let client = match client {
        Ok(c) => {
            println!("Rust: Connected to NATS server");
            c
        }
        Err(e) => {
            println!("Rust: Failed to connect to NATS server: {}", e);
            return Ok(());
        }
    };

    // Language identifier
    let language = "Rust";
    
    // 1. Publish message to "talk" topic with current time and language
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH).expect("Time went backwards");
    let message = format!("Hello from {} at {:?}", language, since_the_epoch);
    
    if let Err(e) = client.publish("talk", message.clone().into()).await {
        println!("Rust: Failed to publish message: {}", e);
    } else {
        println!("Rust: Published message to 'talk' topic: {}", message);
    }
    
    // 2. Subscribe to "talk" topic and print messages
    let subscriber = client.subscribe("talk").await;
    match subscriber {
        Ok(mut sub) => {
            println!("Rust: Subscribed to 'talk' topic");
            tokio::spawn(async move {
                while let Some(message) = sub.next().await {
                    if let Ok(data) = std::str::from_utf8(&message.payload) {
                        println!("Rust received: {}", data);
                    }
                }
            });
        }
        Err(e) => {
            println!("Rust: Failed to subscribe to 'talk' topic: {}", e);
        }
    }

    // 3. Provide request/reply interface and make a request
    let client_clone = client.clone();
    let reply_subscriber = client_clone.subscribe(format!("greet.{}", language.to_lowercase())).await;
    match reply_subscriber {
        Ok(mut sub) => {
            println!("Rust: Started request/reply service on 'greet.{}'", language.to_lowercase());
            tokio::spawn(async move {
                while let Some(message) = sub.next().await {
                    if let Ok(data) = std::str::from_utf8(&message.payload) {
                        println!("Rust: Received request: {}", data);
                    }
                    if let Some(reply_subject) = message.reply {
                        let response = format!("Greetings from {}!", language);
                        let _ = client_clone.publish(reply_subject, response.into()).await;
                    }
                }
            });
        }
        Err(e) => {
            println!("Rust: Failed to start request/reply service: {}", e);
        }
    }
    
    // New: Publish protobuf message to "talk-pb" topic
    let talk_msg = TalkMessage {
        sender_language: language.to_string(),
        message_text: format!("Hello from {} using protobuf", language),
        timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
    };
    
    let mut buf = Vec::new();
    if let Err(e) = talk_msg.encode(&mut buf) {
        println!("Rust: Failed to encode protobuf message: {}", e);
    } else {
        if let Err(e) = client.publish("talk-pb", buf.into()).await {
            println!("Rust: Failed to publish protobuf message: {}", e);
        } else {
            println!("Rust: Published protobuf message to 'talk-pb' topic");
        }
    }
    
    // New: Subscribe to "talk-pb" topic and print messages
    let pb_subscriber = client.subscribe("talk-pb").await;
    match pb_subscriber {
        Ok(mut sub) => {
            println!("Rust: Subscribed to 'talk-pb' topic");
            tokio::spawn(async move {
                while let Some(message) = sub.next().await {
                    match TalkMessage::decode(&message.payload[..]) {
                        Ok(talk_msg) => {
                            println!("Rust received protobuf message: [{}] {} (timestamp: {})",
                                talk_msg.sender_language, talk_msg.message_text, talk_msg.timestamp);
                        }
                        Err(e) => {
                            println!("Rust: Failed to decode protobuf message: {}", e);
                        }
                    }
                }
            });
        }
        Err(e) => {
            println!("Rust: Failed to subscribe to 'talk-pb' topic: {}", e);
        }
    }
    
    // New: Provide protobuf request/reply interface
    let pb_client_clone = client.clone();
    let pb_reply_subscriber = pb_client_clone.subscribe(format!("greet-pb.{}", language.to_lowercase())).await;
    match pb_reply_subscriber {
        Ok(mut sub) => {
            println!("Rust: Started protobuf request/reply service on 'greet-pb.{}'", language.to_lowercase());
            tokio::spawn(async move {
                while let Some(message) = sub.next().await {
                    match GreetRequest::decode(&message.payload[..]) {
                        Ok(request) => {
                            println!("Rust: Received protobuf request: [{}] {}", 
                                request.sender_language, request.greeting_text);
                            
                            let response = GreetResponse {
                                response_text: format!("Greetings from {} using protobuf!", language),
                                receiver_language: language.to_string(),
                            };
                            
                            let mut buf = Vec::new();
                            if let Err(e) = response.encode(&mut buf) {
                                println!("Rust: Failed to encode protobuf response: {}", e);
                            } else if let Some(reply_subject) = message.reply {
                                let _ = pb_client_clone.publish(reply_subject, buf.into()).await;
                            }
                        }
                        Err(e) => {
                            println!("Rust: Failed to decode protobuf request: {}", e);
                        }
                    }
                }
            });
        }
        Err(e) => {
            println!("Rust: Failed to start protobuf request/reply service: {}", e);
        }
    }
    
    // Make a request to test the functionality
    // Give a moment for all services to start
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    
    let request_message = format!("Hello {}", language);
    match tokio::time::timeout(
        tokio::time::Duration::from_secs(5),
        client.request(format!("greet.{}", language.to_lowercase()), request_message.into())
    ).await {
        Ok(Ok(response)) => {
            if let Ok(data) = std::str::from_utf8(&response.payload) {
                println!("Rust: Received response: {}", data);
            }
        }
        Ok(Err(e)) => {
            println!("Rust: Request failed: {}", e);
        }
        Err(_) => {
            println!("Rust: Request timed out");
        }
    }
    
    // New: Send a protobuf request and expect a response
    let pb_request = GreetRequest {
        sender_language: language.to_string(),
        greeting_text: format!("Hello {} using protobuf", language),
    };
    
    let mut pb_buf = Vec::new();
    if let Err(e) = pb_request.encode(&mut pb_buf) {
        println!("Rust: Failed to encode protobuf request: {}", e);
    } else {
        match tokio::time::timeout(
            tokio::time::Duration::from_secs(5),
            client.request(format!("greet-pb.{}", language.to_lowercase()), pb_buf.into())
        ).await {
            Ok(Ok(response)) => {
                match GreetResponse::decode(&response.payload[..]) {
                    Ok(pb_response) => {
                        println!("Rust: Received protobuf response: [{}] {}", 
                            pb_response.receiver_language, pb_response.response_text);
                    }
                    Err(e) => {
                        println!("Rust: Failed to decode protobuf response: {}", e);
                    }
                }
            }
            Ok(Err(e)) => {
                println!("Rust: Protobuf request failed: {}", e);
            }
            Err(_) => {
                println!("Rust: Protobuf request timed out");
            }
        }
    }
    
    // Keep the connection alive for a while to receive messages
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
    
    // Close the connection
    println!("Rust: NATS connection closed");
    
    Ok(())
}