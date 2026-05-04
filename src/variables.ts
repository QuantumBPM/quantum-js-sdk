/**
 * Vars holds a set of named variables. The same type is used for DMN
 * evaluation contexts, BPMN process variables, and external job payloads.
 *
 * Vars is a thin wrapper around `Record<string, unknown>` with helpers for
 * typed access, chainable construction, and conversion to/from the wire
 * shapes the generated client uses.
 */
export class Vars {
    private readonly data: Record<string, unknown>;

    constructor(data: Record<string, unknown> = {}) {
        this.data = { ...data };
    }

    /** Build a Vars from a plain object. Values are shallow-copied. */
    static from(record: Record<string, unknown> | null | undefined): Vars {
        if (!record) return new Vars();
        return new Vars(record);
    }

    /** Convenience constructor for chained .set(...) calls. */
    static of(): Vars {
        return new Vars();
    }

    /** Assign name=value and return this for chaining. */
    set(name: string, value: unknown): this {
        this.data[name] = value;
        return this;
    }

    /** Return the raw value at name, or undefined when not set. */
    lookup(name: string): unknown {
        return this.data[name];
    }

    /**
     * Return the value at name typed as T. Throws when the variable is not
     * set. Use this for opt-in typed access in worker handlers and DMN
     * results — TypeScript treats the cast as a hint, not a runtime check.
     */
    get<T>(name: string): T {
        if (!(name in this.data)) {
            throw new Error(`variables: '${name}' not set`);
        }
        return this.data[name] as T;
    }

    /** Cast the entire Vars to a typed shape. No runtime validation. */
    as<T>(): T {
        return this.data as unknown as T;
    }

    /** Return a shallow copy of the underlying record. */
    toRecord(): Record<string, unknown> {
        return { ...this.data };
    }

    /**
     * Convert to the FeelContext shape the DMN evaluate endpoints accept.
     * Uses a JSON round-trip so nested classes (e.g. Date) collapse to JSON
     * primitives the FEEL engine understands.
     */
    toFeelContext(): Record<string, unknown> {
        return JSON.parse(JSON.stringify(this.data));
    }

    /**
     * Convert to the optional `variables` map BPMN endpoints accept. Returns
     * undefined for an empty Vars so the optional field is omitted from the
     * request body.
     */
    toWireMap(): Record<string, unknown> | undefined {
        if (Object.keys(this.data).length === 0) return undefined;
        return JSON.parse(JSON.stringify(this.data));
    }

    /** Lift a wire-shape variables map into a Vars value. */
    static fromWireMap(map: Record<string, unknown> | null | undefined): Vars {
        if (!map) return new Vars();
        return new Vars(map);
    }

    /** Number of variables. */
    get size(): number {
        return Object.keys(this.data).length;
    }
}
