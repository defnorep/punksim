import { System } from "../ecs";
import { EntityContainer } from "../ecs/entityContainer";
import { LocationComponent } from "../global";
import {
  CensusComponent,
  CitizenArchetype,
  CivicIdentityComponent,
  EpochComponent,
  Gender,
  GenderComponent,
  LifeformClassificationComponent,
  PhysicalComponent,
  Species,
} from "../population";

export class CensusStartupSystem extends System {
  update(_delta: number, _entities: EntityContainer): void {
    this.ecs.createSingleton(new CensusComponent(0, 0, 0, 0, 0, 0));
  }
}

export class CensusSystem extends System {
  update(_delta: number, entities: EntityContainer): void {
    const censusComponent = this.ecs.getSingleton(CensusComponent);
    const citizens = entities
      .allOf(
        CivicIdentityComponent,
        EpochComponent,
        LifeformClassificationComponent,
        GenderComponent,
      )
      .results()
      .map(
        ([_entity, components]): CitizenArchetype => [
          components.get(CivicIdentityComponent),
          components.get(EpochComponent),
          components.get(PhysicalComponent),
          components.get(LifeformClassificationComponent),
          components.get(GenderComponent),
          components.get(LocationComponent),
        ],
      );

    const census = citizens.reduce(
      (population, [_id, _epoch, _physical, lifeform, gender]) => {
        population.total++;

        switch (lifeform.species) {
          case Species.Human:
            population.human++;
            break;
          case Species.Android:
            population.android++;
            break;
        }

        switch (gender.gender) {
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
