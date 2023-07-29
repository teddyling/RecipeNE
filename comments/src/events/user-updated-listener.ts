import { Message } from "node-nats-streaming";
import { Subjects, Listener, UserUpdatedEvents } from "@dongbei/utilities";
import { User } from "../model/user";
import { queueGroupName } from "./queue-group-name";

export class UserUpdatedListener extends Listener<UserUpdatedEvents> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: { id: string; newUsername: string }, msg: Message) {
    const { id, newUsername } = data;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found!");
    }
    user.username = newUsername;
    await user.save();
    msg.ack();
  }
}
