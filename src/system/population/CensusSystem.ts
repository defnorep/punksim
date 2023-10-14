import { Component, System } from "../../ecs";
import { EntityContainer } from "../../ecs/entityContainer";
import { CitizenComponent, Gender, Species } from "../population";

export class CensusStartupSystem extends System {
  update(delta: number, entities: EntityContainer): void {
    this.ecs.createSingleton(new CensusComponent(0, 0, 0, 0, 0, 0));
  }
}

export class CensusSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const censusComponent = this.ecs.getSingleton(CensusComponent);
    const citizens = entities
      .allOf(CitizenComponent)
      .results()
      .map(([_entity, components]) => components.get(CitizenComponent));

    const census = citizens.reduce(
      (population, citizen) => {
        population.total++;

        switch (citizen.species) {
          case Species.Human:
            population.human++;
            break;
          case Species.Android:
            population.android++;
            break;
        }

        switch (citizen.gender) {
          case Gender.Male:
            population.male++;
            break;
          case Gender.Female:
            population.female++;
            break;
          case Gender.None:
            population.noGender++;
            break;
        }

        return population;
      },
      { total: 0, human: 0, android: 0, male: 0, female: 0, noGender: 0 },
    );

    censusComponent.total = census.total;
    censusComponent.human = census.human;
    censusComponent.android = census.android;
    censusComponent.male = census.male;
    censusComponent.female = census.female;
    censusComponent.noGender = census.noGender;
  }
}

export class CensusComponent extends Component {
  constructor(
    public total: number,
    public human: number,
    public android: number,
    public male: number,
    public female: number,
    public noGender: number,
  ) {
    super();
  }
}
