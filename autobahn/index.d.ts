// Type definitions for AutobahnJS v0.11.2
// Project: http://autobahn.ws/js/
// Definitions by: Elad Zelingher <https://github.com/darkl/>, Andy Hawkins <https://github.com/a904guy/,http://a904guy.com/,http://www.bmbsqd.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="when" />

export = autobahn;

declare namespace autobahn {

    export class Session {
        /**
         * Returns the session ID as an integer. A read-only property.
         * @since 0.9.2
         */
        id: number;
        /**
         * Returns the realm the session is attached to as a string. A read-only property.
         * @since 0.9.2
         */
        realm: string;
        /**
         * Returns true if the session is open and attached to a realm. A read-only property.
         * @since 0.9.1
         */
        isOpen: boolean;
        /**
         * Returns an object with the roles the client implements and the available advanced features for each role.
         * A read-only property.
         * @since 0.9.1
         */
        features: any;
        /**
         * Returns true if the value has been changed for the session from the default false.
         * @since 0.9.7
         */
        caller_disclose_me: boolean;
        /**
         * Returns true if the value has been changed for the session from the default false.
         * @since 0.9.7
         */
        publisher_disclose_me: boolean;
        /**
         * Returns an array with the subscription objects for all currently active subscriptions. A read-only property.
         * @since 0.9.1
         */
        subscriptions: ISubscription[][];
        /**
         * Returns an array with the registration objects for all currently active registrations. A read-only property.
         * @since 0.9.1
         */
        registrations: IRegistration[];

        constructor(transport: ITransport, defer: DeferFactory, challenge: OnChallengeHandler);

        join(realm: string, authmethods: string[], authid: string): void;

        leave(reason: string, message: string): void;

        call<TResult>(procedure: string, args?: any[], kwargs?: any, options?: ICallOptions): When.Promise<TResult>;

        publish(topic: string, args?: any[], kwargs?: any, options?: IPublishOptions): When.Promise<IPublication>;

        subscribe(topic: string, handler: SubscribeHandler, options?: ISubscribeOptions): When.Promise<ISubscription>;

        register(procedure: string, endpoint: RegisterEndpoint, options?: IRegisterOptions): When.Promise<IRegistration>;

        unsubscribe(subscription: ISubscription): When.Promise<any>;

        unregister(registration: IRegistration): When.Promise<any>;

        prefix(prefix: string, uri: string): void;

        resolve(curie: string): string;
        /**
         * Method for convenient logging from sessions.
         */
        log(message?: any, ...optionalParams: any[]): void;

        onjoin: (roleFeatures: any) => void;
        onleave: (reason: string, details: any) => void;
    }

    interface IInvocation {
        caller?: number;
        progress?: (args : any[], kwargs : any) => void;
        procedure: string;
    }

    class Invocation implements IInvocation {
        constructor(caller?: number, progress?: boolean, procedure?: string);

        procedure: string;
    }

    interface IEvent {
        publication: number;
        publisher?: number;
        topic: string;
    }

    class Event implements IEvent {
        constructor(publication?: number, publisher?: string, topic?: string);

        publication: number;
        topic: string;
    }

    interface IResult {
        args: any[];
        kwargs: any;
    }

    class Result implements IResult {
        constructor(args?: any[], kwargs?: any);

        args: any[];
        kwargs: any;
    }

    interface IError {
        error: string;
        args: any[];
        kwargs: any;
    }

    class Error implements IError {
        constructor(error?: string, args?: any[], kwargs?: any);

        error: string;
        args: any[];
        kwargs: any;
    }

    type SubscribeHandler = (args?: any[], kwargs?: any, details?: IEvent) => void;

    interface ISubscription {
        topic: string;
        handler: SubscribeHandler;
        options: ISubscribeOptions;
        session: Session;
        id: number;
        active: boolean;
        unsubscribe(): When.Promise<any>;
    }

    class Subscription implements ISubscription {
        constructor(topic? : string, handler?: SubscribeHandler, options?: ISubscribeOptions, session?: Session, id?: number);

        handler: SubscribeHandler;

        unsubscribe(): When.Promise<any>;

        topic: string;
        options: ISubscribeOptions;
        session: Session;
        id: number;
        active: boolean;
    }

    type RegisterEndpoint = (args?: any[], kwargs?: any, details?: IInvocation) => void;

    interface IRegistration {
        procedure: string;
        endpoint: RegisterEndpoint;
        options: IRegisterOptions;
        session: Session;
        id: number;
        active: boolean;
        unregister(): When.Promise<any>;
    }

    class Registration implements IRegistration {
        constructor(procedure?: string, endpoint?: RegisterEndpoint, options?: IRegisterOptions, session?: Session, id?: number);

        endpoint: RegisterEndpoint;

        unregister(): When.Promise<any>;

        procedure: string;
        options: IRegisterOptions;
        session: Session;
        id: number;
        active: boolean;
    }

    interface IPublication {
        id: number;
    }

    class Publication implements IPublication {
        constructor(id: number);

        id: number;
    }

    interface ICallOptions {
        timeout?: number;
        receive_progress?: boolean;
        disclose_me?: boolean;
    }

    interface IPublishOptions {
        acknowledge?: boolean;
        exclude?: number[];
        eligible?: number[];
        disclose_me?: Boolean;
    }

    interface ISubscribeOptions {
        match?: string;
    }

    interface IRegisterOptions {
        disclose_caller?: boolean;
    }

    export class Connection {
        /**
         * Returns an instance of autobahn.Session if there is a session currently running on the connection.
         * A read-only property.
         */
        session: Session;
        /**
         * Returns true if the Connection is open. A read-only property.
         * @since 0.9.2
         */
        isConnected: boolean;
        /**
         * Returns true if the underlying session is open. A read-only property.
         */
        isOpen: boolean;
        /**
         * Returns true if reconnects are being attempted. A read-only property.
         * @since 0.9.2
         */
        isRetrying: boolean;
        /**
         * Holds a transport instance when connected. A read-only property.
         * @since 0.9.5
         */
        // TODO: check type
        transport: ITransportDefinition;

        /**
         * Create a new connection, but does not open.
         */
        constructor(options?: IConnectionOptions);

        /**
         * To open a created connection. If connection already open or opening an exception will be thrown.
         */
        open(): void;

        /**
         * To close a connection. If connection already close an exception will be thrown.
         * @param reason - optional WAMP URI providing a closing reason, e.g. com.myapp.close.signout to
         * the server-side. If no reason is given, the default URI wamp.goodbye.normal is sent.
         * @param message – optional (human readable) closing message.
         */
        close(reason?: string, message?: string): void;

        /**
         * Is fired when the connection has been established and a new session was created.
         */
        onopen: (session: Session, details: any) => void;
        /**
         * Is fired when the connection has been closed explicitly, was lost or
         * could not be established in the first place.
         * @return If true subsequent next retry attempt will be canceled.
         */
        onclose: (reason: string, details: any) => boolean;
    }

    interface ITransportDefinition {
        /**
         * The URL the transport is connected to.
         */
        url?: string;
        /**
         * The WAMP protocol in use, e.g. wamp.2.json.
         */
        protocols?: string[];
        /**
         * Type of transport: websocket or longpoll.
         */
        type: string;
    }

    type DeferFactory = () => When.Promise<any>;

    type OnChallengeHandler = (session: Session, method: string, extra: any) => When.Promise<string>;

    interface IConnectionOptions {
        use_es6_promises?: boolean;
        // use explicit deferred factory, e.g. jQuery.Deferred or Q.defer
        use_deferred?: DeferFactory;
        transports?: ITransportDefinition[];
        retry_if_unreachable?: boolean;
        max_retries?: number;
        initial_retry_delay?: number;
        max_retry_delay?: number;
        retry_delay_growth?: number;
        retry_delay_jitter?: number;
        url?: string;
        protocols?: string[];
        onchallenge?: OnChallengeHandler;
        /**
         * The WAMP realm to join. Required options.
         */
        realm: string;
        authmethods?: string[];
        authid?: string;
    }

    interface ICloseEventDetails {
        wasClean: boolean;
        reason: string;
        code: number;
    }

    interface ITransport {
        onopen: () => void;
        onmessage: (message: any[]) => void;
        onclose: (details: ICloseEventDetails) => void;

        send(message: any[]): void;
        close(errorCode: number, reason?: string): void;
    }

    interface ITransportFactory {
        // constructor(options: any);
        type: string;
        create(): ITransport;
    }

    interface ITransports {
        register(name: string, factory: any): void;
        isRegistered(name: string): boolean;
        get(name: string): any;
        list(): string[];
    }

    interface ILog {
        debug(...args: any[]): void;
    }

    interface IUtil {
        assert(condition: boolean, message: string): void;
    }

    interface IAuthCra {
        derive_key(secret: string, salt: string, iterations: number, keylen: number): string;
        sign(key: string, challenge: string): string;
    }

    var util: IUtil;
    var log: ILog;
    var transports: ITransports;
    var auth_cra: IAuthCra;
}
