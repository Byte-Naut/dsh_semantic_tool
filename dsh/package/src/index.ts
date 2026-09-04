/** dsh function plugin for normalized Host state and typed semantic assurance. */

import type { Context } from '@deepseek-ai/cordis'
import type { JsonValue } from '@deepseek-ai/dsh-util-values'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { assessObligations } from './assurance.js'
import { SemanticObserver } from './collector.js'
import type { AssuranceObligation } from './contract.js'

/** Cordis function-plugin name. */
export const name = 'software-semantic'
/** Required dsh services; the dynamic runner remains optional. */
export const inject = ['tools', 'systemPrompt']

const SEMANTIC_POLICY = [
  'Use software_semantic_slice before reconstructing covered runtime state from native domains.',
  'For COMPLETE domains, treat the slice as the primary observation; use native inspection only for an explicit coverage gap.',
  'Preserve target versus committed state, last-successful package versus active run, and KNOWN_ABSENT versus UNKNOWN.',
  'Use software_semantic_assure to check applicable obligations before a state-changing proposal.',
].join(' ')

/**
 * Register the semantic slice, assurance tool, and short interface-first policy.
 * @param ctx - Host Cordis context that owns all registrations.
 * @returns nothing; Cordis owns every registration as an effect.
 */
export function apply(ctx: Context): void {
  const observer = new SemanticObserver(ctx)
  ctx.systemPrompt.section({
    name: 'tool:software-semantic',
    order: ctx.systemPrompt.getSectionOrder('TOOL_CORDIS') + 10,
    text: SEMANTIC_POLICY,
  })

  ctx.tools.register(defineTool({
    name: 'software_semantic_slice',
    description:
      'Read a normalized, source-free Host snapshot of Cordis/dsh identities, dependencies, target and committed '
      + 'bindings, services, tracked effects, current-Agent package/run state, coverage, and provenance. An optional '
      + 'focus selects a connected semantic slice. The result does not identify a root cause or choose a repair.',
    parameters: {
      focus: {
        type: 'string',
        description: 'Optional exact or partial component, service, plugin, or package identity used to select a connected slice.',
      },
    },
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    isConcurrencySafe: () => true,
    execute(args, exec): Promise<JsonValue> {
      return Promise.resolve(observer.capture(exec.agent, args.focus) as unknown as JsonValue)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'software_semantic_assure',
    description:
      'Check typed semantic obligations on a proposed conclusion or action. This pure checker adds no runtime facts '
      + 'and does not choose a design. Submit only obligations that apply to the current proposal.',
    parameters: {
      obligations: {
        type: 'array',
        required: true,
        description: 'Typed obligation records to check.',
        items: {
          oneOf: [
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string', required: true, const: 'PRESERVE_UNKNOWN' },
                label: { type: 'string', required: true },
                inputs: {
                  type: 'array',
                  required: true,
                  items: { type: 'string', enum: ['KNOWN_VALUE', 'KNOWN_ABSENT', 'UNKNOWN'] },
                },
                conclusion: { type: 'string', required: true, enum: ['TRUE', 'FALSE', 'UNKNOWN'] },
              },
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string', required: true, const: 'REQUIRE_TRUE_GUARD' },
                label: { type: 'string', required: true },
                guard: { type: 'string', required: true, enum: ['TRUE', 'FALSE', 'UNKNOWN'] },
                decision: { type: 'string', required: true, enum: ['EXECUTE', 'DEFER'] },
              },
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string', required: true, const: 'DISTINGUISH_ABSENCE' },
                label: { type: 'string', required: true },
                observed: { type: 'string', required: true, enum: ['KNOWN_VALUE', 'KNOWN_ABSENT', 'UNKNOWN'] },
                asserted: { type: 'string', required: true, enum: ['KNOWN_VALUE', 'KNOWN_ABSENT', 'UNKNOWN'] },
              },
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string', required: true, const: 'PRESERVE_AUTHORITY' },
                label: { type: 'string', required: true },
                sourceAuthority: {
                  type: 'string',
                  required: true,
                  enum: ['AUTHORITATIVE', 'DERIVED', 'INFERRED', 'ADVISORY'],
                },
                assertedAuthority: {
                  type: 'string',
                  required: true,
                  enum: ['AUTHORITATIVE', 'DERIVED', 'INFERRED', 'ADVISORY'],
                },
              },
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string', required: true, const: 'PROTECT_FRAME' },
                label: { type: 'string', required: true },
                changed: { type: 'boolean', required: true },
                approved: { type: 'boolean', required: true },
              },
            },
          ],
        },
      },
    },
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    isConcurrencySafe: () => true,
    execute(args): Promise<JsonValue> {
      const obligations = args.obligations as unknown as AssuranceObligation[]
      return Promise.resolve(assessObligations(obligations) as unknown as JsonValue)
    },
  }))
}

export { assessObligations } from './assurance.js'
export { SemanticObserver } from './collector.js'
export * from './contract.js'
