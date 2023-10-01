import { expect, test } from "bun:test";
import { Component, ComponentContainer, Ecs } from "./ecs";

test("ecs component container", () => {
  class TestComponent extends Component {
    constructor(public value: number) {
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
  const entity = ecs.createEntity(test2);
  expect(ecs.getComponents(entity).has(TestComponent)).toBe(true);
  expect(ecs.getComponents(entity).get(TestComponent).value).toBe(200);
});
