#include <sw/redis++/redis++.h>
#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <sstream>
#include <iomanip>
#include <ctime>

using namespace sw::redis;

// 获取当前时间戳
std::string getCurrentTime() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    
    std::stringstream ss;
    ss << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

// 消息处理回调函数
void handleMessage(std::string channel, std::string msg) {
    std::cout << "Received on channel " << channel << ": " << msg << std::endl;
}

// 元信息处理回调函数
void handleMeta(Subscriber::MsgType type, OptionalString channel, long long count) {
    switch (type) {
        case Subscriber::MsgType::MESSAGE:
            std::cout << "Received message" << std::endl;
            break;
        case Subscriber::MsgType::PMESSAGE:
            std::cout << "Received pmessage" << std::endl;
            break;
        case Subscriber::MsgType::SUBSCRIBE:
            std::cout << "Subscribed to " << *channel << ", active subscriptions: " << count << std::endl;
            break;
        case Subscriber::MsgType::UNSUBSCRIBE:
            std::cout << "Unsubscribed from " << *channel << ", active subscriptions: " << count << std::endl;
            break;
        case Subscriber::MsgType::PSUBSCRIBE:
            std::cout << "Pattern subscribed to " << *channel << ", active subscriptions: " << count << std::endl;
            break;
        case Subscriber::MsgType::PUNSUBSCRIBE:
            std::cout << "Pattern unsubscribed from " << *channel << ", active subscriptions: " << count << std::endl;
            break;
    }
}

int main() {
    try {
        // 创建 Redis 连接
        Redis redis("tcp://127.0.0.1:6379");
        
        // 创建订阅者
        auto subscriber = redis.subscriber();
        
        // 设置回调函数
        subscriber.on_message(handleMessage);
        subscriber.on_meta(handleMeta);
        
        // 订阅 "talk" 频道
        subscriber.subscribe("talk");
        std::cout << "Subscribed to 'talk' channel" << std::endl;
        
        // 发布消息到 "talk" 频道
        std::string message = "Hello from C++ at " + getCurrentTime();
        auto subscribers = redis.publish("talk", message);
        std::cout << "Published message: " << message << std::endl;
        std::cout << "Message sent to " << subscribers << " subscribers" << std::endl;
        
        // 持续监听消息一段时间
        auto start = std::chrono::steady_clock::now();
        auto duration = std::chrono::seconds(10); // 运行10秒
        
        std::cout << "Listening for messages for 10 seconds..." << std::endl;
        while (std::chrono::steady_clock::now() - start < duration) {
            subscriber.consume();
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
        
        // 取消订阅
        subscriber.unsubscribe("talk");
        std::cout << "Unsubscribed from 'talk' channel" << std::endl;
        
    } catch (const Error& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}

