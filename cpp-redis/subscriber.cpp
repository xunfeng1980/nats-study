#include <sw/redis++/redis.h>
#include <iostream>
#include <string>
#include <thread>
#include <chrono>

using namespace sw::redis;

int main() {
    try {
        // 1. 创建Redis连接
        Redis redis("tcp://127.0.0.1:6379");
        
        // 2. 创建订阅者
        auto subscriber = redis.subscriber();
        
        // 4. 设置消息处理回调函数
        subscriber.on_message([](std::string channel, std::string msg) {
            std::cout << "Received message on channel " << channel << ": " << msg << std::endl;
        });
        
        // 设置元信息回调函数（订阅/取消订阅等）
        subscriber.on_meta([](Subscriber::MsgType type, OptionalString channel, long long count) {
            switch (type) {
                case Subscriber::MsgType::SUBSCRIBE:
                    std::cout << "Subscribed to channel: " << *channel << std::endl;
                    break;
                case Subscriber::MsgType::UNSUBSCRIBE:
                    std::cout << "Unsubscribed from channel: " << *channel << std::endl;
                    break;
                default:
                    break;
            }
        });
        
        // 4. 订阅频道
        std::string channel = "news";
        std::cout << "Subscribing to channel: " << channel << std::endl;
        subscriber.subscribe(channel);
        
        // 开始接收消息
        std::cout << "Waiting for messages... Press Ctrl+C to exit." << std::endl;
        while (true) {
            try {
                subscriber.consume();
            } catch (const Error &e) {
                std::cerr << "Error consuming messages: " << e.what() << std::endl;
                break;
            }
        }
        
    } catch (const Error &e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return -1;
    }
    
    return 0;
}