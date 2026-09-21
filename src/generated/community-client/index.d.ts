
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
    CommunityLike: 'CommunityLike'
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
      modelProps: "communityPost" | "communityComment" | "communityLike"
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
    createdAt: Date | null
  }

  export type CommunityCommentMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
    content: string | null
    stickerId: string | null
    createdAt: Date | null
  }

  export type CommunityCommentCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    content: number
    stickerId: number
    createdAt: number
    _all: number
  }


  export type CommunityCommentMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    stickerId?: true
    createdAt?: true
  }

  export type CommunityCommentMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    stickerId?: true
    createdAt?: true
  }

  export type CommunityCommentCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    content?: true
    stickerId?: true
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
    createdAt?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityComment"]>

  export type CommunityCommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    stickerId?: boolean
    createdAt?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityComment"]>

  export type CommunityCommentSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    content?: boolean
    stickerId?: boolean
    createdAt?: boolean
  }

  export type CommunityCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }
  export type CommunityCommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }

  export type $CommunityCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunityComment"
    objects: {
      post: Prisma.$CommunityPostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      postId: string
      userId: string
      content: string | null
      stickerId: string | null
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
  }

  export type CommunityLikeMaxAggregateOutputType = {
    id: string | null
    postId: string | null
    userId: string | null
  }

  export type CommunityLikeCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    _all: number
  }


  export type CommunityLikeMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type CommunityLikeMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type CommunityLikeCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
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
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityLike"]>

  export type CommunityLikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    post?: boolean | CommunityPostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communityLike"]>

  export type CommunityLikeSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
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
    createdAt: 'createdAt'
  };

  export type CommunityPostScalarFieldEnum = (typeof CommunityPostScalarFieldEnum)[keyof typeof CommunityPostScalarFieldEnum]


  export const CommunityCommentScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    content: 'content',
    stickerId: 'stickerId',
    createdAt: 'createdAt'
  };

  export type CommunityCommentScalarFieldEnum = (typeof CommunityCommentScalarFieldEnum)[keyof typeof CommunityCommentScalarFieldEnum]


  export const CommunityLikeScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId'
  };

  export type CommunityLikeScalarFieldEnum = (typeof CommunityLikeScalarFieldEnum)[keyof typeof CommunityLikeScalarFieldEnum]


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
    createdAt?: DateTimeFilter<"CommunityComment"> | Date | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
  }

  export type CommunityCommentOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    post?: CommunityPostOrderByWithRelationInput
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
    createdAt?: DateTimeFilter<"CommunityComment"> | Date | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
  }, "id">

  export type CommunityCommentOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrderInput | SortOrder
    stickerId?: SortOrderInput | SortOrder
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
    createdAt?: DateTimeWithAggregatesFilter<"CommunityComment"> | Date | string
  }

  export type CommunityLikeWhereInput = {
    AND?: CommunityLikeWhereInput | CommunityLikeWhereInput[]
    OR?: CommunityLikeWhereInput[]
    NOT?: CommunityLikeWhereInput | CommunityLikeWhereInput[]
    id?: StringFilter<"CommunityLike"> | string
    postId?: StringFilter<"CommunityLike"> | string
    userId?: StringFilter<"CommunityLike"> | string
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
  }

  export type CommunityLikeOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
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
    post?: XOR<CommunityPostRelationFilter, CommunityPostWhereInput>
  }, "id" | "postId_userId">

  export type CommunityLikeOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
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
  }

  export type CommunityPostCreateInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentCreateInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
    post: CommunityPostCreateNestedOneWithoutCommentsInput
  }

  export type CommunityCommentUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
  }

  export type CommunityCommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: CommunityPostUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommunityCommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentCreateManyInput = {
    id?: string
    postId: string
    userId: string
    content?: string | null
    stickerId?: string | null
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeCreateInput = {
    id?: string
    userId: string
    post: CommunityPostCreateNestedOneWithoutLikesInput
  }

  export type CommunityLikeUncheckedCreateInput = {
    id?: string
    postId: string
    userId: string
  }

  export type CommunityLikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    post?: CommunityPostUpdateOneRequiredWithoutLikesNestedInput
  }

  export type CommunityLikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommunityLikeCreateManyInput = {
    id?: string
    postId: string
    userId: string
  }

  export type CommunityLikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommunityLikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
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

  export type CommunityCommentCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    stickerId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    stickerId?: SortOrder
    createdAt?: SortOrder
  }

  export type CommunityCommentMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    stickerId?: SortOrder
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
  }

  export type CommunityLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type CommunityLikeMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
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

  export type CommunityPostUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<CommunityPostCreateWithoutCommentsInput, CommunityPostUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: CommunityPostCreateOrConnectWithoutCommentsInput
    upsert?: CommunityPostUpsertWithoutCommentsInput
    connect?: CommunityPostWhereUniqueInput
    update?: XOR<XOR<CommunityPostUpdateToOneWithWhereWithoutCommentsInput, CommunityPostUpdateWithoutCommentsInput>, CommunityPostUncheckedUpdateWithoutCommentsInput>
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

  export type CommunityCommentCreateWithoutPostInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
  }

  export type CommunityCommentUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
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
  }

  export type CommunityLikeUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
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
  }

  export type CommunityPostCreateWithoutCommentsInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
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
    createdAt?: Date | string
    likes?: CommunityLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type CommunityPostCreateOrConnectWithoutCommentsInput = {
    where: CommunityPostWhereUniqueInput
    create: XOR<CommunityPostCreateWithoutCommentsInput, CommunityPostUncheckedCreateWithoutCommentsInput>
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: CommunityLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CommunityPostCreateWithoutLikesInput = {
    id?: string
    userId: string
    content?: string | null
    imageUrl?: string | null
    audioUrl?: string | null
    audioDurationSec?: number | null
    stickerId?: string | null
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommunityCommentUncheckedUpdateManyWithoutPostNestedInput
  }

  export type CommunityCommentCreateManyPostInput = {
    id?: string
    userId: string
    content?: string | null
    stickerId?: string | null
    createdAt?: Date | string
  }

  export type CommunityLikeCreateManyPostInput = {
    id?: string
    userId: string
  }

  export type CommunityCommentUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityCommentUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    stickerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommunityLikeUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommunityLikeUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CommunityLikeUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CommunityPostCountOutputTypeDefaultArgs instead
     */
    export type CommunityPostCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunityPostCountOutputTypeDefaultArgs<ExtArgs>
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