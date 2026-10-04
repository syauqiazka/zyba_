
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model DailyMessageQuota
 * 
 */
export type DailyMessageQuota = $Result.DefaultSelection<Prisma.$DailyMessageQuotaPayload>
/**
 * Model RateLimitBucket
 * 
 */
export type RateLimitBucket = $Result.DefaultSelection<Prisma.$RateLimitBucketPayload>
/**
 * Model PremiumInsightCache
 * 
 */
export type PremiumInsightCache = $Result.DefaultSelection<Prisma.$PremiumInsightCachePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Conversations
 * const conversations = await prisma.conversation.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Conversations
   * const conversations = await prisma.conversation.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs>;

  /**
   * `prisma.dailyMessageQuota`: Exposes CRUD operations for the **DailyMessageQuota** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyMessageQuotas
    * const dailyMessageQuotas = await prisma.dailyMessageQuota.findMany()
    * ```
    */
  get dailyMessageQuota(): Prisma.DailyMessageQuotaDelegate<ExtArgs>;

  /**
   * `prisma.rateLimitBucket`: Exposes CRUD operations for the **RateLimitBucket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RateLimitBuckets
    * const rateLimitBuckets = await prisma.rateLimitBucket.findMany()
    * ```
    */
  get rateLimitBucket(): Prisma.RateLimitBucketDelegate<ExtArgs>;

  /**
   * `prisma.premiumInsightCache`: Exposes CRUD operations for the **PremiumInsightCache** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PremiumInsightCaches
    * const premiumInsightCaches = await prisma.premiumInsightCache.findMany()
    * ```
    */
  get premiumInsightCache(): Prisma.PremiumInsightCacheDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Conversation: 'Conversation',
    Message: 'Message',
    DailyMessageQuota: 'DailyMessageQuota',
    RateLimitBucket: 'RateLimitBucket',
    PremiumInsightCache: 'PremiumInsightCache'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "conversation" | "message" | "dailyMessageQuota" | "rateLimitBucket" | "premiumInsightCache"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      DailyMessageQuota: {
        payload: Prisma.$DailyMessageQuotaPayload<ExtArgs>
        fields: Prisma.DailyMessageQuotaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyMessageQuotaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyMessageQuotaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>
          }
          findFirst: {
            args: Prisma.DailyMessageQuotaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyMessageQuotaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>
          }
          findMany: {
            args: Prisma.DailyMessageQuotaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>[]
          }
          create: {
            args: Prisma.DailyMessageQuotaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>
          }
          createMany: {
            args: Prisma.DailyMessageQuotaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyMessageQuotaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>[]
          }
          delete: {
            args: Prisma.DailyMessageQuotaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>
          }
          update: {
            args: Prisma.DailyMessageQuotaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>
          }
          deleteMany: {
            args: Prisma.DailyMessageQuotaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyMessageQuotaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DailyMessageQuotaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyMessageQuotaPayload>
          }
          aggregate: {
            args: Prisma.DailyMessageQuotaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyMessageQuota>
          }
          groupBy: {
            args: Prisma.DailyMessageQuotaGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyMessageQuotaGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyMessageQuotaCountArgs<ExtArgs>
            result: $Utils.Optional<DailyMessageQuotaCountAggregateOutputType> | number
          }
        }
      }
      RateLimitBucket: {
        payload: Prisma.$RateLimitBucketPayload<ExtArgs>
        fields: Prisma.RateLimitBucketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RateLimitBucketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RateLimitBucketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>
          }
          findFirst: {
            args: Prisma.RateLimitBucketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RateLimitBucketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>
          }
          findMany: {
            args: Prisma.RateLimitBucketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>[]
          }
          create: {
            args: Prisma.RateLimitBucketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>
          }
          createMany: {
            args: Prisma.RateLimitBucketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RateLimitBucketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>[]
          }
          delete: {
            args: Prisma.RateLimitBucketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>
          }
          update: {
            args: Prisma.RateLimitBucketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>
          }
          deleteMany: {
            args: Prisma.RateLimitBucketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RateLimitBucketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RateLimitBucketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>
          }
          aggregate: {
            args: Prisma.RateLimitBucketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRateLimitBucket>
          }
          groupBy: {
            args: Prisma.RateLimitBucketGroupByArgs<ExtArgs>
            result: $Utils.Optional<RateLimitBucketGroupByOutputType>[]
          }
          count: {
            args: Prisma.RateLimitBucketCountArgs<ExtArgs>
            result: $Utils.Optional<RateLimitBucketCountAggregateOutputType> | number
          }
        }
      }
      PremiumInsightCache: {
        payload: Prisma.$PremiumInsightCachePayload<ExtArgs>
        fields: Prisma.PremiumInsightCacheFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PremiumInsightCacheFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PremiumInsightCacheFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>
          }
          findFirst: {
            args: Prisma.PremiumInsightCacheFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PremiumInsightCacheFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>
          }
          findMany: {
            args: Prisma.PremiumInsightCacheFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>[]
          }
          create: {
            args: Prisma.PremiumInsightCacheCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>
          }
          createMany: {
            args: Prisma.PremiumInsightCacheCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PremiumInsightCacheCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>[]
          }
          delete: {
            args: Prisma.PremiumInsightCacheDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>
          }
          update: {
            args: Prisma.PremiumInsightCacheUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>
          }
          deleteMany: {
            args: Prisma.PremiumInsightCacheDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PremiumInsightCacheUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PremiumInsightCacheUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PremiumInsightCachePayload>
          }
          aggregate: {
            args: Prisma.PremiumInsightCacheAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePremiumInsightCache>
          }
          groupBy: {
            args: Prisma.PremiumInsightCacheGroupByArgs<ExtArgs>
            result: $Utils.Optional<PremiumInsightCacheGroupByOutputType>[]
          }
          count: {
            args: Prisma.PremiumInsightCacheCountArgs<ExtArgs>
            result: $Utils.Optional<PremiumInsightCacheCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ConversationCountOutputType
   */

  export type ConversationCountOutputType = {
    messages: number
  }

  export type ConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationCountOutputType
     */
    select?: ConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    emotionTag: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    emotionTag: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    emotionTag: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConversationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    emotionTag?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    emotionTag?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    emotionTag?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    userId: string
    title: string
    emotionTag: string | null
    createdAt: Date
    updatedAt: Date
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    emotionTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    emotionTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    emotionTag?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      emotionTag: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conversations and returns the data saved in the database.
     * @param {ConversationCreateManyAndReturnArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends Conversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Conversation model
   */ 
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly userId: FieldRef<"Conversation", 'String'>
    readonly title: FieldRef<"Conversation", 'String'>
    readonly emotionTag: FieldRef<"Conversation", 'String'>
    readonly createdAt: FieldRef<"Conversation", 'DateTime'>
    readonly updatedAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation createManyAndReturn
   */
  export type ConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
  }

  /**
   * Conversation.messages
   */
  export type Conversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageAvgAggregateOutputType = {
    audioDurationSec: number | null
  }

  export type MessageSumAggregateOutputType = {
    audioDurationSec: number | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    content: string | null
    modelUsed: string | null
    attachmentType: string | null
    attachmentUrl: string | null
    audioDurationSec: number | null
    stickerId: string | null
    flaggedForRisk: boolean | null
    ttsAudioUrl: string | null
    ttsProvider: string | null
    ttsModel: string | null
    ttsGeneratedAt: Date | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: string | null
    content: string | null
    modelUsed: string | null
    attachmentType: string | null
    attachmentUrl: string | null
    audioDurationSec: number | null
    stickerId: string | null
    flaggedForRisk: boolean | null
    ttsAudioUrl: string | null
    ttsProvider: string | null
    ttsModel: string | null
    ttsGeneratedAt: Date | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    content: number
    modelUsed: number
    attachmentType: number
    attachmentUrl: number
    audioDurationSec: number
    stickerId: number
    flaggedForRisk: number
    ttsAudioUrl: number
    ttsProvider: number
    ttsModel: number
    ttsGeneratedAt: number
    createdAt: number
    _all: number
  }


  export type MessageAvgAggregateInputType = {
    audioDurationSec?: true
  }

  export type MessageSumAggregateInputType = {
    audioDurationSec?: true
  }

  export type MessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    modelUsed?: true
    attachmentType?: true
    attachmentUrl?: true
    audioDurationSec?: true
    stickerId?: true
    flaggedForRisk?: true
    ttsAudioUrl?: true
    ttsProvider?: true
    ttsModel?: true
    ttsGeneratedAt?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    modelUsed?: true
    attachmentType?: true
    attachmentUrl?: true
    audioDurationSec?: true
    stickerId?: true
    flaggedForRisk?: true
    ttsAudioUrl?: true
    ttsProvider?: true
    ttsModel?: true
    ttsGeneratedAt?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    modelUsed?: true
    attachmentType?: true
    attachmentUrl?: true
    audioDurationSec?: true
    stickerId?: true
    flaggedForRisk?: true
    ttsAudioUrl?: true
    ttsProvider?: true
    ttsModel?: true
    ttsGeneratedAt?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _avg?: MessageAvgAggregateInputType
    _sum?: MessageSumAggregateInputType
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    conversationId: string
    role: string
    content: string | null
    modelUsed: string | null
    attachmentType: string | null
    attachmentUrl: string | null
    audioDurationSec: number | null
    stickerId: string | null
    flaggedForRisk: boolean
    ttsAudioUrl: string | null
    ttsProvider: string | null
    ttsModel: string | null
    ttsGeneratedAt: Date | null
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    modelUsed?: boolean
    attachmentType?: boolean
    attachmentUrl?: boolean
    audioDurationSec?: boolean
    stickerId?: boolean
    flaggedForRisk?: boolean
    ttsAudioUrl?: boolean
    ttsProvider?: boolean
    ttsModel?: boolean
    ttsGeneratedAt?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    modelUsed?: boolean
    attachmentType?: boolean
    attachmentUrl?: boolean
    audioDurationSec?: boolean
    stickerId?: boolean
    flaggedForRisk?: boolean
    ttsAudioUrl?: boolean
    ttsProvider?: boolean
    ttsModel?: boolean
    ttsGeneratedAt?: boolean
    createdAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    modelUsed?: boolean
    attachmentType?: boolean
    attachmentUrl?: boolean
    audioDurationSec?: boolean
    stickerId?: boolean
    flaggedForRisk?: boolean
    ttsAudioUrl?: boolean
    ttsProvider?: boolean
    ttsModel?: boolean
    ttsGeneratedAt?: boolean
    createdAt?: boolean
  }

  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      conversation: Prisma.$ConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: string
      content: string | null
      modelUsed: string | null
      attachmentType: string | null
      attachmentUrl: string | null
      audioDurationSec: number | null
      stickerId: string | null
      flaggedForRisk: boolean
      ttsAudioUrl: string | null
      ttsProvider: string | null
      ttsModel: string | null
      ttsGeneratedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationDefaultArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */ 
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly conversationId: FieldRef<"Message", 'String'>
    readonly role: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly modelUsed: FieldRef<"Message", 'String'>
    readonly attachmentType: FieldRef<"Message", 'String'>
    readonly attachmentUrl: FieldRef<"Message", 'String'>
    readonly audioDurationSec: FieldRef<"Message", 'Int'>
    readonly stickerId: FieldRef<"Message", 'String'>
    readonly flaggedForRisk: FieldRef<"Message", 'Boolean'>
    readonly ttsAudioUrl: FieldRef<"Message", 'String'>
    readonly ttsProvider: FieldRef<"Message", 'String'>
    readonly ttsModel: FieldRef<"Message", 'String'>
    readonly ttsGeneratedAt: FieldRef<"Message", 'DateTime'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model DailyMessageQuota
   */

  export type AggregateDailyMessageQuota = {
    _count: DailyMessageQuotaCountAggregateOutputType | null
    _avg: DailyMessageQuotaAvgAggregateOutputType | null
    _sum: DailyMessageQuotaSumAggregateOutputType | null
    _min: DailyMessageQuotaMinAggregateOutputType | null
    _max: DailyMessageQuotaMaxAggregateOutputType | null
  }

  export type DailyMessageQuotaAvgAggregateOutputType = {
    messageCount: number | null
  }

  export type DailyMessageQuotaSumAggregateOutputType = {
    messageCount: number | null
  }

  export type DailyMessageQuotaMinAggregateOutputType = {
    id: string | null
    userId: string | null
    date: string | null
    messageCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailyMessageQuotaMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    date: string | null
    messageCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DailyMessageQuotaCountAggregateOutputType = {
    id: number
    userId: number
    date: number
    messageCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DailyMessageQuotaAvgAggregateInputType = {
    messageCount?: true
  }

  export type DailyMessageQuotaSumAggregateInputType = {
    messageCount?: true
  }

  export type DailyMessageQuotaMinAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    messageCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailyMessageQuotaMaxAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    messageCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DailyMessageQuotaCountAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    messageCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DailyMessageQuotaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyMessageQuota to aggregate.
     */
    where?: DailyMessageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyMessageQuotas to fetch.
     */
    orderBy?: DailyMessageQuotaOrderByWithRelationInput | DailyMessageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyMessageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyMessageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyMessageQuotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyMessageQuotas
    **/
    _count?: true | DailyMessageQuotaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyMessageQuotaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyMessageQuotaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyMessageQuotaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyMessageQuotaMaxAggregateInputType
  }

  export type GetDailyMessageQuotaAggregateType<T extends DailyMessageQuotaAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyMessageQuota]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyMessageQuota[P]>
      : GetScalarType<T[P], AggregateDailyMessageQuota[P]>
  }




  export type DailyMessageQuotaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyMessageQuotaWhereInput
    orderBy?: DailyMessageQuotaOrderByWithAggregationInput | DailyMessageQuotaOrderByWithAggregationInput[]
    by: DailyMessageQuotaScalarFieldEnum[] | DailyMessageQuotaScalarFieldEnum
    having?: DailyMessageQuotaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyMessageQuotaCountAggregateInputType | true
    _avg?: DailyMessageQuotaAvgAggregateInputType
    _sum?: DailyMessageQuotaSumAggregateInputType
    _min?: DailyMessageQuotaMinAggregateInputType
    _max?: DailyMessageQuotaMaxAggregateInputType
  }

  export type DailyMessageQuotaGroupByOutputType = {
    id: string
    userId: string
    date: string
    messageCount: number
    createdAt: Date
    updatedAt: Date
    _count: DailyMessageQuotaCountAggregateOutputType | null
    _avg: DailyMessageQuotaAvgAggregateOutputType | null
    _sum: DailyMessageQuotaSumAggregateOutputType | null
    _min: DailyMessageQuotaMinAggregateOutputType | null
    _max: DailyMessageQuotaMaxAggregateOutputType | null
  }

  type GetDailyMessageQuotaGroupByPayload<T extends DailyMessageQuotaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyMessageQuotaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyMessageQuotaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyMessageQuotaGroupByOutputType[P]>
            : GetScalarType<T[P], DailyMessageQuotaGroupByOutputType[P]>
        }
      >
    >


  export type DailyMessageQuotaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    messageCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailyMessageQuota"]>

  export type DailyMessageQuotaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    messageCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dailyMessageQuota"]>

  export type DailyMessageQuotaSelectScalar = {
    id?: boolean
    userId?: boolean
    date?: boolean
    messageCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DailyMessageQuotaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyMessageQuota"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      date: string
      messageCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dailyMessageQuota"]>
    composites: {}
  }

  type DailyMessageQuotaGetPayload<S extends boolean | null | undefined | DailyMessageQuotaDefaultArgs> = $Result.GetResult<Prisma.$DailyMessageQuotaPayload, S>

  type DailyMessageQuotaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DailyMessageQuotaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DailyMessageQuotaCountAggregateInputType | true
    }

  export interface DailyMessageQuotaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyMessageQuota'], meta: { name: 'DailyMessageQuota' } }
    /**
     * Find zero or one DailyMessageQuota that matches the filter.
     * @param {DailyMessageQuotaFindUniqueArgs} args - Arguments to find a DailyMessageQuota
     * @example
     * // Get one DailyMessageQuota
     * const dailyMessageQuota = await prisma.dailyMessageQuota.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyMessageQuotaFindUniqueArgs>(args: SelectSubset<T, DailyMessageQuotaFindUniqueArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DailyMessageQuota that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DailyMessageQuotaFindUniqueOrThrowArgs} args - Arguments to find a DailyMessageQuota
     * @example
     * // Get one DailyMessageQuota
     * const dailyMessageQuota = await prisma.dailyMessageQuota.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyMessageQuotaFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyMessageQuotaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DailyMessageQuota that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaFindFirstArgs} args - Arguments to find a DailyMessageQuota
     * @example
     * // Get one DailyMessageQuota
     * const dailyMessageQuota = await prisma.dailyMessageQuota.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyMessageQuotaFindFirstArgs>(args?: SelectSubset<T, DailyMessageQuotaFindFirstArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DailyMessageQuota that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaFindFirstOrThrowArgs} args - Arguments to find a DailyMessageQuota
     * @example
     * // Get one DailyMessageQuota
     * const dailyMessageQuota = await prisma.dailyMessageQuota.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyMessageQuotaFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyMessageQuotaFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DailyMessageQuotas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyMessageQuotas
     * const dailyMessageQuotas = await prisma.dailyMessageQuota.findMany()
     * 
     * // Get first 10 DailyMessageQuotas
     * const dailyMessageQuotas = await prisma.dailyMessageQuota.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyMessageQuotaWithIdOnly = await prisma.dailyMessageQuota.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyMessageQuotaFindManyArgs>(args?: SelectSubset<T, DailyMessageQuotaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DailyMessageQuota.
     * @param {DailyMessageQuotaCreateArgs} args - Arguments to create a DailyMessageQuota.
     * @example
     * // Create one DailyMessageQuota
     * const DailyMessageQuota = await prisma.dailyMessageQuota.create({
     *   data: {
     *     // ... data to create a DailyMessageQuota
     *   }
     * })
     * 
     */
    create<T extends DailyMessageQuotaCreateArgs>(args: SelectSubset<T, DailyMessageQuotaCreateArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DailyMessageQuotas.
     * @param {DailyMessageQuotaCreateManyArgs} args - Arguments to create many DailyMessageQuotas.
     * @example
     * // Create many DailyMessageQuotas
     * const dailyMessageQuota = await prisma.dailyMessageQuota.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyMessageQuotaCreateManyArgs>(args?: SelectSubset<T, DailyMessageQuotaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyMessageQuotas and returns the data saved in the database.
     * @param {DailyMessageQuotaCreateManyAndReturnArgs} args - Arguments to create many DailyMessageQuotas.
     * @example
     * // Create many DailyMessageQuotas
     * const dailyMessageQuota = await prisma.dailyMessageQuota.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyMessageQuotas and only return the `id`
     * const dailyMessageQuotaWithIdOnly = await prisma.dailyMessageQuota.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyMessageQuotaCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyMessageQuotaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DailyMessageQuota.
     * @param {DailyMessageQuotaDeleteArgs} args - Arguments to delete one DailyMessageQuota.
     * @example
     * // Delete one DailyMessageQuota
     * const DailyMessageQuota = await prisma.dailyMessageQuota.delete({
     *   where: {
     *     // ... filter to delete one DailyMessageQuota
     *   }
     * })
     * 
     */
    delete<T extends DailyMessageQuotaDeleteArgs>(args: SelectSubset<T, DailyMessageQuotaDeleteArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DailyMessageQuota.
     * @param {DailyMessageQuotaUpdateArgs} args - Arguments to update one DailyMessageQuota.
     * @example
     * // Update one DailyMessageQuota
     * const dailyMessageQuota = await prisma.dailyMessageQuota.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyMessageQuotaUpdateArgs>(args: SelectSubset<T, DailyMessageQuotaUpdateArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DailyMessageQuotas.
     * @param {DailyMessageQuotaDeleteManyArgs} args - Arguments to filter DailyMessageQuotas to delete.
     * @example
     * // Delete a few DailyMessageQuotas
     * const { count } = await prisma.dailyMessageQuota.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyMessageQuotaDeleteManyArgs>(args?: SelectSubset<T, DailyMessageQuotaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyMessageQuotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyMessageQuotas
     * const dailyMessageQuota = await prisma.dailyMessageQuota.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyMessageQuotaUpdateManyArgs>(args: SelectSubset<T, DailyMessageQuotaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DailyMessageQuota.
     * @param {DailyMessageQuotaUpsertArgs} args - Arguments to update or create a DailyMessageQuota.
     * @example
     * // Update or create a DailyMessageQuota
     * const dailyMessageQuota = await prisma.dailyMessageQuota.upsert({
     *   create: {
     *     // ... data to create a DailyMessageQuota
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyMessageQuota we want to update
     *   }
     * })
     */
    upsert<T extends DailyMessageQuotaUpsertArgs>(args: SelectSubset<T, DailyMessageQuotaUpsertArgs<ExtArgs>>): Prisma__DailyMessageQuotaClient<$Result.GetResult<Prisma.$DailyMessageQuotaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DailyMessageQuotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaCountArgs} args - Arguments to filter DailyMessageQuotas to count.
     * @example
     * // Count the number of DailyMessageQuotas
     * const count = await prisma.dailyMessageQuota.count({
     *   where: {
     *     // ... the filter for the DailyMessageQuotas we want to count
     *   }
     * })
    **/
    count<T extends DailyMessageQuotaCountArgs>(
      args?: Subset<T, DailyMessageQuotaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyMessageQuotaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyMessageQuota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyMessageQuotaAggregateArgs>(args: Subset<T, DailyMessageQuotaAggregateArgs>): Prisma.PrismaPromise<GetDailyMessageQuotaAggregateType<T>>

    /**
     * Group by DailyMessageQuota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyMessageQuotaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyMessageQuotaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyMessageQuotaGroupByArgs['orderBy'] }
        : { orderBy?: DailyMessageQuotaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyMessageQuotaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyMessageQuotaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyMessageQuota model
   */
  readonly fields: DailyMessageQuotaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyMessageQuota.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyMessageQuotaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyMessageQuota model
   */ 
  interface DailyMessageQuotaFieldRefs {
    readonly id: FieldRef<"DailyMessageQuota", 'String'>
    readonly userId: FieldRef<"DailyMessageQuota", 'String'>
    readonly date: FieldRef<"DailyMessageQuota", 'String'>
    readonly messageCount: FieldRef<"DailyMessageQuota", 'Int'>
    readonly createdAt: FieldRef<"DailyMessageQuota", 'DateTime'>
    readonly updatedAt: FieldRef<"DailyMessageQuota", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyMessageQuota findUnique
   */
  export type DailyMessageQuotaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which DailyMessageQuota to fetch.
     */
    where: DailyMessageQuotaWhereUniqueInput
  }

  /**
   * DailyMessageQuota findUniqueOrThrow
   */
  export type DailyMessageQuotaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which DailyMessageQuota to fetch.
     */
    where: DailyMessageQuotaWhereUniqueInput
  }

  /**
   * DailyMessageQuota findFirst
   */
  export type DailyMessageQuotaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which DailyMessageQuota to fetch.
     */
    where?: DailyMessageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyMessageQuotas to fetch.
     */
    orderBy?: DailyMessageQuotaOrderByWithRelationInput | DailyMessageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyMessageQuotas.
     */
    cursor?: DailyMessageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyMessageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyMessageQuotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyMessageQuotas.
     */
    distinct?: DailyMessageQuotaScalarFieldEnum | DailyMessageQuotaScalarFieldEnum[]
  }

  /**
   * DailyMessageQuota findFirstOrThrow
   */
  export type DailyMessageQuotaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which DailyMessageQuota to fetch.
     */
    where?: DailyMessageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyMessageQuotas to fetch.
     */
    orderBy?: DailyMessageQuotaOrderByWithRelationInput | DailyMessageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyMessageQuotas.
     */
    cursor?: DailyMessageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyMessageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyMessageQuotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyMessageQuotas.
     */
    distinct?: DailyMessageQuotaScalarFieldEnum | DailyMessageQuotaScalarFieldEnum[]
  }

  /**
   * DailyMessageQuota findMany
   */
  export type DailyMessageQuotaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which DailyMessageQuotas to fetch.
     */
    where?: DailyMessageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyMessageQuotas to fetch.
     */
    orderBy?: DailyMessageQuotaOrderByWithRelationInput | DailyMessageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyMessageQuotas.
     */
    cursor?: DailyMessageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyMessageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyMessageQuotas.
     */
    skip?: number
    distinct?: DailyMessageQuotaScalarFieldEnum | DailyMessageQuotaScalarFieldEnum[]
  }

  /**
   * DailyMessageQuota create
   */
  export type DailyMessageQuotaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * The data needed to create a DailyMessageQuota.
     */
    data: XOR<DailyMessageQuotaCreateInput, DailyMessageQuotaUncheckedCreateInput>
  }

  /**
   * DailyMessageQuota createMany
   */
  export type DailyMessageQuotaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyMessageQuotas.
     */
    data: DailyMessageQuotaCreateManyInput | DailyMessageQuotaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyMessageQuota createManyAndReturn
   */
  export type DailyMessageQuotaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DailyMessageQuotas.
     */
    data: DailyMessageQuotaCreateManyInput | DailyMessageQuotaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyMessageQuota update
   */
  export type DailyMessageQuotaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * The data needed to update a DailyMessageQuota.
     */
    data: XOR<DailyMessageQuotaUpdateInput, DailyMessageQuotaUncheckedUpdateInput>
    /**
     * Choose, which DailyMessageQuota to update.
     */
    where: DailyMessageQuotaWhereUniqueInput
  }

  /**
   * DailyMessageQuota updateMany
   */
  export type DailyMessageQuotaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyMessageQuotas.
     */
    data: XOR<DailyMessageQuotaUpdateManyMutationInput, DailyMessageQuotaUncheckedUpdateManyInput>
    /**
     * Filter which DailyMessageQuotas to update
     */
    where?: DailyMessageQuotaWhereInput
  }

  /**
   * DailyMessageQuota upsert
   */
  export type DailyMessageQuotaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * The filter to search for the DailyMessageQuota to update in case it exists.
     */
    where: DailyMessageQuotaWhereUniqueInput
    /**
     * In case the DailyMessageQuota found by the `where` argument doesn't exist, create a new DailyMessageQuota with this data.
     */
    create: XOR<DailyMessageQuotaCreateInput, DailyMessageQuotaUncheckedCreateInput>
    /**
     * In case the DailyMessageQuota was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyMessageQuotaUpdateInput, DailyMessageQuotaUncheckedUpdateInput>
  }

  /**
   * DailyMessageQuota delete
   */
  export type DailyMessageQuotaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
    /**
     * Filter which DailyMessageQuota to delete.
     */
    where: DailyMessageQuotaWhereUniqueInput
  }

  /**
   * DailyMessageQuota deleteMany
   */
  export type DailyMessageQuotaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyMessageQuotas to delete
     */
    where?: DailyMessageQuotaWhereInput
  }

  /**
   * DailyMessageQuota without action
   */
  export type DailyMessageQuotaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyMessageQuota
     */
    select?: DailyMessageQuotaSelect<ExtArgs> | null
  }


  /**
   * Model RateLimitBucket
   */

  export type AggregateRateLimitBucket = {
    _count: RateLimitBucketCountAggregateOutputType | null
    _avg: RateLimitBucketAvgAggregateOutputType | null
    _sum: RateLimitBucketSumAggregateOutputType | null
    _min: RateLimitBucketMinAggregateOutputType | null
    _max: RateLimitBucketMaxAggregateOutputType | null
  }

  export type RateLimitBucketAvgAggregateOutputType = {
    windowMs: number | null
    hitCount: number | null
  }

  export type RateLimitBucketSumAggregateOutputType = {
    windowMs: number | null
    hitCount: number | null
  }

  export type RateLimitBucketMinAggregateOutputType = {
    id: string | null
    key: string | null
    windowStart: Date | null
    windowMs: number | null
    hitCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RateLimitBucketMaxAggregateOutputType = {
    id: string | null
    key: string | null
    windowStart: Date | null
    windowMs: number | null
    hitCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RateLimitBucketCountAggregateOutputType = {
    id: number
    key: number
    windowStart: number
    windowMs: number
    hitCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RateLimitBucketAvgAggregateInputType = {
    windowMs?: true
    hitCount?: true
  }

  export type RateLimitBucketSumAggregateInputType = {
    windowMs?: true
    hitCount?: true
  }

  export type RateLimitBucketMinAggregateInputType = {
    id?: true
    key?: true
    windowStart?: true
    windowMs?: true
    hitCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RateLimitBucketMaxAggregateInputType = {
    id?: true
    key?: true
    windowStart?: true
    windowMs?: true
    hitCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RateLimitBucketCountAggregateInputType = {
    id?: true
    key?: true
    windowStart?: true
    windowMs?: true
    hitCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RateLimitBucketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RateLimitBucket to aggregate.
     */
    where?: RateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateLimitBuckets to fetch.
     */
    orderBy?: RateLimitBucketOrderByWithRelationInput | RateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateLimitBuckets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RateLimitBuckets
    **/
    _count?: true | RateLimitBucketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RateLimitBucketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RateLimitBucketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RateLimitBucketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RateLimitBucketMaxAggregateInputType
  }

  export type GetRateLimitBucketAggregateType<T extends RateLimitBucketAggregateArgs> = {
        [P in keyof T & keyof AggregateRateLimitBucket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRateLimitBucket[P]>
      : GetScalarType<T[P], AggregateRateLimitBucket[P]>
  }




  export type RateLimitBucketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RateLimitBucketWhereInput
    orderBy?: RateLimitBucketOrderByWithAggregationInput | RateLimitBucketOrderByWithAggregationInput[]
    by: RateLimitBucketScalarFieldEnum[] | RateLimitBucketScalarFieldEnum
    having?: RateLimitBucketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RateLimitBucketCountAggregateInputType | true
    _avg?: RateLimitBucketAvgAggregateInputType
    _sum?: RateLimitBucketSumAggregateInputType
    _min?: RateLimitBucketMinAggregateInputType
    _max?: RateLimitBucketMaxAggregateInputType
  }

  export type RateLimitBucketGroupByOutputType = {
    id: string
    key: string
    windowStart: Date
    windowMs: number
    hitCount: number
    createdAt: Date
    updatedAt: Date
    _count: RateLimitBucketCountAggregateOutputType | null
    _avg: RateLimitBucketAvgAggregateOutputType | null
    _sum: RateLimitBucketSumAggregateOutputType | null
    _min: RateLimitBucketMinAggregateOutputType | null
    _max: RateLimitBucketMaxAggregateOutputType | null
  }

  type GetRateLimitBucketGroupByPayload<T extends RateLimitBucketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RateLimitBucketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RateLimitBucketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RateLimitBucketGroupByOutputType[P]>
            : GetScalarType<T[P], RateLimitBucketGroupByOutputType[P]>
        }
      >
    >


  export type RateLimitBucketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    windowStart?: boolean
    windowMs?: boolean
    hitCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["rateLimitBucket"]>

  export type RateLimitBucketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    windowStart?: boolean
    windowMs?: boolean
    hitCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["rateLimitBucket"]>

  export type RateLimitBucketSelectScalar = {
    id?: boolean
    key?: boolean
    windowStart?: boolean
    windowMs?: boolean
    hitCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $RateLimitBucketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RateLimitBucket"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      windowStart: Date
      windowMs: number
      hitCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rateLimitBucket"]>
    composites: {}
  }

  type RateLimitBucketGetPayload<S extends boolean | null | undefined | RateLimitBucketDefaultArgs> = $Result.GetResult<Prisma.$RateLimitBucketPayload, S>

  type RateLimitBucketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RateLimitBucketFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RateLimitBucketCountAggregateInputType | true
    }

  export interface RateLimitBucketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RateLimitBucket'], meta: { name: 'RateLimitBucket' } }
    /**
     * Find zero or one RateLimitBucket that matches the filter.
     * @param {RateLimitBucketFindUniqueArgs} args - Arguments to find a RateLimitBucket
     * @example
     * // Get one RateLimitBucket
     * const rateLimitBucket = await prisma.rateLimitBucket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RateLimitBucketFindUniqueArgs>(args: SelectSubset<T, RateLimitBucketFindUniqueArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RateLimitBucket that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RateLimitBucketFindUniqueOrThrowArgs} args - Arguments to find a RateLimitBucket
     * @example
     * // Get one RateLimitBucket
     * const rateLimitBucket = await prisma.rateLimitBucket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RateLimitBucketFindUniqueOrThrowArgs>(args: SelectSubset<T, RateLimitBucketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RateLimitBucket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketFindFirstArgs} args - Arguments to find a RateLimitBucket
     * @example
     * // Get one RateLimitBucket
     * const rateLimitBucket = await prisma.rateLimitBucket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RateLimitBucketFindFirstArgs>(args?: SelectSubset<T, RateLimitBucketFindFirstArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RateLimitBucket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketFindFirstOrThrowArgs} args - Arguments to find a RateLimitBucket
     * @example
     * // Get one RateLimitBucket
     * const rateLimitBucket = await prisma.rateLimitBucket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RateLimitBucketFindFirstOrThrowArgs>(args?: SelectSubset<T, RateLimitBucketFindFirstOrThrowArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RateLimitBuckets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RateLimitBuckets
     * const rateLimitBuckets = await prisma.rateLimitBucket.findMany()
     * 
     * // Get first 10 RateLimitBuckets
     * const rateLimitBuckets = await prisma.rateLimitBucket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rateLimitBucketWithIdOnly = await prisma.rateLimitBucket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RateLimitBucketFindManyArgs>(args?: SelectSubset<T, RateLimitBucketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RateLimitBucket.
     * @param {RateLimitBucketCreateArgs} args - Arguments to create a RateLimitBucket.
     * @example
     * // Create one RateLimitBucket
     * const RateLimitBucket = await prisma.rateLimitBucket.create({
     *   data: {
     *     // ... data to create a RateLimitBucket
     *   }
     * })
     * 
     */
    create<T extends RateLimitBucketCreateArgs>(args: SelectSubset<T, RateLimitBucketCreateArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RateLimitBuckets.
     * @param {RateLimitBucketCreateManyArgs} args - Arguments to create many RateLimitBuckets.
     * @example
     * // Create many RateLimitBuckets
     * const rateLimitBucket = await prisma.rateLimitBucket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RateLimitBucketCreateManyArgs>(args?: SelectSubset<T, RateLimitBucketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RateLimitBuckets and returns the data saved in the database.
     * @param {RateLimitBucketCreateManyAndReturnArgs} args - Arguments to create many RateLimitBuckets.
     * @example
     * // Create many RateLimitBuckets
     * const rateLimitBucket = await prisma.rateLimitBucket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RateLimitBuckets and only return the `id`
     * const rateLimitBucketWithIdOnly = await prisma.rateLimitBucket.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RateLimitBucketCreateManyAndReturnArgs>(args?: SelectSubset<T, RateLimitBucketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RateLimitBucket.
     * @param {RateLimitBucketDeleteArgs} args - Arguments to delete one RateLimitBucket.
     * @example
     * // Delete one RateLimitBucket
     * const RateLimitBucket = await prisma.rateLimitBucket.delete({
     *   where: {
     *     // ... filter to delete one RateLimitBucket
     *   }
     * })
     * 
     */
    delete<T extends RateLimitBucketDeleteArgs>(args: SelectSubset<T, RateLimitBucketDeleteArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RateLimitBucket.
     * @param {RateLimitBucketUpdateArgs} args - Arguments to update one RateLimitBucket.
     * @example
     * // Update one RateLimitBucket
     * const rateLimitBucket = await prisma.rateLimitBucket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RateLimitBucketUpdateArgs>(args: SelectSubset<T, RateLimitBucketUpdateArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RateLimitBuckets.
     * @param {RateLimitBucketDeleteManyArgs} args - Arguments to filter RateLimitBuckets to delete.
     * @example
     * // Delete a few RateLimitBuckets
     * const { count } = await prisma.rateLimitBucket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RateLimitBucketDeleteManyArgs>(args?: SelectSubset<T, RateLimitBucketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RateLimitBuckets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RateLimitBuckets
     * const rateLimitBucket = await prisma.rateLimitBucket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RateLimitBucketUpdateManyArgs>(args: SelectSubset<T, RateLimitBucketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RateLimitBucket.
     * @param {RateLimitBucketUpsertArgs} args - Arguments to update or create a RateLimitBucket.
     * @example
     * // Update or create a RateLimitBucket
     * const rateLimitBucket = await prisma.rateLimitBucket.upsert({
     *   create: {
     *     // ... data to create a RateLimitBucket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RateLimitBucket we want to update
     *   }
     * })
     */
    upsert<T extends RateLimitBucketUpsertArgs>(args: SelectSubset<T, RateLimitBucketUpsertArgs<ExtArgs>>): Prisma__RateLimitBucketClient<$Result.GetResult<Prisma.$RateLimitBucketPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RateLimitBuckets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketCountArgs} args - Arguments to filter RateLimitBuckets to count.
     * @example
     * // Count the number of RateLimitBuckets
     * const count = await prisma.rateLimitBucket.count({
     *   where: {
     *     // ... the filter for the RateLimitBuckets we want to count
     *   }
     * })
    **/
    count<T extends RateLimitBucketCountArgs>(
      args?: Subset<T, RateLimitBucketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RateLimitBucketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RateLimitBucket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RateLimitBucketAggregateArgs>(args: Subset<T, RateLimitBucketAggregateArgs>): Prisma.PrismaPromise<GetRateLimitBucketAggregateType<T>>

    /**
     * Group by RateLimitBucket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateLimitBucketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RateLimitBucketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RateLimitBucketGroupByArgs['orderBy'] }
        : { orderBy?: RateLimitBucketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RateLimitBucketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRateLimitBucketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RateLimitBucket model
   */
  readonly fields: RateLimitBucketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RateLimitBucket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RateLimitBucketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RateLimitBucket model
   */ 
  interface RateLimitBucketFieldRefs {
    readonly id: FieldRef<"RateLimitBucket", 'String'>
    readonly key: FieldRef<"RateLimitBucket", 'String'>
    readonly windowStart: FieldRef<"RateLimitBucket", 'DateTime'>
    readonly windowMs: FieldRef<"RateLimitBucket", 'Int'>
    readonly hitCount: FieldRef<"RateLimitBucket", 'Int'>
    readonly createdAt: FieldRef<"RateLimitBucket", 'DateTime'>
    readonly updatedAt: FieldRef<"RateLimitBucket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RateLimitBucket findUnique
   */
  export type RateLimitBucketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * Filter, which RateLimitBucket to fetch.
     */
    where: RateLimitBucketWhereUniqueInput
  }

  /**
   * RateLimitBucket findUniqueOrThrow
   */
  export type RateLimitBucketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * Filter, which RateLimitBucket to fetch.
     */
    where: RateLimitBucketWhereUniqueInput
  }

  /**
   * RateLimitBucket findFirst
   */
  export type RateLimitBucketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * Filter, which RateLimitBucket to fetch.
     */
    where?: RateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateLimitBuckets to fetch.
     */
    orderBy?: RateLimitBucketOrderByWithRelationInput | RateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RateLimitBuckets.
     */
    cursor?: RateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateLimitBuckets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RateLimitBuckets.
     */
    distinct?: RateLimitBucketScalarFieldEnum | RateLimitBucketScalarFieldEnum[]
  }

  /**
   * RateLimitBucket findFirstOrThrow
   */
  export type RateLimitBucketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * Filter, which RateLimitBucket to fetch.
     */
    where?: RateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateLimitBuckets to fetch.
     */
    orderBy?: RateLimitBucketOrderByWithRelationInput | RateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RateLimitBuckets.
     */
    cursor?: RateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateLimitBuckets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RateLimitBuckets.
     */
    distinct?: RateLimitBucketScalarFieldEnum | RateLimitBucketScalarFieldEnum[]
  }

  /**
   * RateLimitBucket findMany
   */
  export type RateLimitBucketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * Filter, which RateLimitBuckets to fetch.
     */
    where?: RateLimitBucketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateLimitBuckets to fetch.
     */
    orderBy?: RateLimitBucketOrderByWithRelationInput | RateLimitBucketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RateLimitBuckets.
     */
    cursor?: RateLimitBucketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateLimitBuckets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateLimitBuckets.
     */
    skip?: number
    distinct?: RateLimitBucketScalarFieldEnum | RateLimitBucketScalarFieldEnum[]
  }

  /**
   * RateLimitBucket create
   */
  export type RateLimitBucketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * The data needed to create a RateLimitBucket.
     */
    data: XOR<RateLimitBucketCreateInput, RateLimitBucketUncheckedCreateInput>
  }

  /**
   * RateLimitBucket createMany
   */
  export type RateLimitBucketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RateLimitBuckets.
     */
    data: RateLimitBucketCreateManyInput | RateLimitBucketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RateLimitBucket createManyAndReturn
   */
  export type RateLimitBucketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RateLimitBuckets.
     */
    data: RateLimitBucketCreateManyInput | RateLimitBucketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RateLimitBucket update
   */
  export type RateLimitBucketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * The data needed to update a RateLimitBucket.
     */
    data: XOR<RateLimitBucketUpdateInput, RateLimitBucketUncheckedUpdateInput>
    /**
     * Choose, which RateLimitBucket to update.
     */
    where: RateLimitBucketWhereUniqueInput
  }

  /**
   * RateLimitBucket updateMany
   */
  export type RateLimitBucketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RateLimitBuckets.
     */
    data: XOR<RateLimitBucketUpdateManyMutationInput, RateLimitBucketUncheckedUpdateManyInput>
    /**
     * Filter which RateLimitBuckets to update
     */
    where?: RateLimitBucketWhereInput
  }

  /**
   * RateLimitBucket upsert
   */
  export type RateLimitBucketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * The filter to search for the RateLimitBucket to update in case it exists.
     */
    where: RateLimitBucketWhereUniqueInput
    /**
     * In case the RateLimitBucket found by the `where` argument doesn't exist, create a new RateLimitBucket with this data.
     */
    create: XOR<RateLimitBucketCreateInput, RateLimitBucketUncheckedCreateInput>
    /**
     * In case the RateLimitBucket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RateLimitBucketUpdateInput, RateLimitBucketUncheckedUpdateInput>
  }

  /**
   * RateLimitBucket delete
   */
  export type RateLimitBucketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
    /**
     * Filter which RateLimitBucket to delete.
     */
    where: RateLimitBucketWhereUniqueInput
  }

  /**
   * RateLimitBucket deleteMany
   */
  export type RateLimitBucketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RateLimitBuckets to delete
     */
    where?: RateLimitBucketWhereInput
  }

  /**
   * RateLimitBucket without action
   */
  export type RateLimitBucketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateLimitBucket
     */
    select?: RateLimitBucketSelect<ExtArgs> | null
  }


  /**
   * Model PremiumInsightCache
   */

  export type AggregatePremiumInsightCache = {
    _count: PremiumInsightCacheCountAggregateOutputType | null
    _min: PremiumInsightCacheMinAggregateOutputType | null
    _max: PremiumInsightCacheMaxAggregateOutputType | null
  }

  export type PremiumInsightCacheMinAggregateOutputType = {
    id: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PremiumInsightCacheMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PremiumInsightCacheCountAggregateOutputType = {
    id: number
    userId: number
    expiresAt: number
    data: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PremiumInsightCacheMinAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PremiumInsightCacheMaxAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PremiumInsightCacheCountAggregateInputType = {
    id?: true
    userId?: true
    expiresAt?: true
    data?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PremiumInsightCacheAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PremiumInsightCache to aggregate.
     */
    where?: PremiumInsightCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumInsightCaches to fetch.
     */
    orderBy?: PremiumInsightCacheOrderByWithRelationInput | PremiumInsightCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PremiumInsightCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumInsightCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumInsightCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PremiumInsightCaches
    **/
    _count?: true | PremiumInsightCacheCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PremiumInsightCacheMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PremiumInsightCacheMaxAggregateInputType
  }

  export type GetPremiumInsightCacheAggregateType<T extends PremiumInsightCacheAggregateArgs> = {
        [P in keyof T & keyof AggregatePremiumInsightCache]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePremiumInsightCache[P]>
      : GetScalarType<T[P], AggregatePremiumInsightCache[P]>
  }




  export type PremiumInsightCacheGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PremiumInsightCacheWhereInput
    orderBy?: PremiumInsightCacheOrderByWithAggregationInput | PremiumInsightCacheOrderByWithAggregationInput[]
    by: PremiumInsightCacheScalarFieldEnum[] | PremiumInsightCacheScalarFieldEnum
    having?: PremiumInsightCacheScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PremiumInsightCacheCountAggregateInputType | true
    _min?: PremiumInsightCacheMinAggregateInputType
    _max?: PremiumInsightCacheMaxAggregateInputType
  }

  export type PremiumInsightCacheGroupByOutputType = {
    id: string
    userId: string
    expiresAt: Date
    data: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PremiumInsightCacheCountAggregateOutputType | null
    _min: PremiumInsightCacheMinAggregateOutputType | null
    _max: PremiumInsightCacheMaxAggregateOutputType | null
  }

  type GetPremiumInsightCacheGroupByPayload<T extends PremiumInsightCacheGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PremiumInsightCacheGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PremiumInsightCacheGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PremiumInsightCacheGroupByOutputType[P]>
            : GetScalarType<T[P], PremiumInsightCacheGroupByOutputType[P]>
        }
      >
    >


  export type PremiumInsightCacheSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["premiumInsightCache"]>

  export type PremiumInsightCacheSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["premiumInsightCache"]>

  export type PremiumInsightCacheSelectScalar = {
    id?: boolean
    userId?: boolean
    expiresAt?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PremiumInsightCachePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PremiumInsightCache"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      expiresAt: Date
      data: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["premiumInsightCache"]>
    composites: {}
  }

  type PremiumInsightCacheGetPayload<S extends boolean | null | undefined | PremiumInsightCacheDefaultArgs> = $Result.GetResult<Prisma.$PremiumInsightCachePayload, S>

  type PremiumInsightCacheCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PremiumInsightCacheFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PremiumInsightCacheCountAggregateInputType | true
    }

  export interface PremiumInsightCacheDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PremiumInsightCache'], meta: { name: 'PremiumInsightCache' } }
    /**
     * Find zero or one PremiumInsightCache that matches the filter.
     * @param {PremiumInsightCacheFindUniqueArgs} args - Arguments to find a PremiumInsightCache
     * @example
     * // Get one PremiumInsightCache
     * const premiumInsightCache = await prisma.premiumInsightCache.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PremiumInsightCacheFindUniqueArgs>(args: SelectSubset<T, PremiumInsightCacheFindUniqueArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PremiumInsightCache that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PremiumInsightCacheFindUniqueOrThrowArgs} args - Arguments to find a PremiumInsightCache
     * @example
     * // Get one PremiumInsightCache
     * const premiumInsightCache = await prisma.premiumInsightCache.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PremiumInsightCacheFindUniqueOrThrowArgs>(args: SelectSubset<T, PremiumInsightCacheFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PremiumInsightCache that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheFindFirstArgs} args - Arguments to find a PremiumInsightCache
     * @example
     * // Get one PremiumInsightCache
     * const premiumInsightCache = await prisma.premiumInsightCache.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PremiumInsightCacheFindFirstArgs>(args?: SelectSubset<T, PremiumInsightCacheFindFirstArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PremiumInsightCache that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheFindFirstOrThrowArgs} args - Arguments to find a PremiumInsightCache
     * @example
     * // Get one PremiumInsightCache
     * const premiumInsightCache = await prisma.premiumInsightCache.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PremiumInsightCacheFindFirstOrThrowArgs>(args?: SelectSubset<T, PremiumInsightCacheFindFirstOrThrowArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PremiumInsightCaches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PremiumInsightCaches
     * const premiumInsightCaches = await prisma.premiumInsightCache.findMany()
     * 
     * // Get first 10 PremiumInsightCaches
     * const premiumInsightCaches = await prisma.premiumInsightCache.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const premiumInsightCacheWithIdOnly = await prisma.premiumInsightCache.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PremiumInsightCacheFindManyArgs>(args?: SelectSubset<T, PremiumInsightCacheFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PremiumInsightCache.
     * @param {PremiumInsightCacheCreateArgs} args - Arguments to create a PremiumInsightCache.
     * @example
     * // Create one PremiumInsightCache
     * const PremiumInsightCache = await prisma.premiumInsightCache.create({
     *   data: {
     *     // ... data to create a PremiumInsightCache
     *   }
     * })
     * 
     */
    create<T extends PremiumInsightCacheCreateArgs>(args: SelectSubset<T, PremiumInsightCacheCreateArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PremiumInsightCaches.
     * @param {PremiumInsightCacheCreateManyArgs} args - Arguments to create many PremiumInsightCaches.
     * @example
     * // Create many PremiumInsightCaches
     * const premiumInsightCache = await prisma.premiumInsightCache.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PremiumInsightCacheCreateManyArgs>(args?: SelectSubset<T, PremiumInsightCacheCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PremiumInsightCaches and returns the data saved in the database.
     * @param {PremiumInsightCacheCreateManyAndReturnArgs} args - Arguments to create many PremiumInsightCaches.
     * @example
     * // Create many PremiumInsightCaches
     * const premiumInsightCache = await prisma.premiumInsightCache.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PremiumInsightCaches and only return the `id`
     * const premiumInsightCacheWithIdOnly = await prisma.premiumInsightCache.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PremiumInsightCacheCreateManyAndReturnArgs>(args?: SelectSubset<T, PremiumInsightCacheCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PremiumInsightCache.
     * @param {PremiumInsightCacheDeleteArgs} args - Arguments to delete one PremiumInsightCache.
     * @example
     * // Delete one PremiumInsightCache
     * const PremiumInsightCache = await prisma.premiumInsightCache.delete({
     *   where: {
     *     // ... filter to delete one PremiumInsightCache
     *   }
     * })
     * 
     */
    delete<T extends PremiumInsightCacheDeleteArgs>(args: SelectSubset<T, PremiumInsightCacheDeleteArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PremiumInsightCache.
     * @param {PremiumInsightCacheUpdateArgs} args - Arguments to update one PremiumInsightCache.
     * @example
     * // Update one PremiumInsightCache
     * const premiumInsightCache = await prisma.premiumInsightCache.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PremiumInsightCacheUpdateArgs>(args: SelectSubset<T, PremiumInsightCacheUpdateArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PremiumInsightCaches.
     * @param {PremiumInsightCacheDeleteManyArgs} args - Arguments to filter PremiumInsightCaches to delete.
     * @example
     * // Delete a few PremiumInsightCaches
     * const { count } = await prisma.premiumInsightCache.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PremiumInsightCacheDeleteManyArgs>(args?: SelectSubset<T, PremiumInsightCacheDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PremiumInsightCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PremiumInsightCaches
     * const premiumInsightCache = await prisma.premiumInsightCache.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PremiumInsightCacheUpdateManyArgs>(args: SelectSubset<T, PremiumInsightCacheUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PremiumInsightCache.
     * @param {PremiumInsightCacheUpsertArgs} args - Arguments to update or create a PremiumInsightCache.
     * @example
     * // Update or create a PremiumInsightCache
     * const premiumInsightCache = await prisma.premiumInsightCache.upsert({
     *   create: {
     *     // ... data to create a PremiumInsightCache
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PremiumInsightCache we want to update
     *   }
     * })
     */
    upsert<T extends PremiumInsightCacheUpsertArgs>(args: SelectSubset<T, PremiumInsightCacheUpsertArgs<ExtArgs>>): Prisma__PremiumInsightCacheClient<$Result.GetResult<Prisma.$PremiumInsightCachePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PremiumInsightCaches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheCountArgs} args - Arguments to filter PremiumInsightCaches to count.
     * @example
     * // Count the number of PremiumInsightCaches
     * const count = await prisma.premiumInsightCache.count({
     *   where: {
     *     // ... the filter for the PremiumInsightCaches we want to count
     *   }
     * })
    **/
    count<T extends PremiumInsightCacheCountArgs>(
      args?: Subset<T, PremiumInsightCacheCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PremiumInsightCacheCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PremiumInsightCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PremiumInsightCacheAggregateArgs>(args: Subset<T, PremiumInsightCacheAggregateArgs>): Prisma.PrismaPromise<GetPremiumInsightCacheAggregateType<T>>

    /**
     * Group by PremiumInsightCache.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PremiumInsightCacheGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PremiumInsightCacheGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PremiumInsightCacheGroupByArgs['orderBy'] }
        : { orderBy?: PremiumInsightCacheGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PremiumInsightCacheGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPremiumInsightCacheGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PremiumInsightCache model
   */
  readonly fields: PremiumInsightCacheFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PremiumInsightCache.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PremiumInsightCacheClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PremiumInsightCache model
   */ 
  interface PremiumInsightCacheFieldRefs {
    readonly id: FieldRef<"PremiumInsightCache", 'String'>
    readonly userId: FieldRef<"PremiumInsightCache", 'String'>
    readonly expiresAt: FieldRef<"PremiumInsightCache", 'DateTime'>
    readonly data: FieldRef<"PremiumInsightCache", 'Json'>
    readonly createdAt: FieldRef<"PremiumInsightCache", 'DateTime'>
    readonly updatedAt: FieldRef<"PremiumInsightCache", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PremiumInsightCache findUnique
   */
  export type PremiumInsightCacheFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * Filter, which PremiumInsightCache to fetch.
     */
    where: PremiumInsightCacheWhereUniqueInput
  }

  /**
   * PremiumInsightCache findUniqueOrThrow
   */
  export type PremiumInsightCacheFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * Filter, which PremiumInsightCache to fetch.
     */
    where: PremiumInsightCacheWhereUniqueInput
  }

  /**
   * PremiumInsightCache findFirst
   */
  export type PremiumInsightCacheFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * Filter, which PremiumInsightCache to fetch.
     */
    where?: PremiumInsightCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumInsightCaches to fetch.
     */
    orderBy?: PremiumInsightCacheOrderByWithRelationInput | PremiumInsightCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PremiumInsightCaches.
     */
    cursor?: PremiumInsightCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumInsightCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumInsightCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PremiumInsightCaches.
     */
    distinct?: PremiumInsightCacheScalarFieldEnum | PremiumInsightCacheScalarFieldEnum[]
  }

  /**
   * PremiumInsightCache findFirstOrThrow
   */
  export type PremiumInsightCacheFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * Filter, which PremiumInsightCache to fetch.
     */
    where?: PremiumInsightCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumInsightCaches to fetch.
     */
    orderBy?: PremiumInsightCacheOrderByWithRelationInput | PremiumInsightCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PremiumInsightCaches.
     */
    cursor?: PremiumInsightCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumInsightCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumInsightCaches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PremiumInsightCaches.
     */
    distinct?: PremiumInsightCacheScalarFieldEnum | PremiumInsightCacheScalarFieldEnum[]
  }

  /**
   * PremiumInsightCache findMany
   */
  export type PremiumInsightCacheFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * Filter, which PremiumInsightCaches to fetch.
     */
    where?: PremiumInsightCacheWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PremiumInsightCaches to fetch.
     */
    orderBy?: PremiumInsightCacheOrderByWithRelationInput | PremiumInsightCacheOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PremiumInsightCaches.
     */
    cursor?: PremiumInsightCacheWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PremiumInsightCaches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PremiumInsightCaches.
     */
    skip?: number
    distinct?: PremiumInsightCacheScalarFieldEnum | PremiumInsightCacheScalarFieldEnum[]
  }

  /**
   * PremiumInsightCache create
   */
  export type PremiumInsightCacheCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * The data needed to create a PremiumInsightCache.
     */
    data: XOR<PremiumInsightCacheCreateInput, PremiumInsightCacheUncheckedCreateInput>
  }

  /**
   * PremiumInsightCache createMany
   */
  export type PremiumInsightCacheCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PremiumInsightCaches.
     */
    data: PremiumInsightCacheCreateManyInput | PremiumInsightCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PremiumInsightCache createManyAndReturn
   */
  export type PremiumInsightCacheCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PremiumInsightCaches.
     */
    data: PremiumInsightCacheCreateManyInput | PremiumInsightCacheCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PremiumInsightCache update
   */
  export type PremiumInsightCacheUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * The data needed to update a PremiumInsightCache.
     */
    data: XOR<PremiumInsightCacheUpdateInput, PremiumInsightCacheUncheckedUpdateInput>
    /**
     * Choose, which PremiumInsightCache to update.
     */
    where: PremiumInsightCacheWhereUniqueInput
  }

  /**
   * PremiumInsightCache updateMany
   */
  export type PremiumInsightCacheUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PremiumInsightCaches.
     */
    data: XOR<PremiumInsightCacheUpdateManyMutationInput, PremiumInsightCacheUncheckedUpdateManyInput>
    /**
     * Filter which PremiumInsightCaches to update
     */
    where?: PremiumInsightCacheWhereInput
  }

  /**
   * PremiumInsightCache upsert
   */
  export type PremiumInsightCacheUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * The filter to search for the PremiumInsightCache to update in case it exists.
     */
    where: PremiumInsightCacheWhereUniqueInput
    /**
     * In case the PremiumInsightCache found by the `where` argument doesn't exist, create a new PremiumInsightCache with this data.
     */
    create: XOR<PremiumInsightCacheCreateInput, PremiumInsightCacheUncheckedCreateInput>
    /**
     * In case the PremiumInsightCache was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PremiumInsightCacheUpdateInput, PremiumInsightCacheUncheckedUpdateInput>
  }

  /**
   * PremiumInsightCache delete
   */
  export type PremiumInsightCacheDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
    /**
     * Filter which PremiumInsightCache to delete.
     */
    where: PremiumInsightCacheWhereUniqueInput
  }

  /**
   * PremiumInsightCache deleteMany
   */
  export type PremiumInsightCacheDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PremiumInsightCaches to delete
     */
    where?: PremiumInsightCacheWhereInput
  }

  /**
   * PremiumInsightCache without action
   */
  export type PremiumInsightCacheDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PremiumInsightCache
     */
    select?: PremiumInsightCacheSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ConversationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    emotionTag: 'emotionTag',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    modelUsed: 'modelUsed',
    attachmentType: 'attachmentType',
    attachmentUrl: 'attachmentUrl',
    audioDurationSec: 'audioDurationSec',
    stickerId: 'stickerId',
    flaggedForRisk: 'flaggedForRisk',
    ttsAudioUrl: 'ttsAudioUrl',
    ttsProvider: 'ttsProvider',
    ttsModel: 'ttsModel',
    ttsGeneratedAt: 'ttsGeneratedAt',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const DailyMessageQuotaScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    date: 'date',
    messageCount: 'messageCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DailyMessageQuotaScalarFieldEnum = (typeof DailyMessageQuotaScalarFieldEnum)[keyof typeof DailyMessageQuotaScalarFieldEnum]


  export const RateLimitBucketScalarFieldEnum: {
    id: 'id',
    key: 'key',
    windowStart: 'windowStart',
    windowMs: 'windowMs',
    hitCount: 'hitCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RateLimitBucketScalarFieldEnum = (typeof RateLimitBucketScalarFieldEnum)[keyof typeof RateLimitBucketScalarFieldEnum]


  export const PremiumInsightCacheScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    expiresAt: 'expiresAt',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PremiumInsightCacheScalarFieldEnum = (typeof PremiumInsightCacheScalarFieldEnum)[keyof typeof PremiumInsightCacheScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    userId?: StringFilter<"Conversation"> | string
    title?: StringFilter<"Conversation"> | string
    emotionTag?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    messages?: MessageListRelationFilter
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    emotionTag?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    userId?: StringFilter<"Conversation"> | string
    title?: StringFilter<"Conversation"> | string
    emotionTag?: StringNullableFilter<"Conversation"> | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    messages?: MessageListRelationFilter
  }, "id">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    emotionTag?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    userId?: StringWithAggregatesFilter<"Conversation"> | string
    title?: StringWithAggregatesFilter<"Conversation"> | string
    emotionTag?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    conversationId?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    content?: StringNullableFilter<"Message"> | string | null
    modelUsed?: StringNullableFilter<"Message"> | string | null
    attachmentType?: StringNullableFilter<"Message"> | string | null
    attachmentUrl?: StringNullableFilter<"Message"> | string | null
    audioDurationSec?: IntNullableFilter<"Message"> | number | null
    stickerId?: StringNullableFilter<"Message"> | string | null
    flaggedForRisk?: BoolFilter<"Message"> | boolean
    ttsAudioUrl?: StringNullableFilter<"Message"> | string | null
    ttsProvider?: StringNullableFilter<"Message"> | string | null
    ttsModel?: StringNullableFilter<"Message"> | string | null
    ttsGeneratedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    conversation?: XOR<ConversationRelationFilter, ConversationWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrderInput | SortOrder
    modelUsed?: SortOrderInput | SortOrder
    attachmentType?: SortOrderInput | SortOrder
    attachmentUrl?: SortOrderInput | SortOrder
    audioDurationSec?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    flaggedForRisk?: SortOrder
    ttsAudioUrl?: SortOrderInput | SortOrder
    ttsProvider?: SortOrderInput | SortOrder
    ttsModel?: SortOrderInput | SortOrder
    ttsGeneratedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    conversation?: ConversationOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    conversationId?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    content?: StringNullableFilter<"Message"> | string | null
    modelUsed?: StringNullableFilter<"Message"> | string | null
    attachmentType?: StringNullableFilter<"Message"> | string | null
    attachmentUrl?: StringNullableFilter<"Message"> | string | null
    audioDurationSec?: IntNullableFilter<"Message"> | number | null
    stickerId?: StringNullableFilter<"Message"> | string | null
    flaggedForRisk?: BoolFilter<"Message"> | boolean
    ttsAudioUrl?: StringNullableFilter<"Message"> | string | null
    ttsProvider?: StringNullableFilter<"Message"> | string | null
    ttsModel?: StringNullableFilter<"Message"> | string | null
    ttsGeneratedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    conversation?: XOR<ConversationRelationFilter, ConversationWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrderInput | SortOrder
    modelUsed?: SortOrderInput | SortOrder
    attachmentType?: SortOrderInput | SortOrder
    attachmentUrl?: SortOrderInput | SortOrder
    audioDurationSec?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    flaggedForRisk?: SortOrder
    ttsAudioUrl?: SortOrderInput | SortOrder
    ttsProvider?: SortOrderInput | SortOrder
    ttsModel?: SortOrderInput | SortOrder
    ttsGeneratedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _avg?: MessageAvgOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
    _sum?: MessageSumOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    conversationId?: StringWithAggregatesFilter<"Message"> | string
    role?: StringWithAggregatesFilter<"Message"> | string
    content?: StringNullableWithAggregatesFilter<"Message"> | string | null
    modelUsed?: StringNullableWithAggregatesFilter<"Message"> | string | null
    attachmentType?: StringNullableWithAggregatesFilter<"Message"> | string | null
    attachmentUrl?: StringNullableWithAggregatesFilter<"Message"> | string | null
    audioDurationSec?: IntNullableWithAggregatesFilter<"Message"> | number | null
    stickerId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    flaggedForRisk?: BoolWithAggregatesFilter<"Message"> | boolean
    ttsAudioUrl?: StringNullableWithAggregatesFilter<"Message"> | string | null
    ttsProvider?: StringNullableWithAggregatesFilter<"Message"> | string | null
    ttsModel?: StringNullableWithAggregatesFilter<"Message"> | string | null
    ttsGeneratedAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type DailyMessageQuotaWhereInput = {
    AND?: DailyMessageQuotaWhereInput | DailyMessageQuotaWhereInput[]
    OR?: DailyMessageQuotaWhereInput[]
    NOT?: DailyMessageQuotaWhereInput | DailyMessageQuotaWhereInput[]
    id?: StringFilter<"DailyMessageQuota"> | string
    userId?: StringFilter<"DailyMessageQuota"> | string
    date?: StringFilter<"DailyMessageQuota"> | string
    messageCount?: IntFilter<"DailyMessageQuota"> | number
    createdAt?: DateTimeFilter<"DailyMessageQuota"> | Date | string
    updatedAt?: DateTimeFilter<"DailyMessageQuota"> | Date | string
  }

  export type DailyMessageQuotaOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyMessageQuotaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_date?: DailyMessageQuotaUserIdDateCompoundUniqueInput
    AND?: DailyMessageQuotaWhereInput | DailyMessageQuotaWhereInput[]
    OR?: DailyMessageQuotaWhereInput[]
    NOT?: DailyMessageQuotaWhereInput | DailyMessageQuotaWhereInput[]
    userId?: StringFilter<"DailyMessageQuota"> | string
    date?: StringFilter<"DailyMessageQuota"> | string
    messageCount?: IntFilter<"DailyMessageQuota"> | number
    createdAt?: DateTimeFilter<"DailyMessageQuota"> | Date | string
    updatedAt?: DateTimeFilter<"DailyMessageQuota"> | Date | string
  }, "id" | "userId_date">

  export type DailyMessageQuotaOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DailyMessageQuotaCountOrderByAggregateInput
    _avg?: DailyMessageQuotaAvgOrderByAggregateInput
    _max?: DailyMessageQuotaMaxOrderByAggregateInput
    _min?: DailyMessageQuotaMinOrderByAggregateInput
    _sum?: DailyMessageQuotaSumOrderByAggregateInput
  }

  export type DailyMessageQuotaScalarWhereWithAggregatesInput = {
    AND?: DailyMessageQuotaScalarWhereWithAggregatesInput | DailyMessageQuotaScalarWhereWithAggregatesInput[]
    OR?: DailyMessageQuotaScalarWhereWithAggregatesInput[]
    NOT?: DailyMessageQuotaScalarWhereWithAggregatesInput | DailyMessageQuotaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DailyMessageQuota"> | string
    userId?: StringWithAggregatesFilter<"DailyMessageQuota"> | string
    date?: StringWithAggregatesFilter<"DailyMessageQuota"> | string
    messageCount?: IntWithAggregatesFilter<"DailyMessageQuota"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DailyMessageQuota"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DailyMessageQuota"> | Date | string
  }

  export type RateLimitBucketWhereInput = {
    AND?: RateLimitBucketWhereInput | RateLimitBucketWhereInput[]
    OR?: RateLimitBucketWhereInput[]
    NOT?: RateLimitBucketWhereInput | RateLimitBucketWhereInput[]
    id?: StringFilter<"RateLimitBucket"> | string
    key?: StringFilter<"RateLimitBucket"> | string
    windowStart?: DateTimeFilter<"RateLimitBucket"> | Date | string
    windowMs?: IntFilter<"RateLimitBucket"> | number
    hitCount?: IntFilter<"RateLimitBucket"> | number
    createdAt?: DateTimeFilter<"RateLimitBucket"> | Date | string
    updatedAt?: DateTimeFilter<"RateLimitBucket"> | Date | string
  }

  export type RateLimitBucketOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    windowStart?: SortOrder
    windowMs?: SortOrder
    hitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateLimitBucketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: RateLimitBucketWhereInput | RateLimitBucketWhereInput[]
    OR?: RateLimitBucketWhereInput[]
    NOT?: RateLimitBucketWhereInput | RateLimitBucketWhereInput[]
    windowStart?: DateTimeFilter<"RateLimitBucket"> | Date | string
    windowMs?: IntFilter<"RateLimitBucket"> | number
    hitCount?: IntFilter<"RateLimitBucket"> | number
    createdAt?: DateTimeFilter<"RateLimitBucket"> | Date | string
    updatedAt?: DateTimeFilter<"RateLimitBucket"> | Date | string
  }, "id" | "key">

  export type RateLimitBucketOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    windowStart?: SortOrder
    windowMs?: SortOrder
    hitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RateLimitBucketCountOrderByAggregateInput
    _avg?: RateLimitBucketAvgOrderByAggregateInput
    _max?: RateLimitBucketMaxOrderByAggregateInput
    _min?: RateLimitBucketMinOrderByAggregateInput
    _sum?: RateLimitBucketSumOrderByAggregateInput
  }

  export type RateLimitBucketScalarWhereWithAggregatesInput = {
    AND?: RateLimitBucketScalarWhereWithAggregatesInput | RateLimitBucketScalarWhereWithAggregatesInput[]
    OR?: RateLimitBucketScalarWhereWithAggregatesInput[]
    NOT?: RateLimitBucketScalarWhereWithAggregatesInput | RateLimitBucketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RateLimitBucket"> | string
    key?: StringWithAggregatesFilter<"RateLimitBucket"> | string
    windowStart?: DateTimeWithAggregatesFilter<"RateLimitBucket"> | Date | string
    windowMs?: IntWithAggregatesFilter<"RateLimitBucket"> | number
    hitCount?: IntWithAggregatesFilter<"RateLimitBucket"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RateLimitBucket"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RateLimitBucket"> | Date | string
  }

  export type PremiumInsightCacheWhereInput = {
    AND?: PremiumInsightCacheWhereInput | PremiumInsightCacheWhereInput[]
    OR?: PremiumInsightCacheWhereInput[]
    NOT?: PremiumInsightCacheWhereInput | PremiumInsightCacheWhereInput[]
    id?: StringFilter<"PremiumInsightCache"> | string
    userId?: StringFilter<"PremiumInsightCache"> | string
    expiresAt?: DateTimeFilter<"PremiumInsightCache"> | Date | string
    data?: JsonFilter<"PremiumInsightCache">
    createdAt?: DateTimeFilter<"PremiumInsightCache"> | Date | string
    updatedAt?: DateTimeFilter<"PremiumInsightCache"> | Date | string
  }

  export type PremiumInsightCacheOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PremiumInsightCacheWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: PremiumInsightCacheWhereInput | PremiumInsightCacheWhereInput[]
    OR?: PremiumInsightCacheWhereInput[]
    NOT?: PremiumInsightCacheWhereInput | PremiumInsightCacheWhereInput[]
    expiresAt?: DateTimeFilter<"PremiumInsightCache"> | Date | string
    data?: JsonFilter<"PremiumInsightCache">
    createdAt?: DateTimeFilter<"PremiumInsightCache"> | Date | string
    updatedAt?: DateTimeFilter<"PremiumInsightCache"> | Date | string
  }, "id" | "userId">

  export type PremiumInsightCacheOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PremiumInsightCacheCountOrderByAggregateInput
    _max?: PremiumInsightCacheMaxOrderByAggregateInput
    _min?: PremiumInsightCacheMinOrderByAggregateInput
  }

  export type PremiumInsightCacheScalarWhereWithAggregatesInput = {
    AND?: PremiumInsightCacheScalarWhereWithAggregatesInput | PremiumInsightCacheScalarWhereWithAggregatesInput[]
    OR?: PremiumInsightCacheScalarWhereWithAggregatesInput[]
    NOT?: PremiumInsightCacheScalarWhereWithAggregatesInput | PremiumInsightCacheScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PremiumInsightCache"> | string
    userId?: StringWithAggregatesFilter<"PremiumInsightCache"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PremiumInsightCache"> | Date | string
    data?: JsonWithAggregatesFilter<"PremiumInsightCache">
    createdAt?: DateTimeWithAggregatesFilter<"PremiumInsightCache"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PremiumInsightCache"> | Date | string
  }

  export type ConversationCreateInput = {
    id?: string
    userId: string
    title?: string
    emotionTag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    userId: string
    title?: string
    emotionTag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    emotionTag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    emotionTag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationCreateManyInput = {
    id?: string
    userId: string
    title?: string
    emotionTag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    emotionTag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    emotionTag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    role: string
    content?: string | null
    modelUsed?: string | null
    attachmentType?: string | null
    attachmentUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    flaggedForRisk?: boolean
    ttsAudioUrl?: string | null
    ttsProvider?: string | null
    ttsModel?: string | null
    ttsGeneratedAt?: Date | string | null
    createdAt?: Date | string
    conversation: ConversationCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: string
    content?: string | null
    modelUsed?: string | null
    attachmentType?: string | null
    attachmentUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    flaggedForRisk?: boolean
    ttsAudioUrl?: string | null
    ttsProvider?: string | null
    ttsModel?: string | null
    ttsGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    conversationId: string
    role: string
    content?: string | null
    modelUsed?: string | null
    attachmentType?: string | null
    attachmentUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    flaggedForRisk?: boolean
    ttsAudioUrl?: string | null
    ttsProvider?: string | null
    ttsModel?: string | null
    ttsGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyMessageQuotaCreateInput = {
    id: string
    userId: string
    date: string
    messageCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyMessageQuotaUncheckedCreateInput = {
    id: string
    userId: string
    date: string
    messageCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyMessageQuotaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyMessageQuotaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyMessageQuotaCreateManyInput = {
    id: string
    userId: string
    date: string
    messageCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DailyMessageQuotaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyMessageQuotaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateLimitBucketCreateInput = {
    id: string
    key: string
    windowStart: Date | string
    windowMs: number
    hitCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateLimitBucketUncheckedCreateInput = {
    id: string
    key: string
    windowStart: Date | string
    windowMs: number
    hitCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateLimitBucketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowMs?: IntFieldUpdateOperationsInput | number
    hitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateLimitBucketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowMs?: IntFieldUpdateOperationsInput | number
    hitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateLimitBucketCreateManyInput = {
    id: string
    key: string
    windowStart: Date | string
    windowMs: number
    hitCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateLimitBucketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowMs?: IntFieldUpdateOperationsInput | number
    hitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateLimitBucketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowMs?: IntFieldUpdateOperationsInput | number
    hitCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PremiumInsightCacheCreateInput = {
    id: string
    userId: string
    expiresAt: Date | string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PremiumInsightCacheUncheckedCreateInput = {
    id: string
    userId: string
    expiresAt: Date | string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PremiumInsightCacheUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PremiumInsightCacheUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PremiumInsightCacheCreateManyInput = {
    id: string
    userId: string
    expiresAt: Date | string
    data: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PremiumInsightCacheUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PremiumInsightCacheUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    emotionTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    emotionTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    emotionTag?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ConversationRelationFilter = {
    is?: ConversationWhereInput
    isNot?: ConversationWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    modelUsed?: SortOrder
    attachmentType?: SortOrder
    attachmentUrl?: SortOrder
    audioDurationSec?: SortOrder
    stickerId?: SortOrder
    flaggedForRisk?: SortOrder
    ttsAudioUrl?: SortOrder
    ttsProvider?: SortOrder
    ttsModel?: SortOrder
    ttsGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageAvgOrderByAggregateInput = {
    audioDurationSec?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    modelUsed?: SortOrder
    attachmentType?: SortOrder
    attachmentUrl?: SortOrder
    audioDurationSec?: SortOrder
    stickerId?: SortOrder
    flaggedForRisk?: SortOrder
    ttsAudioUrl?: SortOrder
    ttsProvider?: SortOrder
    ttsModel?: SortOrder
    ttsGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    modelUsed?: SortOrder
    attachmentType?: SortOrder
    attachmentUrl?: SortOrder
    audioDurationSec?: SortOrder
    stickerId?: SortOrder
    flaggedForRisk?: SortOrder
    ttsAudioUrl?: SortOrder
    ttsProvider?: SortOrder
    ttsModel?: SortOrder
    ttsGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageSumOrderByAggregateInput = {
    audioDurationSec?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DailyMessageQuotaUserIdDateCompoundUniqueInput = {
    userId: string
    date: string
  }

  export type DailyMessageQuotaCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyMessageQuotaAvgOrderByAggregateInput = {
    messageCount?: SortOrder
  }

  export type DailyMessageQuotaMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyMessageQuotaMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    messageCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DailyMessageQuotaSumOrderByAggregateInput = {
    messageCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type RateLimitBucketCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    windowStart?: SortOrder
    windowMs?: SortOrder
    hitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateLimitBucketAvgOrderByAggregateInput = {
    windowMs?: SortOrder
    hitCount?: SortOrder
  }

  export type RateLimitBucketMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    windowStart?: SortOrder
    windowMs?: SortOrder
    hitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateLimitBucketMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    windowStart?: SortOrder
    windowMs?: SortOrder
    hitCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateLimitBucketSumOrderByAggregateInput = {
    windowMs?: SortOrder
    hitCount?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PremiumInsightCacheCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PremiumInsightCacheMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PremiumInsightCacheMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type MessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutConversationInput | MessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutConversationInput | MessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutConversationInput | MessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput> | MessageCreateWithoutConversationInput[] | MessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutConversationInput | MessageCreateOrConnectWithoutConversationInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutConversationInput | MessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: MessageCreateManyConversationInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutConversationInput | MessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutConversationInput | MessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    upsert?: ConversationUpsertWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutMessagesInput, ConversationUpdateWithoutMessagesInput>, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type MessageCreateWithoutConversationInput = {
    id?: string
    role: string
    content?: string | null
    modelUsed?: string | null
    attachmentType?: string | null
    attachmentUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    flaggedForRisk?: boolean
    ttsAudioUrl?: string | null
    ttsProvider?: string | null
    ttsModel?: string | null
    ttsGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: string
    content?: string | null
    modelUsed?: string | null
    attachmentType?: string | null
    attachmentUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    flaggedForRisk?: boolean
    ttsAudioUrl?: string | null
    ttsProvider?: string | null
    ttsModel?: string | null
    ttsGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutConversationInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput>
  }

  export type MessageCreateManyConversationInputEnvelope = {
    data: MessageCreateManyConversationInput | MessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type MessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutConversationInput, MessageUncheckedUpdateWithoutConversationInput>
    create: XOR<MessageCreateWithoutConversationInput, MessageUncheckedCreateWithoutConversationInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutConversationInput, MessageUncheckedUpdateWithoutConversationInput>
  }

  export type MessageUpdateManyWithWhereWithoutConversationInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    conversationId?: StringFilter<"Message"> | string
    role?: StringFilter<"Message"> | string
    content?: StringNullableFilter<"Message"> | string | null
    modelUsed?: StringNullableFilter<"Message"> | string | null
    attachmentType?: StringNullableFilter<"Message"> | string | null
    attachmentUrl?: StringNullableFilter<"Message"> | string | null
    audioDurationSec?: IntNullableFilter<"Message"> | number | null
    stickerId?: StringNullableFilter<"Message"> | string | null
    flaggedForRisk?: BoolFilter<"Message"> | boolean
    ttsAudioUrl?: StringNullableFilter<"Message"> | string | null
    ttsProvider?: StringNullableFilter<"Message"> | string | null
    ttsModel?: StringNullableFilter<"Message"> | string | null
    ttsGeneratedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type ConversationCreateWithoutMessagesInput = {
    id?: string
    userId: string
    title?: string
    emotionTag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId: string
    title?: string
    emotionTag?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
  }

  export type ConversationUpsertWithoutMessagesInput = {
    update: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    emotionTag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    emotionTag?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyConversationInput = {
    id?: string
    role: string
    content?: string | null
    modelUsed?: string | null
    attachmentType?: string | null
    attachmentUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    flaggedForRisk?: boolean
    ttsAudioUrl?: string | null
    ttsProvider?: string | null
    ttsModel?: string | null
    ttsGeneratedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentType?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    flaggedForRisk?: BoolFieldUpdateOperationsInput | boolean
    ttsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ttsProvider?: NullableStringFieldUpdateOperationsInput | string | null
    ttsModel?: NullableStringFieldUpdateOperationsInput | string | null
    ttsGeneratedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ConversationCountOutputTypeDefaultArgs instead
     */
    export type ConversationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConversationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConversationDefaultArgs instead
     */
    export type ConversationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConversationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MessageDefaultArgs instead
     */
    export type MessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DailyMessageQuotaDefaultArgs instead
     */
    export type DailyMessageQuotaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DailyMessageQuotaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RateLimitBucketDefaultArgs instead
     */
    export type RateLimitBucketArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RateLimitBucketDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PremiumInsightCacheDefaultArgs instead
     */
    export type PremiumInsightCacheArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PremiumInsightCacheDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}