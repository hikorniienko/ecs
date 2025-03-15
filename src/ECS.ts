import type { System } from "./System";
import type {
  Entity,
  Component,
  ComponentName,
  SystemName,
  NewComponentSet,
  RemoveComponentSet,
  QueriesQuery,
} from "./types";

export class ECS {
  protected _entities = new Set<Entity>();
  protected _removeEntities = new Set<Entity>();

  protected _components = new Map<Entity, Map<ComponentName, Component>>();
  protected _newComponents = new Set<NewComponentSet>();
  protected _removeComponents = new Set<RemoveComponentSet>();

  protected _systems = new Map<SystemName, System>();
  protected _newSystems = new Set<System>();
  protected _removeSystems = new Set<SystemName>();

  protected _queries = new Map<QueriesQuery, Set<Entity>>();
  protected _queriesNew = new Map<QueriesQuery, Set<Entity>>();
  protected _queriesRemove = new Map<QueriesQuery, Set<Entity>>();
  protected _newQueries = new Set<QueriesQuery>();

  protected _nextEntityId = 0;

  protected _removeEntity(entity: Entity) {
    if (!this._entities.has(entity)) {
      return;
    }

    this._queries.forEach((entities, query) => {
      const currentEntity = entities.has(entity);
      if (currentEntity) {
        entities.delete(entity);
        this._queriesRemove.get(query)?.add(entity);
      }
    });

    this._entities.delete(entity);
  }

  protected _addComponent(entity: Entity, component: Component) {
    if (!this._components.has(entity)) {
      this._components.set(entity, new Map());
    }

    const componentName = typeof component === "string" ? component : component.constructor.name;
    const components = this._components.get(entity);
    if (components?.has(componentName)) {
      throw new Error(`Component with name ${componentName} already exists`);
    }

    if (components) {
      components.set(componentName, component);
    }
  }

  protected _removeComponent(entity: Entity, componentName: ComponentName) {
    this._components.get(entity)?.delete(componentName);
  }

  protected _addSystem(system: System) {
    if (this._systems.has(system.constructor.name)) {
      throw new Error(`System with name ${system.constructor.name} already exists`);
    }
    this._systems.set(system.constructor.name, system);
  }

  protected _removeSystem(systemName: SystemName) {
    this._systems.delete(systemName);
  }

  protected _addQuery(query: QueriesQuery) {
    if (this._queries.has(query)) {
      return;
    }

    this._queries.set(query, new Set());
    this._queriesNew.set(query, new Set());
    this._queriesRemove.set(query, new Set());
  }

  protected _fillQuery() {
    if (this._newQueries.size === 0) {
      return;
    }

    this._entities.forEach((entity) => {
      const components = this._components.get(entity);
      if (!components) return;

      this._newQueries.forEach((query) => {
        const currentQuery = this._queries.get(query);
        const currentQueryNew = this._queriesNew.get(query);
        const isMatchPart1 = query[0].every((name) => components.has(name));
        const isMatchPart2 = query[1].every((name) => !components.has(name));

        if (currentQuery && currentQueryNew && isMatchPart1 && isMatchPart2) {
          currentQuery.add(entity);
          currentQueryNew.add(entity);
        }
      });
    });
  }

  protected _updateQuery() {
    if (this._newComponents.size === 0 && this._removeComponents.size === 0) {
      return;
    }

    const _entities = new Set<Entity>();

    this._newComponents.forEach(({ entity }) => {
      _entities.add(entity);
    });

    this._removeComponents.forEach(({ entity }) => {
      _entities.add(entity);
    });

    this._queries.forEach((entities, query) => {
      _entities.forEach((entity) => {
        const components = this._components.get(entity);
        if (!components) return;

        const currentEntity = entities.has(entity);
        const isMatchPart1 = query[0].every((name) => components.has(name));
        const isMatchPart2 = query[1].every((name) => !components.has(name));

        if (!currentEntity && isMatchPart1 && isMatchPart2) {
          entities.add(entity);
          this._queriesNew.get(query)?.add(entity);
        }

        if (currentEntity && !isMatchPart1 && !isMatchPart2) {
          entities.delete(entity);
          this._queriesRemove.get(query)?.add(entity);
        }
      });
    });
  }

  protected _clearTemporaryData() {
    this._removeEntities.clear();
    this._removeComponents.clear();
    this._removeSystems.clear();
    this._newComponents.clear();
    this._newSystems.clear();
    this._newQueries.clear();
  }

  public createEntity(): Entity {
    const id = String(this._nextEntityId++);
    this._entities.add(id);
    return id;
  }

  public removeEntity(entity: Entity) {
    this._removeEntities.add(entity);
  }

  public addComponent(entity: Entity, component: Component) {
    this._newComponents.add({ entity, component });
  }

  public removeComponent(entity: Entity, componentName: ComponentName) {
    this._removeComponents.add({ entity, componentName });
  }

  public getComponent<T extends Component>(entity: Entity, componentName: ComponentName): T | undefined {
    return this._components.get(entity)?.get(componentName) as T | undefined;
  }

  public addSystem(system: System) {
    this._newSystems.add(system);
  }

  public removeSystem(systemName: SystemName) {
    this._removeSystem(systemName);
  }

  public addQuery(query: QueriesQuery) {
    this._newQueries.add(query);
  }

  public getQuery(query: QueriesQuery) {
    return this._queries.get(query);
  }

  public getQueryNew(query: QueriesQuery) {
    return this._queriesNew.get(query);
  }

  public getQueryRemove(query: QueriesQuery) {
    return this._queriesRemove.get(query);
  }

  public execute(deltaTime: number, elapsedMS: number) {
    this._queriesNew.forEach((entities) => {
      entities.clear();
    });

    this._queriesRemove.forEach((entities) => {
      entities.forEach((entity) => {
        this._components.delete(entity);
      });
      entities.clear();
    });

    this._removeEntities.forEach((entity) => {
      this._removeEntity(entity);
    });

    this._removeComponents.forEach(({ entity, componentName }) => {
      this._removeComponent(entity, componentName);
    });

    this._removeSystems.forEach((systemName) => {
      this._removeSystem(systemName);
    });

    this._newQueries.forEach((query) => {
      this._addQuery(query);
    });

    this._newComponents.forEach(({ entity, component }) => {
      this._addComponent(entity, component);
    });

    this._newSystems.forEach((system) => {
      this._addSystem(system);
    });

    this._fillQuery();
    this._updateQuery();
    this._clearTemporaryData();

    this._systems.forEach((system) => {
      if (!system.isActive) {
        return;
      }
      system.execute(deltaTime, elapsedMS);
    });
  }
}
