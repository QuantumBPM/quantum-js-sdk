/**
 * Represents a DMN Value type.
 */
export enum FeelType {
    Number = 'Number',
    String = 'String',
    Boolean = 'Boolean',
    List = 'List',
    Context = 'Context',
    Null = 'Null'
}

/**
 * A wrapper for DMN values to ensure type safety and correct serialization.
 */
export class FeelValue {
    constructor(
        public readonly value: any,
        public readonly type: FeelType
    ) { }

    static ofNumber(value: number): FeelValue {
        return new FeelValue(value, FeelType.Number);
    }

    static ofString(value: string): FeelValue {
        return new FeelValue(value, FeelType.String);
    }

    static ofBoolean(value: boolean): FeelValue {
        return new FeelValue(value, FeelType.Boolean);
    }

    static ofList(value: FeelValue[]): FeelValue {
        return new FeelValue(value, FeelType.List);
    }

    static ofContext(value: { [key: string]: FeelValue }): FeelValue {
        return new FeelValue(value, FeelType.Context);
    }

    static ofNull(): FeelValue {
        return new FeelValue(null, FeelType.Null);
    }

    /**
     * Infer DmnValue from a raw JavaScript value.
     */
    static from(raw: any): FeelValue {
        if (raw === null || raw === undefined) {
            return FeelValue.ofNull();
        }

        if (raw instanceof FeelValue) {
            return raw;
        }

        if (typeof raw === 'number') {
            return FeelValue.ofNumber(raw);
        }

        if (typeof raw === 'string') {
            return FeelValue.ofString(raw);
        }

        if (typeof raw === 'boolean') {
            return FeelValue.ofBoolean(raw);
        }

        if (Array.isArray(raw)) {
            return FeelValue.ofList(raw.map(item => FeelValue.from(item)));
        }

        if (typeof raw === 'object') {
            const context: { [key: string]: FeelValue } = {};
            for (const key of Object.keys(raw)) {
                context[key] = FeelValue.from(raw[key]);
            }
            return FeelValue.ofContext(context);
        }

        return FeelValue.ofString(String(raw));
    }

    /**
     * Unwrap to raw JavaScript value.
     */
    toRaw(): any {
        if (this.type === FeelType.List) {
            return (this.value as FeelValue[]).map(v => v.toRaw());
        }
        if (this.type === FeelType.Context) {
            const raw: any = {};
            const context = this.value as { [key: string]: FeelValue };
            for (const key of Object.keys(context)) {
                raw[key] = context[key].toRaw();
            }
            return raw;
        }
        return this.value;
    }

    /**
     * Helpers for type checking
     */
    isNumber(): boolean { return this.type === FeelType.Number; }
    isString(): boolean { return this.type === FeelType.String; }
    isBoolean(): boolean { return this.type === FeelType.Boolean; }
    isList(): boolean { return this.type === FeelType.List; }
    isContext(): boolean { return this.type === FeelType.Context; }
    isNull(): boolean { return this.type === FeelType.Null; }

    asNumber(): number {
        if (!this.isNumber()) throw new Error(`Value is not a Number: ${this.type}`);
        return this.value as number;
    }

    asString(): string {
        if (!this.isString()) throw new Error(`Value is not a String: ${this.type}`);
        return this.value as string;
    }

    asBoolean(): boolean {
        if (!this.isBoolean()) throw new Error(`Value is not a Boolean: ${this.type}`);
        return this.value as boolean;
    }

    // Custom serialization for JSON.stringify
    toJSON() {
        return this.toRaw();
    }
}
