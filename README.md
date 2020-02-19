
# osv - Object Schema Validation

[![npm](https://img.shields.io/npm/v/osv.svg)](https://npmjs.com/package/osv) [![GitHub](https://img.shields.io/github/license/florianstahr/osv.svg?color=brightgreen)](https://github.com/florianstahr/osv)

This library can be used for validating JavaScript objects or other data types like numbers, strings, booleans or arrays.
It is very strongly inspired by [@hapijs/joi](https://github.com/hapijs/joi) and
[mongoose](https://github.com/Automattic/mongoose) schema validation.

```typescript
import OSV from 'osv';

const schema = OSV.schema({
  users: OSV.array({
    required: true,
    item: OSV.schema({
      username: OSV.string({
        required: true,
        empty: false,
      }),
      role: OSV.string({
        required: true,
        oneOf: ['owner', 'admin', 'subscriber'],
      }),
    }),
  }),
});

const obj = {
  users: [
    {
      username: 'tomato12',
      role: 'owner',
    },
    {
      username: 'apple56',
      role: 'admin',
    },
  ],
}

// asynchronous

const resultAsync = schema.validate(obj); // Promise<Data>

resultAsync
  .then(value => {
    console.log(value); // the validated value
  })
  .catch(e => {
    console.error(e); // ValidationError
  });

// synchronous

const resultSync = schema.validateSync(obj); // { value?: Data, error?: ValidationError, exec: () => Promise<Data> }

resultSync.exec()
  .then(value => {
    console.log(value); // the validated value

    /*
      {
        users: [
          {
            username: 'tomato12',
            role: 'owner',
          },
          {
            username: 'apple56',
            role: 'admin',
          },
        ],
      }
    */
  })
  .catch(e => {
    console.error(e); // ValidationError
  });
```

## Installation

```
$ npm install --save osv
```
or
```
$ yarn add osv
```

## API

This library is able to validate `arrays`, `booleans`, `numbers`, `strings` and of course `objects`.

By default, all specified keys of an object are `optional`. If a key is missing in an object but it has an object with additional keys as its value, a plain object will be added (_see examples_).

### ObjectSchema

```typescript
// types
type Validator<Data> = BaseSchemaType | ObjectSchema<Data>;

interface DefinitionObject<Data> {
  [path: string]: DefinitionObject<Data> | Validator<Data>;
}

type Definition<Data> = DefinitionObject<Data> | Validator<Data>;
```

Simply define your object schema and create an `ObjectSchema` instance.

```typescript
import OSV, { OSVTypeRef } from 'osv';

interface User {
  id: string;
  username: string;
  role: 'owner' | 'admin' | 'subscriber';
  followers: {
    id: string;
  }[];
}

const definition: OSVTypeRef.Schema.Definition<User> = {
  username: OSV.string({
    required: true,
    empty: false,
  }),
  role: OSV.string({
    required: true,
    oneOf: ['owner', 'admin', 'subscriber'],
  }),
  followers: OSV.array({
    item: OSV.schema({
      id: OSV.string({ required: true, empty: false }),
    }),
  }),
};

const schema = OSV.schema<User>(definition);
```

After that you can validate objects. The `validate` method returns a Promise which resolves to the validated data if successful. Otherwise it rejects with a `ValidationError`.

The `validateSync` method returns an object with the following schema:

```typescript
// Data: the data type of the validated value
type ValidationResult<Data> = {
  value?: Data;
  error?: ValidationError;
  exec: () => Promise<Data>;
}
```

```typescript
const user1 = {
  username: 'tomato',
  role: 'owner',
  followers: [{
    id: 'apple',
  }],
};

// async

schema.validate(user1)
  .then((user) => {
    // use validated user
    const username = user.username;
  });

// sync

const result = schema.validate(user1);

console.log(result.value, result.error);

const user2 = {
  username: 'tomato',
  role: 'author',
  followers: [{
    id: 'apple',
  }],
};

schema.validate(user1)
  .catch((e) => {
    // ValidationError
    // e.message: 'There was an error while validating: string/not-allowed'
    // e.code: 'string/not-allowed'
    // e.path: 'role'
    // value: 'author'
  });
```

You can also omit specific paths during checking. These are just transfered onto the result value the way they are on the initial value. A whitelist and a blacklist are both optional.

```typescript
interface ObjectSchemaValidationOptions {
  check?: {
    whitelist?: string[]; // all paths that should be checked,
    blacklist?: string[]; // all paths that shouldn't be checked
  };
}

schema.validate({
  username: 'tomato',
  role: 'owner',
  followers: [{
    id: undefined,
  }],
}, {
  check: {
    blacklist: ['followers.id'],
  }
}) // succeeds
  .then((user) => {
    // use validated user
    const username = user.username;
    const firstFollowerId = user.followers[0].id; // -> undefined
  });
```

### BaseSchemaType - `ObjectSchema.Types.Base`

_This is the schema type which all others extend from._

#### Options

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `required?` | if a value is required or not | `boolean | <D = any>(value: any, data: D) => boolean` | |
| `pre?.validate?` | run before every validation, returns value | `<D = any>(value: any, data: D) => any;` | |
| `post?.validate?` | run after every validation, returns value | `<D = any>(value: any, data: D) => any;` | |

### ArraySchemaType - `OSV.array(options)` - `ObjectSchema.Types.Array`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| **`item`** | array item object schema | `ObjectSchema` | |
| `allowNull?` | allow `null` as a valid value | `boolean` | |
| `min?` | at least ... items | `number` | |
| `max?` | ... items at maximum | `number` | |
| `length?` | exact ... items | `number` | |

### BooleanSchemaType - `OSV.boolean(options)` - `ObjectSchema.Types.Boolean`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `allowNull?` | allow `null` as a valid value | `boolean` | 

### CustomSchemaType - `OSV.custom(options)` - `ObjectSchema.Types.Custom`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `validate` | custom validation callback | see [options](https://github.com/florianstahr/osv/tree/master/src/types/schema-types/custom.schema-types.types.ts) or [callback](https://github.com/florianstahr/osv/tree/master/src/types/schema.types.ts#L38) type | 

### NumberSchemaType - `OSV.number(options)` - `ObjectSchema.Types.Number`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `allowNull?` | allow `null` as a valid value | `boolean` | |
| `min?` | value has to be ... at least | `number` | |
| `max?` | value has to be ... at maximum | `number` | |
| `greater?` | value has to be greater than ... | `number` | |
| `less?` | value has to be less than ... | `number` | |
| `integer?` | value has to be an integer | `boolean` | |
| `positive?` | value has to be positive | `boolean` | |
| `negative?` | value has to be negative | `boolean` | |

### OptionalSchemaType - `OSV.optional(options)` - `ObjectSchema.Types.Optional`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| **`item`** | array item object schema | `ObjectSchema` | |
| `allowNull?` | allow `null` as a valid value | `boolean` | |

### StringSchemaType - `OSV.string(options)` - `ObjectSchema.Types.String`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `allowNull?` | allow `null` as a valid value | `boolean` | |
| `empty?` | value is allowed to have a length of 0 | `boolean` | `true` |
| `oneOf?` | value is allowed to be one of values | `string[]` | |
| `regex?` | value has to match regex | `RegExp` | |
| `length?` | value has to be of length | `number` | |
| `minLength?` | value has to be longer than minLength | `number` | |
| `maxLength?` | value has to be shorter than maxLength | `number` | |

### UnionSchemaType - `OSV.union(options)` - `ObjectSchema.Types.Union`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| **`schemas`** | array of ObjectSchemas which to use for validation | `ObjectSchema[]` | |
| `allowNull?` | allow `null` as a valid value | `boolean` | |
| `resolve?` | get index of schema in schemas array to use for validation. otherwise all schemas are tried. | `(data: any) => number` | |

## Example

```typescript
interface TestSchema {
  id: string;
  username: string;
  email: string;
  info: {
    person: {
      firstName?: string;
      lastName?: string;
    };
  };
  followers: string[];
}

const schema = OSV.schema<TestSchema>({
  id: OSV.string({ required: true }),
  username: OSV.string({ required: true }),
  email: OSV.string({ required: true }),
  info: {
    person: {
      firstName: OSV.string(),
      lastName: OSV.string(),
    },
  },
  followers: OSV.array({
    item: OSV.schema(OSV.string({ required: true })),
  }),
});

schema.validate({
  id: '123456',
  username: 'foo',
  email: 'foo@bar.com',
  followers: ['222222'],
})
  .then((result) => {
    // result:
    /*
      {
        id: '123456',
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {},
        },
        followers: ['222222'],
      }
    */
  });
```

## Contributing

PR welcome. This repository uses [`git flow`](https://danielkummer.github.io/git-flow-cheatsheet/).

**Commit format:** `ACTION: message`.

Example: `ADD: tests for schema types & object schema validator`.  
Action words could be e.g. `ADD`, `REFACTOR`, `RENAME` or `REMOVE`.

## License

[MIT License](https://github.com/florianstahr/osv/blob/master/LICENSE)
