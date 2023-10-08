import { expect, test } from "bun:test";
import { Component, Ecs } from "./ecs";
import { ComponentContainer } from "./ecs/componentContainer";

test("ecs component container", () => {
  class TestComponent extends Component {
    constructor(public value: number) {
      super();
    }
  }

  class TestComponent2 extends Component {
    constructor(public value: string) {
      super();
    }
  }

  const container = new ComponentContainer();
  const test1 = new TestComponent(100);
  container.add(test1);
  expect(container.has(TestComponent)).toBe(true);
  expect(container.get(TestComponent).value).toBe(100);

  const ecs = new Ecs();
  const test2 = new TestComponent(200);
  const test3 = new TestComponent2("foo");
  const entity = ecs.createEntity(test2, test3);
  expect(ecs.getComponents(entity).has(TestComponent)).toBe(true);
  expect(ecs.getComponents(entity).get(TestComponent).value).toBe(200);
  expect(ecs.getComponents(entity).hasAll(TestComponent, TestComponent2)).toBe(
    true,
  );
});

test("ecs entity container", () => {
  class TestComponent1 extends Component {
    private data = true;
  }
  class TestComponent2 extends Component {}

  const ecs = new Ecs();
  const e1 = ecs.createEntity(new TestComponent1());
  const e2 = ecs.createEntity(new TestComponent1(), new TestComponent2());
  const entities = ecs.getEntities();

  const q1 = entities.allOf(TestComponent1);
  const q2 = entities.allOf(TestComponent2);
  const q3 = entities.noneOf(TestComponent2);
  const q4 = entities.allOf(TestComponent1).noneOf(TestComponent2);
  const q5 = entities.allOf(TestComponent1).noneOf(TestComponent1);

  expect(q1.ids()).toEqual([e1, e2]);
  expect(q2.ids()).toEqual([e2]);
  expect(q3.ids()).toEqual([e1]);
  expect(q4.ids()).toEqual([e1]);
  expect(q5.ids()).toEqual([]);

  for (const [_entity, components] of q1.results()) {
    const tc = components.get(TestComponent1);
    expect(tc).toEqual(new TestComponent1());
  }
});
