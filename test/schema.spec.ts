import 'mocha';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import OSV, {
  OSVTypeRef,
} from '../src/index';

chai.use(chaiAsPromised);
const { expect } = chai;

chai.should();

describe('ObjectSchema', () => {
  describe('parse', () => {
    it('should succeed#basic-object', async () => {
      const schema = OSV.schema({
        foo: {
          bar: {
            foo: OSV.string({}),
          },
        },
      });

      return schema.validate({
        foo: {
          bar: {
            foo: 'bar',
          },
        },
      }).exec()
        .should.to.be.fulfilled;
    });

    it('should succeed#just-schema-type', async () => {
      const schema = OSV.schema(OSV.string({}));

      return schema.validate('foo').exec().should.to.be.fulfilled;
    });
  });

  describe('Types', () => {
    // Type - String
    // -------------------------------------------------------------------------

    describe('String', () => {
      const getStringObjectSchema = (
        opts: OSVTypeRef.SchemaTypes.String.Options = {},
      ): OSVTypeRef.Classes.ObjectSchema<string> => OSV.schema<string>(OSV.string(opts));

      describe('required', () => {
        it('should succeed', () => getStringObjectSchema({
          required: true,
        })
          .validate('').exec()
          .then((data) => {
            expect(data).to.equal('');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          required: true,
        })
          .validate(undefined).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.REQUIRED_BUT_MISSING,
            path: [],
          }).message));
      });

      describe('allowNull', () => {
        it('should succeed', () => getStringObjectSchema({
          allowNull: true,
        })
          .validate(null).exec()
          .then((data) => {
            expect(data).to.eql(null);
          })
          .should.be.fulfilled);

        it('should succeed#return-with-null-object', () => OSV.schema<{foo: string}>({
          foo: OSV.string({
            allowNull: true,
          }),
        })
          .validate({ foo: null }).exec()
          .then((data) => {
            expect(data).to.eql({ foo: null });
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          allowNull: false,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.NULL_NOT_ALLOWED,
            path: [],
          }).message));
      });

      describe('oneOf', () => {
        it('should succeed', () => getStringObjectSchema({
          oneOf: ['foo', 'bar'],
        })
          .validate('foo').exec()
          .then((data) => {
            expect(data).to.equal('foo');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          oneOf: ['foo'],
        })
          .validate('bar').exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.NOT_ALLOWED,
            path: [],
          }).message));
      });

      describe('empty', () => {
        it('should succeed', () => getStringObjectSchema({
          empty: true,
        })
          .validate('').exec()
          .then((data) => {
            expect(data).to.equal('');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          empty: false,
        })
          .validate('').exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.NOT_EMPTY,
            path: [],
          }).message));
      });

      describe('regex', () => {
        it('should succeed', () => getStringObjectSchema({
          regex: /^foo/,
        })
          .validate('foobar').exec()
          .then((data) => {
            expect(data).to.equal('foobar');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          regex: /^foo/,
        })
          .validate('barfoo').exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.REGEX_FAILED,
            path: [],
          }).message));
      });

      describe('length', () => {
        it('should succeed', () => getStringObjectSchema({
          length: 3,
        })
          .validate('foo').exec()
          .then((data) => {
            expect(data).to.equal('foo');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          length: 3,
        })
          .validate('foobar').exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.LENGTH_NOT_ALLOWED,
            path: [],
          }).message));
      });

      describe('minLength', () => {
        it('should succeed', () => getStringObjectSchema({
          minLength: 3,
        })
          .validate('foo').exec()
          .then((data) => {
            expect(data).to.equal('foo');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          minLength: 4,
        })
          .validate('foo').exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.TOO_SHORT,
            path: [],
          }).message));
      });

      describe('maxLength', () => {
        it('should succeed', () => getStringObjectSchema({
          maxLength: 3,
        })
          .validate('foo').exec()
          .then((data) => {
            expect(data).to.equal('foo');
          })
          .should.be.fulfilled);

        it('should fail', () => getStringObjectSchema({
          maxLength: 2,
        })
          .validate('foo').exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.string.TOO_LONG,
            path: [],
          }).message));
      });
    });

    // Type - Number
    // -------------------------------------------------------------------------

    describe('Number', () => {
      const getNumberObjectSchema = (
        opts: OSVTypeRef.SchemaTypes.Number.Options = {},
      ): OSVTypeRef.Classes.ObjectSchema<number> => OSV.schema<number>(OSV.number(opts));

      describe('required', () => {
        it('should succeed', () => getNumberObjectSchema({
          required: true,
        })
          .validate(6.12765890).exec()
          .then((data) => {
            expect(data).to.equal(6.12765890);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          required: true,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.REQUIRED_BUT_MISSING,
            path: [],
          }).message));
      });

      describe('allowNull', () => {
        it('should succeed', () => getNumberObjectSchema({
          allowNull: true,
        })
          .validate(null).exec()
          .then((data) => {
            expect(data).to.eql(null);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          allowNull: false,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.NULL_NOT_ALLOWED,
            path: [],
          }).message));
      });

      describe('min', () => {
        it('should succeed', () => getNumberObjectSchema({
          min: 6,
        })
          .validate(6).exec()
          .then((data) => {
            expect(data).to.equal(6);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          min: 6,
        })
          .validate(5).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.MIN,
            path: [],
          }).message));
      });

      describe('max', () => {
        it('should succeed', () => getNumberObjectSchema({
          max: 6,
        })
          .validate(6).exec()
          .then((data) => {
            expect(data).to.equal(6);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          max: 6,
        })
          .validate(7).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.MAX,
            path: [],
          }).message));
      });

      describe('greater', () => {
        it('should succeed', () => getNumberObjectSchema({
          greater: 6,
        })
          .validate(6.1).exec()
          .then((data) => {
            expect(data).to.equal(6.1);
          }).should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          greater: 6,
        })
          .validate(6).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.GREATER,
            path: [],
          }).message));
      });

      describe('less', () => {
        it('should succeed', () => getNumberObjectSchema({
          less: 6,
        })
          .validate(5.99).exec()
          .then((data) => {
            expect(data).to.equal(5.99);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          less: 6,
        })
          .validate(6).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.LESS,
            path: [],
          }).message));
      });

      describe('integer', () => {
        it('should succeed', () => getNumberObjectSchema({
          integer: true,
        })
          .validate(6).exec()
          .then((data) => {
            expect(data).to.equal(6);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          integer: true,
        })
          .validate(6.1).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.INTEGER,
            path: [],
          }).message));
      });

      describe('positive', () => {
        it('should succeed', () => getNumberObjectSchema({
          positive: true,
        })
          .validate(6).exec()
          .then((data) => {
            expect(data).to.equal(6);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          positive: true,
        })
          .validate(0).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.POSITIVE,
            path: [],
          }).message));
      });

      describe('negative', () => {
        it('should succeed', () => getNumberObjectSchema({
          negative: true,
        })
          .validate(-6).exec()
          .then((data) => {
            expect(data).to.equal(-6);
          })
          .should.be.fulfilled);

        it('should fail', () => getNumberObjectSchema({
          negative: true,
        })
          .validate(0).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.number.NEGATIVE,
            path: [],
          }).message));
      });
    });

    // Type - Boolean
    // -------------------------------------------------------------------------

    describe('Boolean', () => {
      const getBooleanObjectSchema = (
        opts: OSVTypeRef.SchemaTypes.Boolean.Options = {},
      ): OSVTypeRef.Classes.ObjectSchema<boolean> => OSV.schema<boolean>(OSV.boolean(opts));

      describe('required', () => {
        it('should succeed', () => getBooleanObjectSchema({
          required: true,
        })
          .validate(false).exec()
          .then((data) => {
            expect(data).to.equal(false);
          })
          .should.be.fulfilled);

        it('should fail', () => getBooleanObjectSchema({
          required: true,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.boolean.REQUIRED_BUT_MISSING,
            path: [],
          }).message));
      });

      describe('allowNull', () => {
        it('should succeed', () => getBooleanObjectSchema({
          allowNull: true,
        })
          .validate(null).exec()
          .then((data) => {
            expect(data).to.eql(null);
          })
          .should.be.fulfilled);

        it('should fail', () => getBooleanObjectSchema({
          allowNull: false,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.boolean.NULL_NOT_ALLOWED,
            path: [],
          }).message));
      });
    });

    // Type - Array
    // -------------------------------------------------------------------------

    describe('Array', () => {
      const getArrayObjectSchema = (
        opts: OSVTypeRef.SchemaTypes.Array
          .Options | Pick<OSVTypeRef.SchemaTypes.Array
          .Options, Exclude<keyof OSVTypeRef.SchemaTypes.Array.Options, 'item'>>,
      ): OSVTypeRef.Classes.ObjectSchema<string[]> => OSV.schema<string[]>(OSV.array({
        item: OSV.schema<string>(OSV.string({ required: true })),
        ...opts,
      }));

      describe('required', () => {
        it('should succeed', () => getArrayObjectSchema({
          required: true,
        })
          .validate(['foo']).exec()
          .then((data) => {
            expect(data).to.eql(['foo']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          required: true,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.array.REQUIRED_BUT_MISSING,
            path: [],
          }).message));
      });

      describe('allowNull', () => {
        it('should succeed', () => getArrayObjectSchema({
          allowNull: true,
        })
          .validate(null).exec()
          .then((data) => {
            expect(data).to.eql(null);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          allowNull: false,
        })
          .validate(null).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.array.NULL_NOT_ALLOWED,
            path: [],
          }).message));
      });

      describe('min', () => {
        it('should succeed', () => getArrayObjectSchema({
          min: 2,
        })
          .validate(['foo', 'bar']).exec()
          .then((data) => {
            expect(data).to.eql(['foo', 'bar']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          min: 2,
        })
          .validate(['foo']).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.array.MIN,
            path: [],
          }).message));
      });

      describe('max', () => {
        it('should succeed', () => getArrayObjectSchema({
          max: 2,
        })
          .validate(['foo', 'bar']).exec()
          .then((data) => {
            expect(data).to.eql(['foo', 'bar']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          max: 1,
        })
          .validate(['foo', 'bar']).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.array.MAX,
            path: [],
          }).message));
      });

      describe('length', () => {
        it('should succeed', () => getArrayObjectSchema({
          length: 2,
        })
          .validate(['foo', 'bar']).exec()
          .then((data) => {
            expect(data).to.eql(['foo', 'bar']);
          }).should.be.fulfilled);

        it('should fail', () => getArrayObjectSchema({
          length: 2,
        })
          .validate(['foo']).exec()
          .should.be.rejectedWith(OSV.helpers.createValidationError({
            code: OSV.validationErrorCodes.array.LENGTH_NOT_ALLOWED,
            path: [],
          }).message));
      });

      describe('multiple items', () => {
        it('should succeed', () => OSV.schema({
          foo: OSV.array({
            required: true,
            length: 2,
            item: OSV.schema({
              bar: OSV.string({
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
          }).exec()
          .then((data) => {
            expect(data).to.eql({
              foo: [
                { bar: 'foo' },
                { bar: 'bar' },
              ],
            });
          }).should.be.fulfilled);

        it('should fail', () => OSV.schema({
          foo: OSV.array({
            required: true,
            length: 2,
            item: OSV.schema({
              bar: OSV.string({
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
          }).exec()
          .catch((e: OSVTypeRef.Classes.ValidationError) => {
            expect(e.code).to.equal(OSV.validationErrorCodes.string.NOT_ALLOWED);
            expect(e.path).to.equal('foo.1.bar');
          })
          .should.be.fulfilled);
      });
    });

    // Type - Optional
    // -------------------------------------------------------------------------

    describe('Optional', () => {
      describe('allow optional', () => {
        const schema = OSV.schema({
          optional: OSV.optional({
            item: OSV.schema({
              test: OSV.string({ required: true, empty: false }),
            }),
          }),
        });

        it('should succeed', () => schema.validate({})
          .exec()
          .then((value) => {
            expect(value).to.eql({});
          }).should.be.fulfilled);

        it('should fail', () => schema.validate({
          optional: null,
        })
          .exec()
          .catch((e: OSVTypeRef.Classes.ValidationError) => {
            expect(e.code).to.equal(OSV.validationErrorCodes.optional.NULL_NOT_ALLOWED);
            expect(e.path).to.equal('optional');
          }).should.be.fulfilled);
      });

      describe('allow null', () => {
        const schema = OSV.schema({
          optional: OSV.optional({
            item: OSV.schema({
              test: OSV.string({ required: true, empty: false }),
            }),
            allowNull: true,
          }),
        });

        it('should succeed', () => schema.validate({
          optional: null,
        })
          .exec()
          .then((value) => {
            expect(value).to.eql({
              optional: null,
            });
          }).should.be.fulfilled);
      });
    });

    // Type - Union
    // -------------------------------------------------------------------------

    describe('Union', () => {
      describe('union', () => {
        const schema = OSV.schema({
          union: OSV.union({
            required: true,
            schemas: [
              OSV.schema(OSV.string({ required: true, empty: false })),
              OSV.schema({
                test: {
                  test1: OSV.schema(OSV.string({ required: true, empty: false })),
                  test2: OSV.schema(OSV.string({ required: true, empty: false })),
                },
              }),
            ],
          }),
        });

        it('should succeed#required#schema-1', () => schema.validate({
          union: 'test',
        })
          .exec()
          .then((value) => {
            expect(value).to.eql({
              union: 'test',
            });
          }).should.be.fulfilled);

        it('should succeed#required#schema-2', () => schema.validate({
          union: {
            test: {
              test1: 'test',
              test2: 'test',
            },
          },
        })
          .exec()
          .then((value) => {
            expect(value).to.eql({
              union: {
                test: {
                  test1: 'test',
                  test2: 'test',
                },
              },
            });
          }).should.be.fulfilled);

        it('should fail#undefined', () => schema.validate({
          union: undefined,
        })
          .exec()
          .catch((e: OSVTypeRef.Classes.ValidationError) => {
            expect(e.code).to.equal(OSV.validationErrorCodes.union.REQUIRED_BUT_MISSING);
            expect(e.path).to.equal('union');
          }).should.be.fulfilled);

        it('should fail#all-schemas-invalid', () => schema.validate({
          union: {
            test: {
              test1: true,
              test2: 'test',
            },
          },
        })
          .exec()
          .catch((e: OSVTypeRef.Classes.ValidationError) => {
            expect(e.code).to.equal(OSV.validationErrorCodes.union.ALL_SCHEMAS_INVALID);
            expect(e.path).to.equal('union');
          }).should.be.fulfilled);
      });

      describe('with resolve', () => {
        const schema = OSV.schema({
          union: OSV.union({
            schemas: [
              OSV.schema(OSV.string({ required: true, empty: false })),
              OSV.schema({
                test: {
                  test1: OSV.schema(OSV.string({ required: true, empty: false })),
                  test2: OSV.schema(OSV.string({ required: true, empty: false })),
                },
              }),
            ],
            resolve: (data): number => {
              if (typeof data === 'object' && typeof data.test === 'object') {
                return 1;
              }

              if (typeof data !== 'object') {
                return 0;
              }

              return 2;
            },
          }),
        });

        it('should succeed#schema-1', () => schema.validate({
          union: 'test',
        })
          .exec()
          .then((value) => {
            expect(value).to.eql({
              union: 'test',
            });
          }).should.be.fulfilled);

        it('should succeed#schema-2', () => schema.validate({
          union: {
            test: {
              test1: 'test',
              test2: 'test',
            },
          },
        })
          .exec()
          .then((value) => {
            expect(value).to.eql({
              union: {
                test: {
                  test1: 'test',
                  test2: 'test',
                },
              },
            });
          }).should.be.fulfilled);

        it('should fail#schema-missing', () => schema.validate({
          union: {
            test1: {
              test1: 'test',
              test2: 'test',
            },
          },
        })
          .exec()
          .catch((e: OSVTypeRef.Classes.ValidationError) => {
            expect(e.code).to.equal(OSV.validationErrorCodes.union.SCHEMA_MISSING);
            expect(e.path).to.equal('union');
          }).should.be.fulfilled);
      });
    });

    // Type - ObjectSchema
    // -------------------------------------------------------------------------

    describe('ObjectSchema', () => {
      const getObjectSchemaObjectSchema = (
        opts: OSVTypeRef.SchemaTypes.String.Options = {},
      ): OSVTypeRef.Classes.ObjectSchema<string> => OSV.schema<string>(
        OSV.schema<string>(OSV.string(opts)),
      );

      it('should succeed', () => getObjectSchemaObjectSchema({
        required: true,
        empty: false,
      })
        .validate('foo').exec()
        .then((data) => {
          expect(data).to.equal('foo');
        }).should.be.fulfilled);
    });
  });

  describe('Schema & all Types', () => {
    it('should succeed#optional-object-prop-missing', async () => {
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
            firstName: OSV.string({ }),
            lastName: OSV.string({ }),
          },
        },
        followers: OSV.array({
          item: OSV.schema(OSV.string({ required: true })),
        }),
      });

      return schema.validate({
        id: '123456',
        username: 'foo',
        email: 'foo@bar.com',
        followers: ['222222'],
      }).exec()
        .should.to.be.fulfilled;
    });

    it('should succeed#nested-object-schema', async () => {
      interface PersonInfo {
        person: {
          firstName?: string;
          lastName?: string;
        };
      }

      interface Person {
        id: string;
        username: string;
        email: string;
        info: PersonInfo;
        followers: string[];
      }

      const personInfoSchema = OSV.schema<PersonInfo>({
        person: {
          firstName: OSV.string({ }),
          lastName: OSV.string({ }),
        },
      });

      const personSchema = OSV.schema<Person>({
        id: OSV.string({ required: true }),
        username: OSV.string({ required: true }),
        email: OSV.string({ required: true }),
        info: personInfoSchema as any,
        followers: OSV.array({
          item: OSV.schema(OSV.string({ required: true })),
        }),
      });

      return personSchema.validate({
        id: '123456',
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {
            firstName: 'Paul',
            lastName: 'Smith',
          },
        },
        followers: ['222222'],
      }).exec()
        .should.to.be.fulfilled;
    });
  });

  describe('omit checking on specific paths', () => {
    interface TestSchemaInfo {
      person: {
        firstName?: string;
        lastName?: string;
      };
    }

    interface TestSchema {
      id: string;
      username: string;
      email: string;
      info: TestSchemaInfo;
      followers: {
        id: string;
      }[];
    }

    const testSchema = OSV.schema<TestSchema>({
      id: OSV.string({ required: true }),
      username: OSV.string({ required: true }),
      email: OSV.string({ required: true }),
      info: OSV.schema<TestSchemaInfo>({
        person: {
          firstName: OSV.string({ required: true }),
          lastName: OSV.string({ required: true }),
        },
      }) as unknown as OSVTypeRef.Schema.Definition<TestSchema>,
      followers: OSV.array({
        item: OSV.schema({
          id: OSV.string({ required: true }),
        }),
      }),
    });

    describe('single lvl', () => {
      it('should succeed#whitelist', () => testSchema.validate({
        id: undefined,
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {
            firstName: 'James',
            lastName: 'Smith',
          },
        },
        followers: [{
          id: '222222',
        }],
      }, {
        check: {
          whitelist: ['username', 'email', 'info', 'followers'],
        },
      }).exec().should.be.fulfilled);

      it('should succeed#blacklist', () => testSchema.validate({
        id: undefined,
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {
            firstName: 'James',
            lastName: 'Smith',
          },
        },
        followers: [{
          id: '222222',
        }],
      }, {
        check: {
          blacklist: ['id'],
        },
      }).exec().should.be.fulfilled);
    });

    describe('multi lvl & nested schemes', () => {
      it('should succeed#whitelist', () => testSchema.validate({
        id: undefined,
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {
            firstName: 'James',
            lastName: undefined,
          },
        },
        followers: [{
          id: '222222',
        }],
      }, {
        check: {
          whitelist: ['username', 'email', 'followers', 'info.person.firstName'],
        },
      }).exec().should.be.fulfilled);

      it('should fail#whitelist', () => testSchema.validate({
        id: undefined,
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {
            firstName: 'James',
            lastName: 'Smith',
          },
        },
        followers: [{
          id: undefined,
        }],
      }, {
        check: {
          whitelist: ['username', 'email', 'info', 'followers'],
        },
      }).exec()
        .should.be.rejectedWith(OSV.helpers.createValidationError({
          code: OSV.validationErrorCodes.string.REQUIRED_BUT_MISSING,
          path: ['followers', '0', 'id'],
        }).message));

      it('should succeed#blacklist-and-array', () => testSchema.validate({
        id: '123456',
        username: 'foo',
        email: 'foo@bar.com',
        info: {
          person: {
            firstName: 'James',
            lastName: 'Smith',
          },
        },
        followers: [{
          id: undefined,
        }],
      }, {
        check: {
          blacklist: ['followers.id'],
        },
      }).exec().should.be.fulfilled);
    });
  });
});
