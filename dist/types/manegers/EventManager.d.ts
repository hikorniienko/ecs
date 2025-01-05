export declare class EventManager {
    protected _events: Record<string, Set<{
        listener: Function;
        once: boolean;
    }>>;
    on<T extends any>(event: string, listener: (data: T) => void, once?: boolean): void;
    off(event: string, listener: Function, once?: boolean): void;
    emit(name: string, data?: any): void;
    take<T extends any>(event: string): Promise<T>;
    list: Record<string, string>;
}
