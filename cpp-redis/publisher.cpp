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
        
        // 3. 发布消息到频道
        std::string channel = "news";
        std::string message = "Hello, World!";
        
        std::cout << "Publishing message: " << message << " to channel: " << channel << std::endl;
        long long subscribers = redis.publish(channel, message);
        std::cout << "Message sent to " << subscribers << " subscribers" << std::endl;
        
        // 发布更多消息
        for (int i = 1; i <= 5; ++i) {
            std::string msg = "Message #" + std::to_string(i);
            std::cout << "Publishing: " << msg << std::endl;
            redis.publish(channel, msg);
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
        
    } catch (const Error &e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return -1;
    }
    
    return 0;
}