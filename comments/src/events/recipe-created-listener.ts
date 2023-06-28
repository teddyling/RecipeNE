import { Message } from "node-nats-streaming";
import { Subjects, Listener, RecipeCreatedEvent } from "@dongbei/utilities";
import { Recipe } from "../model/recipe";
import { queueGroupName } from "./queue-group-name";

export class RecipeCreatedListener extends Listener<RecipeCreatedEvent> {
  subject: Subjects.RecipeCreated = Subjects.RecipeCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: { id: string; title: string }, msg: Message) {
    const { id, title } = data;
    const recipe = Recipe.build({
      id,
      title,
    });
    await recipe.save();
    msg.ack();
  }
}
