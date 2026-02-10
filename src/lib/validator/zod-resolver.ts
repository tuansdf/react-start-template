import { toNestErrors, validateFieldsNatively } from '@hookform/resolvers'
import { appendErrors } from 'react-hook-form'
import * as z from 'zod/v4/core'

import type {
  FieldError,
  FieldValues,
  Resolver,
  ResolverError,
  ResolverSuccess,
} from 'react-hook-form'

const isZod4Error = (error: any): error is z.$ZodError => {
  return error instanceof z.$ZodError
}
const isZod4Schema = (schema: any): schema is z.$ZodType => {
  return '_zod' in schema && typeof schema._zod === 'object'
}

function parseZod4Issues(
  zodErrors: Array<z.$ZodIssue>,
  validateAllFieldCriteria: boolean,
) {
  const errors: Record<string, FieldError> = {}
  for (; zodErrors.length; ) {
    const error = zodErrors[0]
    const { code, message, path } = error
    const _path = path.join('.')

    if (error.code === 'invalid_union' && error.errors.length > 0) {
      const unionError = error.errors[0][0]

      errors[_path] = {
        message: unionError.message,
        type: unionError.code,
      }
    } else {
      errors[_path] = { message, type: code }
    }

    if (error.code === 'invalid_union') {
      error.errors.forEach((unionError) =>
        unionError.forEach((e) =>
          zodErrors.push({ ...e, path: [...error.path, ...e.path] }),
        ),
      )
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types
      const messages = types && types[error.code]

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as Array<string>).concat(
              messages as Array<string>,
              error.message,
            )
          : error.message,
      ) as FieldError
    }

    zodErrors.shift()
  }

  return errors
}

export function zodResolver<TInput extends FieldValues, TContext, TOutput>(
  schema: object,
  schemaOptions?: object,
  resolverOptions: {
    mode?: 'async' | 'sync'
    raw?: boolean
  } = {},
): Resolver<TInput, TContext, TOutput | TInput> {
  if (isZod4Schema(schema)) {
    return async (values: TInput, _, options) => {
      try {
        const parseFn = resolverOptions.mode === 'sync' ? z.parse : z.parseAsync
        const data: any = await parseFn(schema, values, schemaOptions)

        options.shouldUseNativeValidation && validateFieldsNatively({}, options)

        return {
          errors: {},
          values: resolverOptions.raw ? Object.assign({}, values) : data,
        } satisfies ResolverSuccess<TOutput | TInput>
      } catch (error) {
        if (isZod4Error(error)) {
          return {
            values: {},
            errors: toNestErrors(
              parseZod4Issues(
                error.issues,
                !options.shouldUseNativeValidation &&
                  options.criteriaMode === 'all',
              ),
              options,
            ),
          } satisfies ResolverError<TInput>
        }

        throw error
      }
    }
  }

  throw new Error('Invalid input: not a Zod schema')
}
