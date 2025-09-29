import io.nats.client.Connection;
import io.nats.client.Dispatcher;
import io.nats.client.Nats;
import io.nats.client.Options;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

// Import protobuf classes
import nats_study.Messages;

public class App {
    public static void main(String[] args) {
        String language = "Java";
        
        try {
            // Connect to NATS server
            Options options = new Options.Builder()
                .server("nats://localhost:4222")
                .build();
            
            Connection nc = Nats.connect(options);
            System.out.println("Java: Connected to NATS server");
            
            // 1. Publish message to "talk" topic with current time and language
            try {
                LocalDateTime now = LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String message = "Hello from " + language + " at " + now.format(formatter);
                
                nc.publish("talk", message.getBytes(StandardCharsets.UTF_8));
                System.out.println("Java: Published message to 'talk' topic: " + message);
            } catch (Exception e) {
                System.err.println("Java: Failed to publish message: " + e.getMessage());
            }
            
            // 2. Subscribe to "talk" topic and print messages
            try {
                Dispatcher dispatcher = nc.createDispatcher((msg) -> {
                    String receivedMessage = new String(msg.getData(), StandardCharsets.UTF_8);
                    System.out.println("Java received: " + receivedMessage);
                });
                
                dispatcher.subscribe("talk");
                System.out.println("Java: Subscribed to 'talk' topic");
            } catch (Exception e) {
                System.err.println("Java: Failed to subscribe to 'talk' topic: " + e.getMessage());
            }
            
            // 3. Provide request/reply interface and make a request
            try {
                // Create a dispatcher to handle incoming requests
                Dispatcher replyDispatcher = nc.createDispatcher((msg) -> {
                    String request = new String(msg.getData(), StandardCharsets.UTF_8);
                    System.out.println("Java: Received request: " + request);
                    
                    // Generate reply
                    String reply = "Greetings from " + language + "!";
                    
                    // Send reply
                    nc.publish(msg.getReplyTo(), reply.getBytes(StandardCharsets.UTF_8));
                });
                
                // Subscribe to the request subject
                replyDispatcher.subscribe("greet.java");
                System.out.println("Java: Started request/reply service on 'greet.java'");
            } catch (Exception e) {
                System.err.println("Java: Failed to start request/reply service: " + e.getMessage());
            }
            
            // New: Publish protobuf message to "talk-pb" topic
            try {
                // Create a protobuf talk message
                Messages.TalkMessage talkMsg = Messages.TalkMessage.newBuilder()
                    .setSenderLanguage(language)
                    .setMessageText("Hello from " + language + " using protobuf")
                    .setTimestamp(System.currentTimeMillis() / 1000)
                    .build();
                
                // Serialize and publish
                nc.publish("talk-pb", talkMsg.toByteArray());
                System.out.println("Java: Published protobuf message to 'talk-pb' topic");
            } catch (Exception e) {
                System.err.println("Java: Failed to publish protobuf message: " + e.getMessage());
            }
            
            // New: Subscribe to "talk-pb" topic and print messages
            try {
                Dispatcher pbDispatcher = nc.createDispatcher((msg) -> {
                    try {
                        // Parse the protobuf message
                        Messages.TalkMessage talkMsg = Messages.TalkMessage.parseFrom(msg.getData());
                        System.out.println("Java received protobuf message: [" + talkMsg.getSenderLanguage() + "] " + 
                            talkMsg.getMessageText() + " (timestamp: " + talkMsg.getTimestamp() + ")");
                    } catch (Exception e) {
                        System.err.println("Java: Failed to parse protobuf message: " + e.getMessage());
                    }
                });
                
                pbDispatcher.subscribe("talk-pb");
                System.out.println("Java: Subscribed to 'talk-pb' topic");
            } catch (Exception e) {
                System.err.println("Java: Failed to subscribe to 'talk-pb' topic: " + e.getMessage());
            }
            
            // New: Provide protobuf request/reply interface
            try {
                Dispatcher pbReplyDispatcher = nc.createDispatcher((msg) -> {
                    try {
                        // Parse the request
                        Messages.GreetRequest request = Messages.GreetRequest.parseFrom(msg.getData());
                        System.out.println("Java: Received protobuf request: [" + request.getSenderLanguage() + "] " + 
                            request.getGreetingText());
                        
                        // Create and send response
                        Messages.GreetResponse response = Messages.GreetResponse.newBuilder()
                            .setResponseText("Greetings from " + language + " using protobuf!")
                            .setReceiverLanguage(language)
                            .build();
                        
                        // Send reply
                        nc.publish(msg.getReplyTo(), response.toByteArray());
                    } catch (Exception e) {
                        System.err.println("Java: Failed to handle protobuf request: " + e.getMessage());
                    }
                });
                
                // Subscribe to the protobuf request subject
                pbReplyDispatcher.subscribe("greet-pb.java");
                System.out.println("Java: Started protobuf request/reply service on 'greet-pb.java'");
            } catch (Exception e) {
                System.err.println("Java: Failed to start protobuf request/reply service: " + e.getMessage());
            }
            
            // Make a request to test the functionality
            try {
                // Give a moment for all services to start
                Thread.sleep(1000);
                
                // Send a request and wait for a reply
                String request = "Hello " + language;
                io.nats.client.Message reply = nc.request("greet.java", request.getBytes(StandardCharsets.UTF_8)).get();
                
                String replyMessage = new String(reply.getData(), StandardCharsets.UTF_8);
                System.out.println("Java: Received response: " + replyMessage);
                
                // New: Send a protobuf request and wait for a reply
                Messages.GreetRequest pbRequest = Messages.GreetRequest.newBuilder()
                    .setSenderLanguage(language)
                    .setGreetingText("Hello " + language + " using protobuf")
                    .build();
                
                io.nats.client.Message pbReply = nc.request("greet-pb.java", pbRequest.toByteArray()).get();
                
                Messages.GreetResponse pbResponse = Messages.GreetResponse.parseFrom(pbReply.getData());
                System.out.println("Java: Received protobuf response: [" + pbResponse.getReceiverLanguage() + "] " + 
                    pbResponse.getResponseText());
            } catch (Exception e) {
                System.err.println("Java: Request failed: " + e.getMessage());
            }
            
            // Keep the program running to receive messages
            System.out.println("Java: Listening for messages...");
            Thread.sleep(10000); // Listen for 10 seconds
            
            // Close the connection
            nc.close();
            System.out.println("Java: NATS connection closed");
            
        } catch (Exception e) {
            System.err.println("Java: Failed to connect to NATS server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}