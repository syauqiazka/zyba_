
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
 * Model CommunityPost
 * 
 */
export type CommunityPost = $Result.DefaultSelection<Prisma.$CommunityPostPayload>
/**
 * Model CommunityComment
 * 
 */
export type CommunityComment = $Result.DefaultSelection<Prisma.$CommunityCommentPayload>
/**
 * Model CommunityLike
 * 
 */
export type CommunityLike = $Result.DefaultSelection<Prisma.$CommunityLikePayload>
/**
 * Model DirectConversation
 * 
 */
export type DirectConversation = $Result.DefaultSelection<Prisma.$DirectConversationPayload>
/**
 * Model DirectParticipant
 * 
 */
export type DirectParticipant = $Result.DefaultSelection<Prisma.$DirectParticipantPayload>
/**
 * Model DirectMessage
 * 
 */
export type DirectMessage = $Result.DefaultSelection<Prisma.$DirectMessagePayload>
/**
 * Model CommunityFollow
 * 
 */
export type CommunityFollow = $Result.DefaultSelection<Prisma.$CommunityFollowPayload>
/**
 * Model CommunityBookmark
 * 
 */
export type CommunityBookmark = $Result.DefaultSelection<Prisma.$CommunityBookmarkPayload>
/**
 * Model CommunityNotification
 * 
 */
export type CommunityNotification = $Result.DefaultSelection<Prisma.$CommunityNotificationPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CommunityPosts
 * const communityPosts = await prisma.communityPost.findMany()
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
   * // Fetch zero or more CommunityPosts
   * const communityPosts = await prisma.communityPost.findMany()
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
   * `prisma.communityPost`: Exposes CRUD operations for the **CommunityPost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityPosts
    * const communityPosts = await prisma.communityPost.findMany()
    * ```
    */
  get communityPost(): Prisma.CommunityPostDelegate<ExtArgs>;

  /**
   * `prisma.communityComment`: Exposes CRUD operations for the **CommunityComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityComments
    * const communityComments = await prisma.communityComment.findMany()
    * ```
    */
  get communityComment(): Prisma.CommunityCommentDelegate<ExtArgs>;

  /**
   * `prisma.communityLike`: Exposes CRUD operations for the **CommunityLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityLikes
    * const communityLikes = await prisma.communityLike.findMany()
    * ```
    */
  get communityLike(): Prisma.CommunityLikeDelegate<ExtArgs>;

  /**
   * `prisma.directConversation`: Exposes CRUD operations for the **DirectConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DirectConversations
    * const directConversations = await prisma.directConversation.findMany()
    * ```
    */
  get directConversation(): Prisma.DirectConversationDelegate<ExtArgs>;

  /**
   * `prisma.directParticipant`: Exposes CRUD operations for the **DirectParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DirectParticipants
    * const directParticipants = await prisma.directParticipant.findMany()
    * ```
    */
  get directParticipant(): Prisma.DirectParticipantDelegate<ExtArgs>;

  /**
   * `prisma.directMessage`: Exposes CRUD operations for the **DirectMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DirectMessages
    * const directMessages = await prisma.directMessage.findMany()
    * ```
    */
  get directMessage(): Prisma.DirectMessageDelegate<ExtArgs>;

  /**
   * `prisma.communityFollow`: Exposes CRUD operations for the **CommunityFollow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityFollows
    * const communityFollows = await prisma.communityFollow.findMany()
    * ```
    */
  get communityFollow(): Prisma.CommunityFollowDelegate<ExtArgs>;

  /**
   * `prisma.communityBookmark`: Exposes CRUD operations for the **CommunityBookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityBookmarks
    * const communityBookmarks = await prisma.communityBookmark.findMany()
    * ```
    */
  get communityBookmark(): Prisma.CommunityBookmarkDelegate<ExtArgs>;

  /**
   * `prisma.communityNotification`: Exposes CRUD operations for the **CommunityNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunityNotifications
    * const communityNotifications = await prisma.communityNotification.findMany()
    * ```
    */
  get communityNotification(): Prisma.CommunityNotificationDelegate<ExtArgs>;
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
    CommunityPost: 'CommunityPost',
    CommunityComment: 'CommunityComment',
    CommunityLike: 'CommunityLike',
    DirectConversation: 'DirectConversation',
    DirectParticipant: 'DirectParticipant',
    DirectMessage: 'DirectMessage',
    CommunityFollow: 'CommunityFollow',
    CommunityBookmark: 'CommunityBookmark',
    CommunityNotification: 'CommunityNotification'
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
      modelProps: "communityPost" | "communityComment" | "communityLike" | "directConversation" | "directParticipant" | "directMessage" | "communityFollow" | "communityBookmark" | "communityNotification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CommunityPost: {
        payload: Prisma.$CommunityPostPayload<ExtArgs>
        fields: Prisma.CommunityPostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityPostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityPostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>
          }
          findFirst: {
            args: Prisma.CommunityPostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityPostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>
          }
          findMany: {
            args: Prisma.CommunityPostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>[]
          }
          create: {
            args: Prisma.CommunityPostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>
          }
          createMany: {
            args: Prisma.CommunityPostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityPostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>[]
          }
          delete: {
            args: Prisma.CommunityPostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>
          }
          update: {
            args: Prisma.CommunityPostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>
          }
          deleteMany: {
            args: Prisma.CommunityPostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityPostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunityPostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityPostPayload>
          }
          aggregate: {
            args: Prisma.CommunityPostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityPost>
          }
          groupBy: {
            args: Prisma.CommunityPostGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityPostGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityPostCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityPostCountAggregateOutputType> | number
          }
        }
      }
      CommunityComment: {
        payload: Prisma.$CommunityCommentPayload<ExtArgs>
        fields: Prisma.CommunityCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>
          }
          findFirst: {
            args: Prisma.CommunityCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>
          }
          findMany: {
            args: Prisma.CommunityCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>[]
          }
          create: {
            args: Prisma.CommunityCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>
          }
          createMany: {
            args: Prisma.CommunityCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityCommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>[]
          }
          delete: {
            args: Prisma.CommunityCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>
          }
          update: {
            args: Prisma.CommunityCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>
          }
          deleteMany: {
            args: Prisma.CommunityCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunityCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityCommentPayload>
          }
          aggregate: {
            args: Prisma.CommunityCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityComment>
          }
          groupBy: {
            args: Prisma.CommunityCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityCommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityCommentCountAggregateOutputType> | number
          }
        }
      }
      CommunityLike: {
        payload: Prisma.$CommunityLikePayload<ExtArgs>
        fields: Prisma.CommunityLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>
          }
          findFirst: {
            args: Prisma.CommunityLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>
          }
          findMany: {
            args: Prisma.CommunityLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>[]
          }
          create: {
            args: Prisma.CommunityLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>
          }
          createMany: {
            args: Prisma.CommunityLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityLikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>[]
          }
          delete: {
            args: Prisma.CommunityLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>
          }
          update: {
            args: Prisma.CommunityLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>
          }
          deleteMany: {
            args: Prisma.CommunityLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunityLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityLikePayload>
          }
          aggregate: {
            args: Prisma.CommunityLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityLike>
          }
          groupBy: {
            args: Prisma.CommunityLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityLikeCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityLikeCountAggregateOutputType> | number
          }
        }
      }
      DirectConversation: {
        payload: Prisma.$DirectConversationPayload<ExtArgs>
        fields: Prisma.DirectConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DirectConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DirectConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>
          }
          findFirst: {
            args: Prisma.DirectConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DirectConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>
          }
          findMany: {
            args: Prisma.DirectConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>[]
          }
          create: {
            args: Prisma.DirectConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>
          }
          createMany: {
            args: Prisma.DirectConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DirectConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>[]
          }
          delete: {
            args: Prisma.DirectConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>
          }
          update: {
            args: Prisma.DirectConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>
          }
          deleteMany: {
            args: Prisma.DirectConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DirectConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DirectConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectConversationPayload>
          }
          aggregate: {
            args: Prisma.DirectConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDirectConversation>
          }
          groupBy: {
            args: Prisma.DirectConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<DirectConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DirectConversationCountArgs<ExtArgs>
            result: $Utils.Optional<DirectConversationCountAggregateOutputType> | number
          }
        }
      }
      DirectParticipant: {
        payload: Prisma.$DirectParticipantPayload<ExtArgs>
        fields: Prisma.DirectParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DirectParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DirectParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>
          }
          findFirst: {
            args: Prisma.DirectParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DirectParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>
          }
          findMany: {
            args: Prisma.DirectParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>[]
          }
          create: {
            args: Prisma.DirectParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>
          }
          createMany: {
            args: Prisma.DirectParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DirectParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>[]
          }
          delete: {
            args: Prisma.DirectParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>
          }
          update: {
            args: Prisma.DirectParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>
          }
          deleteMany: {
            args: Prisma.DirectParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DirectParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DirectParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectParticipantPayload>
          }
          aggregate: {
            args: Prisma.DirectParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDirectParticipant>
          }
          groupBy: {
            args: Prisma.DirectParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<DirectParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.DirectParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<DirectParticipantCountAggregateOutputType> | number
          }
        }
      }
      DirectMessage: {
        payload: Prisma.$DirectMessagePayload<ExtArgs>
        fields: Prisma.DirectMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DirectMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DirectMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>
          }
          findFirst: {
            args: Prisma.DirectMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DirectMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>
          }
          findMany: {
            args: Prisma.DirectMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>[]
          }
          create: {
            args: Prisma.DirectMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>
          }
          createMany: {
            args: Prisma.DirectMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DirectMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>[]
          }
          delete: {
            args: Prisma.DirectMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>
          }
          update: {
            args: Prisma.DirectMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>
          }
          deleteMany: {
            args: Prisma.DirectMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DirectMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DirectMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DirectMessagePayload>
          }
          aggregate: {
            args: Prisma.DirectMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDirectMessage>
          }
          groupBy: {
            args: Prisma.DirectMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<DirectMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.DirectMessageCountArgs<ExtArgs>
            result: $Utils.Optional<DirectMessageCountAggregateOutputType> | number
          }
        }
      }
      CommunityFollow: {
        payload: Prisma.$CommunityFollowPayload<ExtArgs>
        fields: Prisma.CommunityFollowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityFollowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityFollowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>
          }
          findFirst: {
            args: Prisma.CommunityFollowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityFollowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>
          }
          findMany: {
            args: Prisma.CommunityFollowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>[]
          }
          create: {
            args: Prisma.CommunityFollowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>
          }
          createMany: {
            args: Prisma.CommunityFollowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityFollowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>[]
          }
          delete: {
            args: Prisma.CommunityFollowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>
          }
          update: {
            args: Prisma.CommunityFollowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>
          }
          deleteMany: {
            args: Prisma.CommunityFollowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityFollowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunityFollowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityFollowPayload>
          }
          aggregate: {
            args: Prisma.CommunityFollowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityFollow>
          }
          groupBy: {
            args: Prisma.CommunityFollowGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityFollowGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityFollowCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityFollowCountAggregateOutputType> | number
          }
        }
      }
      CommunityBookmark: {
        payload: Prisma.$CommunityBookmarkPayload<ExtArgs>
        fields: Prisma.CommunityBookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityBookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityBookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>
          }
          findFirst: {
            args: Prisma.CommunityBookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityBookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>
          }
          findMany: {
            args: Prisma.CommunityBookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>[]
          }
          create: {
            args: Prisma.CommunityBookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>
          }
          createMany: {
            args: Prisma.CommunityBookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityBookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>[]
          }
          delete: {
            args: Prisma.CommunityBookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>
          }
          update: {
            args: Prisma.CommunityBookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>
          }
          deleteMany: {
            args: Prisma.CommunityBookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityBookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunityBookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityBookmarkPayload>
          }
          aggregate: {
            args: Prisma.CommunityBookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityBookmark>
          }
          groupBy: {
            args: Prisma.CommunityBookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityBookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityBookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityBookmarkCountAggregateOutputType> | number
          }
        }
      }
      CommunityNotification: {
        payload: Prisma.$CommunityNotificationPayload<ExtArgs>
        fields: Prisma.CommunityNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunityNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunityNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>
          }
          findFirst: {
            args: Prisma.CommunityNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunityNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>
          }
          findMany: {
            args: Prisma.CommunityNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>[]
          }
          create: {
            args: Prisma.CommunityNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>
          }
          createMany: {
            args: Prisma.CommunityNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunityNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>[]
          }
          delete: {
            args: Prisma.CommunityNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>
          }
          update: {
            args: Prisma.CommunityNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>
          }
          deleteMany: {
            args: Prisma.CommunityNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunityNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunityNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunityNotificationPayload>
          }
          aggregate: {
            args: Prisma.CommunityNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunityNotification>
          }
          groupBy: {
            args: Prisma.CommunityNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunityNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunityNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<CommunityNotificationCountAggregateOutputType> | number
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
   * Count Type CommunityPostCountOutputType
   */

  export type CommunityPostCountOutputType = {
    comments: number
    likes: number
  }

  export type CommunityPostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | CommunityPostCountOutputTypeCountCommentsArgs
    likes?: boolean | CommunityPostCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * CommunityPostCountOutputType without action
   */
  export type CommunityPostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPostCountOutputType
     */
    select?: CommunityPostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommunityPostCountOutputType without action
   */
  export type CommunityPostCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityCommentWhereInput
  }

  /**
   * CommunityPostCountOutputType without action
   */
  export type CommunityPostCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityLikeWhereInput
  }


  /**
   * Count Type CommunityCommentCountOutputType
   */

  export type CommunityCommentCountOutputType = {
    replies: number
  }

  export type CommunityCommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | CommunityCommentCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * CommunityCommentCountOutputType without action
   */
  export type CommunityCommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityCommentCountOutputType
     */
    select?: CommunityCommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommunityCommentCountOutputType without action
   */
  export type CommunityCommentCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityCommentWhereInput
  }


  /**
   * Count Type DirectConversationCountOutputType
   */

  export type DirectConversationCountOutputType = {
    participants: number
    messages: number
  }

  export type DirectConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | DirectConversationCountOutputTypeCountParticipantsArgs
    messages?: boolean | DirectConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * DirectConversationCountOutputType without action
   */
  export type DirectConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversationCountOutputType
     */
    select?: DirectConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DirectConversationCountOutputType without action
   */
  export type DirectConversationCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectParticipantWhereInput
  }

  /**
   * DirectConversationCountOutputType without action
   */
  export type DirectConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CommunityPost
   */

  export type AggregateCommunityPost = {
    _count: CommunityPostCountAggregateOutputType | null
    _avg: CommunityPostAvgAggregateOutputType | null
    _sum: CommunityPostSumAggregateOutputType | null
    _min: CommunityPostMinAggregateOutputType | null
    _max: CommunityPostMaxAggregateOutputType | null
  }

  export type CommunityPostAvgAggregateOutputType = {
    audioDurationSec: number | null
  }

  export type CommunityPostSumAggregateOutputType = {
    audioDurationSec: number | null
  }

  export type CommunityPostMinAggregateOutputType = {
    id: string | null
    userId: string | null
    content: string | null
    imageUrl: string | null
    audioUrl: string | null
    audioDurationSec: number | null
    stickerId: string | null
    isHidden: boolean | null
    createdAt: Date | null
  }

  export type CommunityPostMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    content: string | null
    imageUrl: string | null
    audioUrl: string | null
    audioDurationSec: number | null
    stickerId: string | null
    isHidden: boolean | null
    createdAt: Date | null
  }

  export type CommunityPostCountAggregateOutputType = {
    id: number
    userId: number
    content: number
    imageUrl: number
    audioUrl: number
    audioDurationSec: number
    stickerId: number
    isHidden: number
    createdAt: number
    _all: number
  }


  export type CommunityPostAvgAggregateInputType = {
    audioDurationSec?: true
  }

  export type CommunityPostSumAggregateInputType = {
    audioDurationSec?: true
  }

  export type CommunityPostMinAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    imageUrl?: true
    audioUrl?: true
    audioDurationSec?: true
    stickerId?: true
    isHidden?: true
    createdAt?: true
  }

  export type CommunityPostMaxAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    imageUrl?: true
    audioUrl?: true
    audioDurationSec?: true
    stickerId?: true
    isHidden?: true
    createdAt?: true
  }

  export type CommunityPostCountAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    imageUrl?: true
    audioUrl?: true
    audioDurationSec?: true
    stickerId?: true
    isHidden?: true
    createdAt?: true
    _all?: true
  }

  export type CommunityPostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityPost to aggregate.
     */
    where?: CommunityPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityPosts to fetch.
     */
    orderBy?: CommunityPostOrderByWithRelationInput | CommunityPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityPosts
    **/
    _count?: true | CommunityPostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommunityPostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommunityPostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityPostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityPostMaxAggregateInputType
  }

  export type GetCommunityPostAggregateType<T extends CommunityPostAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityPost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityPost[P]>
      : GetScalarType<T[P], AggregateCommunityPost[P]>
  }




  export type CommunityPostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityPostWhereInput
    orderBy?: CommunityPostOrderByWithAggregationInput | CommunityPostOrderByWithAggregationInput[]
    by: CommunityPostScalarFieldEnum[] | CommunityPostScalarFieldEnum
    having?: CommunityPostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityPostCountAggregateInputType | true
    _avg?: CommunityPostAvgAggregateInputType
    _sum?: CommunityPostSumAggregateInputType
    _min?: CommunityPostMinAggregateInputType
    _max?: CommunityPostMaxAggregateInputType
  }

  export type CommunityPostGroupByOutputType = {
    id: string
    userId: string
    content: string | null
    imageUrl: string | null
    audioUrl: string | null
    audioDurationSec: number | null
    stickerId: string | null
    isHidden: boolean
    createdAt: Date
    _count: CommunityPostCountAggregateOutputType | null
    _avg: CommunityPostAvgAggregateOutputType | null
    _sum: CommunityPostSumAggregateOutputType | null
    _min: CommunityPostMinAggregateOutputType | null
    _max: CommunityPostMaxAggregateOutputType | null
  }

  type GetCommunityPostGroupByPayload<T extends CommunityPostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityPostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityPostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityPostGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityPostGroupByOutputType[P]>
        }
      >
    >


  export type CommunityPostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    imageUrl?: boolean
    audioUrl?: boolean
    audioDurationSec?: boolean
    stickerId?: boolean
    isHidden?: boolean
    createdAt?: boolean
    comments?: boolean | CommunityPost$commentsArgs<ExtArgs>
    likes?: boolean | CommunityPost$likesArgs<ExtArgs>
    _count?: boolean | CommunityPostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityPost"]>

  export type CommunityPostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    imageUrl?: boolean
    audioUrl?: boolean
    audioDurationSec?: boolean
    stickerId?: boolean
    isHidden?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityPost"]>

  export type CommunityPostSelectScalar = {
    id?: boolean
    userId?: boolean
    content?: boolean
    imageUrl?: boolean
    audioUrl?: boolean
    audioDurationSec?: boolean
    stickerId?: boolean
    isHidden?: boolean
    createdAt?: boolean
  }

  export type CommunityPostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | CommunityPost$commentsArgs<ExtArgs>
    likes?: boolean | CommunityPost$likesArgs<ExtArgs>
    _count?: boolean | CommunityPostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommunityPostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CommunityPostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityPost"
    objects: {
      comments: Prisma.$CommunityCommentPayload<ExtArgs>[]
      likes: Prisma.$CommunityLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      content: string | null
      imageUrl: string | null
      audioUrl: string | null
      audioDurationSec: number | null
      stickerId: string | null
      isHidden: boolean
      createdAt: Date
    }, ExtArgs["result"]["communityPost"]>
    composites: {}
  }

  type CommunityPostGetPayload<S extends boolean | null | undefined | CommunityPostDefaultArgs> = $Result.GetResult<Prisma.$CommunityPostPayload, S>

  type CommunityPostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunityPostFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunityPostCountAggregateInputType | true
    }

  export interface CommunityPostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityPost'], meta: { name: 'CommunityPost' } }
    /**
     * Find zero or one CommunityPost that matches the filter.
     * @param {CommunityPostFindUniqueArgs} args - Arguments to find a CommunityPost
     * @example
     * // Get one CommunityPost
     * const communityPost = await prisma.communityPost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityPostFindUniqueArgs>(args: SelectSubset<T, CommunityPostFindUniqueArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunityPost that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunityPostFindUniqueOrThrowArgs} args - Arguments to find a CommunityPost
     * @example
     * // Get one CommunityPost
     * const communityPost = await prisma.communityPost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityPostFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityPostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunityPost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostFindFirstArgs} args - Arguments to find a CommunityPost
     * @example
     * // Get one CommunityPost
     * const communityPost = await prisma.communityPost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityPostFindFirstArgs>(args?: SelectSubset<T, CommunityPostFindFirstArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunityPost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostFindFirstOrThrowArgs} args - Arguments to find a CommunityPost
     * @example
     * // Get one CommunityPost
     * const communityPost = await prisma.communityPost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityPostFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityPostFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunityPosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityPosts
     * const communityPosts = await prisma.communityPost.findMany()
     * 
     * // Get first 10 CommunityPosts
     * const communityPosts = await prisma.communityPost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityPostWithIdOnly = await prisma.communityPost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityPostFindManyArgs>(args?: SelectSubset<T, CommunityPostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunityPost.
     * @param {CommunityPostCreateArgs} args - Arguments to create a CommunityPost.
     * @example
     * // Create one CommunityPost
     * const CommunityPost = await prisma.communityPost.create({
     *   data: {
     *     // ... data to create a CommunityPost
     *   }
     * })
     * 
     */
    create<T extends CommunityPostCreateArgs>(args: SelectSubset<T, CommunityPostCreateArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunityPosts.
     * @param {CommunityPostCreateManyArgs} args - Arguments to create many CommunityPosts.
     * @example
     * // Create many CommunityPosts
     * const communityPost = await prisma.communityPost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityPostCreateManyArgs>(args?: SelectSubset<T, CommunityPostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityPosts and returns the data saved in the database.
     * @param {CommunityPostCreateManyAndReturnArgs} args - Arguments to create many CommunityPosts.
     * @example
     * // Create many CommunityPosts
     * const communityPost = await prisma.communityPost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityPosts and only return the `id`
     * const communityPostWithIdOnly = await prisma.communityPost.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityPostCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityPostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunityPost.
     * @param {CommunityPostDeleteArgs} args - Arguments to delete one CommunityPost.
     * @example
     * // Delete one CommunityPost
     * const CommunityPost = await prisma.communityPost.delete({
     *   where: {
     *     // ... filter to delete one CommunityPost
     *   }
     * })
     * 
     */
    delete<T extends CommunityPostDeleteArgs>(args: SelectSubset<T, CommunityPostDeleteArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunityPost.
     * @param {CommunityPostUpdateArgs} args - Arguments to update one CommunityPost.
     * @example
     * // Update one CommunityPost
     * const communityPost = await prisma.communityPost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityPostUpdateArgs>(args: SelectSubset<T, CommunityPostUpdateArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunityPosts.
     * @param {CommunityPostDeleteManyArgs} args - Arguments to filter CommunityPosts to delete.
     * @example
     * // Delete a few CommunityPosts
     * const { count } = await prisma.communityPost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityPostDeleteManyArgs>(args?: SelectSubset<T, CommunityPostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityPosts
     * const communityPost = await prisma.communityPost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityPostUpdateManyArgs>(args: SelectSubset<T, CommunityPostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunityPost.
     * @param {CommunityPostUpsertArgs} args - Arguments to update or create a CommunityPost.
     * @example
     * // Update or create a CommunityPost
     * const communityPost = await prisma.communityPost.upsert({
     *   create: {
     *     // ... data to create a CommunityPost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityPost we want to update
     *   }
     * })
     */
    upsert<T extends CommunityPostUpsertArgs>(args: SelectSubset<T, CommunityPostUpsertArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunityPosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostCountArgs} args - Arguments to filter CommunityPosts to count.
     * @example
     * // Count the number of CommunityPosts
     * const count = await prisma.communityPost.count({
     *   where: {
     *     // ... the filter for the CommunityPosts we want to count
     *   }
     * })
    **/
    count<T extends CommunityPostCountArgs>(
      args?: Subset<T, CommunityPostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityPostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityPostAggregateArgs>(args: Subset<T, CommunityPostAggregateArgs>): Prisma.PrismaPromise<GetCommunityPostAggregateType<T>>

    /**
     * Group by CommunityPost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityPostGroupByArgs} args - Group by arguments.
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
      T extends CommunityPostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityPostGroupByArgs['orderBy'] }
        : { orderBy?: CommunityPostGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityPostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityPost model
   */
  readonly fields: CommunityPostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityPost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityPostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    comments<T extends CommunityPost$commentsArgs<ExtArgs> = {}>(args?: Subset<T, CommunityPost$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findMany"> | Null>
    likes<T extends CommunityPost$likesArgs<ExtArgs> = {}>(args?: Subset<T, CommunityPost$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the CommunityPost model
   */ 
  interface CommunityPostFieldRefs {
    readonly id: FieldRef<"CommunityPost", 'String'>
    readonly userId: FieldRef<"CommunityPost", 'String'>
    readonly content: FieldRef<"CommunityPost", 'String'>
    readonly imageUrl: FieldRef<"CommunityPost", 'String'>
    readonly audioUrl: FieldRef<"CommunityPost", 'String'>
    readonly audioDurationSec: FieldRef<"CommunityPost", 'Int'>
    readonly stickerId: FieldRef<"CommunityPost", 'String'>
    readonly isHidden: FieldRef<"CommunityPost", 'Boolean'>
    readonly createdAt: FieldRef<"CommunityPost", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityPost findUnique
   */
  export type CommunityPostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * Filter, which CommunityPost to fetch.
     */
    where: CommunityPostWhereUniqueInput
  }

  /**
   * CommunityPost findUniqueOrThrow
   */
  export type CommunityPostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * Filter, which CommunityPost to fetch.
     */
    where: CommunityPostWhereUniqueInput
  }

  /**
   * CommunityPost findFirst
   */
  export type CommunityPostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * Filter, which CommunityPost to fetch.
     */
    where?: CommunityPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityPosts to fetch.
     */
    orderBy?: CommunityPostOrderByWithRelationInput | CommunityPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityPosts.
     */
    cursor?: CommunityPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityPosts.
     */
    distinct?: CommunityPostScalarFieldEnum | CommunityPostScalarFieldEnum[]
  }

  /**
   * CommunityPost findFirstOrThrow
   */
  export type CommunityPostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * Filter, which CommunityPost to fetch.
     */
    where?: CommunityPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityPosts to fetch.
     */
    orderBy?: CommunityPostOrderByWithRelationInput | CommunityPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityPosts.
     */
    cursor?: CommunityPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityPosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityPosts.
     */
    distinct?: CommunityPostScalarFieldEnum | CommunityPostScalarFieldEnum[]
  }

  /**
   * CommunityPost findMany
   */
  export type CommunityPostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * Filter, which CommunityPosts to fetch.
     */
    where?: CommunityPostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityPosts to fetch.
     */
    orderBy?: CommunityPostOrderByWithRelationInput | CommunityPostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityPosts.
     */
    cursor?: CommunityPostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityPosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityPosts.
     */
    skip?: number
    distinct?: CommunityPostScalarFieldEnum | CommunityPostScalarFieldEnum[]
  }

  /**
   * CommunityPost create
   */
  export type CommunityPostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * The data needed to create a CommunityPost.
     */
    data: XOR<CommunityPostCreateInput, CommunityPostUncheckedCreateInput>
  }

  /**
   * CommunityPost createMany
   */
  export type CommunityPostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityPosts.
     */
    data: CommunityPostCreateManyInput | CommunityPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityPost createManyAndReturn
   */
  export type CommunityPostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunityPosts.
     */
    data: CommunityPostCreateManyInput | CommunityPostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityPost update
   */
  export type CommunityPostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * The data needed to update a CommunityPost.
     */
    data: XOR<CommunityPostUpdateInput, CommunityPostUncheckedUpdateInput>
    /**
     * Choose, which CommunityPost to update.
     */
    where: CommunityPostWhereUniqueInput
  }

  /**
   * CommunityPost updateMany
   */
  export type CommunityPostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityPosts.
     */
    data: XOR<CommunityPostUpdateManyMutationInput, CommunityPostUncheckedUpdateManyInput>
    /**
     * Filter which CommunityPosts to update
     */
    where?: CommunityPostWhereInput
  }

  /**
   * CommunityPost upsert
   */
  export type CommunityPostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * The filter to search for the CommunityPost to update in case it exists.
     */
    where: CommunityPostWhereUniqueInput
    /**
     * In case the CommunityPost found by the `where` argument doesn't exist, create a new CommunityPost with this data.
     */
    create: XOR<CommunityPostCreateInput, CommunityPostUncheckedCreateInput>
    /**
     * In case the CommunityPost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityPostUpdateInput, CommunityPostUncheckedUpdateInput>
  }

  /**
   * CommunityPost delete
   */
  export type CommunityPostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
    /**
     * Filter which CommunityPost to delete.
     */
    where: CommunityPostWhereUniqueInput
  }

  /**
   * CommunityPost deleteMany
   */
  export type CommunityPostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityPosts to delete
     */
    where?: CommunityPostWhereInput
  }

  /**
   * CommunityPost.comments
   */
  export type CommunityPost$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    where?: CommunityCommentWhereInput
    orderBy?: CommunityCommentOrderByWithRelationInput | CommunityCommentOrderByWithRelationInput[]
    cursor?: CommunityCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommunityCommentScalarFieldEnum | CommunityCommentScalarFieldEnum[]
  }

  /**
   * CommunityPost.likes
   */
  export type CommunityPost$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    where?: CommunityLikeWhereInput
    orderBy?: CommunityLikeOrderByWithRelationInput | CommunityLikeOrderByWithRelationInput[]
    cursor?: CommunityLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommunityLikeScalarFieldEnum | CommunityLikeScalarFieldEnum[]
  }

  /**
   * CommunityPost without action
   */
  export type CommunityPostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityPost
     */
    select?: CommunityPostSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityPostInclude<ExtArgs> | null
  }


  /**
   * Model CommunityComment
   */

  export type AggregateCommunityComment = {
    _count: CommunityCommentCountAggregateOutputType | null
    _min: CommunityCommentMinAggregateOutputType | null
    _max: CommunityCommentMaxAggregateOutputType | null
  }

  export type CommunityCommentMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    content: string | null
    stickerId: string | null
    parentId: string | null
    createdAt: Date | null
  }

  export type CommunityCommentMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    content: string | null
    stickerId: string | null
    parentId: string | null
    createdAt: Date | null
  }

  export type CommunityCommentCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    content: number
    stickerId: number
    parentId: number
    createdAt: number
    _all: number
  }


  export type CommunityCommentMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    stickerId?: true
    parentId?: true
    createdAt?: true
  }

  export type CommunityCommentMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    stickerId?: true
    parentId?: true
    createdAt?: true
  }

  export type CommunityCommentCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    stickerId?: true
    parentId?: true
    createdAt?: true
    _all?: true
  }

  export type CommunityCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityComment to aggregate.
     */
    where?: CommunityCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityComments to fetch.
     */
    orderBy?: CommunityCommentOrderByWithRelationInput | CommunityCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityComments
    **/
    _count?: true | CommunityCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityCommentMaxAggregateInputType
  }

  export type GetCommunityCommentAggregateType<T extends CommunityCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityComment[P]>
      : GetScalarType<T[P], AggregateCommunityComment[P]>
  }




  export type CommunityCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityCommentWhereInput
    orderBy?: CommunityCommentOrderByWithAggregationInput | CommunityCommentOrderByWithAggregationInput[]
    by: CommunityCommentScalarFieldEnum[] | CommunityCommentScalarFieldEnum
    having?: CommunityCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityCommentCountAggregateInputType | true
    _min?: CommunityCommentMinAggregateInputType
    _max?: CommunityCommentMaxAggregateInputType
  }

  export type CommunityCommentGroupByOutputType = {
    id: string
    postId: string
    userId: string
    content: string | null
    stickerId: string | null
    parentId: string | null
    createdAt: Date
    _count: CommunityCommentCountAggregateOutputType | null
    _min: CommunityCommentMinAggregateOutputType | null
    _max: CommunityCommentMaxAggregateOutputType | null
  }

  type GetCommunityCommentGroupByPayload<T extends CommunityCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityCommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityCommentGroupByOutputType[P]>
        }
      >
    >


  export type CommunityCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    stickerId?: boolean
    parentId?: boolean
    createdAt?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
    parent?: boolean | CommunityComment$parentArgs<ExtArgs>
    replies?: boolean | CommunityComment$repliesArgs<ExtArgs>
    _count?: boolean | CommunityCommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityComment"]>

  export type CommunityCommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    stickerId?: boolean
    parentId?: boolean
    createdAt?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
    parent?: boolean | CommunityComment$parentArgs<ExtArgs>
  }, ExtArgs["result"]["communityComment"]>

  export type CommunityCommentSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    stickerId?: boolean
    parentId?: boolean
    createdAt?: boolean
  }

  export type CommunityCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
    parent?: boolean | CommunityComment$parentArgs<ExtArgs>
    replies?: boolean | CommunityComment$repliesArgs<ExtArgs>
    _count?: boolean | CommunityCommentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommunityCommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
    parent?: boolean | CommunityComment$parentArgs<ExtArgs>
  }

  export type $CommunityCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityComment"
    objects: {
      post: Prisma.$CommunityPostPayload<ExtArgs>
      parent: Prisma.$CommunityCommentPayload<ExtArgs> | null
      replies: Prisma.$CommunityCommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      content: string | null
      stickerId: string | null
      parentId: string | null
      createdAt: Date
    }, ExtArgs["result"]["communityComment"]>
    composites: {}
  }

  type CommunityCommentGetPayload<S extends boolean | null | undefined | CommunityCommentDefaultArgs> = $Result.GetResult<Prisma.$CommunityCommentPayload, S>

  type CommunityCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunityCommentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunityCommentCountAggregateInputType | true
    }

  export interface CommunityCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityComment'], meta: { name: 'CommunityComment' } }
    /**
     * Find zero or one CommunityComment that matches the filter.
     * @param {CommunityCommentFindUniqueArgs} args - Arguments to find a CommunityComment
     * @example
     * // Get one CommunityComment
     * const communityComment = await prisma.communityComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityCommentFindUniqueArgs>(args: SelectSubset<T, CommunityCommentFindUniqueArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunityComment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunityCommentFindUniqueOrThrowArgs} args - Arguments to find a CommunityComment
     * @example
     * // Get one CommunityComment
     * const communityComment = await prisma.communityComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunityComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentFindFirstArgs} args - Arguments to find a CommunityComment
     * @example
     * // Get one CommunityComment
     * const communityComment = await prisma.communityComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityCommentFindFirstArgs>(args?: SelectSubset<T, CommunityCommentFindFirstArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunityComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentFindFirstOrThrowArgs} args - Arguments to find a CommunityComment
     * @example
     * // Get one CommunityComment
     * const communityComment = await prisma.communityComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunityComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityComments
     * const communityComments = await prisma.communityComment.findMany()
     * 
     * // Get first 10 CommunityComments
     * const communityComments = await prisma.communityComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityCommentWithIdOnly = await prisma.communityComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityCommentFindManyArgs>(args?: SelectSubset<T, CommunityCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunityComment.
     * @param {CommunityCommentCreateArgs} args - Arguments to create a CommunityComment.
     * @example
     * // Create one CommunityComment
     * const CommunityComment = await prisma.communityComment.create({
     *   data: {
     *     // ... data to create a CommunityComment
     *   }
     * })
     * 
     */
    create<T extends CommunityCommentCreateArgs>(args: SelectSubset<T, CommunityCommentCreateArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunityComments.
     * @param {CommunityCommentCreateManyArgs} args - Arguments to create many CommunityComments.
     * @example
     * // Create many CommunityComments
     * const communityComment = await prisma.communityComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityCommentCreateManyArgs>(args?: SelectSubset<T, CommunityCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityComments and returns the data saved in the database.
     * @param {CommunityCommentCreateManyAndReturnArgs} args - Arguments to create many CommunityComments.
     * @example
     * // Create many CommunityComments
     * const communityComment = await prisma.communityComment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityComments and only return the `id`
     * const communityCommentWithIdOnly = await prisma.communityComment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityCommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunityComment.
     * @param {CommunityCommentDeleteArgs} args - Arguments to delete one CommunityComment.
     * @example
     * // Delete one CommunityComment
     * const CommunityComment = await prisma.communityComment.delete({
     *   where: {
     *     // ... filter to delete one CommunityComment
     *   }
     * })
     * 
     */
    delete<T extends CommunityCommentDeleteArgs>(args: SelectSubset<T, CommunityCommentDeleteArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunityComment.
     * @param {CommunityCommentUpdateArgs} args - Arguments to update one CommunityComment.
     * @example
     * // Update one CommunityComment
     * const communityComment = await prisma.communityComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityCommentUpdateArgs>(args: SelectSubset<T, CommunityCommentUpdateArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunityComments.
     * @param {CommunityCommentDeleteManyArgs} args - Arguments to filter CommunityComments to delete.
     * @example
     * // Delete a few CommunityComments
     * const { count } = await prisma.communityComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityCommentDeleteManyArgs>(args?: SelectSubset<T, CommunityCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityComments
     * const communityComment = await prisma.communityComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityCommentUpdateManyArgs>(args: SelectSubset<T, CommunityCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunityComment.
     * @param {CommunityCommentUpsertArgs} args - Arguments to update or create a CommunityComment.
     * @example
     * // Update or create a CommunityComment
     * const communityComment = await prisma.communityComment.upsert({
     *   create: {
     *     // ... data to create a CommunityComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityComment we want to update
     *   }
     * })
     */
    upsert<T extends CommunityCommentUpsertArgs>(args: SelectSubset<T, CommunityCommentUpsertArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunityComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentCountArgs} args - Arguments to filter CommunityComments to count.
     * @example
     * // Count the number of CommunityComments
     * const count = await prisma.communityComment.count({
     *   where: {
     *     // ... the filter for the CommunityComments we want to count
     *   }
     * })
    **/
    count<T extends CommunityCommentCountArgs>(
      args?: Subset<T, CommunityCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityCommentAggregateArgs>(args: Subset<T, CommunityCommentAggregateArgs>): Prisma.PrismaPromise<GetCommunityCommentAggregateType<T>>

    /**
     * Group by CommunityComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityCommentGroupByArgs} args - Group by arguments.
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
      T extends CommunityCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityCommentGroupByArgs['orderBy'] }
        : { orderBy?: CommunityCommentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityComment model
   */
  readonly fields: CommunityCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends CommunityPostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommunityPostDefaultArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    parent<T extends CommunityComment$parentArgs<ExtArgs> = {}>(args?: Subset<T, CommunityComment$parentArgs<ExtArgs>>): Prisma__CommunityCommentClient<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    replies<T extends CommunityComment$repliesArgs<ExtArgs> = {}>(args?: Subset<T, CommunityComment$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityCommentPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the CommunityComment model
   */ 
  interface CommunityCommentFieldRefs {
    readonly id: FieldRef<"CommunityComment", 'String'>
    readonly postId: FieldRef<"CommunityComment", 'String'>
    readonly userId: FieldRef<"CommunityComment", 'String'>
    readonly content: FieldRef<"CommunityComment", 'String'>
    readonly stickerId: FieldRef<"CommunityComment", 'String'>
    readonly parentId: FieldRef<"CommunityComment", 'String'>
    readonly createdAt: FieldRef<"CommunityComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityComment findUnique
   */
  export type CommunityCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * Filter, which CommunityComment to fetch.
     */
    where: CommunityCommentWhereUniqueInput
  }

  /**
   * CommunityComment findUniqueOrThrow
   */
  export type CommunityCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * Filter, which CommunityComment to fetch.
     */
    where: CommunityCommentWhereUniqueInput
  }

  /**
   * CommunityComment findFirst
   */
  export type CommunityCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * Filter, which CommunityComment to fetch.
     */
    where?: CommunityCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityComments to fetch.
     */
    orderBy?: CommunityCommentOrderByWithRelationInput | CommunityCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityComments.
     */
    cursor?: CommunityCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityComments.
     */
    distinct?: CommunityCommentScalarFieldEnum | CommunityCommentScalarFieldEnum[]
  }

  /**
   * CommunityComment findFirstOrThrow
   */
  export type CommunityCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * Filter, which CommunityComment to fetch.
     */
    where?: CommunityCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityComments to fetch.
     */
    orderBy?: CommunityCommentOrderByWithRelationInput | CommunityCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityComments.
     */
    cursor?: CommunityCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityComments.
     */
    distinct?: CommunityCommentScalarFieldEnum | CommunityCommentScalarFieldEnum[]
  }

  /**
   * CommunityComment findMany
   */
  export type CommunityCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * Filter, which CommunityComments to fetch.
     */
    where?: CommunityCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityComments to fetch.
     */
    orderBy?: CommunityCommentOrderByWithRelationInput | CommunityCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityComments.
     */
    cursor?: CommunityCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityComments.
     */
    skip?: number
    distinct?: CommunityCommentScalarFieldEnum | CommunityCommentScalarFieldEnum[]
  }

  /**
   * CommunityComment create
   */
  export type CommunityCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a CommunityComment.
     */
    data: XOR<CommunityCommentCreateInput, CommunityCommentUncheckedCreateInput>
  }

  /**
   * CommunityComment createMany
   */
  export type CommunityCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityComments.
     */
    data: CommunityCommentCreateManyInput | CommunityCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityComment createManyAndReturn
   */
  export type CommunityCommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunityComments.
     */
    data: CommunityCommentCreateManyInput | CommunityCommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CommunityComment update
   */
  export type CommunityCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a CommunityComment.
     */
    data: XOR<CommunityCommentUpdateInput, CommunityCommentUncheckedUpdateInput>
    /**
     * Choose, which CommunityComment to update.
     */
    where: CommunityCommentWhereUniqueInput
  }

  /**
   * CommunityComment updateMany
   */
  export type CommunityCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityComments.
     */
    data: XOR<CommunityCommentUpdateManyMutationInput, CommunityCommentUncheckedUpdateManyInput>
    /**
     * Filter which CommunityComments to update
     */
    where?: CommunityCommentWhereInput
  }

  /**
   * CommunityComment upsert
   */
  export type CommunityCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the CommunityComment to update in case it exists.
     */
    where: CommunityCommentWhereUniqueInput
    /**
     * In case the CommunityComment found by the `where` argument doesn't exist, create a new CommunityComment with this data.
     */
    create: XOR<CommunityCommentCreateInput, CommunityCommentUncheckedCreateInput>
    /**
     * In case the CommunityComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityCommentUpdateInput, CommunityCommentUncheckedUpdateInput>
  }

  /**
   * CommunityComment delete
   */
  export type CommunityCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    /**
     * Filter which CommunityComment to delete.
     */
    where: CommunityCommentWhereUniqueInput
  }

  /**
   * CommunityComment deleteMany
   */
  export type CommunityCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityComments to delete
     */
    where?: CommunityCommentWhereInput
  }

  /**
   * CommunityComment.parent
   */
  export type CommunityComment$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    where?: CommunityCommentWhereInput
  }

  /**
   * CommunityComment.replies
   */
  export type CommunityComment$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
    where?: CommunityCommentWhereInput
    orderBy?: CommunityCommentOrderByWithRelationInput | CommunityCommentOrderByWithRelationInput[]
    cursor?: CommunityCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommunityCommentScalarFieldEnum | CommunityCommentScalarFieldEnum[]
  }

  /**
   * CommunityComment without action
   */
  export type CommunityCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityComment
     */
    select?: CommunityCommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityCommentInclude<ExtArgs> | null
  }


  /**
   * Model CommunityLike
   */

  export type AggregateCommunityLike = {
    _count: CommunityLikeCountAggregateOutputType | null
    _min: CommunityLikeMinAggregateOutputType | null
    _max: CommunityLikeMaxAggregateOutputType | null
  }

  export type CommunityLikeMinAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type CommunityLikeMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type CommunityLikeCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type CommunityLikeMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
  }

  export type CommunityLikeMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
  }

  export type CommunityLikeCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type CommunityLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityLike to aggregate.
     */
    where?: CommunityLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityLikes to fetch.
     */
    orderBy?: CommunityLikeOrderByWithRelationInput | CommunityLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityLikes
    **/
    _count?: true | CommunityLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityLikeMaxAggregateInputType
  }

  export type GetCommunityLikeAggregateType<T extends CommunityLikeAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityLike[P]>
      : GetScalarType<T[P], AggregateCommunityLike[P]>
  }




  export type CommunityLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityLikeWhereInput
    orderBy?: CommunityLikeOrderByWithAggregationInput | CommunityLikeOrderByWithAggregationInput[]
    by: CommunityLikeScalarFieldEnum[] | CommunityLikeScalarFieldEnum
    having?: CommunityLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityLikeCountAggregateInputType | true
    _min?: CommunityLikeMinAggregateInputType
    _max?: CommunityLikeMaxAggregateInputType
  }

  export type CommunityLikeGroupByOutputType = {
    id: string
    postId: string
    userId: string
    createdAt: Date
    _count: CommunityLikeCountAggregateOutputType | null
    _min: CommunityLikeMinAggregateOutputType | null
    _max: CommunityLikeMaxAggregateOutputType | null
  }

  type GetCommunityLikeGroupByPayload<T extends CommunityLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityLikeGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityLikeGroupByOutputType[P]>
        }
      >
    >


  export type CommunityLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityLike"]>

  export type CommunityLikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityLike"]>

  export type CommunityLikeSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type CommunityLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }
  export type CommunityLikeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }

  export type $CommunityLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityLike"
    objects: {
      post: Prisma.$CommunityPostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["communityLike"]>
    composites: {}
  }

  type CommunityLikeGetPayload<S extends boolean | null | undefined | CommunityLikeDefaultArgs> = $Result.GetResult<Prisma.$CommunityLikePayload, S>

  type CommunityLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunityLikeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunityLikeCountAggregateInputType | true
    }

  export interface CommunityLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityLike'], meta: { name: 'CommunityLike' } }
    /**
     * Find zero or one CommunityLike that matches the filter.
     * @param {CommunityLikeFindUniqueArgs} args - Arguments to find a CommunityLike
     * @example
     * // Get one CommunityLike
     * const communityLike = await prisma.communityLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityLikeFindUniqueArgs>(args: SelectSubset<T, CommunityLikeFindUniqueArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunityLike that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunityLikeFindUniqueOrThrowArgs} args - Arguments to find a CommunityLike
     * @example
     * // Get one CommunityLike
     * const communityLike = await prisma.communityLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunityLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeFindFirstArgs} args - Arguments to find a CommunityLike
     * @example
     * // Get one CommunityLike
     * const communityLike = await prisma.communityLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityLikeFindFirstArgs>(args?: SelectSubset<T, CommunityLikeFindFirstArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunityLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeFindFirstOrThrowArgs} args - Arguments to find a CommunityLike
     * @example
     * // Get one CommunityLike
     * const communityLike = await prisma.communityLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunityLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityLikes
     * const communityLikes = await prisma.communityLike.findMany()
     * 
     * // Get first 10 CommunityLikes
     * const communityLikes = await prisma.communityLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityLikeWithIdOnly = await prisma.communityLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityLikeFindManyArgs>(args?: SelectSubset<T, CommunityLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunityLike.
     * @param {CommunityLikeCreateArgs} args - Arguments to create a CommunityLike.
     * @example
     * // Create one CommunityLike
     * const CommunityLike = await prisma.communityLike.create({
     *   data: {
     *     // ... data to create a CommunityLike
     *   }
     * })
     * 
     */
    create<T extends CommunityLikeCreateArgs>(args: SelectSubset<T, CommunityLikeCreateArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunityLikes.
     * @param {CommunityLikeCreateManyArgs} args - Arguments to create many CommunityLikes.
     * @example
     * // Create many CommunityLikes
     * const communityLike = await prisma.communityLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityLikeCreateManyArgs>(args?: SelectSubset<T, CommunityLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityLikes and returns the data saved in the database.
     * @param {CommunityLikeCreateManyAndReturnArgs} args - Arguments to create many CommunityLikes.
     * @example
     * // Create many CommunityLikes
     * const communityLike = await prisma.communityLike.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityLikes and only return the `id`
     * const communityLikeWithIdOnly = await prisma.communityLike.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityLikeCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityLikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunityLike.
     * @param {CommunityLikeDeleteArgs} args - Arguments to delete one CommunityLike.
     * @example
     * // Delete one CommunityLike
     * const CommunityLike = await prisma.communityLike.delete({
     *   where: {
     *     // ... filter to delete one CommunityLike
     *   }
     * })
     * 
     */
    delete<T extends CommunityLikeDeleteArgs>(args: SelectSubset<T, CommunityLikeDeleteArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunityLike.
     * @param {CommunityLikeUpdateArgs} args - Arguments to update one CommunityLike.
     * @example
     * // Update one CommunityLike
     * const communityLike = await prisma.communityLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityLikeUpdateArgs>(args: SelectSubset<T, CommunityLikeUpdateArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunityLikes.
     * @param {CommunityLikeDeleteManyArgs} args - Arguments to filter CommunityLikes to delete.
     * @example
     * // Delete a few CommunityLikes
     * const { count } = await prisma.communityLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityLikeDeleteManyArgs>(args?: SelectSubset<T, CommunityLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityLikes
     * const communityLike = await prisma.communityLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityLikeUpdateManyArgs>(args: SelectSubset<T, CommunityLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunityLike.
     * @param {CommunityLikeUpsertArgs} args - Arguments to update or create a CommunityLike.
     * @example
     * // Update or create a CommunityLike
     * const communityLike = await prisma.communityLike.upsert({
     *   create: {
     *     // ... data to create a CommunityLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityLike we want to update
     *   }
     * })
     */
    upsert<T extends CommunityLikeUpsertArgs>(args: SelectSubset<T, CommunityLikeUpsertArgs<ExtArgs>>): Prisma__CommunityLikeClient<$Result.GetResult<Prisma.$CommunityLikePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunityLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeCountArgs} args - Arguments to filter CommunityLikes to count.
     * @example
     * // Count the number of CommunityLikes
     * const count = await prisma.communityLike.count({
     *   where: {
     *     // ... the filter for the CommunityLikes we want to count
     *   }
     * })
    **/
    count<T extends CommunityLikeCountArgs>(
      args?: Subset<T, CommunityLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityLikeAggregateArgs>(args: Subset<T, CommunityLikeAggregateArgs>): Prisma.PrismaPromise<GetCommunityLikeAggregateType<T>>

    /**
     * Group by CommunityLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityLikeGroupByArgs} args - Group by arguments.
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
      T extends CommunityLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityLikeGroupByArgs['orderBy'] }
        : { orderBy?: CommunityLikeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityLike model
   */
  readonly fields: CommunityLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends CommunityPostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CommunityPostDefaultArgs<ExtArgs>>): Prisma__CommunityPostClient<$Result.GetResult<Prisma.$CommunityPostPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the CommunityLike model
   */ 
  interface CommunityLikeFieldRefs {
    readonly id: FieldRef<"CommunityLike", 'String'>
    readonly postId: FieldRef<"CommunityLike", 'String'>
    readonly userId: FieldRef<"CommunityLike", 'String'>
    readonly createdAt: FieldRef<"CommunityLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityLike findUnique
   */
  export type CommunityLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * Filter, which CommunityLike to fetch.
     */
    where: CommunityLikeWhereUniqueInput
  }

  /**
   * CommunityLike findUniqueOrThrow
   */
  export type CommunityLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * Filter, which CommunityLike to fetch.
     */
    where: CommunityLikeWhereUniqueInput
  }

  /**
   * CommunityLike findFirst
   */
  export type CommunityLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * Filter, which CommunityLike to fetch.
     */
    where?: CommunityLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityLikes to fetch.
     */
    orderBy?: CommunityLikeOrderByWithRelationInput | CommunityLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityLikes.
     */
    cursor?: CommunityLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityLikes.
     */
    distinct?: CommunityLikeScalarFieldEnum | CommunityLikeScalarFieldEnum[]
  }

  /**
   * CommunityLike findFirstOrThrow
   */
  export type CommunityLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * Filter, which CommunityLike to fetch.
     */
    where?: CommunityLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityLikes to fetch.
     */
    orderBy?: CommunityLikeOrderByWithRelationInput | CommunityLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityLikes.
     */
    cursor?: CommunityLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityLikes.
     */
    distinct?: CommunityLikeScalarFieldEnum | CommunityLikeScalarFieldEnum[]
  }

  /**
   * CommunityLike findMany
   */
  export type CommunityLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * Filter, which CommunityLikes to fetch.
     */
    where?: CommunityLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityLikes to fetch.
     */
    orderBy?: CommunityLikeOrderByWithRelationInput | CommunityLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityLikes.
     */
    cursor?: CommunityLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityLikes.
     */
    skip?: number
    distinct?: CommunityLikeScalarFieldEnum | CommunityLikeScalarFieldEnum[]
  }

  /**
   * CommunityLike create
   */
  export type CommunityLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a CommunityLike.
     */
    data: XOR<CommunityLikeCreateInput, CommunityLikeUncheckedCreateInput>
  }

  /**
   * CommunityLike createMany
   */
  export type CommunityLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityLikes.
     */
    data: CommunityLikeCreateManyInput | CommunityLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityLike createManyAndReturn
   */
  export type CommunityLikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunityLikes.
     */
    data: CommunityLikeCreateManyInput | CommunityLikeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CommunityLike update
   */
  export type CommunityLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a CommunityLike.
     */
    data: XOR<CommunityLikeUpdateInput, CommunityLikeUncheckedUpdateInput>
    /**
     * Choose, which CommunityLike to update.
     */
    where: CommunityLikeWhereUniqueInput
  }

  /**
   * CommunityLike updateMany
   */
  export type CommunityLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityLikes.
     */
    data: XOR<CommunityLikeUpdateManyMutationInput, CommunityLikeUncheckedUpdateManyInput>
    /**
     * Filter which CommunityLikes to update
     */
    where?: CommunityLikeWhereInput
  }

  /**
   * CommunityLike upsert
   */
  export type CommunityLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the CommunityLike to update in case it exists.
     */
    where: CommunityLikeWhereUniqueInput
    /**
     * In case the CommunityLike found by the `where` argument doesn't exist, create a new CommunityLike with this data.
     */
    create: XOR<CommunityLikeCreateInput, CommunityLikeUncheckedCreateInput>
    /**
     * In case the CommunityLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityLikeUpdateInput, CommunityLikeUncheckedUpdateInput>
  }

  /**
   * CommunityLike delete
   */
  export type CommunityLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
    /**
     * Filter which CommunityLike to delete.
     */
    where: CommunityLikeWhereUniqueInput
  }

  /**
   * CommunityLike deleteMany
   */
  export type CommunityLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityLikes to delete
     */
    where?: CommunityLikeWhereInput
  }

  /**
   * CommunityLike without action
   */
  export type CommunityLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityLike
     */
    select?: CommunityLikeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunityLikeInclude<ExtArgs> | null
  }


  /**
   * Model DirectConversation
   */

  export type AggregateDirectConversation = {
    _count: DirectConversationCountAggregateOutputType | null
    _min: DirectConversationMinAggregateOutputType | null
    _max: DirectConversationMaxAggregateOutputType | null
  }

  export type DirectConversationMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastMessageAt: Date | null
  }

  export type DirectConversationMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastMessageAt: Date | null
  }

  export type DirectConversationCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    lastMessageAt: number
    _all: number
  }


  export type DirectConversationMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    lastMessageAt?: true
  }

  export type DirectConversationMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    lastMessageAt?: true
  }

  export type DirectConversationCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    lastMessageAt?: true
    _all?: true
  }

  export type DirectConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectConversation to aggregate.
     */
    where?: DirectConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectConversations to fetch.
     */
    orderBy?: DirectConversationOrderByWithRelationInput | DirectConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DirectConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DirectConversations
    **/
    _count?: true | DirectConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DirectConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DirectConversationMaxAggregateInputType
  }

  export type GetDirectConversationAggregateType<T extends DirectConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateDirectConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDirectConversation[P]>
      : GetScalarType<T[P], AggregateDirectConversation[P]>
  }




  export type DirectConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectConversationWhereInput
    orderBy?: DirectConversationOrderByWithAggregationInput | DirectConversationOrderByWithAggregationInput[]
    by: DirectConversationScalarFieldEnum[] | DirectConversationScalarFieldEnum
    having?: DirectConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DirectConversationCountAggregateInputType | true
    _min?: DirectConversationMinAggregateInputType
    _max?: DirectConversationMaxAggregateInputType
  }

  export type DirectConversationGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    lastMessageAt: Date
    _count: DirectConversationCountAggregateOutputType | null
    _min: DirectConversationMinAggregateOutputType | null
    _max: DirectConversationMaxAggregateOutputType | null
  }

  type GetDirectConversationGroupByPayload<T extends DirectConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DirectConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DirectConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DirectConversationGroupByOutputType[P]>
            : GetScalarType<T[P], DirectConversationGroupByOutputType[P]>
        }
      >
    >


  export type DirectConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastMessageAt?: boolean
    participants?: boolean | DirectConversation$participantsArgs<ExtArgs>
    messages?: boolean | DirectConversation$messagesArgs<ExtArgs>
    _count?: boolean | DirectConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["directConversation"]>

  export type DirectConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastMessageAt?: boolean
  }, ExtArgs["result"]["directConversation"]>

  export type DirectConversationSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastMessageAt?: boolean
  }

  export type DirectConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | DirectConversation$participantsArgs<ExtArgs>
    messages?: boolean | DirectConversation$messagesArgs<ExtArgs>
    _count?: boolean | DirectConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DirectConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DirectConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DirectConversation"
    objects: {
      participants: Prisma.$DirectParticipantPayload<ExtArgs>[]
      messages: Prisma.$DirectMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      lastMessageAt: Date
    }, ExtArgs["result"]["directConversation"]>
    composites: {}
  }

  type DirectConversationGetPayload<S extends boolean | null | undefined | DirectConversationDefaultArgs> = $Result.GetResult<Prisma.$DirectConversationPayload, S>

  type DirectConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DirectConversationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DirectConversationCountAggregateInputType | true
    }

  export interface DirectConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DirectConversation'], meta: { name: 'DirectConversation' } }
    /**
     * Find zero or one DirectConversation that matches the filter.
     * @param {DirectConversationFindUniqueArgs} args - Arguments to find a DirectConversation
     * @example
     * // Get one DirectConversation
     * const directConversation = await prisma.directConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DirectConversationFindUniqueArgs>(args: SelectSubset<T, DirectConversationFindUniqueArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DirectConversation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DirectConversationFindUniqueOrThrowArgs} args - Arguments to find a DirectConversation
     * @example
     * // Get one DirectConversation
     * const directConversation = await prisma.directConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DirectConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, DirectConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DirectConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationFindFirstArgs} args - Arguments to find a DirectConversation
     * @example
     * // Get one DirectConversation
     * const directConversation = await prisma.directConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DirectConversationFindFirstArgs>(args?: SelectSubset<T, DirectConversationFindFirstArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DirectConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationFindFirstOrThrowArgs} args - Arguments to find a DirectConversation
     * @example
     * // Get one DirectConversation
     * const directConversation = await prisma.directConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DirectConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, DirectConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DirectConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DirectConversations
     * const directConversations = await prisma.directConversation.findMany()
     * 
     * // Get first 10 DirectConversations
     * const directConversations = await prisma.directConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const directConversationWithIdOnly = await prisma.directConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DirectConversationFindManyArgs>(args?: SelectSubset<T, DirectConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DirectConversation.
     * @param {DirectConversationCreateArgs} args - Arguments to create a DirectConversation.
     * @example
     * // Create one DirectConversation
     * const DirectConversation = await prisma.directConversation.create({
     *   data: {
     *     // ... data to create a DirectConversation
     *   }
     * })
     * 
     */
    create<T extends DirectConversationCreateArgs>(args: SelectSubset<T, DirectConversationCreateArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DirectConversations.
     * @param {DirectConversationCreateManyArgs} args - Arguments to create many DirectConversations.
     * @example
     * // Create many DirectConversations
     * const directConversation = await prisma.directConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DirectConversationCreateManyArgs>(args?: SelectSubset<T, DirectConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DirectConversations and returns the data saved in the database.
     * @param {DirectConversationCreateManyAndReturnArgs} args - Arguments to create many DirectConversations.
     * @example
     * // Create many DirectConversations
     * const directConversation = await prisma.directConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DirectConversations and only return the `id`
     * const directConversationWithIdOnly = await prisma.directConversation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DirectConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, DirectConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DirectConversation.
     * @param {DirectConversationDeleteArgs} args - Arguments to delete one DirectConversation.
     * @example
     * // Delete one DirectConversation
     * const DirectConversation = await prisma.directConversation.delete({
     *   where: {
     *     // ... filter to delete one DirectConversation
     *   }
     * })
     * 
     */
    delete<T extends DirectConversationDeleteArgs>(args: SelectSubset<T, DirectConversationDeleteArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DirectConversation.
     * @param {DirectConversationUpdateArgs} args - Arguments to update one DirectConversation.
     * @example
     * // Update one DirectConversation
     * const directConversation = await prisma.directConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DirectConversationUpdateArgs>(args: SelectSubset<T, DirectConversationUpdateArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DirectConversations.
     * @param {DirectConversationDeleteManyArgs} args - Arguments to filter DirectConversations to delete.
     * @example
     * // Delete a few DirectConversations
     * const { count } = await prisma.directConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DirectConversationDeleteManyArgs>(args?: SelectSubset<T, DirectConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DirectConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DirectConversations
     * const directConversation = await prisma.directConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DirectConversationUpdateManyArgs>(args: SelectSubset<T, DirectConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DirectConversation.
     * @param {DirectConversationUpsertArgs} args - Arguments to update or create a DirectConversation.
     * @example
     * // Update or create a DirectConversation
     * const directConversation = await prisma.directConversation.upsert({
     *   create: {
     *     // ... data to create a DirectConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DirectConversation we want to update
     *   }
     * })
     */
    upsert<T extends DirectConversationUpsertArgs>(args: SelectSubset<T, DirectConversationUpsertArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DirectConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationCountArgs} args - Arguments to filter DirectConversations to count.
     * @example
     * // Count the number of DirectConversations
     * const count = await prisma.directConversation.count({
     *   where: {
     *     // ... the filter for the DirectConversations we want to count
     *   }
     * })
    **/
    count<T extends DirectConversationCountArgs>(
      args?: Subset<T, DirectConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DirectConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DirectConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DirectConversationAggregateArgs>(args: Subset<T, DirectConversationAggregateArgs>): Prisma.PrismaPromise<GetDirectConversationAggregateType<T>>

    /**
     * Group by DirectConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectConversationGroupByArgs} args - Group by arguments.
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
      T extends DirectConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DirectConversationGroupByArgs['orderBy'] }
        : { orderBy?: DirectConversationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DirectConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDirectConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DirectConversation model
   */
  readonly fields: DirectConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DirectConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DirectConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends DirectConversation$participantsArgs<ExtArgs> = {}>(args?: Subset<T, DirectConversation$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "findMany"> | Null>
    messages<T extends DirectConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, DirectConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the DirectConversation model
   */ 
  interface DirectConversationFieldRefs {
    readonly id: FieldRef<"DirectConversation", 'String'>
    readonly createdAt: FieldRef<"DirectConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"DirectConversation", 'DateTime'>
    readonly lastMessageAt: FieldRef<"DirectConversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DirectConversation findUnique
   */
  export type DirectConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * Filter, which DirectConversation to fetch.
     */
    where: DirectConversationWhereUniqueInput
  }

  /**
   * DirectConversation findUniqueOrThrow
   */
  export type DirectConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * Filter, which DirectConversation to fetch.
     */
    where: DirectConversationWhereUniqueInput
  }

  /**
   * DirectConversation findFirst
   */
  export type DirectConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * Filter, which DirectConversation to fetch.
     */
    where?: DirectConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectConversations to fetch.
     */
    orderBy?: DirectConversationOrderByWithRelationInput | DirectConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectConversations.
     */
    cursor?: DirectConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectConversations.
     */
    distinct?: DirectConversationScalarFieldEnum | DirectConversationScalarFieldEnum[]
  }

  /**
   * DirectConversation findFirstOrThrow
   */
  export type DirectConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * Filter, which DirectConversation to fetch.
     */
    where?: DirectConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectConversations to fetch.
     */
    orderBy?: DirectConversationOrderByWithRelationInput | DirectConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectConversations.
     */
    cursor?: DirectConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectConversations.
     */
    distinct?: DirectConversationScalarFieldEnum | DirectConversationScalarFieldEnum[]
  }

  /**
   * DirectConversation findMany
   */
  export type DirectConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * Filter, which DirectConversations to fetch.
     */
    where?: DirectConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectConversations to fetch.
     */
    orderBy?: DirectConversationOrderByWithRelationInput | DirectConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DirectConversations.
     */
    cursor?: DirectConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectConversations.
     */
    skip?: number
    distinct?: DirectConversationScalarFieldEnum | DirectConversationScalarFieldEnum[]
  }

  /**
   * DirectConversation create
   */
  export type DirectConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a DirectConversation.
     */
    data: XOR<DirectConversationCreateInput, DirectConversationUncheckedCreateInput>
  }

  /**
   * DirectConversation createMany
   */
  export type DirectConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DirectConversations.
     */
    data: DirectConversationCreateManyInput | DirectConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DirectConversation createManyAndReturn
   */
  export type DirectConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DirectConversations.
     */
    data: DirectConversationCreateManyInput | DirectConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DirectConversation update
   */
  export type DirectConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a DirectConversation.
     */
    data: XOR<DirectConversationUpdateInput, DirectConversationUncheckedUpdateInput>
    /**
     * Choose, which DirectConversation to update.
     */
    where: DirectConversationWhereUniqueInput
  }

  /**
   * DirectConversation updateMany
   */
  export type DirectConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DirectConversations.
     */
    data: XOR<DirectConversationUpdateManyMutationInput, DirectConversationUncheckedUpdateManyInput>
    /**
     * Filter which DirectConversations to update
     */
    where?: DirectConversationWhereInput
  }

  /**
   * DirectConversation upsert
   */
  export type DirectConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the DirectConversation to update in case it exists.
     */
    where: DirectConversationWhereUniqueInput
    /**
     * In case the DirectConversation found by the `where` argument doesn't exist, create a new DirectConversation with this data.
     */
    create: XOR<DirectConversationCreateInput, DirectConversationUncheckedCreateInput>
    /**
     * In case the DirectConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DirectConversationUpdateInput, DirectConversationUncheckedUpdateInput>
  }

  /**
   * DirectConversation delete
   */
  export type DirectConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
    /**
     * Filter which DirectConversation to delete.
     */
    where: DirectConversationWhereUniqueInput
  }

  /**
   * DirectConversation deleteMany
   */
  export type DirectConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectConversations to delete
     */
    where?: DirectConversationWhereInput
  }

  /**
   * DirectConversation.participants
   */
  export type DirectConversation$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    where?: DirectParticipantWhereInput
    orderBy?: DirectParticipantOrderByWithRelationInput | DirectParticipantOrderByWithRelationInput[]
    cursor?: DirectParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DirectParticipantScalarFieldEnum | DirectParticipantScalarFieldEnum[]
  }

  /**
   * DirectConversation.messages
   */
  export type DirectConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    where?: DirectMessageWhereInput
    orderBy?: DirectMessageOrderByWithRelationInput | DirectMessageOrderByWithRelationInput[]
    cursor?: DirectMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DirectMessageScalarFieldEnum | DirectMessageScalarFieldEnum[]
  }

  /**
   * DirectConversation without action
   */
  export type DirectConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectConversation
     */
    select?: DirectConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectConversationInclude<ExtArgs> | null
  }


  /**
   * Model DirectParticipant
   */

  export type AggregateDirectParticipant = {
    _count: DirectParticipantCountAggregateOutputType | null
    _min: DirectParticipantMinAggregateOutputType | null
    _max: DirectParticipantMaxAggregateOutputType | null
  }

  export type DirectParticipantMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    userId: string | null
    joinedAt: Date | null
  }

  export type DirectParticipantMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    userId: string | null
    joinedAt: Date | null
  }

  export type DirectParticipantCountAggregateOutputType = {
    id: number
    conversationId: number
    userId: number
    joinedAt: number
    _all: number
  }


  export type DirectParticipantMinAggregateInputType = {
    id?: true
    conversationId?: true
    userId?: true
    joinedAt?: true
  }

  export type DirectParticipantMaxAggregateInputType = {
    id?: true
    conversationId?: true
    userId?: true
    joinedAt?: true
  }

  export type DirectParticipantCountAggregateInputType = {
    id?: true
    conversationId?: true
    userId?: true
    joinedAt?: true
    _all?: true
  }

  export type DirectParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectParticipant to aggregate.
     */
    where?: DirectParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectParticipants to fetch.
     */
    orderBy?: DirectParticipantOrderByWithRelationInput | DirectParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DirectParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DirectParticipants
    **/
    _count?: true | DirectParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DirectParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DirectParticipantMaxAggregateInputType
  }

  export type GetDirectParticipantAggregateType<T extends DirectParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateDirectParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDirectParticipant[P]>
      : GetScalarType<T[P], AggregateDirectParticipant[P]>
  }




  export type DirectParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectParticipantWhereInput
    orderBy?: DirectParticipantOrderByWithAggregationInput | DirectParticipantOrderByWithAggregationInput[]
    by: DirectParticipantScalarFieldEnum[] | DirectParticipantScalarFieldEnum
    having?: DirectParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DirectParticipantCountAggregateInputType | true
    _min?: DirectParticipantMinAggregateInputType
    _max?: DirectParticipantMaxAggregateInputType
  }

  export type DirectParticipantGroupByOutputType = {
    id: string
    conversationId: string
    userId: string
    joinedAt: Date
    _count: DirectParticipantCountAggregateOutputType | null
    _min: DirectParticipantMinAggregateOutputType | null
    _max: DirectParticipantMaxAggregateOutputType | null
  }

  type GetDirectParticipantGroupByPayload<T extends DirectParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DirectParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DirectParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DirectParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], DirectParticipantGroupByOutputType[P]>
        }
      >
    >


  export type DirectParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    userId?: boolean
    joinedAt?: boolean
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["directParticipant"]>

  export type DirectParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    userId?: boolean
    joinedAt?: boolean
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["directParticipant"]>

  export type DirectParticipantSelectScalar = {
    id?: boolean
    conversationId?: boolean
    userId?: boolean
    joinedAt?: boolean
  }

  export type DirectParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }
  export type DirectParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }

  export type $DirectParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DirectParticipant"
    objects: {
      conversation: Prisma.$DirectConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      userId: string
      joinedAt: Date
    }, ExtArgs["result"]["directParticipant"]>
    composites: {}
  }

  type DirectParticipantGetPayload<S extends boolean | null | undefined | DirectParticipantDefaultArgs> = $Result.GetResult<Prisma.$DirectParticipantPayload, S>

  type DirectParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DirectParticipantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DirectParticipantCountAggregateInputType | true
    }

  export interface DirectParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DirectParticipant'], meta: { name: 'DirectParticipant' } }
    /**
     * Find zero or one DirectParticipant that matches the filter.
     * @param {DirectParticipantFindUniqueArgs} args - Arguments to find a DirectParticipant
     * @example
     * // Get one DirectParticipant
     * const directParticipant = await prisma.directParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DirectParticipantFindUniqueArgs>(args: SelectSubset<T, DirectParticipantFindUniqueArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DirectParticipant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DirectParticipantFindUniqueOrThrowArgs} args - Arguments to find a DirectParticipant
     * @example
     * // Get one DirectParticipant
     * const directParticipant = await prisma.directParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DirectParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, DirectParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DirectParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantFindFirstArgs} args - Arguments to find a DirectParticipant
     * @example
     * // Get one DirectParticipant
     * const directParticipant = await prisma.directParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DirectParticipantFindFirstArgs>(args?: SelectSubset<T, DirectParticipantFindFirstArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DirectParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantFindFirstOrThrowArgs} args - Arguments to find a DirectParticipant
     * @example
     * // Get one DirectParticipant
     * const directParticipant = await prisma.directParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DirectParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, DirectParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DirectParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DirectParticipants
     * const directParticipants = await prisma.directParticipant.findMany()
     * 
     * // Get first 10 DirectParticipants
     * const directParticipants = await prisma.directParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const directParticipantWithIdOnly = await prisma.directParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DirectParticipantFindManyArgs>(args?: SelectSubset<T, DirectParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DirectParticipant.
     * @param {DirectParticipantCreateArgs} args - Arguments to create a DirectParticipant.
     * @example
     * // Create one DirectParticipant
     * const DirectParticipant = await prisma.directParticipant.create({
     *   data: {
     *     // ... data to create a DirectParticipant
     *   }
     * })
     * 
     */
    create<T extends DirectParticipantCreateArgs>(args: SelectSubset<T, DirectParticipantCreateArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DirectParticipants.
     * @param {DirectParticipantCreateManyArgs} args - Arguments to create many DirectParticipants.
     * @example
     * // Create many DirectParticipants
     * const directParticipant = await prisma.directParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DirectParticipantCreateManyArgs>(args?: SelectSubset<T, DirectParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DirectParticipants and returns the data saved in the database.
     * @param {DirectParticipantCreateManyAndReturnArgs} args - Arguments to create many DirectParticipants.
     * @example
     * // Create many DirectParticipants
     * const directParticipant = await prisma.directParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DirectParticipants and only return the `id`
     * const directParticipantWithIdOnly = await prisma.directParticipant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DirectParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, DirectParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DirectParticipant.
     * @param {DirectParticipantDeleteArgs} args - Arguments to delete one DirectParticipant.
     * @example
     * // Delete one DirectParticipant
     * const DirectParticipant = await prisma.directParticipant.delete({
     *   where: {
     *     // ... filter to delete one DirectParticipant
     *   }
     * })
     * 
     */
    delete<T extends DirectParticipantDeleteArgs>(args: SelectSubset<T, DirectParticipantDeleteArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DirectParticipant.
     * @param {DirectParticipantUpdateArgs} args - Arguments to update one DirectParticipant.
     * @example
     * // Update one DirectParticipant
     * const directParticipant = await prisma.directParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DirectParticipantUpdateArgs>(args: SelectSubset<T, DirectParticipantUpdateArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DirectParticipants.
     * @param {DirectParticipantDeleteManyArgs} args - Arguments to filter DirectParticipants to delete.
     * @example
     * // Delete a few DirectParticipants
     * const { count } = await prisma.directParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DirectParticipantDeleteManyArgs>(args?: SelectSubset<T, DirectParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DirectParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DirectParticipants
     * const directParticipant = await prisma.directParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DirectParticipantUpdateManyArgs>(args: SelectSubset<T, DirectParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DirectParticipant.
     * @param {DirectParticipantUpsertArgs} args - Arguments to update or create a DirectParticipant.
     * @example
     * // Update or create a DirectParticipant
     * const directParticipant = await prisma.directParticipant.upsert({
     *   create: {
     *     // ... data to create a DirectParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DirectParticipant we want to update
     *   }
     * })
     */
    upsert<T extends DirectParticipantUpsertArgs>(args: SelectSubset<T, DirectParticipantUpsertArgs<ExtArgs>>): Prisma__DirectParticipantClient<$Result.GetResult<Prisma.$DirectParticipantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DirectParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantCountArgs} args - Arguments to filter DirectParticipants to count.
     * @example
     * // Count the number of DirectParticipants
     * const count = await prisma.directParticipant.count({
     *   where: {
     *     // ... the filter for the DirectParticipants we want to count
     *   }
     * })
    **/
    count<T extends DirectParticipantCountArgs>(
      args?: Subset<T, DirectParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DirectParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DirectParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DirectParticipantAggregateArgs>(args: Subset<T, DirectParticipantAggregateArgs>): Prisma.PrismaPromise<GetDirectParticipantAggregateType<T>>

    /**
     * Group by DirectParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectParticipantGroupByArgs} args - Group by arguments.
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
      T extends DirectParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DirectParticipantGroupByArgs['orderBy'] }
        : { orderBy?: DirectParticipantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DirectParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDirectParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DirectParticipant model
   */
  readonly fields: DirectParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DirectParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DirectParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends DirectConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DirectConversationDefaultArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the DirectParticipant model
   */ 
  interface DirectParticipantFieldRefs {
    readonly id: FieldRef<"DirectParticipant", 'String'>
    readonly conversationId: FieldRef<"DirectParticipant", 'String'>
    readonly userId: FieldRef<"DirectParticipant", 'String'>
    readonly joinedAt: FieldRef<"DirectParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DirectParticipant findUnique
   */
  export type DirectParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DirectParticipant to fetch.
     */
    where: DirectParticipantWhereUniqueInput
  }

  /**
   * DirectParticipant findUniqueOrThrow
   */
  export type DirectParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DirectParticipant to fetch.
     */
    where: DirectParticipantWhereUniqueInput
  }

  /**
   * DirectParticipant findFirst
   */
  export type DirectParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DirectParticipant to fetch.
     */
    where?: DirectParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectParticipants to fetch.
     */
    orderBy?: DirectParticipantOrderByWithRelationInput | DirectParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectParticipants.
     */
    cursor?: DirectParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectParticipants.
     */
    distinct?: DirectParticipantScalarFieldEnum | DirectParticipantScalarFieldEnum[]
  }

  /**
   * DirectParticipant findFirstOrThrow
   */
  export type DirectParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DirectParticipant to fetch.
     */
    where?: DirectParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectParticipants to fetch.
     */
    orderBy?: DirectParticipantOrderByWithRelationInput | DirectParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectParticipants.
     */
    cursor?: DirectParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectParticipants.
     */
    distinct?: DirectParticipantScalarFieldEnum | DirectParticipantScalarFieldEnum[]
  }

  /**
   * DirectParticipant findMany
   */
  export type DirectParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * Filter, which DirectParticipants to fetch.
     */
    where?: DirectParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectParticipants to fetch.
     */
    orderBy?: DirectParticipantOrderByWithRelationInput | DirectParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DirectParticipants.
     */
    cursor?: DirectParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectParticipants.
     */
    skip?: number
    distinct?: DirectParticipantScalarFieldEnum | DirectParticipantScalarFieldEnum[]
  }

  /**
   * DirectParticipant create
   */
  export type DirectParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a DirectParticipant.
     */
    data: XOR<DirectParticipantCreateInput, DirectParticipantUncheckedCreateInput>
  }

  /**
   * DirectParticipant createMany
   */
  export type DirectParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DirectParticipants.
     */
    data: DirectParticipantCreateManyInput | DirectParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DirectParticipant createManyAndReturn
   */
  export type DirectParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DirectParticipants.
     */
    data: DirectParticipantCreateManyInput | DirectParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DirectParticipant update
   */
  export type DirectParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a DirectParticipant.
     */
    data: XOR<DirectParticipantUpdateInput, DirectParticipantUncheckedUpdateInput>
    /**
     * Choose, which DirectParticipant to update.
     */
    where: DirectParticipantWhereUniqueInput
  }

  /**
   * DirectParticipant updateMany
   */
  export type DirectParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DirectParticipants.
     */
    data: XOR<DirectParticipantUpdateManyMutationInput, DirectParticipantUncheckedUpdateManyInput>
    /**
     * Filter which DirectParticipants to update
     */
    where?: DirectParticipantWhereInput
  }

  /**
   * DirectParticipant upsert
   */
  export type DirectParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the DirectParticipant to update in case it exists.
     */
    where: DirectParticipantWhereUniqueInput
    /**
     * In case the DirectParticipant found by the `where` argument doesn't exist, create a new DirectParticipant with this data.
     */
    create: XOR<DirectParticipantCreateInput, DirectParticipantUncheckedCreateInput>
    /**
     * In case the DirectParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DirectParticipantUpdateInput, DirectParticipantUncheckedUpdateInput>
  }

  /**
   * DirectParticipant delete
   */
  export type DirectParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
    /**
     * Filter which DirectParticipant to delete.
     */
    where: DirectParticipantWhereUniqueInput
  }

  /**
   * DirectParticipant deleteMany
   */
  export type DirectParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectParticipants to delete
     */
    where?: DirectParticipantWhereInput
  }

  /**
   * DirectParticipant without action
   */
  export type DirectParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectParticipant
     */
    select?: DirectParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectParticipantInclude<ExtArgs> | null
  }


  /**
   * Model DirectMessage
   */

  export type AggregateDirectMessage = {
    _count: DirectMessageCountAggregateOutputType | null
    _min: DirectMessageMinAggregateOutputType | null
    _max: DirectMessageMaxAggregateOutputType | null
  }

  export type DirectMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    senderId: string | null
    content: string | null
    createdAt: Date | null
    readAt: Date | null
  }

  export type DirectMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    senderId: string | null
    content: string | null
    createdAt: Date | null
    readAt: Date | null
  }

  export type DirectMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    senderId: number
    content: number
    createdAt: number
    readAt: number
    _all: number
  }


  export type DirectMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    senderId?: true
    content?: true
    createdAt?: true
    readAt?: true
  }

  export type DirectMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    senderId?: true
    content?: true
    createdAt?: true
    readAt?: true
  }

  export type DirectMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    senderId?: true
    content?: true
    createdAt?: true
    readAt?: true
    _all?: true
  }

  export type DirectMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectMessage to aggregate.
     */
    where?: DirectMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectMessages to fetch.
     */
    orderBy?: DirectMessageOrderByWithRelationInput | DirectMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DirectMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DirectMessages
    **/
    _count?: true | DirectMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DirectMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DirectMessageMaxAggregateInputType
  }

  export type GetDirectMessageAggregateType<T extends DirectMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateDirectMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDirectMessage[P]>
      : GetScalarType<T[P], AggregateDirectMessage[P]>
  }




  export type DirectMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectMessageWhereInput
    orderBy?: DirectMessageOrderByWithAggregationInput | DirectMessageOrderByWithAggregationInput[]
    by: DirectMessageScalarFieldEnum[] | DirectMessageScalarFieldEnum
    having?: DirectMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DirectMessageCountAggregateInputType | true
    _min?: DirectMessageMinAggregateInputType
    _max?: DirectMessageMaxAggregateInputType
  }

  export type DirectMessageGroupByOutputType = {
    id: string
    conversationId: string
    senderId: string
    content: string
    createdAt: Date
    readAt: Date | null
    _count: DirectMessageCountAggregateOutputType | null
    _min: DirectMessageMinAggregateOutputType | null
    _max: DirectMessageMaxAggregateOutputType | null
  }

  type GetDirectMessageGroupByPayload<T extends DirectMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DirectMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DirectMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DirectMessageGroupByOutputType[P]>
            : GetScalarType<T[P], DirectMessageGroupByOutputType[P]>
        }
      >
    >


  export type DirectMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    senderId?: boolean
    content?: boolean
    createdAt?: boolean
    readAt?: boolean
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["directMessage"]>

  export type DirectMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    senderId?: boolean
    content?: boolean
    createdAt?: boolean
    readAt?: boolean
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["directMessage"]>

  export type DirectMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    senderId?: boolean
    content?: boolean
    createdAt?: boolean
    readAt?: boolean
  }

  export type DirectMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }
  export type DirectMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | DirectConversationDefaultArgs<ExtArgs>
  }

  export type $DirectMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DirectMessage"
    objects: {
      conversation: Prisma.$DirectConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      senderId: string
      content: string
      createdAt: Date
      readAt: Date | null
    }, ExtArgs["result"]["directMessage"]>
    composites: {}
  }

  type DirectMessageGetPayload<S extends boolean | null | undefined | DirectMessageDefaultArgs> = $Result.GetResult<Prisma.$DirectMessagePayload, S>

  type DirectMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DirectMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DirectMessageCountAggregateInputType | true
    }

  export interface DirectMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DirectMessage'], meta: { name: 'DirectMessage' } }
    /**
     * Find zero or one DirectMessage that matches the filter.
     * @param {DirectMessageFindUniqueArgs} args - Arguments to find a DirectMessage
     * @example
     * // Get one DirectMessage
     * const directMessage = await prisma.directMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DirectMessageFindUniqueArgs>(args: SelectSubset<T, DirectMessageFindUniqueArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DirectMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DirectMessageFindUniqueOrThrowArgs} args - Arguments to find a DirectMessage
     * @example
     * // Get one DirectMessage
     * const directMessage = await prisma.directMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DirectMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, DirectMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DirectMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageFindFirstArgs} args - Arguments to find a DirectMessage
     * @example
     * // Get one DirectMessage
     * const directMessage = await prisma.directMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DirectMessageFindFirstArgs>(args?: SelectSubset<T, DirectMessageFindFirstArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DirectMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageFindFirstOrThrowArgs} args - Arguments to find a DirectMessage
     * @example
     * // Get one DirectMessage
     * const directMessage = await prisma.directMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DirectMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, DirectMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DirectMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DirectMessages
     * const directMessages = await prisma.directMessage.findMany()
     * 
     * // Get first 10 DirectMessages
     * const directMessages = await prisma.directMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const directMessageWithIdOnly = await prisma.directMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DirectMessageFindManyArgs>(args?: SelectSubset<T, DirectMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DirectMessage.
     * @param {DirectMessageCreateArgs} args - Arguments to create a DirectMessage.
     * @example
     * // Create one DirectMessage
     * const DirectMessage = await prisma.directMessage.create({
     *   data: {
     *     // ... data to create a DirectMessage
     *   }
     * })
     * 
     */
    create<T extends DirectMessageCreateArgs>(args: SelectSubset<T, DirectMessageCreateArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DirectMessages.
     * @param {DirectMessageCreateManyArgs} args - Arguments to create many DirectMessages.
     * @example
     * // Create many DirectMessages
     * const directMessage = await prisma.directMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DirectMessageCreateManyArgs>(args?: SelectSubset<T, DirectMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DirectMessages and returns the data saved in the database.
     * @param {DirectMessageCreateManyAndReturnArgs} args - Arguments to create many DirectMessages.
     * @example
     * // Create many DirectMessages
     * const directMessage = await prisma.directMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DirectMessages and only return the `id`
     * const directMessageWithIdOnly = await prisma.directMessage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DirectMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, DirectMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DirectMessage.
     * @param {DirectMessageDeleteArgs} args - Arguments to delete one DirectMessage.
     * @example
     * // Delete one DirectMessage
     * const DirectMessage = await prisma.directMessage.delete({
     *   where: {
     *     // ... filter to delete one DirectMessage
     *   }
     * })
     * 
     */
    delete<T extends DirectMessageDeleteArgs>(args: SelectSubset<T, DirectMessageDeleteArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DirectMessage.
     * @param {DirectMessageUpdateArgs} args - Arguments to update one DirectMessage.
     * @example
     * // Update one DirectMessage
     * const directMessage = await prisma.directMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DirectMessageUpdateArgs>(args: SelectSubset<T, DirectMessageUpdateArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DirectMessages.
     * @param {DirectMessageDeleteManyArgs} args - Arguments to filter DirectMessages to delete.
     * @example
     * // Delete a few DirectMessages
     * const { count } = await prisma.directMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DirectMessageDeleteManyArgs>(args?: SelectSubset<T, DirectMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DirectMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DirectMessages
     * const directMessage = await prisma.directMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DirectMessageUpdateManyArgs>(args: SelectSubset<T, DirectMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DirectMessage.
     * @param {DirectMessageUpsertArgs} args - Arguments to update or create a DirectMessage.
     * @example
     * // Update or create a DirectMessage
     * const directMessage = await prisma.directMessage.upsert({
     *   create: {
     *     // ... data to create a DirectMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DirectMessage we want to update
     *   }
     * })
     */
    upsert<T extends DirectMessageUpsertArgs>(args: SelectSubset<T, DirectMessageUpsertArgs<ExtArgs>>): Prisma__DirectMessageClient<$Result.GetResult<Prisma.$DirectMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DirectMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageCountArgs} args - Arguments to filter DirectMessages to count.
     * @example
     * // Count the number of DirectMessages
     * const count = await prisma.directMessage.count({
     *   where: {
     *     // ... the filter for the DirectMessages we want to count
     *   }
     * })
    **/
    count<T extends DirectMessageCountArgs>(
      args?: Subset<T, DirectMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DirectMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DirectMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DirectMessageAggregateArgs>(args: Subset<T, DirectMessageAggregateArgs>): Prisma.PrismaPromise<GetDirectMessageAggregateType<T>>

    /**
     * Group by DirectMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectMessageGroupByArgs} args - Group by arguments.
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
      T extends DirectMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DirectMessageGroupByArgs['orderBy'] }
        : { orderBy?: DirectMessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DirectMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDirectMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DirectMessage model
   */
  readonly fields: DirectMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DirectMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DirectMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends DirectConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DirectConversationDefaultArgs<ExtArgs>>): Prisma__DirectConversationClient<$Result.GetResult<Prisma.$DirectConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the DirectMessage model
   */ 
  interface DirectMessageFieldRefs {
    readonly id: FieldRef<"DirectMessage", 'String'>
    readonly conversationId: FieldRef<"DirectMessage", 'String'>
    readonly senderId: FieldRef<"DirectMessage", 'String'>
    readonly content: FieldRef<"DirectMessage", 'String'>
    readonly createdAt: FieldRef<"DirectMessage", 'DateTime'>
    readonly readAt: FieldRef<"DirectMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DirectMessage findUnique
   */
  export type DirectMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * Filter, which DirectMessage to fetch.
     */
    where: DirectMessageWhereUniqueInput
  }

  /**
   * DirectMessage findUniqueOrThrow
   */
  export type DirectMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * Filter, which DirectMessage to fetch.
     */
    where: DirectMessageWhereUniqueInput
  }

  /**
   * DirectMessage findFirst
   */
  export type DirectMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * Filter, which DirectMessage to fetch.
     */
    where?: DirectMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectMessages to fetch.
     */
    orderBy?: DirectMessageOrderByWithRelationInput | DirectMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectMessages.
     */
    cursor?: DirectMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectMessages.
     */
    distinct?: DirectMessageScalarFieldEnum | DirectMessageScalarFieldEnum[]
  }

  /**
   * DirectMessage findFirstOrThrow
   */
  export type DirectMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * Filter, which DirectMessage to fetch.
     */
    where?: DirectMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectMessages to fetch.
     */
    orderBy?: DirectMessageOrderByWithRelationInput | DirectMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DirectMessages.
     */
    cursor?: DirectMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DirectMessages.
     */
    distinct?: DirectMessageScalarFieldEnum | DirectMessageScalarFieldEnum[]
  }

  /**
   * DirectMessage findMany
   */
  export type DirectMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * Filter, which DirectMessages to fetch.
     */
    where?: DirectMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DirectMessages to fetch.
     */
    orderBy?: DirectMessageOrderByWithRelationInput | DirectMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DirectMessages.
     */
    cursor?: DirectMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DirectMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DirectMessages.
     */
    skip?: number
    distinct?: DirectMessageScalarFieldEnum | DirectMessageScalarFieldEnum[]
  }

  /**
   * DirectMessage create
   */
  export type DirectMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a DirectMessage.
     */
    data: XOR<DirectMessageCreateInput, DirectMessageUncheckedCreateInput>
  }

  /**
   * DirectMessage createMany
   */
  export type DirectMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DirectMessages.
     */
    data: DirectMessageCreateManyInput | DirectMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DirectMessage createManyAndReturn
   */
  export type DirectMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DirectMessages.
     */
    data: DirectMessageCreateManyInput | DirectMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DirectMessage update
   */
  export type DirectMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a DirectMessage.
     */
    data: XOR<DirectMessageUpdateInput, DirectMessageUncheckedUpdateInput>
    /**
     * Choose, which DirectMessage to update.
     */
    where: DirectMessageWhereUniqueInput
  }

  /**
   * DirectMessage updateMany
   */
  export type DirectMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DirectMessages.
     */
    data: XOR<DirectMessageUpdateManyMutationInput, DirectMessageUncheckedUpdateManyInput>
    /**
     * Filter which DirectMessages to update
     */
    where?: DirectMessageWhereInput
  }

  /**
   * DirectMessage upsert
   */
  export type DirectMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the DirectMessage to update in case it exists.
     */
    where: DirectMessageWhereUniqueInput
    /**
     * In case the DirectMessage found by the `where` argument doesn't exist, create a new DirectMessage with this data.
     */
    create: XOR<DirectMessageCreateInput, DirectMessageUncheckedCreateInput>
    /**
     * In case the DirectMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DirectMessageUpdateInput, DirectMessageUncheckedUpdateInput>
  }

  /**
   * DirectMessage delete
   */
  export type DirectMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
    /**
     * Filter which DirectMessage to delete.
     */
    where: DirectMessageWhereUniqueInput
  }

  /**
   * DirectMessage deleteMany
   */
  export type DirectMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DirectMessages to delete
     */
    where?: DirectMessageWhereInput
  }

  /**
   * DirectMessage without action
   */
  export type DirectMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectMessage
     */
    select?: DirectMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DirectMessageInclude<ExtArgs> | null
  }


  /**
   * Model CommunityFollow
   */

  export type AggregateCommunityFollow = {
    _count: CommunityFollowCountAggregateOutputType | null
    _min: CommunityFollowMinAggregateOutputType | null
    _max: CommunityFollowMaxAggregateOutputType | null
  }

  export type CommunityFollowMinAggregateOutputType = {
    id: string | null
    followerId: string | null
    followingId: string | null
    createdAt: Date | null
  }

  export type CommunityFollowMaxAggregateOutputType = {
    id: string | null
    followerId: string | null
    followingId: string | null
    createdAt: Date | null
  }

  export type CommunityFollowCountAggregateOutputType = {
    id: number
    followerId: number
    followingId: number
    createdAt: number
    _all: number
  }


  export type CommunityFollowMinAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
  }

  export type CommunityFollowMaxAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
  }

  export type CommunityFollowCountAggregateInputType = {
    id?: true
    followerId?: true
    followingId?: true
    createdAt?: true
    _all?: true
  }

  export type CommunityFollowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityFollow to aggregate.
     */
    where?: CommunityFollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityFollows to fetch.
     */
    orderBy?: CommunityFollowOrderByWithRelationInput | CommunityFollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityFollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityFollows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityFollows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityFollows
    **/
    _count?: true | CommunityFollowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityFollowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityFollowMaxAggregateInputType
  }

  export type GetCommunityFollowAggregateType<T extends CommunityFollowAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityFollow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityFollow[P]>
      : GetScalarType<T[P], AggregateCommunityFollow[P]>
  }




  export type CommunityFollowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityFollowWhereInput
    orderBy?: CommunityFollowOrderByWithAggregationInput | CommunityFollowOrderByWithAggregationInput[]
    by: CommunityFollowScalarFieldEnum[] | CommunityFollowScalarFieldEnum
    having?: CommunityFollowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityFollowCountAggregateInputType | true
    _min?: CommunityFollowMinAggregateInputType
    _max?: CommunityFollowMaxAggregateInputType
  }

  export type CommunityFollowGroupByOutputType = {
    id: string
    followerId: string
    followingId: string
    createdAt: Date
    _count: CommunityFollowCountAggregateOutputType | null
    _min: CommunityFollowMinAggregateOutputType | null
    _max: CommunityFollowMaxAggregateOutputType | null
  }

  type GetCommunityFollowGroupByPayload<T extends CommunityFollowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityFollowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityFollowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityFollowGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityFollowGroupByOutputType[P]>
        }
      >
    >


  export type CommunityFollowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityFollow"]>

  export type CommunityFollowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityFollow"]>

  export type CommunityFollowSelectScalar = {
    id?: boolean
    followerId?: boolean
    followingId?: boolean
    createdAt?: boolean
  }


  export type $CommunityFollowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityFollow"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      followerId: string
      followingId: string
      createdAt: Date
    }, ExtArgs["result"]["communityFollow"]>
    composites: {}
  }

  type CommunityFollowGetPayload<S extends boolean | null | undefined | CommunityFollowDefaultArgs> = $Result.GetResult<Prisma.$CommunityFollowPayload, S>

  type CommunityFollowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunityFollowFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunityFollowCountAggregateInputType | true
    }

  export interface CommunityFollowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityFollow'], meta: { name: 'CommunityFollow' } }
    /**
     * Find zero or one CommunityFollow that matches the filter.
     * @param {CommunityFollowFindUniqueArgs} args - Arguments to find a CommunityFollow
     * @example
     * // Get one CommunityFollow
     * const communityFollow = await prisma.communityFollow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityFollowFindUniqueArgs>(args: SelectSubset<T, CommunityFollowFindUniqueArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunityFollow that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunityFollowFindUniqueOrThrowArgs} args - Arguments to find a CommunityFollow
     * @example
     * // Get one CommunityFollow
     * const communityFollow = await prisma.communityFollow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityFollowFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityFollowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunityFollow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowFindFirstArgs} args - Arguments to find a CommunityFollow
     * @example
     * // Get one CommunityFollow
     * const communityFollow = await prisma.communityFollow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityFollowFindFirstArgs>(args?: SelectSubset<T, CommunityFollowFindFirstArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunityFollow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowFindFirstOrThrowArgs} args - Arguments to find a CommunityFollow
     * @example
     * // Get one CommunityFollow
     * const communityFollow = await prisma.communityFollow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityFollowFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityFollowFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunityFollows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityFollows
     * const communityFollows = await prisma.communityFollow.findMany()
     * 
     * // Get first 10 CommunityFollows
     * const communityFollows = await prisma.communityFollow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityFollowWithIdOnly = await prisma.communityFollow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityFollowFindManyArgs>(args?: SelectSubset<T, CommunityFollowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunityFollow.
     * @param {CommunityFollowCreateArgs} args - Arguments to create a CommunityFollow.
     * @example
     * // Create one CommunityFollow
     * const CommunityFollow = await prisma.communityFollow.create({
     *   data: {
     *     // ... data to create a CommunityFollow
     *   }
     * })
     * 
     */
    create<T extends CommunityFollowCreateArgs>(args: SelectSubset<T, CommunityFollowCreateArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunityFollows.
     * @param {CommunityFollowCreateManyArgs} args - Arguments to create many CommunityFollows.
     * @example
     * // Create many CommunityFollows
     * const communityFollow = await prisma.communityFollow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityFollowCreateManyArgs>(args?: SelectSubset<T, CommunityFollowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityFollows and returns the data saved in the database.
     * @param {CommunityFollowCreateManyAndReturnArgs} args - Arguments to create many CommunityFollows.
     * @example
     * // Create many CommunityFollows
     * const communityFollow = await prisma.communityFollow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityFollows and only return the `id`
     * const communityFollowWithIdOnly = await prisma.communityFollow.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityFollowCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityFollowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunityFollow.
     * @param {CommunityFollowDeleteArgs} args - Arguments to delete one CommunityFollow.
     * @example
     * // Delete one CommunityFollow
     * const CommunityFollow = await prisma.communityFollow.delete({
     *   where: {
     *     // ... filter to delete one CommunityFollow
     *   }
     * })
     * 
     */
    delete<T extends CommunityFollowDeleteArgs>(args: SelectSubset<T, CommunityFollowDeleteArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunityFollow.
     * @param {CommunityFollowUpdateArgs} args - Arguments to update one CommunityFollow.
     * @example
     * // Update one CommunityFollow
     * const communityFollow = await prisma.communityFollow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityFollowUpdateArgs>(args: SelectSubset<T, CommunityFollowUpdateArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunityFollows.
     * @param {CommunityFollowDeleteManyArgs} args - Arguments to filter CommunityFollows to delete.
     * @example
     * // Delete a few CommunityFollows
     * const { count } = await prisma.communityFollow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityFollowDeleteManyArgs>(args?: SelectSubset<T, CommunityFollowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityFollows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityFollows
     * const communityFollow = await prisma.communityFollow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityFollowUpdateManyArgs>(args: SelectSubset<T, CommunityFollowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunityFollow.
     * @param {CommunityFollowUpsertArgs} args - Arguments to update or create a CommunityFollow.
     * @example
     * // Update or create a CommunityFollow
     * const communityFollow = await prisma.communityFollow.upsert({
     *   create: {
     *     // ... data to create a CommunityFollow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityFollow we want to update
     *   }
     * })
     */
    upsert<T extends CommunityFollowUpsertArgs>(args: SelectSubset<T, CommunityFollowUpsertArgs<ExtArgs>>): Prisma__CommunityFollowClient<$Result.GetResult<Prisma.$CommunityFollowPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunityFollows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowCountArgs} args - Arguments to filter CommunityFollows to count.
     * @example
     * // Count the number of CommunityFollows
     * const count = await prisma.communityFollow.count({
     *   where: {
     *     // ... the filter for the CommunityFollows we want to count
     *   }
     * })
    **/
    count<T extends CommunityFollowCountArgs>(
      args?: Subset<T, CommunityFollowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityFollowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityFollow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityFollowAggregateArgs>(args: Subset<T, CommunityFollowAggregateArgs>): Prisma.PrismaPromise<GetCommunityFollowAggregateType<T>>

    /**
     * Group by CommunityFollow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityFollowGroupByArgs} args - Group by arguments.
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
      T extends CommunityFollowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityFollowGroupByArgs['orderBy'] }
        : { orderBy?: CommunityFollowGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityFollowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityFollowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityFollow model
   */
  readonly fields: CommunityFollowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityFollow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityFollowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CommunityFollow model
   */ 
  interface CommunityFollowFieldRefs {
    readonly id: FieldRef<"CommunityFollow", 'String'>
    readonly followerId: FieldRef<"CommunityFollow", 'String'>
    readonly followingId: FieldRef<"CommunityFollow", 'String'>
    readonly createdAt: FieldRef<"CommunityFollow", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityFollow findUnique
   */
  export type CommunityFollowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * Filter, which CommunityFollow to fetch.
     */
    where: CommunityFollowWhereUniqueInput
  }

  /**
   * CommunityFollow findUniqueOrThrow
   */
  export type CommunityFollowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * Filter, which CommunityFollow to fetch.
     */
    where: CommunityFollowWhereUniqueInput
  }

  /**
   * CommunityFollow findFirst
   */
  export type CommunityFollowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * Filter, which CommunityFollow to fetch.
     */
    where?: CommunityFollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityFollows to fetch.
     */
    orderBy?: CommunityFollowOrderByWithRelationInput | CommunityFollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityFollows.
     */
    cursor?: CommunityFollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityFollows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityFollows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityFollows.
     */
    distinct?: CommunityFollowScalarFieldEnum | CommunityFollowScalarFieldEnum[]
  }

  /**
   * CommunityFollow findFirstOrThrow
   */
  export type CommunityFollowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * Filter, which CommunityFollow to fetch.
     */
    where?: CommunityFollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityFollows to fetch.
     */
    orderBy?: CommunityFollowOrderByWithRelationInput | CommunityFollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityFollows.
     */
    cursor?: CommunityFollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityFollows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityFollows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityFollows.
     */
    distinct?: CommunityFollowScalarFieldEnum | CommunityFollowScalarFieldEnum[]
  }

  /**
   * CommunityFollow findMany
   */
  export type CommunityFollowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * Filter, which CommunityFollows to fetch.
     */
    where?: CommunityFollowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityFollows to fetch.
     */
    orderBy?: CommunityFollowOrderByWithRelationInput | CommunityFollowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityFollows.
     */
    cursor?: CommunityFollowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityFollows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityFollows.
     */
    skip?: number
    distinct?: CommunityFollowScalarFieldEnum | CommunityFollowScalarFieldEnum[]
  }

  /**
   * CommunityFollow create
   */
  export type CommunityFollowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * The data needed to create a CommunityFollow.
     */
    data: XOR<CommunityFollowCreateInput, CommunityFollowUncheckedCreateInput>
  }

  /**
   * CommunityFollow createMany
   */
  export type CommunityFollowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityFollows.
     */
    data: CommunityFollowCreateManyInput | CommunityFollowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityFollow createManyAndReturn
   */
  export type CommunityFollowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunityFollows.
     */
    data: CommunityFollowCreateManyInput | CommunityFollowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityFollow update
   */
  export type CommunityFollowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * The data needed to update a CommunityFollow.
     */
    data: XOR<CommunityFollowUpdateInput, CommunityFollowUncheckedUpdateInput>
    /**
     * Choose, which CommunityFollow to update.
     */
    where: CommunityFollowWhereUniqueInput
  }

  /**
   * CommunityFollow updateMany
   */
  export type CommunityFollowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityFollows.
     */
    data: XOR<CommunityFollowUpdateManyMutationInput, CommunityFollowUncheckedUpdateManyInput>
    /**
     * Filter which CommunityFollows to update
     */
    where?: CommunityFollowWhereInput
  }

  /**
   * CommunityFollow upsert
   */
  export type CommunityFollowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * The filter to search for the CommunityFollow to update in case it exists.
     */
    where: CommunityFollowWhereUniqueInput
    /**
     * In case the CommunityFollow found by the `where` argument doesn't exist, create a new CommunityFollow with this data.
     */
    create: XOR<CommunityFollowCreateInput, CommunityFollowUncheckedCreateInput>
    /**
     * In case the CommunityFollow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityFollowUpdateInput, CommunityFollowUncheckedUpdateInput>
  }

  /**
   * CommunityFollow delete
   */
  export type CommunityFollowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
    /**
     * Filter which CommunityFollow to delete.
     */
    where: CommunityFollowWhereUniqueInput
  }

  /**
   * CommunityFollow deleteMany
   */
  export type CommunityFollowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityFollows to delete
     */
    where?: CommunityFollowWhereInput
  }

  /**
   * CommunityFollow without action
   */
  export type CommunityFollowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityFollow
     */
    select?: CommunityFollowSelect<ExtArgs> | null
  }


  /**
   * Model CommunityBookmark
   */

  export type AggregateCommunityBookmark = {
    _count: CommunityBookmarkCountAggregateOutputType | null
    _min: CommunityBookmarkMinAggregateOutputType | null
    _max: CommunityBookmarkMaxAggregateOutputType | null
  }

  export type CommunityBookmarkMinAggregateOutputType = {
    id: string | null
    userId: string | null
    postId: string | null
    createdAt: Date | null
  }

  export type CommunityBookmarkMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    postId: string | null
    createdAt: Date | null
  }

  export type CommunityBookmarkCountAggregateOutputType = {
    id: number
    userId: number
    postId: number
    createdAt: number
    _all: number
  }


  export type CommunityBookmarkMinAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    createdAt?: true
  }

  export type CommunityBookmarkMaxAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    createdAt?: true
  }

  export type CommunityBookmarkCountAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    createdAt?: true
    _all?: true
  }

  export type CommunityBookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityBookmark to aggregate.
     */
    where?: CommunityBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityBookmarks to fetch.
     */
    orderBy?: CommunityBookmarkOrderByWithRelationInput | CommunityBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityBookmarks
    **/
    _count?: true | CommunityBookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityBookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityBookmarkMaxAggregateInputType
  }

  export type GetCommunityBookmarkAggregateType<T extends CommunityBookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityBookmark[P]>
      : GetScalarType<T[P], AggregateCommunityBookmark[P]>
  }




  export type CommunityBookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityBookmarkWhereInput
    orderBy?: CommunityBookmarkOrderByWithAggregationInput | CommunityBookmarkOrderByWithAggregationInput[]
    by: CommunityBookmarkScalarFieldEnum[] | CommunityBookmarkScalarFieldEnum
    having?: CommunityBookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityBookmarkCountAggregateInputType | true
    _min?: CommunityBookmarkMinAggregateInputType
    _max?: CommunityBookmarkMaxAggregateInputType
  }

  export type CommunityBookmarkGroupByOutputType = {
    id: string
    userId: string
    postId: string
    createdAt: Date
    _count: CommunityBookmarkCountAggregateOutputType | null
    _min: CommunityBookmarkMinAggregateOutputType | null
    _max: CommunityBookmarkMaxAggregateOutputType | null
  }

  type GetCommunityBookmarkGroupByPayload<T extends CommunityBookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityBookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityBookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityBookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityBookmarkGroupByOutputType[P]>
        }
      >
    >


  export type CommunityBookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityBookmark"]>

  export type CommunityBookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityBookmark"]>

  export type CommunityBookmarkSelectScalar = {
    id?: boolean
    userId?: boolean
    postId?: boolean
    createdAt?: boolean
  }


  export type $CommunityBookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityBookmark"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      postId: string
      createdAt: Date
    }, ExtArgs["result"]["communityBookmark"]>
    composites: {}
  }

  type CommunityBookmarkGetPayload<S extends boolean | null | undefined | CommunityBookmarkDefaultArgs> = $Result.GetResult<Prisma.$CommunityBookmarkPayload, S>

  type CommunityBookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunityBookmarkFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunityBookmarkCountAggregateInputType | true
    }

  export interface CommunityBookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityBookmark'], meta: { name: 'CommunityBookmark' } }
    /**
     * Find zero or one CommunityBookmark that matches the filter.
     * @param {CommunityBookmarkFindUniqueArgs} args - Arguments to find a CommunityBookmark
     * @example
     * // Get one CommunityBookmark
     * const communityBookmark = await prisma.communityBookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityBookmarkFindUniqueArgs>(args: SelectSubset<T, CommunityBookmarkFindUniqueArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunityBookmark that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunityBookmarkFindUniqueOrThrowArgs} args - Arguments to find a CommunityBookmark
     * @example
     * // Get one CommunityBookmark
     * const communityBookmark = await prisma.communityBookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityBookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityBookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunityBookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkFindFirstArgs} args - Arguments to find a CommunityBookmark
     * @example
     * // Get one CommunityBookmark
     * const communityBookmark = await prisma.communityBookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityBookmarkFindFirstArgs>(args?: SelectSubset<T, CommunityBookmarkFindFirstArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunityBookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkFindFirstOrThrowArgs} args - Arguments to find a CommunityBookmark
     * @example
     * // Get one CommunityBookmark
     * const communityBookmark = await prisma.communityBookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityBookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityBookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunityBookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityBookmarks
     * const communityBookmarks = await prisma.communityBookmark.findMany()
     * 
     * // Get first 10 CommunityBookmarks
     * const communityBookmarks = await prisma.communityBookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityBookmarkWithIdOnly = await prisma.communityBookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityBookmarkFindManyArgs>(args?: SelectSubset<T, CommunityBookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunityBookmark.
     * @param {CommunityBookmarkCreateArgs} args - Arguments to create a CommunityBookmark.
     * @example
     * // Create one CommunityBookmark
     * const CommunityBookmark = await prisma.communityBookmark.create({
     *   data: {
     *     // ... data to create a CommunityBookmark
     *   }
     * })
     * 
     */
    create<T extends CommunityBookmarkCreateArgs>(args: SelectSubset<T, CommunityBookmarkCreateArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunityBookmarks.
     * @param {CommunityBookmarkCreateManyArgs} args - Arguments to create many CommunityBookmarks.
     * @example
     * // Create many CommunityBookmarks
     * const communityBookmark = await prisma.communityBookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityBookmarkCreateManyArgs>(args?: SelectSubset<T, CommunityBookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityBookmarks and returns the data saved in the database.
     * @param {CommunityBookmarkCreateManyAndReturnArgs} args - Arguments to create many CommunityBookmarks.
     * @example
     * // Create many CommunityBookmarks
     * const communityBookmark = await prisma.communityBookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityBookmarks and only return the `id`
     * const communityBookmarkWithIdOnly = await prisma.communityBookmark.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityBookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityBookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunityBookmark.
     * @param {CommunityBookmarkDeleteArgs} args - Arguments to delete one CommunityBookmark.
     * @example
     * // Delete one CommunityBookmark
     * const CommunityBookmark = await prisma.communityBookmark.delete({
     *   where: {
     *     // ... filter to delete one CommunityBookmark
     *   }
     * })
     * 
     */
    delete<T extends CommunityBookmarkDeleteArgs>(args: SelectSubset<T, CommunityBookmarkDeleteArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunityBookmark.
     * @param {CommunityBookmarkUpdateArgs} args - Arguments to update one CommunityBookmark.
     * @example
     * // Update one CommunityBookmark
     * const communityBookmark = await prisma.communityBookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityBookmarkUpdateArgs>(args: SelectSubset<T, CommunityBookmarkUpdateArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunityBookmarks.
     * @param {CommunityBookmarkDeleteManyArgs} args - Arguments to filter CommunityBookmarks to delete.
     * @example
     * // Delete a few CommunityBookmarks
     * const { count } = await prisma.communityBookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityBookmarkDeleteManyArgs>(args?: SelectSubset<T, CommunityBookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityBookmarks
     * const communityBookmark = await prisma.communityBookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityBookmarkUpdateManyArgs>(args: SelectSubset<T, CommunityBookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunityBookmark.
     * @param {CommunityBookmarkUpsertArgs} args - Arguments to update or create a CommunityBookmark.
     * @example
     * // Update or create a CommunityBookmark
     * const communityBookmark = await prisma.communityBookmark.upsert({
     *   create: {
     *     // ... data to create a CommunityBookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityBookmark we want to update
     *   }
     * })
     */
    upsert<T extends CommunityBookmarkUpsertArgs>(args: SelectSubset<T, CommunityBookmarkUpsertArgs<ExtArgs>>): Prisma__CommunityBookmarkClient<$Result.GetResult<Prisma.$CommunityBookmarkPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunityBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkCountArgs} args - Arguments to filter CommunityBookmarks to count.
     * @example
     * // Count the number of CommunityBookmarks
     * const count = await prisma.communityBookmark.count({
     *   where: {
     *     // ... the filter for the CommunityBookmarks we want to count
     *   }
     * })
    **/
    count<T extends CommunityBookmarkCountArgs>(
      args?: Subset<T, CommunityBookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityBookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityBookmarkAggregateArgs>(args: Subset<T, CommunityBookmarkAggregateArgs>): Prisma.PrismaPromise<GetCommunityBookmarkAggregateType<T>>

    /**
     * Group by CommunityBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityBookmarkGroupByArgs} args - Group by arguments.
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
      T extends CommunityBookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityBookmarkGroupByArgs['orderBy'] }
        : { orderBy?: CommunityBookmarkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityBookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityBookmark model
   */
  readonly fields: CommunityBookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityBookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityBookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CommunityBookmark model
   */ 
  interface CommunityBookmarkFieldRefs {
    readonly id: FieldRef<"CommunityBookmark", 'String'>
    readonly userId: FieldRef<"CommunityBookmark", 'String'>
    readonly postId: FieldRef<"CommunityBookmark", 'String'>
    readonly createdAt: FieldRef<"CommunityBookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityBookmark findUnique
   */
  export type CommunityBookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which CommunityBookmark to fetch.
     */
    where: CommunityBookmarkWhereUniqueInput
  }

  /**
   * CommunityBookmark findUniqueOrThrow
   */
  export type CommunityBookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which CommunityBookmark to fetch.
     */
    where: CommunityBookmarkWhereUniqueInput
  }

  /**
   * CommunityBookmark findFirst
   */
  export type CommunityBookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which CommunityBookmark to fetch.
     */
    where?: CommunityBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityBookmarks to fetch.
     */
    orderBy?: CommunityBookmarkOrderByWithRelationInput | CommunityBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityBookmarks.
     */
    cursor?: CommunityBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityBookmarks.
     */
    distinct?: CommunityBookmarkScalarFieldEnum | CommunityBookmarkScalarFieldEnum[]
  }

  /**
   * CommunityBookmark findFirstOrThrow
   */
  export type CommunityBookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which CommunityBookmark to fetch.
     */
    where?: CommunityBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityBookmarks to fetch.
     */
    orderBy?: CommunityBookmarkOrderByWithRelationInput | CommunityBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityBookmarks.
     */
    cursor?: CommunityBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityBookmarks.
     */
    distinct?: CommunityBookmarkScalarFieldEnum | CommunityBookmarkScalarFieldEnum[]
  }

  /**
   * CommunityBookmark findMany
   */
  export type CommunityBookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which CommunityBookmarks to fetch.
     */
    where?: CommunityBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityBookmarks to fetch.
     */
    orderBy?: CommunityBookmarkOrderByWithRelationInput | CommunityBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityBookmarks.
     */
    cursor?: CommunityBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityBookmarks.
     */
    skip?: number
    distinct?: CommunityBookmarkScalarFieldEnum | CommunityBookmarkScalarFieldEnum[]
  }

  /**
   * CommunityBookmark create
   */
  export type CommunityBookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * The data needed to create a CommunityBookmark.
     */
    data: XOR<CommunityBookmarkCreateInput, CommunityBookmarkUncheckedCreateInput>
  }

  /**
   * CommunityBookmark createMany
   */
  export type CommunityBookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityBookmarks.
     */
    data: CommunityBookmarkCreateManyInput | CommunityBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityBookmark createManyAndReturn
   */
  export type CommunityBookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunityBookmarks.
     */
    data: CommunityBookmarkCreateManyInput | CommunityBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityBookmark update
   */
  export type CommunityBookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * The data needed to update a CommunityBookmark.
     */
    data: XOR<CommunityBookmarkUpdateInput, CommunityBookmarkUncheckedUpdateInput>
    /**
     * Choose, which CommunityBookmark to update.
     */
    where: CommunityBookmarkWhereUniqueInput
  }

  /**
   * CommunityBookmark updateMany
   */
  export type CommunityBookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityBookmarks.
     */
    data: XOR<CommunityBookmarkUpdateManyMutationInput, CommunityBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which CommunityBookmarks to update
     */
    where?: CommunityBookmarkWhereInput
  }

  /**
   * CommunityBookmark upsert
   */
  export type CommunityBookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * The filter to search for the CommunityBookmark to update in case it exists.
     */
    where: CommunityBookmarkWhereUniqueInput
    /**
     * In case the CommunityBookmark found by the `where` argument doesn't exist, create a new CommunityBookmark with this data.
     */
    create: XOR<CommunityBookmarkCreateInput, CommunityBookmarkUncheckedCreateInput>
    /**
     * In case the CommunityBookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityBookmarkUpdateInput, CommunityBookmarkUncheckedUpdateInput>
  }

  /**
   * CommunityBookmark delete
   */
  export type CommunityBookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
    /**
     * Filter which CommunityBookmark to delete.
     */
    where: CommunityBookmarkWhereUniqueInput
  }

  /**
   * CommunityBookmark deleteMany
   */
  export type CommunityBookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityBookmarks to delete
     */
    where?: CommunityBookmarkWhereInput
  }

  /**
   * CommunityBookmark without action
   */
  export type CommunityBookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityBookmark
     */
    select?: CommunityBookmarkSelect<ExtArgs> | null
  }


  /**
   * Model CommunityNotification
   */

  export type AggregateCommunityNotification = {
    _count: CommunityNotificationCountAggregateOutputType | null
    _min: CommunityNotificationMinAggregateOutputType | null
    _max: CommunityNotificationMaxAggregateOutputType | null
  }

  export type CommunityNotificationMinAggregateOutputType = {
    id: string | null
    recipientId: string | null
    actorId: string | null
    type: string | null
    postId: string | null
    commentId: string | null
    conversationId: string | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type CommunityNotificationMaxAggregateOutputType = {
    id: string | null
    recipientId: string | null
    actorId: string | null
    type: string | null
    postId: string | null
    commentId: string | null
    conversationId: string | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type CommunityNotificationCountAggregateOutputType = {
    id: number
    recipientId: number
    actorId: number
    type: number
    postId: number
    commentId: number
    conversationId: number
    readAt: number
    createdAt: number
    _all: number
  }


  export type CommunityNotificationMinAggregateInputType = {
    id?: true
    recipientId?: true
    actorId?: true
    type?: true
    postId?: true
    commentId?: true
    conversationId?: true
    readAt?: true
    createdAt?: true
  }

  export type CommunityNotificationMaxAggregateInputType = {
    id?: true
    recipientId?: true
    actorId?: true
    type?: true
    postId?: true
    commentId?: true
    conversationId?: true
    readAt?: true
    createdAt?: true
  }

  export type CommunityNotificationCountAggregateInputType = {
    id?: true
    recipientId?: true
    actorId?: true
    type?: true
    postId?: true
    commentId?: true
    conversationId?: true
    readAt?: true
    createdAt?: true
    _all?: true
  }

  export type CommunityNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityNotification to aggregate.
     */
    where?: CommunityNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityNotifications to fetch.
     */
    orderBy?: CommunityNotificationOrderByWithRelationInput | CommunityNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunityNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunityNotifications
    **/
    _count?: true | CommunityNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunityNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunityNotificationMaxAggregateInputType
  }

  export type GetCommunityNotificationAggregateType<T extends CommunityNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunityNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunityNotification[P]>
      : GetScalarType<T[P], AggregateCommunityNotification[P]>
  }




  export type CommunityNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunityNotificationWhereInput
    orderBy?: CommunityNotificationOrderByWithAggregationInput | CommunityNotificationOrderByWithAggregationInput[]
    by: CommunityNotificationScalarFieldEnum[] | CommunityNotificationScalarFieldEnum
    having?: CommunityNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunityNotificationCountAggregateInputType | true
    _min?: CommunityNotificationMinAggregateInputType
    _max?: CommunityNotificationMaxAggregateInputType
  }

  export type CommunityNotificationGroupByOutputType = {
    id: string
    recipientId: string
    actorId: string
    type: string
    postId: string | null
    commentId: string | null
    conversationId: string | null
    readAt: Date | null
    createdAt: Date
    _count: CommunityNotificationCountAggregateOutputType | null
    _min: CommunityNotificationMinAggregateOutputType | null
    _max: CommunityNotificationMaxAggregateOutputType | null
  }

  type GetCommunityNotificationGroupByPayload<T extends CommunityNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunityNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunityNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunityNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], CommunityNotificationGroupByOutputType[P]>
        }
      >
    >


  export type CommunityNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipientId?: boolean
    actorId?: boolean
    type?: boolean
    postId?: boolean
    commentId?: boolean
    conversationId?: boolean
    readAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityNotification"]>

  export type CommunityNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipientId?: boolean
    actorId?: boolean
    type?: boolean
    postId?: boolean
    commentId?: boolean
    conversationId?: boolean
    readAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["communityNotification"]>

  export type CommunityNotificationSelectScalar = {
    id?: boolean
    recipientId?: boolean
    actorId?: boolean
    type?: boolean
    postId?: boolean
    commentId?: boolean
    conversationId?: boolean
    readAt?: boolean
    createdAt?: boolean
  }


  export type $CommunityNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityNotification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      recipientId: string
      actorId: string
      type: string
      postId: string | null
      commentId: string | null
      conversationId: string | null
      readAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["communityNotification"]>
    composites: {}
  }

  type CommunityNotificationGetPayload<S extends boolean | null | undefined | CommunityNotificationDefaultArgs> = $Result.GetResult<Prisma.$CommunityNotificationPayload, S>

  type CommunityNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunityNotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunityNotificationCountAggregateInputType | true
    }

  export interface CommunityNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunityNotification'], meta: { name: 'CommunityNotification' } }
    /**
     * Find zero or one CommunityNotification that matches the filter.
     * @param {CommunityNotificationFindUniqueArgs} args - Arguments to find a CommunityNotification
     * @example
     * // Get one CommunityNotification
     * const communityNotification = await prisma.communityNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunityNotificationFindUniqueArgs>(args: SelectSubset<T, CommunityNotificationFindUniqueArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunityNotification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunityNotificationFindUniqueOrThrowArgs} args - Arguments to find a CommunityNotification
     * @example
     * // Get one CommunityNotification
     * const communityNotification = await prisma.communityNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunityNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunityNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunityNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationFindFirstArgs} args - Arguments to find a CommunityNotification
     * @example
     * // Get one CommunityNotification
     * const communityNotification = await prisma.communityNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunityNotificationFindFirstArgs>(args?: SelectSubset<T, CommunityNotificationFindFirstArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunityNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationFindFirstOrThrowArgs} args - Arguments to find a CommunityNotification
     * @example
     * // Get one CommunityNotification
     * const communityNotification = await prisma.communityNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunityNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunityNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunityNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunityNotifications
     * const communityNotifications = await prisma.communityNotification.findMany()
     * 
     * // Get first 10 CommunityNotifications
     * const communityNotifications = await prisma.communityNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communityNotificationWithIdOnly = await prisma.communityNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunityNotificationFindManyArgs>(args?: SelectSubset<T, CommunityNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunityNotification.
     * @param {CommunityNotificationCreateArgs} args - Arguments to create a CommunityNotification.
     * @example
     * // Create one CommunityNotification
     * const CommunityNotification = await prisma.communityNotification.create({
     *   data: {
     *     // ... data to create a CommunityNotification
     *   }
     * })
     * 
     */
    create<T extends CommunityNotificationCreateArgs>(args: SelectSubset<T, CommunityNotificationCreateArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunityNotifications.
     * @param {CommunityNotificationCreateManyArgs} args - Arguments to create many CommunityNotifications.
     * @example
     * // Create many CommunityNotifications
     * const communityNotification = await prisma.communityNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunityNotificationCreateManyArgs>(args?: SelectSubset<T, CommunityNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunityNotifications and returns the data saved in the database.
     * @param {CommunityNotificationCreateManyAndReturnArgs} args - Arguments to create many CommunityNotifications.
     * @example
     * // Create many CommunityNotifications
     * const communityNotification = await prisma.communityNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunityNotifications and only return the `id`
     * const communityNotificationWithIdOnly = await prisma.communityNotification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunityNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunityNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunityNotification.
     * @param {CommunityNotificationDeleteArgs} args - Arguments to delete one CommunityNotification.
     * @example
     * // Delete one CommunityNotification
     * const CommunityNotification = await prisma.communityNotification.delete({
     *   where: {
     *     // ... filter to delete one CommunityNotification
     *   }
     * })
     * 
     */
    delete<T extends CommunityNotificationDeleteArgs>(args: SelectSubset<T, CommunityNotificationDeleteArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunityNotification.
     * @param {CommunityNotificationUpdateArgs} args - Arguments to update one CommunityNotification.
     * @example
     * // Update one CommunityNotification
     * const communityNotification = await prisma.communityNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunityNotificationUpdateArgs>(args: SelectSubset<T, CommunityNotificationUpdateArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunityNotifications.
     * @param {CommunityNotificationDeleteManyArgs} args - Arguments to filter CommunityNotifications to delete.
     * @example
     * // Delete a few CommunityNotifications
     * const { count } = await prisma.communityNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunityNotificationDeleteManyArgs>(args?: SelectSubset<T, CommunityNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunityNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunityNotifications
     * const communityNotification = await prisma.communityNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunityNotificationUpdateManyArgs>(args: SelectSubset<T, CommunityNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunityNotification.
     * @param {CommunityNotificationUpsertArgs} args - Arguments to update or create a CommunityNotification.
     * @example
     * // Update or create a CommunityNotification
     * const communityNotification = await prisma.communityNotification.upsert({
     *   create: {
     *     // ... data to create a CommunityNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunityNotification we want to update
     *   }
     * })
     */
    upsert<T extends CommunityNotificationUpsertArgs>(args: SelectSubset<T, CommunityNotificationUpsertArgs<ExtArgs>>): Prisma__CommunityNotificationClient<$Result.GetResult<Prisma.$CommunityNotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunityNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationCountArgs} args - Arguments to filter CommunityNotifications to count.
     * @example
     * // Count the number of CommunityNotifications
     * const count = await prisma.communityNotification.count({
     *   where: {
     *     // ... the filter for the CommunityNotifications we want to count
     *   }
     * })
    **/
    count<T extends CommunityNotificationCountArgs>(
      args?: Subset<T, CommunityNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunityNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunityNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunityNotificationAggregateArgs>(args: Subset<T, CommunityNotificationAggregateArgs>): Prisma.PrismaPromise<GetCommunityNotificationAggregateType<T>>

    /**
     * Group by CommunityNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunityNotificationGroupByArgs} args - Group by arguments.
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
      T extends CommunityNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunityNotificationGroupByArgs['orderBy'] }
        : { orderBy?: CommunityNotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunityNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunityNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunityNotification model
   */
  readonly fields: CommunityNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunityNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunityNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CommunityNotification model
   */ 
  interface CommunityNotificationFieldRefs {
    readonly id: FieldRef<"CommunityNotification", 'String'>
    readonly recipientId: FieldRef<"CommunityNotification", 'String'>
    readonly actorId: FieldRef<"CommunityNotification", 'String'>
    readonly type: FieldRef<"CommunityNotification", 'String'>
    readonly postId: FieldRef<"CommunityNotification", 'String'>
    readonly commentId: FieldRef<"CommunityNotification", 'String'>
    readonly conversationId: FieldRef<"CommunityNotification", 'String'>
    readonly readAt: FieldRef<"CommunityNotification", 'DateTime'>
    readonly createdAt: FieldRef<"CommunityNotification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CommunityNotification findUnique
   */
  export type CommunityNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * Filter, which CommunityNotification to fetch.
     */
    where: CommunityNotificationWhereUniqueInput
  }

  /**
   * CommunityNotification findUniqueOrThrow
   */
  export type CommunityNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * Filter, which CommunityNotification to fetch.
     */
    where: CommunityNotificationWhereUniqueInput
  }

  /**
   * CommunityNotification findFirst
   */
  export type CommunityNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * Filter, which CommunityNotification to fetch.
     */
    where?: CommunityNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityNotifications to fetch.
     */
    orderBy?: CommunityNotificationOrderByWithRelationInput | CommunityNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityNotifications.
     */
    cursor?: CommunityNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityNotifications.
     */
    distinct?: CommunityNotificationScalarFieldEnum | CommunityNotificationScalarFieldEnum[]
  }

  /**
   * CommunityNotification findFirstOrThrow
   */
  export type CommunityNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * Filter, which CommunityNotification to fetch.
     */
    where?: CommunityNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityNotifications to fetch.
     */
    orderBy?: CommunityNotificationOrderByWithRelationInput | CommunityNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunityNotifications.
     */
    cursor?: CommunityNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunityNotifications.
     */
    distinct?: CommunityNotificationScalarFieldEnum | CommunityNotificationScalarFieldEnum[]
  }

  /**
   * CommunityNotification findMany
   */
  export type CommunityNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * Filter, which CommunityNotifications to fetch.
     */
    where?: CommunityNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunityNotifications to fetch.
     */
    orderBy?: CommunityNotificationOrderByWithRelationInput | CommunityNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunityNotifications.
     */
    cursor?: CommunityNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunityNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunityNotifications.
     */
    skip?: number
    distinct?: CommunityNotificationScalarFieldEnum | CommunityNotificationScalarFieldEnum[]
  }

  /**
   * CommunityNotification create
   */
  export type CommunityNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * The data needed to create a CommunityNotification.
     */
    data: XOR<CommunityNotificationCreateInput, CommunityNotificationUncheckedCreateInput>
  }

  /**
   * CommunityNotification createMany
   */
  export type CommunityNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunityNotifications.
     */
    data: CommunityNotificationCreateManyInput | CommunityNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityNotification createManyAndReturn
   */
  export type CommunityNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunityNotifications.
     */
    data: CommunityNotificationCreateManyInput | CommunityNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunityNotification update
   */
  export type CommunityNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * The data needed to update a CommunityNotification.
     */
    data: XOR<CommunityNotificationUpdateInput, CommunityNotificationUncheckedUpdateInput>
    /**
     * Choose, which CommunityNotification to update.
     */
    where: CommunityNotificationWhereUniqueInput
  }

  /**
   * CommunityNotification updateMany
   */
  export type CommunityNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunityNotifications.
     */
    data: XOR<CommunityNotificationUpdateManyMutationInput, CommunityNotificationUncheckedUpdateManyInput>
    /**
     * Filter which CommunityNotifications to update
     */
    where?: CommunityNotificationWhereInput
  }

  /**
   * CommunityNotification upsert
   */
  export type CommunityNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * The filter to search for the CommunityNotification to update in case it exists.
     */
    where: CommunityNotificationWhereUniqueInput
    /**
     * In case the CommunityNotification found by the `where` argument doesn't exist, create a new CommunityNotification with this data.
     */
    create: XOR<CommunityNotificationCreateInput, CommunityNotificationUncheckedCreateInput>
    /**
     * In case the CommunityNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunityNotificationUpdateInput, CommunityNotificationUncheckedUpdateInput>
  }

  /**
   * CommunityNotification delete
   */
  export type CommunityNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
    /**
     * Filter which CommunityNotification to delete.
     */
    where: CommunityNotificationWhereUniqueInput
  }

  /**
   * CommunityNotification deleteMany
   */
  export type CommunityNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunityNotifications to delete
     */
    where?: CommunityNotificationWhereInput
  }

  /**
   * CommunityNotification without action
   */
  export type CommunityNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunityNotification
     */
    select?: CommunityNotificationSelect<ExtArgs> | null
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


  export const CommunityPostScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    content: 'content',
    imageUrl: 'imageUrl',
    audioUrl: 'audioUrl',
    audioDurationSec: 'audioDurationSec',
    stickerId: 'stickerId',
    isHidden: 'isHidden',
    createdAt: 'createdAt'
  };

  export type CommunityPostScalarFieldEnum = (typeof CommunityPostScalarFieldEnum)[keyof typeof CommunityPostScalarFieldEnum]


  export const CommunityCommentScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    content: 'content',
    stickerId: 'stickerId',
    parentId: 'parentId',
    createdAt: 'createdAt'
  };

  export type CommunityCommentScalarFieldEnum = (typeof CommunityCommentScalarFieldEnum)[keyof typeof CommunityCommentScalarFieldEnum]


  export const CommunityLikeScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type CommunityLikeScalarFieldEnum = (typeof CommunityLikeScalarFieldEnum)[keyof typeof CommunityLikeScalarFieldEnum]


  export const DirectConversationScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastMessageAt: 'lastMessageAt'
  };

  export type DirectConversationScalarFieldEnum = (typeof DirectConversationScalarFieldEnum)[keyof typeof DirectConversationScalarFieldEnum]


  export const DirectParticipantScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    userId: 'userId',
    joinedAt: 'joinedAt'
  };

  export type DirectParticipantScalarFieldEnum = (typeof DirectParticipantScalarFieldEnum)[keyof typeof DirectParticipantScalarFieldEnum]


  export const DirectMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    senderId: 'senderId',
    content: 'content',
    createdAt: 'createdAt',
    readAt: 'readAt'
  };

  export type DirectMessageScalarFieldEnum = (typeof DirectMessageScalarFieldEnum)[keyof typeof DirectMessageScalarFieldEnum]


  export const CommunityFollowScalarFieldEnum: {
    id: 'id',
    followerId: 'followerId',
    followingId: 'followingId',
    createdAt: 'createdAt'
  };

  export type CommunityFollowScalarFieldEnum = (typeof CommunityFollowScalarFieldEnum)[keyof typeof CommunityFollowScalarFieldEnum]


  export const CommunityBookmarkScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    postId: 'postId',
    createdAt: 'createdAt'
  };

  export type CommunityBookmarkScalarFieldEnum = (typeof CommunityBookmarkScalarFieldEnum)[keyof typeof CommunityBookmarkScalarFieldEnum]


  export const CommunityNotificationScalarFieldEnum: {
    id: 'id',
    recipientId: 'recipientId',
    actorId: 'actorId',
    type: 'type',
    postId: 'postId',
    commentId: 'commentId',
    conversationId: 'conversationId',
    readAt: 'readAt',
    createdAt: 'createdAt'
  };

  export type CommunityNotificationScalarFieldEnum = (typeof CommunityNotificationScalarFieldEnum)[keyof typeof CommunityNotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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


  export type CommunityPostWhereInput = {
    AND?: CommunityPostWhereInput | CommunityPostWhereInput[]
    OR?: CommunityPostWhereInput[]
    NOT?: CommunityPostWhereInput | CommunityPostWhereInput[]
    id?: StringFilter<"CommunityPost"> | string
    userId?: StringFilter<"CommunityPost"> | string
    content?: StringNullableFilter<"CommunityPost"> | string | null
    imageUrl?: StringNullableFilter<"CommunityPost"> | string | null
    audioUrl?: StringNullableFilter<"CommunityPost"> | string | null
    audioDurationSec?: IntNullableFilter<"CommunityPost"> | number | null
    stickerId?: StringNullableFilter<"CommunityPost"> | string | null
    isHidden?: BoolFilter<"CommunityPost"> | boolean
    createdAt?: DateTimeFilter<"CommunityPost"> | Date | string
    comments?: CommunityCommentListRelationFilter
    likes?: CommunityLikeListRelationFilter
  }

  export type CommunityPostOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    audioUrl?: SortOrderInput | SortOrder
    audioDurationSec?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    comments?: CommunityCommentOrderByRelationAggregateInput
    likes?: CommunityLikeOrderByRelationAggregateInput
  }

  export type CommunityPostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommunityPostWhereInput | CommunityPostWhereInput[]
    OR?: CommunityPostWhereInput[]
    NOT?: CommunityPostWhereInput | CommunityPostWhereInput[]
    userId?: StringFilter<"CommunityPost"> | string
    content?: StringNullableFilter<"CommunityPost"> | string | null
    imageUrl?: StringNullableFilter<"CommunityPost"> | string | null
    audioUrl?: StringNullableFilter<"CommunityPost"> | string | null
    audioDurationSec?: IntNullableFilter<"CommunityPost"> | number | null
    stickerId?: StringNullableFilter<"CommunityPost"> | string | null
    isHidden?: BoolFilter<"CommunityPost"> | boolean
    createdAt?: DateTimeFilter<"CommunityPost"> | Date | string
    comments?: CommunityCommentListRelationFilter
    likes?: CommunityLikeListRelationFilter
  }, "id">

  export type CommunityPostOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    audioUrl?: SortOrderInput | SortOrder
    audioDurationSec?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
    _count?: CommunityPostCountOrderByAggregateInput
    _avg?: CommunityPostAvgOrderByAggregateInput
    _max?: CommunityPostMaxOrderByAggregateInput
    _min?: CommunityPostMinOrderByAggregateInput
    _sum?: CommunityPostSumOrderByAggregateInput
  }

  export type CommunityPostScalarWhereWithAggregatesInput = {
    AND?: CommunityPostScalarWhereWithAggregatesInput | CommunityPostScalarWhereWithAggregatesInput[]
    OR?: CommunityPostScalarWhereWithAggregatesInput[]
    NOT?: CommunityPostScalarWhereWithAggregatesInput | CommunityPostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityPost"> | string
    userId?: StringWithAggregatesFilter<"CommunityPost"> | string
    content?: StringNullableWithAggregatesFilter<"CommunityPost"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"CommunityPost"> | string | null
    audioUrl?: StringNullableWithAggregatesFilter<"CommunityPost"> | string | null
    audioDurationSec?: IntNullableWithAggregatesFilter<"CommunityPost"> | number | null
    stickerId?: StringNullableWithAggregatesFilter<"CommunityPost"> | string | null
    isHidden?: BoolWithAggregatesFilter<"CommunityPost"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CommunityPost"> | Date | string
  }

  export type CommunityCommentWhereInput = {
    AND?: CommunityCommentWhereInput | CommunityCommentWhereInput[]
    OR?: CommunityCommentWhereInput[]
    NOT?: CommunityCommentWhereInput | CommunityCommentWhereInput[]
    id?: StringFilter<"CommunityComment"> | string
    postId?: StringFilter<"CommunityComment"> | string
    userId?: StringFilter<"CommunityComment"> | string
    content?: StringNullableFilter<"CommunityComment"> | string | null
    stickerId?: StringNullableFilter<"CommunityComment"> | string | null
    parentId?: StringNullableFilter<"CommunityComment"> | string | null
    createdAt?: DateTimeFilter<"CommunityComment"> | Date | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
    parent?: XOR<CommunityCommentNullableRelationFilter, CommunityCommentWhereInput> | null
    replies?: CommunityCommentListRelationFilter
  }

  export type CommunityCommentOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    post?: CommunityPostOrderByWithRelationInput
    parent?: CommunityCommentOrderByWithRelationInput
    replies?: CommunityCommentOrderByRelationAggregateInput
  }

  export type CommunityCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommunityCommentWhereInput | CommunityCommentWhereInput[]
    OR?: CommunityCommentWhereInput[]
    NOT?: CommunityCommentWhereInput | CommunityCommentWhereInput[]
    postId?: StringFilter<"CommunityComment"> | string
    userId?: StringFilter<"CommunityComment"> | string
    content?: StringNullableFilter<"CommunityComment"> | string | null
    stickerId?: StringNullableFilter<"CommunityComment"> | string | null
    parentId?: StringNullableFilter<"CommunityComment"> | string | null
    createdAt?: DateTimeFilter<"CommunityComment"> | Date | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
    parent?: XOR<CommunityCommentNullableRelationFilter, CommunityCommentWhereInput> | null
    replies?: CommunityCommentListRelationFilter
  }, "id">

  export type CommunityCommentOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CommunityCommentCountOrderByAggregateInput
    _max?: CommunityCommentMaxOrderByAggregateInput
    _min?: CommunityCommentMinOrderByAggregateInput
  }

  export type CommunityCommentScalarWhereWithAggregatesInput = {
    AND?: CommunityCommentScalarWhereWithAggregatesInput | CommunityCommentScalarWhereWithAggregatesInput[]
    OR?: CommunityCommentScalarWhereWithAggregatesInput[]
    NOT?: CommunityCommentScalarWhereWithAggregatesInput | CommunityCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityComment"> | string
    postId?: StringWithAggregatesFilter<"CommunityComment"> | string
    userId?: StringWithAggregatesFilter<"CommunityComment"> | string
    content?: StringNullableWithAggregatesFilter<"CommunityComment"> | string | null
    stickerId?: StringNullableWithAggregatesFilter<"CommunityComment"> | string | null
    parentId?: StringNullableWithAggregatesFilter<"CommunityComment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CommunityComment"> | Date | string
  }

  export type CommunityLikeWhereInput = {
    AND?: CommunityLikeWhereInput | CommunityLikeWhereInput[]
    OR?: CommunityLikeWhereInput[]
    NOT?: CommunityLikeWhereInput | CommunityLikeWhereInput[]
    id?: StringFilter<"CommunityLike"> | string
    postId?: StringFilter<"CommunityLike"> | string
    userId?: StringFilter<"CommunityLike"> | string
    createdAt?: DateTimeFilter<"CommunityLike"> | Date | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
  }

  export type CommunityLikeOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    post?: CommunityPostOrderByWithRelationInput
  }

  export type CommunityLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    postId_userId?: CommunityLikePostIdUserIdCompoundUniqueInput
    AND?: CommunityLikeWhereInput | CommunityLikeWhereInput[]
    OR?: CommunityLikeWhereInput[]
    NOT?: CommunityLikeWhereInput | CommunityLikeWhereInput[]
    postId?: StringFilter<"CommunityLike"> | string
    userId?: StringFilter<"CommunityLike"> | string
    createdAt?: DateTimeFilter<"CommunityLike"> | Date | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
  }, "id" | "postId_userId">

  export type CommunityLikeOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: CommunityLikeCountOrderByAggregateInput
    _max?: CommunityLikeMaxOrderByAggregateInput
    _min?: CommunityLikeMinOrderByAggregateInput
  }

  export type CommunityLikeScalarWhereWithAggregatesInput = {
    AND?: CommunityLikeScalarWhereWithAggregatesInput | CommunityLikeScalarWhereWithAggregatesInput[]
    OR?: CommunityLikeScalarWhereWithAggregatesInput[]
    NOT?: CommunityLikeScalarWhereWithAggregatesInput | CommunityLikeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityLike"> | string
    postId?: StringWithAggregatesFilter<"CommunityLike"> | string
    userId?: StringWithAggregatesFilter<"CommunityLike"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CommunityLike"> | Date | string
  }

  export type DirectConversationWhereInput = {
    AND?: DirectConversationWhereInput | DirectConversationWhereInput[]
    OR?: DirectConversationWhereInput[]
    NOT?: DirectConversationWhereInput | DirectConversationWhereInput[]
    id?: StringFilter<"DirectConversation"> | string
    createdAt?: DateTimeFilter<"DirectConversation"> | Date | string
    updatedAt?: DateTimeFilter<"DirectConversation"> | Date | string
    lastMessageAt?: DateTimeFilter<"DirectConversation"> | Date | string
    participants?: DirectParticipantListRelationFilter
    messages?: DirectMessageListRelationFilter
  }

  export type DirectConversationOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastMessageAt?: SortOrder
    participants?: DirectParticipantOrderByRelationAggregateInput
    messages?: DirectMessageOrderByRelationAggregateInput
  }

  export type DirectConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DirectConversationWhereInput | DirectConversationWhereInput[]
    OR?: DirectConversationWhereInput[]
    NOT?: DirectConversationWhereInput | DirectConversationWhereInput[]
    createdAt?: DateTimeFilter<"DirectConversation"> | Date | string
    updatedAt?: DateTimeFilter<"DirectConversation"> | Date | string
    lastMessageAt?: DateTimeFilter<"DirectConversation"> | Date | string
    participants?: DirectParticipantListRelationFilter
    messages?: DirectMessageListRelationFilter
  }, "id">

  export type DirectConversationOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastMessageAt?: SortOrder
    _count?: DirectConversationCountOrderByAggregateInput
    _max?: DirectConversationMaxOrderByAggregateInput
    _min?: DirectConversationMinOrderByAggregateInput
  }

  export type DirectConversationScalarWhereWithAggregatesInput = {
    AND?: DirectConversationScalarWhereWithAggregatesInput | DirectConversationScalarWhereWithAggregatesInput[]
    OR?: DirectConversationScalarWhereWithAggregatesInput[]
    NOT?: DirectConversationScalarWhereWithAggregatesInput | DirectConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DirectConversation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DirectConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DirectConversation"> | Date | string
    lastMessageAt?: DateTimeWithAggregatesFilter<"DirectConversation"> | Date | string
  }

  export type DirectParticipantWhereInput = {
    AND?: DirectParticipantWhereInput | DirectParticipantWhereInput[]
    OR?: DirectParticipantWhereInput[]
    NOT?: DirectParticipantWhereInput | DirectParticipantWhereInput[]
    id?: StringFilter<"DirectParticipant"> | string
    conversationId?: StringFilter<"DirectParticipant"> | string
    userId?: StringFilter<"DirectParticipant"> | string
    joinedAt?: DateTimeFilter<"DirectParticipant"> | Date | string
    conversation?: XOR<DirectConversationRelationFilter, DirectConversationWhereInput>
  }

  export type DirectParticipantOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    joinedAt?: SortOrder
    conversation?: DirectConversationOrderByWithRelationInput
  }

  export type DirectParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    conversationId_userId?: DirectParticipantConversationIdUserIdCompoundUniqueInput
    AND?: DirectParticipantWhereInput | DirectParticipantWhereInput[]
    OR?: DirectParticipantWhereInput[]
    NOT?: DirectParticipantWhereInput | DirectParticipantWhereInput[]
    conversationId?: StringFilter<"DirectParticipant"> | string
    userId?: StringFilter<"DirectParticipant"> | string
    joinedAt?: DateTimeFilter<"DirectParticipant"> | Date | string
    conversation?: XOR<DirectConversationRelationFilter, DirectConversationWhereInput>
  }, "id" | "conversationId_userId">

  export type DirectParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    joinedAt?: SortOrder
    _count?: DirectParticipantCountOrderByAggregateInput
    _max?: DirectParticipantMaxOrderByAggregateInput
    _min?: DirectParticipantMinOrderByAggregateInput
  }

  export type DirectParticipantScalarWhereWithAggregatesInput = {
    AND?: DirectParticipantScalarWhereWithAggregatesInput | DirectParticipantScalarWhereWithAggregatesInput[]
    OR?: DirectParticipantScalarWhereWithAggregatesInput[]
    NOT?: DirectParticipantScalarWhereWithAggregatesInput | DirectParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DirectParticipant"> | string
    conversationId?: StringWithAggregatesFilter<"DirectParticipant"> | string
    userId?: StringWithAggregatesFilter<"DirectParticipant"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"DirectParticipant"> | Date | string
  }

  export type DirectMessageWhereInput = {
    AND?: DirectMessageWhereInput | DirectMessageWhereInput[]
    OR?: DirectMessageWhereInput[]
    NOT?: DirectMessageWhereInput | DirectMessageWhereInput[]
    id?: StringFilter<"DirectMessage"> | string
    conversationId?: StringFilter<"DirectMessage"> | string
    senderId?: StringFilter<"DirectMessage"> | string
    content?: StringFilter<"DirectMessage"> | string
    createdAt?: DateTimeFilter<"DirectMessage"> | Date | string
    readAt?: DateTimeNullableFilter<"DirectMessage"> | Date | string | null
    conversation?: XOR<DirectConversationRelationFilter, DirectConversationWhereInput>
  }

  export type DirectMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    conversation?: DirectConversationOrderByWithRelationInput
  }

  export type DirectMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DirectMessageWhereInput | DirectMessageWhereInput[]
    OR?: DirectMessageWhereInput[]
    NOT?: DirectMessageWhereInput | DirectMessageWhereInput[]
    conversationId?: StringFilter<"DirectMessage"> | string
    senderId?: StringFilter<"DirectMessage"> | string
    content?: StringFilter<"DirectMessage"> | string
    createdAt?: DateTimeFilter<"DirectMessage"> | Date | string
    readAt?: DateTimeNullableFilter<"DirectMessage"> | Date | string | null
    conversation?: XOR<DirectConversationRelationFilter, DirectConversationWhereInput>
  }, "id">

  export type DirectMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    _count?: DirectMessageCountOrderByAggregateInput
    _max?: DirectMessageMaxOrderByAggregateInput
    _min?: DirectMessageMinOrderByAggregateInput
  }

  export type DirectMessageScalarWhereWithAggregatesInput = {
    AND?: DirectMessageScalarWhereWithAggregatesInput | DirectMessageScalarWhereWithAggregatesInput[]
    OR?: DirectMessageScalarWhereWithAggregatesInput[]
    NOT?: DirectMessageScalarWhereWithAggregatesInput | DirectMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DirectMessage"> | string
    conversationId?: StringWithAggregatesFilter<"DirectMessage"> | string
    senderId?: StringWithAggregatesFilter<"DirectMessage"> | string
    content?: StringWithAggregatesFilter<"DirectMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DirectMessage"> | Date | string
    readAt?: DateTimeNullableWithAggregatesFilter<"DirectMessage"> | Date | string | null
  }

  export type CommunityFollowWhereInput = {
    AND?: CommunityFollowWhereInput | CommunityFollowWhereInput[]
    OR?: CommunityFollowWhereInput[]
    NOT?: CommunityFollowWhereInput | CommunityFollowWhereInput[]
    id?: StringFilter<"CommunityFollow"> | string
    followerId?: StringFilter<"CommunityFollow"> | string
    followingId?: StringFilter<"CommunityFollow"> | string
    createdAt?: DateTimeFilter<"CommunityFollow"> | Date | string
  }

  export type CommunityFollowOrderByWithRelationInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityFollowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    followerId_followingId?: CommunityFollowFollowerIdFollowingIdCompoundUniqueInput
    AND?: CommunityFollowWhereInput | CommunityFollowWhereInput[]
    OR?: CommunityFollowWhereInput[]
    NOT?: CommunityFollowWhereInput | CommunityFollowWhereInput[]
    followerId?: StringFilter<"CommunityFollow"> | string
    followingId?: StringFilter<"CommunityFollow"> | string
    createdAt?: DateTimeFilter<"CommunityFollow"> | Date | string
  }, "id" | "followerId_followingId">

  export type CommunityFollowOrderByWithAggregationInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
    _count?: CommunityFollowCountOrderByAggregateInput
    _max?: CommunityFollowMaxOrderByAggregateInput
    _min?: CommunityFollowMinOrderByAggregateInput
  }

  export type CommunityFollowScalarWhereWithAggregatesInput = {
    AND?: CommunityFollowScalarWhereWithAggregatesInput | CommunityFollowScalarWhereWithAggregatesInput[]
    OR?: CommunityFollowScalarWhereWithAggregatesInput[]
    NOT?: CommunityFollowScalarWhereWithAggregatesInput | CommunityFollowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityFollow"> | string
    followerId?: StringWithAggregatesFilter<"CommunityFollow"> | string
    followingId?: StringWithAggregatesFilter<"CommunityFollow"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CommunityFollow"> | Date | string
  }

  export type CommunityBookmarkWhereInput = {
    AND?: CommunityBookmarkWhereInput | CommunityBookmarkWhereInput[]
    OR?: CommunityBookmarkWhereInput[]
    NOT?: CommunityBookmarkWhereInput | CommunityBookmarkWhereInput[]
    id?: StringFilter<"CommunityBookmark"> | string
    userId?: StringFilter<"CommunityBookmark"> | string
    postId?: StringFilter<"CommunityBookmark"> | string
    createdAt?: DateTimeFilter<"CommunityBookmark"> | Date | string
  }

  export type CommunityBookmarkOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityBookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_postId?: CommunityBookmarkUserIdPostIdCompoundUniqueInput
    AND?: CommunityBookmarkWhereInput | CommunityBookmarkWhereInput[]
    OR?: CommunityBookmarkWhereInput[]
    NOT?: CommunityBookmarkWhereInput | CommunityBookmarkWhereInput[]
    userId?: StringFilter<"CommunityBookmark"> | string
    postId?: StringFilter<"CommunityBookmark"> | string
    createdAt?: DateTimeFilter<"CommunityBookmark"> | Date | string
  }, "id" | "userId_postId">

  export type CommunityBookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
    _count?: CommunityBookmarkCountOrderByAggregateInput
    _max?: CommunityBookmarkMaxOrderByAggregateInput
    _min?: CommunityBookmarkMinOrderByAggregateInput
  }

  export type CommunityBookmarkScalarWhereWithAggregatesInput = {
    AND?: CommunityBookmarkScalarWhereWithAggregatesInput | CommunityBookmarkScalarWhereWithAggregatesInput[]
    OR?: CommunityBookmarkScalarWhereWithAggregatesInput[]
    NOT?: CommunityBookmarkScalarWhereWithAggregatesInput | CommunityBookmarkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityBookmark"> | string
    userId?: StringWithAggregatesFilter<"CommunityBookmark"> | string
    postId?: StringWithAggregatesFilter<"CommunityBookmark"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CommunityBookmark"> | Date | string
  }

  export type CommunityNotificationWhereInput = {
    AND?: CommunityNotificationWhereInput | CommunityNotificationWhereInput[]
    OR?: CommunityNotificationWhereInput[]
    NOT?: CommunityNotificationWhereInput | CommunityNotificationWhereInput[]
    id?: StringFilter<"CommunityNotification"> | string
    recipientId?: StringFilter<"CommunityNotification"> | string
    actorId?: StringFilter<"CommunityNotification"> | string
    type?: StringFilter<"CommunityNotification"> | string
    postId?: StringNullableFilter<"CommunityNotification"> | string | null
    commentId?: StringNullableFilter<"CommunityNotification"> | string | null
    conversationId?: StringNullableFilter<"CommunityNotification"> | string | null
    readAt?: DateTimeNullableFilter<"CommunityNotification"> | Date | string | null
    createdAt?: DateTimeFilter<"CommunityNotification"> | Date | string
  }

  export type CommunityNotificationOrderByWithRelationInput = {
    id?: SortOrder
    recipientId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    postId?: SortOrderInput | SortOrder
    commentId?: SortOrderInput | SortOrder
    conversationId?: SortOrderInput | SortOrder
    readAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type CommunityNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommunityNotificationWhereInput | CommunityNotificationWhereInput[]
    OR?: CommunityNotificationWhereInput[]
    NOT?: CommunityNotificationWhereInput | CommunityNotificationWhereInput[]
    recipientId?: StringFilter<"CommunityNotification"> | string
    actorId?: StringFilter<"CommunityNotification"> | string
    type?: StringFilter<"CommunityNotification"> | string
    postId?: StringNullableFilter<"CommunityNotification"> | string | null
    commentId?: StringNullableFilter<"CommunityNotification"> | string | null
    conversationId?: StringNullableFilter<"CommunityNotification"> | string | null
    readAt?: DateTimeNullableFilter<"CommunityNotification"> | Date | string | null
    createdAt?: DateTimeFilter<"CommunityNotification"> | Date | string
  }, "id">

  export type CommunityNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    recipientId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    postId?: SortOrderInput | SortOrder
    commentId?: SortOrderInput | SortOrder
    conversationId?: SortOrderInput | SortOrder
    readAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CommunityNotificationCountOrderByAggregateInput
    _max?: CommunityNotificationMaxOrderByAggregateInput
    _min?: CommunityNotificationMinOrderByAggregateInput
  }

  export type CommunityNotificationScalarWhereWithAggregatesInput = {
    AND?: CommunityNotificationScalarWhereWithAggregatesInput | CommunityNotificationScalarWhereWithAggregatesInput[]
    OR?: CommunityNotificationScalarWhereWithAggregatesInput[]
    NOT?: CommunityNotificationScalarWhereWithAggregatesInput | CommunityNotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CommunityNotification"> | string
    recipientId?: StringWithAggregatesFilter<"CommunityNotification"> | string
    actorId?: StringWithAggregatesFilter<"CommunityNotification"> | string
    type?: StringWithAggregatesFilter<"CommunityNotification"> | string
    postId?: StringNullableWithAggregatesFilter<"CommunityNotification"> | string | null
    commentId?: StringNullableWithAggregatesFilter<"CommunityNotification"> | string | null
    conversationId?: StringNullableWithAggregatesFilter<"CommunityNotification"> | string | null
    readAt?: DateTimeNullableWithAggregatesFilter<"CommunityNotification"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CommunityNotification"> | Date | string
  }

  export type CommunityPostCreateInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
    comments?: CommunityCommentCreateNestedManyWithoutPostInput
    likes?: CommunityLikeCreateNestedManyWithoutPostInput
  }

  export type CommunityPostUncheckedCreateInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
    comments?: CommunityCommentUncheckedCreateNestedManyWithoutPostInput
    likes?: CommunityLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type CommunityPostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommunityCommentUpdateManyWithoutPostNestedInput
    likes?: CommunityLikeUpdateManyWithoutPostNestedInput
  }

  export type CommunityPostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommunityCommentUncheckedUpdateManyWithoutPostNestedInput
    likes?: CommunityLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CommunityPostCreateManyInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
  }

  export type CommunityPostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityPostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentCreateInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
    post: CommunityPostCreateNestedOneWithoutCommentsInput
    parent?: CommunityCommentCreateNestedOneWithoutRepliesInput
    replies?: CommunityCommentCreateNestedManyWithoutParentInput
  }

  export type CommunityCommentUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
    parentId?: string | null
    createdAt?: Date | string
    replies?: CommunityCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommunityCommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CommunityPostUpdateOneRequiredWithoutCommentsNestedInput
    parent?: CommunityCommentUpdateOneWithoutRepliesNestedInput
    replies?: CommunityCommentUpdateManyWithoutParentNestedInput
  }

  export type CommunityCommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: CommunityCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommunityCommentCreateManyInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
    parentId?: string | null
    createdAt?: Date | string
  }

  export type CommunityCommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    post: CommunityPostCreateNestedOneWithoutLikesInput
  }

  export type CommunityLikeUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    createdAt?: Date | string
  }

  export type CommunityLikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CommunityPostUpdateOneRequiredWithoutLikesNestedInput
  }

  export type CommunityLikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeCreateManyInput = {
    id?: string
    postId: string
    userId: string
    createdAt?: Date | string
  }

  export type CommunityLikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectConversationCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
    participants?: DirectParticipantCreateNestedManyWithoutConversationInput
    messages?: DirectMessageCreateNestedManyWithoutConversationInput
  }

  export type DirectConversationUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
    participants?: DirectParticipantUncheckedCreateNestedManyWithoutConversationInput
    messages?: DirectMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type DirectConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: DirectParticipantUpdateManyWithoutConversationNestedInput
    messages?: DirectMessageUpdateManyWithoutConversationNestedInput
  }

  export type DirectConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: DirectParticipantUncheckedUpdateManyWithoutConversationNestedInput
    messages?: DirectMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type DirectConversationCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
  }

  export type DirectConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectParticipantCreateInput = {
    id?: string
    userId: string
    joinedAt?: Date | string
    conversation: DirectConversationCreateNestedOneWithoutParticipantsInput
  }

  export type DirectParticipantUncheckedCreateInput = {
    id?: string
    conversationId: string
    userId: string
    joinedAt?: Date | string
  }

  export type DirectParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: DirectConversationUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type DirectParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectParticipantCreateManyInput = {
    id?: string
    conversationId: string
    userId: string
    joinedAt?: Date | string
  }

  export type DirectParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectMessageCreateInput = {
    id?: string
    senderId: string
    content: string
    createdAt?: Date | string
    readAt?: Date | string | null
    conversation: DirectConversationCreateNestedOneWithoutMessagesInput
  }

  export type DirectMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    senderId: string
    content: string
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type DirectMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    conversation?: DirectConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type DirectMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DirectMessageCreateManyInput = {
    id?: string
    conversationId: string
    senderId: string
    content: string
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type DirectMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DirectMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CommunityFollowCreateInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type CommunityFollowUncheckedCreateInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type CommunityFollowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityFollowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityFollowCreateManyInput = {
    id?: string
    followerId: string
    followingId: string
    createdAt?: Date | string
  }

  export type CommunityFollowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityFollowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    followerId?: StringFieldUpdateOperationsInput | string
    followingId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityBookmarkCreateInput = {
    id?: string
    userId: string
    postId: string
    createdAt?: Date | string
  }

  export type CommunityBookmarkUncheckedCreateInput = {
    id?: string
    userId: string
    postId: string
    createdAt?: Date | string
  }

  export type CommunityBookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityBookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityBookmarkCreateManyInput = {
    id?: string
    userId: string
    postId: string
    createdAt?: Date | string
  }

  export type CommunityBookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityBookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityNotificationCreateInput = {
    id?: string
    recipientId: string
    actorId: string
    type: string
    postId?: string | null
    commentId?: string | null
    conversationId?: string | null
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CommunityNotificationUncheckedCreateInput = {
    id?: string
    recipientId: string
    actorId: string
    type: string
    postId?: string | null
    commentId?: string | null
    conversationId?: string | null
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CommunityNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    postId?: NullableStringFieldUpdateOperationsInput | string | null
    commentId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    postId?: NullableStringFieldUpdateOperationsInput | string | null
    commentId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityNotificationCreateManyInput = {
    id?: string
    recipientId: string
    actorId: string
    type: string
    postId?: string | null
    commentId?: string | null
    conversationId?: string | null
    readAt?: Date | string | null
    createdAt?: Date | string
  }

  export type CommunityNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    postId?: NullableStringFieldUpdateOperationsInput | string | null
    commentId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recipientId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    postId?: NullableStringFieldUpdateOperationsInput | string | null
    commentId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type CommunityCommentListRelationFilter = {
    every?: CommunityCommentWhereInput
    some?: CommunityCommentWhereInput
    none?: CommunityCommentWhereInput
  }

  export type CommunityLikeListRelationFilter = {
    every?: CommunityLikeWhereInput
    some?: CommunityLikeWhereInput
    none?: CommunityLikeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CommunityCommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommunityLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommunityPostCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    imageUrl?: SortOrder
    audioUrl?: SortOrder
    audioDurationSec?: SortOrder
    stickerId?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityPostAvgOrderByAggregateInput = {
    audioDurationSec?: SortOrder
  }

  export type CommunityPostMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    imageUrl?: SortOrder
    audioUrl?: SortOrder
    audioDurationSec?: SortOrder
    stickerId?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityPostMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    imageUrl?: SortOrder
    audioUrl?: SortOrder
    audioDurationSec?: SortOrder
    stickerId?: SortOrder
    isHidden?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityPostSumOrderByAggregateInput = {
    audioDurationSec?: SortOrder
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

  export type CommunityPostRelationFilter = {
    is?: CommunityPostWhereInput
    isNot?: CommunityPostWhereInput
  }

  export type CommunityCommentNullableRelationFilter = {
    is?: CommunityCommentWhereInput | null
    isNot?: CommunityCommentWhereInput | null
  }

  export type CommunityCommentCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    stickerId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    stickerId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityCommentMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    stickerId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityLikePostIdUserIdCompoundUniqueInput = {
    postId: string
    userId: string
  }

  export type CommunityLikeCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityLikeMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type DirectParticipantListRelationFilter = {
    every?: DirectParticipantWhereInput
    some?: DirectParticipantWhereInput
    none?: DirectParticipantWhereInput
  }

  export type DirectMessageListRelationFilter = {
    every?: DirectMessageWhereInput
    some?: DirectMessageWhereInput
    none?: DirectMessageWhereInput
  }

  export type DirectParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DirectMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DirectConversationCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastMessageAt?: SortOrder
  }

  export type DirectConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastMessageAt?: SortOrder
  }

  export type DirectConversationMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastMessageAt?: SortOrder
  }

  export type DirectConversationRelationFilter = {
    is?: DirectConversationWhereInput
    isNot?: DirectConversationWhereInput
  }

  export type DirectParticipantConversationIdUserIdCompoundUniqueInput = {
    conversationId: string
    userId: string
  }

  export type DirectParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    joinedAt?: SortOrder
  }

  export type DirectParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    joinedAt?: SortOrder
  }

  export type DirectParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    joinedAt?: SortOrder
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

  export type DirectMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
  }

  export type DirectMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
  }

  export type DirectMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    senderId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
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

  export type CommunityFollowFollowerIdFollowingIdCompoundUniqueInput = {
    followerId: string
    followingId: string
  }

  export type CommunityFollowCountOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityFollowMaxOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityFollowMinOrderByAggregateInput = {
    id?: SortOrder
    followerId?: SortOrder
    followingId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityBookmarkUserIdPostIdCompoundUniqueInput = {
    userId: string
    postId: string
  }

  export type CommunityBookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityBookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityBookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    recipientId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    postId?: SortOrder
    commentId?: SortOrder
    conversationId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    recipientId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    postId?: SortOrder
    commentId?: SortOrder
    conversationId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    recipientId?: SortOrder
    actorId?: SortOrder
    type?: SortOrder
    postId?: SortOrder
    commentId?: SortOrder
    conversationId?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityCommentCreateNestedManyWithoutPostInput = {
    create?: XOR<CommunityCommentCreateWithoutPostInput, CommunityCommentUncheckedCreateWithoutPostInput> | CommunityCommentCreateWithoutPostInput[] | CommunityCommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutPostInput | CommunityCommentCreateOrConnectWithoutPostInput[]
    createMany?: CommunityCommentCreateManyPostInputEnvelope
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
  }

  export type CommunityLikeCreateNestedManyWithoutPostInput = {
    create?: XOR<CommunityLikeCreateWithoutPostInput, CommunityLikeUncheckedCreateWithoutPostInput> | CommunityLikeCreateWithoutPostInput[] | CommunityLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityLikeCreateOrConnectWithoutPostInput | CommunityLikeCreateOrConnectWithoutPostInput[]
    createMany?: CommunityLikeCreateManyPostInputEnvelope
    connect?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
  }

  export type CommunityCommentUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<CommunityCommentCreateWithoutPostInput, CommunityCommentUncheckedCreateWithoutPostInput> | CommunityCommentCreateWithoutPostInput[] | CommunityCommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutPostInput | CommunityCommentCreateOrConnectWithoutPostInput[]
    createMany?: CommunityCommentCreateManyPostInputEnvelope
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
  }

  export type CommunityLikeUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<CommunityLikeCreateWithoutPostInput, CommunityLikeUncheckedCreateWithoutPostInput> | CommunityLikeCreateWithoutPostInput[] | CommunityLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityLikeCreateOrConnectWithoutPostInput | CommunityLikeCreateOrConnectWithoutPostInput[]
    createMany?: CommunityLikeCreateManyPostInputEnvelope
    connect?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CommunityCommentUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommunityCommentCreateWithoutPostInput, CommunityCommentUncheckedCreateWithoutPostInput> | CommunityCommentCreateWithoutPostInput[] | CommunityCommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutPostInput | CommunityCommentCreateOrConnectWithoutPostInput[]
    upsert?: CommunityCommentUpsertWithWhereUniqueWithoutPostInput | CommunityCommentUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommunityCommentCreateManyPostInputEnvelope
    set?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    disconnect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    delete?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    update?: CommunityCommentUpdateWithWhereUniqueWithoutPostInput | CommunityCommentUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommunityCommentUpdateManyWithWhereWithoutPostInput | CommunityCommentUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommunityCommentScalarWhereInput | CommunityCommentScalarWhereInput[]
  }

  export type CommunityLikeUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommunityLikeCreateWithoutPostInput, CommunityLikeUncheckedCreateWithoutPostInput> | CommunityLikeCreateWithoutPostInput[] | CommunityLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityLikeCreateOrConnectWithoutPostInput | CommunityLikeCreateOrConnectWithoutPostInput[]
    upsert?: CommunityLikeUpsertWithWhereUniqueWithoutPostInput | CommunityLikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommunityLikeCreateManyPostInputEnvelope
    set?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    disconnect?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    delete?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    connect?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    update?: CommunityLikeUpdateWithWhereUniqueWithoutPostInput | CommunityLikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommunityLikeUpdateManyWithWhereWithoutPostInput | CommunityLikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommunityLikeScalarWhereInput | CommunityLikeScalarWhereInput[]
  }

  export type CommunityCommentUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommunityCommentCreateWithoutPostInput, CommunityCommentUncheckedCreateWithoutPostInput> | CommunityCommentCreateWithoutPostInput[] | CommunityCommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutPostInput | CommunityCommentCreateOrConnectWithoutPostInput[]
    upsert?: CommunityCommentUpsertWithWhereUniqueWithoutPostInput | CommunityCommentUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommunityCommentCreateManyPostInputEnvelope
    set?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    disconnect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    delete?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    update?: CommunityCommentUpdateWithWhereUniqueWithoutPostInput | CommunityCommentUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommunityCommentUpdateManyWithWhereWithoutPostInput | CommunityCommentUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommunityCommentScalarWhereInput | CommunityCommentScalarWhereInput[]
  }

  export type CommunityLikeUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommunityLikeCreateWithoutPostInput, CommunityLikeUncheckedCreateWithoutPostInput> | CommunityLikeCreateWithoutPostInput[] | CommunityLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommunityLikeCreateOrConnectWithoutPostInput | CommunityLikeCreateOrConnectWithoutPostInput[]
    upsert?: CommunityLikeUpsertWithWhereUniqueWithoutPostInput | CommunityLikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommunityLikeCreateManyPostInputEnvelope
    set?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    disconnect?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    delete?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    connect?: CommunityLikeWhereUniqueInput | CommunityLikeWhereUniqueInput[]
    update?: CommunityLikeUpdateWithWhereUniqueWithoutPostInput | CommunityLikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommunityLikeUpdateManyWithWhereWithoutPostInput | CommunityLikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommunityLikeScalarWhereInput | CommunityLikeScalarWhereInput[]
  }

  export type CommunityPostCreateNestedOneWithoutCommentsInput = {
    create?: XOR<CommunityPostCreateWithoutCommentsInput, CommunityPostUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: CommunityPostCreateOrConnectWithoutCommentsInput
    connect?: CommunityPostWhereUniqueInput
  }

  export type CommunityCommentCreateNestedOneWithoutRepliesInput = {
    create?: XOR<CommunityCommentCreateWithoutRepliesInput, CommunityCommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutRepliesInput
    connect?: CommunityCommentWhereUniqueInput
  }

  export type CommunityCommentCreateNestedManyWithoutParentInput = {
    create?: XOR<CommunityCommentCreateWithoutParentInput, CommunityCommentUncheckedCreateWithoutParentInput> | CommunityCommentCreateWithoutParentInput[] | CommunityCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutParentInput | CommunityCommentCreateOrConnectWithoutParentInput[]
    createMany?: CommunityCommentCreateManyParentInputEnvelope
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
  }

  export type CommunityCommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<CommunityCommentCreateWithoutParentInput, CommunityCommentUncheckedCreateWithoutParentInput> | CommunityCommentCreateWithoutParentInput[] | CommunityCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutParentInput | CommunityCommentCreateOrConnectWithoutParentInput[]
    createMany?: CommunityCommentCreateManyParentInputEnvelope
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
  }

  export type CommunityPostUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<CommunityPostCreateWithoutCommentsInput, CommunityPostUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: CommunityPostCreateOrConnectWithoutCommentsInput
    upsert?: CommunityPostUpsertWithoutCommentsInput
    connect?: CommunityPostWhereUniqueInput
    update?: XOR<XOR<CommunityPostUpdateToOneWithWhereWithoutCommentsInput, CommunityPostUpdateWithoutCommentsInput>, CommunityPostUncheckedUpdateWithoutCommentsInput>
  }

  export type CommunityCommentUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<CommunityCommentCreateWithoutRepliesInput, CommunityCommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutRepliesInput
    upsert?: CommunityCommentUpsertWithoutRepliesInput
    disconnect?: CommunityCommentWhereInput | boolean
    delete?: CommunityCommentWhereInput | boolean
    connect?: CommunityCommentWhereUniqueInput
    update?: XOR<XOR<CommunityCommentUpdateToOneWithWhereWithoutRepliesInput, CommunityCommentUpdateWithoutRepliesInput>, CommunityCommentUncheckedUpdateWithoutRepliesInput>
  }

  export type CommunityCommentUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommunityCommentCreateWithoutParentInput, CommunityCommentUncheckedCreateWithoutParentInput> | CommunityCommentCreateWithoutParentInput[] | CommunityCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutParentInput | CommunityCommentCreateOrConnectWithoutParentInput[]
    upsert?: CommunityCommentUpsertWithWhereUniqueWithoutParentInput | CommunityCommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommunityCommentCreateManyParentInputEnvelope
    set?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    disconnect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    delete?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    update?: CommunityCommentUpdateWithWhereUniqueWithoutParentInput | CommunityCommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommunityCommentUpdateManyWithWhereWithoutParentInput | CommunityCommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommunityCommentScalarWhereInput | CommunityCommentScalarWhereInput[]
  }

  export type CommunityCommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommunityCommentCreateWithoutParentInput, CommunityCommentUncheckedCreateWithoutParentInput> | CommunityCommentCreateWithoutParentInput[] | CommunityCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommunityCommentCreateOrConnectWithoutParentInput | CommunityCommentCreateOrConnectWithoutParentInput[]
    upsert?: CommunityCommentUpsertWithWhereUniqueWithoutParentInput | CommunityCommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommunityCommentCreateManyParentInputEnvelope
    set?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    disconnect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    delete?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    connect?: CommunityCommentWhereUniqueInput | CommunityCommentWhereUniqueInput[]
    update?: CommunityCommentUpdateWithWhereUniqueWithoutParentInput | CommunityCommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommunityCommentUpdateManyWithWhereWithoutParentInput | CommunityCommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommunityCommentScalarWhereInput | CommunityCommentScalarWhereInput[]
  }

  export type CommunityPostCreateNestedOneWithoutLikesInput = {
    create?: XOR<CommunityPostCreateWithoutLikesInput, CommunityPostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: CommunityPostCreateOrConnectWithoutLikesInput
    connect?: CommunityPostWhereUniqueInput
  }

  export type CommunityPostUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<CommunityPostCreateWithoutLikesInput, CommunityPostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: CommunityPostCreateOrConnectWithoutLikesInput
    upsert?: CommunityPostUpsertWithoutLikesInput
    connect?: CommunityPostWhereUniqueInput
    update?: XOR<XOR<CommunityPostUpdateToOneWithWhereWithoutLikesInput, CommunityPostUpdateWithoutLikesInput>, CommunityPostUncheckedUpdateWithoutLikesInput>
  }

  export type DirectParticipantCreateNestedManyWithoutConversationInput = {
    create?: XOR<DirectParticipantCreateWithoutConversationInput, DirectParticipantUncheckedCreateWithoutConversationInput> | DirectParticipantCreateWithoutConversationInput[] | DirectParticipantUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectParticipantCreateOrConnectWithoutConversationInput | DirectParticipantCreateOrConnectWithoutConversationInput[]
    createMany?: DirectParticipantCreateManyConversationInputEnvelope
    connect?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
  }

  export type DirectMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<DirectMessageCreateWithoutConversationInput, DirectMessageUncheckedCreateWithoutConversationInput> | DirectMessageCreateWithoutConversationInput[] | DirectMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectMessageCreateOrConnectWithoutConversationInput | DirectMessageCreateOrConnectWithoutConversationInput[]
    createMany?: DirectMessageCreateManyConversationInputEnvelope
    connect?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
  }

  export type DirectParticipantUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<DirectParticipantCreateWithoutConversationInput, DirectParticipantUncheckedCreateWithoutConversationInput> | DirectParticipantCreateWithoutConversationInput[] | DirectParticipantUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectParticipantCreateOrConnectWithoutConversationInput | DirectParticipantCreateOrConnectWithoutConversationInput[]
    createMany?: DirectParticipantCreateManyConversationInputEnvelope
    connect?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
  }

  export type DirectMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<DirectMessageCreateWithoutConversationInput, DirectMessageUncheckedCreateWithoutConversationInput> | DirectMessageCreateWithoutConversationInput[] | DirectMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectMessageCreateOrConnectWithoutConversationInput | DirectMessageCreateOrConnectWithoutConversationInput[]
    createMany?: DirectMessageCreateManyConversationInputEnvelope
    connect?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
  }

  export type DirectParticipantUpdateManyWithoutConversationNestedInput = {
    create?: XOR<DirectParticipantCreateWithoutConversationInput, DirectParticipantUncheckedCreateWithoutConversationInput> | DirectParticipantCreateWithoutConversationInput[] | DirectParticipantUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectParticipantCreateOrConnectWithoutConversationInput | DirectParticipantCreateOrConnectWithoutConversationInput[]
    upsert?: DirectParticipantUpsertWithWhereUniqueWithoutConversationInput | DirectParticipantUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: DirectParticipantCreateManyConversationInputEnvelope
    set?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    disconnect?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    delete?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    connect?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    update?: DirectParticipantUpdateWithWhereUniqueWithoutConversationInput | DirectParticipantUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: DirectParticipantUpdateManyWithWhereWithoutConversationInput | DirectParticipantUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: DirectParticipantScalarWhereInput | DirectParticipantScalarWhereInput[]
  }

  export type DirectMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<DirectMessageCreateWithoutConversationInput, DirectMessageUncheckedCreateWithoutConversationInput> | DirectMessageCreateWithoutConversationInput[] | DirectMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectMessageCreateOrConnectWithoutConversationInput | DirectMessageCreateOrConnectWithoutConversationInput[]
    upsert?: DirectMessageUpsertWithWhereUniqueWithoutConversationInput | DirectMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: DirectMessageCreateManyConversationInputEnvelope
    set?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    disconnect?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    delete?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    connect?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    update?: DirectMessageUpdateWithWhereUniqueWithoutConversationInput | DirectMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: DirectMessageUpdateManyWithWhereWithoutConversationInput | DirectMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: DirectMessageScalarWhereInput | DirectMessageScalarWhereInput[]
  }

  export type DirectParticipantUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<DirectParticipantCreateWithoutConversationInput, DirectParticipantUncheckedCreateWithoutConversationInput> | DirectParticipantCreateWithoutConversationInput[] | DirectParticipantUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectParticipantCreateOrConnectWithoutConversationInput | DirectParticipantCreateOrConnectWithoutConversationInput[]
    upsert?: DirectParticipantUpsertWithWhereUniqueWithoutConversationInput | DirectParticipantUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: DirectParticipantCreateManyConversationInputEnvelope
    set?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    disconnect?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    delete?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    connect?: DirectParticipantWhereUniqueInput | DirectParticipantWhereUniqueInput[]
    update?: DirectParticipantUpdateWithWhereUniqueWithoutConversationInput | DirectParticipantUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: DirectParticipantUpdateManyWithWhereWithoutConversationInput | DirectParticipantUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: DirectParticipantScalarWhereInput | DirectParticipantScalarWhereInput[]
  }

  export type DirectMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<DirectMessageCreateWithoutConversationInput, DirectMessageUncheckedCreateWithoutConversationInput> | DirectMessageCreateWithoutConversationInput[] | DirectMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: DirectMessageCreateOrConnectWithoutConversationInput | DirectMessageCreateOrConnectWithoutConversationInput[]
    upsert?: DirectMessageUpsertWithWhereUniqueWithoutConversationInput | DirectMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: DirectMessageCreateManyConversationInputEnvelope
    set?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    disconnect?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    delete?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    connect?: DirectMessageWhereUniqueInput | DirectMessageWhereUniqueInput[]
    update?: DirectMessageUpdateWithWhereUniqueWithoutConversationInput | DirectMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: DirectMessageUpdateManyWithWhereWithoutConversationInput | DirectMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: DirectMessageScalarWhereInput | DirectMessageScalarWhereInput[]
  }

  export type DirectConversationCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<DirectConversationCreateWithoutParticipantsInput, DirectConversationUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: DirectConversationCreateOrConnectWithoutParticipantsInput
    connect?: DirectConversationWhereUniqueInput
  }

  export type DirectConversationUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<DirectConversationCreateWithoutParticipantsInput, DirectConversationUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: DirectConversationCreateOrConnectWithoutParticipantsInput
    upsert?: DirectConversationUpsertWithoutParticipantsInput
    connect?: DirectConversationWhereUniqueInput
    update?: XOR<XOR<DirectConversationUpdateToOneWithWhereWithoutParticipantsInput, DirectConversationUpdateWithoutParticipantsInput>, DirectConversationUncheckedUpdateWithoutParticipantsInput>
  }

  export type DirectConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<DirectConversationCreateWithoutMessagesInput, DirectConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DirectConversationCreateOrConnectWithoutMessagesInput
    connect?: DirectConversationWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DirectConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<DirectConversationCreateWithoutMessagesInput, DirectConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DirectConversationCreateOrConnectWithoutMessagesInput
    upsert?: DirectConversationUpsertWithoutMessagesInput
    connect?: DirectConversationWhereUniqueInput
    update?: XOR<XOR<DirectConversationUpdateToOneWithWhereWithoutMessagesInput, DirectConversationUpdateWithoutMessagesInput>, DirectConversationUncheckedUpdateWithoutMessagesInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type CommunityCommentCreateWithoutPostInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
    parent?: CommunityCommentCreateNestedOneWithoutRepliesInput
    replies?: CommunityCommentCreateNestedManyWithoutParentInput
  }

  export type CommunityCommentUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    parentId?: string | null
    createdAt?: Date | string
    replies?: CommunityCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommunityCommentCreateOrConnectWithoutPostInput = {
    where: CommunityCommentWhereUniqueInput
    create: XOR<CommunityCommentCreateWithoutPostInput, CommunityCommentUncheckedCreateWithoutPostInput>
  }

  export type CommunityCommentCreateManyPostInputEnvelope = {
    data: CommunityCommentCreateManyPostInput | CommunityCommentCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type CommunityLikeCreateWithoutPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type CommunityLikeUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type CommunityLikeCreateOrConnectWithoutPostInput = {
    where: CommunityLikeWhereUniqueInput
    create: XOR<CommunityLikeCreateWithoutPostInput, CommunityLikeUncheckedCreateWithoutPostInput>
  }

  export type CommunityLikeCreateManyPostInputEnvelope = {
    data: CommunityLikeCreateManyPostInput | CommunityLikeCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type CommunityCommentUpsertWithWhereUniqueWithoutPostInput = {
    where: CommunityCommentWhereUniqueInput
    update: XOR<CommunityCommentUpdateWithoutPostInput, CommunityCommentUncheckedUpdateWithoutPostInput>
    create: XOR<CommunityCommentCreateWithoutPostInput, CommunityCommentUncheckedCreateWithoutPostInput>
  }

  export type CommunityCommentUpdateWithWhereUniqueWithoutPostInput = {
    where: CommunityCommentWhereUniqueInput
    data: XOR<CommunityCommentUpdateWithoutPostInput, CommunityCommentUncheckedUpdateWithoutPostInput>
  }

  export type CommunityCommentUpdateManyWithWhereWithoutPostInput = {
    where: CommunityCommentScalarWhereInput
    data: XOR<CommunityCommentUpdateManyMutationInput, CommunityCommentUncheckedUpdateManyWithoutPostInput>
  }

  export type CommunityCommentScalarWhereInput = {
    AND?: CommunityCommentScalarWhereInput | CommunityCommentScalarWhereInput[]
    OR?: CommunityCommentScalarWhereInput[]
    NOT?: CommunityCommentScalarWhereInput | CommunityCommentScalarWhereInput[]
    id?: StringFilter<"CommunityComment"> | string
    postId?: StringFilter<"CommunityComment"> | string
    userId?: StringFilter<"CommunityComment"> | string
    content?: StringNullableFilter<"CommunityComment"> | string | null
    stickerId?: StringNullableFilter<"CommunityComment"> | string | null
    parentId?: StringNullableFilter<"CommunityComment"> | string | null
    createdAt?: DateTimeFilter<"CommunityComment"> | Date | string
  }

  export type CommunityLikeUpsertWithWhereUniqueWithoutPostInput = {
    where: CommunityLikeWhereUniqueInput
    update: XOR<CommunityLikeUpdateWithoutPostInput, CommunityLikeUncheckedUpdateWithoutPostInput>
    create: XOR<CommunityLikeCreateWithoutPostInput, CommunityLikeUncheckedCreateWithoutPostInput>
  }

  export type CommunityLikeUpdateWithWhereUniqueWithoutPostInput = {
    where: CommunityLikeWhereUniqueInput
    data: XOR<CommunityLikeUpdateWithoutPostInput, CommunityLikeUncheckedUpdateWithoutPostInput>
  }

  export type CommunityLikeUpdateManyWithWhereWithoutPostInput = {
    where: CommunityLikeScalarWhereInput
    data: XOR<CommunityLikeUpdateManyMutationInput, CommunityLikeUncheckedUpdateManyWithoutPostInput>
  }

  export type CommunityLikeScalarWhereInput = {
    AND?: CommunityLikeScalarWhereInput | CommunityLikeScalarWhereInput[]
    OR?: CommunityLikeScalarWhereInput[]
    NOT?: CommunityLikeScalarWhereInput | CommunityLikeScalarWhereInput[]
    id?: StringFilter<"CommunityLike"> | string
    postId?: StringFilter<"CommunityLike"> | string
    userId?: StringFilter<"CommunityLike"> | string
    createdAt?: DateTimeFilter<"CommunityLike"> | Date | string
  }

  export type CommunityPostCreateWithoutCommentsInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
    likes?: CommunityLikeCreateNestedManyWithoutPostInput
  }

  export type CommunityPostUncheckedCreateWithoutCommentsInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
    likes?: CommunityLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type CommunityPostCreateOrConnectWithoutCommentsInput = {
    where: CommunityPostWhereUniqueInput
    create: XOR<CommunityPostCreateWithoutCommentsInput, CommunityPostUncheckedCreateWithoutCommentsInput>
  }

  export type CommunityCommentCreateWithoutRepliesInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
    post: CommunityPostCreateNestedOneWithoutCommentsInput
    parent?: CommunityCommentCreateNestedOneWithoutRepliesInput
  }

  export type CommunityCommentUncheckedCreateWithoutRepliesInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
    parentId?: string | null
    createdAt?: Date | string
  }

  export type CommunityCommentCreateOrConnectWithoutRepliesInput = {
    where: CommunityCommentWhereUniqueInput
    create: XOR<CommunityCommentCreateWithoutRepliesInput, CommunityCommentUncheckedCreateWithoutRepliesInput>
  }

  export type CommunityCommentCreateWithoutParentInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
    post: CommunityPostCreateNestedOneWithoutCommentsInput
    replies?: CommunityCommentCreateNestedManyWithoutParentInput
  }

  export type CommunityCommentUncheckedCreateWithoutParentInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
    replies?: CommunityCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommunityCommentCreateOrConnectWithoutParentInput = {
    where: CommunityCommentWhereUniqueInput
    create: XOR<CommunityCommentCreateWithoutParentInput, CommunityCommentUncheckedCreateWithoutParentInput>
  }

  export type CommunityCommentCreateManyParentInputEnvelope = {
    data: CommunityCommentCreateManyParentInput | CommunityCommentCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type CommunityPostUpsertWithoutCommentsInput = {
    update: XOR<CommunityPostUpdateWithoutCommentsInput, CommunityPostUncheckedUpdateWithoutCommentsInput>
    create: XOR<CommunityPostCreateWithoutCommentsInput, CommunityPostUncheckedCreateWithoutCommentsInput>
    where?: CommunityPostWhereInput
  }

  export type CommunityPostUpdateToOneWithWhereWithoutCommentsInput = {
    where?: CommunityPostWhereInput
    data: XOR<CommunityPostUpdateWithoutCommentsInput, CommunityPostUncheckedUpdateWithoutCommentsInput>
  }

  export type CommunityPostUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: CommunityLikeUpdateManyWithoutPostNestedInput
  }

  export type CommunityPostUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: CommunityLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CommunityCommentUpsertWithoutRepliesInput = {
    update: XOR<CommunityCommentUpdateWithoutRepliesInput, CommunityCommentUncheckedUpdateWithoutRepliesInput>
    create: XOR<CommunityCommentCreateWithoutRepliesInput, CommunityCommentUncheckedCreateWithoutRepliesInput>
    where?: CommunityCommentWhereInput
  }

  export type CommunityCommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: CommunityCommentWhereInput
    data: XOR<CommunityCommentUpdateWithoutRepliesInput, CommunityCommentUncheckedUpdateWithoutRepliesInput>
  }

  export type CommunityCommentUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CommunityPostUpdateOneRequiredWithoutCommentsNestedInput
    parent?: CommunityCommentUpdateOneWithoutRepliesNestedInput
  }

  export type CommunityCommentUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentUpsertWithWhereUniqueWithoutParentInput = {
    where: CommunityCommentWhereUniqueInput
    update: XOR<CommunityCommentUpdateWithoutParentInput, CommunityCommentUncheckedUpdateWithoutParentInput>
    create: XOR<CommunityCommentCreateWithoutParentInput, CommunityCommentUncheckedCreateWithoutParentInput>
  }

  export type CommunityCommentUpdateWithWhereUniqueWithoutParentInput = {
    where: CommunityCommentWhereUniqueInput
    data: XOR<CommunityCommentUpdateWithoutParentInput, CommunityCommentUncheckedUpdateWithoutParentInput>
  }

  export type CommunityCommentUpdateManyWithWhereWithoutParentInput = {
    where: CommunityCommentScalarWhereInput
    data: XOR<CommunityCommentUpdateManyMutationInput, CommunityCommentUncheckedUpdateManyWithoutParentInput>
  }

  export type CommunityPostCreateWithoutLikesInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
    comments?: CommunityCommentCreateNestedManyWithoutPostInput
  }

  export type CommunityPostUncheckedCreateWithoutLikesInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
    isHidden?: boolean
    createdAt?: Date | string
    comments?: CommunityCommentUncheckedCreateNestedManyWithoutPostInput
  }

  export type CommunityPostCreateOrConnectWithoutLikesInput = {
    where: CommunityPostWhereUniqueInput
    create: XOR<CommunityPostCreateWithoutLikesInput, CommunityPostUncheckedCreateWithoutLikesInput>
  }

  export type CommunityPostUpsertWithoutLikesInput = {
    update: XOR<CommunityPostUpdateWithoutLikesInput, CommunityPostUncheckedUpdateWithoutLikesInput>
    create: XOR<CommunityPostCreateWithoutLikesInput, CommunityPostUncheckedCreateWithoutLikesInput>
    where?: CommunityPostWhereInput
  }

  export type CommunityPostUpdateToOneWithWhereWithoutLikesInput = {
    where?: CommunityPostWhereInput
    data: XOR<CommunityPostUpdateWithoutLikesInput, CommunityPostUncheckedUpdateWithoutLikesInput>
  }

  export type CommunityPostUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommunityCommentUpdateManyWithoutPostNestedInput
  }

  export type CommunityPostUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    audioDurationSec?: NullableIntFieldUpdateOperationsInput | number | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    isHidden?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommunityCommentUncheckedUpdateManyWithoutPostNestedInput
  }

  export type DirectParticipantCreateWithoutConversationInput = {
    id?: string
    userId: string
    joinedAt?: Date | string
  }

  export type DirectParticipantUncheckedCreateWithoutConversationInput = {
    id?: string
    userId: string
    joinedAt?: Date | string
  }

  export type DirectParticipantCreateOrConnectWithoutConversationInput = {
    where: DirectParticipantWhereUniqueInput
    create: XOR<DirectParticipantCreateWithoutConversationInput, DirectParticipantUncheckedCreateWithoutConversationInput>
  }

  export type DirectParticipantCreateManyConversationInputEnvelope = {
    data: DirectParticipantCreateManyConversationInput | DirectParticipantCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type DirectMessageCreateWithoutConversationInput = {
    id?: string
    senderId: string
    content: string
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type DirectMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    senderId: string
    content: string
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type DirectMessageCreateOrConnectWithoutConversationInput = {
    where: DirectMessageWhereUniqueInput
    create: XOR<DirectMessageCreateWithoutConversationInput, DirectMessageUncheckedCreateWithoutConversationInput>
  }

  export type DirectMessageCreateManyConversationInputEnvelope = {
    data: DirectMessageCreateManyConversationInput | DirectMessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type DirectParticipantUpsertWithWhereUniqueWithoutConversationInput = {
    where: DirectParticipantWhereUniqueInput
    update: XOR<DirectParticipantUpdateWithoutConversationInput, DirectParticipantUncheckedUpdateWithoutConversationInput>
    create: XOR<DirectParticipantCreateWithoutConversationInput, DirectParticipantUncheckedCreateWithoutConversationInput>
  }

  export type DirectParticipantUpdateWithWhereUniqueWithoutConversationInput = {
    where: DirectParticipantWhereUniqueInput
    data: XOR<DirectParticipantUpdateWithoutConversationInput, DirectParticipantUncheckedUpdateWithoutConversationInput>
  }

  export type DirectParticipantUpdateManyWithWhereWithoutConversationInput = {
    where: DirectParticipantScalarWhereInput
    data: XOR<DirectParticipantUpdateManyMutationInput, DirectParticipantUncheckedUpdateManyWithoutConversationInput>
  }

  export type DirectParticipantScalarWhereInput = {
    AND?: DirectParticipantScalarWhereInput | DirectParticipantScalarWhereInput[]
    OR?: DirectParticipantScalarWhereInput[]
    NOT?: DirectParticipantScalarWhereInput | DirectParticipantScalarWhereInput[]
    id?: StringFilter<"DirectParticipant"> | string
    conversationId?: StringFilter<"DirectParticipant"> | string
    userId?: StringFilter<"DirectParticipant"> | string
    joinedAt?: DateTimeFilter<"DirectParticipant"> | Date | string
  }

  export type DirectMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: DirectMessageWhereUniqueInput
    update: XOR<DirectMessageUpdateWithoutConversationInput, DirectMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<DirectMessageCreateWithoutConversationInput, DirectMessageUncheckedCreateWithoutConversationInput>
  }

  export type DirectMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: DirectMessageWhereUniqueInput
    data: XOR<DirectMessageUpdateWithoutConversationInput, DirectMessageUncheckedUpdateWithoutConversationInput>
  }

  export type DirectMessageUpdateManyWithWhereWithoutConversationInput = {
    where: DirectMessageScalarWhereInput
    data: XOR<DirectMessageUpdateManyMutationInput, DirectMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type DirectMessageScalarWhereInput = {
    AND?: DirectMessageScalarWhereInput | DirectMessageScalarWhereInput[]
    OR?: DirectMessageScalarWhereInput[]
    NOT?: DirectMessageScalarWhereInput | DirectMessageScalarWhereInput[]
    id?: StringFilter<"DirectMessage"> | string
    conversationId?: StringFilter<"DirectMessage"> | string
    senderId?: StringFilter<"DirectMessage"> | string
    content?: StringFilter<"DirectMessage"> | string
    createdAt?: DateTimeFilter<"DirectMessage"> | Date | string
    readAt?: DateTimeNullableFilter<"DirectMessage"> | Date | string | null
  }

  export type DirectConversationCreateWithoutParticipantsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
    messages?: DirectMessageCreateNestedManyWithoutConversationInput
  }

  export type DirectConversationUncheckedCreateWithoutParticipantsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
    messages?: DirectMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type DirectConversationCreateOrConnectWithoutParticipantsInput = {
    where: DirectConversationWhereUniqueInput
    create: XOR<DirectConversationCreateWithoutParticipantsInput, DirectConversationUncheckedCreateWithoutParticipantsInput>
  }

  export type DirectConversationUpsertWithoutParticipantsInput = {
    update: XOR<DirectConversationUpdateWithoutParticipantsInput, DirectConversationUncheckedUpdateWithoutParticipantsInput>
    create: XOR<DirectConversationCreateWithoutParticipantsInput, DirectConversationUncheckedCreateWithoutParticipantsInput>
    where?: DirectConversationWhereInput
  }

  export type DirectConversationUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: DirectConversationWhereInput
    data: XOR<DirectConversationUpdateWithoutParticipantsInput, DirectConversationUncheckedUpdateWithoutParticipantsInput>
  }

  export type DirectConversationUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: DirectMessageUpdateManyWithoutConversationNestedInput
  }

  export type DirectConversationUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: DirectMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type DirectConversationCreateWithoutMessagesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
    participants?: DirectParticipantCreateNestedManyWithoutConversationInput
  }

  export type DirectConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    lastMessageAt?: Date | string
    participants?: DirectParticipantUncheckedCreateNestedManyWithoutConversationInput
  }

  export type DirectConversationCreateOrConnectWithoutMessagesInput = {
    where: DirectConversationWhereUniqueInput
    create: XOR<DirectConversationCreateWithoutMessagesInput, DirectConversationUncheckedCreateWithoutMessagesInput>
  }

  export type DirectConversationUpsertWithoutMessagesInput = {
    update: XOR<DirectConversationUpdateWithoutMessagesInput, DirectConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<DirectConversationCreateWithoutMessagesInput, DirectConversationUncheckedCreateWithoutMessagesInput>
    where?: DirectConversationWhereInput
  }

  export type DirectConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: DirectConversationWhereInput
    data: XOR<DirectConversationUpdateWithoutMessagesInput, DirectConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type DirectConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: DirectParticipantUpdateManyWithoutConversationNestedInput
  }

  export type DirectConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: DirectParticipantUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type CommunityCommentCreateManyPostInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    parentId?: string | null
    createdAt?: Date | string
  }

  export type CommunityLikeCreateManyPostInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type CommunityCommentUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: CommunityCommentUpdateOneWithoutRepliesNestedInput
    replies?: CommunityCommentUpdateManyWithoutParentNestedInput
  }

  export type CommunityCommentUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: CommunityCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommunityCommentUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentCreateManyParentInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
  }

  export type CommunityCommentUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CommunityPostUpdateOneRequiredWithoutCommentsNestedInput
    replies?: CommunityCommentUpdateManyWithoutParentNestedInput
  }

  export type CommunityCommentUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: CommunityCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommunityCommentUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectParticipantCreateManyConversationInput = {
    id?: string
    userId: string
    joinedAt?: Date | string
  }

  export type DirectMessageCreateManyConversationInput = {
    id?: string
    senderId: string
    content: string
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type DirectParticipantUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectParticipantUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectParticipantUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DirectMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DirectMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CommunityPostCountOutputTypeDefaultArgs instead
     */
    export type CommunityPostCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityPostCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityCommentCountOutputTypeDefaultArgs instead
     */
    export type CommunityCommentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityCommentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectConversationCountOutputTypeDefaultArgs instead
     */
    export type DirectConversationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectConversationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityPostDefaultArgs instead
     */
    export type CommunityPostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityPostDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityCommentDefaultArgs instead
     */
    export type CommunityCommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityCommentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityLikeDefaultArgs instead
     */
    export type CommunityLikeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityLikeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectConversationDefaultArgs instead
     */
    export type DirectConversationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectConversationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectParticipantDefaultArgs instead
     */
    export type DirectParticipantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectParticipantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectMessageDefaultArgs instead
     */
    export type DirectMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectMessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityFollowDefaultArgs instead
     */
    export type CommunityFollowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityFollowDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityBookmarkDefaultArgs instead
     */
    export type CommunityBookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityBookmarkDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunityNotificationDefaultArgs instead
     */
    export type CommunityNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityNotificationDefaultArgs<ExtArgs>

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