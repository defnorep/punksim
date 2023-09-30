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
