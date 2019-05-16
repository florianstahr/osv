
# osv

[![npm](https://img.shields.io/npm/v/osv.svg)](https://npmjs.com/package/osv) [![GitHub](https://img.shields.io/github/license/florianstahr/osv.svg?colorB=brightgreen)](https://github.com/florianstahr/osv)

This library can be used for validating JavaScript objects or other data types like numbers, strings, booleans or arrays.
It is very strongly inspired by [@hapijs/joi](https://github.com/hapijs/joi) and
[mongoose](https://github.com/Automattic/mongoose) schema validation.

```typescript
import { ObjectSchema } from 'osv';

const { String, Array } = ObjectSchema.Types;

const schema = new ObjectSchema({
  users: new Array({
    required: true,
    item: new ObjectSchema({
      username: new String({
        required: true,
        empty: false,
      }),
      role: new String({
        required: true,
        oneOf: ['owner', 'admin', 'subscriber'],
      }),
    }),
  }),
});

schema.validate({
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
})
  .then((value) => {
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
  .catch((e) => {
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
type Validator<Data> = BaseSchemaType<Data>;

interface SchemaDefinitionObject<Data> {
  [path: string]: SchemaDefinitionObject<Data> | Validator<Data>;
}

type SchemaDefinition<Data> = SchemaDefinitionObject<Data> | Validator<Data>;
```

Simply define your object schema and create an `ObjectSchema` instance.

```typescript
import { ObjectSchema } from 'osv';
const { String, Array } = ObjectSchema.Types;

interface User {
  id: string;
  username: string;
  role: 'owner' | 'admin' | 'subscriber';
  followers: string[];
}

const definition: SchemaDefinition<User> = {
  username: new String({
    required: true,
    empty: false,
  }),
  role: new String({
    required: true,
    oneOf: ['owner', 'admin', 'subscriber'],
  }),
  followers: new Array({
    item: new ObjectSchema(new String({ required: true, empty: false })),
  }),
};

const schema = new ObjectSchema<User>(definition);
```

After that you can validate objects.

```typescript

const user1 = {
  username: 'tomato',
  role: 'owner',
  followers: ['apple'],
};

schema.validate(user1)
  .then((user) => {
    // use validated user
    const username = user.username;
  });

const user2 = {
  username: 'tomato',
  role: 'author',
  followers: ['apple'],
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

### BaseSchemaType - `ObjectSchema.Types.Base`

_This is the schema type which all others extend from._

#### Options

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `required?` | if a value is required or not | `boolean | <D = any>(value: any, data: D) => boolean` | |
| `pre?.validate?` | run before every validation, returns value | `<D = any>(value: any, data: D) => any;` | |
| `post?.validate?` | run after every validation, returns value | `<D = any>(value: any, data: D) => any;` | |

### ArraySchemaType - `ObjectSchema.Types.Array`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| **`item`** | array item object schema | `ObjectSchema` | |
| `min?` | at least ... items | `number` | |
| `max?` | ... items at maximum | `number` | |
| `length?` | exact ... items | `number` | |

### BooleanSchemaType - `ObjectSchema.Types.Boolean`

#### Options

Everything from `BaseSchemaType`.

### NumberSchemaType - `ObjectSchema.Types.Number`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `min?` | value has to be ... at least | `number` | |
| `max?` | value has to be ... at maximum | `number` | |
| `greater?` | value has to be greater than ... | `number` | |
| `less?` | value has to be less than ... | `number` | |
| `integer?` | value has to be an integer | `boolean` | |
| `positive?` | value has to be positive | `boolean` | |
| `negative?` | value has to be negative | `boolean` | |

### StringSchemaType - `ObjectSchema.Types.String`

#### Options

Everything from `BaseSchemaType` and ...

| Option Path | Info | Type | Default |
| --- | :---: | :---: | ---: |
| `empty?` | value is allowed to have a length of 0 | `boolean` | `true` |
| `oneOf?` | value is allowed to be one of values | `string[]` | |
| `regex?` | value has to match regex | `RegExp` | |
| `length?` | value has to be of length | `number` | |
| `minLength?` | value has to be longer than minLength | `number` | |
| `maxLength?` | value has to be shorter than maxLength | `number` | |

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

const schema = new ObjectSchema<TestSchema>({
  id: new ObjectSchema.Types.String({ required: true }),
  username: new ObjectSchema.Types.String({ required: true }),
  email: new ObjectSchema.Types.String({ required: true }),
  info: {
    person: {
      firstName: new ObjectSchema.Types.String({ }),
      lastName: new ObjectSchema.Types.String({ }),
    },
  },
  followers: new ObjectSchema.Types.Array({
    item: new ObjectSchema(new ObjectSchema.Types.String({ required: true })),
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
