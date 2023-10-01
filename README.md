# Cyberpunk City Simulator

## Things to simulate:

- Citizens
  - Births, Deaths
  - Immigration
  - Attributes, Characteristics, Implants
  - Health, Mental Health
  - Relationships
  - Work
- Crime
- Traffic
- Power Generation, Usage
- Government, Elections
- Special Events

## Transportation System

- This will be the first system that needs to interact with systems/state outside of it.
- First idea is to model intent to travel, destination, etc on the citizen and then let the transportation system filter for those citizens.
- I'm worried that the Citizen interface is already kind of large and is going to get even bigger.
- Imagine even more systems that work on Citizens!
- The Citizen system returns a complex State already and can only return one State type.
- Do I have to go full ECS here? That could be fun!

## ECS Design

- ECS has two primary benefits:
  1. Performance if components are grouped to take advantage of CPU cache locality
  2. An architecture that allows for composition over inheritance and separates data from behaviour
- Entities are just identifiers; probably random bytes.
- Components are in most cases just units of data like structs/objects and aren't supposed to have any behaviour at all.
- Systems are ideally just functions that accept the world state and a list of entities with their components.
- Some implementations will only provide systems with entities that satisfy the components they require.
- Some implementations allow for dynamic component querying.
- Some implementations have aspects/archetypes which are sets of components that are commonly created together.
- Let's keep it simple for now and take the following progression:
  1. Systems are provided with all entities with all of their components.
  2. Systems are provided with entities that satisfy their required components.
  3. Benchmark and improve performance with aspects/archetypes and cache locality optimization.

We definitely need some querying ergonomics. The Array.prototype soup is intense.