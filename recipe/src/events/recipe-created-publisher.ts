import { Publisher, Subjects, RecipeCreatedEvent } from "@dongbei/utilities";

export class RecipeCreatedPublisher extends Publisher<RecipeCreatedEvent> {
  subject: Subjects.RecipeCreated = Subjects.RecipeCreated;
}
