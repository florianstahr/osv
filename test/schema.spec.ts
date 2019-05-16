import 'mocha';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import ObjectSchema from '../src/schema';
import {
  ArraySchemaTypeOptions,
  BooleanSchemaTypeOptions,
  NumberSchemaTypeOptions,
  StringSchemaTypeOptions, ValidationError,
} from '../src';

chai.use(chaiAsPromised);
const { expect } = chai;

chai.should();

describe('ObjectSchema', () => {
  describe('parse', () => {
    it('should succeed#basic-object', async () => {
      const schema = new ObjectSchema({
        foo: {
          bar: {
            foo: new ObjectSchema.types.String({}),
          },
        },
      });

      return schema.validate({
        foo: {
          bar: {
            foo: 'bar',
          },
        },
      }).should.to.be.fulfilled;
    });

    it('should succeed#just-schema-type', async () => {
      const schema = new ObjectSchema(new ObjectSchema.types.String({}));

      return schema.validate('foo').should.to.be.fulfilled;
    });
  });

  describe('Types', () => {
    // Type - String
    // -------------------------------------------------------------------------

    describe('String', () => {
      const getStringObjectSchema = (
        opts: StringSchemaTypeOptions = {},
      ): ObjectSchema<string> => new ObjectSchema(new ObjectSchema.types.String(opts));

      describe('required', () => {
        it('should succeed', () => getStringObjectSchema({
          required: true,
        })
          .validate('')
          .then((data) => {
            expect(data).to.equal('');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          required: true,
        })
          .validate(undefined)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.REQUIRED_BUT_MISSING,
          }).message));
      });

      describe('oneOf', () => {
        it('should succeed', () => getStringObjectSchema({
          oneOf: ['foo', 'bar'],
        })
          .validate('foo')
          .then((data) => {
            expect(data).to.equal('foo');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          oneOf: ['foo'],
        })
          .validate('bar')
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.NOT_ALLOWED,
          }).message));
      });

      describe('empty', () => {
        it('should succeed', () => getStringObjectSchema({
          empty: true,
        })
          .validate('')
          .then((data) => {
            expect(data).to.equal('');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          empty: false,
        })
          .validate('')
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.NOT_EMPTY,
          }).message));
      });

      describe('regex', () => {
        it('should succeed', () => getStringObjectSchema({
          regex: /^foo/,
        })
          .validate('foobar')
          .then((data) => {
            expect(data).to.equal('foobar');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          regex: /^foo/,
        })
          .validate('barfoo')
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.REGEX_FAILED,
          }).message));
      });

      describe('length', () => {
        it('should succeed', () => getStringObjectSchema({
          length: 3,
        })
          .validate('foo')
          .then((data) => {
            expect(data).to.equal('foo');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          length: 3,
        })
          .validate('foobar')
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.LENGTH_NOT_ALLOWED,
          }).message));
      });

      describe('minLength', () => {
        it('should succeed', () => getStringObjectSchema({
          minLength: 3,
        })
          .validate('foo')
          .then((data) => {
            expect(data).to.equal('foo');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          minLength: 4,
        })
          .validate('foo')
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.TOO_SHORT,
          }).message));
      });

      describe('maxLength', () => {
        it('should succeed', () => getStringObjectSchema({
          maxLength: 3,
        })
          .validate('foo')
          .then((data) => {
            expect(data).to.equal('foo');
          }).should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          maxLength: 2,
        })
          .validate('foo')
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.String.validationErrorCodes.TOO_LONG,
          }).message));
      });
    });

    // Type - Number
    // -------------------------------------------------------------------------

    describe('Number', () => {
      const getNumberObjectSchema = (
        opts: NumberSchemaTypeOptions = {},
      ): ObjectSchema<string> => new ObjectSchema(new ObjectSchema.types.Number(opts));

      describe('required', () => {
        it('should succeed', () => getNumberObjectSchema({
          required: true,
        })
          .validate(6.12765890)
          .then((data) => {
            expect(data).to.equal(6.12765890);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          required: true,
        })
          .validate(null)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.REQUIRED_BUT_MISSING,
          }).message));
      });

      describe('min', () => {
        it('should succeed', () => getNumberObjectSchema({
          min: 6,
        })
          .validate(6)
          .then((data) => {
            expect(data).to.equal(6);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          min: 6,
        })
          .validate(5)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.MIN,
          }).message));
      });

      describe('max', () => {
        it('should succeed', () => getNumberObjectSchema({
          max: 6,
        })
          .validate(6)
          .then((data) => {
            expect(data).to.equal(6);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          max: 6,
        })
          .validate(7)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.MAX,
          }).message));
      });

      describe('greater', () => {
        it('should succeed', () => getNumberObjectSchema({
          greater: 6,
        })
          .validate(6.1)
          .then((data) => {
            expect(data).to.equal(6.1);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          greater: 6,
        })
          .validate(6)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.GREATER,
          }).message));
      });

      describe('less', () => {
        it('should succeed', () => getNumberObjectSchema({
          less: 6,
        })
          .validate(5.99)
          .then((data) => {
            expect(data).to.equal(5.99);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          less: 6,
        })
          .validate(6)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.LESS,
          }).message));
      });

      describe('integer', () => {
        it('should succeed', () => getNumberObjectSchema({
          integer: true,
        })
          .validate(6)
          .then((data) => {
            expect(data).to.equal(6);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          integer: true,
        })
          .validate(6.1)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.INTEGER,
          }).message));
      });

      describe('positive', () => {
        it('should succeed', () => getNumberObjectSchema({
          positive: true,
        })
          .validate(6)
          .then((data) => {
            expect(data).to.equal(6);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          positive: true,
        })
          .validate(0)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.POSITIVE,
          }).message));
      });

      describe('negative', () => {
        it('should succeed', () => getNumberObjectSchema({
          negative: true,
        })
          .validate(-6)
          .then((data) => {
            expect(data).to.equal(-6);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          negative: true,
        })
          .validate(0)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Number.validationErrorCodes.NEGATIVE,
          }).message));
      });
    });

    // Type - Boolean
    // -------------------------------------------------------------------------
    describe('Boolean', () => {
      const getBooleanObjectSchema = (
        opts: BooleanSchemaTypeOptions = {},
      ): ObjectSchema<string> => new ObjectSchema(new ObjectSchema.types.Boolean(opts));

      describe('required', () => {
        it('should succeed', () => getBooleanObjectSchema({
          required: true,
        })
          .validate(false)
          .then((data) => {
            expect(data).to.equal(false);
          }).should.be.fulfilled);

        it('should fail', () => getBooleanObjectSchema({
          required: true,
        })
          .validate(null)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Boolean.validationErrorCodes.REQUIRED_BUT_MISSING,
          }).message));
      });
    });

    // Type - Array
    // -------------------------------------------------------------------------
    describe('Array', () => {
      const getArrayObjectSchema = (
        opts: ArraySchemaTypeOptions | Pick<ArraySchemaTypeOptions, Exclude<keyof ArraySchemaTypeOptions, 'item'>>,
      ): ObjectSchema<string> => new ObjectSchema(new ObjectSchema.types.Array({
        item: new ObjectSchema(new ObjectSchema.types.String({ required: true })),
        ...opts,
      }));

      describe('required', () => {
        it('should succeed', () => getArrayObjectSchema({
          required: true,
        })
          .validate(['foo'])
          .then((data) => {
            expect(data).to.eql(['foo']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          required: true,
        })
          .validate(null)
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Array.validationErrorCodes.REQUIRED_BUT_MISSING,
          }).message));
      });

      describe('min', () => {
        it('should succeed', () => getArrayObjectSchema({
          min: 2,
        })
          .validate(['foo', 'bar'])
          .then((data) => {
            expect(data).to.eql(['foo', 'bar']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          min: 2,
        })
          .validate(['foo'])
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Array.validationErrorCodes.MIN,
          }).message));
      });

      describe('max', () => {
        it('should succeed', () => getArrayObjectSchema({
          max: 2,
        })
          .validate(['foo', 'bar'])
          .then((data) => {
            expect(data).to.eql(['foo', 'bar']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          max: 1,
        })
          .validate(['foo', 'bar'])
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Array.validationErrorCodes.MAX,
          }).message));
      });

      describe('length', () => {
        it('should succeed', () => getArrayObjectSchema({
          length: 2,
        })
          .validate(['foo', 'bar'])
          .then((data) => {
            expect(data).to.eql(['foo', 'bar']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          length: 2,
        })
          .validate(['foo'])
          .should.be.rejectedWith(new ObjectSchema.types.Base.ValidationError({
            code: ObjectSchema.types.Array.validationErrorCodes.LENGTH_NOT_ALLOWED,
          }).message));
      });

      describe('multiple items', () => {
        it('should succeed', () => new ObjectSchema({
          foo: new ObjectSchema.types.Array({
            required: true,
            length: 2,
            item: new ObjectSchema({
              bar: new ObjectSchema.types.String({
                required: true,
                oneOf: ['foo', 'bar'],
              }),
            }),
          }),
        })
          .validate({
            foo: [
              { bar: 'foo' },
              { bar: 'bar' },
            ],
          })
          .then((data) => {
            expect(data).to.eql({
              foo: [
                { bar: 'foo' },
                { bar: 'bar' },
              ],
            });
          }).should.be.fulfilled);

        it('should fail', () => new ObjectSchema({
          foo: new ObjectSchema.types.Array({
            required: true,
            length: 2,
            item: new ObjectSchema({
              bar: new ObjectSchema.types.String({
                required: true,
                oneOf: ['foo', 'bar'],
              }),
            }),
          }),
        })
          .validate({
            foo: [
              { bar: 'foo' },
              { bar: 'ba' },
            ],
          })
          .catch((e: ValidationError) => {
            expect(e.code).to.equal(ObjectSchema.types.String.validationErrorCodes.NOT_ALLOWED);
            expect(e.path).to.equal('foo.1.bar');
          })
          .should.be.fulfilled);
      });
    });
  });

  describe('Schema & all Types', () => {
    it('should succeed#optional-object-prop-missing', async () => {
      const schema = new ObjectSchema({
        id: new ObjectSchema.types.String({ required: true }),
        username: new ObjectSchema.types.String({ required: true }),
        email: new ObjectSchema.types.String({ required: true }),
        info: {
          person: {
            firstName: new ObjectSchema.types.String({ }),
            lastName: new ObjectSchema.types.String({ }),
          },
        },
        followers: new ObjectSchema.types.Array({
          item: new ObjectSchema(new ObjectSchema.types.String({ required: true })),
        }),
      });

      return schema.validate({
        id: '123456',
        username: 'foo',
        email: 'foo@bar.com',
        followers: ['222222'],
      })
        .should.to.be.fulfilled;
    });
  });
});
