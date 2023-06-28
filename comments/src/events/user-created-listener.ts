import { Message } from "node-nats-streaming";
import { Subjects, Listener, UserCreatedEvent } from "@dongbei/utilities";
import { User } from "../model/user";
import { queueGroupName } from "./queue-group-name";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; username: string; role: string },
    msg: Message
  ) {
    const { id, username } = data;
    const user = User.build({
      username,
      id,
    });
    await user.save();
    msg.ack();
  }
}
