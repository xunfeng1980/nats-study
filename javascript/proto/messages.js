/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.nats_study = (function() {

    /**
     * Namespace nats_study.
     * @exports nats_study
     * @namespace
     */
    var nats_study = {};

    nats_study.TalkMessage = (function() {

        /**
         * Properties of a TalkMessage.
         * @memberof nats_study
         * @interface ITalkMessage
         * @property {string|null} [senderLanguage] TalkMessage senderLanguage
         * @property {string|null} [messageText] TalkMessage messageText
         * @property {number|Long|null} [timestamp] TalkMessage timestamp
         */

        /**
         * Constructs a new TalkMessage.
         * @memberof nats_study
         * @classdesc Represents a TalkMessage.
         * @implements ITalkMessage
         * @constructor
         * @param {nats_study.ITalkMessage=} [properties] Properties to set
         */
        function TalkMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TalkMessage senderLanguage.
         * @member {string} senderLanguage
         * @memberof nats_study.TalkMessage
         * @instance
         */
        TalkMessage.prototype.senderLanguage = "";

        /**
         * TalkMessage messageText.
         * @member {string} messageText
         * @memberof nats_study.TalkMessage
         * @instance
         */
        TalkMessage.prototype.messageText = "";

        /**
         * TalkMessage timestamp.
         * @member {number|Long} timestamp
         * @memberof nats_study.TalkMessage
         * @instance
         */
        TalkMessage.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new TalkMessage instance using the specified properties.
         * @function create
         * @memberof nats_study.TalkMessage
         * @static
         * @param {nats_study.ITalkMessage=} [properties] Properties to set
         * @returns {nats_study.TalkMessage} TalkMessage instance
         */
        TalkMessage.create = function create(properties) {
            return new TalkMessage(properties);
        };

        /**
         * Encodes the specified TalkMessage message. Does not implicitly {@link nats_study.TalkMessage.verify|verify} messages.
         * @function encode
         * @memberof nats_study.TalkMessage
         * @static
         * @param {nats_study.ITalkMessage} message TalkMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TalkMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderLanguage != null && Object.hasOwnProperty.call(message, "senderLanguage"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.senderLanguage);
            if (message.messageText != null && Object.hasOwnProperty.call(message, "messageText"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.messageText);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified TalkMessage message, length delimited. Does not implicitly {@link nats_study.TalkMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nats_study.TalkMessage
         * @static
         * @param {nats_study.ITalkMessage} message TalkMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TalkMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TalkMessage message from the specified reader or buffer.
         * @function decode
         * @memberof nats_study.TalkMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nats_study.TalkMessage} TalkMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TalkMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.nats_study.TalkMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.senderLanguage = reader.string();
                        break;
                    }
                case 2: {
                        message.messageText = reader.string();
                        break;
                    }
                case 3: {
                        message.timestamp = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TalkMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nats_study.TalkMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nats_study.TalkMessage} TalkMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TalkMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TalkMessage message.
         * @function verify
         * @memberof nats_study.TalkMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TalkMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderLanguage != null && message.hasOwnProperty("senderLanguage"))
                if (!$util.isString(message.senderLanguage))
                    return "senderLanguage: string expected";
            if (message.messageText != null && message.hasOwnProperty("messageText"))
                if (!$util.isString(message.messageText))
                    return "messageText: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a TalkMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nats_study.TalkMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nats_study.TalkMessage} TalkMessage
         */
        TalkMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.nats_study.TalkMessage)
                return object;
            var message = new $root.nats_study.TalkMessage();
            if (object.senderLanguage != null)
                message.senderLanguage = String(object.senderLanguage);
            if (object.messageText != null)
                message.messageText = String(object.messageText);
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a TalkMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nats_study.TalkMessage
         * @static
         * @param {nats_study.TalkMessage} message TalkMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TalkMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.senderLanguage = "";
                object.messageText = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.senderLanguage != null && message.hasOwnProperty("senderLanguage"))
                object.senderLanguage = message.senderLanguage;
            if (message.messageText != null && message.hasOwnProperty("messageText"))
                object.messageText = message.messageText;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this TalkMessage to JSON.
         * @function toJSON
         * @memberof nats_study.TalkMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TalkMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TalkMessage
         * @function getTypeUrl
         * @memberof nats_study.TalkMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TalkMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nats_study.TalkMessage";
        };

        return TalkMessage;
    })();

    nats_study.GreetRequest = (function() {

        /**
         * Properties of a GreetRequest.
         * @memberof nats_study
         * @interface IGreetRequest
         * @property {string|null} [senderLanguage] GreetRequest senderLanguage
         * @property {string|null} [greetingText] GreetRequest greetingText
         */

        /**
         * Constructs a new GreetRequest.
         * @memberof nats_study
         * @classdesc Represents a GreetRequest.
         * @implements IGreetRequest
         * @constructor
         * @param {nats_study.IGreetRequest=} [properties] Properties to set
         */
        function GreetRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GreetRequest senderLanguage.
         * @member {string} senderLanguage
         * @memberof nats_study.GreetRequest
         * @instance
         */
        GreetRequest.prototype.senderLanguage = "";

        /**
         * GreetRequest greetingText.
         * @member {string} greetingText
         * @memberof nats_study.GreetRequest
         * @instance
         */
        GreetRequest.prototype.greetingText = "";

        /**
         * Creates a new GreetRequest instance using the specified properties.
         * @function create
         * @memberof nats_study.GreetRequest
         * @static
         * @param {nats_study.IGreetRequest=} [properties] Properties to set
         * @returns {nats_study.GreetRequest} GreetRequest instance
         */
        GreetRequest.create = function create(properties) {
            return new GreetRequest(properties);
        };

        /**
         * Encodes the specified GreetRequest message. Does not implicitly {@link nats_study.GreetRequest.verify|verify} messages.
         * @function encode
         * @memberof nats_study.GreetRequest
         * @static
         * @param {nats_study.IGreetRequest} message GreetRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GreetRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderLanguage != null && Object.hasOwnProperty.call(message, "senderLanguage"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.senderLanguage);
            if (message.greetingText != null && Object.hasOwnProperty.call(message, "greetingText"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.greetingText);
            return writer;
        };

        /**
         * Encodes the specified GreetRequest message, length delimited. Does not implicitly {@link nats_study.GreetRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nats_study.GreetRequest
         * @static
         * @param {nats_study.IGreetRequest} message GreetRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GreetRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GreetRequest message from the specified reader or buffer.
         * @function decode
         * @memberof nats_study.GreetRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nats_study.GreetRequest} GreetRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GreetRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.nats_study.GreetRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.senderLanguage = reader.string();
                        break;
                    }
                case 2: {
                        message.greetingText = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GreetRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nats_study.GreetRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nats_study.GreetRequest} GreetRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GreetRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GreetRequest message.
         * @function verify
         * @memberof nats_study.GreetRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GreetRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderLanguage != null && message.hasOwnProperty("senderLanguage"))
                if (!$util.isString(message.senderLanguage))
                    return "senderLanguage: string expected";
            if (message.greetingText != null && message.hasOwnProperty("greetingText"))
                if (!$util.isString(message.greetingText))
                    return "greetingText: string expected";
            return null;
        };

        /**
         * Creates a GreetRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nats_study.GreetRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nats_study.GreetRequest} GreetRequest
         */
        GreetRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.nats_study.GreetRequest)
                return object;
            var message = new $root.nats_study.GreetRequest();
            if (object.senderLanguage != null)
                message.senderLanguage = String(object.senderLanguage);
            if (object.greetingText != null)
                message.greetingText = String(object.greetingText);
            return message;
        };

        /**
         * Creates a plain object from a GreetRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nats_study.GreetRequest
         * @static
         * @param {nats_study.GreetRequest} message GreetRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GreetRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.senderLanguage = "";
                object.greetingText = "";
            }
            if (message.senderLanguage != null && message.hasOwnProperty("senderLanguage"))
                object.senderLanguage = message.senderLanguage;
            if (message.greetingText != null && message.hasOwnProperty("greetingText"))
                object.greetingText = message.greetingText;
            return object;
        };

        /**
         * Converts this GreetRequest to JSON.
         * @function toJSON
         * @memberof nats_study.GreetRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GreetRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GreetRequest
         * @function getTypeUrl
         * @memberof nats_study.GreetRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GreetRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nats_study.GreetRequest";
        };

        return GreetRequest;
    })();

    nats_study.GreetResponse = (function() {

        /**
         * Properties of a GreetResponse.
         * @memberof nats_study
         * @interface IGreetResponse
         * @property {string|null} [responseText] GreetResponse responseText
         * @property {string|null} [receiverLanguage] GreetResponse receiverLanguage
         */

        /**
         * Constructs a new GreetResponse.
         * @memberof nats_study
         * @classdesc Represents a GreetResponse.
         * @implements IGreetResponse
         * @constructor
         * @param {nats_study.IGreetResponse=} [properties] Properties to set
         */
        function GreetResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GreetResponse responseText.
         * @member {string} responseText
         * @memberof nats_study.GreetResponse
         * @instance
         */
        GreetResponse.prototype.responseText = "";

        /**
         * GreetResponse receiverLanguage.
         * @member {string} receiverLanguage
         * @memberof nats_study.GreetResponse
         * @instance
         */
        GreetResponse.prototype.receiverLanguage = "";

        /**
         * Creates a new GreetResponse instance using the specified properties.
         * @function create
         * @memberof nats_study.GreetResponse
         * @static
         * @param {nats_study.IGreetResponse=} [properties] Properties to set
         * @returns {nats_study.GreetResponse} GreetResponse instance
         */
        GreetResponse.create = function create(properties) {
            return new GreetResponse(properties);
        };

        /**
         * Encodes the specified GreetResponse message. Does not implicitly {@link nats_study.GreetResponse.verify|verify} messages.
         * @function encode
         * @memberof nats_study.GreetResponse
         * @static
         * @param {nats_study.IGreetResponse} message GreetResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GreetResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.responseText != null && Object.hasOwnProperty.call(message, "responseText"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.responseText);
            if (message.receiverLanguage != null && Object.hasOwnProperty.call(message, "receiverLanguage"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.receiverLanguage);
            return writer;
        };

        /**
         * Encodes the specified GreetResponse message, length delimited. Does not implicitly {@link nats_study.GreetResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof nats_study.GreetResponse
         * @static
         * @param {nats_study.IGreetResponse} message GreetResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GreetResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GreetResponse message from the specified reader or buffer.
         * @function decode
         * @memberof nats_study.GreetResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {nats_study.GreetResponse} GreetResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GreetResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.nats_study.GreetResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.responseText = reader.string();
                        break;
                    }
                case 2: {
                        message.receiverLanguage = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GreetResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof nats_study.GreetResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {nats_study.GreetResponse} GreetResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GreetResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GreetResponse message.
         * @function verify
         * @memberof nats_study.GreetResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GreetResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.responseText != null && message.hasOwnProperty("responseText"))
                if (!$util.isString(message.responseText))
                    return "responseText: string expected";
            if (message.receiverLanguage != null && message.hasOwnProperty("receiverLanguage"))
                if (!$util.isString(message.receiverLanguage))
                    return "receiverLanguage: string expected";
            return null;
        };

        /**
         * Creates a GreetResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof nats_study.GreetResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {nats_study.GreetResponse} GreetResponse
         */
        GreetResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.nats_study.GreetResponse)
                return object;
            var message = new $root.nats_study.GreetResponse();
            if (object.responseText != null)
                message.responseText = String(object.responseText);
            if (object.receiverLanguage != null)
                message.receiverLanguage = String(object.receiverLanguage);
            return message;
        };

        /**
         * Creates a plain object from a GreetResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof nats_study.GreetResponse
         * @static
         * @param {nats_study.GreetResponse} message GreetResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GreetResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.responseText = "";
                object.receiverLanguage = "";
            }
            if (message.responseText != null && message.hasOwnProperty("responseText"))
                object.responseText = message.responseText;
            if (message.receiverLanguage != null && message.hasOwnProperty("receiverLanguage"))
                object.receiverLanguage = message.receiverLanguage;
            return object;
        };

        /**
         * Converts this GreetResponse to JSON.
         * @function toJSON
         * @memberof nats_study.GreetResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GreetResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GreetResponse
         * @function getTypeUrl
         * @memberof nats_study.GreetResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GreetResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/nats_study.GreetResponse";
        };

        return GreetResponse;
    })();

    return nats_study;
})();

module.exports = $root;
