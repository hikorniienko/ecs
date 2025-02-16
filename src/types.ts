export type Entity = string;
export type ComponentName = string;
export type Component = { constructor: Function } | string;
export type SystemName = string;

export type NewComponentSet = {
  entity: Entity;
  component: Component;
};

export type RemoveComponentSet = {
  entity: Entity;
  componentName: ComponentName;
};

export type QueriesQuery = Array<Array<ComponentName>>;
