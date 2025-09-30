# Redis Plus Plus 发布订阅模式使用指南

本文档总结了如何在 redis-plus-plus 库中使用发布订阅模式。

## 1. 创建 Redis 连接

要使用 Redis 的发布订阅功能，首先需要创建一个 Redis 连接：

```cpp
#include <sw/redis++/redis.h>

using namespace sw::redis;

// 使用 URI 创建连接
Redis redis("tcp://127.0.0.1:6379");

// 或者使用 ConnectionOptions
ConnectionOptions connection_options;
connection_options.host = "127.0.0.1";
connection_options.port = 6379;
Redis redis(connection_options);
```

## 2. 创建发布者和订阅者

### 创建订阅者

```cpp
// 从 Redis 实例创建订阅者
auto subscriber = redis.subscriber();
```

### 发布者

发布者直接使用 Redis 实例的 `publish` 方法：

```cpp
// 发布消息
redis.publish("channel_name", "message");
```

## 3. 发布消息到频道

使用 Redis 实例的 `publish` 方法发布消息：

```cpp
std::string channel = "news";
std::string message = "Hello, World!";

// 发布消息并获取订阅者数量
long long subscribers = redis.publish(channel, message);
std::cout << "Message sent to " << subscribers << " subscribers" << std::endl;
```

## 4. 订阅频道并处理收到的消息

### 设置回调函数

```cpp
// 设置消息处理回调函数
subscriber.on_message([](std::string channel, std::string msg) {
    std::cout << "Received message on channel " << channel << ": " << msg << std::endl;
});

// 设置模式匹配消息处理回调函数
subscriber.on_pmessage([](std::string pattern, std::string channel, std::string msg) {
    std::cout << "Received message on channel " << channel 
              << " matching pattern " << pattern << ": " << msg << std::endl;
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
        case Subscriber::MsgType::PSUBSCRIBE:
            std::cout << "Subscribed to pattern: " << *channel << std::endl;
            break;
        case Subscriber::MsgType::PUNSUBSCRIBE:
            std::cout << "Unsubscribed from pattern: " << *channel << std::endl;
            break;
        default:
            break;
    }
});
```

### 订阅频道

```cpp
// 订阅单个频道
subscriber.subscribe("news");

// 批量订阅多个频道
std::vector<std::string> channels = {"news", "sports", "weather"};
subscriber.subscribe(channels.begin(), channels.end());

// 订阅模式
subscriber.psubscribe("news.*");

// 批量订阅多个模式
std::vector<std::string> patterns = {"news.*", "sports.*"};
subscriber.psubscribe(patterns.begin(), patterns.end());
```

### 接收消息

```cpp
// 持续接收消息
while (true) {
    try {
        subscriber.consume();
    } catch (const Error &e) {
        std::cerr << "Error consuming messages: " << e.what() << std::endl;
        break;
    }
}
```

### 取消订阅

```cpp
// 取消订阅特定频道
subscriber.unsubscribe("news");

// 取消订阅所有频道
subscriber.unsubscribe();

// 取消订阅模式
subscriber.punsubscribe("news.*");

// 取消订阅所有模式
subscriber.punsubscribe();
```

## 5. 完整示例

### 订阅者示例 (subscriber.cpp)

```cpp
#include <sw/redis++/redis.h>
#include <iostream>
#include <string>

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
        
        // 设置元信息回调函数
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
```

### 发布者示例 (publisher.cpp)

```cpp
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
```

## 编译和运行

确保已安装 redis-plus-plus 库和依赖项：

```bash
# 使用 vcpkg 安装依赖
vcpkg install redis-plus-plus

# 配置项目
cmake --preset=default

# 构建项目
cmake --build --preset=default

# 运行订阅者
./build/subscriber

# 在另一个终端运行发布者
./build/publisher
```

## 注意事项

1. **线程安全**：Subscriber 不是线程安全的，确保在同一线程中使用。
2. **阻塞操作**：`subscriber.consume()` 是一个阻塞操作，会等待下一个消息。
3. **异常处理**：始终使用 try-catch 块处理可能的异常。
4. **资源管理**：Subscriber 使用完后会自动释放资源。