import {
    trace,
    context,
    propagation,
    SpanKind,
    type Span,
    type Context,
    type Attributes,
} from '@opentelemetry/api';

import { ExternalJob } from './generated/models/ExternalJob';

/**
 * Continues the originating process instance's trace (when the polled job
 * carries trace context) and opens a worker span for the handler. Returns the
 * span plus a Context with the span set, so running the handler under
 * `context.with(ctx, ...)` makes any OpenTelemetry-aware work nest beneath it.
 *
 * No-op unless the worker process has registered an OpenTelemetry SDK: the
 * `@opentelemetry/api` globals default to no-ops, so a worker that doesn't opt
 * into tracing pays nothing and a missing traceContext degrades to a fresh
 * (unrecorded) span.
 */
export function startJobSpan(raw: ExternalJob, taskType: string): { ctx: Context; span: Span } {
    let parent = context.active();
    if (raw.traceContext) {
        parent = propagation.extract(parent, raw.traceContext);
    }
    const attributes: Attributes = {
        'bpmn.task_type': taskType,
        'bpmn.node_id': raw.nodeID,
        'bpmn.process_instance_id': raw.workflowID,
        'bpmn.execution_key': raw.executionKey,
    };
    if (raw.businessId) {
        attributes['bpmn.business_id'] = raw.businessId;
    }
    // Resolve the tracer lazily (not at module load): the worker module is
    // imported before the application registers an OpenTelemetry SDK, and with
    // a duplicate @opentelemetry/api copy a module-load-time tracer binds to a
    // proxy that never receives the delegate. Resolving here reads the
    // globally-registered provider at dispatch time.
    const span = trace.getTracer('quantumbpm/js-sdk').startSpan(
        'bpmn.external-task.execute',
        { kind: SpanKind.CONSUMER, attributes },
        parent,
    );
    return { ctx: trace.setSpan(parent, span), span };
}
