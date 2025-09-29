# Java NATS Client

This directory contains the Java implementation of the NATS client.

## Prerequisites

- Java 11 or higher
- Maven

## Building

```bash
mvn clean compile
```

## Running

```bash
mvn exec:java
```

## Creating a JAR

```bash
mvn package
```

Then run with:

```bash
java -cp target/nats-java-client-1.0-SNAPSHOT.jar App